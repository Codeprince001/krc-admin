"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/utils/format";
import { DollarSign } from "lucide-react";

interface RevenueChartProps {
  data: {
    orders: { revenue: number };
    giving: { revenue: number; monthly: number };
    payments: { revenue: number };
  };
}

export function RevenueChart({ data }: RevenueChartProps) {
  const chartData = [
    {
      name: "Orders",
      value: data.orders.revenue,
    },
    {
      name: "Giving",
      value: data.giving.revenue,
    },
    {
      name: "Monthly Giving",
      value: data.giving.monthly,
    },
  ];

  return (
    <Card className="border-emerald-200/50 bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
            <DollarSign className="h-5 w-5 text-white" />
          </div>
          Revenue Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(152 76% 46%)" stopOpacity={1} />
                <stop offset="100%" stopColor="hsl(142 71% 45%)" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
            <XAxis 
              dataKey="name" 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Bar dataKey="value" fill="url(#colorRevenue)" radius={[12, 12, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
