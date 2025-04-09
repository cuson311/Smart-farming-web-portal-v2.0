"use client";

import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { Search, ArrowLeft, ShieldAlert, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  useFetchBookmarkList,
  useFetchScriptsList,
  useFetchSharedScripts,
} from "@/hooks/useFetchUser";
import NewScriptDialog from "@/components/script/script-list/NewScript";
import ScriptList from "@/components/script/script-list/ScriptList";
import { Script } from "@/types/script";
import userApi from "@/api/userAPI";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { UserProfile } from "@/types/user";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

// PublicScriptList Component
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
  searchQuery: string;
}

const PublicScriptList = ({
  toggleFavorite,
  state,
  updateState,
  searchQuery,
}: PublicScriptListProps) => {
  const { toast } = useToast();

  // Destructure state for cleaner code
  const { userSearchTerm, searchResults, showSearchResults, selectedUser } =
    state;

  // Use the hook with the selected user's ID
  const {
    data: scripts,
    loading: scriptLoading,
    refetch: refetchScripts,
  } = useFetchScriptsList(selectedUser?.id || "");

  // Filter scripts based on search query
  const filterScript = (scripts: Script[]) => {
    return scripts.filter(
      (script: Script) =>
        script.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        script.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredScripts = filterScript(scripts);

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
        searchResults: response,
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

  // Handle favorite toggle with refetch
  const handleToggleFavorite = (id: string, isFavorite: boolean) => {
    toggleFavorite(id, isFavorite, refetchScripts);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          {selectedUser ? (
            <p className="text-muted-foreground">
              Showing scripts by {selectedUser.name}
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 h-6 py-0"
                onClick={() => updateState({ selectedUser: null })}
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            </p>
          ) : null}
        </div>

        <div className="flex gap-2">
          <Input
            value={userSearchTerm}
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
            handleSelectUser={handleSelectUser}
            handleCloseResults={() => updateState({ showSearchResults: false })}
          />
        )}
      </div>

      {/* Display scripts for selected user */}
      {selectedUser && (
        <ScriptList
          scripts={filteredScripts}
          toggleFavorite={handleToggleFavorite}
          loading={scriptLoading}
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

// This component will be rendered on invalid tab routes
const NotFoundComponent = () => {
  const router = useRouter();
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userId = localStorage.getItem("userId") || "";
      setUserId(userId);
    }
  }, []);

  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="text-2xl font-bold">Page Not Found</h1>
      </div>

      <Alert variant="destructive" className="bg-destructive/10">
        <ShieldAlert className="h-5 w-5" />
        <AlertTitle className="mb-2">Invalid Tab</AlertTitle>
        <AlertDescription>
          The requested tab does not exist. Please select a valid tab or return
          to the dashboard.
        </AlertDescription>
        <div className="mt-4">
          <Button asChild>
            <Link href={`/dashboard/${userId}/scripts?tab=all`}>
              Return to my scripts
            </Link>
          </Button>
        </div>
      </Alert>
    </div>
  );
};

// ScriptsPage Component
const ScriptsPage = ({ params }: { params: { userId: string } }) => {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  // Updated publicScriptState to not include scriptSearchQuery
  const [publicScriptState, setPublicScriptState] = useState({
    userSearchTerm: "",
    searchResults: [] as UserProfile[],
    showSearchResults: false,
    selectedUser: null as { id: string; name: string } | null,
  });

  // Define valid tabs
  const validTabs = ["all", "favorites", "shared-scripts", "public-scripts"];

  // Changed this line to require a tab parameter that is valid
  const isValidTab = tabParam && validTabs.includes(tabParam);
  const tabName = isValidTab ? tabParam : "code";

  // Handle tab change by updating query parameter
  const handleTabChange = (value: string) => {
    const newUrl = `/dashboard/${params.userId}/scripts?tab=${value}`;
    router.replace(newUrl);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userId = localStorage.getItem("userId") || "";
      setUserId(userId);
    }
  }, []);

  const {
    data: allScripts,
    loading: allScriptsListLoading,
    refetch: refetchAllScripts,
  } = useFetchScriptsList(params.userId);

  const {
    data: sharedScripts,
    loading: sharedScriptsListLoading,
    refetch: refetchSharedScripts,
  } = useFetchSharedScripts(userId);

  const {
    data: favoriteScripts,
    loading: favoriteScriptsListLoading,
    refetch: refetchFavoriteScripts,
  } = useFetchBookmarkList(userId);

  const filterScript = (scripts: Script[]) => {
    return scripts.filter(
      (script: Script) =>
        script.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        script.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredAllScripts = filterScript(allScripts);
  const filteredSharedScripts = filterScript(sharedScripts);
  const filteredFavoriteScripts = filterScript(favoriteScripts);

  const toggleFavorite = async (
    id: string,
    isFavorite: boolean,
    refetch?: () => void
  ) => {
    const action = isFavorite ? "remove" : "add";
    try {
      await userApi.favoriteScript(userId, id, action);
      toast({
        title: "Favorite updated",
        description: "Script favorite status has been updated.",
      });
      refetchAllScripts();
      refetchSharedScripts();
      refetchFavoriteScripts();
      refetch?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorite status.",
        variant: "destructive",
      });
    }
  };

  // Handler for updating publicScriptState
  const updatePublicScriptState = (
    newState: Partial<typeof publicScriptState>
  ) => {
    setPublicScriptState((prevState) => ({
      ...prevState,
      ...newState,
    }));
  };

  // If invalid tab, render NotFound component
  if (!isValidTab) {
    return <NotFoundComponent />;
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Scripts</h1>
        <div className="flex items-center gap-2">
          {/* Make search input visible for all tabs */}
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search scripts..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <NewScriptDialog onScriptCreated={refetchAllScripts} />
        </div>
      </div>
      <Tabs value={tabName} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="all">All Scripts</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="shared-scripts">Shared Scripts</TabsTrigger>
          <TabsTrigger value="public-scripts">Public Scripts</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="border-none p-0 pt-4">
          <ScriptList
            scripts={filteredAllScripts}
            toggleFavorite={toggleFavorite}
            loading={allScriptsListLoading}
          />
        </TabsContent>

        <TabsContent value="favorites" className="border-none p-0 pt-4">
          <ScriptList
            scripts={filteredFavoriteScripts}
            toggleFavorite={toggleFavorite}
            loading={favoriteScriptsListLoading}
          />
        </TabsContent>

        <TabsContent value="shared-scripts" className="border-none p-0 pt-4">
          <ScriptList
            scripts={filteredSharedScripts}
            toggleFavorite={toggleFavorite}
            loading={sharedScriptsListLoading}
          />
        </TabsContent>

        <TabsContent value="public-scripts" className="border-none p-0 pt-4">
          <PublicScriptList
            toggleFavorite={toggleFavorite}
            state={publicScriptState}
            updateState={updatePublicScriptState}
            searchQuery={searchQuery}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScriptsPage;
