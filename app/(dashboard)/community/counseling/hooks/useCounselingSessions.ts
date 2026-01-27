import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { counselingService } from "@/lib/api/services/counseling.service";
import { toast } from "sonner";
import type {
  CounselingSession,
  UpdateCounselingSessionRequest,
} from "@/types";

interface UseCounselingSessionsParams {
  page: number;
  limit: number;
  status?: string;
  category?: string;
  date?: string;
}

export function useCounselingSessions(params: UseCounselingSessionsParams) {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      "counseling-sessions",
      params.page,
      params.limit,
      params.status,
      params.category,
      params.date,
    ],
    queryFn: () =>
      counselingService.getCounselingSessions(
        params.page,
        params.limit,
        params.status,
        params.category,
        params.date
      ),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCounselingSessionRequest }) =>
      counselingService.updateCounselingSession(id, data),
    onSuccess: () => {
      toast.success("Counseling session updated successfully");
      queryClient.invalidateQueries({ queryKey: ["counseling-sessions"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update counseling session");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => counselingService.deleteCounselingSession(id),
    onSuccess: () => {
      toast.success("Counseling session deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["counseling-sessions"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete counseling session");
    },
  });

  return {
    sessions: data?.sessions || [],
    pagination: data?.pagination,
    isLoading,
    error,
    refetch,
    updateSession: updateMutation.mutate,
    deleteSession: deleteMutation.mutate,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
