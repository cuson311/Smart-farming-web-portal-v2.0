import Link from "next/link";
import {
  CalendarCheck2,
  CalendarX2,
  Database,
  Leaf,
  Clock,
  MapPin,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RegisteredModel, SubscribedModel } from "@/types/model";
import { useParams } from "next/navigation";
import { formatDate } from "@/lib/formatDate";
import { Badge } from "@/components/ui/badge";
import { getCronDescription } from "@/lib/cronTransform";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import modelApi from "@/api/modelAPI";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { vietnamProvinces } from "@/lib/constant";

interface ModelCardProp {
  model: RegisteredModel;
  subscribedModels: SubscribedModel[];
  onSubscribe: (modelName: string, location: string) => Promise<void>;
  onUnsubscribe: (modelName: string) => Promise<void>;
}

const ModelCard = ({
  model,
  subscribedModels,
  onSubscribe,
  onUnsubscribe,
}: ModelCardProp) => {
  const { userId } = useParams();
  const t = useTranslations("dashboard.models.card");
  const { toast } = useToast();
  const [isSubscribeDialogOpen, setIsSubscribeDialogOpen] = useState(false);
  const [isUnsubscribeDialogOpen, setIsUnsubscribeDialogOpen] = useState(false);
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [locationPopoverOpen, setLocationPopoverOpen] = useState(false);
  const [locationSearchTerm, setLocationSearchTerm] = useState("");

  const getTagValue = (key: string) => {
    const tag = model.tags?.find((tag) => tag.key === key);
    return tag?.value;
  };

  const isEnabled = getTagValue("enable") === "true";
  const plantType = getTagValue("plant");
  const schedule = getTagValue("schedule");

  const isSubscribed = subscribedModels.some(
    (subModel) => subModel.model_name === model.name
  );

  // Filter provinces based on search term
  const filteredProvinces = locationSearchTerm
    ? vietnamProvinces.filter((province) =>
        province.toLowerCase().includes(locationSearchTerm.toLowerCase())
      )
    : vietnamProvinces;

  // Handle location selection
  const handleLocationSelect = (selectedLocation: string) => {
    setLocation(selectedLocation);
    setLocationPopoverOpen(false);
  };

  const handleSubscribe = async () => {
    if (!location.trim()) {
      toast({
        title: t("toast.missingLocation"),
        description: t("toast.missingLocationDesc"),
        variant: "destructive",
      });
      return;
    }
    // setIsLoading(true);
    try {
      await onSubscribe(model.name, location);
      setIsSubscribeDialogOpen(false);
      setLocation("");
      toast({
        title: t("toast.subscribeSuccess"),
        description: t("toast.subscribeSuccessDesc"),
      });
    } catch (error) {
      toast({
        title: t("toast.subscribeError"),
        description: t("toast.subscribeErrorDesc"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    setIsUnsubscribeDialogOpen(false);
    // setIsLoading(true);
    try {
      await onUnsubscribe(model.name);
      toast({
        title: t("toast.unsubscribeSuccess"),
        description: t("toast.unsubscribeSuccessDesc"),
      });
    } catch (error) {
      toast({
        title: t("toast.unsubscribeError"),
        description: t("toast.unsubscribeErrorDesc"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card key={model.name} className="flex flex-col h-full">
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 w-full">
              <Database className="h-5 w-5 flex-shrink-0" />
              <span className="line-clamp-1">{model.name}</span>
            </CardTitle>
            <CardDescription className="line-clamp-3">
              {model.description}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-2 py-0 flex-grow">
          {/* Metadata container with fixed height */}
          <div className="min-h-16">
            {/* Plant type badges */}
            <div className="flex flex-wrap gap-1 mb-2 min-h-6">
              {plantType ? (
                <>
                  <div className="flex items-center mr-1">
                    <Leaf className="h-3 w-3 text-gray-400 mr-1" />
                    <span className="text-xs text-muted-foreground">
                      {t("plant")}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs py-0">
                    {plantType}
                  </Badge>
                </>
              ) : (
                <div className="flex items-center mr-1">
                  <Leaf className="h-3 w-3 text-gray-400 dark:text-gray-500 mr-1" />
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {t("noPlant")}
                  </span>
                </div>
              )}
            </div>

            {/* Status badge */}
            <div className="flex flex-wrap gap-1 mb-2 min-h-6">
              <div className="flex items-center mr-1">
                <CalendarCheck2 className="h-3 w-3 text-gray-400 mr-1" />
                <span className="text-xs text-muted-foreground">
                  {t("status")}
                </span>
              </div>
              <Badge
                variant={isEnabled ? "default" : "secondary"}
                className="text-xs py-0"
              >
                {isEnabled ? t("scheduled") : t("notScheduled")}
              </Badge>
            </div>

            {/* Schedule badges */}
            <div className="flex flex-wrap gap-1 mb-2 min-h-6">
              {schedule ? (
                <>
                  <div className="flex items-center mr-1">
                    <Clock className="h-3 w-3 text-gray-400 mr-1" />
                    <span className="text-xs text-muted-foreground">
                      {t("schedule")}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs py-0">
                    {getCronDescription(
                      schedule,
                      window.location.pathname.split("/")[1]
                    )}
                  </Badge>
                </>
              ) : (
                <div className="flex items-center mr-1">
                  <Clock className="h-3 w-3 text-gray-400 dark:text-gray-500 mr-1" />
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {t("noSchedule")}
                  </span>
                </div>
              )}
            </div>

            {/* Subscribed Location */}
            {isSubscribed && (
              <div className="flex flex-wrap gap-1 mb-2 min-h-6">
                <div className="flex items-center mr-1">
                  <MapPin className="h-3 w-3 text-gray-400 mr-1" />
                  <span className="text-xs text-muted-foreground">
                    {t("subscribedLocation")}
                  </span>
                </div>
                <Badge variant="outline" className="text-xs py-0">
                  {subscribedModels.find(
                    (subModel) => subModel.model_name === model.name
                  )?.location || "N/A"}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
            {model.last_updated_timestamp ? (
              <span>
                {t("updatedAt")} {formatDate(model.last_updated_timestamp)}
              </span>
            ) : null}
          </div>
          <div className="flex gap-2">
            {isSubscribed ? (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setIsUnsubscribeDialogOpen(true)}
                disabled={isLoading}
              >
                {t("unsubscribe")}
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => setIsSubscribeDialogOpen(true)}
                disabled={isLoading}
              >
                {t("subscribe")}
              </Button>
            )}
            <Button variant="ghost" size="sm" asChild>
              <Link
                href={`/dashboard/${userId}/models/${model.name}/?tab=versions`}
              >
                {t("view")}
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Dialog
        open={isSubscribeDialogOpen}
        onOpenChange={setIsSubscribeDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("subscribeDialog.title")}</DialogTitle>
            <DialogDescription>
              {t("subscribeDialog.description")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-nowrap">
                {t("subscribeDialog.locationLabel")}
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
                    {location || t("selectProvince")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder={t("searchProvince")}
                      value={locationSearchTerm}
                      onValueChange={setLocationSearchTerm}
                    />
                    <CommandEmpty>{t("noProvinceFound")}</CommandEmpty>
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
              disabled={isLoading}
            >
              {t("subscribeDialog.cancel")}
            </Button>
            <Button onClick={handleSubscribe} disabled={isLoading}>
              {t("subscribeDialog.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isUnsubscribeDialogOpen}
        onOpenChange={setIsUnsubscribeDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("unsubscribeDialog.title")}</DialogTitle>
            <DialogDescription>
              {t("unsubscribeDialog.description")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsUnsubscribeDialogOpen(false)}
              disabled={isLoading}
            >
              {t("unsubscribeDialog.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleUnsubscribe}
              disabled={isLoading}
            >
              {t("unsubscribeDialog.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ModelCard;
