export type AdStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ENDED';
export type AdPlacement = 'HOME_BANNER' | 'EVENTS_PAGE' | 'SERMONS_PAGE' | 'GIVING_PAGE' | 'GENERAL';

export interface Advertisement {
  id: string;
  title: string;
  brandName: string;
  imageUrl: string;
  targetUrl: string;
  status: AdStatus;
  placement: AdPlacement;
  priority: number;
  startDate?: string | null;
  endDate?: string | null;
  impressionCount: number;
  clickCount: number;
  createdById?: string | null;
  createdBy?: { id: string; firstName: string; lastName: string } | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface CreateAdvertisementRequest {
  title: string;
  brandName: string;
  imageUrl: string;
  targetUrl: string;
  status?: AdStatus;
  placement?: AdPlacement;
  priority?: number;
  startDate?: string;
  endDate?: string;
}

export interface UpdateAdvertisementRequest extends Partial<CreateAdvertisementRequest> {}

export interface AdvertisementsResponse {
  data: Advertisement[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AdStats {
  total: number;
  active: number;
  draft: number;
  paused: number;
  ended: number;
  totalImpressions: number;
  totalClicks: number;
  ctr: number;
}

export interface AdAnalytics {
  period: string;
  impressions: number;
  clicks: number;
  ctr: number;
  breakdown: Array<{ eventType: string; _count: number }>;
}
