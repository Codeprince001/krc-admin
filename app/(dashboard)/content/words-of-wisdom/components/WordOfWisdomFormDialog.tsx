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
import { ImageUpload } from "@/components/ui/image-upload";
import { wordOfWisdomSchema, type WordOfWisdomFormData } from "../schemas";
import type { WordOfWisdom, CreateWordOfWisdomRequest, UpdateWordOfWisdomRequest } from "@/types";

interface WordOfWisdomFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wordOfWisdom?: WordOfWisdom | null;
  onSubmit: (data: CreateWordOfWisdomRequest | UpdateWordOfWisdomRequest) => void;
  isSubmitting?: boolean;
}

export function WordOfWisdomFormDialog({
  open,
  onOpenChange,
  wordOfWisdom,
  onSubmit,
  isSubmitting = false,
}: WordOfWisdomFormDialogProps) {
  const isEditing = !!wordOfWisdom;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<WordOfWisdomFormData>({
    resolver: zodResolver(wordOfWisdomSchema),
  });

  const imageValue = watch("image");

  useEffect(() => {
    if (wordOfWisdom) {
      setValue("title", wordOfWisdom.title);
      setValue("content", wordOfWisdom.content);
      setValue("scripture", wordOfWisdom.scripture || "");
      setValue("image", wordOfWisdom.imageUrl || "");
      setValue("category", wordOfWisdom.category || "");
      setValue("weekOf", wordOfWisdom.weekOf.split("T")[0]);
    } else {
      reset();
    }
  }, [wordOfWisdom, setValue, reset]);

  const handleFormSubmit = (data: WordOfWisdomFormData) => {
    onSubmit({
      title: data.title,
      content: data.content,
      scripture: data.scripture || undefined,
      image: data.image || undefined,
      category: data.category || undefined,
      weekOf: data.weekOf,
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
            {isEditing ? "Edit Word of Wisdom" : "Add New Word of Wisdom"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the word of wisdom information below."
              : "Fill in the details to add a new word of wisdom."}
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
                placeholder="Word of wisdom title"
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                {...register("category")}
                placeholder="Category (optional)"
                className={errors.category ? "border-destructive" : ""}
              />
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
              placeholder="Word of wisdom content"
              rows={6}
              className={errors.content ? "border-destructive" : ""}
            />
            {errors.content && (
              <p className="text-sm text-destructive">{errors.content.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scripture">Scripture</Label>
              <Input
                id="scripture"
                {...register("scripture")}
                placeholder="Bible verse reference (optional)"
                className={errors.scripture ? "border-destructive" : ""}
              />
              {errors.scripture && (
                <p className="text-sm text-destructive">{errors.scripture.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="weekOf">
                Week Of <span className="text-destructive">*</span>
              </Label>
              <Input
                id="weekOf"
                type="date"
                {...register("weekOf")}
                className={errors.weekOf ? "border-destructive" : ""}
              />
              {errors.weekOf && (
                <p className="text-sm text-destructive">{errors.weekOf.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Image</Label>
            <ImageUpload
              value={imageValue}
              onChange={(url) => setValue("image", url || "")}
              label="Upload word of wisdom image"
              context="words-of-wisdom"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Update Word of Wisdom" : "Create Word of Wisdom"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

