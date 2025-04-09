"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { Check, Pencil, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { NewModelData } from "@/types/model";
import modelApi from "@/api/modelAPI";

interface Tag {
  key: string;
  value: string;
}

interface NewModelDialogProps {
  onModelCreated: () => void;
}

const NewModelDialog = ({ onModelCreated }: NewModelDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [newModel, setNewModel] = useState<NewModelData>({
    name: "",
    description: "",
    tags: [],
  });
  const [tagKey, setTagKey] = useState("");
  const [tagValue, setTagValue] = useState("");
  const [isEditingTag, setIsEditingTag] = useState(false);
  const [editingTagIndex, setEditingTagIndex] = useState<number | null>(null);

  console.log("newModel", newModel);
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setOpen(true);
    } else {
      handleCloseDialog();
    }
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setNewModel({
      name: "",
      tags: [],
      description: "",
    });
    resetTagInputs();
  };

  const resetTagInputs = () => {
    setTagKey("");
    setTagValue("");
    setIsEditingTag(false);
    setEditingTagIndex(null);
  };

  const handleModelChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setNewModel((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTagKey(e.target.value);
  };

  const handleTagValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTagValue(e.target.value);
  };

  const handleAddTag = (e: FormEvent) => {
    e.preventDefault();

    if (tagKey.trim() === "" || tagValue.trim() === "") {
      toast({
        title: "Missing information",
        description: "Please provide both key and value for the tag.",
        variant: "destructive",
      });
      return;
    }

    if (isEditingTag && editingTagIndex !== null) {
      // Update existing tag
      const updatedTags = [...newModel.tags];
      updatedTags[editingTagIndex] = {
        key: tagKey.trim(),
        value: tagValue.trim(),
      };

      setNewModel((prev) => ({
        ...prev,
        tags: updatedTags,
      }));
    } else {
      // Check for duplicate keys
      if (newModel.tags.some((tag) => tag.key === tagKey.trim())) {
        toast({
          title: "Duplicate tag",
          description: "A tag with this key already exists.",
          variant: "destructive",
        });
        return;
      }

      // Add new tag
      setNewModel((prev) => ({
        ...prev,
        tags: [...prev.tags, { key: tagKey.trim(), value: tagValue.trim() }],
      }));
    }

    resetTagInputs();
  };

  const handleEditTag = (index: number) => {
    const tagToEdit = newModel.tags[index];
    setTagKey(tagToEdit.key);
    setTagValue(tagToEdit.value);
    setIsEditingTag(true);
    setEditingTagIndex(index);
  };

  const handleRemoveTag = (keyToRemove: string) => {
    setNewModel((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag.key !== keyToRemove),
    }));
  };

  const handleCreateModel = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    if (!newModel.name.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a name for your model.",
        variant: "destructive",
      });
      return;
    }
    const userId =
      typeof window !== "undefined" ? localStorage.getItem("userId") : null;

    if (!userId) {
      toast({
        title: "Authentication error",
        description: "You must be logged in to create a script.",
        variant: "destructive",
      });
      return;
    }

    try {
      const modelId = await modelApi.createModel(userId, newModel);

      if (onModelCreated) {
        onModelCreated();
      }

      toast({
        title: "Model created",
        description: `Model "${newModel.name}" has been created successfully.`,
      });

      handleCloseDialog();
    } catch (error) {
      console.error("Error creating model:", error);
      toast({
        title: "Creation failed",
        description: "Failed to create model. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Model
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Model</DialogTitle>
          <DialogDescription>
            Add a new model to your collection.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateModel}>
          <div className="grid gap-6 py-4">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={newModel.name}
                  onChange={handleModelChange}
                  placeholder="Enter model name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={newModel.description}
                  onChange={handleModelChange}
                  placeholder="Enter model description (optional)"
                />
              </div>
              <div className="grid gap-2">
                <Label>Tags</Label>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 flex-1">
                    <Label htmlFor="tagKey" className="text-s">
                      Key
                    </Label>
                    <Input
                      id="tagKey"
                      value={tagKey}
                      onChange={handleTagKeyChange}
                      placeholder="Enter tag key"
                    />
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <Label htmlFor="tagValue" className="text-s">
                      Value
                    </Label>
                    <Input
                      id="tagValue"
                      value={tagValue}
                      onChange={handleTagValueChange}
                      placeholder="Enter tag value"
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
                  {newModel.tags.map((tag, index) => (
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
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag.key)}
                          className="hover:text-destructive"
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
            <Button type="button" variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button type="submit">Create Model</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewModelDialog;
