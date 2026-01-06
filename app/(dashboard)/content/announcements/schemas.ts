import { z } from "zod";

export const announcementSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be less than 200 characters"),
  content: z
    .string()
    .min(10, "Content must be at least 10 characters"),
  category: z.enum([
    "GENERAL",
    "YOUTH",
    "WOMEN",
    "MEN",
    "CHOIR",
    "WORKERS",
    "URGENT",
  ]),
  isPinned: z.boolean().default(false),
  image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  expiresAt: z.string().optional(),
});

export type AnnouncementFormData = z.infer<typeof announcementSchema>;

