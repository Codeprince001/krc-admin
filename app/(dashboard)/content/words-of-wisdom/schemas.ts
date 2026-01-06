import { z } from "zod";

export const wordOfWisdomSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be less than 200 characters"),
  content: z
    .string()
    .min(10, "Content must be at least 10 characters"),
  scripture: z.string().optional(),
  image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  category: z.string().optional(),
  weekOf: z.string().min(1, "Week of date is required"),
});

export type WordOfWisdomFormData = z.infer<typeof wordOfWisdomSchema>;

