import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { advertisementsService } from "@/lib/api/services/advertisements.service";
import { toast } from "sonner";
import type {
  CreateAdvertisementRequest,
  UpdateAdvertisementRequest,
} from "@/types";

interface UseAdvertisementsParams {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  placement?: string;
}

export function useAdvertisements(params: UseAdvertisementsParams) {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["advertisements", params.page, params.limit, params.search, params.status, params.placement],
    queryFn: () =>
      advertisementsService.getAdvertisements(
        params.page,
        params.limit,
        params.search,
        params.status,
        params.placement
      ),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateAdvertisementRequest) =>
      advertisementsService.createAdvertisement(data),
    onSuccess: async () => {
      toast.success("Advertisement created successfully");
      await queryClient.refetchQueries({ queryKey: ["advertisements"] });
      await queryClient.refetchQueries({ queryKey: ["ad-stats"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create advertisement");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAdvertisementRequest }) =>
      advertisementsService.updateAdvertisement(id, data),
    onSuccess: async () => {
      toast.success("Advertisement updated successfully");
      await queryClient.refetchQueries({ queryKey: ["advertisements"] });
      await queryClient.refetchQueries({ queryKey: ["ad-stats"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update advertisement");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => advertisementsService.deleteAdvertisement(id),
    onSuccess: async () => {
      toast.success("Advertisement deleted successfully");
      await queryClient.refetchQueries({ queryKey: ["advertisements"] });
      await queryClient.refetchQueries({ queryKey: ["ad-stats"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete advertisement");
    },
  });

  return {
    advertisements: data?.data || [],
    meta: data?.meta,
    isLoading,
    error,
    refetch,
    createAdvertisement: createMutation.mutate,
    updateAdvertisement: updateMutation.mutate,
    deleteAdvertisement: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

export function useAdStats() {
  return useQuery({
    queryKey: ["ad-stats"],
    queryFn: () => advertisementsService.getStats(),
  });
}
