import { describe, it, expect, beforeEach } from "vitest";
import { useTrainingStore } from "../src/store/useTrainingStore";
import { TrainingState } from "../src/types/simulation";

describe("Training FSM Store (Zustand 5)", () => {
  beforeEach(() => {
    useTrainingStore.getState().resetTraining();
  });

  it("initializes in DASHBOARD state with 4 unread documents", () => {
    const state = useTrainingStore.getState();
    expect(state.currentState).toBe(TrainingState.DASHBOARD);
    expect(state.documents.length).toBe(4);
    expect(state.documents.every((d) => !d.isViewed)).toBe(true);
    expect(state.selectedBerth).toBeNull();
    expect(state.decisionAttempts).toBe(0);
  });

  it("transitions sequentially between training steps", () => {
    const { setStep } = useTrainingStore.getState();

    setStep(TrainingState.SCENARIO_SELECTION);
    expect(useTrainingStore.getState().currentState).toBe(
      TrainingState.SCENARIO_SELECTION
    );

    setStep(TrainingState.BRIEFING);
    expect(useTrainingStore.getState().currentState).toBe(TrainingState.BRIEFING);

    setStep(TrainingState.DOCUMENT_REVIEW);
    expect(useTrainingStore.getState().currentState).toBe(
      TrainingState.DOCUMENT_REVIEW
    );
  });

  it("marks documents as viewed and accumulates duration", () => {
    const { markDocumentViewed } = useTrainingStore.getState();

    markDocumentViewed("ARRIVAL_NOTICE", 12);
    let doc = useTrainingStore
      .getState()
      .documents.find((d) => d.type === "ARRIVAL_NOTICE");
    expect(doc?.isViewed).toBe(true);
    expect(doc?.viewDurationSeconds).toBe(12);

    // Marking again accumulates or updates duration
    markDocumentViewed("ARRIVAL_NOTICE", 5);
    doc = useTrainingStore
      .getState()
      .documents.find((d) => d.type === "ARRIVAL_NOTICE");
    expect(doc?.viewDurationSeconds).toBe(17);
  });

  it("validates compliant Berth B-01 and advances to DECISION_VALIDATED", () => {
    const { setStep, submitBerthDecision } = useTrainingStore.getState();
    setStep(TrainingState.DECISION);

    const result = submitBerthDecision("B-01");
    expect(result.isValid).toBe(true);
    expect(result.feedback).toContain("compatible");

    const state = useTrainingStore.getState();
    expect(state.selectedBerth).toBe("B-01");
    expect(state.currentState).toBe(TrainingState.DECISION_VALIDATED);
    expect(state.decisionAttempts).toBe(1);
    expect(state.isFirstAttemptCorrect).toBe(true);
  });

  it("rejects non-compliant Berth B-02 without advancing FSM to validated", () => {
    const { setStep, submitBerthDecision } = useTrainingStore.getState();
    setStep(TrainingState.DECISION);

    const result = submitBerthDecision("B-02");
    expect(result.isValid).toBe(false);
    expect(result.feedback).toContain("does not meet");

    const state = useTrainingStore.getState();
    expect(state.selectedBerth).toBe("B-02");
    // FSM remains at DECISION to let cadet review documents and try again
    expect(state.currentState).toBe(TrainingState.DECISION);
    expect(state.decisionAttempts).toBe(1);
    expect(state.isFirstAttemptCorrect).toBe(false);
  });

  it("resets all training state to initial values", () => {
    const { setStep, markDocumentViewed, submitBerthDecision, resetTraining } =
      useTrainingStore.getState();

    setStep(TrainingState.SIMULATION_RUNNING);
    markDocumentViewed("ARRIVAL_NOTICE", 30);
    submitBerthDecision("B-01");

    resetTraining();

    const state = useTrainingStore.getState();
    expect(state.currentState).toBe(TrainingState.DASHBOARD);
    expect(state.selectedBerth).toBeNull();
    expect(state.decisionAttempts).toBe(0);
    expect(state.isFirstAttemptCorrect).toBe(false);
    expect(state.documents.every((d) => !d.isViewed)).toBe(true);
  });

  it("handles loginCadet and logoutCadet lifecycle", () => {
    const { loginCadet, logoutCadet } = useTrainingStore.getState();

    loginCadet(
      "Cadet Budi",
      "TRN-2026-099",
      "Marine Engineering (Teknika)",
      "Batch 48"
    );
    let state = useTrainingStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.cadetName).toBe("Cadet Budi");
    expect(state.cadetNrp).toBe("TRN-2026-099");
    expect(state.currentState).toBe(TrainingState.DASHBOARD);

    logoutCadet();
    state = useTrainingStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.currentState).toBe(TrainingState.LOGIN);
    expect(state.selectedBerth).toBeNull();
  });
});
