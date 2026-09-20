import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { DocumentCenterScreen } from "../src/components/screens/04_DocumentCenter";
import { useTrainingStore } from "../src/store/useTrainingStore";
import { TrainingState } from "../src/types/simulation";

describe("Screen 04: Document Center 3-Panel Workspace (PRD Image 3)", () => {
  beforeEach(() => {
    useTrainingStore.getState().resetTraining();
    useTrainingStore.getState().setStep(TrainingState.DOCUMENT_REVIEW);
  });

  it("renders 3-panel workspace matching PRD Image 3 layout", () => {
    render(<DocumentCenterScreen />);
    expect(screen.getByText(/CARGO & NOTICE PACKAGE/i)).toBeDefined();
    expect(screen.getByText(/TECHNICAL SUMMARY/i)).toBeDefined();
    expect(screen.getByText(/ANALYSIS PROGRESS/i)).toBeDefined();
    expect(screen.getByText(/Key Insight Found/i)).toBeDefined();
  });

  it("lists all 4 package documents in left panel and renders real PDF file in center panel", () => {
    render(<DocumentCenterScreen />);
    expect(
      screen.getAllByText(/Notice of Arrival \(NOA\)/i).length
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Vessel Particulars & Registry/i)).toBeDefined();
    expect(screen.getByText(/Dangerous Goods & Cargo Manifest/i)).toBeDefined();
    expect(
      screen.getByText(/Port Bathymetry & Pelindo Master Berth Sheet/i)
    ).toBeDefined();

    // Center panel renders the real PDF iframe
    const iframe = screen.getByTitle(/Notice of Arrival \(NOA\)/i);
    expect(iframe).toBeDefined();
    expect(iframe.getAttribute("src")).toContain("notice-of-arrival.pdf");
  });

  it("requires completing analysis checklist before unlocking MAKE BERTHING DECISION", () => {
    render(<DocumentCenterScreen />);
    const decisionBtn = screen.getByRole("button", {
      name: /MAKE BERTHING DECISION/i,
    });

    expect(decisionBtn.hasAttribute("disabled")).toBe(true);

    const draftBtn = screen.getByRole("button", { name: "Draft 10.20m" });
    const loaBtn = screen.getByRole("button", { name: "LOA 280m" });
    const ukcBtn = screen.getByRole("button", { name: "Kedalaman 11.5m" });

    fireEvent.click(draftBtn);
    fireEvent.click(loaBtn);
    fireEvent.click(ukcBtn);

    expect(decisionBtn.hasAttribute("disabled")).toBe(false);

    fireEvent.click(decisionBtn);
    expect(useTrainingStore.getState().currentState).toBe(
      TrainingState.DECISION
    );
  });
});
