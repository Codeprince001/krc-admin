"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { formatDate, formatFileSize } from "@/lib/utils/format";
import type { Media } from "@/types/api/media.types";

interface MediaViewDialogProps {
  media: Media | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MediaViewDialog({
  media,
  open,
  onOpenChange,
}: MediaViewDialogProps) {
  if (!media) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{media.originalName}</DialogTitle>
          <DialogDescription>Media file details</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Media Preview */}
          <div className="flex items-center justify-center bg-muted rounded-lg p-8">
            {media.type === "IMAGE" ? (
              <img
                src={media.url}
                alt={media.originalName}
                className="max-w-full max-h-96 object-contain"
              />
            ) : (
              <div className="text-center">
                <div className="text-6xl mb-4">
                  {media.type === "VIDEO" ? "🎥" : media.type === "AUDIO" ? "🎵" : "📄"}
                </div>
                <p className="text-muted-foreground">Preview not available</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => window.open(media.url, "_blank")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download File
                </Button>
              </div>
            )}
          </div>

          <Separator />

          {/* Media Information */}
          <div>
            <h3 className="text-lg font-semibold mb-2">File Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Type</p>
                <Badge variant="outline" className="mt-1">
                  {media.type}
                </Badge>
              </div>
              <div>
                <p className="text-muted-foreground">Size</p>
                <p className="font-medium">{formatFileSize(media.size)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">MIME Type</p>
                <p className="font-medium">{media.mimeType}</p>
              </div>
              {media.width && media.height && (
                <div>
                  <p className="text-muted-foreground">Dimensions</p>
                  <p className="font-medium">
                    {media.width} × {media.height}
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Uploader Information */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Uploaded By</h3>
            <div className="text-sm">
              <p className="font-medium">
                {media.user.firstName || media.user.lastName
                  ? `${media.user.firstName || ""} ${media.user.lastName || ""}`.trim()
                  : "Unknown"}
              </p>
            </div>
          </div>

          {/* Timestamps */}
          <div className="text-sm text-muted-foreground">
            <p>Uploaded: {formatDate(media.createdAt, "PPp")}</p>
            <p>Last Updated: {formatDate(media.updatedAt, "PPp")}</p>
          </div>

          {/* URL */}
          <div>
            <h3 className="text-lg font-semibold mb-2">URL</h3>
            <div className="bg-muted p-2 rounded text-xs break-all">
              {media.url}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => {
                navigator.clipboard.writeText(media.url);
              }}
            >
              Copy URL
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

