"use client";

import { Gauge, Layers } from "lucide-react";
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
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 shadow-sm h-full flex flex-col justify-between space-y-3.5 select-none">
      {/* Header with Live Telemetry Pulse */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 shrink-0">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2 font-mono">
          <Gauge className="w-4 h-4 text-amber-400" />
          <span>Operational KPI Telemetry</span>
        </span>
        <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>REAL-TIME FEED</span>
        </span>
      </div>

      {/* Main Containers Progress Bar */}
      <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400 flex items-center gap-1.5 font-medium font-sans">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Containers Handled:</span>
          </span>
          <span className="font-mono font-bold text-sm text-white">
            <span className="text-amber-400 font-black">{containersHandled}</span> /{" "}
            {totalContainers}{" "}
            <span className="text-xs text-emerald-400 font-semibold ml-1">
              ({progressPercent}%)
            </span>
          </span>
        </div>

        <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-3 gap-2.5 text-center font-mono">
        {/* Productivity (Moves / Hour) */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1 hover:border-slate-700 transition-colors">
          <span className="text-[9px] uppercase font-bold text-slate-400 block truncate tracking-wider">
            Gross Productivity
          </span>
          <div className="text-base sm:text-lg font-bold text-white tracking-tight">
            {productivityMovesPerHour > 0 ? (
              <span className="text-amber-400 font-black">{productivityMovesPerHour}</span>
            ) : (
              <span className="text-slate-500">--</span>
            )}
          </div>
          <span className="text-[9px] text-slate-400 block">
            Moves / Hour
          </span>
        </div>

        {/* Crane Utilization */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1 hover:border-slate-700 transition-colors">
          <span className="text-[9px] uppercase font-bold text-slate-400 block truncate tracking-wider">
            Crane Util. (QC)
          </span>
          <div className="text-base sm:text-lg font-bold text-white tracking-tight">
            <span className="text-cyan-400 font-black">{craneUtilization}%</span>
          </div>
          <span className="text-[9px] text-slate-400 block">
            Twin Cranes Active
          </span>
        </div>

        {/* Truck Utilization */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1 hover:border-slate-700 transition-colors">
          <span className="text-[9px] uppercase font-bold text-slate-400 block truncate tracking-wider">
            Truck Util. (TT)
          </span>
          <div className="text-base sm:text-lg font-bold text-white tracking-tight">
            <span className="text-emerald-400 font-black">{truckUtilization}%</span>
          </div>
          <span className="text-[9px] text-slate-400 block">
            Yard Shuttles Active
          </span>
        </div>
      </div>
    </div>
  );
}
