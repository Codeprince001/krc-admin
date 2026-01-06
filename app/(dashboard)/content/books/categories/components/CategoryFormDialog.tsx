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
import { ImageUpload } from "@/components/ui/image-upload";
import { Loader2 } from "lucide-react";
import { categorySchema, type CategoryFormData } from "../schemas";
import type {
  BookCategory,
  CreateBookCategoryRequest,
  UpdateBookCategoryRequest,
} from "@/types";

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: BookCategory | null;
  onSubmit: (data: CreateBookCategoryRequest | UpdateBookCategoryRequest) => void;
  isSubmitting?: boolean;
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
  onSubmit,
  isSubmitting = false,
}: CategoryFormDialogProps) {
  const isEditing = !!category;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      image: "",
      order: 0,
    },
  });

  const imageValue = watch("image");

  useEffect(() => {
    if (category) {
      setValue("name", category.name);
      setValue("description", category.description || "");
      setValue("image", category.image || "");
      setValue("order", category.order);
    } else {
      reset({
        name: "",
        description: "",
        image: "",
        order: 0,
      });
    }
  }, [category, setValue, reset]);

  const handleFormSubmit = (data: CategoryFormData) => {
    onSubmit({
      name: data.name,
      description: data.description || undefined,
      image: data.image || undefined,
      order: data.order,
    });
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Category" : "Add New Category"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the category information below."
              : "Create a new book category to organize your books."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="e.g., Christian Living"
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Brief description of this category"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Image</Label>
            <ImageUpload
              value={imageValue}
              onChange={(url) => setValue("image", url || "")}
              label="Upload category image"
              context="books"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="order">Display Order</Label>
            <Input
              id="order"
              type="number"
              {...register("order", { valueAsNumber: true })}
              placeholder="0"
              min={0}
            />
            {errors.order && (
              <p className="text-sm text-destructive">{errors.order.message}</p>
            )}
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
              {isEditing ? "Update Category" : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

