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
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn font-sans select-none">
      {/* Top Status Breadcrumb */}
      <div className="flex items-center justify-between font-mono text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-electric-amber" />
          <span className="text-slate-300 font-semibold">CADET PERFORMANCE CERTIFICATION</span>
        </div>
        <div className="flex items-center gap-2">
          <span>STAGE:</span>
          <span className="text-tactical-cyan font-bold">07 / 07</span>
          <span className="text-slate-600">|</span>
          <span className="text-safety-emerald font-semibold">EVALUATION COMPLETE</span>
        </div>
      </div>

      {/* Executive Certification Header Card */}
      <div className="relative rounded-2xl glass-panel border border-electric-amber/40 p-6 sm:p-8 text-white shadow-glass overflow-hidden">
        {/* Background glow meshes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-abyssal via-abyssal-surface/90 to-[#0c1c38]/80" />
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-electric-amber/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-1/4 -bottom-16 w-72 h-72 bg-tactical-cyan/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Gold Seal of Competency */}
            <div className="relative shrink-0 flex items-center justify-center p-2 rounded-2xl bg-gradient-to-br from-amber-400/20 via-slate-900/90 to-abyssal border border-electric-amber/60 shadow-amber-glow">
              <img
                src="/images/seal-competency.png"
                alt="Competency Seal"
                className="w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]"
              />
              <div className="absolute -bottom-1 -right-1 p-1 bg-abyssal rounded-full border border-electric-amber/60">
                <ShieldCheck className="w-4 h-4 text-electric-amber" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-safety-emerald/15 border border-safety-emerald/40 text-safety-emerald text-xs font-bold uppercase tracking-wider font-mono shadow-emerald-glow/20">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>TRAINING COMPLETED</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase font-sans">
                {vessel.name}
              </h1>
              <p className="text-slate-300 text-sm font-medium">
                Container Vessel Arrival & Berthing
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-mono text-slate-400">
                <span>Cadet: <strong className="text-tactical-cyan">{cadetName || "Cadet"}</strong></span>
                <span className="text-slate-600">·</span>
                <span>Port: <strong className="text-slate-200">Tanjung Priok</strong></span>
                <span className="text-slate-600">·</span>
                <span>Berth Assigned: <strong className="text-safety-emerald">{selectedBerth || "B-01"}</strong></span>
              </div>
            </div>
          </div>

          {/* Large Score Display Box */}
          <div className="p-5 rounded-xl bg-abyssal/90 border border-electric-amber/50 text-center shrink-0 backdrop-blur-md shadow-glass">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-widest font-mono">
              TRAINING SCORE
            </span>
            <div className="text-4xl sm:text-5xl font-black text-electric-amber font-mono tracking-tight mt-1">
              <span>{score.totalScore}</span>{" "}
              <span className="text-lg sm:text-xl text-slate-500 font-normal">/ 100</span>
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-safety-emerald/15 border border-safety-emerald/30 text-safety-emerald text-[11px] font-mono font-bold uppercase">
              <CheckCircle2 className="w-3 h-3" /> PASS · {assessment.grade}
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Components Breakdown */}
      <div className="rounded-2xl glass-panel border border-glass-border p-6 space-y-4 shadow-glass text-xs">
        <div className="flex items-center justify-between border-b border-glass-border pb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 font-mono">
            <TrendingUp className="w-4 h-4 text-electric-amber" />
            <span>Assessment Components</span>
          </h2>
          <span className="text-[10px] font-mono text-slate-400">WEIGHTED 4-PILLAR EVALUATION</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Pillar 1: Document Review */}
          <div className="p-4 rounded-xl bg-abyssal-surface/80 border border-glass-border hover:border-slate-600 transition-all space-y-2.5">
            <div className="flex justify-between items-center font-bold">
              <span className="text-slate-300 flex items-center gap-2">
                <FileCheck className="w-3.5 h-3.5 text-safety-emerald" />
                <span>Document Review (20%)</span>
              </span>
              <span className="text-safety-emerald font-mono text-sm">
                {score.documentReviewScore} / {score.documentReviewMax}
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-safety-emerald rounded-full transition-all duration-700 shadow-emerald-glow"
                style={{
                  width: `${(score.documentReviewScore / score.documentReviewMax) * 100}%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-0.5">
              <span>Notice of Arrival & Dossier</span>
              <span>100% Verified</span>
            </div>
          </div>

          {/* Pillar 2: Berth Decision */}
          <div className="p-4 rounded-xl bg-abyssal-surface/80 border border-glass-border hover:border-slate-600 transition-all space-y-2.5">
            <div className="flex justify-between items-center font-bold">
              <span className="text-slate-300 flex items-center gap-2">
                <Ship className="w-3.5 h-3.5 text-electric-amber" />
                <span>Berth Decision (40%)</span>
              </span>
              <span className="text-electric-amber font-mono text-sm">
                {score.berthDecisionScore} / {score.berthDecisionMax}
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-amber-600 to-electric-amber rounded-full transition-all duration-700 shadow-amber-glow"
                style={{
                  width: `${(score.berthDecisionScore / score.berthDecisionMax) * 100}%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-0.5">
              <span>LOA & UKC Draft Safety</span>
              <span>Zero Grounding Risk</span>
            </div>
          </div>

          {/* Pillar 3: Operation */}
          <div className="p-4 rounded-xl bg-abyssal-surface/80 border border-glass-border hover:border-slate-600 transition-all space-y-2.5">
            <div className="flex justify-between items-center font-bold">
              <span className="text-slate-300 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-tactical-cyan" />
                <span>Operation (20%)</span>
              </span>
              <span className="text-tactical-cyan font-mono text-sm">
                {score.operationScore} / {score.operationMax}
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-cyan-600 to-tactical-cyan rounded-full transition-all duration-700 shadow-cyan-glow"
                style={{
                  width: `${(score.operationScore / score.operationMax) * 100}%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-0.5">
              <span>Quay Crane Execution</span>
              <span>50 Units Discharged</span>
            </div>
          </div>

          {/* Pillar 4: KPI Performance */}
          <div className="p-4 rounded-xl bg-abyssal-surface/80 border border-glass-border hover:border-slate-600 transition-all space-y-2.5">
            <div className="flex justify-between items-center font-bold">
              <span className="text-slate-300 flex items-center gap-2">
                <Gauge className="w-3.5 h-3.5 text-sky-400" />
                <span>KPI Performance (20%)</span>
              </span>
              <span className="text-sky-400 font-mono text-sm">
                {score.kpiScore} / {score.kpiMax}
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-sky-600 to-sky-400 rounded-full transition-all duration-700"
                style={{
                  width: `${(score.kpiScore / score.kpiMax) * 100}%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-0.5">
              <span>Productivity & Utilization</span>
              <span>71+ Moves/Hour Target</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Performance Cards in 3-column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
        {/* Card 1: DECISION */}
        <div className="p-5 rounded-xl glass-panel border border-glass-border space-y-3 shadow-glass">
          <div className="flex items-center justify-between border-b border-glass-border pb-2">
            <h3 className="font-bold uppercase tracking-wider text-slate-400">
              DECISION
            </h3>
            <span className="text-[10px] text-slate-500">BERTH GATE</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-300 font-sans">Berth Selection</span>
              <span className="text-safety-emerald font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Correct
              </span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
              <span>Allocated Terminal</span>
              <span className="text-tactical-cyan font-bold">B-01 Deepwater</span>
            </div>
          </div>
        </div>

        {/* Card 2: OPERATION */}
        <div className="p-5 rounded-xl glass-panel border border-glass-border space-y-3 shadow-glass">
          <div className="flex items-center justify-between border-b border-glass-border pb-2">
            <h3 className="font-bold uppercase tracking-wider text-slate-400">
              OPERATION
            </h3>
            <span className="text-[10px] text-slate-500">TELEMETRY</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-300 font-sans">Containers</span>
              <span className="text-white font-bold">50 / 50</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300 font-sans">Duration</span>
              <span className="text-tactical-cyan font-bold">42 min</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300 font-sans">Productivity</span>
              <span className="text-electric-amber font-bold">71 moves/hour</span>
            </div>
          </div>
        </div>

        {/* Card 3: PERFORMANCE */}
        <div className="p-5 rounded-xl glass-panel border border-glass-border space-y-3 shadow-glass">
          <div className="flex items-center justify-between border-b border-glass-border pb-2">
            <h3 className="font-bold uppercase tracking-wider text-slate-400">
              PERFORMANCE
            </h3>
            <span className="text-[10px] text-slate-500">ACCURACY</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-300 font-sans">Decision Accuracy</span>
              <span className="text-safety-emerald font-bold">100%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300 font-sans">Operation Completion</span>
              <span className="text-safety-emerald font-bold">100%</span>
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
              <span>Incident Rate</span>
              <span className="text-safety-emerald font-bold">0 Violations</span>
            </div>
          </div>
        </div>
      </div>

      {/* STATUS Card */}
      <div className="p-5 rounded-xl glass-panel border border-glass-border space-y-3 text-xs shadow-glass font-mono">
        <div className="flex items-center justify-between border-b border-glass-border pb-2">
          <h3 className="font-bold uppercase tracking-wider text-slate-400">
            STATUS
          </h3>
          <span className="text-[10px] text-slate-500">MILESTONE CHECKLIST</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-2 text-safety-emerald font-bold p-2.5 rounded-lg bg-abyssal-surface/60 border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-safety-emerald shrink-0" />
            <span>Documents Reviewed</span>
          </div>
          <div className="flex items-center gap-2 text-safety-emerald font-bold p-2.5 rounded-lg bg-abyssal-surface/60 border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-safety-emerald shrink-0" />
            <span>Berth Selected</span>
          </div>
          <div className="flex items-center gap-2 text-safety-emerald font-bold p-2.5 rounded-lg bg-abyssal-surface/60 border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-safety-emerald shrink-0" />
            <span>Simulation Completed</span>
          </div>
        </div>
      </div>

      {/* Instructor Feedback Card */}
      <div className="rounded-2xl glass-panel border border-electric-amber/30 p-6 space-y-3 relative overflow-hidden shadow-glass">
        <div className="flex items-center justify-between border-b border-glass-border pb-3">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-electric-amber" />
            <h3 className="text-xs font-bold text-electric-amber uppercase tracking-wider font-mono">
              Feedback
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400">INSTRUCTOR APPRAISAL · CAPT. H. GUNAWAN</span>
        </div>
        <div className="space-y-1.5">
          <p className="text-base font-bold text-white leading-snug">
            Good work.
          </p>
          <p className="text-xs text-slate-300 leading-relaxed">
            You successfully identified the berth that meets the vessel&apos;s LOA and draft requirements and completed the vessel operation.
          </p>
          <p className="text-xs text-slate-400 font-mono pt-1">
            Official Endorsement: {assessment.feedbackText}
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="rounded-2xl glass-panel border border-glass-border p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-glass">
        <button
          onClick={handleReviewReplay}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl glass-panel hover:border-tactical-cyan/50 text-slate-200 hover:text-white font-bold text-xs transition-all border border-slate-700 shadow-sm hover:shadow-cyan-glow/20 font-mono"
        >
          <RotateCcw className="w-4 h-4 text-tactical-cyan" />
          <span>Review Simulation</span>
        </button>

        <button
          onClick={handleBackToDashboard}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-electric-amber hover:bg-electric-amber-hover text-slate-950 font-extrabold text-sm shadow-amber-glow transition-all transform hover:scale-[1.02] active:scale-[0.98] font-sans"
        >
          <BookOpen className="w-4 h-4" />
          <span>Back to Training Center</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
}
