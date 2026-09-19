import { create } from "zustand";
import { TrainingState } from "../types/simulation";
import { DocumentType, OperationalDocument, TrainingScenario } from "../types/domain";
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

export interface TrainingStoreState {
  currentState: TrainingState;
  scenario: TrainingScenario;
  documents: OperationalDocument[];
  selectedBerth: string | null;
  decisionAttempts: number;
  isFirstAttemptCorrect: boolean;
  cadetName: string;
  activeDocumentModal: DocumentType | null;

  setStep: (step: TrainingState) => void;
  openDocumentModal: (type: DocumentType | null) => void;
  markDocumentViewed: (type: DocumentType, durationSeconds?: number) => void;
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
    });
  },
}));
