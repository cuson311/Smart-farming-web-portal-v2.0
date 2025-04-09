"use client";

import { useState, useEffect } from "react";
import { Share2, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import notificationApi from "@/api/notificationAPI";
import { useParams } from "next/navigation";
import { UserNotify } from "@/types/user";
import { formatDate } from "@/lib/formatDate";

const Notifications = () => {
  const { userId } = useParams() as { userId: string };
  const [notifications, setNotifications] = useState<UserNotify[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching notifications
    const fetchNotifications = async () => {
      try {
        const response = await notificationApi.allNotification(userId);
        setNotifications(response);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          {isLoading
            ? "Loading notifications..."
            : notifications.length === 0
            ? "No notifications to display"
            : "All notifications"}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          // Loading skeletons
          Array(3)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex items-start gap-4 p-4 border-b">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground">
              No notifications found
            </p>
          </div>
        ) : (
          notifications
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((notification) => (
              <div
                key={notification._id}
                className={`flex items-start gap-4 p-4 border-b hover:bg-accent/5 transition-colors bg-accent/10`}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={notification.from?.profile_image} />
                  <AvatarFallback>
                    {notification.from?.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">
                        <span className="font-semibold">
                          {notification.from?.username}
                        </span>{" "}
                        shared{" "}
                        {notification.script_id?.name
                          ? notification.script_id?.name
                          : "something"}{" "}
                        with you
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {/* {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })} */}
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Share2 className="h-5 w-5 text-blue-500" />
                    <Badge variant="outline">{notification.type}</Badge>
                  </div>
                </div>
              </div>
            ))
        )}
      </CardContent>
    </Card>
  );
};
export default Notifications;
