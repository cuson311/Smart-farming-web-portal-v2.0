"use client";

import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

import CodeTab from "@/components/script/script-detail/Code";
import CommentsTab from "@/components/script/script-detail/Comment";
import VersionCompareTab from "@/components/script/script-detail/VersionCompare/VersionCompare";
import ScriptDetailsCard from "@/components/script/script-detail/edit-script/ScriptDetailCard";
import { useFetchScriptInfo } from "@/hooks/useFetchScript";
import { useEffect, useState } from "react";
import scriptApi from "@/api/scriptAPI";

// This component will be rendered on invalid tab routes
const NotFoundComponent = ({ userId }: { userId: string }) => {
  const t = useTranslations("dashboard.scripts.detail");
  const router = useRouter();
  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">{t("back")}</span>
        </Button>
        <h1 className="text-2xl font-bold">{t("notFound.title")}</h1>
      </div>

      <Alert variant="destructive" className="bg-destructive/10">
        <ShieldAlert className="h-5 w-5" />
        <AlertTitle className="mb-2">{t("notFound.invalidTab")}</AlertTitle>
        <AlertDescription>{t("notFound.description")}</AlertDescription>
        <div className="mt-4">
          <Button asChild>
            <Link href={`/dashboard/${userId}/scripts?tab=all`}>
              {t("notFound.returnButton")}
            </Link>
          </Button>
        </div>
      </Alert>
    </div>
  );
};

const ScriptDetailPage = ({
  params,
}: {
  params: { userId: string; scriptId: string };
}) => {
  const t = useTranslations("dashboard.scripts.detail");
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const validTabs = ["code", "comments", "versions"];
  const isValidTab = tabParam && validTabs.includes(tabParam);
  const tabName = isValidTab ? tabParam : "code";

  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userId = localStorage.getItem("userId") || "";
      setUserId(userId);
    }
  }, []);

  const {
    data: scriptInfo,
    setData: setScriptInfo,
    loading: scriptInfoLoading,
    error: scriptInfoError,
    refetch,
  } = useFetchScriptInfo(params.userId, params.scriptId);

  useEffect(() => {
    const fetchScriptInfo = async () => {
      setIsChecking(true);
      try {
        const response = await scriptApi.getScriptInfo(
          params.userId,
          params.scriptId
        );

        if (response.message === "Not allowed to access this script") {
          setHasAccess(false);
        } else {
          setHasAccess(true);
        }
      } catch (err) {
        console.error("Error fetching script info:", err);
        setHasAccess(false);
      } finally {
        setIsChecking(false);
      }
    };

    fetchScriptInfo();
  }, [params.userId, params.scriptId]);

  if (!isValidTab) {
    return <NotFoundComponent userId={userId} />;
  }

  const handleTabChange = (value: string) => {
    const currentLocale = window.location.pathname.split("/")[1]; // Get current locale from URL
    const newUrl = `/${currentLocale}/dashboard/${params.userId}/scripts/${params.scriptId}?tab=${value}`;
    router.replace(newUrl);
  };

  if (!hasAccess && !isChecking) {
    return (
      <div className="grid gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>{" "}
          <span className="sr-only">{t("back")}</span>
          <h1 className="text-2xl font-bold">{t("accessDenied.title")}</h1>
        </div>

        <Alert variant="destructive" className="bg-destructive/10">
          <ShieldAlert className="h-5 w-5" />
          <AlertTitle className="mb-2">
            {t("accessDenied.alertTitle")}
          </AlertTitle>
          <AlertDescription>{t("accessDenied.description")}</AlertDescription>
          <div className="mt-4">
            <Button asChild>
              <Link href={`/dashboard/${userId}/scripts?tab=all`}>
                {t("accessDenied.returnButton")}
              </Link>
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  if (isChecking) {
    return (
      <div className="grid gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">{t("back")}</span>
          </Button>
          <h1 className="text-2xl font-bold">{t("loading")}</h1>
        </div>
        <div className="flex items-center justify-center p-12">
          <p className="text-sm text-muted-foreground">{t("checkingAccess")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => {
            //   const currentLocale = window.location.pathname.split("/")[1];
            //   router.push(
            //     `/${currentLocale}/dashboard/${params.userId}/scripts?tab=all`
            //   );
            // }}
            router.back();
          }}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">{t("back")}</span>
        </Button>
        <h1 className="text-2xl font-bold">{scriptInfo?.name}</h1>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs value={tabName} onValueChange={handleTabChange}>
            <TabsList>
              <TabsTrigger value="code">{t("tabs.code")}</TabsTrigger>
              <TabsTrigger value="comments">{t("tabs.comments")}</TabsTrigger>
              <TabsTrigger value="versions">{t("tabs.versions")}</TabsTrigger>
            </TabsList>
            <TabsContent value="code" className="border-none p-0 pt-4">
              {scriptInfo ? (
                <CodeTab script={scriptInfo} />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {t("loadingDetails")}
                </p>
              )}
            </TabsContent>
            <TabsContent value="comments" className="border-none p-0 pt-4">
              {scriptInfo ? (
                <CommentsTab script={scriptInfo} />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {t("loadingDetails")}
                </p>
              )}
            </TabsContent>
            <TabsContent value="versions" className="border-none p-0 pt-4">
              <VersionCompareTab />
            </TabsContent>
          </Tabs>
        </div>
        <div>
          <ScriptDetailsCard script={scriptInfo} refetch={refetch} />
        </div>
      </div>
    </div>
  );
};

export default ScriptDetailPage;
