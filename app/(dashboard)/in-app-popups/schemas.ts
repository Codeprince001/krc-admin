import { z } from "zod";

export const inAppPopupSchema = z
  .object({
    title: z.string().min(2, "Title must be at least 2 characters").max(200),
    message: z.string().min(2, "Message must be at least 2 characters").max(2000),
    imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    ctaType: z.enum(["NONE", "INTERNAL_ROUTE", "EXTERNAL_URL"]).default("NONE"),
    ctaLabel: z.string().max(60).optional().or(z.literal("")),
    ctaValue: z.string().optional().or(z.literal("")),
    status: z.enum(["DRAFT", "ACTIVE", "PAUSED", "ENDED"]).default("DRAFT"),
    contexts: z
      .array(z.enum(["APP_OPEN", "HOME_SCREEN", "EVENTS_SCREEN", "GLOBAL"]))
      .min(1, "Select at least one display context"),
    priority: z.coerce.number().int().min(0).default(0),
    targetAllUsers: z.boolean().default(true),
    targetRoles: z
      .array(z.enum(["MEMBER", "WORKER", "PASTOR", "ADMIN", "SUPER_ADMIN"]))
      .default([]),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    minIntervalHours: z.coerce.number().int().min(0).default(24),
    maxShowsPerDay: z.coerce.number().int().min(0).default(1),
    maxShowsPerWeek: z.coerce.number().int().min(0).default(2),
    maxShowsLifetimePerUser: z.coerce.number().int().min(0).default(5),
    maxShowsPerSession: z.coerce.number().int().min(0).default(1),
    delayAfterAppOpenSeconds: z.coerce.number().int().min(0).default(5),
    dismissible: z.boolean().default(true),
    requireAction: z.boolean().default(false),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.endDate) > new Date(data.startDate);
      }
      return true;
    },
    { message: "End date must be after start date", path: ["endDate"] }
  )
  .refine(
    (data) => {
      if (data.ctaType === "NONE") return true;
      return !!data.ctaLabel?.trim() && !!data.ctaValue?.trim();
    },
    {
      message: "CTA label and value are required when CTA is enabled",
      path: ["ctaLabel"],
    }
  );

export type InAppPopupFormData = z.infer<typeof inAppPopupSchema>;
