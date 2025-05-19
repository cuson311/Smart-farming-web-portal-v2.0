import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface ModelScriptInfo {
  _id: string;
  model_name: string;
  model_version: string;
  location: string;
  avg_temp: number;
  avg_humid: number;
  avg_rainfall: number;
  owner_id: string;
  createdAt: string;
  updatedAt: string;
}

interface ModelScriptInfoCardProps {
  data: ModelScriptInfo;
}

export default function ModelScriptInfoCard({
  data,
}: ModelScriptInfoCardProps) {
  const t = useTranslations("dashboard.models.scriptInfo");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {t("modelName")}
            </p>
            <p className="text-sm">{data.model_name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {t("modelVersion")}
            </p>
            <p className="text-sm">{data.model_version}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {t("location")}
            </p>
            <p className="text-sm">{data.location}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {t("temperature")}
            </p>
            <p className="text-sm">
              {data.avg_temp}
              {t("celsius")}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {t("humidity")}
            </p>
            <p className="text-sm">
              {data.avg_humid}
              {t("percentage")}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {t("rainfall")}
            </p>
            <p className="text-sm">
              {data.avg_rainfall}
              {t("mm")}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {t("createdAt")}
            </p>
            <p className="text-sm">
              {format(new Date(data.createdAt), "dd/MM/yyyy HH:mm")}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {t("updatedAt")}
            </p>
            <p className="text-sm">
              {format(new Date(data.updatedAt), "dd/MM/yyyy HH:mm")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
