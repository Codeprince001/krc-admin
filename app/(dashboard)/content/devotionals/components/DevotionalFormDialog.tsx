"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/shared/RichTextEditor";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImageUpload } from "@/components/ui/image-upload";
import { devotionalSchema, type DevotionalFormData } from "../schemas";
import type { Devotional, CreateDevotionalRequest, UpdateDevotionalRequest } from "@/types";

interface DevotionalFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  devotional?: Devotional | null;
  onSubmit: (data: CreateDevotionalRequest | UpdateDevotionalRequest) => void;
  isSubmitting?: boolean;
}

export function DevotionalFormDialog({
  open,
  onOpenChange,
  devotional,
  onSubmit,
  isSubmitting = false,
}: DevotionalFormDialogProps) {
  const isEditing = !!devotional;
  const [content, setContent] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<DevotionalFormData>({
    resolver: zodResolver(devotionalSchema),
  });

  const imageValue = watch("image");

  // Handle content changes from RichTextEditor
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setValue("content", newContent, { shouldValidate: true });
  };

  useEffect(() => {
    if (devotional) {
      setValue("title", devotional.title);
      setContent(devotional.content);
      setValue("content", devotional.content);
      setValue("bibleVerse", devotional.bibleVerse);
      setValue("verseReference", devotional.verseReference);
      setValue("date", devotional.date.split("T")[0]);
      setValue("author", devotional.author);
      setValue("image", devotional.image || "");
      setValue("prayer", devotional.prayer || "");
    } else {
      reset();
      setContent("");
      setValue("content", "");
    }
  }, [devotional, setValue, reset]);

  const handleFormSubmit = (data: DevotionalFormData) => {
    onSubmit({
      ...data,
      content: content,
      image: data.image || undefined,
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
            {isEditing ? "Edit Devotional" : "Add New Devotional"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the devotional information below."
              : "Fill in the details to add a new devotional."}
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
                placeholder="Devotional title"
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">
                Author <span className="text-destructive">*</span>
              </Label>
              <Input
                id="author"
                {...register("author")}
                placeholder="Author name"
                className={errors.author ? "border-destructive" : ""}
              />
              {errors.author && (
                <p className="text-sm text-destructive">{errors.author.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">
              Content <span className="text-destructive">*</span>
            </Label>
            <RichTextEditor
              content={content}
              onChange={handleContentChange}
              placeholder="Write the devotional content with rich formatting..."
            />
            {errors.content && (
              <p className="text-sm text-destructive">{errors.content.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bibleVerse">
                Bible Verse <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="bibleVerse"
                {...register("bibleVerse")}
                placeholder="Bible verse text"
                rows={2}
                className={errors.bibleVerse ? "border-destructive" : ""}
              />
              {errors.bibleVerse && (
                <p className="text-sm text-destructive">{errors.bibleVerse.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="verseReference">
                Verse Reference <span className="text-destructive">*</span>
              </Label>
              <Input
                id="verseReference"
                {...register("verseReference")}
                placeholder="e.g., John 3:16"
                className={errors.verseReference ? "border-destructive" : ""}
              />
              {errors.verseReference && (
                <p className="text-sm text-destructive">{errors.verseReference.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">
                Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="date"
                type="date"
                {...register("date")}
                className={errors.date ? "border-destructive" : ""}
              />
              {errors.date && (
                <p className="text-sm text-destructive">{errors.date.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Image</Label>
              <ImageUpload
                value={imageValue}
                onChange={(url) => setValue("image", url || "")}
                label="Upload devotional image"
                context="devotionals"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prayer">Prayer</Label>
            <Textarea
              id="prayer"
              {...register("prayer")}
              placeholder="Prayer text (optional)"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Update Devotional" : "Create Devotional"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

