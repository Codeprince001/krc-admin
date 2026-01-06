import type { TestimonyStatus } from "@/types";

export const TESTIMONIES_PAGE_SIZE = 10;

export const TESTIMONY_STATUSES: { value: TestimonyStatus; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

