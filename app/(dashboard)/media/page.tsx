"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMedia } from "./hooks/useMedia";
import { MediaFilters } from "./components/MediaFilters";
import { MediaGrid } from "./components/MediaGrid";
import { MediaViewDialog } from "./components/MediaViewDialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Pagination } from "@/components/shared/Pagination";
import { MediaStats } from "./components/MediaStats";
import type { Media, MediaType } from "@/types/api/media.types";
import { PermissionGuard } from "@/components/guards/PermissionGuard";

function MediaPageContent() {
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const limit = 20;

  const queryParams = {
    page,
    limit,
    type: (typeFilter && typeFilter !== "all" ? typeFilter : undefined) as MediaType | undefined,
  };

  const {
    media,
    meta,
    stats,
    isLoading,
    deleteMedia,
    isDeleting,
  } = useMedia(queryParams);

  const handleViewMedia = (item: Media) => {
    setSelectedMedia(item);
    setIsViewOpen(true);
  };

  const handleDeleteMedia = (id: string) => setDeleteTarget(id);

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteMedia(deleteTarget);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Media Library</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage media files</p>
        </div>
        <MediaFilters
          type={typeFilter}
          onTypeChange={(value) => {
            setTypeFilter(value);
            setPage(1);
          }}
        />
      </div>

      <MediaStats stats={stats} isLoading={isLoading} />

      <Card>
        <CardHeader>
          <CardTitle>All Media Files</CardTitle>
        </CardHeader>
        <CardContent>
          <MediaGrid
            media={media}
            isLoading={isLoading}
            onView={handleViewMedia}
            onDelete={handleDeleteMedia}
            isDeleting={isDeleting}
          />
          {meta && meta.totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={meta.totalPages}
              total={meta.total}
              onPageChange={setPage}
              pageSize={limit}
            />
          )}
        </CardContent>
      </Card>

      <MediaViewDialog
        media={selectedMedia}
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete media file"
        description="Are you sure you want to delete this media file?"
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        variant="destructive"
        isLoading={isDeleting}
      />
    </div>
  );
}

export default function MediaPage() {
  return (
    <PermissionGuard permission="media">
      <MediaPageContent />
    </PermissionGuard>
  );
}
