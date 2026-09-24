"use client";

import React, { useState } from "react";
import {
  Package,
  MapPin,
  Truck,
  AlertTriangle,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Phone,
  MessageSquare,
  CheckCircle2,
  Anchor,
  Ship,
  Maximize2,
  Compass,
  Clock,
  Sparkles,
  Lock,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useTrainingStore } from "@/store/useTrainingStore";
import { TrainingState } from "@/types/simulation";
import { getAssetPath } from "@/utils/assetPath";
import { cn } from "@/utils/cn";

const InteractivePortMap = dynamic(
  () => import("@/components/simulation/InteractivePortMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[220px] flex items-center justify-center bg-slate-100 dark:bg-[#161922] text-slate-400 font-mono text-xs rounded-2xl">
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
    "ORD-10986",
    "ORD-10568",
  ]);

  // Heatmap rows & columns (7 days x 16 columns)
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

  // Table records matching the reference image style
  const orders = [
    {
      id: "ORD-10986",
      displayId: "#10986-08-77bug",
      category: "Electronic",
      weight: "2.600 t",
      company: "Generic SO",
      arrivalTime: "6th July, 2026",
      route: "London - Prague",
      shipper: "DHL",
      price: "$5,678.00",
      status: "Delivered",
    },
    {
      id: "ORD-10568",
      displayId: "#10568-12-873fg",
      category: "Building materials",
      weight: "8.568 t",
      company: "Abuilding CO",
      arrivalTime: "2th July, 2026",
      route: "Berlin - Poznan",
      shipper: "Amazon",
      price: "$12,500.00",
      status: "Delivered",
    },
    {
      id: "ORD-10492",
      displayId: "#10492-44-991al",
      category: "Hazardous DG 4.1",
      weight: "14.200 t",
      company: "Indo Chemical",
      arrivalTime: "14th Oct, 2026",
      route: "Singapore - Priok",
      shipper: "Samudera",
      price: "$8,920.00",
      status: "In transit",
    },
    {
      id: "ORD-10331",
      displayId: "#10331-18-402ms",
      category: "Reefer Perishable",
      weight: "18.500 t",
      company: "King Ocean Line",
      arrivalTime: "14th Oct, 2026",
      route: "Singapore - Priok",
      shipper: "Maersk",
      price: "$14,350.00",
      status: "Pending",
    },
  ];

  const toggleSelectOrder = (id: string) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleLaunchScenario = () => {
    setStep(TrainingState.SCENARIO_SELECTION);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-5 animate-fadeIn select-none font-sans">
      {/* 1. Header & Metric Cards Row (TransGlobal Top Tier) */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">
        {/* Left: Display Hero Title & Welcome Banner */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-coral">
            <span className="font-mono uppercase tracking-wider font-bold">
              MIPS TRAINING CENTER
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-500 dark:text-[#8e95a5]">
              Welcome, {cadetName}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white font-sans">
            Tracking Orders List
          </h1>
        </div>

        {/* Right: 3 TransGlobal Metric Cards */}
        <div className="flex items-center gap-3 overflow-x-auto pb-1 sm:pb-0">
          {/* Stat 1: Total Shipments / Containers */}
          <div className="bg-white dark:bg-[#151821] border border-slate-200/80 dark:border-[#232734] rounded-2xl p-4 flex items-center gap-3.5 shadow-sm min-w-[170px] sm:min-w-[190px]">
            <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-[#1d222e] flex items-center justify-center text-slate-700 dark:text-slate-200 shrink-0">
              <Package className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-[#8e95a5] block leading-tight">
                Total Shipments
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black text-slate-900 dark:text-white font-sans tabular-nums">
                  789
                </span>
                <span className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40">
                  +5.45% <ArrowUpRight className="w-3 h-3 ml-0.5 stroke-[2.5]" />
                </span>
              </div>
            </div>
          </div>

          {/* Stat 2: Active Tracking / Berth */}
          <div className="bg-white dark:bg-[#151821] border border-slate-200/80 dark:border-[#232734] rounded-2xl p-4 flex items-center gap-3.5 shadow-sm min-w-[170px] sm:min-w-[190px]">
            <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-[#1d222e] flex items-center justify-center text-slate-700 dark:text-slate-200 shrink-0">
              <MapPin className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-[#8e95a5] block leading-tight">
                Active Tracking
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black text-slate-900 dark:text-white font-sans tabular-nums">
                  120
                </span>
                <span className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/40">
                  -0.45% <ArrowDownRight className="w-3 h-3 ml-0.5 stroke-[2.5]" />
                </span>
              </div>
            </div>
          </div>

          {/* Stat 3: Delivered Shipments / Training Progress */}
          <div className="bg-white dark:bg-[#151821] border border-slate-200/80 dark:border-[#232734] rounded-2xl p-4 flex items-center gap-3.5 shadow-sm min-w-[185px] sm:min-w-[205px]">
            <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-[#1d222e] flex items-center justify-center text-slate-700 dark:text-slate-200 shrink-0">
              <Truck className="w-5 h-5 stroke-[2.2]" />
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
                <span className="text-2xl font-black text-slate-900 dark:text-white font-sans tabular-nums">
                  98
                </span>
                <span className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40">
                  Completed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Subheader Action Ribbon (Orders Database, Alert, Download, & Coral CTA) */}
      <div className="bg-white dark:bg-[#151821] border border-slate-200/80 dark:border-[#232734] rounded-2xl p-3 sm:p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
        {/* Left: Orders Database Location Chip */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#1d222e] flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-white block">
              Orders Database
            </span>
            <span className="text-[11px] text-slate-500 dark:text-[#8e95a5] block leading-none">
              Today · October 14, 2026 (08:00 WIB)
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
          <button
            type="button"
            className="w-9 h-9 rounded-full border border-slate-200 dark:border-[#262b3a] bg-white dark:bg-[#161922] text-slate-600 dark:text-slate-300 hover:text-coral dark:hover:text-coral flex items-center justify-center transition-colors shadow-sm"
            title="Filter data"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          <button
            type="button"
            className="px-3.5 py-2 text-xs font-semibold rounded-full border border-slate-200 dark:border-[#262b3a] bg-white dark:bg-[#161922] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#1e2330] transition-colors shadow-sm inline-flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download report</span>
          </button>

          {/* Primary Coral CTA Button (TransGlobal 'Create shipment' counterpart) */}
          <button
            type="button"
            onClick={handleLaunchScenario}
            className="cta-coral px-5 py-2 text-xs font-bold rounded-full transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-coral"
          >
            <span>Start Training</span>
          </button>
        </div>
      </div>

      {/* 3. Middle 3-Card Grid (Analytic View + Tracking History + Map Widget) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Card 1 (Col 1-5): Analytic View & Quay Crane Heatmap */}
        <div className="lg:col-span-5 bg-white dark:bg-[#151821] border border-slate-200/80 dark:border-[#232734] rounded-2xl p-5 shadow-card dark:shadow-card-dark flex flex-col justify-between space-y-4">
          <div>
            {/* Header: Analytic view + Time Tabs */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white font-sans">
                Analytic view
              </h2>

              <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-[#8e95a5]">
                {["Day", "Week", "Month", "Quarter", "Year", "All"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    className={cn(
                      "px-2 py-0.5 rounded-full transition-colors",
                      activeTab === tab.toLowerCase()
                        ? "bg-slate-900 text-white dark:bg-[#282f40] dark:text-white font-bold"
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
            <div className="grid grid-cols-3 gap-2 py-3">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-slate-900 dark:text-white font-sans tabular-nums">
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
                  <span className="text-xl font-black text-slate-900 dark:text-white font-sans tabular-nums">
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
                  <span className="text-xl font-black text-slate-900 dark:text-white font-sans tabular-nums">
                    259
                  </span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </div>
                <span className="text-[10px] text-slate-500 dark:text-[#8e95a5] block leading-tight">
                  Maximum number
                </span>
              </div>
            </div>

            {/* Heatmap Grid Matrix (Mon-Sun x 16 Pills) */}
            <div className="space-y-1.5 pt-1">
              {days.map((day, dIdx) => (
                <div key={day} className="flex items-center gap-2">
                  <span className="w-7 text-[10px] font-mono text-slate-400 dark:text-[#8e95a5] shrink-0">
                    {day}
                  </span>
                  <div className="flex items-center gap-1.5 flex-1">
                    {heatmapData[dIdx].map((val, cIdx) => {
                      let cellClass = "bg-slate-100 dark:bg-[#1a1e29]";
                      if (val === 1)
                        cellClass = "bg-coral/30 dark:bg-coral/25";
                      if (val === 2)
                        cellClass = "bg-coral/60 dark:bg-coral/50";
                      if (val === 3)
                        cellClass = "bg-coral text-white";

                      return (
                        <div
                          key={cIdx}
                          className={cn(
                            "h-3.5 flex-1 rounded-md transition-transform hover:scale-110 cursor-pointer",
                            cellClass
                          )}
                          title={`${day} Bay Slot ${cIdx + 1}: ${val * 12} moves`}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sub-panel: Available Training Modules */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2 font-mono">
              Available Training
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div
                onClick={handleLaunchScenario}
                className="p-2 rounded-xl border border-coral/30 bg-coral/5 hover:bg-coral/10 cursor-pointer transition-all text-left"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-bold text-coral px-1.5 py-0.2 rounded-full bg-coral/15">
                    AKTIF
                  </span>
                  <ArrowUpRight className="w-3 h-3 text-coral" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-tight">
                  Vessel Arrival & Berthing
                </h3>
              </div>

              <div className="p-2 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50 dark:bg-[#1a1e29]/60 opacity-60 text-left">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-bold text-slate-400 px-1 py-0.2 rounded bg-slate-200 dark:bg-slate-800">
                    LOCKED
                  </span>
                  <Lock className="w-3 h-3 text-slate-400" />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block line-clamp-1">
                  Cargo Handling
                </span>
              </div>

              <div className="p-2 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50 dark:bg-[#1a1e29]/60 opacity-60 text-left">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-bold text-slate-400 px-1 py-0.2 rounded bg-slate-200 dark:bg-slate-800">
                    LOCKED
                  </span>
                  <Lock className="w-3 h-3 text-slate-400" />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block line-clamp-1">
                  Yard Operations
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2 (Col 6-8): Tracking History */}
        <div className="lg:col-span-4 bg-white dark:bg-[#151821] border border-slate-200/80 dark:border-[#232734] rounded-2xl p-5 shadow-card dark:shadow-card-dark flex flex-col justify-between space-y-4">
          <div>
            {/* Header: Tracking History + Options */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white font-sans">
                Tracking History
              </h2>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Tracking ID & Status Pill */}
            <div className="flex items-center justify-between pt-3 pb-4">
              <div>
                <span className="text-[10px] font-mono text-slate-400 dark:text-[#8e95a5] block leading-none">
                  Tracking ID
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white font-mono mt-0.5 block">
                  #17986-12-779fg
                </span>
              </div>
              <span className="inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/60">
                Active Assignment
              </span>
            </div>

            {/* Vertical Waypoint Timeline */}
            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200 dark:before:bg-slate-800">
              {/* Waypoint 1: Current Location */}
              <div className="relative">
                <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-coral ring-4 ring-coral/20" />
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Current Location
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    7th July, 2026, 08:00
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-[#8e95a5] block">
                  Poznan, Poland · Pelabuhan Tanjung Priok
                </span>
              </div>

              {/* Waypoint 2: Departure */}
              <div className="relative">
                <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Departure Waypoint
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    4th July, 2026, 15:00
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-[#8e95a5] block">
                  Berlin, Germany · Port of Singapore
                </span>
              </div>

              {/* Waypoint 3: Arrival */}
              <div className="relative">
                <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Arrival Waypoint
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    4th July, 2026, 10:00
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-[#8e95a5] block">
                  Hannover, Germany · Tanjung Priok B-01
                </span>
              </div>
            </div>

            {/* Route & Delivery Date Chips */}
            <div className="pt-4 space-y-2 border-t border-slate-100 dark:border-slate-800/80 mt-3 text-xs">
              <div className="flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-[11px] text-slate-500 dark:text-[#8e95a5]">
                  Route:
                </span>
                <span className="text-[11px] font-semibold text-slate-900 dark:text-white">
                  Hannover - Warsaw (Priok)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-[11px] text-slate-500 dark:text-[#8e95a5]">
                  Estimated delivery date:
                </span>
                <span className="text-[11px] font-semibold text-slate-900 dark:text-white font-mono">
                  8th July, 2026 (08:15 WIB)
                </span>
              </div>
            </div>
          </div>

          {/* Courier / Pilot Card (TransGlobal 'Courier Mark Melody' counterpart) */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#1a1e29] border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 to-coral flex items-center justify-center text-white font-bold text-xs">
                CG
              </div>
              <div>
                <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 block leading-tight">
                  Courier / Pilot
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Capt. H. Gunawan
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                className="w-7 h-7 rounded-full bg-white dark:bg-[#232734] border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-coral transition-colors"
                title="Pesan Instruktur"
              >
                <MessageSquare className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                className="w-7 h-7 rounded-full bg-white dark:bg-[#232734] border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-coral transition-colors"
                title="Panggilan VHF Radio"
              >
                <Phone className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Card 3 (Col 9-12): Mini Map Widget */}
        <div className="lg:col-span-3 bg-white dark:bg-[#151821] border border-slate-200/80 dark:border-[#232734] rounded-2xl p-4 shadow-card dark:shadow-card-dark flex flex-col justify-between overflow-hidden relative group">
          {/* Map Header with Fullscreen Icon */}
          <div className="flex items-center justify-between pb-2 z-10">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-900 dark:text-white font-sans">
                Pelabuhan Tanjung Priok
              </span>
            </div>

            <button
              type="button"
              onClick={handleLaunchScenario}
              className="w-7 h-7 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-md flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-coral transition-colors"
              title="Perbesar Peta"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
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
            <div className="absolute bottom-2 left-2 z-20 bg-slate-900/85 backdrop-blur-md text-white px-2 py-1 rounded-lg font-mono text-[10px] flex items-center gap-1.5 shadow-sm">
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
        </div>
      </div>

      {/* 4. Bottom Panel: Recent Activities & Container Data Table (TransGlobal Bottom Tier) */}
      <div className="bg-white dark:bg-[#151821] border border-slate-200/80 dark:border-[#232734] rounded-2xl p-5 shadow-card dark:shadow-card-dark space-y-4">
        {/* Table Top Controls & Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white font-sans shrink-0">
              Recent Activities
            </h2>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto text-[11px] font-semibold text-slate-500 dark:text-[#8e95a5]">
              {["All", "Delivered", "In transit", "Pending", "Processing"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActivityFilter(tab.toLowerCase())}
                  className={cn(
                    "px-2.5 py-1 rounded-full transition-colors shrink-0",
                    activityFilter === tab.toLowerCase()
                      ? "bg-slate-900 text-white dark:bg-[#282f40] dark:text-white font-bold"
                      : "hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  {activityFilter === tab.toLowerCase() ? `• ${tab}` : tab}
                </button>
              ))}
            </div>
          </div>

          {/* Table Customize & Pagination */}
          <div className="flex items-center gap-3 self-end sm:self-auto text-xs text-slate-500 dark:text-[#8e95a5]">
            <button
              type="button"
              className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Customize</span>
            </button>

            <div className="flex items-center gap-1 font-mono text-[11px]">
              <span>1-10 of 40</span>
              <button
                type="button"
                className="w-6 h-6 rounded flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                className="w-6 h-6 rounded flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* High-Fidelity Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-200">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800/80 text-[11px] font-semibold text-slate-400 dark:text-[#8e95a5]">
                <th className="py-2.5 px-3 w-8">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 dark:border-slate-700 text-coral focus:ring-coral/40"
                    readOnly
                  />
                </th>
                <th className="py-2.5 px-3">Order ID ↕</th>
                <th className="py-2.5 px-3">Category ↕</th>
                <th className="py-2.5 px-3">Weight ↕</th>
                <th className="py-2.5 px-3">Company ↕</th>
                <th className="py-2.5 px-3">Arrival time ↕</th>
                <th className="py-2.5 px-3">Route ↕</th>
                <th className="py-2.5 px-3">Shipper ↕</th>
                <th className="py-2.5 px-3">Price ↕</th>
                <th className="py-2.5 px-3">Status ↕</th>
                <th className="py-2.5 px-2 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-sans">
              {orders.map((row) => {
                const isChecked = selectedOrders.includes(row.id);
                return (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-[#1a1e29]/60 transition-colors"
                  >
                    <td className="py-3 px-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSelectOrder(row.id)}
                        className="rounded border-slate-300 dark:border-slate-700 text-coral focus:ring-coral/40 cursor-pointer"
                      />
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">
                      {row.displayId}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                      {row.category}
                    </td>
                    <td className="py-3 px-3 font-mono">{row.weight}</td>
                    <td className="py-3 px-3">{row.company}</td>
                    <td className="py-3 px-3 text-slate-500 dark:text-[#8e95a5]">
                      {row.arrivalTime}
                    </td>
                    <td className="py-3 px-3">{row.route}</td>
                    <td className="py-3 px-3">{row.shipper}</td>
                    <td className="py-3 px-3 font-mono font-semibold">
                      {row.price}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={cn(
                          "inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded-full border",
                          row.status === "Delivered"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60"
                            : row.status === "In transit"
                            ? "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-800/60"
                            : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/60"
                        )}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <button
                        type="button"
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
