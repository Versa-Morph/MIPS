"use client";

import * as React from "react";
import { cn } from "@/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "success"
    | "warning"
    | "danger"
    | "coral"
    | "brand"
    | "cyan"
    | "gold"
    | "learn"
    | "analyze"
    | "decide"
    | "simulate"
    | "evaluate"
    | "neutral"
    | "outline";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center font-semibold transition-colors select-none rounded-full";

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
  };

  const variantStyles = {
    default:
      "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700",
    brand:
      "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60",
    coral:
      "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60",
    cyan:
      "bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/60",
    gold:
      "bg-amber-50 text-amber-800 border border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-700/60",
    success:
      "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60",
    warning:
      "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/60",
    danger:
      "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/60",
    learn:
      "bg-[#E1F5FE] text-[#0077A8] border border-[#009FE3] dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-700",
    analyze:
      "bg-[#E0F2FE] text-[#0369A1] border border-[#0284C7] dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-700",
    decide:
      "bg-[#FEF3C7] text-[#B45309] border border-[#F59E0B] dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-700",
    simulate:
      "bg-[#E6F7F4] text-[#007A62] border border-[#00A887] dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-700",
    evaluate:
      "bg-[#F3E8FF] text-[#6D28D9] border border-[#7C3AED] dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-700",
    neutral:
      "bg-slate-100 text-slate-600 dark:bg-slate-800/70 dark:text-slate-400 border border-slate-200 dark:border-slate-700",
    outline:
      "border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-200",
  };

  return (
    <div
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
}
