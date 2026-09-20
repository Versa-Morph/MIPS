import { describe, it, expect, beforeEach } from "vitest";
import { useSimulationStore } from "../src/store/useSimulationStore";

describe("Simulation State Store & Clock Engine (Zustand 5)", () => {
  beforeEach(() => {
    useSimulationStore.getState().resetSimulation();
  });

  it("initializes at T+00 (08:00) with zero containers handled and paused state", () => {
    const state = useSimulationStore.getState();
    expect(state.currentSimMinute).toBe(0);
    expect(state.clockTime).toBe("08:00");
    expect(state.containersHandled).toBe(0);
    expect(state.isPlaying).toBe(false);
    expect(state.speedMultiplier).toBe(1);
    expect(state.isCompleted).toBe(false);
  });

  it("advances simulation time and updates vessel position on tick", () => {
    const { play, tick } = useSimulationStore.getState();
    play();
    expect(useSimulationStore.getState().isPlaying).toBe(true);

    tick(10);
    const state = useSimulationStore.getState();
    expect(state.currentSimMinute).toBe(10);
    expect(state.clockTime).toBe("08:10");
    expect(state.currentEvent.title).toContain("Berthed Alongside B-01");
    expect(state.vesselPosition.x).toBe(380);
  });

  it("supports speed multipliers (1x, 2x, 4x)", () => {
    const { setSpeed } = useSimulationStore.getState();
    setSpeed(2);
    expect(useSimulationStore.getState().speedMultiplier).toBe(2);

    setSpeed(4);
    expect(useSimulationStore.getState().speedMultiplier).toBe(4);
  });

  it("accumulates containers handled up to 50 at T+40 and marks completed at T+45", () => {
    const { seek } = useSimulationStore.getState();

    seek(40);
    let state = useSimulationStore.getState();
    expect(state.containersHandled).toBe(50);
    expect(state.currentEvent.title).toContain("Cargo Handling Completed");

    seek(45);
    state = useSimulationStore.getState();
    expect(state.isCompleted).toBe(true);
    expect(state.isPlaying).toBe(false);
  });

  it("calculates real-time productivity and equipment utilization", () => {
    const { seek } = useSimulationStore.getState();
    seek(25);
    const state = useSimulationStore.getState();
    expect(state.containersHandled).toBe(22);
    expect(state.productivityMovesPerHour).toBeGreaterThan(0);
    expect(state.craneUtilization).toBeGreaterThan(0);
    expect(state.truckUtilization).toBeGreaterThan(0);
  });
});
