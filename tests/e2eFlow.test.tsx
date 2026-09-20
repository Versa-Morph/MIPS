import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import Home from "../src/app/page";
import { useTrainingStore } from "../src/store/useTrainingStore";
import { useSimulationStore } from "../src/store/useSimulationStore";
import { TrainingState } from "../src/types/simulation";

describe("MIPS End-to-End Cadet Training Simulation Flow", () => {
  beforeEach(() => {
    useTrainingStore.getState().resetTraining();
    useSimulationStore.getState().resetSimulation();
  });

  it("walks through the entire 7-screen pedagogical lifecycle smoothly", () => {
    render(<Home />);

    expect(
      screen.getByText(/Container Vessel Arrival & Berthing Operation/i)
    ).toBeDefined();
    const launchScenarioBtn = screen.getByRole("button", {
      name: /Start Training/i,
    });
    fireEvent.click(launchScenarioBtn);
    expect(useTrainingStore.getState().currentState).toBe(
      TrainingState.SCENARIO_SELECTION
    );

    // SCREEN 02: SCENARIO CARD
    expect(screen.getByText(/Target Vessel Overview/i)).toBeDefined();
    const proceedToBriefingBtn = screen.getByRole("button", {
      name: /START TRAINING/i,
    });
    fireEvent.click(proceedToBriefingBtn);
    expect(useTrainingStore.getState().currentState).toBe(
      TrainingState.BRIEFING
    );

    // SCREEN 03: BRIEFING
    expect(screen.getByText(/Capt\. H\. Gunawan/i)).toBeDefined();
    const proceedToDocCenterBtn = screen.getByRole("button", {
      name: /Review Documents/i,
    });
    fireEvent.click(proceedToDocCenterBtn);
    expect(useTrainingStore.getState().currentState).toBe(
      TrainingState.DOCUMENT_REVIEW
    );

    expect(
      screen.getAllByText(/Notice of Arrival \(NOA\)/i).length
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/CARGO & NOTICE PACKAGE/i)).toBeDefined();
    expect(
      screen.getAllByText(/PRE-ARRIVAL CLEARANCE DOSSIER/i).length
    ).toBeGreaterThanOrEqual(1);

    fireEvent.click(screen.getAllByText(/Notice of Arrival \(NOA\)/i)[0]);
    fireEvent.click(screen.getByText(/Vessel Particulars & Registry/i));
    fireEvent.click(screen.getByText(/Dangerous Goods & Cargo Manifest/i));
    fireEvent.click(screen.getByText(/Port Bathymetry & Pelindo Master Berth Sheet/i));

    expect(
      screen.getAllByText(/PRE-ARRIVAL CLEARANCE DOSSIER/i).length
    ).toBeGreaterThanOrEqual(1);

    const nameInput = screen.getByPlaceholderText(/cth: MV Nusantara/i);
    const callSignInput = screen.getByPlaceholderText(/cth: PK-47A/i);
    const imoInput = screen.getByPlaceholderText(/cth: 1234567/i);
    const loaInput = screen.getByPlaceholderText(/cth: 280\.0/i);
    const draftInput = screen.getByPlaceholderText(/cth: 10\.20/i);
    const depthInput = screen.getByPlaceholderText(/Hitung: Draft \+ 1\.3m UKC/i);
    const ctnInput = screen.getByPlaceholderText("cth: 50");
    const reeferInput = screen.getByPlaceholderText("cth: 5");
    const craneInput = screen.getByPlaceholderText("cth: 3");

    fireEvent.change(nameInput, { target: { value: "MV Nusantara" } });
    fireEvent.change(callSignInput, { target: { value: "PK-47A" } });
    fireEvent.change(imoInput, { target: { value: "1234567" } });
    fireEvent.change(loaInput, { target: { value: "280.0" } });
    fireEvent.change(draftInput, { target: { value: "10.20" } });
    fireEvent.change(depthInput, { target: { value: "11.50" } });
    fireEvent.change(ctnInput, { target: { value: "50" } });
    fireEvent.change(reeferInput, { target: { value: "5" } });
    fireEvent.change(craneInput, { target: { value: "3" } });

    const submitBtn = screen.getByRole("button", {
      name: /Submit Pre-Arrival Dossier/i,
    });
    fireEvent.click(submitBtn);

    const proceedToDecisionBtn = screen.getByRole("button", {
      name: /PROCEED TO BERTH ASSIGNMENT/i,
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
      name: /Submit Decision/i,
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

    expect(screen.getByText(/TRAINING SIMULATION/i)).toBeDefined();
    expect(screen.getByText(/Terminal Event Log/i)).toBeDefined();
    expect(screen.getByText(/Operational KPI Telemetry/i)).toBeDefined();

    useSimulationStore.getState().seek(45);
    expect(useSimulationStore.getState().containersHandled).toBe(50);

    const proceedToAssessmentBtn = screen.getByRole("button", {
      name: /Complete Operation/i,
    });
    fireEvent.click(proceedToAssessmentBtn);
    expect(useTrainingStore.getState().currentState).toBe(
      TrainingState.ASSESSMENT
    );

    expect(screen.getByText(/TRAINING COMPLETED/i)).toBeDefined();
    expect(screen.getByText(/92/)).toBeDefined();

    const returnToTrainingBtn = screen.getByRole("button", {
      name: /Back to Training Center/i,
    });
    fireEvent.click(returnToTrainingBtn);
    expect(useTrainingStore.getState().currentState).toBe(
      TrainingState.DASHBOARD
    );
  });
});
