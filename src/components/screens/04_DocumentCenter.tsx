"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  CheckCircle2,
  Circle,
  ArrowRight,
  ArrowLeft,
  Anchor,
  Ship,
  MapPin,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  Download,
  Stamp,
  Layers,
} from "lucide-react";
import { useTrainingStore } from "@/store/useTrainingStore";
import { TrainingState } from "@/types/simulation";
import { DocumentType } from "@/types/domain";

export function DocumentCenterScreen() {
  const { documents, markDocumentViewed, setStep } = useTrainingStore();

  const [selectedType, setSelectedType] = useState<DocumentType>("ARRIVAL_NOTICE");
  const [showPdfEmbed, setShowPdfEmbed] = useState<boolean>(false);

  // Analysis Checklist State (PRD Image 3)
  const [taskDraftIdentified, setTaskDraftIdentified] = useState(false);
  const [taskLengthVerified, setTaskLengthVerified] = useState(false);
  const [taskBerthChecked, setTaskBerthChecked] = useState(false);

  // Track viewing on select
  useEffect(() => {
    markDocumentViewed(selectedType, 15);
  }, [selectedType, markDocumentViewed]);

  const activeDoc = documents.find((d) => d.type === selectedType) || documents[0];

  // Auto-progress checklist as cadet reviews relevant documents
  const handleSelectDoc = (type: DocumentType) => {
    setSelectedType(type);
    markDocumentViewed(type, 15);

    if (type === "ARRIVAL_NOTICE") {
      setTaskDraftIdentified(true);
    }
    if (type === "VESSEL_MANIFEST") {
      setTaskLengthVerified(true);
    }
    if (type === "BERTH_INFORMATION") {
      setTaskBerthChecked(true);
    }
  };

  const isAnalysisComplete = taskDraftIdentified && taskLengthVerified && taskBerthChecked;

  const handleProceed = () => {
    setStep(TrainingState.DECISION);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 space-y-4 animate-fadeIn select-none">
      {/* Top Breadcrumb Header Bar */}
      <div className="rounded-xl bg-[#08182B] border border-slate-800 px-4 py-3 flex items-center justify-between shadow-md text-white text-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setStep(TrainingState.BRIEFING)}
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Briefing</span>
          </button>
          <span className="text-slate-600">/</span>
          <div className="flex items-center gap-2 font-bold tracking-wider text-amber-400">
            <span>■ 02 ANALYSIS · DOCUMENT CENTER WORKSPACE</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
          <span>Scenario: SCN-001</span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 font-bold">
            {documents.filter((d) => d.isViewed).length} / {documents.length} Docs Inspected
          </span>
        </div>
      </div>

      {/* 3-Panel Main Workspace Grid (PRD Image 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* PANEL 1 (LEFT, 3 cols): Cargo & Notice Package Selector + Technical Summary */}
        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-3 shadow-lg">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-2.5 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#F5B800]" />
              CARGO & NOTICE PACKAGE
            </h2>

            <div className="space-y-2">
              {documents.map((doc, idx) => {
                const isActive = doc.type === selectedType;
                return (
                  <div
                    key={doc.id}
                    onClick={() => handleSelectDoc(doc.type)}
                    className={`cursor-pointer rounded-xl p-3 border transition-all text-xs flex flex-col justify-between ${
                      isActive
                        ? "bg-[#0E2239] border-l-4 border-l-[#F5B800] border-slate-700 shadow-md"
                        : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] text-slate-500">
                        DOC 0{idx + 1}
                      </span>
                      {doc.isViewed ? (
                        <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> VERIFIED
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500">UNREVIEWED</span>
                      )}
                    </div>

                    <div className="font-bold text-slate-100 group-hover:text-amber-400">
                      {doc.title}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5">
                      {doc.referenceNumber}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Pinned Widget: Technical Summary (PRD Image 3) */}
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 shadow-lg space-y-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block border-b border-slate-800 pb-1.5">
              TECHNICAL SUMMARY
            </span>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-slate-950">
                <span className="text-slate-400 font-sans">Length (LOA):</span>
                <span className="font-bold text-white">280.0 m</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-950">
                <span className="text-slate-400 font-sans">Arrival Draft:</span>
                <span className="font-bold text-red-400 bg-red-950/60 px-1 rounded">10.20 m</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-950">
                <span className="text-slate-400 font-sans">Cargo Lot:</span>
                <span className="font-bold text-sky-400">50 Containers</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400 font-sans">DG Class:</span>
                <span className="font-bold text-amber-400">Class 4.1 On Deck</span>
              </div>
            </div>
          </div>
        </div>

        {/* PANEL 2 (CENTER, 6 cols): Formal Document Viewer Sheet (PRD Image 3) */}
        <div className="lg:col-span-6 space-y-3">
          <div className="rounded-2xl bg-white text-slate-900 border border-slate-300 shadow-2xl p-6 sm:p-8 space-y-5 font-sans min-h-[580px] relative overflow-hidden">
            {/* Header / Reference */}
            <div className="border-b-2 border-slate-900 pb-3 flex flex-wrap items-start justify-between gap-2">
              <div>
                <h1 className="text-base sm:text-lg font-black uppercase tracking-tight text-slate-900">
                  {activeDoc.content.header}
                </h1>
                <div className="text-[11px] text-slate-600 font-mono mt-0.5">
                  REF: {activeDoc.referenceNumber} · {activeDoc.content.date}
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block">
                  JAKARTA PORT AUTHORITY
                </span>
                <span className="text-[9px] text-slate-500 uppercase font-mono">
                  OPERATIONAL DEPT
                </span>
              </div>
            </div>

            {/* Toggle Real PDF view option */}
            <div className="flex items-center justify-between bg-slate-100 p-2 rounded-lg text-xs">
              <span className="text-slate-600 font-medium">
                Official Regulatory Document Sheet
              </span>
              <button
                onClick={() => setShowPdfEmbed(!showPdfEmbed)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-900 text-white font-semibold text-[11px] transition-colors"
              >
                {showPdfEmbed ? (
                  <span>View Structured Sheet</span>
                ) : (
                  <>
                    <ExternalLink className="w-3 h-3" />
                    <span>View Official PDF</span>
                  </>
                )}
              </button>
            </div>

            {showPdfEmbed && activeDoc.pdfUrl ? (
              <div className="w-full h-[450px] rounded-lg overflow-hidden border border-slate-300 bg-slate-100">
                <iframe
                  src={`${activeDoc.pdfUrl}#toolbar=0`}
                  className="w-full h-full border-0"
                  title={activeDoc.title}
                />
              </div>
            ) : (
              /* Structured Document Representation matching Image 3 */
              <div className="space-y-4 text-xs">
                {/* 2x2 Grid: Vessel Identification */}
                <div className="grid grid-cols-2 gap-2.5 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-500 block">
                      VESSEL NAME
                    </span>
                    <strong className="text-sm font-black text-slate-900">
                      MV NUSANTARA
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-500 block">
                      VESSEL TYPE
                    </span>
                    <strong className="text-xs font-bold text-slate-800">
                      Container Vessel (Fully Cellular)
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-500 block">
                      CALL SIGN
                    </span>
                    <strong className="text-xs font-mono font-bold text-slate-800">
                      PK-47A (IMO 1234567)
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-500 block">
                      ESTIMATED TIME OF ARRIVAL (ETA)
                    </span>
                    <strong className="text-xs font-mono font-bold text-amber-700">
                      2026-10-14 08:00 WIB
                    </strong>
                  </div>
                </div>

                {/* Section 2: Dimensions and Load condition (PRD Image 3) */}
                <div className="space-y-2">
                  <div className="bg-slate-200 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-slate-700">
                    VESSEL DIMENSIONS & LOAD CONDITION
                  </div>

                  <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg overflow-hidden">
                    <div className="flex justify-between px-3 py-2 bg-white">
                      <span className="text-slate-600">Length Overall (LOA):</span>
                      <strong className="font-mono text-slate-900 font-bold">
                        280.00 Meters
                      </strong>
                    </div>
                    <div className="flex justify-between px-3 py-2 bg-white">
                      <span className="text-slate-600">Breadth Moulded (Beam):</span>
                      <strong className="font-mono text-slate-900 font-bold">
                        42.50 Meters
                      </strong>
                    </div>
                    {/* CRITICAL HIGHLIGHT IN RED: Arrival Draft (Aft) */}
                    <div className="flex justify-between px-3 py-2 bg-red-50">
                      <span className="text-red-900 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                        Current Arrival Draft (Aft):
                      </span>
                      <strong className="font-mono text-red-600 font-black text-sm">
                        10.20 Meters (CRITICAL)
                      </strong>
                    </div>
                    <div className="flex justify-between px-3 py-2 bg-white">
                      <span className="text-slate-600">Current Arrival Draft (Fwd):</span>
                      <strong className="font-mono text-slate-800">8.80 Meters</strong>
                    </div>
                  </div>
                </div>

                {/* Section 3: Berth Request Details (PRD Image 3) */}
                <div className="space-y-1.5">
                  <div className="bg-slate-200 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-slate-700">
                    BERTH REQUEST DETAILS & RESTRICTIONS
                  </div>
                  <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                    &quot;Requesting immediate berthing for priority discharge of 1,200 TEUs. Dangerous Goods (Class 4.1) present on deck sector 03. Requires minimum 3 Shore Cranes with outreach &gt; 40m.&quot;
                  </p>
                </div>

                {/* Document Footer Signatures */}
                <div className="pt-4 border-t border-slate-300 flex justify-between items-end text-[11px] text-slate-600">
                  <div>
                    <div className="w-32 border-b border-slate-400 mb-1"></div>
                    <span>Master&apos;s Signature: Capt. Bambang S.</span>
                  </div>
                  <div className="text-right">
                    <div className="border border-dashed border-emerald-700 text-emerald-800 font-mono font-bold text-[9px] px-2 py-0.5 rounded inline-block mb-1">
                      PORT AGENT STAMP: VERIFIED
                    </div>
                    <div>KSOP Tanjung Priok Duty Officer</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PANEL 3 (RIGHT, 3 cols): Analysis Progress & Decision Action (PRD Image 3) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-4 shadow-lg">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-2.5 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#F5B800]" />
              ANALYSIS PROGRESS
            </h2>

            {/* Interactive Checklist Tasks */}
            <div className="space-y-3">
              {/* Task 1: Draft Requirement */}
              <div
                onClick={() => setTaskDraftIdentified(true)}
                className={`cursor-pointer p-3 rounded-xl border transition-all flex items-start gap-3 ${
                  taskDraftIdentified
                    ? "bg-emerald-950/30 border-emerald-500/50 text-slate-200"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="pt-0.5">
                  {taskDraftIdentified ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-600" />
                  )}
                </div>
                <div className="text-xs">
                  <div className={`font-bold ${taskDraftIdentified ? "text-white" : "text-slate-300"}`}>
                    Identify Draft Requirement
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                    {taskDraftIdentified ? "✓ 10.2m extracted from NOA" : "Click to log 10.2m draft"}
                  </div>
                </div>
              </div>

              {/* Task 2: Verify Vessel Length */}
              <div
                onClick={() => setTaskLengthVerified(true)}
                className={`cursor-pointer p-3 rounded-xl border transition-all flex items-start gap-3 ${
                  taskLengthVerified
                    ? "bg-emerald-950/30 border-emerald-500/50 text-slate-200"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="pt-0.5">
                  {taskLengthVerified ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-600" />
                  )}
                </div>
                <div className="text-xs">
                  <div className={`font-bold ${taskLengthVerified ? "text-white" : "text-slate-300"}`}>
                    Verify Vessel Length
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                    {taskLengthVerified ? "✓ 280m LOA matches Port Spec" : "Click to verify 280m LOA"}
                  </div>
                </div>
              </div>

              {/* Task 3: Check Berth Availability */}
              <div
                onClick={() => setTaskBerthChecked(true)}
                className={`cursor-pointer p-3 rounded-xl border transition-all flex items-start gap-3 ${
                  taskBerthChecked
                    ? "bg-emerald-950/30 border-emerald-500/50 text-slate-200"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="pt-0.5">
                  {taskBerthChecked ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-600" />
                  )}
                </div>
                <div className="text-xs">
                  <div className={`font-bold ${taskBerthChecked ? "text-white" : "text-slate-300"}`}>
                    Check Berth Availability
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                    {taskBerthChecked ? "✓ Open Berth Specs to evaluate" : "Click to evaluate Berth B-01/02"}
                  </div>
                </div>
              </div>
            </div>

            {/* Key Insight Found Callout Box (PRD Image 3) */}
            <div className="rounded-xl bg-amber-500/10 border-2 border-amber-500/40 p-3.5 space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-[#F5B800] uppercase text-[11px]">
                <Lightbulb className="w-4 h-4" />
                <span>Key Insight Found:</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Draft of <strong className="text-amber-300">10.2m</strong> requires berths with clear water depth under chart datum exceeding <strong className="text-white">11.5m</strong> (+1.3m UKC safety clearance).
              </p>
            </div>

            {/* Primary Action Button (PRD Image 3) */}
            <div className="pt-2">
              <button
                onClick={handleProceed}
                disabled={!isAnalysisComplete}
                className={`w-full py-3.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg ${
                  isAnalysisComplete
                    ? "bg-[#08182B] hover:bg-[#0E2239] text-[#F5B800] border-2 border-[#F5B800] shadow-amber-500/20 transform hover:scale-[1.02]"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                }`}
              >
                <span>MAKE BERTHING DECISION</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
              {!isAnalysisComplete && (
                <span className="text-[10px] text-slate-500 block text-center mt-1.5">
                  Complete all 3 checklist tasks to unlock decision
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
