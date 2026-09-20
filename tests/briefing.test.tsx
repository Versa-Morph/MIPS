import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { BriefingScreen } from "../src/components/screens/03_Briefing";
import { useTrainingStore } from "../src/store/useTrainingStore";
import { TrainingState } from "../src/types/simulation";

describe("Screen 03: Briefing", () => {
  beforeEach(() => {
    useTrainingStore.getState().resetTraining();
  });

  it("renders Screen 03 (Briefing) with instructor directive, vessel info, and transitions to DOCUMENT_REVIEW", () => {
    render(<BriefingScreen />);
    expect(screen.getByText(/Capt\. H\. Gunawan/i)).toBeDefined();
    expect(screen.getByText(/Operational Training Task/i)).toBeDefined();
    expect(screen.getAllByText(/MV Nusantara/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/08:00 WIB/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Back to Scenario Overview/i)).toBeDefined();

    const docCenterButton = screen.getByRole("button", {
      name: /Review Documents/i,
    });
    fireEvent.click(docCenterButton);

    expect(useTrainingStore.getState().currentState).toBe(
      TrainingState.DOCUMENT_REVIEW
    );
  });
});
