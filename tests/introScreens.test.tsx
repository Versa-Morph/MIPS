import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { DashboardScreen } from "../src/components/screens/01_Dashboard";
import { ScenarioCardScreen } from "../src/components/screens/02_ScenarioCard";
import { BriefingScreen } from "../src/components/screens/03_Briefing";
import { useTrainingStore } from "../src/store/useTrainingStore";
import { TrainingState } from "../src/types/simulation";

describe("Introductory Screens (Screens 01, 02, 03)", () => {
  beforeEach(() => {
    useTrainingStore.getState().resetTraining();
  });

  it("renders Screen 01 (Dashboard) with module card and transitions to SCENARIO_SELECTION", () => {
    render(<DashboardScreen />);
    expect(
      screen.getByText(/Container Vessel Arrival & Berthing Operation/i)
    ).toBeDefined();

    const launchButton = screen.getByRole("button", {
      name: /Continue/i,
    });
    fireEvent.click(launchButton);

    expect(useTrainingStore.getState().currentState).toBe(
      TrainingState.SCENARIO_SELECTION
    );
  });

  it("renders Screen 02 (Scenario Card) with vessel dimensions and transitions to BRIEFING", () => {
    render(<ScenarioCardScreen />);
    expect(screen.getByText(/Target Vessel Particulars/i)).toBeDefined();
    expect(screen.getByText(/280 m/i)).toBeDefined();
    expect(screen.getByText(/10.2 m/i)).toBeDefined();

    const proceedButton = screen.getByRole("button", {
      name: /START TRAINING/i,
    });
    fireEvent.click(proceedButton);

    expect(useTrainingStore.getState().currentState).toBe(
      TrainingState.BRIEFING
    );
  });

  it("renders Screen 03 (Briefing) with instructor directive and transitions to DOCUMENT_REVIEW", () => {
    render(<BriefingScreen />);
    expect(screen.getByText(/Capt\. H\. Gunawan/i)).toBeDefined();
    expect(screen.getByText(/11\.5 meters/i)).toBeDefined();

    const docCenterButton = screen.getByRole("button", {
      name: /Review Documents/i,
    });
    fireEvent.click(docCenterButton);

    expect(useTrainingStore.getState().currentState).toBe(
      TrainingState.DOCUMENT_REVIEW
    );
  });
});
