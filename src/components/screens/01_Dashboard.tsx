"use client";

import React from "react";
import {
  Ship,
  Lock,
  ArrowRight,
  BookOpen,
  Award,
  CheckCircle2,
  Clock,
  Compass,
  Layers,
} from "lucide-react";
import { useTrainingStore } from "@/store/useTrainingStore";
import { TrainingState } from "@/types/simulation";

export function DashboardScreen() {
  const { setStep, cadetName, cadetBatch } = useTrainingStore();

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Cadet Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#08182B] via-[#0F243E] to-[#162E4D] border border-slate-800 p-6 sm:p-8 shadow-xl text-white">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[#F5B800] text-xs font-semibold uppercase tracking-wider">
              <span>●</span> MIPS Cadet Training Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Welcome back, {cadetName}
            </h1>
            <p className="text-slate-300 text-sm max-w-xl">
              {cadetBatch} · Port Operations & Navigation Command Training
            </p>
          </div>

          {/* Quick Stats Pill Cards */}
          <div className="flex items-center gap-4 bg-slate-900/80 backdrop-blur-sm border border-slate-700/60 rounded-xl p-4 self-start md:self-auto shadow-inner">
            <div className="text-center px-3 border-r border-slate-800">
              <div className="text-2xl font-black text-[#F5B800] font-mono">
                1 / 3
              </div>
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Modules Done
              </div>
            </div>
            <div className="text-center px-3">
              <div className="text-2xl font-black text-emerald-400 font-mono">
                88%
              </div>
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Avg. Score
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Compass watermark */}
        <Compass className="absolute right-4 bottom-[-30px] w-64 h-64 text-slate-700/10 pointer-events-none stroke-[1]" />
      </div>

      {/* Available Training Modules Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#F5B800]" />
            Active Training Curriculum
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            Semester 2 · Operational Scenario Series
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Module: Container Vessel Arrival & Berthing */}
          <div className="lg:col-span-2 rounded-2xl bg-slate-900/90 border-2 border-amber-500/40 hover:border-[#F5B800] transition-all duration-300 p-6 shadow-lg flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  READY TO LAUNCH
                </span>
                <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#F5B800]" /> ~15 mins
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-[#F5B800] transition-colors">
                  Container Vessel Arrival & Berthing Operation
                </h3>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                  Analyze operational documents for the inbound container vessel{" "}
                  <strong className="text-slate-200">MV Nusantara</strong>.
                  Verify physical berth constraints, execute berth assignment,
                  and monitor automated quay crane and truck operations.
                </p>
              </div>

              {/* Specs Pills */}
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-xs font-mono border border-slate-700">
                  Target: MV Nusantara (280m LOA)
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-xs font-mono border border-slate-700">
                  Cargo: 50 Containers
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-xs font-mono border border-slate-700">
                  Berths: B-01 vs B-02
                </span>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 mt-6 flex items-center justify-between">
              <div className="text-xs text-slate-400">
                Difficulty: <span className="text-emerald-400 font-semibold">Basic / Level 1</span>
              </div>
              <button
                onClick={() => setStep(TrainingState.SCENARIO_SELECTION)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F5B800] hover:bg-[#D99B00] text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 transition-all transform group-hover:translate-x-1"
              >
                <span>Launch Training Scenario</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Side Progress & Competency Column */}
          <div className="space-y-6">
            {/* Competency Meter Card */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-[#F5B800]" /> Cadet Competency Rating
              </h4>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Berth Allocation & Draft Check</span>
                    <span className="font-mono font-bold text-emerald-400">92%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: "92%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Document Analysis</span>
                    <span className="font-mono font-bold text-[#F5B800]">85%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-[#F5B800] rounded-full" style={{ width: "85%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Cargo & Crane Productivity</span>
                    <span className="font-mono font-bold text-sky-400">76%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-sky-500 rounded-full" style={{ width: "76%" }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Locked Module Cards */}
            <div className="rounded-2xl bg-slate-900/50 border border-slate-800/80 p-4 space-y-3 opacity-70">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <Layers className="w-4 h-4 text-slate-500" />
                  Yard Logistics & Stacking
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Locked
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Unlock after completing Vessel Arrival & Berthing assessment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
