"use client";

import { useDashboardStats } from "@/lib/hooks/useAdmin";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { GrowthTrends } from "@/components/dashboard/GrowthTrends";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { UserRoleChart } from "@/components/dashboard/UserRoleChart";
import { ContentOverview } from "@/components/dashboard/ContentOverview";
import { CommunityStats } from "@/components/dashboard/CommunityStats";
import { formatCurrency, formatNumber } from "@/lib/utils/format";
import {
  Users,
  DollarSign,
  BookOpen,
  Heart,
  TrendingUp,
  BarChart3,
  Calendar,
  MessageSquare,
  UserCheck,
  Loader2,
} from "lucide-react";

export default function AnalyticsPage() {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center rounded-2xl border border-dashed bg-muted/30 p-8">
        <p className="text-muted-foreground">Unable to load analytics. Please try again.</p>
      </div>
    );
  }

  const totalRevenue = stats.orders.revenue + stats.giving.total;
  const totalContent =
    stats.content.sermons +
    stats.content.devotionals +
    stats.content.announcements;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-3xl -z-10" />
        <div className="relative z-10 flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-purple-600 shadow-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                Analytics
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-0.5">
                Real-time insights from your church app
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={formatNumber(stats.users.total)}
          description={`${stats.users.active} active`}
          icon={Users}
          variant="primary"
        />
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          description="Orders + giving"
          icon={DollarSign}
          variant="success"
        />
        <StatsCard
          title="Monthly Giving"
          value={formatCurrency(stats.giving.monthly)}
          description="This month"
          icon={TrendingUp}
          variant="info"
        />
        <StatsCard
          title="Content Items"
          value={formatNumber(totalContent)}
          description="Sermons, devotionals, announcements"
          icon={BookOpen}
          variant="purple"
        />
      </div>

      {/* Second row */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Prayer Requests"
          value={formatNumber(stats.community.prayerRequests.total)}
          description={`${stats.community.prayerRequests.pending} pending`}
          icon={Heart}
          variant="purple"
        />
        <StatsCard
          title="Testimonies"
          value={formatNumber(stats.community.testimonies.total)}
          description={`${stats.community.testimonies.pending} pending review`}
          icon={MessageSquare}
          variant="info"
        />
        <StatsCard
          title="Community Groups"
          value={formatNumber(stats.community.groups)}
          description="Active groups"
          icon={UserCheck}
          variant="success"
        />
        <StatsCard
          title="Upcoming Events"
          value={formatNumber(stats.content.upcomingEvents)}
          description="Scheduled"
          icon={Calendar}
          variant="default"
        />
      </div>

      {/* Growth trends – real data from dashboard */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 via-purple-100/50 to-pink-100/50 rounded-3xl blur-2xl -z-10" />
        <GrowthTrends
          userGrowth={stats.userGrowth}
          revenueGrowth={stats.revenueGrowth}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        <div className="transition-shadow hover:shadow-lg rounded-2xl overflow-hidden">
          <RevenueChart
            data={{
              orders: stats.orders,
              giving: {
                revenue: stats.giving.total,
                monthly: stats.giving.monthly,
              },
              payments: stats.payments,
            }}
          />
        </div>
        <div className="transition-shadow hover:shadow-lg rounded-2xl overflow-hidden">
          <UserRoleChart data={stats.users.byRole} />
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        <div className="transition-shadow hover:shadow-lg rounded-2xl overflow-hidden">
          <ContentOverview data={stats.content} />
        </div>
        <div className="transition-shadow hover:shadow-lg rounded-2xl overflow-hidden">
          <CommunityStats data={stats.community} />
        </div>
      </div>
    </div>
  );
}
