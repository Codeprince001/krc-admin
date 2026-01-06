import { apiClient } from "../client";
import { endpoints } from "../endpoints";
import type {
  Sermon,
  SermonsResponse,
  CreateSermonRequest,
  UpdateSermonRequest,
} from "@/types";

export const sermonsService = {
  async getSermons(
    page = 1,
    limit = 10,
    search?: string,
    category?: string
  ): Promise<SermonsResponse> {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (search) params.append("search", search);
    if (category) params.append("category", category);
    const url = `${endpoints.sermons}?${params.toString()}`;
    return apiClient.get<SermonsResponse>(url);
  },

  async getSermonById(id: string): Promise<Sermon> {
    return apiClient.get<Sermon>(`${endpoints.sermons}/${id}`);
  },

  async createSermon(data: CreateSermonRequest): Promise<Sermon> {
    return apiClient.post<Sermon>(endpoints.sermons, data);
  },

  async updateSermon(id: string, data: UpdateSermonRequest): Promise<Sermon> {
    return apiClient.patch<Sermon>(`${endpoints.sermons}/${id}`, data);
  },

  async deleteSermon(id: string): Promise<void> {
    return apiClient.delete<void>(`${endpoints.sermons}/${id}`);
  },
};

