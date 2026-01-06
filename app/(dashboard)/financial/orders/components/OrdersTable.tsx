"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils/format";
import type { Order, OrderStatus, PaymentStatus } from "@/types/api/orders.types";

interface OrdersTableProps {
  orders: Order[];
  isLoading: boolean;
  onView: (order: Order) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function OrdersTable({
  orders,
  isLoading,
  onView,
  onDelete,
  isDeleting,
}: OrdersTableProps) {
  const getStatusVariant = (status: OrderStatus) => {
    switch (status) {
      case "COMPLETED":
      case "DELIVERED":
        return "default";
      case "CANCELLED":
      case "REFUNDED":
        return "destructive";
      case "PENDING":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getPaymentStatusVariant = (status: PaymentStatus) => {
    switch (status) {
      case "PAID":
      case "SUCCESSFUL":
        return "default";
      case "FAILED":
        return "destructive";
      default:
        return "secondary";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order Number</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Items</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Payment</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-8">
              No orders found
            </TableCell>
          </TableRow>
        ) : (
          orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">{order.orderNumber}</TableCell>
            <TableCell>
              <div>
                <div className="font-medium">
                  {order.user.firstName || order.user.lastName
                    ? `${order.user.firstName || ""} ${order.user.lastName || ""}`.trim()
                    : "N/A"}
                </div>
                <div className="text-sm text-muted-foreground">
                  {order.user.email}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="text-sm">
                {order.items.length} item{order.items.length !== 1 ? "s" : ""}
              </div>
            </TableCell>
            <TableCell>
              <div className="font-medium">
                ₦{Number(order.total).toLocaleString()}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(order.status)}>
                {order.status}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={getPaymentStatusVariant(order.paymentStatus)}>
                {order.paymentStatus}
              </Badge>
            </TableCell>
            <TableCell>{formatDate(order.createdAt, "PP")}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onView(order)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(order.id)}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))
        )}
      </TableBody>
    </Table>
  );
}

