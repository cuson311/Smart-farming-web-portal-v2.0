"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  useFetchModelsList,
  useFetchSubscribedModels,
} from "@/hooks/useFetchUser";
import { ModelsListOptions } from "@/types/model";
import ModelList from "@/components/model/model-list/ModelList";

import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ModelPage = () => {
  const { toast } = useToast();
  const t = useTranslations("dashboard.models");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filters, setFilters] = useState<ModelsListOptions>({
    max_results: 10,
    order_by: "name ASC",
    filter: "",
  });
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId") || "";
      setUserId(storedUserId);
    }
  }, []);

  const {
    data: models,
    loading: modelsListLoading,
    refetch: refetchAllModels,
  } = useFetchModelsList(filters);

  const {
    data: subscribedModels,
    loading: subscribedModelsLoading,
    refetch: refetchSubscribedModels,
  } = useFetchSubscribedModels(userId);

  // Effect to update search filter when search query changes
  useEffect(() => {
    const searchFilter = searchQuery ? `name LIKE '%${searchQuery}%'` : "";
    setFilters((prev) => ({
      ...prev,
      filter: searchFilter,
    }));
  }, [searchQuery]);

  // Effect to refetch data when filters change
  useEffect(() => {
    console.log("Current filters:", filters);
    refetchAllModels(filters);
  }, [filters, refetchAllModels]);

  const handleFilterChange = (
    key: keyof ModelsListOptions,
    value: string | number
  ) => {
    console.log("Filter changed:", key, value);
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubscribedModelsChange = () => {
    refetchAllModels(filters);
    refetchSubscribedModels();
  };

  const handleSearch = () => {
    refetchAllModels(filters);
  };
  console.log("models", models);
  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
      </div>
      <div className="flex flex-col gap-8 md:flex-row items-center justify-between bg-muted/30 rounded-lg p-4">
        <div className="flex flex-wrap gap-4 items-center flex-grow">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("searchPlaceholder")}
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          {/* <NewModelDialog onModelCreated={refetchAllModels} /> */}
        </div>
        <div className="flex gap-8">
          <div className="flex flex-wrap gap-4 w-full items-center md:w-auto">
            <span className="text-sm font-medium">
              {t("filter.resultsPerPage")}:
            </span>
            <Select
              value={filters.max_results?.toString() ?? "10"}
              onValueChange={(value) =>
                handleFilterChange("max_results", parseInt(value))
              }
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-wrap gap-4 w-full items-center md:w-auto">
            <span className="text-sm font-medium">{t("filter.sortBy")}:</span>
            <Select
              value={filters.order_by ?? "name ASC"}
              onValueChange={(value) => {
                console.log("Sort value changed:", value);
                handleFilterChange("order_by", value);
              }}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name ASC">{t("filter.nameAsc")}</SelectItem>
                <SelectItem value="name DESC">
                  {t("filter.nameDesc")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <ModelList
        models={models?.registered_models || []}
        subscribedModels={subscribedModels}
        loading={modelsListLoading || subscribedModelsLoading}
        onSubscribedModelsChange={handleSubscribedModelsChange}
      />
    </div>
  );
};

export default ModelPage;
