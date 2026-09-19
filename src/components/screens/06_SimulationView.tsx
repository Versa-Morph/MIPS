"use client";

import React, { useEffect } from "react";
import {
  Ship,
  Anchor,
  Compass,
  Wind,
  Waves,
  ShieldCheck,
  AlertOctagon,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Sun,
  Moon,
  CloudFog,
} from "lucide-react";
import { useTrainingStore } from "@/store/useTrainingStore";
import { useSimulationStore } from "@/store/useSimulationStore";
import { TrainingState } from "@/types/simulation";
import { PortCanvas } from "@/components/simulation/PortCanvas";
import { SimulationControls } from "@/components/simulation/SimulationControls";
import { EventTimeline } from "@/components/simulation/EventTimeline";
import { KPIDashboard } from "@/components/simulation/KPIDashboard";
import { sound } from "@/utils/audioEngine";

export function SimulationViewScreen() {
  const { scenario, selectedBerth, setStep } = useTrainingStore();
  const {
    isCompleted,
    containersHandled,
    currentSimMinute,
    play,
    weatherMode,
    setWeatherMode,
  } = useSimulationStore();

  const vessel = scenario.vessel;
  const assignedBerth = scenario.availableBerths.find(
    (b) => b.id === selectedBerth
  );

  useEffect(() => {
    if (currentSimMinute === 0) {
      play();
    } else if (currentSimMinute === 5) {
      sound.playFoghorn();
    }
  }, [currentSimMinute, play]);

  useEffect(() => {
    if (containersHandled > 0 && containersHandled <= 50) {
      sound.playSpreaderClack();
    }
  }, [containersHandled]);

  const handleProceedToAssessment = () => {
    sound.playSuccessChime();
    setStep(TrainingState.ASSESSMENT);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 space-y-4 animate-fadeIn select-none">
      {/* Top Cockpit Telemetry Bar */}
      <div className="rounded-xl bg-[#08182B] border border-slate-800 p-3 px-4 flex flex-wrap items-center justify-between gap-3 shadow-md text-white text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 font-bold tracking-wider text-amber-400">
            <Anchor className="w-4 h-4" />
            <span>MIPS SIMULATOR · TACTICAL HUD</span>
          </div>

          <div className="h-4 w-px bg-slate-800 hidden sm:block"></div>

          <div className="flex items-center gap-2 font-mono">
            <span className="text-slate-400">VESSEL:</span>
            <span className="font-bold text-white">{vessel.name}</span>
          </div>

          <div className="flex items-center gap-2 font-mono">
            <span className="text-slate-400">ASSIGNED BERTH:</span>
            <span className="font-bold text-emerald-400">
              {assignedBerth?.id || "B-01"} (Validated)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setWeatherMode("NIGHT_RADAR")}
              className={`p-1.5 rounded text-xs transition-colors ${
                weatherMode === "NIGHT_RADAR"
                  ? "bg-[#F5B800] text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Tactical Night Radar Mode"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setWeatherMode("DAY_FAIRWAY")}
              className={`p-1.5 rounded text-xs transition-colors ${
                weatherMode === "DAY_FAIRWAY"
                  ? "bg-sky-500 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Daylight Fairway Visual Mode"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setWeatherMode("COASTAL_FOG");
                sound.playFoghorn();
              }}
              className={`p-1.5 rounded text-xs transition-colors ${
                weatherMode === "COASTAL_FOG"
                  ? "bg-amber-400 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Reduced Visibility / Fairway Fog Mode"
            >
              <CloudFog className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            SIMULATION LIVE
          </span>

          {/* Quick Finish / Proceed Button */}
          <button
            onClick={handleProceedToAssessment}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isCompleted || containersHandled >= 50
                ? "bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-md shadow-emerald-500/30 animate-pulse"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300"
            }`}
          >
            <span>{isCompleted ? "Proceed to Assessment" : "Skip to Assessment"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Grid: Left Panel (Dossier & Controls) + Center Stage (Port Canvas) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Sidebar Panel (Cockpit Dossier & Telemetry Grid) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Playback Controls Component */}
          <SimulationControls />

          {/* Cadet Decision Dossier */}
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-3 shadow-lg text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Cadets Berth Dossier
              </span>
              <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                COMPLIANT
              </span>
            </div>

            <div className="space-y-2 text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-950 font-mono">
                <span className="text-slate-400">Allocated Berth:</span>
                <span className="text-emerald-400 font-bold">
                  {assignedBerth?.name || "Berth B-01"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-950 font-mono">
                <span className="text-slate-400">Vessel LOA / Max:</span>
                <span>
                  {vessel.loa}m / {assignedBerth?.maxLoa}m (Safe)
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-950 font-mono">
                <span className="text-slate-400">Arrival Draft / Depth:</span>
                <span className="text-emerald-400 font-bold">
                  {vessel.draft}m / {assignedBerth?.maxDraft}m (UKC Safe)
                </span>
              </div>
              <div className="flex justify-between py-1 font-mono">
                <span className="text-slate-400">Active Cranes:</span>
                <span>{assignedBerth?.craneType || "2x Super Post-Panamax"}</span>
              </div>
            </div>
          </div>

          {/* Environmental Telemetry Readouts (PRD Image 5) */}
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-3 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-sky-400" /> Marine Sensor Telemetry
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                FAIRWAY SECTOR 4
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 font-mono">
                <div className="text-[9px] uppercase text-slate-400">Heading</div>
                <div className="text-sm font-bold text-sky-400">085° ENE</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 font-mono">
                <div className="text-[9px] uppercase text-slate-400">Rate of Turn</div>
                <div className="text-sm font-bold text-amber-400">0.5° / min</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 font-mono">
                <div className="text-[9px] uppercase text-slate-400">Wind Velocity</div>
                <div className="text-sm font-bold text-white">12 kn / NW</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 font-mono">
                <div className="text-[9px] uppercase text-slate-400">Sea Current</div>
                <div className="text-sm font-bold text-emerald-400">0.8 kn E</div>
              </div>
            </div>
          </div>
        </div>

        {/* Center / Right Stage: Master SVG Port Simulation Canvas */}
        <div className="lg:col-span-8 flex flex-col min-h-[420px] lg:min-h-[520px]">
          <PortCanvas />
        </div>
      </div>

      {/* Bottom Monitoring Deck (Dual panel: Event Timeline & KPI Dashboard) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Bottom: Live Event Timeline */}
        <div className="min-h-[220px]">
          <EventTimeline />
        </div>

        {/* Right Bottom: Real-Time KPI Telemetry Dashboard */}
        <div className="min-h-[220px]">
          <KPIDashboard />
        </div>
      </div>
    </div>
  );
}
