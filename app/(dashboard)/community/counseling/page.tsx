"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { Pagination } from "@/components/shared/Pagination";
import { useCounselingSessions } from "./hooks/useCounselingSessions";
import { counselingService } from "@/lib/api/services/counseling.service";
import { CounselingTable } from "./components/CounselingTable";
import { CounselingFilters } from "./components/CounselingFilters";
import { downloadExcel } from "@/lib/utils/exportExcel";
import { formatDate } from "@/lib/utils/format";
import { toast } from "sonner";
import { FileDown, Loader2 } from "lucide-react";
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

  const [isExporting, setIsExporting] = useState(false);
  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await counselingService.getCounselingSessions(
        1,
        10000,
        statusFilter !== "all" ? statusFilter : undefined,
        categoryFilter !== "all" ? categoryFilter : undefined
      );
      const list = res?.sessions || [];
      const rows = list.map((s) => ({
        Category: s.category,
        Status: s.status,
        Customer: s.user ? `${s.user.firstName ?? ""} ${s.user.lastName ?? ""}`.trim() || s.user.email : "",
        Email: s.user?.email ?? "",
        Phone: s.phoneNumber,
        Description: s.description,
        "Session Date": s.slot?.date ? formatDate(s.slot.date, "yyyy-MM-dd") : "",
        "Start Time": s.slot?.startTime ?? "",
        "End Time": s.slot?.endTime ?? "",
        "Counselor Notes": s.counselorNotes ?? "",
        "Created At": formatDate(s.createdAt, "yyyy-MM-dd HH:mm"),
      }));
      downloadExcel(rows, `counseling-export-${new Date().toISOString().slice(0, 10)}`, "Counseling");
      toast.success(`Exported ${rows.length} counseling sessions`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Export failed");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Counseling Sessions"
          description="Manage counseling requests and sessions from your community members"
        />
        <Button
          variant="outline"
          onClick={handleExport}
          disabled={isExporting}
          className="w-full sm:w-auto shrink-0"
        >
          {isExporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FileDown className="mr-2 h-4 w-4" />
          )}
          Export Excel
        </Button>
      </div>

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
