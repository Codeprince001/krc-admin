import { z } from "zod";
import type { PrayerRequestStatus } from "@/types";

export const prayerRequestUpdateSchema = z.object({
  status: z.enum(["PENDING", "IN_PROGRESS", "ANSWERED", "CLOSED"]).optional(),
  title: z.string().min(3).max(200).optional(),
  description: z.string().min(10).optional(),
});

export type PrayerRequestUpdateFormData = z.infer<typeof prayerRequestUpdateSchema>;

