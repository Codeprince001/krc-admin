import { apiClient } from "../client";
import { endpoints } from "../endpoints";
import type {
  Giving,
  GivingResponse,
  GivingStats,
  QueryGivingParams,
} from "@/types/api/giving.types";

export const givingService = {
  async getGiving(params: QueryGivingParams = {}): Promise<GivingResponse> {
    const { page = 1, limit = 10, category, startDate, endDate, search } = params;
    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());
    if (category) queryParams.append("category", category);
    if (startDate) queryParams.append("startDate", startDate);
    if (endDate) queryParams.append("endDate", endDate);
    if (search) queryParams.append("search", search);

    const url = `${endpoints.giving}?${queryParams.toString()}`;
    const response = await apiClient.get<any>(url);

    // Transform backend response format { records, pagination } to { data, meta }
    if (response && typeof response === 'object') {
      if ('records' in response && 'pagination' in response) {
        return {
          data: response.records,
          meta: {
            page: response.pagination.page,
            limit: response.pagination.limit,
            total: response.pagination.total,
            totalPages: response.pagination.totalPages,
          },
        };
      }
      if ('data' in response && 'meta' in response) {
        return response;
      }
    }

    return response;
  },

  async getGivingStats(params: QueryGivingParams = {}): Promise<GivingStats> {
    const queryParams = new URLSearchParams();
    if (params.category) queryParams.append("category", params.category);
    if (params.startDate) queryParams.append("startDate", params.startDate);
    if (params.endDate) queryParams.append("endDate", params.endDate);

    const url = `${endpoints.giving}/stats${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<GivingStats>(url);
  },

  async deleteGiving(id: string): Promise<void> {
    return apiClient.delete<void>(`${endpoints.giving}/${id}`);
  },
};
