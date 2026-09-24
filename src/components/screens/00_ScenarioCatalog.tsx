"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Ship,
  Search,
  CheckCircle2,
  Lock,
  Compass,
  MapPin,
  Calendar,
  Layers,
  Award,
  ShieldCheck,
  FileText,
  Filter,
  SlidersHorizontal,
  ChevronRight,
  Anchor,
  Clock,
  Sparkles,
} from "lucide-react";
import { useTrainingStore } from "@/store/useTrainingStore";
import { TrainingState } from "@/types/simulation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/cn";

export interface CatalogItem {
  id: string;
  code: string;
  title: string;
  category: "container" | "bulk" | "tanker" | "roro";
  categoryLabel: string;
  vesselName: string;
  vesselType: string;
  loa: string;
  draft: string;
  displacement: string;
  zone: string;
  difficulty: "Basic" | "Medium" | "Advanced";
  duration: string;
  cargo: string;
  status: "ACTIVE" | "AVAILABLE" | "LOCKED";
  statusLabel: string;
  instructor: string;
  description: string;
  stcwCode: string;
  passingScore: string;
}

export function ScenarioCatalogScreen() {
  const { setStep } = useTrainingStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  const catalogScenarios: CatalogItem[] = [
    {
      id: "SCN-001",
      code: "SCN-001",
      title: "Container Vessel Arrival & Berthing Operation",
      category: "container",
      categoryLabel: "Kapal Peti Kemas",
      vesselName: "MV Nusantara",
      vesselType: "Container Post-Panamax",
      loa: "280.0 m",
      draft: "10.20 m",
      displacement: "65,400 DWT",
      zone: "Alur Pelayaran Barat ke Dermaga B-01 Tanjung Priok",
      difficulty: "Medium",
      duration: "45 Menit",
      cargo: "50 ISO Containers (Reefer & Hazardous DG)",
      status: "ACTIVE",
      statusLabel: "AKTIF DITUGASKAN",
      instructor: "Capt. H. Gunawan, M.Mar",
      stcwCode: "STCW A-II/1 & A-II/2",
      passingScore: "≥ 80 / 100",
      description:
        "Pandu kapal kontainer MV Nusantara melintasi alur barat Tanjung Priok, lakukan audit dokumen NOA & manifest, kalkulasi Under Keel Clearance (UKC), dan sandarkan dengan aman di Dermaga B-01.",
    },
    {
      id: "SCN-002",
      code: "SCN-002",
      title: "Bulk Carrier Fairway Navigation & Port Departure",
      category: "bulk",
      categoryLabel: "Curah Kering (Bulk)",
      vesselName: "MV Samudera Indah",
      vesselType: "Bulk Carrier Handymax",
      loa: "225.0 m",
      draft: "9.50 m",
      displacement: "42,000 DWT",
      zone: "Dermaga Curah Kering ke Alur Bebas Laut Jawa",
      difficulty: "Basic",
      duration: "35 Menit",
      cargo: "35,000 MT Curah Kering (Batu Bara / Semen)",
      status: "AVAILABLE",
      statusLabel: "TERSEDIA",
      instructor: "Capt. H. Gunawan, M.Mar",
      stcwCode: "STCW A-II/1",
      passingScore: "≥ 75 / 100",
      description:
        "Skenario olah gerak kapal curah MV Samudera Indah mulai dari lepas tali sandar, pemanduan alur sempit dengan bantuan tugboat, hingga titik lepas pandu (Pilot Station).",
    },
    {
      id: "SCN-003",
      code: "SCN-003",
      title: "Dangerous Goods & Chemical Tanker Berthing",
      category: "tanker",
      categoryLabel: "Kapal Tangki Kimia",
      vesselName: "MT Nusantara Chemical",
      vesselType: "Chemical Tanker Class 1/2",
      loa: "185.0 m",
      draft: "8.20 m",
      displacement: "28,500 DWT",
      zone: "Terminal Khusus Bahan Berbahaya Priok",
      difficulty: "Advanced",
      duration: "60 Menit",
      cargo: "15,000 MT Muatan Kimia Cair Flammable",
      status: "LOCKED",
      statusLabel: "TERKUNCI",
      instructor: "Capt. H. Gunawan, M.Mar",
      stcwCode: "STCW A-V/1-1",
      passingScore: "≥ 85 / 100",
      description:
        "Prosedur khusus pemanduan kapal tangki kimia berbahaya, protokol isolasi dermaga, dan mitigasi tumpahan bahan cair kimia sesuai pedoman ISGOTT & SOLAS.",
    },
    {
      id: "SCN-004",
      code: "SCN-004",
      title: "Passenger Ro-Ro Ferry Heavy Weather Manoeuvring",
      category: "roro",
      categoryLabel: "Feri Ro-Ro Penumpang",
      vesselName: "KMP Merak Express",
      vesselType: "Ro-Ro Passenger Ferry",
      loa: "160.0 m",
      draft: "5.80 m",
      displacement: "12,000 DWT",
      zone: "Selat Sunda - Dermaga Eksekutif Bakauheni",
      difficulty: "Advanced",
      duration: "50 Menit",
      cargo: "850 Penumpang & 120 Unit Kendaraan Campuran",
      status: "LOCKED",
      statusLabel: "TERKUNCI",
      instructor: "Capt. H. Gunawan, M.Mar",
      stcwCode: "STCW A-V/2",
      passingScore: "≥ 85 / 100",
      description:
        "Manuver olah gerak feri penumpang dalam kondisi cuaca buruk (angin 35 knot), mitigasi arus silang dermaga, serta prosedur sandar cepat pada hidrolik ramp.",
    },
  ];

  // Filtered Scenarios
  const filteredScenarios = catalogScenarios.filter((sc) => {
    const matchesSearch =
      sc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sc.vesselName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sc.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sc.cargo.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || sc.category === selectedCategory;

    const matchesDifficulty =
      selectedDifficulty === "all" ||
      sc.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const handleSelectScenario = (scenarioId: string) => {
    // Both SCN-001 and SCN-002 can transition into simulation flow
    setStep(TrainingState.SCENARIO_SELECTION);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6 font-sans select-none animate-fadeIn">
      {/* ========================================================================= */}
      {/* 1. Header Navigation & Quick Actions                                      */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setStep(TrainingState.DASHBOARD)}
          className="rounded-full shadow-xs gap-2 font-semibold self-start sm:self-auto"
        >
          <ArrowLeft className="w-4 h-4 text-coral" />
          <span>Kembali ke Dashboard</span>
        </Button>

        <div className="flex items-center gap-3 text-xs font-mono text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-coral animate-pulse" />
            <span className="font-semibold text-slate-900 dark:text-white">
              PORTAL SIMULASI
            </span>
          </span>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <span>STCW A-I/12 ACCREDITED</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. Hero Header Banner & Simulator Stats                                   */}
      {/* ========================================================================= */}
      <div className="rounded-2xl bg-white dark:bg-[#14171f] border border-slate-200/80 dark:border-[#222634] p-6 sm:p-8 shadow-card dark:shadow-card-dark space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coral/10 border border-coral/30 text-coral text-xs font-mono font-bold tracking-wider">
              <Compass className="w-3.5 h-3.5" />
              <span>KATALOG SIMULASI MARITIM RESMI</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white font-sans">
              Pilih Skenario Pelatihan Port & Navigasi
            </h1>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Jelajahi berbagai skenario olah gerak kapal, audit dokumen pelabuhan, perhitungan
              kedalaman aman (UKC), dan pengawasan bongkar muat terminal peti kemas sebelum masuk ke
              simulator.
            </p>
          </div>

          {/* Quick Metrics Capsule */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#1a1e29] border border-slate-200/80 dark:border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Total Skenario
              </span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white block mt-0.5">
                4
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#1a1e29] border border-slate-200/80 dark:border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Operasional
              </span>
              <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 block mt-0.5">
                2
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#1a1e29] border border-slate-200/80 dark:border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Ditugaskan
              </span>
              <span className="text-xl font-extrabold text-coral block mt-0.5">
                1
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#1a1e29] border border-slate-200/80 dark:border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Standar Lulus
              </span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white block mt-0.5">
                ≥ 80%
              </span>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar Controls */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: "all", label: "Semua Skenario (4)" },
              { id: "container", label: "Peti Kemas (1)" },
              { id: "bulk", label: "Curah Kering (1)" },
              { id: "tanker", label: "Tangki Kimia (1)" },
              { id: "roro", label: "Ro-Ro Feri (1)" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer",
                  selectedCategory === tab.id
                    ? "bg-slate-900 text-white dark:bg-[#282f40] dark:text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1a1e29]"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input & Difficulty Selector */}
          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                type="text"
                placeholder="Cari kapal, dermaga, rute..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs rounded-full bg-slate-50 dark:bg-[#1a1e29] border-slate-200 dark:border-slate-800"
              />
            </div>

            {/* Difficulty Filter Chips */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-100 dark:bg-[#1a1e29] p-1 rounded-full border border-slate-200/80 dark:border-slate-800 text-xs">
              {["all", "basic", "medium", "advanced"].map((dif) => (
                <button
                  key={dif}
                  type="button"
                  onClick={() => setSelectedDifficulty(dif)}
                  className={cn(
                    "px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize transition-colors",
                    selectedDifficulty === dif
                      ? "bg-white text-slate-900 dark:bg-[#252a3a] dark:text-white shadow-xs font-bold"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  {dif === "all" ? "Semua" : dif}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. Scenario Cards Grid                                                    */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredScenarios.map((sc) => {
          const isAssigned = sc.status === "ACTIVE";
          const isAvailable = sc.status === "AVAILABLE";
          const isLocked = sc.status === "LOCKED";

          return (
            <div
              key={sc.id}
              className={cn(
                "rounded-2xl border transition-all flex flex-col justify-between p-5 sm:p-6 space-y-4 shadow-card dark:shadow-card-dark",
                isAssigned
                  ? "bg-white dark:bg-[#14171f] border-coral/50 ring-2 ring-coral/20"
                  : isAvailable
                  ? "bg-white dark:bg-[#14171f] border-slate-200/80 dark:border-[#222634] hover:border-slate-300 dark:hover:border-slate-700"
                  : "bg-slate-50/70 dark:bg-[#14171f]/50 border-slate-200/60 dark:border-slate-800/80 opacity-70"
              )}
            >
              {/* Card Top Row: Code, Category, Status Badge */}
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-coral bg-coral/10 px-2 py-0.5 rounded-full border border-coral/25">
                    {sc.code}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {sc.categoryLabel}
                  </span>
                </div>

                <Badge
                  variant={isAssigned ? "coral" : isAvailable ? "success" : "neutral"}
                  size="sm"
                >
                  {sc.statusLabel}
                </Badge>
              </div>

              {/* Title & Vessel Particulars */}
              <div className="space-y-3">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                  {sc.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                  {sc.description}
                </p>

                {/* Vessel Technical Specs Matrix */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#1a1e29] border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                      <Ship className="w-4 h-4 text-coral shrink-0" />
                      <span>{sc.vesselName}</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      {sc.vesselType}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                    <div>
                      <span className="text-[10px] text-slate-400 block">LOA</span>
                      <strong className="text-slate-900 dark:text-white">{sc.loa}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Draft Max</span>
                      <strong className="text-coral">{sc.draft}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Displacement</span>
                      <strong className="text-slate-900 dark:text-white">{sc.displacement}</strong>
                    </div>
                  </div>
                </div>

                {/* Location & Cargo Meta */}
                <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{sc.zone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{sc.cargo}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer: Metadata & Action CTA */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-xs font-mono text-slate-500 dark:text-slate-400">
                  <span>{sc.difficulty}</span>
                  <span>·</span>
                  <span>{sc.duration}</span>
                  <span>·</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    {sc.passingScore}
                  </span>
                </div>

                {isLocked ? (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                    className="rounded-full gap-1.5 text-xs opacity-60 cursor-not-allowed"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Terkunci</span>
                  </Button>
                ) : (
                  <Button
                    variant={isAssigned ? "coral" : "outline"}
                    size="sm"
                    onClick={() => handleSelectScenario(sc.id)}
                    className={cn(
                      "rounded-full gap-2 font-bold px-5 text-xs shadow-xs",
                      isAssigned && "shadow-coral"
                    )}
                  >
                    <span>Mulai Simulasi</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 4. Pedagogical Simulation Lifecycle Infographic Banner                    */}
      {/* ========================================================================= */}
      <div className="rounded-2xl bg-white dark:bg-[#14171f] border border-slate-200/80 dark:border-[#222634] p-5 sm:p-6 shadow-card dark:shadow-card-dark space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-coral" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-sans">
              Alur Proses Pembelajaran & Sertifikasi Simulator
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">5 TAHAPAN EVALUASI</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#1a1e29] border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="font-mono text-[10px] font-bold text-coral block">01 · BRIEFING</span>
            <strong className="text-slate-900 dark:text-white block font-semibold">
              Instruksi Instruktur
            </strong>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Penerimaan perintah tugas kapal, waktu kedatangan (ETA), dan standar kelulusan.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#1a1e29] border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="font-mono text-[10px] font-bold text-coral block">02 · DOCUMENTS</span>
            <strong className="text-slate-900 dark:text-white block font-semibold">
              Audit Berkas Kapal
            </strong>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Verifikasi Notice of Arrival (NOA), data draft, manifes muatan, dan bathymetri kolam.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#1a1e29] border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="font-mono text-[10px] font-bold text-coral block">03 · DECISION</span>
            <strong className="text-slate-900 dark:text-white block font-semibold">
              Alokasi Dermaga (UKC)
            </strong>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Kalkulasi sarat air aman (+1.3 m) dan penentuan dermaga B-01 vs B-02 bebas kandas.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#1a1e29] border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="font-mono text-[10px] font-bold text-coral block">04 · SIMULATION</span>
            <strong className="text-slate-900 dark:text-white block font-semibold">
              Olah Gerak & Terminal
            </strong>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Otorisasi mooring tali kepil, kendali radar VTS, dan siklus twin quay crane.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#1a1e29] border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="font-mono text-[10px] font-bold text-coral block">05 · ASSESSMENT</span>
            <strong className="text-slate-900 dark:text-white block font-semibold">
              Sertifikat STCW
            </strong>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Evaluasi 4 pilar kompetensi, umpan balik instruktur, dan penerbitan skor kelulusan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
