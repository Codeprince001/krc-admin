"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Eye } from "lucide-react";
import { formatDate } from "@/lib/utils/format";
import { ResponsiveTableWrapper } from "@/components/shared/ResponsiveTableWrapper";
import type { Payment, PaymentStatus } from "@/types/api/payments.types";

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

interface PaymentsTableProps {
  payments: Payment[];
  isLoading: boolean;
  onView: (payment: Payment) => void;
}

export function PaymentsTable({
  payments,
  isLoading,
  onView,
}: PaymentsTableProps) {
  const getStatusVariant = (status: PaymentStatus) => {
    switch (status) {
      case "SUCCESSFUL":
      case "PAID":
        return "default";
      case "FAILED":
        return "destructive";
      default:
        return "secondary";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <ResponsiveTableWrapper>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[150px]">Reference</TableHead>
            <TableHead className="min-w-[180px]">Customer</TableHead>
            <TableHead className="min-w-[120px]">Purpose</TableHead>
            <TableHead className="min-w-[100px]">Amount</TableHead>
            <TableHead className="min-w-[120px]">Method</TableHead>
            <TableHead className="min-w-[100px]">Status</TableHead>
            <TableHead className="min-w-[120px]">Date</TableHead>
            <TableHead className="text-right min-w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
      <TableBody>
        {payments.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-8">
              No payments found
            </TableCell>
          </TableRow>
        ) : (
          payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell className="font-medium">{payment.paymentRef}</TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">
                    {payment.user.firstName || payment.user.lastName
                      ? `${payment.user.firstName || ""} ${payment.user.lastName || ""}`.trim()
                      : "N/A"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {payment.user.email}
                  </div>
                </div>
              </TableCell>
              <TableCell className="max-w-xs truncate">{payment.purpose}</TableCell>
              <TableCell>
                <div className="font-medium">
                  ₦{formatPaymentAmount(Number(payment.amount)).toLocaleString()}
                </div>
              </TableCell>
              <TableCell>{payment.paymentMethod}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(payment.status)}>
                  {payment.status}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(payment.createdAt, "PP")}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onView(payment)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
        </TableBody>
      </Table>
    </ResponsiveTableWrapper>
  );
}

