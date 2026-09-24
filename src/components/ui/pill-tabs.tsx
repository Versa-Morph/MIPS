"use client";

import React from "react";
import { cn } from "@/utils/cn";

export interface PillTabItem {
  id: string;
  label: string;
  badge?: string | number;
}

export interface PillTabsProps {
  items: PillTabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
  size?: "sm" | "md";
}

export function PillTabs({
  items,
  activeId,
  onChange,
  className,
  size = "md",
}: PillTabsProps) {
  return (
    <div
      className={cn(
        "pill-container bg-slate-100/90 dark:bg-[#1a1e29] border border-slate-200/60 dark:border-slate-800/80 p-1 rounded-full inline-flex items-center gap-1",
        className
      )}
    >
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={cn(
              "rounded-full font-medium transition-all inline-flex items-center gap-1.5 select-none",
              size === "sm"
                ? "px-3 py-1 text-xs"
                : "px-4 py-1.5 text-xs sm:text-[13px]",
              isActive
                ? "bg-slate-900 text-white dark:bg-[#282f40] dark:text-white shadow-sm font-semibold"
                : "text-slate-600 dark:text-[#8e95a5] hover:text-slate-900 dark:hover:text-white"
            )}
          >
            {isActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-coral inline-block shrink-0 animate-pulse" />
            )}
            <span>{item.label}</span>
            {item.badge !== undefined && (
              <span
                className={cn(
                  "text-[10px] px-1.5 py-0.2 rounded-full",
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                )}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
