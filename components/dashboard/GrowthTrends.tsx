"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatCurrency } from "@/lib/utils/format";
import { TrendingUp, Users as UsersIcon, DollarSign } from "lucide-react";

interface GrowthTrendsProps {
  userGrowth?: Array<{ date: string; count: number }>;
  revenueGrowth?: Array<{ date: string; amount: number }>;
}

export function GrowthTrends({ userGrowth, revenueGrowth }: GrowthTrendsProps) {
  // Generate sample data if not provided
  const generateSampleData = (type: "users" | "revenue") => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return months.map((month, index) => ({
      month,
      value: type === "users" ? (index + 1) * 50 : (index + 1) * 50000,
    }));
  };

  const hasRealUserData = userGrowth && userGrowth.length > 0;
  const hasRealRevenueData = revenueGrowth && revenueGrowth.length > 0;

  const userData = hasRealUserData
    ? userGrowth!.map((item) => ({
        month: new Date(item.date).toLocaleDateString("en-US", { month: "short" }),
        value: item.count,
      }))
    : generateSampleData("users");

  const revenueData = hasRealRevenueData
    ? revenueGrowth!.map((item) => ({
        month: new Date(item.date).toLocaleDateString("en-US", { month: "short" }),
        value: item.amount,
      }))
    : generateSampleData("revenue");

  return (
    <Card className="border-purple-200/50 bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <span>Growth Trends</span>
            {(hasRealUserData || hasRealRevenueData) && (
              <p className="text-sm font-normal text-muted-foreground mt-0.5">
                Last 6 months · real data
              </p>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-2 p-1 bg-white/80 backdrop-blur-sm border-2 border-purple-200/50 rounded-xl">
            <TabsTrigger value="users" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
              <UsersIcon className="h-4 w-4 mr-2" />
              User Growth
            </TabsTrigger>
            <TabsTrigger value="revenue" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white">
              <DollarSign className="h-4 w-4 mr-2" />
              Revenue Trend
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={userData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="month"
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [`${value} users`, "Users"]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="revenue" className="mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="month"
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [formatCurrency(value), "Revenue"]}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--chart-2))", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
