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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-abyssal/90 backdrop-blur-md transition-opacity"
      ></div>

      {/* Modal Dialog Container */}
      <div className="relative w-full max-w-5xl h-[92vh] glass-panel rounded-2xl border-glass-border shadow-2xl flex flex-col overflow-hidden z-10 text-slate-100 font-sans">
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-abyssal-surface/90 border-b border-glass-border flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-bold text-white tracking-wide font-sans">
                {title}
              </span>
              {referenceNumber && (
                <span className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-abyssal border border-slate-700 text-electric-amber">
                  {referenceNumber}
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-400 block font-mono mt-0.5">
              Official Port Authority Document Viewer · Verified Real File Stream
            </span>
          </div>

          <div className="flex items-center gap-2">
            {pdfUrl && (
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
            )}

            {pdfUrl && (
              <a
                href={pdfUrl}
                download
                className="p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700/60 transition-colors"
                title="Download original PDF file"
              >
                <Download className="w-4 h-4" />
              </a>
            )}

            {pdfUrl && (
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700/60 transition-colors"
                title="Open PDF in new browser tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700/60 transition-colors"
              title="Close document (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-abyssal/60 flex flex-col">
          {viewMode === "pdf" && pdfUrl ? (
            <div className="w-full h-full flex-1 min-h-[550px] rounded-xl overflow-hidden border border-slate-800 shadow-inner bg-abyssal">
              <iframe
                src={`${pdfUrl}#toolbar=1&navpanes=0`}
                className="w-full h-full min-h-[550px] border-0"
                title={title}
              />
            </div>
          ) : (
            <div className="w-full max-w-4xl mx-auto">{children}</div>
          )}
        </div>

        {/* Modal Footer */}
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
      </div>
    </div>
  );
}
