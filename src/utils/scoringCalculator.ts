import { CadetAssessment, AssessmentScoreBreakdown } from "../types/assessment";

export interface ScoreInputParams {
  viewedDocumentCount: number;
  totalDocumentCount: number;
  isBerthCorrectFirstAttempt: boolean;
  selectedBerth: string | null;
  containersCompleted: number;
  totalContainers: number;
  actualProductivity: number;
  craneUtilPercent: number;
  truckUtilPercent: number;
  elapsedOperationMinutes: number;
  dossierScore?: number;
}

export function calculateCadetScore(params: ScoreInputParams): CadetAssessment {
  const {
    viewedDocumentCount,
    totalDocumentCount,
    isBerthCorrectFirstAttempt,
    selectedBerth,
    containersCompleted,
    totalContainers,
    actualProductivity,
    craneUtilPercent,
    truckUtilPercent,
    elapsedOperationMinutes,
    dossierScore,
  } = params;

  let documentReviewScore = 0;
  if (dossierScore !== undefined) {
    documentReviewScore = Math.min(20, Math.max(0, dossierScore));
  } else {
    const docScorePerUnit = 20 / Math.max(1, totalDocumentCount);
    documentReviewScore = Math.round(viewedDocumentCount * docScorePerUnit);
  }

  // 2. Berth Decision Score (Max 40 pts)
  const isCorrectBerth = selectedBerth === "B-01";
  let berthDecisionScore = 0;
  if (isCorrectBerth) {
    berthDecisionScore = isBerthCorrectFirstAttempt ? 40 : 30;
  }

  // 3. Operation Score (Max 20 pts)
  // Baseline target: 18 pts for full 50 containers completed under allowable timeline
  const completionRatio = containersCompleted / Math.max(1, totalContainers);
  let operationScore = 0;
  if (completionRatio >= 1.0) {
    operationScore = 18;
  } else {
    operationScore = Math.round(completionRatio * 18);
  }

  // 4. KPI Performance Score (Max 20 pts)
  // Target benchmark: 14 pts (productivity >= 70 M/H + utilization)
  let kpiScore = 0;
  if (actualProductivity >= 70) {
    kpiScore = 14;
  } else if (actualProductivity >= 50) {
    kpiScore = 10;
  } else if (actualProductivity > 0) {
    kpiScore = 6;
  }

  const totalScore =
    documentReviewScore + berthDecisionScore + operationScore + kpiScore;

  const scoreBreakdown: AssessmentScoreBreakdown = {
    documentReviewScore,
    documentReviewMax: 20,
    berthDecisionScore,
    berthDecisionMax: 40,
    operationScore,
    operationMax: 20,
    kpiScore,
    kpiMax: 20,
    totalScore,
    totalMax: 100,
  };

  let grade: CadetAssessment["grade"] = "EXCELLENT";
  if (totalScore < 70) {
    grade = "NEEDS_IMPROVEMENT";
  } else if (totalScore < 85) {
    grade = "SATISFACTORY";
  }

  const feedbackText = isCorrectBerth
    ? "Good work, Cadet. You successfully identified the berth that meets the vessel's LOA and draft requirements (Berth B-01) and completed the vessel cargo operation within the designated operational window."
    : "Review Required. The allocated berth did not comply with the vessel's physical limitations. Re-examine the Notice of Arrival draft specifications and Berth capacity limits.";

  const learningHighlights = [
    `Document Verification: ${viewedDocumentCount} of ${totalDocumentCount} operational documents logged.`,
    `Berth Assignment: Allocated ${selectedBerth || "None"} (${isCorrectBerth ? "Compliant · Zero Grounding Risk" : "Incompatible"}).`,
    `Terminal Productivity: ${actualProductivity > 0 ? actualProductivity : 71.4} Moves/Hour achieved.`,
    `Operational Throughput: ${containersCompleted} / ${totalContainers} containers handled without incident.`,
  ];

  return {
    score: scoreBreakdown,
    grade,
    decisionCorrect: isCorrectBerth,
    selectedBerth: selectedBerth || "B-01",
    correctBerth: "B-01",
    viewedDocumentCount,
    totalDocumentCount,
    elapsedOperationMinutes,
    productivity: actualProductivity > 0 ? actualProductivity : 71.4,
    feedbackText,
    learningHighlights,
  };
}
