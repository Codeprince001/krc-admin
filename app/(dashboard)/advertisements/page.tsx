"use client";

import { useState } from "react";
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
import { Plus, Search, Eye, MousePointerClick, TrendingUp, Megaphone } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Pagination } from "@/components/shared/Pagination";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useAdvertisements, useAdStats } from "./hooks/useAdvertisements";
import { AdvertisementsTable } from "./components/AdvertisementsTable";
import { AdvertisementFormDialog } from "./components/AdvertisementFormDialog";
import { AD_PAGE_SIZE, AD_STATUS_OPTIONS, AD_PLACEMENT_OPTIONS } from "./constants";
import type {
  Advertisement,
  CreateAdvertisementRequest,
  UpdateAdvertisementRequest,
} from "@/types";

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  isLoading,
}: {
  icon: React.ElementType;
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

export default function AdvertisementsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [placement, setPlacement] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const { data: stats, isLoading: statsLoading } = useAdStats();

  const {
    advertisements,
    meta,
    isLoading,
    createAdvertisement,
    updateAdvertisement,
    deleteAdvertisement,
    isCreating,
    isUpdating,
    isDeleting,
  } = useAdvertisements({
    page,
    limit: AD_PAGE_SIZE,
    search: search || undefined,
    status: status !== "all" ? status : undefined,
    placement: placement !== "all" ? placement : undefined,
  });

  const handleAdd = () => {
    setEditingAd(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (ad: Advertisement) => {
    setEditingAd(ad);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteTarget(id);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteAdvertisement(deleteTarget);
      setDeleteTarget(null);
    }
  };

  const handleSubmit = (data: CreateAdvertisementRequest | UpdateAdvertisementRequest) => {
    const onSuccess = () => {
      setIsDialogOpen(false);
      setEditingAd(null);
      setPage(1);
    };
    if (editingAd) {
      updateAdvertisement({ id: editingAd.id, data }, { onSuccess });
    } else {
      createAdvertisement(data as CreateAdvertisementRequest, { onSuccess });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="Advertisements"
        description="Manage banner ads displayed across the app"
        actions={
          <Button onClick={handleAdd} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            New Advertisement
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          icon={Megaphone}
          label="Total Ads"
          value={stats?.total ?? 0}
          sub={`${stats?.active ?? 0} active`}
          color="bg-blue-500"
          isLoading={statsLoading}
        />
        <StatCard
          icon={Eye}
          label="Total Impressions"
          value={(stats?.totalImpressions ?? 0).toLocaleString()}
          color="bg-purple-500"
          isLoading={statsLoading}
        />
        <StatCard
          icon={MousePointerClick}
          label="Total Clicks"
          value={(stats?.totalClicks ?? 0).toLocaleString()}
          color="bg-green-500"
          isLoading={statsLoading}
        />
        <StatCard
          icon={TrendingUp}
          label="Avg. CTR"
          value={`${stats?.ctr ?? 0}%`}
          sub="click-through rate"
          color="bg-orange-500"
          isLoading={statsLoading}
        />
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>All Advertisements</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search ads..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="h-9 w-44 pl-8 text-sm"
                />
              </div>
              <Select
                value={status}
                onValueChange={(v) => {
                  setStatus(v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-9 w-36 text-sm">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {AD_STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={placement}
                onValueChange={(v) => {
                  setPlacement(v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-9 w-40 text-sm">
                  <SelectValue placeholder="All placements" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Placements</SelectItem>
                  {AD_PLACEMENT_OPTIONS.map((opt) => (
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
          <AdvertisementsTable
            advertisements={advertisements}
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
              pageSize={AD_PAGE_SIZE}
            />
          )}
        </CardContent>
      </Card>

      <AdvertisementFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        advertisement={editingAd}
        onSubmit={handleSubmit}
        isSubmitting={isCreating || isUpdating}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete advertisement"
        description="This will permanently remove the advertisement and all its analytics. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        variant="destructive"
        isLoading={isDeleting}
      />
    </div>
  );
}
