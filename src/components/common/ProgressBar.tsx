"use client";

import React from "react";
import { Check } from "lucide-react";
import { TrainingState } from "@/types/simulation";

interface ProgressBarProps {
  currentState: TrainingState;
}

interface StepItem {
  id: string;
  phaseCode: "LEARN" | "ANALYZE" | "DECIDE" | "SIMULATE" | "EVALUATE";
  label: string;
  subtitle: string;
  phaseNumber: string;
  associatedStates: TrainingState[];
  badgeColor: string;
  surfaceColor: string;
  textColor: string;
}

const steps: StepItem[] = [
  {
    id: "step-1",
    phaseCode: "LEARN",
    label: "BRIEFING",
    subtitle: "Pahami skenario & tujuan",
    phaseNumber: "01",
    associatedStates: [
      TrainingState.SCENARIO_SELECTION,
      TrainingState.BRIEFING,
    ],
    badgeColor: "#009FE3",
    surfaceColor: "#E1F5FE",
    textColor: "#0077A8",
  },
  {
    id: "step-2",
    phaseCode: "ANALYZE",
    label: "DOCUMENTS",
    subtitle: "Analisis dokumen kargo & NOA",
    phaseNumber: "02",
    associatedStates: [TrainingState.DOCUMENT_REVIEW],
    badgeColor: "#0284C7",
    surfaceColor: "#E0F2FE",
    textColor: "#0369A1",
  },
  {
    id: "step-3",
    phaseCode: "DECIDE",
    label: "DECISION",
    subtitle: "Alokasi berth & kalkulasi UKC",
    phaseNumber: "03",
    associatedStates: [TrainingState.DECISION, TrainingState.DECISION_VALIDATED],
    badgeColor: "#F59E0B",
    surfaceColor: "#FEF3C7",
    textColor: "#B45309",
  },
  {
    id: "step-4",
    phaseCode: "SIMULATE",
    label: "SIMULATION",
    subtitle: "Live vector T+00 s/d T+45",
    phaseNumber: "04",
    associatedStates: [
      TrainingState.SIMULATION_RUNNING,
      TrainingState.SIMULATION_PAUSED,
      TrainingState.SIMULATION_COMPLETED,
    ],
    badgeColor: "#00A887",
    surfaceColor: "#E6F7F4",
    textColor: "#007A62",
  },
  {
    id: "step-5",
    phaseCode: "EVALUATE",
    label: "ASSESSMENT",
    subtitle: "Skor kompetensi & debrief",
    phaseNumber: "05",
    associatedStates: [
      TrainingState.ASSESSMENT,
      TrainingState.TRAINING_COMPLETED,
    ],
    badgeColor: "#7C3AED",
    surfaceColor: "#F3E8FF",
    textColor: "#6D28D9",
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
      className="w-full bg-white/95 dark:bg-[#0A1931]/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-[#1E3A5F] py-2.5 px-3 sm:px-6 select-none sticky top-16 z-30 shadow-sm transition-colors"
    >
      <div className="w-full px-2 sm:px-4 lg:px-6 flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < activeStepIndex;
          const isActive = index === activeStepIndex;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              {/* Step Milestone Node */}
              <div className="flex items-center gap-2 sm:gap-3 shrink-0 group">
                {/* Visual Indicator Node */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 border ${
                    isCompleted
                      ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-400 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 shadow-sm"
                      : isActive
                      ? "text-white font-black shadow-md scale-105"
                      : "bg-slate-100 dark:bg-[#102A45] border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500"
                  }`}
                  style={
                    isActive
                      ? {
                          backgroundColor: step.badgeColor,
                          borderColor: step.badgeColor,
                          boxShadow: `0 4px 12px ${step.badgeColor}40`,
                        }
                      : {}
                  }
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
                    {/* Phase Category Tag */}
                    <span
                      className={`text-[9px] font-mono font-extrabold uppercase px-1.5 py-0.5 rounded border ${
                        isActive
                          ? "shadow-xs font-black"
                          : isCompleted
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                          : "bg-slate-100 text-slate-500 border-slate-200 dark:bg-[#102A45] dark:text-slate-400 dark:border-slate-800"
                      }`}
                      style={
                        isActive
                          ? {
                              backgroundColor: step.surfaceColor,
                              color: step.textColor,
                              borderColor: step.badgeColor,
                            }
                          : {}
                      }
                    >
                      {step.phaseCode}
                    </span>

                    {/* Step Title (Required by tests: BRIEFING, DOCUMENTS, DECISION, SIMULATION, ASSESSMENT) */}
                    <span
                      className={`text-[11px] sm:text-xs font-sans font-bold tracking-wider transition-colors ${
                        isActive
                          ? "font-extrabold text-[#0A2540] dark:text-white"
                          : isCompleted
                          ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                          : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {step.label}
                    </span>

                    {/* Micro Status Chip */}
                    {isActive && (
                      <span className="hidden lg:inline text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border leading-none animate-pulse bg-blue-50 text-[#0066FF] border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800">
                        ACTIVE
                      </span>
                    )}
                  </div>

                  <span
                    className={`hidden md:block text-[10px] leading-tight font-sans transition-colors ${
                      isActive
                        ? "text-slate-600 dark:text-slate-300 font-medium"
                        : isCompleted
                        ? "text-slate-500 dark:text-slate-400 font-normal"
                        : "text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    {step.subtitle}
                  </span>
                </div>
              </div>

              {/* Connecting Horizontal Line (Divider) */}
              {!isLast && (
                <div className="flex-1 mx-2 sm:mx-3 h-0.5 min-w-[12px] sm:min-w-[24px] bg-slate-200 dark:bg-[#1E3A5F] rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isCompleted
                        ? "w-full bg-emerald-500"
                        : isActive
                        ? "w-full bg-gradient-to-r from-emerald-500 to-[#0066FF] shadow-sm"
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
