"use client";

import {
  Lock,
  ArrowRight,
  BookOpen,
  Compass,
  Activity,
  Gauge,
} from "lucide-react";
import { useTrainingStore } from "@/store/useTrainingStore";
import { TrainingState } from "@/types/simulation";

export function DashboardScreen() {
  const { setStep, cadetName } = useTrainingStore();

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn select-none font-sans">
      {/* Top Hero Banner: Bento Col 1-12 */}
      <div className="relative rounded-2xl glass-panel border border-glass-border overflow-hidden p-6 sm:p-8 shadow-glass">
        {/* Terminal panorama backdrop with vignette */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src="/images/terminal-panorama.png"
            alt="Terminal Panorama Backdrop"
            className="w-full h-full object-cover opacity-20 mix-blend-luminosity filter saturate-150"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-abyssal via-abyssal/90 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-abyssal via-transparent to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-amber/10 border border-electric-amber/30 text-electric-amber text-xs font-bold uppercase tracking-wider font-mono">
              <span className="w-2 h-2 rounded-full bg-electric-amber animate-pulse">●</span>
              <span>MIPS TRAINING CENTER</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
              Welcome, {cadetName}
            </h1>
            <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
              Trainee / Junior Port Operations Personnel Simulation Environment
            </p>
          </div>

          {/* Live Node Telemetry Indicator */}
          <div className="flex items-center gap-4 bg-abyssal-surface/80 border border-slate-700/60 rounded-xl px-4 py-3 backdrop-blur-md shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-tactical-cyan animate-pulse shadow-[0_0_10px_#00E5FF]" />
            <div className="text-left font-mono">
              <div className="text-[10px] text-slate-400 uppercase tracking-widest">
                SIM-NODE STATUS
              </div>
              <div className="text-xs font-semibold text-tactical-cyan flex items-center gap-1.5">
                <span>ONLINE</span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-300">VTS PRIOK SECTOR-3</span>
              </div>
            </div>
          </div>
        </div>

        <Compass className="absolute right-4 bottom-[-40px] w-56 h-56 text-slate-700/10 pointer-events-none stroke-[1]" />
      </div>

      {/* Bento Grid Middle Section: Active Assignment (7 cols) + Progress Gauge (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Assignment Card: Col 1-7 */}
        <div className="lg:col-span-7 relative rounded-2xl glass-panel border-2 border-electric-amber/40 hover:border-electric-amber/70 transition-all duration-300 overflow-hidden p-6 sm:p-7 flex flex-col justify-between shadow-glass group">
          {/* vessel-hero.png Backdrop with dark vignette */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <img
              src="/images/vessel-hero.png"
              alt="Vessel Hero Backdrop"
              className="w-full h-full object-cover object-center opacity-30 group-hover:scale-105 group-hover:opacity-40 transition-all duration-700 filter contrast-125"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-abyssal via-abyssal-surface/90 to-[#081325]/75" />
            <div className="absolute inset-0 bg-gradient-to-r from-abyssal/95 via-abyssal-surface/70 to-transparent" />
          </div>

          {/* Card Header & Content */}
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-electric-amber/15 border border-electric-amber/40 text-electric-amber text-[11px] font-bold uppercase tracking-wider font-mono">
                <Activity className="w-3.5 h-3.5" />
                <span>Active Assignment</span>
              </div>
              <span className="text-xs font-mono text-slate-400 bg-abyssal/80 px-2.5 py-1 rounded border border-slate-700">
                SCN-001
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Container Vessel Arrival & Berthing Operation
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg">
                Handle the scheduled arrival of MV Nusantara (08:00 WIB). Review documents, assign the appropriate berth, and supervise cargo operations.
              </p>
            </div>

            {/* Target Vessel Snapshot Telemetry */}
            <div className="grid grid-cols-3 gap-2.5 py-2.5 border-y border-slate-700/60 text-xs font-mono">
              <div className="bg-abyssal/70 rounded-lg p-2.5 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Target</span>
                <span className="text-white font-bold text-xs truncate block mt-0.5">MV Nusantara</span>
              </div>
              <div className="bg-abyssal/70 rounded-lg p-2.5 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Dimensions</span>
                <span className="text-tactical-cyan font-bold text-xs block mt-0.5">280m / 10.2m</span>
              </div>
              <div className="bg-abyssal/70 rounded-lg p-2.5 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Schedule</span>
                <span className="text-electric-amber font-bold text-xs block mt-0.5">08:00 WIB</span>
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="relative z-10 pt-5">
            <button
              onClick={() => setStep(TrainingState.SCENARIO_SELECTION)}
              className="w-full py-3.5 px-6 rounded-xl bg-electric-amber hover:bg-electric-amber-hover active:scale-[0.99] text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 group/btn"
            >
              <span>Start Training</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Cadet Readiness & Progress Card: Col 8-12 */}
        <div className="lg:col-span-5 relative rounded-2xl glass-panel border border-glass-border p-6 sm:p-7 flex flex-col justify-between shadow-glass space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-tactical-cyan" />
                <span>Training Progress</span>
              </span>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-tactical-cyan/10 border border-tactical-cyan/30 text-tactical-cyan">
                MODULE 1 ACTIVE
              </span>
            </div>

            {/* Circular Progress Ring & Milestone Display */}
            <div className="flex items-center gap-5 p-4 rounded-xl bg-abyssal/70 border border-slate-800">
              <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 72 72">
                  <circle
                    cx="36"
                    cy="36"
                    r="30"
                    className="text-slate-800 stroke-current"
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
                <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                  1 / 3 <span className="text-base text-slate-400 font-normal font-sans">Completed</span>
                </div>
                <p className="text-xs text-slate-300">
                  Current: <span className="text-tactical-cyan font-semibold">Berthing Operation</span>
                </p>
                <div className="text-[11px] text-slate-400 font-mono">
                  Target Readiness: 100%
                </div>
              </div>
            </div>

            {/* Horizontal Track Indicator */}
            <div className="space-y-1.5">
              <div className="w-full h-2.5 bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
                <div
                  className="h-full bg-gradient-to-r from-electric-amber to-amber-300 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)] transition-all duration-500"
                  style={{ width: "33%" }}
                />
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pt-1">
                Complete the active berthing scenario to unlock subsequent terminal modules.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
            <div className="text-xs text-slate-500 font-mono">
              Status: Scenario 01 Active
            </div>
            <span className="inline-flex items-center gap-1.5 text-safety-emerald text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-safety-emerald animate-pulse" />
              QUALIFICATION
            </span>
          </div>
        </div>
      </div>

      {/* Available Training Roster: Bento Col 1-12 */}
      <div className="rounded-2xl glass-panel border border-glass-border p-6 sm:p-7 space-y-4 shadow-glass">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2 font-mono">
            <BookOpen className="w-4 h-4 text-electric-amber" /> Available Training
          </h3>
          <span className="text-xs font-mono text-slate-400 hidden sm:inline">
            CURRICULUM: KSOP PORT SIMULATION
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Module 1: Vessel Arrival & Berthing */}
          <div
            onClick={() => setStep(TrainingState.SCENARIO_SELECTION)}
            className="cursor-pointer p-5 rounded-xl glass-panel-interactive border border-tactical-cyan/40 hover:border-tactical-cyan transition-all flex flex-col justify-between space-y-4 group bg-abyssal/60"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-tactical-cyan/15 text-tactical-cyan border border-tactical-cyan/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-tactical-cyan animate-pulse" />
                  MODULE 01
                </span>
                <span className="text-xs font-mono text-electric-amber font-bold">
                  ACTIVE
                </span>
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-tactical-cyan transition-colors">
                Vessel Arrival & Berthing
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Target: MV Nusantara (280m LOA, 10.2m Draft, 50 Containers)
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <span className="text-[11px] text-slate-400 font-mono">
                Est. 45 Mins
              </span>
              <button className="px-3 py-1.5 rounded-lg bg-tactical-cyan/20 group-hover:bg-electric-amber group-hover:text-slate-950 text-tactical-cyan text-xs font-bold transition-all flex items-center gap-1 border border-tactical-cyan/40 group-hover:border-electric-amber">
                <span>Start</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Module 2: Cargo Handling */}
          <div className="p-5 rounded-xl glass-panel border border-slate-800/80 flex flex-col justify-between space-y-4 opacity-60 bg-abyssal/30">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-slate-800/80 text-slate-400 border border-slate-700">
                  MODULE 02
                </span>
                <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 uppercase px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                  <Lock className="w-3 h-3 text-slate-400" /> Locked
                </span>
              </div>
              <h4 className="text-sm font-semibold text-slate-300">
                Cargo Handling
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Quay crane productivity, cycle sequencing & container dispatch
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
              Prerequisite: Module 01 Completion
            </div>
          </div>

          {/* Module 3: Yard Operations */}
          <div className="p-5 rounded-xl glass-panel border border-slate-800/80 flex flex-col justify-between space-y-4 opacity-60 bg-abyssal/30">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-slate-800/80 text-slate-400 border border-slate-700">
                  MODULE 03
                </span>
                <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 uppercase px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                  <Lock className="w-3 h-3 text-slate-400" /> Locked
                </span>
              </div>
              <h4 className="text-sm font-semibold text-slate-300">
                Yard Operations
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Container yard stacking, reefer connections & truck turnaround
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
              Prerequisite: Module 02 Completion
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

