"use client";

import React from "react";
import { Check } from "lucide-react";
import { TrainingState } from "@/types/simulation";

interface ProgressBarProps {
  currentState: TrainingState;
}

interface StepItem {
  id: string;
  label: string;
  subtitle: string;
  phaseNumber: string;
  associatedStates: TrainingState[];
}

const steps: StepItem[] = [
  {
    id: "step-1",
    label: "BRIEFING",
    subtitle: "Mission Order",
    phaseNumber: "01",
    associatedStates: [
      TrainingState.SCENARIO_SELECTION,
      TrainingState.BRIEFING,
    ],
  },
  {
    id: "step-2",
    label: "DOCUMENTS",
    subtitle: "Clearance Dossier",
    phaseNumber: "02",
    associatedStates: [TrainingState.DOCUMENT_REVIEW],
  },
  {
    id: "step-3",
    label: "DECISION",
    subtitle: "Berth Assignment",
    phaseNumber: "03",
    associatedStates: [TrainingState.DECISION, TrainingState.DECISION_VALIDATED],
  },
  {
    id: "step-4",
    label: "SIMULATION",
    subtitle: "Terminal Ops",
    phaseNumber: "04",
    associatedStates: [
      TrainingState.SIMULATION_RUNNING,
      TrainingState.SIMULATION_PAUSED,
      TrainingState.SIMULATION_COMPLETED,
    ],
  },
  {
    id: "step-5",
    label: "ASSESSMENT",
    subtitle: "STCW Debrief",
    phaseNumber: "05",
    associatedStates: [
      TrainingState.ASSESSMENT,
      TrainingState.TRAINING_COMPLETED,
    ],
  },
];

export function ProgressBar({ currentState }: ProgressBarProps) {
  // Determine current active step index
  const activeStepIndex = steps.findIndex((step) =>
    step.associatedStates.includes(currentState)
  );

  return (
    <nav
      aria-label="Training Mission Progress"
      className="w-full bg-white/95 dark:bg-[#11131a]/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-[#222634] py-3 px-3 sm:px-6 select-none sticky top-16 z-30 shadow-sm transition-colors"
    >
      <div className="w-full px-2 sm:px-4 lg:px-6 flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < activeStepIndex;
          const isActive = index === activeStepIndex;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              {/* Step Milestone Node */}
              <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 group">
                {/* Visual Indicator Node */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 border ${
                    isCompleted
                      ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-400 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 shadow-sm"
                      : isActive
                      ? "bg-coral text-white font-black border-coral/80 shadow-coral scale-105"
                      : "bg-slate-100 dark:bg-[#1c202c] border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : (
                    <span>{step.phaseNumber}</span>
                  )}
                </div>

                {/* Step Metadata & Typography */}
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[11px] sm:text-xs font-sans font-bold tracking-wider transition-colors ${
                        isActive
                          ? "text-coral font-extrabold"
                          : isCompleted
                          ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                          : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {step.label}
                    </span>

                    {/* Micro Status Chip */}
                    {isCompleted && (
                      <span className="hidden lg:inline text-[9px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1 py-0.2 rounded border border-emerald-200 dark:border-emerald-500/20 leading-none">
                        DONE
                      </span>
                    )}
                    {isActive && (
                      <span className="hidden lg:inline text-[9px] font-mono font-bold text-coral bg-coral-50 dark:bg-coral-950/40 px-1.5 py-0.5 rounded border border-coral-200 dark:border-coral-800/60 leading-none animate-pulse">
                        CURRENT
                      </span>
                    )}
                  </div>

                  <span
                    className={`hidden md:block text-[10px] font-mono transition-colors ${
                      isActive
                        ? "text-coral/80 dark:text-coral/90 font-medium"
                        : isCompleted
                        ? "text-slate-500 dark:text-slate-400"
                        : "text-slate-400 dark:text-slate-600"
                    }`}
                  >
                    {step.subtitle}
                  </span>
                </div>
              </div>

              {/* Connecting Bridge Trace */}
              {!isLast && (
                <div className="flex-1 mx-2 sm:mx-4 h-[2px] bg-slate-200 dark:bg-slate-800 rounded-full relative overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      index < activeStepIndex
                        ? "w-full bg-gradient-to-r from-emerald-500 to-coral shadow-sm"
                        : "w-0"
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
}
