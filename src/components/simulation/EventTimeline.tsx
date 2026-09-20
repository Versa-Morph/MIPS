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
        return <Compass className="w-3.5 h-3.5 text-tactical-cyan" />;
      case "MOORING":
        return <Anchor className="w-3.5 h-3.5 text-electric-amber" />;
      case "CRANE":
        return <Layers className="w-3.5 h-3.5 text-safety-emerald" />;
      case "TRUCK":
        return <Truck className="w-3.5 h-3.5 text-yellow-400" />;
      case "SYSTEM":
      default:
        return <Activity className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const getCategoryBadgeClass = (category: TimelineEvent["category"]) => {
    switch (category) {
      case "NAVIGATION":
        return "bg-tactical-cyan/10 text-tactical-cyan border-tactical-cyan/30";
      case "MOORING":
        return "bg-electric-amber/10 text-electric-amber border-electric-amber/30";
      case "CRANE":
        return "bg-safety-emerald/10 text-safety-emerald border-safety-emerald/30";
      case "TRUCK":
        return "bg-yellow-400/10 text-yellow-400 border-yellow-400/30";
      case "SYSTEM":
      default:
        return "bg-slate-800 text-slate-400 border-slate-700";
    }
  };

  return (
    <div className="p-1.5 rounded-2xl glass-panel border border-glass-border shadow-glass h-full flex flex-col select-none">
      <div className="rounded-xl bg-abyssal/90 p-4 flex flex-col h-full flex-1">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3 shrink-0">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2 font-mono">
            <Activity className="w-4 h-4 text-electric-amber" />
            <span>Terminal Event Log & Timeline</span>
          </span>
          <span className="text-[10px] font-mono text-slate-400 bg-abyssal-surface px-2 py-0.5 rounded border border-slate-800">
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
              className="p-2.5 rounded-xl bg-abyssal-surface/80 border border-slate-800/80 flex items-start gap-2.5 transition-all hover:bg-slate-800/50"
            >
              <span className="text-electric-amber font-bold shrink-0 text-[11px] pt-0.5 font-mono">
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
                <div className="font-semibold text-slate-200 truncate text-[11px]">
                  {event.title}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {event.description}
                </div>
              </div>

              {event.containersCompleted > 0 && (
                <span className="text-[10px] text-safety-emerald font-bold bg-safety-emerald/10 border border-safety-emerald/30 px-1.5 py-0.5 rounded shrink-0 font-mono">
                  {event.containersCompleted}/50
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
