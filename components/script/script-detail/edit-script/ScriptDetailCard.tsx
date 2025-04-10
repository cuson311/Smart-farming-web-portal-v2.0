import React, { useState } from "react";

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

const ScriptDetailsCard = ({
  script,
  refetch,
}: {
  script: Script | null;
  refetch: () => void;
}) => {
  const router = useRouter();
  const { userId, scriptId } = useParams<{
    userId: string;
    scriptId: string;
  }>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Fetch the owner's profile using the existing hook
  const {
    data: ownerProfile,
    loading: isProfileLoading,
    refetch: refetchOwnerProfile,
  } = useFetchProfile(userId);

  const handleEditConfirm = async (updatedScript: any) => {
    try {
      await scriptApi.updateScriptInfo(userId, scriptId, updatedScript);
      console.log("Script updated:", updatedScript);
      toast({
        title: "Successful!",
        description: "Update script info successfully",
        variant: "default",
      });
      setIsEditModalOpen(false);
      refetch();
    } catch (error) {
      console.error("Error updating script:", error);
      toast({
        title: "Error",
        description: "Failed to update script",
        variant: "destructive",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await scriptApi.deleteScriptInfo(userId, scriptId);
      await scriptApi.deleteScriptFiles(userId, scriptId);
      toast({
        title: "Successful!",
        description: "Script deleted successfully",
        variant: "default",
      });
      setIsDeleteModalOpen(false);
      // Navigate back to scripts list or wherever appropriate
      router.push(`/dashboard/${userId}/scripts?tab=all`);
    } catch (error) {
      console.error("Error deleting script:", error);
      toast({
        title: "Error",
        description: "Failed to delete script",
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
          <CardTitle>Script Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {/* Owner Information Section */}
          <div>
            <h3 className="mb-1 text-sm font-medium">Owner</h3>
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
            label="Description"
            value={
              script?.description !== ""
                ? script?.description
                : "There is no description"
            }
          />
          {/* <DetailItem label="Created" value={script.createdAt} />
          <DetailItem label="Last Updated" value={script.updatedAt} /> */}

          <div>
            <h3 className="mb-1 text-sm font-medium">Privacy</h3>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium">
                {script?.privacy}
              </span>
            </div>
          </div>

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
                      Edit Script
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
