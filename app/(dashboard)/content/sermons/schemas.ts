import { z } from "zod";

export const sermonSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be less than 200 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters"),
  speaker: z
    .string()
    .min(3, "Speaker name is required"),
  category: z.enum([
    "SUNDAY_SERVICE",
    "BIBLE_STUDY",
    "PRAYER_MEETING",
    "SPECIAL_EVENT",
    "OTHER",
  ]),
  bibleReference: z.string().optional(),
  videoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  audioUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  thumbnail: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  duration: z.number().int().min(0).optional(),
  isFeatured: z.boolean().default(false),
});

export type SermonFormData = z.infer<typeof sermonSchema>;

