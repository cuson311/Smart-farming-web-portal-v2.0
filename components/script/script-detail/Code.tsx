import React, { useState, useEffect } from "react";
import {
  Code2,
  Save,
  RefreshCw,
  Download,
  Upload,
  Plus,
  Edit,
  Trash,
} from "lucide-react";
import Editor from "@monaco-editor/react";
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
import { Input } from "@/components/ui/input";
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

const CodeTab = ({ script }: { script: Script }) => {
  const { theme } = useTheme();
  const { userId } = useParams();
  const user_Id: string = Array.isArray(userId) ? userId[0] : userId;
  // State for version management
  const [curVersion, setCurVersion] = useState<number>(script.version[0]);
  const [stateVersion, setStateVersion] = useState<number>(script.version[0]);
  const [disableEditFile, setDisableEditFile] = useState<boolean>(true);

  // Get the file data
  const {
    data: fileData,
    setData: setFileData,
    reload: reloadFileData,
  } = useFetchScriptFile(user_Id, script._id, curVersion);

  // Update stateVersion when curVersion changes
  useEffect(() => {
    setStateVersion(curVersion);
  }, [curVersion]);

  // Handle editor content changes
  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setFileData(value);
    }
  };

  // Handle file submission/saving
  const handleSubmitFile = async (newFile = false, newVersion = -1) => {
    if (!fileData) return;

    try {
      // Get current versions array
      let newVersionArr = [...script.version];

      if (newFile) {
        // Add new version to array
        newVersionArr.push(newVersion);
        newVersionArr = newVersionArr.sort((a, b) => b - a);

        // Update script info with new versions array
        await scriptApi.updateScriptInfo(user_Id, script._id, {
          version: newVersionArr,
        });

        // Update current version in state
        setCurVersion(newVersion);
        script.version = newVersionArr;
      } else if (stateVersion !== curVersion) {
        // Rename file
        await scriptApi.renameFile(
          user_Id,
          script._id,
          curVersion,
          stateVersion
        );

        // Update versions array - replace old version with new version
        newVersionArr = newVersionArr.map((item) =>
          item === curVersion ? stateVersion : item
        );
        newVersionArr = newVersionArr.sort((a, b) => b - a);

        // Update script info with new versions array
        await scriptApi.updateScriptInfo(user_Id, script._id, {
          version: newVersionArr,
        });

        // Update current version in state
        setCurVersion(stateVersion);
        script.version = newVersionArr;
      }

      // Create a blob and file object
      const jsonBlob = new Blob([fileData], { type: "application/json" });
      const jsonFile = new File(
        [jsonBlob],
        newFile
          ? `v${newVersion.toFixed(1)}.json`
          : `v${stateVersion.toFixed(1)}.json`,
        { type: "application/json" }
      );

      // Create form data
      const formFileData = new FormData();
      formFileData.append("files", jsonFile);
      formFileData.append("remote_path", `/${userId}/script/${script._id}/`);

      // Upload the file
      await scriptApi.uploadScriptFile(formFileData);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  // Handle creating a new version
  const handleNewVersion = async () => {
    const versions = script.version || [];
    const newVersion = Math.floor((versions[0] || 0) + 1.0);

    setFileData("{}");
    setStateVersion(newVersion);

    // Call handleSubmitFile with newFile=true and the new version number
    handleSubmitFile(true, newVersion);
  };

  // Handle file upload
  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);
        setFileData(JSON.stringify(jsonData, null, 2));
      } catch (error) {
        console.error("Invalid JSON file:", error);
        alert("Invalid JSON file. Please upload a valid JSON.");
      }
    };
    reader.readAsText(file);
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
      } else {
        // Handle case with no versions left
        handleNewVersion();
      }
    } catch (error) {
      console.error("Error deleting version:", error);
    }
  };

  // Handle file download
  const handleDownload = () => {
    if (!fileData) return;

    try {
      const jsonObject = JSON.parse(fileData);
      const blob = new Blob([JSON.stringify(jsonObject, null, 2)], {
        type: "application/json",
      });
      saveAs(blob, `v${curVersion.toFixed(1)}.json`);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="h-5 w-5" />
            <CardTitle>Script Code</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {/* Version selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Version {curVersion.toFixed(1)}
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
                      Version {version.toFixed(1)}
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <CardDescription className="flex items-center justify-between">
          <span>Current version: {curVersion.toFixed(1)}</span>

          <div className="flex items-center gap-1">
            {/* Reload button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setStateVersion(curVersion);
                reloadFileData();
              }}
              title="Reload"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>

            {/* Download button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDownload}
              title="Download"
            >
              <Download className="h-4 w-4" />
            </Button>

            {/* Edit actions for owner */}
            {typeof window !== "undefined" &&
              localStorage.getItem("userId") === userId && (
                <>
                  {!disableEditFile && (
                    <>
                      {/* New version button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleNewVersion}
                        title="New version"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>

                      {/* Upload button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        title="Upload"
                      >
                        <label>
                          <Upload className="h-4 w-4" />
                          <input
                            type="file"
                            className="sr-only"
                            accept="application/json"
                            onChange={handleUpload}
                          />
                        </label>
                      </Button>

                      {/* Save button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSubmitFile()}
                        title="Save"
                      >
                        <Save className="h-4 w-4" />
                      </Button>

                      {/* Delete version button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setOpenDeleteDialog(true)}
                        title="Delete version"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </>
                  )}

                  {/* Toggle edit mode button */}
                  <Button
                    variant={disableEditFile ? "ghost" : "secondary"}
                    size="icon"
                    onClick={() => setDisableEditFile((prev) => !prev)}
                    title={
                      disableEditFile ? "Enable editing" : "Disable editing"
                    }
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </>
              )}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Editor
          height="500px"
          language="json"
          theme={theme === "dark" ? "vs-dark" : "light"}
          value={fileData || "{}"}
          onChange={handleEditorChange}
          options={{
            inlineSuggest: { enabled: true },
            fontSize: 14,
            formatOnType: true,
            autoClosingBrackets: "always",
            minimap: { enabled: false },
            readOnly: disableEditFile,
          }}
        />
      </CardContent>

      {/* Delete version dialog */}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Version</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete version {curVersion.toFixed(1)}?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteVersion}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default CodeTab;
