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
import { Edit, Trash2, Lightbulb, Share2 } from "lucide-react";
import { formatDate } from "@/lib/utils/format";
import { stripHtml } from "@/lib/utils/stripHtml";
import { ResponsiveTableWrapper } from "@/components/shared/ResponsiveTableWrapper";
import type { WordOfWisdom } from "@/types";
import { LoadingState } from "@/components/shared/LoadingState";
import { EmptyState } from "@/components/shared/EmptyState";

interface WordsOfWisdomTableProps {
  wordsOfWisdom: WordOfWisdom[];
  isLoading?: boolean;
  onEdit: (wordOfWisdom: WordOfWisdom) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export function WordsOfWisdomTable({
  wordsOfWisdom,
  isLoading = false,
  onEdit,
  onDelete,
  isDeleting = false,
}: WordsOfWisdomTableProps) {
  if (isLoading) {
    return <LoadingState message="Loading words of wisdom..." />;
  }

  if (wordsOfWisdom.length === 0) {
    return (
      <EmptyState
        icon={Lightbulb}
        title="No words of wisdom found"
        description="Create your first word of wisdom to inspire your community."
      />
    );
  }

  return (
    <ResponsiveTableWrapper>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[300px]">Title</TableHead>
            <TableHead className="min-w-[120px]">Category</TableHead>
            <TableHead className="min-w-[120px]">Week Of</TableHead>
            <TableHead className="min-w-[150px]">Scripture</TableHead>
            <TableHead className="min-w-[80px]">Shares</TableHead>
            <TableHead className="text-right min-w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {wordsOfWisdom.map((word) => (
            <TableRow key={word.id} className="hover:bg-muted/50">
              <TableCell>
                <div className="flex items-center gap-3">
                  {word.imageUrl && (
                    <img
                      src={word.imageUrl}
                      alt={word.title}
                      className="h-10 w-10 rounded object-cover"
                    />
                  )}
                  <div>
                    <div className="font-semibold">{word.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      {stripHtml(word.content).substring(0, 60)}...
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {word.category ? (
                  <Badge variant="outline">{word.category}</Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(word.weekOf, "PP")}
              </TableCell>
              <TableCell>
                {word.scripture ? (
                  <Badge variant="outline" className="font-mono text-xs">
                    {word.scripture}
                  </Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-sm">
                  <Share2 className="h-4 w-4 text-muted-foreground" />
                  <span>{word.shareCount || 0}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(word)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(word.id)}
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
    </ResponsiveTableWrapper>
  );
}

