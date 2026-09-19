import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { LoginScreen } from "../src/components/screens/00_LoginScreen";
import { useTrainingStore } from "../src/store/useTrainingStore";
import { TrainingState } from "../src/types/simulation";

describe("Screen 00: Cadet Portal Login", () => {
  beforeEach(() => {
    useTrainingStore.getState().logoutCadet();
  });

  it("renders Cadet Identification Portal with title and input fields", () => {
    render(<LoginScreen />);
    expect(screen.getByText(/Cadet Identification Portal/i)).toBeDefined();
    expect(screen.getByText(/Nama Lengkap Taruna/i)).toBeDefined();
    expect(screen.getByText(/Nomor Induk Taruna \(NRP\)/i)).toBeDefined();
    expect(screen.getByText(/Jurusan \/ Program Studi/i)).toBeDefined();
    expect(screen.getByText(/Angkatan \/ Batch Pelatihan/i)).toBeDefined();
    expect(
      screen.getByRole("button", { name: /1-Click Quick Demo Login/i })
    ).toBeDefined();
  });

  it("authenticates instantly using Quick Demo Login", () => {
    render(<LoginScreen />);
    const quickDemoBtn = screen.getByRole("button", {
      name: /1-Click Quick Demo Login/i,
    });
    fireEvent.click(quickDemoBtn);

    const state = useTrainingStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.cadetName).toBe("Cadet Pratama");
    expect(state.cadetNrp).toBe("TRN-2026-047");
    expect(state.currentState).toBe(TrainingState.DASHBOARD);
  });

  it("supports manual credentials submission", () => {
    render(<LoginScreen />);
    const nameInput = screen.getByPlaceholderText(/Contoh: Cadet Pratama/i);
    const nrpInput = screen.getByPlaceholderText(/Contoh: TRN-2026-047/i);

    fireEvent.change(nameInput, { target: { value: "Cadet Budi Santoso" } });
    fireEvent.change(nrpInput, { target: { value: "TRN-2026-088" } });

    const submitBtn = screen.getByRole("button", {
      name: /Masuk Sesi Pelatihan/i,
    });
    fireEvent.click(submitBtn);

    const state = useTrainingStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.cadetName).toBe("Cadet Budi Santoso");
    expect(state.cadetNrp).toBe("TRN-2026-088");
    expect(state.currentState).toBe(TrainingState.DASHBOARD);
  });

  it("shows error if required fields are cleared", () => {
    render(<LoginScreen />);
    const nameInput = screen.getByPlaceholderText(/Contoh: Cadet Pratama/i);
    fireEvent.change(nameInput, { target: { value: "" } });

    const submitBtn = screen.getByRole("button", {
      name: /Masuk Sesi Pelatihan/i,
    });
    fireEvent.click(submitBtn);

    expect(
      screen.getByText(/Nama lengkap taruna wajib diisi/i)
    ).toBeDefined();
    expect(useTrainingStore.getState().isAuthenticated).toBe(false);
  });
});
