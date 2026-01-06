"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useUserAnalytics,
  useRevenueAnalytics,
  useContentAnalytics,
  useCommunityAnalytics,
} from "@/lib/hooks/useAdmin";
import { formatCurrency, formatNumber } from "@/lib/utils/format";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AnalyticsPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data: userAnalytics, isLoading: loadingUsers } = useUserAnalytics(
    startDate || undefined,
    endDate || undefined
  );
  const { data: revenueAnalytics, isLoading: loadingRevenue } =
    useRevenueAnalytics(startDate || undefined, endDate || undefined);
  const { data: contentAnalytics, isLoading: loadingContent } =
    useContentAnalytics();
  const { data: communityAnalytics, isLoading: loadingCommunity } =
    useCommunityAnalytics();

  const isLoading =
    loadingUsers || loadingRevenue || loadingContent || loadingCommunity;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Detailed analytics and insights
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Date Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>User Analytics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">
                  {formatNumber(userAnalytics?.totalUsers || 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">New Users</p>
                <p className="text-2xl font-bold">
                  {formatNumber(userAnalytics?.newUsers || 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">
                  {formatNumber(userAnalytics?.activeUsers || 0)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Analytics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(revenueAnalytics?.totalRevenue || 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(revenueAnalytics?.monthlyRevenue || 0)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content Analytics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Sermons</p>
                <p className="text-2xl font-bold">
                  {formatNumber(contentAnalytics?.totalSermons || 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Devotionals</p>
                <p className="text-2xl font-bold">
                  {formatNumber(contentAnalytics?.totalDevotionals || 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Announcements</p>
                <p className="text-2xl font-bold">
                  {formatNumber(contentAnalytics?.totalAnnouncements || 0)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Community Analytics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Prayer Requests
                </p>
                <p className="text-2xl font-bold">
                  {formatNumber(communityAnalytics?.totalPrayerRequests || 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Testimonies</p>
                <p className="text-2xl font-bold">
                  {formatNumber(communityAnalytics?.totalTestimonies || 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Groups</p>
                <p className="text-2xl font-bold">
                  {formatNumber(communityAnalytics?.totalGroups || 0)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

