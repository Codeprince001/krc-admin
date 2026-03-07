import { z } from "zod";

export const advertisementSchema = z
  .object({
    title: z.string().min(2, "Title must be at least 2 characters").max(200),
    brandName: z.string().min(2, "Brand name must be at least 2 characters").max(200),
    imageUrl: z.string().url("Must be a valid URL"),
    targetUrl: z.string().url("Must be a valid URL"),
    status: z.enum(["DRAFT", "ACTIVE", "PAUSED", "ENDED"]).default("DRAFT"),
    placement: z
      .enum(["HOME_BANNER", "EVENTS_PAGE", "SERMONS_PAGE", "GIVING_PAGE", "GENERAL"])
      .default("HOME_BANNER"),
    priority: z.coerce.number().int().min(0).default(0),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.endDate) > new Date(data.startDate);
      }
      return true;
    },
    { message: "End date must be after start date", path: ["endDate"] }
  );

export type AdvertisementFormData = z.infer<typeof advertisementSchema>;
