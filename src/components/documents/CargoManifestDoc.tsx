"use client";

import React from "react";
import { Package, Layers, Stamp, CheckCircle2 } from "lucide-react";
import { OperationalDocument } from "@/types/domain";

interface DocumentProps {
  document: OperationalDocument;
}

export function CargoManifestDoc({ document }: DocumentProps) {
  const { content } = document;

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-6 sm:p-8 space-y-6 text-slate-100 font-sans shadow-lg relative overflow-hidden">
      {/* Official Header */}
      <div className="border-b-2 border-slate-700 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
            <Package className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wide text-white">
              {content.header}
            </h2>
            <p className="text-xs text-slate-400">{content.issuer}</p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs font-mono font-bold text-emerald-400">
            {document.referenceNumber}
          </div>
          <div className="text-[11px] text-slate-400">{content.date}</div>
        </div>
      </div>

      {/* Cargo Lot Quick Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">
            Total Containers
          </div>
          <div className="text-xl font-black text-white font-mono">50 Units</div>
        </div>

        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">
            Import (Discharge)
          </div>
          <div className="text-xl font-black text-sky-400 font-mono">30 Units</div>
        </div>

        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">
            Export (Loading)
          </div>
          <div className="text-xl font-black text-emerald-400 font-mono">
            20 Units
          </div>
        </div>

        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">
            Reefer (Cold-Chain)
          </div>
          <div className="text-xl font-black text-amber-400 font-mono">
            5 Units
          </div>
        </div>
      </div>

      {/* Cargo Breakdown Specifications */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Cargo Distribution Particulars
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5 text-xs bg-slate-950 p-4 rounded-lg border border-slate-800">
          {Object.entries(content.details).map(([key, value]) => (
            <div
              key={key}
              className="flex justify-between py-1.5 border-b border-slate-800/80"
            >
              <span className="text-slate-400">{key}:</span>
              <span className="font-mono font-bold text-slate-100">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Special Handling Notes */}
      {content.notes && content.notes.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-emerald-400" /> Special Cargo Handling Instructions
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

      {/* Official Stamp */}
      <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono">
          <Stamp className="w-5 h-5 text-emerald-400" />
          <span>{content.officialStampText || "CUSTOMS CARGO MANIFEST VERIFIED"}</span>
        </div>
        <div className="text-xs text-slate-400 font-mono flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> IMDG Dangerous Goods: 0 Units
        </div>
      </div>
    </div>
  );
}
