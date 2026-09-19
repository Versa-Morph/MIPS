import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import Home from "../src/app/page";
import { useTrainingStore } from "../src/store/useTrainingStore";
import { useSimulationStore } from "../src/store/useSimulationStore";
import { TrainingState } from "../src/types/simulation";

describe("MIPS End-to-End Cadet Training Simulation Flow", () => {
  beforeEach(() => {
    useTrainingStore.getState().logoutCadet();
    useSimulationStore.getState().resetSimulation();
  });

  it("walks through the entire 7-screen pedagogical lifecycle smoothly", () => {
    render(<Home />);

    expect(screen.getByText(/Cadet Identification Portal/i)).toBeDefined();
    const quickLoginBtn = screen.getByRole("button", {
      name: /1-Click Quick Demo Login/i,
    });
    fireEvent.click(quickLoginBtn);
    expect(useTrainingStore.getState().currentState).toBe(
      TrainingState.DASHBOARD
    );

    expect(
      screen.getByText(/Container Vessel Arrival & Berthing Operation/i)
    ).toBeDefined();
    const launchScenarioBtn = screen.getByRole("button", {
      name: /Launch Training Scenario/i,
    });
    fireEvent.click(launchScenarioBtn);
    expect(useTrainingStore.getState().currentState).toBe(
      TrainingState.SCENARIO_SELECTION
    );

    // SCREEN 02: SCENARIO CARD
    expect(screen.getByText(/Target Vessel Particulars/i)).toBeDefined();
    const proceedToBriefingBtn = screen.getByRole("button", {
      name: /Proceed to Mission Briefing/i,
    });
    fireEvent.click(proceedToBriefingBtn);
    expect(useTrainingStore.getState().currentState).toBe(
      TrainingState.BRIEFING
    );

    // SCREEN 03: BRIEFING
    expect(screen.getByText(/Capt\. H\. Gunawan/i)).toBeDefined();
    const proceedToDocCenterBtn = screen.getByRole("button", {
      name: /Proceed to Document Center/i,
    });
    fireEvent.click(proceedToDocCenterBtn);
    expect(useTrainingStore.getState().currentState).toBe(
      TrainingState.DOCUMENT_REVIEW
    );

    expect(screen.getByText(/Notice of Arrival \(NOA\)/i)).toBeDefined();
    const docTitles = [
      /Notice of Arrival \(NOA\)/i,
      /Vessel Particulars & Registry/i,
      /Cargo Manifest/i,
      /Berth Specification Sheet/i,
    ];

    for (const title of docTitles) {
      const card = screen.getByText(title);
      fireEvent.click(card);
      const closeBtn = screen.getByText(/Close Viewer/i);
      fireEvent.click(closeBtn);
    }

    const proceedToDecisionBtn = screen.getByRole("button", {
      name: /Proceed to Berth Assignment/i,
    });
    fireEvent.click(proceedToDecisionBtn);
    expect(useTrainingStore.getState().currentState).toBe(
      TrainingState.DECISION
    );

    expect(
      screen.getByText(/Berth B-01 \(Deepwater Terminal\)/i)
    ).toBeDefined();

    const b01Card = screen.getByText(/Berth B-01 \(Deepwater Terminal\)/i);
    fireEvent.click(b01Card);

    const submitDecisionBtn = screen.getByRole("button", {
      name: /Submit Berth Decision/i,
    });
    fireEvent.click(submitDecisionBtn);
    expect(useTrainingStore.getState().currentState).toBe(
      TrainingState.DECISION_VALIDATED
    );

    const startSimBtn = screen.getByRole("button", {
      name: /START SIMULATION/i,
    });
    fireEvent.click(startSimBtn);
    expect(useTrainingStore.getState().currentState).toBe(
      TrainingState.SIMULATION_RUNNING
    );

    expect(screen.getByText(/MIPS SIMULATOR · TACTICAL HUD/i)).toBeDefined();
    expect(screen.getByText(/Terminal Event Log/i)).toBeDefined();
    expect(screen.getByText(/Operational KPI Telemetry/i)).toBeDefined();

    useSimulationStore.getState().seek(45);
    expect(useSimulationStore.getState().containersHandled).toBe(50);

    const proceedToAssessmentBtn = screen.getByRole("button", {
      name: /Proceed to Assessment|Skip to Assessment/i,
    });
    fireEvent.click(proceedToAssessmentBtn);
    expect(useTrainingStore.getState().currentState).toBe(
      TrainingState.ASSESSMENT
    );

    expect(screen.getByText(/Cadet Evaluation Scorecard/i)).toBeDefined();
    expect(screen.getByText(/92/)).toBeDefined();
    expect(screen.getByText(/EXCELLENT/i)).toBeDefined();

    const returnToTrainingBtn = screen.getByRole("button", {
      name: /Return to Training Center/i,
    });
    fireEvent.click(returnToTrainingBtn);
    expect(useTrainingStore.getState().currentState).toBe(
      TrainingState.DASHBOARD
    );
  });
});
