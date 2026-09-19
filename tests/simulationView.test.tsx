import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { SimulationViewScreen } from "../src/components/screens/06_SimulationView";
import { useTrainingStore } from "../src/store/useTrainingStore";
import { useSimulationStore } from "../src/store/useSimulationStore";
import { TrainingState } from "../src/types/simulation";

describe("Screen 06: Simulation View Cockpit", () => {
  beforeEach(() => {
    useTrainingStore.getState().resetTraining();
    useTrainingStore.getState().setStep(TrainingState.SIMULATION_RUNNING);
    useTrainingStore.getState().submitBerthDecision("B-01");
    useSimulationStore.getState().resetSimulation();
  });

  it("renders 3-panel cockpit with telemetry, dossier, timeline, and KPIs", () => {
    render(<SimulationViewScreen />);

    // Top Cockpit bar
    expect(screen.getByText(/MIPS SIMULATOR · TACTICAL HUD/i)).toBeDefined();
    expect(screen.getAllByText(/MV Nusantara/i).length).toBeGreaterThanOrEqual(1);

    // Controls & Telemetry
    expect(screen.getByText(/SIM TIME/i)).toBeDefined();
    expect(screen.getByText(/Marine Sensor Telemetry/i)).toBeDefined();
    expect(screen.getByText(/085° ENE/i)).toBeDefined();

    // Bottom monitoring deck
    expect(screen.getByText(/Terminal Event Log/i)).toBeDefined();
    expect(screen.getByText(/Operational KPI Telemetry/i)).toBeDefined();
  });

  it("advances to ASSESSMENT when cadet clicks proceed button", () => {
    render(<SimulationViewScreen />);

    const proceedButton = screen.getByRole("button", {
      name: /Skip to Assessment|Proceed to Assessment/i,
    });
    fireEvent.click(proceedButton);

    expect(useTrainingStore.getState().currentState).toBe(
      TrainingState.ASSESSMENT
    );
  });
});
