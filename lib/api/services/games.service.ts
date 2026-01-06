import { apiClient } from '../client';
import type {
  QuizQuestion,
  CreateQuizQuestionDto,
  UpdateQuizQuestionDto,
  VerseScramble,
  CreateVerseScrambleDto,
  UpdateVerseScrambleDto,
  CharacterGuess,
  CreateCharacterGuessDto,
  UpdateCharacterGuessDto,
  Badge,
  CreateBadgeDto,
  UpdateBadgeDto,
  GamesStats,
  PaginatedResponse,
} from '@/types/api/games';

export const gamesService = {
  // ============================================
  // QUIZ QUESTIONS
  // ============================================

  async getQuizQuestions(params?: {
    page?: number;
    limit?: number;
    category?: string;
    difficulty?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.difficulty) queryParams.append('difficulty', params.difficulty);
    const queryString = queryParams.toString();
    const url = `/games/quiz-questions${queryString ? `?${queryString}` : ''}`;
    return await apiClient.get<PaginatedResponse<QuizQuestion>>(url);
  },

  async createQuizQuestion(data: CreateQuizQuestionDto) {
    return await apiClient.post<QuizQuestion>(
      '/games/quiz-questions',
      data
    );
  },

  async updateQuizQuestion(id: string, data: UpdateQuizQuestionDto) {
    const response = await apiClient.patch<QuizQuestion>(
      `/games/quiz-questions/${id}`,
      data
    );
    return response;
  },

  async deleteQuizQuestion(id: string) {
    const response = await apiClient.delete(`/games/quiz-questions/${id}`);
    return response;
  },

  // ============================================
  // VERSE SCRAMBLES
  // ============================================

  async getVerseScrambles(params?: {
    page?: number;
    limit?: number;
    category?: string;
    difficulty?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.difficulty) queryParams.append('difficulty', params.difficulty);
    const queryString = queryParams.toString();
    const url = `/games/verse-scrambles${queryString ? `?${queryString}` : ''}`;
    return await apiClient.get<PaginatedResponse<VerseScramble>>(url);
  },

  async createVerseScramble(data: CreateVerseScrambleDto) {
    const response = await apiClient.post<VerseScramble>(
      '/games/verse-scramble',
      data
    );
    return response;
  },

  async updateVerseScramble(id: string, data: UpdateVerseScrambleDto) {
    const response = await apiClient.patch<VerseScramble>(
      `/games/verse-scramble/${id}`,
      data
    );
    return response;
  },

  async deleteVerseScramble(id: string) {
    const response = await apiClient.delete(`/games/verse-scramble/${id}`);
    return response;
  },

  // ============================================
  // CHARACTER GUESS
  // ============================================

  async getCharacterGuesses(params?: {
    page?: number;
    limit?: number;
    category?: string;
    testament?: string;
    difficulty?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.testament) queryParams.append('testament', params.testament);
    if (params?.difficulty) queryParams.append('difficulty', params.difficulty);
    const queryString = queryParams.toString();
    const url = `/games/character-guesses${queryString ? `?${queryString}` : ''}`;
    return await apiClient.get<PaginatedResponse<CharacterGuess>>(url);
  },

  async createCharacterGuess(data: CreateCharacterGuessDto) {
    const response = await apiClient.post<CharacterGuess>(
      '/games/character-guess',
      data
    );
    return response;
  },

  async updateCharacterGuess(id: string, data: UpdateCharacterGuessDto) {
    const response = await apiClient.patch<CharacterGuess>(
      `/games/character-guess/${id}`,
      data
    );
    return response;
  },

  async deleteCharacterGuess(id: string) {
    const response = await apiClient.delete(`/games/character-guess/${id}`);
    return response;
  },

  // ============================================
  // BADGES
  // ============================================

  async getBadges() {
    const response = await apiClient.get<Badge[]>('/games/badges');
    return response;
  },

  async createBadge(data: CreateBadgeDto) {
    const response = await apiClient.post<Badge>('/games/badges', data);
    return response;
  },

  async updateBadge(id: string, data: UpdateBadgeDto) {
    const response = await apiClient.patch<Badge>(`/games/badges/${id}`, data);
    return response;
  },

  async deleteBadge(id: string) {
    const response = await apiClient.delete(`/games/badges/${id}`);
    return response;
  },

  // ============================================
  // STATS & ANALYTICS
  // ============================================

  async getStats() {
    // Note: This endpoint doesn't exist in backend yet - needs to be added
    const response = await apiClient.get<GamesStats>('/games/admin/stats');
    return response;
  },
};

