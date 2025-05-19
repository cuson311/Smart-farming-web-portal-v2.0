"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import IrrigationScheduleForm from "@/components/script/script-detail/IrrigationScheduleForm";
import ModelScriptInfoCard from "@/components/model/model-list/ModelScriptInfoCard";
import { toast } from "sonner";
import modelApi from "@/api/modelAPI";

export default function ViewScriptPage() {
  const t = useTranslations("dashboard.scripts.detail");
  const router = useRouter();
  const params = useParams();
  const [scriptData, setScriptData] = useState<any>(null);
  const [scriptInfo, setScriptInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch script data
        const scriptResponse = await modelApi.getModelScriptFile(
          params.userId as string,
          params.scriptId as string
        );

        // Format the data for IrrigationScheduleForm
        const formattedData = {
          repeat: {
            interval: scriptResponse.repeat.interval,
            unit: scriptResponse.repeat.unit,
          },
          watering_events_count: scriptResponse.watering_events_count,
          watering_events: scriptResponse.watering_events.map((event: any) => ({
            time: event.time,
            duration: {
              value: event.duration.value,
              unit: event.duration.unit,
            },
            water_volume: {
              value: event.water_volume.value,
              unit: event.water_volume.unit,
            },
            method: event.method,
          })),
          conditions: {
            skip_if_raining: scriptResponse.conditions.skip_if_raining,
            min_soil_moisture: scriptResponse.conditions.min_soil_moisture,
            max_temperature: scriptResponse.conditions.max_temperature,
            min_air_humidity: scriptResponse.conditions.min_air_humidity,
            max_wind_speed: scriptResponse.conditions.max_wind_speed,
          },
        };

        setScriptData(formattedData);

        // Fetch script info
        const infoResponse = await modelApi.getModelScriptInfo(
          params.userId as string,
          params.scriptId as string
        );
        setScriptInfo(infoResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(t("toast.fetchError"), {
          description: t("toast.fetchErrorDesc"),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.userId, params.scriptId]);

  if (loading) {
    return (
      <div className="grid gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">{t("back")}</span>
          </Button>
          <h1 className="text-2xl font-bold">{t("loading")}</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">{t("back")}</span>
        </Button>
        <h1 className="text-2xl font-bold">{t("view.title")}</h1>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-1 lg:col-span-2">
          <IrrigationScheduleForm
            initialData={scriptData}
            onSave={() => {}}
            disabled={true}
          />
        </div>
        {scriptInfo && (
          <div className="col-span-1 lg:col-span-1">
            <ModelScriptInfoCard data={scriptInfo} />
          </div>
        )}
      </div>
    </div>
  );
}
