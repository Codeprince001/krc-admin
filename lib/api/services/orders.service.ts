import { apiClient } from "../client";
import { endpoints } from "../endpoints";
import type {
  Order,
  OrdersResponse,
  UpdateOrderStatusRequest,
  ProcessPaymentRequest,
  QueryOrdersParams,
} from "@/types/api/orders.types";

export const ordersService = {
  async getOrders(params: QueryOrdersParams = {}): Promise<OrdersResponse> {
    const { page = 1, limit = 10, status, deliveryType, search } = params;
    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());
    if (status) queryParams.append("status", status);
    if (deliveryType) queryParams.append("deliveryType", deliveryType);
    if (search) queryParams.append("search", search);

    const url = `${endpoints.orders}?${queryParams.toString()}`;
    const response = await apiClient.get<any>(url);

    // Transform backend response format { orders, pagination } to { data, meta }
    if (response && typeof response === 'object') {
      if ('orders' in response && 'pagination' in response) {
        return {
          data: response.orders,
          meta: {
            page: response.pagination.page,
            limit: response.pagination.limit,
            total: response.pagination.total,
            totalPages: response.pagination.totalPages,
          },
        };
      }
      if ('data' in response && 'meta' in response) {
        return response;
      }
    }

    return response;
  },

  async exportOrders(params: QueryOrdersParams = {}): Promise<OrdersResponse> {
    const { page = 1, limit = 10000, status, deliveryType, search } = params;
    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());
    if (status) queryParams.append("status", status);
    if (deliveryType) queryParams.append("deliveryType", deliveryType);
    if (search) queryParams.append("search", search);

    const url = `${endpoints.orders}/export?${queryParams.toString()}`;
    const response = await apiClient.get<any>(url);

    // Transform backend response format { orders, pagination } to { data, meta }
    if (response && typeof response === 'object') {
      if ('orders' in response && 'pagination' in response) {
        return {
          data: response.orders,
          meta: {
            page: response.pagination.page,
            limit: response.pagination.limit,
            total: response.pagination.total,
            totalPages: response.pagination.totalPages,
          },
        };
      }
      if ('data' in response && 'meta' in response) {
        return response;
      }
    }

    return response;
  },

  async getOrderById(id: string): Promise<Order> {
    return apiClient.get<Order>(`${endpoints.orders}/${id}`);
  },

  async getOrderStats() {
    return apiClient.get<any>(`${endpoints.orders}/stats`);
  },

  async updateOrderStatus(
    id: string,
    data: UpdateOrderStatusRequest
  ): Promise<Order> {
    return apiClient.patch<Order>(`${endpoints.orders}/${id}/status`, data);
  },

  async bulkUpdateStatus(
    ids: string[],
    status: string,
    notifyCustomers: boolean = true
  ): Promise<{ succeeded: number; failed: number; total: number }> {
    return apiClient.patch(`${endpoints.orders}/bulk/status`, { ids, status, notifyCustomers });
  },

  async getOrderAdmin(id: string): Promise<Order> {
    return apiClient.get<Order>(`${endpoints.orders}/${id}/admin`);
  },

  async processPayment(
    id: string,
    data: ProcessPaymentRequest
  ): Promise<Order> {
    return apiClient.post<Order>(`${endpoints.orders}/${id}/process-payment`, data);
  },

  async cancelOrder(id: string): Promise<Order> {
    return apiClient.patch<Order>(`${endpoints.orders}/${id}/cancel`);
  },

  async deleteOrder(id: string): Promise<void> {
    return apiClient.delete<void>(`${endpoints.orders}/${id}`);
  },
};
