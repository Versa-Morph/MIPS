"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Anchor,
  User,
  RotateCcw,
  ShieldCheck,
  Volume2,
  VolumeX,
  Radio,
} from "lucide-react";
import { useTrainingStore } from "@/store/useTrainingStore";
import { TrainingState } from "@/types/simulation";
import { sound } from "@/utils/audioEngine";

export function Header() {
  const { cadetName, currentState, resetTraining, setStep } = useTrainingStore();
  const [isMuted, setIsMuted] = useState(sound.getIsMuted());

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const isLiveSimulation = currentState === TrainingState.SIMULATION_RUNNING;

  return (
    <header className="w-full bg-[#060D1A]/90 backdrop-blur-2xl border-b border-slate-800/80 text-white shadow-2xl select-none sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Insignia & Station Identification */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/"
            onClick={() => setStep(TrainingState.DASHBOARD)}
            className="cursor-pointer flex items-center gap-3 group"
          >
            {/* Precision Maritime Anchor Emblem */}
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 via-[#0B1728] to-[#040912] border border-amber-500/40 flex items-center justify-center text-electric-amber shadow-[0_0_15px_rgba(245,158,11,0.15)] transition-all duration-300 group-hover:scale-105 group-hover:border-electric-amber group-hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <Anchor className="w-5 h-5 stroke-[2.3] text-electric-amber transition-transform group-hover:rotate-6" />
              <div className="absolute inset-0 rounded-xl bg-amber-400/5 pointer-events-none" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-white text-sm sm:text-base font-sans group-hover:text-tactical-cyan transition-colors">
                  MIPS TRAINING CENTER
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-mono tracking-wider hidden sm:block">
                PORT SIMULATOR · VTS BRIDGE PRIOK
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Tactical Operational Context & VHF Radio Ribbon */}
        <div className="hidden md:flex items-center">
          <div className="flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-abyssal/90 border border-slate-800 shadow-inner font-mono text-xs">
            {isLiveSimulation ? (
              <div className="flex items-center gap-2 text-safety-emerald font-bold animate-pulse">
                <span className="w-2 h-2 rounded-full bg-safety-emerald shadow-[0_0_8px_#10B981]" />
                <span>SIMULATION ACTIVE</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-slate-300 font-semibold">
                <span className="w-2 h-2 rounded-full bg-tactical-cyan shadow-[0_0_8px_#00E5FF] animate-pulse" />
                <span>VTS BRIDGE CONSOLE</span>
              </div>
            )}

            <span className="h-3 w-px bg-slate-800" />

            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <Radio className="w-3.5 h-3.5 text-electric-amber" />
              <span>VHF CH 12 · HARBOR CONTROL</span>
            </div>
          </div>
        </div>

        {/* Right: Integrated Operator Controls & Cadet Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Audio Monitor Chip */}
          <button
            onClick={handleToggleSound}
            title={isMuted ? "Audio System: Muted (Click to Unmute)" : "Audio System: Active (Click to Mute)"}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-abyssal/80 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all font-mono text-xs cursor-pointer shadow-sm"
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[10px] text-slate-500 hidden sm:inline">MUTED</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-safety-emerald" />
                <span className="text-[10px] text-safety-emerald font-bold hidden sm:inline">AUDIO ON</span>
              </>
            )}
          </button>

          {/* Reset Training Session */}
          <button
            onClick={() => {
              if (
                window.confirm(
                  "Reset current training session and return to Dashboard?"
                )
              ) {
                resetTraining();
              }
            }}
            title="Reset Simulation / Return to Dashboard"
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-abyssal/80 hover:bg-slate-800/80 border border-slate-800 hover:border-electric-amber/40 text-slate-400 hover:text-electric-amber transition-all font-mono text-xs cursor-pointer shadow-sm flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="text-[10px] text-slate-400 hidden sm:inline">RESET</span>
          </button>

          <div className="h-5 w-px bg-slate-800" />

          {/* Cadet Operator Identity Chip */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-abyssal/90 border border-slate-800 shadow-inner">
            <div className="w-6 h-6 rounded-full bg-[#081325] border border-amber-500/40 flex items-center justify-center text-electric-amber shadow-inner">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="text-left font-sans">
              <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <span>Welcome, {cadetName}</span>
                <ShieldCheck className="w-3.5 h-3.5 text-safety-emerald" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
