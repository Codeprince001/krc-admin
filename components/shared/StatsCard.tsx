"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  isLoading?: boolean;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  iconColor = "text-blue-600",
  iconBgColor = "bg-blue-50",
  trend,
  isLoading = false,
}: StatsCardProps) {
  if (isLoading) {
    return (
      <Card className="stat-card overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="h-4 w-24 bg-muted animate-pulse rounded-lg" />
          <div className="h-12 w-12 bg-muted animate-pulse rounded-xl" />
        </CardHeader>
        <CardContent>
          <div className="h-10 w-32 bg-muted animate-pulse rounded-lg mb-2" />
          {trend && <div className="h-5 w-24 bg-muted animate-pulse rounded-lg mt-3" />}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group relative overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-4">
        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </CardTitle>
        <div className={cn(
          "p-2.5 rounded-md",
          iconBgColor
        )}>
          <Icon className={cn("h-5 w-5", iconColor)} />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="text-3xl font-bold text-foreground">
          {value}
        </div>
        {trend && (
          <div
            className={cn(
              "flex items-center gap-1.5 mt-3 text-sm font-medium px-2.5 py-1 rounded-md w-fit",
              trend.isPositive 
                ? "bg-success/10 text-success" 
                : "bg-destructive/10 text-destructive"
            )}
          >
            <span className="text-base">{trend.isPositive ? "↑" : "↓"}</span>
            <span>{trend.value}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

