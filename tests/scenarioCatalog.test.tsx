import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { ScenarioCatalogScreen } from "../src/components/screens/00_ScenarioCatalog";
import { useTrainingStore } from "../src/store/useTrainingStore";
import { useThemeStore } from "../src/store/useThemeStore";
import { TrainingState } from "../src/types/simulation";

describe("Screen 00 - Scenario Catalog & Portal Management", () => {
  beforeEach(() => {
    useTrainingStore.getState().resetTraining();
  });

  it("renders scenario catalog hero banner and accredited STCW badge", () => {
    render(<ScenarioCatalogScreen />);
    expect(screen.getByText(/Pilih Skenario Pelatihan Port & Navigasi/i)).toBeDefined();
    expect(screen.getByText(/STCW A-I\/12 ACCREDITED/i)).toBeDefined();
  });

  it("renders all 4 scenarios initially (MV Nusantara, Samudera Indah, Nusantara Chemical, Merak Express)", () => {
    render(<ScenarioCatalogScreen />);
    expect(screen.getAllByText(/MV Nusantara/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/MV Samudera Indah/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/MT Nusantara Chemical/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/KMP Merak Express/i).length).toBeGreaterThanOrEqual(1);
  });

  it("filters scenarios correctly using live search input", () => {
    render(<ScenarioCatalogScreen />);
    const searchInput = screen.getByPlaceholderText(/Cari kapal/i);

    fireEvent.change(searchInput, { target: { value: "Chemical" } });
    expect(screen.getAllByText(/MT Nusantara Chemical/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText(/MV Samudera Indah/i)).toBeNull();
  });

  it("navigates back to Dashboard when Kembali ke Dashboard button is clicked", () => {
    useTrainingStore.setState({ currentState: TrainingState.SCENARIO_CATALOG });
    render(<ScenarioCatalogScreen />);

    const backButton = screen.getByRole("button", {
      name: /Kembali ke Dashboard/i,
    });
    fireEvent.click(backButton);

    expect(useTrainingStore.getState().currentState).toBe(TrainingState.DASHBOARD);
  });

  it("launches SCN-001 directly into SCENARIO_SELECTION", () => {
    render(<ScenarioCatalogScreen />);
    const startButtons = screen.getAllByRole("button", {
      name: /Mulai Simulasi/i,
    });
    fireEvent.click(startButtons[0]);

    expect(useTrainingStore.getState().currentState).toBe(
      TrainingState.SCENARIO_SELECTION
    );
  });

  it("opens calibration dialog when clicking non-active SCN-002", () => {
    render(<ScenarioCatalogScreen />);
    const startButtons = screen.getAllByRole("button", {
      name: /Mulai Simulasi/i,
    });
    // Second button belongs to SCN-002 (Bulk Carrier)
    fireEvent.click(startButtons[1]);

    expect(screen.getByText(/Skenario Dalam Kalibrasi Model Alur/i)).toBeDefined();
    expect(screen.getByText(/MODEL CALIBRATION/i)).toBeDefined();
  });
});

describe("Theme Store (Light / Dark Mode)", () => {
  it("initializes with light theme by default", () => {
    expect(useThemeStore.getState().theme).toBe("light");
  });

  it("toggles theme correctly between light and dark", () => {
    useThemeStore.getState().setTheme("light");
    expect(useThemeStore.getState().theme).toBe("light");

    useThemeStore.getState().toggleTheme();
    expect(useThemeStore.getState().theme).toBe("dark");

    useThemeStore.getState().toggleTheme();
    expect(useThemeStore.getState().theme).toBe("light");
  });
});
