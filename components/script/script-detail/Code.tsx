import React, { useState, useEffect } from "react";
import {
  Code2,
  Save,
  RefreshCw,
  Download,
  Plus,
  Edit,
  Trash,
  X,
  ChevronDown,
} from "lucide-react";
import { saveAs } from "file-saver";
import { useTheme } from "next-themes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Script } from "@/types/script";
import scriptApi from "@/api/scriptAPI";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useFetchScriptFile } from "@/hooks/useFetchScript";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "@/components/ui/use-toast";
import IrrigationScheduleForm from "./IrrigationScheduleForm";

const CodeTab = ({ script }: { script: Script }) => {
  const t = useTranslations("dashboard.scripts.detail");
  const { theme } = useTheme();
  const { userId } = useParams();
  const user_Id: string = Array.isArray(userId) ? userId[0] : userId;

  // State for version management
  const [curVersion, setCurVersion] = useState<number>(script.version[0]);
  const [stateVersion, setStateVersion] = useState<number>(script.version[0]);
  const [disableEditFile, setDisableEditFile] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [tempFormData, setTempFormData] = useState<any>(null);

  // Get the file data
  const {
    data: fileData,
    setData: setFileData,
    reload: reloadFileData,
  } = useFetchScriptFile(user_Id, script._id, curVersion);

  // Update stateVersion when curVersion changes
  useEffect(() => {
    setStateVersion(curVersion);
    setIsEditing(false);
    setDisableEditFile(true);
  }, [curVersion]);

  // Handle new version creation
  const handleNewVersion = async () => {
    try {
      const newVersion = Math.max(...script.version) + 1;
      const newVersionArr = [...script.version, newVersion].sort(
        (a, b) => b - a
      );

      // Create new version file with current version's data
      const jsonBlob = new Blob([fileData || ""], { type: "application/json" });
      const jsonFile = new File([jsonBlob], `v${newVersion.toFixed(1)}.json`, {
        type: "application/json",
      });

      const formFileData = new FormData();
      formFileData.append("files", jsonFile);
      formFileData.append("remote_path", `/${userId}/script/${script._id}/`);

      await scriptApi.uploadScriptFile(formFileData);

      // Update script version info
      await scriptApi.updateScriptInfo(user_Id, script._id, {
        version: newVersionArr,
      });

      // Update local state
      script.version = newVersionArr;
      setCurVersion(newVersion);
      setStateVersion(newVersion);

      // Enable editing mode
      setDisableEditFile(false);
      setIsEditing(true);

      // Reload file data to ensure form is initialized with new version data
      await reloadFileData();

      toast({
        title: t("toast.newVersionSuccess"),
        description: t("toast.newVersionSuccessDescription"),
        variant: "default",
      });
    } catch (error) {
      console.error("Error creating new version:", error);
      toast({
        title: t("toast.newVersionError"),
        description: t("toast.newVersionErrorDescription"),
        variant: "destructive",
      });
    }
  };

  // Handle file submission/saving
  const handleSubmitFile = async (formData: any) => {
    try {
      let newVersionArr = [...script.version];

      if (stateVersion !== curVersion) {
        await scriptApi.renameFile(
          user_Id,
          script._id,
          curVersion,
          stateVersion
        );

        newVersionArr = newVersionArr.map((item) =>
          item === curVersion ? stateVersion : item
        );
        newVersionArr = newVersionArr.sort((a, b) => b - a);

        await scriptApi.updateScriptInfo(user_Id, script._id, {
          version: newVersionArr,
        });

        setCurVersion(stateVersion);
        script.version = newVersionArr;
      }

      const jsonBlob = new Blob([JSON.stringify(formData, null, 2)], {
        type: "application/json",
      });
      const jsonFile = new File(
        [jsonBlob],
        `v${stateVersion.toFixed(1)}.json`,
        { type: "application/json" }
      );

      const formFileData = new FormData();
      formFileData.append("files", jsonFile);
      formFileData.append("remote_path", `/${userId}/script/${script._id}/`);

      await scriptApi.uploadScriptFile(formFileData);

      setIsEditing(false);
      setDisableEditFile(true);
      setTempFormData(null);

      // Reload file data after successful save
      await reloadFileData();

      toast({
        title: t("toast.updateSuccess"),
        description: t("toast.updateSuccessDescription"),
        variant: "default",
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: t("toast.updateError"),
        description: t("toast.updateErrorDescription"),
        variant: "destructive",
      });
    }
  };

  // Handle cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false);
    setDisableEditFile(true);
    setTempFormData(null);
    reloadFileData();
  };

  // Handle version deletion
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleDeleteVersion = async () => {
    try {
      await scriptApi.deleteScriptFileVersion(user_Id, script._id, curVersion);

      const versions = script.version || [];
      const newVersions = versions
        .filter((v) => v !== curVersion)
        .sort((a, b) => b - a);

      await scriptApi.updateScriptInfo(user_Id, script._id, {
        version: newVersions,
      });

      script.version = newVersions;
      setOpenDeleteDialog(false);

      if (newVersions.length > 0) {
        setCurVersion(newVersions[0]);
      }

      toast({
        title: t("toast.deleteVersionSuccess"),
        description: t("toast.deleteVersionSuccessDescription"),
        variant: "default",
      });
    } catch (error) {
      console.error("Error deleting version:", error);
      toast({
        title: t("toast.deleteVersionError"),
        description: t("toast.deleteVersionErrorDescription"),
        variant: "destructive",
      });
    }
  };

  // Handle file download
  const handleDownload = () => {
    if (!fileData) {
      toast({
        title: t("toast.downloadError"),
        description: t("toast.downloadErrorDescription"),
        variant: "destructive",
      });
      return;
    }

    try {
      const jsonObject = JSON.parse(fileData);
      const blob = new Blob([JSON.stringify(jsonObject, null, 2)], {
        type: "application/json",
      });
      saveAs(blob, `v${curVersion.toFixed(1)}.json`);

      toast({
        title: t("toast.downloadSuccess"),
        description: t("toast.downloadSuccessDescription"),
        variant: "default",
      });
    } catch (error) {
      console.error("Error downloading file:", error);
      toast({
        title: t("toast.downloadError"),
        description: t("toast.downloadErrorDescription"),
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="h-5 w-5" />
            <CardTitle>{t("code.title")}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {/* New version button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleNewVersion}
              className="ml-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t("code.newVersion")}
            </Button>
          </div>
        </div>
        <CardDescription className="flex items-center justify-between">
          {/* Version selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                {t("code.version", { version: curVersion.toFixed(1) })}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {script.version
                ?.sort((a, b) => b - a)
                .map((version) => (
                  <DropdownMenuItem
                    key={version}
                    onClick={() => {
                      setCurVersion(version);
                      reloadFileData();
                    }}
                  >
                    {t("code.version", { version: version.toFixed(1) })}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center gap-1">
            {/* Reload button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setStateVersion(curVersion);
                reloadFileData();
              }}
              title={t("code.reload")}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>

            {/* Download button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDownload}
              title={t("code.download")}
            >
              <Download className="h-4 w-4" />
            </Button>

            {/* Edit actions for owner */}
            {typeof window !== "undefined" &&
              localStorage.getItem("userId") === userId && (
                <>
                  {/* Delete version button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setOpenDeleteDialog(true)}
                    title={t("code.deleteVersion")}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </>
              )}
            {typeof window !== "undefined" &&
              localStorage.getItem("userId") === userId &&
              disableEditFile && (
                <>
                  {/* Toggle edit mode button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (disableEditFile) {
                        // Enter edit mode
                        setDisableEditFile(false);
                        setIsEditing(true);
                      } else {
                        // Exit edit mode
                        handleCancelEdit();
                      }
                    }}
                    title={
                      disableEditFile
                        ? t("code.enableEditing")
                        : t("code.disableEditing")
                    }
                  >
                    <Edit className="h-4 w-4" />
                    {disableEditFile ? t("edit") : t("cancel")}
                  </Button>
                </>
              )}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <IrrigationScheduleForm
          initialData={fileData ? JSON.parse(fileData) : null}
          onSave={handleSubmitFile}
          onCancel={handleCancelEdit}
          disabled={disableEditFile}
        />
      </CardContent>

      {/* Delete version dialog */}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("code.deleteDialog.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("code.deleteDialog.description", {
                version: curVersion.toFixed(1),
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteVersion}>
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default CodeTab;
