"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { Pagination } from "@/components/shared/Pagination";
import { usePrayerRequests } from "./hooks/usePrayerRequests";
import { PrayerRequestsTable } from "./components/PrayerRequestsTable";
import { PrayerRequestsFilters } from "./components/PrayerRequestsFilters";
import { PrayerRequestDetailDialog } from "./components/PrayerRequestDetailDialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PRAYER_REQUESTS_PAGE_SIZE } from "./constants";
import { CheckCheck, Loader2 } from "lucide-react";
import type { PrayerRequestStatus, PrayerRequest } from "@/types";
import { PermissionGuard } from "@/components/guards/PermissionGuard";

function PrayerRequestsPageContent() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<PrayerRequest | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const {
    prayerRequests,
    meta,
    isLoading,
    updatePrayerRequest,
    deletePrayerRequest,
    bulkUpdatePrayerRequests,
    isDeleting,
    isBulkUpdating,
  } = usePrayerRequests({
    page,
    limit: PRAYER_REQUESTS_PAGE_SIZE,
    search: search || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const handleStatusChange = (id: string, status: PrayerRequestStatus) => {
    updatePrayerRequest({ id, data: { status } });
  };

  const handleDelete = (id: string) => setDeleteTarget(id);

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deletePrayerRequest(deleteTarget);
      setDeleteTarget(null);
    }
  };

  const handleViewDetails = (request: PrayerRequest) => {
    setSelectedRequest(request);
    setIsDetailDialogOpen(true);
  };

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const toggleAll = useCallback(() => {
    setSelectedIds((prev) =>
      prev.length === prayerRequests.length ? [] : prayerRequests.map((r) => r.id)
    );
  }, [prayerRequests]);

  const handleBulkMarkPrayed = () => {
    if (!selectedIds.length) return;
    bulkUpdatePrayerRequests(
      { ids: selectedIds, status: "IN_PROGRESS" },
      { onSuccess: () => setSelectedIds([]) } as any
    );
  };

  const handleBulkMarkAnswered = () => {
    if (!selectedIds.length) return;
    bulkUpdatePrayerRequests(
      { ids: selectedIds, status: "ANSWERED" },
      { onSuccess: () => setSelectedIds([]) } as any
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="Prayer Requests"
        description="Manage prayer requests from your community members"
      />

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CardTitle>All Prayer Requests</CardTitle>
              {selectedIds.length > 0 && (
                <Badge variant="secondary" className="font-bold">
                  {selectedIds.length} selected
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {selectedIds.length > 0 && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-blue-700 border-blue-300 hover:bg-blue-50"
                    onClick={handleBulkMarkPrayed}
                    disabled={isBulkUpdating}
                  >
                    {isBulkUpdating ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <CheckCheck className="h-3.5 w-3.5" />
                    )}
                    Mark Praying ({selectedIds.length})
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-green-700 border-green-300 hover:bg-green-50"
                    onClick={handleBulkMarkAnswered}
                    disabled={isBulkUpdating}
                  >
                    {isBulkUpdating ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <CheckCheck className="h-3.5 w-3.5" />
                    )}
                    Mark Answered ({selectedIds.length})
                  </Button>
                </>
              )}
              <PrayerRequestsFilters
                search={search}
                status={statusFilter}
                onSearchChange={(value) => {
                  setSearch(value);
                  setPage(1);
                }}
                onStatusChange={(value) => {
                  setStatusFilter(value);
                  setPage(1);
                }}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <PrayerRequestsTable
            prayerRequests={prayerRequests}
            isLoading={isLoading}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
            onViewDetails={handleViewDetails}
            isDeleting={isDeleting}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onToggleAll={toggleAll}
          />
          {meta && meta.totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={meta.totalPages}
              total={meta.total}
              onPageChange={setPage}
              pageSize={PRAYER_REQUESTS_PAGE_SIZE}
            />
          )}
        </CardContent>
      </Card>

      <PrayerRequestDetailDialog
        prayerRequest={selectedRequest}
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete prayer request"
        description="Are you sure you want to delete this prayer request?"
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        variant="destructive"
        isLoading={isDeleting}
      />
    </div>
  );
}

export default function PrayerRequestsPage() {
  return (
    <PermissionGuard permission="prayerRequests">
      <PrayerRequestsPageContent />
    </PermissionGuard>
  );
}
