import { z } from "zod";

export const testimonySchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be less than 200 characters"),
  content: z
    .string()
    .min(10, "Content must be at least 10 characters"),
  image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  isAnonymous: z.boolean().default(false),
});

export type TestimonyFormData = z.infer<typeof testimonySchema>;

