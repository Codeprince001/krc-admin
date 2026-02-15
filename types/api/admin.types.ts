export interface DashboardStats {
  users: {
    total: number;
    active: number;
    byRole: Array<{ role: string; _count: number }>;
    recent: Array<{
      id: string;
      firstName: string | null;
      lastName: string | null;
      email: string;
      role: string;
      createdAt: string;
    }>;
  };
  orders: {
    total: number;
    pending: number;
    revenue: number;
    recent: Array<{
      id: string;
      orderNumber: string;
      total: number;
      status: string;
      createdAt: string;
      user: {
        firstName: string | null;
        lastName: string | null;
        email: string;
      };
    }>;
  };
  books: {
    total: number;
    lowStock: number;
  };
  content: {
    sermons: number;
    devotionals: number;
    announcements: number;
    upcomingEvents: number;
  };
  community: {
    prayerRequests: {
      total: number;
      pending: number;
    };
    testimonies: {
      total: number;
      pending: number;
    };
    groups: number;
  };
  counseling: {
    scheduled: number;
    completed: number;
  };
  giving: {
    total: number;
    count: number;
    monthly: number;
  };
  payments: {
    successful: number;
    revenue: number;
  };
  /** Last 6 months: new users per month (for growth trend chart) */
  userGrowth: Array<{ date: string; count: number }>;
  /** Last 6 months: revenue per month from orders + giving (for revenue trend chart) */
  revenueGrowth: Array<{ date: string; amount: number }>;
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
