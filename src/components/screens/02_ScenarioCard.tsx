"use client";

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
} from "lucide-react";
import { useTrainingStore } from "@/store/useTrainingStore";
import { TrainingState } from "@/types/simulation";

export function ScenarioCardScreen() {
  const { scenario, setStep } = useTrainingStore();
  const vessel = scenario.vessel;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn font-sans select-none">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep(TrainingState.DASHBOARD)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg glass-panel text-xs font-semibold text-slate-300 hover:text-tactical-cyan hover:border-tactical-cyan/40 transition-all font-mono"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-slate-400">
          <span>MISSION STAGE:</span>
          <span className="text-tactical-cyan font-bold">01 / 07</span>
          <span className="text-slate-600">|</span>
          <span>PRE-BRIEFING DOSSIER</span>
        </div>
      </div>

      {/* Main Scenario Detail Container */}
      <div className="rounded-2xl glass-panel border border-glass-border overflow-hidden shadow-glass">
        {/* Integrated Header Banner with vessel-hero.png Backdrop */}
        <div className="relative border-b border-glass-border p-6 sm:p-8 text-white overflow-hidden">
          {/* Backdrop with dark gradient vignette */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <img
              src="/images/vessel-hero.png"
              alt="Vessel Hero Banner"
              className="w-full h-full object-cover object-center opacity-30 filter contrast-125 saturate-110"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-abyssal via-abyssal-surface/90 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-abyssal-surface via-transparent to-transparent" />
          </div>

          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-amber/15 border border-electric-amber/40 text-electric-amber text-xs font-bold uppercase tracking-wider font-mono">
              <span className="w-2 h-2 rounded-full bg-electric-amber animate-pulse">●</span>
              <span>Training Mission Spec: SCN-001</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white font-sans">
              {scenario.name}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {scenario.description}
            </p>

            {/* Quick Parameter Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-abyssal/80 border border-slate-700/80 text-xs font-mono text-slate-300">
                <Award className="w-3.5 h-3.5 text-safety-emerald" />
                <span>Difficulty:</span>
                <span className="text-safety-emerald font-bold">{scenario.difficulty}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-abyssal/80 border border-slate-700/80 text-xs font-mono text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-electric-amber" />
                <span>Duration:</span>
                <span className="text-electric-amber font-bold">{scenario.duration}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-abyssal/80 border border-slate-700/80 text-xs font-mono text-slate-300">
                <Layers className="w-3.5 h-3.5 text-tactical-cyan" />
                <span>Cargo:</span>
                <span className="text-tactical-cyan font-bold">{vessel.totalCargoCount} ISO Containers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Executive 2-Column Layout */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (Span 7): Objectives & Directives */}
          <div className="lg:col-span-7 space-y-6">
            {/* Learning Objectives Card */}
            <div className="rounded-xl glass-panel border border-slate-800 p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-electric-amber" />
                  <span>Evaluated Mission Objectives</span>
                </h3>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded">
                  ASSESSMENT CRITERIA
                </span>
              </div>

              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-3 p-3 rounded-lg bg-abyssal/50 border border-slate-800/80">
                  <div className="w-6 h-6 rounded-full bg-electric-amber/15 border border-electric-amber/30 text-electric-amber flex items-center justify-center shrink-0 font-mono text-xs font-bold mt-0.5">
                    1
                  </div>
                  <div>
                    <strong className="text-white block font-semibold mb-0.5">
                      Document Analysis
                    </strong>
                    <span className="text-slate-400 text-xs leading-relaxed">
                      Examine Notice of Arrival, Vessel Particulars, and Cargo Manifest to record critical draft and LOA requirements.
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3 p-3 rounded-lg bg-abyssal/50 border border-slate-800/80">
                  <div className="w-6 h-6 rounded-full bg-tactical-cyan/15 border border-tactical-cyan/30 text-tactical-cyan flex items-center justify-center shrink-0 font-mono text-xs font-bold mt-0.5">
                    2
                  </div>
                  <div>
                    <strong className="text-white block font-semibold mb-0.5">
                      Berth Allocation Decision
                    </strong>
                    <span className="text-slate-400 text-xs leading-relaxed">
                      Match vessel dimensions against Berth B-01 and B-02 depth limits to prevent grounding and ensure crane coverage.
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3 p-3 rounded-lg bg-abyssal/50 border border-slate-800/80">
                  <div className="w-6 h-6 rounded-full bg-safety-emerald/15 border border-safety-emerald/30 text-safety-emerald flex items-center justify-center shrink-0 font-mono text-xs font-bold mt-0.5">
                    3
                  </div>
                  <div>
                    <strong className="text-white block font-semibold mb-0.5">
                      Simulation Oversight
                    </strong>
                    <span className="text-slate-400 text-xs leading-relaxed">
                      Monitor vessel berthing, twin quay crane handling cycle, and terminal truck dispatch against operational KPIs.
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Operational Directive Card */}
            <div className="rounded-xl glass-panel border border-slate-800 p-5 space-y-3 bg-abyssal/40">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                <ShieldCheck className="w-4 h-4 text-safety-emerald" />
                <span>Operational Directives & Passing Standards</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-abyssal/60 border border-slate-800">
                  <span className="text-slate-400 block text-[11px] mb-1">Competency Threshold</span>
                  <span className="text-safety-emerald font-bold font-mono text-sm">70% Minimum</span>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Weighted across document accuracy, berth safety, and terminal KPIs.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-abyssal/60 border border-slate-800">
                  <span className="text-slate-400 block text-[11px] mb-1">Safety Clearance Mandate</span>
                  <span className="text-electric-amber font-bold font-mono text-sm">UKC &ge; 1.0 m</span>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Zero grounding tolerance. Vessel draft must strictly respect quay water depth.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Span 5): Tabular Monospace Target Vessel Overview */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-xl glass-panel border border-slate-800 p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Anchor className="w-5 h-5 text-electric-amber" />
                  <h3 className="text-sm font-bold text-slate-200 font-sans">
                    Target Vessel Overview
                  </h3>
                </div>
                <span className="text-xs font-mono text-electric-amber font-semibold bg-electric-amber/10 px-2 py-0.5 rounded border border-electric-amber/30">
                  INBOUND
                </span>
              </div>

              {/* Tabular Monospace Technical Specs */}
              <div className="space-y-2 font-mono text-xs">
                <div className="p-3 rounded-lg bg-abyssal/70 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400 uppercase text-xs font-bold">Vessel Name</span>
                  <span className="text-slate-100 font-black font-mono text-base sm:text-lg">{vessel.name}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-lg bg-abyssal/70 border border-slate-800">
                    <span className="text-slate-400 uppercase text-xs font-bold block">Length Overall (LOA)</span>
                    <span className="text-base sm:text-lg font-black font-mono text-slate-100 block mt-0.5">{vessel.loa} m</span>
                  </div>
                  <div className="p-3 rounded-lg bg-abyssal/70 border border-slate-800">
                    <span className="text-slate-400 uppercase text-xs font-bold block">Max Arrival Draft</span>
                    <span className="text-base sm:text-lg font-black font-mono text-slate-100 block mt-0.5">{vessel.draft} m</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-lg bg-abyssal/70 border border-slate-800">
                    <span className="text-slate-400 uppercase text-xs font-bold block">Moulded Beam</span>
                    <span className="text-base sm:text-lg font-black font-mono text-slate-100 block mt-0.5">{vessel.beam} m</span>
                  </div>
                  <div className="p-3 rounded-lg bg-abyssal/70 border border-slate-800">
                    <span className="text-slate-400 uppercase text-xs font-bold block">Fwd / Aft Draft</span>
                    <span className="text-base sm:text-lg font-black font-mono text-slate-100 block mt-0.5">{vessel.fwdDraft}m / {vessel.aftDraft}m</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-lg bg-abyssal/70 border border-slate-800">
                    <span className="text-slate-400 uppercase text-xs font-bold block">Estimated Arrival</span>
                    <span className="text-base sm:text-lg font-black font-mono text-slate-100 block mt-0.5">{vessel.eta} WIB</span>
                  </div>
                  <div className="p-3 rounded-lg bg-abyssal/70 border border-slate-800">
                    <span className="text-slate-400 uppercase text-xs font-bold block">Target Cargo Lot</span>
                    <span className="text-base sm:text-lg font-black font-mono text-slate-100 block mt-0.5">{vessel.totalCargoCount} ISO Containers</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-abyssal/70 border border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-bold">REGISTRY / CALLSIGN</span>
                    <span className="text-slate-200 font-semibold font-mono">{vessel.flag} · {vessel.callSign}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-bold">IMO IDENTIFIER</span>
                    <span className="text-slate-200 font-semibold font-mono">IMO {vessel.imo}</span>
                  </div>
                </div>
              </div>

              {/* Mission Note */}
              <div className="p-3 rounded-lg bg-abyssal/50 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2.5">
                <Compass className="w-4 h-4 text-electric-amber shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Catatan Misi: Rincian sarat air (draft), panjang kapal (LOA), dan manifes muatan tertera lengkap di dalam berkas resmi pada Document Center.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action Bar */}
        <div className="px-6 sm:px-8 py-5 bg-abyssal/80 border-t border-glass-border flex items-center justify-between">
          <button
            onClick={() => setStep(TrainingState.DASHBOARD)}
            className="px-4 py-2 rounded-lg text-slate-400 hover:text-white text-xs font-semibold font-mono transition-colors"
          >
            Back to Dashboard
          </button>

          <button
            onClick={() => setStep(TrainingState.BRIEFING)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-electric-amber hover:bg-electric-amber-hover text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.99] group/btn"
          >
            <span>START TRAINING</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

