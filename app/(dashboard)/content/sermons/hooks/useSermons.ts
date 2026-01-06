import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sermonsService } from "@/lib/api/services/sermons.service";
import { toast } from "sonner";
import type { Sermon, CreateSermonRequest, UpdateSermonRequest } from "@/types";

interface UseSermonsParams {
  page: number;
  limit: number;
  search?: string;
  category?: string;
}

export function useSermons(params: UseSermonsParams) {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["sermons", params.page, params.limit, params.search, params.category],
    queryFn: () =>
      sermonsService.getSermons(
        params.page,
        params.limit,
        params.search,
        params.category
      ),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateSermonRequest) => sermonsService.createSermon(data),
    onSuccess: () => {
      toast.success("Sermon created successfully");
      queryClient.invalidateQueries({ queryKey: ["sermons"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create sermon");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSermonRequest }) =>
      sermonsService.updateSermon(id, data),
    onSuccess: () => {
      toast.success("Sermon updated successfully");
      queryClient.invalidateQueries({ queryKey: ["sermons"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update sermon");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => sermonsService.deleteSermon(id),
    onSuccess: () => {
      toast.success("Sermon deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["sermons"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete sermon");
    },
  });

  return {
    sermons: data?.data || [],
    meta: data?.meta,
    isLoading,
    error,
    refetch,
    createSermon: createMutation.mutate,
    updateSermon: updateMutation.mutate,
    deleteSermon: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

