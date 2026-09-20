"use client";

import { useState } from "react";
import {
  Anchor,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldAlert,
  ClipboardCheck,
  Compass,
  Gauge,
  Waves,
  AlertOctagon,
} from "lucide-react";
import { useTrainingStore } from "@/store/useTrainingStore";
import { TrainingState } from "@/types/simulation";
import { validateBerthAssignment, MANDATORY_UKC_METERS } from "@/utils/validation";
import { sound } from "@/utils/audioEngine";
import { Modal } from "@/components/common/Modal";

export function BerthDecisionScreen() {
  const {
    scenario,
    selectedBerth,
    submitBerthDecision,
    setStep,
    currentState,
    cadetDossier,
  } = useTrainingStore();
  const vessel = scenario.vessel;
  const berths = scenario.availableBerths;

  const isDossierAvailable = Boolean(cadetDossier?.isSubmitted);
  const displayLoa =
    isDossierAvailable && cadetDossier.loa
      ? cadetDossier.loa
      : `${vessel.loa}`;
  const displayDraft =
    isDossierAvailable && cadetDossier.draftAft
      ? cadetDossier.draftAft
      : `${vessel.draft}`;
  const displayDepth =
    isDossierAvailable && cadetDossier.requiredDepth
      ? cadetDossier.requiredDepth
      : `${(vessel.draft + MANDATORY_UKC_METERS).toFixed(1)}`;

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
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn select-none font-sans">
      {/* Top Breadcrumb / Return Nav */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep(TrainingState.DOCUMENT_REVIEW)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-tactical-cyan transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Document Center
        </button>

        <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400 bg-abyssal-surface/80 border border-slate-800 px-3 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-tactical-cyan animate-pulse"></span>
          <span>VTS CONSOLE · SECTOR 3</span>
        </div>
      </div>

      {/* Hero Banner: Tactical HUD Glassmorphic Header */}
      <div className="relative rounded-2xl glass-panel border border-glass-border overflow-hidden p-6 sm:p-8 shadow-glass">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-amber/10 border border-electric-amber/30 text-electric-amber text-xs font-bold uppercase tracking-wider font-mono">
              <span className="w-2 h-2 rounded-full bg-electric-amber animate-pulse">●</span>
              <span>Phase 03: Operational Berth Allocation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Berth Allocation Decision
            </h1>
            <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
              Determine the appropriate berth for container vessel{" "}
              <strong className="text-white font-semibold">{vessel.name}</strong> based on the
              pre-arrival documents, controlling depth, and safety clearance requirements.
            </p>
          </div>

          <div className="p-1 rounded-xl bg-slate-800/40 border border-slate-700/60 backdrop-blur-md self-start md:self-auto shrink-0">
            <div className="px-4 py-3 rounded-lg bg-abyssal-surface/90 text-right">
              <div className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-widest">
                Decision Status
              </div>
              <div
                className={`text-xs font-bold flex items-center gap-1.5 font-mono mt-0.5 ${
                  isDecisionAccepted ? "text-safety-emerald" : "text-electric-amber"
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
        </div>

        <Compass className="absolute right-4 bottom-[-40px] w-56 h-56 text-slate-700/10 pointer-events-none stroke-[1]" />
      </div>

      {/* Cadet Submitted Dossier Reference Card (Nested Double-Bezel Architecture) */}
      <div className="p-1.5 rounded-2xl glass-panel border border-glass-border shadow-glass">
        <div className="rounded-xl bg-abyssal-surface/90 p-4 sm:p-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2 font-mono">
              <ClipboardCheck className="w-4 h-4 text-tactical-cyan" />
              <span>Kriteria Acuan Sandar (Data Dossier Anda)</span>
            </span>
            <span className="text-xs font-mono text-safety-emerald bg-safety-emerald/10 px-2.5 py-0.5 rounded border border-safety-emerald/30 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Sumber: Berkas Pre-Arrival Dossier
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            {/* Metric 1: LOA */}
            <div className="p-3.5 rounded-xl bg-abyssal/90 border border-slate-800/80 hover:border-slate-700 transition-colors">
              <span className="text-xs uppercase font-bold text-slate-400 font-mono tracking-wider block mb-1">
                Panjang Kapal (LOA)
              </span>
              <span className="text-base sm:text-lg font-black text-white font-mono block">
                {displayLoa} Meters
              </span>
              <span className="text-xs text-slate-400 font-mono block mt-0.5">
                Length Overall Terisi
              </span>
            </div>

            {/* Metric 2: Draft Aft */}
            <div className="p-3.5 rounded-xl bg-abyssal/90 border border-slate-800/80 hover:border-slate-700 transition-colors">
              <span className="text-xs uppercase font-bold text-slate-400 font-mono tracking-wider block mb-1">
                Sarat Air (Draft Aft)
              </span>
              <span className="text-base sm:text-lg font-black text-electric-amber font-mono block">
                {displayDraft} Meters
              </span>
              <span className="text-xs text-slate-400 font-mono block mt-0.5">
                Kedalaman Lambung Terisi
              </span>
            </div>

            {/* Metric 3: Required UKC Depth */}
            <div className="p-3.5 rounded-xl bg-abyssal/90 border border-slate-800/80 hover:border-slate-700 transition-colors">
              <span className="text-xs uppercase font-bold text-slate-400 font-mono tracking-wider block mb-1">
                Kedalaman Wajib (UKC Safe)
              </span>
              <span className="text-base sm:text-lg font-black text-tactical-cyan font-mono block">
                {displayDepth} Meters
              </span>
              <span className="text-xs text-slate-400 font-mono block mt-0.5">
                Batas Aman Minimal (Draft + 1.3m UKC)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Berth Selection Header */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Waves className="w-4 h-4 text-tactical-cyan" />
          <span>Select the appropriate berth for {vessel.name}:</span>
        </div>
        <span className="text-xs font-mono text-slate-400">
          2 Berths Available in Basin
        </span>
      </div>

      {/* Tactical Comparison Cards (Double-Bezel with Integrated Depth Gauges) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {berths.map((berth) => {
          const isSelected = activeChoice === berth.id;
          const isB01 = berth.id === "B-01";
          const controllingDepth = berth.maxDraft;
          const requiredUKCDepth = vessel.draft + MANDATORY_UKC_METERS; // 11.5m
          const depthDifference = controllingDepth - requiredUKCDepth; // B01: +0.5m, B02: -2.5m
          const loaDifference = berth.maxLoa - vessel.loa; // B01: +20m, B02: -30m

          return (
            <div
              key={berth.id}
              onClick={() => {
                setActiveChoice(berth.id);
                setDecisionFeedback(null);
              }}
              className={`cursor-pointer rounded-2xl p-1.5 transition-all duration-300 flex flex-col justify-between group shadow-glass ${
                isSelected
                  ? isB01
                    ? "bg-gradient-to-b from-safety-emerald/30 to-slate-900 border-2 border-safety-emerald shadow-emerald-glow"
                    : "bg-gradient-to-b from-hazard-crimson/30 to-slate-900 border-2 border-hazard-crimson shadow-[0_0_15px_rgba(239,68,68,0.25)]"
                  : isB01
                  ? "glass-panel border-2 border-slate-800 hover:border-safety-emerald/50"
                  : "glass-panel border-2 border-slate-800 hover:border-hazard-crimson/50"
              }`}
            >
              <div className="rounded-xl bg-abyssal/95 p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  {/* Card Top Title Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? isB01
                              ? "border-safety-emerald bg-safety-emerald text-abyssal"
                              : "border-hazard-crimson bg-hazard-crimson text-white"
                            : "border-slate-600 bg-slate-800"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2.5 h-2.5 rounded-full bg-abyssal"></div>
                        )}
                      </div>
                      <div>
                        <span className="text-[11px] font-mono text-slate-400 block font-bold">
                          {berth.id}
                        </span>
                        <h3 className="text-base font-bold text-white group-hover:text-tactical-cyan transition-colors">
                          {berth.name}
                        </h3>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded border ${
                        isB01
                          ? "bg-safety-emerald/10 text-safety-emerald border-safety-emerald/30"
                          : "bg-hazard-crimson/10 text-hazard-crimson border-hazard-crimson/30"
                      }`}
                    >
                      {isB01 ? "COMPATIBLE" : "HAZARD RESTRICTED"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {berth.description}
                  </p>

                  {/* Specification Table */}
                  <div className="rounded-xl bg-abyssal-surface/80 p-3.5 border border-slate-800 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
                      <span className="text-slate-400">Maximum Length (LOA):</span>
                      <div className="text-right">
                        <span className="font-mono font-black text-white text-base sm:text-lg">
                          {berth.maxLoa} m
                        </span>
                        <span
                          className={`font-mono text-xs ml-2 font-semibold ${
                            loaDifference >= 0 ? "text-safety-emerald" : "text-hazard-crimson"
                          }`}
                        >
                          ({loaDifference >= 0 ? `+${loaDifference}m Safe` : `${loaDifference}m Deficit`})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
                      <span className="text-slate-400">Controlling Depth (LWS):</span>
                      <div className="text-right">
                        <span className="font-mono font-black text-white text-base sm:text-lg">
                          {berth.maxDraft} m
                        </span>
                        <span
                          className={`font-mono text-xs ml-2 font-semibold ${
                            depthDifference >= 0 ? "text-safety-emerald" : "text-hazard-crimson"
                          }`}
                        >
                          ({depthDifference >= 0 ? `+${depthDifference.toFixed(1)}m Surplus UKC` : `${depthDifference.toFixed(1)}m Grounding Risk`})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-1">
                      <span className="text-slate-400">Quay Cranes Installed:</span>
                      <span className="font-mono text-slate-200 font-semibold">
                        {berth.craneType}
                      </span>
                    </div>
                  </div>

                  {/* Tactical Depth Gauge Visual */}
                  <div className="rounded-xl bg-abyssal-surface/60 p-3.5 border border-slate-800/70 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400 flex items-center gap-1.5 font-bold">
                        <Gauge className="w-4 h-4 text-tactical-cyan" />
                        <span>Depth Clearance Gauge:</span>
                      </span>
                      <span
                        className={`font-black ${
                          isB01 ? "text-safety-emerald" : "text-hazard-crimson"
                        }`}
                      >
                        {isB01 ? "+0.5m SURPLUS UKC" : "2.5m DEFICIT GROUNDING DANGER"}
                      </span>
                    </div>

                    {/* Progress representation of depth */}
                    <div className="space-y-1">
                      <div className="w-full h-3.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800 flex">
                        {isB01 ? (
                          <>
                            {/* Vessel Draft portion: 10.2 / 12 = 85% */}
                            <div
                              style={{ width: "85%" }}
                              className="h-full bg-sky-500 rounded-l-full"
                              title="Vessel Draft: 10.2m"
                            ></div>
                            {/* UKC Cushion portion: 1.3m / 12 = 10.8% */}
                            <div
                              style={{ width: "10.8%" }}
                              className="h-full bg-electric-amber"
                              title="Required UKC: 1.3m (11.5m Total)"
                            ></div>
                            {/* Surplus: 0.5m / 12 = 4.2% */}
                            <div
                              style={{ width: "4.2%" }}
                              className="h-full bg-safety-emerald rounded-r-full animate-pulse"
                              title="Surplus UKC: +0.5m"
                            ></div>
                          </>
                        ) : (
                          <>
                            {/* Available basin depth: 9.0m out of 11.5m required = 78% */}
                            <div
                              style={{ width: "78%" }}
                              className="h-full bg-sky-600 rounded-l-full"
                              title="Available Seabed Depth: 9.0m LWS"
                            ></div>
                            {/* Critical deficit penetration */}
                            <div
                              style={{ width: "22%" }}
                              className="h-full bg-hazard-crimson rounded-r-full animate-pulse"
                              title="CRITICAL DEFICIT: 2.5m (Keel penetrates 1.2m into seabed!)"
                            ></div>
                          </>
                        )}
                      </div>

                      <div className="flex justify-between text-xs font-mono text-slate-400 px-1">
                        <span>0m LAT</span>
                        <span>Draft {displayDraft}m</span>
                        <span>Req {displayDepth}m</span>
                        <span className={`font-bold ${isB01 ? "text-safety-emerald" : "text-hazard-crimson"}`}>
                          Berth {berth.maxDraft}m
                        </span>
                      </div>
                    </div>

                    {!isB01 && (
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            sound.playWarningAlarm();
                            setIsGroundingModalOpen(true);
                          }}
                          className="w-full py-1.5 px-2 rounded-lg bg-hazard-crimson/15 hover:bg-hazard-crimson/25 border border-hazard-crimson/40 text-hazard-crimson font-mono text-[10px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <AlertOctagon className="w-3.5 h-3.5" />
                          <span>View Grounding Incident Simulation (What-If)</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-3 border-t border-slate-800/80 mt-4 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-mono">
                    Bollards: {berth.bollards} units
                  </span>
                  <span
                    className={`font-semibold text-xs transition-colors flex items-center gap-1 ${
                      isSelected
                        ? isB01
                          ? "text-safety-emerald font-bold"
                          : "text-hazard-crimson font-bold"
                        : "text-slate-400 group-hover:text-white"
                    }`}
                  >
                    {isSelected ? "● Selected" : "Click to Select"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Decision Feedback Banner */}
      {decisionFeedback && (
        <div
          className={`p-5 rounded-2xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm transition-all duration-300 animate-fadeIn ${
            decisionFeedback.isValid
              ? "bg-safety-emerald/10 border-safety-emerald/50 text-emerald-200 shadow-emerald-glow"
              : "bg-hazard-crimson/10 border-hazard-crimson/50 text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
          }`}
        >
          <div className="flex items-start gap-3.5">
            {decisionFeedback.isValid ? (
              <CheckCircle2 className="w-5 h-5 text-safety-emerald shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-hazard-crimson shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <strong
                className={`block font-bold text-sm sm:text-base ${
                  decisionFeedback.isValid ? "text-safety-emerald" : "text-hazard-crimson"
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
              className="px-4 py-2.5 rounded-xl bg-hazard-crimson hover:bg-red-600 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-md shadow-red-600/20 self-start sm:self-auto transition-all"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Simulate Grounding Incident (What-If)</span>
            </button>
          )}
        </div>
      )}

      {/* Bottom Action Footer Bar */}
      <div className="rounded-2xl glass-panel border border-glass-border p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-glass">
        <button
          onClick={() => setStep(TrainingState.DOCUMENT_REVIEW)}
          className="w-full sm:w-auto px-4 py-2.5 rounded-lg text-slate-400 hover:text-white text-xs font-semibold transition-colors"
        >
          Review Documents Again
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {!isDecisionAccepted ? (
            <button
              onClick={handleSubmit}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-electric-amber hover:bg-electric-amber-hover text-abyssal font-extrabold text-sm shadow-amber-glow transition-all transform hover:scale-[1.02]"
            >
              <span>Submit Decision</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          ) : (
            <button
              onClick={() => setStep(TrainingState.SIMULATION_RUNNING)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-safety-emerald hover:bg-emerald-400 text-abyssal font-black text-sm shadow-emerald-glow transition-all transform hover:scale-[1.03] animate-pulse"
            >
              <Sparkles className="w-4 h-4" />
              <span>START SIMULATION</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>

      {/* Emergency Simulation: What-If Grounding Incident Modal */}
      {isGroundingModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsGroundingModalOpen(false)}
          title="EMERGENCY SIMULATION: VESSEL GROUNDING INCIDENT AT BERTH B-02"
          referenceNumber="INCIDENT-SIM-B02"
        >
          <div className="space-y-6 text-slate-100 font-sans">
            <div className="p-4 rounded-xl bg-red-950/60 border-2 border-hazard-crimson/60 text-red-200 text-xs sm:text-sm flex items-start gap-3">
              <ShieldAlert className="w-6 h-6 text-hazard-crimson shrink-0 mt-0.5" />
              <div>
                <strong className="text-red-300 font-bold block text-sm mb-1 font-mono">
                  MARITIME CASUALTY REPORT · CRITICAL WATER DEPTH DEFICIT
                </strong>
                MV Nusantara (Arrival Draft: 10.20m) grounded on the shallow seabed while attempting alongside approach at Berth B-02 (Controlling Depth: 9.00m).
              </div>
            </div>

            <div className="rounded-xl bg-abyssal border border-slate-800 p-4">
              <div className="text-xs font-mono font-bold text-slate-400 mb-2 flex justify-between">
                <span>BATHYMETRIC CROSS-SECTION (BERTH B-02 BASIN)</span>
                <span className="text-hazard-crimson">DEPTH DEFICIT: -1.20 METERS</span>
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
              <div className="p-4 rounded-xl bg-abyssal-surface border border-slate-800 space-y-2">
                <span className="text-hazard-crimson font-bold uppercase block tracking-wider font-mono">
                  Casualty Consequences
                </span>
                <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                  <li>Double bottom plate rupture and structural hull bending.</li>
                  <li>Rudder stock twisted and propeller blades sheared.</li>
                  <li>Main port entrance fairway blocked to commercial traffic.</li>
                  <li>Salvage operation required: 4 heavy tugs + lightering barge.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-abyssal-surface border border-slate-800 space-y-2">
                <span className="text-safety-emerald font-bold uppercase block tracking-wider font-mono">
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
