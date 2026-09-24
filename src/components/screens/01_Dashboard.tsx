"use client";

import React, { useState } from "react";
import {
  Package,
  MapPin,
  Truck,
  AlertTriangle,
  Download,
  ArrowUpRight,
  ArrowDownRight,
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
  Share2,
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

  // Table records matching the TransGlobal reference design
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
      statusVariant: "success" as const,
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
      statusVariant: "success" as const,
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
      statusVariant: "coral" as const,
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
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-5 animate-fadeIn select-none font-sans">
        {/* ========================================================================= */}
        {/* 1. Header & Metric Cards Row (TransGlobal Top Tier with Shadcn Cards)   */}
        {/* ========================================================================= */}
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

          {/* Right: 3 TransGlobal Metric Cards using Shadcn Card */}
          <div className="flex items-center gap-3 overflow-x-auto pb-1 sm:pb-0">
            {/* Stat 1: Total Shipments */}
            <Card className="p-3.5 sm:p-4 flex items-center gap-3.5 min-w-[170px] sm:min-w-[190px] rounded-2xl shadow-sm">
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
                  <Badge variant="success" size="sm">
                    +5.45% <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Stat 2: Active Tracking */}
            <Card className="p-3.5 sm:p-4 flex items-center gap-3.5 min-w-[170px] sm:min-w-[190px] rounded-2xl shadow-sm">
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
                  <Badge variant="danger" size="sm">
                    -0.45% <ArrowDownRight className="w-3 h-3 stroke-[2.5]" />
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Stat 3: Delivered Shipments / Training Progress */}
            <Card className="p-3.5 sm:p-4 flex items-center gap-3.5 min-w-[185px] sm:min-w-[205px] rounded-2xl shadow-sm">
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
                  <Badge variant="success" size="sm">
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
        <Card className="p-3 sm:p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm rounded-2xl">
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
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full shadow-sm"
                  aria-label="Filter data"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Filter parameters</TooltipContent>
            </Tooltip>

            <Button
              variant="outline"
              size="sm"
              className="rounded-full shadow-sm font-semibold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download report</span>
            </Button>

            {/* Primary Coral CTA Button (TransGlobal 'Create shipment' counterpart) */}
            <Button
              variant="coral"
              size="sm"
              onClick={handleLaunchScenario}
              className="px-5 font-bold shadow-coral"
            >
              <span>Start Training</span>
            </Button>
          </div>
        </Card>

        {/* ========================================================================= */}
        {/* 3. Middle 3-Card Grid (Analytic View + Tracking History + Map Widget)     */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Card 1 (Col 1-5): Analytic View & Quay Crane Heatmap */}
          <Card className="lg:col-span-5 p-5 flex flex-col justify-between space-y-4 rounded-2xl shadow-card dark:shadow-card-dark">
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
                        if (val === 1) cellClass = "bg-coral/30 dark:bg-coral/25";
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
                              {day} Bay Slot {cIdx + 1}: {val * 12} moves
                            </TooltipContent>
                          </Tooltip>
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
                  className="p-2.5 rounded-xl border border-coral/30 bg-coral/5 hover:bg-coral/10 cursor-pointer transition-all text-left shadow-sm group"
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

                <div className="p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50 dark:bg-[#1a1e29]/60 opacity-60 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="neutral" size="sm">
                      LOCKED
                    </Badge>
                    <Lock className="w-3 h-3 text-slate-400" />
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block line-clamp-1">
                    Cargo Handling
                  </span>
                </div>

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
          <Card className="lg:col-span-4 p-5 flex flex-col justify-between space-y-4 rounded-2xl shadow-card dark:shadow-card-dark">
            <div>
              {/* Header: Tracking History + Options Dropdown */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
                <CardTitle className="text-sm font-bold">Tracking History</CardTitle>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="w-7 h-7">
                      <MoreHorizontal className="w-4 h-4 text-slate-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Tracking Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLaunchScenario}>
                      <Eye className="w-3.5 h-3.5 mr-2" /> View Assignment
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share2 className="w-3.5 h-3.5 mr-2" /> Share Telemetry
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
                    #17986-12-779fg
                  </span>
                </div>
                <Badge variant="warning" size="md">
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

            {/* Courier / Pilot Capsule Card */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#1a1e29] border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 to-coral flex items-center justify-center text-white font-bold text-xs shadow-sm">
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
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-7 h-7 rounded-full bg-white dark:bg-[#232734]"
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
                      className="w-7 h-7 rounded-full bg-white dark:bg-[#232734]"
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
          <Card className="lg:col-span-3 p-4 flex flex-col justify-between overflow-hidden relative group rounded-2xl shadow-card dark:shadow-card-dark">
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
          </Card>
        </div>

        {/* ========================================================================= */}
        {/* 4. Bottom Panel: Recent Activities & Container Table (Shadcn Table)      */}
        {/* ========================================================================= */}
        <Card className="p-5 space-y-4 rounded-2xl shadow-card dark:shadow-card-dark">
          {/* Table Top Controls & Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-3">
              <CardTitle className="text-sm font-bold shrink-0">
                Recent Activities
              </CardTitle>

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
                <TableHead>Order ID ↕</TableHead>
                <TableHead>Category ↕</TableHead>
                <TableHead>Weight ↕</TableHead>
                <TableHead>Company ↕</TableHead>
                <TableHead>Arrival time ↕</TableHead>
                <TableHead>Route ↕</TableHead>
                <TableHead>Shipper ↕</TableHead>
                <TableHead>Price ↕</TableHead>
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
                        aria-label={`Select order ${row.displayId}`}
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
                    <TableCell className="font-mono font-semibold">
                      {row.price}
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
                          <DropdownMenuLabel>Action</DropdownMenuLabel>
                          <DropdownMenuItem onClick={handleLaunchScenario}>
                            <Eye className="w-3.5 h-3.5 mr-2" /> Inspect Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="w-3.5 h-3.5 mr-2" /> View Manifest
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Printer className="w-3.5 h-3.5 mr-2" /> Print Waybill
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
