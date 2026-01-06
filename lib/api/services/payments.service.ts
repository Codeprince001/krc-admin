import { apiClient } from "../client";
import { endpoints } from "../endpoints";
import type {
  Payment,
  PaymentsResponse,
  PaymentStats,
  QueryPaymentsParams,
} from "@/types/api/payments.types";

export const paymentsService = {
  async getPayments(params: QueryPaymentsParams = {}): Promise<PaymentsResponse> {
    // Note: Backend doesn't have admin findAll endpoint yet
    // Using stats endpoint for now - may need to add findAll endpoint
    const { page = 1, limit = 10, status, paymentMethod, search } = params;
    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());
    if (status) queryParams.append("status", status);
    if (paymentMethod) queryParams.append("paymentMethod", paymentMethod);
    if (search) queryParams.append("search", search);

    // For now, we'll use stats endpoint which returns recent payments
    // TODO: Add admin findAll endpoint to backend
    const stats = await apiClient.get<PaymentStats>(`${endpoints.payments}/stats`);
    
    // Transform stats response to match PaymentsResponse format
    return {
      data: stats.recentPayments || [],
      meta: {
        page: 1,
        limit: 10,
        total: stats.totalPayments || 0,
        totalPages: Math.ceil((stats.totalPayments || 0) / limit),
      },
    };
  },

  async getPaymentStats(): Promise<PaymentStats> {
    return apiClient.get<PaymentStats>(`${endpoints.payments}/stats`);
  },
};
