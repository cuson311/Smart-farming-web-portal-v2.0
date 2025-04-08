"use client";

import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

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
  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/dashboard/${userId}/scripts`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Page Not Found</h1>
      </div>

      <Alert variant="destructive" className="bg-destructive/10">
        <ShieldAlert className="h-5 w-5" />
        <AlertTitle className="mb-2">Invalid Tab</AlertTitle>
        <AlertDescription>
          The requested tab does not exist. Please select a valid tab or return
          to your scripts.
        </AlertDescription>
        <div className="mt-4">
          <Button asChild>
            <Link href={`/dashboard/${userId}/scripts`}>
              Return to My Scripts
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const validTabs = ["code", "comments", "versions"];
  // Changed this line to require a tab parameter that is valid
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

  // If no tab param or invalid tab, render NotFound component
  if (!isValidTab) {
    return <NotFoundComponent userId={userId} />;
  }

  // Handle tab change by updating query parameter
  const handleTabChange = (value: string) => {
    const newUrl = `/dashboard/${params.userId}/scripts/${params.scriptId}?tab=${value}`;
    router.replace(newUrl);
  };

  // Access denied UI
  if (!hasAccess && !isChecking) {
    return (
      <div className="grid gap-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/dashboard/${userId}/scripts`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Script Access</h1>
        </div>

        <Alert variant="destructive" className="bg-destructive/10">
          <ShieldAlert className="h-5 w-5" />
          <AlertTitle className="mb-2">Access Denied</AlertTitle>
          <AlertDescription>
            You don't have permission to view this script. Please contact the
            script owner if you believe this is an error.
          </AlertDescription>
          <div className="mt-4">
            <Button asChild>
              <Link href={`/dashboard/${userId}/scripts`}>
                Return to My Scripts
              </Link>
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  // Loading state
  if (isChecking) {
    return (
      <div className="grid gap-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/dashboard/${userId}/scripts`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Loading...</h1>
        </div>
        <div className="flex items-center justify-center p-12">
          <p className="text-sm text-muted-foreground">
            Checking access permissions...
          </p>
        </div>
      </div>
    );
  }

  // Normal view with access
  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/dashboard/${userId}/scripts`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{scriptInfo?.name}</h1>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs value={tabName} onValueChange={handleTabChange}>
            <TabsList>
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="versions">Versions</TabsTrigger>
            </TabsList>
            <TabsContent value="code" className="border-none p-0 pt-4">
              {scriptInfo ? (
                <CodeTab script={scriptInfo} />
              ) : (
                <p className="text-sm text-muted-foreground">
                  Loading script details...
                </p>
              )}
            </TabsContent>
            <TabsContent value="comments" className="border-none p-0 pt-4">
              {scriptInfo ? (
                <CommentsTab script={scriptInfo} />
              ) : (
                <p className="text-sm text-muted-foreground">
                  Loading script details...
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
