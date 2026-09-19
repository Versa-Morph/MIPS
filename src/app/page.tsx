"use client";

import React from "react";
import { Header } from "@/components/common/Header";
import { ProgressBar } from "@/components/common/ProgressBar";
import { useTrainingStore } from "@/store/useTrainingStore";
import { TrainingState } from "@/types/simulation";
import { DashboardScreen } from "@/components/screens/01_Dashboard";
import { ScenarioCardScreen } from "@/components/screens/02_ScenarioCard";
import { BriefingScreen } from "@/components/screens/03_Briefing";

export default function Home() {
  const { currentState, setStep } = useTrainingStore();

  const renderActiveScreen = () => {
    switch (currentState) {
      case TrainingState.DASHBOARD:
        return <DashboardScreen />;

      case TrainingState.SCENARIO_SELECTION:
        return <ScenarioCardScreen />;

      case TrainingState.BRIEFING:
        return <BriefingScreen />;

      default:
        return <DashboardScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />
      <ProgressBar currentState={currentState} />
      <main className="flex-1 overflow-y-auto">{renderActiveScreen()}</main>
    </div>
  );
}
