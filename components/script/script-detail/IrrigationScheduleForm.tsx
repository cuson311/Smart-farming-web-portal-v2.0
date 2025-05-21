"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Minus,
  Save,
  X,
  Droplets,
  Clock,
  Wind,
  Thermometer,
  Gauge,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useToast } from "@/components/ui/use-toast";

interface WateringEvent {
  time: string;
  duration: {
    value: number;
    unit: string;
  };
  water_volume: {
    value: number;
    unit: string;
  };
  method: string;
}

interface Conditions {
  skip_if_raining: boolean;
  min_soil_moisture: number;
  max_temperature: number;
  min_air_humidity: number;
  max_wind_speed: number;
}

interface IrrigationScheduleFormProps {
  initialData: any;
  onSave: (formData: any) => void;
  onCancel?: () => void;
  disabled?: boolean;
}

export default function IrrigationScheduleForm({
  initialData,
  onSave,
  onCancel,
  disabled = false,
}: IrrigationScheduleFormProps) {
  const t = useTranslations("dashboard.scripts.detail.irrigationSchedule");
  const { toast } = useToast();
  const [repeat, setRepeat] = useState({ interval: 3, unit: "day" });
  const [wateringEventsCount, setWateringEventsCount] = useState(2);
  const [wateringEvents, setWateringEvents] = useState<WateringEvent[]>([
    {
      time: "07:00",
      duration: { value: 20, unit: "min" },
      water_volume: { value: 90, unit: "l" },
      method: "drip",
    },
    {
      time: "17:30",
      duration: { value: 25, unit: "min" },
      water_volume: { value: 110, unit: "l" },
      method: "spray",
    },
  ]);
  const [conditions, setConditions] = useState<Conditions>({
    skip_if_raining: false,
    min_soil_moisture: 35,
    max_temperature: 33,
    min_air_humidity: 55,
    max_wind_speed: 15,
  });
  const [note, setNote] = useState("");
  const [timeErrors, setTimeErrors] = useState<{ [key: number]: string }>({});
  // Initialize form with initialData if provided
  useEffect(() => {
    if (initialData) {
      const formattedEvents =
        initialData.watering_events?.map((event: WateringEvent) => ({
          ...event,
          time: formatTime(event.time),
        })) || [];

      setRepeat(initialData.repeat || { interval: 3, unit: "day" });
      setWateringEventsCount(formattedEvents.length || 2);
      setWateringEvents(formattedEvents);
      setConditions(
        initialData.conditions || {
          skip_if_raining: false,
          min_soil_moisture: 35,
          max_temperature: 33,
          min_air_humidity: 55,
          max_wind_speed: 15,
        }
      );
      setNote(initialData.note || "");
    }
  }, [initialData]);

  // Function to check for duplicate times
  const checkDuplicateTimes = (events: WateringEvent[]) => {
    const timeMap = new Map<string, number>();
    const errors: { [key: number]: string } = {};

    events.forEach((event, index) => {
      if (timeMap.has(event.time)) {
        errors[index] = "Thời gian này đã được sử dụng";
        errors[timeMap.get(event.time)!] = "Thời gian này đã được sử dụng";
      } else {
        timeMap.set(event.time, index);
      }
    });

    setTimeErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Update events array when event count changes
  const handleEventCountChange = (value: number) => {
    const newValue = value < 1 ? 1 : value;
    setWateringEventsCount(newValue);

    if (newValue > wateringEvents.length) {
      // Add new events
      const newEvents = [...wateringEvents];
      for (let i = wateringEvents.length; i < newValue; i++) {
        newEvents.push({
          time: "12:00",
          duration: { value: 15, unit: "min" },
          water_volume: { value: 50, unit: "l" },
          method: "drip",
        });
      }
      setWateringEvents(newEvents);
      checkDuplicateTimes(newEvents);
    } else if (newValue < wateringEvents.length) {
      // Remove events
      const newEvents = wateringEvents.slice(0, newValue);
      setWateringEvents(newEvents);
      checkDuplicateTimes(newEvents);
    }
  };

  const formatTime = (time: string) => {
    // Ensure time is in HH:mm format
    const [hours, minutes] = time.split(":");
    return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
  };

  const updateEvent = (
    index: number,
    field: keyof WateringEvent,
    value: any
  ) => {
    const updatedEvents = [...wateringEvents];
    if (field === "duration" || field === "water_volume") {
      updatedEvents[index] = {
        ...updatedEvents[index],
        [field]: { ...updatedEvents[index][field], value },
      };
    } else if (field === "time") {
      updatedEvents[index] = {
        ...updatedEvents[index],
        [field]: formatTime(value),
      };
    } else {
      updatedEvents[index] = { ...updatedEvents[index], [field]: value };
    }
    setWateringEvents(updatedEvents);
    if (field === "time") {
      checkDuplicateTimes(updatedEvents);
    }
  };

  const updateEventUnit = (
    index: number,
    field: "duration" | "water_volume",
    unit: string
  ) => {
    const updatedEvents = [...wateringEvents];
    updatedEvents[index] = {
      ...updatedEvents[index],
      [field]: { ...updatedEvents[index][field], unit },
    };
    setWateringEvents(updatedEvents);
  };

  const handleSave = () => {
    if (!checkDuplicateTimes(wateringEvents)) {
      toast({
        title: t("toast.saveError"),
        description: t("toast.saveErrorDescription"),
      });
      return; // Don't save if there are duplicate times
    }
    const formData = {
      repeat,
      watering_events_count: wateringEventsCount,
      watering_events: wateringEvents,
      conditions,
      note,
    };
    onSave(formData);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSave();
      }}
      className="space-y-8"
    >
      {/* Actions Section */}
      {!disabled && (
        <div className="flex justify-end space-x-4">
          <Button
            size="sm"
            variant="outline"
            type="button"
            className="border-destructive text-destructive"
            onClick={() => {
              if (initialData) {
                setRepeat(initialData.repeat || { interval: 3, unit: "day" });
                setWateringEventsCount(initialData.watering_events_count || 2);
                setWateringEvents(initialData.watering_events || []);
                setConditions(
                  initialData.conditions || {
                    skip_if_raining: false,
                    min_soil_moisture: 35,
                    max_temperature: 33,
                    min_air_humidity: 55,
                    max_wind_speed: 15,
                  }
                );
                setNote(initialData.note || "");
              }
              onCancel?.();
            }}
          >
            <X className="mr-2 h-4 w-4" />
            {t("actions.cancel")}
          </Button>
          <Button type="submit" size="sm" className="bg-primary">
            <Save className="mr-2 h-4 w-4" />
            {t("actions.save")}
          </Button>
        </div>
      )}
      {/* Repeat Section */}
      <Card className="overflow-hidden border-border shadow-md feature-card">
        <div className="bg-muted px-6 py-4 border-b border-border">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {t("timeSetup.title")}
          </h2>
        </div>
        <CardContent className="p-6">
          <div className="flex flex-wrap items-end gap-4">
            <Label htmlFor="interval" className="mb-4">
              {t("timeSetup.repeatEvery")}
            </Label>
            <div>
              <Input
                id="interval"
                type="number"
                min={1}
                placeholder="3"
                value={repeat.interval}
                onChange={(e) =>
                  setRepeat({
                    ...repeat,
                    interval: Number.parseInt(e.target.value) || 1,
                  })
                }
                className="w-20 bg-background border-input focus-visible:ring-ring"
                disabled={disabled}
              />
            </div>
            <div>
              <Select
                value={repeat.unit}
                onValueChange={(value) => setRepeat({ ...repeat, unit: value })}
                disabled={disabled}
              >
                <SelectTrigger className="w-32 bg-background border-input focus:ring-ring">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="day">{t("timeSetup.days")}</SelectItem>
                  <SelectItem value="week">{t("timeSetup.weeks")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Number of Events Section */}
      <Card className="overflow-hidden border-border shadow-md feature-card">
        <div className="bg-muted px-6 py-4 border-b border-border">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <Droplets className="h-5 w-5" />
            {t("wateringEvents.title")}
          </h2>
        </div>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Label htmlFor="eventCount">
              {t("wateringEvents.eventsPerDay")}
            </Label>
            <div className="flex items-center">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-r-none"
                onClick={() => handleEventCountChange(wateringEventsCount - 1)}
                disabled={wateringEventsCount <= 1 || disabled}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                id="eventCount"
                type="number"
                min={1}
                placeholder="2"
                value={wateringEventsCount}
                onChange={(e) =>
                  handleEventCountChange(Number.parseInt(e.target.value) || 1)
                }
                className="w-16 h-8 rounded-none text-center border-x-0 focus-visible:ring-0"
                disabled={disabled}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-l-none"
                onClick={() => handleEventCountChange(wateringEventsCount + 1)}
                disabled={disabled}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {wateringEvents.map((event, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-border"
              >
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {t("wateringEvents.event", { number: index + 1 })}
                    </span>
                    <span className="text-muted-foreground">
                      ({event.time} - {event.duration.value}{" "}
                      {event.duration.unit === "min"
                        ? t("wateringEvents.minutes")
                        : t("wateringEvents.hours")}
                      )
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 p-2">
                    <div className="space-y-2">
                      <Label>{t("wateringEvents.time")}</Label>
                      <div className="space-y-1">
                        <Input
                          type="time"
                          value={event.time}
                          onChange={(e) =>
                            updateEvent(index, "time", e.target.value)
                          }
                          className={cn(
                            "w-full bg-background border-input focus-visible:ring-ring",
                            timeErrors[index] && "border-destructive"
                          )}
                          disabled={disabled}
                        />
                        {timeErrors[index] && (
                          <p className="text-sm text-destructive">
                            {t("errors.duplicateTime")}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid lg:grid-cols-3 grid-cols-1">
                      <div className="space-y-2">
                        <Label>{t("wateringEvents.duration")}</Label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            min={1}
                            value={event.duration.value}
                            onChange={(e) =>
                              updateEvent(
                                index,
                                "duration",
                                Number(e.target.value)
                              )
                            }
                            className="w-20 bg-background border-input focus-visible:ring-ring"
                            disabled={disabled}
                          />
                          <Select
                            value={event.duration.unit}
                            onValueChange={(value) =>
                              updateEventUnit(index, "duration", value)
                            }
                            disabled={disabled}
                          >
                            <SelectTrigger className="w-24 bg-background border-input focus:ring-ring">
                              <SelectValue placeholder="Unit" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border">
                              <SelectItem value="min">
                                {t("wateringEvents.minutes")}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>{t("wateringEvents.waterVolume")}</Label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            min={1}
                            value={event.water_volume.value}
                            onChange={(e) =>
                              updateEvent(
                                index,
                                "water_volume",
                                Number(e.target.value)
                              )
                            }
                            className="w-20 bg-background border-input focus-visible:ring-ring"
                            disabled={disabled}
                          />
                          <Select
                            value={event.water_volume.unit}
                            onValueChange={(value) =>
                              updateEventUnit(index, "water_volume", value)
                            }
                            disabled={disabled}
                          >
                            <SelectTrigger className="w-24 bg-background border-input focus:ring-ring">
                              <SelectValue placeholder="Unit" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border">
                              <SelectItem value="l">
                                {t("wateringEvents.liters")}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>{t("wateringEvents.method")}</Label>
                        <Select
                          value={event.method}
                          onValueChange={(value) =>
                            updateEvent(index, "method", value)
                          }
                          disabled={disabled}
                        >
                          <SelectTrigger className="w-full bg-background border-input focus:ring-ring">
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border-border">
                            <SelectItem value="drip">
                              {t("wateringEvents.methods.drip")}
                            </SelectItem>
                            <SelectItem value="spray">
                              {t("wateringEvents.methods.spray")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Conditions Section */}
      <Card className="overflow-hidden border-border shadow-md feature-card">
        <div className="bg-muted px-6 py-4 border-b border-border">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            {t("conditions.title")}
          </h2>
        </div>
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center space-x-2 p-3 rounded-md">
            <Checkbox
              id="skipRain"
              checked={conditions.skip_if_raining}
              onCheckedChange={(checked) =>
                setConditions({
                  ...conditions,
                  skip_if_raining: checked as boolean,
                })
              }
              className="border-input "
              disabled={disabled}
            />
            <div>
              <Label htmlFor="skipRain" className="font-medium">
                {t("conditions.skipIfRaining")}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t("conditions.skipIfRainingNote")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 bg-muted/30 p-4 rounded-md">
              <Label
                htmlFor="minSoilMoisture"
                className="flex items-center gap-2"
              >
                <Droplets className="h-4 w-4" />
                {t("conditions.minSoilMoisture")}
              </Label>
              <Input
                id="minSoilMoisture"
                type="number"
                min={0}
                max={100}
                placeholder="35"
                value={conditions.min_soil_moisture}
                onChange={(e) =>
                  setConditions({
                    ...conditions,
                    min_soil_moisture: Number(e.target.value),
                  })
                }
                className="bg-background border-input focus-visible:ring-ring"
                disabled={disabled}
              />
              <p className="text-sm text-muted-foreground">
                {t("conditions.minSoilMoistureNote")}
              </p>
            </div>

            <div className="space-y-2 bg-muted/30 p-4 rounded-md">
              <Label
                htmlFor="maxTemperature"
                className="flex items-center gap-2"
              >
                <Thermometer className="h-4 w-4" />
                {t("conditions.maxTemperature")}
              </Label>
              <Input
                id="maxTemperature"
                type="number"
                placeholder="33"
                value={conditions.max_temperature}
                onChange={(e) =>
                  setConditions({
                    ...conditions,
                    max_temperature: Number(e.target.value),
                  })
                }
                className="bg-background border-input focus-visible:ring-ring"
                disabled={disabled}
              />
              <p className="text-sm text-muted-foreground">
                {t("conditions.maxTemperatureNote")}
              </p>
            </div>

            <div className="space-y-2 bg-muted/30 p-4 rounded-md">
              <Label
                htmlFor="minAirHumidity"
                className="flex items-center gap-2"
              >
                <Droplets className="h-4 w-4" />
                {t("conditions.minAirHumidity")}
              </Label>
              <Input
                id="minAirHumidity"
                type="number"
                min={0}
                max={100}
                placeholder="55"
                value={conditions.min_air_humidity}
                onChange={(e) =>
                  setConditions({
                    ...conditions,
                    min_air_humidity: Number(e.target.value),
                  })
                }
                className="bg-background border-input focus-visible:ring-ring"
                disabled={disabled}
              />
              <p className="text-sm text-muted-foreground">
                {t("conditions.minAirHumidityNote")}
              </p>
            </div>

            <div className="space-y-2 bg-muted/30 p-4 rounded-md">
              <Label htmlFor="maxWindSpeed" className="flex items-center gap-2">
                <Wind className="h-4 w-4" />
                {t("conditions.maxWindSpeed")}
              </Label>
              <Input
                id="maxWindSpeed"
                type="number"
                min={0}
                placeholder="15"
                value={conditions.max_wind_speed}
                onChange={(e) =>
                  setConditions({
                    ...conditions,
                    max_wind_speed: Number(e.target.value),
                  })
                }
                className="bg-background border-input focus-visible:ring-ring"
                disabled={disabled}
              />
              <p className="text-sm text-muted-foreground">
                {t("conditions.maxWindSpeedNote")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes Section */}
      <Card className="overflow-hidden border-border shadow-md feature-card">
        <div className="bg-muted px-6 py-4 border-b border-border">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t("notes.title")}
          </h2>
        </div>
        <CardContent className="p-6">
          <div className="space-y-2">
            <Label htmlFor="notes">{t("notes.title")}</Label>
            <Textarea
              id="notes"
              placeholder={t("notes.placeholder")}
              className="min-h-[120px] bg-background border-input focus-visible:ring-ring"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={disabled}
            />
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
