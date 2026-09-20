"use client";

import React from "react";
import {
  Ship,
  ArrowRight,
  ArrowLeft,
  FileText,
  AlertTriangle,
  UserCheck,
  CheckCircle2,
  Anchor,
  Compass,
  FileCheck,
} from "lucide-react";
import { useTrainingStore } from "@/store/useTrainingStore";
import { TrainingState } from "@/types/simulation";

export function BriefingScreen() {
  const { scenario, setStep } = useTrainingStore();
  const vessel = scenario.vessel;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      {/* Navigation breadcrumb */}
      <button
        onClick={() => setStep(TrainingState.SCENARIO_SELECTION)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Scenario Overview
      </button>

      {/* Main Mission Briefing Card */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl space-y-6">
        {/* Phase Header */}
        <div className="bg-gradient-to-r from-[#08182B] via-[#0E2239] to-[#162E4D] border-b border-slate-800 p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[#F5B800] text-xs font-bold uppercase tracking-wider">
              <span>●</span> Phase 01: Mission Briefing & Directives
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Vessel Arrival Operational Order
            </h1>
            <p className="text-slate-300 text-sm max-w-xl">
              Target: <strong className="text-white">{vessel.name}</strong> · ETA{" "}
              <span className="font-mono text-amber-300">{vessel.eta} WIB</span>{" "}
              · Port of MIPS Fairway
            </p>
          </div>

          <div className="px-4 py-2 rounded-xl bg-slate-950/70 border border-slate-700/60 text-right self-start md:self-auto">
            <div className="text-[10px] uppercase font-bold text-slate-400">
              Assigned Role
            </div>
            <div className="text-xs font-bold text-amber-400">
              Cadet Port Operations Officer
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          {/* Training Task Directives Card (PRD Section 11) */}
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Ship className="w-4 h-4 text-[#F5B800]" /> Operational Training Task
              </span>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                Inbound ETA: 08:00 WIB
              </span>
            </div>

            <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
              <p>
                Container vessel <strong className="text-white">MV Nusantara</strong> is scheduled to arrive at the port at <strong className="text-amber-300 font-mono">08:00 WIB</strong>.
              </p>
              <p>
                Your task is to examine the available operational document package (<em className="text-slate-200">Notice of Arrival, Vessel Manifest, Cargo Manifest, and Berth Specifications</em>), determine the appropriate berth according to physical restrictions, and oversee the vessel cargo operation to completion.
              </p>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Instruksi Pengawas:</strong> Perhatikan dengan teliti dimensi fisik kapal, batasan kedalaman air dermaga (Under Keel Clearance), dan informasi muatan di dalam dokumen sebelum mengambil keputusan sandar.
                </span>
              </div>
            </div>
          </div>

          {/* Instructor Advisory Directive (Capt. H. Gunawan - PRD Image 2) */}
          <div className="rounded-xl bg-[#08182B] border-2 border-amber-500/40 p-5 space-y-3 relative overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F5B800] text-slate-950 flex items-center justify-center font-bold shrink-0">
                <UserCheck className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  Capt. H. Gunawan
                  <span className="text-[10px] font-normal text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    Senior Port Operations Training Officer
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Mission Operational Directive · Mandatory Reading
                </p>
              </div>
            </div>

            <div className="text-sm text-slate-200 leading-relaxed pl-13 border-l-2 border-amber-500/50 my-2 italic">
              &quot;Cadet, pay close attention to the draft specifications in the manifest.{" "}
              <strong className="text-amber-300 not-italic">
                MV Nusantara is heavily loaded. Not all berths can accommodate her currently.
              </strong>{" "}
              Review the Berth Information sheet thoroughly before submitting your berth allocation.&quot;
            </div>
          </div>

          {/* Mission Directives Checklist */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-[#F5B800]" /> Operational Task Checklist
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#F5B800] mt-0.5 shrink-0" />
                <div className="text-xs space-y-1">
                  <div className="font-bold text-slate-200">1. Inspect Document Package</div>
                  <div className="text-slate-400">
                    Open and verify all 4 operational documents (Notice of Arrival, Vessel & Cargo Manifests, Berth Specs).
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#F5B800] mt-0.5 shrink-0" />
                <div className="text-xs space-y-1">
                  <div className="font-bold text-slate-200">2. Verify Berth Compatibility</div>
                  <div className="text-slate-400">
                    Cross-examine vessel LOA (280m) and Draft (10.2m) against Berth B-01 and B-02 physical limitations.
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#F5B800] mt-0.5 shrink-0" />
                <div className="text-xs space-y-1">
                  <div className="font-bold text-slate-200">3. Authorize Berth Assignment</div>
                  <div className="text-slate-400">
                    Submit the compliant berth decision to unlock automated terminal simulation.
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#F5B800] mt-0.5 shrink-0" />
                <div className="text-xs space-y-1">
                  <div className="font-bold text-slate-200">4. Supervise Cargo Performance</div>
                  <div className="text-slate-400">
                    Monitor container discharge timeline, twin crane moves/hour, and truck cycle utilization.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Navigation Bar */}
        <div className="px-6 sm:px-8 py-5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => setStep(TrainingState.SCENARIO_SELECTION)}
            className="px-4 py-2 rounded-lg text-slate-400 hover:text-white text-xs font-semibold"
          >
            Back
          </button>

          <button
            onClick={() => setStep(TrainingState.DOCUMENT_REVIEW)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F5B800] hover:bg-[#D99B00] text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 transition-all transform hover:scale-[1.02]"
          >
            <span>Review Documents</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
}
