import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { ScenarioCardScreen } from "../src/components/screens/02_ScenarioCard";
import { useTrainingStore } from "../src/store/useTrainingStore";
import { TrainingState } from "../src/types/simulation";

describe("Screen 02 - Scenario Card (Executive 2-Column Layout)", () => {
  beforeEach(() => {
    useTrainingStore.getState().resetTraining();
  });

  it("renders scenario header with SCN-001 specification and vessel-hero image", () => {
    render(<ScenarioCardScreen />);
    expect(screen.getByText(/SCN-001/i)).toBeDefined();
    expect(
      screen.getByText(/Container Vessel Arrival & Berthing Operation/i)
    ).toBeDefined();

    const heroImg = screen.getByAltText(/Vessel Hero Banner/i);
    expect(heroImg).toBeDefined();
    expect(heroImg.getAttribute("src")).toBe("/images/vessel-hero.png");
  });

  it("renders Target Vessel Overview with technical specifications", () => {
    render(<ScenarioCardScreen />);
    expect(screen.getByText(/Target Vessel Overview/i)).toBeDefined();
    expect(screen.getAllByText(/MV Nusantara/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/280/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/10\.2/i).length).toBeGreaterThanOrEqual(1);
  });

  it("navigates back to Dashboard when Back to Dashboard button is clicked", () => {
    render(<ScenarioCardScreen />);
    useTrainingStore.setState({ currentState: TrainingState.SCENARIO_SELECTION });

    const backButton = screen.getAllByRole("button", {
      name: /Back to Dashboard/i,
    })[0];
    fireEvent.click(backButton);

    expect(useTrainingStore.getState().currentState).toBe(
      TrainingState.DASHBOARD
    );
  });

  it("transitions to BRIEFING when START TRAINING button is clicked", () => {
    render(<ScenarioCardScreen />);
    const proceedButton = screen.getByRole("button", {
      name: /START TRAINING/i,
    });
    fireEvent.click(proceedButton);

    expect(useTrainingStore.getState().currentState).toBe(
      TrainingState.BRIEFING
    );
  });

  it("renders evaluated mission objectives and operational directives", () => {
    render(<ScenarioCardScreen />);
    expect(screen.getByText(/Evaluated Mission Objectives/i)).toBeDefined();
    expect(screen.getByText(/Document Analysis/i)).toBeDefined();
    expect(screen.getByText(/Berth Allocation Decision/i)).toBeDefined();
    expect(screen.getByText(/Simulation Oversight/i)).toBeDefined();
    expect(screen.getByText(/Operational Directives & Passing Standards/i)).toBeDefined();
  });
});
