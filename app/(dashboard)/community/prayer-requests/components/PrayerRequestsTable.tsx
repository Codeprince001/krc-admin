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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Heart, User } from "lucide-react";
import { formatDate } from "@/lib/utils/format";
import type { PrayerRequest, PrayerRequestStatus } from "@/types";
import { PRAYER_REQUEST_STATUSES } from "../constants";
import { LoadingState } from "@/components/shared/LoadingState";
import { EmptyState } from "@/components/shared/EmptyState";

interface PrayerRequestsTableProps {
  prayerRequests: PrayerRequest[];
  isLoading?: boolean;
  onStatusChange: (id: string, status: PrayerRequestStatus) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export function PrayerRequestsTable({
  prayerRequests,
  isLoading = false,
  onStatusChange,
  onDelete,
  isDeleting = false,
}: PrayerRequestsTableProps) {
  if (isLoading) {
    return <LoadingState message="Loading prayer requests..." />;
  }

  if (prayerRequests.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="No prayer requests found"
        description="Prayer requests from your community will appear here."
      />
    );
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "PENDING":
        return "secondary";
      case "IN_PROGRESS":
        return "default";
      case "ANSWERED":
        return "default";
      case "CLOSED":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Request</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Prayers</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prayerRequests.map((request) => (
            <TableRow key={request.id} className="hover:bg-muted/50">
              <TableCell>
                <div>
                  <div className="font-semibold">{request.title}</div>
                  <div className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {request.content}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {request.isAnonymous ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span className="text-sm">Anonymous</span>
                  </div>
                ) : request.user ? (
                  <div className="text-sm">
                    {request.user.firstName || request.user.lastName
                      ? `${request.user.firstName || ""} ${request.user.lastName || ""}`.trim()
                      : request.user.email}
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">N/A</span>
                )}
              </TableCell>
              <TableCell>
                <Select
                  value={request.status}
                  onValueChange={(value) =>
                    onStatusChange(request.id, value as PrayerRequestStatus)
                  }
                >
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRAYER_REQUEST_STATUSES.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="font-mono">
                  {request.prayerCount || 0}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(request.createdAt, "PP")}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(request.id)}
                  disabled={isDeleting}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

