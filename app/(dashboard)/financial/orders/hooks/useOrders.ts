import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersService } from "@/lib/api/services/orders.service";
import { toast } from "sonner";
import type {
  Order,
  UpdateOrderStatusRequest,
  ProcessPaymentRequest,
  QueryOrdersParams,
} from "@/types/api/orders.types";

export function useOrders(params: QueryOrdersParams = {}) {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["orders", params],
    queryFn: () => ordersService.getOrders(params),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderStatusRequest }) =>
      ordersService.updateOrderStatus(id, data),
    onSuccess: () => {
      toast.success("Order status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update order status");
    },
  });

  const processPaymentMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProcessPaymentRequest }) =>
      ordersService.processPayment(id, data),
    onSuccess: () => {
      toast.success("Payment processed successfully");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to process payment");
    },
  });

  const cancelOrderMutation = useMutation({
    mutationFn: (id: string) => ordersService.cancelOrder(id),
    onSuccess: () => {
      toast.success("Order cancelled successfully");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to cancel order");
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: (id: string) => ordersService.deleteOrder(id),
    onSuccess: () => {
      toast.success("Order deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete order");
    },
  });

  return {
    orders: data?.data || [],
    meta: data?.meta,
    isLoading,
    error,
    updateStatus: updateStatusMutation.mutate,
    processPayment: processPaymentMutation.mutate,
    cancelOrder: cancelOrderMutation.mutate,
    deleteOrder: deleteOrderMutation.mutate,
    isUpdatingStatus: updateStatusMutation.isPending,
    isProcessingPayment: processPaymentMutation.isPending,
    isCancelling: cancelOrderMutation.isPending,
    isDeleting: deleteOrderMutation.isPending,
  };
}

