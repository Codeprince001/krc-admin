import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";

export interface Role {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  permissions: string[];
  isSystem: boolean;
  canAccessAdmin: boolean;
  color: string | null;
  createdAt: string;
  updatedAt: string;
  userCount?: number;
}

export interface CreateRoleRequest {
  name: string;
  description?: string;
  permissions: string[];
  canAccessAdmin: boolean;
  color?: string;
}

export interface UpdateRoleRequest {
  name?: string;
  description?: string;
  permissions?: string[];
  canAccessAdmin?: boolean;
  color?: string;
}

export const rolesService = {
  async list(): Promise<Role[]> {
    const res = await apiClient.get<Role[]>(endpoints.roles);
    return Array.isArray(res) ? res : (res as { data?: Role[] })?.data ?? [];
  },

  async get(id: string): Promise<Role> {
    return apiClient.get<Role>(`${endpoints.roles}/${id}`);
  },

  async create(data: CreateRoleRequest): Promise<Role> {
    return apiClient.post<Role>(endpoints.roles, data);
  },

  async update(id: string, data: UpdateRoleRequest): Promise<Role> {
    return apiClient.patch<Role>(`${endpoints.roles}/${id}`, data);
  },

  async delete(id: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`${endpoints.roles}/${id}`);
  },
};
