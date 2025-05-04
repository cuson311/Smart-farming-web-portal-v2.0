import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Search,
  X,
  Globe,
  Lock,
  MapPin,
  Leaf,
  Copy,
  Check,
} from "lucide-react";
import { Script } from "@/types/script";
import userApi from "@/api/userAPI";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import notificationApi from "@/api/notificationAPI";
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
import { useTranslations } from "next-intl";

type SearchUser = {
  _id: string;
  username: string;
  profile_image?: string;
};

type EditScriptModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: any) => void;
  script: Script | null;
  title?: string;
};

// Search Results Component - Styled like first file
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
  const t = useTranslations("dashboard.scripts.scriptModal");

  return searchResults.length > 0 ? (
    <Card className="w-full max-h-64 overflow-y-auto relative mt-2">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">
            {t("searchResults")}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleCloseResults}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

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
                    {user.username || t("unknownUser")}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddUser(index)}
                disabled={sharedUserIds.includes(user._id)}
              >
                {sharedUserIds.includes(user._id) ? t("added") : t("add")}
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
          <span className="text-sm text-muted-foreground">
            {t("searchResults")}
          </span>
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
          <p className="text-sm text-muted-foreground">{t("noUserFound")}</p>
        </div>
      </CardContent>
    </Card>
  );
};

