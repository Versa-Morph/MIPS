import { create } from "zustand";
import { TrainingState } from "../types/simulation";
import {
  DocumentType,
  OperationalDocument,
  TrainingScenario,
  CadetDossier,
} from "../types/domain";
import { initialDocuments } from "../data/documentsData";
import {
  trainingScenario,
  vesselMVNusantara,
  berths,
} from "../data/scenarioData";

export interface DecisionResult {
  isValid: boolean;
  feedback: string;
  loaCompatible: boolean;
  draftCompatible: boolean;
}

export const initialCadetDossier: CadetDossier = {
  vesselName: "",
  callSign: "",
  imoNumber: "",
  lastPort: "",
  loa: "",
  draftAft: "",
  requiredDepth: "",
  totalContainers: "",
  reeferUnits: "",
  dgClass: "",
  minCranes: "",
  isSubmitted: false,
  score: 0,
};

export interface TrainingStoreState {
  currentState: TrainingState;
  scenario: TrainingScenario;
  documents: OperationalDocument[];
  selectedBerth: string | null;
  decisionAttempts: number;
  isFirstAttemptCorrect: boolean;
  cadetName: string;
  activeDocumentModal: DocumentType | null;
  cadetDossier: CadetDossier;

  setStep: (step: TrainingState) => void;
  openDocumentModal: (type: DocumentType | null) => void;
  markDocumentViewed: (type: DocumentType, durationSeconds?: number) => void;
  submitCadetDossier: (dossier: Omit<CadetDossier, "isSubmitted" | "score">) => {
    score: number;
    feedback: string;
  };
  submitBerthDecision: (berthId: string) => DecisionResult;
  resetTraining: () => void;
}

export const useTrainingStore = create<TrainingStoreState>((set, get) => ({
  currentState: TrainingState.DASHBOARD,
  scenario: trainingScenario,
  documents: JSON.parse(JSON.stringify(initialDocuments)),
  selectedBerth: null,
  decisionAttempts: 0,
  isFirstAttemptCorrect: false,
  cadetName: "Cadet",
  activeDocumentModal: null,
  cadetDossier: { ...initialCadetDossier },

  setStep: (step: TrainingState) => {
    set({ currentState: step });
  },

  openDocumentModal: (type: DocumentType | null) => {
    set({ activeDocumentModal: type });
  },

  markDocumentViewed: (type: DocumentType, durationSeconds = 10) => {
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.type === type
          ? {
              ...doc,
              isViewed: true,
              viewDurationSeconds: doc.viewDurationSeconds + durationSeconds,
            }
          : doc
      ),
    }));
  },

  submitCadetDossier: (dossier) => {
    let earned = 0;

    const nameMatch = dossier.vesselName.toLowerCase().includes("nusantara");
    const callSignMatch = dossier.callSign.toLowerCase().replace(/[^a-z0-9]/g, "").includes("pk47");
    const imoMatch = dossier.imoNumber.trim().includes("1234567");
    const portMatch =
      dossier.lastPort.toLowerCase().includes("singapore") ||
      dossier.lastPort.toLowerCase().includes("sgsin");
    if (nameMatch) earned += 1.5;
    if (callSignMatch) earned += 1.5;
    if (imoMatch) earned += 1.0;
    if (portMatch) earned += 1.0;

    const loaVal = parseFloat(dossier.loa.replace(",", "."));
    const draftVal = parseFloat(dossier.draftAft.replace(",", "."));
    if (loaVal === 280 || loaVal === 280.0) earned += 2.5;
    if (draftVal === 10.2 || draftVal === 10.20) earned += 2.5;

    const depthVal = parseFloat(dossier.requiredDepth.replace(",", "."));
    if (depthVal === 11.5 || depthVal === 11.50) earned += 5.0;

    const ctnVal = parseInt(dossier.totalContainers, 10);
    const reeferVal = parseInt(dossier.reeferUnits, 10);
    const dgMatch =
      dossier.dgClass.includes("4.1") ||
      dossier.dgClass.toLowerCase().includes("flammable");
    const craneVal = parseInt(dossier.minCranes, 10);
    if (ctnVal === 50) earned += 1.5;
    if (reeferVal === 5) earned += 1.5;
    if (dgMatch) earned += 1.0;
    if (craneVal >= 3 && craneVal <= 4) earned += 1.0;

    const finalScore = Math.round(earned);

    set({
      cadetDossier: {
        ...dossier,
        isSubmitted: true,
        score: finalScore,
      },
    });

    return {
      score: finalScore,
      feedback:
        finalScore >= 18
          ? "✓ PRE-ARRIVAL DOSSIER VERIFIED: Seluruh parameter kapal dan keselamatan navigasi tercatat akurat."
          : `⚠ CATATAN VERIFIKASI: Skor evaluasi dokumen ${finalScore}/20. Beberapa data teknis tidak cocok dengan berkas resmi.`,
    };
  },

  submitBerthDecision: (berthId: string): DecisionResult => {
    const { decisionAttempts } = get();
    const attempts = decisionAttempts + 1;
    const targetBerth = berths.find((b) => b.id === berthId);

    if (!targetBerth) {
      return {
        isValid: false,
        feedback: "Invalid berth selected.",
        loaCompatible: false,
        draftCompatible: false,
      };
    }

    const loaCompatible = targetBerth.maxLoa >= vesselMVNusantara.loa;
    const draftCompatible = targetBerth.maxDraft >= vesselMVNusantara.draft;
    const isValid = loaCompatible && draftCompatible;

    if (isValid) {
      set({
        selectedBerth: berthId,
        decisionAttempts: attempts,
        isFirstAttemptCorrect: attempts === 1,
        currentState: TrainingState.DECISION_VALIDATED,
      });

      return {
        isValid: true,
        feedback: `✓ DECISION ACCEPTED: B-01 is compatible with the vessel's LOA and draft requirements. You may proceed to simulation.`,
        loaCompatible: true,
        draftCompatible: true,
      };
    } else {
      set({
        selectedBerth: berthId,
        decisionAttempts: attempts,
        isFirstAttemptCorrect: false,
        currentState: TrainingState.DECISION,
      });

      return {
        isValid: false,
        feedback: `! REVIEW REQUIRED: The selected berth does not meet the vessel requirements. Review the Berth Information document and try again.`,
        loaCompatible,
        draftCompatible,
      };
    }
  },

  resetTraining: () => {
    set({
      currentState: TrainingState.DASHBOARD,
      documents: JSON.parse(JSON.stringify(initialDocuments)),
      selectedBerth: null,
      decisionAttempts: 0,
      isFirstAttemptCorrect: false,
      activeDocumentModal: null,
      cadetDossier: { ...initialCadetDossier },
    });
  },
}));
