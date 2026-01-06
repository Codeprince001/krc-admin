import { useQuery } from "@tanstack/react-query";
import { paymentsService } from "@/lib/api/services/payments.service";
import type { QueryPaymentsParams } from "@/types/api/payments.types";

export function usePayments(params: QueryPaymentsParams = {}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["payments", params],
    queryFn: () => paymentsService.getPayments(params),
  });

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["payment-stats"],
    queryFn: () => paymentsService.getPaymentStats(),
  });

  return {
    payments: data?.data || [],
    meta: data?.meta,
    stats,
    isLoading: isLoading || isLoadingStats,
    error,
  };
}

