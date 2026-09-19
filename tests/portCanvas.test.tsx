import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import React from "react";
import { PortCanvas } from "../src/components/simulation/PortCanvas";

describe("Screen 06: PortCanvas 2D SVG Component", () => {
  it("renders SVG canvas with 1000x560 viewBox and berth zones", () => {
    const { container } = render(<PortCanvas />);
    const svg = container.querySelector("svg");
    expect(svg).toBeDefined();
    expect(svg?.getAttribute("viewBox")).toBe("0 0 1000 560");
  });

  it("renders both Berth B-01 and Berth B-02 labels", () => {
    const { getByText } = render(<PortCanvas />);
    expect(getByText(/BERTH B-01/i)).toBeDefined();
    expect(getByText(/BERTH B-02/i)).toBeDefined();
  });

  it("renders quay cranes QC-01 and QC-02", () => {
    const { getByText } = render(<PortCanvas />);
    expect(getByText("QC-01")).toBeDefined();
    expect(getByText("QC-02")).toBeDefined();
  });
});
