"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/utils/cn";

export interface StatWidgetProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  delta?: {
    value: string;
    isPositive?: boolean;
  };
  className?: string;
}

export function StatWidget({
  icon,
  label,
  value,
  delta,
  className,
}: StatWidgetProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-[#151821] border border-slate-200/80 dark:border-[#232734] rounded-2xl p-4 flex items-center gap-3.5 shadow-sm min-w-[170px] sm:min-w-[190px]",
        className
      )}
    >
      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#1d222e] flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0">
        {icon}
      </div>

      <div className="flex flex-col min-w-0 flex-1">
        <span className="text-[11px] font-medium text-slate-500 dark:text-[#8e95a5] truncate">
          {label}
        </span>
        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight tabular-nums font-sans">
            {value}
          </span>
          {delta && (
            <span
              className={cn(
                "inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                delta.isPositive !== false
                  ? "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40"
                  : "text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/40"
              )}
            >
              {delta.value}
              {delta.isPositive !== false ? (
                <ArrowUpRight className="w-3 h-3 ml-0.5 stroke-[2.5]" />
              ) : (
                <ArrowDownRight className="w-3 h-3 ml-0.5 stroke-[2.5]" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
