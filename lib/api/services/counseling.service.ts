import { apiClient } from "../client";
import { endpoints } from "../endpoints";
import type {
  CounselingSession,
  CounselingSessionsResponse,
  UpdateCounselingSessionRequest,
  CounselingStats,
} from "@/types";

export const counselingService = {
  async getCounselingSessions(
    page = 1,
    limit = 10,
    status?: string,
    category?: string,
    date?: string
  ): Promise<CounselingSessionsResponse> {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (status) params.append("status", status);
    if (category) params.append("category", category);
    if (date) params.append("date", date);
    const url = `${endpoints.counseling}?${params.toString()}`;
    return apiClient.get<CounselingSessionsResponse>(url);
  },

  async getCounselingSessionById(id: string): Promise<CounselingSession> {
    return apiClient.get<CounselingSession>(`${endpoints.counseling}/${id}`);
  },

  async updateCounselingSession(
    id: string,
    data: UpdateCounselingSessionRequest
  ): Promise<CounselingSession> {
    return apiClient.patch<CounselingSession>(
      `${endpoints.counseling}/${id}`,
      data
    );
  },

  async deleteCounselingSession(id: string): Promise<void> {
    return apiClient.delete<void>(`${endpoints.counseling}/${id}`);
  },

  async getCounselingStats(): Promise<CounselingStats> {
    return apiClient.get<CounselingStats>(`${endpoints.counseling}/stats`);
  },
};
