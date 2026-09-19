"use client";

import React from "react";
import { Anchor, AlertCircle, Stamp } from "lucide-react";
import { OperationalDocument } from "@/types/domain";

interface DocumentProps {
  document: OperationalDocument;
}

export function ArrivalNoticeDoc({ document }: DocumentProps) {
  const { content } = document;

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-6 sm:p-8 space-y-6 text-slate-100 font-sans shadow-lg relative overflow-hidden">
      {/* Official Watermark */}
      <div className="absolute right-8 top-12 opacity-5 pointer-events-none select-none">
        <Anchor className="w-80 h-80 text-white" />
      </div>

      {/* Official Header */}
      <div className="border-b-2 border-slate-700 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-[#F5B800] text-slate-950 flex items-center justify-center font-black">
            <Anchor className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wide text-white">
              {content.header}
            </h2>
            <p className="text-xs text-slate-400">{content.issuer}</p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs font-mono font-bold text-amber-400">
            {document.referenceNumber}
          </div>
          <div className="text-[11px] text-slate-400">{content.date}</div>
        </div>
      </div>

      {/* Critical Highlight Alert Banner */}
      <div className="p-4 rounded-lg bg-red-950/40 border border-red-500/40 flex items-start gap-3 text-red-200 text-xs sm:text-sm">
        <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-red-300 font-bold block mb-0.5">
            CRITICAL NAUTICAL PARAMETERS DECLARED:
          </strong>
          Arrival Draft (Aft) is strictly declared at{" "}
          <span className="font-mono font-black text-red-400 bg-red-900/40 px-1.5 py-0.5 rounded border border-red-500/30">
            10.20 METERS
          </span>
          . With mandatory Under Keel Clearance (UKC) of +1.3m, the required
          controlling depth for berthing is{" "}
          <span className="font-mono font-black text-white bg-red-500 px-1.5 py-0.5 rounded">
            11.50 METERS
          </span>
          .
        </div>
      </div>

      {/* Tabular Specification Grid */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Vessel & Arrival Particulars
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5 text-xs bg-slate-950 p-4 rounded-lg border border-slate-800">
          {Object.entries(content.details).map(([key, value]) => {
            const isCriticalDraft = key.includes("Draft (Aft");
            const isLOA = key.includes("LOA");

            return (
              <div
                key={key}
                className={`flex justify-between py-1.5 border-b border-slate-800/80 ${
                  isCriticalDraft
                    ? "bg-red-500/10 px-2 rounded font-semibold text-red-300"
                    : isLOA
                    ? "bg-amber-500/10 px-2 rounded font-semibold text-amber-300"
                    : ""
                }`}
              >
                <span className="text-slate-400">{key}:</span>
                <span
                  className={`font-mono ${
                    isCriticalDraft
                      ? "text-red-400 font-bold"
                      : isLOA
                      ? "text-amber-300 font-bold"
                      : "text-slate-100"
                  }`}
                >
                  {value}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Operational Notes */}
      {content.notes && content.notes.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Navigation & Clearance Directives
          </h3>
          <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside bg-slate-950/60 p-4 rounded-lg border border-slate-800">
            {content.notes.map((note, index) => (
              <li key={index} className="leading-relaxed">
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Official Stamp & Signatures */}
      <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono">
          <Stamp className="w-5 h-5 text-emerald-400" />
          <span>{content.officialStampText || "PORT AUTHORITY CLEARED"}</span>
        </div>

        <div className="text-center sm:text-right text-xs text-slate-400">
          <div className="font-semibold text-slate-200">Capt. H. Gunawan</div>
          <div>Harbor Master Duty Officer · Port of MIPS</div>
        </div>
      </div>
    </div>
  );
}
