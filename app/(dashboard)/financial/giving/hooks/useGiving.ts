import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { givingService } from "@/lib/api/services/giving.service";
import { toast } from "sonner";
import type { QueryGivingParams } from "@/types/api/giving.types";

export function useGiving(params: QueryGivingParams = {}) {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["giving", params],
    queryFn: () => givingService.getGiving(params),
  });

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["giving-stats", params],
    queryFn: () => givingService.getGivingStats(params),
  });

  const deleteGivingMutation = useMutation({
    mutationFn: (id: string) => givingService.deleteGiving(id),
    onSuccess: () => {
      toast.success("Giving record deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["giving"] });
      queryClient.invalidateQueries({ queryKey: ["giving-stats"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete giving record");
    },
  });

  return {
    giving: data?.data || [],
    meta: data?.meta,
    stats,
    isLoading: isLoading || isLoadingStats,
    error,
    deleteGiving: deleteGivingMutation.mutate,
    isDeleting: deleteGivingMutation.isPending,
  };
}

