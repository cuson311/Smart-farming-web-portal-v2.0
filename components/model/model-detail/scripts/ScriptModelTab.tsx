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
import { convertTimestamp } from "@/utils/dateUtils";

// Assuming you'll create this API client in a similar way
import modelApi from "@/api/modelAPI";
import { Model, ScriptModel } from "@/types/model";
import { DatePickerWithRange } from "@/components/ui/DataPickerWithRange";

const ScriptModelTab = ({ model }: { model: Model }) => {
  const params = useParams();
  const userId: string = Array.isArray(params.userId)
    ? params.userId[0]
    : params.userId;
  const modelId: string = model._id;

  const [scripts, setScripts] = useState<ScriptModel[]>([]);
  const [filteredVersions, setFilteredVersions] = useState<ScriptModel[]>([]);
  const [scriptLoading, setScriptLoading] = useState(false);
  const [scriptError, setScriptError] = useState<any>(false);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  console.log("scripts", scripts);

  useEffect(() => {
    if (!userId || !modelId) {
      setScriptError("User ID or Model Name is missing");
      setScriptLoading(false);
      return;
    }

    const fetchVersions = async () => {
      setScriptLoading(true);
      try {
        const response = await modelApi.getScriptsModel(userId, modelId);
        setScripts(response);
        setFilteredVersions(response.model_versions);
      } catch (err) {
        setScriptError("Error fetching model");
        console.error("Error fetching model:", err);
      } finally {
        setScriptLoading(false);
      }
    };

    fetchVersions();
  }, [modelId]);

  // Filter scripts based on date range
  useEffect(() => {
    if (!dateRange.from || !dateRange.to) {
      setFilteredVersions(scripts);
      return;
    }

    const filtered = scripts.filter((version) => {
      const versionDate = new Date(version.updatedAt);
      return versionDate >= dateRange.from! && versionDate <= dateRange.to!;
    });

    setFilteredVersions(filtered);
  }, [dateRange, scripts]);

  const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
    setDateRange(range);
  };

  console.log("version", scripts);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="mb-2">Associated Scripts</CardTitle>
          <CardDescription>Scripts that use this model</CardDescription>
        </div>
        <DatePickerWithRange onDateRangeChange={handleDateRangeChange} />
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-8">
          {filteredVersions?.map((item, index) => (
            <div key={index}>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-semibold">Version {item.version}</span>
              </div>
              <Card>
                <CardContent className="p-4 grid grid-cols-2 gap-2">
                  <div className="flex gap-1">
                    <span className="mb-1 text-sm font-medium">Version:</span>
                    <span className="text-sm text-muted-foreground">
                      {item.version}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <span className="mb-1 text-sm font-medium">
                      Model Version:
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {item.model_version}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <span className="mb-1 text-sm font-medium">
                      Created At:
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {convertTimestamp(item.createdAt)}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <span className="mb-1 text-sm font-medium">
                      Lasted Update:
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {convertTimestamp(item.createdAt)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
          {filteredVersions?.length === 0 && (
            <div className="text-center text-muted-foreground py-4">
              No scripts found in the selected date range
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScriptModelTab;
