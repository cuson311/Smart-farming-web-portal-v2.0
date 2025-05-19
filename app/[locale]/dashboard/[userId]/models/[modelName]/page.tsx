"use client";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import ModelOverviewCard from "@/components/model/model-detail/overview/ModelOverviewCard";
import { useFetchModelInfo } from "@/hooks/useFetchModel";
import ModelVersionTab from "@/components/model/model-detail/versions/ModelVersionTab";
import ScheduleModelTab from "@/components/model/model-detail/schedule/ScheduleModelTab";
// import ScheduleModelTab from "@/components/model/model-detail/schedule/ScheduleModelTab";

// This component will be rendered on invalid tab routes
const NotFoundComponent = ({ userId }: { userId: string }) => {
  const t = useTranslations("dashboard.models");
  const router = useRouter();
  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            const currentLocale = window.location.pathname.split("/")[1];
            router.push(`/${currentLocale}/dashboard/${userId}/models`);
          }}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">{t("back", { defaultValue: "Back" })}</span>
        </Button>
        <h1 className="text-2xl font-bold">
          {t("notFound.title", { defaultValue: "Page Not Found" })}
        </h1>
      </div>

      <Alert variant="destructive" className="bg-destructive/10">
        <ShieldAlert className="h-5 w-5" />
        <AlertTitle className="mb-2">
          {t("notFound.invalidTab", { defaultValue: "Invalid Tab" })}
        </AlertTitle>
        <AlertDescription>
          {t("notFound.description", {
            defaultValue:
              "The requested tab does not exist. Please select a valid tab or return to your models.",
          })}
        </AlertDescription>
        <div className="mt-4">
          <Button
            onClick={() => {
              const currentLocale = window.location.pathname.split("/")[1];
              router.push(`/${currentLocale}/dashboard/${userId}/models`);
            }}
          >
            {t("notFound.returnButton", {
              defaultValue: "Return to My Models",
            })}
          </Button>
        </div>
      </Alert>
    </div>
  );
};

const ModelDetailPage = ({
  params,
}: {
  params: { userId: string; modelName: string };
}) => {
  const t = useTranslations("dashboard.models");
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const validTabs = ["versions"]; // Removed "schedule" from valid tabs
  const isValidTab = tabParam && validTabs.includes(tabParam);
  const tabName = isValidTab ? tabParam : "versions";

  const {
    data: modelInfo,
    setData: setModelInfo,
    loading: modelInfoLoading,
    error: modelInfoError,
    refetch,
  } = useFetchModelInfo(params.modelName);

  // If no tab param or invalid tab, render NotFound component
  if (!isValidTab) {
    return <NotFoundComponent userId={params.userId} />;
  }

  // Handle tab change by updating query parameter
  const handleTabChange = (value: string) => {
    const currentLocale = window.location.pathname.split("/")[1]; // Get current locale from URL
    const newUrl = `/${currentLocale}/dashboard/${params.userId}/models/${params.modelName}?tab=${value}`;
    router.replace(newUrl);
  };
  console.log("modelInfo", modelInfo);
  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            const currentLocale = window.location.pathname.split("/")[1];
            router.push(`/${currentLocale}/dashboard/${params.userId}/models`);
          }}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">{t("back", { defaultValue: "Back" })}</span>
        </Button>
        <h1 className="text-2xl font-bold">{modelInfo?.name}</h1>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs value={tabName} onValueChange={handleTabChange}>
            <TabsList>
              <TabsTrigger value="versions">
                {t("tabs.versions", { defaultValue: "Versions" })}
              </TabsTrigger>
              <TabsTrigger value="schedule">
                {t("tabs.schedule", { defaultValue: "Schedule" })}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="versions" className="border-none p-0 pt-4">
              {modelInfo ? (
                <ModelVersionTab model={modelInfo} />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {t("loadingDetails", {
                    defaultValue: "Loading model details...",
                  })}
                </p>
              )}
            </TabsContent>
            <TabsContent value="schedule" className="border-none p-0 pt-4">
              {modelInfo ? (
                <ScheduleModelTab model={modelInfo} />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {t("loadingDetails", {
                    defaultValue: "Loading model details...",
                  })}
                </p>
              )}
            </TabsContent>
          </Tabs>
        </div>
        <div>
          {modelInfo && (
            <ModelOverviewCard model={modelInfo} refetch={refetch} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ModelDetailPage;
