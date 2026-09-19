import { describe, it, expect } from "vitest";
import { vesselMVNusantara, berths, trainingScenario } from "../src/data/scenarioData";
import { initialDocuments } from "../src/data/documentsData";
import { simulationTimeline } from "../src/data/simulationTimeline";
import { TrainingState } from "../src/types/simulation";

describe("Domain Data Integrity & Scenario Fixtures", () => {
  it("defines MV Nusantara with correct physical dimensions matching PRD", () => {
    expect(vesselMVNusantara.id).toBe("VESSEL-001");
    expect(vesselMVNusantara.name).toBe("MV Nusantara");
    expect(vesselMVNusantara.imo).toBe("1234567");
    expect(vesselMVNusantara.loa).toBe(280);
    expect(vesselMVNusantara.draft).toBe(10.2);
    expect(vesselMVNusantara.eta).toBe("08:00");
    expect(vesselMVNusantara.totalCargoCount).toBe(50);
  });

  it("contains Berth B-01 (feasible) and Berth B-02 (infeasible)", () => {
    expect(berths.length).toBe(2);

    const b01 = berths.find((b) => b.id === "B-01");
    const b02 = berths.find((b) => b.id === "B-02");

    expect(b01).toBeDefined();
    expect(b02).toBeDefined();

    // B-01 meets LOA (300 >= 280) and draft (12 >= 10.2)
    expect(b01!.maxLoa).toBe(300);
    expect(b01!.maxDraft).toBe(12.0);
    expect(b01!.maxLoa).toBeGreaterThanOrEqual(vesselMVNusantara.loa);
    expect(b01!.maxDraft).toBeGreaterThanOrEqual(vesselMVNusantara.draft);

    // B-02 fails LOA (250 < 280) and draft (9.0 < 10.2)
    expect(b02!.maxLoa).toBe(250);
    expect(b02!.maxDraft).toBe(9.0);
    expect(b02!.maxLoa).toBeLessThan(vesselMVNusantara.loa);
    expect(b02!.maxDraft).toBeLessThan(vesselMVNusantara.draft);
  });

  it("contains exactly 4 mandatory document packages initialized as unread", () => {
    expect(initialDocuments.length).toBe(4);
    const types = initialDocuments.map((d) => d.type);
    expect(types).toContain("ARRIVAL_NOTICE");
    expect(types).toContain("VESSEL_MANIFEST");
    expect(types).toContain("CARGO_MANIFEST");
    expect(types).toContain("BERTH_INFORMATION");

    initialDocuments.forEach((doc) => {
      expect(doc.isViewed).toBe(false);
      expect(doc.viewDurationSeconds).toBe(0);
      expect(doc.referenceNumber).toBeDefined();
      expect(doc.content).toBeDefined();
    });
  });

  it("defines a deterministic timeline ending at T+45 with 50 containers", () => {
    expect(simulationTimeline.length).toBeGreaterThanOrEqual(8);
    const firstEvent = simulationTimeline[0];
    const lastEvent = simulationTimeline[simulationTimeline.length - 1];

    expect(firstEvent.timeOffsetMinutes).toBe(0);
    expect(firstEvent.clockTime).toBe("08:00");
    expect(firstEvent.containersCompleted).toBe(0);

    expect(lastEvent.timeOffsetMinutes).toBe(45);
    expect(lastEvent.clockTime).toBe("08:45");
    expect(lastEvent.containersCompleted).toBe(50);
  });

  it("defines scenario metadata matching PRD requirements", () => {
    expect(trainingScenario.id).toBe("SCN-001");
    expect(trainingScenario.name).toContain("Container Vessel Arrival");
    expect(trainingScenario.difficulty).toBe("Basic");
  });

  it("exports TrainingState enum with all 9 lifecycle states", () => {
    expect(TrainingState.DASHBOARD).toBe("DASHBOARD");
    expect(TrainingState.SCENARIO_SELECTION).toBe("SCENARIO_SELECTION");
    expect(TrainingState.BRIEFING).toBe("BRIEFING");
    expect(TrainingState.DOCUMENT_REVIEW).toBe("DOCUMENT_REVIEW");
    expect(TrainingState.DECISION).toBe("DECISION");
    expect(TrainingState.DECISION_VALIDATED).toBe("DECISION_VALIDATED");
    expect(TrainingState.SIMULATION_RUNNING).toBe("SIMULATION_RUNNING");
    expect(TrainingState.ASSESSMENT).toBe("ASSESSMENT");
    expect(TrainingState.TRAINING_COMPLETED).toBe("TRAINING_COMPLETED");
  });
});
