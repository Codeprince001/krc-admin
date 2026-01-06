"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePayments } from "./hooks/usePayments";
import { PaymentsTable } from "./components/PaymentsTable";
import { PaymentDetailsDialog } from "./components/PaymentDetailsDialog";
import { PaymentStats } from "./components/PaymentStats";
import type { Payment } from "@/types/api/payments.types";

export default function PaymentsPage() {
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { payments, stats, isLoading } = usePayments({});

  const handleViewPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground">Manage payment records</p>
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
