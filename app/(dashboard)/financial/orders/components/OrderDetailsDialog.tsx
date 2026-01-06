"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils/format";
import type { Order, OrderStatus, PaymentMethod } from "@/types/api/orders.types";

interface OrderDetailsDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailsDialog({
  order,
  open,
  onOpenChange,
}: OrderDetailsDialogProps) {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details - {order.orderNumber}</DialogTitle>
          <DialogDescription>
            View complete order information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge variant="outline" className="mt-1">
                {order.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Payment Status</p>
              <Badge variant="outline" className="mt-1">
                {order.paymentStatus}
              </Badge>
            </div>
          </div>

          {/* Customer Information */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Name</p>
                <p className="font-medium">
                  {order.user.firstName || order.user.lastName
                    ? `${order.user.firstName || ""} ${order.user.lastName || ""}`.trim()
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium">{order.user.email}</p>
              </div>
              {order.user.phoneNumber && (
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-medium">{order.user.phoneNumber}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Order Items */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Order Items</h3>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium">{item.book.title}</p>
                    <p className="text-sm text-muted-foreground">
                      by {item.book.author}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity} × ₦{Number(item.price).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ₦{Number(item.subtotal).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Delivery Information */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Delivery Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Delivery Type</p>
                <p className="font-medium">{order.deliveryType}</p>
              </div>
              {order.deliveryAddress && (
                <div>
                  <p className="text-muted-foreground">Address</p>
                  <p className="font-medium">{order.deliveryAddress}</p>
                </div>
              )}
              {order.deliveryCity && (
                <div>
                  <p className="text-muted-foreground">City</p>
                  <p className="font-medium">{order.deliveryCity}</p>
                </div>
              )}
              {order.deliveryState && (
                <div>
                  <p className="text-muted-foreground">State</p>
                  <p className="font-medium">{order.deliveryState}</p>
                </div>
              )}
              {order.recipientName && (
                <div>
                  <p className="text-muted-foreground">Recipient Name</p>
                  <p className="font-medium">{order.recipientName}</p>
                </div>
              )}
              {order.recipientPhone && (
                <div>
                  <p className="text-muted-foreground">Recipient Phone</p>
                  <p className="font-medium">{order.recipientPhone}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Payment Information */}
          {order.paymentMethod && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Payment Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Payment Method</p>
                  <p className="font-medium">{order.paymentMethod}</p>
                </div>
                {order.paymentRef && (
                  <div>
                    <p className="text-muted-foreground">Payment Reference</p>
                    <p className="font-medium">{order.paymentRef}</p>
                  </div>
                )}
                {order.paidAt && (
                  <div>
                    <p className="text-muted-foreground">Paid At</p>
                    <p className="font-medium">{formatDate(order.paidAt, "PPp")}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Pricing Summary */}
          <div className="bg-muted p-4 rounded-lg">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">₦{Number(order.subtotal).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span className="font-medium">₦{Number(order.deliveryFee).toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>₦{Number(order.total).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {(order.customerNotes || order.adminNotes) && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Notes</h3>
              <div className="space-y-2 text-sm">
                {order.customerNotes && (
                  <div>
                    <p className="text-muted-foreground">Customer Notes</p>
                    <p className="font-medium">{order.customerNotes}</p>
                  </div>
                )}
                {order.adminNotes && (
                  <div>
                    <p className="text-muted-foreground">Admin Notes</p>
                    <p className="font-medium">{order.adminNotes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="text-sm text-muted-foreground">
            <p>Created: {formatDate(order.createdAt, "PPp")}</p>
            <p>Last Updated: {formatDate(order.updatedAt, "PPp")}</p>
            {order.completedAt && (
              <p>Completed: {formatDate(order.completedAt, "PPp")}</p>
            )}
            {order.cancelledAt && (
              <p>Cancelled: {formatDate(order.cancelledAt, "PPp")}</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

