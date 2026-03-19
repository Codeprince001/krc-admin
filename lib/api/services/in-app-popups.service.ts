import { apiClient } from "../client";
import { endpoints } from "../endpoints";
import type {
  CreateInAppPopupRequest,
  InAppPopup,
  InAppPopupAnalytics,
  InAppPopupsResponse,
  InAppPopupStats,
  UpdateInAppPopupRequest,
} from "@/types";

export const inAppPopupsService = {
  async getInAppPopups(
    page = 1,
    limit = 10,
    search?: string,
    status?: string,
    context?: string
  ): Promise<InAppPopupsResponse> {
    const params = new URLSearchParams();
    params.append("page", String(page));
    params.append("limit", String(limit));
    if (search) params.append("search", search);
    if (status && status !== "all") params.append("status", status);
    if (context && context !== "all") params.append("context", context);

    return apiClient.get<InAppPopupsResponse>(`${endpoints.inAppPopups}?${params.toString()}`);
  },

  async getInAppPopupById(id: string): Promise<InAppPopup> {
    return apiClient.get<InAppPopup>(`${endpoints.inAppPopups}/${id}`);
  },

  async createInAppPopup(data: CreateInAppPopupRequest): Promise<InAppPopup> {
    return apiClient.post<InAppPopup>(endpoints.inAppPopups, data);
  },

  async updateInAppPopup(id: string, data: UpdateInAppPopupRequest): Promise<InAppPopup> {
    return apiClient.patch<InAppPopup>(`${endpoints.inAppPopups}/${id}`, data);
  },

  async deleteInAppPopup(id: string): Promise<void> {
    return apiClient.delete<void>(`${endpoints.inAppPopups}/${id}`);
  },

  async getStats(): Promise<InAppPopupStats> {
    return apiClient.get<InAppPopupStats>(`${endpoints.inAppPopups}/stats`);
  },

  async getAnalytics(id: string, days = 30): Promise<InAppPopupAnalytics> {
    return apiClient.get<InAppPopupAnalytics>(
      `${endpoints.inAppPopups}/${id}/analytics?days=${days}`
    );
  },
};
