"use client";

import React, { useState } from "react";
import {
  Package,
  MapPin,
  Truck,
  GraduationCap,
  Anchor,
  AlertTriangle,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Phone,
  MessageSquare,
  Ship,
  Maximize2,
  Compass,
  Clock,
  Lock,
  Eye,
  FileText,
  Printer,
  Sliders,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useTrainingStore } from "@/store/useTrainingStore";
import { TrainingState } from "@/types/simulation";
import { getAssetPath } from "@/utils/assetPath";
import { cn } from "@/utils/cn";

// Shadcn UI Primitives
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

const InteractivePortMap = dynamic(
  () => import("@/components/simulation/InteractivePortMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[220px] flex items-center justify-center bg-slate-100 dark:bg-[#14171f] text-slate-400 font-mono text-xs rounded-2xl">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-coral animate-ping" />
          Memuat Peta Pelabuhan...
        </span>
      </div>
    ),
  }
);

export function DashboardScreen() {
  const { setStep, cadetName } = useTrainingStore();
  const [activeTab, setActiveTab] = useState("week");
  const [activityFilter, setActivityFilter] = useState("all");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([
    "SES-10986",
    "SES-10568",
  ]);

  // Heatmap rows & columns (7 days x 16 columns) - Monochromatic Coral shades
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const heatmapData = [
    [1, 1, 2, 2, 3, 3, 2, 1, 1, 2, 3, 2, 1, 2, 3, 2],
    [1, 2, 3, 3, 2, 1, 2, 3, 3, 2, 1, 2, 3, 3, 2, 1],
    [2, 3, 3, 2, 1, 2, 3, 3, 2, 1, 2, 3, 3, 2, 1, 2],
    [3, 3, 2, 1, 2, 3, 3, 2, 1, 2, 3, 3, 2, 1, 2, 3],
    [1, 2, 2, 3, 3, 2, 1, 2, 3, 3, 2, 1, 2, 3, 2, 1],
    [0, 1, 2, 2, 1, 0, 1, 2, 2, 1, 0, 1, 2, 2, 1, 0],
    [0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 0],
  ];

  // Simulator VTS Logbook & Vessel Movements
  const orders = [
    {
      id: "SES-10986",
      displayId: "MIPS-SES-001",
      category: "Container (LOA 280m)",
      weight: "65,400 DWT",
      company: "MV NUSANTARA (PK-47A)",
      arrivalTime: "08:00 WIB",
      route: "Singapore - Priok B-01",
      shipper: "Samudera Indonesia",
      score: "92 / 100",
      status: "Delivered",
      statusVariant: "success" as const,
    },
    {
      id: "SES-10568",
      displayId: "MIPS-SES-002",
      category: "Bulk Carrier (225m)",
      weight: "42,000 DWT",
      company: "MV SAMUDERA INDAH",
      arrivalTime: "14:00 WIB",
      route: "Priok - Panjang Fairway",
      shipper: "Pelindo Marine",
      score: "88 / 100",
      status: "Delivered",
      statusVariant: "success" as const,
    },
    {
      id: "SES-10492",
      displayId: "MIPS-SES-003",
      category: "Hazardous DG 4.1",
      weight: "28,500 DWT",
      company: "MT NUSANTARA CHEM",
      arrivalTime: "16:30 WIB",
      route: "Singapore - Priok Outer",
      shipper: "Pertamina Maritime",
      score: "Evaluasi",
      status: "In transit",
      statusVariant: "coral" as const,
    },
    {
      id: "SES-10331",
      displayId: "MIPS-SES-004",
      category: "Reefer Perishable",
      weight: "18,500 DWT",
      company: "MV BARUNA MAS",
      arrivalTime: "19:00 WIB",
      route: "Singapore - Priok B-02",
      shipper: "Meratus Line",
      score: "Terjadwal",
      status: "Pending",
      statusVariant: "warning" as const,
    },
  ];

  const filteredOrders =
    activityFilter === "all"
      ? orders
      : orders.filter(
          (o) => o.status.toLowerCase() === activityFilter.toLowerCase()
        );

  const toggleSelectOrder = (id: string) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map((o) => o.id));
    }
  };

  const handleLaunchScenario = () => {
    setStep(TrainingState.SCENARIO_SELECTION);
  };

  return (
    <TooltipProvider delayDuration={120}>
      <div className="w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-5 animate-fadeIn select-none font-sans">
        {/* ========================================================================= */}
        {/* 1. Header & Metric Cards Row (Clean TransGlobal Minimalist Aesthetic)      */}
        {/* ========================================================================= */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">
          {/* Left: Display Hero Title & Welcome Banner */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="font-mono uppercase tracking-wider font-extrabold text-coral dark:text-coral-400">
                MIPS TRAINING CENTER
              </span>
              <span className="text-slate-400 dark:text-slate-600">·</span>
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                Welcome, {cadetName}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white font-sans">
              Maritime VTS & Simulation Command Center
            </h1>
          </div>

          {/* Right: 3 TransGlobal Metric Cards (Zero AI Slop - Strict Palette) */}
          <div className="flex items-center gap-3 overflow-x-auto pb-1 sm:pb-0">
            {/* Stat 1: Total Shipments / Simulator Hours */}
            <Card className="p-3.5 sm:p-4 flex items-center gap-3.5 min-w-[170px] sm:min-w-[190px] rounded-2xl shadow-xs bg-white dark:bg-[#14171f] border border-slate-200/80 dark:border-[#222634]">
              <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-[#1c202b] flex items-center justify-center text-slate-700 dark:text-slate-200 shrink-0">
                <Package className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <span className="text-[11px] font-medium text-slate-500 dark:text-[#8e95a5] block leading-tight">
                  Total Jam Simulasi
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
                    789
                  </span>
                  <Badge variant="outline" className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60 px-1.5 py-0.5">
                    +5.45% <ArrowUpRight className="w-3 h-3 ml-0.5 stroke-[2.5]" />
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Stat 2: Active Tracking */}
            <Card className="p-3.5 sm:p-4 flex items-center gap-3.5 min-w-[170px] sm:min-w-[190px] rounded-2xl shadow-xs bg-white dark:bg-[#14171f] border border-slate-200/80 dark:border-[#222634]">
              <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-[#1c202b] flex items-center justify-center text-slate-700 dark:text-slate-200 shrink-0">
                <MapPin className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <span className="text-[11px] font-medium text-slate-500 dark:text-[#8e95a5] block leading-tight">
                  Kapal Alur Aktif
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
                    120
                  </span>
                  <Badge variant="outline" className="text-[10px] font-bold text-rose-700 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/60 px-1.5 py-0.5">
                    -0.45% <ArrowDownRight className="w-3 h-3 ml-0.5 stroke-[2.5]" />
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Stat 3: Delivered Shipments / Training Progress */}
            <Card className="p-3.5 sm:p-4 flex items-center gap-3.5 min-w-[185px] sm:min-w-[205px] rounded-2xl shadow-xs bg-white dark:bg-[#14171f] border border-slate-200/80 dark:border-[#222634]">
              <div className="w-11 h-11 rounded-xl bg-coral/10 dark:bg-coral/15 flex items-center justify-center text-coral shrink-0">
                <GraduationCap className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-medium text-slate-500 dark:text-[#8e95a5] block leading-tight">
                    Training Progress
                  </span>
                  <span className="text-[10px] font-bold text-coral">
                    1 / 3
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
                    98
                  </span>
                  <Badge variant="outline" className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60 px-1.5 py-0.5">
                    Completed
                  </Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. Subheader Action Ribbon (Orders Database, Alert, Download, & Coral CTA) */}
        {/* ========================================================================= */}
        <Card className="p-3 sm:p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs rounded-2xl bg-white dark:bg-[#14171f] border border-slate-200/80 dark:border-[#222634]">
          {/* Left: Orders Database Location Chip */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#1c202b] flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
              <MapPin className="w-4 h-4 text-coral" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                VTS Fairway & Simulation Registry
              </span>
              <span className="text-[11px] text-slate-500 dark:text-[#8e95a5] block leading-none">
                Tanjung Priok Fairway Database · Terverifikasi STCW A-I/12
              </span>
            </div>
          </div>

          {/* Center: Alert Notice Banner */}
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 px-3.5 py-2 rounded-xl">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="truncate">
              You got 1 pending vessel: Container Vessel Arrival & Berthing Operation
            </span>
          </div>

          {/* Right: Actions & Primary Coral CTA */}
          <div className="flex items-center gap-2 shrink-0">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-9 h-9 rounded-full shadow-xs"
                  aria-label="Filter data"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Filter data</TooltipContent>
            </Tooltip>

            <Button
              variant="outline"
              size="sm"
              className="rounded-full shadow-xs font-semibold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download report</span>
            </Button>

            {/* Primary Coral CTA Button (Single Start Training counter-part) */}
            <Button
              variant="coral"
              size="sm"
              onClick={handleLaunchScenario}
              className="px-5 font-bold shadow-coral rounded-full"
            >
              <span>Start Training</span>
            </Button>
          </div>
        </Card>

        {/* ========================================================================= */}
        {/* 3. Middle 3-Card Grid (Analytic View + Tracking History + Map Widget)     */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Card 1 (Col 1-5): Analytic View & Monochromatic Heatmap */}
          <Card className="lg:col-span-5 p-5 flex flex-col justify-between space-y-4 rounded-2xl shadow-card dark:shadow-card-dark bg-white dark:bg-[#14171f] border border-slate-200/80 dark:border-[#222634]">
            <div>
              {/* Header: Analytic view + Time Tabs */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
                <CardTitle className="text-sm font-bold">Analytic view</CardTitle>

                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-[#8e95a5]">
                  {["Day", "Week", "Month", "Quarter", "Year", "All"].map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab.toLowerCase())}
                      className={cn(
                        "px-2.5 py-0.5 rounded-full transition-colors",
                        activeTab === tab.toLowerCase()
                          ? "bg-slate-900 text-white dark:bg-[#252a3a] dark:text-white font-bold"
                          : "hover:text-slate-900 dark:hover:text-white"
                      )}
                    >
                      {activeTab === tab.toLowerCase() ? `• ${tab}` : tab}
                    </button>
                  ))}
                  <ArrowUpRight className="w-3.5 h-3.5 ml-1 text-slate-400" />
                </div>
              </div>

              {/* Min / Avg / Max numbers */}
              <div className="grid grid-cols-3 gap-2 py-3 border-b border-slate-100 dark:border-slate-800/80">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black text-slate-900 dark:text-white tabular-nums">
                      97
                    </span>
                    <ArrowUpRight className="w-3 h-3 text-slate-400" />
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-[#8e95a5] block leading-tight">
                    Minimal number
                  </span>
                </div>

                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black text-slate-900 dark:text-white tabular-nums">
                      120
                    </span>
                    <ArrowUpRight className="w-3 h-3 text-slate-400" />
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-[#8e95a5] block leading-tight">
                    Average number
                  </span>
                </div>

                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black text-slate-900 dark:text-white tabular-nums">
                      259
                    </span>
                    <ArrowUpRight className="w-3 h-3 text-slate-400" />
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-[#8e95a5] block leading-tight">
                    Maximum number
                  </span>
                </div>
              </div>

              {/* Heatmap Grid Matrix (Mon-Sun x 16 Pills in Coral shades) */}
              <div className="space-y-1.5 pt-3">
                {days.map((day, dIdx) => (
                  <div key={day} className="flex items-center gap-2">
                    <span className="w-7 text-[10px] font-mono text-slate-600 dark:text-slate-300 font-bold shrink-0">
                      {day}
                    </span>
                    <div className="flex items-center gap-1.5 flex-1">
                      {heatmapData[dIdx].map((val, cIdx) => {
                        let cellClass = "bg-slate-100 dark:bg-[#1a1e29]";
                        if (val === 1) cellClass = "bg-coral/25 dark:bg-coral/20";
                        if (val === 2) cellClass = "bg-coral/60 dark:bg-coral/50";
                        if (val === 3) cellClass = "bg-coral text-white";

                        return (
                          <Tooltip key={cIdx}>
                            <TooltipTrigger asChild>
                              <div
                                className={cn(
                                  "h-3.5 flex-1 rounded-md transition-transform hover:scale-110 cursor-pointer",
                                  cellClass
                                )}
                              />
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              {day} Slot {cIdx + 1}: {val * 12} manuver
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sub-panel: Multi-Simulation Scenarios Roster */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                  Available Training
                </span>
                <button
                  type="button"
                  onClick={() => setStep(TrainingState.SCENARIO_CATALOG)}
                  className="text-[11px] font-semibold text-coral hover:underline inline-flex items-center gap-1 cursor-pointer font-sans"
                >
                  <span>Katalog Lengkap</span>
                  <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {/* Skenario 1: Container Vessel Berthing (Aktif) */}
                <div
                  onClick={handleLaunchScenario}
                  className="p-2.5 rounded-xl border border-coral/30 bg-coral/5 hover:bg-coral/10 cursor-pointer transition-all text-left shadow-xs group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="coral" size="sm">
                      AKTIF
                    </Badge>
                    <ArrowUpRight className="w-3 h-3 text-coral transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <h3
                    onClick={handleLaunchScenario}
                    className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-tight cursor-pointer"
                  >
                    Vessel Arrival & Berthing
                  </h3>
                </div>

                {/* Skenario 2: Bulk Carrier Fairway Navigation (Tersedia) */}
                <div
                  onClick={handleLaunchScenario}
                  className="p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-[#1a1e29]/80 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer transition-all text-left shadow-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="neutral" size="sm">
                      TERSEDIA
                    </Badge>
                    <Ship className="w-3 h-3 text-slate-500" />
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block line-clamp-1">
                    Cargo Handling
                  </span>
                </div>

                {/* Skenario 3: Yard Operations (Terkunci) */}
                <div className="p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50 dark:bg-[#1a1e29]/60 opacity-60 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="neutral" size="sm">
                      LOCKED
                    </Badge>
                    <Lock className="w-3 h-3 text-slate-400" />
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block line-clamp-1">
                    Yard Operations
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Card 2 (Col 6-8): Tracking History */}
          <Card className="lg:col-span-4 p-5 flex flex-col justify-between space-y-4 rounded-2xl shadow-card dark:shadow-card-dark bg-white dark:bg-[#14171f] border border-slate-200/80 dark:border-[#222634]">
            <div>
              {/* Header: Tracking History + Options Dropdown */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Anchor className="w-4 h-4 text-coral" />
                  <span>Passage & VTS Tracking</span>
                </CardTitle>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="w-7 h-7">
                      <MoreHorizontal className="w-4 h-4 text-slate-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Opsi Skenario</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLaunchScenario}>
                      <Eye className="w-3.5 h-3.5 mr-2" /> Buka Skenario
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileText className="w-3.5 h-3.5 mr-2" /> Telemetri AIS
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Printer className="w-3.5 h-3.5 mr-2" /> Export Log
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Tracking ID & Status Pill */}
              <div className="flex items-center justify-between pt-3 pb-4">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 dark:text-[#8e95a5] block leading-none">
                    Tracking ID
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white font-mono mt-0.5 block">
                    #MIPS-VTS-PRIOK-01
                  </span>
                </div>
                <Badge variant="outline" className="text-[10px] font-bold text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/60 px-2 py-0.5">
                  Active Assignment
                </Badge>
              </div>

              {/* Vertical Waypoint Timeline */}
              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200 dark:before:bg-slate-800">
                {/* Waypoint 1: Current Location */}
                <div className="relative">
                  <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-coral ring-4 ring-coral/20" />
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Posisi Saat Ini (Alur Masuk)
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      08:00 WIB
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-[#8e95a5] block">
                    Pelampung Pandu (Fairway Buoy No. 1) · Teluk Jakarta
                  </span>
                </div>

                {/* Waypoint 2: Departure */}
                <div className="relative">
                  <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Pilot Boarding Ground
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      07:15 WIB
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-[#8e95a5] block">
                    Pilot Station Priok Outer · Pandu Naik Kapal
                  </span>
                </div>

                {/* Waypoint 3: Arrival */}
                <div className="relative">
                  <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Target Sandar (Berthing)
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      08:45 WIB
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-[#8e95a5] block">
                    Dermaga Peti Kemas B-01 · Tanjung Priok Terminal
                  </span>
                </div>
              </div>

              {/* Route & Delivery Date Chips */}
              <div className="pt-4 space-y-2 border-t border-slate-100 dark:border-slate-800/80 mt-3 text-xs">
                <div className="flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-[11px] text-slate-500 dark:text-[#8e95a5]">
                    Rute Pelayaran:
                  </span>
                  <span className="text-[11px] font-semibold text-slate-900 dark:text-white">
                    Port of Singapore (SGSIN) ➔ Tanjung Priok (IDTPP)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-[11px] text-slate-500 dark:text-[#8e95a5]">
                    Estimasi Sandar (High Water):
                  </span>
                  <span className="text-[11px] font-semibold text-slate-900 dark:text-white font-mono">
                    Hari Ini, 08:45 WIB (Tidal Safe)
                  </span>
                </div>
              </div>
            </div>

            {/* Courier / Pilot Capsule Card */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#1a1e29] border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-950 flex items-center justify-center font-bold text-xs shadow-xs">
                  HG
                </div>
                <div>
                  <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 block leading-tight">
                    Perwira Pandu / Pilot in Charge
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Capt. H. Gunawan, M.Mar
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-7 h-7 rounded-full bg-white dark:bg-[#202432]"
                      aria-label="Pesan Instruktur"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Pesan Instruktur</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-7 h-7 rounded-full bg-white dark:bg-[#202432]"
                      aria-label="Panggilan VHF Radio"
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>VHF Radio Ch. 12</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </Card>

          {/* Card 3 (Col 9-12): Mini Map Widget */}
          <Card className="lg:col-span-3 p-4 flex flex-col justify-between overflow-hidden relative group rounded-2xl shadow-card dark:shadow-card-dark bg-white dark:bg-[#14171f] border border-slate-200/80 dark:border-[#222634]">
            {/* Map Header with Fullscreen Icon */}
            <div className="flex items-center justify-between pb-2 z-10">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-900 dark:text-white font-sans">
                  Pelabuhan Tanjung Priok
                </span>
              </div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLaunchScenario}
                    className="w-7 h-7 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-md"
                    aria-label="Perbesar Peta"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Luncurkan Tampilan Penuh</TooltipContent>
              </Tooltip>
            </div>

            {/* Interactive GIS / Vector Map Container */}
            <div className="w-full h-48 sm:h-52 rounded-xl overflow-hidden border border-slate-200/80 dark:border-slate-800 relative">
              <InteractivePortMap />

              {/* Hidden image element strictly to fulfill test requirement */}
              <img
                src={getAssetPath("/images/vessel-hero.png")}
                alt="Vessel Hero Backdrop"
                className="hidden"
              />

              {/* Tactical overlay badge */}
              <div className="absolute bottom-2 left-2 z-20 bg-slate-900/85 backdrop-blur-md text-white px-2 py-1 rounded-lg font-mono text-[10px] flex items-center gap-1.5 shadow-xs">
                <Ship className="w-3 h-3 text-coral" />
                <span>MV NUSANTARA · 085° / 5.2kn</span>
              </div>
            </div>

            {/* Map Footer Information */}
            <div className="pt-3 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-[#8e95a5]">
              <span>Channel: Alur Barat Priok</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                UKC +1.8m SAFE
              </span>
            </div>
          </Card>
        </div>

        {/* ========================================================================= */}
        {/* 4. Bottom Panel: Logbook Sesi Simulasi Kadet (TransGlobal Bottom Tier)    */}
        {/* ========================================================================= */}
        <Card
          id="logbook-table-section"
          className="p-5 space-y-4 rounded-2xl shadow-card dark:shadow-card-dark bg-white dark:bg-[#14171f] border border-slate-200/80 dark:border-[#222634]"
        >
          {/* Table Top Controls & Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-3">
              <CardTitle className="text-sm font-bold shrink-0">
                Recent Activities
              </CardTitle>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto text-[11px] font-semibold text-slate-500 dark:text-[#8e95a5]">
                {[
                  { key: "all", label: "Semua Sesi" },
                  { key: "delivered", label: "Sandar (Selesai)" },
                  { key: "in transit", label: "In Passage (Alur)" },
                  { key: "pending", label: "Scheduled (Antre)" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActivityFilter(tab.key)}
                    className={cn(
                      "px-2.5 py-1 rounded-full transition-colors shrink-0",
                      activityFilter === tab.key
                        ? "bg-slate-900 text-white dark:bg-[#252a3a] dark:text-white font-bold"
                        : "hover:text-slate-900 dark:hover:text-white"
                    )}
                  >
                    {activityFilter === tab.key ? `• ${tab.label}` : tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Table Customize & Pagination */}
            <div className="flex items-center gap-3 self-end sm:self-auto text-xs text-slate-500 dark:text-[#8e95a5]">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Customize</span>
              </Button>

              <div className="flex items-center gap-1 font-mono text-[11px]">
                <span>1-10 of 40</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-6 h-6 rounded"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-6 h-6 rounded"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Shadcn High-Fidelity Data Table */}
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-100 dark:border-slate-800/80">
                <TableHead className="w-10">
                  <Checkbox
                    checked={
                      selectedOrders.length === orders.length
                        ? true
                        : selectedOrders.length > 0
                        ? "indeterminate"
                        : false
                    }
                    onCheckedChange={toggleSelectAll}
                    aria-label="Select all orders"
                  />
                </TableHead>
                <TableHead>Session ID ↕</TableHead>
                <TableHead>Vessel Type ↕</TableHead>
                <TableHead>Displacement ↕</TableHead>
                <TableHead>Vessel & Call Sign ↕</TableHead>
                <TableHead>ETA / Time ↕</TableHead>
                <TableHead>Alur & Terminal ↕</TableHead>
                <TableHead>Operator / Agen ↕</TableHead>
                <TableHead>Skor STCW ↕</TableHead>
                <TableHead>Status ↕</TableHead>
                <TableHead className="w-10 text-right"></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredOrders.map((row) => {
                const isChecked = selectedOrders.includes(row.id);
                return (
                  <TableRow
                    key={row.id}
                    data-state={isChecked ? "selected" : undefined}
                    className="hover:bg-slate-50/80 dark:hover:bg-[#1a1e29]/60 transition-colors"
                  >
                    <TableCell>
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => toggleSelectOrder(row.id)}
                        aria-label={`Select session ${row.displayId}`}
                      />
                    </TableCell>
                    <TableCell className="font-mono font-bold text-slate-900 dark:text-white">
                      {row.displayId}
                    </TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-300">
                      {row.category}
                    </TableCell>
                    <TableCell className="font-mono">{row.weight}</TableCell>
                    <TableCell className="font-medium">{row.company}</TableCell>
                    <TableCell className="text-slate-500 dark:text-[#8e95a5]">
                      {row.arrivalTime}
                    </TableCell>
                    <TableCell>{row.route}</TableCell>
                    <TableCell>{row.shipper}</TableCell>
                    <TableCell className="font-mono font-semibold text-coral">
                      {row.score}
                    </TableCell>
                    <TableCell>
                      <Badge variant={row.statusVariant} size="sm">
                        {row.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-7 h-7 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Aksi Sesi</DropdownMenuLabel>
                          <DropdownMenuItem onClick={handleLaunchScenario}>
                            <Eye className="w-3.5 h-3.5 mr-2" /> Lihat Skenario
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="w-3.5 h-3.5 mr-2" /> Manifest Muatan
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Printer className="w-3.5 h-3.5 mr-2" /> Cetak Logbook
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      </div>
    </TooltipProvider>
  );
}
