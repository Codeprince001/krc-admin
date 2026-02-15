import { User } from "./auth.types";

export interface UsersResponse {
  data: User[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  byRole: {
    role: string;
    count: number;
  }[];
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role?: "MEMBER" | "WORKER" | "PASTOR" | "ADMIN" | "SUPER_ADMIN";
}

export interface UpdateUserRoleRequest {
  role: "USER" | "ADMIN" | "SUPER_ADMIN" | "MEMBER" | "WORKER" | "PASTOR";
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

