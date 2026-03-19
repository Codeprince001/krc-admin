export const IN_APP_POPUP_PAGE_SIZE = 10;

export const POPUP_STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft" },
  { value: "ACTIVE", label: "Active" },
  { value: "PAUSED", label: "Paused" },
  { value: "ENDED", label: "Ended" },
] as const;

export const POPUP_CONTEXT_OPTIONS = [
  { value: "APP_OPEN", label: "App Open" },
  { value: "HOME_SCREEN", label: "Home Screen" },
  { value: "EVENTS_SCREEN", label: "Events Screen" },
  { value: "GLOBAL", label: "Global" },
] as const;

export const POPUP_CTA_OPTIONS = [
  { value: "NONE", label: "No Action" },
  { value: "INTERNAL_ROUTE", label: "Internal Route" },
  { value: "EXTERNAL_URL", label: "External URL" },
] as const;

export const POPUP_STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-700",
  ACTIVE: "bg-green-100 text-green-700",
  PAUSED: "bg-yellow-100 text-yellow-700",
  ENDED: "bg-red-100 text-red-700",
};

export const USER_ROLE_OPTIONS = [
  { value: "MEMBER", label: "Member" },
  { value: "WORKER", label: "Worker" },
  { value: "PASTOR", label: "Pastor" },
  { value: "ADMIN", label: "Admin" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
] as const;
