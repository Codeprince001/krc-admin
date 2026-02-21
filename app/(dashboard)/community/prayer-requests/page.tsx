"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { Pagination } from "@/components/shared/Pagination";
import { usePrayerRequests } from "./hooks/usePrayerRequests";
import { PrayerRequestsTable } from "./components/PrayerRequestsTable";
import { PrayerRequestsFilters } from "./components/PrayerRequestsFilters";
import { PrayerRequestDetailDialog } from "./components/PrayerRequestDetailDialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PRAYER_REQUESTS_PAGE_SIZE } from "./constants";
import type { PrayerRequestStatus, PrayerRequest } from "@/types";

export default function PrayerRequestsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<PrayerRequest | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const {
    prayerRequests,
    meta,
    isLoading,
    updatePrayerRequest,
    deletePrayerRequest,
    isDeleting,
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

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="Prayer Requests"
        description="Manage prayer requests from your community members"
      />

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>All Prayer Requests</CardTitle>
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
        </CardHeader>
        <CardContent className="space-y-4">
          <PrayerRequestsTable
            prayerRequests={prayerRequests}
            isLoading={isLoading}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
            onViewDetails={handleViewDetails}
            isDeleting={isDeleting}
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
