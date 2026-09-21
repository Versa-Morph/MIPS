"use client";

import React from "react";
import {
  Ship,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  UserCheck,
  CheckCircle2,
  FileCheck,
  Radio,
  ShieldAlert,
  Volume2,
  Compass,
  Anchor,
} from "lucide-react";
import { useTrainingStore } from "@/store/useTrainingStore";
import { TrainingState } from "@/types/simulation";
import { getAssetPath } from "@/utils/assetPath";

export function BriefingScreen() {
  const { scenario, setStep } = useTrainingStore();
  const vessel = scenario.vessel;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans select-none">
      {/* Navigation Breadcrumbs */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep(TrainingState.SCENARIO_SELECTION)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/40 text-xs font-semibold text-slate-300 hover:text-cyan-400 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Scenario Overview</span>
        </button>

        <div className="hidden sm:flex items-center gap-2.5 font-mono text-xs text-slate-400">
          <span className="text-slate-500">STAGE</span>
          <span className="text-cyan-400 font-bold">02 / 07</span>
          <span className="text-slate-700">·</span>
          <span className="text-slate-300 font-semibold tracking-wider">
            EXECUTIVE BRIEFING & DIRECTIVES
          </span>
        </div>
      </div>

      {/* Main Mission Briefing Card */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl overflow-hidden shadow-2xl space-y-6">
        {/* Phase Header */}
        <div className="relative border-b border-slate-800/80 p-6 sm:p-8 text-white overflow-hidden bg-slate-950">
          {/* Subtle Ambient Gradient */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/95 to-slate-900/60" />
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(#38bdf8 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold tracking-wider">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>Phase 01: Mission Briefing & Directives</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-sans">
                Vessel Arrival Operational Order
              </h1>

              <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
                Target: <strong className="text-white font-semibold">{vessel.name}</strong> · ETA{" "}
                <span className="font-mono text-amber-400 font-bold">{vessel.eta} WIB</span>{" "}
                · Port of MIPS Fairway
              </p>
            </div>

            <div className="px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-right self-start md:self-auto backdrop-blur-md shadow-inner font-mono">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Assigned Role
              </div>
              <div className="text-xs font-bold text-cyan-400">
                Cadet Port Operations Officer
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Training Task Directives Card */}
          <div className="rounded-xl bg-slate-900/60 border border-slate-800/90 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2 font-mono">
                <Ship className="w-4 h-4 text-amber-400" /> Operational Training Task
              </span>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/30 font-semibold">
                Inbound ETA: 08:00 WIB
              </span>
            </div>

            <div className="space-y-3 text-sm text-slate-300 leading-relaxed font-sans">
              <p>
                Container vessel <strong className="text-white font-semibold">MV Nusantara</strong> is scheduled to arrive at the port at <strong className="text-amber-400 font-mono font-bold">08:00 WIB</strong>.
              </p>
              <p>
                Your task is to examine the available operational document package (<em className="text-slate-200">Notice of Arrival, Vessel Manifest, Cargo Manifest, and Berth Specifications</em>), determine the appropriate berth according to physical restrictions, and oversee the vessel cargo operation to completion.
              </p>
            </div>
          </div>

          {/* Instructor Advisory Directive (Capt. H. Gunawan) */}
          <div className="rounded-xl bg-slate-950/80 border border-amber-500/35 p-5 sm:p-6 space-y-4 relative overflow-hidden shadow-xl">
            {/* Header with Officer Profile */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <img
                    src={getAssetPath("/images/officer-gunawan.png")}
                    alt="Capt. H. Gunawan"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover ring-2 ring-amber-500/40 shadow-md bg-slate-800"
                  />
                  <div className="absolute -bottom-1 -right-1 p-1 bg-slate-950 rounded-full border border-amber-500/40">
                    <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-bold text-white flex flex-wrap items-center gap-2 font-sans">
                    <span>Capt. H. Gunawan</span>
                    <span className="text-[10px] font-mono font-normal text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                      Senior Port Operations Training Officer
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Mission Operational Directive · Mandatory Reading
                  </p>
                </div>
              </div>

              <div className="self-start sm:self-center px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-right font-mono">
                <span className="text-[10px] text-slate-400 block">OFFICIAL DISPATCH</span>
                <span className="text-xs font-bold text-cyan-400">VTS-PRIOK-0730</span>
              </div>
            </div>

            {/* Directive Quote / Dispatch Body */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-semibold text-slate-300">VHF RADIO DISPATCH TRANSCRIPT</span>
                <span className="text-slate-600">·</span>
                <span className="text-cyan-400 font-mono">CH 12 (156.600 MHz)</span>
              </div>

              <div className="pl-3.5 border-l-2 border-amber-400 text-sm sm:text-base text-slate-200 leading-relaxed italic font-sans">
                &quot;Cadet, pay close attention to the draft specifications in the manifest.{" "}
                <strong className="text-amber-300 not-italic font-semibold">
                  MV Nusantara is heavily loaded. Not all berths can accommodate her currently.
                </strong>{" "}
                Review the Berth Information sheet thoroughly before submitting your berth allocation.&quot;
              </div>
            </div>
          </div>

          {/* Safety Guidance Callout */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-slate-300 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="text-white block font-semibold text-sm font-sans">
                Instruksi Pengawas (Harbor Master Safety Advisory):
              </strong>
              <span className="leading-relaxed block text-slate-300 font-sans">
                Perhatikan dengan teliti dimensi fisik kapal, batasan kedalaman air dermaga (Under Keel Clearance), dan informasi muatan di dalam dokumen sebelum mengambil keputusan sandar.
              </span>
            </div>
          </div>

          {/* Mission Directives Checklist */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 font-mono">
                <FileCheck className="w-4 h-4 text-amber-400" /> Operational Task Checklist
              </h3>
              <span className="text-[10px] font-mono text-slate-400">4 PROGRESSIVE PHASES</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/90 flex items-start gap-3.5 hover:border-slate-700 transition-colors">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-xs space-y-1">
                  <div className="font-bold text-white flex items-center gap-2 font-sans text-sm">
                    <span className="font-mono text-cyan-400 text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                      STEP 01
                    </span>
                    <span>1. Inspect Document Package</span>
                  </div>
                  <div className="text-slate-400 leading-relaxed font-sans text-xs">
                    Open and verify all 4 operational documents (Notice of Arrival, Vessel & Cargo Manifests, Berth Specs).
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/90 flex items-start gap-3.5 hover:border-slate-700 transition-colors">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-xs space-y-1">
                  <div className="font-bold text-white flex items-center gap-2 font-sans text-sm">
                    <span className="font-mono text-cyan-400 text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                      STEP 02
                    </span>
                    <span>2. Verify Berth Compatibility</span>
                  </div>
                  <div className="text-slate-400 leading-relaxed font-sans text-xs">
                    Cross-examine vessel LOA (280m) and Draft (10.2m) against Berth B-01 and B-02 physical limitations.
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/90 flex items-start gap-3.5 hover:border-slate-700 transition-colors">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-xs space-y-1">
                  <div className="font-bold text-white flex items-center gap-2 font-sans text-sm">
                    <span className="font-mono text-cyan-400 text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                      STEP 03
                    </span>
                    <span>3. Authorize Berth Assignment</span>
                  </div>
                  <div className="text-slate-400 leading-relaxed font-sans text-xs">
                    Submit the compliant berth decision to unlock automated terminal simulation.
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/90 flex items-start gap-3.5 hover:border-slate-700 transition-colors">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-xs space-y-1">
                  <div className="font-bold text-white flex items-center gap-2 font-sans text-sm">
                    <span className="font-mono text-cyan-400 text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                      STEP 04
                    </span>
                    <span>4. Supervise Cargo Performance</span>
                  </div>
                  <div className="text-slate-400 leading-relaxed font-sans text-xs">
                    Monitor container discharge timeline, twin crane moves/hour, and truck cycle utilization.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Navigation Bar */}
        <div className="px-6 sm:px-8 py-4 bg-slate-950/90 border-t border-slate-800/80 flex items-center justify-between">
          <button
            onClick={() => setStep(TrainingState.SCENARIO_SELECTION)}
            className="px-4 py-2 rounded-lg text-slate-400 hover:text-white text-xs font-semibold font-mono transition-colors"
          >
            Back
          </button>

          <button
            onClick={() => setStep(TrainingState.DOCUMENT_REVIEW)}
            className="cta-amber inline-flex items-center gap-2 px-7 py-3 rounded-xl font-sans font-extrabold text-sm tracking-wide group"
          >
            <span>Review Documents</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
