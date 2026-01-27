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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Recent Orders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No recent orders
            </p>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {order.user.firstName || ""} {order.user.lastName || ""}{" "}
                    {!order.user.firstName && !order.user.lastName && order.user.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Order #{order.orderNumber}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatRelativeTime(order.createdAt)}
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm font-bold">
                    {formatCurrency(order.total)}
                  </p>
                  <Badge variant={getStatusColor(order.status)}>
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
