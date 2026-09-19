export interface AssessmentScoreBreakdown {
  documentReviewScore: number; // Max 20
  documentReviewMax: number; // 20
  berthDecisionScore: number; // Max 40
  berthDecisionMax: number; // 40
  operationScore: number; // Max 20
  operationMax: number; // 20
  kpiScore: number; // Max 20
  kpiMax: number; // 20
  totalScore: number; // Sum (target: 92/100)
  totalMax: number; // 100
}

export interface CadetAssessment {
  score: AssessmentScoreBreakdown;
  grade: "EXCELLENT" | "SATISFACTORY" | "NEEDS_IMPROVEMENT";
  decisionCorrect: boolean;
  selectedBerth: string;
  correctBerth: string;
  viewedDocumentCount: number;
  totalDocumentCount: number;
  elapsedOperationMinutes: number;
  productivity: number;
  feedbackText: string;
  learningHighlights: string[];
}
