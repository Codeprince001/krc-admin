"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { Pagination } from "@/components/shared/Pagination";
import { useCounselingSessions } from "./hooks/useCounselingSessions";
import { CounselingTable } from "./components/CounselingTable";
import { CounselingFilters } from "./components/CounselingFilters";
import { COUNSELING_PAGE_SIZE } from "./constants";
import type { CounselingStatus } from "@/types";

export default function CounselingPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const {
    sessions,
    pagination,
    isLoading,
    updateSession,
    deleteSession,
    isDeleting,
  } = useCounselingSessions({
    page,
    limit: COUNSELING_PAGE_SIZE,
    status: statusFilter !== "all" ? statusFilter : undefined,
    category: categoryFilter !== "all" ? categoryFilter : undefined,
  });

  const handleStatusChange = (id: string, status: CounselingStatus) => {
    updateSession({ id, data: { status } });
  };

  const handleNotesUpdate = (id: string, notes: string) => {
    updateSession({ id, data: { counselorNotes: notes } });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this counseling session?")) {
      deleteSession(id);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="Counseling Sessions"
        description="Manage counseling requests and sessions from your community members"
      />

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>All Counseling Sessions</CardTitle>
            <CounselingFilters
              status={statusFilter}
              category={categoryFilter}
              onStatusChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}
              onCategoryChange={(value) => {
                setCategoryFilter(value);
                setPage(1);
              }}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <CounselingTable
            sessions={sessions}
            isLoading={isLoading}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
            isDeleting={isDeleting}
            onNotesUpdate={handleNotesUpdate}
          />
          {pagination && pagination.totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              onPageChange={setPage}
              pageSize={COUNSELING_PAGE_SIZE}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
