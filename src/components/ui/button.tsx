"use client";

import * as React from "react";
import { cn } from "@/utils/cn";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "coral" | "secondary" | "outline" | "ghost" | "icon";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/40 disabled:pointer-events-none disabled:opacity-50 select-none";

    const variantStyles = {
      default:
        "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white rounded-full shadow-sm",
      coral:
        "cta-coral text-white rounded-full",
      secondary:
        "bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-[#1f2430] dark:text-slate-200 dark:hover:bg-[#282f40] rounded-full",
      outline:
        "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#151821] dark:text-slate-200 dark:hover:bg-[#1e2330] rounded-full",
      ghost:
        "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60 rounded-full",
      icon:
        "w-9 h-9 p-0 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a1e29] text-slate-700 dark:text-slate-300 hover:text-coral dark:hover:text-coral",
    };

    const sizeStyles = {
      sm: "h-8 px-3.5 text-xs gap-1.5",
      md: "h-9 px-4 text-xs font-semibold gap-2",
      lg: "h-11 px-6 text-sm font-semibold gap-2.5",
      icon: "w-9 h-9 p-0",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
