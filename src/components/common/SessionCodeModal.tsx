"use client";

import React, { useState } from "react";
import {
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  Ship,
  Sparkles,
  ArrowRight,
  User,
  Hash,
} from "lucide-react";
import { useTrainingStore } from "@/store/useTrainingStore";
import { TrainingState } from "@/types/simulation";
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

interface SessionCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function SessionCodeModal({
  isOpen,
  onClose,
  onSuccess,
}: SessionCodeModalProps) {
  const { sessionCode, validateSessionCode, setStep, cadetName } =
    useTrainingStore();
  const [inputCode, setInputCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleValidate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputCode.trim()) {
      setErrorMsg("Masukkan kode sesi terlebih dahulu.");
      return;
    }

    const valid = validateSessionCode(inputCode);
    if (valid) {
      sound.playSuccessChime();
      setIsSuccess(true);
      setErrorMsg("");
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        if (onSuccess) {
          onSuccess();
        } else {
          setStep(TrainingState.SCENARIO_SELECTION);
        }
      }, 700);
    } else {
      sound.playWarningAlarm();
      setErrorMsg("Kode sesi tidak valid. Gunakan kode: MIPS-BERTH-2048");
    }
  };

  const handleQuickFill = () => {
    sound.playButtonTap();
    setInputCode(sessionCode);
    setErrorMsg("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white dark:bg-[#0A1931] border border-slate-200 dark:border-[#1E3A5F] shadow-2xl p-6 rounded-2xl select-none font-sans text-slate-900 dark:text-white">
        <DialogHeader className="space-y-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <Badge variant="brand" size="sm">
              <KeyRound className="w-3 h-3 mr-1" />
              AKSES SESI SIMULASI
            </Badge>
            <span className="text-[10px] font-mono text-slate-400">
              ID: TRN-2048
            </span>
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight text-[#0A2540] dark:text-white">
            Validasi Kode Pelatihan
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
            Masukkan kode unik yang diterbitkan oleh Instruktur untuk membuka skenario
            Container Vessel Arrival & Berthing.
          </DialogDescription>
        </DialogHeader>

        {/* Cadet & Instructor Info Capsule */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#102A45] border border-slate-200/80 dark:border-[#1E3A5F] space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#0066FF]" />
              Taruna:
            </span>
            <strong className="text-slate-900 dark:text-white font-bold">
              {cadetName} (NIT. 202300123)
            </strong>
          </div>
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 border-t border-slate-200/60 dark:border-slate-800/80 pt-1.5">
            <span className="flex items-center gap-1.5">
              <Ship className="w-3.5 h-3.5 text-[#00A3E0]" />
              Instruktur:
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Capt. H. Gunawan, M.Mar.
            </span>
          </div>
        </div>

        {/* Form Input */}
        <form onSubmit={handleValidate} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">
                KODE SESI UNIK:
              </label>
              <button
                type="button"
                onClick={handleQuickFill}
                className="text-[11px] font-semibold text-[#0066FF] dark:text-[#38BDF8] hover:underline inline-flex items-center gap-1 cursor-pointer font-mono"
              >
                <Sparkles className="w-3 h-3" />
                <span>Quick Fill: {sessionCode}</span>
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => {
                  setInputCode(e.target.value.toUpperCase());
                  setErrorMsg("");
                }}
                placeholder="CONTOH: MIPS-BERTH-2048"
                className="w-full h-12 px-4 rounded-xl font-mono text-center tracking-widest text-base font-extrabold uppercase bg-white dark:bg-[#081826] border-2 border-slate-200 dark:border-slate-700 focus:border-[#0066FF] dark:focus:border-[#00A3E0] focus:outline-none transition-colors"
                autoFocus
              />
              {isSuccess && (
                <div className="absolute right-3.5 top-3.5 text-emerald-500">
                  <CheckCircle2 className="w-5 h-5 animate-bounce" />
                </div>
              )}
            </div>

            {errorMsg ? (
              <p className="text-[11px] text-rose-600 dark:text-rose-400 font-mono">
                {errorMsg}
              </p>
            ) : (
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                Format: <code>MIPS-BERTH-[TAHUN/ID]</code> (Hubungi instructor jika belum memiliki kode).
              </p>
            )}
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="rounded-full text-xs font-mono"
            >
              Batal
            </Button>

            <Button
              type="submit"
              variant="brand"
              size="md"
              disabled={isSuccess}
              className="rounded-full px-6 font-bold shadow-md gap-1.5"
            >
              <span>{isSuccess ? "Terverifikasi!" : "Validasi & Masuk Sesi"}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
