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

  // Simplified pagination logic
  const totalPages = Math.ceil(schedulePlan.length / itemsPerPage);
  const paginatedSchedulePlan = schedulePlan.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row justify-between">
          <div>
            <CardTitle>{t("plan.title")}</CardTitle>
            <CardDescription>{t("plan.descriptionSection")}</CardDescription>
          </div>
          <div className="flex flex-col gap-4 items-end">
            <DatePicker
              date={endDate ? new Date(endDate) : undefined}
              onSelect={handleDateChange}
              placeholder="Chọn ngày kết thúc"
            />
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
                            {plan.model_name}
                          </span>
                        </div>
                        {formatDate(plan.time)}
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
