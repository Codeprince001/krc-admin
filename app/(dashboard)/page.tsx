"use client";

import { useDashboardStats } from "@/lib/hooks/useAdmin";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { UserRoleChart } from "@/components/dashboard/UserRoleChart";
import { ContentOverview } from "@/components/dashboard/ContentOverview";
import { CommunityStats } from "@/components/dashboard/CommunityStats";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { SystemHealth } from "@/components/dashboard/SystemHealth";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { GrowthTrends } from "@/components/dashboard/GrowthTrends";
import { PendingAlerts } from "@/components/dashboard/PendingAlerts";
import {
  Users,
  DollarSign,
  BookOpen,
  Heart,
  Calendar,
  TrendingUp,
  ShoppingCart,
  UserCheck,
  Package,
  MessageSquare,
  HeadphonesIcon,
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

  if (!stats) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">No data available</p>
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
      {/* Header with gradient */}
      <div className="relative">
        <div className="absolute inset-0 gradient-primary opacity-10 rounded-3xl blur-3xl -z-10"></div>
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base lg:text-lg">
            Overview of your church management system
          </p>
        </div>
      </div>

      {/* Pending Alerts */}
      <PendingAlerts stats={stats} />

      {/* Key Metrics */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={formatNumber(stats.users.total)}
          description={`${stats.users.active} active users`}
          icon={Users}
          variant="primary"
        />
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          description="All-time revenue"
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
          title="Total Content"
          value={formatNumber(totalContent)}
          description="Sermons, devotionals, etc."
          icon={BookOpen}
          variant="purple"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Pending Orders"
          value={formatNumber(stats.orders.pending)}
          description={`${stats.orders.total} total orders`}
          icon={ShoppingCart}
          variant="warning"
        />
        <StatsCard
          title="Prayer Requests"
          value={formatNumber(stats.community.prayerRequests.pending)}
          description="Awaiting response"
          icon={Heart}
          variant="purple"
        />
        <StatsCard
          title="Upcoming Events"
          value={formatNumber(stats.content.upcomingEvents)}
          description="Scheduled events"
          icon={Calendar}
          variant="info"
        />
        <StatsCard
          title="Low Stock Books"
          value={formatNumber(stats.books.lowStock)}
          description={`${stats.books.total} total books`}
          icon={Package}
          variant="default"
        />
      </div>

      {/* Counseling & Testimonies */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Scheduled Counseling"
          value={formatNumber(stats.counseling.scheduled)}
          description={`${stats.counseling.completed} completed`}
          icon={HeadphonesIcon}
          variant="primary"
        />
        <StatsCard
          title="Pending Testimonies"
          value={formatNumber(stats.community.testimonies.pending)}
          description={`${stats.community.testimonies.total} total`}
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
          title="Giving Records"
          value={formatNumber(stats.giving.count)}
          description={formatCurrency(stats.giving.total)}
          icon={DollarSign}
          variant="success"
        />
      </div>

      {/* Growth Trends */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 opacity-30 rounded-3xl blur-2xl -z-10"></div>
        <GrowthTrends
          userGrowth={stats.userGrowth}
          revenueGrowth={stats.revenueGrowth}
        />
      </div>

      {/* Charts and Visualizations */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        <div className="hover-lift rounded-2xl overflow-hidden">
          <RevenueChart
            data={{
              orders: stats.orders,
              giving: { revenue: stats.giving.total, monthly: stats.giving.monthly },
              payments: stats.payments,
            }}
          />
        </div>
        <div className="hover-lift rounded-2xl overflow-hidden">
          <UserRoleChart data={stats.users.byRole} />
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        <div className="hover-lift rounded-2xl overflow-hidden">
          <ContentOverview data={stats.content} />
        </div>
        <div className="hover-lift rounded-2xl overflow-hidden">
          <CommunityStats data={stats.community} />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        <div className="hover-lift rounded-2xl overflow-hidden">
          <RecentOrders orders={stats.orders.recent} />
        </div>
        <div className="hover-lift rounded-2xl overflow-hidden">
          <RecentActivity />
        </div>
      </div>

      {/* System Health & Quick Actions */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        <div className="hover-lift rounded-2xl overflow-hidden">
          <SystemHealth />
        </div>
        <div className="hover-lift rounded-2xl overflow-hidden">
          <QuickActions />
        </div>
      </div>
    </div>
  );
}

