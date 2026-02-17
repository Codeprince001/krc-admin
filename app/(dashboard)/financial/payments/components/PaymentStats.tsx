"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import type { PaymentStats as PaymentStatsType } from "@/types/api/payments.types";

// Helper function to handle amounts that might be stored in kobo
// Paystack uses kobo (smallest unit), so amounts need to be divided by 100
// Example: 300,000 kobo = ₦3,000
function formatPaymentAmount(amount: number): number {
  // If amount is suspiciously large (likely stored in kobo from old data)
  // Threshold: amounts > 10,000 are likely in kobo (₦100+ payments stored incorrectly)
  // Divide by 100 to convert from kobo to naira
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
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalPayments}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Successful</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.successfulPayments}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ₦{formatPaymentAmount(Number(stats.totalRevenue)).toLocaleString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

