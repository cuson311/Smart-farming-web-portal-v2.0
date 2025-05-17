import ModelCard from "./ModelCard";
import { RegisteredModel } from "@/types/model";
import ModelCardSkeleton from "../../skeleton/ModelCardSkeleton";
import { CardSkeletonGrid } from "@/components/skeleton/CardSkeletonGrid";
import Pagination from "@/components/ui/pagination";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface ModelListProps {
  models: RegisteredModel[];
  loading: boolean;
}

const ModelList = ({ models, loading }: ModelListProps) => {
  const t = useTranslations("dashboard.models");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  const totalPages = Math.ceil(models.length / itemsPerPage);
  const paginatedModels = models.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {paginatedModels.map((model) => (
          <ModelCard key={model.name} model={model} />
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
