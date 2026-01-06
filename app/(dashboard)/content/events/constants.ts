import type { EventCategory, EventStatus } from "@/types";

export const EVENTS_PAGE_SIZE = 10;

export const EVENT_CATEGORIES: { value: EventCategory; label: string }[] = [
  { value: "SERVICE", label: "Service" },
  { value: "CONFERENCE", label: "Conference" },
  { value: "WORKSHOP", label: "Workshop" },
  { value: "FELLOWSHIP", label: "Fellowship" },
  { value: "OUTREACH", label: "Outreach" },
  { value: "OTHER", label: "Other" },
];

export const EVENT_STATUSES: { value: EventStatus; label: string }[] = [
  { value: "UPCOMING", label: "Upcoming" },
  { value: "ONGOING", label: "Ongoing" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

