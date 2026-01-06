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
import { Edit, Trash2, BookOpen, Eye } from "lucide-react";
import { formatDate } from "@/lib/utils/format";
import type { Devotional } from "@/types";
import { LoadingState } from "@/components/shared/LoadingState";
import { EmptyState } from "@/components/shared/EmptyState";

interface DevotionalsTableProps {
  devotionals: Devotional[];
  isLoading?: boolean;
  onEdit: (devotional: Devotional) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export function DevotionalsTable({
  devotionals,
  isLoading = false,
  onEdit,
  onDelete,
  isDeleting = false,
}: DevotionalsTableProps) {
  if (isLoading) {
    return <LoadingState message="Loading devotionals..." />;
  }

  if (devotionals.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="No devotionals found"
        description="Create your first devotional to inspire your community daily."
      />
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Verse</TableHead>
            <TableHead>Views</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {devotionals.map((devotional) => (
            <TableRow key={devotional.id} className="hover:bg-muted/50">
              <TableCell>
                <div className="flex items-center gap-3">
                  {devotional.image && (
                    <img
                      src={devotional.image}
                      alt={devotional.title}
                      className="h-10 w-10 rounded object-cover"
                    />
                  )}
                  <div>
                    <div className="font-semibold">{devotional.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      {devotional.bibleVerse}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-medium">{devotional.author}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(devotional.date, "PP")}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="font-mono text-xs">
                  {devotional.verseReference}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-sm">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span>{devotional.viewCount || 0}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(devotional)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(devotional.id)}
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

