import { apiClient } from "../client";
import { endpoints } from "../endpoints";
import type {
  GivingCategory,
  CreateGivingCategoryInput,
  UpdateGivingCategoryInput,
  GivingCampaign,
  CreateGivingCampaignInput,
  UpdateGivingCampaignInput,
  GivingTransaction,
  GivingTransactionsResponse,
  GivingTransactionStats,
  QueryGivingTransactionsParams,
} from "@/types/api/giving-management.types";

const BASE = endpoints.givingManagement;

export const givingManagementService = {
  // Categories
  getCategories: (activeOnly?: boolean) =>
    apiClient.get<GivingCategory[]>(`${BASE}/categories${activeOnly ? "?activeOnly=true" : ""}`),

  getCategory: (id: string) => apiClient.get<GivingCategory>(`${BASE}/categories/${id}`),

  createCategory: (data: CreateGivingCategoryInput) =>
    apiClient.post<GivingCategory>(`${BASE}/categories`, data),

  updateCategory: (id: string, data: UpdateGivingCategoryInput) =>
    apiClient.put<GivingCategory>(`${BASE}/categories/${id}`, data),

  deleteCategory: (id: string) => apiClient.delete<void>(`${BASE}/categories/${id}`),

  // Campaigns
  getCampaigns: (activeOnly?: boolean) =>
    apiClient.get<GivingCampaign[]>(`${BASE}/campaigns${activeOnly ? "?activeOnly=true" : ""}`),

  getCampaign: (id: string) => apiClient.get<GivingCampaign>(`${BASE}/campaigns/${id}`),

  createCampaign: (data: CreateGivingCampaignInput) =>
    apiClient.post<GivingCampaign>(`${BASE}/campaigns`, data),

  updateCampaign: (id: string, data: UpdateGivingCampaignInput) =>
    apiClient.put<GivingCampaign>(`${BASE}/campaigns/${id}`, data),

  deleteCampaign: (id: string) => apiClient.delete<void>(`${BASE}/campaigns/${id}`),

  // Transactions
  getTransactions: (params: QueryGivingTransactionsParams = {}) => {
    const q = new URLSearchParams();
    if (params.page) q.set("page", String(params.page));
    if (params.limit) q.set("limit", String(params.limit));
    if (params.categoryId) q.set("categoryId", params.categoryId);
    if (params.campaignId) q.set("campaignId", params.campaignId);
    if (params.paymentMethod) q.set("paymentMethod", params.paymentMethod);
    if (params.paymentStatus) q.set("paymentStatus", params.paymentStatus);
    if (params.startDate) q.set("startDate", params.startDate);
    if (params.endDate) q.set("endDate", params.endDate);
    const query = q.toString();
    return apiClient.get<GivingTransactionsResponse>(`${BASE}/transactions${query ? `?${query}` : ""}`);
  },

  getTransactionStats: (params?: {
    startDate?: string;
    endDate?: string;
    categoryId?: string;
    campaignId?: string;
  }) => {
    const q = new URLSearchParams();
    if (params?.startDate) q.set("startDate", params.startDate);
    if (params?.endDate) q.set("endDate", params.endDate);
    if (params?.categoryId) q.set("categoryId", params.categoryId);
    if (params?.campaignId) q.set("campaignId", params.campaignId);
    const query = q.toString();
    return apiClient.get<GivingTransactionStats>(`${BASE}/transactions/stats${query ? `?${query}` : ""}`);
  },

  getTransactionReport: (params: QueryGivingTransactionsParams) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v != null && v !== "") q.set(k, String(v));
    });
    const query = q.toString();
    return apiClient.get<GivingTransaction[]>(`${BASE}/transactions/report${query ? `?${query}` : ""}`);
  },
};
