import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { announcementsService } from "@/lib/api/services/announcements.service";
import { toast } from "sonner";
import type { Announcement, CreateAnnouncementRequest, UpdateAnnouncementRequest } from "@/types";

interface UseAnnouncementsParams {
  page: number;
  limit: number;
  search?: string;
  category?: string;
}

export function useAnnouncements(params: UseAnnouncementsParams) {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["announcements", params.page, params.limit, params.search],
    queryFn: () =>
      announcementsService.getAnnouncements(
        params.page,
        params.limit,
        params.search
      ),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateAnnouncementRequest) =>
      announcementsService.createAnnouncement(data),
    onSuccess: () => {
      toast.success("Announcement created successfully");
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create announcement");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAnnouncementRequest }) =>
      announcementsService.updateAnnouncement(id, data),
    onSuccess: () => {
      toast.success("Announcement updated successfully");
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update announcement");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => announcementsService.deleteAnnouncement(id),
    onSuccess: () => {
      toast.success("Announcement deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete announcement");
    },
  });

  return {
    announcements: data?.data || [],
    meta: data?.meta,
    isLoading,
    error,
    refetch,
    createAnnouncement: createMutation.mutate,
    updateAnnouncement: updateMutation.mutate,
    deleteAnnouncement: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

