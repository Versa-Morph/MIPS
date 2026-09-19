import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const sessions = db
      .prepare(
        `SELECT * FROM cadet_sessions ORDER BY completed_at DESC`
      )
      .all();
    return NextResponse.json({ success: true, data: sessions });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = body.id || `SES-2026-${Date.now().toString().slice(-6)}`;

    const insertSession = db.prepare(`
      INSERT INTO cadet_sessions (
        id, cadet_name, cadet_nrp, cadet_department, cadet_batch,
        scenario_id, selected_berth, is_first_attempt_correct, decision_attempts,
        total_score, document_review_score, berth_decision_score, operation_score,
        kpi_score, grade, duration_minutes, productivity, containers_handled, completed_at
      ) VALUES (
        @id, @cadet_name, @cadet_nrp, @cadet_department, @cadet_batch,
        @scenario_id, @selected_berth, @is_first_attempt_correct, @decision_attempts,
        @total_score, @document_review_score, @berth_decision_score, @operation_score,
        @kpi_score, @grade, @duration_minutes, @productivity, @containers_handled, @completed_at
      )
    `);

    insertSession.run({
      id,
      cadet_name: body.cadetName || "Cadet Pratama",
      cadet_nrp: body.cadetNrp || "TRN-2026-047",
      cadet_department: body.cadetDepartment || "Deck Department (Nautika)",
      cadet_batch: body.cadetBatch || "Batch 47 (2026)",
      scenario_id: body.scenarioId || "SCN-001",
      selected_berth: body.selectedBerth || "B-01",
      is_first_attempt_correct: body.isFirstAttemptCorrect ? 1 : 0,
      decision_attempts: body.decisionAttempts || 1,
      total_score: body.totalScore || 92,
      document_review_score: body.documentReviewScore || 20,
      berth_decision_score: body.berthDecisionScore || 40,
      operation_score: body.operationScore || 18,
      kpi_score: body.kpiScore || 14,
      grade: body.grade || "EXCELLENT",
      duration_minutes: body.durationMinutes || 42,
      productivity: body.productivity || 71.4,
      containers_handled: body.containersHandled || 50,
      completed_at: new Date().toISOString(),
    });

    if (Array.isArray(body.documentViews)) {
      const insertDocView = db.prepare(`
        INSERT INTO document_views (session_id, document_type, view_duration_seconds)
        VALUES (?, ?, ?)
      `);
      for (const doc of body.documentViews) {
        insertDocView.run(id, doc.type, doc.duration || 10);
      }
    }

    if (Array.isArray(body.events)) {
      const insertEvent = db.prepare(`
        INSERT INTO session_events (session_id, clock_time, title, category, containers_completed)
        VALUES (?, ?, ?, ?, ?)
      `);
      for (const ev of body.events) {
        insertEvent.run(id, ev.clockTime, ev.title, ev.category, ev.containersCompleted);
      }
    }

    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
