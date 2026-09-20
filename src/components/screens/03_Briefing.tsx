"use client";

import {
  Ship,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  UserCheck,
  CheckCircle2,
  FileCheck,
} from "lucide-react";
import { useTrainingStore } from "@/store/useTrainingStore";
import { TrainingState } from "@/types/simulation";
import { getAssetPath } from "@/utils/assetPath";

export function BriefingScreen() {
  const { scenario, setStep } = useTrainingStore();
  const vessel = scenario.vessel;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn font-sans select-none">
      {/* Navigation breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep(TrainingState.SCENARIO_SELECTION)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg glass-panel text-xs font-semibold text-slate-300 hover:text-tactical-cyan hover:border-tactical-cyan/40 transition-all font-mono"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Scenario Overview</span>
        </button>

        <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-slate-400">
          <span>MISSION STAGE:</span>
          <span className="text-tactical-cyan font-bold">02 / 07</span>
          <span className="text-slate-600">|</span>
          <span>EXECUTIVE BRIEFING</span>
        </div>
      </div>

      {/* Main Mission Briefing Card */}
      <div className="rounded-2xl glass-panel border border-glass-border overflow-hidden shadow-glass space-y-6">
        {/* Phase Header */}
        <div className="relative border-b border-glass-border p-6 sm:p-8 text-white overflow-hidden">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-abyssal via-abyssal-surface/90 to-[#0c1c38]/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-abyssal-surface via-transparent to-transparent" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-amber/15 border border-electric-amber/40 text-electric-amber text-xs font-bold uppercase tracking-wider font-mono">
                <span className="w-2 h-2 rounded-full bg-electric-amber animate-pulse">●</span>
                <span>Phase 01: Mission Briefing & Directives</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">
                Vessel Arrival Operational Order
              </h1>
              <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
                Target: <strong className="text-white">{vessel.name}</strong> · ETA{" "}
                <span className="font-mono text-electric-amber font-semibold">{vessel.eta} WIB</span>{" "}
                · Port of MIPS Fairway
              </p>
            </div>

            <div className="px-4 py-2.5 rounded-xl bg-abyssal/80 border border-slate-700/80 text-right self-start md:self-auto backdrop-blur-md shadow-inner font-mono">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Assigned Role
              </div>
              <div className="text-xs font-bold text-tactical-cyan">
                Cadet Port Operations Officer
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Training Task Directives Card */}
          <div className="rounded-xl glass-panel border border-glass-border p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-glass-border pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-electric-amber flex items-center gap-2 font-mono">
                <Ship className="w-4 h-4 text-electric-amber" /> Operational Training Task
              </span>
              <span className="text-xs font-mono text-safety-emerald bg-safety-emerald/10 px-2.5 py-0.5 rounded-lg border border-safety-emerald/30 font-semibold">
                Inbound ETA: 08:00 WIB
              </span>
            </div>

            <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
              <p>
                Container vessel <strong className="text-white font-semibold">MV Nusantara</strong> is scheduled to arrive at the port at <strong className="text-electric-amber font-mono font-semibold">08:00 WIB</strong>.
              </p>
              <p>
                Your task is to examine the available operational document package (<em className="text-slate-200">Notice of Arrival, Vessel Manifest, Cargo Manifest, and Berth Specifications</em>), determine the appropriate berth according to physical restrictions, and oversee the vessel cargo operation to completion.
              </p>
            </div>
          </div>

          {/* Instructor Advisory Directive (Capt. H. Gunawan) */}
          <div className="rounded-xl bg-abyssal-surface/80 border-2 border-electric-amber/40 p-5 sm:p-6 space-y-4 relative overflow-hidden shadow-glass backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/60 pb-4">
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <img
                    src={getAssetPath("/images/officer-gunawan.png")}
                    alt="Capt. H. Gunawan"
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-2 ring-tactical-cyan/60 shadow-cyan-glow bg-slate-800"
                  />
                  <div className="absolute -bottom-1 -right-1 p-1 bg-abyssal rounded-full border border-tactical-cyan/40">
                    <UserCheck className="w-3.5 h-3.5 text-tactical-cyan" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-bold text-white flex flex-wrap items-center gap-2">
                    <span>Capt. H. Gunawan</span>
                    <span className="text-[10px] font-mono font-normal text-slate-300 bg-slate-800/90 border border-slate-700 px-2 py-0.5 rounded-md">
                      Senior Port Operations Training Officer
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Mission Operational Directive · Mandatory Reading
                  </p>
                </div>
              </div>

              <div className="self-start sm:self-center px-3 py-1.5 rounded-lg bg-abyssal/90 border border-slate-700/80 text-right font-mono">
                <span className="text-[10px] text-slate-400 block">OFFICIAL DISPATCH</span>
                <span className="text-xs font-bold text-tactical-cyan">VTS-PRIOK-0730</span>
              </div>
            </div>

            <div className="pl-4 border-l-4 border-electric-amber my-2 text-sm sm:text-base text-slate-200 leading-relaxed italic">
              &quot;Cadet, pay close attention to the draft specifications in the manifest.{" "}
              <strong className="text-electric-amber not-italic font-semibold">
                MV Nusantara is heavily loaded. Not all berths can accommodate her currently.
              </strong>{" "}
              Review the Berth Information sheet thoroughly before submitting your berth allocation.&quot;
            </div>
          </div>

          {/* Safety Guidance Callout */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-slate-300 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-electric-amber shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="text-white block font-semibold">
                Instruksi Pengawas (Harbor Master Safety Advisory):
              </strong>
              <span className="leading-relaxed block">
                Perhatikan dengan teliti dimensi fisik kapal, batasan kedalaman air dermaga (Under Keel Clearance), dan informasi muatan di dalam dokumen sebelum mengambil keputusan sandar.
              </span>
            </div>
          </div>

          {/* Mission Directives Checklist */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 font-mono">
              <FileCheck className="w-4 h-4 text-electric-amber" /> Operational Task Checklist
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl glass-panel border border-glass-border flex items-start gap-3 hover:border-tactical-cyan/40 transition-colors">
                <div className="w-6 h-6 rounded-lg bg-safety-emerald/10 border border-safety-emerald/30 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-safety-emerald" />
                </div>
                <div className="text-xs space-y-1">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span className="font-mono text-tactical-cyan text-[10px] px-1.5 py-0.5 rounded bg-tactical-cyan/10 border border-tactical-cyan/20">STEP 01</span>
                    <span>1. Inspect Document Package</span>
                  </div>
                  <div className="text-slate-400 leading-relaxed">
                    Open and verify all 4 operational documents (Notice of Arrival, Vessel & Cargo Manifests, Berth Specs).
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl glass-panel border border-glass-border flex items-start gap-3 hover:border-tactical-cyan/40 transition-colors">
                <div className="w-6 h-6 rounded-lg bg-safety-emerald/10 border border-safety-emerald/30 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-safety-emerald" />
                </div>
                <div className="text-xs space-y-1">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span className="font-mono text-tactical-cyan text-[10px] px-1.5 py-0.5 rounded bg-tactical-cyan/10 border border-tactical-cyan/20">STEP 02</span>
                    <span>2. Verify Berth Compatibility</span>
                  </div>
                  <div className="text-slate-400 leading-relaxed">
                    Cross-examine vessel LOA (280m) and Draft (10.2m) against Berth B-01 and B-02 physical limitations.
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl glass-panel border border-glass-border flex items-start gap-3 hover:border-tactical-cyan/40 transition-colors">
                <div className="w-6 h-6 rounded-lg bg-safety-emerald/10 border border-safety-emerald/30 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-safety-emerald" />
                </div>
                <div className="text-xs space-y-1">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span className="font-mono text-tactical-cyan text-[10px] px-1.5 py-0.5 rounded bg-tactical-cyan/10 border border-tactical-cyan/20">STEP 03</span>
                    <span>3. Authorize Berth Assignment</span>
                  </div>
                  <div className="text-slate-400 leading-relaxed">
                    Submit the compliant berth decision to unlock automated terminal simulation.
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl glass-panel border border-glass-border flex items-start gap-3 hover:border-tactical-cyan/40 transition-colors">
                <div className="w-6 h-6 rounded-lg bg-safety-emerald/10 border border-safety-emerald/30 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-safety-emerald" />
                </div>
                <div className="text-xs space-y-1">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span className="font-mono text-tactical-cyan text-[10px] px-1.5 py-0.5 rounded bg-tactical-cyan/10 border border-tactical-cyan/20">STEP 04</span>
                    <span>4. Supervise Cargo Performance</span>
                  </div>
                  <div className="text-slate-400 leading-relaxed">
                    Monitor container discharge timeline, twin crane moves/hour, and truck cycle utilization.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Navigation Bar */}
        <div className="px-6 sm:px-8 py-5 bg-abyssal-surface/90 border-t border-glass-border flex items-center justify-between">
          <button
            onClick={() => setStep(TrainingState.SCENARIO_SELECTION)}
            className="px-4 py-2 rounded-lg text-slate-400 hover:text-white text-xs font-semibold font-mono transition-colors"
          >
            Back
          </button>

          <button
            onClick={() => setStep(TrainingState.DOCUMENT_REVIEW)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-electric-amber hover:bg-electric-amber-hover text-slate-950 font-bold text-sm shadow-amber-glow transition-all transform hover:scale-[1.02]"
          >
            <span>Review Documents</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
}
