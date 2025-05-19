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
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import modelApi from "@/api/modelAPI";
import { Model, ModelSchedulePlan } from "@/types/model";
import { DatePickerWithRange } from "@/components/ui/DatePickerWithRange";
import Pagination from "@/components/ui/pagination";
import { formatDate } from "@/lib/formatDate";
import { useTranslations } from "next-intl";

const ScheduleModelTab = ({ model }: { model: Model }) => {
  const t = useTranslations("dashboard.models.schedule");
  const params = useParams();
  const userId: string = Array.isArray(params.userId)
    ? params.userId[0]
    : params.userId;
  const modelId: string = model._id;

  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [schedulePlan, setSchedulePlan] = useState<ModelSchedulePlan[]>([]);

  // Add new state variables for pagination and sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleDateRangeChange = async (range: { from?: Date; to?: Date }) => {
    setDateRange(range);
    setCurrentPage(1);
    if (range.from && range.to) {
      try {
        const formatDate = (date: Date) => {
          return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
            2,
            "0"
          )}-${String(date.getDate()).padStart(2, "0")}`;
        };

        const fromDate = formatDate(range.from);
        const toDate = formatDate(range.to);
        const response = await modelApi.getModelSchedulePlan(
          userId,
          fromDate,
          toDate
        );
        setSchedulePlan(response);
      } catch (error) {
        console.error("Error fetching schedule plan:", error);
        toast.error(t("toast.planFetchError"), {
          description: t("toast.planFetchErrorDesc"),
        });
      }
    }
  };

  // Add sorting and pagination logic
  const sortedSchedulePlan = [...schedulePlan].sort((a, b) => {
    const dateA = new Date(a.time).getTime();
    const dateB = new Date(b.time).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const totalPages = Math.ceil(sortedSchedulePlan.length / itemsPerPage);
  const paginatedSchedulePlan = sortedSchedulePlan.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSortChange = (order: "asc" | "desc") => {
    setSortOrder(order);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row justify-between">
          <div>
            <CardTitle>{t("plan.title")}</CardTitle>
            <CardDescription>{t("plan.descriptionSection")}</CardDescription>
          </div>
          <div className="flex flex-col gap-4 items-end">
            <DatePickerWithRange onDateRangeChange={handleDateRangeChange} />
            <div className="flex items-center gap-2">
              <Label>{t("plan.sortBy")}</Label>
              <Select
                value={sortOrder}
                onValueChange={(value: "asc" | "desc") =>
                  handleSortChange(value)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select sort order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">{t("plan.oldestFirst")}</SelectItem>
                  <SelectItem value="desc">{t("plan.latestFirst")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paginatedSchedulePlan.length > 0 ? (
              <>
                {paginatedSchedulePlan.map((plan, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Calendar className="h-5 w-5 text-primary" />
                    <div className="flex-1 space-y-1">
                      <h3 className="flex flex-row justify-between mb-1 text-sm font-medium line-clamp-1">
                        <div>
                          {t("plan.name")}{" "}
                          <span className="text-sm text-muted-foreground">
                            {plan.name}
                          </span>
                        </div>
                        {formatDate(plan.time)}
                      </h3>

                      <h3 className="mb-1 text-sm font-medium line-clamp-2">
                        {t("plan.description")}{" "}
                        <span className="text-sm text-muted-foreground">
                          {plan.description}
                        </span>
                      </h3>
                    </div>
                  </div>
                ))}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    className="mt-4"
                  />
                )}
              </>
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
