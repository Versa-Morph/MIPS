"use client";

import React from "react";
import { Anchor, AlertTriangle, CheckCircle2, XCircle, Stamp } from "lucide-react";
import { OperationalDocument } from "@/types/domain";

interface DocumentProps {
  document: OperationalDocument;
}

export function BerthInfoDoc({ document }: DocumentProps) {
  const { content } = document;

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-6 sm:p-8 space-y-6 text-slate-100 font-sans shadow-lg relative overflow-hidden">
      {/* Official Header */}
      <div className="border-b-2 border-slate-700 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black">
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

      {/* Critical UKC Regulation Box */}
      <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-amber-200 text-xs sm:text-sm">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-300 font-bold block mb-0.5">
            PORT SAFETY REGULATION — UNDER KEEL CLEARANCE (UKC):
          </strong>
          All deep-draft container vessels entering Port of MIPS must maintain a
          minimum safety margin of{" "}
          <span className="font-mono font-bold text-white bg-amber-500/30 px-1 rounded">
            +1.3 meters
          </span>{" "}
          between vessel keel and channel/berth seabed.
        </div>
      </div>

      {/* Comparative Wharf Specifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Berth B-01 Card */}
        <div className="rounded-xl bg-slate-950 border-2 border-emerald-500/40 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <h3 className="font-bold text-white text-sm">
                Berth B-01 (Deepwater Terminal)
              </h3>
            </div>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Feasible
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-900">
              <span className="text-slate-400">Maximum Length (LOA):</span>
              <span className="font-mono font-bold text-emerald-400">300.0 m</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-900">
              <span className="text-slate-400">Controlling Depth (Max Draft):</span>
              <span className="font-mono font-bold text-emerald-400">12.0 m</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-900">
              <span className="text-slate-400">Quay Cranes:</span>
              <span className="font-mono text-slate-200">2x Super Post-Panamax</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Operational Status:</span>
              <span className="font-bold text-emerald-400">Available</span>
            </div>
          </div>
        </div>

        {/* Berth B-02 Card */}
        <div className="rounded-xl bg-slate-950 border-2 border-red-500/30 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
              <h3 className="font-bold text-white text-sm">
                Berth B-02 (Feeder Quay)
              </h3>
            </div>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/30 flex items-center gap-1">
              <XCircle className="w-3 h-3" /> Size Restricted
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-900">
              <span className="text-slate-400">Maximum Length (LOA):</span>
              <span className="font-mono font-bold text-red-400">250.0 m</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-900">
              <span className="text-slate-400">Controlling Depth (Max Draft):</span>
              <span className="font-mono font-bold text-red-400">9.0 m</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-900">
              <span className="text-slate-400">Quay Cranes:</span>
              <span className="font-mono text-slate-200">2x Panamax Cranes</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Operational Status:</span>
              <span className="font-bold text-slate-300">Available (Feeder Only)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Warning Notes */}
      {content.notes && content.notes.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Harbor Master Restrictive Directives
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
        <div className="flex items-center gap-2 text-amber-400 text-xs font-mono">
          <Stamp className="w-5 h-5 text-amber-400" />
          <span>{content.officialStampText || "PORT CAPACITY RECORD"}</span>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          Wharf Master Division · Verified
        </div>
      </div>
    </div>
  );
}
