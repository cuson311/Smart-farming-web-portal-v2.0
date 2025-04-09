import React, { useState, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Model, Tag, UpdateModelData } from "@/types/model";
import EditScriptModal from "./EditModelsModal";
import DeleteScriptModal from "./DeleteModelsModal";
import { useParams, useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import modelApi from "@/api/modelAPI";
import { Badge } from "@/components/ui/badge";

const ModelOverviewCard = ({
  model,
  refetch,
}: {
  model: Model | null;
  refetch?: () => void;
}) => {
  const router = useRouter();
  const { userId, scriptId } = useParams<{
    userId: string;
    scriptId: string;
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
      refetch?.();
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
      await modelApi.deleteModelInfo(userId, model?.name);
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
            label="Description"
            value={
              model?.description !== ""
                ? model?.description
                : "There is no description"
            }
          />
          <DetailItem label="Created" value={model?.creation_timestamp} />
          <DetailItem
            label="Last Updated"
            value={model?.last_updated_timestamp}
          />

          <DetailItem
            label="Tags"
            value={
              model?.latest_versions?.[0]?.tags &&
              model?.latest_versions?.[0]?.tags.map((tag: Tag) => (
                <Badge variant="outline" key={tag.key}>
                  {tag.key} : {tag.value}
                </Badge>
              ))
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

      <EditScriptModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onConfirm={handleEditConfirm}
        model={model}
        title="Edit Model"
      />

      <DeleteScriptModal
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
      <p className="text-sm text-muted-foreground">{value}</p>
    </div>
  );
}

export default ModelOverviewCard;
