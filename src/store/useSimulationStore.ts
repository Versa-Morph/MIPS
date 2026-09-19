import { create } from "zustand";
import { TimelineEvent } from "../types/simulation";
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

  play: () => void;
  pause: () => void;
  setSpeed: (speed: 1 | 2 | 4) => void;
  seek: (minute: number) => void;
  tick: (deltaMinutes?: number) => void;
  resetSimulation: () => void;
}

const TOTAL_SIMULATION_MINUTES = 45;
const TOTAL_CONTAINERS = 50;

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

  play: () => {
    if (get().currentSimMinute >= TOTAL_SIMULATION_MINUTES) {
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
    const { currentSimMinute, seek } = get();
    const nextMinute = currentSimMinute + deltaMinutes;
    seek(nextMinute);
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
    });
  },
}));
