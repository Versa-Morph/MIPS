import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { DocumentCenterScreen } from "../src/components/screens/04_DocumentCenter";
import { useTrainingStore } from "../src/store/useTrainingStore";
import { TrainingState } from "../src/types/simulation";

describe("Screen 04: Document Center & Modal Viewer", () => {
  beforeEach(() => {
    useTrainingStore.getState().resetTraining();
    useTrainingStore.getState().setStep(TrainingState.DOCUMENT_REVIEW);
  });

  it("renders all 4 mandatory operational documents", () => {
    render(<DocumentCenterScreen />);
    expect(screen.getByText(/Notice of Arrival \(NOA\)/i)).toBeDefined();
    expect(screen.getByText(/Vessel Particulars & Registry/i)).toBeDefined();
    expect(screen.getByText(/Cargo Manifest/i)).toBeDefined();
    expect(screen.getByText(/Berth Specification Sheet/i)).toBeDefined();
  });

  it("tracks document inspection and updates status to VERIFIED upon opening", () => {
    render(<DocumentCenterScreen />);

    // Initially unreviewed
    const unreviewedBadges = screen.getAllByText(/UNREVIEWED/i);
    expect(unreviewedBadges.length).toBe(4);

    // Click on Notice of Arrival card to open modal
    const noaCard = screen.getByText(/Notice of Arrival \(NOA\)/i);
    fireEvent.click(noaCard);

    // Modal should be open showing official content
    expect(
      screen.getByText(/CRITICAL NAUTICAL PARAMETERS DECLARED/i)
    ).toBeDefined();
    expect(screen.getAllByText(/10\.20/i).length).toBeGreaterThanOrEqual(1);

    // Verify in store that isViewed is now true
    const doc = useTrainingStore
      .getState()
      .documents.find((d) => d.type === "ARRIVAL_NOTICE");
    expect(doc?.isViewed).toBe(true);

    // Close modal
    const closeButton = screen.getByRole("button", { name: /Close Viewer/i });
    fireEvent.click(closeButton);

    // Modal closed
    expect(
      screen.queryByText(/CRITICAL NAUTICAL PARAMETERS DECLARED/i)
    ).toBeNull();
  });

  it("advances to DECISION state when proceeding to berth assignment", () => {
    render(<DocumentCenterScreen />);
    const proceedButton = screen.getByRole("button", {
      name: /Proceed to Berth Assignment/i,
    });
    fireEvent.click(proceedButton);

    expect(useTrainingStore.getState().currentState).toBe(
      TrainingState.DECISION
    );
  });
});
