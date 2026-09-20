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
    <header className="w-full bg-abyssal/90 backdrop-blur-xl border-b border-glass-border text-white shadow-glass select-none sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Emblem & Name */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            onClick={() => setStep(TrainingState.DASHBOARD)}
            className="cursor-pointer flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-electric-amber to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-amber-glow transition-transform group-hover:scale-105">
              <Anchor className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-white text-base font-sans group-hover:text-tactical-cyan transition-colors">
                  MIPS TRAINING CENTER
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
                Maritime Integrated Port Simulator · VTS Bridge
              </p>
            </div>
          </Link>
        </div>

        {/* Tactical Telemetry Badge */}
        {isLiveSimulation ? (
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1 rounded-full bg-safety-emerald/15 border border-safety-emerald/40 text-safety-emerald text-xs font-mono font-semibold shadow-emerald-glow animate-pulse">
            <span className="w-2 h-2 rounded-full bg-safety-emerald"></span>
            <span>SIMULATION STATUS: RUNNING</span>
          </div>
        ) : (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-glass-border text-slate-400 text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-tactical-cyan shadow-cyan-glow"></span>
            <span>VTS BRIDGE CONSOLE · ACTIVE</span>
          </div>
        )}

        {/* Right Controls & Cadet Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            title={isMuted ? "Unmute Sound" : "Mute Sound"}
            className="p-2 rounded-lg glass-panel border border-glass-border hover:border-tactical-cyan/40 text-slate-400 hover:text-white transition-all shadow-sm"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-slate-500" />
            ) : (
              <Volume2 className="w-4 h-4 text-safety-emerald" />
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
            className="p-2 rounded-lg glass-panel border border-glass-border hover:border-electric-amber/40 text-slate-400 hover:text-electric-amber transition-all shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="h-6 w-px bg-slate-800/80"></div>

          {/* Cadet Profile Pill */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full glass-panel border border-glass-border shadow-sm">
            <div className="w-7 h-7 rounded-full bg-abyssal-surface border border-electric-amber/40 flex items-center justify-center text-electric-amber shadow-inner">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5 font-sans">
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
