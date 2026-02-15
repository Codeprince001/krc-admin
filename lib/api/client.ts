import { endpoints } from "./endpoints";
import type { LoginResponse, RefreshTokenResponse } from "@/types";

const ADMIN_ACCESS_TOKEN_COOKIE = "admin_access_token";
const COOKIE_MAX_AGE_DAYS = 10;

class ApiClient {
  private baseURL: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3009/api";
    // Load tokens from localStorage on initialization
    if (typeof window !== "undefined") {
      this.accessToken = localStorage.getItem("accessToken");
      this.refreshToken = localStorage.getItem("refreshToken");
    }
  }

  setTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      // Set cookie for server-side middleware (route protection)
      const maxAge = 60 * 60 * 24 * COOKIE_MAX_AGE_DAYS;
      document.cookie = `${ADMIN_ACCESS_TOKEN_COOKIE}=${encodeURIComponent(accessToken)}; path=/; max-age=${maxAge}; SameSite=Strict`;
    }
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      document.cookie = `${ADMIN_ACCESS_TOKEN_COOKIE}=; path=/; max-age=0`;
    }
  }

  /**
   * Sync admin_access_token cookie from localStorage (e.g. after deploy or cookie cleared).
   * Call from login page when user has tokens so middleware can allow dashboard access.
   */
  ensureAdminCookie() {
    if (typeof window === "undefined") return;
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    if (accessToken && refreshToken) {
      this.setTokens(accessToken, refreshToken);
    }
  }

  private async refreshAccessToken(): Promise<string | null> {
    if (!this.refreshToken) {
      return null;
    }

    try {
      const response = await fetch(endpoints.auth.refresh, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      if (!response.ok) {
        this.clearTokens();
        return null;
      }

      const json = await response.json();
      // Backend wraps responses in { success, data } format
      const data: RefreshTokenResponse = json?.data || json;
      this.setTokens(data.accessToken, data.refreshToken);
      return data.accessToken;
    } catch (error) {
      this.clearTokens();
      return null;
    }
  }

  private async request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Prepend baseURL if url doesn't start with http/https
    const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      ...(options.headers as Record<string, string> || {}),
    };

    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] ${options.method || 'GET'} ${fullUrl}`);
    }

    let response = await fetch(fullUrl, {
      ...options,
      headers,
    });

    // If 401, try to refresh token
    if (response.status === 401 && this.refreshToken) {
      const newAccessToken = await this.refreshAccessToken();
      if (newAccessToken) {
        headers.Authorization = `Bearer ${newAccessToken}`;
        response = await fetch(fullUrl, {
          ...options,
          headers,
        });
      } else {
        // Refresh failed, clear tokens and redirect to login
        this.clearTokens();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        throw new Error("Authentication failed");
      }
    }

    if (!response.ok) {
      const errorJson = await response.json().catch(() => ({
        message: response.statusText || "An error occurred",
      }));
      // Backend might wrap errors in { success: false, message, data } format
      const errorMessage = errorJson?.message || errorJson?.data?.message || errorJson?.error || response.statusText || "An error occurred";
      throw new Error(errorMessage);
    }

    // Handle empty responses
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const json = await response.json();
      
      // Debug logging in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[API Response]`, json);
      }
      
      // Backend wraps responses in { success, data, message, meta } format
      // Unwrap if it's a wrapped response
      if (json && typeof json === 'object' && 'data' in json && 'success' in json) {
        const unwrappedData = json.data;
        const urlStr = fullUrl.toLowerCase();
        
        // Handle verse scrambles and character guesses: backend returns { success: true, data: [...], meta: {...} }
        // unwrappedData is the array, json.meta contains pagination
        if (Array.isArray(unwrappedData) && json.meta) {
          if (urlStr.includes('verse-scrambles')) {
            const transformed = {
              verses: unwrappedData,
              pagination: json.meta,
            };
            if (process.env.NODE_ENV === 'development') {
              console.log('[API Transform] Verse scrambles:', { versesCount: unwrappedData.length, pagination: json.meta });
            }
            return transformed as T;
          }
          if (urlStr.includes('character-guesses')) {
            const transformed = {
              characters: unwrappedData,
              pagination: json.meta,
            };
            if (process.env.NODE_ENV === 'development') {
              console.log('[API Transform] Character guesses:', { charactersCount: unwrappedData.length, pagination: json.meta });
            }
            return transformed as T;
          }
          // For other paginated arrays, return standard format
          return {
            data: unwrappedData,
            meta: json.meta,
          } as T;
        }
        
        // Handle nested data structure: { data: { data: [...], meta: {...} } }
        if (unwrappedData && typeof unwrappedData === 'object' && 'data' in unwrappedData && 'meta' in unwrappedData && Array.isArray(unwrappedData.data)) {
          if (urlStr.includes('verse-scrambles')) {
            return {
              verses: unwrappedData.data,
              pagination: unwrappedData.meta,
            } as T;
          }
          if (urlStr.includes('character-guesses')) {
            return {
              characters: unwrappedData.data,
              pagination: unwrappedData.meta,
            } as T;
          }
          return unwrappedData as T;
        }
        
        // Handle sermons response structure: { sermons: [...], pagination: {...} }
        if (unwrappedData && typeof unwrappedData === 'object' && 'sermons' in unwrappedData && 'pagination' in unwrappedData) {
          const transformed = {
            data: unwrappedData.sermons,
            meta: unwrappedData.pagination,
          };
          if (process.env.NODE_ENV === 'development') {
            console.log('[API Transform] Sermons:', { sermonsCount: unwrappedData.sermons.length, pagination: unwrappedData.pagination });
          }
          return transformed as T;
        }

        // Handle prayer requests response structure: { prayerRequests: [...], pagination: {...} }
        if (unwrappedData && typeof unwrappedData === 'object' && 'prayerRequests' in unwrappedData && 'pagination' in unwrappedData) {
          // Transform prayer requests to match frontend expectations
          const transformedData = unwrappedData.prayerRequests.map((request: any) => {
            // Map status values from backend to frontend format
            const statusMap: Record<string, string> = {
              'SUBMITTED': 'PENDING',
              'PRAYING': 'IN_PROGRESS',
              'ANSWERED': 'ANSWERED',
              'ARCHIVED': 'CLOSED',
            };
            
            return {
              ...request,
              content: request.description || request.content, // Map description to content
              description: request.description, // Keep description for backward compatibility
              status: statusMap[request.status] || request.status, // Map status
              prayerCount: request.prayerCount || 0, // Add prayerCount (default to 0)
            };
          });
          
          return {
            data: transformedData,
            meta: unwrappedData.pagination,
          } as T;
        }
        
        // For non-paginated responses, return the data directly
        return unwrappedData as T;
      }
      
      return json as T;
    }

    return {} as T;
  }

  async get<T>(url: string, options?: RequestInit): Promise<T> {
    return this.request<T>(url, { ...options, method: "GET" });
  }

  async post<T>(url: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(url: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(url: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(url: string, options?: RequestInit): Promise<T> {
    return this.request<T>(url, { ...options, method: "DELETE" });
  }
}

export const apiClient = new ApiClient();

