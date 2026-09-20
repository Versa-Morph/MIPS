"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Download,
  ExternalLink,
  Layers,
  FileText,
  ClipboardCheck,
  Edit3,
  Lock,
} from "lucide-react";
import { useTrainingStore } from "@/store/useTrainingStore";
import { TrainingState } from "@/types/simulation";
import { DocumentType } from "@/types/domain";
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

  const [vesselName, setVesselName] = useState(cadetDossier.vesselName || "");
  const [callSign, setCallSign] = useState(cadetDossier.callSign || "");
  const [imoNumber, setImoNumber] = useState(cadetDossier.imoNumber || "");
  const [loa, setLoa] = useState(cadetDossier.loa || "");
  const [draftAft, setDraftAft] = useState(cadetDossier.draftAft || "");
  const [requiredDepth, setRequiredDepth] = useState(
    cadetDossier.requiredDepth || ""
  );
  const [totalContainers, setTotalContainers] = useState(
    cadetDossier.totalContainers || ""
  );
  const [reeferUnits, setReeferUnits] = useState(cadetDossier.reeferUnits || "");
  const [minCranes, setMinCranes] = useState(cadetDossier.minCranes || "");

  const [submissionFeedback, setSubmissionFeedback] = useState<{
    score: number;
    feedback: string;
  } | null>(
    cadetDossier.isSubmitted
      ? {
          score: cadetDossier.score,
          feedback:
            cadetDossier.score >= 18
              ? "✓ PRE-ARRIVAL DOSSIER VERIFIED: Seluruh parameter kapal dan keselamatan navigasi tercatat akurat."
              : `⚠ EVALUASI DOKUMEN: Skor ${cadetDossier.score}/20. Beberapa data teknis tidak cocok dengan berkas resmi.`,
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

  const handleSubmitDossier = (e: React.FormEvent) => {
    e.preventDefault();
    const result = submitCadetDossier({
      vesselName,
      callSign,
      imoNumber,
      loa,
      draftAft,
      requiredDepth,
      totalContainers,
      reeferUnits,
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
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 space-y-4 animate-fadeIn select-none">
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
            <span>■ 02 ANALYSIS · PRE-ARRIVAL CLEARANCE DOSSIER</span>
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
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

          <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 shadow-lg space-y-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block border-b border-slate-800 pb-1.5">
              VERIFIED SHIP DOSSIER STATUS
            </span>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-slate-950">
                <span className="text-slate-400 font-sans">Ship Name:</span>
                <span className="font-bold text-white">
                  {cadetDossier.isSubmitted ? cadetDossier.vesselName : "--"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-950">
                <span className="text-slate-400 font-sans">Length (LOA):</span>
                <span className="font-bold text-white">
                  {cadetDossier.isSubmitted ? `${cadetDossier.loa} m` : "-- m"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-950">
                <span className="text-slate-400 font-sans">Arrival Draft:</span>
                <span className="font-bold text-amber-400">
                  {cadetDossier.isSubmitted
                    ? `${cadetDossier.draftAft} m`
                    : "-- m"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-950">
                <span className="text-slate-400 font-sans">Required Depth:</span>
                <span className="font-bold text-emerald-400">
                  {cadetDossier.isSubmitted
                    ? `${cadetDossier.requiredDepth} m`
                    : "-- m"}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400 font-sans">Dossier Score:</span>
                <span className="font-bold text-[#F5B800]">
                  {cadetDossier.isSubmitted
                    ? `${cadetDossier.score} / 20 pts`
                    : "Not Submitted"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-3">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 flex flex-col min-h-[660px]">
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

            <div className="flex-1 w-full min-h-[580px] rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner">
              {activeDoc.pdfUrl ? (
                <iframe
                  src={`${activeDoc.pdfUrl}#toolbar=1`}
                  className="w-full h-full min-h-[580px] border-0"
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

        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-lg">
            <div className="border-b border-slate-800 pb-2.5 flex items-center justify-between">
              <div>
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <ClipboardCheck className="w-4 h-4 text-[#F5B800]" />
                  PRE-ARRIVAL CLEARANCE DOSSIER
                </h2>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Formulir Pemeriksaan & Ekstraksi Data Kapal (Bobot: 20 Poin)
                </p>
              </div>

              {cadetDossier.isSubmitted && (
                <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {cadetDossier.score}/20 pts
                </span>
              )}
            </div>

            <form onSubmit={handleSubmitDossier} className="space-y-3.5 text-xs">
              <div className="space-y-2 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  A. Identifikasi Kapal (Notice of Arrival)
                </span>

                <div className="space-y-2">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-0.5 text-[11px]">
                      Nama Kapal (Vessel Name)
                    </label>
                    <input
                      type="text"
                      disabled={cadetDossier.isSubmitted}
                      value={vesselName}
                      onChange={(e) => setVesselName(e.target.value)}
                      placeholder="cth: MV Nusantara"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-[#F5B800] outline-none disabled:opacity-60"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-300 font-semibold block mb-0.5 text-[11px]">
                        Call Sign
                      </label>
                      <input
                        type="text"
                        disabled={cadetDossier.isSubmitted}
                        value={callSign}
                        onChange={(e) => setCallSign(e.target.value)}
                        placeholder="cth: PK-47A"
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-[#F5B800] outline-none disabled:opacity-60"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-semibold block mb-0.5 text-[11px]">
                        IMO Number
                      </label>
                      <input
                        type="text"
                        disabled={cadetDossier.isSubmitted}
                        value={imoNumber}
                        onChange={(e) => setImoNumber(e.target.value)}
                        placeholder="cth: 1234567"
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-[#F5B800] outline-none disabled:opacity-60"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  B. Dimensi & Sarat Air Kapal (Vessel Particulars)
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-0.5 text-[11px]">
                      Length Overall (LOA, m)
                    </label>
                    <input
                      type="text"
                      disabled={cadetDossier.isSubmitted}
                      value={loa}
                      onChange={(e) => setLoa(e.target.value)}
                      placeholder="cth: 280.0"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-[#F5B800] outline-none disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-0.5 text-[11px]">
                      Arrival Draft Aft (m)
                    </label>
                    <input
                      type="text"
                      disabled={cadetDossier.isSubmitted}
                      value={draftAft}
                      onChange={(e) => setDraftAft(e.target.value)}
                      placeholder="cth: 10.20"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-amber-400 font-bold font-mono text-xs focus:border-[#F5B800] outline-none disabled:opacity-60"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  C. Kalkulasi Kedalaman Wajib (Draft + UKC 1.3m)
                </span>

                <div>
                  <label className="text-slate-300 font-semibold block mb-0.5 text-[11px]">
                    Controlling Depth yang Disyaratkan (Meters)
                  </label>
                  <input
                    type="text"
                    disabled={cadetDossier.isSubmitted}
                    value={requiredDepth}
                    onChange={(e) => setRequiredDepth(e.target.value)}
                    placeholder="Hitung: Draft + 1.3m UKC"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-emerald-400 font-bold font-mono text-xs focus:border-[#F5B800] outline-none disabled:opacity-60"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Kedalaman minimal agar kapal tidak mengalami bahaya kandas.
                  </span>
                </div>
              </div>

              <div className="space-y-2 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  D. Operasi Muatan (Cargo Manifest)
                </span>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-0.5 text-[11px]">
                      Total Box
                    </label>
                    <input
                      type="text"
                      disabled={cadetDossier.isSubmitted}
                      value={totalContainers}
                      onChange={(e) => setTotalContainers(e.target.value)}
                      placeholder="cth: 50"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-[#F5B800] outline-none disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-0.5 text-[11px]">
                      Reefer 440V
                    </label>
                    <input
                      type="text"
                      disabled={cadetDossier.isSubmitted}
                      value={reeferUnits}
                      onChange={(e) => setReeferUnits(e.target.value)}
                      placeholder="cth: 5"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-[#F5B800] outline-none disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-0.5 text-[11px]">
                      Min. Crane
                    </label>
                    <input
                      type="text"
                      disabled={cadetDossier.isSubmitted}
                      value={minCranes}
                      onChange={(e) => setMinCranes(e.target.value)}
                      placeholder="cth: 3"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-[#F5B800] outline-none disabled:opacity-60"
                    />
                  </div>
                </div>
              </div>

              {submissionFeedback && (
                <div
                  className={`p-3 rounded-xl border text-xs leading-relaxed space-y-1 ${
                    submissionFeedback.score >= 18
                      ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-200"
                      : "bg-amber-950/40 border-amber-500/50 text-amber-200"
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5">
                    {submissionFeedback.score >= 18 ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    )}
                    <span>
                      Dossier Score: {submissionFeedback.score} / 20 Poin
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    {submissionFeedback.feedback}
                  </p>
                </div>
              )}

              {!cadetDossier.isSubmitted ? (
                <button
                  type="submit"
                  disabled={!isFormFilled}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all ${
                    isFormFilled
                      ? "bg-[#F5B800] hover:bg-[#D99B00] text-slate-950 shadow-amber-500/20 transform hover:scale-[1.02]"
                      : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                  }`}
                >
                  <ClipboardCheck className="w-4 h-4" />
                  <span>Submit Pre-Arrival Dossier</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      useTrainingStore.setState((state) => ({
                        cadetDossier: {
                          ...state.cadetDossier,
                          isSubmitted: false,
                        },
                      }));
                      setSubmissionFeedback(null);
                    }}
                    className="flex-1 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Revisi Isian Data</span>
                  </button>

                  <div className="text-emerald-400 font-mono text-[11px] font-bold flex items-center gap-1 px-2">
                    <Lock className="w-3.5 h-3.5" /> Locked
                  </div>
                </div>
              )}
            </form>

            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={handleProceed}
                disabled={!cadetDossier.isSubmitted}
                className={`w-full py-3.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg ${
                  cadetDossier.isSubmitted
                    ? "bg-[#08182B] hover:bg-[#0E2239] text-[#F5B800] border-2 border-[#F5B800] shadow-amber-500/20 transform hover:scale-[1.02]"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                }`}
              >
                <span>PROCEED TO BERTH ASSIGNMENT</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
              {!cadetDossier.isSubmitted && (
                <span className="text-[10px] text-slate-500 block text-center mt-1.5 font-mono">
                  Isi dan submit formulir dossier untuk membuka penetapan dermaga
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
