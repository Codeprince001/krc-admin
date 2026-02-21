"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useOrders, useOrderStats } from "./hooks/useOrders";
import { EnhancedOrderDetailsDialog } from "./components/EnhancedOrderDetailsDialog";
import { ordersService } from "@/lib/api/services/orders.service";
import { downloadExcel } from "@/lib/utils/exportExcel";
import { formatDate } from "@/lib/utils/format";
import { toast } from "sonner";
import { ResponsiveTableWrapper } from "@/components/shared/ResponsiveTableWrapper";
import { StatsCard } from "@/components/dashboard/StatsCard";
import {
  ShoppingCart,
  TrendingUp,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  Search,
  MoreHorizontal,
  Loader2,
  ChevronLeft,
  ChevronRight,
  FileDown,
  Eye,
  Trash2,
  Package,
} from "lucide-react";
import type { Order, OrderStatus, DeliveryType, PaymentStatus } from "@/types/api/orders.types";

const STATUS_FILTERS = [
  { value: "all", label: "All Orders" },
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PROCESSING", label: "Processing" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "READY", label: "Ready" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "REFUNDED", label: "Refunded" },
] as const;

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  CONFIRMED: "bg-blue-100 text-blue-800 border-blue-200",
  PROCESSING: "bg-indigo-100 text-indigo-800 border-indigo-200",
  SHIPPED: "bg-purple-100 text-purple-800 border-purple-200",
  READY: "bg-cyan-100 text-cyan-800 border-cyan-200",
  DELIVERED: "bg-green-100 text-green-800 border-green-200",
  COMPLETED: "bg-emerald-100 text-emerald-800 border-emerald-200",
  CANCELLED: "bg-red-100 text-red-800 border-red-200",
  REFUNDED: "bg-orange-100 text-orange-800 border-orange-200",
};

