"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BookOpen } from "lucide-react";

interface ContentOverviewProps {
  data: {
    sermons: number;
    devotionals: number;
    announcements: number;
    upcomingEvents: number;
  };
}

export function ContentOverview({ data }: ContentOverviewProps) {
  const chartData = [
    { name: "Sermons", count: data.sermons, fill: "#6366f1" },
    { name: "Devotionals", count: data.devotionals, fill: "#10b981" },
    { name: "Announcements", count: data.announcements, fill: "#f59e0b" },
    { name: "Events", count: data.upcomingEvents, fill: "#06b6d4" },
  ];

  return (
    <Card className="border-orange-200/50 bg-gradient-to-br from-white via-orange-50/30 to-amber-50/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          Content Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
            <XAxis type="number" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis 
              type="category" 
              dataKey="name" 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              width={110}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Bar dataKey="count" fill="fill" radius={[0, 12, 12, 0]}>
              {chartData.map((entry, index) => (
                <defs key={index}>
                  <linearGradient id={`gradient-${index}`} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={entry.fill} stopOpacity={0.8} />
                    <stop offset="100%" stopColor={entry.fill} stopOpacity={1} />
                  </linearGradient>
                </defs>
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
