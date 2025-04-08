"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Profile from "@/components/profile/Profile";
import ActivitySection from "@/components/profile/Activity";
import Notifications from "@/components/profile/Notification";
import TopScriptList from "@/components/profile/TopScripts";
import { useEffect, useState } from "react";

// This component will be rendered on invalid tab routes
const NotFoundComponent = () => {
  const router = useRouter();
  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="text-2xl font-bold">Page Not Found</h1>
      </div>

      <Alert variant="destructive" className="bg-destructive/10">
        <ShieldAlert className="h-5 w-5" />
        <AlertTitle className="mb-2">Invalid Tab</AlertTitle>
        <AlertDescription>
          The requested tab does not exist. Please select a valid tab or return
          to the dashboard.
        </AlertDescription>
        <div className="mt-4">
          <Button asChild>
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </Alert>
    </div>
  );
};

const ProfilePage = ({ params }: { params: { userId: string } }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [isOwner, setIsOwner] = useState(false);

  // Check if the current user is the profile owner
  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentUserId = localStorage.getItem("userId");
      setIsOwner(currentUserId === params.userId);
    }
  }, [params.userId]);

  // Define valid tabs based on whether the user is the owner
  const validTabs = isOwner
    ? ["profile", "activity", "notifications", "top-scripts"]
    : ["profile", "activity", "top-scripts"];

  // Check if tab parameter is valid for the current user
  const isValidTab = tabParam && validTabs.includes(tabParam);

  // If notifications tab is requested but user is not owner, it's invalid
  const isInvalidNotificationsRequest =
    tabParam === "notifications" && !isOwner;

  // Set default tab if none is specified or if the tab is invalid
  const tabName = isValidTab ? tabParam : "profile";

  // Handle tab change by updating query parameter
  const handleTabChange = (value: string) => {
    const newUrl = `/dashboard/${params.userId}/profile?tab=${value}`;
    router.replace(newUrl);
  };

  // If invalid tab or trying to access notifications as non-owner, render NotFound component
  if (!isValidTab || isInvalidNotificationsRequest) {
    return <NotFoundComponent />;
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>
      <Tabs value={tabName} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          {isOwner && (
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          )}
          <TabsTrigger value="top-scripts">Top Scripts</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="space-y-6">
          <Profile />
        </TabsContent>
        <TabsContent value="activity">
          <ActivitySection />
        </TabsContent>
        {isOwner && (
          <TabsContent value="notifications">
            <Notifications />
          </TabsContent>
        )}
        <TabsContent value="top-scripts">
          <TopScriptList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
