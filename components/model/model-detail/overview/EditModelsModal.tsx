import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Model, SetModelTagData, DeleteModelTagData } from "@/types/model";
import { Badge } from "@/components/ui/badge";
import { Check, Pencil, Plus, Trash, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import modelApi from "@/api/modelAPI";
import { useTranslations } from "next-intl";

interface Tag {
  key: string;
  value: string;
}

type EditModelModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: any) => void;
  model: Model | null;
  title?: string;
};

const EditModelModal = ({
  open,
  onClose,
  onConfirm,
  model,
  title = "Edit Model",
}: EditModelModalProps) => {
  const t = useTranslations("dashboard.models");
  // Form Data
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    tags: [] as Tag[],
  });

  // Original tags for comparison
  const [originalTags, setOriginalTags] = useState<Tag[]>([]);

  // Original description for comparison
  const [originalDescription, setOriginalDescription] = useState<string>();

  // Tag management state
  const [tagKey, setTagKey] = useState("");
  const [tagValue, setTagValue] = useState("");
  const [isEditingTag, setIsEditingTag] = useState(false);
  const [editingTagIndex, setEditingTagIndex] = useState<number | null>(null);
  const [isTagProcessing, setIsTagProcessing] = useState(false);

  // Confirmation dialog for tag removal
  const [tagRemovalDialog, setTagRemovalDialog] = useState(false);
  const [tagToRemove, setTagToRemove] = useState<string | null>(null);

  useEffect(() => {
    if (model && open) {
      const modelTags = model.tags || [];
      setFormData({
        name: model.alt_name || "",
        description: model.description || "",
        tags: [...modelTags],
      });
      setOriginalDescription(model.description);
      setOriginalTags([...modelTags]);
    }
  }, [model, open]);

  const handleChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const resetTagInputs = () => {
    setTagKey("");
    setTagValue("");
    setIsEditingTag(false);
    setEditingTagIndex(null);
  };
  const handleTagKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTagKey(e.target.value);
  };
  const handleTagValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagValue(e.target.value);
  };

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();

    if (tagKey.trim() === "" || tagValue.trim() === "") {
      toast({
        title: t("editModel.missingInfo"),
        description: t("editModel.tagMissingInfo"),
        variant: "destructive",
      });
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast({
        title: t("editModel.missingInfo"),
        description: t("editModel.provideName"),
        variant: "destructive",
      });
      return;
    }

    try {
      setIsTagProcessing(true);

      // If we're editing an existing tag, first remove the old tag
      if (isEditingTag && editingTagIndex !== null) {
        const oldTag = formData.tags[editingTagIndex];

        // Only make the API call if the key has changed (if only value changed, we just set the new tag)
        if (oldTag.key !== tagKey.trim()) {
          const deleteData: DeleteModelTagData = {
            name: model?.alt_name || "",
            key: oldTag.key,
          };

          await modelApi.deleteModelTag(userId, deleteData);
        }
      } else {
        // Check for duplicate keys
        if (formData.tags.some((tag) => tag.key === tagKey.trim())) {
          toast({
            title: t("editModel.duplicateTag"),
            description: t("editModel.duplicateTagDesc"),
            variant: "destructive",
          });
          setIsTagProcessing(false);
          return;
        }
      }

      // Set the new tag
      const tagData: SetModelTagData = {
        name: model?.alt_name || "",
        key: tagKey.trim(),
        value: tagValue.trim(),
      };

      await modelApi.setModelTag(userId, tagData);

      // Update local state
      if (isEditingTag && editingTagIndex !== null) {
        const updatedTags = [...formData.tags];
        updatedTags[editingTagIndex] = {
          key: tagKey.trim(),
          value: tagValue.trim(),
        };

        setFormData((prev) => ({
          ...prev,
          tags: updatedTags,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, { key: tagKey.trim(), value: tagValue.trim() }],
        }));
      }

      toast({
        title: isEditingTag
          ? t("editModel.tagUpdated")
          : t("editModel.tagAdded"),
        description: t(
          isEditingTag
            ? "editModel.tagUpdateSuccess"
            : "editModel.tagAddSuccess",
          { key: tagKey.trim() }
        ),
      });

      resetTagInputs();
    } catch (error) {
      console.error("Error managing tag:", error);
      toast({
        title: t("editModel.tagOperationFailed"),
        description: t(
          isEditingTag ? "editModel.tagUpdateFailed" : "editModel.tagAddFailed"
        ),
        variant: "destructive",
      });
    } finally {
      setIsTagProcessing(false);
    }
  };

  const handleEditTag = (index: number) => {
    const tagToEdit = formData.tags[index];
    setTagKey(tagToEdit.key);
    setTagValue(tagToEdit.value);
    setIsEditingTag(true);
    setEditingTagIndex(index);
  };

  const confirmRemoveTag = (keyToRemove: string) => {
    setTagToRemove(keyToRemove);
    setTagRemovalDialog(true);
  };

  const handleRemoveTag = async () => {
    if (!tagToRemove || !model?.alt_name) {
      setTagRemovalDialog(false);
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast({
        title: "Authentication error",
        description: "You must be logged in to remove tags.",
        variant: "destructive",
      });
      setTagRemovalDialog(false);
      return;
    }

    try {
      setIsTagProcessing(true);

      const deleteData: DeleteModelTagData = {
        name: model?.alt_name || "",
        key: tagToRemove,
      };

      await modelApi.deleteModelTag(userId, deleteData);

      setFormData((prev) => ({
        ...prev,
        tags: prev.tags.filter((tag) => tag.key !== tagToRemove),
      }));

      toast({
        title: "Tag removed",
        description: `Tag ${tagToRemove} has been removed successfully.`,
      });
    } catch (error) {
      console.error("Error removing tag:", error);
      toast({
        title: "Tag removal failed",
        description: "Failed to remove tag. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTagProcessing(false);
      setTagRemovalDialog(false);
      setTagToRemove(null);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name) {
      toast({
        title: t("editModel.missingInfo"),
        description: t("editModel.provideName"),
        variant: "destructive",
      });
      return;
    }

    // Check if description has changed
    if (formData.description === originalDescription) {
      onClose(); // Close the modal if no changes
      return;
    }

    // Only proceed with update if there are changes
    const modelUpdateData = {
      name: formData.name,
      description: formData.description,
    };
    onConfirm(modelUpdateData);
  };
  console.log("isTagProcessing", isTagProcessing);
  console.log("isEditingTag", isEditingTag);
  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent
          aria-describedby={undefined}
          className="sm:max-w-[65%] max-h-[80vh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle>{t("editModel.title")}</DialogTitle>
          </DialogHeader>

          {/* Model Info */}
          <div className="grid gap-6 py-4">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="font-medium">
                  {t("editModel.modelName")}
                </Label>
                <Input
                  disabled={true}
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder={t("editModel.modelName")}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description" className="font-medium">
                  {t("editModel.description")}
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder={t("editModel.descriptionPlaceholder")}
                  rows={4}
                />
              </div>

              {/* Tags Section */}
              <div className="grid gap-2">
                <Label className="font-medium">{t("editModel.tags")}</Label>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 flex-1">
                    <Label htmlFor="tagKey" className="text-s">
                      {t("editModel.tagKey")}
                    </Label>
                    <Input
                      id="tagKey"
                      value={tagKey}
                      placeholder={t("editModel.tagKeyPlaceholder")}
                      onChange={handleTagKeyChange}
                      disabled={isEditingTag}
                    />
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <Label htmlFor="tagValue" className="text-s">
                      {t("editModel.tagValue")}
                    </Label>
                    <Input
                      id="tagValue"
                      value={tagValue}
                      onChange={handleTagValueChange}
                      placeholder={t("editModel.tagValuePlaceholder")}
                      disabled={isTagProcessing}
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    {isEditingTag && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mb-0.5"
                        onClick={resetTagInputs}
                        disabled={isTagProcessing}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                    <div>
                      <Button
                        type="button"
                        onClick={handleAddTag}
                        size="sm"
                        className="mb-0.5"
                        disabled={isTagProcessing}
                      >
                        {isEditingTag ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, index) => (
                    <Badge
                      key={tag.key + index}
                      variant="secondary"
                      className="gap-1"
                    >
                      <span className="font-medium">{tag.key}:</span>{" "}
                      {tag.value}
                      <div className="flex items-center ml-1">
                        <button
                          type="button"
                          onClick={() => handleEditTag(index)}
                          className="hover:text-blue-500 mr-1"
                          disabled={isTagProcessing}
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => confirmRemoveTag(tag.key)}
                          className="hover:text-destructive"
                          disabled={isTagProcessing}
                        >
                          <Trash className="h-3 w-3" />
                        </button>
                      </div>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t("editModel.cancel")}
            </Button>
            <Button type="submit" onClick={handleSubmit}>
              {t("editModel.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tag Removal Confirmation Dialog */}
      <AlertDialog open={tagRemovalDialog} onOpenChange={setTagRemovalDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Tag</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this tag? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setTagRemovalDialog(false)}
              disabled={isTagProcessing}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveTag}
              disabled={isTagProcessing}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EditModelModal;
