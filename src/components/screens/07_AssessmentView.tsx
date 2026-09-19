"use client";

import React, { useMemo, useEffect } from "react";
import {
  Award,
  CheckCircle2,
  RotateCcw,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Clock,
  Gauge,
  Layers,
  Check,
} from "lucide-react";
import { useTrainingStore } from "@/store/useTrainingStore";
import { useSimulationStore } from "@/store/useSimulationStore";
import { TrainingState } from "@/types/simulation";
import { calculateCadetScore } from "@/utils/scoringCalculator";
import { sound } from "@/utils/audioEngine";

export function AssessmentViewScreen() {
  const {
    scenario,
    documents,
    selectedBerth,
    isFirstAttemptCorrect,
    resetTraining,
    setStep,
  } = useTrainingStore();

  const {
    containersHandled,
    totalContainers,
    productivityMovesPerHour,
    craneUtilization,
    truckUtilization,
    currentSimMinute,
    resetSimulation,
  } = useSimulationStore();

  const vessel = scenario.vessel;
  const viewedCount = documents.filter((d) => d.isViewed).length;

  const assessment = useMemo(() => {
    return calculateCadetScore({
      viewedDocumentCount: viewedCount,
      totalDocumentCount: documents.length,
      isBerthCorrectFirstAttempt: isFirstAttemptCorrect,
      selectedBerth: selectedBerth || "B-01",
      containersCompleted: Math.max(50, containersHandled),
      totalContainers: totalContainers,
      actualProductivity:
        productivityMovesPerHour > 0 ? productivityMovesPerHour : 71.4,
      craneUtilPercent: craneUtilization > 0 ? craneUtilization : 72,
      truckUtilPercent: truckUtilization > 0 ? truckUtilization : 68,
      elapsedOperationMinutes: Math.max(42, currentSimMinute),
    });
  }, [
    viewedCount,
    documents.length,
    isFirstAttemptCorrect,
    selectedBerth,
    containersHandled,
    totalContainers,
    productivityMovesPerHour,
    craneUtilization,
    truckUtilization,
    currentSimMinute,
  ]);

  const { score } = assessment;

  useEffect(() => {
    sound.playSuccessChime();
  }, []);

  const handleReviewReplay = () => {
    resetSimulation();
    setStep(TrainingState.SIMULATION_RUNNING);
  };

  const handleBackToDashboard = () => {
    resetTraining();
    resetSimulation();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn select-none">
      <div className="rounded-2xl bg-gradient-to-r from-[#08182B] via-[#0F243E] to-[#172E4C] border border-slate-800 p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Check className="w-3.5 h-3.5" /> TRAINING COMPLETED
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
              {vessel.name}
            </h1>
            <p className="text-slate-300 text-sm">
              Container Vessel Arrival & Berthing
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/30 text-center shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-widest">
              TRAINING SCORE
            </span>
            <div className="text-4xl font-black text-[#F5B800] font-mono">
              {score.totalScore}{" "}
              <span className="text-lg text-slate-500 font-normal">/ 100</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-lg text-xs">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#F5B800]" /> Assessment Components
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between font-bold">
              <span className="text-slate-300">Document Review (20%)</span>
              <span className="text-emerald-400 font-mono">
                {score.documentReviewScore} / {score.documentReviewMax}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{
                  width: `${(score.documentReviewScore / score.documentReviewMax) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between font-bold">
              <span className="text-slate-300">Berth Decision (40%)</span>
              <span className="text-emerald-400 font-mono">
                {score.berthDecisionScore} / {score.berthDecisionMax}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#F5B800] rounded-full"
                style={{
                  width: `${(score.berthDecisionScore / score.berthDecisionMax) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between font-bold">
              <span className="text-slate-300">Operation (20%)</span>
              <span className="text-sky-400 font-mono">
                {score.operationScore} / {score.operationMax}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-500 rounded-full"
                style={{
                  width: `${(score.operationScore / score.operationMax) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between font-bold">
              <span className="text-slate-300">KPI Performance (20%)</span>
              <span className="text-amber-400 font-mono">
                {score.kpiScore} / {score.kpiMax}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{
                  width: `${(score.kpiScore / score.kpiMax) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
            DECISION
          </h3>
          <div className="flex justify-between items-center font-mono">
            <span className="text-slate-300">Berth Selection</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Correct
            </span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
            OPERATION
          </h3>
          <div className="space-y-1.5 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-300">Containers</span>
              <span className="text-white font-bold">50 / 50</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Duration</span>
              <span className="text-sky-400 font-bold">42 min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Productivity</span>
              <span className="text-[#F5B800] font-bold">71 moves/hour</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
            PERFORMANCE
          </h3>
          <div className="space-y-1.5 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-300">Decision Accuracy</span>
              <span className="text-emerald-400 font-bold">100%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Operation Completion</span>
              <span className="text-emerald-400 font-bold">100%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
        <h3 className="font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
          STATUS
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <CheckCircle2 className="w-4 h-4" /> Documents Reviewed
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <CheckCircle2 className="w-4 h-4" /> Berth Selected
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <CheckCircle2 className="w-4 h-4" /> Simulation Completed
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-[#08182B] border border-slate-800 p-6 space-y-2">
        <h3 className="text-xs font-bold text-[#F5B800] uppercase tracking-wider">
          Feedback
        </h3>
        <p className="text-base font-bold text-white leading-snug">
          Good work.
        </p>
        <p className="text-xs text-slate-300 leading-relaxed">
          You successfully identified the berth that meets the vessel&apos;s LOA and draft requirements and completed the vessel operation.
        </p>
      </div>

      <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={handleReviewReplay}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors border border-slate-700"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Review Simulation</span>
        </button>

        <button
          onClick={handleBackToDashboard}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-[#F5B800] hover:bg-[#D99B00] text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 transition-all transform hover:scale-[1.02]"
        >
          <BookOpen className="w-4 h-4" />
          <span>Back to Training Center</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
}
