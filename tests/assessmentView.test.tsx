import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { AssessmentViewScreen } from "../src/components/screens/07_AssessmentView";
import { useTrainingStore } from "../src/store/useTrainingStore";
import { useSimulationStore } from "../src/store/useSimulationStore";
import { TrainingState } from "../src/types/simulation";

describe("Screen 07: Assessment & Scorecard View", () => {
  beforeEach(() => {
    useTrainingStore.getState().resetTraining();
    useTrainingStore.getState().setStep(TrainingState.ASSESSMENT);
    // Mark all documents viewed
    useTrainingStore.getState().markDocumentViewed("ARRIVAL_NOTICE", 20);
    useTrainingStore.getState().markDocumentViewed("VESSEL_MANIFEST", 20);
    useTrainingStore.getState().markDocumentViewed("CARGO_MANIFEST", 20);
    useTrainingStore.getState().markDocumentViewed("BERTH_INFORMATION", 20);
    // Submit correct berth on first attempt
    useTrainingStore.getState().submitBerthDecision("B-01");

    useSimulationStore.getState().resetSimulation();
    useSimulationStore.getState().seek(45); // Complete simulation (50 containers)
  });

  it("renders 92/100 final score and the 4 evaluation pillars", () => {
    render(<AssessmentViewScreen />);

    expect(screen.getByText("92")).toBeDefined();
    expect(screen.getByText(/TRAINING COMPLETED/i)).toBeDefined();

    expect(screen.getByText(/Document Review \(20%\)/i)).toBeDefined();
    expect(screen.getByText(/20 \/ 20/i)).toBeDefined();

    expect(screen.getByText(/Berth Decision \(40%\)/i)).toBeDefined();
    expect(screen.getByText(/40 \/ 40/i)).toBeDefined();

    expect(screen.getByText(/Operation \(20%\)/i)).toBeDefined();
    expect(screen.getByText(/18 \/ 20/i)).toBeDefined();

    expect(screen.getByText(/KPI Performance \(20%\)/i)).toBeDefined();
    expect(screen.getByText(/14 \/ 20/i)).toBeDefined();
  });

  it("renders instructor feedback and operational statistics", () => {
    render(<AssessmentViewScreen />);

    expect(screen.getByText(/Good work\./i)).toBeDefined();
    expect(screen.getByText(/Correct/i)).toBeDefined();
    expect(screen.getByText(/50 \/ 50/i)).toBeDefined();
  });

  it("supports Return to Training Center and Review Simulation Replay", () => {
    render(<AssessmentViewScreen />);

    const returnButton = screen.getByRole("button", {
      name: /Back to Training Center/i,
    });
    fireEvent.click(returnButton);

    expect(useTrainingStore.getState().currentState).toBe(
      TrainingState.DASHBOARD
    );
  });
});
