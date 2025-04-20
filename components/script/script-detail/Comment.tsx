import React, { useState } from "react";
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

      // Show Snackbar on success
      toast({
        title: "Comment added",
        description: "Your comment has been added successfully.",
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Failed to add comment",
        description: "Your comment has not been added.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Comments
        </CardTitle>
        <CardDescription>Discuss this script with your team</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <form onSubmit={handleCommentSubmit} className="grid gap-4">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button type="submit" className="ml-auto">
              Post Comment
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
              <p className="text-muted-foreground text-sm">No comments yet.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentsTab;
