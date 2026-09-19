"use client";

import React from "react";
import { Anchor, User, RotateCcw, ShieldCheck, LogOut } from "lucide-react";
import { useTrainingStore } from "@/store/useTrainingStore";
import { TrainingState } from "@/types/simulation";

export function Header() {
  const {
    cadetName,
    cadetBatch,
    cadetNrp,
    currentState,
    resetTraining,
    logoutCadet,
    setStep,
  } = useTrainingStore();

  const isLiveSimulation = currentState === TrainingState.SIMULATION_RUNNING;

  return (
    <header className="w-full bg-[#08182B] border-b border-slate-800 text-white shadow-md select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            onClick={() => setStep(TrainingState.DASHBOARD)}
            className="cursor-pointer flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-lg bg-[#F5B800] flex items-center justify-center text-slate-950 font-black shadow-sm group-hover:bg-[#D99B00] transition-colors">
              <Anchor className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-white text-base">
                  MIPS ACADEMY
                </span>
                <span className="hidden sm:inline-flex text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Cadet Port Simulator
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Operational Port Berthing & Terminal Logistics
              </p>
            </div>
          </div>
        </div>

        {isLiveSimulation && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            SIMULATION STATUS: LIVE
          </div>
        )}

        <div className="flex items-center gap-3">
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
            className="p-2 rounded-md hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              if (window.confirm("Logout from Cadet Portal?")) {
                logoutCadet();
              }
            }}
            title="Logout / Switch Cadet"
            className="p-2 rounded-md hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>

          <div className="h-6 w-px bg-slate-800"></div>

          <div className="flex items-center gap-2.5 pl-1">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400">
              <User className="w-4 h-4" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold text-slate-200 flex items-center gap-1">
                {cadetName}
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-[10px] font-medium text-slate-400 font-mono">
                {cadetNrp} · {cadetBatch}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
