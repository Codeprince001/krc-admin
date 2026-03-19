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
  role: string; // Role slug (SUPER_ADMIN, ADMIN, MEMBER, or custom e.g. CONTENT_CREATOR)
  roleId?: string;
  permissions?: string[];
  canAccessAdmin?: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  /** LOCAL, GOOGLE, etc. — from GET /users/:id */
  authProvider?: string;
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
