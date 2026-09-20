"use client";

import React, { useState } from "react";
import {
  Anchor,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Info,
  ShieldAlert,
  HelpCircle,
} from "lucide-react";
import { useTrainingStore } from "@/store/useTrainingStore";
import { TrainingState } from "@/types/simulation";
import { validateBerthAssignment, MANDATORY_UKC_METERS } from "@/utils/validation";
import { sound } from "@/utils/audioEngine";
import { Modal } from "@/components/common/Modal";

export function BerthDecisionScreen() {
  const { scenario, selectedBerth, submitBerthDecision, setStep, currentState } =
    useTrainingStore();
  const vessel = scenario.vessel;
  const berths = scenario.availableBerths;

  const [isGroundingModalOpen, setIsGroundingModalOpen] = useState(false);
  const [activeChoice, setActiveChoice] = useState<string>(
    selectedBerth || "B-01"
  );
  const [decisionFeedback, setDecisionFeedback] = useState<{
    submitted: boolean;
    isValid: boolean;
    message: string;
    details?: {
      loaDelta: number;
      draftDelta: number;
      requiredDepth: number;
    };
  } | null>(
    selectedBerth
      ? {
          submitted: true,
          isValid: selectedBerth === "B-01",
          message:
            selectedBerth === "B-01"
              ? "✓ DECISION ACCEPTED: B-01 is compatible with the vessel's LOA and draft requirements. You may proceed to simulation."
              : "! REVIEW REQUIRED: The selected berth does not meet the vessel requirements. Review the Berth Information document and try again.",
        }
      : null
  );

  const handleSubmit = () => {
    const targetBerth = berths.find((b) => b.id === activeChoice);
    if (!targetBerth) return;

    const validation = validateBerthAssignment(targetBerth, vessel);
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
      details: {
        loaDelta: validation.loaDelta,
        draftDelta: validation.draftDelta,
        requiredDepth: validation.requiredControllingDepth,
      },
    });
  };

  const isDecisionAccepted =
    currentState === TrainingState.DECISION_VALIDATED ||
    (decisionFeedback?.submitted && decisionFeedback?.isValid);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn select-none">
      <button
        onClick={() => setStep(TrainingState.DOCUMENT_REVIEW)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Document Center
      </button>

      <div className="rounded-2xl bg-gradient-to-r from-[#08182B] via-[#0E2239] to-[#162E4D] border border-slate-800 p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[#F5B800] text-xs font-bold uppercase tracking-wider">
            <span>●</span> Phase 03: Operational Berth Allocation
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Berth Allocation Decision
          </h1>
          <p className="text-slate-300 text-sm max-w-xl">
            Determine the appropriate berth for container vessel{" "}
            <strong className="text-white">{vessel.name}</strong> based on the
            documents you reviewed.
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
                <Anchor className="w-3.5 h-3.5" /> PENDING EVALUATION
              </>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 sm:p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Info className="w-4 h-4 text-[#F5B800]" /> Operational Verification Criteria
          </span>
          <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" /> Cross-check with NOA & Berth Sheet
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
              Vessel LOA
            </span>
            <span className="text-base font-black text-white font-mono">
              {vessel.loa} Meters
            </span>
            <span className="text-[10px] text-slate-500 block">Length Overall</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
              Arrival Draft (Max Aft)
            </span>
            <span className="text-base font-black text-amber-400 font-mono">
              {vessel.draft} Meters
            </span>
            <span className="text-[10px] text-slate-500 block">Submerged depth</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
              Safety UKC Required
            </span>
            <span className="text-base font-black text-sky-400 font-mono">
              +{MANDATORY_UKC_METERS} Meters
            </span>
            <span className="text-[10px] text-slate-500 block">Under Keel Clearance</span>
          </div>
        </div>
      </div>

      <div className="text-sm font-bold text-slate-200">
        Select the appropriate berth for {vessel.name}:
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {berths.map((berth) => {
          const isSelected = activeChoice === berth.id;

          return (
            <div
              key={berth.id}
              onClick={() => {
                setActiveChoice(berth.id);
                setDecisionFeedback(null);
              }}
              className={`cursor-pointer rounded-2xl bg-slate-900 border-2 p-6 transition-all duration-300 flex flex-col justify-between group shadow-lg ${
                isSelected
                  ? "border-[#F5B800] shadow-amber-500/20 ring-4 ring-amber-500/10"
                  : "border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? "border-[#F5B800] bg-[#F5B800] text-slate-950"
                          : "border-slate-600 bg-slate-800"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-950"></div>
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

                  <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                    Available
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {berth.description}
                </p>

                <div className="rounded-xl bg-slate-950 p-4 border border-slate-800/80 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-slate-900">
                    <span className="text-slate-400">Maximum Length (LOA):</span>
                    <span className="font-mono font-bold text-white text-sm">
                      {berth.maxLoa} m
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-slate-900">
                    <span className="text-slate-400">Controlling Depth (LWS):</span>
                    <span className="font-mono font-bold text-white text-sm">
                      {berth.maxDraft} m
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-400">Quay Cranes Installed:</span>
                    <span className="font-mono text-slate-300">
                      {berth.craneType}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono">
                  Bollards: {berth.bollards} units
                </span>
                <span
                  className={`font-semibold text-xs transition-colors ${
                    isSelected
                      ? "text-[#F5B800] font-bold"
                      : "text-slate-400 group-hover:text-white"
                  }`}
                >
                  {isSelected ? "● Selected" : "Click to Select"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {decisionFeedback && (
        <div
          className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm transition-all duration-300 animate-fadeIn ${
            decisionFeedback.isValid
              ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-200"
              : "bg-amber-950/40 border-amber-500/50 text-amber-200"
          }`}
        >
          <div className="flex items-start gap-3.5">
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
                  ? "DECISION ACCEPTED"
                  : "REVIEW REQUIRED"}
              </strong>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-300 whitespace-pre-line">
                {decisionFeedback.message}
              </p>
            </div>
          </div>

          {!decisionFeedback.isValid && (
            <button
              onClick={() => {
                sound.playWarningAlarm();
                setIsGroundingModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-md shadow-red-600/20 self-start sm:self-auto"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Simulate Grounding Incident (What-If)</span>
            </button>
          )}
        </div>
      )}

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
              <span>Submit Decision</span>
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

      {isGroundingModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsGroundingModalOpen(false)}
          title="EMERGENCY SIMULATION: VESSEL GROUNDING INCIDENT AT BERTH B-02"
          referenceNumber="INCIDENT-SIM-B02"
        >
          <div className="space-y-6 text-slate-100 font-sans">
            <div className="p-4 rounded-xl bg-red-950/60 border-2 border-red-500/60 text-red-200 text-xs sm:text-sm flex items-start gap-3">
              <ShieldAlert className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-red-300 font-bold block text-sm mb-1">
                  MARITIME CASUALTY REPORT · CRITICAL WATER DEPTH DEFICIT
                </strong>
                MV Nusantara (Arrival Draft: 10.20m) grounded on the shallow seabed while attempting alongside approach at Berth B-02 (Controlling Depth: 9.00m).
              </div>
            </div>

            <div className="rounded-xl bg-slate-950 border border-slate-800 p-4">
              <div className="text-xs font-mono font-bold text-slate-400 mb-2 flex justify-between">
                <span>BATHYMETRIC CROSS-SECTION (BERTH B-02 BASIN)</span>
                <span className="text-red-400">DEPTH DEFICIT: -1.20 METERS</span>
              </div>

              <svg viewBox="0 0 600 200" className="w-full h-auto bg-[#06101E] rounded-lg border border-slate-800">
                <rect x="0" y="30" width="600" height="90" fill="#0369A1" opacity="0.3" />
                <line x1="0" y1="30" x2="600" y2="30" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="4,2" />
                <text x="15" y="24" fill="#38BDF8" fontSize="10" fontFamily="monospace">Water Surface (LAT Datum: 0.00m)</text>

                <rect x="0" y="120" width="600" height="80" fill="#78350F" opacity="0.4" />
                <line x1="0" y1="120" x2="600" y2="120" stroke="#D97706" strokeWidth="2" />
                <text x="15" y="136" fill="#F59E0B" fontSize="10" fontFamily="monospace">Berth B-02 Seabed (-9.00m LWS)</text>

                <path d="M 120,40 L 460,40 L 450,132 L 150,132 Z" fill="#1E293B" stroke="#EF4444" strokeWidth="2" />
                <text x="290" y="70" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">MV NUSANTARA</text>
                <text x="290" y="90" textAnchor="middle" fill="#F87171" fontSize="10" fontFamily="monospace">Draft: 10.20m (Keel at -10.20m)</text>

                <rect x="150" y="120" width="300" height="12" fill="#EF4444" opacity="0.4" stroke="#DC2626" strokeDasharray="3,2" />
                <text x="300" y="150" textAnchor="middle" fill="#EF4444" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  ⚠ 1.20m GROUNDING PENETRATION INTO HARD SAND/SILT ⚠
                </text>
              </svg>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-red-400 font-bold uppercase block tracking-wider">
                  Casualty Consequences
                </span>
                <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                  <li>Double bottom plate rupture and structural hull bending.</li>
                  <li>Rudder stock twisted and propeller blades sheared.</li>
                  <li>Main port entrance fairway blocked to commercial traffic.</li>
                  <li>Salvage operation required: 4 heavy tugs + lightering barge.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-emerald-400 font-bold uppercase block tracking-wider">
                  Instructor Lesson for Cadets
                </span>
                <p className="text-slate-300 leading-relaxed">
                  Always calculate <strong>Controlling Depth = Dynamic Draft + UKC</strong>. 
                  A vessel drawing 10.20m with +1.30m UKC demands at least 11.50m of water depth. 
                  Allocating Berth B-01 (12.00m depth) is the only legally and physically sound choice.
                </p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
