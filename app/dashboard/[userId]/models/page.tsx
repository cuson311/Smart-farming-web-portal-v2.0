"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useFetchModelsList } from "@/hooks/useFetchUser";
import NewScriptDialog from "@/components/script/script-list/NewScript";
import { Model } from "@/types/model";
import ModelList from "@/components/model/model-list/ModelList";

const ModelPage = ({ params }: { params: { userId: string } }) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState<string>("");

  const {
    data: models,
    loading: modelsListLoading,
    refetch,
  } = useFetchModelsList(params.userId);

  const filteredModels = models.filter(
    (model: Model) =>
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFavorite = async (id: string, isFavorite: boolean) => {
    // const action = isFavorite ? "remove" : "add";
    // try {
    //   await userApi.favoriteScript(params.userId, id, action);
    //   toast({
    //     title: "Favorite updated",
    //     description: "Model favorite status has been updated.",
    //   });
    //   refetch();
    // } catch (error) {
    //   toast({
    //     title: "Error",
    //     description: "Failed to update favorite status.",
    //     variant: "destructive",
    //   });
    // }
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Models</h1>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search models..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <NewScriptDialog />
        </div>
      </div>
      <ScriptTabs
        filteredModels={filteredModels}
        toggleFavorite={toggleFavorite}
        loading={modelsListLoading}
      />
    </div>
  );
};

interface ModelTabsProps {
  filteredModels: Model[];
  toggleFavorite: (id: string, isFavorite: boolean) => void;
  loading: boolean;
}

const ScriptTabs = ({
  filteredModels,
  toggleFavorite,
  loading,
}: ModelTabsProps) => {
  return (
    <Tabs defaultValue="all">
      <TabsList>
        <TabsTrigger value="all">All Models</TabsTrigger>
        <TabsTrigger value="favorites">Favorites</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="border-none p-0 pt-4">
        <ModelList
          models={filteredModels}
          toggleFavorite={toggleFavorite}
          loading={loading}
        />
      </TabsContent>

      <TabsContent value="favorites" className="border-none p-0 pt-4">
        <ModelList
          // models={filteredModels.filter((model) => model.favorite)}
          models={filteredModels}
          toggleFavorite={toggleFavorite}
          loading={loading}
        />
      </TabsContent>
    </Tabs>
  );
};
export default ModelPage;
