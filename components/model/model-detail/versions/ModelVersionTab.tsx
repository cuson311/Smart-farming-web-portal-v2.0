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
import { Clock, Leaf, Code2, Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Assuming you'll create this API client in a similar way
import modelApi from "@/api/modelAPI";
import { Model, ModelVersion, SubscribedModel } from "@/types/model";
import { formatDate } from "@/lib/formatDate";

const ModelVersionTab = ({
  model,
  subscribedModels,
  onSubscribedModelsChange,
}: {
  model: Model;
  subscribedModels: SubscribedModel[];
  onSubscribedModelsChange: () => void;
}) => {
  const t = useTranslations("dashboard.models.versions");
  const params = useParams();
  const modelName: string = model.name;
  const userId = params.userId as string;

  const [versions, setVersions] = useState<ModelVersion[]>([]);
  const [versionLoading, setVersionLoading] = useState(false);
  const [versionError, setVersionError] = useState<any>(false);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    max_results: 10,
    order_by: "name ASC",
  });
  console.log("Model Version", model);
  const getTagValue = (tags: any[], key: string) => {
    return tags?.find((tag) => tag.key === key)?.value;
  };

  const fetchVersions = async (pageToken?: string) => {
    if (!modelName) {
      setVersionError(" Model Name is missing");
      setVersionLoading(false);
      return;
    }

    setVersionLoading(true);
    try {
      const response = await modelApi.getModelVersion(
        modelName,
        filters.max_results,
        pageToken,
        filters.order_by
      );
      if (pageToken) {
        setVersions((prev) => [...prev, ...response.model_versions]);
      } else {
        setVersions(response.model_versions);
      }
      setNextPageToken(response.next_page_token);
      setHasMore(!!response.next_page_token);
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

  useEffect(() => {
    fetchVersions();
  }, [modelName, filters]);

  const loadMore = () => {
    if (nextPageToken) {
      fetchVersions(nextPageToken);
    }
  };

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleGenerateScript = async (version: string) => {
    try {
      // Find the subscribed model that matches the current model name
      const subscribedModel = subscribedModels?.find(
        (model) => model.model_name === modelName
      );

      if (!subscribedModel) {
        toast.error(t("toast.generateError"), {
          description: t("toast.notSubscribed"),
        });
        return;
      }

      await modelApi.generateScript(userId, {
        model_name: modelName,
        model_version: version,
        location: subscribedModel.location,
        avg_temp: 32,
        avg_humid: 80,
        avg_rainfall: 30,
      });

      toast.success(t("toast.generateSuccess"), {
        description: t("toast.generateSuccessDesc", { version }),
      });
    } catch (err) {
      console.error("Error generating script:", err);
      toast.error(t("toast.generateError"), {
        description: t("toast.generateErrorDesc"),
      });
    }
  };

  console.log("versions", versions);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="mb-2">{t("title")}</CardTitle>
          <CardDescription>{t("descriptionSection")}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-8">
          {/* <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-muted/30 rounded-lg p-4">
            <div className="flex flex-wrap gap-4 w-full items-center md:w-auto">
              <span className="text-sm font-medium">
                {t("filter.resultsPerPage")}:
              </span>
              <Select
                value={filters.max_results.toString()}
                onValueChange={(value) =>
                  handleFilterChange("max_results", parseInt(value))
                }
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-wrap gap-4 w-full items-center md:w-auto">
              <span className="text-sm font-medium">{t("filter.sortBy")}:</span>
              <Select
                value={filters.order_by}
                onValueChange={(value) => handleFilterChange("order_by", value)}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name ASC">
                    {t("filter.nameAsc")}
                  </SelectItem>
                  <SelectItem value="name DESC">
                    {t("filter.nameDesc")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div> */}

          <div className="flex flex-col space-y-8">
            {versions?.map((item, index) => {
              const plantType = getTagValue(item.tags, "plant");
              const algorithm = getTagValue(item.tags, "algorithm");

              return (
                <div key={index} className="pl-8 relative">
                  <Clock size="16" className="absolute left-2 top-1" />
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-semibold">
                      {t("version")} {item.version}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {t("lastUpdated")}{" "}
                      {formatDate(item.last_updated_timestamp)}
                    </span>
                  </div>
                  <Card>
                    <CardContent className="p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm font-medium">
                              {t("name")}{" "}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {item.name}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm font-medium">
                              {t("description")}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {" "}
                              {item.description
                                ? item.description
                                : t("noDescription")}
                            </span>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Leaf className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                {t("plant")}:
                              </span>
                              <Badge variant="secondary">
                                {plantType || t("noPlant")}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Code2 className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                {t("algorithm")}:
                              </span>
                              <Badge variant="secondary">
                                {algorithm || t("noAlgorithm")}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleGenerateScript(item.version)}
                          className="flex items-center gap-2"
                        >
                          <Play className="h-4 w-4" />
                          {t("generateScript")}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}

            {versions?.length === 0 && !versionLoading && (
              <div className="text-center text-muted-foreground py-4">
                {t("noVersions")}
              </div>
            )}
            {hasMore && (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={loadMore}
                  disabled={versionLoading}
                >
                  {versionLoading ? t("loading") : t("loadMore")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelVersionTab;
