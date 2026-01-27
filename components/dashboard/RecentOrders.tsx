"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatRelativeTime } from "@/lib/utils/format";
import { ShoppingCart } from "lucide-react";

interface RecentOrdersProps {
  orders: Array<{
    id: string;
    orderNumber: string;
    total: number;
    status: string;
    createdAt: string;
    user: {
      firstName: string | null;
      lastName: string | null;
      email: string;
    };
  }>;
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "default";
      case "pending":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <Card className="border-amber-200/50 bg-gradient-to-br from-white via-amber-50/30 to-yellow-50/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg">
            <ShoppingCart className="h-5 w-5 text-white" />
          </div>
          Recent Orders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8 font-medium">
              No recent orders
            </p>
          ) : (
            orders.map((order, index) => (
              <div
                key={order.id}
                className="group flex items-center justify-between p-4 rounded-xl border-2 border-amber-200/50 bg-white hover:border-amber-400 hover:shadow-lg transition-all duration-300 hover:scale-105"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="space-y-1.5">
                  <p className="text-sm font-bold text-gray-900">
                    {order.user.firstName || ""} {order.user.lastName || ""}{" "}
                    {!order.user.firstName && !order.user.lastName && order.user.email}
                  </p>
                  <p className="text-xs text-muted-foreground font-semibold">
                    Order #{order.orderNumber}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatRelativeTime(order.createdAt)}
                  </p>
                </div>
                <div className="text-right space-y-2">
                  <p className="text-base font-bold text-amber-900">
                    {formatCurrency(order.total)}
                  </p>
                  <Badge 
                    className={`font-bold px-3 py-1 shadow-sm ${
                      order.status.toLowerCase() === "completed" 
                        ? "bg-emerald-600 text-white" 
                        : order.status.toLowerCase() === "pending"
                        ? "bg-amber-600 text-white"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
