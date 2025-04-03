"use client";

import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NewScriptData } from "@/types/script";
import { ToastType } from "@/types/script";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Editor from "@monaco-editor/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import scriptApi from "@/api/scriptAPI";
import notificationApi from "@/api/notificationAPI";

// We would need to import these from wherever they're defined in your project
// import scriptApi from "@/api/scriptAPI";
// import notificationApi from "@/api/notificationAPI";

interface NewScriptDialogProps {
  toast: ToastType;
  onScriptCreated?: (script: NewScriptData) => void;
}

const NewScriptDialog = ({ toast, onScriptCreated }: NewScriptDialogProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [newScript, setNewScript] = useState<any>({
    name: "",
    description: "",
    privacy: "public",
    share_id: [], // Added share_id from first file
  });

  // Added file data state from first file
  const [fileData, setFileData] = useState("");

  // Load default template when dialog opens
  useEffect(() => {
    if (open) {
      fetchDefaultTemplate();
    }
  }, [open]);

  // Fetch default template function from first file
  const fetchDefaultTemplate = () => {
    fetch("/scriptTemplates/defaultTemplate.json")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch JSON");
        return response.json();
      })
      .then((jsonData) => {
        setFileData(JSON.stringify(jsonData, null, 2));
      })
      .catch((error) => console.error("Error when reading JSON:", error));
  };

  // Handle editor change from first file
  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setFileData(value);
    }
  };

  const handleNewScriptChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setNewScript((prev: any) => ({ ...prev, [name]: value }));
  };

  const handlePrivacyChange = (value: string): void => {
    setNewScript((prev: any) => ({ ...prev, privacy: value }));
  };

  // Handle upload file function from first file
  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);
        setFileData(JSON.stringify(jsonData, null, 2));
      } catch (error) {
        console.error("Invalid JSON file:", error);
        toast({
          title: "Invalid file",
          description: "Please upload a valid JSON file.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  // Submit file function from first file
  const handleSubmitFile = async (userId: string, scriptId: string) => {
    if (!fileData) return;

    try {
      const jsonBlob = new Blob([fileData], { type: "application/json" });
      const jsonFile = new File([jsonBlob], "v1.0.json", {
        type: "application/json",
      });
      const formFileData = new FormData();
      formFileData.append("files", jsonFile);
      formFileData.append("remote_path", `/${userId}/script/${scriptId}/`);

      // Uncomment and adjust this based on your actual API implementation
      const response = await scriptApi.uploadScriptFile(formFileData);
      console.log(
        "File would be uploaded with path:",
        `/${userId}/script/${scriptId}/`,
        response
      );
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload script file.",
        variant: "destructive",
      });
    }
  };

  // Modified submit function to include API calls from first file
  const handleCreateScript = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    // Validate form
    if (!newScript.name.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a name for your script.",
        variant: "destructive",
      });
      return;
    }

    const userId =
      typeof window !== "undefined" ? localStorage.getItem("userId") : null;

    if (!userId) {
      toast({
        title: "Authentication error",
        description: "You must be logged in to create a script.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Uncomment and adjust these based on your actual API implementation
      const scriptId = await scriptApi.createScript(userId, newScript);
      await notificationApi.createNotification(
        userId,
        newScript.share_id,
        scriptId._id
      );
      handleSubmitFile(userId, scriptId._id);

      // For demonstration purposes
      console.log("Would create script with data:", newScript);
      console.log("Would upload file data:", fileData);

      toast({
        title: "Script created",
        description: `Script "${newScript.name}" has been created successfully.`,
      });

      //   if (onScriptCreated) {
      //     onScriptCreated(newScript);
      //   }

      setNewScript({
        name: "",
        description: "",
        privacy: "public",
        share_id: [],
      });
      setFileData("");
      setOpen(false);

      // Uncomment if you want to navigate after creation
      window.location.reload();
    } catch (error) {
      console.error("Error creating script:", error);
      toast({
        title: "Creation failed",
        description: "Failed to create script. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Script
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Script</DialogTitle>
          <DialogDescription>
            Add a new irrigation script to your collection.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateScript}>
          <div className="grid gap-6 py-4">
            {/* Form fields section - now in a single column */}
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={newScript.name}
                  onChange={handleNewScriptChange}
                  placeholder="Enter script name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={newScript.description}
                  onChange={handleNewScriptChange}
                  placeholder="Enter script description (optional)"
                />
              </div>
              <div className="grid gap-2">
                <Label>Privacy</Label>
                <RadioGroup
                  value={newScript.privacy}
                  onValueChange={handlePrivacyChange}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="public" id="public" />
                    <Label htmlFor="public">Public</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="private" id="private" />
                    <Label htmlFor="private">Private</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Script JSON section - now as a separate row spanning full width */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-lg font-medium">Script JSON</Label>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept = "application/json";
                      input.onchange = (e) =>
                        handleUpload(
                          e as unknown as ChangeEvent<HTMLInputElement>
                        );
                      input.click();
                    }}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button type="button" size="sm" variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        Template
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={fetchDefaultTemplate}>
                        Default
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              {/* Increased height of the editor */}
              <Editor
                height="400px"
                language="json"
                theme={"light"}
                value={fileData || "{}"}
                onChange={handleEditorChange}
                options={{
                  inlineSuggest: { enabled: true },
                  fontSize: 14,
                  formatOnType: true,
                  autoClosingBrackets: "always",
                  minimap: { enabled: false },
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Script</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewScriptDialog;
