"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useFetchModelsList } from "@/hooks/useFetchUser";
import { Model } from "@/types/model";
import ModelList from "@/components/model/model-list/ModelList";
import NewModelDialog from "@/components/model/model-list/NewModel";
import { useTranslations } from "next-intl"; // Import next-intl

const ModelPage = ({ params }: { params: { userId: string } }) => {
  const { toast } = useToast();
  const t = useTranslations("dashboard.models"); // Use translations for this page
  const [searchQuery, setSearchQuery] = useState<string>("");

  const {
    data: models,
    loading: modelsListLoading,
    refetch: refetchAllModels,
  } = useFetchModelsList(params.userId);

  const filteredModels = models.filter(
    (model: Model) =>
      model.alt_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("searchPlaceholder")}
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <NewModelDialog onModelCreated={refetchAllModels} />
        </div>
      </div>
      <ModelList models={filteredModels} loading={modelsListLoading} />
    </div>
  );
};
export default ModelPage;
