import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { testimoniesService } from "@/lib/api/services/testimonies.service";
import { toast } from "sonner";
import type {
  Testimony,
  UpdateTestimonyRequest,
  TestimonyStatus,
} from "@/types";

interface UseTestimoniesParams {
  page: number;
  limit: number;
  search?: string;
  status?: string;
}

export function useTestimonies(params: UseTestimoniesParams) {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["testimonies", params.page, params.limit, params.search, params.status],
    queryFn: () =>
      testimoniesService.getTestimonies(
        params.page,
        params.limit,
        params.search,
        params.status
      ),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTestimonyRequest }) =>
      testimoniesService.updateTestimony(id, data),
    onSuccess: () => {
      toast.success("Testimony updated successfully");
      queryClient.invalidateQueries({ queryKey: ["testimonies"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update testimony");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => testimoniesService.deleteTestimony(id),
    onSuccess: () => {
      toast.success("Testimony deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["testimonies"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete testimony");
    },
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) =>
      testimoniesService.updateTestimony(id, { status: "APPROVED" }),
    onSuccess: () => {
      toast.success("Testimony approved");
      queryClient.invalidateQueries({ queryKey: ["testimonies"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to approve testimony");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) =>
      testimoniesService.updateTestimony(id, { status: "REJECTED" }),
    onSuccess: () => {
      toast.success("Testimony rejected");
      queryClient.invalidateQueries({ queryKey: ["testimonies"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to reject testimony");
    },
  });

  return {
    testimonies: data?.data || [],
    meta: data?.meta,
    isLoading,
    error,
    refetch,
    updateTestimony: updateMutation.mutate,
    deleteTestimony: deleteMutation.mutate,
    approveTestimony: approveMutation.mutate,
    rejectTestimony: rejectMutation.mutate,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isApproving: approveMutation.isPending,
    isRejecting: rejectMutation.isPending,
  };
}

