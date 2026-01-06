import { z } from "zod";

export const bookSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title must be less than 255 characters"),
  author: z.string().min(1, "Author is required").max(255, "Author name must be less than 255 characters"),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  price: z.number().min(0, "Price must be positive"),
  discountPrice: z.number().min(0, "Discount price must be positive").optional(),
  isbn: z.string().optional(),
  coverImage: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  stockQuantity: z.number().int().min(0, "Stock quantity must be a positive integer"),
  isDigital: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
  publishedDate: z.string().optional(),
  pageCount: z.number().int().min(0).optional(),
});

export type BookFormData = z.infer<typeof bookSchema>;

