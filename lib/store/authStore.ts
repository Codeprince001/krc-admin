import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

/**
 * Auth store with persistence
 * Note: isAuthenticated is computed from user, not stored separately
 * to avoid inconsistencies
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      // Only persist user data, not computed values
      partialize: (state) => ({ user: state.user }),
    }
  )
);

