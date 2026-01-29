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
import { Trash2, Calendar, User, Phone, FileText } from "lucide-react";
import { formatDate } from "@/lib/utils/format";
import { ResponsiveTableWrapper } from "@/components/shared/ResponsiveTableWrapper";
import type { CounselingSession, CounselingStatus } from "@/types";
import { COUNSELING_STATUSES, COUNSELING_CATEGORIES } from "../constants";
import { LoadingState } from "@/components/shared/LoadingState";
import { EmptyState } from "@/components/shared/EmptyState";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface CounselingTableProps {
  sessions: CounselingSession[];
  isLoading?: boolean;
  onStatusChange: (id: string, status: CounselingStatus) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
  onNotesUpdate: (id: string, notes: string) => void;
}

export function CounselingTable({
  sessions,
  isLoading = false,
  onStatusChange,
  onDelete,
  isDeleting = false,
  onNotesUpdate,
}: CounselingTableProps) {
  const [selectedSession, setSelectedSession] = useState<CounselingSession | null>(null);
  const [notes, setNotes] = useState("");
  const [showNotesDialog, setShowNotesDialog] = useState(false);

  if (isLoading) {
    return <LoadingState message="Loading counseling sessions..." />;
  }

  if (sessions.length === 0) {
    return (
      <EmptyState
        icon={Calendar}
        title="No counseling sessions found"
        description="Counseling sessions from your community will appear here."
      />
    );
  }

  const getStatusVariant = (status: string) => {
    const statusConfig = COUNSELING_STATUSES.find((s) => s.value === status);
    return statusConfig?.variant || "secondary";
  };

  const getCategoryLabel = (category: string) => {
    return COUNSELING_CATEGORIES.find((c) => c.value === category)?.label || category;
  };

  const handleOpenNotes = (session: CounselingSession) => {
    setSelectedSession(session);
    setNotes(session.counselorNotes || "");
    setShowNotesDialog(true);
  };

  const handleSaveNotes = () => {
    if (selectedSession) {
      onNotesUpdate(selectedSession.id, notes);
      setShowNotesDialog(false);
    }
  };

  return (
    <>
      <ResponsiveTableWrapper>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[180px]">User</TableHead>
              <TableHead className="min-w-[140px]">Category</TableHead>
              <TableHead className="min-w-[180px]">Scheduled Date & Time</TableHead>
              <TableHead className="min-w-[120px]">Phone</TableHead>
              <TableHead className="min-w-[150px]">Status</TableHead>
              <TableHead className="min-w-[120px]">Created</TableHead>
              <TableHead className="text-right min-w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((session) => (
              <TableRow key={session.id} className="hover:bg-muted/50">
                <TableCell>
                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      {session.user ? (
                        <>
                          <div className="font-medium">
                            {session.user.firstName || session.user.lastName
                              ? `${session.user.firstName || ""} ${session.user.lastName || ""}`.trim()
                              : session.user.email}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {session.user.email}
                          </div>
                        </>
                      ) : (
                        <span className="text-sm text-muted-foreground">N/A</span>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{getCategoryLabel(session.category)}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-medium">
                        {formatDate(session.slot.date, "PP")}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(session.slot.startTime, "p")} - {formatDate(session.slot.endTime, "p")}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    {session.phoneNumber || "N/A"}
                  </div>
                </TableCell>
                <TableCell>
                  <Select
                    value={session.status}
                    onValueChange={(value) =>
                      onStatusChange(session.id, value as CounselingStatus)
                    }
                  >
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNSELING_STATUSES.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(session.createdAt, "PP")}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenNotes(session)}
                      className="h-8 w-8 p-0"
                      title="View/Edit Notes"
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(session.id)}
                      disabled={isDeleting}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ResponsiveTableWrapper>

      <Dialog open={showNotesDialog} onOpenChange={setShowNotesDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Counseling Session Details</DialogTitle>
          </DialogHeader>
          {selectedSession && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">User Information</h4>
                <div className="text-sm space-y-1 text-muted-foreground">
                  <p>
                    <strong>Name:</strong>{" "}
                    {selectedSession.user
                      ? `${selectedSession.user.firstName || ""} ${selectedSession.user.lastName || ""}`.trim()
                      : "N/A"}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedSession.user?.email || "N/A"}
                  </p>
                  <p>
                    <strong>Phone:</strong> {selectedSession.phoneNumber}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Session Details</h4>
                <div className="text-sm space-y-1 text-muted-foreground">
                  <p>
                    <strong>Category:</strong> {getCategoryLabel(selectedSession.category)}
                  </p>
                  <p>
                    <strong>Date:</strong> {formatDate(selectedSession.slot.date, "PP")}
                  </p>
                  <p>
                    <strong>Time:</strong> {formatDate(selectedSession.slot.startTime, "p")} -{" "}
                    {formatDate(selectedSession.slot.endTime, "p")}
                  </p>
                  <p>
                    <strong>Status:</strong> {selectedSession.status}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Request Description</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {selectedSession.description}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Counselor Notes</h4>
                <Textarea
                  placeholder="Add notes about this counseling session..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowNotesDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveNotes}>Save Notes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
