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
import { bookSchema, type BookFormData } from "../schemas";
import type { Book, CreateBookRequest } from "@/types";
import { useBookCategories } from "../hooks/useBookCategories";

interface BooksFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book?: Book | null;
  onSubmit: (data: CreateBookRequest) => void;
  isSubmitting?: boolean;
}

export function BooksFormDialog({
  open,
  onOpenChange,
  book,
  onSubmit,
  isSubmitting = false,
}: BooksFormDialogProps) {
  const { categories, isLoading: loadingCategories } = useBookCategories();
  const isEditing = !!book;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      isDigital: false,
      isFeatured: false,
    },
  });

  const coverImageValue = watch("coverImage");

  useEffect(() => {
    if (book) {
      setValue("title", book.title);
      setValue("author", book.author);
      setValue("description", book.description || "");
      setValue("categoryId", book.categoryId);
      setValue("price", Number(book.price));
      setValue("discountPrice", book.discountPrice ? Number(book.discountPrice) : undefined);
      setValue("isbn", book.isbn || "");
      setValue("coverImage", book.coverImage || "");
      setValue("stockQuantity", book.stockQuantity);
      setValue("isDigital", book.isDigital);
      setValue("isFeatured", book.isFeatured);
    } else {
      reset({
        isDigital: false,
        isFeatured: false,
      });
    }
  }, [book, setValue, reset]);

  const handleFormSubmit = (data: BookFormData) => {
    const hasValidDiscount =
      typeof data.discountPrice === "number" && !Number.isNaN(data.discountPrice) && data.discountPrice >= 0;
    const payload: CreateBookRequest = {
      ...data,
      description: data.description || undefined,
      isbn: data.isbn || undefined,
      coverImage: data.coverImage || undefined,
    };
    if (isEditing) {
      payload.discountPrice = hasValidDiscount ? data.discountPrice! : undefined;
    } else {
      if (!hasValidDiscount) delete payload.discountPrice;
      else payload.discountPrice = data.discountPrice;
    }
    onSubmit(payload as CreateBookRequest);
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Book" : "Add New Book"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the book information below."
              : "Fill in the details to add a new book to your library."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="Enter book title"
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
                  placeholder="Enter author name"
                  className={errors.author ? "border-destructive" : ""}
                />
                {errors.author && (
                  <p className="text-sm text-destructive">{errors.author.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Enter book description"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Cover Image</Label>
              <ImageUpload
                value={coverImageValue}
                onChange={(url) => setValue("coverImage", url || "")}
                label="Upload cover image"
                context="books"
              />
            </div>
          </div>

          {/* Category & Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Category & Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="categoryId">
                  Category <span className="text-destructive">*</span>
                </Label>
                <select
                  id="categoryId"
                  {...register("categoryId")}
                  disabled={loadingCategories}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">
                    {loadingCategories ? "Loading categories..." : "Select category"}
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="text-sm text-destructive">{errors.categoryId.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="isbn">ISBN</Label>
                <Input
                  id="isbn"
                  {...register("isbn")}
                  placeholder="Enter ISBN number"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Pricing & Inventory</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">
                  Price <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("price", { valueAsNumber: true })}
                  placeholder="0.00"
                  className={errors.price ? "border-destructive" : ""}
                />
                {errors.price && (
                  <p className="text-sm text-destructive">{errors.price.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountPrice">Discount Price</Label>
                <Input
                  id="discountPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("discountPrice", { valueAsNumber: true })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stockQuantity">
                  Stock Quantity <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="stockQuantity"
                  type="number"
                  min="0"
                  {...register("stockQuantity", { valueAsNumber: true })}
                  placeholder="0"
                  className={errors.stockQuantity ? "border-destructive" : ""}
                />
                {errors.stockQuantity && (
                  <p className="text-sm text-destructive">{errors.stockQuantity.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Options</h3>
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register("isDigital")}
                  className="h-4 w-4 rounded border-input cursor-pointer accent-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all"
                />
                <span className="text-sm font-medium group-hover:text-foreground transition-colors">
                  Digital Book
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register("isFeatured")}
                  className="h-4 w-4 rounded border-input cursor-pointer accent-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all"
                />
                <span className="text-sm font-medium group-hover:text-foreground transition-colors">
                  Featured
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
              {isEditing ? "Update Book" : "Create Book"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

