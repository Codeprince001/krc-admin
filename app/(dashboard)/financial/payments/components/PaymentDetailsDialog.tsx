"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils/format";
import type { Payment } from "@/types/api/payments.types";

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

interface PaymentDetailsDialogProps {
  payment: Payment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaymentDetailsDialog({
  payment,
  open,
  onOpenChange,
}: PaymentDetailsDialogProps) {
  if (!payment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-background to-muted/30">
        <DialogHeader>
          <DialogTitle>Payment Details - {payment.paymentRef}</DialogTitle>
          <DialogDescription>
            View complete payment information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Payment Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge 
                variant="outline" 
                className={`mt-1 ${
                  payment.status === 'SUCCESSFUL' || payment.status === 'PAID'
                    ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400'
                    : payment.status === 'PENDING'
                    ? 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/20 dark:text-yellow-400'
                    : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400'
                }`}
              >
                {payment.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
              <p className="font-medium mt-1">{payment.paymentMethod}</p>
            </div>
          </div>

          {/* Customer Information */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Name</p>
                <p className="font-medium">
                  {payment.user.firstName || payment.user.lastName
                    ? `${payment.user.firstName || ""} ${payment.user.lastName || ""}`.trim()
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium">{payment.user.email}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Details */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Payment Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Purpose</span>
                <span className="font-medium">{payment.purpose}</span>
              </div>
              {payment.referenceId && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reference ID</span>
                  <span className="font-medium">{payment.referenceId}</span>
                </div>
              )}
              {payment.metadata && (
                <div>
                  <p className="text-muted-foreground mb-1">Metadata</p>
                  <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                    {payment.metadata}
                  </pre>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Amount */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-purple-900 dark:text-purple-100">Amount</span>
              <span className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                ₦{formatPaymentAmount(Number(payment.amount)).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Timestamps */}
          <div className="text-sm text-muted-foreground">
            <p>Created: {formatDate(payment.createdAt, "PPp")}</p>
            <p>Last Updated: {formatDate(payment.updatedAt, "PPp")}</p>
            {payment.paidAt && (
              <p>Paid At: {formatDate(payment.paidAt, "PPp")}</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

