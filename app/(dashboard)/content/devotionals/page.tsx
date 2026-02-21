"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Pagination } from "@/components/shared/Pagination";
import { useDevotionals } from "./hooks/useDevotionals";
import { DevotionalsTable } from "./components/DevotionalsTable";
import { DevotionalsFilters } from "./components/DevotionalsFilters";
import { DevotionalFormDialog } from "./components/DevotionalFormDialog";
import { DEVOTIONALS_PAGE_SIZE } from "./constants";
import type { Devotional, CreateDevotionalRequest, UpdateDevotionalRequest } from "@/types";

export default function DevotionalsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDevotional, setEditingDevotional] = useState<Devotional | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const {
    devotionals,
    meta,
    isLoading,
    createDevotional,
    updateDevotional,
    deleteDevotional,
    isCreating,
    isUpdating,
    isDeleting,
  } = useDevotionals({
    page,
    limit: DEVOTIONALS_PAGE_SIZE,
    search: search || undefined,
  });

  const handleAdd = () => {
    setEditingDevotional(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (devotional: Devotional) => {
    setEditingDevotional(devotional);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => setDeleteTarget(id);

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteDevotional(deleteTarget);
      setDeleteTarget(null);
    }
  };

  const handleSubmit = (data: CreateDevotionalRequest | UpdateDevotionalRequest) => {
    const onSuccess = () => {
      setIsDialogOpen(false);
      setEditingDevotional(null);
      setPage(1);
    };
    if (editingDevotional) {
      updateDevotional({ id: editingDevotional.id, data }, { onSuccess });
    } else {
      createDevotional(data as CreateDevotionalRequest, { onSuccess });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="Devotionals"
        description="Manage daily devotionals to inspire your community"
        actions={
          <Button onClick={handleAdd} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Devotional
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>All Devotionals</CardTitle>
            <DevotionalsFilters
              search={search}
              onSearchChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <DevotionalsTable
            devotionals={devotionals}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isDeleting={isDeleting}
          />
          {meta && meta.totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={meta.totalPages}
              total={meta.total}
              onPageChange={setPage}
              pageSize={DEVOTIONALS_PAGE_SIZE}
            />
          )}
        </CardContent>
      </Card>

      <DevotionalFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        devotional={editingDevotional}
        onSubmit={handleSubmit}
        isSubmitting={isCreating || isUpdating}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete devotional"
        description="Are you sure you want to delete this devotional?"
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        variant="destructive"
        isLoading={isDeleting}
      />
    </div>
  );
}
