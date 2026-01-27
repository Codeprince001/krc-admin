import type { CounselingStatus, CounselingCategory } from "@/types";

export const COUNSELING_PAGE_SIZE = 10;

export const COUNSELING_STATUSES: { value: CounselingStatus; label: string; variant?: string }[] = [
  { value: "SCHEDULED", label: "Scheduled", variant: "secondary" },
  { value: "CONFIRMED", label: "Confirmed", variant: "default" },
  { value: "COMPLETED", label: "Completed", variant: "default" },
  { value: "CANCELLED", label: "Cancelled", variant: "destructive" },
  { value: "NO_SHOW", label: "No Show", variant: "outline" },
];

export const COUNSELING_CATEGORIES: { value: CounselingCategory; label: string }[] = [
  { value: "MARRIAGE", label: "Marriage" },
  { value: "HEALING", label: "Healing" },
  { value: "DELIVERANCE", label: "Deliverance" },
  { value: "FINANCIAL", label: "Financial" },
  { value: "CAREER", label: "Career" },
  { value: "FAMILY", label: "Family" },
  { value: "SPIRITUAL_GROWTH", label: "Spiritual Growth" },
  { value: "YOUTH", label: "Youth" },
  { value: "OTHER", label: "Other" },
];
