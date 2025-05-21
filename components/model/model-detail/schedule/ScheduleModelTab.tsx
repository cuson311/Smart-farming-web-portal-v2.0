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
import { Calendar } from "lucide-react";
import { toast } from "sonner";
import modelApi from "@/api/modelAPI";
import { Model, ModelSchedulePlan } from "@/types/model";
import { DatePicker } from "@/components/ui/date-picker";
import Pagination from "@/components/ui/pagination";
import { formatDate } from "@/lib/formatDate";
import { useTranslations } from "next-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { DatePickerWithRange } from "@/components/ui/DatePickerWithRange";
import { Button } from "@/components/ui/button";

const ScheduleModelTab = () => {
  const t = useTranslations("dashboard.models.schedule");
  const params = useParams();
  const userId: string = Array.isArray(params.userId)
    ? params.userId[0]
    : params.userId;

  const getCurrentDate = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(today.getDate()).padStart(2, "0")}`;
  };

  const [endDate, setEndDate] = useState<string>(getCurrentDate());
  const [schedulePlan, setSchedulePlan] = useState<ModelSchedulePlan[]>([]);

  // Add new state variables for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState<string>(getCurrentDate());
  const [sortField, setSortField] = useState<"model_name" | "time">("time");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  useEffect(() => {
    const fetchInitialSchedulePlan = async () => {
      try {
        const response = await modelApi.getModelSchedulePlan(userId, endDate);
        setSchedulePlan(response);
      } catch (error) {
        console.error("Error fetching initial schedule plan:", error);
        toast.error(t("toast.planFetchError"), {
          description: t("toast.planFetchErrorDesc"),
        });
      }
    };

    fetchInitialSchedulePlan();
  }, [userId, endDate, t]);

  console.log("schedulePlan", schedulePlan);
  console.log("endDate", endDate);

  const handleDateChange = async (date: Date | undefined) => {
    if (date) {
      const formattedDate = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      setEndDate(formattedDate);
      setCurrentPage(1);
      try {
        const response = await modelApi.getModelSchedulePlan(
          userId,
          formattedDate
        );
        setSchedulePlan(response);
      } catch (error) {
        console.error("Error fetching schedule plan:", error);
        toast.error(t("toast.planFetchError"), {
          description: t("toast.planFetchErrorDesc"),
        });
      }
    } else {
      setEndDate(getCurrentDate());
      setSchedulePlan([]);
    }
  };

  // Filter and sort logic
  const filteredAndSortedPlans = schedulePlan
    .filter((plan) => {
      // Search filter
      const matchesSearch = plan.model_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // Date range filter
      const planDate = new Date(plan.time);
      const matchesDateRange =
        !dateRange?.from || !dateRange?.to
          ? true
          : planDate >= dateRange.from && planDate <= dateRange.to;

      return matchesSearch && matchesDateRange;
    })
    .sort((a, b) => {
      if (sortField === "model_name") {
        return sortOrder === "asc"
          ? a.model_name.localeCompare(b.model_name)
          : b.model_name.localeCompare(a.model_name);
      } else {
        return sortOrder === "asc"
          ? new Date(a.time).getTime() - new Date(b.time).getTime()
          : new Date(b.time).getTime() - new Date(a.time).getTime();
      }
    });

  // Reset filters when needed
  const resetFilters = () => {
    setSearchTerm("");
    setDateRange({ from: undefined, to: undefined });
    setSortField("time");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  // Update pagination to use filtered data
  const totalPages = Math.ceil(filteredAndSortedPlans.length / itemsPerPage);
  const paginatedSchedulePlan = filteredAndSortedPlans.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row justify-between">
          <div>
            <CardTitle className="mb-2">{t("plan.title")}</CardTitle>
            <CardDescription>{t("plan.descriptionSection")}</CardDescription>
          </div>
          {/* DatePicker for endDate (API fetch) */}
          <div className="flex gap-2 items-center">
            <h3>{t("selectEndDate")}</h3>
            <DatePicker
              date={endDate ? new Date(endDate) : undefined}
              onSelect={handleDateChange}
              placeholder={t("table.endDateAPI")}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Filters Section */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="font-semibold text-base">
                  {t("table.filterTitle")}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t("table.searchPlaceholder")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>

                {/* Date Range Picker (UI filter only) */}
                <DatePickerWithRange
                  className="w-full"
                  onDateRangeChange={setDateRange}
                />
                <div className="flex gap-4 col-span-2">
                  {/* Sort Field Select */}
                  <div className="flex flex-row flex-1 items-center gap-2">
                    <label className="text-sm font-medium text-nowrap ">
                      {t("table.sortBy")}
                    </label>
                    <Select
                      value={sortField}
                      onValueChange={(value: "model_name" | "time") =>
                        setSortField(value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("table.sortBy")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="model_name">
                          {t("table.sortByName")}
                        </SelectItem>
                        <SelectItem value="time">
                          {t("table.sortByTime")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={sortOrder}
                      onValueChange={(value: "asc" | "desc") =>
                        setSortOrder(value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("table.sortOrder")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asc">
                          {t("table.ascending")}
                        </SelectItem>
                        <SelectItem value="desc">
                          {t("table.descending")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    className="w-fit"
                    variant="outline"
                    size="default"
                    onClick={resetFilters}
                  >
                    {t("table.resetFilters")}
                  </Button>
                </div>
              </div>
            </div>

            {/* Table Section */}
            {paginatedSchedulePlan.length > 0 ? (
              <div className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("table.modelName")}</TableHead>
                        <TableHead className="text-right">
                          {t("table.scheduledTime")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedSchedulePlan.map((plan, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {plan.model_name}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            {formatDate(plan.time, "UTC")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50" />
                <p className="mt-2 text-muted-foreground">{t("plan.noRuns")}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduleModelTab;
