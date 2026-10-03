"use client";

import React from "react";
import {
  Ship,
  ArrowRight,
  ArrowLeft,
  Anchor,
  FileText,
  Compass,
  CheckCircle2,
} from "lucide-react";
import { useTrainingStore } from "@/store/useTrainingStore";
import { TrainingState } from "@/types/simulation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function BriefingScreen() {
  const { scenario, setStep } = useTrainingStore();
  const vessel = scenario.vessel;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6 font-sans select-none animate-fadeIn">
      {/* Navigation Breadcrumbs */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setStep(TrainingState.SCENARIO_SELECTION)}
          className="rounded-full shadow-xs gap-2 font-semibold"
        >
          <ArrowLeft className="w-4 h-4 text-[#0066FF]" />
          <span>Kembali ke Skenario</span>
        </Button>

        <div className="flex items-center gap-2.5 font-mono text-xs text-slate-400">
          <span className="text-slate-400 dark:text-slate-500">STAGE</span>
          <span className="text-[#0066FF] dark:text-[#38BDF8] font-bold">02 / 07</span>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <span className="text-slate-600 dark:text-slate-300 font-semibold tracking-wider">
            EXECUTIVE BRIEFING & DIRECTIVES
          </span>
        </div>
      </div>

      {/* Main Mission Briefing Card */}
      <div className="rounded-2xl bg-white dark:bg-[#0A1931] border border-slate-200/80 dark:border-[#1E3A5F] shadow-card dark:shadow-card-dark overflow-hidden">
        {/* Phase Header */}
        <div className="relative border-b border-slate-200/80 dark:border-[#1E3A5F] p-6 sm:p-8 text-white overflow-hidden bg-[#0B2546]">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E1F5FE] border border-[#009FE3] text-[#0077A8] text-xs font-mono font-bold tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#009FE3] animate-pulse" />
                <span>Phase 01: LEARN · Mission Briefing & Directives</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-sans">
                Vessel Arrival Operational Order
              </h1>

              <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
                Target: <strong className="text-white font-semibold">{vessel.name}</strong> · ETA{" "}
                <span className="font-mono text-[#38BDF8] font-bold">{vessel.eta} WIB</span>{" "}
                · Port of Tanjung Priok Fairway
              </p>
            </div>

            <div className="px-4 py-2.5 rounded-2xl bg-[#0A1931] border border-slate-700 text-right self-start md:self-auto font-mono shadow-xs">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Assigned Role
              </div>
              <div className="text-xs font-bold text-[#00A3E0]">
                Cadet Port Operations Officer
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6 bg-white dark:bg-[#0A1931]">
          {/* Training Task Directives Card */}
          <div className="rounded-2xl bg-slate-50 dark:bg-[#102A45] border border-slate-200/80 dark:border-[#1E3A5F] p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0A2540] dark:text-white flex items-center gap-2 font-mono">
                <Ship className="w-4 h-4 text-[#0066FF]" /> Operational Training Task
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
              <strong className="text-[#0066FF] dark:text-[#38BDF8] font-mono">{vessel.eta} WIB</strong>.
              Tugas Anda sebagai Taruna Operasional Pelabuhan adalah memeriksa
              seluruh dokumen kedatangan yang tersedia, menentukan dan memvalidasi
              alokasi dermaga (*berth assignment*) yang aman, serta memastikan
              kelancaran siklus pembongkaran muatan.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#0A1931] border border-slate-200/80 dark:border-[#1E3A5F] shadow-xs">
                <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold mb-1">
                  1. Audit Berkas
                </div>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                  Periksa NOA, Manifes, & Bathymetry Dermaga.
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-[#0A1931] border border-slate-200/80 dark:border-[#1E3A5F] shadow-xs">
                <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold mb-1">
                  2. Hitung UKC
                </div>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                  Sarat air + UKC 1.3 m terhadap kedalaman kolam.
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-[#0A1931] border border-slate-200/80 dark:border-[#1E3A5F] shadow-xs">
                <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold mb-1">
                  3. Pantau Simulasi
                </div>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                  Awasi olah gerak kapal & produktivitas crane (BCH).
                </div>
              </div>
            </div>
          </div>

          {/* Instructor Advisory Directive */}
          <div className="rounded-2xl p-5 border border-slate-200/80 dark:border-[#1E3A5F] bg-slate-50 dark:bg-[#102A45] flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0A2540] dark:bg-[#0066FF] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm border border-slate-700/30">
              HG
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
                <Badge variant="outline" className="text-[10px] font-bold font-mono text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60 px-2.5 py-0.5">
                  INSPECTOR ON DUTY
                </Badge>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1 italic">
                &ldquo;Perhatikan baik-baik sarat air buritan (*Aft Draft*) MV Nusantara saat tiba. Jangan sampai Anda menempatkan kapal di dermaga yang dangkal karena berisiko kandas (*grounding*). Utamakan keselamatan navigasi sebelum memulai simulasi!&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Action Bar Footer */}
        <div className="px-6 sm:px-8 py-4 bg-slate-50 dark:bg-[#081826] border-t border-slate-200/80 dark:border-[#1E3A5F] flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStep(TrainingState.SCENARIO_SELECTION)}
            className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-semibold font-mono"
          >
            Back to Scenario Overview
          </Button>

          <Button
            variant="brand"
            size="lg"
            onClick={() => setStep(TrainingState.DOCUMENT_REVIEW)}
            className="px-8 font-bold shadow-md rounded-full"
          >
            <span>Review Documents</span>
            <ArrowRight className="w-4 h-4 ml-1 stroke-[2.5]" />
          </Button>
        </div>
      </div>
    </div>
  );
}
