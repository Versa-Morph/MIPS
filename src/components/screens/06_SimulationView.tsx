"use client";

import React, { useEffect } from "react";
import {
  Anchor,
  Compass,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Radio,
  CheckCircle2,
  X,
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
      <div className="w-full h-full min-h-[440px] flex items-center justify-center bg-slate-900 text-slate-400 font-mono text-xs rounded-2xl border border-slate-800">
        Loading Peta RBI 1209-444 Tanjung Priok GIS Engine...
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
    } else if (currentSimMinute === 5) {
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
            <span>Complete Operation</span>
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

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
            <Compass className="w-4 h-4 text-[#F5B800] shrink-0 mt-0.5" />
            <span>
              Tip: Klik pada <strong>Kapal MV Nusantara</strong>, <strong>Crane QC</strong>, atau <strong>Truk Terminal</strong> pada layar pelabuhan untuk menginspeksi telemetri operasional.
            </span>
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col min-h-[440px] lg:min-h-[520px]">
          <InteractivePortMap />
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

      {pendingCheckpoint && (
        <Modal
          isOpen={true}
          onClose={() => {}}
          title="DISPATCH OTORISASI OPERASI PELABUHAN"
          referenceNumber={pendingCheckpoint.timeString}
        >
          <div className="space-y-6 text-slate-100 font-sans">
            <div className="p-4 rounded-xl bg-amber-500/10 border-2 border-amber-500/50 flex items-start gap-3.5">
              <Radio className="w-6 h-6 text-[#F5B800] shrink-0 mt-0.5 animate-pulse" />
              <div className="space-y-1">
                <div className="text-[11px] font-mono uppercase font-bold text-amber-300">
                  Dari: {pendingCheckpoint.sender}
                </div>
                <h3 className="text-base font-bold text-white">
                  {pendingCheckpoint.title}
                </h3>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed bg-slate-900 p-4 rounded-xl border border-slate-800">
              {pendingCheckpoint.description}
            </p>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={handleApprove}
                className="px-6 py-3 rounded-xl bg-[#F5B800] hover:bg-[#D99B00] text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all transform hover:scale-[1.02]"
              >
                <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                <span>{pendingCheckpoint.actionButtonText}</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {selectedEquipment && (
        <Modal
          isOpen={true}
          onClose={() => inspectEquipment(null)}
          title={`INSPEKSI TELEMETRI OPERASIONAL: ${selectedEquipment.name}`}
          referenceNumber={selectedEquipment.id}
        >
          <div className="space-y-6 text-slate-100 font-sans">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-[#F5B800] border border-slate-700 font-bold">
                  {selectedEquipment.type === "VESSEL" ? (
                    <Ship className="w-5 h-5" />
                  ) : selectedEquipment.type === "CRANE" ? (
                    <Layers className="w-5 h-5" />
                  ) : (
                    <Truck className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {selectedEquipment.name}
                  </h3>
                  <div className="text-[11px] font-mono text-slate-400">
                    ID: {selectedEquipment.id}
                  </div>
                </div>
              </div>

              <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {selectedEquipment.status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {selectedEquipment.metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex justify-between items-center"
                >
                  <span className="text-slate-400">{m.label}:</span>
                  <span className="font-mono font-bold text-slate-200">
                    {m.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs">
              <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider block">
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
