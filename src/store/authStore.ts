import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { Session, User } from "@supabase/supabase-js";

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  initialized: boolean;

  setAuth: (session: Session | null, user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  clearAuth: () => void;
  hasRole: (role: Role) => boolean;
}

export const useAuthStore = create<AuthState>()(
  subscribeWithSelector((set, get) => ({
    session: null,
    user: null,
    profile: null,
    loading: true,
    initialized: false,

    setAuth: (session, user) => set({ session, user }),
    setProfile: (profile) => set({ profile }),
    setLoading: (loading) => set({ loading }),
    setInitialized: (initialized) => set({ initialized }),

    clearAuth: () =>
      set({
        session: null,
        user: null,
        profile: null,
        loading: false,
        initialized: true,
      }),

    hasRole: (role) => get().profile?.roles?.includes(role) ?? false,
  }))
);