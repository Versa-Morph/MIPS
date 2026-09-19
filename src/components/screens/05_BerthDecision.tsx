"use client";

import React, { useState } from "react";
import {
  Anchor,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Ship,
  ShieldAlert,
  Sparkles,
  Info,
} from "lucide-react";
import { useTrainingStore } from "@/store/useTrainingStore";
import { TrainingState } from "@/types/simulation";
import { validateBerthAssignment, MANDATORY_UKC_METERS } from "@/utils/validation";
import { sound } from "@/utils/audioEngine";

export function BerthDecisionScreen() {
  const { scenario, selectedBerth, submitBerthDecision, setStep, currentState } =
    useTrainingStore();
  const vessel = scenario.vessel;
  const berths = scenario.availableBerths;

  const [activeChoice, setActiveChoice] = useState<string>(
    selectedBerth || "B-01"
  );
  const [decisionFeedback, setDecisionFeedback] = useState<{
    submitted: boolean;
    isValid: boolean;
    message: string;
  } | null>(
    selectedBerth
      ? {
          submitted: true,
          isValid: selectedBerth === "B-01",
          message:
            selectedBerth === "B-01"
              ? "✓ DECISION ACCEPTED: Berth B-01 is compatible with vessel dimensions and draft limits."
              : "⚠ REVIEW REQUIRED: The selected berth does not meet vessel requirements.",
        }
      : null
  );

  const handleSubmit = () => {
    const result = submitBerthDecision(activeChoice);
    if (result.isValid) {
      sound.playSuccessChime();
    } else {
      sound.playWarningAlarm();
    }
    setDecisionFeedback({
      submitted: true,
      isValid: result.isValid,
      message: result.feedback,
    });
  };

  const requiredDepth = (vessel.draft + MANDATORY_UKC_METERS).toFixed(2);
  const isDecisionAccepted =
    currentState === TrainingState.DECISION_VALIDATED ||
    (decisionFeedback?.submitted && decisionFeedback?.isValid);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      {/* Navigation Breadcrumb */}
      <button
        onClick={() => setStep(TrainingState.DOCUMENT_REVIEW)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Document Center
      </button>

      {/* Screen Header */}
      <div className="rounded-2xl bg-gradient-to-r from-[#08182B] via-[#0E2239] to-[#162E4D] border border-slate-800 p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[#F5B800] text-xs font-bold uppercase tracking-wider">
            <span>●</span> Phase 03: Operational Berth Allocation
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Berth Allocation Decision
          </h1>
          <p className="text-slate-300 text-sm max-w-xl">
            Select the appropriate berth for container vessel{" "}
            <strong className="text-white">{vessel.name}</strong> based on
            physical draft depth, length, and quay crane capacity.
          </p>
        </div>

        <div className="px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/60 text-right self-start md:self-auto">
          <div className="text-[10px] uppercase font-bold text-slate-400">
            Decision Status
          </div>
          <div
            className={`text-xs font-bold flex items-center gap-1.5 font-mono ${
              isDecisionAccepted ? "text-emerald-400" : "text-amber-400"
            }`}
          >
            {isDecisionAccepted ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" /> APPROVED
              </>
            ) : (
              <>
                <Anchor className="w-3.5 h-3.5" /> PENDING ALLOCATION
              </>
            )}
          </div>
        </div>
      </div>

      {/* Required Controlling Depth Calculation Header Bar (PRD Image 4) */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 sm:p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Info className="w-4 h-4 text-[#F5B800]" /> Harbor Master Clearance Formulation
          </span>
          <span className="text-xs font-mono text-slate-400">
            Formula: Max Draft + UKC (+1.3m)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
              Vessel LOA
            </span>
            <span className="text-base font-black text-white font-mono">
              {vessel.loa} m
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
              Arrival Draft (Max)
            </span>
            <span className="text-base font-black text-red-400 font-mono">
              {vessel.draft} m
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
              Mandatory UKC
            </span>
            <span className="text-base font-black text-amber-400 font-mono">
              +{MANDATORY_UKC_METERS} m
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-500/50">
            <span className="text-[10px] uppercase font-bold text-red-300 block mb-0.5">
              Req. Controlling Depth
            </span>
            <span className="text-base font-black text-white font-mono bg-red-600 px-2 py-0.5 rounded inline-block">
              {requiredDepth} m
            </span>
          </div>
        </div>
      </div>

      {/* Decision Question Prompt */}
      <div className="text-sm font-bold text-slate-200">
        Select the appropriate berth for {vessel.name}:
      </div>

      {/* Berth Comparison Cards (B-01 vs B-02) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {berths.map((berth) => {
          const isSelected = activeChoice === berth.id;
          const validation = validateBerthAssignment(berth, vessel);

          return (
            <div
              key={berth.id}
              onClick={() => {
                setActiveChoice(berth.id);
                setDecisionFeedback(null);
              }}
              className={`cursor-pointer rounded-2xl bg-slate-900 border-2 p-6 transition-all duration-300 flex flex-col justify-between group shadow-lg ${
                isSelected
                  ? validation.isValid
                    ? "border-emerald-500 shadow-emerald-500/20 ring-4 ring-emerald-500/10"
                    : "border-red-500 shadow-red-500/20 ring-4 ring-red-500/10"
                  : "border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? validation.isValid
                            ? "border-emerald-400 bg-emerald-500 text-slate-950"
                            : "border-red-400 bg-red-500 text-white"
                          : "border-slate-600 bg-slate-800"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2.5 h-2.5 rounded-full bg-current"></div>
                      )}
                    </div>
                    <div>
                      <span className="text-[11px] font-mono text-slate-400 block font-bold">
                        {berth.id}
                      </span>
                      <h3 className="text-base font-bold text-white group-hover:text-[#F5B800] transition-colors">
                        {berth.name}
                      </h3>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full flex items-center gap-1 font-mono ${
                      validation.isValid
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                        : "bg-red-500/10 text-red-400 border border-red-500/30"
                    }`}
                  >
                    {validation.isValid ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" /> FEASIBLE
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3" /> INSUFFICIENT
                      </>
                    )}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {berth.description}
                </p>

                {/* Compatibility Comparison Table */}
                <div className="rounded-xl bg-slate-950 p-4 border border-slate-800/80 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-slate-900">
                    <span className="text-slate-400">Max LOA (Length):</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white">
                        {berth.maxLoa} m
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${
                          validation.loaCompatible
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {validation.loaCompatible
                          ? `Pass (+${validation.loaDelta}m)`
                          : `Fail (${validation.loaDelta}m)`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-slate-900">
                    <span className="text-slate-400">Controlling Depth:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white">
                        {berth.maxDraft} m
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${
                          validation.draftCompatible
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {validation.draftCompatible
                          ? "Pass (Depth Safe)"
                          : "Hazard (Grounding Risk)"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-400">Quay Cranes:</span>
                    <span className="font-mono text-slate-200">
                      {berth.craneType}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Action / Selection Pill */}
              <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono">
                  Status: Available
                </span>
                <span
                  className={`font-semibold text-xs transition-colors ${
                    isSelected
                      ? validation.isValid
                        ? "text-emerald-400 font-bold"
                        : "text-red-400 font-bold"
                      : "text-slate-400 group-hover:text-white"
                  }`}
                >
                  {isSelected ? "● Currently Selected" : "Click to Choose"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Decision Feedback Alert Banner */}
      {decisionFeedback && (
        <div
          className={`p-5 rounded-2xl border flex items-start gap-3.5 text-sm transition-all duration-300 animate-fadeIn ${
            decisionFeedback.isValid
              ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-200"
              : "bg-amber-950/40 border-amber-500/50 text-amber-200"
          }`}
        >
          {decisionFeedback.isValid ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1">
            <strong
              className={`block font-bold ${
                decisionFeedback.isValid ? "text-emerald-300" : "text-amber-300"
              }`}
            >
              {decisionFeedback.isValid
                ? "DECISION ACCEPTED & VERIFIED"
                : "DECISION REVIEW REQUIRED"}
            </strong>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
              {decisionFeedback.message}
            </p>
          </div>
        </div>
      )}

      {/* Footer Navigation & Submit Button */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={() => setStep(TrainingState.DOCUMENT_REVIEW)}
          className="w-full sm:w-auto px-4 py-2.5 rounded-lg text-slate-400 hover:text-white text-xs font-semibold"
        >
          Review Documents Again
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {!isDecisionAccepted ? (
            <button
              onClick={handleSubmit}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#F5B800] hover:bg-[#D99B00] text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 transition-all transform hover:scale-[1.02]"
            >
              <span>Submit Berth Decision</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          ) : (
            <button
              onClick={() => setStep(TrainingState.SIMULATION_RUNNING)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/30 transition-all transform hover:scale-[1.03] animate-pulse"
            >
              <Sparkles className="w-4 h-4" />
              <span>START SIMULATION</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
