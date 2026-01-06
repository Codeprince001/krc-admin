import { z } from "zod";

export const devotionalSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be less than 200 characters"),
  content: z
    .string()
    .min(10, "Content must be at least 10 characters"),
  bibleVerse: z.string().min(1, "Bible verse is required"),
  verseReference: z.string().min(1, "Verse reference is required"),
  date: z.string().min(1, "Date is required"),
  author: z.string().min(3, "Author name is required"),
  image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  prayer: z.string().optional(),
});

export type DevotionalFormData = z.infer<typeof devotionalSchema>;

