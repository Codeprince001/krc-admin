import type { PrayerRequestStatus } from "@/types";

export const PRAYER_REQUESTS_PAGE_SIZE = 10;

export const PRAYER_REQUEST_STATUSES: { value: PrayerRequestStatus; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "ANSWERED", label: "Answered" },
  { value: "CLOSED", label: "Closed" },
];

