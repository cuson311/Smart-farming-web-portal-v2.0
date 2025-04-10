import { ScriptCardSkeleton } from "@/components/skeleton/ScriptCardSkeleton";
import ScriptCard from "./ScriptCard";
import { Script } from "@/types/script";
import { CardSkeletonGrid } from "@/components/skeleton/CardSkeletonGrid";
import Pagination from "@/components/ui/pagination";
import { useState } from "react";

interface ScriptListProps {
  scripts: Script[];
  toggleFavorite: (id: string, isFavorite: boolean) => void;
  loading: boolean;
}

const ITEMS_PER_PAGE = 6;

const ScriptList = ({ scripts, toggleFavorite, loading }: ScriptListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(scripts.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentScripts = scripts.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <CardSkeletonGrid count={6} component={<ScriptCardSkeleton />} />
      </div>
    );
  }

  if (!scripts || scripts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <h3 className="mb-2 text-lg font-semibold">No scripts found</h3>
        <p className="text-sm text-muted-foreground">
          Create a new script or try a different search query.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {currentScripts.map((script) => (
          <ScriptCard
            key={script._id}
            script={script}
            toggleFavorite={toggleFavorite}
          />
        ))}
      </div>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          className="mt-4"
        />
      )}
    </div>
  );
};

export default ScriptList;
