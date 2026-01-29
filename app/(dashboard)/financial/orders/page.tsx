"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useOrders } from "./hooks/useOrders";
import { OrderFilters } from "./components/OrderFilters";
import { OrdersTable } from "./components/OrdersTable";
import { OrderDetailsDialog } from "./components/OrderDetailsDialog";
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

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Manage book orders</p>
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
