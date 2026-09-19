import { describe, it, expect } from "vitest";
import { GET as getSessions, POST as createSession } from "../src/app/api/sessions/route";
import { GET as getSessionDetail } from "../src/app/api/sessions/[id]/route";
import { GET as getAnalytics } from "../src/app/api/analytics/route";

describe("Phase 2 Backend API & Database (Next.js 16 Route Handlers)", () => {
  it("GET /api/sessions returns list of recorded sessions", async () => {
    const res = await getSessions();
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(Array.isArray(json.data)).toBe(true);
    expect(json.data.length).toBeGreaterThanOrEqual(1);

    const first = json.data[0];
    expect(first.cadet_name).toBeDefined();
    expect(first.total_score).toBeDefined();
  });

  it("POST /api/sessions creates a new session record", async () => {
    const payload = {
      cadetName: "Cadet Test User",
      cadetNrp: "TRN-2026-999",
      cadetDepartment: "Deck Department (Nautika)",
      cadetBatch: "Batch 47 (2026)",
      scenarioId: "SCN-001",
      selectedBerth: "B-01",
      isFirstAttemptCorrect: true,
      decisionAttempts: 1,
      totalScore: 92,
      documentReviewScore: 20,
      berthDecisionScore: 40,
      operationScore: 18,
      kpiScore: 14,
      grade: "EXCELLENT",
      durationMinutes: 42,
      productivity: 71.4,
      containersHandled: 50,
      documentViews: [
        { type: "ARRIVAL_NOTICE", duration: 15 },
        { type: "BERTH_INFORMATION", duration: 20 },
      ],
      events: [
        {
          clockTime: "08:00",
          title: "Fairway Arrival",
          category: "NAVIGATION",
          containersCompleted: 0,
        },
      ],
    };

    const req = new Request("http://localhost:3000/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const res = await createSession(req);
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.id).toBeDefined();

    const detailReq = new Request(`http://localhost:3000/api/sessions/${json.id}`);
    const detailRes = await getSessionDetail(detailReq, {
      params: Promise.resolve({ id: json.id }),
    });
    expect(detailRes.status).toBe(200);

    const detailJson = await detailRes.json();
    expect(detailJson.success).toBe(true);
    expect(detailJson.data.cadet_name).toBe("Cadet Test User");
    expect(detailJson.data.documentViews.length).toBe(2);
    expect(detailJson.data.events.length).toBe(1);
  });

  it("GET /api/sessions/[id] returns 404 for non-existent session", async () => {
    const req = new Request("http://localhost:3000/api/sessions/non-existent-id");
    const res = await getSessionDetail(req, {
      params: Promise.resolve({ id: "non-existent-id" }),
    });
    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.success).toBe(false);
  });

  it("GET /api/analytics returns aggregated cohort metrics", async () => {
    const res = await getAnalytics();
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.totalCadets).toBeGreaterThanOrEqual(1);
    expect(json.data.averageScore).toBeGreaterThan(0);
    expect(json.data.passRate).toBeGreaterThanOrEqual(0);
    expect(json.data.berthAccuracyRate).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(json.data.departmentBreakdown)).toBe(true);
  });
});
