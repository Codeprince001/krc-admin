"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { testimoniesService } from "@/lib/api/services/testimonies.service";
import { mediaService } from "@/lib/api/services/media.service";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RichTextEditor } from "@/components/shared/RichTextEditor";
import { LoadingState } from "@/components/shared/LoadingState";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "sonner";
import {
  ArrowLeft,
  Save,
  Check,
  X,
  Download,
  Upload,
  Loader2,
} from "lucide-react";
import { formatDate } from "@/lib/utils/format";
import type { Testimony } from "@/types";

export default function TestimonyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const testimonyId = params.id as string;

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [confirmApprove, setConfirmApprove] = useState(false);
  const [confirmReject, setConfirmReject] = useState(false);

  // Fetch testimony details
  const { data: testimony, isLoading } = useQuery({
    queryKey: ["testimony", testimonyId],
    queryFn: async () => {
      const response = await testimoniesService.getTestimonyById(testimonyId);
      // Initialize form fields when data loads
      setTitle(response.title);
      setContent(response.content);
      setImagePreview(response.image || "");
      setVideoPreview(response.videoUrl || "");
      return response;
    },
  });

  // Update testimony mutation
  const updateMutation = useMutation({
    mutationFn: async (data: {
      title?: string;
      content?: string;
      image?: string;
      videoUrl?: string;
      status?: "APPROVED" | "REJECTED" | "PENDING";
    }) => {
      let imageUrl = data.image;
      let videoUrl = data.videoUrl;

      // Upload new image if file is selected
      if (imageFile) {
        setUploadingImage(true);
        try {
          const uploadResult = await mediaService.uploadImage(imageFile, "testimonies");
          imageUrl = uploadResult.secureUrl || uploadResult.url;
        } catch (error) {
          setUploadingImage(false);
          throw new Error("Failed to upload image: " + (error as Error).message);
        }
        setUploadingImage(false);
      }

      // Upload new video if file is selected
      if (videoFile) {
        setUploadingVideo(true);
        try {
          const uploadResult = await mediaService.uploadVideo(videoFile, "testimonies");
          videoUrl = uploadResult.secureUrl || uploadResult.url;
        } catch (error) {
          setUploadingVideo(false);
          throw new Error("Failed to upload video: " + (error as Error).message);
        }
        setUploadingVideo(false);
      }

      return testimoniesService.updateTestimony(testimonyId, {
        ...data,
        image: imageUrl,
        videoUrl: videoUrl,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimony", testimonyId] });
      queryClient.invalidateQueries({ queryKey: ["testimonies"] });
      toast.success("Testimony updated successfully");
      setIsEditing(false);
      setImageFile(null);
      setVideoFile(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update testimony");
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image must be less than 10MB");
        return;
      }

      setImageFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("video/")) {
        toast.error("Please select a video file");
        return;
      }
      
      if (file.size > 50 * 1024 * 1024) {
        toast.error("Video must be less than 50MB");
        return;
      }

      setVideoFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(testimony?.image || "");
  };

  const removeVideo = () => {
    setVideoFile(null);
    setVideoPreview(testimony?.videoUrl || "");
  };

  const handleSave = () => {
    updateMutation.mutate({
      title,
      content,
      image: imagePreview,
      videoUrl: videoPreview,
    });
  };

  const handleApprove = () => setConfirmApprove(true);

  const handleConfirmApprove = () => {
    updateMutation.mutate({ status: "APPROVED" });
    setConfirmApprove(false);
  };

  const handleReject = () => setConfirmReject(true);

  const handleConfirmReject = () => {
    updateMutation.mutate({ status: "REJECTED" });
    setConfirmReject(false);
  };

  const handleDownloadImage = () => {
    if (testimony?.image) {
      window.open(testimony.image, "_blank");
    }
  };

  const handleDownloadVideo = () => {
    if (testimony?.videoUrl) {
      window.open(testimony.videoUrl, "_blank");
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "default";
      case "PENDING":
        return "secondary";
      case "REJECTED":
        return "destructive";
      default:
        return "secondary";
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading testimony..." />;
  }

  if (!testimony) {
    return (
      <div className="space-y-6">
        <PageHeader title="Testimony Not Found" />
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              The testimony you're looking for doesn't exist.
            </p>
            <Button
              variant="outline"
              onClick={() => router.push("/community/testimonies")}
              className="mt-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Testimonies
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title={isEditing ? "Edit Testimony" : "Testimony Details"}
        description={
          isEditing
            ? "Make changes and publish the testimony"
            : "View and manage testimony submission"
        }
      />

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => router.back()} className="w-full sm:w-auto">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            <Save className="mr-2 h-4 w-4" />
            Edit Testimony
          </Button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Content</CardTitle>
                <Badge variant={getStatusVariant(testimony.status)}>
                  {testimony.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                {isEditing ? (
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Testimony title"
                  />
                ) : (
                  <h2 className="text-2xl font-bold">{testimony.title}</h2>
                )}
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                {isEditing ? (
                  <RichTextEditor
                    content={content}
                    onChange={setContent}
                    placeholder="Write the testimony content..."
                  />
                ) : (
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: testimony.content }}
                  />
                )}
              </div>

              {/* Save/Cancel Buttons */}
              {isEditing && (
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleSave}
                    disabled={updateMutation.isPending || uploadingImage || uploadingVideo}
                  >
                    {uploadingImage || uploadingVideo ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : updateMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setTitle(testimony.title);
                      setContent(testimony.content);
                      setImageFile(null);
                      setVideoFile(null);
                      setImagePreview(testimony.image || "");
                      setVideoPreview(testimony.videoUrl || "");
                    }}
                    disabled={updateMutation.isPending || uploadingImage || uploadingVideo}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Media Section */}
          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Image */}
              <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                {isEditing ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="flex-1"
                        disabled={uploadingImage}
                      />
                      {(imageFile || imagePreview) && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={removeImage}
                          disabled={uploadingImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    {uploadingImage && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading image...
                      </div>
                    )}
                    {imagePreview && !uploadingImage && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-w-full h-auto rounded-lg border max-h-64 object-cover"
                      />
                    )}
                  </div>
                ) : testimony.image ? (
                  <div className="space-y-2">
                    <img
                      src={testimony.image}
                      alt={testimony.title}
                      className="max-w-full h-auto rounded-lg border"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadImage}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Image
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No image attached
                  </p>
                )}
              </div>

              {/* Video */}
              <div className="space-y-2">
                <Label htmlFor="video">Video</Label>
                {isEditing ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Input
                        id="video"
                        type="file"
                        accept="video/*"
                        onChange={handleVideoChange}
                        className="flex-1"
                        disabled={uploadingVideo}
                      />
                      {(videoFile || videoPreview) && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={removeVideo}
                          disabled={uploadingVideo}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    {uploadingVideo && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading video...
                      </div>
                    )}
                    {videoPreview && !uploadingVideo && (
                      <video
                        src={videoPreview}
                        controls
                        className="max-w-full h-auto rounded-lg border max-h-64"
                      />
                    )}
                  </div>
                ) : testimony.videoUrl ? (
                  <div className="space-y-2">
                    <video
                      src={testimony.videoUrl}
                      controls
                      className="max-w-full h-auto rounded-lg border"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadVideo}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Video
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No video attached
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Author Info */}
          <Card>
            <CardHeader>
              <CardTitle>Author</CardTitle>
            </CardHeader>
            <CardContent>
              {testimony.isAnonymous ? (
                <div className="text-sm text-muted-foreground">Anonymous</div>
              ) : testimony.user ? (
                <div className="space-y-2">
                  <p className="font-medium">
                    {testimony.user.firstName || testimony.user.lastName
                      ? `${testimony.user.firstName || ""} ${testimony.user.lastName || ""}`.trim()
                      : testimony.user.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimony.user.email}
                  </p>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">N/A</div>
              )}
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Submitted:</span>{" "}
                {formatDate(testimony.createdAt, "PPP")}
              </div>
              <div>
                <span className="font-medium">Last Updated:</span>{" "}
                {formatDate(testimony.updatedAt, "PPP")}
              </div>
              <div>
                <span className="font-medium">Status:</span>{" "}
                <Badge variant={getStatusVariant(testimony.status)}>
                  {testimony.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          {testimony.status === "PENDING" && (
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  className="w-full"
                  onClick={handleApprove}
                  disabled={updateMutation.isPending}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Approve & Publish
                </Button>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleReject}
                  disabled={updateMutation.isPending}
                >
                  <X className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmApprove}
        onOpenChange={setConfirmApprove}
        title="Approve testimony"
        description="Are you sure you want to approve this testimony? It will be published immediately."
        confirmLabel="Approve"
        onConfirm={handleConfirmApprove}
        variant="default"
        isLoading={updateMutation.isPending}
      />

      <ConfirmDialog
        open={confirmReject}
        onOpenChange={setConfirmReject}
        title="Reject testimony"
        description="Are you sure you want to reject this testimony?"
        confirmLabel="Reject"
        onConfirm={handleConfirmReject}
        variant="destructive"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}
