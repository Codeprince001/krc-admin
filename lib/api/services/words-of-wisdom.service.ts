import { apiClient } from "../client";
import { endpoints } from "../endpoints";
import type {
  WordOfWisdom,
  WordsOfWisdomResponse,
  CreateWordOfWisdomRequest,
  UpdateWordOfWisdomRequest,
} from "@/types";

export const wordsOfWisdomService = {
  async getWordsOfWisdom(
    page = 1,
    limit = 10,
    title?: string,
    category?: string,
    weekOf?: string
  ): Promise<WordsOfWisdomResponse> {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (title) params.append("title", title);
    if (category) params.append("category", category);
    if (weekOf) params.append("weekOf", weekOf);
    const url = `${endpoints.wordsOfWisdom}?${params.toString()}`;
    return apiClient.get<WordsOfWisdomResponse>(url);
  },

  async getWordOfWisdomById(id: string): Promise<WordOfWisdom> {
    return apiClient.get<WordOfWisdom>(`${endpoints.wordsOfWisdom}/${id}`);
  },

  async getCurrentWeek(): Promise<WordOfWisdom> {
    return apiClient.get<WordOfWisdom>(`${endpoints.wordsOfWisdom}/current-week`);
  },

  async getByWeek(weekOf: string): Promise<WordOfWisdom> {
    return apiClient.get<WordOfWisdom>(`${endpoints.wordsOfWisdom}/week/${weekOf}`);
  },

  async createWordOfWisdom(data: CreateWordOfWisdomRequest): Promise<WordOfWisdom> {
    return apiClient.post<WordOfWisdom>(endpoints.wordsOfWisdom, data);
  },

  async updateWordOfWisdom(
    id: string,
    data: UpdateWordOfWisdomRequest
  ): Promise<WordOfWisdom> {
    return apiClient.patch<WordOfWisdom>(`${endpoints.wordsOfWisdom}/${id}`, data);
  },

  async deleteWordOfWisdom(id: string): Promise<void> {
    return apiClient.delete<void>(`${endpoints.wordsOfWisdom}/${id}`);
  },

  async incrementShareCount(id: string): Promise<WordOfWisdom> {
    return apiClient.post<WordOfWisdom>(`${endpoints.wordsOfWisdom}/${id}/share`);
  },

  async getStats() {
    return apiClient.get<any>(`${endpoints.wordsOfWisdom}/stats`);
  },
};

