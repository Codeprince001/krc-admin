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
    onSuccess: async () => {
      toast.success("Event created successfully");
      await queryClient.refetchQueries({ queryKey: ["events"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create event");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEventRequest }) =>
      eventsService.updateEvent(id, data),
    onSuccess: async () => {
      toast.success("Event updated successfully");
      await queryClient.refetchQueries({ queryKey: ["events"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update event");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => eventsService.deleteEvent(id),
    onMutate: async (id: string) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["events"] });

      // Snapshot the previous value
      const previousEvents = queryClient.getQueryData(["events", params.page, params.limit, params.search, params.category, params.status]);

      // Optimistically update to the new value
      queryClient.setQueryData(
        ["events", params.page, params.limit, params.search, params.category, params.status],
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((event: Event) => event.id !== id),
            meta: {
              ...old.meta,
              total: old.meta.total - 1,
            },
          };
        }
      );

      // Return context with the previous value
      return { previousEvents };
    },
    onSuccess: () => {
      toast.success("Event deleted successfully");
    },
    onError: (error: Error, id, context: any) => {
      toast.error(error.message || "Failed to delete event");
      // Rollback to the previous value if mutation fails
      if (context?.previousEvents) {
        queryClient.setQueryData(
          ["events", params.page, params.limit, params.search, params.category, params.status],
          context.previousEvents
        );
      }
    },
    onSettled: async () => {
      // Always refetch after error or success to ensure we have the latest data
      await queryClient.refetchQueries({ queryKey: ["events"] });
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

