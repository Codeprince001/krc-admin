import { apiClient } from "../client";
import { endpoints } from "../endpoints";
import type {
  Testimony,
  TestimoniesResponse,
  CreateTestimonyRequest,
  UpdateTestimonyRequest,
} from "@/types";

export const testimoniesService = {
  async getTestimonies(
    page = 1,
    limit = 10,
    search?: string,
    status?: string
  ): Promise<TestimoniesResponse> {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (search) params.append("search", search);
    if (status) params.append("status", status);
    const url = `${endpoints.testimonies}?${params.toString()}`;
    return apiClient.get<TestimoniesResponse>(url);
  },

  async getTestimonyById(id: string): Promise<Testimony> {
    return apiClient.get<Testimony>(`${endpoints.testimonies}/${id}`);
  },

  async createTestimony(data: CreateTestimonyRequest): Promise<Testimony> {
    const response = await apiClient.post<any>(endpoints.testimonies, data);
    return (response as any).testimony || response;
  },

  async updateTestimony(
    id: string,
    data: UpdateTestimonyRequest
  ): Promise<Testimony> {
    return apiClient.put<Testimony>(`${endpoints.testimonies}/${id}`, data);
  },

  async deleteTestimony(id: string): Promise<void> {
    return apiClient.delete<void>(`${endpoints.testimonies}/${id}`);
  },
};

