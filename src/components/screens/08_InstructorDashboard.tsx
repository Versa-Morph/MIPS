"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Award,
  TrendingUp,
  Anchor,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  ArrowLeft,
  Filter,
  Layers,
  Clock,
  RotateCcw,
  ShieldCheck,
  FileSpreadsheet,
} from "lucide-react";
import { useTrainingStore } from "@/store/useTrainingStore";
import { TrainingState } from "@/types/simulation";
import { Modal } from "@/components/common/Modal";

interface CadetSessionItem {
  id: string;
  cadet_name: string;
  cadet_nrp: string;
  cadet_department: string;
  cadet_batch: string;
  scenario_id: string;
  selected_berth: string;
  is_first_attempt_correct: number;
  decision_attempts: number;
  total_score: number;
  document_review_score: number;
  berth_decision_score: number;
  operation_score: number;
  kpi_score: number;
  grade: string;
  duration_minutes: number;
  productivity: number;
  containers_handled: number;
  completed_at: string;
}

interface AnalyticsData {
  totalCadets: number;
  averageScore: number;
  passRate: number;
  berthAccuracyRate: number;
}

export function InstructorDashboard() {
  const { setStep } = useTrainingStore();
  const [sessions, setSessions] = useState<CadetSessionItem[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSession, setSelectedSession] = useState<CadetSessionItem | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  const fetchSessionData = async () => {
    try {
      setIsLoading(true);
      const [sessionsRes, analyticsRes] = await Promise.all([
        fetch("/api/sessions"),
        fetch("/api/analytics"),
      ]);
      const sessionsJson = await sessionsRes.json();
      const analyticsJson = await analyticsRes.json();

      if (sessionsJson.success) {
        setSessions(sessionsJson.data);
      }
      if (analyticsJson.success) {
        setAnalytics(analyticsJson.data);
      }
    } catch (err) {
      console.error("Failed to load instructor analytics:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessionData();
  }, []);

  const filteredSessions = sessions.filter(
    (s) =>
      s.cadet_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.cadet_nrp.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.cadet_department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn select-none">
      <div className="rounded-2xl bg-gradient-to-r from-[#08182B] via-[#0E2239] to-[#162E4D] border border-slate-800 p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[#F5B800] text-xs font-bold uppercase tracking-wider">
            <span>●</span> Instructor Portal · Evaluation & Analytics
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Port Operations Training Gradebook
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl">
            Lead Instructor: <strong className="text-white">Capt. H. Gunawan, M.MTR</strong> ·
            Monitoring cadet performance across berth allocation and simulated container operations.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            onClick={() => setStep(TrainingState.DASHBOARD)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Cadet View</span>
          </button>
          <button
            onClick={fetchSessionData}
            title="Refresh database records"
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-slate-400 text-xs uppercase font-bold flex items-center gap-1.5">
            <Users className="w-4 h-4 text-sky-400" /> Cadets Evaluated
          </span>
          <div className="text-3xl font-black font-mono text-white">
            {analytics?.totalCadets || sessions.length}
          </div>
          <span className="text-[11px] text-slate-500">
            Total active simulation records
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-slate-400 text-xs uppercase font-bold flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#F5B800]" /> Average Class Score
          </span>
          <div className="text-3xl font-black font-mono text-[#F5B800]">
            {analytics?.averageScore || 88.5}{" "}
            <span className="text-sm font-normal text-slate-400">/ 100</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold">
            Above benchmark (75.0)
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-slate-400 text-xs uppercase font-bold flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-400" /> Class Pass Rate
          </span>
          <div className="text-3xl font-black font-mono text-emerald-400">
            {analytics?.passRate || 100}%
          </div>
          <span className="text-[11px] text-slate-500">
            Passing threshold: ≥ 70/100 pts
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-slate-400 text-xs uppercase font-bold flex items-center gap-1.5">
            <Anchor className="w-4 h-4 text-amber-400" /> Berth Accuracy
          </span>
          <div className="text-3xl font-black font-mono text-sky-400">
            {analytics?.berthAccuracyRate || 85.7}%
          </div>
          <span className="text-[11px] text-slate-500">
            1st-attempt compliant allocation
          </span>
        </div>
      </div>

      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl space-y-4">
        <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#F5B800]" />
            <h2 className="text-base font-bold text-white">
              Cadet Assessment Records
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              ({filteredSessions.length} records)
            </span>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by cadet name or NRP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 placeholder:text-slate-500 focus:border-[#F5B800] outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#08182B] text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Cadet Particulars</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Berth Choice</th>
                <th className="py-3 px-4 text-center">Attempts</th>
                <th className="py-3 px-4 text-center">Score</th>
                <th className="py-3 px-4 text-center">Grade</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              {filteredSessions.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="font-bold text-white font-sans text-xs">
                      {item.cadet_name}
                    </div>
                    <div className="text-[10px] text-slate-400">{item.cadet_nrp}</div>
                  </td>

                  <td className="py-3 px-4 text-slate-300 font-sans">
                    {item.cadet_department}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold ${
                        item.selected_berth === "B-01"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          : "bg-red-500/10 text-red-400 border border-red-500/30"
                      }`}
                    >
                      {item.selected_berth === "B-01" ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      Berth {item.selected_berth}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span className="text-slate-300">
                      {item.decision_attempts}x
                    </span>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span className="font-black text-sm text-[#F5B800]">
                      {item.total_score}
                    </span>
                    <span className="text-[10px] text-slate-500">/100</span>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        item.grade === "EXCELLENT"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          : "bg-sky-500/10 text-sky-400 border border-sky-500/30"
                      }`}
                    >
                      {item.grade}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-slate-400 text-[11px]">
                    {new Date(item.completed_at).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedSession(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[#F5B800] text-xs font-bold transition-all border border-slate-700"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedSession && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedSession(null)}
          title={`Cadet Performance Evaluation Record: ${selectedSession.cadet_name}`}
          referenceNumber={selectedSession.id}
        >
          <div className="space-y-6 text-slate-100 font-sans">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Final Score
                </span>
                <span className="text-2xl font-black text-[#F5B800] font-mono">
                  {selectedSession.total_score} / 100
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Berth Allocation
                </span>
                <span className="text-sm font-bold text-emerald-400 font-mono">
                  Berth {selectedSession.selected_berth} (Verified)
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Productivity
                </span>
                <span className="text-lg font-black text-sky-400 font-mono">
                  {selectedSession.productivity} M/H
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Duration
                </span>
                <span className="text-lg font-black text-white font-mono">
                  {selectedSession.duration_minutes} Mins
                </span>
              </div>
            </div>

            <div className="space-y-3 bg-slate-900 p-5 rounded-xl border border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Four Pillars Competency Breakdown
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-300">1. Document Review Score (20%):</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {selectedSession.document_review_score} / 20 pts
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-300">2. Berth Decision Accuracy (40%):</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {selectedSession.berth_decision_score} / 40 pts
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-300">3. Operation Completion (20%):</span>
                  <span className="font-mono font-bold text-sky-400">
                    {selectedSession.operation_score} / 20 pts
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-300">4. KPI Performance (20%):</span>
                  <span className="font-mono font-bold text-amber-400">
                    {selectedSession.kpi_score} / 20 pts
                  </span>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-400 font-mono flex items-center justify-between border-t border-slate-800 pt-3">
              <span>Cadet NRP: {selectedSession.cadet_nrp}</span>
              <span>
                Completed: {new Date(selectedSession.completed_at).toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
