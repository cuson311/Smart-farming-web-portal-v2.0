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

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Script Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
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
