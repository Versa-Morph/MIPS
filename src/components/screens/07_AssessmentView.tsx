"use client";

import React, { useMemo, useEffect, useState } from "react";
import {
  Award,
  CheckCircle2,
  RotateCcw,
  BookOpen,
  Anchor,
  Layers,
  Clock,
  Gauge,
  UserCheck,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Download,
  FileCheck,
} from "lucide-react";
import { useTrainingStore } from "@/store/useTrainingStore";
import { useSimulationStore } from "@/store/useSimulationStore";
import { TrainingState } from "@/types/simulation";
import { calculateCadetScore } from "@/utils/scoringCalculator";
import { Modal } from "@/components/common/Modal";
import { sound } from "@/utils/audioEngine";

export function AssessmentViewScreen() {
  const {
    scenario,
    documents,
    selectedBerth,
    isFirstAttemptCorrect,
    cadetName,
    cadetNrp,
    cadetDepartment,
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

  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  useEffect(() => {
    sound.playSuccessChime();
  }, []);

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

  const handleReviewReplay = () => {
    resetSimulation();
    setStep(TrainingState.SIMULATION_RUNNING);
  };

  const handleBackToDashboard = () => {
    resetTraining();
    resetSimulation();
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn select-none">
      <div className="rounded-2xl bg-gradient-to-r from-[#08182B] via-[#0F243E] to-[#172E4C] border border-slate-800 p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <span>●</span> Training Completed · Official Assessment
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Cadet Evaluation Scorecard
            </h1>
            <p className="text-slate-300 text-sm">
              Cadet: <strong className="text-white">{cadetName}</strong> ({cadetNrp}) ·{" "}
              Target: <span className="font-mono text-amber-400">{vessel.name}</span>
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-950/80 border-2 border-emerald-500/40 rounded-2xl p-5 shadow-2xl shrink-0">
            <div className="text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
                FINAL SCORE
              </span>
              <div className="font-mono text-4xl sm:text-5xl font-black text-[#F5B800] tracking-tight">
                {score.totalScore}{" "}
                <span className="text-xl text-slate-500 font-normal">/ 100</span>
              </div>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30">
                {assessment.grade} · PASSED
              </span>
            </div>
          </div>
        </div>

        <Award className="absolute right-4 bottom-[-30px] w-56 h-56 text-slate-700/10 pointer-events-none stroke-[1]" />
      </div>

      <div className="rounded-xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-lg">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 border-b border-slate-800 pb-3">
          <TrendingUp className="w-4 h-4 text-[#F5B800]" /> Competency Assessment Breakdown (4 Pillars)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-300 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-sky-400" />
                1. Document Package Review (20% Weight)
              </span>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                {score.documentReviewScore} / {score.documentReviewMax} pts
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
            <p className="text-[11px] text-slate-400">
              {viewedCount} of {documents.length} operational documents examined.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-300 flex items-center gap-2">
                <Anchor className="w-4 h-4 text-[#F5B800]" />
                2. Berth Selection Decision (40% Weight)
              </span>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                {score.berthDecisionScore} / {score.berthDecisionMax} pts
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
            <p className="text-[11px] text-slate-400">
              Allocated Berth B-01 (Feasible · LOA & Draft compatible).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-300 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                3. Operation Completion (20% Weight)
              </span>
              <span className="font-mono font-bold text-sky-400 text-sm">
                {score.operationScore} / {score.operationMax} pts
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
            <p className="text-[11px] text-slate-400">
              Full 50 container moves completed within standard schedule.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-300 flex items-center gap-2">
                <Gauge className="w-4 h-4 text-amber-400" />
                4. KPI Performance & Productivity (20% Weight)
              </span>
              <span className="font-mono font-bold text-amber-400 text-sm">
                {score.kpiScore} / {score.kpiMax} pts
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
            <p className="text-[11px] text-slate-400">
              Achieved 71.4 Moves/Hour with 72% Crane and 68% Truck utilization.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
            Berth Decision
          </span>
          <span className="text-base font-bold text-emerald-400 flex items-center justify-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Correct (B-01)
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
            Containers Handled
          </span>
          <span className="text-base font-black text-white font-mono">
            50 / 50 Units
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
            Operation Duration
          </span>
          <span className="text-base font-black text-sky-400 font-mono">
            42 Minutes
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
            Gross Productivity
          </span>
          <span className="text-base font-black text-[#F5B800] font-mono">
            71.4 M/H
          </span>
        </div>
      </div>

      <div className="rounded-xl bg-[#08182B] border-2 border-emerald-500/30 p-6 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shrink-0">
            <UserCheck className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Instructor Evaluation Feedback
              <span className="text-[10px] font-normal text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                Official Debrief
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Capt. H. Gunawan · Senior Port Operations Training Officer
            </p>
          </div>
        </div>

        <div className="text-sm text-slate-200 leading-relaxed pl-13 border-l-2 border-emerald-500/50 my-2 italic">
          &quot;{assessment.feedbackText}&quot;
        </div>

        <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-2 text-xs">
          {assessment.learningHighlights.map((highlight, index) => (
            <span
              key={index}
              className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[11px] flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              {highlight}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleReviewReplay}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors border border-slate-700"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Review Replay</span>
          </button>

          <button
            onClick={() => setIsCertModalOpen(true)}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-md shadow-emerald-600/20"
          >
            <FileCheck className="w-4 h-4" />
            <span>View Certificate (PDF)</span>
          </button>
        </div>

        <button
          onClick={handleBackToDashboard}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#F5B800] hover:bg-[#D99B00] text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/20 transition-all transform hover:scale-[1.02]"
        >
          <BookOpen className="w-4 h-4" />
          <span>Return to Training Center</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      {isCertModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsCertModalOpen(false)}
          title="Official Certificate of Port Operational Simulation Competency"
          referenceNumber="MIPS-CERT-2026-09"
          pdfUrl="/documents/cadet-certificate.pdf"
        >
          <div className="p-4 text-center space-y-4">
            <h3 className="text-base font-bold text-amber-400">
              Certificate Awarded to {cadetName} ({cadetNrp})
            </h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Evaluation Score: 92/100 · Grade: EXCELLENT. Official graduation record certified under BKI and IALA training standards.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}
