"use client";

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Download, Loader2, Filter } from "lucide-react";
import { givingManagementService } from "@/lib/api/services/giving-management.service";
import type {
  GivingTransaction,
  GivingTransactionStats,
  QueryGivingTransactionsParams,
} from "@/types/api/giving-management.types";

function formatCurrency(amount: number, currency = "NGN") {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(s: string) {
  return new Date(s).toLocaleDateString(undefined, {
    dateStyle: "medium",
  });
}

function exportToCsv(rows: GivingTransaction[]) {
  const headers = [
    "Date",
    "User",
    "Category",
    "Campaign",
    "Amount",
    "Currency",
    "Payment Method",
    "Status",
  ];
  const csvRows = [
    headers.join(","),
    ...rows.map((r) =>
      [
        formatDate(r.createdAt),
        r.isAnonymous
          ? "Anonymous"
          : r.user
            ? `${r.user.firstName} ${r.user.lastName}`
            : "",
        r.category?.name ?? "",
        r.campaign?.name ?? "",
        r.amount,
        r.currency,
        r.paymentMethod,
        r.paymentStatus,
      ].join(",")
    ),
  ];
  const blob = new Blob([csvRows.join("\n")], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `giving-report-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function GivingTransactionsPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<QueryGivingTransactionsParams>({
    page: 1,
    limit: 20,
    paymentStatus: undefined,
    paymentMethod: undefined,
    startDate: "",
    endDate: "",
  });

  const queryParams = {
    ...filters,
    page,
    limit: filters.limit ?? 20,
  };

  const { data, isLoading } = useQuery({
    queryKey: ["giving-transactions", queryParams],
    queryFn: () => givingManagementService.getTransactions(queryParams),
  });

  const { data: stats } = useQuery({
    queryKey: [
      "giving-transaction-stats",
      filters.startDate,
      filters.endDate,
      filters.categoryId,
      filters.campaignId,
    ],
    queryFn: () =>
      givingManagementService.getTransactionStats({
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        categoryId: filters.categoryId,
        campaignId: filters.campaignId,
      }),
  });

  const handleExport = useCallback(async () => {
    const report = await givingManagementService.getTransactionReport({
      ...filters,
      limit: 10000,
    });
    exportToCsv(report as GivingTransaction[]);
  }, [filters]);

  const transactions = (data?.data ?? []) as GivingTransaction[];
  const meta = data?.meta;
  const statsData = stats as GivingTransactionStats | undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Giving Transactions
          </h1>
          <p className="text-sm text-muted-foreground">
            Online giving with Paystack & Stripe
          </p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {statsData && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Amount
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {formatCurrency(statsData.totalAmount)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Transaction Count
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{statsData.totalCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                By Gateway
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {statsData.byPaymentMethod?.map((m) => (
                  <p key={m.paymentMethod} className="text-sm">
                    {m.paymentMethod}: {formatCurrency(m.amount)}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <CardTitle>Transactions</CardTitle>
            <div className="flex flex-wrap gap-2 items-center">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={filters.paymentStatus ?? "all"}
                onValueChange={(v) =>
                  setFilters((p) => ({
                    ...p,
                    paymentStatus: v === "all" ? undefined : (v as QueryGivingTransactionsParams["paymentStatus"]),
                  }))
                }
              >
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="SUCCESSFUL">Successful</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filters.paymentMethod ?? "all"}
                onValueChange={(v) =>
                  setFilters((p) => ({
                    ...p,
                    paymentMethod: v === "all" ? undefined : (v as QueryGivingTransactionsParams["paymentMethod"]),
                  }))
                }
              >
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Gateway" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Gateways</SelectItem>
                  <SelectItem value="PAYSTACK">Paystack</SelectItem>
                  <SelectItem value="STRIPE">Stripe</SelectItem>
                  <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={filters.startDate ?? ""}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, startDate: e.target.value }))
                }
                className="w-36"
                placeholder="From"
              />
              <Input
                type="date"
                value={filters.endDate ?? ""}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, endDate: e.target.value }))
                }
                className="w-36"
                placeholder="To"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFilters({
                    page: 1,
                    limit: 20,
                  });
                  setPage(1);
                }}
              >
                Clear
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : transactions.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              No transactions found
            </p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Gateway</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>{formatDate(t.createdAt)}</TableCell>
                      <TableCell>
                        {t.isAnonymous
                          ? "Anonymous"
                          : t.user
                            ? `${t.user.firstName} ${t.user.lastName}`
                            : "-"}
                      </TableCell>
                      <TableCell>
                        {t.category?.name ?? "-"}
                        {t.customTitle && (
                          <span className="block text-xs text-muted-foreground">
                            {t.customTitle}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{t.campaign?.name ?? "-"}</TableCell>
                      <TableCell>
                        {formatCurrency(t.amount, t.currency)}
                      </TableCell>
                      <TableCell>{t.paymentMethod}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                            t.paymentStatus === "SUCCESSFUL"
                              ? "bg-green-100 text-green-800"
                              : t.paymentStatus === "PENDING"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {t.paymentStatus}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {meta && meta.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
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
                      onClick={() =>
                        setPage((p) =>
                          Math.min(meta.totalPages, p + 1)
                        )
                      }
                      disabled={page === meta.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
