"use client";

import React, { useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { useThemeStore } from "@/store/useThemeStore";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme, setTheme } = useThemeStore();

  useEffect(() => {
    const savedTheme = localStorage.getItem("mips-theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Default to light mode as requested
      setTheme("light");
    }
  }, [setTheme]);

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={`Beralih ke mode ${theme === "light" ? "Gelap (Dark)" : "Terang (Light)"}`}
      className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a1e29] text-slate-700 dark:text-slate-300 hover:text-coral dark:hover:text-coral ${className}`}
    >
      {theme === "light" ? (
        <Moon className="w-4 h-4 transition-transform hover:rotate-12" />
      ) : (
        <Sun className="w-4 h-4 transition-transform hover:rotate-45 text-amber-400" />
      )}
    </button>
  );
}
