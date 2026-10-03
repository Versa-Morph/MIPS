import { describe, it, expect, beforeEach, vi } from "vitest";
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
    vi.stubGlobal("confirm", () => true);
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
    const lastPortInput = screen.getByPlaceholderText(/cth: Singapore/i);
    const loaInput = screen.getByPlaceholderText(/cth: 280\.0/i);
    const draftInput = screen.getByPlaceholderText(/cth: 10\.20/i);
    const depthInput = screen.getByPlaceholderText(/Hitung: Draft \+ 1\.3m UKC/i);
    const ctnInput = screen.getByPlaceholderText("cth: 50");
    const reeferInput = screen.getByPlaceholderText("cth: 5");
    const dgInput = screen.getByPlaceholderText(/cth: 4\.1/i);
    const craneInput = screen.getByPlaceholderText("cth: 3");

    fireEvent.change(nameInput, { target: { value: "MV Nusantara" } });
    fireEvent.change(callSignInput, { target: { value: "PK-47A" } });
    fireEvent.change(imoInput, { target: { value: "1234567" } });
    fireEvent.change(lastPortInput, { target: { value: "Singapore" } });
    fireEvent.change(loaInput, { target: { value: "280.0" } });
    fireEvent.change(draftInput, { target: { value: "10.20" } });
    fireEvent.change(depthInput, { target: { value: "11.50" } });
    fireEvent.change(ctnInput, { target: { value: "50" } });
    fireEvent.change(reeferInput, { target: { value: "5" } });
    fireEvent.change(dgInput, { target: { value: "4.1" } });
    fireEvent.change(craneInput, { target: { value: "3" } });

    const submitBtn = screen.getByRole("button", {
      name: /Submit Pre-Arrival Dossier/i,
    });
    fireEvent.click(submitBtn);

    const confirmSubmitBtn = screen.getByRole("button", {
      name: /Ya, Kirim & Kunci Berkas Resmi/i,
    });
    fireEvent.click(confirmSubmitBtn);

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
    expect(screen.getByText(/Approach Velocity & Berthing Dynamics/i)).toBeDefined();
    expect(screen.getAllByText(/0\.12 m\/s/i).length).toBeGreaterThanOrEqual(1);

    const returnToTrainingBtn = screen.getByRole("button", {
      name: /Back to Training Center/i,
    });
    fireEvent.click(returnToTrainingBtn);
    expect(useTrainingStore.getState().currentState).toBe(
      TrainingState.DASHBOARD
    );
  });

  it("handles Session Code validation and remote Instructor Dispatch over the realtime bus", () => {
    render(<Home />);

    // 1. Validate session code via store action
    const isCodeValid = useTrainingStore.getState().validateSessionCode("MIPS-BERTH-2048");
    expect(isCodeValid).toBe(true);
    expect(useTrainingStore.getState().isSessionCodeValidated).toBe(true);

    // 2. Advance to decision and select B-01
    useTrainingStore.getState().setStep(TrainingState.DECISION);
    const decisionResult = useTrainingStore.getState().submitBerthDecision("B-01");
    expect(decisionResult.isValid).toBe(true);
    expect(useTrainingStore.getState().currentState).toBe(TrainingState.DECISION_VALIDATED);

    // 3. Start simulation and trigger Mooring Checkpoint at T+10
    useTrainingStore.getState().setStep(TrainingState.SIMULATION_RUNNING);
    useSimulationStore.getState().tick(10);
    expect(useSimulationStore.getState().pendingCheckpoint).not.toBeNull();
    expect(useSimulationStore.getState().pendingCheckpoint?.id).toBe("MOORING_APPROVAL");

    // 4. Remote Instructor approves Mooring over the wire
    useSimulationStore.getState().approveCheckpoint();
    expect(useSimulationStore.getState().pendingCheckpoint).toBeNull();
    expect(useSimulationStore.getState().approvedCheckpoints).toContain("MOORING_APPROVAL");

    // 5. Advance to T+15 Crane Start Checkpoint
    useSimulationStore.getState().tick(5);
    expect(useSimulationStore.getState().pendingCheckpoint).not.toBeNull();
    expect(useSimulationStore.getState().pendingCheckpoint?.id).toBe("CRANE_START_APPROVAL");

    // 6. Remote Instructor approves Crane Start
    useSimulationStore.getState().approveCheckpoint();
    expect(useSimulationStore.getState().pendingCheckpoint).toBeNull();
    expect(useSimulationStore.getState().approvedCheckpoints).toContain("CRANE_START_APPROVAL");

    // 7. Complete operations
    useSimulationStore.getState().seek(45);
    expect(useSimulationStore.getState().containersHandled).toBe(50);
  });
});
