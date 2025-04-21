import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteModelModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  modelName?: string;
}

const DeleteModelModal = ({
  open,
  onClose,
  onConfirm,
  modelName = "this model",
}: DeleteModelModalProps) => {
  const t = useTranslations("dashboard.models");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("deleteModel.title")}</DialogTitle>
          <DialogDescription>
            {t("deleteModel.description", { modelName })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            {t("deleteModel.cancel")}
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            {t("deleteModel.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModelModal;
