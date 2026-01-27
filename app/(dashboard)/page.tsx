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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Overview of your church management system
        </p>
      </div>

      {/* Pending Alerts */}
      <PendingAlerts stats={stats} />

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={formatNumber(stats.users.total)}
          description={`${stats.users.active} active users`}
          icon={Users}
        />
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          description="All-time revenue"
          icon={DollarSign}
        />
        <StatsCard
          title="Monthly Giving"
          value={formatCurrency(stats.giving.monthly)}
          description="This month"
          icon={TrendingUp}
        />
        <StatsCard
          title="Total Content"
          value={formatNumber(totalContent)}
          description="Sermons, devotionals, etc."
          icon={BookOpen}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Pending Orders"
          value={formatNumber(stats.orders.pending)}
          description={`${stats.orders.total} total orders`}
          icon={ShoppingCart}
        />
        <StatsCard
          title="Prayer Requests"
          value={formatNumber(stats.community.prayerRequests.pending)}
          description="Awaiting response"
          icon={Heart}
        />
        <StatsCard
          title="Upcoming Events"
          value={formatNumber(stats.content.upcomingEvents)}
          description="Scheduled events"
          icon={Calendar}
        />
        <StatsCard
          title="Low Stock Books"
          value={formatNumber(stats.books.lowStock)}
          description={`${stats.books.total} total books`}
          icon={Package}
        />
      </div>

      {/* Counseling & Testimonies */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Scheduled Counseling"
          value={formatNumber(stats.counseling.scheduled)}
          description={`${stats.counseling.completed} completed`}
          icon={HeadphonesIcon}
        />
        <StatsCard
          title="Pending Testimonies"
          value={formatNumber(stats.community.testimonies.pending)}
          description={`${stats.community.testimonies.total} total`}
          icon={MessageSquare}
        />
        <StatsCard
          title="Community Groups"
          value={formatNumber(stats.community.groups)}
          description="Active groups"
          icon={UserCheck}
        />
        <StatsCard
          title="Giving Records"
          value={formatNumber(stats.giving.count)}
          description={formatCurrency(stats.giving.total)}
          icon={DollarSign}
        />
      </div>

      {/* Growth Trends */}
      <GrowthTrends />

      {/* Charts and Visualizations */}
      <div className="grid gap-4 md:grid-cols-2">
        <RevenueChart
          data={{
            orders: stats.orders,
            giving: stats.giving,
            payments: stats.payments,
          }}
        />
        <UserRoleChart data={stats.users.byRole} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ContentOverview data={stats.content} />
        <CommunityStats data={stats.community} />
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <RecentOrders orders={stats.orders.recent} />
        <RecentActivity />
      </div>

      {/* System Health & Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <SystemHealth />
        <QuickActions />
      </div>
    </div>
  );
}

