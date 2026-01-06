"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import type { GivingStats as GivingStatsType } from "@/types/api/giving.types";

interface GivingStatsProps {
  stats: GivingStatsType | undefined;
  isLoading: boolean;
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

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ₦{Number(stats.totalAmount).toLocaleString()}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalRecords}</div>
        </CardContent>
      </Card>
      {stats.byCategory && stats.byCategory.length > 0 && (
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium">By Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {stats.byCategory.map((item) => (
                <div key={item.category} className="text-sm">
                  <p className="text-muted-foreground">{item.category}</p>
                  <p className="font-semibold">
                    ₦{Number(item.amount).toLocaleString()}
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

