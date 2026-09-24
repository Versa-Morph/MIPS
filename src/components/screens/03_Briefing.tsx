"use client";

import React from "react";
import {
  Ship,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  UserCheck,
  CheckCircle2,
  FileCheck,
  Radio,
  ShieldAlert,
  Volume2,
  Compass,
  Anchor,
  FileText,
} from "lucide-react";
import { useTrainingStore } from "@/store/useTrainingStore";
import { TrainingState } from "@/types/simulation";

export function BriefingScreen() {
  const { scenario, setStep } = useTrainingStore();
  const vessel = scenario.vessel;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 font-sans select-none">
      {/* Navigation Breadcrumbs */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep(TrainingState.SCENARIO_SELECTION)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-[#151821] border border-slate-200/80 dark:border-[#232734] hover:border-coral/50 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-coral dark:hover:text-coral transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Skenario</span>
        </button>

        <div className="hidden sm:flex items-center gap-2.5 font-mono text-xs text-slate-400">
          <span className="text-slate-400 dark:text-slate-500">STAGE</span>
          <span className="text-coral font-bold">02 / 07</span>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <span className="text-slate-600 dark:text-slate-300 font-semibold tracking-wider">
            EXECUTIVE BRIEFING & DIRECTIVES
          </span>
        </div>
      </div>

      {/* Main Mission Briefing Card */}
      <div className="rounded-2xl bg-white dark:bg-[#151821] border border-slate-200/80 dark:border-[#232734] shadow-card dark:shadow-card-dark overflow-hidden">
        {/* Phase Header */}
        <div className="relative border-b border-slate-200/80 dark:border-[#232734] p-6 sm:p-8 text-white overflow-hidden bg-slate-900">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coral/20 border border-coral/40 text-coral text-xs font-mono font-bold tracking-wider">
                <span className="w-2 h-2 rounded-full bg-coral animate-pulse" />
                <span>Phase 01: Mission Briefing & Directives</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-sans">
                Vessel Arrival Operational Order
              </h1>

              <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
                Target: <strong className="text-white font-semibold">{vessel.name}</strong> · ETA{" "}
                <span className="font-mono text-coral font-bold">{vessel.eta} WIB</span>{" "}
                · Port of MIPS Fairway
              </p>
            </div>

            <div className="px-4 py-2.5 rounded-2xl bg-slate-800/80 border border-slate-700 text-right self-start md:self-auto font-mono shadow-sm">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Assigned Role
              </div>
              <div className="text-xs font-bold text-coral">
                Cadet Port Operations Officer
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6 bg-white dark:bg-[#151821]">
          {/* Training Task Directives Card */}
          <div className="rounded-2xl bg-slate-50 dark:bg-[#1a1e29] border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-coral flex items-center gap-2 font-mono">
                <Ship className="w-4 h-4 text-coral" /> Operational Training Task
              </span>
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                SCN-001 DIRECTIVE
              </span>
            </div>

            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
              Sebuah kapal peti kemas bernama{" "}
              <strong className="text-slate-900 dark:text-white font-semibold">
                {vessel.name}
              </strong>{" "}
              dijadwalkan tiba di pelabuhan pada pukul{" "}
              <strong className="text-coral font-mono">{vessel.eta} WIB</strong>.
              Tugas Anda sebagai Taruna Operasional Pelabuhan adalah memeriksa
              seluruh dokumen kedatangan yang tersedia, menentukan dan memvalidasi
              alokasi dermaga (*berth assignment*) yang aman, serta memastikan
              kelancaran siklus pembongkaran muatan.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#151821] border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold mb-1">
                  1. Audit Berkas
                </div>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                  Periksa NOA, Manifes, & Bathymetry Dermaga.
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-[#151821] border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold mb-1">
                  2. Hitung UKC
                </div>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                  Sarat air + UKC 1.3 m terhadap kedalaman kolam.
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-[#151821] border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold mb-1">
                  3. Awasi Simulasi
                </div>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                  Otorisasi tali kepil & siklus twin quay crane.
                </div>
              </div>
            </div>
          </div>

          {/* Instructor Advisory Card (Capt. H. Gunawan) */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-[#1a1e29] border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-coral to-rose-400 p-[1.5px] shrink-0 shadow-sm">
              <div className="w-full h-full rounded-2xl bg-white dark:bg-[#161922] flex items-center justify-center font-bold text-sm text-slate-900 dark:text-white">
                HG
              </div>
            </div>

            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Capt. H. Gunawan
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    Senior Harbor Master & Chief Simulator Instructor
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60">
                  INSPECTOR ON DUTY
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1 italic">
                &ldquo;Perhatikan baik-baik sarat air buritan (*Aft Draft*) MV Nusantara saat tiba. Jangan sampai Anda menempatkan kapal di dermaga yang dangkal karena berisiko kandas (*grounding*). Utamakan keselamatan navigasi sebelum memulai simulasi!&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Action Bar Footer */}
        <div className="px-6 sm:px-8 py-4 bg-slate-50 dark:bg-[#11131a] border-t border-slate-200/80 dark:border-[#232734] flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep(TrainingState.SCENARIO_SELECTION)}
            className="px-4 py-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-semibold font-mono transition-colors"
          >
            Back to Scenario Overview
          </button>

          <button
            type="button"
            onClick={() => setStep(TrainingState.DOCUMENT_REVIEW)}
            className="cta-coral inline-flex items-center gap-2 px-7 py-3 rounded-full font-sans font-bold text-sm tracking-wide group shadow-coral"
          >
            <span>Review Documents</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
