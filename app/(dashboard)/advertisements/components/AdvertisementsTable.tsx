"use client";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { ExternalLink, Pencil, Trash2, Eye, MousePointerClick, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoadingState } from "@/components/shared/LoadingState";
import { EmptyState } from "@/components/shared/EmptyState";
import { AD_STATUS_COLORS, AD_PLACEMENT_OPTIONS } from "../constants";
import type { Advertisement } from "@/types";

interface AdvertisementsTableProps {
  advertisements: Advertisement[];
  isLoading: boolean;
  onEdit: (ad: Advertisement) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

function PlacementLabel({ placement }: { placement: string }) {
  const option = AD_PLACEMENT_OPTIONS.find((o) => o.value === placement);
  return <span>{option?.label ?? placement}</span>;
}

const columnHelper = createColumnHelper<Advertisement>();

export function AdvertisementsTable({
  advertisements,
  isLoading,
  onEdit,
  onDelete,
  isDeleting,
}: AdvertisementsTableProps) {
  const columns = [
    columnHelper.accessor("imageUrl", {
      header: "Banner",
      cell: ({ row }) => (
        <div className="relative h-12 w-20 overflow-hidden rounded-md border border-border/50 bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={row.original.imageUrl}
            alt={row.original.title}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='48'%3E%3Crect width='80' height='48' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-size='8'%3ENo Image%3C/text%3E%3C/svg%3E";
            }}
          />
        </div>
      ),
    }),
    columnHelper.accessor((row) => `${row.brandName} ${row.title}`, {
      id: "brandTitle",
      header: "Brand / Title",
      cell: ({ row }) => {
        const ad = row.original;
        return (
          <div>
            <p className="font-semibold text-foreground">{ad.brandName}</p>
            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{ad.title}</p>
            <a
              href={ad.targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-0.5 inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
              <span className="max-w-[140px] truncate">{ad.targetUrl}</span>
            </a>
          </div>
        );
      },
    }),
    columnHelper.accessor("placement", {
      header: "Placement",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">
          <PlacementLabel placement={getValue()} />
        </span>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ getValue }) => (
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-semibold",
            AD_STATUS_COLORS[getValue()] ?? "bg-gray-100 text-gray-700"
          )}
        >
          {getValue()}
        </span>
      ),
    }),
    columnHelper.accessor((row) => [row.startDate, row.endDate], {
      id: "schedule",
      header: "Schedule",
      cell: ({ row }) => {
        const ad = row.original;
        return ad.startDate ? (
          <div className="text-xs text-muted-foreground">
            <span className="block">From: {format(new Date(ad.startDate), "MMM d, yyyy")}</span>
            {ad.endDate && (
              <span className="block">To: {format(new Date(ad.endDate), "MMM d, yyyy")}</span>
            )}
          </div>
        ) : (
          <span className="text-muted-foreground/60">No schedule</span>
        );
      },
    }),
    columnHelper.accessor((row) => [row.impressionCount, row.clickCount], {
      id: "analytics",
      header: "Analytics",
      cell: ({ row }) => {
        const ad = row.original;
        const ctr =
          ad.impressionCount > 0
            ? ((ad.clickCount / ad.impressionCount) * 100).toFixed(1)
            : null;
        return (
          <div className="flex flex-col items-end gap-0.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {ad.impressionCount.toLocaleString()} imp.
            </span>
            <span className="flex items-center gap-1">
              <MousePointerClick className="h-3 w-3" />
              {ad.clickCount.toLocaleString()} clicks
            </span>
            {ctr && (
              <span className="font-medium text-blue-600">{ctr}% CTR</span>
            )}
          </div>
        );
      },
    }),
    columnHelper.accessor("priority", {
      header: "Priority",
      cell: ({ getValue }) => <Badge variant="secondary">{getValue()}</Badge>,
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onEdit(row.original)}
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onDelete(row.original.id)}
            disabled={isDeleting}
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: advertisements,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return <LoadingState message="Loading advertisements..." />;
  }

  if (!advertisements.length) {
    return (
      <EmptyState
        icon={Megaphone}
        title="No advertisements found"
        description="Create your first ad banner to get started."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border/50">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-border/50 bg-muted/40">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={cn(
                    "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                    header.id === "analytics" ||
                    header.id === "priority" ||
                    header.id === "actions"
                      ? "text-right"
                      : "text-left"
                  )}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              className="group transition-colors hover:bg-muted/20 border-border/30"
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className={cn(
                    cell.column.id === "analytics" ||
                    cell.column.id === "priority" ||
                    cell.column.id === "actions"
                      ? "text-right"
                      : "text-left"
                  )}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
