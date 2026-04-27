import { create } from "zustand";

type ThemeMode = "light" | "dark";

interface AppState {
  theme: ThemeMode;
  toggleTheme: () => void;
  collapsed: boolean;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  theme: "light",
  collapsed: false,

  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === "light" ? "dark" : "light",
    })),

  toggleSidebar: () =>
    set((state) => ({ collapsed: !state.collapsed })),
}));