"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import CodeTab from "@/components/script/script-detail/Code";
import CommentsTab from "@/components/script/script-detail/Comment";
import VersionCompareTab from "@/components/script/script-detail/VersionCompare/VersionCompare";
import ScriptDetailsCard from "@/components/script/script-detail/edit-script/ScriptDetailCard";
import { useFetchScriptInfo } from "@/hooks/useFetchScript";

const ScriptDetailPage = ({
  params,
}: {
  params: { userId: string; scriptId: string };
}) => {
  const {
    data: scriptInfo,
    setData: setScriptInfo,
    loading: scriptInfoLoading,
    error: scriptInfoError,
    refetch,
  } = useFetchScriptInfo(params.userId, params.scriptId);

  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/dashboard/${params.userId}/scripts`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{scriptInfo?.name}</h1>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs defaultValue="code">
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
