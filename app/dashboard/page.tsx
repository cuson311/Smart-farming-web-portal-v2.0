"use client";
import { Code2, Database, Droplets, User } from "lucide-react";
import { useTranslation } from "@/context/ContextLanguage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecentScripts } from "@/components/recent-scripts";
import { ActivityLog } from "@/components/activity-log";

export default function DashboardPage() {
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{t("dashboard.title")}</h1>
      <p className="text-gray-600 mb-6">{t("dashboard.welcome")}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-irrigation-200 dark:border-irrigation-800 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t("dashboard.stats.totalScripts.title")}
            </CardTitle>
            <Code2 className="h-4 w-4 text-irrigation-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-irrigation-600 dark:text-irrigation-400">
              {t("dashboard.stats.totalScripts.value")}
            </div>
            <p className="text-xs text-green-600">
              {t("dashboard.stats.totalScripts.change")}
            </p>
          </CardContent>
        </Card>
        <Card className="border-irrigation-200 dark:border-irrigation-800 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t("dashboard.stats.totalModels.title")}
            </CardTitle>
            <Database className="h-4 w-4 text-irrigation-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-irrigation-600 dark:text-irrigation-400">
              {t("dashboard.stats.totalModels.value")}
            </div>
            <p className="text-xs text-green-600">
              {t("dashboard.stats.totalModels.change")}
            </p>
          </CardContent>
        </Card>
        <Card className="border-irrigation-200 dark:border-irrigation-800 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t("dashboard.stats.activeUsers.title")}
            </CardTitle>
            <User className="h-4 w-4 text-irrigation-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-irrigation-600 dark:text-irrigation-400">
              {t("dashboard.stats.activeUsers.value")}
            </div>
            <p className="text-xs text-green-600">
              {t("dashboard.stats.activeUsers.change")}
            </p>
          </CardContent>
        </Card>
        <Card className="border-irrigation-200 dark:border-irrigation-800 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t("dashboard.stats.waterSaved.title")}
            </CardTitle>
            <Droplets className="h-4 w-4 text-irrigation-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-irrigation-600 dark:text-irrigation-400">
              {t("dashboard.stats.waterSaved.value")}
            </div>
            <p className="text-xs text-green-600">
              {t("dashboard.stats.waterSaved.change")}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Tabs
          defaultValue="recent"
          className="bg-background rounded-lg border p-1"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recent">
              {t("dashboard.tabs.recent")}
            </TabsTrigger>
            <TabsTrigger value="activity">
              {t("dashboard.tabs.activity")}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="recent" className="border-none p-4 pt-6">
            <RecentScripts />
          </TabsContent>
          <TabsContent value="activity" className="border-none p-4 pt-6">
            <ActivityLog />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
