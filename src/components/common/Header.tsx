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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export function Header() {
  const { cadetName, currentState, resetTraining, setStep } = useTrainingStore();
  const [isMuted, setIsMuted] = useState(false);
  const [isRegulationsOpen, setIsRegulationsOpen] = useState(false);

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const isInsideSimulation =
    currentState !== TrainingState.DASHBOARD &&
    currentState !== TrainingState.SCENARIO_CATALOG;

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
      onClick: () => setStep(TrainingState.SCENARIO_CATALOG),
      isActive: currentState === TrainingState.SCENARIO_CATALOG,
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
        setIsRegulationsOpen(true);
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

      {/* IMO Maritime Regulations & Standards Dialog */}
      <Dialog open={isRegulationsOpen} onOpenChange={setIsRegulationsOpen}>
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="coral" size="sm">
                IMO STCW ACCREDITED
              </Badge>
              <span className="text-xs font-mono text-slate-400">
                REV. 2026 / PRIOK PORT SOP
              </span>
            </div>
            <DialogTitle className="text-xl font-bold tracking-tight">
              Regulasi Maritim & Standar Simulator MIPS
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              Kerangka acuan hukum dan operasional yang mendasari kurikulum simulasi Taruna
              di Pelabuhan Tanjung Priok.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 pt-2 text-xs">
            {/* Regulation 1 */}
            <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-[#1a1e29]/70 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white font-mono">
                  STCW Code Section A-I/12 & A-II/1
                </span>
                <Badge variant="success" size="sm">
                  MANDATORY
                </Badge>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                Standar kompetensi perwira jaga navigasi dalam pengoperasian simulator pelabuhan,
                pemanduan alur sempit, dan pengenalan risiko olah gerak kapal besar (Post-Panamax).
              </p>
            </div>

            {/* Regulation 2 */}
            <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-[#1a1e29]/70 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white font-mono">
                  KM No. 53/2005 & SOP Tanjung Priok
                </span>
                <Badge variant="coral" size="sm">
                  PORT AUTHORITY
                </Badge>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                Ketentuan Under Keel Clearance (UKC) minimum 10% dari draft kapal atau minimal 1.0
                meter di alur pelayaran barat, serta kewajiban pandu/tunda untuk kapal LOA &gt; 150m.
              </p>
            </div>

            {/* Regulation 3 */}
            <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-[#1a1e29]/70 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white font-mono">
                  SOLAS Chapter V (Reg. 19 & 34)
                </span>
                <Badge variant="neutral" size="sm">
                  SAFETY
                </Badge>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                Perencanaan rute pelayaran (Passage Planning), pelaporan posisi AIS/VHF berkala,
                dan konfirmasi kesiapan dermaga sebelum melintasi garis batas pandu (Pilot Station).
              </p>
            </div>

            {/* Regulation 4 */}
            <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-[#1a1e29]/70 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white font-mono">
                  IMDG Code Chapter 7 (Hazardous Cargo DG 4.1)
                </span>
                <Badge variant="warning" size="sm">
                  DANGEROUS GOODS
                </Badge>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                Penanganan peti kemas muatan berbahaya (Flammable Solid) pada Berth B-01 dengan radius
                isolasi minimum 50 meter dan kesiapan armada pemadam terminal.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
