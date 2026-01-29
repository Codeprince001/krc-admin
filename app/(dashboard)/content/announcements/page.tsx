"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Pagination } from "@/components/shared/Pagination";
import { useAnnouncements } from "./hooks/useAnnouncements";
import { AnnouncementsTable } from "./components/AnnouncementsTable";
import { AnnouncementsFilters } from "./components/AnnouncementsFilters";
import { AnnouncementFormDialog } from "./components/AnnouncementFormDialog";
import { ANNOUNCEMENT_PAGE_SIZE } from "./constants";
import type {
  Announcement,
  CreateAnnouncementRequest,
  UpdateAnnouncementRequest,
} from "@/types";

export default function AnnouncementsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  const {
    announcements,
    meta,
    isLoading,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    isCreating,
    isUpdating,
    isDeleting,
  } = useAnnouncements({
    page,
    limit: ANNOUNCEMENT_PAGE_SIZE,
    search: search || undefined,
    category: category !== "all" ? category : undefined,
  });

  const handleAdd = () => {
    setEditingAnnouncement(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this announcement?")) {
      deleteAnnouncement(id);
    }
  };

  const handleSubmit = (
    data: CreateAnnouncementRequest | UpdateAnnouncementRequest
  ) => {
    if (editingAnnouncement) {
      updateAnnouncement({ id: editingAnnouncement.id, data });
    } else {
      createAnnouncement(data as CreateAnnouncementRequest);
    }
    setIsDialogOpen(false);
    setEditingAnnouncement(null);
    setPage(1);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="Announcements"
        description="Keep your community informed with important announcements"
        actions={
          <Button onClick={handleAdd} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Create Announcement
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>All Announcements</CardTitle>
            <AnnouncementsFilters
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
          <AnnouncementsTable
            announcements={announcements}
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
              pageSize={ANNOUNCEMENT_PAGE_SIZE}
            />
          )}
        </CardContent>
      </Card>

      <AnnouncementFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        announcement={editingAnnouncement}
        onSubmit={handleSubmit}
        isSubmitting={isCreating || isUpdating}
      />
    </div>
  );
}
