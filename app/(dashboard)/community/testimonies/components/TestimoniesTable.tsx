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
import { Check, X, Trash2, User, Eye } from "lucide-react";
import { formatDate } from "@/lib/utils/format";
import type { Testimony, TestimonyStatus } from "@/types";
import { TESTIMONY_STATUSES } from "../constants";
import { LoadingState } from "@/components/shared/LoadingState";
import { EmptyState } from "@/components/shared/EmptyState";
import { useRouter } from "next/navigation";

interface TestimoniesTableProps {
  testimonies: Testimony[];
  isLoading?: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
  isApproving?: boolean;
  isRejecting?: boolean;
}

export function TestimoniesTable({
  testimonies,
  isLoading = false,
  onApprove,
  onReject,
  onDelete,
  isDeleting = false,
  isApproving = false,
  isRejecting = false,
}: TestimoniesTableProps) {
  const router = useRouter();

  if (isLoading) {
    return <LoadingState message="Loading testimonies..." />;
  }

  if (testimonies.length === 0) {
    return (
      <EmptyState
        icon={User}
        title="No testimonies found"
        description="Testimonies from your community will appear here for review."
      />
    );
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "default";
      case "PENDING":
        return "secondary";
      case "REJECTED":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusLabel = (status: string) => {
    return TESTIMONY_STATUSES.find((s) => s.value === status)?.label || status;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Testimony</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {testimonies.map((testimony) => (
            <TableRow key={testimony.id} className="hover:bg-muted/50">
              <TableCell>
                <div 
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => router.push(`/community/testimonies/${testimony.id}`)}
                >
                  {testimony.image && (
                    <img
                      src={testimony.image}
                      alt={testimony.title}
                      className="h-10 w-10 rounded object-cover"
                    />
                  )}
                  <div>
                    <div className="font-semibold hover:text-primary">
                      {testimony.title}
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      {testimony.content.substring(0, 50)}...
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {testimony.isAnonymous ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span className="text-sm">Anonymous</span>
                  </div>
                ) : testimony.user ? (
                  <div className="text-sm">
                    {testimony.user.firstName || testimony.user.lastName
                      ? `${testimony.user.firstName || ""} ${testimony.user.lastName || ""}`.trim()
                      : testimony.user.email}
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">N/A</span>
                )}
              </TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(testimony.status)}>
                  {getStatusLabel(testimony.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(testimony.createdAt, "PP")}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/community/testimonies/${testimony.id}`)}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {testimony.status === "PENDING" && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onApprove(testimony.id)}
                        disabled={isApproving}
                        className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onReject(testimony.id)}
                        disabled={isRejecting}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(testimony.id)}
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

