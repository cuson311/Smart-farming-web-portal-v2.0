import React, { useState, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Model, Tag, UpdateModelData } from "@/types/model";
import { useParams, useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import modelApi from "@/api/modelAPI";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/formatDate";
import EditModelModal from "./EditModelsModal";
import DeleteModelModal from "./DeleteModelsModal";

const ModelOverviewCard = ({
  model,
  refetch,
}: {
  model: Model;
  refetch: () => void;
}) => {
  const router = useRouter();
  const { userId, modelName } = useParams<{
    userId: string;
    modelName: string;
  }>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleEditConfirm = async (updatedModel: UpdateModelData) => {
    try {
      await modelApi.updateModelInfo(userId, updatedModel);
      toast({
        title: "Successful!",
        description: "Update model info successfully",
        variant: "default",
      });
      setIsEditModalOpen(false);
      refetch();
    } catch (error) {
      console.error("Error updating model:", error);
      toast({
        title: "Error",
        description: "Failed to update model",
        variant: "destructive",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await modelApi.deleteModelInfo(userId, model.alt_name);
      toast({
        title: "Successful!",
        description: "Model deleted successfully",
        variant: "default",
      });
      setIsDeleteModalOpen(false);
      // Navigate back to scripts list or wherever appropriate
      router.push(`/dashboard/${userId}/models`);
    } catch (error) {
      console.error("Error deleting model:", error);
      toast({
        title: "Error",
        description: "Failed to delete model",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Model Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <DetailItem
            label="Name"
            value={model?.alt_name !== "" ? model.alt_name : model.name}
          />
          <DetailItem
            label="Description"
            value={
              model?.description ?? (
                <div className="text-sm text-muted-foreground italic">
                  No description.
                </div>
              )
            }
          />
          <DetailItem
            label="Created"
            value={
              model?.creation_timestamp
                ? formatDate(model?.creation_timestamp)
                : ""
            }
          />
          <DetailItem
            label="Last Updated"
            value={
              model?.last_updated_timestamp
                ? formatDate(model?.last_updated_timestamp)
                : ""
            }
          />

          <DetailItem
            label="Tags"
            value={
              model?.tags ? (
                model.tags.map((tag: Tag) => (
                  <Badge variant="default" className="mr-2" key={tag.key}>
                    {tag.key} : {tag.value}
                  </Badge>
                ))
              ) : (
                <div className="text-sm text-muted-foreground italic">
                  No tags found.
                </div>
              )
            }
          />

          {typeof window !== "undefined" &&
            localStorage.getItem("userId") === userId && (
              <>
                <Separator />
                <div className="grid gap-2">
                  <h3 className="text-sm font-medium">Actions</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditModalOpen(true)}
                    >
                      Edit Model
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setIsDeleteModalOpen(true)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </>
            )}
        </CardContent>
      </Card>

      <EditModelModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onConfirm={handleEditConfirm}
        model={model}
        title="Edit Model"
      />

      <DeleteModelModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        modelName={model?.name || "this model"}
      />
    </>
  );
};

interface DetailItemProps {
  label: string;
  value: string | undefined | ReactNode;
}

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div>
      <h3 className="mb-1 text-sm font-medium">{label}</h3>
      <div className="text-sm text-muted-foreground">{value}</div>
    </div>
  );
}

export default ModelOverviewCard;
