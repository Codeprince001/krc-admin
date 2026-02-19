import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { authService } from "@/lib/api/services/auth.service";
import type { LoginRequest } from "@/types";
import { toast } from "sonner";

/**
 * Check if authentication tokens exist in localStorage
 * This is the source of truth for authentication state
 */
function hasAuthTokens(): boolean {
  if (typeof window === "undefined") return false;
  return !!(
    localStorage.getItem("accessToken") && localStorage.getItem("refreshToken")
  );
}

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, setUser, logout: clearAuth } = useAuthStore();

  // Track if we have tokens (source of truth for auth)
  const [hasTokens, setHasTokens] = useState(() => hasAuthTokens());
  
  // Update hasTokens when localStorage changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const checkTokens = () => {
      setHasTokens(hasAuthTokens());
    };
    
    // Check immediately
    checkTokens();
    
    // Listen for storage events (e.g., login from another tab)
    window.addEventListener("storage", checkTokens);
    
    // Also check on focus (in case tokens were set in same tab)
    window.addEventListener("focus", checkTokens);
    
    return () => {
      window.removeEventListener("storage", checkTokens);
      window.removeEventListener("focus", checkTokens);
    };
  }, []);

  // Enable profile query if:
  // 1. User exists in store (from Zustand persist), OR
  // 2. Tokens exist in localStorage (check directly, not state, to avoid timing issues)
  const tokensExist = typeof window !== "undefined" && hasAuthTokens();
  const shouldFetchProfile = !!user || tokensExist;

  const { data: profile, isLoading, isError, error } = useQuery({
    queryKey: ["auth", "profile"],
    queryFn: () => authService.getProfile(),
    enabled: shouldFetchProfile,
    retry: 1, // Retry once to handle transient errors
    retryDelay: 500, // Wait 500ms before retry
    staleTime: 5 * 60 * 1000, // Consider profile fresh for 5 minutes
  });

  // Sync profile to store when fetched
  useEffect(() => {
    if (profile && profile !== user) {
      setUser(profile);
    }
  }, [profile, user, setUser]);

  // Clear auth if profile fetch fails with 401 (invalid/expired token)
  // Don't clear on network errors or other transient issues
  useEffect(() => {
    if (isError && error) {
      const tokensExist = typeof window !== "undefined" && hasAuthTokens();
      
      // Only clear tokens if:
      // 1. We have tokens in storage
      // 2. We don't have a user (not logged in)
      // 3. The error message indicates authentication failure (not network error)
      if (tokensExist && !user && !profile) {
        const errorMessage = (error as any)?.message || "";
        const isAuthError = 
          errorMessage.includes("Authentication failed") ||
          errorMessage.includes("401") ||
          errorMessage.includes("Unauthorized");
        
        // Only clear tokens if it's actually an auth error
        // Don't clear on network errors or other issues that might be transient
        if (isAuthError) {
          console.log("[Auth] Clearing tokens due to authentication failure");
          if (typeof window !== "undefined") {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
          }
          clearAuth();
          setHasTokens(false);
          queryClient.removeQueries({ queryKey: ["auth", "profile"] });
        }
      }
    }
  }, [isError, error, user, profile, clearAuth, queryClient]);

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: async (data) => {
      try {
        // Verify we have user data from the API response
        if (!data.user) {
          console.error("No user data in login response");
          toast.error("Login failed: invalid response from server");
          return;
        }
        
        // Verify tokens were actually set in localStorage
        // This ensures the API client setTokens was called
        if (typeof window !== "undefined") {
          const tokensSet = 
            localStorage.getItem("accessToken") && 
            localStorage.getItem("refreshToken");
          
          if (!tokensSet) {
            console.error("Tokens not set after login");
            toast.error("Login failed: tokens not saved");
            return;
          }
          
          console.log("[Auth] Login successful - tokens saved");
        }
        
        // Set user in store (this is synchronous for Zustand)
        setUser(data.user);
        
        // Update tokens state (for UI reactivity)
        setHasTokens(true);
        
        // Cache profile data to avoid unnecessary refetch and prevent race condition
        // This ensures the profile query won't try to fetch and potentially fail
        queryClient.setQueryData(["auth", "profile"], data.user);
        
        toast.success("Login successful");
        
        // Small delay to ensure Zustand persist and all state updates are processed
        // This is necessary because Zustand persist writes to localStorage asynchronously
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Use router.replace to avoid adding to history
        router.replace("/");
      } catch (error) {
        console.error("Login success handler error:", error);
        toast.error("An error occurred during login");
      }
    },
    onError: (error: any) => {
      console.error("Login error:", error);
      const message = typeof error?.message === 'string' ? error.message : "Login failed";
      toast.error(message);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => {
      const refreshToken = typeof window !== "undefined" 
        ? localStorage.getItem("refreshToken") 
        : null;
      return authService.logout(refreshToken || undefined);
    },
    onSuccess: () => {
      clearAuth();
      setHasTokens(false);
      queryClient.clear();
      router.push("/login");
      toast.success("Logged out successfully");
    },
    onError: () => {
      // Clear local state even if API call fails
      clearAuth();
      setHasTokens(false);
      queryClient.clear();
      router.push("/login");
    },
  });

  // Authentication state: user from store, profile from query, or tokens exist
  // We check tokens directly from localStorage (not state) to avoid timing issues
  // This ensures we have the latest token state even if React state hasn't updated yet
  const isAuthenticated = !!(
    profile || 
    user || 
    (typeof window !== "undefined" && hasAuthTokens())
  );
  
  // Loading state: query is loading OR we're checking tokens but don't have user yet
  // Check localStorage directly to avoid state timing issues
  const checkingAuth = typeof window !== "undefined" && hasAuthTokens() && !user && !profile;
  const isLoadingAuth = isLoading || checkingAuth;

  return {
    user: profile || user,
    isLoading: isLoadingAuth,
    isAuthenticated,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
}

