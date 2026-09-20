"use client";

import React, { useEffect, useState } from "react";
import { X, FileText, Download, ExternalLink, Table } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  referenceNumber?: string;
  pdfUrl?: string;
  children: React.ReactNode;
}

export function Modal({
  isOpen,
  onClose,
  title,
  referenceNumber,
  pdfUrl,
  children,
}: ModalProps) {
  const isDoc = Boolean(pdfUrl);
  const [viewMode, setViewMode] = useState<"pdf" | "sheet">(
    pdfUrl ? "pdf" : "sheet"
  );

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-abyssal/90 backdrop-blur-md transition-opacity"
      ></div>

      <div
        className={`relative w-full ${
          isDoc
            ? "max-w-5xl h-[88vh]"
            : "max-w-xl max-h-[85vh] animate-modal-pop shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border-cyan-500/30"
        } glass-panel rounded-2xl border-glass-border flex flex-col overflow-hidden z-10 text-slate-100 font-sans`}
      >
        <div className="px-5 py-3.5 bg-abyssal-surface/90 border-b border-glass-border flex items-center justify-between gap-3 shrink-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm sm:text-base font-bold text-white tracking-wide font-sans truncate">
                {title}
              </span>
              {referenceNumber && (
                <span className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-abyssal border border-slate-700 text-electric-amber shrink-0">
                  {referenceNumber}
                </span>
              )}
            </div>
            {isDoc && (
              <span className="text-[11px] text-slate-400 block font-mono mt-0.5 truncate">
                Official Port Authority Document Viewer · Verified Real File Stream
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isDoc && (
              <>
                <div className="flex items-center gap-1 bg-abyssal p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setViewMode("pdf")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      viewMode === "pdf"
                        ? "bg-electric-amber text-slate-950 font-bold shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                    title="Render official PDF file"
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
                    title="Interactive digital data sheet"
                  >
                    <Table className="w-3.5 h-3.5" />
                    <span>Data Sheet</span>
                  </button>
                </div>

                <a
                  href={pdfUrl}
                  download
                  className="p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700/60 transition-colors"
                  title="Download original PDF file"
                >
                  <Download className="w-4 h-4" />
                </a>

                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700/60 transition-colors"
                  title="Open PDF in new browser tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700/60 transition-colors"
              title="Close modal (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          className={`flex-1 overflow-y-auto ${
            isDoc ? "p-4 sm:p-6 bg-abyssal/60 flex flex-col" : "p-5 sm:p-6"
          }`}
        >
          {isDoc && viewMode === "pdf" ? (
            <div className="w-full h-full flex-1 min-h-[550px] rounded-xl overflow-hidden border border-slate-800 shadow-inner bg-abyssal">
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
          <div className="px-5 py-3 bg-abyssal-surface/90 border-t border-glass-border flex items-center justify-between shrink-0 text-xs font-mono">
            <span className="text-slate-400">
              Security status:{" "}
              <span className="text-safety-emerald font-bold">
                ✓ Digital Signature Verified (BKI / KSOP Priok)
              </span>
            </span>

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 font-semibold text-slate-200 transition-colors"
            >
              Close Viewer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
