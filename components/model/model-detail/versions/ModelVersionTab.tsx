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
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

// Assuming you'll create this API client in a similar way
import modelApi from "@/api/modelAPI";
import { Model, ModelVersion } from "@/types/model";
import { DatePickerWithRange } from "@/components/ui/DatePickerWithRange";
import { formatDate } from "@/lib/formatDate";

const ModelVersionTab = ({ model }: { model: Model }) => {
  const t = useTranslations("dashboard.models.versions");
  const params = useParams();
  const userId: string = Array.isArray(params.userId)
    ? params.userId[0]
    : params.userId;
  const modelName: string = model.alt_name;

  const [versions, setVersions] = useState<ModelVersion[]>([]);
  const [filteredVersions, setFilteredVersions] = useState<ModelVersion[]>([]);
  const [versionLoading, setVersionLoading] = useState(false);
  const [versionError, setVersionError] = useState<any>(false);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  useEffect(() => {
    if (!userId || !modelName) {
      setVersionError("User ID or Model Name is missing");
      setVersionLoading(false);
      return;
    }

    const fetchVersions = async () => {
      setVersionLoading(true);
      try {
        const response = await modelApi.getModelVersion(userId, modelName);
        setVersions(response.model_versions);
        setFilteredVersions(response.model_versions);
      } catch (err) {
        setVersionError("Error fetching model");
        console.error("Error fetching model:", err);
        toast.error(t("toast.fetchError"), {
          description: t("toast.fetchErrorDesc"),
        });
      } finally {
        setVersionLoading(false);
      }
    };

    fetchVersions();
  }, [modelName]);

  // Filter versions based on date range
  useEffect(() => {
    if (!dateRange.from || !dateRange.to) {
      setFilteredVersions(versions);
      return;
    }

    const filtered = versions.filter((version) => {
      const versionDate = new Date(version.last_updated_timestamp);
      return versionDate >= dateRange.from! && versionDate <= dateRange.to!;
    });

    setFilteredVersions(filtered);
  }, [dateRange, versions]);

  const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
    setDateRange(range);
  };

  console.log("version", versions);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="mb-2">{t("title")}</CardTitle>
          <CardDescription>{t("descriptionSection")}</CardDescription>
        </div>
        {/* <Button asChild variant="default">
          <Link href="new-script">
            <Plus className="mr-2 h-4 w-4" />
            Create New Version
          </Link>
        </Button> */}
        <DatePickerWithRange onDateRangeChange={handleDateRangeChange} />
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-8">
          {filteredVersions?.map((item, index) => (
            <div key={index} className="pl-8 relative">
              <Clock size="16" className="absolute left-2 top-1" />
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-semibold">
                  {t("version")} {item.version}
                </span>
                <span className="text-sm text-muted-foreground">
                  {t("lastUpdated")} {formatDate(item.last_updated_timestamp)}
                </span>
              </div>
              <Card>
                <CardContent className="p-4 space-y-2">
                  <div>
                    <span className="text-sm font-medium">{t("name")} </span>
                    <span className="text-sm text-muted-foreground">
                      {item.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">
                      {t("description")}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {item.description ? item.description : t("noDescription")}
                    </span>
                  </div>
                  <div className="flex flex-nowrap gap-2 items-center">
                    <span className="text-sm font-medium">{t("tags")} </span>
                    <span className="flex flex-wrap gap-2 mt-1">
                      {item?.tags?.map((tag, i) => (
                        <Badge key={i} variant="secondary">
                          {tag.key}: {tag.value}
                        </Badge>
                      ))}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
          {filteredVersions?.length === 0 && (
            <div className="text-center text-muted-foreground py-4">
              {t("noVersions")}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelVersionTab;
