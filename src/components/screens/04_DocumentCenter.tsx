"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  ExternalLink,
  Download,
  Layers,
  FileText,
  HelpCircle,
  ClipboardCheck,
} from "lucide-react";
import { useTrainingStore } from "@/store/useTrainingStore";
import { TrainingState } from "@/types/simulation";
import { DocumentType } from "@/types/domain";

export function DocumentCenterScreen() {
  const { documents, markDocumentViewed, setStep } = useTrainingStore();

  const [selectedType, setSelectedType] = useState<DocumentType>("ARRIVAL_NOTICE");

  // Interactive Cadet Worksheet Answers (Real Assignment Task)
  const [selectedDraft, setSelectedDraft] = useState<string>("");
  const [selectedLoa, setSelectedLoa] = useState<string>("");
  const [selectedUkcDepth, setSelectedUkcDepth] = useState<string>("");

  useEffect(() => {
    markDocumentViewed(selectedType, 15);
  }, [selectedType, markDocumentViewed]);

  const activeDoc =
    documents.find((d) => d.type === selectedType) || documents[0];

  const handleSelectDoc = (type: DocumentType) => {
    setSelectedType(type);
    markDocumentViewed(type, 15);
  };

  // Correct answers from official documents
  const isDraftCorrect = selectedDraft === "10.20";
  const isLoaCorrect = selectedLoa === "280.0";
  const isUkcDepthCorrect = selectedUkcDepth === "11.50";

  const isAnalysisComplete =
    isDraftCorrect && isLoaCorrect && isUkcDepthCorrect;

  const handleProceed = () => {
    setStep(TrainingState.DECISION);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 space-y-4 animate-fadeIn select-none">
      {/* Top Navigation Bar */}
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

      {/* 3-Panel Integrated Workspace */}
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
                    <div className="text-[11px] text-slate-400 truncate mt-0.5 font-mono">
                      {doc.referenceNumber}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Technical Summary Card (PRD Image 3) */}
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 shadow-lg space-y-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block border-b border-slate-800 pb-1.5">
              TECHNICAL SUMMARY
            </span>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-slate-950">
                <span className="text-slate-400 font-sans">Length (LOA):</span>
                <span className="font-bold text-white">
                  {isLoaCorrect ? "280.0 m" : "-- m"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-950">
                <span className="text-slate-400 font-sans">Arrival Draft:</span>
                <span
                  className={`font-bold px-1 rounded ${
                    isDraftCorrect
                      ? "text-red-400 bg-red-950/60"
                      : "text-slate-500"
                  }`}
                >
                  {isDraftCorrect ? "10.20 m" : "-- m"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-950">
                <span className="text-slate-400 font-sans">Controlling Depth:</span>
                <span
                  className={`font-bold px-1 rounded ${
                    isUkcDepthCorrect
                      ? "text-emerald-400 bg-emerald-950/60"
                      : "text-slate-500"
                  }`}
                >
                  {isUkcDepthCorrect ? "11.50 m (Req)" : "-- m"}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400 font-sans">Cargo Lot:</span>
                <span className="font-bold text-sky-400">50 Containers</span>
              </div>
            </div>
          </div>
        </div>

        {/* PANEL 2 (CENTER, 6 cols): Real PDF Document Viewer (Direct File Render) */}
        <div className="lg:col-span-6 space-y-3">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 flex flex-col min-h-[620px]">
            {/* Header / Document Reference & File Actions */}
            <div className="border-b border-slate-800 pb-3 mb-3 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#F5B800] text-slate-950 flex items-center justify-center font-bold">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h1 className="text-sm font-bold text-white uppercase tracking-tight">
                    {activeDoc.title}
                  </h1>
                  <span className="font-mono text-[11px] text-slate-400">
                    REF: {activeDoc.referenceNumber}
                  </span>
                </div>
              </div>

              {/* Direct File Action Buttons */}
              <div className="flex items-center gap-1.5">
                {activeDoc.pdfUrl && (
                  <>
                    <a
                      href={activeDoc.pdfUrl}
                      download
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                      title="Download original PDF file"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                    <a
                      href={activeDoc.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                      title="Open PDF in new browser tab"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </>
                )}
              </div>
            </div>

            {/* Direct Real PDF Iframe Render */}
            <div className="flex-1 w-full min-h-[540px] rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner">
              {activeDoc.pdfUrl ? (
                <iframe
                  src={`${activeDoc.pdfUrl}#toolbar=1`}
                  className="w-full h-full min-h-[540px] border-0"
                  title={activeDoc.title}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                  Document file unavailable.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* PANEL 3 (RIGHT, 3 cols): Analysis Progress & Cadet Operational Worksheet */}
        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-4 shadow-lg">
            <div className="border-b border-slate-800 pb-2.5">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4 text-[#F5B800]" />
                ANALYSIS PROGRESS
              </h2>
              <p className="text-[10px] text-slate-400 mt-1">
                Tugas Analisis Taruna: Baca berkas PDF resmi di tengah, lalu temukan dan jawab parameter di bawah ini.
              </p>
            </div>

            {/* Real Assignment Form Tasks */}
            <div className="space-y-4 text-xs">
              {/* Task 1: Identify Draft Requirement */}
              <div
                className={`p-3 rounded-xl border transition-all space-y-2 ${
                  isDraftCorrect
                    ? "bg-emerald-950/30 border-emerald-500/50 text-slate-200"
                    : selectedDraft
                    ? "bg-red-950/20 border-red-500/40 text-slate-300"
                    : "bg-slate-950 border-slate-800 text-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs flex items-center gap-1.5">
                    {isDraftCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : selectedDraft ? (
                      <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[10px] text-slate-500">
                        1
                      </span>
                    )}
                    Identify Draft Requirement
                  </span>
                  {isDraftCorrect && (
                    <span className="text-[10px] font-mono font-bold text-emerald-400">
                      ✓ Valid
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-400 leading-snug">
                  Berapa Maximum Arrival Draft (Aft) MV Nusantara pada dokumen NOA?
                </p>

                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  {[
                    { val: "8.80", label: "Draft 8.80m" },
                    { val: "10.20", label: "Draft 10.20m" },
                    { val: "12.50", label: "Draft 12.50m" },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => setSelectedDraft(opt.val)}
                      className={`py-1.5 px-2 rounded-lg font-mono text-[11px] font-bold border transition-all ${
                        selectedDraft === opt.val
                          ? opt.val === "10.20"
                            ? "bg-emerald-600 text-white border-emerald-400"
                            : "bg-red-600 text-white border-red-400"
                          : "bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Task 2: Verify Vessel Length */}
              <div
                className={`p-3 rounded-xl border transition-all space-y-2 ${
                  isLoaCorrect
                    ? "bg-emerald-950/30 border-emerald-500/50 text-slate-200"
                    : selectedLoa
                    ? "bg-red-950/20 border-red-500/40 text-slate-300"
                    : "bg-slate-950 border-slate-800 text-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs flex items-center gap-1.5">
                    {isLoaCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : selectedLoa ? (
                      <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[10px] text-slate-500">
                        2
                      </span>
                    )}
                    Verify Vessel Length
                  </span>
                  {isLoaCorrect && (
                    <span className="text-[10px] font-mono font-bold text-emerald-400">
                      ✓ Valid
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-400 leading-snug">
                  Berapa Length Overall (LOA) MV Nusantara pada sertifikat kapal?
                </p>

                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  {[
                    { val: "210.0", label: "LOA 210m" },
                    { val: "280.0", label: "LOA 280m" },
                    { val: "300.0", label: "LOA 300m" },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => setSelectedLoa(opt.val)}
                      className={`py-1.5 px-2 rounded-lg font-mono text-[11px] font-bold border transition-all ${
                        selectedLoa === opt.val
                          ? opt.val === "280.0"
                            ? "bg-emerald-600 text-white border-emerald-400"
                            : "bg-red-600 text-white border-red-400"
                          : "bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Task 3: Check Berth Availability & Required Depth */}
              <div
                className={`p-3 rounded-xl border transition-all space-y-2 ${
                  isUkcDepthCorrect
                    ? "bg-emerald-950/30 border-emerald-500/50 text-slate-200"
                    : selectedUkcDepth
                    ? "bg-red-950/20 border-red-500/40 text-slate-300"
                    : "bg-slate-950 border-slate-800 text-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs flex items-center gap-1.5">
                    {isUkcDepthCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : selectedUkcDepth ? (
                      <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[10px] text-slate-500">
                        3
                      </span>
                    )}
                    Check Berth Availability
                  </span>
                  {isUkcDepthCorrect && (
                    <span className="text-[10px] font-mono font-bold text-emerald-400">
                      ✓ Valid
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-400 leading-snug">
                  Dengan Draft 10.20m + UKC wajib 1.30m, berapa kedalaman minimal yang dibutuhkan?
                </p>

                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  {[
                    { val: "9.00", label: "Kedalaman 9.0m" },
                    { val: "10.20", label: "Kedalaman 10.2m" },
                    { val: "11.50", label: "Kedalaman 11.5m" },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => setSelectedUkcDepth(opt.val)}
                      className={`py-1.5 px-2 rounded-lg font-mono text-[11px] font-bold border transition-all ${
                        selectedUkcDepth === opt.val
                          ? opt.val === "11.50"
                            ? "bg-emerald-600 text-white border-emerald-400"
                            : "bg-red-600 text-white border-red-400"
                          : "bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Key Insight Found Callout Box (PRD Image 3) */}
            <div
              className={`rounded-xl border-2 p-3.5 space-y-1.5 text-xs transition-all ${
                isAnalysisComplete
                  ? "bg-amber-500/10 border-amber-500/50"
                  : "bg-slate-950 border-slate-800 opacity-60"
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-[#F5B800] uppercase text-[11px]">
                <Lightbulb className="w-4 h-4" />
                <span>Key Insight Found:</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {isAnalysisComplete ? (
                  <span>
                    Draft of <strong className="text-amber-300">10.20m</strong> requires berths with clear water depth under chart datum exceeding{" "}
                    <strong className="text-white">11.50m</strong> (+1.3m UKC). Berth B-02 (-9.0m) has a 2.5m deficit (Grounding risk!). Berth B-01 (-12.0m) is compliant.
                  </span>
                ) : (
                  <span className="italic text-slate-500">
                    Selesaikan ketiga pertanyaan analisis di atas untuk membuka temuan kunci operasional.
                  </span>
                )}
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
                <span className="text-[10px] text-slate-500 block text-center mt-1.5 font-mono">
                  Lengkapi 3 data ekstraksi untuk membuka keputusan
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
