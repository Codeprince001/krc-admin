import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersService } from "@/lib/api/services/orders.service";
import { toast } from "sonner";
import type {
  Order,
  UpdateOrderStatusRequest,
  ProcessPaymentRequest,
  QueryOrdersParams,
  OrderStatus,
} from "@/types/api/orders.types";

export function useOrders(params: QueryOrdersParams = {}) {
  const queryClient = useQueryClient();

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["orders", params],
    queryFn: () => ordersService.getOrders(params),
    placeholderData: (prev) => prev,
    staleTime: 30 * 1000,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderStatusRequest }) =>
      ordersService.updateOrderStatus(id, data),
    onSuccess: () => {
      toast.success("Order status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error: any) => {
      const message = typeof error?.message === 'string' ? error.message : "Failed to update order status";
      toast.error(message);
    },
  });

  const bulkUpdateStatusMutation = useMutation({
    mutationFn: ({ ids, status, notifyCustomers }: { ids: string[]; status: OrderStatus; notifyCustomers?: boolean }) =>
      ordersService.bulkUpdateStatus(ids, status, notifyCustomers),
    onSuccess: (result) => {
      toast.success(`Updated ${result.succeeded} orders${result.failed > 0 ? `, ${result.failed} failed` : ''}`);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error: any) => {
      const message = typeof error?.message === 'string' ? error.message : "Failed to bulk update orders";
      toast.error(message);
    },
  });

  const processPaymentMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProcessPaymentRequest }) =>
      ordersService.processPayment(id, data),
    onSuccess: () => {
      toast.success("Payment processed successfully");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error: any) => {
      const message = typeof error?.message === 'string' ? error.message : "Failed to process payment";
      toast.error(message);
    },
  });

  const cancelOrderMutation = useMutation({
    mutationFn: (id: string) => ordersService.cancelOrder(id),
    onSuccess: () => {
      toast.success("Order cancelled successfully");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error: any) => {
      const message = typeof error?.message === 'string' ? error.message : "Failed to cancel order";
      toast.error(message);
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: (id: string) => ordersService.deleteOrder(id),
    onSuccess: () => {
      toast.success("Order deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error: any) => {
      const message = typeof error?.message === 'string' ? error.message : "Failed to delete order";
      toast.error(message);
    },
  });

  return {
    orders: data?.data || [],
    meta: data?.meta,
    isLoading,
    isFetching,
    error,
    updateStatus: updateStatusMutation.mutate,
    bulkUpdateStatus: bulkUpdateStatusMutation.mutate,
    processPayment: processPaymentMutation.mutate,
    cancelOrder: cancelOrderMutation.mutate,
    deleteOrder: deleteOrderMutation.mutate,
    isUpdatingStatus: updateStatusMutation.isPending,
    isBulkUpdating: bulkUpdateStatusMutation.isPending,
    isProcessingPayment: processPaymentMutation.isPending,
    isCancelling: cancelOrderMutation.isPending,
    isDeleting: deleteOrderMutation.isPending,
  };
}

export function useOrderAdmin(id: string) {
  return useQuery({
    queryKey: ["orders", "admin", id],
    queryFn: () => ordersService.getOrderAdmin(id),
    enabled: !!id,
  });
}

export function useOrderStats() {
  return useQuery({
    queryKey: ["orders", "stats"],
    queryFn: () => ordersService.getOrderStats(),
    staleTime: 60 * 1000,
  });
}

