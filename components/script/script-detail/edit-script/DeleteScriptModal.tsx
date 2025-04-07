import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteScriptModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  scriptName?: string;
}

const DeleteScriptModal = ({
  open,
  onClose,
  onConfirm,
  scriptName = "this script",
}: DeleteScriptModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Script</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{scriptName}</strong>? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteScriptModal;
