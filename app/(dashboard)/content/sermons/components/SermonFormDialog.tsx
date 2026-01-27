"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/ui/image-upload";
import { Loader2 } from "lucide-react";
import { sermonSchema, type SermonFormData } from "../schemas";
import { SERMON_TYPES } from "../constants";
import type { Sermon, CreateSermonRequest, UpdateSermonRequest } from "@/types";

interface SermonFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sermon?: Sermon | null;
  onSubmit: (data: CreateSermonRequest | UpdateSermonRequest) => void;
  isSubmitting?: boolean;
}

export function SermonFormDialog({
  open,
  onOpenChange,
  sermon,
  onSubmit,
  isSubmitting = false,
}: SermonFormDialogProps) {
  const isEditing = !!sermon;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<SermonFormData>({
    resolver: zodResolver(sermonSchema),
    defaultValues: {
      isFeatured: false,
    },
  });

  const thumbnailValue = watch("thumbnail");
  const categoryValue = watch("category");

  useEffect(() => {
    if (sermon) {
      setValue("title", sermon.title);
      setValue("description", sermon.description);
      setValue("speaker", sermon.speaker);
      setValue("category", sermon.category);
      setValue("bibleReference", sermon.bibleReference || "");
      setValue("videoUrl", sermon.videoUrl || "");
      setValue("audioUrl", sermon.audioUrl || "");
      setValue("thumbnail", sermon.thumbnail || "");
      setValue("duration", sermon.duration);
      setValue("isFeatured", sermon.isFeatured);
    } else {
      reset({
        isFeatured: false,
      });
    }
  }, [sermon, setValue, reset]);

  const handleFormSubmit = (data: SermonFormData) => {
    onSubmit({
      title: data.title,
      description: data.description,
      speaker: data.speaker,
      category: data.category,
      bibleReference: data.bibleReference || undefined,
      videoUrl: data.videoUrl || undefined,
      audioUrl: data.audioUrl || undefined,
      thumbnail: data.thumbnail || undefined,
      duration: data.duration,
      isFeatured: data.isFeatured,
    });
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Sermon" : "Create New Sermon"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the sermon information below."
              : "Add a new sermon to share with your community."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="Enter sermon title"
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="speaker">
                Speaker <span className="text-destructive">*</span>
              </Label>
              <Input
                id="speaker"
                {...register("speaker")}
                placeholder="Enter speaker name"
                className={errors.speaker ? "border-destructive" : ""}
              />
              {errors.speaker && (
                <p className="text-sm text-destructive">{errors.speaker.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Enter sermon description"
              rows={4}
              className={errors.description ? "border-destructive" : ""}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select
                value={categoryValue}
                onValueChange={(value) => setValue("category", value as any)}
              >
                <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {SERMON_TYPES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="bibleReference">Bible Reference</Label>
              <Input
                id="bibleReference"
                {...register("bibleReference")}
                placeholder="e.g., John 3:16"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="videoUrl">Video URL</Label>
              <Input
                id="videoUrl"
                {...register("videoUrl")}
                placeholder="https://..."
                type="url"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="audioUrl">Audio URL</Label>
              <Input
                id="audioUrl"
                {...register("audioUrl")}
                placeholder="https://..."
                type="url"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-base font-semibold">Live Streaming</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="youtubeId">YouTube Video ID</Label>
                <Input
                  id="youtubeId"
                  {...register("youtubeId")}
                  placeholder="dQw4w9WgXcQ"
                />
                <p className="text-xs text-muted-foreground">
                  For youtube.com/watch?v=<strong>dQw4w9WgXcQ</strong>
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebookVideoId">Facebook Video ID</Label>
                <Input
                  id="facebookVideoId"
                  {...register("facebookVideoId")}
                  placeholder="123456789"
                />
                <p className="text-xs text-muted-foreground">
                  From Facebook live stream URL
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (seconds)</Label>
              <Input
                id="duration"
                type="number"
                min="0"
                {...register("duration", { valueAsNumber: true })}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label>Thumbnail</Label>
              <ImageUpload
                value={thumbnailValue}
                onChange={(url) => setValue("thumbnail", url || "")}
                label="Upload thumbnail"
                context="sermons"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Options</Label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register("isLive")}
                  className="h-4 w-4 rounded border-input cursor-pointer accent-red-600 focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
                <span className="text-sm font-medium group-hover:text-foreground transition-colors">
                  🔴 Currently Live
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register("isFeatured")}
                  className="h-4 w-4 rounded border-input cursor-pointer accent-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
                <span className="text-sm font-medium group-hover:text-foreground transition-colors">
                  Featured Sermon
                </span>
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Update Sermon" : "Create Sermon"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

