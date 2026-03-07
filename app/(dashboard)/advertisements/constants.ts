export const AD_PAGE_SIZE = 10;

export const AD_STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft" },
  { value: "ACTIVE", label: "Active" },
  { value: "PAUSED", label: "Paused" },
  { value: "ENDED", label: "Ended" },
] as const;

export const AD_PLACEMENT_OPTIONS = [
  { value: "HOME_BANNER", label: "Home Banner" },
  { value: "EVENTS_PAGE", label: "Events Page" },
  { value: "SERMONS_PAGE", label: "Sermons Page" },
  { value: "GIVING_PAGE", label: "Giving Page" },
  { value: "GENERAL", label: "General" },
] as const;

export const AD_STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-700",
  ACTIVE: "bg-green-100 text-green-700",
  PAUSED: "bg-yellow-100 text-yellow-700",
  ENDED: "bg-red-100 text-red-700",
};
