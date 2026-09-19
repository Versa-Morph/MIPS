export enum TrainingState {
  LOGIN = "LOGIN",
  DASHBOARD = "DASHBOARD",
  SCENARIO_SELECTION = "SCENARIO_SELECTION",
  BRIEFING = "BRIEFING",
  DOCUMENT_REVIEW = "DOCUMENT_REVIEW",
  DECISION = "DECISION",
  DECISION_VALIDATED = "DECISION_VALIDATED",
  SIMULATION_RUNNING = "SIMULATION_RUNNING",
  SIMULATION_PAUSED = "SIMULATION_PAUSED",
  SIMULATION_COMPLETED = "SIMULATION_COMPLETED",
  ASSESSMENT = "ASSESSMENT",
  TRAINING_COMPLETED = "TRAINING_COMPLETED",
}

export interface TimelineEvent {
  timeOffsetMinutes: number; // 0, 3, 5, 8, 10, 15, 25, 35, 40, 45
  clockTime: string; // "08:00", "08:03", "08:05", etc.
  title: string;
  description: string;
  category: "NAVIGATION" | "MOORING" | "CRANE" | "TRUCK" | "SYSTEM";
  containersCompleted: number;
  vesselStatus:
    | "APPROACHING"
    | "MANEUVERING"
    | "BERTHED"
    | "OPERATING"
    | "COMPLETED";
  craneStatus: "IDLE" | "POSITIONING" | "OPERATING" | "COMPLETED";
  truckStatus: "STANDBY" | "CYCLING" | "COMPLETED";
  vesselPosition: { x: number; y: number; rotation: number };
  craneSpreaderY: number; // For vertical hoisting animation
}

export type WeatherMode = "NIGHT_RADAR" | "DAY_FAIRWAY" | "COASTAL_FOG";

export interface LiveKPIs {
  elapsedSimulationMinutes: number;
  containersHandled: number;
  totalContainers: number;
  grossProductivityMovesPerHour: number;
  craneUtilizationPercent: number;
  truckUtilizationPercent: number;
}
