"use client";

import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  Plus,
  Upload,
  FileText,
  Search,
  X,
  Globe,
  Lock,
  MapPin,
  Leaf,
} from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NewScriptData } from "@/types/script";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Editor from "@monaco-editor/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import scriptApi from "@/api/scriptAPI";
import notificationApi from "@/api/notificationAPI";
import userApi from "@/api/userAPI";
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
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { vietnamProvinces, plantTypes } from "@/lib/constant";
interface NewScriptDialogProps {
  onScriptCreated: () => void;
}

// User type definition based on first file's usage
interface SearchUser {
  _id: string;
  username: string;
  profile_image?: string;
}

// Search Results Component
const SearchResults = ({
  searchResults,
  handleAddUser,
  sharedUserIds,
  handleCloseResults,
}: {
  searchResults: SearchUser[];
  handleAddUser: (index: number) => void;
  sharedUserIds: string[];
  handleCloseResults: () => void;
}) => {
  return searchResults.length > 0 ? (
    <Card className="w-full max-h-64 overflow-y-auto relative mt-2">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">Search Results</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleCloseResults}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Results List */}
        <div className="space-y-2">
          {searchResults.map((user, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded-md hover:bg-accent"
            >
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.profile_image} />
                  <AvatarFallback>{user.username[0] || "?"}</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium">
                    {user.username || "Unknown User"}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddUser(index)}
                disabled={sharedUserIds.includes(user._id)}
              >
                {sharedUserIds.includes(user._id) ? "Added" : "Add"}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  ) : (
    <Card className="w-full relative mt-2">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">Search Results</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleCloseResults}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center justify-center py-4">
          <p className="text-sm text-muted-foreground">No users found</p>
        </div>
      </CardContent>
    </Card>
  );
};

const NewScriptDialog = ({ onScriptCreated }: NewScriptDialogProps) => {
  const { theme } = useTheme();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [newScript, setNewScript] = useState<NewScriptData>({
    name: "",
    description: "",
    privacy: "public",
    share_id: [],
    location: [],
    plant_type: [],
  });

  // Added file data state from first file
  const [fileData, setFileData] = useState("");

  // User search states from first file
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [sharedUsers, setSharedUsers] = useState<SearchUser[]>([]);

  // Location and plant type selection states
  const [locationPopoverOpen, setLocationPopoverOpen] = useState(false);
  const [plantTypePopoverOpen, setPlantTypePopoverOpen] = useState(false);
  const [locationSearchTerm, setLocationSearchTerm] = useState("");
  const [plantTypeSearchTerm, setPlantTypeSearchTerm] = useState("");

  // Load default template when dialog opens
  useEffect(() => {
    if (open) {
      fetchDefaultTemplate();
    }
  }, [open]);

  // Update share_id when sharedUsers changes
  useEffect(() => {
    const userIds = sharedUsers.map((user) => user._id);
    setNewScript((prev) => ({
      ...prev,
      share_id: userIds,
    }));
  }, [sharedUsers]);

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setOpen(true);
    } else {
      handleCloseDialog();
    }
  };

  // Handle close
  const handleCloseDialog = () => {
    setOpen(false);
    setNewScript({
      name: "",
      description: "",
      privacy: "public",
      share_id: [],
      location: [],
      plant_type: [],
    });
    setFileData("");
    setSharedUsers([]);
    setSearchTerm("");
    setSearchResults([]);
    setShowSearchResults(false);
  };

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

    // Clear shared users when switching to public
    if (value === "public") {
      setSharedUsers([]);
      setSearchTerm("");
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  // Handle search term change
  const handleSearchTermChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle search user
  const handleSearchUser = async (e: FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      const response = await userApi.searchUser(searchTerm);
      setSearchResults(response.data);
      setShowSearchResults(true);
    } catch (error) {
      console.error("Error searching users:", error);
      toast({
        title: "Search failed",
        description: "Failed to search users. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle add user to shared list
  const handleAddUser = (index: number) => {
    const userToAdd = searchResults[index];
    if (!sharedUsers.some((user) => user._id === userToAdd._id)) {
      setSharedUsers([...sharedUsers, userToAdd]);
    }
  };

  // Handle remove user from shared list
  const handleRemoveUser = (index: number) => {
    const updatedUsers = [...sharedUsers];
    updatedUsers.splice(index, 1);
    setSharedUsers(updatedUsers);
  };

  // Handle location selection
  const handleLocationSelect = (location: string) => {
    setNewScript((prev) => {
      // Check if location is already selected
      if (prev.location?.includes(location)) {
        // Remove location if already selected
        return {
          ...prev,
          location: prev.location.filter((loc) => loc !== location),
        };
      } else {
        // Add location if not already selected
        return {
          ...prev,
          location: [...(prev.location || []), location],
        };
      }
    });
  };

  // Handle plant type selection
  const handlePlantTypeSelect = (plantType: string) => {
    setNewScript((prev) => {
      // Check if plant type is already selected
      if (prev.plant_type?.includes(plantType)) {
        // Remove plant type if already selected
        return {
          ...prev,
          plant_type: prev.plant_type.filter((type) => type !== plantType),
        };
      } else {
        // Add plant type if not already selected
        return {
          ...prev,
          plant_type: [...(prev.plant_type || []), plantType],
        };
      }
    });
  };

  // Remove location
  const handleRemoveLocation = (location: string) => {
    setNewScript((prev) => ({
      ...prev,
      location: prev.location?.filter((loc) => loc !== location) || [],
    }));
  };

  // Remove plant type
  const handleRemovePlantType = (plantType: string) => {
    setNewScript((prev) => ({
      ...prev,
      plant_type: prev.plant_type?.filter((type) => type !== plantType) || [],
    }));
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
      // Ensure share_id is empty for public scripts
      if (newScript.privacy === "public") {
        newScript.share_id = [];
      }

      // Uncomment and adjust these based on your actual API implementation
      const scriptId = await scriptApi.createScript(userId, newScript);

      // Only create notifications for private scripts with shared users
      if (newScript.privacy === "private" && newScript.share_id.length > 0) {
        await notificationApi.createNotification(
          userId,
          newScript.share_id,
          scriptId._id
        );
      }

      handleSubmitFile(userId, scriptId._id);

      toast({
        title: "Script created",
        description: `Script "${newScript.name}" has been created successfully.`,
      });

      if (onScriptCreated) {
        onScriptCreated();
      }

      setNewScript({
        name: "",
        description: "",
        privacy: "public",
        share_id: [],
        location: [],
        plant_type: [],
      });
      setFileData("");
      setSharedUsers([]);
      setOpen(false);
    } catch (error) {
      console.error("Error creating script:", error);
      toast({
        title: "Creation failed",
        description: "Failed to create script. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Filter provinces based on search term
  const filteredProvinces = locationSearchTerm
    ? vietnamProvinces.filter((province) =>
        province.toLowerCase().includes(locationSearchTerm.toLowerCase())
      )
    : vietnamProvinces;

  // Filter plant types based on search term
  const filteredPlantTypes = plantTypeSearchTerm
    ? plantTypes.filter((type) =>
        type.toLowerCase().includes(plantTypeSearchTerm.toLowerCase())
      )
    : plantTypes;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
            {/* Form fields section */}
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

              {/* Location selection - NEW SECTION */}
              <div className="grid gap-2">
                <Label>Location (Optional)</Label>
                <div className="flex flex-col space-y-2">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newScript.location?.map((location) => (
                      <Badge key={location} className="py-1 px-3">
                        {location}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-2"
                          onClick={() => handleRemoveLocation(location)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
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
                        {newScript.location && newScript.location.length > 0
                          ? `${newScript.location.length} locations selected`
                          : "Select provinces"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0" align="start">
                      <Command>
                        <CommandInput
                          placeholder="Search provinces..."
                          value={locationSearchTerm}
                          onValueChange={setLocationSearchTerm}
                        />
                        <CommandEmpty>No province found.</CommandEmpty>
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
                                      newScript.location?.includes(province)
                                        ? "bg-primary border-primary"
                                        : "border-input"
                                    }`}
                                  >
                                    {newScript.location?.includes(province) && (
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

              {/* Plant Type selection - NEW SECTION */}
              <div className="grid gap-2">
                <Label>Plant Type (Optional)</Label>
                <div className="flex flex-col space-y-2">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newScript.plant_type?.map((plantType) => (
                      <Badge key={plantType} className="py-1 px-3">
                        {plantType}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-2"
                          onClick={() => handleRemovePlantType(plantType)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <Popover
                    open={plantTypePopoverOpen}
                    onOpenChange={setPlantTypePopoverOpen}
                    modal={true}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        role="combobox"
                      >
                        <Leaf className="mr-2 h-4 w-4" />
                        {newScript.plant_type && newScript.plant_type.length > 0
                          ? `${newScript.plant_type.length} plant types selected`
                          : "Select plant types"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0" align="start">
                      <Command>
                        <CommandInput
                          placeholder="Search plant types..."
                          value={plantTypeSearchTerm}
                          onValueChange={setPlantTypeSearchTerm}
                        />
                        <CommandEmpty>No plant type found.</CommandEmpty>
                        <CommandGroup>
                          <ScrollArea className="h-64">
                            {filteredPlantTypes.map((type) => (
                              <CommandItem
                                key={type}
                                value={type}
                                onSelect={() => handlePlantTypeSelect(type)}
                              >
                                <div className="flex items-center gap-2 w-full">
                                  <div
                                    className={`h-4 w-4 border rounded-sm flex items-center justify-center ${
                                      newScript.plant_type?.includes(type)
                                        ? "bg-primary border-primary"
                                        : "border-input"
                                    }`}
                                  >
                                    {newScript.plant_type?.includes(type) && (
                                      <X className="h-3 w-3 text-primary-foreground" />
                                    )}
                                  </div>
                                  <span>{type}</span>
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

              {/* Privacy section */}
              <div className="space-y-4">
                <Label>Privacy</Label>
                <RadioGroup
                  value={newScript.privacy}
                  onValueChange={handlePrivacyChange}
                  className="grid grid-cols-1 gap-4"
                >
                  <div className="flex items-start space-x-2 p-4 border rounded-md hover:bg-accent">
                    <RadioGroupItem
                      value="public"
                      id="public"
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center">
                        <Globe className="mr-2 h-4 w-4 text-blue-500" />
                        <Label htmlFor="public" className="font-medium">
                          Public
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Anyone can view and fork this script
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2 p-4 border rounded-md hover:bg-accent">
                    <RadioGroupItem
                      value="private"
                      id="private"
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center">
                        <Lock className="mr-2 h-4 w-4 text-amber-500" />
                        <Label htmlFor="private" className="font-medium">
                          Private
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Only you and people you share with can access
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Shared users section - ONLY appears when privacy is set to private */}
              {newScript.privacy === "private" && (
                <div className="space-y-4">
                  <Label>Shared Users</Label>
                  <div className="flex gap-2">
                    <Input
                      value={searchTerm}
                      onChange={handleSearchTermChange}
                      placeholder="Search for users"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      size="default"
                      onClick={handleSearchUser}
                      variant="secondary"
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>

                  {/* Search results */}
                  {showSearchResults && (
                    <SearchResults
                      searchResults={searchResults}
                      handleAddUser={handleAddUser}
                      sharedUserIds={sharedUsers.map((user) => user._id)}
                      handleCloseResults={() => setShowSearchResults(false)}
                    />
                  )}

                  {/* Shared users list */}
                  {sharedUsers.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm">Shared with:</Label>
                      <div className="space-y-2">
                        {sharedUsers.map((user, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 rounded-md bg-accent"
                          >
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.profile_image} />
                                <AvatarFallback>
                                  {user.username[0] || "?"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="text-sm">
                                <p className="font-medium">
                                  {user.username || "Unknown User"}
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleRemoveUser(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
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
                    <Upload className="mr-2 h-4 w-4" />
                    Upload JSON
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

              {/* Code editor - same from first file */}
              <Editor
                height="400px"
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
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCloseDialog}>
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
