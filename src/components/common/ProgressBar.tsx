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
  phaseNumber: string;
  associatedStates: TrainingState[];
}

const steps: StepItem[] = [
  {
    id: "step-1",
    label: "BRIEFING",
    phaseNumber: "01",
    associatedStates: [
      TrainingState.DASHBOARD,
      TrainingState.SCENARIO_SELECTION,
      TrainingState.BRIEFING,
    ],
  },
  {
    id: "step-2",
    label: "DOCUMENTS",
    phaseNumber: "02",
    associatedStates: [TrainingState.DOCUMENT_REVIEW],
  },
  {
    id: "step-3",
    label: "DECISION",
    phaseNumber: "03",
    associatedStates: [TrainingState.DECISION, TrainingState.DECISION_VALIDATED],
  },
  {
    id: "step-4",
    label: "SIMULATION",
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
    <div className="w-full bg-[#0A192F] border-b border-slate-800/80 py-3 px-4 sm:px-8 select-none">
      <div className="max-w-5xl mx-auto flex items-center justify-between relative">
        {/* Background connecting track */}
        <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-0.5 bg-slate-800 -z-0"></div>

        {/* Dynamic active connecting track */}
        <div
          className="absolute top-1/2 left-4 -translate-y-1/2 h-0.5 bg-amber-500 transition-all duration-500 -z-0"
          style={{
            width: `${(Math.max(0, activeStepIndex) / (steps.length - 1)) * 100}%`,
          }}
        ></div>

        {steps.map((step, index) => {
          const isCompleted = index < activeStepIndex;
          const isActive = index === activeStepIndex;

          return (
            <div
              key={step.id}
              className="flex flex-col items-center gap-1.5 relative z-10"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                  isCompleted
                    ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 ring-2 ring-emerald-500/30"
                    : isActive
                    ? "bg-[#F5B800] text-slate-950 font-black shadow-lg shadow-amber-500/30 ring-4 ring-amber-500/20 scale-110"
                    : "bg-slate-900 border border-slate-700 text-slate-500"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : (
                  <span>{step.phaseNumber}</span>
                )}
              </div>
              <span
                className={`text-[10px] sm:text-xs font-bold tracking-wider transition-colors ${
                  isActive
                    ? "text-[#F5B800]"
                    : isCompleted
                    ? "text-slate-300"
                    : "text-slate-600"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
