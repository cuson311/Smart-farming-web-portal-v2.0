import { FormEvent, ChangeEvent, useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ScriptList from "./ScriptList";
import userApi from "@/api/userAPI";
import { useToast } from "@/hooks/use-toast";
import { useFetchScriptsList } from "@/hooks/useFetchUser";
import { UserProfile } from "@/types/user";
import { Script, ScriptsListOptions } from "@/types/script";

// Search Results Component
const SearchResults = ({
  searchResults,
  handleSelectUser,
  handleCloseResults,
}: {
  searchResults: UserProfile[];
  handleSelectUser: (userId: string, username: string) => void;
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
              className="flex items-center justify-between p-2 rounded-md hover:bg-accent cursor-pointer"
              onClick={() => handleSelectUser(user._id, user.username)}
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
              <Button variant="outline" size="sm">
                View Scripts
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

interface PublicScriptListProps {
  toggleFavorite: (
    id: string,
    isFavorite: boolean,
    refetch?: () => void
  ) => void;
  state: {
    userSearchTerm: string;
    searchResults: UserProfile[];
    showSearchResults: boolean;
    selectedUser: { id: string; name: string } | null;
  };
  updateState: (newState: Partial<PublicScriptListProps["state"]>) => void;
  filterOptions: ScriptsListOptions;
}

const PublicScriptList = ({
  toggleFavorite,
  state,
  updateState,
  filterOptions,
}: PublicScriptListProps) => {
  const { toast } = useToast();

  // Destructure state for cleaner code
  const { userSearchTerm, searchResults, showSearchResults, selectedUser } =
    state;

  // Use the hook with the selected user's ID and provided filter options
  const {
    data: scripts,
    loading: scriptLoading,
    refetch: refetchScripts,
  } = useFetchScriptsList(selectedUser?.id || "", filterOptions);

  // Update fetch when filter options change
  useEffect(() => {
    if (selectedUser) {
      refetchScripts(filterOptions);
    }
  }, [filterOptions, selectedUser]);

  // Handle search term change
  const handleSearchTermChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateState({ userSearchTerm: e.target.value });
  };

  // Handle search user
  const handleSearchUser = async (e: FormEvent) => {
    e.preventDefault();
    if (!userSearchTerm.trim()) return;

    try {
      const response = await userApi.searchUser(userSearchTerm);
      updateState({
        searchResults: response.data,
        showSearchResults: true,
      });
    } catch (error) {
      console.error("Error searching users:", error);
      toast({
        title: "Search failed",
        description: "Failed to search users. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle selecting a user from search results
  const handleSelectUser = (userId: string, username: string) => {
    updateState({
      selectedUser: { id: userId, name: username },
      showSearchResults: false,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          {selectedUser ? (
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-muted-foreground">
                Showing scripts by {selectedUser.name}
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 py-0"
                onClick={() => updateState({ selectedUser: null })}
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            </div>
          ) : null}
        </div>

        <div className="flex gap-2">
          <form onSubmit={handleSearchUser} className="flex gap-2 w-full">
            <Input
              value={userSearchTerm}
              onChange={handleSearchTermChange}
              placeholder="Search for users"
              className="flex-1"
            />
            <Button type="submit" size="default" variant="secondary">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>
        </div>

        {/* Search results */}
        {showSearchResults && (
          <SearchResults
            searchResults={searchResults}
            handleSelectUser={handleSelectUser}
            handleCloseResults={() => updateState({ showSearchResults: false })}
          />
        )}
      </div>

      {/* Display scripts for selected user */}
      {selectedUser && (
        <ScriptList
          scripts={scripts.data}
          toggleFavorite={(id, isFavorite) =>
            toggleFavorite(id, isFavorite, () => refetchScripts(filterOptions))
          }
          loading={scriptLoading}
          refetch={() => refetchScripts(filterOptions)}
        />
      )}

      {/* Show message when no user is selected */}
      {!selectedUser && !showSearchResults && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">Search for public scripts</h3>
          <p className="text-muted-foreground mt-2">
            Find users to discover their public scripts
          </p>
        </div>
      )}
    </div>
  );
};

export default PublicScriptList;
