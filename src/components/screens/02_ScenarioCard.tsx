"use client";

import React from "react";
import {
  ArrowRight,
  ArrowLeft,
  Calendar,
  Layers,
  Award,
  CheckCircle2,
  Anchor,
  Compass,
  ShieldCheck,
  FileText,
  Gauge,
  Activity,
  AlertCircle,
  Ship,
} from "lucide-react";
import { useTrainingStore } from "@/store/useTrainingStore";
import { TrainingState } from "@/types/simulation";
import { getAssetPath } from "@/utils/assetPath";

export function ScenarioCardScreen() {
  const { scenario, setStep } = useTrainingStore();
  const vessel = scenario.vessel;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 font-sans select-none">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep(TrainingState.DASHBOARD)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-[#151821] border border-slate-200/80 dark:border-[#232734] hover:border-coral/50 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-coral dark:hover:text-coral transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="hidden sm:flex items-center gap-2.5 font-mono text-xs text-slate-400">
          <span className="text-slate-400 dark:text-slate-500">STAGE</span>
          <span className="text-coral font-bold">01 / 07</span>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <span className="text-slate-600 dark:text-slate-300 font-semibold tracking-wider">
            SCENARIO SPECIFICATION
          </span>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="rounded-2xl bg-white dark:bg-[#151821] border border-slate-200/80 dark:border-[#232734] shadow-card dark:shadow-card-dark overflow-hidden">
        {/* Hero Mission Spec Header Banner */}
        <div className="relative border-b border-slate-200/80 dark:border-[#232734] p-6 sm:p-8 overflow-hidden bg-slate-900 text-white">
          {/* Backdrop Image with Directional Scrim */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <img
              src={getAssetPath("/images/vessel-hero.png")}
              alt="Vessel Hero Banner"
              className="w-full h-full object-cover object-right-top opacity-35 filter contrast-125 saturate-110"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 max-w-3xl space-y-3.5">
            {/* Mission Identifier Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coral/20 border border-coral/40 text-coral text-xs font-mono font-bold tracking-wider">
              <span className="w-2 h-2 rounded-full bg-coral animate-pulse" />
              <span>Training Mission Spec: SCN-001</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white font-sans">
              {scenario.name}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
              {scenario.description}
            </p>

            {/* Mission Parameters Row */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/70 text-xs text-slate-200 shadow-sm">
                <Award className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-400">Difficulty:</span>
                <span className="text-emerald-400 font-bold font-mono">
                  {scenario.difficulty}
                </span>
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/70 text-xs text-slate-200 shadow-sm">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span className="text-slate-400">Duration:</span>
                <span className="text-amber-400 font-bold font-mono">
                  {scenario.duration}
                </span>
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/70 text-xs text-slate-200 shadow-sm">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span className="text-slate-400">Cargo:</span>
                <span className="text-cyan-400 font-bold font-mono">
                  {vessel.totalCargoCount} ISO Containers
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Content Layout */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white dark:bg-[#151821]">
          {/* Left Column (7 Cols): Evaluated Objectives & Directives */}
          <div className="lg:col-span-7 space-y-6">
            {/* Evaluated Mission Objectives */}
            <div className="rounded-2xl bg-slate-50 dark:bg-[#1a1e29] border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-coral" />
                  <span>Evaluated Mission Objectives</span>
                </h3>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  STCW ASSESSMENT CRITERIA
                </span>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white dark:bg-[#151821] border border-slate-200/80 dark:border-slate-800/90 shadow-sm">
                  <div className="w-7 h-7 rounded-lg bg-coral/10 border border-coral/30 text-coral flex items-center justify-center shrink-0 font-mono text-xs font-bold mt-0.5">
                    1
                  </div>
                  <div className="space-y-0.5">
                    <strong className="text-slate-900 dark:text-white block font-semibold text-sm">
                      Document Analysis
                    </strong>
                    <span className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed block">
                      Examine Notice of Arrival, Vessel Particulars, and Cargo Manifest to record critical draft and LOA requirements.
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white dark:bg-[#151821] border border-slate-200/80 dark:border-slate-800/90 shadow-sm">
                  <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-500 flex items-center justify-center shrink-0 font-mono text-xs font-bold mt-0.5">
                    2
                  </div>
                  <div className="space-y-0.5">
                    <strong className="text-slate-900 dark:text-white block font-semibold text-sm">
                      Berth Allocation Decision
                    </strong>
                    <span className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed block">
                      Match vessel dimensions against Berth B-01 and B-02 depth limits to prevent grounding and ensure crane coverage.
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white dark:bg-[#151821] border border-slate-200/80 dark:border-slate-800/90 shadow-sm">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center shrink-0 font-mono text-xs font-bold mt-0.5">
                    3
                  </div>
                  <div className="space-y-0.5">
                    <strong className="text-slate-900 dark:text-white block font-semibold text-sm">
                      Simulation Oversight
                    </strong>
                    <span className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed block">
                      Monitor vessel berthing, twin quay crane handling cycle, and terminal truck dispatch against operational KPIs.
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Operational Directives & Passing Standards */}
            <div className="rounded-2xl bg-slate-50 dark:bg-[#1a1e29] border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 font-mono border-b border-slate-200/80 dark:border-slate-800 pb-3">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Operational Directives & Passing Standards</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div className="p-3.5 rounded-xl bg-white dark:bg-[#151821] border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                        Standar Lulus STCW
                      </span>
                      <span className="font-mono text-xs font-bold text-coral">
                        ≥ 80 / 100
                      </span>
                    </div>
                    <span className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed block">
                      Evaluasi otomatis mencakup ketepatan audit dokumen, pemilihan dermaga berkedalaman aman, dan efisiensi waktu operasi.
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-[#151821] border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                        Sarat Keselamatan (UKC)
                      </span>
                      <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        +1.3 m Minimum
                      </span>
                    </div>
                    <span className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed block">
                      Under Keel Clearance wajib dipertahankan untuk mencegah insiden kandas pada pasang surut terendah (LWS).
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (5 Cols): Target Vessel Overview */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl bg-slate-50 dark:bg-[#1a1e29] border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 font-mono flex items-center gap-2">
                  <Ship className="w-4 h-4 text-coral" />
                  <span>Target Vessel Overview</span>
                </h3>
                <span className="font-mono text-xs font-bold text-coral">
                  {vessel.name}
                </span>
              </div>

              {/* Technical Specifications Grid */}
              <div className="space-y-3">
                {/* Primary Dimensions */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-xl bg-white dark:bg-[#151821] border border-slate-200/80 dark:border-slate-800 shadow-sm">
                    <span className="text-slate-400 uppercase text-[10px] font-semibold block">
                      Length Overall (LOA)
                    </span>
                    <span className="text-base font-extrabold font-mono text-slate-900 dark:text-white block mt-0.5">
                      {vessel.loa} m
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-[#151821] border border-slate-200/80 dark:border-slate-800 shadow-sm">
                    <span className="text-slate-400 uppercase text-[10px] font-semibold block">
                      Max Arrival Draft
                    </span>
                    <span className="text-base font-extrabold font-mono text-coral block mt-0.5">
                      {vessel.draft} m
                    </span>
                  </div>
                </div>

                {/* Secondary Dimensions */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-xl bg-white dark:bg-[#151821] border border-slate-200/80 dark:border-slate-800 shadow-sm">
                    <span className="text-slate-400 uppercase text-[10px] font-semibold block">
                      Moulded Beam
                    </span>
                    <span className="text-base font-extrabold font-mono text-slate-900 dark:text-white block mt-0.5">
                      {vessel.beam} m
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-[#151821] border border-slate-200/80 dark:border-slate-800 shadow-sm">
                    <span className="text-slate-400 uppercase text-[10px] font-semibold block">
                      Fwd / Aft Draft
                    </span>
                    <span className="text-sm font-extrabold font-mono text-slate-700 dark:text-slate-200 block mt-0.5">
                      {vessel.fwdDraft}m / {vessel.aftDraft}m
                    </span>
                  </div>
                </div>

                {/* Schedule & Cargo */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-xl bg-white dark:bg-[#151821] border border-slate-200/80 dark:border-slate-800 shadow-sm">
                    <span className="text-slate-400 uppercase text-[10px] font-semibold block">
                      Estimated Arrival
                    </span>
                    <span className="text-sm font-extrabold font-mono text-sky-500 block mt-0.5">
                      {vessel.eta} WIB
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-[#151821] border border-slate-200/80 dark:border-slate-800 shadow-sm">
                    <span className="text-slate-400 uppercase text-[10px] font-semibold block">
                      Target Cargo Lot
                    </span>
                    <span className="text-sm font-extrabold font-mono text-slate-900 dark:text-white block mt-0.5">
                      {vessel.totalCargoCount} ISO Containers
                    </span>
                  </div>
                </div>

                {/* Official Identifiers */}
                <div className="p-3 rounded-xl bg-white dark:bg-[#151821] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="text-[10px] uppercase font-semibold">REGISTRY / CALLSIGN</span>
                    <span className="text-slate-800 dark:text-slate-200 font-semibold font-mono">
                      {vessel.flag} · {vessel.callSign}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-1.5">
                    <span className="text-[10px] uppercase font-semibold">IMO IDENTIFIER</span>
                    <span className="text-slate-800 dark:text-slate-200 font-semibold font-mono">
                      IMO {vessel.imo}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pilot Advisory Note */}
              <div className="p-3.5 rounded-xl bg-coral/10 border border-coral/25 text-[11px] text-coral flex items-start gap-2.5">
                <Compass className="w-4 h-4 text-coral shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Catatan Misi: Rincian sarat air (draft), panjang kapal (LOA), dan manifes muatan tertera lengkap di dalam berkas resmi pada Document Center.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar Footer */}
        <div className="px-6 sm:px-8 py-4 bg-slate-50 dark:bg-[#11131a] border-t border-slate-200/80 dark:border-[#232734] flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep(TrainingState.DASHBOARD)}
            className="px-4 py-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-semibold font-mono transition-colors"
          >
            Back to Dashboard
          </button>

          <button
            type="button"
            onClick={() => setStep(TrainingState.BRIEFING)}
            className="cta-coral inline-flex items-center gap-2 px-7 py-3 rounded-full font-sans font-bold text-sm tracking-wide group shadow-coral"
          >
            <span>START TRAINING</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
