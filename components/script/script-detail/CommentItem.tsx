import { useState, useEffect } from "react";
import { ScriptComment, UpdateHistory } from "@/types/comment";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/formatDate";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  ReplyIcon,
  PencilIcon,
  TrashIcon,
  XIcon,
  CheckIcon,
  HistoryIcon,
} from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import commentApi from "@/api/commentAPI";
import { Script } from "@/types/script";
import { toast } from "@/hooks/use-toast";
import { useFetchSubComments } from "@/hooks/useFetchComment";
import SubCommentItem from "./SubCommentItem";
import { useParams } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

const CommentItem = ({
  script,
  comment,
  getAllComments,
}: {
  script: Script;
  comment: ScriptComment;
  getAllComments: () => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [replyContent, setReplyContent] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [showSubComments, setShowSubComments] = useState(false);
  const [commentHistory, setCommentHistory] = useState<UpdateHistory[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userId = localStorage.getItem("userId") || "";
      setUserId(userId);
    }
  }, []);
  const { data: allSubComments, setData: setAllSubComments } =
    useFetchSubComments(script.owner_id, script._id, comment._id);

  const getAllSubComments = async () => {
    try {
      const response = await commentApi.getAllSubComments(
        script.owner_id,
        script._id,
        comment._id
      );
      setAllSubComments(response);
    } catch (error) {
      console.error("Error getting subcomments:", error);
    }
  };

  useEffect(() => {
    if (comment._id) {
      getAllSubComments();
    }
  }, [comment._id]);

  /////////////////////Edit//////////////////////////
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(comment.content);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await commentApi.updateComment(
        script.owner_id,
        script._id,
        comment._id,
        editContent
      );

      await getAllComments();

      toast({
        title: "Successful!",
        description: "Edited comment successfully",
        variant: "default",
      });
    } catch (error) {
      console.error("Error editing comment:", error);
      toast({
        title: "Failed!",
        description: "Failed to edit comment",
        variant: "destructive",
      });
    }
    await getAllSubComments();
    setIsEditing(false);
  };

  /////////////////////Delete//////////////////////////
  const handleOpenDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    try {
      await commentApi.deleteComment(script.owner_id, script._id, comment._id);
      await getAllComments();
      await getAllSubComments();

      setIsDeleteDialogOpen(false);

      toast({
        title: "Successful!",
        description: "Comment has been deleted successfully",
        variant: "default",
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast({
        title: "Failed!",
        description: "Failed to delete comment",
        variant: "destructive",
      });
    }
  };

  /////////////////////Reply//////////////////////////
  const handleReply = () => {
    setIsReplying(true);
  };

  const handleCancelReply = () => {
    setIsReplying(false);
    setReplyContent("");
  };

  const handleSubmitReply = async () => {
    const replyCommentData = {
      content: replyContent,
      ownerId: userId,
      subCommentId: comment._id,
    };

    try {
      const response = await commentApi.createComment(
        script.owner_id,
        script._id,
        replyCommentData
      );

      await getAllComments();
      toast({
        title: "Successful!",
        description: "Reply comment successfully",
        variant: "default",
      });
    } catch (error) {
      console.error("Error sending reply:", error);
      toast({
        title: "Failed!",
        description: "Failed to reply comment",
        variant: "destructive",
      });
    }
    await getAllSubComments();
    setReplyContent("");
    setIsReplying(false);
    setShowSubComments(true); // Show subcomments after replying
  };

  /////////////////////History//////////////////////////
  const handleOpenHistoryDialog = async () => {
    setIsHistoryDialogOpen(true);
    await fetchCommentHistory();
  };

  const fetchCommentHistory = async () => {
    setIsLoadingHistory(true);
    try {
      // Replace this with your actual API call to get comment history
      const response = await commentApi.getCommentHistory(
        script.owner_id,
        script._id,
        comment._id
      );
      setCommentHistory(response);
    } catch (error) {
      console.error("Error fetching comment history:", error);
      toast({
        title: "Failed!",
        description: "Could not load comment history",
        variant: "destructive",
      });
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Toggle subcomments visibility
  const toggleSubComments = () => {
    setShowSubComments(!showSubComments);
    if (!showSubComments) {
      getAllSubComments();
    }
  };

  return (
    <>
      <div className="flex gap-3 p-4 border-b">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={comment.owner_id.profile_image}
            alt={comment.owner_id.username}
          />
          <AvatarFallback>{comment.owner_id.username.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold">{comment.owner_id.username}</span>
            <span className="text-sm text-gray-500">
              {formatDate(comment.updatedAt)}
              {/* {formatDistanceToNow(new Date(comment.updatedAt), {
                addSuffix: true,
              })} */}
            </span>
          </div>

          {isEditing ? (
            <div className="mt-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-20 mb-2"
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                  <XIcon size={16} className="mr-1" /> Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveEdit}
                  disabled={
                    editContent === comment.content || editContent === ""
                  }
                >
                  <CheckIcon size={16} className="mr-1" /> Save
                </Button>
              </div>
            </div>
          ) : (
            <p className="mb-2">{comment.content}</p>
          )}

          {!isEditing && !isReplying && (
            <div className="flex gap-2 mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReply}
                className="h-8 w-8 p-0"
                title="Reply"
              >
                <ReplyIcon size={16} />
              </Button>

              {comment.owner_id._id === userId && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEdit}
                    className="h-8 w-8 p-0"
                    title="Edit"
                  >
                    <PencilIcon size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleOpenDeleteDialog}
                    className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                    title="Delete"
                  >
                    <TrashIcon size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleOpenHistoryDialog}
                    className="h-8 w-8 p-0"
                    title="View edit history"
                  >
                    <HistoryIcon size={16} />
                  </Button>
                </>
              )}
              {allSubComments && allSubComments.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSubComments}
                  className="text-xs ml-auto"
                >
                  {showSubComments ? "Hide" : "Show"} replies (
                  {allSubComments.length})
                </Button>
              )}
            </div>
          )}

          {isReplying && (
            <div className="mt-4 pl-4 border-l-2 border-gray-200">
              <Textarea
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="min-h-20 mb-2"
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={handleCancelReply}>
                  <XIcon size={16} className="mr-1" /> Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSubmitReply}
                  disabled={replyContent === ""}
                >
                  <ReplyIcon size={16} className="mr-1" /> Reply
                </Button>
              </div>
            </div>
          )}

          {/* SubComments Section */}
          {showSubComments && allSubComments && allSubComments.length > 0 && (
            <div className="mt-4 pl-6 border-l border-gray-200">
              {allSubComments.map((subComment) => (
                <SubCommentItem
                  key={subComment._id}
                  script={script}
                  comment={subComment}
                  getAllComments={getAllComments}
                  getAllSubComments={getAllSubComments}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseDeleteDialog}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* History Dialog */}
      <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Comment Edit History</DialogTitle>
            <DialogDescription>
              View the edit history of this comment
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {isLoadingHistory ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : commentHistory && commentHistory.length > 0 ? (
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {commentHistory.map((comment, index) => (
                  <div key={index} className="border rounded-md p-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">Edit {index + 1}</span>
                      <span className="text-gray-500">
                        {formatDate(comment.updatedAt)}
                      </span>
                    </div>
                    <p className="text-sm">{comment.changes[0]}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">
                No edit history available for this comment
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CommentItem;
