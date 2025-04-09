import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Eye,
  User,
  Github,
  Globe,
  Linkedin,
  Twitter,
  Mail,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useFetchProfile } from "@/hooks/useFetchUser";
import Link from "next/link";
import { UserProfile } from "@/types/user";
import userApi from "@/api/userAPI";
// Import for Avatar Editor Modal
import { Dialog, DialogContent } from "@/components/ui/dialog";
import AvatarEditor from "react-avatar-editor";

// Component to display the correct icon based on link type
const LinkIcon = ({ type }: { type: string }) => {
  switch (type?.toLowerCase()) {
    case "github":
      return <Github className="h-4 w-4" />;
    case "twitter":
      return <Twitter className="h-4 w-4" />;
    case "linkedin":
      return <Linkedin className="h-4 w-4" />;
    case "mail":
      return <Mail className="h-4 w-4" />;
    case "facebook":
      return <Facebook className="h-4 w-4" />;
    case "instagram":
      return <Instagram className="h-4 w-4" />;
    case "youtube":
      return <Youtube className="h-4 w-4" />;
    default:
      return <Globe className="h-4 w-4" />;
  }
};

const ProfileCard = () => {
  const { toast } = useToast();
  // Get userId
  const { userId } = useParams() as { userId: string };
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit profile form state
  const [formData, setFormData] = useState<UserProfile | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Avatar Editor Modal States
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [avatarToEdit, setAvatarToEdit] = useState<string | null>(null);
  const [editorScale, setEditorScale] = useState(1.0);
  const editorRef = useRef<AvatarEditor | null>(null);

  // Fetch user's profile
  const {
    data: profile,
    loading: profileLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useFetchProfile(userId);

  // Set initial form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData(profile);
      setPreviewImage(profile.profile_image);
    }
  }, [profile]);

  // Function to get user ID from localStorage (client-side only)
  const isCurrentUser = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("userId") === userId;
    }
    return false;
  };

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  // Handle link changes
  const handleLinkChange = (index: number, value: string) => {
    if (!formData) return;

    const updatedLinks = [...formData.links];
    updatedLinks[index] = { ...updatedLinks[index], link: value };

    setFormData({ ...formData, links: updatedLinks });
  };

  // Handle link type changes
  const handleLinkTypeChange = (index: number, value: string) => {
    if (!formData) return;

    const updatedLinks = [...formData.links];
    updatedLinks[index] = { ...updatedLinks[index], type: value };

    setFormData({ ...formData, links: updatedLinks });
  };

  // Add a new link
  const addLink = () => {
    if (!formData) return;
    setFormData({
      ...formData,
      links: [...formData.links, { type: "website", link: "" }],
    });
  };

  // Remove a link
  const removeLink = (index: number) => {
    if (!formData) return;
    const updatedLinks = formData.links.filter((_, i) => i !== index);
    setFormData({ ...formData, links: updatedLinks });
  };

  // Improved image compression function with better quality control
  const compressImage = (
    base64Str: string,
    quality = 0.2,
    maxWidth = 400,
    maxHeight = 400
  ) => {
    return new Promise<string>((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        // Use better quality settings for drawing
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, width, height);
        }

        // Further compress with lower quality setting
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
    });
  };

  // Handle Crop Image with improved compression
  const handleCrop = async () => {
    if (editorRef.current) {
      try {
        // Get the cropped canvas from the editor
        const canvas = editorRef.current.getImageScaledToCanvas();
        const croppedBase64 = canvas.toDataURL("image/jpeg", 0.8); // Use JPEG for better compression

        // Apply compression to reduce file size
        const compressedImage = await compressImage(croppedBase64, 0.2);

        // Check file size
        const approxSizeInKB = Math.round(compressedImage.length / 1.37 / 1024);
        console.log(`Compressed image size: ~${approxSizeInKB}KB`);

        // If still too large, compress further
        if (approxSizeInKB > 200) {
          return await compressImage(compressedImage, 0.1, 300, 300);
        }

        return compressedImage;
      } catch (error) {
        console.error("Error processing image:", error);
        return null;
      }
    }
    return null;
  };

  // Handle avatar change - open avatar editor modal
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size before processing
      if (file.size > 5000000) {
        // 5MB
        toast({
          title: "File too large",
          description: "The image will be compressed to prevent upload errors.",
          variant: "default",
        });
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarToEdit(result);
        setIsAvatarModalOpen(true);
        // Reset scale when opening editor
        setEditorScale(1.0);
      };
      reader.readAsDataURL(file);

      e.target.value = "";
    }
  };

  // Handle avatar edit confirmation
  const handleAvatarConfirm = async (croppedImage: string) => {
    setPreviewImage(croppedImage);
    setIsAvatarModalOpen(false);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    try {
      setIsSubmitting(true);

      // Create update object with the form data
      const updateInfo = {
        _id: formData._id,
        username: formData.username,
        bio: formData.bio,
        links: formData.links,
        profile_image: formData.profile_image,
        follower: formData.follower,
        following: formData.following,
      };

      // If there's a new preview image different from original profile image
      if (previewImage && previewImage !== profile?.profile_image) {
        updateInfo.profile_image = previewImage;
      }

      // Call the API to update the profile
      await userApi.editProfile(userId, updateInfo);

      // Show success message
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });

      // Refetch the profile data to update the view
      refetchProfile();

      // Exit edit mode
      setIsEditMode(false);
    } catch (error: any) {
      console.error("Failed to update profile:", error);

      // Handle 413 error specifically
      if (error.response && error.response.status === 413) {
        toast({
          title: "Image too large",
          description:
            "The profile image is too large. Please try a smaller image or lower quality.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update profile. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (profileLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-64">
            <p>Loading profile data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show error state
  if (profileError) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-64">
            <p className="text-red-500">
              Error loading profile. Please try again.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // View Profile UI
  if (!isEditMode) {
    return (
      <Card className="border-b-8 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Avatar Section */}
            <div className="flex justify-center md:w-1/4">
              <Avatar className="w-4/5 h-auto border-4 border-primary/20">
                <AvatarImage src={profile?.profile_image} alt="User's avatar" />
                <AvatarFallback>{profile?.username?.[0]}</AvatarFallback>
              </Avatar>
            </div>

            {/* User Info Section */}
            <div className="flex-1 space-y-4">
              {/* Username */}
              <h2 className="text-2xl font-bold mt-2">{profile?.username}</h2>

              {/* Bio */}
              <p className="text-sm text-muted-foreground">{profile?.bio}</p>

              {/* Following and Followers */}
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex items-center">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    Following: {profile?.following || 0}
                  </span>
                </div>
                <div className="flex items-center md:ml-6">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    Followers: {profile?.follower || 0}
                  </span>
                </div>
              </div>

              {/* Links */}
              <div className="space-y-2">
                {profile?.links?.map((item, index) => {
                  if (!item.link || item.link.length === 0) return null;
                  return (
                    <div key={index} className="flex items-center">
                      <div className="w-6">
                        <LinkIcon type={item.type || "website"} />
                      </div>
                      <Link
                        href={item.link}
                        className="ml-2 text-sm text-blue-500 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.link}
                      </Link>
                    </div>
                  );
                })}
              </div>

              {/* Edit Profile Button - Only show for the current user */}
              {isCurrentUser() && (
                <div className="mt-4">
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => setIsEditMode(true)}
                  >
                    Edit Profile
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Edit Profile UI
  return (
    <Card className="border-b-8 border-primary/20">
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>Update your profile information below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={previewImage || ""} alt="Profile" />
              <AvatarFallback>{formData?.username?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2">
              <Label htmlFor="avatar-upload" className="cursor-pointer">
                <Button variant="outline" size="sm" type="button" asChild>
                  <span>Change Avatar</span>
                </Button>
              </Label>
              <Input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
          </div>

          {/* Basic Info Section */}
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={formData?.username || ""}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData?.bio || ""}
                onChange={handleChange}
                rows={4}
              />
            </div>
          </div>

          {/* Social Links Section */}
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label>Social Links</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addLink}
              >
                Add Link
              </Button>
            </div>

            <div className="space-y-3">
              {formData?.links &&
                formData.links.map((link, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <select
                      className="px-2 py-1 border rounded-md w-24"
                      value={link.type}
                      onChange={(e) =>
                        handleLinkTypeChange(index, e.target.value)
                      }
                    >
                      <option value="website">Website</option>
                      <option value="github">GitHub</option>
                      <option value="twitter">Twitter</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="mail">Email</option>
                      <option value="facebook">Facebook</option>
                      <option value="instagram">Instagram</option>
                      <option value="youtube">YouTube</option>
                    </select>
                    <div className="flex items-center flex-1 gap-2 border rounded-md px-3 py-2">
                      <LinkIcon type={link.type} />
                      <Input
                        className="border-0 p-0 focus-visible:ring-0"
                        placeholder={`Enter your ${link.type} link`}
                        value={link.link || ""}
                        onChange={(e) =>
                          handleLinkChange(index, e.target.value)
                        }
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLink(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditMode(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>

      {/* Avatar Editor Modal */}
      <Dialog open={isAvatarModalOpen} onOpenChange={setIsAvatarModalOpen}>
        <DialogContent className="sm:max-w-md">
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center justify-center">
              {avatarToEdit && (
                <AvatarEditor
                  ref={editorRef}
                  image={avatarToEdit}
                  width={250}
                  height={250}
                  border={0.5}
                  borderRadius={250}
                  scale={editorScale}
                />
              )}
            </div>

            {/* Zoom slider */}
            <div className="w-full px-2">
              <Label htmlFor="zoom-slider" className="text-sm">
                Zoom
              </Label>
              <input
                id="zoom-slider"
                type="range"
                min="1"
                max="3"
                step="0.01"
                value={editorScale}
                onChange={(e) => setEditorScale(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="flex justify-between gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAvatarModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={async () => {
                  const croppedImage = await handleCrop();
                  if (croppedImage) {
                    handleAvatarConfirm(croppedImage);
                  } else {
                    toast({
                      title: "Error",
                      description: "Failed to process image. Please try again.",
                      variant: "destructive",
                    });
                  }
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ProfileCard;
