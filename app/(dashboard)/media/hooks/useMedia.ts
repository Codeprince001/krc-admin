import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mediaService } from "@/lib/api/services/media.service";
import { toast } from "sonner";
import type { QueryMediaParams, MediaType } from "@/types/api/media.types";

export function useMedia(params: QueryMediaParams = {}) {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["media", params],
    queryFn: () => mediaService.getMedia(params.type, params.page, params.limit),
  });

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["media-stats"],
    queryFn: () => mediaService.getMediaStats(),
  });

  const deleteMediaMutation = useMutation({
    mutationFn: (id: string) => mediaService.deleteMedia(id),
    onSuccess: () => {
      toast.success("Media deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["media"] });
      queryClient.invalidateQueries({ queryKey: ["media-stats"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete media");
    },
  });

  return {
    media: data?.data || [],
    meta: data?.meta,
    stats,
    isLoading: isLoading || isLoadingStats,
    error,
    deleteMedia: deleteMediaMutation.mutate,
    isDeleting: deleteMediaMutation.isPending,
  };
}

