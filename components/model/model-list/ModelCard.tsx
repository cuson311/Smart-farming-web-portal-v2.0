import Link from "next/link";
import {
  CalendarCheck2,
  CalendarX2,
  Database,
  Leaf,
  Clock,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RegisteredModel } from "@/types/model";
import { useParams } from "next/navigation";
import { formatDate } from "@/lib/formatDate";
import { Badge } from "@/components/ui/badge";
import cronstrue from "cronstrue";
import { getCronDescription } from "@/lib/cronTransform";

interface ModelCardProp {
  model: RegisteredModel;
}

const ModelCard = ({ model }: ModelCardProp) => {
  const { userId } = useParams();
  const t = useTranslations("dashboard.models.card");

  const getTagValue = (key: string) => {
    const tag = model.tags?.find((tag) => tag.key === key);
    return tag?.value;
  };

  const isEnabled = getTagValue("enable") === "true";
  const plantType = getTagValue("plant");
  const schedule = getTagValue("schedule");

  return (
    <Card key={model.name} className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2 w-full">
            <Database className="h-5 w-5 flex-shrink-0" />
            <span className="line-clamp-1">{model.name}</span>
          </CardTitle>
          <CardDescription className="line-clamp-3">
            {model.description}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 py-0 flex-grow">
        {/* Metadata container with fixed height */}
        <div className="min-h-16">
          {/* Plant type badges */}
          <div className="flex flex-wrap gap-1 mb-2 min-h-6">
            {plantType ? (
              <>
                <div className="flex items-center mr-1">
                  <Leaf className="h-3 w-3 text-gray-400 mr-1" />
                  <span className="text-xs text-muted-foreground">
                    {t("plant")}
                  </span>
                </div>
                <Badge variant="outline" className="text-xs py-0">
                  {plantType}
                </Badge>
              </>
            ) : (
              <div className="flex items-center mr-1">
                <Leaf className="h-3 w-3 text-gray-400 dark:text-gray-500 mr-1" />
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {t("noPlant")}
                </span>
              </div>
            )}
          </div>

          {/* Status badge */}
          <div className="flex flex-wrap gap-1 mb-2 min-h-6">
            <div className="flex items-center mr-1">
              <CalendarCheck2 className="h-3 w-3 text-gray-400 mr-1" />
              <span className="text-xs text-muted-foreground">
                {t("status")}
              </span>
            </div>
            <Badge
              variant={isEnabled ? "default" : "secondary"}
              className="text-xs py-0"
            >
              {isEnabled ? t("scheduled") : t("notScheduled")}
            </Badge>
          </div>

          {/* Schedule badges */}
          <div className="flex flex-wrap gap-1 mb-2 min-h-6">
            {schedule ? (
              <>
                <div className="flex items-center mr-1">
                  <Clock className="h-3 w-3 text-gray-400 mr-1" />
                  <span className="text-xs text-muted-foreground">
                    {t("schedule")}
                  </span>
                </div>
                <Badge variant="outline" className="text-xs py-0">
                  {getCronDescription(
                    schedule,
                    window.location.pathname.split("/")[1]
                  )}
                </Badge>
              </>
            ) : (
              <div className="flex items-center mr-1">
                <Clock className="h-3 w-3 text-gray-400 dark:text-gray-500 mr-1" />
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {t("noSchedule")}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
          {model.last_updated_timestamp ? (
            <span>
              {t("updatedAt")} {formatDate(model.last_updated_timestamp)}
            </span>
          ) : null}
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link
            href={`/dashboard/${userId}/models/${model.name}/?tab=versions`}
          >
            {t("view")}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
export default ModelCard;
