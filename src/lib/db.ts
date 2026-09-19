import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dbDirectory = path.join(process.cwd(), "data");
if (!fs.existsSync(dbDirectory)) {
  fs.mkdirSync(dbDirectory, { recursive: true });
}

const dbPath = path.join(dbDirectory, "mips.db");
const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS cadet_sessions (
    id TEXT PRIMARY KEY,
    cadet_name TEXT NOT NULL,
    cadet_nrp TEXT NOT NULL,
    cadet_department TEXT NOT NULL,
    cadet_batch TEXT NOT NULL,
    scenario_id TEXT NOT NULL,
    selected_berth TEXT NOT NULL,
    is_first_attempt_correct INTEGER NOT NULL,
    decision_attempts INTEGER NOT NULL,
    total_score INTEGER NOT NULL,
    document_review_score INTEGER NOT NULL,
    berth_decision_score INTEGER NOT NULL,
    operation_score INTEGER NOT NULL,
    kpi_score INTEGER NOT NULL,
    grade TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL,
    productivity REAL NOT NULL,
    containers_handled INTEGER NOT NULL,
    completed_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS document_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    document_type TEXT NOT NULL,
    view_duration_seconds INTEGER NOT NULL,
    FOREIGN KEY(session_id) REFERENCES cadet_sessions(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS session_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    clock_time TEXT NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    containers_completed INTEGER NOT NULL,
    FOREIGN KEY(session_id) REFERENCES cadet_sessions(id) ON DELETE CASCADE
  );
`);

const sessionCount = db
  .prepare("SELECT COUNT(*) as count FROM cadet_sessions")
  .get() as { count: number };

if (sessionCount.count === 0) {
  const seedSessions = [
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
    {
      id: "SES-2026-002",
      cadet_name: "Cadet Dewi Lestari",
      cadet_nrp: "TRN-2026-012",
      cadet_department: "Port Operations",
      cadet_batch: "Batch 47 (2026)",
      scenario_id: "SCN-001",
      selected_berth: "B-01",
      is_first_attempt_correct: 1,
      decision_attempts: 1,
      total_score: 88,
      document_review_score: 20,
      berth_decision_score: 40,
      operation_score: 18,
      kpi_score: 10,
      grade: "EXCELLENT",
      duration_minutes: 44,
      productivity: 68.2,
      containers_handled: 50,
      completed_at: "2026-09-19T09:30:00.000Z",
    },
    {
      id: "SES-2026-003",
      cadet_name: "Cadet Budi Santoso",
      cadet_nrp: "TRN-2026-088",
      cadet_department: "Marine Engineering",
      cadet_batch: "Batch 47 (2026)",
      scenario_id: "SCN-001",
      selected_berth: "B-01",
      is_first_attempt_correct: 0,
      decision_attempts: 2,
      total_score: 78,
      document_review_score: 15,
      berth_decision_score: 30,
      operation_score: 18,
      kpi_score: 15,
      grade: "SATISFACTORY",
      duration_minutes: 48,
      productivity: 65.0,
      containers_handled: 50,
      completed_at: "2026-09-19T10:15:00.000Z",
    },
  ];

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

  for (const session of seedSessions) {
    insertSession.run(session);
  }
}

export default db;
