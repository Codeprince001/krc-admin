import { apiClient } from "../client";
import { endpoints } from "../endpoints";
import type {
  Advertisement,
  AdvertisementsResponse,
  CreateAdvertisementRequest,
  UpdateAdvertisementRequest,
  AdStats,
  AdAnalytics,
} from "@/types";

export const advertisementsService = {
  async getAdvertisements(
    page = 1,
    limit = 10,
    search?: string,
    status?: string,
    placement?: string
  ): Promise<AdvertisementsResponse> {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (search) params.append("search", search);
    if (status && status !== "all") params.append("status", status);
    if (placement && placement !== "all") params.append("placement", placement);

    const url = `${endpoints.advertisements}?${params.toString()}`;
    return apiClient.get<AdvertisementsResponse>(url);
  },

  async getAdvertisementById(id: string): Promise<Advertisement> {
    return apiClient.get<Advertisement>(`${endpoints.advertisements}/${id}`);
  },

  async createAdvertisement(data: CreateAdvertisementRequest): Promise<Advertisement> {
    return apiClient.post<Advertisement>(endpoints.advertisements, data);
  },

  async updateAdvertisement(
    id: string,
    data: UpdateAdvertisementRequest
  ): Promise<Advertisement> {
    return apiClient.patch<Advertisement>(`${endpoints.advertisements}/${id}`, data);
  },

  async deleteAdvertisement(id: string): Promise<void> {
    return apiClient.delete<void>(`${endpoints.advertisements}/${id}`);
  },

  async getStats(): Promise<AdStats> {
    return apiClient.get<AdStats>(`${endpoints.advertisements}/stats`);
  },

  async getAnalytics(id: string, days = 30): Promise<AdAnalytics> {
    return apiClient.get<AdAnalytics>(
      `${endpoints.advertisements}/${id}/analytics?days=${days}`
    );
  },
};
