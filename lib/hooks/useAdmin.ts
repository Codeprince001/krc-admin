import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/lib/api/services/admin.service";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: () => adminService.getDashboardStats(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useUserAnalytics(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ["admin", "analytics", "users", startDate, endDate],
    queryFn: () => adminService.getUserAnalytics(startDate, endDate),
  });
}

export function useRevenueAnalytics(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ["admin", "analytics", "revenue", startDate, endDate],
    queryFn: () => adminService.getRevenueAnalytics(startDate, endDate),
  });
}

export function useContentAnalytics() {
  return useQuery({
    queryKey: ["admin", "analytics", "content"],
    queryFn: () => adminService.getContentAnalytics(),
  });
}

export function useCommunityAnalytics() {
  return useQuery({
    queryKey: ["admin", "analytics", "community"],
    queryFn: () => adminService.getCommunityAnalytics(),
  });
}

export function useSystemHealth() {
  return useQuery({
    queryKey: ["admin", "system", "health"],
    queryFn: () => adminService.getSystemHealth(),
    refetchInterval: 60000, // Refetch every minute
  });
}

export function useActivityLog(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["admin", "activity-log", page, limit],
    queryFn: () => adminService.getActivityLog(page, limit),
  });
}