const PAYMENT_STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-green-100 text-green-800",
  SUCCESSFUL: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
  REFUNDED: "bg-orange-100 text-orange-800",
};

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deliveryTypeFilter, setDeliveryTypeFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [detailOrderId, setDetailOrderId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const limit = 20;

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
    isFetching,
    deleteOrder,
    bulkUpdateStatus,
    isBulkUpdating,
    isDeleting,
  } = useOrders(queryParams);

  const { data: stats } = useOrderStats();

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }, []);

  const toggleAll = useCallback(() => {
    setSelectedIds((prev) => prev.length === orders.length ? [] : orders.map((o) => o.id));
  }, [orders]);

  const handleBulkStatus = (status: OrderStatus) => {
    if (!selectedIds.length) return;
    bulkUpdateStatus({ ids: selectedIds, status, notifyCustomers: true }, {
      onSuccess: () => setSelectedIds([]),
    } as any);
  };

  const handleDeleteOrder = (id: string) => setDeleteTarget(id);

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteOrder(deleteTarget);
      setDeleteTarget(null);
    }
  };

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage customer orders and track fulfillment</p>
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

      {/* Stats Row - uses dashboard StatsCard style */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <StatsCard
          title="Total"
          value={stats?.totalOrders ?? 0}
          icon={ShoppingCart}
          variant="default"
        />
        <StatsCard
          title="Pending"
          value={stats?.pendingOrders ?? 0}
          icon={Clock}
          variant="warning"
        />
        <StatsCard
          title="Processing"
          value={stats?.confirmedOrders ?? 0}
          icon={TrendingUp}
          variant="info"
        />
        <StatsCard
          title="Paid"
          value={stats?.paidOrders ?? 0}
          icon={CheckCircle2}
          variant="primary"
        />
        <StatsCard
          title="Delivered"
          value={stats?.deliveredOrders ?? 0}
          icon={Truck}
          variant="success"
        />
        <StatsCard
          title="Cancelled"
          value={stats?.cancelledOrders ?? 0}
          icon={XCircle}
          variant="danger"
        />
      </div>

      {/* Revenue Card */}
      {stats && stats.totalRevenue > 0 && (
        <Card className="border-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
          <CardContent className="flex items-center justify-between p-4 sm:p-6">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Revenue (Paid Orders)</p>
              <p className="text-2xl sm:text-3xl font-bold mt-1">₦{stats.totalRevenue.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-10 w-10 sm:h-12 sm:w-12 text-white/30" />
          </CardContent>
        </Card>
      )}

      {/* Filters & Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by order number, customer name or email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9"
              />
            </div>

            {/* Status Filter */}
            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v);
                setPage(1);
                setSelectedIds([]);
              }}
            >
              <SelectTrigger className="w-full lg:w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_FILTERS.map((f) => (
                  <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Delivery Type Filter */}
            <Select
              value={deliveryTypeFilter}
              onValueChange={(v) => {
                setDeliveryTypeFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full lg:w-40">
                <SelectValue placeholder="Delivery Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="PICKUP">Pickup</SelectItem>
                <SelectItem value="DELIVERY">Delivery</SelectItem>
                <SelectItem value="HOME_DELIVERY">Home Delivery</SelectItem>
              </SelectContent>
            </Select>

            {/* Bulk Actions */}
            {selectedIds.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="shrink-0">
                    {isBulkUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Bulk Actions ({selectedIds.length})
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => handleBulkStatus("CONFIRMED")}>
                    Mark as Confirmed
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleBulkStatus("PROCESSING")}>
                    Mark as Processing
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleBulkStatus("SHIPPED")}>
                    Mark as Shipped
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleBulkStatus("DELIVERED")}>
                    Mark as Delivered
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={() => handleBulkStatus("CANCELLED")}
                    className="text-red-600"
                  >
                    Mark as Cancelled
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Package className="h-12 w-12 mb-3 opacity-30" />
              <p className="font-medium">No orders found</p>
            </div>
          ) : (
            <ResponsiveTableWrapper>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <Checkbox
                        checked={selectedIds.length === orders.length && orders.length > 0}
                        onCheckedChange={toggleAll}
                      />
                    </TableHead>
                    <TableHead className="min-w-[110px]">Order #</TableHead>
                    <TableHead className="min-w-[180px]">Customer</TableHead>
                    <TableHead className="min-w-[80px]">Items</TableHead>
                    <TableHead className="min-w-[100px]">Total</TableHead>
                    <TableHead className="min-w-[100px]">Status</TableHead>
                    <TableHead className="min-w-[100px]">Payment</TableHead>
                    <TableHead className="min-w-[100px]">Date</TableHead>
                    <TableHead className="text-right min-w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow
                      key={order.id}
                      className="cursor-pointer hover:bg-muted/40 transition-colors"
                      onClick={() => setDetailOrderId(order.id)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedIds.includes(order.id)}
                          onCheckedChange={() => toggleSelect(order.id)}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-xs">{order.orderNumber}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-sm">
                            {order.user?.firstName || order.user?.lastName
                              ? `${order.user?.firstName || ""} ${order.user?.lastName || ""}`.trim()
                              : "N/A"}
                          </div>
                          <div className="text-xs text-muted-foreground truncate max-w-[160px]">
                            {order.user?.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{order.items?.length ?? 0}</Badge>
                      </TableCell>
                      <TableCell className="font-semibold">
                        ₦{Number(order.total).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={STATUS_COLORS[order.status] || ""}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={PAYMENT_STATUS_COLORS[order.paymentStatus] || ""}>
                          {order.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(order.createdAt, "PP")}
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setDetailOrderId(order.id)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteOrder(order.id)}
                              className="text-red-600"
                              disabled={isDeleting}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ResponsiveTableWrapper>
          )}

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-4 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {(meta.page - 1) * meta.limit + 1}–{Math.min(meta.page * meta.limit, meta.total)} of {meta.total} orders
                {isFetching && <Loader2 className="inline ml-2 h-3 w-3 animate-spin" />}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium px-2">
                  {meta.page} / {meta.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page === meta.totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Order Details Dialog */}
      <EnhancedOrderDetailsDialog
        orderId={detailOrderId}
        onClose={() => setDetailOrderId(null)}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete order"
        description="Are you sure you want to delete this order?"
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        variant="destructive"
        isLoading={isDeleting}
      />
    </div>
  );
}

