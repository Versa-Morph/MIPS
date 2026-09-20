import { create } from "zustand";
import {
  TimelineEvent,
  SimulationCheckpoint,
  SimulationCheckpointType,
  EquipmentInspectionData,
} from "../types/simulation";
import { simulationTimeline } from "../data/simulationTimeline";

export interface SimulationStoreState {
  isPlaying: boolean;
  currentSimMinute: number;
  clockTime: string;
  speedMultiplier: 1 | 2 | 4;
  containersHandled: number;
  totalContainers: number;
  productivityMovesPerHour: number;
  craneUtilization: number;
  truckUtilization: number;
  isCompleted: boolean;
  currentEvent: TimelineEvent;
  eventsHistory: TimelineEvent[];
  vesselPosition: { x: number; y: number; rotation: number };
  craneSpreaderY: number;

  // Active check point authorizations
  pendingCheckpoint: SimulationCheckpoint | null;
  approvedCheckpoints: SimulationCheckpointType[];

  // Interactive element inspection
  selectedEquipment: EquipmentInspectionData | null;

  // Actions
  play: () => void;
  pause: () => void;
  setSpeed: (speed: 1 | 2 | 4) => void;
  seek: (minute: number) => void;
  tick: (deltaMinutes?: number) => void;
  approveCheckpoint: () => void;
  inspectEquipment: (data: EquipmentInspectionData | null) => void;
  resetSimulation: () => void;
}

const TOTAL_SIMULATION_MINUTES = 45;
const TOTAL_CONTAINERS = 50;

const checkpointDefinitions: Record<SimulationCheckpointType, SimulationCheckpoint> = {
  MOORING_APPROVAL: {
    id: "MOORING_APPROVAL",
    triggerMinute: 5,
    timeString: "08:05 WIB",
    title: "Otorisasi Sandar & Pengikatan Tali Tambat (Mooring Clearance)",
    sender: "Foreman Regu Kepil Dermaga (Dock Line Handling Crew)",
    description:
      "Kapal MV Nusantara telah bermanuver sejajar dengan dermaga Berth B-01. Petugas kepil meminta otorisasi untuk mengencangkan tali tambat haluan/buritan pada bollard serta menurunkan tangga pandu (gangway) untuk pemeriksaan Syahbandar.",
    actionButtonText: "Beri Otorisasi Sandar & Ikat Tali",
    isApproved: false,
  },
  CRANE_START_APPROVAL: {
    id: "CRANE_START_APPROVAL",
    triggerMinute: 8,
    timeString: "08:08 WIB",
    title: "Otorisasi Mulai Bongkar Muat Kontainer (Quay Crane Clearance)",
    sender: "Supervisor Terminal Petikemas (Quay Crane Superintendent)",
    description:
      "Twin crane QC-01 dan QC-02 telah berada di atas Bay 02 & 06 kapal. Uji keselamatan spreader selesai dan twistlock palka siap dilepas. Berikan otorisasi resmi untuk memulai siklus pembongkaran 50 kontainer?",
    actionButtonText: "Otorisasi Mulai Siklus Bongkar Muat",
    isApproved: false,
  },
};

function formatClockTime(minuteOffset: number): string {
  const startHour = 8;
  const startMinute = 0;
  const totalMinutes = startHour * 60 + startMinute + minuteOffset;
  const hour = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, "0");
  const minute = (totalMinutes % 60).toString().padStart(2, "0");
  return `${hour}:${minute}`;
}

function getActiveEvent(minute: number): TimelineEvent {
  let active = simulationTimeline[0];
  for (const event of simulationTimeline) {
    if (event.timeOffsetMinutes <= minute) {
      active = event;
    } else {
      break;
    }
  }
  return active;
}

function calculateKPIs(minute: number, containers: number) {
  let productivity = 0;
  if (minute >= 8 && containers > 0) {
    const activeOperationMinutes = minute - 5;
    productivity = Number(
      ((containers / Math.max(1, activeOperationMinutes)) * 60).toFixed(1)
    );
  }

  let craneUtil = 0;
  if (minute >= 8 && minute <= 40) {
    craneUtil = 72;
  } else if (minute > 40) {
    craneUtil = 0;
  }

  let truckUtil = 0;
  if (minute >= 5 && minute <= 40) {
    truckUtil = 68;
  } else if (minute > 40) {
    truckUtil = 0;
  }

  return {
    productivity,
    craneUtil,
    truckUtil,
  };
}

