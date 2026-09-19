import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Header } from "../src/components/common/Header";
import { ProgressBar } from "../src/components/common/ProgressBar";
import { TrainingState } from "../src/types/simulation";

describe("Layout Components (Header & ProgressBar)", () => {
  it("renders Header with academy brand, cadet profile, and vessel tag", () => {
    render(<Header />);
    expect(screen.getByText(/MIPS ACADEMY/i)).toBeDefined();
    expect(screen.getByText(/Cadet Pratama/i)).toBeDefined();
    expect(screen.getByText(/Batch 47/i)).toBeDefined();
  });

  it("renders ProgressBar with the 5 core training milestones", () => {
    render(<ProgressBar currentState={TrainingState.BRIEFING} />);
    expect(screen.getByText(/BRIEFING/i)).toBeDefined();
    expect(screen.getByText(/DOCUMENTS/i)).toBeDefined();
    expect(screen.getByText(/DECISION/i)).toBeDefined();
    expect(screen.getByText(/SIMULATION/i)).toBeDefined();
    expect(screen.getByText(/ASSESSMENT/i)).toBeDefined();
  });
});
