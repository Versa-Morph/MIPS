"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Download,
  ExternalLink,
  Layers,
  FileText,
  ClipboardCheck,
  Lock,
  AlertTriangle,
  ShieldCheck,
  Table,
  Check,
  Anchor,
  Compass,
  FileCheck2,
  HelpCircle,
  Calculator,
} from "lucide-react";
import { useTrainingStore } from "@/store/useTrainingStore";
import { TrainingState } from "@/types/simulation";
import { DocumentType } from "@/types/domain";
import { Modal } from "@/components/common/Modal";
import { sound } from "@/utils/audioEngine";

export function DocumentCenterScreen() {
  const {
    documents,
    markDocumentViewed,
    setStep,
    cadetDossier,
    submitCadetDossier,
  } = useTrainingStore();

  const [selectedType, setSelectedType] = useState<DocumentType>("ARRIVAL_NOTICE");
  const [viewMode, setViewMode] = useState<"pdf" | "sheet">("pdf");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const [vesselName, setVesselName] = useState(cadetDossier.vesselName || "");
  const [callSign, setCallSign] = useState(cadetDossier.callSign || "");
  const [imoNumber, setImoNumber] = useState(cadetDossier.imoNumber || "");
  const [lastPort, setLastPort] = useState(cadetDossier.lastPort || "");
  const [loa, setLoa] = useState(cadetDossier.loa || "");
  const [draftAft, setDraftAft] = useState(cadetDossier.draftAft || "");
  const [requiredDepth, setRequiredDepth] = useState(
    cadetDossier.requiredDepth || ""
  );
  const [totalContainers, setTotalContainers] = useState(
    cadetDossier.totalContainers || ""
  );
  const [reeferUnits, setReeferUnits] = useState(cadetDossier.reeferUnits || "");
  const [dgClass, setDgClass] = useState(cadetDossier.dgClass || "");
  const [minCranes, setMinCranes] = useState(cadetDossier.minCranes || "");

  const [submissionFeedback, setSubmissionFeedback] = useState<{
    score: number;
    feedback: string;
  } | null>(
    cadetDossier.isSubmitted
      ? {
          score: cadetDossier.score,
          feedback:
            "Berkas Pre-Arrival Clearance Dossier telah diterima oleh Syahbandar & Otoritas Pelabuhan. Evaluasi nilai dan akurasi data Anda akan diberikan pada Laporan Akhir (Assessment).",
        }
      : null
  );

  useEffect(() => {
    markDocumentViewed(selectedType, 15);
  }, [selectedType, markDocumentViewed]);

  const activeDoc =
    documents.find((d) => d.type === selectedType) || documents[0];

  const handleSelectDoc = (type: DocumentType) => {
    setSelectedType(type);
    markDocumentViewed(type, 15);
  };

  const handleOpenConfirm = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsConfirmModalOpen(true);
  };

  const handleExecuteSubmit = () => {
    setIsConfirmModalOpen(false);

    const result = submitCadetDossier({
      vesselName,
      callSign,
      imoNumber,
      lastPort,
      loa,
      draftAft,
      requiredDepth,
      totalContainers,
      reeferUnits,
      dgClass,
      minCranes,
    });

    if (result.score >= 18) {
      sound.playSuccessChime();
    } else {
      sound.playWarningAlarm();
    }

    setSubmissionFeedback(result);
  };

  const handleProceed = () => {
    setStep(TrainingState.DECISION);
  };

  const isFormFilled =
    vesselName.trim() !== "" &&
    callSign.trim() !== "" &&
    loa.trim() !== "" &&
    draftAft.trim() !== "" &&
    requiredDepth.trim() !== "" &&
    totalContainers.trim() !== "";

  // Calculated helper for UKC guidance
  const calculatedUKCDepth = useMemo(() => {
    const parsed = parseFloat(draftAft.replace(",", "."));
    if (!isNaN(parsed) && parsed > 0) {
      return (parsed + 1.3).toFixed(2);
    }
    return "11.50";
  }, [draftAft]);

  const getDocIcon = (type: DocumentType) => {
    switch (type) {
      case "ARRIVAL_NOTICE":
        return <FileText className="w-4 h-4 text-amber-400" />;
      case "VESSEL_MANIFEST":
        return <Anchor className="w-4 h-4 text-cyan-400" />;
      case "CARGO_MANIFEST":
        return <Layers className="w-4 h-4 text-emerald-400" />;
      case "BERTH_INFORMATION":
        return <Compass className="w-4 h-4 text-purple-400" />;
      default:
        return <FileCheck2 className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-4 space-y-4 font-sans select-none">
      {/* Top Breadcrumb & Status Strip */}
      <div className="rounded-2xl bg-white dark:bg-[#151821] border border-slate-200/80 dark:border-[#232734] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-sm text-slate-800 dark:text-white text-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setStep(TrainingState.BRIEFING)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-[#1c202c] hover:bg-slate-200 dark:hover:bg-[#282f40] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-coral transition-colors font-mono"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Briefing</span>
          </button>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <div className="flex items-center gap-2 font-bold tracking-wider text-coral font-mono text-[11px] sm:text-xs">
            <span>■ 02 ANALYSIS · PRE-ARRIVAL CLEARANCE DOSSIER</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
          <span className="hidden sm:inline">Scenario: SCN-001</span>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
          <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            {documents.filter((d) => d.isViewed).length} / {documents.length} Docs Inspected
          </span>
        </div>
      </div>

      {/* 3-Panel Unified Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Panel: Col 1-3 (25% Width) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Document Package Selector */}
          <div className="rounded-2xl bg-white dark:bg-[#151821] border border-slate-200/80 dark:border-[#232734] p-4 space-y-3 shadow-card dark:shadow-card-dark">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-200 flex items-center gap-2 font-mono">
                <Layers className="w-4 h-4 text-coral" />
                CARGO & NOTICE PACKAGE
              </h2>
              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 font-semibold">4 FILES</span>
            </div>

            <div className="space-y-2">
              {documents.map((doc, idx) => {
                const isActive = doc.type === selectedType;
                return (
                  <div
                    key={doc.id}
                    onClick={() => handleSelectDoc(doc.type)}
                    className={`cursor-pointer rounded-2xl p-3 border transition-all text-xs flex flex-col justify-between group ${
                      isActive
                        ? "bg-coral/5 dark:bg-[#1c202c] border-l-4 border-l-coral border-coral/40 shadow-sm ring-1 ring-coral/20"
                        : "bg-white dark:bg-[#151821] border-slate-200/80 dark:border-slate-800/80 hover:border-coral/30 hover:bg-slate-50 dark:hover:bg-[#1a1e29]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        {getDocIcon(doc.type)}
                        <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                          DOC 0{idx + 1}
                        </span>
                      </div>
                      {doc.isViewed ? (
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-mono bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                          <CheckCircle2 className="w-3 h-3" /> VERIFIED
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                          UNREVIEWED
                        </span>
                      )}
                    </div>

                    <div className={`font-bold transition-colors text-xs leading-snug ${isActive ? "text-coral font-extrabold" : "text-slate-800 dark:text-slate-200 group-hover:text-coral"}`}>
                      {doc.title}
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-1 font-mono">
                      REF: {doc.referenceNumber}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Technical Summary Card */}
          <div className="rounded-2xl bg-white dark:bg-[#151821] border border-slate-200/80 dark:border-[#232734] p-4 shadow-card dark:shadow-card-dark space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-coral font-mono">
                VERIFIED SHIP DOSSIER STATUS
              </span>
              <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">
                {cadetDossier.isSubmitted ? "LOCKED" : "DRAFT"}
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400 font-sans">Ship Name:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {cadetDossier.isSubmitted ? cadetDossier.vesselName : "--"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400 font-sans">Length (LOA):</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {cadetDossier.isSubmitted ? `${cadetDossier.loa} m` : "-- m"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400 font-sans">Arrival Draft:</span>
                <span className="font-bold text-coral">
                  {cadetDossier.isSubmitted
                    ? `${cadetDossier.draftAft} m`
                    : "-- m"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400 font-sans">Required Depth:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {cadetDossier.isSubmitted
                    ? `${cadetDossier.requiredDepth} m`
                    : "-- m"}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 dark:text-slate-400 font-sans">Dossier State:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {cadetDossier.isSubmitted
                    ? "SUBMITTED & LOCKED"
                    : "NOT SUBMITTED"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Panel: Col 4-8 (42% Width) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="rounded-2xl bg-white dark:bg-[#151821] border border-slate-200/80 dark:border-[#232734] shadow-card dark:shadow-card-dark p-4 flex flex-col min-h-[660px]">
            {/* Center Panel Header & Tab Controls */}
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3 mb-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-coral/10 text-coral flex items-center justify-center font-bold shrink-0 shadow-sm">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h1 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight font-sans">
                    {activeDoc.title}
                  </h1>
                  <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
                    REF: {activeDoc.referenceNumber}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* PDF vs Data Sheet Mode Switch */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#11131a] p-1 rounded-full border border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setViewMode("pdf")}
                    className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      viewMode === "pdf"
                        ? "bg-slate-900 text-white dark:bg-[#282f40] dark:text-white font-bold shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                    title="Render official PDF document"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Real PDF View</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("sheet")}
                    className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      viewMode === "sheet"
                        ? "bg-slate-900 text-white dark:bg-[#282f40] dark:text-white font-bold shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                    title="Render digital telemetry data sheet"
                  >
                    <Table className="w-3.5 h-3.5" />
                    <span>Data Sheet</span>
                  </button>
                </div>

                {activeDoc.pdfUrl && (
                  <div className="flex items-center gap-1">
                    <a
                      href={activeDoc.pdfUrl}
                      download
                      className="p-1.5 rounded-full bg-slate-100 dark:bg-[#1c202c] text-slate-600 dark:text-slate-300 hover:text-coral border border-slate-200 dark:border-slate-800 transition-colors"
                      title="Download original PDF file"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                    <a
                      href={activeDoc.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-full bg-slate-100 dark:bg-[#1c202c] text-slate-600 dark:text-slate-300 hover:text-coral border border-slate-200 dark:border-slate-800 transition-colors"
                      title="Open PDF in new browser tab"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 w-full min-h-[580px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-inner">
              {viewMode === "pdf" ? (
                activeDoc.pdfUrl ? (
                  <iframe
                    src={`${activeDoc.pdfUrl}#toolbar=1`}
                    className="w-full h-full min-h-[580px] border-0"
                    title={activeDoc.title}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-mono">
                    Document file unavailable.
                  </div>
                )
              ) : (
                /* Data Sheet View */
                <div className="p-5 space-y-4 overflow-y-auto max-h-[600px] text-xs font-mono text-slate-800 dark:text-slate-200">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                    <div className="text-coral font-bold text-sm font-sans">
                      {activeDoc.content.header}
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 text-xs flex items-center justify-between">
                      <span>Issuer: {activeDoc.content.issuer}</span>
                      <span>Date: {activeDoc.content.date}</span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="bg-slate-100 dark:bg-slate-900 px-4 py-2 text-slate-800 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                      OPERATIONAL SPECIFICATIONS & EXTRACTED ATTRIBUTES
                    </div>
                    <div className="divide-y divide-slate-200/80 dark:divide-slate-800/80 bg-white dark:bg-slate-950">
                      {Object.entries(activeDoc.content.details).map(([key, val]) => (
                        <div key={key} className="flex justify-between px-4 py-2">
                          <span className="text-slate-500 dark:text-slate-400">{key}</span>
                          <span className="font-bold text-slate-900 dark:text-white">{String(val)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {activeDoc.content.notes && activeDoc.content.notes.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 space-y-1">
                      <span className="font-bold text-coral block">Official Directives / Notes:</span>
                      <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                        {activeDoc.content.notes.map((note, idx) => (
                          <li key={idx}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeDoc.content.officialStampText && (
                    <div className="p-3 rounded-xl border border-coral/30 bg-coral/5 text-coral text-center font-bold text-[11px]">
                      {activeDoc.content.officialStampText}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel: Col 9-12 (33% Width) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl bg-white dark:bg-[#151821] border border-slate-200/80 dark:border-[#232734] p-4 sm:p-5 space-y-4 shadow-card dark:shadow-card-dark">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-2.5 flex items-center justify-between">
              <div>
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-200 flex items-center gap-2 font-mono">
                  <ClipboardCheck className="w-4 h-4 text-coral" />
                  PRE-ARRIVAL CLEARANCE DOSSIER
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-sans">
                  Formulir Pemeriksaan Dokumen & Verifikasi Pra-Sandar Resmi (20 Pts)
                </p>
              </div>

              {cadetDossier.isSubmitted && (
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60">
                  LOCKED
                </span>
              )}
            </div>

            <form onSubmit={handleOpenConfirm} className="space-y-4 text-xs">
              {/* Section 1: Identitas & Pelayaran Kapal */}
              <div className="space-y-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1a1e29] border border-slate-200/80 dark:border-slate-800">
                <span className="text-xs font-extrabold uppercase text-coral tracking-wider flex items-center gap-1.5 font-mono">
                  1. Identitas & Pelayaran Kapal (Notice of Arrival)
                </span>

                <div className="space-y-2.5">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1 font-sans">
                      Nama Kapal (Vessel Name)
                    </label>
                    <input
                      type="text"
                      disabled={cadetDossier.isSubmitted}
                      value={vesselName}
                      onChange={(e) => setVesselName(e.target.value)}
                      placeholder="cth: MV Nusantara"
                      className="w-full py-2 px-3 rounded-xl bg-white dark:bg-[#11131a] border border-slate-200 dark:border-slate-800 text-xs font-mono font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral transition-all disabled:opacity-75 disabled:cursor-not-allowed shadow-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1 font-sans">
                        Call Sign
                      </label>
                      <input
                        type="text"
                        disabled={cadetDossier.isSubmitted}
                        value={callSign}
                        onChange={(e) => setCallSign(e.target.value)}
                        placeholder="cth: PK-47A"
                        className="w-full py-2 px-3 rounded-xl bg-white dark:bg-[#11131a] border border-slate-200 dark:border-slate-800 text-xs font-mono font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral transition-all disabled:opacity-75 disabled:cursor-not-allowed shadow-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1 font-sans">
                        IMO Number
                      </label>
                      <input
                        type="text"
                        disabled={cadetDossier.isSubmitted}
                        value={imoNumber}
                        onChange={(e) => setImoNumber(e.target.value)}
                        placeholder="cth: 1234567"
                        className="w-full py-2 px-3 rounded-xl bg-white dark:bg-[#11131a] border border-slate-200 dark:border-slate-800 text-xs font-mono font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral transition-all disabled:opacity-75 disabled:cursor-not-allowed shadow-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1 font-sans">
                      Pelabuhan Asal (Last Port of Call)
                    </label>
                    <input
                      type="text"
                      disabled={cadetDossier.isSubmitted}
                      value={lastPort}
                      onChange={(e) => setLastPort(e.target.value)}
                      placeholder="cth: Singapore"
                      className="w-full py-2 px-3 rounded-xl bg-white dark:bg-[#11131a] border border-slate-200 dark:border-slate-800 text-xs font-mono font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral transition-all disabled:opacity-75 disabled:cursor-not-allowed shadow-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Parameter Fisik Kapal */}
              <div className="space-y-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1a1e29] border border-slate-200/80 dark:border-slate-800">
                <span className="text-xs font-extrabold uppercase text-slate-900 dark:text-white tracking-wider flex items-center gap-1.5 font-mono">
                  2. Parameter Fisik Kapal (Vessel Particulars)
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1 font-sans">
                      Length Overall (LOA, m)
                    </label>
                    <input
                      type="text"
                      disabled={cadetDossier.isSubmitted}
                      value={loa}
                      onChange={(e) => setLoa(e.target.value)}
                      placeholder="cth: 280.0"
                      className="w-full py-2 px-3 rounded-xl bg-white dark:bg-[#11131a] border border-slate-200 dark:border-slate-800 text-xs font-mono font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral transition-all disabled:opacity-75 disabled:cursor-not-allowed shadow-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1 font-sans">
                      Arrival Draft Aft (m)
                    </label>
                    <input
                      type="text"
                      disabled={cadetDossier.isSubmitted}
                      value={draftAft}
                      onChange={(e) => setDraftAft(e.target.value)}
                      placeholder="cth: 10.20"
                      className="w-full py-2 px-3 rounded-xl bg-white dark:bg-[#11131a] border border-slate-200 dark:border-slate-800 text-xs font-mono font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral transition-all disabled:opacity-75 disabled:cursor-not-allowed shadow-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Kalkulasi Kedalaman Wajib */}
              <div className="space-y-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1a1e29] border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase text-slate-900 dark:text-white tracking-wider flex items-center gap-1.5 font-mono">
                    3. Kalkulasi Kedalaman Wajib (Draft + UKC 1.3m)
                  </span>
                  <Calculator className="w-3.5 h-3.5 text-coral" />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1 font-sans">
                    Controlling Depth yang Disyaratkan (Meters)
                  </label>
                  <input
                    type="text"
                    disabled={cadetDossier.isSubmitted}
                    value={requiredDepth}
                    onChange={(e) => setRequiredDepth(e.target.value)}
                    placeholder="Hitung: Draft + 1.3m UKC (cth: 11.50)"
                    className="w-full py-2 px-3 rounded-xl bg-white dark:bg-[#11131a] border border-slate-200 dark:border-slate-800 text-xs font-mono font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral transition-all disabled:opacity-75 disabled:cursor-not-allowed shadow-xs"
                  />
                  <div className="mt-1.5 p-2 rounded-xl bg-coral/5 dark:bg-coral/10 border border-coral/25 flex items-start gap-2 text-[10px] text-coral">
                    <HelpCircle className="w-3.5 h-3.5 text-coral shrink-0 mt-0.5" />
                    <span>
                      Formula Pelindo: Sarat Air Kapal ({draftAft || "10.20"}m) + Standar UKC (+1.30m) = Minimum {calculatedUKCDepth}m kedalaman dermaga aman.
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 4: Muatan & Kebutuhan Terminal */}
              <div className="space-y-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1a1e29] border border-slate-200/80 dark:border-slate-800">
                <span className="text-xs font-extrabold uppercase text-slate-900 dark:text-white tracking-wider flex items-center gap-1.5 font-mono">
                  4. Muatan & Kebutuhan Terminal (Cargo Manifest)
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1 font-sans">
                      Total Box Kontainer
                    </label>
                    <input
                      type="text"
                      disabled={cadetDossier.isSubmitted}
                      value={totalContainers}
                      onChange={(e) => setTotalContainers(e.target.value)}
                      placeholder="cth: 50"
                      className="w-full py-2 px-3 rounded-xl bg-white dark:bg-[#11131a] border border-slate-200 dark:border-slate-800 text-xs font-mono font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral transition-all disabled:opacity-75 disabled:cursor-not-allowed shadow-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1 font-sans">
                      Reefer 440V Units
                    </label>
                    <input
                      type="text"
                      disabled={cadetDossier.isSubmitted}
                      value={reeferUnits}
                      onChange={(e) => setReeferUnits(e.target.value)}
                      placeholder="cth: 5"
                      className="w-full py-2 px-3 rounded-xl bg-white dark:bg-[#11131a] border border-slate-200 dark:border-slate-800 text-xs font-mono font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral transition-all disabled:opacity-75 disabled:cursor-not-allowed shadow-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1 font-sans">
                      DG Class (Muatan Berbahaya)
                    </label>
                    <input
                      type="text"
                      disabled={cadetDossier.isSubmitted}
                      value={dgClass}
                      onChange={(e) => setDgClass(e.target.value)}
                      placeholder="cth: 4.1"
                      className="w-full py-2 px-3 rounded-xl bg-white dark:bg-[#11131a] border border-slate-200 dark:border-slate-800 text-xs font-mono font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral transition-all disabled:opacity-75 disabled:cursor-not-allowed shadow-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1 font-sans">
                      Permintaan Min. Crane
                    </label>
                    <input
                      type="text"
                      disabled={cadetDossier.isSubmitted}
                      value={minCranes}
                      onChange={(e) => setMinCranes(e.target.value)}
                      placeholder="cth: 3"
                      className="w-full py-2 px-3 rounded-xl bg-white dark:bg-[#11131a] border border-slate-200 dark:border-slate-800 text-xs font-mono font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral transition-all disabled:opacity-75 disabled:cursor-not-allowed shadow-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Status Banner when submitted (no score spoilers) */}
              {submissionFeedback && (
                <div className="p-3.5 rounded-xl border bg-emerald-500/10 border-emerald-500/40 text-emerald-400 text-xs leading-relaxed space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-emerald-400 font-sans">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>STATUS: BERKAS PRE-ARRIVAL DIKUNCI</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {submissionFeedback.feedback}
                  </p>
                </div>
              )}

              {/* Submit Button vs Locked Badge */}
              {!cadetDossier.isSubmitted ? (
                <button
                  type="submit"
                  disabled={!isFormFilled}
                  className={`w-full py-3 px-4 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all font-mono ${
                    isFormFilled
                      ? "cta-coral cursor-pointer shadow-coral"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-slate-700/60"
                  }`}
                >
                  <ClipboardCheck className="w-4 h-4" />
                  <span>Submit Pre-Arrival Dossier</span>
                </button>
              ) : (
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-[#1a1e29] border border-emerald-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs font-mono">
                    <Lock className="w-4 h-4" />
                    <span>BERKAS RESMI DIKUNCI (FINAL SUBMISSION)</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-300 dark:border-emerald-500/30">
                    TERKUNCI
                  </span>
                </div>
              )}
            </form>

            {/* Proceed Action Button */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleProceed}
                disabled={!cadetDossier.isSubmitted}
                className={`w-full py-3.5 px-4 rounded-full font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm font-mono ${
                  cadetDossier.isSubmitted
                    ? "cta-coral cursor-pointer shadow-coral"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-slate-700/60"
                }`}
              >
                <span>PROCEED TO BERTH ASSIGNMENT</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
              {!cadetDossier.isSubmitted && (
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block text-center mt-1.5 font-mono">
                  Submit berkas dossier terlebih dahulu untuk membuka tahap alokasi dermaga
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsConfirmModalOpen(false)}
          title="KONFIRMASI PENYERAHAN BERKAS PRE-ARRIVAL KE SYAHBANDAR"
          referenceNumber="DISPATCH-CLEARANCE-NOA"
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4 text-slate-100 font-sans">
            {/* 1. Official Regulatory Warning Banner (Clean, Focused Advisory) */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3.5">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <strong className="text-xs sm:text-sm font-bold text-white font-sans tracking-wide">
                    PERINGATAN RESMI: PENGUNCIAN BERKAS OPERASIONAL
                  </strong>
                  <span className="font-mono text-[10px] font-semibold text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30 shrink-0">
                    FINAL
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Berkas Pre-Arrival Clearance Dossier yang Anda serahkan ke Otoritas Pelabuhan & Syahbandar bersifat mengikat. Setelah dikonfirmasi, berkas akan <strong>DIKUNCI SECARA PERMANEN</strong> untuk evaluasi penilaian STCW (Maks. 20 Poin).
                </p>

                <div className="flex items-center gap-2 pt-0.5 text-[11px] font-mono text-slate-400">
                  <span className="text-amber-300/90 flex items-center gap-1 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Evaluasi STCW: Maks. 20 Poin</span>
                  </span>
                  <span>·</span>
                  <span>Zero Grounding Tolerance</span>
                </div>
              </div>
            </div>

            {/* 2. Target Vessel Identity Card (Unified High-Contrast Styling) */}
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-700/60 border border-slate-600/80 flex items-center justify-center text-slate-300 shrink-0">
                  <Anchor className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 font-mono block">
                    Target Kapal Masuk
                  </span>
                  <div className="text-sm sm:text-base font-bold text-white font-sans">
                    {vesselName} <span className="font-mono text-slate-300 text-xs font-semibold">({callSign})</span>
                  </div>
                </div>
              </div>

              <div className="text-left sm:text-right font-mono text-xs text-slate-400">
                <div className="text-slate-200 font-semibold">IMO {imoNumber || "1234567"}</div>
                <div className="text-[11px] text-slate-400">Pelabuhan Asal: {lastPort || "Singapore"}</div>
              </div>
            </div>

            {/* 3. Operational Telemetry Cards - Unified Palette for Instant Verification */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              {/* Card 1: Dimensions & Draft */}
              <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/80">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider font-mono">
                  DIMENSI & DRAFT
                </span>
                <span className="text-white font-bold text-sm block mt-1">
                  LOA {loa}m · Draft {draftAft}m
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Max Arrival Draft
                </span>
              </div>

              {/* Card 2: Controlling Depth (Safe Cushion) */}
              <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/80">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider font-mono flex items-center justify-between">
                  <span>CONTROLLING DEPTH WAJIB</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                </span>
                <span className="text-white font-bold text-sm block mt-1">
                  {requiredDepth} Meters (UKC Safe)
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Draft + 1.3m Safe Margin
                </span>
              </div>

              {/* Card 3: Cargo & Equipment */}
              <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/80">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider font-mono">
                  MUATAN & CRANE
                </span>
                <span className="text-white font-bold text-sm block mt-1">
                  {totalContainers} Box · {minCranes} Cranes
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5 truncate">
                  DG {dgClass || "4.1"} · {reeferUnits || "5"} Reefer
                </span>
              </div>
            </div>

            {/* 4. Digital Signature Strip */}
            <div className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-slate-800/40 border border-slate-700/60 text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>PELINDO DIGITAL SIGNATURE // PRIOK-GATEWAY-2026</span>
              </span>
              <span className="text-slate-400 text-[10px] hidden sm:inline">KSOP SECTOR-3 VERIFIED</span>
            </div>

            {/* 5. Clean Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 hover:text-white text-xs font-semibold font-sans transition-colors"
              >
                Periksa Kembali Berkas
              </button>

              <button
                type="button"
                onClick={handleExecuteSubmit}
                className="w-full sm:w-auto cta-coral shadow-coral inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-sans font-bold text-xs uppercase tracking-wide transition-all"
              >
                <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                <span>Ya, Kirim & Kunci Berkas Resmi</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
