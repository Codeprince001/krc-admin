"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/shared/PageHeader";
import { downloadExcel } from "@/lib/utils/exportExcel";
import { formatDate } from "@/lib/utils/format";
import { givingManagementService } from "@/lib/api/services/giving-management.service";
import { ordersService } from "@/lib/api/services/orders.service";
import { usersService } from "@/lib/api/services/users.service";
import { toast } from "sonner";
import {
  FileDown,
  Loader2,
  DollarSign,
  ShoppingCart,
  Users,
  BarChart3,
} from "lucide-react";
import type { OrderStatus } from "@/types/api/orders.types";
import { PermissionGuard } from "@/components/guards/PermissionGuard";

// ─── Giving Report ────────────────────────────────────────────────────────────
function GivingExportCard() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await givingManagementService.getTransactions({
        page: 1,
        limit: 10000,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      const list = res?.data || [];
      if (!list.length) {
        toast.warning("No transactions found for the selected filters");
        return;
      }
      const rows = list.map((t: any) => ({
        "Transaction ID": t.id,
        Donor: t.user
          ? `${t.user.firstName ?? ""} ${t.user.lastName ?? ""}`.trim() || t.user.email
          : "",
        Email: t.user?.email ?? "",
        Amount: t.amount,
        Currency: t.currency ?? "NGN",
        Category: t.category?.name ?? "",
        Campaign: t.campaign?.name ?? "",
        "Payment Method": t.paymentMethod ?? "",
        Status: t.paymentStatus ?? "",
        Reference: t.reference ?? "",
        Date: formatDate(t.createdAt, "yyyy-MM-dd HH:mm"),
      }));
      downloadExcel(rows, `giving-transactions-${new Date().toISOString().slice(0, 10)}`, "Giving");
      toast.success(`Exported ${rows.length} giving records`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Export failed");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="border-emerald-200/50 hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-linear-to-br from-emerald-500 to-green-600 shadow-lg">
            <DollarSign className="h-5 w-5 text-white" />
          </div>
          Giving Transactions
        </CardTitle>
        <CardDescription>
          Export giving records with optional date range filter.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="giving-start">Start Date</Label>
            <Input
              id="giving-start"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="giving-end">End Date</Label>
            <Input
              id="giving-end"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <Button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full gap-2 bg-linear-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white"
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileDown className="h-4 w-4" />
          )}
          Export Giving to Excel
        </Button>
      </CardContent>
    </Card>
  );
}

// ─── Orders Report ────────────────────────────────────────────────────────────
const ORDER_STATUSES = [
  { value: "all", label: "All Statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PROCESSING", label: "Processing" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

function OrdersExportCard() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("all");
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await ordersService.exportOrders({
        page: 1,
        limit: 10000,
        status: status !== "all" ? (status as OrderStatus) : undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      const list = res?.data || [];
      if (!list.length) {
        toast.warning("No orders found for the selected filters");
        return;
      }
      const rows = list.map((o: any) => ({
        "Order Number": o.orderNumber,
        Customer:
          o.user
            ? `${o.user.firstName ?? ""} ${o.user.lastName ?? ""}`.trim() || o.user.email
            : "",
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
    <Card className="border-blue-200/50 hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 shadow-lg">
            <ShoppingCart className="h-5 w-5 text-white" />
          </div>
          Orders
        </CardTitle>
        <CardDescription>
          Export orders filtered by status and date range.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label>Order Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              {ORDER_STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="orders-start">Start Date</Label>
            <Input
              id="orders-start"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="orders-end">End Date</Label>
            <Input
              id="orders-end"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <Button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full gap-2 bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileDown className="h-4 w-4" />
          )}
          Export Orders to Excel
        </Button>
      </CardContent>
    </Card>
  );
}

// ─── Users Report ─────────────────────────────────────────────────────────────
const USER_ROLES = [
  { value: "all", label: "All Roles" },
  { value: "MEMBER", label: "Member" },
  { value: "WORKER", label: "Worker" },
  { value: "PASTOR", label: "Pastor" },
  { value: "ADMIN", label: "Admin" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
];

function UsersExportCard() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await usersService.getUsers(1, 10000, search || undefined);
      let list = res?.data || [];
      if (role !== "all") {
        list = list.filter((u: any) => u.role === role);
      }
      if (!list.length) {
        toast.warning("No users found for the selected filters");
        return;
      }
      const rows = list.map((u: any) => ({
        Name:
          u.firstName && u.lastName
            ? `${u.firstName} ${u.lastName}`
            : u.firstName || u.lastName || "N/A",
        Email: u.email,
        Phone: u.phone ?? u.phoneNumber ?? "",
        Role: u.role,
        Status: u.isActive ? "Active" : "Inactive",
        "Joined At": formatDate(u.createdAt, "yyyy-MM-dd"),
      }));
      downloadExcel(rows, `users-export-${new Date().toISOString().slice(0, 10)}`, "Users");
      toast.success(`Exported ${rows.length} users`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Export failed");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="border-purple-200/50 hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-linear-to-br from-purple-500 to-violet-600 shadow-lg">
            <Users className="h-5 w-5 text-white" />
          </div>
          User List
        </CardTitle>
        <CardDescription>
          Export members for mail merge, reporting, or analysis.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label>Filter by Role</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger>
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              {USER_ROLES.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="users-search">Search Name / Email</Label>
          <Input
            id="users-search"
            type="text"
            placeholder="Optional search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full gap-2 bg-linear-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white"
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileDown className="h-4 w-4" />
          )}
          Export Users to Excel
        </Button>
      </CardContent>
    </Card>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
function ReportsPageContent() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-linear-to-br from-orange-500 to-amber-600 shadow-lg">
          <BarChart3 className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Reports &amp; Export
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Download financial, order, and membership data as Excel files
          </p>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        <GivingExportCard />
        <OrdersExportCard />
        <UsersExportCard />
      </div>
    </div>
  );
}

export default function ReportsPage() {
  return (
    <PermissionGuard permission="reports">
      <ReportsPageContent />
    </PermissionGuard>
  );
}
