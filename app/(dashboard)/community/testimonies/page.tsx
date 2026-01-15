"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { Pagination } from "@/components/shared/Pagination";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTestimonies } from "./hooks/useTestimonies";
import { TestimoniesTable } from "./components/TestimoniesTable";
import { TestimoniesFilters } from "./components/TestimoniesFilters";
import { TESTIMONIES_PAGE_SIZE } from "./constants";

export default function TestimoniesPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const {
    testimonies,
    meta,
    isLoading,
    approveTestimony,
    rejectTestimony,
    deleteTestimony,
    isDeleting,
    isApproving,
    isRejecting,
  } = useTestimonies({
    page,
    limit: TESTIMONIES_PAGE_SIZE,
    search: search || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const handleApprove = (id: string) => {
    approveTestimony(id);
  };

  const handleReject = (id: string) => {
    if (confirm("Are you sure you want to reject this testimony?")) {
      rejectTestimony(id);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this testimony?")) {
      deleteTestimony(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Testimonies"
          description="Review and manage testimonies from your community"
        />
        <Button onClick={() => router.push("/community/testimonies/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Create Testimony
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Testimonies</CardTitle>
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
    </div>
  );
}
