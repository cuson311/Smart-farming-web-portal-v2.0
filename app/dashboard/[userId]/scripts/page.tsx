"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useFetchScriptsList } from "@/hooks/useFetchUser";
import NewScriptDialog from "@/components/script/script-list/NewScript";
import ScriptList from "@/components/script/script-list/ScriptList";
import { Script } from "@/types/script";
import userApi from "@/api/userAPI";

const ScriptsPage = ({ params }: { params: { userId: string } }) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState<string>("");

  const {
    data: scripts,
    loading: scriptsListLoading,
    refetch,
  } = useFetchScriptsList(params.userId);

  // console.log("Scripts nè", scripts);

  const filteredScripts = scripts.filter(
    (script: Script) =>
      script.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      script.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFavorite = async (id: string, isFavorite: boolean) => {
    const action = isFavorite ? "remove" : "add";
    try {
      await userApi.favoriteScript(params.userId, id, action);
      toast({
        title: "Favorite updated",
        description: "Script favorite status has been updated.",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorite status.",
        variant: "destructive",
      });
    }
  };

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
          <NewScriptDialog />
        </div>
      </div>
      <ScriptTabs
        filteredScripts={filteredScripts}
        toggleFavorite={toggleFavorite}
        loading={scriptsListLoading}
      />
    </div>
  );
};

interface ScriptTabsProps {
  filteredScripts: Script[];
  toggleFavorite: (id: string, isFavorite: boolean) => void;
  loading: boolean;
}

const ScriptTabs = ({
  filteredScripts,
  toggleFavorite,
  loading,
}: ScriptTabsProps) => {
  return (
    <Tabs defaultValue="all">
      <TabsList>
        <TabsTrigger value="all">All Scripts</TabsTrigger>
        <TabsTrigger value="favorites">Favorites</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="border-none p-0 pt-4">
        <ScriptList
          scripts={filteredScripts}
          toggleFavorite={toggleFavorite}
          loading={loading}
        />
      </TabsContent>

      <TabsContent value="favorites" className="border-none p-0 pt-4">
        <ScriptList
          scripts={filteredScripts.filter((script) => script.favorite)}
          toggleFavorite={toggleFavorite}
          loading={loading}
        />
      </TabsContent>
    </Tabs>
  );
};
export default ScriptsPage;
