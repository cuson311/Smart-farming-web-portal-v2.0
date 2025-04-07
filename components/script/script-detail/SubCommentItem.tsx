import { useState } from "react";
import { ScriptComment, UpdateHistory } from "@/types/comment";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/formatDate";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
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
import { useParams } from "next/navigation";

const SubCommentItem = ({
  script,
  comment,
  getAllComments,
  getAllSubComments,
}: {
  script: Script;
  comment: ScriptComment;
  getAllComments: () => void;
  getAllSubComments: () => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [commentHistory, setCommentHistory] = useState<UpdateHistory[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const { userId } = useParams();
  const user_Id: string = Array.isArray(userId) ? userId[0] : userId;

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
      await commentApi.updateComment(
        user_Id,
        script._id,
        comment._id,
        editContent
      );

      await getAllComments();
      await getAllSubComments();

      toast({
        title: "Successful!",
        description: "Edited reply successfully",
        variant: "default",
      });
    } catch (error) {
      console.error("Error editing reply:", error);
      toast({
        title: "Failed!",
        description: "Failed to edit reply",
        variant: "destructive",
      });
    }
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
      await commentApi.deleteComment(user_Id, script._id, comment._id);
      await getAllComments();
      await getAllSubComments();

      setIsDeleteDialogOpen(false);

      toast({
        title: "Successful!",
        description: "Reply has been deleted successfully",
        variant: "default",
      });
    } catch (error) {
      console.error("Error deleting reply:", error);
      toast({
        title: "Failed!",
        description: "Failed to delete reply",
        variant: "destructive",
      });
    }
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
        user_Id,
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

  return (
    <>
      <div className="flex gap-2 py-3 border-b border-gray-100 last:border-b-0">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={comment.owner_id.profile_image}
            alt={comment.owner_id.username}
          />
          <AvatarFallback>{comment.owner_id.username.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold text-sm">
              {comment.owner_id.username}
            </span>
            <span className="text-xs text-gray-500">
              {formatDate(comment.updatedAt)}
            </span>
          </div>

          {isEditing ? (
            <div className="mt-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-16 mb-2 text-sm"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelEdit}
                  className="h-7 text-xs"
                >
                  <XIcon size={14} className="mr-1" /> Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveEdit}
                  disabled={
                    editContent === comment.content || editContent === ""
                  }
                  className="h-7 text-xs"
                >
                  <CheckIcon size={14} className="mr-1" /> Save
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm">{comment.content}</p>
          )}

          {!isEditing && (
            <div className="flex gap-2 mt-1">
              {/* Edit and Delete buttons - only for comment owner */}
              {comment.owner_id._id === userId && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEdit}
                    className="h-6 w-6 p-0"
                    title="Edit"
                  >
                    <PencilIcon size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleOpenDeleteDialog}
                    className="h-6 w-6 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                    title="Delete"
                  >
                    <TrashIcon size={14} />
                  </Button>
                </>
              )}
              {/* History button - available to all users */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleOpenHistoryDialog}
                className="h-6 w-6 p-0"
                title="View edit history"
              >
                <HistoryIcon size={14} />
              </Button>
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
            <AlertDialogTitle>Delete Reply</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this reply? This action cannot be
              undone.
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
            <DialogTitle>Reply Edit History</DialogTitle>
            <DialogDescription>
              View the edit history of this reply
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
                No edit history available for this reply
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

export default SubCommentItem;
