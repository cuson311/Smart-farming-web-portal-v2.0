"use client";

import { useState, useEffect } from "react";
import { Share2, AlertCircle, Trash2 } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import notificationApi from "@/api/notificationAPI";
import { useParams } from "next/navigation";
import { NotiInfo } from "@/types/user";
import { formatDate } from "@/lib/formatDate";
import Pagination from "@/components/ui/pagination";
import { toast } from "@/hooks/use-toast";
import { useFetchNotifications } from "@/hooks/useFetchUser";
import { useTranslations } from "next-intl";

const ITEMS_PER_PAGE = 5;

const Notifications = () => {
  const t = useTranslations("profile.notifications");
  const { userId } = useParams() as { userId: string };
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState<
    string | null
  >(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    data: notifications,
    loading: isNotiLoading,
    refetch: refetchNoti,
  } = useFetchNotifications(userId);

  // useEffect(() => {
  //   refetchNoti();
  // }, [userId]);

  const handleDeleteClick = (notificationId: string) => {
    setNotificationToDelete(notificationId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!notificationToDelete) return;

    try {
      setIsDeleting(true);
      await notificationApi.deleteNotification(notificationToDelete);

      // Update state to remove the deleted notification
      refetchNoti();

      toast({
        title: "Success",
        description: t("delete.success"),
      });
    } catch (error) {
      console.error("Failed to delete notification:", error);
      toast({
        title: "Error",
        description: t("delete.error"),
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setNotificationToDelete(null);
    }
  };

  // Sort notifications by date (newest first)
  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Calculate pagination
  const totalPages = Math.ceil(sortedNotifications.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentNotifications = sortedNotifications.slice(startIndex, endIndex);

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>
            {isNotiLoading
              ? t("description.loading")
              : notifications.length === 0
              ? t("description.empty")
              : t("description.pagination", {
                  start: startIndex + 1,
                  end: Math.min(endIndex, notifications.length),
                  total: notifications.length,
                })}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isNotiLoading ? (
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
                {t("description.empty")}
              </p>
            </div>
          ) : (
            <>
              {currentNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className="flex items-start gap-4 p-4 border-b hover:bg-accent/5 transition-colors bg-accent/10"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={notification.from?.profile_image} />
                    <AvatarFallback>
                      {notification.from?.username
                        .substring(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium">
                          {notification.script_id?.name
                            ? t("notification.shared", {
                                username: notification.from?.username,
                                scriptName: notification.script_id?.name,
                              })
                            : t("notification.default", {
                                username: notification.from?.username,
                              })}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatDate(notification.createdAt)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDeleteClick(notification._id)}
                        aria-label="Delete notification"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Share2 className="h-5 w-5 text-blue-500" />
                      <Badge variant="outline">{notification.type}</Badge>
                    </div>
                  </div>
                </div>
              ))}

              {totalPages > 1 && (
                <div className="flex justify-center p-4 border-t">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    className="mt-2"
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("delete.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("delete.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {t("delete.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? t("delete.deleting") : t("delete.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Notifications;
