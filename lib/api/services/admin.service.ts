import { apiClient } from "../client";
import { endpoints } from "../endpoints";
import type {
  DashboardStats,
  UserAnalytics,
  RevenueAnalytics,
  ContentAnalytics,
  CommunityAnalytics,
  SystemHealth,
  ActivityLog,
} from "@/types";

export const adminService = {
  async getDashboardStats(): Promise<DashboardStats> {
    return apiClient.get<DashboardStats>(endpoints.admin.dashboard);
  },

  async getUserAnalytics(
    startDate?: string,
    endDate?: string
  ): Promise<UserAnalytics> {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    const url = `${endpoints.admin.analytics.users}?${params.toString()}`;
    return apiClient.get<UserAnalytics>(url);
  },

  async getRevenueAnalytics(
    startDate?: string,
    endDate?: string
  ): Promise<RevenueAnalytics> {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    const url = `${endpoints.admin.analytics.revenue}?${params.toString()}`;
    return apiClient.get<RevenueAnalytics>(url);
  },

  async getContentAnalytics(): Promise<ContentAnalytics> {
    return apiClient.get<ContentAnalytics>(endpoints.admin.analytics.content);
  },

  async getCommunityAnalytics(): Promise<CommunityAnalytics> {
    return apiClient.get<CommunityAnalytics>(
      endpoints.admin.analytics.community
    );
  },

  async getSystemHealth(): Promise<SystemHealth> {
    return apiClient.get<SystemHealth>(endpoints.admin.systemHealth);
  },

  async getActivityLog(
    page?: number,
    limit?: number
  ): Promise<{ data: ActivityLog[]; meta: any }> {
    const params = new URLSearchParams();
    if (page) params.append("page", page.toString());
    if (limit) params.append("limit", limit.toString());
    const url = `${endpoints.admin.activityLog}?${params.toString()}`;
    const res = await apiClient.get<{
      activities?: ActivityLog[];
      data?: ActivityLog[];
      pagination?: any;
      meta?: any;
    }>(url);
    return {
      data: res.activities ?? res.data ?? [],
      meta: res.pagination ?? res.meta,
    };
  },
};
