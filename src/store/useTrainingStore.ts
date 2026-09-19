import { create } from "zustand";
import { TrainingState } from "../types/simulation";
import { DocumentType, OperationalDocument, TrainingScenario } from "../types/domain";
import { initialDocuments } from "../data/documentsData";
import {
  trainingScenario,
  vesselMVNusantara,
  berths,
  availableScenarios,
} from "../data/scenarioData";

export interface DecisionResult {
  isValid: boolean;
  feedback: string;
  loaCompatible: boolean;
  draftCompatible: boolean;
}

export interface TrainingStoreState {
  currentState: TrainingState;
  scenario: TrainingScenario;
  documents: OperationalDocument[];
  selectedBerth: string | null;
  decisionAttempts: number;
  isFirstAttemptCorrect: boolean;
  cadetName: string;
  cadetBatch: string;
  cadetNrp: string;
  cadetDepartment: string;
  isAuthenticated: boolean;
  activeDocumentModal: DocumentType | null;

  setStep: (step: TrainingState) => void;
  openDocumentModal: (type: DocumentType | null) => void;
  markDocumentViewed: (type: DocumentType, durationSeconds?: number) => void;
  submitBerthDecision: (berthId: string) => DecisionResult;
  loginCadet: (name: string, nrp: string, department: string, batch?: string) => void;
  logoutCadet: () => void;
  selectScenario: (scenarioId: string) => void;
  resetTraining: () => void;
}

export const useTrainingStore = create<TrainingStoreState>((set, get) => ({
  currentState: TrainingState.LOGIN,
  scenario: trainingScenario,
  documents: JSON.parse(JSON.stringify(initialDocuments)),
  selectedBerth: null,
  decisionAttempts: 0,
  isFirstAttemptCorrect: false,
  cadetName: "Cadet Pratama",
  cadetBatch: "Batch 47 · Deck Dept",
  cadetNrp: "TRN-2026-047",
  cadetDepartment: "Deck Department (Nautika)",
  isAuthenticated: false,
  activeDocumentModal: null,

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
        feedback: `✓ DECISION ACCEPTED: ${targetBerth.name} is fully compatible with MV Nusantara's LOA (${vesselMVNusantara.loa}m <= ${targetBerth.maxLoa}m) and Draft (${vesselMVNusantara.draft}m <= ${targetBerth.maxDraft}m). Proceed to simulation.`,
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
        feedback: `⚠ REVIEW REQUIRED: ${targetBerth.name} does not meet vessel physical requirements. Vessel exceeds limits (LOA ${vesselMVNusantara.loa}m vs Max ${targetBerth.maxLoa}m, Draft ${vesselMVNusantara.draft}m vs Max ${targetBerth.maxDraft}m). Review the Berth Information document and try again.`,
        loaCompatible,
        draftCompatible,
      };
    }
  },

  loginCadet: (
    name: string,
    nrp: string,
    department: string,
    batch = "Batch 47 (2026)"
  ) => {
    set({
      cadetName: name.trim() || "Cadet Pratama",
      cadetNrp: nrp.trim() || "TRN-2026-047",
      cadetDepartment: department,
      cadetBatch: `${batch} · ${department.split(" ")[0]}`,
      isAuthenticated: true,
      currentState: TrainingState.DASHBOARD,
    });
  },

  logoutCadet: () => {
    set({
      isAuthenticated: false,
      currentState: TrainingState.LOGIN,
      selectedBerth: null,
      decisionAttempts: 0,
      isFirstAttemptCorrect: false,
      documents: JSON.parse(JSON.stringify(initialDocuments)),
      activeDocumentModal: null,
    });
  },

  selectScenario: (scenarioId: string) => {
    const found = availableScenarios.find((s) => s.id === scenarioId);
    if (found) {
      set({
        scenario: found,
        selectedBerth: null,
        decisionAttempts: 0,
        isFirstAttemptCorrect: false,
        currentState: TrainingState.SCENARIO_SELECTION,
      });
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
    });
  },
}));
