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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import modelApi from "@/api/modelAPI";
import {
  Model,
  ModelSchedule,
  ModelSchedulePlan,
  NewModelScheduleData,
} from "@/types/model";
import { DatePickerWithRange } from "@/components/ui/DatePickerWithRange";
import Pagination from "@/components/ui/pagination";
import { formatDate } from "@/lib/formatDate";

const SCHEDULE_OPTIONS = [
  {
    label: "Daily",
    value: "daily",
    cron: "0 0 * * *",
    description: "Run once a day at midnight",
  },
  {
    label: "Weekly",
    value: "weekly",
    cron: "0 0 * * 0",
    description: "Run once a week on Sunday",
  },
  {
    label: "Monthly",
    value: "monthly",
    cron: "0 0 1 * *",
    description: "Run once a month on the 1st",
  },
  {
    label: "Hourly",
    value: "hourly",
    cron: "0 * * * *",
    description: "Run once every hour",
  },
  {
    label: "Custom",
    value: "custom",
    cron: "",
    description: "Set a custom schedule",
  },
];

const ScheduleModelTab = ({ model }: { model: Model }) => {
  const params = useParams();
  const userId: string = Array.isArray(params.userId)
    ? params.userId[0]
    : params.userId;
  const modelId: string = model._id;

  const [schedule, setSchedule] = useState<ModelSchedule | null>(null);
  const [cronString, setCronString] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [schedulePlan, setSchedulePlan] = useState<ModelSchedulePlan[]>([]);
  const [scheduleType, setScheduleType] = useState<string>("daily");
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Add new state variables for pagination and sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    fetchSchedule();
  }, [modelId]);

  const fetchSchedule = async () => {
    try {
      const response = await modelApi.getModelSchedule(userId, modelId);
      setSchedule(response);
      if (response.schedule) {
        setCronString(response.schedule);
        // Try to match the cron string with predefined options
        const matchedOption = SCHEDULE_OPTIONS.find(
          (option) => option.cron === response.schedule
        );
        if (matchedOption) {
          setScheduleType(matchedOption.value);
          setShowCustomInput(false);
        } else {
          setScheduleType("custom");
          setShowCustomInput(true);
        }
      }
    } catch (error) {
      console.error("Error fetching schedule:", error);
      toast.error("Failed to fetch schedule");
    }
  };

  const handleScheduleTypeChange = (value: string) => {
    setScheduleType(value);
    if (value === "custom") {
      setShowCustomInput(true);
    } else {
      setShowCustomInput(false);
      const selectedOption = SCHEDULE_OPTIONS.find(
        (option) => option.value === value
      );
    }
  };

  const handleSetSchedule = async () => {
    if (!cronString) {
      toast.error("Please enter a cron expression");
      return;
    }

    setIsLoading(true);
    try {
      const scheduleData: NewModelScheduleData = {
        model_id: modelId,
        cron_string: cronString,
      };
      await modelApi.setModelSchedule(userId, scheduleData);
      await fetchSchedule();
      toast.success("Schedule set successfully");
    } catch (error) {
      console.error("Error setting schedule:", error);
      toast.error("Failed to set schedule");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnableSchedule = async () => {
    setIsLoading(true);
    try {
      await modelApi.setEnableSchedule(
        userId,
        modelId,
        !schedule?.enableSchedule
      );
      await fetchSchedule();
      toast.success("Schedule enabled successfully");
    } catch (error) {
      console.error("Error enabling schedule:", error);
      toast.error("Failed to enable schedule");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateRangeChange = async (range: { from?: Date; to?: Date }) => {
    setDateRange(range);
    setCurrentPage(1); // Reset to first page when date range changes
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
        toast.error("Failed to fetch schedule plan");
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
        <CardHeader>
          <CardTitle>Model Schedule</CardTitle>
          <CardDescription>
            Configure when this model should be automatically updated
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={schedule?.enableSchedule || false}
              onCheckedChange={handleEnableSchedule}
              disabled={isLoading}
            />
            <Label>Enable Scheduling</Label>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Schedule Type</Label>
              <RadioGroup
                value={scheduleType}
                onValueChange={handleScheduleTypeChange}
                className="grid grid-cols-2 gap-4"
              >
                {SCHEDULE_OPTIONS.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-2 p-4 border rounded-lg"
                  >
                    <RadioGroupItem
                      value={option.value}
                      id={option.value}
                      className="peer"
                    />
                    <Label
                      htmlFor={option.value}
                      className="flex flex-col cursor-pointer"
                    >
                      <span className="font-medium">{option.label}</span>
                      <span className="text-sm text-muted-foreground">
                        {option.description}
                      </span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {showCustomInput && (
              <div className="space-y-2">
                <Label>Custom Cron Expression</Label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="0 0 * * *"
                    value={cronString}
                    onChange={(e) => setCronString(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Use cron expression format (e.g., "0 0 * * *" for daily at
                  midnight)
                </p>
              </div>
            )}

            <Button
              onClick={handleSetSchedule}
              disabled={isLoading || !cronString}
              className="w-full"
            >
              Set Schedule
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row justify-between">
          <div>
            <CardTitle>Schedule Plan</CardTitle>
            <CardDescription>
              View upcoming scheduled runs for this model
            </CardDescription>
          </div>
          <div className="flex flex-col gap-4 items-end">
            <DatePickerWithRange onDateRangeChange={handleDateRangeChange} />
            <div className="flex items-center gap-2">
              <Label>Sort by:</Label>
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
                  <SelectItem value="asc">Oldest First</SelectItem>
                  <SelectItem value="desc">Latest First</SelectItem>
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
                          Name:{" "}
                          <span className="text-sm text-muted-foreground">
                            {plan.name}
                          </span>
                        </div>
                        {formatDate(plan.time)}
                      </h3>

                      <h3 className="mb-1 text-sm font-medium line-clamp-2">
                        Description:{" "}
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
                <p className="mt-2 text-muted-foreground">
                  No scheduled runs found in the selected date range
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduleModelTab;
