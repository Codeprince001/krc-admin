"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { Pagination } from "@/components/shared/Pagination";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Check, X, Loader2 } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useTestimonies } from "./hooks/useTestimonies";
import { TestimoniesTable } from "./components/TestimoniesTable";
import { TestimoniesFilters } from "./components/TestimoniesFilters";
import { TESTIMONIES_PAGE_SIZE } from "./constants";
import { PermissionGuard } from "@/components/guards/PermissionGuard";

function TestimoniesPageContent() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const {
    testimonies,
    meta,
    isLoading,
    approveTestimony,
    rejectTestimony,
    deleteTestimony,
    bulkApprove,
    bulkReject,
    isDeleting,
    isApproving,
    isRejecting,
    isBulkApproving,
    isBulkRejecting,
  } = useTestimonies({
    page,
    limit: TESTIMONIES_PAGE_SIZE,
    search: search || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const handleApprove = (id: string) => approveTestimony(id);
  const handleReject = (id: string) => setRejectTarget(id);
  const handleConfirmReject = () => {
    if (rejectTarget) {
      rejectTestimony(rejectTarget);
      setRejectTarget(null);
    }
  };
  const handleDelete = (id: string) => setDeleteTarget(id);
  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteTestimony(deleteTarget);
      setDeleteTarget(null);
    }
  };

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const toggleAll = useCallback(() => {
    setSelectedIds((prev) =>
      prev.length === testimonies.length ? [] : testimonies.map((t) => t.id)
    );
  }, [testimonies]);

  const handleBulkApprove = () => {
    if (!selectedIds.length) return;
    bulkApprove(selectedIds, { onSuccess: () => setSelectedIds([]) } as any);
  };

  const handleBulkReject = () => {
    if (!selectedIds.length) return;
    bulkReject(selectedIds, { onSuccess: () => setSelectedIds([]) } as any);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Testimonies"
          description="Review and manage testimonies from your community"
        />
        <Button onClick={() => router.push("/community/testimonies/new")} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Create Testimony
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CardTitle>All Testimonies</CardTitle>
              {selectedIds.length > 0 && (
                <Badge variant="secondary" className="font-bold">
                  {selectedIds.length} selected
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {/* Bulk action buttons */}
              {selectedIds.length > 0 && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-green-700 border-green-300 hover:bg-green-50"
                    onClick={handleBulkApprove}
                    disabled={isBulkApproving}
                  >
                    {isBulkApproving ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Check className="h-3.5 w-3.5" />
                    )}
                    Approve ({selectedIds.length})
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-red-700 border-red-300 hover:bg-red-50"
                    onClick={handleBulkReject}
                    disabled={isBulkRejecting}
                  >
                    {isBulkRejecting ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <X className="h-3.5 w-3.5" />
                    )}
                    Reject ({selectedIds.length})
                  </Button>
                </>
              )}
              <TestimoniesFilters
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
          <TestimoniesTable
            testimonies={testimonies}
            isLoading={isLoading}
            onApprove={handleApprove}
            onReject={handleReject}
            onDelete={handleDelete}
            isDeleting={isDeleting}
            isApproving={isApproving}
            isRejecting={isRejecting}
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
              pageSize={TESTIMONIES_PAGE_SIZE}
            />
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!rejectTarget}
        onOpenChange={(open) => !open && setRejectTarget(null)}
        title="Reject testimony"
        description="Are you sure you want to reject this testimony?"
        confirmLabel="Reject"
        onConfirm={handleConfirmReject}
        variant="destructive"
        isLoading={isRejecting}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete testimony"
        description="Are you sure you want to delete this testimony?"
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        variant="destructive"
        isLoading={isDeleting}
      />
    </div>
  );
}

export default function TestimoniesPage() {
  return (
    <PermissionGuard permission="testimonies">
      <TestimoniesPageContent />
    </PermissionGuard>
  );
}
