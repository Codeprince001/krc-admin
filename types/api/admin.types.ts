export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalContent: number;
  pendingPrayerRequests: number;
  upcomingEvents: number;
  recentActivity: ActivityLog[];
}

export interface UserAnalytics {
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  usersByRole: {
    role: string;
    count: number;
  }[];
  userGrowth: {
    date: string;
    count: number;
  }[];
}

export interface RevenueAnalytics {
  totalRevenue: number;
  monthlyRevenue: number;
  revenueByMonth: {
    month: string;
    amount: number;
  }[];
  revenueBySource: {
    source: string;
    amount: number;
  }[];
}

export interface ContentAnalytics {
  totalSermons: number;
  totalDevotionals: number;
  totalAnnouncements: number;
  totalEvents: number;
  totalBooks: number;
}

export interface CommunityAnalytics {
  totalPrayerRequests: number;
  pendingPrayerRequests: number;
  totalTestimonies: number;
  approvedTestimonies: number;
  totalGroups: number;
  activeGroups: number;
}

export interface SystemHealth {
  status: "healthy" | "degraded" | "down";
  database: boolean;
  api: boolean;
  uptime: number;
  version: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  user?: {
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
  action: string;
  resource: string;
  resourceId: string | null;
  metadata: Record<string, any> | null;
  createdAt: string;
}
