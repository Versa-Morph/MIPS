export type DocumentType =
  | "ARRIVAL_NOTICE"
  | "VESSEL_MANIFEST"
  | "CARGO_MANIFEST"
  | "BERTH_INFORMATION";

export interface Vessel {
  id: string;
  name: string;
  imo: string;
  loa: number; // Length Overall (meters) - 280m
  beam: number; // Breadth Moulded (meters) - 32.2m
  draft: number; // Arrival Draft (meters) - 10.2m
  fwdDraft?: number; // 9.8m
  aftDraft?: number; // 10.2m
  eta: string; // "08:00"
  totalCargoCount: number; // 50 Containers
  flag: string; // "Indonesia"
  callSign: string; // "PK-47A"
}

export interface Berth {
  id: string; // "B-01" | "B-02"
  name: string;
  maxLoa: number; // 300m vs 250m
  maxDraft: number; // 12.0m vs 9.0m
  status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE";
  bollards: number;
  craneCount: number;
  craneType: string;
  description: string;
}

export interface CargoManifestDetail {
  totalContainers: number; // 50
  importUnits: number; // 30
  exportUnits: number; // 20
  reeferUnits: number; // 5
  dangerousUnits: number; // 0
  twentyFoot: number; // 35
  fortyFoot: number; // 15
}

export interface OperationalDocument {
  id: string;
  type: DocumentType;
  title: string;
  referenceNumber: string;
  isViewed: boolean;
  viewDurationSeconds: number;
  summary: string;
  pdfUrl?: string;
  content: {
    header: string;
    issuer: string;
    date: string;
    details: Record<string, string | number>;
    notes?: string[];
    officialStampText?: string;
  };
}

export interface TrainingScenario {
  id: string;
  name: string;
  difficulty: "Basic" | "Intermediate" | "Advanced";
  duration: string;
  objective: string;
  description: string;
  vessel: Vessel;
  availableBerths: Berth[];
}
