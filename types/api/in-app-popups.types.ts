export type PopupStatus = "DRAFT" | "ACTIVE" | "PAUSED" | "ENDED";
export type PopupContext = "APP_OPEN" | "HOME_SCREEN" | "EVENTS_SCREEN" | "GLOBAL";
export type PopupCtaType = "NONE" | "INTERNAL_ROUTE" | "EXTERNAL_URL";
export type PopupEventType = "SHOWN" | "DISMISSED" | "CLICKED";

export interface InAppPopup {
  id: string;
  title: string;
  message: string;
  imageUrl?: string | null;
  ctaType: PopupCtaType;
  ctaLabel?: string | null;
  ctaValue?: string | null;
  status: PopupStatus;
  contexts: PopupContext[];
  priority: number;
  targetAllUsers: boolean;
  targetRoles: ("MEMBER" | "WORKER" | "PASTOR" | "ADMIN" | "SUPER_ADMIN")[];
  startDate?: string | null;
  endDate?: string | null;
  minIntervalHours: number;
  maxShowsPerDay: number;
  maxShowsPerWeek: number;
  maxShowsLifetimePerUser: number;
  maxShowsPerSession: number;
  delayAfterAppOpenSeconds: number;
  dismissible: boolean;
  requireAction: boolean;
  createdById?: string | null;
  updatedById?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInAppPopupRequest {
  title: string;
  message: string;
  imageUrl?: string;
  ctaType: PopupCtaType;
  ctaLabel?: string;
  ctaValue?: string;
  status?: PopupStatus;
  contexts: PopupContext[];
  priority?: number;
  targetAllUsers?: boolean;
  targetRoles?: ("MEMBER" | "WORKER" | "PASTOR" | "ADMIN" | "SUPER_ADMIN")[];
  startDate?: string;
  endDate?: string;
  minIntervalHours?: number;
  maxShowsPerDay?: number;
  maxShowsPerWeek?: number;
  maxShowsLifetimePerUser?: number;
  maxShowsPerSession?: number;
  delayAfterAppOpenSeconds?: number;
  dismissible?: boolean;
  requireAction?: boolean;
}

export interface UpdateInAppPopupRequest extends Partial<CreateInAppPopupRequest> {}

export interface InAppPopupsResponse {
  data: InAppPopup[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface InAppPopupStats {
  total: number;
  active: number;
  draft: number;
  paused: number;
  ended: number;
  totalShown: number;
  totalDismissed: number;
  totalClicked: number;
  ctr: number;
  dismissRate: number;
}

export interface InAppPopupAnalytics {
  popupId: string;
  period: string;
  shown: number;
  dismissed: number;
  clicked: number;
  ctr: number;
  dismissRate: number;
  breakdown: Array<{
    date: string;
    shown: number;
    dismissed: number;
    clicked: number;
  }>;
}
