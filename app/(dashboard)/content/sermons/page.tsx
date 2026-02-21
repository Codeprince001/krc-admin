"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Pagination } from "@/components/shared/Pagination";
import { useSermons } from "./hooks/useSermons";
import { SermonsTable } from "./components/SermonsTable";
import { SermonsFilters } from "./components/SermonsFilters";
import { SermonFormDialog } from "./components/SermonFormDialog";
import { SERMONS_PAGE_SIZE } from "./constants";
import type { Sermon, CreateSermonRequest, UpdateSermonRequest } from "@/types";

export default function SermonsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSermon, setEditingSermon] = useState<Sermon | null>(null);

  const {
    sermons,
    meta,
    isLoading,
    createSermon,
    updateSermon,
    deleteSermon,
    isCreating,
    isUpdating,
    isDeleting,
  } = useSermons({
    page,
    limit: SERMONS_PAGE_SIZE,
    search: search || undefined,
    category: category !== "all" ? category : undefined,
  });

  const handleAdd = () => {
    setEditingSermon(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (sermon: Sermon) => {
    setEditingSermon(sermon);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this sermon?")) {
      deleteSermon(id);
    }
  };

  const handleSubmit = (data: CreateSermonRequest | UpdateSermonRequest) => {
    const onSuccess = () => {
      setIsDialogOpen(false);
      setEditingSermon(null);
      setPage(1);
    };
    if (editingSermon) {
      updateSermon({ id: editingSermon.id, data }, { onSuccess });
    } else {
      createSermon(data as CreateSermonRequest, { onSuccess });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="Sermons"
        description="Manage and share sermons with your community"
        actions={
          <Button onClick={handleAdd} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Upload Sermon
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>All Sermons</CardTitle>
            <SermonsFilters
              search={search}
              category={category}
              onSearchChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
              onCategoryChange={(value) => {
                setCategory(value);
                setPage(1);
              }}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <SermonsTable
            sermons={sermons}
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
              pageSize={SERMONS_PAGE_SIZE}
            />
          )}
        </CardContent>
      </Card>

      <SermonFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        sermon={editingSermon}
        onSubmit={handleSubmit}
        isSubmitting={isCreating || isUpdating}
      />
    </div>
  );
}
