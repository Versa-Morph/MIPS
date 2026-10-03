"use client";

import React, { useState, useEffect } from "react";
import {
  Radio,
  Wifi,
  WifiOff,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Send,
  Users,
  Ship,
  Anchor,
  Layers,
  Copy,
  Check,
  ShieldCheck,
  Activity,
} from "lucide-react";
import { realtimeSync, RealtimeMessage } from "@/utils/realtimeSync";
import { useTrainingStore } from "@/store/useTrainingStore";
import { useSimulationStore } from "@/store/useSimulationStore";
import { sound } from "@/utils/audioEngine";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface InstructorConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CadetLiveTelemetry {
  cadetName: string;
  currentState: string;
  selectedBerth: string | null;
  dossierScore: number;
  isDossierSubmitted: boolean;
  currentSimMinute: number;
  containersHandled: number;
  lastUpdated: number;
}

export function InstructorConsoleModal({
  isOpen,
  onClose,
}: InstructorConsoleModalProps) {
  const { sessionCode, activeSessionId, scenario } = useTrainingStore();
  const [copied, setCopied] = useState(false);
  const [wsUrlInput, setWsUrlInput] = useState(
    realtimeSync.getWsUrl() || "ws://127.0.0.1:8090"
  );
  const [isWsActive, setIsWsActive] = useState(realtimeSync.isWsConnected());
  const [cadetData, setCadetData] = useState<CadetLiveTelemetry>({
    cadetName: "Cadet Andika",
    currentState: "DASHBOARD",
    selectedBerth: null,
    dossierScore: 0,
    isDossierSubmitted: false,
    currentSimMinute: 0,
    containersHandled: 0,
    lastUpdated: Date.now(),
  });
  const [customMsg, setCustomMsg] = useState("");
  const [sentAlert, setSentAlert] = useState("");

  useEffect(() => {
    const unsubscribe = realtimeSync.subscribe((msg: RealtimeMessage) => {
      if (msg.type === "CADET_PROGRESS") {
        setCadetData({
          cadetName: msg.cadetName,
          currentState: msg.currentState,
          selectedBerth: msg.selectedBerth,
          dossierScore: msg.dossierScore,
          isDossierSubmitted: msg.isDossierSubmitted,
          currentSimMinute: msg.currentSimMinute,
          containersHandled: msg.containersHandled,
          lastUpdated: Date.now(),
        });
      } else if (msg.type === "CADET_JOINED") {
        setCadetData((prev) => ({
          ...prev,
          cadetName: msg.cadetName,
          currentState: "SCENARIO_SELECTION",
          lastUpdated: Date.now(),
        }));
      }
    });

    const interval = setInterval(() => {
      setIsWsActive(realtimeSync.isWsConnected());
    }, 1500);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const handleCopyCode = () => {
    sound.playButtonTap();
    navigator.clipboard?.writeText(sessionCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleWs = () => {
    if (isWsActive) {
      realtimeSync.disconnectWebSocket();
      setIsWsActive(false);
    } else {
      realtimeSync.connectWebSocket(wsUrlInput);
      setTimeout(() => {
        setIsWsActive(realtimeSync.isWsConnected());
      }, 500);
    }
  };

  const handleRemoteDispatch = (
    checkpointId: "MOORING_APPROVAL" | "CRANE_START_APPROVAL"
  ) => {
    sound.playSuccessChime();
    realtimeSync.broadcast({
      type: "INSTRUCTOR_DISPATCH",
      checkpointId,
      approved: true,
      sender: "Capt. H. Gunawan, M.Mar. (Harbor Master)",
      timestamp: Date.now(),
    });
    setSentAlert(`Otorisasi ${checkpointId} berhasil disiarkan ke Taruna!`);
    setTimeout(() => setSentAlert(""), 4000);
  };

  const handleSendCustomAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMsg.trim()) return;

    sound.playWarningAlarm();
    realtimeSync.broadcast({
      type: "INSTRUCTOR_ALERT",
      title: "INSTRUKTUR MARITIM ADVISORY",
      message: customMsg,
      level: "WARNING",
      timestamp: Date.now(),
    });
    setCustomMsg("");
    setSentAlert("Pesan instruktur berhasil disiarkan ke terminal Taruna.");
    setTimeout(() => setSentAlert(""), 4000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white dark:bg-[#0A1931] border border-slate-200 dark:border-[#1E3A5F] shadow-2xl p-6 rounded-2xl select-none font-sans text-slate-900 dark:text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-1 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <Badge variant="brand" size="sm">
              <Activity className="w-3 h-3 mr-1 text-[#00A3E0]" />
              KONSOL INSTRUKTUR & DISPATCH
            </Badge>
            <div className="flex items-center gap-2 font-mono text-[10px]">
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <Radio className="w-3 h-3 animate-pulse" />
                BroadcastChannel Aktif
              </span>
              <span
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full border ${
                  isWsActive
                    ? "bg-blue-50 text-[#0066FF] border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800"
                    : "bg-slate-100 text-slate-500 border-slate-200 dark:bg-[#102A45] dark:text-slate-400 dark:border-slate-800"
                }`}
              >
                {isWsActive ? (
                  <>
                    <Wifi className="w-3 h-3" />
                    WS Terhubung (:8090)
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3" />
                    WS Standby
                  </>
                )}
              </span>
            </div>
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight text-[#0A2540] dark:text-white">
            Port Operations Dispatcher Console
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
            Monitoring telemetri Taruna secara real-time dan kendalikan checkpoint otorisasi
            alur pelayaran Tanjung Priok.
          </DialogDescription>
        </DialogHeader>

        {sentAlert && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{sentAlert}</span>
          </div>
        )}

        <div className="space-y-4 pt-1">
          {/* Section 1: Active Session Setup & Code */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#102A45] border border-slate-200/80 dark:border-[#1E3A5F] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
                Sesi Ujian / Pelatihan Aktif
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Skenario: {scenario.name}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-[#081826] border border-slate-200 dark:border-slate-700">
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-400 block font-semibold">
                  Kode Akses Taruna (Shareable):
                </span>
                <span className="text-lg font-black font-mono text-[#0066FF] dark:text-[#38BDF8] tracking-widest block">
                  {sessionCode}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopyCode}
                  className="rounded-full text-xs font-mono gap-1.5"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Kode</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Section 2: Live Cadet Telemetry Monitoring */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#102A45] border border-slate-200/80 dark:border-[#1E3A5F] space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/80 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 font-mono flex items-center gap-2">
                <Users className="w-4 h-4 text-[#0066FF]" />
                <span>Live Cadet Monitor: {cadetData.cadetName}</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                NIT. 202300123
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-white dark:bg-[#081826] border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">
                  Fase Saat Ini
                </span>
                <strong className="text-[#0066FF] dark:text-[#38BDF8] text-xs font-bold block mt-0.5 truncate">
                  {cadetData.currentState}
                </strong>
              </div>

              <div className="p-2.5 rounded-lg bg-white dark:bg-[#081826] border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">
                  Pilihan Dermaga
                </span>
                <strong
                  className={`text-xs font-bold block mt-0.5 ${
                    cadetData.selectedBerth === "B-01"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : cadetData.selectedBerth
                      ? "text-rose-600"
                      : "text-slate-500"
                  }`}
                >
                  {cadetData.selectedBerth || "Belum dipilih"}
                </strong>
              </div>

              <div className="p-2.5 rounded-lg bg-white dark:bg-[#081826] border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">
                  Audit Dossier
                </span>
                <strong className="text-slate-900 dark:text-white text-xs font-bold block mt-0.5">
                  {cadetData.isDossierSubmitted
                    ? `${cadetData.dossierScore} / 20 Pts`
                    : "Belum Dikunci"}
                </strong>
              </div>

              <div className="p-2.5 rounded-lg bg-white dark:bg-[#081826] border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">
                  Bongkar Muat
                </span>
                <strong className="text-slate-900 dark:text-white text-xs font-bold block mt-0.5">
                  {cadetData.containersHandled} / 50 Box
                </strong>
              </div>
            </div>
          </div>

          {/* Section 3: Remote Dispatch Controls */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#102A45] border border-slate-200/80 dark:border-[#1E3A5F] space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono block">
              Aksi Otorisasi Dispatch Cepat
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => handleRemoteDispatch("MOORING_APPROVAL")}
                className="rounded-xl border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs font-mono font-bold justify-start gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Otorisasi Sandar T+10 (Mooring)</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => handleRemoteDispatch("CRANE_START_APPROVAL")}
                className="rounded-xl border-blue-300 dark:border-blue-800 text-[#0066FF] dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-xs font-mono font-bold justify-start gap-2"
              >
                <Layers className="w-4 h-4 text-[#0066FF]" />
                <span>Otorisasi Crane T+15 (Start)</span>
              </Button>
            </div>
          </div>

          {/* Section 4: Send Custom Instructor Broadcast */}
          <form onSubmit={handleSendCustomAlert} className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">
              Siarkan Instruksi Khusus ke Layar Taruna:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder="Contoh: Kurangi laju sandar, angin meningkat 15 knots!"
                className="flex-1 h-9 px-3 rounded-xl bg-white dark:bg-[#081826] border border-slate-200 dark:border-slate-700 text-xs font-sans focus:outline-none focus:border-[#0066FF]"
              />
              <Button
                type="submit"
                variant="brand"
                size="sm"
                className="rounded-xl font-mono text-xs gap-1.5"
              >
                <Send className="w-3 h-3" />
                <span>Siarkan</span>
              </Button>
            </div>
          </form>

          {/* Section 5: WebSocket Server Configuration */}
          <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-slate-500">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                WS Endpoint:
              </span>
              <input
                type="text"
                value={wsUrlInput}
                onChange={(e) => setWsUrlInput(e.target.value)}
                className="h-7 px-2 text-xs rounded bg-slate-100 dark:bg-[#081826] border border-slate-200 dark:border-slate-700 w-44 font-mono text-slate-800 dark:text-slate-200"
              />
              <button
                type="button"
                onClick={handleToggleWs}
                className="text-[10px] font-bold px-2 py-1 rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                {isWsActive ? "Disconnect" : "Connect"}
              </button>
            </div>

            <span className="text-[10px] text-slate-400">
              *Script relay: <code>node scripts/mips-ws-server.mjs</code>
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
