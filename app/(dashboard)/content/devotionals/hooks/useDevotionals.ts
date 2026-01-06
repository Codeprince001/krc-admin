import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { devotionalsService } from "@/lib/api/services/devotionals.service";
import { toast } from "sonner";
import type { Devotional, CreateDevotionalRequest, UpdateDevotionalRequest } from "@/types";

interface UseDevotionalsParams {
  page: number;
  limit: number;
  search?: string;
}

export function useDevotionals(params: UseDevotionalsParams) {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["devotionals", params.page, params.limit, params.search],
    queryFn: () =>
      devotionalsService.getDevotionals(
        params.page,
        params.limit,
        params.search
      ),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateDevotionalRequest) =>
      devotionalsService.createDevotional(data),
    onSuccess: () => {
      toast.success("Devotional created successfully");
      queryClient.invalidateQueries({ queryKey: ["devotionals"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create devotional");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDevotionalRequest }) =>
      devotionalsService.updateDevotional(id, data),
    onSuccess: () => {
      toast.success("Devotional updated successfully");
      queryClient.invalidateQueries({ queryKey: ["devotionals"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update devotional");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => devotionalsService.deleteDevotional(id),
    onSuccess: () => {
      toast.success("Devotional deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["devotionals"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete devotional");
    },
  });

  return {
    devotionals: data?.data || [],
    meta: data?.meta,
    isLoading,
    error,
    refetch,
    createDevotional: createMutation.mutate,
    updateDevotional: updateMutation.mutate,
    deleteDevotional: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

