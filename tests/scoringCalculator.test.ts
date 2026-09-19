import { describe, it, expect } from "vitest";
import { calculateCadetScore } from "../src/utils/scoringCalculator";

describe("Screen 07: Cadet Scoring Calculation Engine", () => {
  it("calculates exact PRD prototype target score of 92/100 for standard successful run", () => {
    const assessment = calculateCadetScore({
      viewedDocumentCount: 4,
      totalDocumentCount: 4,
      isBerthCorrectFirstAttempt: true,
      selectedBerth: "B-01",
      containersCompleted: 50,
      totalContainers: 50,
      actualProductivity: 71.4,
      craneUtilPercent: 72,
      truckUtilPercent: 68,
      elapsedOperationMinutes: 42,
    });

    // Verify 4-pillar breakdown
    expect(assessment.score.documentReviewScore).toBe(20);
    expect(assessment.score.documentReviewMax).toBe(20);

    expect(assessment.score.berthDecisionScore).toBe(40);
    expect(assessment.score.berthDecisionMax).toBe(40);

    expect(assessment.score.operationScore).toBe(18);
    expect(assessment.score.operationMax).toBe(20);

    expect(assessment.score.kpiScore).toBe(14);
    expect(assessment.score.kpiMax).toBe(20);

    // Verify sum = 92
    expect(assessment.score.totalScore).toBe(92);
    expect(assessment.score.totalMax).toBe(100);

    expect(assessment.grade).toBe("EXCELLENT");
    expect(assessment.decisionCorrect).toBe(true);
    expect(assessment.feedbackText).toContain("Good work");
  });

  it("penalizes unread documents proportionally (5 pts per document)", () => {
    const assessment = calculateCadetScore({
      viewedDocumentCount: 2, // 2 unread
      totalDocumentCount: 4,
      isBerthCorrectFirstAttempt: true,
      selectedBerth: "B-01",
      containersCompleted: 50,
      totalContainers: 50,
      actualProductivity: 71.4,
      craneUtilPercent: 72,
      truckUtilPercent: 68,
      elapsedOperationMinutes: 42,
    });

    expect(assessment.score.documentReviewScore).toBe(10); // 2 * 5
    expect(assessment.score.totalScore).toBe(82); // 92 - 10
  });

  it("awards 30 pts for berth decision if correct only after re-try attempt", () => {
    const assessment = calculateCadetScore({
      viewedDocumentCount: 4,
      totalDocumentCount: 4,
      isBerthCorrectFirstAttempt: false, // needed review
      selectedBerth: "B-01",
      containersCompleted: 50,
      totalContainers: 50,
      actualProductivity: 71.4,
      craneUtilPercent: 72,
      truckUtilPercent: 68,
      elapsedOperationMinutes: 42,
    });

    expect(assessment.score.berthDecisionScore).toBe(30);
    expect(assessment.score.totalScore).toBe(82);
  });
});
