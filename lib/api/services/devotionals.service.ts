import { apiClient } from "../client";
import { endpoints } from "../endpoints";
import type {
  Devotional,
  DevotionalsResponse,
  CreateDevotionalRequest,
  UpdateDevotionalRequest,
} from "@/types";

export const devotionalsService = {
  async getDevotionals(page = 1, limit = 10, search?: string): Promise<DevotionalsResponse> {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (search) params.append("search", search);
    const url = `${endpoints.devotionals}?${params.toString()}`;
    const response = await apiClient.get<any>(url);
    
    // Transform backend response to frontend format
    // Backend returns: { devotionals: [...], pagination: {...} }
    // Frontend expects: { data: [...], meta: {...} }
    const devotionals = (response.devotionals || response.data || []).map((devotional: any) => ({
      ...devotional,
      image: devotional.imageUrl || devotional.image,
      bibleVerse: devotional.scripture || devotional.bibleVerse || "",
      verseReference: devotional.scripture || devotional.verseReference || "",
    }));
    
    return {
      data: devotionals,
      meta: response.pagination || response.meta,
    };
  },

  async getDevotionalById(id: string): Promise<Devotional> {
    return apiClient.get<Devotional>(`${endpoints.devotionals}/${id}`);
  },

  async createDevotional(data: CreateDevotionalRequest): Promise<Devotional> {
    return apiClient.post<Devotional>(endpoints.devotionals, data);
  },

  async updateDevotional(id: string, data: UpdateDevotionalRequest): Promise<Devotional> {
    return apiClient.put<Devotional>(`${endpoints.devotionals}/${id}`, data);
  },

  async deleteDevotional(id: string): Promise<void> {
    return apiClient.delete<void>(`${endpoints.devotionals}/${id}`);
  },
};

