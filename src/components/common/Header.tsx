"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Anchor,
  Search,
  Bell,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { useTrainingStore } from "@/store/useTrainingStore";
import { TrainingState } from "@/types/simulation";
import { sound } from "@/utils/audioEngine";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/utils/cn";

export function Header() {
  const { cadetName, currentState, resetTraining, setStep } = useTrainingStore();
  const [isMuted, setIsMuted] = useState(sound.getIsMuted());

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const navItems = [
    {
      id: "overview",
      label: "Overview",
      state: TrainingState.DASHBOARD,
      isActive: currentState === TrainingState.DASHBOARD,
    },
    {
      id: "briefing",
      label: "Briefing",
      state: TrainingState.BRIEFING,
      isActive:
        currentState === TrainingState.BRIEFING ||
        currentState === TrainingState.SCENARIO_SELECTION,
    },
    {
      id: "tracking",
      label: "Simulasi VTS",
      state: TrainingState.SIMULATION_RUNNING,
      isActive:
        currentState === TrainingState.SIMULATION_RUNNING ||
        currentState === TrainingState.SIMULATION_PAUSED ||
        currentState === TrainingState.SIMULATION_COMPLETED,
    },
    {
      id: "documents",
      label: "Dokumen",
      state: TrainingState.DOCUMENT_REVIEW,
      isActive: currentState === TrainingState.DOCUMENT_REVIEW,
    },
    {
      id: "berthing",
      label: "Dermaga",
      state: TrainingState.DECISION,
      isActive:
        currentState === TrainingState.DECISION ||
        currentState === TrainingState.DECISION_VALIDATED,
    },
    {
      id: "analytics",
      label: "Asesmen",
      state: TrainingState.ASSESSMENT,
      isActive:
        currentState === TrainingState.ASSESSMENT ||
        currentState === TrainingState.TRAINING_COMPLETED,
    },
  ];

  return (
    <header className="w-full bg-white/90 dark:bg-[#11131a]/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-[#222634] text-slate-900 dark:text-white select-none sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/"
            onClick={() => setStep(TrainingState.DASHBOARD)}
            className="cursor-pointer flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 flex items-center justify-center font-black tracking-tighter shadow-sm transition-transform group-hover:scale-105">
              <Anchor className="w-4 h-4 text-coral stroke-[2.8]" />
            </div>

            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight font-sans text-slate-900 dark:text-white leading-tight">
                MIPS TRAINING CENTER
              </span>
              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">
                Port Ops System · Global
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Segmented Floating Pill Bar (TransGlobal Signature Element) */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center p-1 rounded-full bg-slate-100/90 dark:bg-[#1a1e29] border border-slate-200/60 dark:border-[#282f40]"
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setStep(item.state)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-150 inline-flex items-center gap-1.5 cursor-pointer",
                item.isActive
                  ? "bg-slate-900 text-white dark:bg-[#282f40] dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-[#8e95a5] hover:text-slate-900 dark:hover:text-white"
              )}
            >
              {item.isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-coral inline-block shrink-0 animate-pulse" />
              )}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Right: Actions, Theme Switcher, Audio, & Cadet Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Quick Search Button */}
          <button
            type="button"
            title="Search database / orders"
            className="w-9 h-9 rounded-full flex items-center justify-center border border-slate-200 dark:border-[#262b3a] bg-white dark:bg-[#161922] text-slate-600 dark:text-slate-300 hover:text-coral dark:hover:text-coral transition-colors shadow-sm"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Notifications Bell with Dot */}
          <button
            type="button"
            title="Notifications: 1 pending vessel"
            className="relative w-9 h-9 rounded-full flex items-center justify-center border border-slate-200 dark:border-[#262b3a] bg-white dark:bg-[#161922] text-slate-600 dark:text-slate-300 hover:text-coral dark:hover:text-coral transition-colors shadow-sm"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-coral ring-2 ring-white dark:ring-[#161922]" />
          </button>

          {/* Audio Engine Monitor */}
          <button
            type="button"
            onClick={handleToggleSound}
            title={isMuted ? "Suara Efek: Mati (Klik untuk Nyalakan)" : "Suara Efek: Nyala (Klik untuk Matikan)"}
            className="w-9 h-9 rounded-full flex items-center justify-center border border-slate-200 dark:border-[#262b3a] bg-white dark:bg-[#161922] text-slate-600 dark:text-slate-300 hover:text-coral dark:hover:text-coral transition-colors shadow-sm"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-slate-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-500" />
            )}
          </button>

          {/* Theme Toggle Button (Light Mode Default + Dark Mode Switch) */}
          <ThemeToggle />

          {/* Reset Training Tool */}
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Reset seluruh sesi latihan kembali ke awal?")) {
                resetTraining();
              }
            }}
            title="Reset Seluruh Skenario"
            className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center border border-slate-200 dark:border-[#262b3a] bg-white dark:bg-[#161922] text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 transition-colors shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* User Profile Capsule (TransGlobal Persona Format) */}
          <div className="flex items-center gap-2.5 pl-1.5 sm:pl-2">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 via-coral to-rose-400 p-[1.5px] shadow-sm">
                <div className="w-full h-full rounded-full bg-white dark:bg-[#161922] flex items-center justify-center font-bold text-xs text-slate-800 dark:text-white">
                  {cadetName.charAt(0).toUpperCase()}
                </div>
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#11131a]" />
            </div>

            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                Welcome, {cadetName}
              </span>
              <span className="text-[10px] font-medium text-slate-500 dark:text-[#8e95a5] leading-none">
                Port Operations Trainee
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
