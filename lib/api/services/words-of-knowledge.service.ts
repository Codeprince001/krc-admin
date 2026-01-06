import { apiClient } from "../client";
import { endpoints } from "../endpoints";
import type {
  WordOfKnowledge,
  WordsOfKnowledgeResponse,
  CreateWordOfKnowledgeRequest,
  UpdateWordOfKnowledgeRequest,
} from "@/types";

export const wordsOfKnowledgeService = {
  async getWordsOfKnowledge(
    page = 1,
    limit = 10,
    title?: string,
    category?: string,
    weekOf?: string
  ): Promise<WordsOfKnowledgeResponse> {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (title) params.append("title", title);
    if (category) params.append("category", category);
    if (weekOf) params.append("weekOf", weekOf);
    const url = `${endpoints.wordsOfKnowledge}?${params.toString()}`;
    return apiClient.get<WordsOfKnowledgeResponse>(url);
  },

  async getWordOfKnowledgeById(id: string): Promise<WordOfKnowledge> {
    return apiClient.get<WordOfKnowledge>(`${endpoints.wordsOfKnowledge}/${id}`);
  },

  async getCurrentWeek(): Promise<WordOfKnowledge> {
    return apiClient.get<WordOfKnowledge>(`${endpoints.wordsOfKnowledge}/current-week`);
  },

  async getByWeek(weekOf: string): Promise<WordOfKnowledge> {
    return apiClient.get<WordOfKnowledge>(`${endpoints.wordsOfKnowledge}/week/${weekOf}`);
  },

  async createWordOfKnowledge(data: CreateWordOfKnowledgeRequest): Promise<WordOfKnowledge> {
    return apiClient.post<WordOfKnowledge>(endpoints.wordsOfKnowledge, data);
  },

  async updateWordOfKnowledge(
    id: string,
    data: UpdateWordOfKnowledgeRequest
  ): Promise<WordOfKnowledge> {
    return apiClient.patch<WordOfKnowledge>(`${endpoints.wordsOfKnowledge}/${id}`, data);
  },

  async deleteWordOfKnowledge(id: string): Promise<void> {
    return apiClient.delete<void>(`${endpoints.wordsOfKnowledge}/${id}`);
  },

  async incrementShareCount(id: string): Promise<WordOfKnowledge> {
    return apiClient.post<WordOfKnowledge>(`${endpoints.wordsOfKnowledge}/${id}/share`);
  },

  async getStats() {
    return apiClient.get<any>(`${endpoints.wordsOfKnowledge}/stats`);
  },
};

