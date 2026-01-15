"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, TrendingUp, Eye, MousePointer, Send, CheckCircle2 } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { subDays, format } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface OverallStats {
  totalSent: number;
  totalDelivered: number;
  totalOpened: number;
  totalClicked: number;
  deliveryRate: number;
  openRate: number;
  clickThroughRate: number;
  averageTimeToOpen: number;
}

interface CampaignAnalytics {
  campaignId: string;
  campaignName: string;
  totalSent: number;
  totalDelivered: number;
  totalOpened: number;
  totalClicked: number;
  deliveryRate: number;
  openRate: number;
  clickThroughRate: number;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("7");

  // Fetch overall stats
  const { data: stats, isLoading: statsLoading } = useQuery<OverallStats>({
    queryKey: ["notification-analytics", "overall", dateRange],
    queryFn: async () => {
      const startDate = subDays(new Date(), parseInt(dateRange));
      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: new Date().toISOString(),
      });
      const response = await apiClient.get<OverallStats>(`/notifications/analytics/overall/stats?${params}`);
      return response || {
        totalSent: 0,
        totalDelivered: 0,
        totalOpened: 0,
        totalClicked: 0,
        deliveryRate: 0,
        openRate: 0,
        clickThroughRate: 0,
      };
    },
  });

  // Fetch campaign analytics
  const { data: campaigns } = useQuery<CampaignAnalytics[]>({
    queryKey: ["notification-analytics", "campaigns"],
    queryFn: async () => {
      const response = await apiClient.get<any[]>("/notifications/campaigns");
      const campaignsData = response || [];

      // Fetch analytics for each campaign
      const analyticsPromises = campaignsData.map(async (campaign: any) => {
        const analyticsResponse = await apiClient.get<any>(
          `/notifications/analytics/campaign/${campaign.id}`
        );
        return {
          campaignId: campaign.id,
          campaignName: campaign.name,
          ...(analyticsResponse || {}),
        };
      });

      return Promise.all(analyticsPromises);
    },
  });

  const formatPercentage = (value: number) => `${(value * 100).toFixed(1)}%`;
  const formatNumber = (value: number) => value.toLocaleString();

  // Prepare funnel data
  const funnelData = stats
    ? [
        { name: "Sent", value: stats.totalSent, fill: "#3b82f6" },
        { name: "Delivered", value: stats.totalDelivered, fill: "#10b981" },
        { name: "Opened", value: stats.totalOpened, fill: "#f59e0b" },
        { name: "Clicked", value: stats.totalClicked, fill: "#ef4444" },
      ]
    : [];

  // Prepare rate comparison data
  const rateData = stats
    ? [
        {
          name: "Metrics",
          "Delivery Rate": stats.deliveryRate * 100,
          "Open Rate": stats.openRate * 100,
          "CTR": stats.clickThroughRate * 100,
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notification Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Track performance and engagement metrics
          </p>
        </div>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="14">Last 14 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {statsLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Overview Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
                <Send className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(stats?.totalSent || 0)}</div>
                <p className="text-xs text-muted-foreground">
                  Notifications queued and sent
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPercentage(stats?.deliveryRate || 0)}</div>
                <p className="text-xs text-muted-foreground">
                  {formatNumber(stats?.totalDelivered || 0)} delivered successfully
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPercentage(stats?.openRate || 0)}</div>
                <p className="text-xs text-muted-foreground">
                  {formatNumber(stats?.totalOpened || 0)} notifications opened
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Click-Through Rate</CardTitle>
                <MousePointer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPercentage(stats?.clickThroughRate || 0)}</div>
                <p className="text-xs text-muted-foreground">
                  {formatNumber(stats?.totalClicked || 0)} clicks recorded
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Conversion Funnel */}
            <Card>
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
                <CardDescription>
                  User engagement at each stage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={funnelData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8">
                      {funnelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Rate Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Rates</CardTitle>
                <CardDescription>
                  Delivery, open, and click-through rates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={rateData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
                    <Bar dataKey="Delivery Rate" fill="#10b981" />
                    <Bar dataKey="Open Rate" fill="#f59e0b" />
                    <Bar dataKey="CTR" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Campaign Performance */}
          {campaigns && campaigns.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
                <CardDescription>
                  Analytics for each notification campaign
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {campaigns.map((campaign) => (
                    <div key={campaign.campaignId} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{campaign.campaignName}</h3>
                        <div className="flex gap-4 text-sm">
                          <span className="text-muted-foreground">
                            {formatNumber(campaign.totalSent)} sent
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Delivery Rate</div>
                          <div className="text-lg font-semibold text-green-600">
                            {formatPercentage(campaign.deliveryRate)}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Open Rate</div>
                          <div className="text-lg font-semibold text-orange-600">
                            {formatPercentage(campaign.openRate)}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">CTR</div>
                          <div className="text-lg font-semibold text-red-600">
                            {formatPercentage(campaign.clickThroughRate)}
                          </div>
                        </div>
                      </div>
                      {/* Progress bars */}
                      <div className="space-y-1">
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${campaign.deliveryRate * 100}%` }}
                          />
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-orange-600 h-2 rounded-full"
                            style={{ width: `${campaign.openRate * 100}%` }}
                          />
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-red-600 h-2 rounded-full"
                            style={{ width: `${campaign.clickThroughRate * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Key Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats && stats.totalSent > 0 && (
                  <>
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-600 mt-2" />
                      <div>
                        <p className="font-medium">Strong Delivery Performance</p>
                        <p className="text-sm text-muted-foreground">
                          {formatPercentage(stats.deliveryRate)} of notifications are successfully
                          delivered to users' devices
                        </p>
                      </div>
                    </div>
                    {stats.openRate > 0.3 && (
                      <div className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-orange-600 mt-2" />
                        <div>
                          <p className="font-medium">Great Engagement</p>
                          <p className="text-sm text-muted-foreground">
                            {formatPercentage(stats.openRate)} open rate indicates users are interested
                            in your content
                          </p>
                        </div>
                      </div>
                    )}
                    {stats.clickThroughRate > 0.1 && (
                      <div className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-red-600 mt-2" />
                        <div>
                          <p className="font-medium">Effective Call-to-Action</p>
                          <p className="text-sm text-muted-foreground">
                            {formatPercentage(stats.clickThroughRate)} CTR shows your notifications
                            drive action
                          </p>
                        </div>
                      </div>
                    )}
                    {stats.averageTimeToOpen > 0 && (
                      <div className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-600 mt-2" />
                        <div>
                          <p className="font-medium">Response Time</p>
                          <p className="text-sm text-muted-foreground">
                            Users open notifications within{" "}
                            {Math.round(stats.averageTimeToOpen / 60)} minutes on average
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}
                {(!stats || stats.totalSent === 0) && (
                  <p className="text-sm text-muted-foreground">
                    Send some notifications to start seeing insights
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
