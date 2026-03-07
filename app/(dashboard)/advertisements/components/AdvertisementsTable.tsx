"use client";

import { ExternalLink, Pencil, Trash2, Eye, MousePointerClick, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import { format } from "date-fns";
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

export function AdvertisementsTable({
  advertisements,
  isLoading,
  onEdit,
  onDelete,
  isDeleting,
}: AdvertisementsTableProps) {
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
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <th className="px-4 py-3 text-left">Banner</th>
            <th className="px-4 py-3 text-left">Brand / Title</th>
            <th className="px-4 py-3 text-left">Placement</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Schedule</th>
            <th className="px-4 py-3 text-right">Analytics</th>
            <th className="px-4 py-3 text-right">Priority</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/30">
          {advertisements.map((ad) => (
            <tr key={ad.id} className="group transition-colors hover:bg-muted/20">
              <td className="px-4 py-3">
                <div className="relative h-12 w-20 overflow-hidden rounded-md border border-border/50 bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ad.imageUrl}
                    alt={ad.title}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='48'%3E%3Crect width='80' height='48' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-size='8'%3ENo Image%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
              </td>
              <td className="px-4 py-3">
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
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                <PlacementLabel placement={ad.placement} />
              </td>
              <td className="px-4 py-3">
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-semibold",
                    AD_STATUS_COLORS[ad.status] ?? "bg-gray-100 text-gray-700"
                  )}
                >
                  {ad.status}
                </span>
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                {ad.startDate ? (
                  <div>
                    <span className="block">
                      From: {format(new Date(ad.startDate), "MMM d, yyyy")}
                    </span>
                    {ad.endDate && (
                      <span className="block">
                        To: {format(new Date(ad.endDate), "MMM d, yyyy")}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-muted-foreground/60">No schedule</span>
                )}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex flex-col items-end gap-0.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {ad.impressionCount.toLocaleString()} imp.
                  </span>
                  <span className="flex items-center gap-1">
                    <MousePointerClick className="h-3 w-3" />
                    {ad.clickCount.toLocaleString()} clicks
                  </span>
                  {ad.impressionCount > 0 && (
                    <span className="font-medium text-blue-600">
                      {((ad.clickCount / ad.impressionCount) * 100).toFixed(1)}% CTR
                    </span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-right">
                <Badge variant="secondary">{ad.priority}</Badge>
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEdit(ad)}
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => onDelete(ad.id)}
                    disabled={isDeleting}
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
