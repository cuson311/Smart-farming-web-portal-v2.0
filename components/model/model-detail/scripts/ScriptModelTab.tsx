"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

// Assuming you'll create this API client in a similar way
import modelApi from "@/api/modelAPI";
import { Model, ScriptModel } from "@/types/model";
import { DatePickerWithRange } from "@/components/ui/DatePickerWithRange";
import Pagination from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { formatDate } from "@/lib/formatDate";

const ScriptModelTab = ({ model }: { model: Model }) => {
  const params = useParams();
  const userId: string = Array.isArray(params.userId)
    ? params.userId[0]
    : params.userId;
  const modelId: string = model._id;

  const [scripts, setScripts] = useState<ScriptModel[]>([]);
  const [filteredScripts, setFilteredScripts] = useState<ScriptModel[]>();
  const [scriptLoading, setScriptLoading] = useState(false);
  const [scriptError, setScriptError] = useState<any>(false);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortField, setSortField] = useState<"createdAt" | "updatedAt">(
    "createdAt"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  console.log("scripts", scripts);

  useEffect(() => {
    if (!userId || !modelId) {
      setScriptError("User ID or Model Name is missing");
      setScriptLoading(false);
      return;
    }

    const fetchVersions = async () => {
      setScriptLoading(true);
      try {
        const response = await modelApi.getScriptsModel(userId, modelId);
        setScripts(response);
        setFilteredScripts(response.model_versions);
      } catch (err) {
        setScriptError("Error fetching model scripts");
        console.error("Error fetching model scripts:", err);
      } finally {
        setScriptLoading(false);
      }
    };

    fetchVersions();
  }, [modelId]);

  // Filter scripts based on date range
  useEffect(() => {
    if (!dateRange.from || !dateRange.to) {
      setFilteredScripts(scripts);
      setCurrentPage(1); // Reset to first page when date range changes
      return;
    }

    const filtered = scripts.filter((version) => {
      const versionDate = new Date(version.updatedAt);
      return versionDate >= dateRange.from! && versionDate <= dateRange.to!;
    });

    setFilteredScripts(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [dateRange, scripts]);

  // Sort the filtered scripts
  const sortedScripts = [...(filteredScripts || [])].sort((a, b) => {
    const dateA = new Date(a[sortField]).getTime();
    const dateB = new Date(b[sortField]).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const totalPages = Math.ceil(sortedScripts.length / itemsPerPage);
  const paginatedVersions = sortedScripts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
    setDateRange(range);
  };

  const handleSortChange = (
    field: "createdAt" | "updatedAt",
    order: "asc" | "desc"
  ) => {
    setSortField(field);
    setSortOrder(order);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="mb-2">Associated Scripts</CardTitle>
          <CardDescription>Scripts belong to this model</CardDescription>
        </div>
        <div className="flex flex-col gap-4 items-end">
          <DatePickerWithRange onDateRangeChange={handleDateRangeChange} />
          <div className="flex items-center gap-2">
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
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-8">
          {paginatedVersions?.map((item: ScriptModel, index: number) => (
            <div key={index}>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-semibold">Version {item.version}</span>
              </div>
              <Card>
                <CardContent className="p-4 grid grid-cols-2 gap-2">
                  <div className="flex gap-1">
                    <span className="mb-1 text-sm font-medium">Version:</span>
                    <span className="text-sm text-muted-foreground">
                      {item.version}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <span className="mb-1 text-sm font-medium">
                      Model Version:
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {item.model_version}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <span className="mb-1 text-sm font-medium">
                      Created At:
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <span className="mb-1 text-sm font-medium">
                      Lasted Update:
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(item.updatedAt)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
          {filteredScripts?.length === 0 && (
            <div className="text-center text-muted-foreground py-4">
              No scripts found in the selected date range
            </div>
          )}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              className="mt-4"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScriptModelTab;
