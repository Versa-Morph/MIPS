"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, FileText, Download, ExternalLink, Table, Shield, Sparkles } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  referenceNumber?: string;
  pdfUrl?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  referenceNumber,
  pdfUrl,
  children,
  maxWidth,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const isDoc = Boolean(pdfUrl);
  const [viewMode, setViewMode] = useState<"pdf" | "sheet">(
    pdfUrl ? "pdf" : "sheet"
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (pdfUrl) {
      setViewMode("pdf");
    }
  }, [pdfUrl, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const resolvedMaxWidth = isDoc
    ? "max-w-5xl h-[88vh]"
    : maxWidth || "max-w-2xl max-h-[92vh]";

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto animate-fadeIn"
    >
      {/* Clean Dark Backdrop with Soft Blur */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-all duration-200"
        aria-hidden="true"
      />

      {/* Modal Dialog Card - Distinct, Clearly Visible with Solid Slate-900 Surface */}
      <div
        className={`relative w-full my-auto ${resolvedMaxWidth} rounded-2xl bg-slate-900 border border-slate-700 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.08)] flex flex-col overflow-hidden z-10 text-slate-100 font-sans animate-modal-pop`}
      >
        {/* Single Clean Modal Header */}
        <div className="px-5 sm:px-6 py-4 bg-slate-800/90 border-b border-slate-700/80 flex items-center justify-between gap-3 shrink-0">
          <div className="flex-1 min-w-0 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Shield className="w-4 h-4 stroke-[2.2]" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base font-bold text-white tracking-tight font-sans truncate">
                  {title}
                </h2>
                {referenceNumber && (
                  <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 shrink-0">
                    {referenceNumber}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5 truncate">
                {isDoc
                  ? "Official Port Authority Document Viewer"
                  : "Pusat Simulasi Kepelabuhanan Tanjung Priok · KSOP Protocol"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isDoc && (
              <>
                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                  <button
                    onClick={() => setViewMode("pdf")}
                    className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      viewMode === "pdf"
                        ? "bg-electric-amber text-slate-950 font-bold"
                        : "text-slate-400 hover:text-white"
                    }`}
                    title="Render official PDF file"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Real PDF View</span>
                  </button>
                  <button
                    onClick={() => setViewMode("sheet")}
                    className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      viewMode === "sheet"
                        ? "bg-electric-amber text-slate-950 font-bold"
                        : "text-slate-400 hover:text-white"
                    }`}
                    title="Interactive digital data sheet"
                  >
                    <Table className="w-3.5 h-3.5" />
                    <span>Data Sheet</span>
                  </button>
                </div>

                <a
                  href={pdfUrl}
                  download
                  className="p-2 rounded-lg bg-slate-800/70 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-colors"
                  title="Download original PDF file"
                >
                  <Download className="w-4 h-4" />
                </a>

                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-800/70 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-colors"
                  title="Open PDF in new browser tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800/70 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 flex items-center justify-center transition-colors"
              title="Close modal (Esc)"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div
          className={`flex-1 overflow-y-auto ${
            isDoc ? "p-4 sm:p-6 bg-slate-950/60 flex flex-col" : "p-5 sm:p-6"
          }`}
        >
          {isDoc && viewMode === "pdf" ? (
            <div className="w-full h-full flex-1 min-h-[550px] rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
              <iframe
                src={`${pdfUrl}#toolbar=1&navpanes=0`}
                className="w-full h-full min-h-[550px] border-0"
                title={title}
              />
            </div>
          ) : isDoc ? (
            <div className="w-full max-w-4xl mx-auto">{children}</div>
          ) : (
            children
          )}
        </div>

        {isDoc && (
          <div className="px-5 py-3 bg-abyssal border-t border-slate-800 flex items-center justify-between shrink-0 text-xs font-mono">
            <span className="text-slate-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-safety-emerald" />
              <span>Digital Signature Verified (KSOP Tanjung Priok)</span>
            </span>

            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 font-semibold text-slate-200 transition-colors font-sans text-xs"
            >
              Tutup Dokumen
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(modalContent, document.body)
    : modalContent;
}
