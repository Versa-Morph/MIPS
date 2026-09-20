import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { DocumentCenterScreen } from "../src/components/screens/04_DocumentCenter";
import { useTrainingStore } from "../src/store/useTrainingStore";
import { TrainingState } from "../src/types/simulation";

describe("Screen 04: Document Center Pre-Arrival Clearance Dossier (PRD Image 3)", () => {
  beforeEach(() => {
    useTrainingStore.getState().resetTraining();
    useTrainingStore.getState().setStep(TrainingState.DOCUMENT_REVIEW);
  });

  it("renders 3-panel workspace with packages, PDF viewer, and Pre-Arrival Clearance Dossier", () => {
    render(<DocumentCenterScreen />);
    expect(screen.getByText(/CARGO & NOTICE PACKAGE/i)).toBeDefined();
    expect(screen.getByText(/VERIFIED SHIP DOSSIER STATUS/i)).toBeDefined();
    expect(
      screen.getAllByText(/PRE-ARRIVAL CLEARANCE DOSSIER/i).length
    ).toBeGreaterThanOrEqual(1);
  });

  it("lists all 4 package documents in left panel and renders real PDF file in center panel", () => {
    render(<DocumentCenterScreen />);
    expect(
      screen.getAllByText(/Notice of Arrival \(NOA\)/i).length
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Vessel Particulars & Registry/i)).toBeDefined();
    expect(screen.getByText(/Dangerous Goods & Cargo Manifest/i)).toBeDefined();
    expect(
      screen.getByText(/Port Bathymetry & Pelindo Master Berth Sheet/i)
    ).toBeDefined();

    const iframe = screen.getByTitle(/Notice of Arrival \(NOA\)/i);
    expect(iframe).toBeDefined();
    expect(iframe.getAttribute("src")).toContain("notice-of-arrival.pdf");
  });

  it("requires filling and submitting Pre-Arrival Dossier before unlocking PROCEED TO BERTH ASSIGNMENT", () => {
    render(<DocumentCenterScreen />);
    const proceedBtn = screen.getByRole("button", {
      name: /PROCEED TO BERTH ASSIGNMENT/i,
    });

    expect(proceedBtn.hasAttribute("disabled")).toBe(true);

    const nameInput = screen.getByPlaceholderText(/cth: MV Nusantara/i);
    const callSignInput = screen.getByPlaceholderText(/cth: PK-47A/i);
    const imoInput = screen.getByPlaceholderText(/cth: 1234567/i);
    const lastPortInput = screen.getByPlaceholderText(/cth: Singapore/i);
    const loaInput = screen.getByPlaceholderText(/cth: 280\.0/i);
    const draftInput = screen.getByPlaceholderText(/cth: 10\.20/i);
    const depthInput = screen.getByPlaceholderText(/Hitung: Draft \+ 1\.3m UKC/i);
    const ctnInput = screen.getByPlaceholderText("cth: 50");
    const reeferInput = screen.getByPlaceholderText("cth: 5");
    const dgInput = screen.getByPlaceholderText("cth: 4.1");
    const craneInput = screen.getByPlaceholderText("cth: 3");

    fireEvent.change(nameInput, { target: { value: "MV Nusantara" } });
    fireEvent.change(callSignInput, { target: { value: "PK-47A" } });
    fireEvent.change(imoInput, { target: { value: "1234567" } });
    fireEvent.change(lastPortInput, { target: { value: "Singapore" } });
    fireEvent.change(loaInput, { target: { value: "280.0" } });
    fireEvent.change(draftInput, { target: { value: "10.20" } });
    fireEvent.change(depthInput, { target: { value: "11.50" } });
    fireEvent.change(ctnInput, { target: { value: "50" } });
    fireEvent.change(reeferInput, { target: { value: "5" } });
    fireEvent.change(dgInput, { target: { value: "4.1" } });
    fireEvent.change(craneInput, { target: { value: "3" } });

    const openConfirmBtn = screen.getByRole("button", {
      name: /Submit Pre-Arrival Dossier/i,
    });
    fireEvent.click(openConfirmBtn);

    // Confirmation modal opens
    expect(screen.getByText(/PERINGATAN RESMI: PENGUNCIAN BERKAS OPERASIONAL/i)).toBeDefined();
    const confirmSubmitBtn = screen.getByRole("button", {
      name: /Ya, Kirim & Kunci Berkas Resmi/i,
    });
    fireEvent.click(confirmSubmitBtn);

    expect(screen.getByText(/PRE-ARRIVAL DOSSIER VERIFIED/i)).toBeDefined();
    expect(useTrainingStore.getState().cadetDossier.isSubmitted).toBe(true);
    expect(useTrainingStore.getState().cadetDossier.score).toBe(20);

    expect(screen.getByText(/BERKAS RESMI DIKUNCI \(FINAL SUBMISSION\)/i)).toBeDefined();

    expect(proceedBtn.hasAttribute("disabled")).toBe(false);

    fireEvent.click(proceedBtn);
    expect(useTrainingStore.getState().currentState).toBe(
      TrainingState.DECISION
    );
  });
});
