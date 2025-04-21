import ModelCard from "./ModelCard";
import ScriptCard from "./ModelCard";
import { Model } from "@/types/model";
import ModelCardSkeleton from "../../skeleton/ModelCardSkeleton";
import { CardSkeletonGrid } from "@/components/skeleton/CardSkeletonGrid";
import Pagination from "@/components/ui/pagination";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState, useMemo } from "react";

interface ModelListProps {
  models: Model[];
  loading: boolean;
}

const ModelList = ({ models, loading }: ModelListProps) => {
  const t = useTranslations("dashboard.models");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [sortField, setSortField] = useState<
    "creation_timestamp" | "last_updated_timestamp"
  >("last_updated_timestamp");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Sort the models
  const sortedModels = useMemo(() => {
    return [...models].sort((a, b) => {
      const dateA = new Date(a[sortField] || "").getTime();
      const dateB = new Date(b[sortField] || "").getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [models, sortField, sortOrder]);

  const totalPages = Math.ceil(sortedModels.length / itemsPerPage);
  const paginatedModels = sortedModels.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSortChange = (
    field: "creation_timestamp" | "last_updated_timestamp",
    order: "asc" | "desc"
  ) => {
    setSortField(field);
    setSortOrder(order);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <CardSkeletonGrid count={6} component={<ModelCardSkeleton />} />
      </div>
    );
  }

  if (!models || models.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <h3 className="mb-2 text-lg font-semibold">{t("emptyState.title")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("emptyState.description")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        <Label>{t("sortBy")}:</Label>
        <Select
          value={sortField}
          onValueChange={(
            value: "creation_timestamp" | "last_updated_timestamp"
          ) => handleSortChange(value, sortOrder)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("selectField")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="creation_timestamp">
              {t("creationDate")}
            </SelectItem>
            <SelectItem value="last_updated_timestamp">
              {t("lastUpdate")}
            </SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={sortOrder}
          onValueChange={(value: "asc" | "desc") =>
            handleSortChange(sortField, value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("selectOrder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">{t("latestFirst")}</SelectItem>
            <SelectItem value="asc">{t("oldestFirst")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {paginatedModels.map((model) => (
          <ModelCard key={model._id} model={model} />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default ModelList;
