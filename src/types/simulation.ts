export enum TrainingState {
  DASHBOARD = "DASHBOARD",
  SCENARIO_CATALOG = "SCENARIO_CATALOG",
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

export type SimulationCheckpointType = "MOORING_APPROVAL" | "CRANE_START_APPROVAL";

export interface SimulationCheckpoint {
  id: SimulationCheckpointType;
  triggerMinute: number;
  timeString: string;
  title: string;
  sender: string;
  description: string;
  actionButtonText: string;
  isApproved: boolean;
}

export interface EquipmentInspectionData {
  type: "VESSEL" | "CRANE" | "TRUCK";
  id: string;
  name: string;
  status: string;
  metrics: { label: string; value: string }[];
  operationalNotes: string;
}

export interface TimelineEvent {
  timeOffsetMinutes: number;
  clockTime: string;
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
  craneSpreaderY: number;
}

export interface LiveKPIs {
  elapsedSimulationMinutes: number;
  containersHandled: number;
  totalContainers: number;
  grossProductivityMovesPerHour: number;
  craneUtilizationPercent: number;
  truckUtilizationPercent: number;
}
