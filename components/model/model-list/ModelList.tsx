import ModelCard from "./ModelCard";
import ScriptCard from "./ModelCard";
import { Model } from "@/types/model";
import ModelCardSkeleton from "../../skeleton/ModelCardSkeleton";
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
import { useState, useMemo, useEffect } from "react";
import { DatePickerWithRange } from "@/components/ui/DatePickerWithRange";

interface ModelListProps {
  models: Model[];
  toggleFavorite: (id: string, isFavorite: boolean) => void;
  loading: boolean;
}

const ModelList = ({ models, toggleFavorite, loading }: ModelListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [sortField, setSortField] = useState<
    "creation_timestamp" | "last_updated_timestamp"
  >("last_updated_timestamp");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>(() => {
    const today = new Date();
    return { from: today, to: today };
  });

  // Set initial date range on mount
  useEffect(() => {
    const today = new Date();
    handleDateRangeChange({ from: today, to: today });
  }, []);

  // Filter models based on date range
  const filteredModels = useMemo(() => {
    if (!dateRange.from || !dateRange.to) return models;

    const fromDate = new Date(dateRange.from);
    fromDate.setHours(0, 0, 0, 0);
    const toDate = new Date(dateRange.to);
    toDate.setHours(23, 59, 59, 999);

    return models.filter((model) => {
      const modelDate = new Date(model[sortField] || "");
      return modelDate >= fromDate && modelDate <= toDate;
    });
  }, [models, dateRange, sortField]);

  // Sort the filtered models
  const sortedModels = [...filteredModels].sort((a, b) => {
    const dateA = new Date(a[sortField] || "").getTime();
    const dateB = new Date(b[sortField] || "").getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

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

  const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
    setDateRange(range);
    setCurrentPage(1); // Reset to first page when date range changes
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
        <h3 className="mb-2 text-lg font-semibold">No models found</h3>
        <p className="text-sm text-muted-foreground">
          Create a new model or try a different search query.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        <DatePickerWithRange onDateRangeChange={handleDateRangeChange} />
        <Label>Sort by:</Label>
        <Select
          value={sortField}
          onValueChange={(
            value: "creation_timestamp" | "last_updated_timestamp"
          ) => handleSortChange(value, sortOrder)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select field" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="creation_timestamp">Creation Date</SelectItem>
            <SelectItem value="last_updated_timestamp">Last Update</SelectItem>
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
        {paginatedModels.map((model) => (
          <ModelCard
            key={model._id}
            model={model}
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

export default ModelList;
