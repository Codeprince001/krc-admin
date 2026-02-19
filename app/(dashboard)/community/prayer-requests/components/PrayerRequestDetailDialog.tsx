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
import { User, Heart, Calendar, MessageSquare } from "lucide-react";
import type { PrayerRequest } from "@/types";
import { PRAYER_REQUEST_STATUSES } from "../constants";

interface PrayerRequestDetailDialogProps {
  prayerRequest: PrayerRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PrayerRequestDetailDialog({
  prayerRequest,
  open,
  onOpenChange,
}: PrayerRequestDetailDialogProps) {
  if (!prayerRequest) return null;

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

  const statusLabel =
    PRAYER_REQUEST_STATUSES.find((s) => s.value === prayerRequest.status)
      ?.label || prayerRequest.status;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">
                {prayerRequest.title}
              </DialogTitle>
              <DialogDescription>
                <Badge variant={getStatusVariant(prayerRequest.status)}>
                  {statusLabel}
                </Badge>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Description */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">Description</h3>
            </div>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {prayerRequest.content || "No description provided"}
            </p>
          </div>

          <Separator />

          {/* User Information */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">Submitted By</h3>
            </div>
            {prayerRequest.isAnonymous ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                <span className="text-sm">Anonymous</span>
              </div>
            ) : prayerRequest.user ? (
              <div className="text-sm space-y-1">
                <p className="font-medium">
                  {prayerRequest.user.firstName || prayerRequest.user.lastName
                    ? `${prayerRequest.user.firstName || ""} ${prayerRequest.user.lastName || ""}`.trim()
                    : "Unknown User"}
                </p>
                {prayerRequest.user.email && (
                  <p className="text-muted-foreground">
                    {prayerRequest.user.email}
                  </p>
                )}
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">N/A</span>
            )}
          </div>

          <Separator />

          {/* Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-sm">Created</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {formatDate(prayerRequest.createdAt, "PPpp")}
              </p>
            </div>

            {prayerRequest.updatedAt && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold text-sm">Last Updated</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatDate(prayerRequest.updatedAt, "PPpp")}
                </p>
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Heart className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-sm">Prayer Count</h3>
              </div>
              <Badge variant="outline" className="font-mono">
                {prayerRequest.prayerCount || 0}
              </Badge>
            </div>

            {prayerRequest.isAnonymous !== undefined && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold text-sm">Visibility</h3>
                </div>
                <Badge variant={prayerRequest.isAnonymous ? "secondary" : "default"}>
                  {prayerRequest.isAnonymous ? "Anonymous" : "Public"}
                </Badge>
              </div>
            )}
          </div>

          {/* Testimony (if answered) */}
          {prayerRequest.response && (
            <>
              <Separator />
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold text-sm">Testimony</h3>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {prayerRequest.response}
                </p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
