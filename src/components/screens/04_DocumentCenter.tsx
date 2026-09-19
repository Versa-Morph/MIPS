"use client";

import React, { useState } from "react";
import {
  FileText,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Eye,
  Clock,
  Lightbulb,
  AlertCircle,
} from "lucide-react";
import { useTrainingStore } from "@/store/useTrainingStore";
import { TrainingState } from "@/types/simulation";
import { DocumentType } from "@/types/domain";
import { Modal } from "@/components/common/Modal";
import { ArrivalNoticeDoc } from "@/components/documents/ArrivalNoticeDoc";
import { VesselManifestDoc } from "@/components/documents/VesselManifestDoc";
import { CargoManifestDoc } from "@/components/documents/CargoManifestDoc";
import { BerthInfoDoc } from "@/components/documents/BerthInfoDoc";

export function DocumentCenterScreen() {
  const {
    documents,
    markDocumentViewed,
    activeDocumentModal,
    openDocumentModal,
    setStep,
  } = useTrainingStore();

  const [openedDocument, setOpenedDocument] = useState<DocumentType | null>(null);

  const handleOpenDoc = (type: DocumentType) => {
    setOpenedDocument(type);
    markDocumentViewed(type, 15);
  };

  const handleCloseDoc = () => {
    setOpenedDocument(null);
  };

  const viewedCount = documents.filter((d) => d.isViewed).length;
  const allViewed = viewedCount === documents.length;

  const currentActiveDoc = documents.find((d) => d.type === openedDocument);

  const renderDocumentContent = () => {
    if (!currentActiveDoc) return null;
    switch (currentActiveDoc.type) {
      case "ARRIVAL_NOTICE":
        return <ArrivalNoticeDoc document={currentActiveDoc} />;
      case "VESSEL_MANIFEST":
        return <VesselManifestDoc document={currentActiveDoc} />;
      case "CARGO_MANIFEST":
        return <CargoManifestDoc document={currentActiveDoc} />;
      case "BERTH_INFORMATION":
        return <BerthInfoDoc document={currentActiveDoc} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      {/* Navigation breadcrumb */}
      <button
        onClick={() => setStep(TrainingState.BRIEFING)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Mission Briefing
      </button>

      {/* Screen Header */}
      <div className="rounded-2xl bg-gradient-to-r from-[#08182B] via-[#0E2239] to-[#162E4D] border border-slate-800 p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[#F5B800] text-xs font-bold uppercase tracking-wider">
            <span>●</span> Phase 02: Document Analysis & Verification
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Operational Document Center
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl">
            Inspect all official maritime documents to identify vessel dimensions,
            arrival draft constraints, and wharf capacity before taking your berth
            decision.
          </p>
        </div>

        {/* Inspection Tracker Badge */}
        <div className="px-5 py-3 rounded-xl bg-slate-950/70 border border-slate-700/60 text-right self-start md:self-auto shrink-0 shadow-inner">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">
            Verification Progress
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xl font-black text-[#F5B800]">
              {viewedCount} / {documents.length}
            </span>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded ${
                allViewed
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
              }`}
            >
              {allViewed ? "All Verified" : "Review in Progress"}
            </span>
          </div>
        </div>
      </div>

      {/* Analytical Insight Banner */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3.5 text-amber-200 text-xs sm:text-sm shadow-sm">
        <Lightbulb className="w-5 h-5 text-[#F5B800] shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-300 font-bold block mb-0.5">
            CADET INSTRUCTIONAL NOTE:
          </strong>
          Click each document card below to open and examine the official particulars.
          Cross-reference the vessel&apos;s Arrival Draft (10.20m) against the UKC
          requirements (+1.3m) to find the minimum controlling depth.
        </div>
      </div>

      {/* 4 Document Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {documents.map((doc, index) => (
          <div
            key={doc.id}
            onClick={() => handleOpenDoc(doc.type)}
            className={`cursor-pointer rounded-2xl bg-slate-900 border p-6 transition-all duration-300 flex flex-col justify-between group shadow-lg hover:shadow-2xl hover:scale-[1.01] ${
              doc.isViewed
                ? "border-emerald-500/40 hover:border-emerald-500"
                : "border-slate-800 hover:border-[#F5B800]"
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold ${
                      doc.isViewed
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-slate-800 text-amber-400"
                    }`}
                  >
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono text-xs text-slate-400 block">
                      Doc 0{index + 1} · {doc.referenceNumber}
                    </span>
                    <h3 className="text-base font-bold text-white group-hover:text-[#F5B800] transition-colors">
                      {doc.title}
                    </h3>
                  </div>
                </div>

                <span
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 font-mono ${
                    doc.isViewed
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      : "bg-slate-800 text-slate-400 border border-slate-700"
                  }`}
                >
                  {doc.isViewed ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      VERIFIED
                    </>
                  ) : (
                    "UNREVIEWED"
                  )}
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {doc.summary}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5" />
                {doc.viewDurationSeconds > 0
                  ? `${doc.viewDurationSeconds}s logged`
                  : "Not yet opened"}
              </span>

              <button className="inline-flex items-center gap-1 text-[#F5B800] group-hover:underline font-semibold text-xs">
                <Eye className="w-4 h-4" />
                <span>Open Document</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Navigation Bar */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-400 flex items-center gap-2">
          {!allViewed ? (
            <>
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>
                Tip: Reviewing all 4 documents maximizes your Document Review
                Assessment score (20/20 pts).
              </span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300 font-semibold">
                All 4 documents verified! You are fully prepared to take the berth decision.
              </span>
            </>
          )}
        </div>

        <button
          onClick={() => setStep(TrainingState.DECISION)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#F5B800] hover:bg-[#D99B00] text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 transition-all transform hover:scale-[1.02]"
        >
          <span>Proceed to Berth Assignment</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      {/* Modal Dialog Document Viewer */}
      {openedDocument && currentActiveDoc && (
        <Modal
          isOpen={true}
          onClose={handleCloseDoc}
          title={currentActiveDoc.title}
          referenceNumber={currentActiveDoc.referenceNumber}
          pdfUrl={currentActiveDoc.pdfUrl}
        >
          {renderDocumentContent()}
        </Modal>
      )}
    </div>
  );
}
