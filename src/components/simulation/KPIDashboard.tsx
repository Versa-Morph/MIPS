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
    <div className="p-1.5 rounded-2xl glass-panel border border-glass-border shadow-glass h-full flex flex-col select-none">
      <div className="rounded-xl bg-abyssal/90 p-4 flex flex-col h-full justify-between space-y-3 flex-1">
        {/* Header with Live Telemetry Pulse */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 shrink-0">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2 font-mono">
            <Gauge className="w-4 h-4 text-electric-amber" />
            <span>Operational KPI Telemetry</span>
          </span>
          <span className="text-[10px] font-mono font-semibold text-safety-emerald bg-safety-emerald/10 px-2 py-0.5 rounded border border-safety-emerald/30 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-safety-emerald animate-pulse"></span>
            <span>REAL-TIME FEED</span>
          </span>
        </div>

        {/* Main Containers Progress Bar */}
        <div className="p-3 rounded-xl bg-abyssal-surface/90 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5 font-medium font-mono text-[11px]">
              <Layers className="w-3.5 h-3.5 text-tactical-cyan" />
              <span>Containers Handled:</span>
            </span>
            <span className="font-mono font-black text-sm text-white">
              <span className="text-electric-amber">{containersHandled}</span> /{" "}
              {totalContainers}{" "}
              <span className="text-xs text-safety-emerald font-normal">
                ({progressPercent}%)
              </span>
            </span>
          </div>

          <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-tactical-cyan via-electric-amber to-safety-emerald rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Metric Cards Grid (Double-Bezel Micro-Cards) */}
        <div className="grid grid-cols-3 gap-2.5 text-center">
          {/* Productivity (Moves / Hour) */}
          <div className="p-2.5 rounded-xl bg-abyssal-surface/90 border border-slate-800/80 space-y-1 hover:border-slate-700 transition-colors">
            <span className="text-[9px] uppercase font-bold text-slate-400 font-mono block truncate tracking-wider">
              Gross Productivity
            </span>
            <div className="text-base sm:text-lg font-black font-mono text-electric-amber tracking-tight">
              {productivityMovesPerHour > 0 ? productivityMovesPerHour : "--"}
            </div>
            <span className="text-[9px] text-slate-500 font-mono block">
              Moves / Hour
            </span>
          </div>

          {/* Crane Utilization */}
          <div className="p-2.5 rounded-xl bg-abyssal-surface/90 border border-slate-800/80 space-y-1 hover:border-slate-700 transition-colors">
            <span className="text-[9px] uppercase font-bold text-slate-400 font-mono block truncate tracking-wider">
              Crane Util. (QC)
            </span>
            <div className="text-base sm:text-lg font-black font-mono text-tactical-cyan tracking-tight">
              {craneUtilization}%
            </div>
            <span className="text-[9px] text-slate-500 font-mono block">
              Twin Cranes Active
            </span>
          </div>

          {/* Truck Utilization */}
          <div className="p-2.5 rounded-xl bg-abyssal-surface/90 border border-slate-800/80 space-y-1 hover:border-slate-700 transition-colors">
            <span className="text-[9px] uppercase font-bold text-slate-400 font-mono block truncate tracking-wider">
              Truck Util. (TT)
            </span>
            <div className="text-base sm:text-lg font-black font-mono text-safety-emerald tracking-tight">
              {truckUtilization}%
            </div>
            <span className="text-[9px] text-slate-500 font-mono block">
              Yard Shuttles Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
