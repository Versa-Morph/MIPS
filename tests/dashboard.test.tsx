import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { DashboardScreen } from "../src/components/screens/01_Dashboard";
import { useTrainingStore } from "../src/store/useTrainingStore";
import { TrainingState } from "../src/types/simulation";

describe("Screen 01 - Dashboard (Bento Grid Layout)", () => {
  beforeEach(() => {
    useTrainingStore.getState().resetTraining();
  });

  it("renders MIPS TRAINING CENTER and cadet welcoming banner", () => {
    render(<DashboardScreen />);
    expect(screen.getByText(/MIPS TRAINING CENTER/i)).toBeDefined();
    expect(screen.getByText(/Welcome, Cadet/i)).toBeDefined();
  });

  it("renders active assignment card with vessel hero backdrop and details", () => {
    render(<DashboardScreen />);
    expect(
      screen.getByText(/Container Vessel Arrival & Berthing Operation/i)
    ).toBeDefined();
    expect(screen.getByText(/Active Assignment/i)).toBeDefined();

    const heroImg = screen.getByAltText(/Vessel Hero Backdrop/i);
    expect(heroImg).toBeDefined();
    expect(heroImg.getAttribute("src")).toBe("/images/vessel-hero.png");
  });

  it("transitions to SCENARIO_SELECTION when Start Training button is clicked", () => {
    render(<DashboardScreen />);
    const startButton = screen.getByRole("button", {
      name: /Start Training/i,
    });
    fireEvent.click(startButton);
    expect(useTrainingStore.getState().currentState).toBe(
      TrainingState.SCENARIO_SELECTION
    );
  });

  it("renders progress gauge displaying 1 / 3 Completed", () => {
    render(<DashboardScreen />);
    expect(screen.getByText(/1 \/ 3/i)).toBeDefined();
    expect(screen.getByText(/Completed/i)).toBeDefined();
    expect(screen.getByText(/Training Progress/i)).toBeDefined();
  });

  it("renders available training roster with active and locked modules", () => {
    render(<DashboardScreen />);
    expect(screen.getByText(/Available Training/i)).toBeDefined();
    expect(
      screen.getByRole("heading", { name: /^Vessel Arrival & Berthing$/i })
    ).toBeDefined();
    expect(screen.getByText(/Cargo Handling/i)).toBeDefined();
    expect(screen.getByText(/Yard Operations/i)).toBeDefined();
  });

  it("clicking module 01 active card also launches scenario selection", () => {
    render(<DashboardScreen />);
    const module01Title = screen.getByRole("heading", {
      name: /^Vessel Arrival & Berthing$/i,
    });
    fireEvent.click(module01Title);
    expect(useTrainingStore.getState().currentState).toBe(
      TrainingState.SCENARIO_SELECTION
    );
  });
});
