import { ScriptCardSkeleton } from "@/components/skeleton/ScriptCardSkeleton";
import ScriptCard from "./ScriptCard";
import { Script } from "@/types/script";
import { CardSkeletonGrid } from "@/components/skeleton/CardSkeletonGrid";
import Pagination from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState, useMemo } from "react";

interface ScriptListProps {
  scripts: Script[];
  toggleFavorite: (
    id: string,
    isFavorite: boolean,
    refetch?: () => void
  ) => void;
  loading: boolean;
  refetch?: () => void;
}

const ScriptList = ({
  scripts,
  toggleFavorite,
  loading,
  refetch,
}: ScriptListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [sortField, setSortField] = useState<"createdAt" | "updatedAt">(
    "updatedAt"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Sort the scripts
  const sortedScripts = useMemo(() => {
    return [...scripts].sort((a, b) => {
      const dateA = new Date(a[sortField] || "").getTime();
      const dateB = new Date(b[sortField] || "").getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [scripts, sortField, sortOrder]);

  const totalPages = Math.ceil(sortedScripts.length / itemsPerPage);
  const paginatedScripts = sortedScripts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSortChange = (
    field: "createdAt" | "updatedAt",
    order: "asc" | "desc"
  ) => {
    setSortField(field);
    setSortOrder(order);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

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
      <div className="flex items-center justify-end gap-2">
        <Label>Sort by:</Label>
        <Select
          value={sortField}
          onValueChange={(value: "createdAt" | "updatedAt") =>
            handleSortChange(value, sortOrder)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select field" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Creation Date</SelectItem>
            <SelectItem value="updatedAt">Last Update</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={sortOrder}
          onValueChange={(value: "asc" | "desc") =>
            handleSortChange(sortField, value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Latest First</SelectItem>
            <SelectItem value="asc">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {paginatedScripts.map((script) => (
          <ScriptCard
            key={script._id}
            script={script}
            toggleFavorite={toggleFavorite}
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
    </div>
  );
};

export default ScriptList;
