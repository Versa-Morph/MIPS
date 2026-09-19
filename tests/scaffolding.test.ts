import { describe, it, expect } from "vitest";
import pkg from "../package.json";

describe("Project Scaffolding & Next.js 16 Configuration", () => {
  it("uses Next.js 16.x and React 19.x", () => {
    expect(pkg.dependencies.next).toMatch(/16\./);
    expect(pkg.dependencies.react).toMatch(/19\./);
    expect(pkg.dependencies["react-dom"]).toMatch(/19\./);
  });

  it("includes Zustand 5 for state management", () => {
    expect(pkg.dependencies.zustand).toMatch(/5\./);
  });

  it("includes Lucide React and Tailwind Merge utilities", () => {
    expect(pkg.dependencies["lucide-react"]).toBeDefined();
    expect(pkg.dependencies["tailwind-merge"]).toBeDefined();
  });
});
