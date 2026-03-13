import { apiClient } from "../client";
import { endpoints } from "../endpoints";
import type {
  UsersResponse,
  User,
  UserStats,
  CreateUserRequest,
  UpdateUserRoleRequest,
  UpdateUserRequest,
} from "@/types";

export const usersService = {
  async createUser(data: CreateUserRequest): Promise<User> {
    const response = await apiClient.post<{ user: User } | User>(endpoints.users.list, data);
    const result = response as { user: User };
    return result?.user ?? (response as User);
  },

  async getUsers(
    page = 1,
    limit = 10,
    search?: string,
    roleId?: string
  ): Promise<UsersResponse> {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (search) params.append("search", search);
    if (roleId) params.append("roleId", roleId);
    const url = `${endpoints.users.list}?${params.toString()}`;
    return apiClient.get<UsersResponse>(url);
  },

  async exportUsers(
    page = 1,
    limit = 10000,
    search?: string,
    roleId?: string
  ): Promise<UsersResponse> {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (search) params.append("search", search);
    if (roleId) params.append("roleId", roleId);
    const url = `${endpoints.users.list}/export?${params.toString()}`;
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

  async adminResetUserPassword(
    id: string,
    data: { newPassword: string; confirmPassword: string }
  ): Promise<{ message: string }> {
    return apiClient.put<{ message: string }>(
      endpoints.users.resetPassword(id),
      data
    );
  },

  async deleteUser(id: string): Promise<void> {
    return apiClient.delete<void>(endpoints.users.delete(id));
  },

  async updateUser(id: string, data: UpdateUserRequest): Promise<User> {
    return apiClient.put<User>(endpoints.users.detail(id), data);
  },
};

