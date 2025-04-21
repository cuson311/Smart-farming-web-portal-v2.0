import { ScriptCardSkeleton } from "@/components/skeleton/ScriptCardSkeleton";
import ScriptCard from "./ScriptCard";
import { Script, ScriptsListOptions } from "@/types/script";
import { CardSkeletonGrid } from "@/components/skeleton/CardSkeletonGrid";
import Pagination from "@/components/ui/pagination";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

interface ScriptListProps {
  scripts: Script[];
  toggleFavorite: (
    id: string,
    isFavorite: boolean,
    refetch: (options?: ScriptsListOptions) => void
  ) => void;
  loading: boolean;
  refetch: (options?: ScriptsListOptions) => void;
}

const ScriptList = ({
  scripts,
  toggleFavorite,
  loading,
  refetch,
}: ScriptListProps) => {
  const t = useTranslations("dashboard.scripts.list");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  // Reset to page 1 if scripts array changes length
  useEffect(() => {
    setCurrentPage(1);
  }, [scripts.length]);

  const totalPages = Math.ceil(scripts.length / itemsPerPage);
  const paginatedScripts = scripts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <CardSkeletonGrid count={6} component={<ScriptCardSkeleton />} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!scripts || scripts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <h3 className="mb-2 text-lg font-semibold">
            {t("emptyState.title")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("emptyState.description")}
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {paginatedScripts.map((script) => (
              <ScriptCard
                key={script._id}
                script={script}
                toggleFavorite={(id, isFavorite) =>
                  toggleFavorite(id, isFavorite, refetch)
                }
              />
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
        </>
      )}
    </div>
  );
};

export default ScriptList;
