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
  ArrowLeft,
  Ship,
  Compass,
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

  const isInsideSimulation = currentState !== TrainingState.DASHBOARD;

  // Portal Level Navigation items (visible at portal overview)
  const portalNavItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      onClick: () => setStep(TrainingState.DASHBOARD),
      isActive: currentState === TrainingState.DASHBOARD,
    },
    {
      id: "scenarios",
      label: "Katalog Simulasi",
      onClick: () => setStep(TrainingState.SCENARIO_SELECTION),
      isActive: currentState === TrainingState.SCENARIO_SELECTION,
    },
    {
      id: "logbook",
      label: "Logbook Kadet",
      onClick: () => {
        setStep(TrainingState.DASHBOARD);
        setTimeout(() => {
          const el = document.getElementById("logbook-table-section");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      },
      isActive: false,
    },
    {
      id: "regulations",
      label: "Regulasi IMO",
      onClick: () => {
        alert("Regulasi Maritim IMO STCW A-I/12 & SOP Pelabuhan Tanjung Priok terverifikasi aktif.");
      },
      isActive: false,
    },
  ];

  return (
    <header className="w-full bg-white/95 dark:bg-[#0e1015]/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-[#202430] text-slate-900 dark:text-white select-none sticky top-0 z-50 transition-colors">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/"
            onClick={(e) => {
              e.preventDefault();
              setStep(TrainingState.DASHBOARD);
            }}
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
                Maritime Port Simulator
              </span>
            </div>
          </Link>
        </div>

        {/* Center Navigation: Differentiated between Portal Level & In-Simulation Mode */}
        {!isInsideSimulation ? (
          /* Level 1: Global Portal Floating Pill Navigation */
          <nav
            aria-label="Portal Navigation"
            className="hidden md:flex items-center p-1 rounded-full bg-slate-100/90 dark:bg-[#161922] border border-slate-200/60 dark:border-[#222735]"
          >
            {portalNavItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={item.onClick}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-150 inline-flex items-center gap-1.5 cursor-pointer",
                  item.isActive
                    ? "bg-slate-900 text-white dark:bg-[#252a3a] dark:text-white shadow-xs"
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
        ) : (
          /* Level 2: In-Simulation Session Header Banner */
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setStep(TrainingState.DASHBOARD)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161922] text-slate-700 dark:text-slate-200 hover:text-coral dark:hover:text-coral transition-colors shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-coral" />
              <span>Keluar ke Portal</span>
            </button>

            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#161922] border border-slate-200/60 dark:border-[#222735] text-xs font-mono text-slate-600 dark:text-slate-300">
              <Ship className="w-3.5 h-3.5 text-coral" />
              <span>MV NUSANTARA · Container Berthing</span>
            </div>
          </div>
        )}

        {/* Right: Actions, Theme Switcher, Audio, & Cadet Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Quick Search */}
          <button
            type="button"
            title="Search database / skenario"
            className="w-9 h-9 rounded-full flex items-center justify-center border border-slate-200 dark:border-[#202534] bg-white dark:bg-[#14171f] text-slate-600 dark:text-slate-300 hover:text-coral dark:hover:text-coral transition-colors shadow-xs"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Notifications Bell */}
          <button
            type="button"
            title="Notifikasi Pelatihan"
            className="relative w-9 h-9 rounded-full flex items-center justify-center border border-slate-200 dark:border-[#202534] bg-white dark:bg-[#14171f] text-slate-600 dark:text-slate-300 hover:text-coral dark:hover:text-coral transition-colors shadow-xs"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-coral" />
          </button>

          {/* Audio Engine Monitor */}
          <button
            type="button"
            onClick={handleToggleSound}
            title={isMuted ? "Suara Efek: Mati" : "Suara Efek: Nyala"}
            className="w-9 h-9 rounded-full flex items-center justify-center border border-slate-200 dark:border-[#202534] bg-white dark:bg-[#14171f] text-slate-600 dark:text-slate-300 hover:text-coral dark:hover:text-coral transition-colors shadow-xs"
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
            className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center border border-slate-200 dark:border-[#202534] bg-white dark:bg-[#14171f] text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 transition-colors shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* User Profile Capsule (TransGlobal Format) */}
          <div className="flex items-center gap-2.5 pl-1.5 sm:pl-2">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-950 flex items-center justify-center font-bold text-xs shadow-xs">
                {cadetName.charAt(0).toUpperCase()}
              </div>
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0e1015]" />
            </div>

            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                Welcome, {cadetName}
              </span>
              <span className="text-[10px] font-medium text-slate-500 dark:text-[#8e95a5] leading-none">
                Deck Officer Trainee
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
