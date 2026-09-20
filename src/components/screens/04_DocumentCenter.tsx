"use client";

import { useState, useEffect } from "react";
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

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 space-y-4 animate-fadeIn select-none font-sans">
      {/* Top Breadcrumb & Status Strip */}
      <div className="rounded-xl glass-panel border border-glass-border px-4 py-3 flex items-center justify-between shadow-glass text-white text-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setStep(TrainingState.BRIEFING)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-abyssal/80 border border-slate-700/60 text-slate-300 hover:text-tactical-cyan hover:border-tactical-cyan/40 transition-colors font-mono"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Briefing</span>
          </button>
          <span className="text-slate-600">/</span>
          <div className="flex items-center gap-2 font-bold tracking-wider text-electric-amber font-mono">
            <span>■ 02 ANALYSIS · PRE-ARRIVAL CLEARANCE DOSSIER</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
          <span>Scenario: SCN-001</span>
          <span className="text-slate-600">|</span>
          <span className="text-safety-emerald font-bold">
            {documents.filter((d) => d.isViewed).length} / {documents.length} Docs Inspected
          </span>
        </div>
      </div>

      {/* 3-Panel Unified Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Panel: Col 1-3 (25% Width) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Document Package Selector */}
          <div className="rounded-2xl glass-panel border border-glass-border p-4 space-y-3 shadow-glass">
            <h2 className="text-xs font-black uppercase tracking-wider text-white border-b border-glass-border pb-2.5 flex items-center gap-2 font-mono">
              <Layers className="w-4 h-4 text-electric-amber" />
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
                        ? "bg-abyssal-surface/90 border-l-4 border-l-electric-amber border-slate-700 shadow-md ring-1 ring-electric-amber/20"
                        : "bg-abyssal/60 border-slate-800/80 hover:border-slate-700 hover:bg-abyssal-surface/60"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-[10px] text-slate-500 font-semibold">
                        DOC 0{idx + 1}
                      </span>
                      {doc.isViewed ? (
                        <span className="text-[10px] font-bold text-safety-emerald flex items-center gap-1 font-mono">
                          <CheckCircle2 className="w-3 h-3" /> VERIFIED
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-mono">UNREVIEWED</span>
                      )}
                    </div>

                    <div className="font-bold text-slate-100 group-hover:text-electric-amber">
                      {doc.title}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate mt-1 font-mono">
                      {doc.referenceNumber}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Technical Summary Card */}
          <div className="rounded-2xl glass-panel border border-glass-border p-4 shadow-glass space-y-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-tactical-cyan block border-b border-glass-border pb-1.5 font-mono">
              VERIFIED SHIP DOSSIER STATUS
            </span>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400 font-sans">Ship Name:</span>
                <span className="font-bold text-white">
                  {cadetDossier.isSubmitted ? cadetDossier.vesselName : "--"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400 font-sans">Length (LOA):</span>
                <span className="font-bold text-white">
                  {cadetDossier.isSubmitted ? `${cadetDossier.loa} m` : "-- m"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400 font-sans">Arrival Draft:</span>
                <span className="font-bold text-electric-amber">
                  {cadetDossier.isSubmitted
                    ? `${cadetDossier.draftAft} m`
                    : "-- m"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400 font-sans">Required Depth:</span>
                <span className="font-bold text-safety-emerald">
                  {cadetDossier.isSubmitted
                    ? `${cadetDossier.requiredDepth} m`
                    : "-- m"}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400 font-sans">Dossier State:</span>
                <span className="font-bold text-tactical-cyan">
                  {cadetDossier.isSubmitted
                    ? "SUBMITTED & LOCKED"
                    : "NOT SUBMITTED"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Panel: Col 4-8 (45% Width) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="rounded-2xl glass-panel border border-glass-border shadow-glass p-4 flex flex-col min-h-[660px]">
            {/* Center Panel Header & Tab Controls */}
            <div className="border-b border-glass-border pb-3 mb-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-electric-amber text-slate-950 flex items-center justify-center font-bold shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h1 className="text-sm font-bold text-white uppercase tracking-tight font-sans">
                    {activeDoc.title}
                  </h1>
                  <span className="font-mono text-[11px] text-slate-400">
                    REF: {activeDoc.referenceNumber}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* PDF vs Data Sheet Mode Switch */}
                <div className="flex items-center gap-1 bg-abyssal p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setViewMode("pdf")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      viewMode === "pdf"
                        ? "bg-electric-amber text-slate-950 font-bold shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                    title="Render official PDF document"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Real PDF View</span>
                  </button>
                  <button
                    onClick={() => setViewMode("sheet")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      viewMode === "sheet"
                        ? "bg-electric-amber text-slate-950 font-bold shadow-sm"
                        : "text-slate-400 hover:text-white"
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
                      className="p-1.5 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700/60 transition-colors"
                      title="Download original PDF file"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                    <a
                      href={activeDoc.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700/60 transition-colors"
                      title="Open PDF in new browser tab"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 w-full min-h-[580px] rounded-xl overflow-hidden border border-slate-800 bg-abyssal shadow-inner">
              {viewMode === "pdf" ? (
                activeDoc.pdfUrl ? (
                  <iframe
                    src={`${activeDoc.pdfUrl}#toolbar=1`}
                    className="w-full h-full min-h-[580px] border-0"
                    title={activeDoc.title}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs font-mono">
                    Document file unavailable.
                  </div>
                )
              ) : (
                /* Data Sheet View */
                <div className="p-5 space-y-4 overflow-y-auto max-h-[600px] text-xs font-mono text-slate-200">
                  <div className="p-4 rounded-xl bg-abyssal-surface/80 border border-glass-border space-y-1">
                    <div className="text-tactical-cyan font-bold text-sm font-sans">
                      {activeDoc.content.header}
                    </div>
                    <div className="text-slate-400 text-xs flex items-center justify-between">
                      <span>Issuer: {activeDoc.content.issuer}</span>
                      <span>Date: {activeDoc.content.date}</span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-glass-border overflow-hidden">
                    <div className="bg-abyssal-surface/90 px-4 py-2 text-slate-300 font-bold border-b border-glass-border">
                      OPERATIONAL SPECIFICATIONS & EXTRACTED ATTRIBUTES
                    </div>
                    <div className="divide-y divide-slate-800/60 bg-abyssal/60">
                      {Object.entries(activeDoc.content.details).map(([key, val]) => (
                        <div key={key} className="flex justify-between px-4 py-2">
                          <span className="text-slate-400">{key}</span>
                          <span className="font-bold text-white">{String(val)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {activeDoc.content.notes && activeDoc.content.notes.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 space-y-1">
                      <span className="font-bold text-electric-amber block">Official Directives / Notes:</span>
                      <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-400">
                        {activeDoc.content.notes.map((note, idx) => (
                          <li key={idx}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeDoc.content.officialStampText && (
                    <div className="p-3 rounded-xl border border-tactical-cyan/30 bg-tactical-cyan/5 text-tactical-cyan text-center font-bold text-[11px]">
                      {activeDoc.content.officialStampText}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel: Col 9-12 (30% Width) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl glass-panel border border-glass-border p-4 sm:p-5 space-y-4 shadow-glass">
            <div className="border-b border-glass-border pb-2.5 flex items-center justify-between">
              <div>
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-2 font-mono">
                  <ClipboardCheck className="w-4 h-4 text-electric-amber" />
                  PRE-ARRIVAL CLEARANCE DOSSIER
                </h2>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Formulir Pemeriksaan Dokumen & Verifikasi Pra-Sandar Resmi (20 Pts)
                </p>
              </div>

              {cadetDossier.isSubmitted && (
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-safety-emerald/10 text-safety-emerald border border-safety-emerald/30">
                  LOCKED
                </span>
              )}
            </div>

            <form onSubmit={handleOpenConfirm} className="space-y-3.5 text-xs">
              {/* Section 1: Identitas & Pelayaran Kapal */}
              <div className="space-y-2 p-3.5 rounded-xl bg-abyssal/70 border border-glass-border">
                <span className="text-[10px] font-bold uppercase tracking-wider text-tactical-cyan block font-mono">
                  1. Identitas & Pelayaran Kapal (Notice of Arrival)
                </span>

                <div className="space-y-2">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1 text-[11px]">
                      Nama Kapal (Vessel Name)
                    </label>
                    <input
                      type="text"
                      disabled={cadetDossier.isSubmitted}
                      value={vesselName}
                      onChange={(e) => setVesselName(e.target.value)}
                      placeholder="cth: MV Nusantara"
                      className="w-full px-3 py-1.5 rounded-lg bg-abyssal border border-slate-700/80 text-white font-mono text-xs focus:ring-2 focus:ring-tactical-cyan/50 focus:border-tactical-cyan outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1 text-[11px]">
                        Call Sign
                      </label>
                      <input
                        type="text"
                        disabled={cadetDossier.isSubmitted}
                        value={callSign}
                        onChange={(e) => setCallSign(e.target.value)}
                        placeholder="cth: PK-47A"
                        className="w-full px-3 py-1.5 rounded-lg bg-abyssal border border-slate-700/80 text-white font-mono text-xs focus:ring-2 focus:ring-tactical-cyan/50 focus:border-tactical-cyan outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1 text-[11px]">
                        IMO Number
                      </label>
                      <input
                        type="text"
                        disabled={cadetDossier.isSubmitted}
                        value={imoNumber}
                        onChange={(e) => setImoNumber(e.target.value)}
                        placeholder="cth: 1234567"
                        className="w-full px-3 py-1.5 rounded-lg bg-abyssal border border-slate-700/80 text-white font-mono text-xs focus:ring-2 focus:ring-tactical-cyan/50 focus:border-tactical-cyan outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1 text-[11px]">
                      Pelabuhan Asal (Last Port of Call)
                    </label>
                    <input
                      type="text"
                      disabled={cadetDossier.isSubmitted}
                      value={lastPort}
                      onChange={(e) => setLastPort(e.target.value)}
                      placeholder="cth: Singapore"
                      className="w-full px-3 py-1.5 rounded-lg bg-abyssal border border-slate-700/80 text-white font-mono text-xs focus:ring-2 focus:ring-tactical-cyan/50 focus:border-tactical-cyan outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Parameter Fisik Kapal */}
              <div className="space-y-2 p-3.5 rounded-xl bg-abyssal/70 border border-glass-border">
                <span className="text-[10px] font-bold uppercase tracking-wider text-tactical-cyan block font-mono">
                  2. Parameter Fisik Kapal (Vessel Particulars)
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1 text-[11px]">
                      Length Overall (LOA, m)
                    </label>
                    <input
                      type="text"
                      disabled={cadetDossier.isSubmitted}
                      value={loa}
                      onChange={(e) => setLoa(e.target.value)}
                      placeholder="cth: 280.0"
                      className="w-full px-3 py-1.5 rounded-lg bg-abyssal border border-slate-700/80 text-white font-mono text-xs focus:ring-2 focus:ring-tactical-cyan/50 focus:border-tactical-cyan outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1 text-[11px]">
                      Arrival Draft Aft (m)
                    </label>
                    <input
                      type="text"
                      disabled={cadetDossier.isSubmitted}
                      value={draftAft}
                      onChange={(e) => setDraftAft(e.target.value)}
                      placeholder="cth: 10.20"
                      className="w-full px-3 py-1.5 rounded-lg bg-abyssal border border-slate-700/80 text-electric-amber font-bold font-mono text-xs focus:ring-2 focus:ring-tactical-cyan/50 focus:border-tactical-cyan outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Kalkulasi Kedalaman Wajib */}
              <div className="space-y-2 p-3.5 rounded-xl bg-abyssal/70 border border-glass-border">
                <span className="text-[10px] font-bold uppercase tracking-wider text-tactical-cyan block font-mono">
                  3. Kalkulasi Kedalaman Wajib (Draft + UKC 1.3m)
                </span>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1 text-[11px]">
                    Controlling Depth yang Disyaratkan (Meters)
                  </label>
                  <input
                    type="text"
                    disabled={cadetDossier.isSubmitted}
                    value={requiredDepth}
                    onChange={(e) => setRequiredDepth(e.target.value)}
                    placeholder="Hitung: Draft + 1.3m UKC (cth: 11.50)"
                    className="w-full px-3 py-1.5 rounded-lg bg-abyssal border border-slate-700/80 text-safety-emerald font-bold font-mono text-xs focus:ring-2 focus:ring-tactical-cyan/50 focus:border-tactical-cyan outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Kedalaman air minimal agar kapal tidak mengalami bahaya kandas.
                  </span>
                </div>
              </div>

              {/* Section 4: Muatan & Kebutuhan Terminal */}
              <div className="space-y-2 p-3.5 rounded-xl bg-abyssal/70 border border-glass-border">
                <span className="text-[10px] font-bold uppercase tracking-wider text-tactical-cyan block font-mono">
                  4. Muatan & Kebutuhan Terminal (Cargo Manifest)
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1 text-[11px]">
                      Total Box Kontainer
                    </label>
                    <input
                      type="text"
                      disabled={cadetDossier.isSubmitted}
                      value={totalContainers}
                      onChange={(e) => setTotalContainers(e.target.value)}
                      placeholder="cth: 50"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-abyssal border border-slate-700/80 text-white font-mono text-xs focus:ring-2 focus:ring-tactical-cyan/50 focus:border-tactical-cyan outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1 text-[11px]">
                      Reefer 440V Units
                    </label>
                    <input
                      type="text"
                      disabled={cadetDossier.isSubmitted}
                      value={reeferUnits}
                      onChange={(e) => setReeferUnits(e.target.value)}
                      placeholder="cth: 5"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-abyssal border border-slate-700/80 text-white font-mono text-xs focus:ring-2 focus:ring-tactical-cyan/50 focus:border-tactical-cyan outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1 text-[11px]">
                      DG Class (Muatan Berbahaya)
                    </label>
                    <input
                      type="text"
                      disabled={cadetDossier.isSubmitted}
                      value={dgClass}
                      onChange={(e) => setDgClass(e.target.value)}
                      placeholder="cth: 4.1"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-abyssal border border-slate-700/80 text-electric-amber font-mono text-xs focus:ring-2 focus:ring-tactical-cyan/50 focus:border-tactical-cyan outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1 text-[11px]">
                      Permintaan Min. Crane
                    </label>
                    <input
                      type="text"
                      disabled={cadetDossier.isSubmitted}
                      value={minCranes}
                      onChange={(e) => setMinCranes(e.target.value)}
                      placeholder="cth: 3"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-abyssal border border-slate-700/80 text-white font-mono text-xs focus:ring-2 focus:ring-tactical-cyan/50 focus:border-tactical-cyan outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Status Banner when submitted (no score spoilers) */}
              {submissionFeedback && (
                <div className="p-3.5 rounded-xl border bg-safety-emerald/10 border-safety-emerald/40 text-safety-emerald text-xs leading-relaxed space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-safety-emerald">
                    <ShieldCheck className="w-4 h-4 text-safety-emerald shrink-0" />
                    <span>STATUS: BERKAS PRE-ARRIVAL DIKUNCI</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {submissionFeedback.feedback}
                  </p>
                </div>
              )}

              {/* Submit Button vs Locked Badge */}
              {!cadetDossier.isSubmitted ? (
                <button
                  type="submit"
                  disabled={!isFormFilled}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all ${
                    isFormFilled
                      ? "bg-electric-amber hover:bg-electric-amber-hover text-slate-950 shadow-amber-glow transform hover:scale-[1.02]"
                      : "bg-slate-800/80 text-slate-500 cursor-not-allowed border border-slate-700/60"
                  }`}
                >
                  <ClipboardCheck className="w-4 h-4" />
                  <span>Submit Pre-Arrival Dossier</span>
                </button>
              ) : (
                <div className="p-3.5 rounded-xl bg-abyssal border border-glass-border flex items-center justify-between">
                  <div className="flex items-center gap-2 text-safety-emerald font-bold text-xs">
                    <Lock className="w-4 h-4" />
                    <span>BERKAS RESMI DIKUNCI (FINAL SUBMISSION)</span>
                  </div>
                  <span className="font-mono text-[10px] font-semibold text-slate-400 bg-slate-800/80 px-2.5 py-0.5 rounded-md border border-slate-700">
                    TERKUNCI
                  </span>
                </div>
              )}
            </form>

            {/* Proceed Action Button */}
            <div className="pt-2 border-t border-glass-border">
              <button
                onClick={handleProceed}
                disabled={!cadetDossier.isSubmitted}
                className={`w-full py-3.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg font-mono ${
                  cadetDossier.isSubmitted
                    ? "bg-abyssal-surface hover:bg-[#0c1c38] text-electric-amber border-2 border-electric-amber shadow-amber-glow transform hover:scale-[1.02]"
                    : "bg-slate-800/60 text-slate-500 cursor-not-allowed border border-slate-700/60"
                }`}
              >
                <span>PROCEED TO BERTH ASSIGNMENT</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
              {!cadetDossier.isSubmitted && (
                <span className="text-[10px] text-slate-500 block text-center mt-1.5 font-mono">
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
        >
          <div className="space-y-6 text-slate-100 font-sans">
            <div className="p-4 rounded-xl bg-amber-500/10 border-2 border-amber-500/50 flex items-start gap-3.5">
              <AlertTriangle className="w-6 h-6 text-electric-amber shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="text-sm font-bold text-white block">
                  PERINGATAN RESMI: PENGUNCIAN BERKAS OPERASIONAL
                </strong>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Berkas Pre-Arrival Clearance Dossier yang Anda serahkan ke Otoritas Pelabuhan & Syahbandar bersifat mengikat dan akan langsung dievaluasi nilainya. Berkas akan <strong>DIKUNCI SECARA PERMANEN</strong> dan Anda tidak dapat mengubah data kembali.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl glass-panel border border-glass-border space-y-2 text-xs font-mono">
              <span className="text-[10px] uppercase font-bold text-slate-400 block border-b border-glass-border pb-1.5 font-sans">
                Ringkasan Berkas yang Akan Dikirim:
              </span>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400 font-sans">Nama Kapal & Call Sign:</span>
                <span className="font-bold text-white">{vesselName} ({callSign})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400 font-sans">Dimensi & Draft Aft:</span>
                <span className="font-bold text-electric-amber">LOA {loa}m · Draft {draftAft}m</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400 font-sans">Controlling Depth Wajib:</span>
                <span className="font-bold text-safety-emerald">{requiredDepth} Meters (UKC Safe)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400 font-sans">Muatan & Kebutuhan Crane:</span>
                <span className="font-bold text-tactical-cyan">{totalContainers} Box · {minCranes} Cranes</span>
              </div>
            </div>

            <div className="pt-2 border-t border-glass-border flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors font-mono"
              >
                Periksa Kembali Berkas
              </button>

              <button
                type="button"
                onClick={handleExecuteSubmit}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-electric-amber hover:bg-electric-amber-hover text-slate-950 font-black text-xs uppercase shadow-amber-glow transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Ya, Kirim & Kunci Berkas Resmi</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
