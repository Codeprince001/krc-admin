import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { inAppPopupsService } from "@/lib/api/services/in-app-popups.service";
import type { CreateInAppPopupRequest, UpdateInAppPopupRequest } from "@/types";

interface UseInAppPopupsParams {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  context?: string;
}

export function useInAppPopups(params: UseInAppPopupsParams) {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      "in-app-popups",
      params.page,
      params.limit,
      params.search,
      params.status,
      params.context,
    ],
    queryFn: () =>
      inAppPopupsService.getInAppPopups(
        params.page,
        params.limit,
        params.search,
        params.status,
        params.context
      ),
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateInAppPopupRequest) =>
      inAppPopupsService.createInAppPopup(payload),
    onSuccess: async () => {
      toast.success("In-app popup created successfully");
      await queryClient.refetchQueries({ queryKey: ["in-app-popups"] });
      await queryClient.refetchQueries({ queryKey: ["in-app-popup-stats"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create in-app popup");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInAppPopupRequest }) =>
      inAppPopupsService.updateInAppPopup(id, data),
    onSuccess: async () => {
      toast.success("In-app popup updated successfully");
      await queryClient.refetchQueries({ queryKey: ["in-app-popups"] });
      await queryClient.refetchQueries({ queryKey: ["in-app-popup-stats"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update in-app popup");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => inAppPopupsService.deleteInAppPopup(id),
    onSuccess: async () => {
      toast.success("In-app popup deleted successfully");
      await queryClient.refetchQueries({ queryKey: ["in-app-popups"] });
      await queryClient.refetchQueries({ queryKey: ["in-app-popup-stats"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete in-app popup");
    },
  });

  return {
    popups: data?.data || [],
    meta: data?.meta,
    isLoading,
    error,
    refetch,
    createPopup: createMutation.mutate,
    updatePopup: updateMutation.mutate,
    deletePopup: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

export function useInAppPopupStats() {
  return useQuery({
    queryKey: ["in-app-popup-stats"],
    queryFn: () => inAppPopupsService.getStats(),
  });
}
