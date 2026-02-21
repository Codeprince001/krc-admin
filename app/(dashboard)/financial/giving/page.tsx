"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGiving } from "./hooks/useGiving";
import { GivingFilters } from "./components/GivingFilters";
import { GivingTable } from "./components/GivingTable";
import { GivingDetailsDialog } from "./components/GivingDetailsDialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { GivingStats } from "./components/GivingStats";
import type { Giving, GivingCategory } from "@/types/api/giving.types";

export default function GivingPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedGiving, setSelectedGiving] = useState<Giving | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const limit = 10;

  const queryParams = {
    page,
    limit,
    search: search || undefined,
    category: (categoryFilter && categoryFilter !== "all" ? categoryFilter : undefined) as GivingCategory | undefined,
  };

  const {
    giving,
    meta,
    stats,
    isLoading,
    deleteGiving,
    isDeleting,
  } = useGiving(queryParams);

  const handleViewGiving = (record: Giving) => {
    setSelectedGiving(record);
    setIsDetailsOpen(true);
  };

  const handleDeleteGiving = (id: string) => setDeleteTarget(id);

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteGiving(deleteTarget);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Giving</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Manage giving records</p>
      </div>

      <GivingStats stats={stats} isLoading={isLoading} />

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>All Giving Records</CardTitle>
            <GivingFilters
              search={search}
              category={categoryFilter}
              onSearchChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
              onCategoryChange={(value) => {
                setCategoryFilter(value);
                setPage(1);
              }}
            />
          </div>
        </CardHeader>
        <CardContent>
          <GivingTable
            giving={giving}
            isLoading={isLoading}
            onView={handleViewGiving}
            onDelete={handleDeleteGiving}
            isDeleting={isDeleting}
          />
          {meta && meta.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Page {meta.page} of {meta.totalPages} ({meta.total} total)
              </p>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex-1 sm:flex-none"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                  disabled={page === meta.totalPages}
                  className="flex-1 sm:flex-none"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <GivingDetailsDialog
        giving={selectedGiving}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete giving record"
        description="Are you sure you want to delete this giving record?"
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        variant="destructive"
        isLoading={isDeleting}
      />
    </div>
  );
}
