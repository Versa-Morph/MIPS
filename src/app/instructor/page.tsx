import React from "react";
import { Header } from "@/components/common/Header";
import { InstructorDashboard } from "@/components/screens/08_InstructorDashboard";

export default function InstructorPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />
      <main className="flex-1 overflow-y-auto">
        <InstructorDashboard />
      </main>
    </div>
  );
}
