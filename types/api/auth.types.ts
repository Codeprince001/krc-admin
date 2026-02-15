export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  displayName?: string | null;
  phoneNumber?: string | null;
  phone?: string | null;
  role: "USER" | "ADMIN" | "SUPER_ADMIN" | "MEMBER" | "WORKER" | "PASTOR";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}
