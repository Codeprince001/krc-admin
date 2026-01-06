import type { AnnouncementCategory } from "@/types";

export const ANNOUNCEMENT_PAGE_SIZE = 10;

export const ANNOUNCEMENT_CATEGORIES: { value: AnnouncementCategory; label: string }[] = [
  { value: "GENERAL", label: "General" },
  { value: "YOUTH", label: "Youth" },
  { value: "WOMEN", label: "Women" },
  { value: "MEN", label: "Men" },
  { value: "CHOIR", label: "Choir" },
  { value: "WORKERS", label: "Workers" },
  { value: "URGENT", label: "Urgent" },
];

export const ANNOUNCEMENT_STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
] as const;

