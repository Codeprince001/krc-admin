import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  description: z.string().optional(),
  image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  order: z.number().int().min(0, "Order must be a positive integer").default(0),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

