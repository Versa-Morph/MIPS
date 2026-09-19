"use client";

import React, { useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
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
    <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-4 shadow-lg select-none">
      {/* Top Playback Controls & Clock */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Play / Pause Toggle Button */}
          <button
            onClick={isPlaying ? pause : play}
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all shadow-md ${
              isPlaying
                ? "bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/20"
                : "bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-emerald-500/20 animate-pulse"
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
            onClick={() => tick(5)}
            disabled={isCompleted}
            className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition-colors"
            title="Step +5 Simulated Minutes"
          >
            <StepForward className="w-4 h-4" />
          </button>

          {/* Reset Button */}
          <button
            onClick={resetSimulation}
            className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition-colors"
            title="Rewind / Reset to 08:00"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Multipliers (1x, 2x, 4x) */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          {([1, 2, 4] as const).map((spd) => (
            <button
              key={spd}
              onClick={() => setSpeed(spd)}
              className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-colors ${
                speedMultiplier === spd
                  ? "bg-[#F5B800] text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>

        {/* Big Clock Display */}
        <div className="text-right">
          <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 justify-end">
            <Clock className="w-3 h-3 text-amber-400" /> SIM TIME
          </div>
          <div className="font-mono text-xl font-black text-[#F5B800] tracking-tight">
            {clockTime}{" "}
            <span className="text-xs text-slate-400 font-normal">WIB</span>
          </div>
        </div>
      </div>

      {/* Timeline Scrubber Slider */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
          <span>T+00 (08:00)</span>
          <span className="text-amber-300 font-semibold">
            T+{currentSimMinute.toString().padStart(2, "0")} / T+45
          </span>
          <span>T+45 (08:45)</span>
        </div>

        <input
          type="range"
          min="0"
          max="45"
          value={currentSimMinute}
          onChange={(e) => seek(Number(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#F5B800]"
        />
      </div>
    </div>
  );
}
