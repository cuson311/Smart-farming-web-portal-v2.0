import React, { useState, ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Leaf, Clock, CheckCircle2, XCircle, MapPin, X } from "lucide-react";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { vietnamProvinces } from "@/lib/constant";
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
  const [isSubscribeDialogOpen, setIsSubscribeDialogOpen] = useState(false);
  const [location, setLocation] = useState("");
  const [locationPopoverOpen, setLocationPopoverOpen] = useState(false);
  const [locationSearchTerm, setLocationSearchTerm] = useState("");
  // const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const t = useTranslations("dashboard.models");

  const filteredProvinces = vietnamProvinces.filter((province: string) =>
    province.toLowerCase().includes(locationSearchTerm.toLowerCase())
  );

  const handleLocationSelect = (province: string) => {
    setLocation(province);
    setLocationPopoverOpen(false);
  };

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

  // Find if the model is subscribed
  const subscribedModel = subscribedModels.find(
    (sub) => sub.model_name === model.name
  );

  const handleSubscribe = async () => {
    if (!location.trim()) {
      toast({
        title: t("toast.missingLocation"),
        description: t("toast.missingLocationDesc"),
        variant: "destructive",
      });
      return;
    }
    try {
      await modelApi.subscribeModel({
        user_id: userId,
        model_name: model.name,
        location: location,
      });
      toast({
        title: t("toast.subscribeSuccess"),
        description: t("toast.subscribeSuccessDesc"),
        variant: "default",
      });
      setIsSubscribeDialogOpen(false);
      setLocation("");
      onSubscribedModelsChange();
    } catch (error) {
      console.error("Error subscribing to model:", error);
      toast({
        title: t("toast.subscribeError"),
        description: t("toast.subscribeErrorDesc"),
        variant: "destructive",
      });
    }
  };

  const handleUnsubscribe = async () => {
    try {
      await modelApi.unsubscribeModel({
        user_id: userId,
        model_name: model.name,
      });
      toast({
        title: t("toast.unsubscribeSuccess"),
        description: t("toast.unsubscribeSuccessDesc"),
        variant: "default",
      });
      onSubscribedModelsChange();
    } catch (error) {
      console.error("Error unsubscribing from model:", error);
      toast({
        title: t("toast.unsubscribeError"),
        description: t("toast.unsubscribeErrorDesc"),
        variant: "destructive",
      });
    }
  };

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
                {subscribedModel && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {t("card.location")}:
                    </span>
                    <Badge variant="secondary">
                      {subscribedModel.location}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />
          <div className="grid gap-2">
            <div className="flex gap-2">
              {subscribedModel ? (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleUnsubscribe}
                >
                  {t("modelDetails.unsubscribe")}
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setIsSubscribeDialogOpen(true)}
                >
                  {t("modelDetails.subscribe")}
                </Button>
              )}
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

      <Dialog
        open={isSubscribeDialogOpen}
        onOpenChange={setIsSubscribeDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("modelDetails.subscribeTitle")}</DialogTitle>
            <DialogDescription>
              {t("modelDetails.subscribeDescription")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-nowrap">
                {t("modelDetails.location")}
              </label>
              <Popover
                open={locationPopoverOpen}
                onOpenChange={setLocationPopoverOpen}
                modal={true}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    role="combobox"
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    {location || t("card.selectProvince")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder={t("card.searchProvince")}
                      value={locationSearchTerm}
                      onValueChange={setLocationSearchTerm}
                    />
                    <CommandEmpty>{t("card.noProvinceFound")}</CommandEmpty>
                    <CommandGroup>
                      <ScrollArea className="h-64">
                        {filteredProvinces.map((province) => (
                          <CommandItem
                            key={province}
                            value={province}
                            onSelect={() => handleLocationSelect(province)}
                          >
                            <div className="flex items-center gap-2 w-full">
                              <div
                                className={`h-4 w-4 border rounded-sm flex items-center justify-center ${
                                  location === province
                                    ? "bg-primary border-primary"
                                    : "border-input"
                                }`}
                              >
                                {location === province && (
                                  <X className="h-3 w-3 text-primary-foreground" />
                                )}
                              </div>
                              <span>{province}</span>
                            </div>
                          </CommandItem>
                        ))}
                      </ScrollArea>
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsSubscribeDialogOpen(false)}
            >
              {t("modelDetails.cancel")}
            </Button>
            <Button onClick={handleSubscribe}>
              {t("modelDetails.confirmSubscribe")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
