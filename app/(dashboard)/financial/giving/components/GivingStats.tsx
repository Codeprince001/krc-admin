"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  DollarSign,
  Receipt,
  TrendingUp,
  Award,
  BarChart3,
} from "lucide-react";
import type { GivingStats as GivingStatsType } from "@/types/api/giving.types";

interface GivingStatsProps {
  stats: GivingStatsType | undefined;
  isLoading: boolean;
}

function formatAmount(amount: number) {
  return `₦${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}

export function GivingStats({ stats, isLoading }: GivingStatsProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!stats) return null;

  const totalRecords = stats.totalRecords ?? (stats as { totalCount?: number }).totalCount ?? 0;
  const rawByCategory = stats.byCategory ?? (stats as { givingByCategory?: unknown[] }).givingByCategory;
  const normalizedByCategory = (rawByCategory ?? []).map((item: { category: string; amount?: number; count?: number; _sum?: { amount?: number }; _count?: number }) => ({
    category: item.category,
    amount: Number(item.amount ?? item._sum?.amount ?? 0),
    count: Number(item.count ?? item._count ?? 0),
  }));

  const totalAmount = Number(stats.totalAmount ?? 0);
  const avgPerGift = totalRecords > 0 ? totalAmount / totalRecords : 0;
  const topCategory = normalizedByCategory.length > 0
    ? normalizedByCategory.reduce((a, b) => (b.amount > a.amount ? b : a))
    : null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="border-l-4 border-l-emerald-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Amount
          </CardTitle>
          <DollarSign className="h-5 w-5 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatAmount(totalAmount)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            All-time giving
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Records
          </CardTitle>
          <Receipt className="h-5 w-5 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalRecords.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Giving transactions
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-amber-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Avg per Gift
          </CardTitle>
          <TrendingUp className="h-5 w-5 text-amber-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatAmount(avgPerGift)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Average donation size
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-violet-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Top Category
          </CardTitle>
          <Award className="h-5 w-5 text-violet-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {topCategory ? formatAmount(topCategory.amount) : "—"}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {topCategory ? topCategory.category : "No data yet"}
          </p>
        </CardContent>
      </Card>

      {normalizedByCategory.length > 0 && (
        <Card className="sm:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              By Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {normalizedByCategory.map((item) => (
                <div
                  key={item.category}
                  className="rounded-lg bg-muted/50 p-3 text-sm"
                >
                  <p className="text-muted-foreground font-medium">{item.category}</p>
                  <p className="font-semibold mt-1">
                    {formatAmount(item.amount)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.count} record{item.count !== 1 ? "s" : ""}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

