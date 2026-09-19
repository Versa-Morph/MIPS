"use client";

import React from "react";
import { Gauge, Layers, Activity, Truck, CheckCircle2 } from "lucide-react";
import { useSimulationStore } from "@/store/useSimulationStore";

export function KPIDashboard() {
  const {
    containersHandled,
    totalContainers,
    productivityMovesPerHour,
    craneUtilization,
    truckUtilization,
  } = useSimulationStore();

  const progressPercent = Math.round(
    (containersHandled / totalContainers) * 100
  );

  return (
    <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 flex flex-col h-full shadow-lg justify-between space-y-3 select-none">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 shrink-0">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Gauge className="w-4 h-4 text-[#F5B800]" /> Operational KPI Telemetry
        </span>
        <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
          ● REAL-TIME FEED
        </span>
      </div>

      {/* Main Containers Progress Bar */}
      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center gap-1.5 font-medium">
            <Layers className="w-3.5 h-3.5 text-sky-400" /> Containers Handled:
          </span>
          <span className="font-mono font-black text-sm text-white">
            <span className="text-[#F5B800]">{containersHandled}</span> /{" "}
            {totalContainers}{" "}
            <span className="text-xs text-emerald-400 font-normal">
              ({progressPercent}%)
            </span>
          </span>
        </div>

        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-sky-500 via-amber-500 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-3 gap-2.5 text-center">
        {/* Productivity (Moves / Hour) */}
        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
          <span className="text-[9px] uppercase font-bold text-slate-400 block truncate">
            Gross Productivity
          </span>
          <div className="text-base sm:text-lg font-black font-mono text-[#F5B800] tracking-tight">
            {productivityMovesPerHour > 0 ? productivityMovesPerHour : "--"}
          </div>
          <span className="text-[9px] text-slate-500 font-mono block">
            Moves / Hour
          </span>
        </div>

        {/* Crane Utilization */}
        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
          <span className="text-[9px] uppercase font-bold text-slate-400 block truncate">
            Crane Util. (QC)
          </span>
          <div className="text-base sm:text-lg font-black font-mono text-sky-400 tracking-tight">
            {craneUtilization}%
          </div>
          <span className="text-[9px] text-slate-500 font-mono block">
            Twin Cranes Active
          </span>
        </div>

        {/* Truck Utilization */}
        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
          <span className="text-[9px] uppercase font-bold text-slate-400 block truncate">
            Truck Util. (TT)
          </span>
          <div className="text-base sm:text-lg font-black font-mono text-emerald-400 tracking-tight">
            {truckUtilization}%
          </div>
          <span className="text-[9px] text-slate-500 font-mono block">
            Yard Shuttles Active
          </span>
        </div>
      </div>
    </div>
  );
}
