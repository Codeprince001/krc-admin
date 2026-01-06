import { apiClient } from "../client";
import { endpoints } from "../endpoints";
import type {
  UsersResponse,
  User,
  UserStats,
  UpdateUserRoleRequest,
  UpdateUserRequest,
} from "@/types";

export const usersService = {
  async getUsers(
    page = 1,
    limit = 10,
    role?: string
  ): Promise<UsersResponse> {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (role) params.append("role", role);
    const url = `${endpoints.users.list}?${params.toString()}`;
    return apiClient.get<UsersResponse>(url);
  },

  async getUserStats(): Promise<UserStats> {
    return apiClient.get<UserStats>(endpoints.users.stats);
  },

  async getUserById(id: string): Promise<User> {
    return apiClient.get<User>(endpoints.users.detail(id));
  },

  async updateUserRole(
    id: string,
    data: UpdateUserRoleRequest
  ): Promise<User> {
    return apiClient.put<User>(endpoints.users.updateRole(id), data);
  },

  async toggleUserStatus(id: string): Promise<User> {
    return apiClient.put<User>(endpoints.users.toggleStatus(id));
  },

  async deleteUser(id: string): Promise<void> {
    return apiClient.delete<void>(endpoints.users.delete(id));
  },

  async updateUser(id: string, data: UpdateUserRequest): Promise<User> {
    return apiClient.put<User>(endpoints.users.detail(id), data);
  },
};

