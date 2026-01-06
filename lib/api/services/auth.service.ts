import { apiClient } from "../client";
import { endpoints } from "../endpoints";
import type { LoginRequest, LoginResponse, User, RefreshTokenRequest } from "@/types";

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      endpoints.auth.login,
      credentials
    );
    // Store tokens in client
    apiClient.setTokens(response.accessToken, response.refreshToken);
    return response;
  },

  async getProfile(): Promise<User> {
    return apiClient.get<User>(endpoints.auth.profile);
  },

  async logout(refreshToken?: string): Promise<void> {
    try {
      if (refreshToken) {
        await apiClient.post(endpoints.auth.logout, { refreshToken });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      apiClient.clearTokens();
    }
  },

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      endpoints.auth.refresh,
      { refreshToken }
    );
    apiClient.setTokens(response.accessToken, response.refreshToken);
    return response;
  },
};
