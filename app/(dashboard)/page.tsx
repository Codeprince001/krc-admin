"use client";

import { useDashboardStats } from "@/lib/hooks/useAdmin";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import {
  Users,
  DollarSign,
  BookOpen,
  Heart,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils/format";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Overview of your church management system
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={formatNumber(stats?.totalUsers || 0)}
          description="Registered users"
          icon={Users}
          trend={
            stats
              ? {
                  value: 12,
                  isPositive: true,
                }
              : undefined
          }
        />
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(stats?.totalRevenue || 0)}
          description="All-time revenue"
          icon={DollarSign}
          trend={
            stats
              ? {
                  value: 8,
                  isPositive: true,
                }
              : undefined
          }
        />
        <StatsCard
          title="Monthly Revenue"
          value={formatCurrency(stats?.monthlyRevenue || 0)}
          description="This month"
          icon={TrendingUp}
        />
        <StatsCard
          title="Total Content"
          value={formatNumber(stats?.totalContent || 0)}
          description="Sermons, devotionals, etc."
          icon={BookOpen}
        />
        <StatsCard
          title="Pending Prayer Requests"
          value={formatNumber(stats?.pendingPrayerRequests || 0)}
          description="Awaiting response"
          icon={Heart}
        />
        <StatsCard
          title="Upcoming Events"
          value={formatNumber(stats?.upcomingEvents || 0)}
          description="Scheduled events"
          icon={Calendar}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <RecentActivity />
      </div>
    </div>
  );
}

