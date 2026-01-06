import { apiClient } from "../client";
import { endpoints } from "../endpoints";
import type {
  PrayerRequest,
  PrayerRequestsResponse,
  CreatePrayerRequestRequest,
  UpdatePrayerRequestRequest,
} from "@/types";

// Map frontend status values to backend status values
const mapStatusToBackend = (status: string): string => {
  const statusMap: Record<string, string> = {
    'PENDING': 'SUBMITTED',
    'IN_PROGRESS': 'PRAYING',
    'ANSWERED': 'ANSWERED',
    'CLOSED': 'ARCHIVED',
  };
  return statusMap[status] || status;
};

export const prayerRequestsService = {
  async getPrayerRequests(
    page = 1,
    limit = 10,
    search?: string,
    status?: string
  ): Promise<PrayerRequestsResponse> {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (search) params.append("search", search);
    if (status) params.append("status", mapStatusToBackend(status));
    const url = `${endpoints.prayerRequests}?${params.toString()}`;
    return apiClient.get<PrayerRequestsResponse>(url);
  },

  async getPrayerRequestById(id: string): Promise<PrayerRequest> {
    return apiClient.get<PrayerRequest>(
      `${endpoints.prayerRequests}/${id}`
    );
  },

  async updatePrayerRequest(
    id: string,
    data: UpdatePrayerRequestRequest
  ): Promise<PrayerRequest> {
    // Map status to backend format if present
    const updateData = {
      ...data,
      ...(data.status && { status: mapStatusToBackend(data.status) }),
    };
    return apiClient.put<PrayerRequest>(
      `${endpoints.prayerRequests}/${id}`,
      updateData
    );
  },

  async deletePrayerRequest(id: string): Promise<void> {
    return apiClient.delete<void>(`${endpoints.prayerRequests}/${id}`);
  },
};

