"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { Bell, Share2, AlertCircle, Check, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import notificationApi from "@/api/notificationAPI";
import { useParams } from "next/navigation";

// Define TypeScript interfaces
interface UserInfo {
  _id: string;
  username: string;
}

interface ScriptInfo {
  _id: string;
  name: string;
}

interface Notification {
  _id: string;
  type: string;
  from: UserInfo;
  to: string;
  script_id: ScriptInfo | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
  read?: boolean; // Optional property to track read status
}

const Notifications = () => {
  const { userId } = useParams() as { userId: string };
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

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

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification._id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification._id !== id)
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  const getFilteredNotifications = () => {
    switch (activeTab) {
      case "unread":
        return notifications.filter((notification) => !notification.read);
      case "read":
        return notifications.filter((notification) => notification.read);
      default:
        return notifications;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "share":
        return <Share2 className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationMessage = (notification: Notification) => {
    switch (notification.type) {
      case "share":
        return (
          <span>
            <span className="font-medium">{notification.from.username}</span>{" "}
            shared something with you
          </span>
        );
      default:
        return "New notification";
    }
  };
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          {isLoading
            ? "Loading notifications..."
            : notifications.length === 0
            ? "No notifications to display"
            : `You have ${
                notifications.filter((n) => !n.read).length
              } unread notification${
                notifications.filter((n) => !n.read).length !== 1 ? "s" : ""
              }`}
        </CardDescription>
        <div className="flex items-center justify-between mt-2">
          <TabsList className="grid grid-cols-3 w-fit">
            <TabsTrigger value="all-notifications">
              All
              <Badge variant="outline" className="ml-2">
                {notifications.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="unread-notifications">
              Unread
              <Badge variant="outline" className="ml-2">
                {notifications.filter((n) => !n.read).length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="read-notifications">
              Read
              <Badge variant="outline" className="ml-2">
                {notifications.filter((n) => n.read).length}
              </Badge>
            </TabsTrigger>
          </TabsList>
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            disabled={!notifications.some((n) => !n.read)}
          >
            <Check className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        </div>
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
            .filter((notification) => {
              if (activeTab === "unread-notifications")
                return !notification.read;
              if (activeTab === "read-notifications") return notification.read;
              return true; // "all-notifications"
            })
            .map((notification) => (
              <div
                key={notification._id}
                className={`flex items-start gap-4 p-4 border-b hover:bg-accent/5 transition-colors ${
                  !notification.read ? "bg-accent/10" : ""
                }`}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${notification.from.username}`}
                  />
                  <AvatarFallback>
                    {notification.from.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">
                        <span className="font-semibold">
                          {notification.from.username}
                        </span>{" "}
                        shared{" "}
                        {notification.script_id?.name
                          ? notification.script_id?.name
                          : "something"}{" "}
                        with you
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => markAsRead(notification._id)}
                        >
                          <Check className="h-4 w-4" />
                          <span className="sr-only">Mark as read</span>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteNotification(notification._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
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
