"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  referenceNumber?: string;
  children: React.ReactNode;
}

export function Modal({
  isOpen,
  onClose,
  title,
  referenceNumber,
  children,
}: ModalProps) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
      ></div>

      {/* Modal Dialog Container */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0E1F35] border-2 border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 text-slate-100">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#08182B] border-b border-slate-800 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-wide">
                {title}
              </span>
              {referenceNumber && (
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
                  {referenceNumber}
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-400">
              Official Port Authority Document Viewer · Maritime Verification Mode
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            title="Close document (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-slate-950/50">
          {children}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#08182B] border-t border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-400 font-mono">
            Document status: <span className="text-emerald-400 font-bold">✓ Logged & Verified</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
}
