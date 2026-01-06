"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Trash2, Download, Eye } from "lucide-react";
import { formatDate } from "@/lib/utils/format";
import { formatFileSize } from "@/lib/utils/format";
import type { Media, MediaType } from "@/types/api/media.types";

interface MediaGridProps {
  media: Media[];
  isLoading: boolean;
  onView: (media: Media) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function MediaGrid({
  media,
  isLoading,
  onView,
  onDelete,
  isDeleting,
}: MediaGridProps) {
  const getMediaIcon = (type: MediaType) => {
    switch (type) {
      case "IMAGE":
        return "🖼️";
      case "VIDEO":
        return "🎥";
      case "AUDIO":
        return "🎵";
      case "DOCUMENT":
        return "📄";
      default:
        return "📦";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (media.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No media files found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {media.map((item) => (
        <div
          key={item.id}
          className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
        >
          {item.type === "IMAGE" && item.thumbnailUrl ? (
            <div className="aspect-video bg-muted relative">
              <img
                src={item.thumbnailUrl}
                alt={item.originalName}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-video bg-muted flex items-center justify-center text-4xl">
              {getMediaIcon(item.type)}
            </div>
          )}
          <div className="p-4 space-y-2">
            <div>
              <p className="font-medium text-sm truncate">{item.originalName}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(item.size)} • {item.type}
              </p>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{formatDate(item.createdAt, "PP")}</span>
              <span>
                {item.user.firstName || item.user.lastName
                  ? `${item.user.firstName || ""} ${item.user.lastName || ""}`.trim()
                  : "Unknown"}
              </span>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => onView(item)}
              >
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(item.url, "_blank")}
              >
                <Download className="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(item.id)}
                disabled={isDeleting}
              >
                <Trash2 className="h-3 w-3 text-destructive" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

