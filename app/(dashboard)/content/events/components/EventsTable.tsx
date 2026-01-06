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
import { Edit, Trash2, Calendar, MapPin, Users } from "lucide-react";
import { formatDate } from "@/lib/utils/format";
import type { Event } from "@/types";
import { EVENT_CATEGORIES, EVENT_STATUSES } from "../constants";
import { LoadingState } from "@/components/shared/LoadingState";
import { EmptyState } from "@/components/shared/EmptyState";

interface EventsTableProps {
  events: Event[];
  isLoading?: boolean;
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export function EventsTable({
  events,
  isLoading = false,
  onEdit,
  onDelete,
  isDeleting = false,
}: EventsTableProps) {
  if (isLoading) {
    return <LoadingState message="Loading events..." />;
  }

  if (events.length === 0) {
    return (
      <EmptyState
        icon={Calendar}
        title="No events found"
        description="Create your first event to engage with your community."
      />
    );
  }

  const getCategoryLabel = (category: string) => {
    return EVENT_CATEGORIES.find((cat) => cat.value === category)?.label || category;
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "UPCOMING":
        return "default";
      case "ONGOING":
        return "default";
      case "COMPLETED":
        return "secondary";
      case "CANCELLED":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusLabel = (status: string) => {
    return EVENT_STATUSES.find((s) => s.value === status)?.label || status;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Event</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Date & Location</TableHead>
            <TableHead>Registrations</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id} className="hover:bg-muted/50">
              <TableCell>
                <div className="flex items-center gap-3">
                  {event.image && (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-12 w-12 rounded object-cover"
                    />
                  )}
                  <div>
                    <div className="font-semibold">{event.title}</div>
                    {event.isFeatured && (
                      <Badge variant="outline" className="text-xs mt-1">
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{getCategoryLabel(event.category)}</Badge>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span>{formatDate(event.startDate, "PP")}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {event.requiresRegistration ? (
                  <div className="flex items-center gap-1 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {event.registeredCount}
                      {event.maxAttendees && ` / ${event.maxAttendees}`}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">No registration</span>
                )}
              </TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(event.status)}>
                  {getStatusLabel(event.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(event)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(event.id)}
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

