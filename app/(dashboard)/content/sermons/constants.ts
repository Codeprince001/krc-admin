import type { SermonType } from "@/types";

export const SERMONS_PAGE_SIZE = 10;

export const SERMON_TYPES: { value: SermonType; label: string }[] = [
  { value: "SUNDAY_SERVICE", label: "Sunday Service" },
  { value: "BIBLE_STUDY", label: "Bible Study" },
  { value: "PRAYER_MEETING", label: "Prayer Meeting" },
  { value: "SPECIAL_EVENT", label: "Special Event" },
  { value: "OTHER", label: "Other" },
];

