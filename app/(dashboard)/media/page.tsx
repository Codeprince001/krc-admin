"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMedia } from "./hooks/useMedia";
import { MediaFilters } from "./components/MediaFilters";
import { MediaGrid } from "./components/MediaGrid";
import { MediaViewDialog } from "./components/MediaViewDialog";
import { MediaStats } from "./components/MediaStats";
import type { Media, MediaType } from "@/types/api/media.types";

export default function MediaPage() {
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
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

  const handleDeleteMedia = (id: string) => {
    if (confirm("Are you sure you want to delete this media file?")) {
      deleteMedia(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Media Library</h1>
          <p className="text-muted-foreground">Manage media files</p>
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
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Page {meta.page} of {meta.totalPages} ({meta.total} total)
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                  disabled={page === meta.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <MediaViewDialog
        media={selectedMedia}
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
      />
    </div>
  );
}
