"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePayments } from "./hooks/usePayments";
import { paymentsService } from "@/lib/api/services/payments.service";
import { PaymentsTable } from "./components/PaymentsTable";
import { PaymentDetailsDialog } from "./components/PaymentDetailsDialog";
import { PaymentStats } from "./components/PaymentStats";
import { downloadExcel } from "@/lib/utils/exportExcel";
import { formatDate } from "@/lib/utils/format";
import { toast } from "sonner";
import { FileDown, Loader2 } from "lucide-react";
import type { Payment } from "@/types/api/payments.types";

export default function PaymentsPage() {
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { payments, stats, isLoading } = usePayments({});

  const handleViewPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsDetailsOpen(true);
  };

  const [isExporting, setIsExporting] = useState(false);
  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await paymentsService.getPayments({ page: 1, limit: 10000 });
      const list = res?.data || [];
      const rows = list.map((p) => ({
        Reference: p.paymentRef,
        Customer: p.user ? `${p.user.firstName ?? ""} ${p.user.lastName ?? ""}`.trim() || p.user.email : "",
        Email: p.user?.email ?? "",
        Amount: p.amount,
        "Payment Method": p.paymentMethod,
        Status: p.status,
        Purpose: p.purpose,
        "Paid At": p.paidAt ? formatDate(p.paidAt, "yyyy-MM-dd HH:mm") : "",
        "Created At": formatDate(p.createdAt, "yyyy-MM-dd HH:mm"),
      }));
      downloadExcel(rows, `payments-export-${new Date().toISOString().slice(0, 10)}`, "Payments");
      toast.success(`Exported ${rows.length} payments`);
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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage payment records</p>
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

      <PaymentStats stats={stats} isLoading={isLoading} />

      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentsTable
            payments={payments}
            isLoading={isLoading}
            onView={handleViewPayment}
          />
        </CardContent>
      </Card>

      <PaymentDetailsDialog
        payment={selectedPayment}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </div>
  );
}
