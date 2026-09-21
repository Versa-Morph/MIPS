"use client";

import React from "react";
import {
  Lock,
  ArrowRight,
  BookOpen,
  Anchor,
  Activity,
  Gauge,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Waves,
  Wind,
  Compass,
} from "lucide-react";
import { useTrainingStore } from "@/store/useTrainingStore";
import { TrainingState } from "@/types/simulation";
import { getAssetPath } from "@/utils/assetPath";

export function DashboardScreen() {
  const { setStep, cadetName } = useTrainingStore();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 space-y-6 animate-fadeIn select-none font-sans">
      {/* 1. Tactical VTS Station Command Header (Synchronized - Zero Duplication) */}
      <div className="relative rounded-2xl glass-panel overflow-hidden border border-slate-800/90 shadow-glass">
        {/* Engineering Terminal Panorama Backdrop */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src={getAssetPath("/images/terminal-panorama.png")}
            alt="Terminal Panorama Backdrop"
            className="w-full h-full object-cover object-center opacity-20 mix-blend-luminosity filter contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#060D1A] via-[#060D1A]/95 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060D1A] via-transparent to-transparent" />
          <div className="absolute inset-0 bg-subtle-grid opacity-35" />
        </div>

        {/* Command Station Main Content Row */}
        <div className="relative z-10 p-6 sm:p-7 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Left: Station Dispatch & Cadet Welcoming Directive */}
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-electric-amber">
              <span className="flex items-center justify-center w-5 h-5 rounded bg-electric-amber/15 border border-electric-amber/40 text-electric-amber">
                <Anchor className="w-3 h-3 stroke-[2.5]" />
              </span>
              <span className="font-mono text-[11px] uppercase tracking-wider font-bold">
                MIPS TRAINING CENTER
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-300 font-sans text-xs">
                Pusat Simulasi Kepelabuhanan Tanjung Priok
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white font-sans">
              Welcome, {cadetName}
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl">
              Trainee / Junior Port Operations Personnel Simulation Environment. Pantau pergerakan kapal masuk alur barat dan tetapkan dermaga sandar sesuai standar keselamatan kedalaman air (UKC).
            </p>
          </div>

          {/* Right: Tanjung Priok Hydrographic & Environmental Conditions Console */}
          <div className="bg-abyssal/90 border border-slate-700/70 rounded-xl p-3.5 backdrop-blur-md shrink-0 shadow-inner font-mono text-xs space-y-2.5 min-w-[280px]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[10px] uppercase tracking-wider text-slate-400">
              <span className="flex items-center gap-1.5 font-bold text-slate-300 font-sans">
                <Waves className="w-3.5 h-3.5 text-tactical-cyan" />
                <span>Kondisi Teluk Jakarta</span>
              </span>
              <span className="text-electric-amber font-bold font-mono">07:45 WIB</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-900/80 rounded-lg p-2 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans font-medium">PASANG SURUT</span>
                <span className="font-bold text-white text-xs block mt-0.5 font-mono">+1.2m LWS</span>
              </div>

              <div className="bg-slate-900/80 rounded-lg p-2 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans font-medium">ANGIN PERAIRAN</span>
                <span className="font-bold text-sky-400 text-xs block mt-0.5 font-mono">12kn NW</span>
              </div>
            </div>

            <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-safety-emerald/10 border border-safety-emerald/25 text-[11px] text-safety-emerald font-semibold">
              <span className="font-sans flex items-center gap-1.5">
                <Compass className="w-3 h-3 text-safety-emerald" />
                <span>Alur Pelayaran Barat:</span>
              </span>
              <span className="font-bold font-mono">-14.0m SAFE</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Bento Grid Section: Active Mission Station (7 cols) + Cadet Competency Matrix (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Active Assignment Station: Col 1-7 */}
        <div className="lg:col-span-7 relative rounded-2xl glass-panel border border-slate-700/80 hover:border-electric-amber/50 transition-all duration-300 overflow-hidden p-6 sm:p-7 flex flex-col justify-between shadow-glass group">
          <div className="space-y-5">
            {/* Mission Identifier Header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-amber/15 border border-electric-amber/40 text-electric-amber text-xs font-semibold tracking-wide font-sans">
                <Activity className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className="font-bold">Active Assignment</span>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-safety-emerald bg-safety-emerald/10 border border-safety-emerald/30 px-2 py-0.5 rounded text-[11px] font-bold">
                  ● PRIORITY INBOUND
                </span>
                <span className="font-bold text-slate-300 bg-abyssal/90 px-2.5 py-0.5 rounded border border-slate-700">
                  SCN-001
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
                Container Vessel Arrival & Berthing Operation
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                Handle the scheduled arrival of MV Nusantara (08:00 WIB). Review documents, assign the appropriate berth, and supervise cargo operations.
              </p>
            </div>

            {/* Tactical Vessel Schematic & Waterline Display */}
            <div className="relative rounded-xl bg-abyssal/95 border border-slate-800 overflow-hidden p-4 shadow-inner">
              {/* Vessel hero backdrop blended inside tactical container */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <img
                  src={getAssetPath("/images/vessel-hero.png")}
                  alt="Vessel Hero Backdrop"
                  className="w-full h-full object-cover object-right-bottom opacity-20 group-hover:scale-105 group-hover:opacity-30 transition-all duration-700 filter contrast-125"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-abyssal via-abyssal/90 to-abyssal/60" />
                <div className="absolute inset-0 bg-gradient-to-r from-abyssal via-transparent to-transparent" />
              </div>

              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800/80 pb-2">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-electric-amber"></span>
                    TARGET VESSEL HYDRODYNAMIC SCHEMATIC
                  </span>
                  <span className="text-tactical-cyan font-semibold">CONTAINER CARRIER (50 TEU)</span>
                </div>

                {/* 2D Vessel Profile Vector Representation */}
                <div className="py-1">
                  <svg
                    viewBox="0 0 540 85"
                    className="w-full h-auto max-h-[85px] overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient id="vesselHullGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#1E293B" />
                        <stop offset="50%" stopColor="#0F172A" />
                        <stop offset="100%" stopColor="#090E17" />
                      </linearGradient>
                    </defs>

                    {/* Waterline Reference (Draft 10.2m LWS) */}
                    <line x1="20" y1="58" x2="520" y2="58" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6" />
                    <text x="460" y="54" fill="#38BDF8" fontSize="9" fontFamily="monospace" fontWeight="bold">
                      WATERLINE (10.2m)
                    </text>

                    {/* Ship Hull Silhouette */}
                    <path
                      d="M 40 25 L 430 25 Q 490 25 515 50 L 500 68 L 40 68 Z"
                      fill="url(#vesselHullGrad)"
                      stroke="#F59E0B"
                      strokeWidth="1.8"
                    />

                    {/* Superstructure Bridge (Aft) */}
                    <rect x="55" y="6" width="38" height="20" rx="2" fill="#334155" stroke="#64748B" strokeWidth="1" />
                    <rect x="75" y="10" width="12" height="6" rx="1" fill="#00E5FF" opacity="0.8" />
                    <line x1="74" y1="4" x2="74" y2="6" stroke="#F59E0B" strokeWidth="1.5" />
                    <circle cx="74" cy="4" r="2" fill="#EF4444" />

                    {/* Container Bays Stacks on Deck */}
                    <rect x="110" y="10" width="34" height="15" rx="1" fill="#0284C7" stroke="#0369A1" strokeWidth="0.8" />
                    <rect x="150" y="10" width="34" height="15" rx="1" fill="#10B981" stroke="#047857" strokeWidth="0.8" />
                    <rect x="190" y="10" width="34" height="15" rx="1" fill="#F59E0B" stroke="#B45309" strokeWidth="0.8" />
                    <rect x="230" y="10" width="34" height="15" rx="1" fill="#0284C7" stroke="#0369A1" strokeWidth="0.8" />
                    <rect x="270" y="10" width="34" height="15" rx="1" fill="#10B981" stroke="#047857" strokeWidth="0.8" />
                    <rect x="310" y="10" width="34" height="15" rx="1" fill="#F59E0B" stroke="#B45309" strokeWidth="0.8" />
                    <rect x="350" y="12" width="34" height="13" rx="1" fill="#0284C7" stroke="#0369A1" strokeWidth="0.8" />
                    <rect x="390" y="14" width="30" height="11" rx="1" fill="#10B981" stroke="#047857" strokeWidth="0.8" />

                    {/* Dimension Bracket Indicators */}
                    <line x1="40" y1="78" x2="515" y2="78" stroke="#64748B" strokeWidth="1" />
                    <line x1="40" y1="74" x2="40" y2="82" stroke="#64748B" strokeWidth="1" />
                    <line x1="515" y1="74" x2="515" y2="82" stroke="#64748B" strokeWidth="1" />
                    <text x="245" y="75" fill="#E2E8F0" fontSize="9" fontFamily="monospace" fontWeight="bold">
                      LOA: 280.0 METERS
                    </text>
                  </svg>
                </div>
              </div>
            </div>

            {/* Target Vessel Snapshot Telemetry */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="bg-abyssal/90 rounded-xl p-3 border border-slate-800 shadow-sm">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider font-mono">
                  TARGET
                </span>
                <span className="text-white font-bold text-sm block mt-1 truncate font-sans">
                  MV Nusantara
                </span>
                <span className="text-[11px] text-slate-500 font-mono block mt-0.5">
                  IMO 1234567 · PK-47A
                </span>
              </div>

              <div className="bg-abyssal/90 rounded-xl p-3 border border-slate-800 shadow-sm">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider font-mono">
                  DIMENSIONS
                </span>
                <span className="text-tactical-cyan font-bold text-sm block mt-1 font-mono">
                  280m / 10.2m
                </span>
                <span className="text-[11px] text-slate-500 font-mono block mt-0.5">
                  LOA / Max Arrival Draft
                </span>
              </div>

              <div className="bg-abyssal/90 rounded-xl p-3 border border-slate-800 shadow-sm">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider font-mono">
                  SCHEDULE
                </span>
                <span className="text-electric-amber font-bold text-sm block mt-1 font-mono">
                  08:00 WIB
                </span>
                <span className="text-[11px] text-slate-500 font-mono block mt-0.5">
                  ETA Priok Pilot Station
                </span>
              </div>
            </div>

            {/* Mission Operational Directives Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300 font-mono pt-1">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-safety-emerald" />
                <span>Level: Basic Qualification</span>
              </span>
              <span className="text-slate-700">·</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Duration: Est. 45 Mins</span>
              </span>
              <span className="text-slate-700">·</span>
              <span className="text-slate-400">Cargo: 50 ISO Containers</span>
            </div>
          </div>

          {/* Action CTA Button */}
          <div className="pt-6">
            <button
              onClick={() => setStep(TrainingState.SCENARIO_SELECTION)}
              className="w-full py-3.5 px-6 rounded-xl cta-amber text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 group/btn cursor-pointer font-sans"
            >
              <span>Start Training</span>
              <ArrowRight className="w-4 h-4 stroke-[3] group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Cadet Readiness & Competency Console: Col 8-12 */}
        <div className="lg:col-span-5 relative rounded-2xl glass-panel border border-slate-700/80 overflow-hidden p-6 sm:p-7 flex flex-col justify-between shadow-glass space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-2 font-sans tracking-wide">
                <Gauge className="w-4 h-4 text-tactical-cyan" />
                <span>Training Progress</span>
              </span>
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-tactical-cyan/10 border border-tactical-cyan/30 text-tactical-cyan">
                MODULE 1 ACTIVE
              </span>
            </div>

            {/* Radial Readiness Dial & Competency Status */}
            <div className="flex items-center gap-5 p-4 rounded-xl bg-abyssal/80 border border-slate-800 shadow-inner">
              <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 72 72">
                  <circle
                    cx="36"
                    cy="36"
                    r="30"
                    className="text-slate-800/80 stroke-current"
                    strokeWidth="6"
                    fill="transparent"
                  />
                  <circle
                    cx="36"
                    cy="36"
                    r="30"
                    className="text-electric-amber stroke-current transition-all duration-1000 ease-out"
                    strokeWidth="6"
                    strokeDasharray={2 * Math.PI * 30}
                    strokeDashoffset={2 * Math.PI * 30 * (1 - 0.333)}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-sm font-black text-white font-mono">33%</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight flex items-baseline gap-2">
                  <span>1 / 3</span>
                  <span className="text-sm text-slate-400 font-normal font-sans">
                    Completed
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-sans">
                  Current: <span className="text-tactical-cyan font-semibold">Berthing Operation</span>
                </p>
                <div className="text-[11px] text-slate-400 font-mono">
                  Target Readiness: 100%
                </div>
              </div>
            </div>

            {/* Curriculum Milestone Pathway */}
            <div className="space-y-2 pt-1">
              <div className="text-xs font-semibold text-slate-400 font-sans">
                Curriculum Milestone Track:
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-electric-amber/10 border border-electric-amber/30 text-electric-amber font-sans">
                  <span className="flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                    <span>Stage 1: Vessel Berthing</span>
                  </span>
                  <span className="text-[11px] font-mono font-bold">IN PROGRESS</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/50 border border-slate-800 text-slate-400 font-sans">
                  <span className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-slate-500" />
                    <span>Stage 2: Crane Dispatch Sequence</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">LOCKED</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/50 border border-slate-800 text-slate-400 font-sans">
                  <span className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-slate-500" />
                    <span>Stage 3: Terminal Stacking & Trucks</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">LOCKED</span>
                </div>
              </div>
            </div>

            {/* Operational Mandates Box */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between items-center font-mono text-[11px]">
                <span className="text-slate-400">Min. Passing Grade:</span>
                <span className="font-bold text-safety-emerald">70 / 100 Pts</span>
              </div>
              <div className="flex justify-between items-center font-mono text-[11px]">
                <span className="text-slate-400">Safety Cushion Mandate:</span>
                <span className="font-bold text-electric-amber">UKC ≥ 1.0 m</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Status: Scenario 01 Active</span>
            <span className="inline-flex items-center gap-1.5 text-safety-emerald font-semibold text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-safety-emerald animate-pulse" />
              QUALIFICATION
            </span>
          </div>
        </div>
      </div>

      {/* 3. Available Training Roster: Bento Col 1-12 */}
      <div className="rounded-2xl glass-panel border border-slate-700/80 p-6 sm:p-7 space-y-4 shadow-glass">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 font-sans tracking-wide">
            <BookOpen className="w-4 h-4 text-electric-amber" />
            <span>Available Training</span>
          </h3>
          <span className="text-xs font-mono text-slate-400 hidden sm:inline">
            CURRICULUM: KSOP PORT SIMULATION
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Module 1: Vessel Arrival & Berthing */}
          <div
            onClick={() => setStep(TrainingState.SCENARIO_SELECTION)}
            className="cursor-pointer p-5 rounded-xl glass-panel-interactive border border-slate-700 hover:border-tactical-cyan/60 transition-all flex flex-col justify-between space-y-4 group bg-abyssal/60"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-tactical-cyan/15 text-tactical-cyan border border-tactical-cyan/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-tactical-cyan animate-pulse" />
                  MODULE 01
                </span>
                <span className="text-xs font-mono text-electric-amber font-bold">
                  ACTIVE
                </span>
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-tactical-cyan transition-colors font-sans">
                Vessel Arrival & Berthing
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Target: MV Nusantara (280m LOA, 10.2m Draft, 50 Containers)
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
              <span className="text-xs text-slate-400 font-mono">
                Est. 45 Mins
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-800 group-hover:bg-electric-amber group-hover:text-slate-950 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-700 group-hover:border-electric-amber">
                <span>Start</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Module 2: Cargo Handling */}
          <div className="p-5 rounded-xl glass-panel border border-slate-800/80 flex flex-col justify-between space-y-4 bg-abyssal/40">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-slate-800/80 text-slate-400 border border-slate-700">
                  MODULE 02
                </span>
                <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 font-sans">
                  <Lock className="w-3 h-3 text-slate-400" /> Locked
                </span>
              </div>
              <h4 className="text-sm font-semibold text-slate-300 font-sans">
                Cargo Handling
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Quay crane productivity, cycle sequencing & container dispatch
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 font-sans">
              Prerequisite: Module 01 Completion
            </div>
          </div>

          {/* Module 3: Yard Operations */}
          <div className="p-5 rounded-xl glass-panel border border-slate-800/80 flex flex-col justify-between space-y-4 bg-abyssal/40">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-slate-800/80 text-slate-400 border border-slate-700">
                  MODULE 03
                </span>
                <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 font-sans">
                  <Lock className="w-3 h-3 text-slate-400" /> Locked
                </span>
              </div>
              <h4 className="text-sm font-semibold text-slate-300 font-sans">
                Yard Operations
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Container yard stacking, reefer connections & truck turnaround
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 font-sans">
              Prerequisite: Module 02 Completion
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