const EditScriptModal = ({
  open,
  onClose,
  onConfirm,
  script,
  title = "Edit Script",
}: EditScriptModalProps) => {
  const t = useTranslations("dashboard.scripts.scriptModal");
  // Form Data
  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    description: "",
    privacy: "",
    owner_id: "",
    share_id: [] as string[],
    location: [] as string[], // Added location field
    plant_type: [] as string[], // Added plant_type field
  });

  const [oldUserShareId, setOldUserShareId] = useState<string[]>([]);
  const [sharedUsers, setSharedUsers] = useState<any[]>([]);

  // Search state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Location and plant type selection states
  const [locationPopoverOpen, setLocationPopoverOpen] = useState(false);
  const [plantTypePopoverOpen, setPlantTypePopoverOpen] = useState(false);
  const [locationSearchTerm, setLocationSearchTerm] = useState("");
  const [plantTypeSearchTerm, setPlantTypeSearchTerm] = useState("");

  // Copy URL states
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (script && open) {
      setFormData({
        _id: script._id || "",
        name: script.name || "",
        description: script.description || "",
        privacy: script.privacy || "private",
        owner_id: script.owner_id || "",
        share_id: script.share_id?.map((item: any) => item._id) || [],
        location: script.location || [], // Initialize location field
        plant_type: script.plant_type || [], // Initialize plant_type field
      });

      setSharedUsers(script.share_id || []);
      setSearchTerm("");
      setShowSearchResults(false);
      setOldUserShareId(script.share_id?.map((item: any) => item._id) || []);
    }
  }, [script, open]);

  useEffect(() => {
    const userIds = sharedUsers.map((user) => user._id);
    setFormData((prev) => ({
      ...prev,
      share_id: userIds,
    }));
  }, [sharedUsers]);

  const handleChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear shared users when switching to public
    if (name === "privacy" && value === "public") {
      setSharedUsers([]);
      setSearchTerm("");
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      const response = await userApi.searchUser(searchTerm);
      setSearchResults(response.data);
      setShowSearchResults(true);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  const handleAddUser = (index: number) => {
    const userToAdd = searchResults[index];
    if (!sharedUsers.some((user) => user._id === userToAdd._id)) {
      setSharedUsers([...sharedUsers, userToAdd]);
    }
  };

  const handleRemoveUser = (index: number) => {
    const updatedUsers = [...sharedUsers];
    updatedUsers.splice(index, 1);
    setSharedUsers(updatedUsers);
  };

  // Handle location selection
  const handleLocationSelect = (location: string) => {
    setFormData((prev) => {
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
    setFormData((prev) => {
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
    setFormData((prev) => ({
      ...prev,
      location: prev.location?.filter((loc) => loc !== location) || [],
    }));
  };

  // Remove plant type
  const handleRemovePlantType = (plantType: string) => {
    setFormData((prev) => ({
      ...prev,
      plant_type: prev.plant_type?.filter((type) => type !== plantType) || [],
    }));
  };

  // Copy URL function
  const handleCopyUrl = () => {
    if (formData._id) {
      const scriptUrl = `${window.location}`;
      navigator.clipboard.writeText(scriptUrl).then(() => {
        setCopied(true);
        toast({
          title: "URL Copied",
          description: "Script URL has been copied to clipboard",
        });

        // Reset copied state after 2 seconds
        setTimeout(() => {
          setCopied(false);
        }, 2000);
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

  const handleSubmit = async () => {
    if (!formData.name) {
      toast({
        title: t("toast.missingInfo"),
        description: t("toast.missingInfoDescription"),
        variant: "destructive",
      });
      return;
    }

    if (formData.privacy === "public") {
      formData.share_id = [];
    }

    if (formData.privacy === "private") {
      const compareShareUser = (arr1: string[], arr2: string[]) => {
        if (arr1.length !== arr2.length) {
          return arr1.filter((item) => !arr2.includes(item));
        }

        const sortedArr1 = arr1.slice().sort();
        const sortedArr2 = arr2.slice().sort();

        if (sortedArr1.every((item, index) => item === sortedArr2[index])) {
          return null;
        }

        return arr1.filter((item) => !arr2.includes(item));
      };

      const newShareUserList = compareShareUser(
        formData.share_id,
        oldUserShareId
      );

      if (newShareUserList) {
        await notificationApi.createNotification(
          formData.owner_id,
          newShareUserList,
          formData._id
        );
      }
    }
    onConfirm(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[65%] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {/* Script Info */}
        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="font-medium">
                {t("nameLabel")}
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder={t("namePlaceholder")}
              />
            </div>

            {/* Copy URL Button - NEW SECTION */}
            {formData._id && (
              <div className="grid gap-2">
                <Label className="font-medium">{t("scriptUrl")}</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={`${window.location}`}
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleCopyUrl}
                    className="h-10 w-10"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="description" className="font-medium">
                {t("descriptionLabel")}
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder={t("descriptionPlaceholder")}
                rows={4}
              />
            </div>

            {/* Location selection */}
            <div className="grid gap-2">
              <Label>{t("locationLabel")}</Label>
              <div className="flex flex-col space-y-2">
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.location?.map((location) => (
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
                      {formData.location && formData.location.length > 0
                        ? t("locationsSelected", {
                            count: formData.location.length,
                          })
                        : t("selectProvinces")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0" align="start">
                    <Command>
                      <CommandInput
                        placeholder={t("searchProvinces")}
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
                                    formData.location?.includes(province)
                                      ? "bg-primary border-primary"
                                      : "border-input"
                                  }`}
                                >
                                  {formData.location?.includes(province) && (
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

            {/* Plant Type selection */}
            <div className="grid gap-2">
              <Label>{t("plantTypeLabel")}</Label>
              <div className="flex flex-col space-y-2">
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.plant_type?.map((plantType) => (
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
                      {formData.plant_type && formData.plant_type.length > 0
                        ? t("plantTypesSelected", {
                            count: formData.plant_type.length,
                          })
                        : t("selectPlantTypes")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0" align="start">
                    <Command>
                      <CommandInput
                        placeholder={t("searchPlantTypes")}
                        value={plantTypeSearchTerm}
                        onValueChange={setPlantTypeSearchTerm}
                      />
                      <CommandEmpty>{t("noPlantTypeFound")}</CommandEmpty>
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
                                    formData.plant_type?.includes(type)
                                      ? "bg-primary border-primary"
                                      : "border-input"
                                  }`}
                                >
                                  {formData.plant_type?.includes(type) && (
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
              <Label>{t("privacyLabel")}</Label>
              <RadioGroup
                value={formData.privacy}
                onValueChange={(value) => handleChange("privacy", value)}
                className="grid grid-cols-1 gap-4"
              >
                <div className="flex items-start space-x-2 p-4 border rounded-md hover:bg-accent">
                  <RadioGroupItem value="public" id="public" className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center">
                      <Globe className="mr-2 h-4 w-4 text-blue-500" />
                      <Label htmlFor="public" className="font-medium">
                        {t("publicLabel")}
                      </Label>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t("publicDescription")}
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
                        {t("privateLabel")}
                      </Label>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t("privateDescription")}
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Shared users section - ONLY appears when privacy is set to private */}
            {formData.privacy === "private" && (
              <div className="space-y-4">
                <Label>{t("sharedUsersLabel")}</Label>
                <div className="flex gap-2">
                  <Input
                    value={searchTerm}
                    onChange={handleSearchTermChange}
                    placeholder={t("searchUsersPlaceholder")}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    size="default"
                    onClick={handleSearchUser}
                    variant="secondary"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    {t("searchButton")}
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
                    <Label className="text-sm">{t("sharedWithLabel")}</Label>
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
                                {user.username?.[0] || "?"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="text-sm">
                              <p className="font-medium">
                                {user.username || t("unknownUser")}
                              </p>
                              {!oldUserShareId.includes(user._id) && (
                                <span className="text-xs text-green-600">
                                  {t("new")}
                                </span>
                              )}
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
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            {t("confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditScriptModal;
