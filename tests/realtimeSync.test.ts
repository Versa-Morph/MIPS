import { describe, it, expect, beforeEach } from "vitest";
import { realtimeSync, RealtimeMessage } from "../src/utils/realtimeSync";
import { useTrainingStore } from "../src/store/useTrainingStore";
import { useSimulationStore } from "../src/store/useSimulationStore";
import { TrainingState } from "../src/types/simulation";

describe("MIPS Real-time Synchronization & Session Code Engine", () => {
  beforeEach(() => {
    useTrainingStore.getState().resetTraining();
    useSimulationStore.getState().resetSimulation();
  });

  it("validates session code MIPS-BERTH-2048 correctly", () => {
    const store = useTrainingStore.getState();
    expect(store.isSessionCodeValidated).toBe(false);

    // Wrong code
    const isWrong = store.validateSessionCode("WRONG-CODE-9999");
    expect(isWrong).toBe(false);
    expect(useTrainingStore.getState().isSessionCodeValidated).toBe(false);

    // Correct code
    const isCorrect = store.validateSessionCode("MIPS-BERTH-2048");
    expect(isCorrect).toBe(true);
    expect(useTrainingStore.getState().isSessionCodeValidated).toBe(true);
  });

  it("broadcasts messages to subscribers across realtime bus", () => {
    const receivedMessages: RealtimeMessage[] = [];
    const unsubscribe = realtimeSync.subscribe((msg) => {
      receivedMessages.push(msg);
    });

    realtimeSync.broadcast({
      type: "INSTRUCTOR_ALERT",
      title: "NAV WARNING",
      message: "Wind speed 25 knots in fairway",
      level: "WARNING",
      timestamp: Date.now(),
    });

    expect(receivedMessages.length).toBe(1);
    expect(receivedMessages[0].type).toBe("INSTRUCTOR_ALERT");
    expect((receivedMessages[0] as any).title).toBe("NAV WARNING");

    unsubscribe();
  });

  it("remotely approves Mooring checkpoint when INSTRUCTOR_DISPATCH event is received", () => {
    // Advance simulation tick to trigger Mooring checkpoint at minute 10
    useSimulationStore.getState().tick(10);
    expect(useSimulationStore.getState().pendingCheckpoint).not.toBeNull();
    expect(useSimulationStore.getState().pendingCheckpoint?.id).toBe("MOORING_APPROVAL");

    // Instructor dispatches approval over the wire
    realtimeSync.broadcast({
      type: "INSTRUCTOR_DISPATCH",
      checkpointId: "MOORING_APPROVAL",
      approved: true,
      sender: "Capt. H. Gunawan",
      timestamp: Date.now(),
    });

    // Checkpoint should be approved automatically
    expect(useSimulationStore.getState().pendingCheckpoint).toBeNull();
    expect(useSimulationStore.getState().approvedCheckpoints).toContain("MOORING_APPROVAL");
  });
});
