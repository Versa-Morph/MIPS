"use client";

import React, { useState } from "react";
import {
  GraduationCap,
  Clock,
  Trophy,
  BarChart3,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  MapPin,
  Ship,
  Megaphone,
  Ticket,
  ChevronRight,
  Compass,
  FileText,
  User,
  HelpCircle,
  FolderOpen,
  CheckSquare,
  Award,
  Download,
  KeyRound,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { useTrainingStore } from "@/store/useTrainingStore";
import { TrainingState } from "@/types/simulation";
import { getAssetPath } from "@/utils/assetPath";
import { cn } from "@/utils/cn";

export function DashboardScreen() {
  const { setStep } = useTrainingStore();
  const [accessCode, setAccessCode] = useState("MIPS-BERTH-2048");

  const handleLaunchScenario = () => {
    setStep(TrainingState.SCENARIO_SELECTION);
  };

  const handleJoinSession = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(TrainingState.SCENARIO_SELECTION);
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 font-sans select-none animate-fadeIn">
      {/* Top Header Greeting & Date Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#0066FF] dark:text-[#38BDF8] uppercase tracking-wider font-mono">
              <span>MIPS TRAINING CENTER</span>
              <span>·</span>
              <span>Welcome, Cadet</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight font-sans mt-1">
              Good Morning, Cadet Andika
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Maritime VTS & Simulation Command Center · NIT. 202300123 / 2304057
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-500 dark:text-slate-400 bg-white dark:bg-[#0A1931] border border-slate-200 dark:border-[#1E3A5F] px-4 py-2 rounded-xl shadow-xs self-start sm:self-auto">
            <Calendar className="w-4 h-4 text-[#00A3E0]" />
            <span>Mon, 27 May 2024 · 09:24 AM (WIB)</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. Hero & Join Training Access Area (Slide 6 Key Visual Feature)          */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Hero Graphic Card (7 cols) */}
          <div className="lg:col-span-7 rounded-2xl bg-[#0B2546] text-white p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between min-h-[220px] shadow-card border border-slate-700/80">
            {/* Background Photographic Image Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
              <Image
                src={getAssetPath("/images/terminal-panorama.png")}
                alt="Terminal Backdrop"
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            <div className="relative z-10 space-y-2 max-w-xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00A3E0]/20 border border-[#00A3E0]/50 text-[#00A3E0] text-[11px] font-mono font-bold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ACCESS YOUR TRAINING SIMULATION</span>
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
                LEARN · SIMULATE · BUILD COMPETENCE FOR A SAFER PORT
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Integrated container berth allocation, under-keel clearance calculation, and Quay Crane dynamic dispatch according to STCW A-I/12.
              </p>
            </div>

            <div className="relative z-10 pt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={handleLaunchScenario}
                className="px-5 py-2.5 rounded-full bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Mulai Simulasi Mandiri</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Session Access Card (5 cols - Join Training / Exam from Slide 6) */}
          <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-[#0A1931] border border-slate-200/80 dark:border-[#1E3A5F] p-6 shadow-card flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-xs font-bold text-[#0066FF] dark:text-[#38BDF8] font-mono">
                  <Ticket className="w-4 h-4" />
                  <span>Join Training / Exam</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-bold">
                  ACTIVE SESSION
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Punya Kode Sesi dari Instruktur?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Masukkan kode akses 4-slot yang diberikan oleh Capt. Rahmat S. untuk langsung memulai skenario ujian.
              </p>
            </div>

            <form onSubmit={handleJoinSession} className="space-y-3 pt-3">
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                  placeholder="MIPS-XXXX-XXXX"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#081826] font-mono text-sm font-bold text-slate-900 dark:text-white tracking-widest focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-full bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-bold tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Join Session</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. 4 KPI Metrics Row (Exact Match to Slide 6)                             */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Certified Modules */}
          <div className="rounded-2xl bg-white dark:bg-[#0A1931] border border-slate-200/80 dark:border-[#1E3A5F] p-5 shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Certified Modules
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                4
              </span>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                +1 from last month
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              STCW Certified Modules
            </div>
          </div>

          {/* Card 2: In Progress */}
          <div className="rounded-2xl bg-white dark:bg-[#0A1931] border border-slate-200/80 dark:border-[#1E3A5F] p-5 shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                In Progress
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[#0066FF] dark:text-[#38BDF8] flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-[#0066FF] dark:text-[#38BDF8] font-mono">
                1
              </span>
              <span className="text-[11px] font-semibold text-slate-500 font-mono flex items-center gap-1">
                <span>Training Progress:</span>
                <span>1 / 3</span>
                <span>Completed</span>
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              SCN-001 (MV Nusantara)
            </div>
          </div>

          {/* Card 3: Average Score */}
          <div className="rounded-2xl bg-white dark:bg-[#0A1931] border border-slate-200/80 dark:border-[#1E3A5F] p-5 shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Average Score
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-[#F5B800] flex items-center justify-center">
                <Trophy className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-[#F5B800] font-mono">
                88
              </span>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                +6 from last month
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Passed Competency Standard
            </div>
          </div>

          {/* Card 4: Total Attempts */}
          <div className="rounded-2xl bg-white dark:bg-[#0A1931] border border-slate-200/80 dark:border-[#1E3A5F] p-5 shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Total Attempts
              </span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-500 flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                6
              </span>
              <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 font-mono">
                +2 from last month
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Evaluation Logbook History
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. Main 3-Column Operational Row (Slide 6 Tri-Card Layout)                */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Column 1: Current Training Card (5 cols) */}
          <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-[#0A1931] border border-slate-200/80 dark:border-[#1E3A5F] p-6 shadow-card flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#0066FF]" />
                  <span>Available Training</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/40 text-[#0066FF] dark:text-[#38BDF8] border border-blue-200 dark:border-blue-800">
                  Active Assignment
                </span>
              </div>

              {/* Vessel Image Backdrop Container */}
              <div className="relative h-40 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                <Image
                  src={getAssetPath("/images/vessel-hero.png")}
                  alt="Vessel Hero Backdrop"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-3 left-3 text-white">
                  <span className="text-[10px] uppercase font-mono font-bold text-[#38BDF8] block">
                    TARGET VESSEL
                  </span>
                  <span className="text-sm font-bold">MV Nusantara (LOA 280m)</span>
                </div>
              </div>

              <div className="space-y-1">
                <h3
                  onClick={handleLaunchScenario}
                  className="text-base font-bold text-slate-900 dark:text-white cursor-pointer hover:text-[#0066FF] transition-colors"
                >
                  Vessel Arrival & Berthing
                </h3>
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Container Vessel Arrival & Berthing Operation
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Navigasi alur barat Tanjung Priok, audit berkas Notice of Arrival, kalkulasi kedalaman Under Keel Clearance (UKC), dan supervisi crane bongkar muat.
                </p>
              </div>

              {/* Progress Bar (35%) */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500 dark:text-slate-400">Progress Latihan</span>
                  <span className="font-bold text-[#0066FF] dark:text-[#38BDF8]">35%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-[#0066FF] rounded-full w-[35%]" />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleLaunchScenario}
                className="flex-1 py-2.5 rounded-full bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Start Training</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setStep(TrainingState.SCENARIO_CATALOG)}
                className="px-4 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#102A45] hover:bg-slate-100 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
              >
                View Details
              </button>
            </div>

            {/* Additional Modules in Roster */}
            <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" />
                  <span>Cargo Handling</span>
                </span>
                <span className="font-mono text-[10px] text-slate-400">LOCKED</span>
              </div>
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" />
                  <span>Yard Operations</span>
                </span>
                <span className="font-mono text-[10px] text-slate-400">LOCKED</span>
              </div>
            </div>
          </div>

          {/* Column 2: Recent Activity Card (4 cols) */}
          <div className="lg:col-span-4 rounded-2xl bg-white dark:bg-[#0A1931] border border-slate-200/80 dark:border-[#1E3A5F] p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#00A3E0]" />
                <span>Recent Activity</span>
              </span>
              <button
                type="button"
                onClick={() => setStep(TrainingState.SCENARIO_CATALOG)}
                className="text-xs font-semibold text-[#0066FF] hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {/* Row 1 */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#102A45] border border-slate-100 dark:border-[#1E3A5F] space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                  <span>Container Berthing</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">92 / 100</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  <span>MV Nusantara (B-01)</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Passed</span>
                </div>
              </div>

              {/* Row 2 */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#102A45] border border-slate-100 dark:border-[#1E3A5F] space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                  <span>Bulk Carrier Trimming</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">88 / 100</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  <span>MV Samudera Indah</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Passed</span>
                </div>
              </div>

              {/* Row 3 */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#102A45] border border-slate-100 dark:border-[#1E3A5F] space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                  <span>Tanker Dangerous Cargo</span>
                  <span className="font-mono text-blue-500">In Progress</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  <span>MT Nusantara Chem</span>
                  <span className="text-blue-500 font-semibold">Stage 02</span>
                </div>
              </div>

              {/* Row 4 */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#102A45] border border-slate-100 dark:border-[#1E3A5F] space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                  <span>Ro-Ro Ramp Operations</span>
                  <span className="font-mono text-slate-400">Pending</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  <span>KMP Merak Express</span>
                  <span className="text-slate-400">Scheduled</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Competency Progress Card (3 cols) */}
          <div className="lg:col-span-3 rounded-2xl bg-white dark:bg-[#0A1931] border border-slate-200/80 dark:border-[#1E3A5F] p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-500" />
                <span>Competency Progress</span>
              </span>
            </div>

            <div className="space-y-4 pt-1">
              {/* Skill 1 */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">Vessel Operations</span>
                  <span className="font-mono font-bold text-[#0066FF] dark:text-[#38BDF8]">75%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-[#0066FF] rounded-full w-[75%]" />
                </div>
              </div>

              {/* Skill 2 */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">Berthing & Mooring</span>
                  <span className="font-mono font-bold text-emerald-500">60%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[60%]" />
                </div>
              </div>

              {/* Skill 3 */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">Cargo Operations</span>
                  <span className="font-mono font-bold text-amber-500">45%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full w-[45%]" />
                </div>
              </div>

              {/* Skill 4 */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">Container Yard Management</span>
                  <span className="font-mono font-bold text-purple-500">20%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full w-[20%]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 6. Instructor Announcement Card (Bottom Banner from Slide 6)              */}
        {/* ========================================================================= */}
        <div className="rounded-2xl bg-white dark:bg-[#0A1931] border border-slate-200/80 dark:border-[#1E3A5F] p-4 sm:p-5 shadow-card flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-[#102A45] border border-blue-200 dark:border-[#1E3A5F] text-[#0066FF] dark:text-[#38BDF8] flex items-center justify-center shrink-0">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Instructor Announcements</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-[#0066FF] dark:text-[#38BDF8]">
                  NEW
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Capt. Rahmat S. has assigned Scenario SCN-001 (MV Nusantara Arrival & Berthing). Make sure to audit the Notice of Arrival draft clearance before 12:00 WIB.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLaunchScenario}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#0066FF] hover:underline shrink-0 cursor-pointer"
          >
            <span>Buka Skenario</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
    </div>
  );
}
