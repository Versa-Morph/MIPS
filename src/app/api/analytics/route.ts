import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const totalRow = db
      .prepare(`SELECT COUNT(*) as total FROM cadet_sessions`)
      .get() as { total: number };

    const avgRow = db
      .prepare(`SELECT AVG(total_score) as avgScore FROM cadet_sessions`)
      .get() as { avgScore: number | null };

    const passRow = db
      .prepare(
        `SELECT COUNT(*) as passed FROM cadet_sessions WHERE total_score >= 70`
      )
      .get() as { passed: number };

    const berthAccuracyRow = db
      .prepare(
        `SELECT COUNT(*) as accurate FROM cadet_sessions WHERE is_first_attempt_correct = 1`
      )
      .get() as { accurate: number };

    const deptRows = db
      .prepare(
        `SELECT cadet_department as department, COUNT(*) as count FROM cadet_sessions GROUP BY cadet_department`
      )
      .all();

    const total = totalRow.total || 0;
    const avgScore = avgRow.avgScore ? Number(avgRow.avgScore.toFixed(1)) : 0;
    const passRate = total > 0 ? Number(((passRow.passed / total) * 100).toFixed(1)) : 0;
    const berthAccuracyRate =
      total > 0
        ? Number(((berthAccuracyRow.accurate / total) * 100).toFixed(1))
        : 0;

    return NextResponse.json({
      success: true,
      data: {
        totalCadets: total,
        averageScore: avgScore,
        passRate,
        berthAccuracyRate,
        departmentBreakdown: deptRows,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
