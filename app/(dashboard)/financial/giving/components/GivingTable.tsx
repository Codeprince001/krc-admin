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
import { Loader2, Eye, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils/format";
import { ResponsiveTableWrapper } from "@/components/shared/ResponsiveTableWrapper";
import type { Giving, PaymentStatus } from "@/types/api/giving.types";

interface GivingTableProps {
  giving: Giving[];
  isLoading: boolean;
  onView: (giving: Giving) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function GivingTable({
  giving,
  isLoading,
  onView,
  onDelete,
  isDeleting,
}: GivingTableProps) {
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
            <TableHead className="min-w-[150px]">Donor</TableHead>
            <TableHead className="min-w-[120px]">Category</TableHead>
            <TableHead className="min-w-[100px]">Amount</TableHead>
            <TableHead className="min-w-[140px]">Payment Method</TableHead>
            <TableHead className="min-w-[140px]">Payment Status</TableHead>
            <TableHead className="min-w-[120px]">Date</TableHead>
            <TableHead className="text-right min-w-[120px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
      <TableBody>
        {giving.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-8">
              No giving records found
            </TableCell>
          </TableRow>
        ) : (
          giving.map((record) => (
            <TableRow key={record.id}>
              <TableCell>
                {record.isAnonymous ? (
                  <span className="text-muted-foreground">Anonymous</span>
                ) : (
                  <div className="font-medium">
                    {record.user.firstName || record.user.lastName
                      ? `${record.user.firstName || ""} ${record.user.lastName || ""}`.trim()
                      : "N/A"}
                  </div>
                )}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{record.category}</Badge>
              </TableCell>
              <TableCell>
                <div className="font-medium">
                  ₦{Number(record.amount).toLocaleString()}
                </div>
              </TableCell>
              <TableCell>{record.paymentMethod || "N/A"}</TableCell>
              <TableCell>
                <Badge variant={getPaymentStatusVariant(record.paymentStatus)}>
                  {record.paymentStatus}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(record.givenDate, "PP")}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(record)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(record.id)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
        </TableBody>
      </Table>
    </ResponsiveTableWrapper>
  );
}

