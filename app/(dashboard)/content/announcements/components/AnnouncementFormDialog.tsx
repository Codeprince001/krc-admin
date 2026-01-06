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
import { announcementSchema, type AnnouncementFormData } from "../schemas";
import { ANNOUNCEMENT_CATEGORIES } from "../constants";
import type { Announcement, CreateAnnouncementRequest, UpdateAnnouncementRequest } from "@/types";

interface AnnouncementFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  announcement?: Announcement | null;
  onSubmit: (data: CreateAnnouncementRequest | UpdateAnnouncementRequest) => void;
  isSubmitting?: boolean;
}

export function AnnouncementFormDialog({
  open,
  onOpenChange,
  announcement,
  onSubmit,
  isSubmitting = false,
}: AnnouncementFormDialogProps) {
  const isEditing = !!announcement;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      isPinned: false,
    },
  });

  const imageValue = watch("image");
  const categoryValue = watch("category");

  useEffect(() => {
    if (announcement) {
      setValue("title", announcement.title);
      setValue("content", announcement.content);
      setValue("category", announcement.category);
      setValue("isPinned", announcement.isPinned);
      setValue("image", announcement.image || "");
      setValue("expiresAt", announcement.expiresAt || "");
    } else {
      reset({
        isPinned: false,
      });
    }
  }, [announcement, setValue, reset]);

  const handleFormSubmit = (data: AnnouncementFormData) => {
    onSubmit({
      title: data.title,
      content: data.content,
      category: data.category,
      isPinned: data.isPinned,
      image: data.image || undefined,
      expiresAt: data.expiresAt || undefined,
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
          <DialogTitle>
            {isEditing ? "Edit Announcement" : "Create New Announcement"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the announcement information below."
              : "Create a new announcement to share with your community."}
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
                placeholder="Enter announcement title"
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>
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
                  {ANNOUNCEMENT_CATEGORIES.map((cat) => (
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">
              Content <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="content"
              {...register("content")}
              placeholder="Enter announcement content"
              rows={6}
              className={errors.content ? "border-destructive" : ""}
            />
            {errors.content && (
              <p className="text-sm text-destructive">{errors.content.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Image</Label>
            <ImageUpload
              value={imageValue}
              onChange={(url) => setValue("image", url || "")}
              label="Upload announcement image"
              context="announcements"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiresAt">Expires At</Label>
              <Input
                id="expiresAt"
                type="datetime-local"
                {...register("expiresAt")}
              />
            </div>
            <div className="space-y-2">
              <Label>Options</Label>
              <label className="flex items-center gap-2 cursor-pointer group mt-2">
                <input
                  type="checkbox"
                  {...register("isPinned")}
                  className="h-4 w-4 rounded border-input cursor-pointer accent-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
                <span className="text-sm font-medium group-hover:text-foreground transition-colors">
                  Pin to top
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
              {isEditing ? "Update Announcement" : "Create Announcement"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

