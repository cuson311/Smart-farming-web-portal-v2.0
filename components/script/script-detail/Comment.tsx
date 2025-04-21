import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

import { Script } from "@/types/script";
import commentApi from "@/api/commentAPI";
import CommentItem from "./CommentItem";
import { useFetchComments } from "@/hooks/useFetchComment";
import { useParams } from "next/navigation";

const CommentsTab = ({ script }: { script: Script }) => {
  const t = useTranslations("dashboard.scripts.detail");
  const { toast } = useToast();
  const [newComment, setNewComment] = useState("");
  const { userId } = useParams();
  const user_Id: string = Array.isArray(userId) ? userId[0] : userId;

  const {
    data: allComments,
    setData: setAllComments,
    refetch: refetchAllComments,
  } = useFetchComments(user_Id, script._id);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    try {
      const newCommentData = {
        content: newComment,
        ownerId: localStorage.getItem("userId"),
      };
      const response = await commentApi.createComment(
        user_Id,
        script._id,
        newCommentData
      );
      console.log("New comment", response);
      setNewComment("");

      refetchAllComments();

      toast({
        title: t("comments.toast.addSuccess"),
        description: t("comments.toast.addSuccessDescription"),
        variant: "default",
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: t("comments.toast.addError"),
        description: t("comments.toast.addErrorDescription"),
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          {t("comments.title")}
        </CardTitle>
        <CardDescription>{t("comments.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <form onSubmit={handleCommentSubmit} className="grid gap-4">
            <Textarea
              placeholder={t("comments.addComment")}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button type="submit" className="ml-auto">
              {t("comments.postComment")}
            </Button>
          </form>
          <Separator />
          <div className="space-y-6">
            {allComments ? (
              allComments.map((comment) => (
                <CommentItem
                  key={comment._id}
                  script={script}
                  comment={comment}
                  refetchAllComments={refetchAllComments}
                />
              ))
            ) : (
              <p className="text-muted-foreground text-sm">
                {t("comments.noComments")}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentsTab;
