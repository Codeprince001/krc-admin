"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { testimoniesService } from "@/lib/api/services/testimonies.service";
import { mediaService } from "@/lib/api/services/media.service";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/shared/RichTextEditor";
import { toast } from "sonner";
import { ArrowLeft, Save, Upload, X, Loader2 } from "lucide-react";

export default function CreateTestimonyPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  // Create testimony mutation
  const createMutation = useMutation({
    mutationFn: async (data: {
      title: string;
      content: string;
      image?: string;
      videoUrl?: string;
    }) => {
      let imageUrl = data.image;
      let videoUrl = data.videoUrl;

      // Upload image if file is selected
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

      // Upload video if file is selected
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

      return testimoniesService.createTestimonyByAdmin({
        title: data.title,
        content: data.content,
        image: imageUrl,
        videoUrl: videoUrl,
      });
    },
    onSuccess: () => {
      toast.success("Testimony created and published successfully");
      queryClient.invalidateQueries({ queryKey: ["testimonies"] });
      router.push("/community/testimonies");
    },
    onError: (error: any) => {
      const message = typeof error?.message === 'string' ? error.message : "Failed to create testimony";
      toast.error(message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!content.trim()) {
      toast.error("Please enter content");
      return;
    }

    createMutation.mutate({
      title: title.trim(),
      content: content.trim(),
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image must be less than 10MB");
        return;
      }

      setImageFile(file);
      
      // Create preview
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
      // Validate file type
      if (!file.type.startsWith("video/")) {
        toast.error("Please select a video file");
        return;
      }
      
      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        toast.error("Video must be less than 50MB");
        return;
      }

      setVideoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  const removeVideo = () => {
    setVideoFile(null);
    setVideoPreview("");
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="Create New Testimony"
        description="Create and publish a testimony directly from the admin panel"
      />

      <div>
        <Button
          variant="outline"
          onClick={() => router.push("/community/testimonies")}
          className="w-full sm:w-auto"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Testimonies
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Testimony Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter testimony title"
                    required
                  />
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <Label htmlFor="content">
                    Content <span className="text-red-500">*</span>
                  </Label>
                  <RichTextEditor
                    content={content}
                    onChange={setContent}
                    placeholder="Write the testimony content with rich formatting..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Media Section */}
            <Card>
              <CardHeader>
                <CardTitle>Media (Optional)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Image Upload */}
                <div className="space-y-2">
                  <Label htmlFor="image">Testimony Image</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="flex-1"
                      disabled={uploadingImage}
                    />
                    {imageFile && (
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
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground mb-2">
                        Preview:
                      </p>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-w-full h-auto rounded-lg border max-h-64 object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Video Upload */}
                <div className="space-y-2">
                  <Label htmlFor="video">Testimony Video</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="video"
                      type="file"
                      accept="video/*"
                      onChange={handleVideoChange}
                      className="flex-1"
                      disabled={uploadingVideo}
                    />
                    {videoFile && (
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
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground mb-2">
                        Preview:
                      </p>
                      <video
                        src={videoPreview}
                        controls
                        className="max-w-full h-auto rounded-lg border max-h-64"
                      />
                    </div>
                  )}
                </div>

                <div className="rounded-lg bg-muted p-4 text-sm">
                  <p className="font-medium mb-1">Media Guidelines:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Images: JPG, PNG, GIF (max 10MB)</li>
                    <li>Videos: MP4, WebM, MOV (max 50MB)</li>
                    <li>Files are uploaded to Cloudinary</li>
                    <li>Recommended image size: 1200x630px</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Card */}
            <Card>
              <CardHeader>
                <CardTitle>Publish</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Testimonies created by admins are automatically approved and
                  published.
                </p>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={createMutation.isPending || uploadingImage || uploadingVideo}
                >
                  {uploadingImage || uploadingVideo ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : createMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Create & Publish
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push("/community/testimonies")}
                  disabled={createMutation.isPending || uploadingImage || uploadingVideo}
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card>
              <CardHeader>
                <CardTitle>Writing Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Use headings to organize content</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Bold important phrases</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Check grammar and spelling</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Keep paragraphs concise</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Add personal touches</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
