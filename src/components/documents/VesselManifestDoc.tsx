"use client";

import React from "react";
import { Ship, Stamp, Info } from "lucide-react";
import { OperationalDocument } from "@/types/domain";

interface DocumentProps {
  document: OperationalDocument;
}

export function VesselManifestDoc({ document }: DocumentProps) {
  const { content } = document;

  return (
    <div className="bg-white dark:bg-[#0A1931] border border-slate-200 dark:border-[#1E3A5F] rounded-xl p-6 sm:p-8 space-y-6 text-slate-900 dark:text-slate-100 font-sans shadow-md relative overflow-hidden">
      {/* Official Header */}
      <div className="border-b-2 border-slate-200 dark:border-slate-700 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-sky-500 text-slate-950 flex items-center justify-center font-black">
            <Ship className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wide text-slate-900 dark:text-white">
              {content.header}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{content.issuer}</p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs font-mono font-bold text-sky-400">
            {document.referenceNumber}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">{content.date}</div>
        </div>
      </div>

      {/* Overview Note */}
      <div className="p-4 rounded-lg bg-sky-950/40 border border-sky-500/30 flex items-start gap-3 text-sky-200 text-xs sm:text-sm">
        <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-sky-300 font-bold block mb-0.5">
            STRUCTURAL & REGISTRY CLASSIFICATION:
          </strong>
          MV Nusantara is a Post-Panamax container carrier built to Lloyd&apos;s
          Register 100A1 standard. Certified for international container transit.
        </div>
      </div>

      {/* Technical Specifications Grid */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Ship Particulars & Engineering Data
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5 text-xs bg-slate-50 dark:bg-[#102A45] p-4 rounded-lg border border-slate-200 dark:border-[#1E3A5F]">
          {Object.entries(content.details).map(([key, value]) => (
            <div
              key={key}
              className="flex justify-between py-1.5 border-b border-slate-800/80"
            >
              <span className="text-slate-400">{key}:</span>
              <span className="font-mono font-semibold text-slate-100">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      {content.notes && content.notes.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Equipments & Fastening Certifications
          </h3>
          <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 list-disc list-inside bg-slate-50/70 dark:bg-[#102A45]/70 p-4 rounded-lg border border-slate-200 dark:border-[#1E3A5F]">
            {content.notes.map((note, index) => (
              <li key={index} className="leading-relaxed">
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Official Stamp */}
      <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sky-400 text-xs font-mono">
          <Stamp className="w-5 h-5 text-sky-400" />
          <span>{content.officialStampText || "CLASSIFICATION CERTIFIED"}</span>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          Registry Port: Jakarta (IDJKT)
        </div>
      </div>
    </div>
  );
}
