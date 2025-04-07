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
import { Search, X, Globe, Lock } from "lucide-react";
import { Script } from "@/types/script";
import userApi from "@/api/userAPI";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";

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

const EditScriptModal = ({
  open,
  onClose,
  onConfirm,
  script,
  title = "Edit Script",
}: EditScriptModalProps) => {
  // Form Data
  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    description: "",
    privacy: "",
    owner_id: "",
    share_id: [] as string[],
  });

  const [oldUserShareId, setOldUserShareId] = useState<string[]>([]);
  const [sharedUsers, setSharedUsers] = useState<any[]>([]);

  // Search state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    if (script && open) {
      setFormData({
        _id: script._id || "",
        name: script.name || "",
        description: script.description || "",
        privacy: script.privacy || "private",
        owner_id: script.owner_id || "",
        share_id: script.share_id?.map((item: any) => item._id) || [],
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
      setSearchResults(response);
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

  const handleSubmit = () => {
    if (!formData.name) {
      toast({
        title: "Missing information",
        description: "Please provide a name for your script.",
        variant: "destructive",
      });
      return;
    }

    // Ensure share_id is empty for public scripts
    if (formData.privacy === "public") {
      formData.share_id = [];
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
                Script Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter script name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Enter script description (optional)"
                rows={4}
              />
            </div>

            {/* Privacy section - Using the same UI as first file */}
            <div className="space-y-4">
              <Label>Privacy</Label>
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
            {formData.privacy === "private" && (
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
                              {!oldUserShareId.includes(user._id) && (
                                <span className="text-xs text-green-600">
                                  New
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
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditScriptModal;
