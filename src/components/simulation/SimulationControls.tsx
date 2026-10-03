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
    <div className="rounded-2xl bg-white dark:bg-[#0A1931] border border-slate-200/80 dark:border-[#1E3A5F] p-4 shadow-card dark:shadow-card-dark select-none text-slate-800 dark:text-white">
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
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-[#102A45] dark:hover:bg-[#132B4F] dark:text-slate-300 hover:text-[#0066FF] dark:hover:text-[#38BDF8] disabled:opacity-30 border border-slate-200 dark:border-slate-800 transition-all active:scale-[0.96]"
              title="Step +5 Simulated Minutes"
            >
              <StepForward className="w-4 h-4" />
            </button>

            {/* Reset Button */}
            <button
              type="button"
              onClick={resetSimulation}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-[#102A45] dark:hover:bg-[#132B4F] dark:text-slate-300 hover:text-amber-500 border border-slate-200 dark:border-slate-800 transition-all active:scale-[0.96]"
              title="Rewind / Reset to 08:00"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Speed Multipliers (1x, 2x, 4x) */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#102A45] p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            {([1, 2, 4] as const).map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => setSpeed(spd)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  speedMultiplier === spd
                    ? "bg-[#F59E0B] text-slate-950 shadow-sm font-black"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Big Digital Chronometer Display */}
          <div className="text-right pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="text-[10px] uppercase font-bold text-slate-400 font-mono flex items-center gap-1 justify-end tracking-wider">
              <Clock className="w-3 h-3 text-[#F59E0B]" />
              <span>SIM TIME</span>
            </div>
            <div className="font-mono text-xl font-black text-[#F59E0B] tracking-tight leading-none mt-1">
              {clockTime}{" "}
              <span className="text-[11px] text-slate-400 font-normal">WIB</span>
            </div>
          </div>
        </div>

        {/* Timeline Scrubber Slider */}
        <div className="space-y-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-500 dark:text-slate-400 text-[10px]">T+00 (08:00)</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 text-xs bg-slate-100 dark:bg-[#102A45] px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
              T+{currentSimMinute.toString().padStart(2, "0")} / T+45
            </span>
            <span className="text-slate-500 dark:text-slate-400 text-[10px]">T+45 (08:45)</span>
          </div>

          <input
            type="range"
            min="0"
            max="45"
            value={currentSimMinute}
            onChange={(e) => seek(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-slate-200 dark:bg-[#102A45] rounded-lg appearance-none cursor-pointer accent-[#F59E0B] border border-slate-300 dark:border-slate-800"
          />
        </div>
      </div>
    </div>
  );
}
