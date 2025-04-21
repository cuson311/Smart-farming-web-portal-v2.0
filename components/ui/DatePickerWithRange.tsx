"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerWithRangeProps {
  onDateRangeChange?: (range: { from?: Date; to?: Date }) => void;
  className?: string;
}

export function DatePickerWithRange({
  onDateRangeChange,
  className,
}: DatePickerWithRangeProps) {
  const t = useTranslations("common.datePicker");
  const [date, setDate] = React.useState<DateRange | undefined>();

  const months = [
    t("months.january"),
    t("months.february"),
    t("months.march"),
    t("months.april"),
    t("months.may"),
    t("months.june"),
    t("months.july"),
    t("months.august"),
    t("months.september"),
    t("months.october"),
    t("months.november"),
    t("months.december"),
  ];

  const weekDays = [
    t("weekDays.sunday"),
    t("weekDays.monday"),
    t("weekDays.tuesday"),
    t("weekDays.wednesday"),
    t("weekDays.thursday"),
    t("weekDays.friday"),
    t("weekDays.saturday"),
  ];

  const formatDateWithLocale = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {formatDateWithLocale(date.from)} -{" "}
                  {formatDateWithLocale(date.to)}
                </>
              ) : (
                formatDateWithLocale(date.from)
              )
            ) : (
              <span>{t("pickDateRange")}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(range) => {
              setDate(range);
              if (onDateRangeChange) {
                onDateRangeChange({
                  from: range?.from,
                  to: range?.to,
                });
              }
            }}
            numberOfMonths={2}
            classNames={{
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-medium",
              nav: "space-x-1 flex items-center",
              nav_button: cn(
                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
              ),
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell:
                "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: cn("h-9 w-9 p-0 font-normal aria-selected:opacity-100"),
              day_selected:
                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground",
              day_outside: "text-muted-foreground opacity-50",
              day_disabled: "text-muted-foreground opacity-50",
              day_range_middle:
                "aria-selected:bg-accent aria-selected:text-accent-foreground",
              day_hidden: "invisible",
            }}
            formatters={{
              formatWeekdayName: () => "", // We'll handle this with our custom header
              formatCaption: (date) => {
                return `${months[date.getMonth()]} ${date.getFullYear()}`;
              },
            }}
            components={{
              Head: () => (
                <tr className="flex">
                  {weekDays.map((day, index) => (
                    <th
                      key={index}
                      className="text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] text-center"
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              ),
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
