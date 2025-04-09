"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useTheme } from "next-themes";
import { Plus } from "lucide-react";
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

interface NewModelDialogProps {
  onModelCreated?: (model: NewModelData) => void;
}

const NewModelDialog = ({ onModelCreated }: NewModelDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [newModel, setNewModel] = useState<NewModelData>({
    name: "",
    description: "",
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");

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
      description: "",
      tags: [],
    });
    setTagInput("");
  };

  const handleModelChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setNewModel((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      if (!newModel.tags.some((tag) => tag.key === tagInput.trim())) {
        setNewModel((prev) => ({
          ...prev,
          tags: [
            ...prev.tags,
            { key: tagInput.trim(), value: tagInput.trim() },
          ],
        }));
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewModel((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag.key !== tagToRemove),
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

    try {
      if (onModelCreated) {
        onModelCreated(newModel);
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
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyDown={handleAddTag}
                  placeholder="Press Enter to add a tag"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {newModel.tags.map((tag) => (
                    <Badge key={tag.key} variant="secondary">
                      {tag.value}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag.key)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
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
