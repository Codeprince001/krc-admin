"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { devotionalSchema, type DevotionalFormData } from "@/lib/schemas/content.schemas";
import type { Devotional, CreateDevotionalRequest } from "@/types";

interface DevotionalFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateDevotionalRequest) => void;
  editingDevotional?: Devotional | null;
  isSubmitting?: boolean;
}

export function DevotionalFormDialog({
  open,
  onOpenChange,
  onSubmit,
  editingDevotional,
  isSubmitting = false,
}: DevotionalFormDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<DevotionalFormData>({
    resolver: zodResolver(devotionalSchema),
  });

  useEffect(() => {
    if (editingDevotional) {
      setValue("title", editingDevotional.title);
      setValue("content", editingDevotional.content);
      setValue("bibleVerse", editingDevotional.bibleVerse);
      setValue("verseReference", editingDevotional.verseReference);
      setValue("date", editingDevotional.date.split("T")[0]);
      setValue("author", editingDevotional.author);
      setValue("image", editingDevotional.image || "");
      setValue("prayer", editingDevotional.prayer || "");
    } else {
      reset();
    }
  }, [editingDevotional, setValue, reset]);

  const handleFormSubmit = (data: DevotionalFormData) => {
    const submitData: CreateDevotionalRequest = {
      ...data,
      image: data.image || undefined,
    };
    onSubmit(submitData);
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingDevotional ? "Edit Devotional" : "Add New Devotional"}
          </DialogTitle>
          <DialogDescription>
            {editingDevotional
              ? "Update the devotional information below."
              : "Fill in the details to add a new devotional."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" {...register("title")} placeholder="Devotional title" />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Author *</Label>
              <Input id="author" {...register("author")} placeholder="Author name" />
              {errors.author && (
                <p className="text-sm text-destructive">{errors.author.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              {...register("content")}
              placeholder="Devotional content"
              rows={6}
            />
            {errors.content && (
              <p className="text-sm text-destructive">{errors.content.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bibleVerse">Bible Verse *</Label>
              <Textarea
                id="bibleVerse"
                {...register("bibleVerse")}
                placeholder="Bible verse text"
                rows={2}
              />
              {errors.bibleVerse && (
                <p className="text-sm text-destructive">{errors.bibleVerse.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="verseReference">Verse Reference *</Label>
              <Input
                id="verseReference"
                {...register("verseReference")}
                placeholder="e.g., John 3:16"
              />
              {errors.verseReference && (
                <p className="text-sm text-destructive">{errors.verseReference.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input id="date" type="date" {...register("date")} />
              {errors.date && (
                <p className="text-sm text-destructive">{errors.date.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                type="url"
                {...register("image")}
                placeholder="https://..."
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
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingDevotional ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

