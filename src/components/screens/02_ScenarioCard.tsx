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
} from "lucide-react";
import { useTrainingStore } from "@/store/useTrainingStore";
import { TrainingState } from "@/types/simulation";
import { getAssetPath } from "@/utils/assetPath";

export function ScenarioCardScreen() {
  const { scenario, setStep } = useTrainingStore();
  const vessel = scenario.vessel;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans select-none">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep(TrainingState.DASHBOARD)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/40 text-xs font-semibold text-slate-300 hover:text-cyan-400 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="hidden sm:flex items-center gap-2.5 font-mono text-xs text-slate-400">
          <span className="text-slate-500">STAGE</span>
          <span className="text-cyan-400 font-bold">01 / 07</span>
          <span className="text-slate-700">·</span>
          <span className="text-slate-300 font-semibold tracking-wider">
            SCENARIO SPECIFICATION
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl overflow-hidden shadow-2xl">
        {/* Hero Mission Spec Header Banner */}
        <div className="relative border-b border-slate-800/80 p-6 sm:p-8 overflow-hidden bg-slate-950">
          {/* Backdrop Image with Directional Scrim */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <img
              src={getAssetPath("/images/vessel-hero.png")}
              alt="Vessel Hero Banner"
              className="w-full h-full object-cover object-right-top opacity-35 filter contrast-125 saturate-110"
            />
            {/* Cinematic directional gradient scrim */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 max-w-3xl space-y-3.5">
            {/* Mission Identifier Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold tracking-wider">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
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
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300 shadow-sm">
                <Award className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-400">Difficulty:</span>
                <span className="text-emerald-400 font-bold font-mono">
                  {scenario.difficulty}
                </span>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300 shadow-sm">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span className="text-slate-400">Duration:</span>
                <span className="text-amber-400 font-bold font-mono">
                  {scenario.duration}
                </span>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300 shadow-sm">
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
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (7 Cols): Evaluated Objectives & Directives */}
          <div className="lg:col-span-7 space-y-6">
            {/* Evaluated Mission Objectives */}
            <div className="rounded-xl bg-slate-900/60 border border-slate-800/90 p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Evaluated Mission Objectives</span>
                </h3>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60">
                  STCW ASSESSMENT CRITERIA
                </span>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 font-mono text-xs font-bold mt-0.5">
                    1
                  </div>
                  <div className="space-y-0.5">
                    <strong className="text-white block font-semibold text-sm">
                      Document Analysis
                    </strong>
                    <span className="text-slate-400 text-xs leading-relaxed block">
                      Examine Notice of Arrival, Vessel Particulars, and Cargo Manifest to record critical draft and LOA requirements.
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0 font-mono text-xs font-bold mt-0.5">
                    2
                  </div>
                  <div className="space-y-0.5">
                    <strong className="text-white block font-semibold text-sm">
                      Berth Allocation Decision
                    </strong>
                    <span className="text-slate-400 text-xs leading-relaxed block">
                      Match vessel dimensions against Berth B-01 and B-02 depth limits to prevent grounding and ensure crane coverage.
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 font-mono text-xs font-bold mt-0.5">
                    3
                  </div>
                  <div className="space-y-0.5">
                    <strong className="text-white block font-semibold text-sm">
                      Simulation Oversight
                    </strong>
                    <span className="text-slate-400 text-xs leading-relaxed block">
                      Monitor vessel berthing, twin quay crane handling cycle, and terminal truck dispatch against operational KPIs.
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Operational Directives & Passing Standards */}
            <div className="rounded-xl bg-slate-900/60 border border-slate-800/90 p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-200 font-mono border-b border-slate-800 pb-3">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Operational Directives & Passing Standards</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/90 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                        Competency Threshold
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        PASS RULE
                      </span>
                    </div>
                    <span className="text-emerald-400 font-extrabold font-mono text-lg block">
                      70% Minimum
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                    Weighted aggregate score combining pre-arrival clearance accuracy, berth allocation safety, and terminal cargo throughput.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/90 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                        Safety Clearance Mandate
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        CRITICAL
                      </span>
                    </div>
                    <span className="text-amber-400 font-extrabold font-mono text-lg block">
                      UKC &ge; 1.0 m
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                    Under-Keel Clearance is non-negotiable. Berthing decisions that cause negative or substandard clearance trigger immediate grounding failure.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (5 Cols): Target Vessel Overview (IMO Pilot Card) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-xl bg-slate-900/60 border border-slate-800/90 p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Anchor className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-slate-100 font-sans tracking-wide">
                    Target Vessel Overview
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-cyan-400 font-semibold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                  INBOUND
                </span>
              </div>

              {/* Vessel Profile Vector Schematic */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="font-semibold text-slate-300">IMO PILOT DATA PROFILE</span>
                  <span className="text-cyan-400 font-bold">280.0m LOA</span>
                </div>

                <div className="relative h-20 w-full rounded-lg bg-slate-900/90 border border-slate-800/80 flex items-center justify-center overflow-hidden">
                  {/* Grid Lines */}
                  <div
                    className="absolute inset-0 opacity-15 pointer-events-none"
                    style={{
                      backgroundImage:
                        "radial-gradient(#38bdf8 1px, transparent 1px)",
                      backgroundSize: "16px 16px",
                    }}
                  />

                  {/* Ship Silhouette Graphic */}
                  <svg
                    viewBox="0 0 320 80"
                    className="w-full h-full max-h-16 px-4"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Waterline */}
                    <line
                      x1="10"
                      y1="54"
                      x2="310"
                      y2="54"
                      stroke="#06b6d4"
                      strokeWidth="1.5"
                      strokeDasharray="4 2"
                      opacity="0.8"
                    />
                    <text
                      x="14"
                      y="50"
                      fill="#06b6d4"
                      fontSize="7"
                      fontFamily="monospace"
                    >
                      WATERLINE (10.2m)
                    </text>

                    {/* Hull profile */}
                    <path
                      d="M 30 54 L 50 36 L 270 36 L 285 45 L 295 54 L 275 64 L 40 64 Z"
                      fill="#1e293b"
                      stroke="#475569"
                      strokeWidth="1.5"
                    />

                    {/* Superstructure Bridge */}
                    <rect
                      x="230"
                      y="16"
                      width="35"
                      height="20"
                      fill="#334155"
                      stroke="#64748b"
                      strokeWidth="1"
                      rx="2"
                    />
                    <rect
                      x="238"
                      y="20"
                      width="18"
                      height="4"
                      fill="#38bdf8"
                      opacity="0.7"
                    />
                    {/* Radar mast */}
                    <line
                      x1="247"
                      y1="16"
                      x2="247"
                      y2="8"
                      stroke="#94a3b8"
                      strokeWidth="1.5"
                    />
                    <line
                      x1="243"
                      y1="10"
                      x2="251"
                      y2="10"
                      stroke="#38bdf8"
                      strokeWidth="1.5"
                    />

                    {/* Container Bay Stacks */}
                    <g opacity="0.85">
                      <rect x="60" y="24" width="24" height="12" fill="#0284c7" rx="1" />
                      <rect x="88" y="22" width="24" height="14" fill="#0d9488" rx="1" />
                      <rect x="116" y="20" width="24" height="16" fill="#d97706" rx="1" />
                      <rect x="144" y="20" width="24" height="16" fill="#0284c7" rx="1" />
                      <rect x="172" y="22" width="24" height="14" fill="#0d9488" rx="1" />
                      <rect x="200" y="24" width="24" height="12" fill="#d97706" rx="1" />
                    </g>
                  </svg>
                </div>
              </div>

              {/* Technical Specifications Grid */}
              <div className="space-y-2 font-mono text-xs">
                {/* Vessel Name Row */}
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/90 flex items-center justify-between">
                  <span className="text-slate-400 font-semibold uppercase text-[11px]">
                    Vessel Name
                  </span>
                  <span className="text-white font-extrabold font-mono text-base tracking-wide">
                    {vessel.name}
                  </span>
                </div>

                {/* Primary Dimensions */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/90">
                    <span className="text-slate-400 uppercase text-[10px] font-semibold block">
                      Length Overall (LOA)
                    </span>
                    <span className="text-base font-extrabold font-mono text-white block mt-0.5">
                      {vessel.loa} m
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/90">
                    <span className="text-slate-400 uppercase text-[10px] font-semibold block">
                      Max Arrival Draft
                    </span>
                    <span className="text-base font-extrabold font-mono text-amber-400 block mt-0.5">
                      {vessel.draft} m
                    </span>
                  </div>
                </div>

                {/* Secondary Dimensions */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/90">
                    <span className="text-slate-400 uppercase text-[10px] font-semibold block">
                      Moulded Beam
                    </span>
                    <span className="text-base font-extrabold font-mono text-white block mt-0.5">
                      {vessel.beam} m
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/90">
                    <span className="text-slate-400 uppercase text-[10px] font-semibold block">
                      Fwd / Aft Draft
                    </span>
                    <span className="text-sm font-extrabold font-mono text-slate-200 block mt-0.5">
                      {vessel.fwdDraft}m / {vessel.aftDraft}m
                    </span>
                  </div>
                </div>

                {/* Schedule & Cargo */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/90">
                    <span className="text-slate-400 uppercase text-[10px] font-semibold block">
                      Estimated Arrival
                    </span>
                    <span className="text-sm font-extrabold font-mono text-cyan-400 block mt-0.5">
                      {vessel.eta} WIB
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/90">
                    <span className="text-slate-400 uppercase text-[10px] font-semibold block">
                      Target Cargo Lot
                    </span>
                    <span className="text-sm font-extrabold font-mono text-white block mt-0.5">
                      {vessel.totalCargoCount} ISO Containers
                    </span>
                  </div>
                </div>

                {/* Official Identifiers */}
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/90 space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="text-[10px] uppercase font-semibold">REGISTRY / CALLSIGN</span>
                    <span className="text-slate-200 font-semibold font-mono">
                      {vessel.flag} · {vessel.callSign}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/70 pt-1.5">
                    <span className="text-[10px] uppercase font-semibold">IMO IDENTIFIER</span>
                    <span className="text-slate-200 font-semibold font-mono">
                      IMO {vessel.imo}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pilot Advisory Note */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-[11px] text-amber-200/90 flex items-start gap-2.5">
                <Compass className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Catatan Misi: Rincian sarat air (draft), panjang kapal (LOA), dan manifes muatan tertera lengkap di dalam berkas resmi pada Document Center.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tactical Footer Action Bar */}
        <div className="px-6 sm:px-8 py-4 bg-slate-950/90 border-t border-slate-800/80 flex items-center justify-between">
          <button
            onClick={() => setStep(TrainingState.DASHBOARD)}
            className="px-4 py-2 rounded-lg text-slate-400 hover:text-white text-xs font-semibold font-mono transition-colors"
          >
            Back to Dashboard
          </button>

          <button
            onClick={() => setStep(TrainingState.BRIEFING)}
            className="cta-amber inline-flex items-center gap-2 px-7 py-3 rounded-xl font-sans font-extrabold text-sm tracking-wide group"
          >
            <span>START TRAINING</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
