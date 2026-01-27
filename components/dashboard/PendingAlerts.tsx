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
      <Card className="border-emerald-200/50 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50/30 shadow-lg hover-lift overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-teal-400/10"></div>
        <CardContent className="pt-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl gradient-success shadow-lg">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <p className="font-bold text-lg text-emerald-900">All Caught Up!</p>
              <p className="text-sm text-emerald-700 mt-0.5">
                No pending items requiring attention
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-amber-200/50 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50/30 shadow-lg hover-lift overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-orange-400/10"></div>
      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-3 text-amber-900">
          <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg">
            <AlertTriangle className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold">Items Requiring Attention</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="space-y-3">
          {alerts.map((alert) => (
            <Link key={alert.href} href={alert.href}>
              <div className="group flex items-center justify-between p-4 rounded-xl bg-white border-2 border-amber-200/50 hover:border-amber-400 hover:shadow-md transition-all duration-300 cursor-pointer">
                <div className="flex items-center gap-4">
                  <Badge 
                    variant="destructive" 
                    className="text-sm font-bold px-3 py-1.5 rounded-lg shadow-sm"
                  >
                    {alert.count}
                  </Badge>
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-amber-900 transition-colors">
                    {alert.label}
                  </span>
                </div>
                <ArrowRight className="h-5 w-5 text-amber-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
