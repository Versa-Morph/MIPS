"use client";

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

  const progressPercent =
    activeStepIndex < 0 ? 0 : (activeStepIndex / (steps.length - 1)) * 100;

  return (
    <div className="w-full bg-abyssal/95 backdrop-blur-md border-b border-glass-border py-3.5 px-4 sm:px-8 select-none">
      <div className="max-w-5xl mx-auto flex items-center justify-between relative">
        {/* Background base connecting track */}
        <div className="absolute top-4 left-6 right-6 h-1 bg-slate-800/90 rounded-full -z-0"></div>

        {/* Dynamic active connecting track with tactical glow */}
        <div
          className="absolute top-4 left-6 h-1 bg-gradient-to-r from-safety-emerald via-tactical-cyan to-tactical-cyan rounded-full transition-all duration-500 shadow-cyan-glow -z-0"
          style={{
            width: `calc(${progressPercent}% * 0.94)`,
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
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-mono font-bold text-xs transition-all duration-300 ${
                  isCompleted
                    ? "bg-safety-emerald text-abyssal font-extrabold shadow-emerald-glow ring-2 ring-safety-emerald/40"
                    : isActive
                    ? "bg-tactical-cyan text-abyssal font-black shadow-cyan-glow ring-4 ring-tactical-cyan/40 scale-110"
                    : "bg-abyssal-surface border border-slate-700/80 text-slate-500"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : (
                  <span>{step.phaseNumber}</span>
                )}
              </div>
              <span
                className={`text-[10px] sm:text-xs font-mono font-bold tracking-wider transition-colors ${
                  isActive
                    ? "text-tactical-cyan"
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
