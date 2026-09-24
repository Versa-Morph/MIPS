import { create } from "zustand";

interface ThemeState {
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: "light",
  toggleTheme: () => {
    const nextTheme = get().theme === "light" ? "dark" : "light";
    if (typeof window !== "undefined") {
      localStorage.setItem("mips-theme", nextTheme);
      document.documentElement.classList.toggle("dark", nextTheme === "dark");
    }
    set({ theme: nextTheme });
  },
  setTheme: (theme: "light" | "dark") => {
    if (typeof window !== "undefined") {
      localStorage.setItem("mips-theme", theme);
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
    set({ theme });
  },
}));
