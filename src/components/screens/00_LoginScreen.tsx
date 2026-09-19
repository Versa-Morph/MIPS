"use client";

import React, { useState } from "react";
import {
  Anchor,
  User,
  CreditCard,
  Building2,
  Compass,
  ArrowRight,
  Zap,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { useTrainingStore } from "@/store/useTrainingStore";

export function LoginScreen() {
  const { loginCadet } = useTrainingStore();

  const [name, setName] = useState("Cadet Pratama");
  const [nrp, setNrp] = useState("TRN-2026-047");
  const [department, setDepartment] = useState("Deck Department (Nautika)");
  const [batch, setBatch] = useState("Batch 47 (2026)");
  const [error, setError] = useState<string | null>(null);

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Nama lengkap taruna wajib diisi.");
      return;
    }
    if (!nrp.trim()) {
      setError("Nomor Induk Taruna (NRP) wajib diisi.");
      return;
    }
    setError(null);
    loginCadet(name, nrp, department, batch);
  };

  const handleQuickDemoLogin = () => {
    loginCadet(
      "Cadet Pratama",
      "TRN-2026-047",
      "Deck Department (Nautika)",
      "Batch 47 (2026)"
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative overflow-hidden select-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#0A2540] via-[#06101E] to-[#020617] -z-10"></div>

      <div className="absolute inset-0 opacity-10 pointer-events-none -z-0">
        <div className="w-full h-full bg-[linear-gradient(to_right,#38BDF8_1px,transparent_1px),linear-gradient(to_bottom,#38BDF8_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      <Compass className="absolute -right-20 -bottom-20 w-96 h-96 text-slate-800/10 pointer-events-none stroke-[0.8]" />

      <div className="w-full max-w-lg space-y-6 relative z-10 animate-fadeIn">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#F5B800] text-slate-950 shadow-xl shadow-amber-500/20 mb-2">
            <Anchor className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[#F5B800] text-xs font-bold uppercase tracking-wider mb-2">
              <span>●</span> MIPS Maritime Academy
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Cadet Identification Portal
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto">
              Maritime Integrated Port Simulator · Sistem Pelatihan Olah Gerak dan Alokasi Sandar Pelabuhan
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>1-Click Quick Demo Login (Cadet Pratama)</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-800"></div>
            <span className="text-[11px] font-mono uppercase text-slate-500 font-bold">
              atau login manual
            </span>
            <div className="flex-1 h-px bg-slate-800"></div>
          </div>

          <form onSubmit={handleManualLogin} className="space-y-4 text-xs">
            {error && (
              <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <span>⚠</span>
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-slate-300 font-bold flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#F5B800]" />
                <span>Nama Lengkap Taruna</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Cadet Pratama"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-[#F5B800] focus:ring-1 focus:ring-[#F5B800] text-slate-100 text-xs placeholder:text-slate-600 outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-bold flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[#F5B800]" />
                <span>Nomor Induk Taruna (NRP)</span>
              </label>
              <input
                type="text"
                value={nrp}
                onChange={(e) => setNrp(e.target.value)}
                placeholder="Contoh: TRN-2026-047"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-[#F5B800] focus:ring-1 focus:ring-[#F5B800] text-slate-100 font-mono text-xs placeholder:text-slate-600 outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-bold flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#F5B800]" />
                <span>Jurusan / Program Studi</span>
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-[#F5B800] focus:ring-1 focus:ring-[#F5B800] text-slate-100 text-xs outline-none transition-all cursor-pointer"
              >
                <option value="Deck Department (Nautika)">
                  Deck Department (Nautika / Olah Gerak Kapal)
                </option>
                <option value="Port Operations (Ketatalaksanaan Pelabuhan)">
                  Port Operations (Ketatalaksanaan & Logistik Terminal)
                </option>
                <option value="Marine Engineering (Teknika)">
                  Marine Engineering (Teknika Perkapalan)
                </option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#F5B800]" />
                <span>Angkatan / Batch Pelatihan</span>
              </label>
              <input
                type="text"
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                placeholder="Contoh: Batch 47 (2026)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-[#F5B800] focus:ring-1 focus:ring-[#F5B800] text-slate-100 text-xs placeholder:text-slate-600 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 hover:border-slate-600 transition-all"
            >
              <span>Masuk Sesi Pelatihan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 font-mono px-2 gap-2">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            IALA V-103 & BKI Accredited
          </span>
          <span>Simulator v1.2</span>
          <span className="text-slate-400">Terminal Secure</span>
        </div>
      </div>
    </div>
  );
}
