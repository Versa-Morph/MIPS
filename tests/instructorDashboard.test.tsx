import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { InstructorDashboard } from "../src/components/screens/08_InstructorDashboard";

describe("Screen 08: Instructor Dashboard & Analytics", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation((url: string) => {
        if (url.includes("/api/sessions")) {
          return Promise.resolve({
            json: () =>
              Promise.resolve({
                success: true,
                data: [
                  {
                    id: "SES-2026-001",
                    cadet_name: "Cadet Pratama",
                    cadet_nrp: "TRN-2026-047",
                    cadet_department: "Deck Department (Nautika)",
                    cadet_batch: "Batch 47 (2026)",
                    scenario_id: "SCN-001",
                    selected_berth: "B-01",
                    is_first_attempt_correct: 1,
                    decision_attempts: 1,
                    total_score: 92,
                    document_review_score: 20,
                    berth_decision_score: 40,
                    operation_score: 18,
                    kpi_score: 14,
                    grade: "EXCELLENT",
                    duration_minutes: 42,
                    productivity: 71.4,
                    containers_handled: 50,
                    completed_at: "2026-09-19T08:45:00.000Z",
                  },
                ],
              }),
          });
        }
        if (url.includes("/api/analytics")) {
          return Promise.resolve({
            json: () =>
              Promise.resolve({
                success: true,
                data: {
                  totalCadets: 1,
                  averageScore: 92.0,
                  passRate: 100,
                  berthAccuracyRate: 100,
                },
              }),
          });
        }
        return Promise.reject(new Error("Unknown endpoint"));
      })
    );
  });

  it("renders instructor portal header and lead instructor badge", async () => {
    render(<InstructorDashboard />);
    expect(
      screen.getByText(/Port Operations Training Gradebook/i)
    ).toBeDefined();
    expect(screen.getByText(/Capt\. H\. Gunawan/i)).toBeDefined();
  });

  it("loads and displays cadet evaluation records in table", async () => {
    render(<InstructorDashboard />);

    await waitFor(() => {
      expect(screen.getByText("Cadet Pratama")).toBeDefined();
      expect(screen.getByText("TRN-2026-047")).toBeDefined();
      expect(screen.getAllByText("92").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("EXCELLENT")).toBeDefined();
    });
  });
});
