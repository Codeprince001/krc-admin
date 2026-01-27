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
    { name: "Sermons", count: data.sermons },
    { name: "Devotionals", count: data.devotionals },
    { name: "Announcements", count: data.announcements },
    { name: "Events", count: data.upcomingEvents },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis type="number" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis 
              type="category" 
              dataKey="name" 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              width={100}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
