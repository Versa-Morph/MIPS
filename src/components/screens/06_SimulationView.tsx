"use client";

import React, { useEffect } from "react";
import {
  Anchor,
  Compass,
  ShieldCheck,
  ArrowRight,
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
  const { isCompleted, containersHandled, currentSimMinute, play } =
    useSimulationStore();

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
      <div className="rounded-xl bg-[#08182B] border border-slate-800 p-3 px-4 flex flex-wrap items-center justify-between gap-3 shadow-md text-white text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 font-bold tracking-wider text-amber-400">
            <Anchor className="w-4 h-4" />
            <span>TRAINING SIMULATION</span>
          </div>

          <div className="h-4 w-px bg-slate-800 hidden sm:block"></div>

          <div className="flex items-center gap-2 font-mono">
            <span className="text-slate-400">VESSEL:</span>
            <span className="font-bold text-white">{vessel.name}</span>
          </div>

          <div className="flex items-center gap-2 font-mono">
            <span className="text-slate-400">ASSIGNED BERTH:</span>
            <span className="font-bold text-emerald-400">
              {assignedBerth?.id || "B-01"} (Valid)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            ● RUNNING
          </span>

          <button
            onClick={handleProceedToAssessment}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isCompleted || containersHandled >= 50
                ? "bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-md shadow-emerald-500/30 animate-pulse"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300"
            }`}
          >
            <span>{isCompleted ? "Complete Operation" : "Complete Operation"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-3 shadow-lg text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> YOUR DECISION
              </span>
              <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                ✓ Valid
              </span>
            </div>

            <div className="space-y-2 text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-950 font-mono">
                <span className="text-slate-400">Berth:</span>
                <span className="text-emerald-400 font-bold">
                  {assignedBerth?.id || "B-01"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-950 font-mono">
                <span className="text-slate-400">Vessel:</span>
                <span>{vessel.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-950 font-mono">
                <span className="text-slate-400">Dimensions:</span>
                <span>LOA {vessel.loa}m · Draft {vessel.draft}m</span>
              </div>
              <div className="flex justify-between py-1 font-mono">
                <span className="text-slate-400">Equipment:</span>
                <span>2x Cranes · 3x Trucks</span>
              </div>
            </div>
          </div>

          <SimulationControls />
        </div>

        <div className="lg:col-span-8 flex flex-col min-h-[420px] lg:min-h-[520px]">
          <PortCanvas />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="min-h-[220px]">
          <EventTimeline />
        </div>

        <div className="min-h-[220px]">
          <KPIDashboard />
        </div>
      </div>
    </div>
  );
}
