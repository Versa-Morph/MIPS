"use client";

import React, { useMemo, useEffect } from "react";
import {
  CheckCircle2,
  RotateCcw,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Clock,
  Gauge,
  Layers,
  Check,
  Award,
  Ship,
  FileCheck,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { useTrainingStore } from "@/store/useTrainingStore";
import { useSimulationStore } from "@/store/useSimulationStore";
import { TrainingState } from "@/types/simulation";
import { calculateCadetScore } from "@/utils/scoringCalculator";
import { sound } from "@/utils/audioEngine";
import { getAssetPath } from "@/utils/assetPath";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function AssessmentViewScreen() {
  const {
    scenario,
    documents,
    selectedBerth,
    isFirstAttemptCorrect,
    cadetDossier,
    cadetName,
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
      dossierScore: cadetDossier?.isSubmitted ? cadetDossier.score : undefined,
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
    cadetDossier,
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
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6 font-sans select-none animate-fadeIn">
      {/* Top Status Breadcrumb */}
      <div className="flex items-center justify-between font-mono text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-coral" />
          <span className="text-slate-800 dark:text-slate-200 font-semibold">
            CADET PERFORMANCE CERTIFICATION
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span>STAGE:</span>
          <span className="text-coral font-bold">07 / 07</span>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
            EVALUATION COMPLETE
          </span>
        </div>
      </div>

      {/* Executive Certification Header Card */}
      <div className="relative rounded-2xl bg-white dark:bg-[#14171f] border border-slate-200/80 dark:border-[#222634] p-6 sm:p-8 text-slate-900 dark:text-white shadow-card dark:shadow-card-dark overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Gold Seal of Competency */}
            <div className="relative shrink-0 flex items-center justify-center p-2 rounded-2xl bg-slate-50 dark:bg-[#1a1e29] border border-coral/30 shadow-sm">
              <img
                src={getAssetPath("/images/seal-competency.png")}
                alt="Competency Seal"
                className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
              />
              <div className="absolute -bottom-1 -right-1 p-1 bg-white dark:bg-[#14171f] rounded-full border border-coral/60 shadow-xs">
                <ShieldCheck className="w-4 h-4 text-coral" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60 text-xs font-bold uppercase tracking-wider font-mono">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>TRAINING COMPLETED</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase font-sans">
                {vessel.name}
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-sm font-medium">
                Container Vessel Arrival & Berthing Operation
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-mono text-slate-500 dark:text-slate-400">
                <span>
                  Cadet: <strong className="text-coral">{cadetName || "Cadet"}</strong>
                </span>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span>
                  Port: <strong className="text-slate-800 dark:text-slate-200">Tanjung Priok</strong>
                </span>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span>
                  Berth Assigned:{" "}
                  <strong className="text-emerald-600 dark:text-emerald-400">
                    {selectedBerth || "B-01"}
                  </strong>
                </span>
              </div>
            </div>
          </div>

          {/* Large Score Display Box (TransGlobal Card) */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-[#181c26] border border-slate-200/80 dark:border-slate-800 text-center shrink-0 min-w-[200px] shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block tracking-widest font-mono">
              TRAINING SCORE
            </span>
            <div className="text-4xl sm:text-5xl font-black text-coral font-mono tracking-tight mt-1">
              <span>{score.totalScore}</span>{" "}
              <span className="text-lg sm:text-xl text-slate-400 dark:text-slate-500 font-normal">
                / 100
              </span>
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60 text-xs font-mono font-bold uppercase">
              <CheckCircle2 className="w-3.5 h-3.5" /> PASS · {assessment.grade}
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Components Breakdown (TransGlobal Card) */}
      <div className="rounded-2xl bg-white dark:bg-[#14171f] border border-slate-200/80 dark:border-[#222634] p-6 space-y-4 shadow-card dark:shadow-card-dark text-xs">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2 font-mono">
            <TrendingUp className="w-4 h-4 text-coral" />
            <span>Assessment Components</span>
          </h2>
          <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
            WEIGHTED 4-PILLAR EVALUATION
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Pillar 1: Document Review */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#181c26] border border-slate-200/80 dark:border-slate-800 space-y-2.5 shadow-xs">
            <div className="flex justify-between items-center font-bold">
              <span className="text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-500" />
                <span>Document Review (20%)</span>
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono text-sm font-bold">
                {score.documentReviewScore} / {score.documentReviewMax}
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-300 dark:border-slate-700/60">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                style={{
                  width: `${(score.documentReviewScore / score.documentReviewMax) * 100}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-0.5">
              <span>Notice of Arrival & Dossier</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">100% Verified</span>
            </div>
          </div>

          {/* Pillar 2: Berth Decision */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#181c26] border border-slate-200/80 dark:border-slate-800 space-y-2.5 shadow-xs">
            <div className="flex justify-between items-center font-bold">
              <span className="text-slate-900 dark:text-white flex items-center gap-2">
                <Ship className="w-4 h-4 text-coral" />
                <span>Berth Decision (40%)</span>
              </span>
              <span className="text-coral font-mono text-sm font-bold">
                {score.berthDecisionScore} / {score.berthDecisionMax}
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-300 dark:border-slate-700/60">
              <div
                className="h-full bg-coral rounded-full transition-all duration-700"
                style={{
                  width: `${(score.berthDecisionScore / score.berthDecisionMax) * 100}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-0.5">
              <span>LOA & UKC Draft Safety</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Zero Grounding Risk</span>
            </div>
          </div>

          {/* Pillar 3: Operation */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#181c26] border border-slate-200/80 dark:border-slate-800 space-y-2.5 shadow-xs">
            <div className="flex justify-between items-center font-bold">
              <span className="text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                <span>Operation (20%)</span>
              </span>
              <span className="text-slate-900 dark:text-white font-mono text-sm font-bold">
                {score.operationScore} / {score.operationMax}
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-300 dark:border-slate-700/60">
              <div
                className="h-full bg-slate-700 dark:bg-slate-300 rounded-full transition-all duration-700"
                style={{
                  width: `${(score.operationScore / score.operationMax) * 100}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-0.5">
              <span>Quay Crane Execution</span>
              <span className="text-slate-700 dark:text-slate-300 font-semibold">50 Units Discharged</span>
            </div>
          </div>

          {/* Pillar 4: KPI Performance */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#181c26] border border-slate-200/80 dark:border-slate-800 space-y-2.5 shadow-xs">
            <div className="flex justify-between items-center font-bold">
              <span className="text-slate-900 dark:text-white flex items-center gap-2">
                <Gauge className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                <span>KPI Performance (20%)</span>
              </span>
              <span className="text-slate-900 dark:text-white font-mono text-sm font-bold">
                {score.kpiScore} / {score.kpiMax}
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-300 dark:border-slate-700/60">
              <div
                className="h-full bg-slate-700 dark:bg-slate-300 rounded-full transition-all duration-700"
                style={{
                  width: `${(score.kpiScore / score.kpiMax) * 100}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-0.5">
              <span>Productivity & Utilization</span>
              <span className="text-slate-700 dark:text-slate-300 font-semibold">71+ Moves/Hour Target</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Performance Cards in 3-column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
        {/* Card 1: DECISION */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#14171f] border border-slate-200/80 dark:border-[#222634] space-y-3 shadow-card dark:shadow-card-dark">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <h3 className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              DECISION
            </h3>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">BERTH GATE</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-300 font-sans">Berth Selection</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Correct
              </span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
              <span>Allocated Terminal</span>
              <span className="text-slate-900 dark:text-white font-bold">B-01 Deepwater</span>
            </div>
          </div>
        </div>

        {/* Card 2: OPERATION */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#14171f] border border-slate-200/80 dark:border-[#222634] space-y-3 shadow-card dark:shadow-card-dark">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <h3 className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              OPERATION
            </h3>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">TELEMETRY</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-300 font-sans">Containers</span>
              <span className="text-slate-900 dark:text-white font-bold">50 / 50</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-300 font-sans">Duration</span>
              <span className="text-slate-900 dark:text-white font-bold">42 min</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-300 font-sans">Productivity</span>
              <span className="text-coral font-bold">71 moves/hour</span>
            </div>
          </div>
        </div>

        {/* Card 3: PERFORMANCE */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#14171f] border border-slate-200/80 dark:border-[#222634] space-y-3 shadow-card dark:shadow-card-dark">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <h3 className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              PERFORMANCE
            </h3>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">ACCURACY</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-300 font-sans">Decision Accuracy</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">100%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-300 font-sans">Operation Completion</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">100%</span>
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
              <span>Incident Rate</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">0 Violations</span>
            </div>
          </div>
        </div>
      </div>

      {/* STATUS Card */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#14171f] border border-slate-200/80 dark:border-[#222634] space-y-3 text-xs shadow-card dark:shadow-card-dark font-mono">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
          <h3 className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            STATUS
          </h3>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">MILESTONE CHECKLIST</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Documents Reviewed</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Berth Selected</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Simulation Completed</span>
          </div>
        </div>
      </div>

      {/* Instructor Feedback Card */}
      <div className="rounded-2xl bg-white dark:bg-[#14171f] border border-slate-200/80 dark:border-[#222634] p-6 space-y-3 shadow-card dark:shadow-card-dark">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-coral" />
            <h3 className="text-xs font-bold text-coral uppercase tracking-wider font-mono">
              Feedback
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
            INSTRUCTOR APPRAISAL · CAPT. H. GUNAWAN
          </span>
        </div>
        <div className="space-y-1.5">
          <p className="text-base font-bold text-slate-900 dark:text-white leading-snug">
            Good work.
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
            You successfully identified the berth that meets the vessel&apos;s LOA and draft
            requirements and completed the vessel operation.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono pt-1">
            Official Endorsement: {assessment.feedbackText}
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="rounded-2xl bg-white dark:bg-[#14171f] border border-slate-200/80 dark:border-[#222634] p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-card dark:shadow-card-dark">
        <Button
          variant="outline"
          size="sm"
          onClick={handleReviewReplay}
          className="w-full sm:w-auto rounded-full gap-2 text-xs font-bold font-mono"
        >
          <RotateCcw className="w-4 h-4 text-coral" />
          <span>Review Simulation Replay</span>
        </Button>

        <Button
          variant="coral"
          size="lg"
          onClick={handleBackToDashboard}
          className="w-full sm:w-auto px-8 font-bold shadow-coral rounded-full"
        >
          <BookOpen className="w-4 h-4 mr-1" />
          <span>Back to Training Center</span>
          <ArrowRight className="w-4 h-4 ml-1 stroke-[2.5]" />
        </Button>
      </div>
    </div>
  );
}
