import React, { useState, ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Leaf, Clock, CheckCircle2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Model, SubscribedModel, Tag, UpdateModelData } from "@/types/model";
import { useParams, useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import modelApi from "@/api/modelAPI";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/formatDate";
import { getCronDescription } from "@/lib/cronTransform";
// import EditModelModal from "./EditModelsModal";
// import DeleteModelModal from "./DeleteModelsModal";

const ModelOverviewCard = ({
  model,
  refetch,
  subscribedModels,
  onSubscribedModelsChange,
}: {
  model: Model;
  refetch: () => void;
  subscribedModels: SubscribedModel[];
  onSubscribedModelsChange: () => void;
}) => {
  const router = useRouter();
  const { userId, modelName } = useParams<{
    userId: string;
    modelName: string;
  }>();
  // const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const t = useTranslations("dashboard.models");

  const getTagValue = (key: string) => {
    return model.tags?.find((tag) => tag.key === key)?.value;
  };

  const isEnabled = getTagValue("enable") === "true";
  const plantType = getTagValue("plant");
  const schedule = getTagValue("schedule");
  // const handleEditConfirm = async (updatedModel: UpdateModelData) => {
  //   try {
  //     await modelApi.updateModelInfo(userId, updatedModel);
  //     toast({
  //       title: t("toast.updateSuccess"),
  //       description: t("toast.updateSuccess"),
  //       variant: "default",
  //     });
  //     setIsEditModalOpen(false);
  //     refetch();
  //   } catch (error) {
  //     console.error("Error updating model:", error);
  //     toast({
  //       title: t("toast.updateError"),
  //       description: t("toast.updateError"),
  //       variant: "destructive",
  //     });
  //   }
  // };

  // const handleDeleteConfirm = async () => {
  //   try {
  //     await modelApi.deleteModelInfo(userId, model.alt_name);
  //     toast({
  //       title: t("deleteModel.success"),
  //       description: t("deleteModel.success"),
  //       variant: "default",
  //     });
  //     setIsDeleteModalOpen(false);
  //     // Navigate back to scripts list or wherever appropriate
  //     router.push(`/dashboard/${userId}/models`);
  //   } catch (error) {
  //     console.error("Error deleting model:", error);
  //     toast({
  //       title: t("deleteModel.error"),
  //       description: t("deleteModel.error"),
  //       variant: "destructive",
  //     });
  //   }
  // };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t("modelDetails.title")}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <DetailItem label={t("modelDetails.name")} value={model.name} />
          <DetailItem
            label={t("modelDetails.description")}
            value={
              model?.description ?? (
                <div className="text-sm text-muted-foreground italic">
                  {t("modelDetails.noDescription")}
                </div>
              )
            }
          />
          <DetailItem
            label={t("modelDetails.created")}
            value={
              model?.creation_timestamp
                ? formatDate(model?.creation_timestamp)
                : ""
            }
          />
          <DetailItem
            label={t("modelDetails.lastUpdated")}
            value={
              model?.last_updated_timestamp
                ? formatDate(model?.last_updated_timestamp)
                : ""
            }
          />

          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-sm font-medium">
                {t("modelDetails.tags")}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {t("card.plant")}:
                  </span>
                  <Badge variant="secondary">
                    {plantType || t("card.noPlant")}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  {isEnabled ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm text-muted-foreground">
                    {t("card.status")}:
                  </span>
                  <Badge variant={isEnabled ? "default" : "destructive"}>
                    {isEnabled ? t("card.scheduled") : t("card.notScheduled")}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {t("card.schedule")}:
                  </span>
                  <Badge variant="secondary">
                    {schedule
                      ? getCronDescription(
                          schedule,
                          window.location.pathname.split("/")[1]
                        )
                      : t("card.noSchedule")}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* {typeof window !== "undefined" &&
            localStorage.getItem("userId") === userId && (
              <>
                <Separator />
                <div className="grid gap-2">
                  <h3 className="text-sm font-medium">
                    {t("modelDetails.actions")}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditModalOpen(true)}
                    >
                      {t("modelDetails.editModel")}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setIsDeleteModalOpen(true)}
                    >
                      {t("modelDetails.deleteModel")}
                    </Button>
                  </div>
                </div>
              </>
            )} */}
        </CardContent>
      </Card>

      {/* <EditModelModal
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
      /> */}
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
