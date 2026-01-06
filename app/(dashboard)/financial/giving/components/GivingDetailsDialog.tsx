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
import type { Giving, PaymentStatus } from "@/types/api/giving.types";

interface GivingDetailsDialogProps {
  giving: Giving | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GivingDetailsDialog({
  giving,
  open,
  onOpenChange,
}: GivingDetailsDialogProps) {
  if (!giving) return null;

  const getPaymentStatusVariant = (status: PaymentStatus) => {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Giving Record Details</DialogTitle>
          <DialogDescription>
            View complete giving record information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Category</p>
              <Badge variant="outline" className="mt-1">
                {giving.category}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Payment Status</p>
              <Badge variant={getPaymentStatusVariant(giving.paymentStatus)} className="mt-1">
                {giving.paymentStatus}
              </Badge>
            </div>
          </div>

          {/* Donor Information */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Donor Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Name</p>
                <p className="font-medium">
                  {giving.isAnonymous
                    ? "Anonymous"
                    : giving.user.firstName || giving.user.lastName
                    ? `${giving.user.firstName || ""} ${giving.user.lastName || ""}`.trim()
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Anonymous</p>
                <p className="font-medium">{giving.isAnonymous ? "Yes" : "No"}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Information */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Payment Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {giving.paymentMethod && (
                <div>
                  <p className="text-muted-foreground">Payment Method</p>
                  <p className="font-medium">{giving.paymentMethod}</p>
                </div>
              )}
              {giving.paymentRef && (
                <div>
                  <p className="text-muted-foreground">Payment Reference</p>
                  <p className="font-medium">{giving.paymentRef}</p>
                </div>
              )}
              {giving.paidAt && (
                <div>
                  <p className="text-muted-foreground">Paid At</p>
                  <p className="font-medium">{formatDate(giving.paidAt, "PPp")}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Amount */}
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Amount</span>
              <span className="text-2xl font-bold">
                ₦{Number(giving.amount).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Notes */}
          {giving.notes && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Notes</h3>
              <p className="text-sm">{giving.notes}</p>
            </div>
          )}

          {/* Timestamps */}
          <div className="text-sm text-muted-foreground">
            <p>Given Date: {formatDate(giving.givenDate, "PPp")}</p>
            <p>Created: {formatDate(giving.createdAt, "PPp")}</p>
            <p>Last Updated: {formatDate(giving.updatedAt, "PPp")}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

