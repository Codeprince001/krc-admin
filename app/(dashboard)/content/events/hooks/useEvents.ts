import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eventsService } from "@/lib/api/services/events.service";
import { toast } from "sonner";
import type { Event, CreateEventRequest, UpdateEventRequest } from "@/types";

interface UseEventsParams {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  status?: string;
}

export function useEvents(params: UseEventsParams) {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["events", params.page, params.limit, params.search, params.category, params.status],
    queryFn: () =>
      eventsService.getEvents(
        params.page,
        params.limit,
        params.search,
        params.category,
        params.status
      ),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateEventRequest) => eventsService.createEvent(data),
    onSuccess: () => {
      toast.success("Event created successfully");
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create event");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEventRequest }) =>
      eventsService.updateEvent(id, data),
    onSuccess: () => {
      toast.success("Event updated successfully");
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update event");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => eventsService.deleteEvent(id),
    onSuccess: () => {
      toast.success("Event deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete event");
    },
  });

  return {
    events: data?.data || [],
    meta: data?.meta,
    isLoading,
    error,
    refetch,
    createEvent: createMutation.mutate,
    updateEvent: updateMutation.mutate,
    deleteEvent: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

