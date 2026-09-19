import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { BerthDecisionScreen } from "../src/components/screens/05_BerthDecision";
import { validateBerthAssignment } from "../src/utils/validation";
import { vesselMVNusantara, berths } from "../src/data/scenarioData";
import { useTrainingStore } from "../src/store/useTrainingStore";
import { TrainingState } from "../src/types/simulation";

describe("Screen 05: Berth Allocation Decision & Validation", () => {
  beforeEach(() => {
    useTrainingStore.getState().resetTraining();
    useTrainingStore.getState().setStep(TrainingState.DECISION);
  });

  it("validates Berth B-01 is compatible and Berth B-02 violates depth and LOA", () => {
    const b01 = berths.find((b) => b.id === "B-01")!;
    const b02 = berths.find((b) => b.id === "B-02")!;

    const result01 = validateBerthAssignment(b01, vesselMVNusantara);
    expect(result01.isValid).toBe(true);
    expect(result01.loaCompatible).toBe(true);
    expect(result01.draftCompatible).toBe(true);

    const result02 = validateBerthAssignment(b02, vesselMVNusantara);
    expect(result02.isValid).toBe(false);
    expect(result02.loaCompatible).toBe(false);
    expect(result02.draftCompatible).toBe(false);
    expect(result02.feedback).toContain("REVIEW REQUIRED");
  });

  it("renders comparison cards with controlling depth calculation", () => {
    render(<BerthDecisionScreen />);
    expect(screen.getByText(/Berth Allocation Decision/i)).toBeDefined();
    expect(
      screen.getByText(/Berth B-01 \(Deepwater Terminal\)/i)
    ).toBeDefined();
    expect(screen.getByText(/Berth B-02 \(Feeder Quay\)/i)).toBeDefined();
    expect(screen.getByText(/11\.50 m/i)).toBeDefined();
  });

  it("approves B-01 decision and unlocks START SIMULATION button", () => {
    render(<BerthDecisionScreen />);

    // Click Berth B-01 card
    const b01Card = screen.getByText(/Berth B-01 \(Deepwater Terminal\)/i);
    fireEvent.click(b01Card);

    // Click Submit
    const submitButton = screen.getByRole("button", {
      name: /Submit Berth Decision/i,
    });
    fireEvent.click(submitButton);

    // Decision feedback shows acceptance
    expect(
      screen.getByText(/DECISION ACCEPTED & VERIFIED/i)
    ).toBeDefined();

    // START SIMULATION button appears
    const simButton = screen.getByRole("button", {
      name: /START SIMULATION/i,
    });
    expect(simButton).toBeDefined();

    // Clicking simulation advances state
    fireEvent.click(simButton);
    expect(useTrainingStore.getState().currentState).toBe(
      TrainingState.SIMULATION_RUNNING
    );
  });

  it("rejects B-02 decision with warning banner and keeps simulation locked", () => {
    render(<BerthDecisionScreen />);

    // Click Berth B-02 card
    const b02Card = screen.getByText(/Berth B-02 \(Feeder Quay\)/i);
    fireEvent.click(b02Card);

    // Click Submit
    const submitButton = screen.getByRole("button", {
      name: /Submit Berth Decision/i,
    });
    fireEvent.click(submitButton);

    // Warning banner shown
    expect(
      screen.getByText(/DECISION REVIEW REQUIRED/i)
    ).toBeDefined();

    // START SIMULATION button is NOT unlocked
    expect(screen.queryByText(/START SIMULATION/i)).toBeNull();
    expect(useTrainingStore.getState().currentState).toBe(
      TrainingState.DECISION
    );
  });
});
