import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;

    const session = db
      .prepare(`SELECT * FROM cadet_sessions WHERE id = ?`)
      .get(id);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Cadet session not found" },
        { status: 404 }
      );
    }

    const documentViews = db
      .prepare(`SELECT * FROM document_views WHERE session_id = ?`)
      .all(id);

    const events = db
      .prepare(`SELECT * FROM session_events WHERE session_id = ?`)
      .all(id);

    return NextResponse.json({
      success: true,
      data: {
        ...session,
        documentViews,
        events,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
