"use client";

import { format } from "date-fns";
import { Pencil, Trash2, MessageSquareWarning } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoadingState } from "@/components/shared/LoadingState";
import { EmptyState } from "@/components/shared/EmptyState";
import { POPUP_STATUS_COLORS } from "../constants";
import { cn } from "@/lib/utils/cn";
import type { InAppPopup } from "@/types";

interface InAppPopupsTableProps {
  popups: InAppPopup[];
  isLoading: boolean;
  isDeleting: boolean;
  onEdit: (popup: InAppPopup) => void;
  onDelete: (id: string) => void;
}

export function InAppPopupsTable({
  popups,
  isLoading,
  isDeleting,
  onEdit,
  onDelete,
}: InAppPopupsTableProps) {
  if (isLoading) {
    return <LoadingState message="Loading in-app popups..." />;
  }

  if (!popups.length) {
    return (
      <EmptyState
        icon={MessageSquareWarning}
        title="No in-app popups found"
        description="Create your first reminder popup to notify users in-app."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border/50">
      <Table>
        <TableHeader>
          <TableRow className="border-border/50 bg-muted/40">
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Contexts</TableHead>
            <TableHead>Frequency</TableHead>
            <TableHead>Schedule</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {popups.map((popup) => (
            <TableRow key={popup.id} className="border-border/40 hover:bg-muted/20">
              <TableCell>
                <div className="space-y-1">
                  <p className="font-medium">{popup.title}</p>
                  <p className="max-w-[320px] truncate text-xs text-muted-foreground">
                    {popup.message}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-semibold",
                    POPUP_STATUS_COLORS[popup.status] ?? "bg-gray-100 text-gray-700"
                  )}
                >
                  {popup.status}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {popup.contexts.map((context) => (
                    <Badge key={context} variant="secondary">
                      {context}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>Per day: {popup.maxShowsPerDay}</p>
                  <p>Per week: {popup.maxShowsPerWeek}</p>
                  <p>Cooldown: {popup.minIntervalHours}h</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>
                    {popup.startDate ? format(new Date(popup.startDate), "MMM d, yyyy") : "Immediate"}
                  </p>
                  <p>
                    {popup.endDate ? format(new Date(popup.endDate), "MMM d, yyyy") : "No end date"}
                  </p>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEdit(popup)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => onDelete(popup.id)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