export const useSimulationStore = create<SimulationStoreState>((set, get) => ({
  isPlaying: false,
  currentSimMinute: 0,
  clockTime: "08:00",
  speedMultiplier: 1,
  containersHandled: 0,
  totalContainers: TOTAL_CONTAINERS,
  productivityMovesPerHour: 0,
  craneUtilization: 0,
  truckUtilization: 0,
  isCompleted: false,
  currentEvent: simulationTimeline[0],
  eventsHistory: [simulationTimeline[0]],
  vesselPosition: simulationTimeline[0].vesselPosition,
  craneSpreaderY: simulationTimeline[0].craneSpreaderY,
  pendingCheckpoint: null,
  approvedCheckpoints: [],
  selectedEquipment: null,

  play: () => {
    const { currentSimMinute, pendingCheckpoint } = get();
    if (pendingCheckpoint) return; // Must approve checkpoint before running
    if (currentSimMinute >= TOTAL_SIMULATION_MINUTES) {
      get().seek(0);
    }
    set({ isPlaying: true });
  },

  pause: () => {
    set({ isPlaying: false });
  },

  setSpeed: (speed: 1 | 2 | 4) => {
    set({ speedMultiplier: speed });
  },

  seek: (minute: number) => {
    const clampedMinute = Math.min(
      TOTAL_SIMULATION_MINUTES,
      Math.max(0, minute)
    );
    const activeEvent = getActiveEvent(clampedMinute);
    const clockTime = formatClockTime(clampedMinute);
    const isCompleted = clampedMinute >= TOTAL_SIMULATION_MINUTES;

    const { productivity, craneUtil, truckUtil } = calculateKPIs(
      clampedMinute,
      activeEvent.containersCompleted
    );

    const history = simulationTimeline.filter(
      (e) => e.timeOffsetMinutes <= clampedMinute
    );

    set({
      currentSimMinute: clampedMinute,
      clockTime,
      containersHandled: activeEvent.containersCompleted,
      productivityMovesPerHour: productivity,
      craneUtilization: craneUtil,
      truckUtilization: truckUtil,
      currentEvent: activeEvent,
      eventsHistory: history,
      vesselPosition: activeEvent.vesselPosition,
      craneSpreaderY: activeEvent.craneSpreaderY,
      isCompleted,
      isPlaying: isCompleted ? false : get().isPlaying,
    });
  },

  tick: (deltaMinutes = 1) => {
    const { currentSimMinute, approvedCheckpoints, seek } = get();
    const nextMinute = currentSimMinute + deltaMinutes;

    // Checkpoint 1: T+05 Mooring Line Clearance
    if (
      currentSimMinute < 5 &&
      nextMinute >= 5 &&
      !approvedCheckpoints.includes("MOORING_APPROVAL")
    ) {
      seek(5);
      set({
        isPlaying: false,
        pendingCheckpoint: checkpointDefinitions.MOORING_APPROVAL,
      });
      return;
    }

    // Checkpoint 2: T+08 Crane Start Operation Clearance
    if (
      currentSimMinute < 8 &&
      nextMinute >= 8 &&
      !approvedCheckpoints.includes("CRANE_START_APPROVAL")
    ) {
      seek(8);
      set({
        isPlaying: false,
        pendingCheckpoint: checkpointDefinitions.CRANE_START_APPROVAL,
      });
      return;
    }

    seek(nextMinute);
  },

  approveCheckpoint: () => {
    const { pendingCheckpoint, approvedCheckpoints } = get();
    if (!pendingCheckpoint) return;

    set({
      approvedCheckpoints: [...approvedCheckpoints, pendingCheckpoint.id],
      pendingCheckpoint: null,
      isPlaying: true, // Auto resume simulation
    });
  },

  inspectEquipment: (data: EquipmentInspectionData | null) => {
    set({ selectedEquipment: data });
  },

  resetSimulation: () => {
    set({
      isPlaying: false,
      currentSimMinute: 0,
      clockTime: "08:00",
      speedMultiplier: 1,
      containersHandled: 0,
      productivityMovesPerHour: 0,
      craneUtilization: 0,
      truckUtilization: 0,
      isCompleted: false,
      currentEvent: simulationTimeline[0],
      eventsHistory: [simulationTimeline[0]],
      vesselPosition: simulationTimeline[0].vesselPosition,
      craneSpreaderY: simulationTimeline[0].craneSpreaderY,
      pendingCheckpoint: null,
      approvedCheckpoints: [],
      selectedEquipment: null,
    });
  },
}));
