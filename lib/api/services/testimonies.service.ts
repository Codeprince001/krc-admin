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

    // Route to the correct endpoint based on status filter
    let endpoint = `${endpoints.testimonies}/admin/all`;
    
    if (status && status !== "all") {
      if (status === "PENDING") {
        endpoint = `${endpoints.testimonies}/admin/pending`;
      } else if (status === "APPROVED") {
        endpoint = `${endpoints.testimonies}/admin/approved`;
      } else if (status === "REJECTED") {
        endpoint = `${endpoints.testimonies}/admin/rejected`;
      }
    }
    // For "all" or undefined status, use /admin/all endpoint

    const url = `${endpoint}?${params.toString()}`;
    const response = await apiClient.get<any>(url);

    // Backend returns { success, data: { testimonies: [...], pagination: {...} }, message }
    // Transform to frontend expected shape: { data: [...], meta: {...} }
    if (response && typeof response === 'object') {
      if (Array.isArray(response.testimonies) || response.testimonies) {
        return {
          data: response.testimonies || [],
          meta: response.pagination || response.meta || { total: 0, page, limit, totalPages: 0 },
        } as TestimoniesResponse;
      }

      // Fallback: if response already matches expected shape
      if (Array.isArray(response.data) || response.meta) {
        return response as TestimoniesResponse;
      }
    }

    return { data: [], meta: { total: 0, page, limit, totalPages: 0 } } as TestimoniesResponse;
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
    return apiClient.patch<Testimony>(`${endpoints.testimonies}/${id}`, data);
  },

  async deleteTestimony(id: string): Promise<void> {
    return apiClient.delete<void>(`${endpoints.testimonies}/${id}`);
  },
};

