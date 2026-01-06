import { z } from "zod";

export const eventSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be less than 200 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters"),
  category: z.enum([
    "SERVICE",
    "CONFERENCE",
    "WORKSHOP",
    "FELLOWSHIP",
    "OUTREACH",
    "OTHER",
  ]),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  location: z.string().min(3, "Location is required"),
  image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  requiresRegistration: z.boolean().default(false),
  maxAttendees: z.number().int().min(0).optional(),
  registrationFee: z.number().min(0).optional(),
  isFeatured: z.boolean().default(false),
  status: z.enum(["UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"]).optional(),
}).refine((data) => {
  if (data.startDate && data.endDate) {
    return new Date(data.endDate) >= new Date(data.startDate);
  }
  return true;
}, {
  message: "End date must be after start date",
  path: ["endDate"],
});

export type EventFormData = z.infer<typeof eventSchema>;

