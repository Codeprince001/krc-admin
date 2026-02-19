"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Package,
  MapPin,
  CreditCard,
  Clock,
  ShieldCheck,
  Loader2,
  Send,
} from "lucide-react";
import { ordersService } from "@/lib/api/services/orders.service";
import { formatDate } from "@/lib/utils/format";
import { toast } from "sonner";
import type { Order, OrderStatus, UpdateOrderStatusRequest } from "@/types/api/orders.types";

interface OrderDetailsDialogProps {
  orderId: string | null;
  onClose: () => void;
}

const ORDER_STATUSES: { value: OrderStatus; label: string; color: string }[] = [
  { value: "PENDING", label: "Pending", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  { value: "CONFIRMED", label: "Confirmed", color: "bg-blue-100 text-blue-800 border-blue-200" },
  { value: "PROCESSING", label: "Processing", color: "bg-indigo-100 text-indigo-800 border-indigo-200" },
  { value: "SHIPPED", label: "Shipped", color: "bg-purple-100 text-purple-800 border-purple-200" },
  { value: "READY", label: "Ready for Pickup", color: "bg-cyan-100 text-cyan-800 border-cyan-200" },
  { value: "DELIVERED", label: "Delivered", color: "bg-green-100 text-green-800 border-green-200" },
  { value: "COMPLETED", label: "Completed", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  { value: "CANCELLED", label: "Cancelled", color: "bg-red-100 text-red-800 border-red-200" },
  { value: "REFUNDED", label: "Refunded", color: "bg-orange-100 text-orange-800 border-orange-200" },
];

function getStatusConfig(status: OrderStatus) {
  return ORDER_STATUSES.find((s) => s.value === status) || ORDER_STATUSES[0];
}

export function EnhancedOrderDetailsDialog({ orderId, onClose }: OrderDetailsDialogProps) {
  const queryClient = useQueryClient();
  const [newStatus, setNewStatus] = useState<OrderStatus | "">("");
  const [trackingNote, setTrackingNote] = useState("");
  const [cancellationReason, setCancellationReason] = useState("");
  const [notifyCustomer, setNotifyCustomer] = useState(true);

  const { data: order, isLoading } = useQuery({
    queryKey: ["orders", "admin", orderId],
    queryFn: () => ordersService.getOrderAdmin(orderId!),
    enabled: !!orderId,
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateOrderStatusRequest) =>
      ordersService.updateOrderStatus(orderId!, data),
    onSuccess: () => {
      toast.success("Order status updated");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setNewStatus("");
      setTrackingNote("");
      setCancellationReason("");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update status");
    },
  });

  const handleUpdateStatus = () => {
    if (!newStatus) return;
    
    const data: UpdateOrderStatusRequest = {
      status: newStatus,
      notifyCustomer,
      ...(trackingNote && { trackingNote }),
      ...(newStatus === "CANCELLED" && cancellationReason && { cancellationReason }),
    };
    
    updateMutation.mutate(data);
  };

  if (!orderId) return null;

  return (
    <Dialog open={!!orderId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-blue-600" />
              <DialogTitle className="text-lg">
                Order Details
                {order && (
                  <span className="text-muted-foreground font-normal ml-2">
                    #{order.orderNumber}
                  </span>
                )}
              </DialogTitle>
            </div>
            {order && (
              <Badge variant="outline" className={getStatusConfig(order.status).color}>
                {getStatusConfig(order.status).label}
              </Badge>
            )}
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : order ? (
          <ScrollArea className="max-h-[calc(90vh-80px)]">
            <div className="p-6 space-y-6">
              
              {/* Customer & Payment Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <Section icon={<User className="h-4 w-4" />} title="Customer">
                  <InfoGrid>
                    <InfoItem label="Name" value={`${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim() || 'N/A'} />
                    <InfoItem label="Email" value={order.user?.email || 'N/A'} />
                    <InfoItem label="Phone" value={order.user?.phoneNumber || 'N/A'} />
                  </InfoGrid>
                </Section>

                <Section icon={<CreditCard className="h-4 w-4" />} title="Payment">
                  <InfoGrid>
                    <InfoItem 
                      label="Status" 
                      value={
                        <Badge variant={order.paymentStatus === 'SUCCESSFUL' || order.paymentStatus === 'PAID' ? 'default' : 'secondary'}>
                          {order.paymentStatus}
                        </Badge>
                      } 
                    />
                    <InfoItem label="Method" value={order.paymentMethod || 'N/A'} />
                    {order.paymentRef && <InfoItem label="Reference" value={order.paymentRef} />}
                    {order.paidAt && <InfoItem label="Paid At" value={formatDate(order.paidAt, "PPp")} />}
                  </InfoGrid>
                </Section>
              </div>

              <Separator />

              {/* Delivery Info */}
              <Section icon={<MapPin className="h-4 w-4" />} title="Delivery">
                <InfoGrid cols={3}>
                  <InfoItem label="Type" value={order.deliveryType.replace('_', ' ')} />
                  {order.deliveryAddress && <InfoItem label="Address" value={order.deliveryAddress} />}
                  {order.deliveryCity && <InfoItem label="City" value={order.deliveryCity} />}
                  {order.deliveryState && <InfoItem label="State" value={order.deliveryState} />}
                  {order.recipientName && <InfoItem label="Recipient" value={order.recipientName} />}
                  {order.recipientPhone && <InfoItem label="Recipient Phone" value={order.recipientPhone} />}
                </InfoGrid>
              </Section>

              <Separator />

              {/* Order Items */}
              <Section icon={<Package className="h-4 w-4" />} title="Order Items">
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left px-4 py-2 font-medium">Item</th>
                        <th className="text-center px-4 py-2 font-medium">Qty</th>
                        <th className="text-right px-4 py-2 font-medium">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items?.map((item) => (
                        <tr key={item.id} className="border-t">
                          <td className="px-4 py-3">
                            <div className="font-medium">{item.book?.title || 'Item'}</div>
                            {item.book?.author && (
                              <div className="text-xs text-muted-foreground">by {item.book.author}</div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center text-muted-foreground">×{item.quantity}</td>
                          <td className="px-4 py-3 text-right font-medium">
                            ₦{Number(item.subtotal).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="bg-muted/50 px-4 py-3 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₦{Number(order.subtotal).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Delivery Fee</span>
                      <span>₦{Number(order.deliveryFee).toLocaleString()}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>₦{Number(order.total).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </Section>

              <Separator />

              {/* Status Update */}
              <Section icon={<ShieldCheck className="h-4 w-4" />} title="Update Status">
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>New Status</Label>
                      <Select value={newStatus} onValueChange={(v) => setNewStatus(v as OrderStatus)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status..." />
                        </SelectTrigger>
                        <SelectContent>
                          {ORDER_STATUSES.filter(s => s.value !== order.status).map((s) => (
                            <SelectItem key={s.value} value={s.value}>
                              <Badge variant="outline" className={`${s.color} mr-2`}>
                                {s.label}
                              </Badge>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end gap-3 pb-0.5">
                      <Switch
                        id="notify"
                        checked={notifyCustomer}
                        onCheckedChange={setNotifyCustomer}
                      />
                      <Label htmlFor="notify" className="cursor-pointer flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Notify customer via email
                      </Label>
                    </div>
                  </div>

                  {newStatus && newStatus !== "CANCELLED" && (
                    <div className="space-y-2">
                      <Label>Tracking Note (optional)</Label>
                      <Textarea
                        value={trackingNote}
                        onChange={(e) => setTrackingNote(e.target.value)}
                        placeholder="e.g., Shipped with DHL, tracking number: ABC123..."
                        rows={2}
                      />
                    </div>
                  )}

                  {newStatus === "CANCELLED" && (
                    <div className="space-y-2">
                      <Label>Cancellation Reason</Label>
                      <Textarea
                        value={cancellationReason}
                        onChange={(e) => setCancellationReason(e.target.value)}
                        placeholder="Reason for cancellation..."
                        rows={2}
                      />
                    </div>
                  )}

                  <Button
                    onClick={handleUpdateStatus}
                    disabled={!newStatus || updateMutation.isPending}
                  >
                    {updateMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Update Status
                  </Button>
                </div>
              </Section>

              {/* Notes */}
              {(order.customerNotes || order.adminNotes || order.trackingNote) && (
                <>
                  <Separator />
                  <Section icon={<Clock className="h-4 w-4" />} title="Notes">
                    <div className="space-y-3">
                      {order.customerNotes && (
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Customer Note</p>
                          <p className="text-sm">{order.customerNotes}</p>
                        </div>
                      )}
                      {order.adminNotes && (
                        <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
                          <p className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">Admin Note</p>
                          <p className="text-sm">{order.adminNotes}</p>
                        </div>
                      )}
                      {order.trackingNote && (
                        <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
                          <p className="text-xs font-medium text-green-700 dark:text-green-300 mb-1">Tracking Note</p>
                          <p className="text-sm">{order.trackingNote}</p>
                        </div>
                      )}
                    </div>
                  </Section>
                </>
              )}

              {/* Audit Trail */}
              {order.auditLogs && order.auditLogs.length > 0 && (
                <>
                  <Separator />
                  <Section icon={<Clock className="h-4 w-4" />} title="Audit Trail">
                    <ol className="relative border-l border-border ml-2 space-y-4">
                      {order.auditLogs.map((log) => (
                        <li key={log.id} className="ml-4">
                          <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border-2 border-white bg-blue-500" />
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="text-xs">{log.previousValue || 'N/A'}</Badge>
                            <span className="text-muted-foreground text-xs">→</span>
                            <Badge variant="outline" className="text-xs font-semibold">{log.newValue}</Badge>
                            <span className="text-muted-foreground text-xs ml-auto">
                              {formatDate(log.createdAt, "PPp")}
                            </span>
                          </div>
                          {log.note && (
                            <p className="text-xs text-muted-foreground mt-1">{log.note}</p>
                          )}
                          {log.performedBy && (
                            <p className="text-xs text-muted-foreground">
                              by {log.performedBy.firstName || log.performedBy.email}
                            </p>
                          )}
                        </li>
                      ))}
                    </ol>
                  </Section>
                </>
              )}

              {/* Timestamps */}
              <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t">
                <p>Created: {formatDate(order.createdAt, "PPpp")}</p>
                <p>Updated: {formatDate(order.updatedAt, "PPpp")}</p>
                {order.completedAt && <p>Completed: {formatDate(order.completedAt, "PPpp")}</p>}
                {order.cancelledAt && <p>Cancelled: {formatDate(order.cancelledAt, "PPpp")}</p>}
              </div>

            </div>
          </ScrollArea>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="flex items-center gap-2 text-sm font-semibold">{icon}{title}</h3>
      {children}
    </div>
  );
}

function InfoGrid({ children, cols = 2 }: { children: React.ReactNode; cols?: number }) {
  return (
    <div className={`grid gap-3 text-sm ${cols === 3 ? 'md:grid-cols-3' : 'grid-cols-2'}`}>
      {children}
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="font-medium">{value}</div>
    </div>
  );
}
