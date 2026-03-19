"use client";

import { useState } from "react";
import type { ElementType } from "react";
import { Plus, Search, MessageSquareWarning, Eye, MousePointerClick, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PageHeader } from "@/components/shared/PageHeader";
import { Pagination } from "@/components/shared/Pagination";
import { PermissionGuard } from "@/components/guards/PermissionGuard";
import {
  IN_APP_POPUP_PAGE_SIZE,
  POPUP_CONTEXT_OPTIONS,
  POPUP_STATUS_OPTIONS,
} from "./constants";
import { useInAppPopups, useInAppPopupStats } from "./hooks/useInAppPopups";
import { InAppPopupsTable } from "./components/InAppPopupsTable";
import { InAppPopupFormDialog } from "./components/InAppPopupFormDialog";
import type { CreateInAppPopupRequest, InAppPopup, UpdateInAppPopupRequest } from "@/types";

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  isLoading,
}: {
  icon: ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  isLoading: boolean;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className={`rounded-xl p-3 ${color}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          {isLoading ? (
            <div className="mt-1 h-7 w-16 animate-pulse rounded bg-muted" />
          ) : (
            <p className="text-2xl font-bold">{value}</p>
          )}
          {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

function InAppPopupsPageContent() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [context, setContext] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPopup, setEditingPopup] = useState<InAppPopup | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const { data: stats, isLoading: statsLoading } = useInAppPopupStats();
  const {
    popups,
    meta,
    isLoading,
    createPopup,
    updatePopup,
    deletePopup,
    isCreating,
    isUpdating,
    isDeleting,
  } = useInAppPopups({
    page,
    limit: IN_APP_POPUP_PAGE_SIZE,
    search: search || undefined,
    status: status !== "all" ? status : undefined,
    context: context !== "all" ? context : undefined,
  });

  const handleSubmit = (data: CreateInAppPopupRequest | UpdateInAppPopupRequest) => {
    const onSuccess = () => {
      setIsDialogOpen(false);
      setEditingPopup(null);
      setPage(1);
    };
    if (editingPopup) {
      updatePopup({ id: editingPopup.id, data }, { onSuccess });
    } else {
      createPopup(data as CreateInAppPopupRequest, { onSuccess });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="In-App Popups"
        description="Manage reminder popups shown to users inside the app."
        actions={
          <Button
            className="w-full sm:w-auto"
            onClick={() => {
              setEditingPopup(null);
              setIsDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Popup
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          icon={MessageSquareWarning}
          label="Total Popups"
          value={stats?.total ?? 0}
          sub={`${stats?.active ?? 0} active`}
          color="bg-blue-500"
          isLoading={statsLoading}
        />
        <StatCard
          icon={Eye}
          label="Total Shown"
          value={(stats?.totalShown ?? 0).toLocaleString()}
          color="bg-purple-500"
          isLoading={statsLoading}
        />
        <StatCard
          icon={MousePointerClick}
          label="Total Clicked"
          value={(stats?.totalClicked ?? 0).toLocaleString()}
          color="bg-green-500"
          isLoading={statsLoading}
        />
        <StatCard
          icon={TrendingUp}
          label="CTR"
          value={`${stats?.ctr ?? 0}%`}
          sub={`${stats?.dismissRate ?? 0}% dismiss rate`}
          color="bg-orange-500"
          isLoading={statsLoading}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>All Popups</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search popups..."
                  className="h-9 w-48 pl-8 text-sm"
                />
              </div>
              <Select
                value={status}
                onValueChange={(value) => {
                  setStatus(value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-9 w-36 text-sm">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {POPUP_STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={context}
                onValueChange={(value) => {
                  setContext(value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-9 w-40 text-sm">
                  <SelectValue placeholder="All contexts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All contexts</SelectItem>
                  {POPUP_CONTEXT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <InAppPopupsTable
            popups={popups}
            isLoading={isLoading}
            isDeleting={isDeleting}
            onEdit={(popup) => {
              setEditingPopup(popup);
              setIsDialogOpen(true);
            }}
            onDelete={setDeleteTarget}
          />
          {meta && meta.totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={meta.totalPages}
              total={meta.total}
              onPageChange={setPage}
              pageSize={IN_APP_POPUP_PAGE_SIZE}
            />
          )}
        </CardContent>
      </Card>

      <InAppPopupFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        popup={editingPopup}
        onSubmit={handleSubmit}
        isSubmitting={isCreating || isUpdating}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete in-app popup"
        description="This popup and all tracking analytics will be removed permanently."
        confirmLabel="Delete"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={() => {
          if (!deleteTarget) return;
          deletePopup(deleteTarget);
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}

export default function InAppPopupsPage() {
  return (
    <PermissionGuard permission="inAppPopups">
      <InAppPopupsPageContent />
    </PermissionGuard>
  );
}
