"use client";

import { useEffect, useState } from "react";
import { Search, ArrowLeft, ShieldAlert } from "lucide-react";
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

const ScriptsPage = ({ params }: { params: { userId: string } }) => {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  // Define valid tabs
  const validTabs = ["all", "favorites", "shared-scripts"];

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

  const toggleFavorite = async (id: string, isFavorite: boolean) => {
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
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorite status.",
        variant: "destructive",
      });
    }
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
      <ScriptTabs
        filteredAllScripts={filteredAllScripts}
        filteredSharedScripts={filteredSharedScripts}
        filteredFavoriteScripts={filteredFavoriteScripts}
        toggleFavorite={toggleFavorite}
        loading={allScriptsListLoading}
        sharedLoading={sharedScriptsListLoading}
        favoriteLoading={favoriteScriptsListLoading}
        activeTab={tabName}
        onTabChange={handleTabChange}
      />
    </div>
  );
};

interface ScriptTabsProps {
  filteredAllScripts: Script[];
  filteredSharedScripts: Script[];
  filteredFavoriteScripts: Script[];
  toggleFavorite: (id: string, isFavorite: boolean) => void;
  loading: boolean;
  sharedLoading: boolean;
  favoriteLoading: boolean;
  activeTab: string;
  onTabChange: (value: string) => void;
}

const ScriptTabs = ({
  filteredAllScripts,
  filteredSharedScripts,
  filteredFavoriteScripts,
  toggleFavorite,
  loading,
  sharedLoading,
  favoriteLoading,
  activeTab,
  onTabChange,
}: ScriptTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList>
        <TabsTrigger value="all">All Scripts</TabsTrigger>
        <TabsTrigger value="favorites">Favorites</TabsTrigger>
        <TabsTrigger value="shared-scripts">Shared Scripts</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="border-none p-0 pt-4">
        <ScriptList
          scripts={filteredAllScripts}
          toggleFavorite={toggleFavorite}
          loading={loading}
        />
      </TabsContent>

      <TabsContent value="favorites" className="border-none p-0 pt-4">
        <ScriptList
          scripts={filteredFavoriteScripts}
          toggleFavorite={toggleFavorite}
          loading={favoriteLoading}
        />
      </TabsContent>

      <TabsContent value="shared-scripts" className="border-none p-0 pt-4">
        <ScriptList
          scripts={filteredSharedScripts}
          toggleFavorite={toggleFavorite}
          loading={sharedLoading}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ScriptsPage;
