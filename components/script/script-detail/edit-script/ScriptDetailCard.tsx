import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Script } from "@/types/script";
import EditScriptModal from "./EditScriptModal";
import DeleteScriptModal from "./DeleteScriptModal";
import scriptApi from "@/api/scriptAPI";
import { useParams, useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useFetchProfile } from "@/hooks/useFetchUser";
import { formatDate } from "@/lib/formatDate";
import { Badge } from "@/components/ui/badge";
import { Star, Trash2, MapPin, Leaf, X } from "lucide-react";
import { useFetchUserScriptRate } from "@/hooks/useFetchScript";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

// New component for showing all items in a modal
const ItemsListModal = ({
  open,
  onClose,
  title,
  items,
  icon,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  items: string[];
  icon: React.ReactNode;
}) => {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {icon}
            <span>{title}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-wrap gap-2 mt-4">
          {items.map((item, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {item}
            </Badge>
          ))}
        </div>
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

const ScriptDetailsCard = ({
  script,
  refetch,
}: {
  script: Script | null;
  refetch: () => void;
}) => {
  const t = useTranslations("dashboard.scripts.detail");
  const router = useRouter();
  const { userId, scriptId } = useParams<{
    userId: string;
    scriptId: string;
  }>();
  const [authUserId, setAuthUserId] = useState<string>("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isCurrentUserOwner, setIsCurrentUserOwner] = useState(false);
  const [localUserRating, setLocalUserRating] = useState<number>(0);

  // New state for modals
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isPlantTypeModalOpen, setIsPlantTypeModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userId = localStorage.getItem("userId") || "";
      setAuthUserId(userId);
    }
  }, []);

  // Fetch the owner's profile using the existing hook
  const {
    data: ownerProfile,
    loading: isProfileLoading,
    refetch: refetchOwnerProfile,
  } = useFetchProfile(userId);

  const {
    data: userRating,
    loading: isUserRatingLoading,
    refetch: refetchUserRate,
  } = useFetchUserScriptRate(authUserId, scriptId);

  // Update local user rating when API data changes
  useEffect(() => {
    if (!isUserRatingLoading && userRating) {
      // Check if userRating exists and has a rating
      if (userRating.length > 0 && userRating[0]?.rate) {
        setLocalUserRating(userRating[0].rate);
      } else {
        // Reset to 0 if no rating exists
        setLocalUserRating(0);
      }
    }
  }, [userRating, isUserRatingLoading]);

  // Check if current user is the owner
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsCurrentUserOwner(localStorage.getItem("userId") === userId);
    }
  }, [userId]);

  const handleEditConfirm = async (updatedScript: any) => {
    try {
      await scriptApi.updateScriptInfo(userId, scriptId, updatedScript);
      console.log("Script updated:", updatedScript);
      toast({
        title: t("toast.updateSuccess"),
        description: t("toast.updateSuccessDescription"),
        variant: "default",
      });
      setIsEditModalOpen(false);
      refetch();
    } catch (error) {
      console.error("Error updating script:", error);
      toast({
        title: t("toast.updateError"),
        description: t("toast.updateErrorDescription"),
        variant: "destructive",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await scriptApi.deleteScriptInfo(userId, scriptId);
      await scriptApi.deleteScriptFiles(userId, scriptId);
      toast({
        title: t("toast.deleteSuccess"),
        description: t("toast.deleteSuccessDescription"),
        variant: "default",
      });
      setIsDeleteModalOpen(false);
      // Navigate back to scripts list or wherever appropriate
      router.push(`/dashboard/${userId}/scripts?tab=all`);
    } catch (error) {
      console.error("Error deleting script:", error);
      toast({
        title: t("toast.deleteError"),
        description: t("toast.deleteErrorDescription"),
        variant: "destructive",
      });
    }
  };

  // Function to update rating
  const handleRatingChange = async (newRating: number) => {
    try {
      if (newRating !== localUserRating) {
        setLocalUserRating(newRating);
        await scriptApi.createScriptRate(userId, scriptId, {
          rate: newRating,
        });

        toast({
          title: t("toast.ratingSuccess"),
          description: t("toast.ratingSuccessDescription"),
          variant: "default",
        });

        refetch();
        refetchUserRate();
      }
    } catch (error) {
      if (userRating && userRating.length > 0) {
        setLocalUserRating(userRating[0]?.rate || 0);
      } else {
        setLocalUserRating(0);
      }

      console.error("Error updating rating:", error);
      toast({
        title: t("toast.ratingError"),
        description: t("toast.ratingErrorDescription"),
        variant: "destructive",
      });
    }
  };

  // Function to delete user's rating
  const handleDeleteRating = async () => {
    try {
      setLocalUserRating(0);
      await scriptApi.deleteScriptRate(authUserId, scriptId);

      toast({
        title: t("toast.ratingDeleteSuccess"),
        description: t("toast.ratingDeleteSuccessDescription"),
        variant: "default",
      });

      refetch();
    } catch (error) {
      if (userRating && userRating.length > 0) {
        setLocalUserRating(userRating[0]?.rate || 0);
      }

      console.error("Error deleting rating:", error);
      toast({
        title: t("toast.ratingDeleteError"),
        description: t("toast.ratingDeleteErrorDescription"),
        variant: "destructive",
      });
    }
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t("scriptDetails.title")}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <h3 className="mb-1 text-sm font-medium">
              {t("scriptDetails.owner")}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              {isProfileLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-muted animate-pulse"></div>
                  <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                </div>
              ) : (
                <>
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={ownerProfile?.profile_image}
                      alt={ownerProfile?.username || "User"}
                    />
                    <AvatarFallback>
                      {getInitials(ownerProfile?.username || "User")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">
                    {ownerProfile?.username || "Unknown User"}
                  </span>
                </>
              )}
            </div>
          </div>

          <DetailItem
            label={t("scriptDetails.description")}
            value={
              script?.description !== ""
                ? script?.description
                : t("scriptDetails.noDescription")
            }
          />

          <div>
            <h3 className="mb-2 text-sm font-medium">
              {t("scriptDetails.location")}
            </h3>
            <div className="flex flex-wrap gap-1">
              {script?.location && script.location.length > 0 ? (
                <>
                  {script.location.slice(0, 3).map((loc, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {loc}
                    </Badge>
                  ))}
                  {script.location.length > 3 && (
                    <Badge
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => setIsLocationModalOpen(true)}
                    >
                      +{script.location.length - 3} more
                    </Badge>
                  )}
                </>
              ) : (
                <span className="text-sm text-muted-foreground">
                  {t("scriptDetails.noLocations")}
                </span>
              )}
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-medium">
              {t("scriptDetails.plantType")}
            </h3>
            <div className="flex flex-wrap gap-1">
              {script?.plant_type && script.plant_type.length > 0 ? (
                <>
                  {script.plant_type.slice(0, 3).map((type, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {type}
                    </Badge>
                  ))}
                  {script.plant_type.length > 3 && (
                    <Badge
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => setIsPlantTypeModalOpen(true)}
                    >
                      +{script.plant_type.length - 3} more
                    </Badge>
                  )}
                </>
              ) : (
                <span className="text-sm text-muted-foreground">
                  {t("scriptDetails.noPlants")}
                </span>
              )}
            </div>
          </div>

          <div>
            <h3 className="mb-1 text-sm font-medium">
              {t("scriptDetails.privacy")}
            </h3>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={"outline"}
                className={`text-nowrap ${
                  script?.privacy === "private"
                    ? "text-amber-500 dark:text-amber-400"
                    : "text-primary"
                }`}
              >
                {script?.privacy && script.privacy === "private"
                  ? t("scriptDetails.private")
                  : t("scriptDetails.public")}
              </Badge>
            </div>
          </div>

          <div>
            <h3 className="mb-1 text-sm font-medium">
              {t("scriptDetails.averageRating")}
            </h3>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const value = script?.rating.avg ?? 0;
                  const isFullStar = star <= Math.floor(value);
                  const isPartialStar =
                    !isFullStar && star === Math.ceil(value) && value % 1 !== 0;

                  return (
                    <div key={star} className="relative w-4 h-4">
                      <Star
                        size={20}
                        className="absolute text-gray-300 dark:text-gray-600"
                      />

                      {(isFullStar || isPartialStar) && (
                        <div
                          className="absolute inset-0 overflow-hidden"
                          style={{
                            width: isFullStar
                              ? "100%"
                              : `${(value % 1) * 100}%`,
                          }}
                        >
                          <Star
                            size={20}
                            className="fill-yellow-400 text-yellow-400"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <span className="text-sm text-muted-foreground">
                {script?.rating.avg ? script.rating.avg.toFixed(1) : "0"} (
                {script?.rating.count || 0} {t("scriptDetails.rating")})
              </span>
            </div>
          </div>

          <div>
            <h3 className="mb-1 text-sm font-medium">
              {t("scriptDetails.yourRating")}
            </h3>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={20}
                    className={`cursor-pointer ${
                      star <= (hoveredRating || localUserRating || 0)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                    onClick={() => handleRatingChange(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {localUserRating > 0
                  ? t("scriptDetails.youRated", { value: localUserRating })
                  : t("scriptDetails.rateScript")}
              </span>

              {localUserRating > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1 text-muted-foreground hover:text-destructive"
                  onClick={handleDeleteRating}
                  title={t("scriptDetails.deleteRating")}
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </div>
          </div>

          <DetailItem
            label={t("scriptDetails.created")}
            value={formatDate(script?.createdAt ? script?.createdAt : "")}
          />
          <DetailItem
            label={t("scriptDetails.lastUpdated")}
            value={formatDate(script?.updatedAt ? script?.updatedAt : "")}
          />

          {isCurrentUserOwner && (
            <>
              <Separator />
              <div className="grid gap-2">
                <h3 className="text-sm font-medium">
                  {t("scriptDetails.actions")}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    {t("scriptDetails.editScript")}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setIsDeleteModalOpen(true)}
                  >
                    {t("delete")}
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {script?.location && (
        <ItemsListModal
          open={isLocationModalOpen}
          onClose={() => setIsLocationModalOpen(false)}
          title="All Locations"
          items={script.location}
          icon={<MapPin className="h-4 w-4" />}
        />
      )}

      {script?.plant_type && (
        <ItemsListModal
          open={isPlantTypeModalOpen}
          onClose={() => setIsPlantTypeModalOpen(false)}
          title="All Plant Types"
          items={script.plant_type}
          icon={<Leaf className="h-4 w-4" />}
        />
      )}

      <EditScriptModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onConfirm={handleEditConfirm}
        script={script}
        title="Edit Script"
      />

      <DeleteScriptModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        scriptName={script?.name || "this script"}
      />
    </>
  );
};

interface DetailItemProps {
  label: string;
  value: string | undefined;
}

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div>
      <h3 className="mb-1 text-sm font-medium">{label}</h3>
      <p className="text-sm text-muted-foreground">{value}</p>
    </div>
  );
}

export default ScriptDetailsCard;
