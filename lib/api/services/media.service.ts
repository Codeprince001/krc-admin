import { apiClient } from "../client";
import { endpoints } from "../endpoints";
import type { Media } from "@/types/api/media.types";

export interface UploadMediaResponse {
  id: string;
  url: string;
  secureUrl: string;
  publicId: string;
  width?: number;
  height?: number;
  format: string;
  bytes: number;
  resourceType: string;
  thumbnailUrl?: string;
  createdAt: string;
}

export const mediaService = {
  async uploadImage(
    file: File,
    context?: string
  ): Promise<UploadMediaResponse> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "IMAGE");
    if (context) {
      formData.append("context", context);
    }

    // Use fetch directly for file uploads since apiClient uses JSON
    const accessToken = localStorage.getItem("accessToken");
    const headers: Record<string, string> = {};
    
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${endpoints.media}/upload`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorJson = await response.json().catch(() => ({
        message: response.statusText || "Failed to upload image",
      }));
      const errorMessage = errorJson?.message || errorJson?.data?.message || response.statusText || "Failed to upload image";
      throw new Error(errorMessage);
    }

    const json = await response.json();
    // Backend wraps responses in { success, data } format
    return (json?.data || json) as UploadMediaResponse;
  },

  async uploadVideo(
    file: File,
    context?: string
  ): Promise<UploadMediaResponse> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "VIDEO");
    if (context) {
      formData.append("context", context);
    }

    // Use fetch directly for file uploads since apiClient uses JSON
    const accessToken = localStorage.getItem("accessToken");
    const headers: Record<string, string> = {};
    
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${endpoints.media}/upload`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorJson = await response.json().catch(() => ({
        message: response.statusText || "Failed to upload video",
      }));
      const errorMessage = errorJson?.message || errorJson?.data?.message || response.statusText || "Failed to upload video";
      throw new Error(errorMessage);
    }

    const json = await response.json();
    // Backend wraps responses in { success, data } format
    return (json?.data || json) as UploadMediaResponse;
  },

  async getMedia(
    type?: string,
    page = 1,
    limit = 20
  ): Promise<{
    data: Media[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (type) params.append("type", type);
    
    const url = `${endpoints.media}?${params.toString()}`;
    const response = await apiClient.get<any>(url);

    // Transform backend response format { media, pagination } to { data, meta }
    if (response && typeof response === 'object') {
      if ('media' in response && 'pagination' in response) {
        return {
          data: response.media,
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

  async getMediaStats() {
    return apiClient.get<any>(`${endpoints.media}/stats`);
  },

  async deleteMedia(id: string): Promise<void> {
    return apiClient.delete<void>(`${endpoints.media}/${id}`);
  },
};

