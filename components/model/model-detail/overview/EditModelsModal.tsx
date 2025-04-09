import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Search, X, Globe, Lock } from "lucide-react";
import userApi from "@/api/userAPI";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import notificationApi from "@/api/notificationAPI";
import { Model } from "@/types/model";

type SearchUser = {
  _id: string;
  username: string;
  profile_image?: string;
};

type EditModelModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: any) => void;
  model: Model | null;
  title?: string;
};

// Search Results Component - Styled like first file
// const SearchResults = ({
//   searchResults,
//   handleAddUser,
//   sharedUserIds,
//   handleCloseResults,
// }: {
//   searchResults: SearchUser[];
//   handleAddUser: (index: number) => void;
//   sharedUserIds: string[];
//   handleCloseResults: () => void;
// }) => {
//   return searchResults.length > 0 ? (
//     <Card className="w-full max-h-64 overflow-y-auto relative mt-2">
//       <CardContent className="p-4">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-2">
//           <span className="text-sm text-muted-foreground">Search Results</span>
//           <Button
//             variant="ghost"
//             size="icon"
//             className="h-6 w-6"
//             onClick={handleCloseResults}
//           >
//             <X className="h-4 w-4" />
//           </Button>
//         </div>

//         {/* Results List */}
//         <div className="space-y-2">
//           {searchResults.map((user, index) => (
//             <div
//               key={index}
//               className="flex items-center justify-between p-2 rounded-md hover:bg-accent"
//             >
//               <div className="flex items-center gap-2">
//                 <Avatar className="h-8 w-8">
//                   <AvatarImage src={user.profile_image} />
//                   <AvatarFallback>{user.username[0] || "?"}</AvatarFallback>
//                 </Avatar>
//                 <div className="text-sm">
//                   <p className="font-medium">
//                     {user.username || "Unknown User"}
//                   </p>
//                 </div>
//               </div>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => handleAddUser(index)}
//                 disabled={sharedUserIds.includes(user._id)}
//               >
//                 {sharedUserIds.includes(user._id) ? "Added" : "Add"}
//               </Button>
//             </div>
//           ))}
//         </div>
//       </CardContent>
//     </Card>
//   ) : (
//     <Card className="w-full relative mt-2">
//       <CardContent className="p-4">
//         <div className="flex justify-between items-center mb-2">
//           <span className="text-sm text-muted-foreground">Search Results</span>
//           <Button
//             variant="ghost"
//             size="icon"
//             className="h-6 w-6"
//             onClick={handleCloseResults}
//           >
//             <X className="h-4 w-4" />
//           </Button>
//         </div>
//         <div className="flex items-center justify-center py-4">
//           <p className="text-sm text-muted-foreground">No users found</p>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

const EditModelModal = ({
  open,
  onClose,
  onConfirm,
  model,
  title = "Edit Model",
}: EditModelModalProps) => {
  // Form Data
  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    description: "",
  });

  const [oldUserShareId, setOldUserShareId] = useState<string[]>([]);
  const [sharedUsers, setSharedUsers] = useState<any[]>([]);

  // Search state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    if (model && open) {
      setFormData({
        _id: model._id || "",
        name: model.name || "",
        description: model.description || "",
        // owner_id: model.owner_id || "",
      });
    }
  }, [model, open]);

  useEffect(() => {
    const userIds = sharedUsers.map((user) => user._id);
    setFormData((prev) => ({
      ...prev,
      share_id: userIds,
    }));
  }, [sharedUsers]);

  const handleChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear shared users when switching to public
    if (name === "privacy" && value === "public") {
      setSharedUsers([]);
      setSearchTerm("");
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      const response = await userApi.searchUser(searchTerm);
      setSearchResults(response);
      setShowSearchResults(true);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  const handleAddUser = (index: number) => {
    const userToAdd = searchResults[index];
    if (!sharedUsers.some((user) => user._id === userToAdd._id)) {
      setSharedUsers([...sharedUsers, userToAdd]);
    }
  };

  const handleRemoveUser = (index: number) => {
    const updatedUsers = [...sharedUsers];
    updatedUsers.splice(index, 1);
    setSharedUsers(updatedUsers);
  };

  const handleSubmit = async () => {
    if (!formData.name) {
      toast({
        title: "Missing information",
        description: "Please provide a name for your model.",
        variant: "destructive",
      });
      return;
    }

    // // Ensure share_id is empty for public scripts
    // if (formData.privacy === "public") {
    //   formData.share_id = [];
    // }
    // if (formData.privacy === "private") {
    //   const compareShareUser = (arr1: string[], arr2: string[]) => {
    //     if (arr1.length !== arr2.length) {
    //       // Return elements that are in arr1 but not in arr2
    //       return arr1.filter((item) => !arr2.includes(item));
    //     }

    //     const sortedArr1 = arr1.slice().sort();
    //     const sortedArr2 = arr2.slice().sort();

    //     // Return null if the arrays are the same
    //     if (sortedArr1.every((item, index) => item === sortedArr2[index])) {
    //       return null; // Arrays are the same
    //     }

    //     // Return the elements that are in arr1 but not in arr2
    //     return arr1.filter((item) => !arr2.includes(item));
    //   };

    //   // Compare formData.share_id with oldUserShareId
    //   const newShareUserList = compareShareUser(
    //     formData.share_id,
    //     oldUserShareId
    //   );

    //   if (newShareUserList) {
    //     await notificationApi.createNotification(
    //       formData.owner_id,
    //       newShareUserList,
    //       formData._id
    //     );
    //   }
    // }
    onConfirm(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[65%] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {/* Script Info */}
        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="font-medium">
                Model Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter model name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Enter model description (optional)"
                rows={4}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditModelModal;
