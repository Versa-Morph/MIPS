"use client";

import React from "react";
import {
  Ship,
  Lock,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Compass,
  Layers,
  Circle,
  Play,
} from "lucide-react";
import { useTrainingStore } from "@/store/useTrainingStore";
import { TrainingState } from "@/types/simulation";

export function DashboardScreen() {
  const { setStep, cadetName } = useTrainingStore();

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn select-none">
      <div className="rounded-2xl bg-gradient-to-r from-[#08182B] via-[#0F243E] to-[#162E4D] border border-slate-800 p-6 sm:p-8 shadow-xl text-white relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[#F5B800] text-xs font-bold uppercase tracking-wider">
            <span>●</span> MIPS TRAINING CENTER
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Welcome, {cadetName}
          </h1>
          <p className="text-slate-300 text-sm max-w-xl">
            Trainee / Junior Port Operations Personnel Simulation Environment
          </p>
        </div>

        <Compass className="absolute right-4 bottom-[-30px] w-56 h-56 text-slate-700/10 pointer-events-none stroke-[1]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-slate-900 border-2 border-amber-500/40 p-6 flex flex-col justify-between shadow-lg space-y-4">
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
              Active Assignment
            </span>
            <h2 className="text-xl font-bold text-white">
              Container Vessel Arrival & Berthing Operation
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Handle the scheduled arrival of MV Nusantara (08:00 WIB). Review documents, assign the appropriate berth, and supervise cargo operations.
            </p>
          </div>

          <button
            onClick={() => setStep(TrainingState.SCENARIO_SELECTION)}
            className="w-full py-3 px-4 rounded-xl bg-[#F5B800] hover:bg-[#D99B00] text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between shadow-lg space-y-4">
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Training Progress
            </span>
            <div className="text-3xl font-black text-white font-mono">
              1 / 3 <span className="text-base text-slate-400 font-normal">Completed</span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-[#F5B800] rounded-full" style={{ width: "33%" }}></div>
            </div>
            <p className="text-xs text-slate-400 pt-1">
              Complete the active berthing scenario to unlock subsequent terminal modules.
            </p>
          </div>

          <div className="text-xs text-slate-500 font-mono">
            Status: Scenario 01 Active
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-lg">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 border-b border-slate-800 pb-3">
          <BookOpen className="w-4 h-4 text-[#F5B800]" /> Available Training
        </h3>

        <div className="space-y-3">
          <div
            onClick={() => setStep(TrainingState.SCENARIO_SELECTION)}
            className="cursor-pointer p-4 rounded-xl bg-slate-950 border border-amber-500/40 hover:border-[#F5B800] transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[#F5B800] animate-pulse"></div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-[#F5B800] transition-colors">
                  Vessel Arrival & Berthing
                </h4>
                <p className="text-xs text-slate-400">
                  Target: MV Nusantara (280m LOA, 10.2m Draft, 50 Containers)
                </p>
              </div>
            </div>

            <button className="px-3 py-1.5 rounded-lg bg-slate-800 group-hover:bg-[#F5B800] group-hover:text-slate-950 text-slate-200 text-xs font-bold transition-all flex items-center gap-1">
              <span>Start</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-center justify-between opacity-60">
            <div className="flex items-center gap-3">
              <Circle className="w-2.5 h-2.5 text-slate-600" />
              <div>
                <h4 className="text-sm font-semibold text-slate-400">
                  Cargo Handling
                </h4>
                <p className="text-xs text-slate-600">
                  Quay crane productivity, cycle sequencing & container dispatch
                </p>
              </div>
            </div>

            <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 uppercase px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
              <Lock className="w-3 h-3" /> Locked
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-center justify-between opacity-60">
            <div className="flex items-center gap-3">
              <Circle className="w-2.5 h-2.5 text-slate-600" />
              <div>
                <h4 className="text-sm font-semibold text-slate-400">
                  Yard Operations
                </h4>
                <p className="text-xs text-slate-600">
                  Container yard stacking, reefer connections & truck turnaround
                </p>
              </div>
            </div>

            <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 uppercase px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
              <Lock className="w-3 h-3" /> Locked
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
