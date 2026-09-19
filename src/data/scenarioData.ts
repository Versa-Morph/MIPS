import { Vessel, Berth, TrainingScenario } from "../types/domain";

export const vesselMVNusantara: Vessel = {
  id: "VESSEL-001",
  name: "MV Nusantara",
  imo: "1234567",
  loa: 280, // meters
  beam: 32.2, // meters
  draft: 10.2, // meters
  fwdDraft: 9.8,
  aftDraft: 10.2,
  eta: "08:00",
  totalCargoCount: 50,
  flag: "Indonesia",
  callSign: "PK-47A",
};

export const berths: Berth[] = [
  {
    id: "B-01",
    name: "Berth B-01 (Deepwater Terminal)",
    maxLoa: 300,
    maxDraft: 12.0,
    status: "AVAILABLE",
    bollards: 24,
    craneCount: 2,
    craneType: "Super Post-Panamax (QC-01 & QC-02)",
    description:
      "Deepwater commercial quay equipped with high-outreach twin container cranes and dedicated internal transfer lanes.",
  },
  {
    id: "B-02",
    name: "Berth B-02 (Feeder Quay)",
    maxLoa: 250,
    maxDraft: 9.0,
    status: "AVAILABLE",
    bollards: 18,
    craneCount: 2,
    craneType: "Panamax Cranes",
    description:
      "Secondary feeder quay designed for regional feeder ships with limited draft and displacement.",
  },
];

export const trainingScenario: TrainingScenario = {
  id: "SCN-001",
  name: "Container Vessel Arrival & Berthing Operation",
  difficulty: "Basic",
  duration: "~10-15 Minutes",
  objective:
    "Evaluate vessel particulars and berth specifications, approve the compliant berth allocation, and oversee automated cargo operations.",
  description:
    "MV Nusantara is arriving with 50 containers. Review operational documents, verify physical constraints (LOA and Draft), assign the suitable berth, and monitor performance KPIs.",
  vessel: vesselMVNusantara,
  availableBerths: berths,
};
