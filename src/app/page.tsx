"use client";

import React from "react";
import { Header } from "@/components/common/Header";
import { ProgressBar } from "@/components/common/ProgressBar";
import { useTrainingStore } from "@/store/useTrainingStore";
import { TrainingState } from "@/types/simulation";
import { DashboardScreen } from "@/components/screens/01_Dashboard";
import { ScenarioCardScreen } from "@/components/screens/02_ScenarioCard";
import { BriefingScreen } from "@/components/screens/03_Briefing";
import { DocumentCenterScreen } from "@/components/screens/04_DocumentCenter";
import { BerthDecisionScreen } from "@/components/screens/05_BerthDecision";
import { SimulationViewScreen } from "@/components/screens/06_SimulationView";
import { AssessmentViewScreen } from "@/components/screens/07_AssessmentView";

export default function Home() {
  const { currentState } = useTrainingStore();

  const renderActiveScreen = () => {
    switch (currentState) {
      case TrainingState.DASHBOARD:
        return <DashboardScreen />;

      case TrainingState.SCENARIO_SELECTION:
        return <ScenarioCardScreen />;

      case TrainingState.BRIEFING:
        return <BriefingScreen />;

      case TrainingState.DOCUMENT_REVIEW:
        return <DocumentCenterScreen />;

      case TrainingState.DECISION:
      case TrainingState.DECISION_VALIDATED:
        return <BerthDecisionScreen />;

      case TrainingState.SIMULATION_RUNNING:
      case TrainingState.SIMULATION_PAUSED:
      case TrainingState.SIMULATION_COMPLETED:
        return <SimulationViewScreen />;

      case TrainingState.ASSESSMENT:
      case TrainingState.TRAINING_COMPLETED:
        return <AssessmentViewScreen />;

      default:
        return <DashboardScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />
      {currentState !== TrainingState.DASHBOARD && (
        <ProgressBar currentState={currentState} />
      )}
      <main className="flex-1 overflow-y-auto flex flex-col">
        <div key={currentState} className="flex-1 flex flex-col animate-page-enter">
          {renderActiveScreen()}
        </div>
      </main>
    </div>
  );
}
