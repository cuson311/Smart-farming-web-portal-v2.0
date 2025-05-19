"use client";

import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Bell, Globe, Lock, Moon, User } from "lucide-react";

export default function SettingPage() {
  const t = useTranslations("dashboard.settings");

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {t("title", { defaultValue: "Settings" })}
        </h1>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">
            <User className="w-4 h-4 mr-2" />
            {t("tabs.general", { defaultValue: "General" })}
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            {t("tabs.notifications", { defaultValue: "Notifications" })}
          </TabsTrigger>
          <TabsTrigger value="privacy">
            <Lock className="w-4 h-4 mr-2" />
            {t("tabs.privacy", { defaultValue: "Privacy" })}
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Moon className="w-4 h-4 mr-2" />
            {t("tabs.appearance", { defaultValue: "Appearance" })}
          </TabsTrigger>
          <TabsTrigger value="language">
            <Globe className="w-4 h-4 mr-2" />
            {t("tabs.language", { defaultValue: "Language" })}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {t("general.profile", { defaultValue: "Profile Settings" })}
              </CardTitle>
              <CardDescription>
                {t("general.profileDescription", {
                  defaultValue: "Manage your account settings and preferences",
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>
                  {t("general.emailNotifications", {
                    defaultValue: "Email Notifications",
                  })}
                </Label>
                <div className="flex items-center space-x-2">
                  <Switch id="email-notifications" />
                  <Label htmlFor="email-notifications">
                    {t("general.receiveEmailUpdates", {
                      defaultValue: "Receive email updates",
                    })}
                  </Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label>
                  {t("general.timezone", { defaultValue: "Timezone" })}
                </Label>
                <Select defaultValue="utc">
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="est">EST</SelectItem>
                    <SelectItem value="pst">PST</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {t("notifications.title", {
                  defaultValue: "Notification Preferences",
                })}
              </CardTitle>
              <CardDescription>
                {t("notifications.description", {
                  defaultValue: "Configure how you receive notifications",
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>
                    {t("notifications.modelUpdates", {
                      defaultValue: "Model Updates",
                    })}
                  </Label>
                  <Switch id="model-updates" />
                </div>
                <div className="flex items-center justify-between">
                  <Label>
                    {t("notifications.scriptChanges", {
                      defaultValue: "Script Changes",
                    })}
                  </Label>
                  <Switch id="script-changes" />
                </div>
                <div className="flex items-center justify-between">
                  <Label>
                    {t("notifications.systemAlerts", {
                      defaultValue: "System Alerts",
                    })}
                  </Label>
                  <Switch id="system-alerts" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {t("privacy.title", { defaultValue: "Privacy Settings" })}
              </CardTitle>
              <CardDescription>
                {t("privacy.description", {
                  defaultValue: "Manage your privacy preferences",
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>
                    {t("privacy.publicProfile", {
                      defaultValue: "Public Profile",
                    })}
                  </Label>
                  <Switch id="public-profile" />
                </div>
                <div className="flex items-center justify-between">
                  <Label>
                    {t("privacy.dataCollection", {
                      defaultValue: "Data Collection",
                    })}
                  </Label>
                  <Switch id="data-collection" />
                </div>
              </div>
              <Button variant="destructive">
                {t("privacy.deleteAccount", { defaultValue: "Delete Account" })}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {t("appearance.title", { defaultValue: "Appearance Settings" })}
              </CardTitle>
              <CardDescription>
                {t("appearance.description", {
                  defaultValue: "Customize how the application looks",
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>
                  {t("appearance.theme", { defaultValue: "Theme" })}
                </Label>
                <Select defaultValue="system">
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      {t("appearance.light", { defaultValue: "Light" })}
                    </SelectItem>
                    <SelectItem value="dark">
                      {t("appearance.dark", { defaultValue: "Dark" })}
                    </SelectItem>
                    <SelectItem value="system">
                      {t("appearance.system", { defaultValue: "System" })}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="language" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {t("language.title", { defaultValue: "Language Settings" })}
              </CardTitle>
              <CardDescription>
                {t("language.description", {
                  defaultValue: "Choose your preferred language",
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>
                  {t("language.select", { defaultValue: "Select Language" })}
                </Label>
                <Select defaultValue="vi">
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="vi">Tiếng Việt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
