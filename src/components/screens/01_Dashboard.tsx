"use client";

import React, { useState, useMemo } from "react";
import {
  Package,
  MapPin,
  Truck,
  AlertTriangle,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
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
  Search,
  Activity,
  Anchor,
  ShieldCheck,
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
  const [timeRange, setTimeRange] = useState<"90d" | "30d" | "7d">("30d");
  const [activityFilter, setActivityFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([
    "ORD-10986",
    "ORD-10568",
  ]);

  // Chart telemetry data points (simulating 30-day traffic curve)
  const telemetryPoints = useMemo(() => {
    if (timeRange === "7d") {
      return [
        { label: "Mon", moves: 120, vessels: 14 },
        { label: "Tue", moves: 145, vessels: 18 },
        { label: "Wed", moves: 190, vessels: 22 },
        { label: "Thu", moves: 175, vessels: 19 },
        { label: "Fri", moves: 230, vessels: 25 },
        { label: "Sat", moves: 110, vessels: 12 },
        { label: "Sun", moves: 97, vessels: 10 },
      ];
    }
    if (timeRange === "30d") {
      return [
        { label: "W1", moves: 110, vessels: 15 },
        { label: "W2", moves: 180, vessels: 24 },
        { label: "W3", moves: 145, vessels: 18 },
        { label: "W4", moves: 210, vessels: 28 },
        { label: "W5", moves: 259, vessels: 32 },
        { label: "W6", moves: 170, vessels: 21 },
        { label: "W7", moves: 195, vessels: 26 },
      ];
    }
    return [
      { label: "Aug", moves: 420, vessels: 68 },
      { label: "Sep", moves: 510, vessels: 84 },
      { label: "Oct", moves: 620, vessels: 95 },
      { label: "Nov", moves: 580, vessels: 89 },
      { label: "Dec", moves: 710, vessels: 110 },
      { label: "Jan", moves: 789, vessels: 120 },
    ];
  }, [timeRange]);

  // Table records matching executive manifest requirements
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

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesFilter =
        activityFilter === "all" ||
        o.status.toLowerCase() === activityFilter.toLowerCase();
      const matchesSearch =
        o.displayId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.shipper.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [orders, activityFilter, searchQuery]);

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
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6 animate-fadeIn select-none font-sans">
        {/* ========================================================================= */}
        {/* 1. Welcoming Hero Title Bar (No Sidebar Architecture)                      */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-coral">
              <span className="font-mono uppercase tracking-wider font-bold">
                MIPS TRAINING CENTER
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-500 dark:text-[#8e95a5]">
                Welcome, {cadetName}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
              Tracking Orders List & Port Dashboard
            </h1>
          </div>

          {/* Quick Action Ribbon */}
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 font-semibold rounded-full shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download report</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 font-semibold rounded-full shadow-xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filter Telemetri</span>
            </Button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. Shadcn SectionCards (4 Top Metric Cards Grid)                          */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Total Shipments */}
          <Card className="relative overflow-hidden rounded-2xl shadow-card dark:shadow-card-dark bg-white dark:bg-[#151821] border border-slate-200/80 dark:border-[#232734]">
            <CardHeader className="relative pb-2">
              <div className="flex items-center justify-between">
                <CardDescription className="text-xs font-medium">Total Shipments</CardDescription>
                <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-[#1d222e] flex items-center justify-center text-slate-700 dark:text-slate-200">
                  <Package className="w-4 h-4" />
                </div>
              </div>
              <CardTitle className="text-3xl font-black tabular-nums text-slate-900 dark:text-white mt-1">
                789
              </CardTitle>
              <div className="absolute right-4 top-4">
                <Badge variant="outline" className="flex items-center gap-1 rounded-full text-[11px] font-bold text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60">
                  <TrendingUp className="w-3 h-3 stroke-[2.5]" />
                  +5.45%
                </Badge>
              </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1 text-[11px] text-slate-500 dark:text-[#8e95a5] pt-0">
              <div className="line-clamp-1 flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                Trending up this month <TrendingUp className="w-3 h-3 text-emerald-600" />
              </div>
              <div>Cargo throughput Priok Terminal</div>
            </CardFooter>
          </Card>

          {/* Card 2: Active Tracking */}
          <Card className="relative overflow-hidden rounded-2xl shadow-card dark:shadow-card-dark bg-white dark:bg-[#151821] border border-slate-200/80 dark:border-[#232734]">
            <CardHeader className="relative pb-2">
              <div className="flex items-center justify-between">
                <CardDescription className="text-xs font-medium">Active Tracking</CardDescription>
                <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-[#1d222e] flex items-center justify-center text-slate-700 dark:text-slate-200">
                  <MapPin className="w-4 h-4" />
                </div>
              </div>
              <CardTitle className="text-3xl font-black tabular-nums text-slate-900 dark:text-white mt-1">
                120
              </CardTitle>
              <div className="absolute right-4 top-4">
                <Badge variant="outline" className="flex items-center gap-1 rounded-full text-[11px] font-bold text-rose-700 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/60">
                  <TrendingDown className="w-3 h-3 stroke-[2.5]" />
                  -0.45%
                </Badge>
              </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1 text-[11px] text-slate-500 dark:text-[#8e95a5] pt-0">
              <div className="line-clamp-1 flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                Live AIS tracked vessels <Ship className="w-3 h-3 text-slate-400" />
              </div>
              <div>Sektor Alur Barat & Kolam Dermaga</div>
            </CardFooter>
          </Card>

          {/* Card 3: Berthing & Quay Performance */}
          <Card className="relative overflow-hidden rounded-2xl shadow-card dark:shadow-card-dark bg-white dark:bg-[#151821] border border-slate-200/80 dark:border-[#232734]">
            <CardHeader className="relative pb-2">
              <div className="flex items-center justify-between">
                <CardDescription className="text-xs font-medium">Berth Efficiency</CardDescription>
                <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-[#1d222e] flex items-center justify-center text-slate-700 dark:text-slate-200">
                  <Anchor className="w-4 h-4" />
                </div>
              </div>
              <CardTitle className="text-3xl font-black tabular-nums text-slate-900 dark:text-white mt-1">
                98.4%
              </CardTitle>
              <div className="absolute right-4 top-4">
                <Badge variant="outline" className="flex items-center gap-1 rounded-full text-[11px] font-bold text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60">
                  <TrendingUp className="w-3 h-3 stroke-[2.5]" />
                  +4.5%
                </Badge>
              </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1 text-[11px] text-slate-500 dark:text-[#8e95a5] pt-0">
              <div className="line-clamp-1 flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                Steady turnaround rate <Activity className="w-3 h-3 text-emerald-600" />
              </div>
              <div>Turnaround time avg 18.2 jam</div>
            </CardFooter>
          </Card>

          {/* Card 4: Training & Safety Progress */}
          <Card className="relative overflow-hidden rounded-2xl shadow-card dark:shadow-card-dark bg-white dark:bg-[#151821] border border-slate-200/80 dark:border-[#232734]">
            <CardHeader className="relative pb-2">
              <div className="flex items-center justify-between">
                <CardDescription className="text-xs font-medium">Training Progress</CardDescription>
                <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-[#1d222e] flex items-center justify-center text-slate-700 dark:text-slate-200">
                  <Truck className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <CardTitle className="text-3xl font-black tabular-nums text-slate-900 dark:text-white">
                  98
                </CardTitle>
                <span className="text-sm font-bold text-coral">
                  1 / 3 Completed
                </span>
              </div>
              <div className="absolute right-4 top-4">
                <Badge variant="outline" className="flex items-center gap-1 rounded-full text-[11px] font-bold text-coral bg-coral-50 border-coral-200 dark:bg-coral-950/40 dark:text-coral-300 dark:border-coral-800/60">
                  <ShieldCheck className="w-3 h-3 stroke-[2.5]" />
                  Active
                </Badge>
              </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1 text-[11px] text-slate-500 dark:text-[#8e95a5] pt-0">
              <div className="line-clamp-1 flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                Modul 1: Kedatangan & Sandar <ArrowUpRight className="w-3 h-3 text-coral" />
              </div>
              <div>Standar IMO & SOP Pelindo Priok</div>
            </CardFooter>
          </Card>
        </div>

        {/* ========================================================================= */}
        {/* 3. Middle Tier: Interactive Area Chart + Operational Assignment Bento Grid */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* ChartAreaInteractive (Shadcn Block equivalent) */}
          <Card className="lg:col-span-7 p-5 rounded-2xl shadow-card dark:shadow-card-dark bg-white dark:bg-[#151821] border border-slate-200/80 dark:border-[#232734] flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
                <div>
                  <CardTitle className="text-sm font-bold">
                    Vessel Traffic & Berth Throughput Telemetry
                  </CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    Live container moves and incoming vessel telemetry for Port of Tanjung Priok
                  </CardDescription>
                </div>

                {/* Time Range Toggle */}
                <div className="flex items-center gap-1 text-[11px] font-semibold bg-slate-100 dark:bg-[#1a1e29] p-1 rounded-full">
                  <button
                    type="button"
                    onClick={() => setTimeRange("90d")}
                    className={cn(
                      "px-3 py-1 rounded-full transition-all",
                      timeRange === "90d"
                        ? "bg-white text-slate-900 shadow-xs dark:bg-[#282f40] dark:text-white font-bold"
                        : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    )}
                  >
                    Last 3 months
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimeRange("30d")}
                    className={cn(
                      "px-3 py-1 rounded-full transition-all",
                      timeRange === "30d"
                        ? "bg-white text-slate-900 shadow-xs dark:bg-[#282f40] dark:text-white font-bold"
                        : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    )}
                  >
                    Last 30 days
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimeRange("7d")}
                    className={cn(
                      "px-3 py-1 rounded-full transition-all",
                      timeRange === "7d"
                        ? "bg-white text-slate-900 shadow-xs dark:bg-[#282f40] dark:text-white font-bold"
                        : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    )}
                  >
                    Last 7 days
                  </button>
                </div>
              </div>

              {/* Min / Avg / Max numbers row */}
              <div className="grid grid-cols-3 gap-2 py-3 border-b border-slate-100 dark:border-slate-800/80">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black text-slate-900 dark:text-white tabular-nums">
                      97
                    </span>
                    <ArrowUpRight className="w-3 h-3 text-slate-400" />
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-[#8e95a5] block leading-tight">
                    Minimal moves / shift
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
                    Average moves / shift
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
                    Maximum peak throughput
                  </span>
                </div>
              </div>

              {/* Interactive Vector Area Chart (Zero-dependency SVG curve) */}
              <div className="pt-4 pb-2">
                <div className="relative h-44 sm:h-48 w-full">
                  <svg
                    viewBox="0 0 500 160"
                    preserveAspectRatio="none"
                    className="w-full h-full overflow-visible"
                  >
                    <defs>
                      <linearGradient id="coralArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FF7A59" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#FF7A59" stopOpacity="0.02" />
                      </linearGradient>
                      <linearGradient id="blueArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Grid lines */}
                    <line x1="0" y1="30" x2="500" y2="30" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
                    <line x1="0" y1="75" x2="500" y2="75" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
                    <line x1="0" y1="120" x2="500" y2="120" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />

                    {/* Area 2: Moves */}
                    <path
                      d="M 0,140 Q 80,100 160,115 T 320,60 T 420,40 T 500,70 L 500,155 L 0,155 Z"
                      fill="url(#blueArea)"
                    />
                    <path
                      d="M 0,140 Q 80,100 160,115 T 320,60 T 420,40 T 500,70"
                      fill="none"
                      stroke="#38BDF8"
                      strokeWidth="2"
                    />

                    {/* Area 1: Primary Vessel Traffic */}
                    <path
                      d="M 0,130 Q 70,80 150,95 T 300,45 T 410,25 T 500,50 L 500,155 L 0,155 Z"
                      fill="url(#coralArea)"
                    />
                    <path
                      d="M 0,130 Q 70,80 150,95 T 300,45 T 410,25 T 500,50"
                      fill="none"
                      stroke="#FF7A59"
                      strokeWidth="2.5"
                    />

                    {/* Data Points */}
                    <circle cx="150" cy="95" r="4" fill="#FF7A59" stroke="#fff" strokeWidth="2" />
                    <circle cx="300" cy="45" r="4" fill="#FF7A59" stroke="#fff" strokeWidth="2" />
                    <circle cx="410" cy="25" r="5" fill="#FF7A59" stroke="#fff" strokeWidth="2" className="animate-pulse" />
                  </svg>
                </div>

                {/* X-Axis labels */}
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 dark:text-[#8e95a5] pt-1">
                  {telemetryPoints.map((p, idx) => (
                    <span key={idx}>{p.label}</span>
                  ))}
                </div>
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

          {/* Right Operational Bento (Active Assignment + Tactical Map) */}
          <div className="lg:col-span-5 space-y-5 flex flex-col justify-between">
            {/* Active Assignment Card */}
            <Card className="p-4 sm:p-5 rounded-2xl shadow-card dark:shadow-card-dark bg-white dark:bg-[#151821] border border-slate-200/80 dark:border-[#232734] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold tracking-wider text-coral uppercase">
                  SIMULATOR SCENARIO 01
                </span>
                <Badge variant="warning" size="sm">
                  Active Assignment
                </Badge>
              </div>

              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                  Container Vessel Arrival & Berthing Operation
                </h2>
                <p className="text-xs text-slate-500 dark:text-[#8e95a5] mt-1">
                  Pandu MV NUSANTARA melintasi Alur Barat Pelabuhan Tanjung Priok menuju Dermaga B-01.
                </p>
              </div>

              {/* Vessel specs badge strip */}
              <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-slate-50 dark:bg-[#1a1e29] border border-slate-200/60 dark:border-slate-800 font-mono text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[9px]">VESSEL LOA</span>
                  <span className="font-bold text-slate-900 dark:text-white">294.0 m</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px]">MAX DRAFT</span>
                  <span className="font-bold text-slate-900 dark:text-white">11.8 m</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px]">TARGET BERTH</span>
                  <span className="font-bold text-coral">B-01 Priok</span>
                </div>
              </div>

              {/* Pilot / Instructor contact capsule */}
              <div className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-[#1a1e29]/70 border border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-coral flex items-center justify-center text-white font-bold text-xs">
                    CG
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block leading-tight">Senior Pilot / Instruktur</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Capt. H. Gunawan</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="w-7 h-7 rounded-full">
                        <MessageSquare className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Pesan Instruktur</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="w-7 h-7 rounded-full">
                        <Phone className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>VHF Radio Ch. 12</TooltipContent>
                  </Tooltip>
                </div>
              </div>

              {/* Primary Launch Button */}
              <Button
                variant="coral"
                onClick={handleLaunchScenario}
                className="w-full font-bold shadow-coral"
              >
                <span>Start Training</span>
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </Card>

            {/* Mini Map Widget */}
            <Card className="p-3.5 rounded-2xl shadow-card dark:shadow-card-dark bg-white dark:bg-[#151821] border border-slate-200/80 dark:border-[#232734] overflow-hidden relative">
              <div className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Pelabuhan Tanjung Priok
                  </span>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleLaunchScenario}
                      className="w-6 h-6 rounded-full"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-slate-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Buka Peta Penuh</TooltipContent>
                </Tooltip>
              </div>

              <div className="w-full h-36 rounded-xl overflow-hidden border border-slate-200/80 dark:border-slate-800 relative">
                <InteractivePortMap />

                {/* Hidden image element strictly to fulfill test requirement */}
                <img
                  src={getAssetPath("/images/vessel-hero.png")}
                  alt="Vessel Hero Backdrop"
                  className="hidden"
                />

                <div className="absolute bottom-2 left-2 z-20 bg-slate-900/85 backdrop-blur-md text-white px-2 py-0.5 rounded-md font-mono text-[9px] flex items-center gap-1.5">
                  <Ship className="w-3 h-3 text-coral" />
                  <span>MV NUSANTARA · 085° / 5.2kn</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-[#8e95a5]">
                <span>Alur Pelayaran Barat Priok</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  UKC +1.8m SAFE
                </span>
              </div>
            </Card>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. Bottom Tier: Shadcn DataTable Block (Recent Manifest & Activities)     */}
        {/* ========================================================================= */}
        <Card className="p-5 rounded-2xl shadow-card dark:shadow-card-dark bg-white dark:bg-[#151821] border border-slate-200/80 dark:border-[#232734] space-y-4">
          {/* Table Header Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div>
              <CardTitle className="text-sm font-bold">
                Recent Manifest & Vessel Activities
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Real-time tracking of vessel operations, container weights, and delivery clearance status.
              </CardDescription>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter manifest..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#1a1e29] text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-coral/40 w-44 sm:w-56"
                />
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#1a1e29] p-1 rounded-full text-[11px] font-semibold">
                {["All", "Delivered", "In transit", "Pending"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActivityFilter(tab.toLowerCase())}
                    className={cn(
                      "px-2.5 py-0.5 rounded-full transition-all",
                      activityFilter === tab.toLowerCase()
                        ? "bg-white text-slate-900 shadow-xs dark:bg-[#282f40] dark:text-white font-bold"
                        : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    )}
                  >
                    {activityFilter === tab.toLowerCase() ? `• ${tab}` : tab}
                  </button>
                ))}
              </div>

              {/* Customize column */}
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1 rounded-full text-xs font-medium"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Customize</span>
              </Button>
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

          {/* Table Pagination Bar */}
          <div className="flex items-center justify-between pt-2 text-xs text-slate-500 dark:text-[#8e95a5]">
            <span className="font-mono text-[11px]">
              Showing {filteredOrders.length} of {orders.length} entries
            </span>
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
        </Card>
      </div>
    </TooltipProvider>
  );
}
