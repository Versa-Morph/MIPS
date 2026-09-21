"use client";

import { useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Clock,
  StepForward,
} from "lucide-react";
import { useSimulationStore } from "@/store/useSimulationStore";

export function SimulationControls() {
  const {
    isPlaying,
    currentSimMinute,
    speedMultiplier,
    clockTime,
    play,
    pause,
    setSpeed,
    seek,
    tick,
    resetSimulation,
    isCompleted,
  } = useSimulationStore();

  // Active simulation timer loop
  useEffect(() => {
    if (!isPlaying) return;

    // Standard interval: 1 sim-minute = 2000ms / speedMultiplier
    const intervalMs = Math.max(100, 2000 / speedMultiplier);
    const timer = setInterval(() => {
      tick(1);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, speedMultiplier, tick]);

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 shadow-sm select-none">
      <div className="space-y-4">
        {/* Top Playback Controls & Clock */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* Play / Pause Toggle Button */}
            <button
              type="button"
              onClick={isPlaying ? pause : play}
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all transform active:scale-[0.96] shadow-sm ${
                isPlaying
                  ? "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                  : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-pulse"
              }`}
              title={isPlaying ? "Pause Simulation" : "Start / Resume Simulation"}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            {/* Step +5 min Button */}
            <button
              type="button"
              onClick={() => tick(5)}
              disabled={isCompleted}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 disabled:opacity-30 border border-slate-700 transition-all active:scale-[0.96]"
              title="Step +5 Simulated Minutes"
            >
              <StepForward className="w-4 h-4" />
            </button>

            {/* Reset Button */}
            <button
              type="button"
              onClick={resetSimulation}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 border border-slate-700 transition-all active:scale-[0.96]"
              title="Rewind / Reset to 08:00"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Speed Multipliers (1x, 2x, 4x) */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            {([1, 2, 4] as const).map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => setSpeed(spd)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  speedMultiplier === spd
                    ? "bg-amber-500 text-slate-950 shadow-sm font-black"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Big Digital Chronometer Display */}
          <div className="text-right pl-2 border-l border-slate-800">
            <div className="text-[10px] uppercase font-bold text-slate-400 font-mono flex items-center gap-1 justify-end tracking-wider">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>SIM TIME</span>
            </div>
            <div className="font-mono text-xl font-black text-amber-400 tracking-tight leading-none mt-1">
              {clockTime}{" "}
              <span className="text-[11px] text-slate-400 font-normal">WIB</span>
            </div>
          </div>
        </div>

        {/* Timeline Scrubber Slider */}
        <div className="space-y-1.5 pt-1 border-t border-slate-800">
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>T+00 (08:00)</span>
            <span className="text-amber-400 font-semibold font-mono">
              T+{currentSimMinute.toString().padStart(2, "0")} / T+45
            </span>
            <span>T+45 (08:45)</span>
          </div>

          <div className="relative flex items-center">
            <input
              type="range"
              min="0"
              max="45"
              value={currentSimMinute}
              onChange={(e) => seek(Number(e.target.value))}
              className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-[#F59E0B] border border-slate-800"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
