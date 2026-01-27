"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";

interface PendingAlertsProps {
  stats: {
    orders: { pending: number };
    community: {
      prayerRequests: { pending: number };
      testimonies: { pending: number };
    };
    books: { lowStock: number };
  };
}

export function PendingAlerts({ stats }: PendingAlertsProps) {
  const alerts = [
    {
      label: "Pending Orders",
      count: stats.orders.pending,
      href: "/financial/orders",
      show: stats.orders.pending > 0,
    },
    {
      label: "Prayer Requests",
      count: stats.community.prayerRequests.pending,
      href: "/community/prayer-requests",
      show: stats.community.prayerRequests.pending > 0,
    },
    {
      label: "Pending Testimonies",
      count: stats.community.testimonies.pending,
      href: "/community/testimonies",
      show: stats.community.testimonies.pending > 0,
    },
    {
      label: "Low Stock Books",
      count: stats.books.lowStock,
      href: "/content/books",
      show: stats.books.lowStock > 0,
    },
  ].filter((alert) => alert.show);

  if (alerts.length === 0) {
    return (
      <Card className="border-green-200 bg-green-50/50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-green-500/10">
              <svg
                className="h-5 w-5 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-green-900">All Caught Up!</p>
              <p className="text-sm text-green-700">
                No pending items requiring attention
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-amber-200 bg-amber-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-900">
          <AlertTriangle className="h-5 w-5" />
          Items Requiring Attention
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <Link key={alert.href} href={alert.href}>
              <div className="flex items-center justify-between p-3 rounded-lg bg-background border hover:border-primary transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <Badge variant="destructive" className="text-xs">
                    {alert.count}
                  </Badge>
                  <span className="text-sm font-medium">{alert.label}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
