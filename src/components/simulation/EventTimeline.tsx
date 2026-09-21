"use client";

import { useEffect, useRef } from "react";
import {
  Activity,
  Compass,
  Anchor,
  Layers,
  Truck,
} from "lucide-react";
import { useSimulationStore } from "@/store/useSimulationStore";
import { TimelineEvent } from "@/types/simulation";

export function EventTimeline() {
  const { eventsHistory } = useSimulationStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new event
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [eventsHistory.length]);

  const getCategoryIcon = (category: TimelineEvent["category"]) => {
    switch (category) {
      case "NAVIGATION":
        return <Compass className="w-3.5 h-3.5 text-cyan-400" />;
      case "MOORING":
        return <Anchor className="w-3.5 h-3.5 text-amber-400" />;
      case "CRANE":
        return <Layers className="w-3.5 h-3.5 text-emerald-400" />;
      case "TRUCK":
        return <Truck className="w-3.5 h-3.5 text-blue-400" />;
      case "SYSTEM":
      default:
        return <Activity className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const getCategoryBadgeClass = (category: TimelineEvent["category"]) => {
    switch (category) {
      case "NAVIGATION":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
      case "MOORING":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "CRANE":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "TRUCK":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "SYSTEM":
      default:
        return "bg-slate-800 text-slate-400 border-slate-700";
    }
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 shadow-sm h-full flex flex-col select-none">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3 shrink-0">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2 font-mono">
          <Activity className="w-4 h-4 text-amber-400" />
          <span>Terminal Event Log & Timeline</span>
        </span>
        <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2.5 py-0.5 rounded border border-slate-800">
          {eventsHistory.length} events logged
        </span>
      </div>

      {/* Auto-scrolling list of logged events */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[160px] text-xs font-mono"
      >
        {eventsHistory.map((event, index) => (
          <div
            key={index}
            className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-2.5 transition-all hover:border-slate-700"
          >
            <span className="text-amber-400 font-bold shrink-0 text-[11px] pt-0.5 font-mono">
              [{event.clockTime}]
            </span>

            <span
              className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded border shrink-0 flex items-center gap-1 font-mono ${getCategoryBadgeClass(
                event.category
              )}`}
            >
              {getCategoryIcon(event.category)}
              <span>{event.category}</span>
            </span>

            <div className="flex-1 min-w-0">
              <div className="font-semibold text-slate-100 truncate text-[11px]">
                {event.title}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {event.description}
              </div>
            </div>

            {event.containersCompleted > 0 && (
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded shrink-0 font-mono">
                {event.containersCompleted}/50
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
