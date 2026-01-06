"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { Pagination } from "@/components/shared/Pagination";
import { usePrayerRequests } from "./hooks/usePrayerRequests";
import { PrayerRequestsTable } from "./components/PrayerRequestsTable";
import { PrayerRequestsFilters } from "./components/PrayerRequestsFilters";
import { PRAYER_REQUESTS_PAGE_SIZE } from "./constants";
import type { PrayerRequestStatus } from "@/types";

export default function PrayerRequestsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

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

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this prayer request?")) {
      deletePrayerRequest(id);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Prayer Requests"
        description="Manage prayer requests from your community members"
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
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
    </div>
  );
}
