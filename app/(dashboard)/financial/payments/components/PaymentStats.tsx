"use client";

import { Loader2, CreditCard, CheckCircle2, Wallet } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import type { PaymentStats as PaymentStatsType } from "@/types/api/payments.types";

// Helper function to handle amounts that might be stored in kobo
// Paystack uses kobo (smallest unit), so amounts need to be divided by 100
// Example: 300,000 kobo = ₦3,000
function formatPaymentAmount(amount: number): number {
  if (amount > 10000) {
    return amount / 100;
  }
  return amount;
}

interface PaymentStatsProps {
  stats: PaymentStatsType | undefined;
  isLoading: boolean;
}

export function PaymentStats({ stats, isLoading }: PaymentStatsProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatsCard
        title="Total Payments"
        value={stats.totalPayments}
        description="All time transactions"
        icon={CreditCard}
        variant="info"
      />
      <StatsCard
        title="Successful Payments"
        value={stats.successfulPayments}
        description={
          stats.totalPayments > 0
            ? `${Math.round((stats.successfulPayments / stats.totalPayments) * 100)}% success rate`
            : "No payments yet"
        }
        icon={CheckCircle2}
        variant="success"
      />
      <StatsCard
        title="Total Revenue"
        value={`₦${formatPaymentAmount(Number(stats.totalRevenue)).toLocaleString()}`}
        description="Confirmed collections"
        icon={Wallet}
        variant="purple"
      />
    </div>
  );
}
