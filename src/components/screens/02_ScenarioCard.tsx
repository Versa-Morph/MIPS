"use client";

import React from "react";
import {
  Ship,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Layers,
  Award,
  CheckCircle2,
  Anchor,
  Compass,
} from "lucide-react";
import { useTrainingStore } from "@/store/useTrainingStore";
import { TrainingState } from "@/types/simulation";

export function ScenarioCardScreen() {
  const { scenario, setStep } = useTrainingStore();
  const vessel = scenario.vessel;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      {/* Top back navigation */}
      <button
        onClick={() => setStep(TrainingState.DASHBOARD)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      {/* Main Scenario Detail Card */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
        {/* Banner with Target Vessel Graphic Accent */}
        <div className="bg-gradient-to-r from-[#08182B] via-[#0F243E] to-[#172E4C] border-b border-slate-800 p-6 sm:p-8 text-white relative">
          <div className="max-w-2xl space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[#F5B800] text-xs font-bold uppercase tracking-wider">
              <span>●</span> Training Mission Spec: SCN-001
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {scenario.name}
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              {scenario.description}
            </p>
          </div>

          <Ship className="absolute right-6 bottom-[-20px] w-52 h-52 text-slate-700/10 pointer-events-none stroke-[1]" />
        </div>

        {/* Mission Parameters & Target Vessel Specs */}
        <div className="p-6 sm:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Difficulty Rating
              </div>
              <div className="text-base font-bold text-emerald-400 flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                {scenario.difficulty} Level
              </div>
              <p className="text-[11px] text-slate-500">
                Foundational berth constraint matching & vessel arrival
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Estimated Duration
              </div>
              <div className="text-base font-bold text-[#F5B800] flex items-center gap-1.5 font-mono">
                <Calendar className="w-4 h-4" />
                {scenario.duration}
              </div>
              <p className="text-[11px] text-slate-500">
                Self-paced document check + 45-min simulated operation
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Target Cargo Lot
              </div>
              <div className="text-base font-bold text-sky-400 flex items-center gap-1.5 font-mono">
                <Layers className="w-4 h-4" />
                {vessel.totalCargoCount} ISO Containers
              </div>
              <p className="text-[11px] text-slate-500">
                30 Import Discharge + 20 Export Loading (5 Reefer)
              </p>
            </div>
          </div>

          {/* Target Vessel Snapshot */}
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Anchor className="w-5 h-5 text-[#F5B800]" />
                <span className="text-sm font-bold text-slate-200">
                  Target Vessel Particulars ({vessel.name})
                </span>
              </div>
              <span className="text-xs font-mono text-slate-400">
                IMO {vessel.imo} · Call Sign: {vessel.callSign}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Length (LOA)
                </span>
                <span className="text-lg font-black text-white font-mono">
                  {vessel.loa} m
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Arrival Draft (Max)
                </span>
                <span className="text-lg font-black text-red-400 font-mono">
                  {vessel.draft} m
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Beam (Breadth)
                </span>
                <span className="text-lg font-black text-white font-mono">
                  {vessel.beam} m
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Scheduled ETA
                </span>
                <span className="text-lg font-black text-amber-400 font-mono">
                  {vessel.eta} WIB
                </span>
              </div>
            </div>
          </div>

          {/* Mission Objectives Checklist */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
              Evaluated Mission Objectives
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#F5B800] mt-0.5 shrink-0" />
                <span>
                  <strong>Document Analysis:</strong> Examine Notice of Arrival,
                  Vessel Particulars, and Cargo Manifest to record critical draft
                  and LOA requirements.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#F5B800] mt-0.5 shrink-0" />
                <span>
                  <strong>Berth Allocation Decision:</strong> Match vessel dimensions
                  against Berth B-01 and B-02 depth limits to prevent grounding
                  and ensure crane coverage.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#F5B800] mt-0.5 shrink-0" />
                <span>
                  <strong>Simulation Oversight:</strong> Monitor vessel berthing,
                  twin quay crane handling cycle, and terminal truck dispatch
                  against operational KPIs.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Action Bar */}
        <div className="px-6 sm:px-8 py-5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => setStep(TrainingState.DASHBOARD)}
            className="px-4 py-2 rounded-lg text-slate-400 hover:text-white text-xs font-semibold"
          >
            Cancel
          </button>

          <button
            onClick={() => setStep(TrainingState.BRIEFING)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F5B800] hover:bg-[#D99B00] text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 transition-all transform hover:scale-[1.02]"
          >
            <span>START TRAINING</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
}
