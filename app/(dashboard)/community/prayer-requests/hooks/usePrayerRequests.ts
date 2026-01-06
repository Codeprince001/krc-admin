import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { prayerRequestsService } from "@/lib/api/services/prayer-requests.service";
import { toast } from "sonner";
import type {
  PrayerRequest,
  UpdatePrayerRequestRequest,
} from "@/types";

interface UsePrayerRequestsParams {
  page: number;
  limit: number;
  search?: string;
  status?: string;
}

export function usePrayerRequests(params: UsePrayerRequestsParams) {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["prayer-requests", params.page, params.limit, params.search, params.status],
    queryFn: () =>
      prayerRequestsService.getPrayerRequests(
        params.page,
        params.limit,
        params.search,
        params.status
      ),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePrayerRequestRequest }) =>
      prayerRequestsService.updatePrayerRequest(id, data),
    onSuccess: () => {
      toast.success("Prayer request updated successfully");
      queryClient.invalidateQueries({ queryKey: ["prayer-requests"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update prayer request");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => prayerRequestsService.deletePrayerRequest(id),
    onSuccess: () => {
      toast.success("Prayer request deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["prayer-requests"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete prayer request");
    },
  });

  return {
    prayerRequests: data?.data || [],
    meta: data?.meta,
    isLoading,
    error,
    refetch,
    updatePrayerRequest: updateMutation.mutate,
    deletePrayerRequest: deleteMutation.mutate,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

