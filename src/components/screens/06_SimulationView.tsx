"use client";

import { useEffect } from "react";
import {
  Anchor,
  Compass,
  ShieldCheck,
  ArrowRight,
  Radio,
  CheckCircle2,
  Layers,
  Truck,
  Ship,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useTrainingStore } from "@/store/useTrainingStore";
import { useSimulationStore } from "@/store/useSimulationStore";
import { TrainingState } from "@/types/simulation";
import { SimulationControls } from "@/components/simulation/SimulationControls";
import { EventTimeline } from "@/components/simulation/EventTimeline";
import { KPIDashboard } from "@/components/simulation/KPIDashboard";
import { Modal } from "@/components/common/Modal";
import { sound } from "@/utils/audioEngine";

const InteractivePortMap = dynamic(
  () => import("@/components/simulation/InteractivePortMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[440px] flex items-center justify-center glass-panel text-slate-400 font-mono text-xs rounded-2xl border border-glass-border">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-tactical-cyan animate-pulse"></span>
          <span>Loading Peta RBI 1209-444 Tanjung Priok GIS Engine...</span>
        </div>
      </div>
    ),
  }
);

export function SimulationViewScreen() {
  const { scenario, selectedBerth, setStep } = useTrainingStore();
  const {
    isCompleted,
    containersHandled,
    currentSimMinute,
    play,
    pendingCheckpoint,
    approveCheckpoint,
    selectedEquipment,
    inspectEquipment,
  } = useSimulationStore();

  const vessel = scenario.vessel;
  const assignedBerth = scenario.availableBerths.find(
    (b) => b.id === selectedBerth
  );

  useEffect(() => {
    if (currentSimMinute === 0 && !pendingCheckpoint) {
      play();
    } else if (currentSimMinute === 10) {
      sound.playFoghorn();
    }
  }, [currentSimMinute, play, pendingCheckpoint]);

  useEffect(() => {
    if (containersHandled > 0 && containersHandled <= 50) {
      sound.playSpreaderClack();
    }
  }, [containersHandled]);

  useEffect(() => {
    if (pendingCheckpoint) {
      sound.playWarningAlarm();
    }
  }, [pendingCheckpoint]);

  const handleProceedToAssessment = () => {
    sound.playSuccessChime();
    setStep(TrainingState.ASSESSMENT);
  };

  const handleApprove = () => {
    sound.playSuccessChime();
    approveCheckpoint();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 space-y-4 animate-fadeIn select-none font-sans">
      {/* VTS Command Cockpit Top Bar */}
      <div className="rounded-2xl glass-panel border border-glass-border p-3 px-5 flex flex-wrap items-center justify-between gap-3 shadow-glass text-white text-xs">
        <div className="flex items-center flex-wrap gap-4">
          <div className="flex items-center gap-2 font-bold tracking-wider text-electric-amber font-mono">
            <Anchor className="w-4 h-4 text-electric-amber" />
            <span>TRAINING SIMULATION</span>
          </div>

          <div className="h-4 w-px bg-slate-800 hidden sm:block"></div>

          <div className="flex items-center gap-2 font-mono">
            <span className="text-slate-400">VESSEL:</span>
            <span className="font-bold text-white bg-abyssal-surface/80 px-2.5 py-0.5 rounded border border-slate-800">
              {vessel.name}
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono">
            <span className="text-slate-400">ASSIGNED BERTH:</span>
            <span className="font-bold text-safety-emerald bg-safety-emerald/10 px-2.5 py-0.5 rounded border border-safety-emerald/30">
              {assignedBerth?.id || "B-01"} (Valid)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-safety-emerald/10 border border-safety-emerald/30 text-safety-emerald font-mono text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-safety-emerald animate-pulse"></span>
            <span>● RUNNING</span>
          </span>

          <button
            type="button"
            onClick={handleProceedToAssessment}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all transform active:scale-[0.97] ${
              isCompleted || containersHandled >= 50
                ? "bg-safety-emerald hover:bg-emerald-400 text-abyssal shadow-emerald-glow animate-pulse"
                : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80"
            }`}
          >
            <span>Complete Operation</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Main Cockpit Layout: Left Telemetry Controls + Center/Right Port GIS View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Side: Decision Summary + Chrono Controls + Tactical Info */}
        <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
          {/* YOUR DECISION Reference Card (Double-Bezel) */}
          <div className="p-1.5 rounded-2xl glass-panel border border-glass-border shadow-glass">
            <div className="rounded-xl bg-abyssal/90 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2 text-xs font-mono">
                  <ShieldCheck className="w-4 h-4 text-safety-emerald" />
                  <span>YOUR DECISION</span>
                </span>
                <span className="font-mono text-[10px] text-safety-emerald bg-safety-emerald/10 px-2 py-0.5 rounded border border-safety-emerald/30 font-bold">
                  ✓ Valid
                </span>
              </div>

              <div className="space-y-2 text-slate-300 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-slate-900 font-mono">
                  <span className="text-slate-400 font-bold">Berth:</span>
                  <span className="text-sm font-bold font-mono text-slate-100">
                    {assignedBerth?.id || "B-01"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-900 font-mono">
                  <span className="text-slate-400 font-bold">Vessel:</span>
                  <span className="text-sm font-bold font-mono text-slate-100">{vessel.name}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-900 font-mono">
                  <span className="text-slate-400 font-bold">Dimensions:</span>
                  <span className="text-sm font-bold font-mono text-slate-100">LOA {vessel.loa}m · Draft {vessel.draft}m</span>
                </div>
                <div className="flex justify-between items-center py-1 font-mono">
                  <span className="text-slate-400 font-bold">Equipment:</span>
                  <span className="text-sm font-bold font-mono text-tactical-cyan">2x Cranes · 3x Trucks</span>
                </div>
              </div>
            </div>
          </div>

          {/* Simulation Controls (Time Scrubber & Clock) */}
          <SimulationControls />

          {/* Tactical Advice Callout */}
          <div className="p-3.5 rounded-2xl glass-panel border border-glass-border text-[11px] text-slate-300 flex items-start gap-2.5 shadow-glass">
            <Compass className="w-4 h-4 text-electric-amber shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              Tip: Klik pada <strong>Kapal MV Nusantara</strong>, <strong>Crane QC</strong>, atau <strong>Truk Terminal</strong> pada layar pelabuhan untuk menginspeksi telemetri operasional.
            </span>
          </div>
        </div>

        {/* Center / Right: High-Res Interactive Port GIS Map */}
        <div className="lg:col-span-8 flex flex-col min-h-[440px] lg:min-h-[520px]">
          <InteractivePortMap />
        </div>
      </div>

      {/* Bottom Dual Telemetry Monitors: Event Timeline & KPI Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="min-h-[220px]">
          <EventTimeline />
        </div>

        <div className="min-h-[220px]">
          <KPIDashboard />
        </div>
      </div>

      {/* Authorization Clearance Modal (T+10 Mooring / T+15 Crane Start) */}
      {pendingCheckpoint && (
        <Modal
          isOpen={true}
          onClose={() => {}}
          title="DISPATCH OTORISASI OPERASI PELABUHAN"
          referenceNumber={pendingCheckpoint.timeString}
        >
          <div className="space-y-6 text-slate-100 font-sans">
            <div className="p-4 rounded-xl bg-electric-amber/10 border-2 border-electric-amber/50 flex items-start gap-3.5 shadow-amber-glow">
              <Radio className="w-6 h-6 text-electric-amber shrink-0 mt-0.5 animate-pulse" />
              <div className="space-y-1">
                <div className="text-[11px] font-mono uppercase font-bold text-amber-300">
                  Dari: {pendingCheckpoint.sender}
                </div>
                <h3 className="text-base font-bold text-white font-sans">
                  {pendingCheckpoint.title}
                </h3>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed bg-abyssal p-4 rounded-xl border border-slate-800">
              {pendingCheckpoint.description}
            </p>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={handleApprove}
                className="px-6 py-3 rounded-xl bg-electric-amber hover:bg-electric-amber-hover text-abyssal font-black text-xs sm:text-sm flex items-center gap-2 shadow-amber-glow transition-all transform hover:scale-[1.02] active:scale-[0.97]"
              >
                <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                <span>{pendingCheckpoint.actionButtonText}</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Equipment Telemetry Inspection Modal */}
      {selectedEquipment && (
        <Modal
          isOpen={true}
          onClose={() => inspectEquipment(null)}
          title={`INSPEKSI TELEMETRI OPERASIONAL: ${selectedEquipment.name}`}
          referenceNumber={selectedEquipment.id}
        >
          <div className="space-y-6 text-slate-100 font-sans">
            <div className="p-4 rounded-xl bg-abyssal border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-abyssal-surface flex items-center justify-center text-electric-amber border border-slate-700 font-bold">
                  {selectedEquipment.type === "VESSEL" ? (
                    <Ship className="w-5 h-5 text-electric-amber" />
                  ) : selectedEquipment.type === "CRANE" ? (
                    <Layers className="w-5 h-5 text-tactical-cyan" />
                  ) : (
                    <Truck className="w-5 h-5 text-safety-emerald" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-sans">
                    {selectedEquipment.name}
                  </h3>
                  <div className="text-[11px] font-mono text-slate-400">
                    ID: {selectedEquipment.id}
                  </div>
                </div>
              </div>

              <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-safety-emerald/10 text-safety-emerald border border-safety-emerald/30">
                {selectedEquipment.status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {selectedEquipment.metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-abyssal border border-slate-800/80 flex justify-between items-center"
                >
                  <span className="text-slate-400 font-medium">{m.label}:</span>
                  <span className="font-mono font-bold text-slate-200">
                    {m.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-abyssal border border-slate-800 space-y-1.5 text-xs">
              <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider block font-mono">
                Catatan Pengawas Lapangan
              </span>
              <p className="text-slate-300 leading-relaxed italic">
                &quot;{selectedEquipment.operationalNotes}&quot;
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
