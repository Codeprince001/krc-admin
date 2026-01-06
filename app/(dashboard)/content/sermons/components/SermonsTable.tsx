"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Video, Headphones, Play } from "lucide-react";
import { formatDate } from "@/lib/utils/format";
import type { Sermon } from "@/types";
import { SERMON_TYPES } from "../constants";
import { LoadingState } from "@/components/shared/LoadingState";
import { EmptyState } from "@/components/shared/EmptyState";

interface SermonsTableProps {
  sermons: Sermon[];
  isLoading?: boolean;
  onEdit: (sermon: Sermon) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export function SermonsTable({
  sermons,
  isLoading = false,
  onEdit,
  onDelete,
  isDeleting = false,
}: SermonsTableProps) {
  if (isLoading) {
    return <LoadingState message="Loading sermons..." />;
  }

  if (sermons.length === 0) {
    return (
      <EmptyState
        icon={Video}
        title="No sermons found"
        description="Upload your first sermon to share with your community."
      />
    );
  }

  const getCategoryLabel = (category: string) => {
    return SERMON_TYPES.find((cat) => cat.value === category)?.label || category;
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Sermon</TableHead>
            <TableHead>Speaker</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Media</TableHead>
            <TableHead>Views</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sermons.map((sermon) => (
            <TableRow key={sermon.id} className="hover:bg-muted/50">
              <TableCell>
                <div className="flex items-center gap-3">
                  {sermon.thumbnail && (
                    <img
                      src={sermon.thumbnail}
                      alt={sermon.title}
                      className="h-12 w-12 rounded object-cover"
                    />
                  )}
                  <div>
                    <div className="font-semibold">{sermon.title}</div>
                    {sermon.isFeatured && (
                      <Badge variant="outline" className="text-xs mt-1">
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-medium">{sermon.speaker}</TableCell>
              <TableCell>
                <Badge variant="outline">{getCategoryLabel(sermon.category)}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {sermon.videoUrl && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Video className="h-4 w-4" />
                      <span>{formatDuration(sermon.duration)}</span>
                    </div>
                  )}
                  {sermon.audioUrl && (
                    <Headphones className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="font-mono">
                  {sermon.viewCount || 0}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(sermon.createdAt, "PP")}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(sermon)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(sermon.id)}
                    disabled={isDeleting}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

