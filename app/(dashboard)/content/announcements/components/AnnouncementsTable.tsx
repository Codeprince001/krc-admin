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
import { Edit, Trash2, Pin, Megaphone } from "lucide-react";
import { formatDate } from "@/lib/utils/format";
import type { Announcement } from "@/types";
import { ANNOUNCEMENT_CATEGORIES } from "../constants";
import { LoadingState } from "@/components/shared/LoadingState";
import { EmptyState } from "@/components/shared/EmptyState";

interface AnnouncementsTableProps {
  announcements: Announcement[];
  isLoading?: boolean;
  onEdit: (announcement: Announcement) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export function AnnouncementsTable({
  announcements,
  isLoading = false,
  onEdit,
  onDelete,
  isDeleting = false,
}: AnnouncementsTableProps) {
  if (isLoading) {
    return <LoadingState message="Loading announcements..." />;
  }

  if (announcements.length === 0) {
    return (
      <EmptyState
        icon={Megaphone}
        title="No announcements found"
        description="Create your first announcement to keep your community informed."
      />
    );
  }

  const getCategoryLabel = (category: string) => {
    return ANNOUNCEMENT_CATEGORIES.find((cat) => cat.value === category)?.label || category;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Pinned</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {announcements.map((announcement) => (
            <TableRow key={announcement.id} className="hover:bg-muted/50">
              <TableCell>
                <div className="flex items-center gap-3">
                  {announcement.image && (
                    <img
                      src={announcement.image}
                      alt={announcement.title}
                      className="h-10 w-10 rounded object-cover"
                    />
                  )}
                  <div>
                    <div className="font-semibold">{announcement.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      {announcement.content.substring(0, 50)}...
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{getCategoryLabel(announcement.category)}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={announcement.isActive ? "default" : "secondary"}>
                  {announcement.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                {announcement.isPinned && (
                  <Pin className="h-4 w-4 text-primary" />
                )}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(announcement.createdAt, "PP")}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(announcement)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(announcement.id)}
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

