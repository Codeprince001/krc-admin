"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useOrders } from "./hooks/useOrders";
import { OrderFilters } from "./components/OrderFilters";
import { OrdersTable } from "./components/OrdersTable";
import { OrderDetailsDialog } from "./components/OrderDetailsDialog";
import { ordersService } from "@/lib/api/services/orders.service";
import { downloadExcel } from "@/lib/utils/exportExcel";
import { formatDate } from "@/lib/utils/format";
import { toast } from "sonner";
import { FileDown, Loader2 } from "lucide-react";
import type { Order, OrderStatus, DeliveryType } from "@/types/api/orders.types";

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deliveryTypeFilter, setDeliveryTypeFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const limit = 10;

  const queryParams = {
    page,
    limit,
    search: search || undefined,
    status: (statusFilter && statusFilter !== "all" ? statusFilter : undefined) as OrderStatus | undefined,
    deliveryType: (deliveryTypeFilter && deliveryTypeFilter !== "all" ? deliveryTypeFilter : undefined) as DeliveryType | undefined,
  };

  const {
    orders,
    meta,
    isLoading,
    deleteOrder,
    isDeleting,
  } = useOrders(queryParams);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const handleDeleteOrder = (id: string) => {
    if (confirm("Are you sure you want to delete this order?")) {
      deleteOrder(id);
    }
  };

  const [isExporting, setIsExporting] = useState(false);
  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await ordersService.exportOrders({
        page: 1,
        limit: 10000,
        search: search || undefined,
        status: (statusFilter && statusFilter !== "all" ? statusFilter : undefined) as OrderStatus | undefined,
        deliveryType: (deliveryTypeFilter && deliveryTypeFilter !== "all" ? deliveryTypeFilter : undefined) as DeliveryType | undefined,
      });
      const list = res?.data || [];
      const rows = list.map((o) => ({
        "Order Number": o.orderNumber,
        Customer: o.user ? `${o.user.firstName ?? ""} ${o.user.lastName ?? ""}`.trim() || o.user.email : "",
        Email: o.user?.email ?? "",
        Items: o.items?.length ?? 0,
        Subtotal: o.subtotal,
        "Delivery Fee": o.deliveryFee,
        Total: o.total,
        Status: o.status,
        "Payment Status": o.paymentStatus,
        "Delivery Type": o.deliveryType,
        "Created At": formatDate(o.createdAt, "yyyy-MM-dd HH:mm"),
        "Paid At": o.paidAt ? formatDate(o.paidAt, "yyyy-MM-dd HH:mm") : "",
      }));
      downloadExcel(rows, `orders-export-${new Date().toISOString().slice(0, 10)}`, "Orders");
      toast.success(`Exported ${rows.length} orders`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Export failed");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage book orders</p>
        </div>
        <Button
          variant="outline"
          onClick={handleExport}
          disabled={isExporting}
          className="w-full sm:w-auto"
        >
          {isExporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FileDown className="mr-2 h-4 w-4" />
          )}
          Export Excel
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>All Orders</CardTitle>
            <OrderFilters
              search={search}
              status={statusFilter}
              deliveryType={deliveryTypeFilter}
              onSearchChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
              onStatusChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}
              onDeliveryTypeChange={(value) => {
                setDeliveryTypeFilter(value);
                setPage(1);
              }}
            />
          </div>
        </CardHeader>
        <CardContent>
          <OrdersTable
            orders={orders}
            isLoading={isLoading}
            onView={handleViewOrder}
            onDelete={handleDeleteOrder}
            isDeleting={isDeleting}
          />
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Page {meta.page} of {meta.totalPages} ({meta.total} total)
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                  disabled={page === meta.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <OrderDetailsDialog
        order={selectedOrder}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </div>
  );
}
