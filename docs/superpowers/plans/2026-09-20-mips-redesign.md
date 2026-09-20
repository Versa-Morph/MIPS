# MIPS Visual Redesign & Modernization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the MIPS (Maritime Integrated Port Simulator) frontend into a high-end, world-class Maritime Command Console (Tactical HUD Glassmorphic System) featuring Plus Jakarta Sans and JetBrains Mono typography, custom oceanic color tokens, cinematic visual assets, and modernized layouts across all 7 screens.

**Architecture:** A unified design system layer (`tailwind.config.ts`, `globals.css`, `layout.tsx`) establishes the foundation with custom tokens, Google fonts, and glassmorphic utilities. Production-grade visual assets in `public/images/` provide photorealistic maritime imagery. The 7 screen components are incrementally updated in pairs, preserving 100% of existing state machine logic (`useTrainingStore`, `useSimulationStore`) and passing all existing Vitest test suites.

**Tech Stack:** Next.js 16.3.5 (App Router, Turbopack), React 19, Tailwind CSS, Leaflet 1.9, Lucide React, Google Fonts (`Plus_Jakarta_Sans`, `JetBrains_Mono`), Vitest.

## Global Constraints

- **Design Personality:** Modern Maritime Tactical HUD Glassmorphism (`#030712` abyssal navy, `rgba(13, 27, 49, 0.70)` glass panels, `#F59E0B` electric amber, `#00E5FF` / `#38BDF8` tactical cyan, `#10B981` safety emerald).
- **Typography:** `Plus Jakarta Sans` for UI, headings, and labels; `JetBrains Mono` for all numbers, coordinates, timestamps, and metrics.
- **Zero Backend Dependency:** 100% client-side reactive state; no SQLite, PostgreSQL, or external backend services.
- **State Machine Immutability:** Never modify `useTrainingStore.ts` or `useSimulationStore.ts` state contracts or validation logic.
- **Zero Test Regressions:** All 46 existing tests across 14 test files must pass on every task commit.
- **Production Build Cleanliness:** `npm run build` must compile with 0 errors and 0 warnings.

---

## File Structure Map

```
mips/
├── src/
│   ├── app/
│   │   ├── layout.tsx                     # Task 1: Google fonts integration (Jakarta + JetBrains)
│   │   ├── globals.css                    # Task 1: Radial gradient background, glassmorphism utilities
│   │   └── page.tsx                       # Verified layout router
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.tsx                 # Task 6: Modern tactical header with glass styling
│   │   │   ├── ProgressBar.tsx            # Task 6: Illuminated progress stepper with cyan accents
│   │   │   └── Modal.tsx                  # Task 4: Glassmorphic official document modal
│   │   ├── screens/
│   │   │   ├── 01_Dashboard.tsx           # Task 3: Bento Grid layout with hero vessel card
│   │   │   ├── 02_ScenarioCard.tsx        # Task 3: 2-column executive overview with vessel specs
│   │   │   ├── 03_Briefing.tsx            # Task 4: Executive briefing room with officer portrait
│   │   │   ├── 04_DocumentCenter.tsx      # Task 4: Unified 3-panel workspace with focus styling
│   │   │   ├── 05_BerthDecision.tsx       # Task 5: Interactive comparison matrix & depth gauges
│   │   │   ├── 06_SimulationView.tsx      # Task 5: VTS command cockpit layout
│   │   │   └── 07_AssessmentView.tsx      # Task 6: Executive certification scorecard with gold seal
│   │   └── simulation/
│   │       ├── InteractivePortMap.tsx     # Task 5: Enhanced photorealistic SVG vessel & quayside cranes
│   │       ├── SimulationControls.tsx     # Task 5: Tactical glass controls
│   │       ├── EventTimeline.tsx          # Task 5: Monospace event log with glowing badges
│   │       └── KPIDashboard.tsx           # Task 5: Telemetry meters with cyan accents
├── public/
│   └── images/                            # Task 2: High-res visual assets
│       ├── vessel-hero.png
│       ├── officer-gunawan.png
│       ├── terminal-panorama.png
│       └── seal-competency.png
├── tailwind.config.ts                     # Task 1: Maritime tactical color tokens & font mappings
└── tests/                                 # All tasks: Verification test suites
```

---

### Task 1: Typography System & Design Token Configuration

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `tailwind.config.ts`
- Modify: `src/app/globals.css`
- Test: `tests/e2eFlow.test.tsx`

**Interfaces:**
- Produces: CSS font variables `--font-jakarta`, `--font-jetbrains-mono`, and custom Tailwind utility classes: `bg-abyssal`, `bg-glass`, `text-tactical-cyan`, `border-glass-border`.

- [ ] **Step 1: Update `src/app/layout.tsx` with Google Fonts**

```tsx
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MIPS — Maritime Integrated Port Simulator",
  description: "Taruna Training Simulation Demo - Operational Port Berthing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${jakarta.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Configure custom maritime color tokens in `tailwind.config.ts`**

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        abyssal: "#030712",
        "abyssal-surface": "#081325",
        "glass-panel": "rgba(13, 27, 49, 0.70)",
        "glass-border": "rgba(51, 65, 85, 0.60)",
        "glass-highlight": "rgba(148, 163, 184, 0.15)",
        "tactical-cyan": "#00E5FF",
        "tactical-cyan-dim": "#0284C7",
        "electric-amber": "#F59E0B",
        "electric-amber-hover": "#D97706",
        "safety-emerald": "#10B981",
        "hazard-crimson": "#EF4444",
        maritime: {
          gold: "#F59E0B",
          "gold-hover": "#D97706",
          navy: "#081325",
          hud: "#030712",
          cyan: "#00E5FF",
          telemetry: "#38BDF8",
          quay: "#334155",
          apron: "#1E293B",
          surface: "#F8FAFC",
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        "cyan-glow": "0 0 15px rgba(0, 229, 255, 0.25)",
        "amber-glow": "0 0 15px rgba(245, 158, 11, 0.25)",
        "emerald-glow": "0 0 15px rgba(16, 185, 129, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 3: Update `src/app/globals.css` with radial gradient & glassmorphic utility classes**

```css
@import "leaflet/dist/leaflet.css";

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #030712;
  --foreground: #f8fafc;
}

body {
  color: var(--foreground);
  background: radial-gradient(ellipse at 50% 0%, #0c1c38 0%, #030712 70%);
  background-attachment: fixed;
  font-feature-settings: "rlig" 1, "calt" 1;
}

/* Glassmorphic Panel Utility */
.glass-panel {
  background: rgba(13, 27, 49, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(51, 65, 85, 0.6);
  border-top: 1px solid rgba(148, 163, 184, 0.3);
}

.glass-panel-interactive {
  background: rgba(13, 27, 49, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(51, 65, 85, 0.6);
  border-top: 1px solid rgba(148, 163, 184, 0.3);
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.glass-panel-interactive:hover {
  border-color: rgba(0, 229, 255, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 12px 30px -10px rgba(0, 229, 255, 0.15);
}

/* Custom scrollbars for telemetry feeds and logs */
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

::-webkit-scrollbar-track {
  background: #030712;
}

::-webkit-scrollbar-thumb {
  background: #1e293b;
  border-radius: 9999px;
  border: 1px solid #334155;
}

::-webkit-scrollbar-thumb:hover {
  background: #00e5ff;
}
```

- [ ] **Step 4: Verify compilation & run test suite**

Run: `npx tsc --noEmit && npx vitest run`
Expected: 46/46 tests PASS, 0 TypeScript errors.

- [ ] **Step 5: Commit changes**

```bash
git add src/app/layout.tsx tailwind.config.ts src/app/globals.css
git commit -m "feat(design-system): configure Google fonts, maritime tactical tokens, and glassmorphism"
```

---

### Task 2: Production-Grade Visual Assets Generation & Integration

**Files:**
- Create: `public/images/vessel-hero.png`
- Create: `public/images/officer-gunawan.png`
- Create: `public/images/terminal-panorama.png`
- Create: `public/images/seal-competency.png`
- Create: `scripts/generate-assets.mjs` (Self-contained high-fidelity asset generator using node-canvas / pure SVG-to-raster fallback to guarantee zero external dependency failure)
- Test: Verify all 4 images exist in `public/images/` and are > 0 bytes.

- [ ] **Step 1: Create the automated asset generator script `scripts/generate-assets.mjs`**

This script creates photorealistic maritime artwork saved directly to `public/images/`:
- `vessel-hero.png`: Dramatic 3D container ship silhouette with golden-hour lighting and container stacks.
- `officer-gunawan.png`: Formal portrait of Capt. H. Gunawan in merchant marine uniform with gold epaulettes.
- `terminal-panorama.png`: Aerial dusk view of Tanjung Priok container terminal under floodlights.
- `seal-competency.png`: Embossed circular gold maritime competency verification seal.

- [ ] **Step 2: Run asset generation script**

Run: `node scripts/generate-assets.mjs`
Expected: 4 PNG files generated in `public/images/`.

- [ ] **Step 3: Verify assets exist and are valid PNG images**

Run: `ls -lh public/images/*.png`
Expected: 4 files listed, all > 5KB.

- [ ] **Step 4: Commit assets**

```bash
git add public/images/*.png scripts/generate-assets.mjs
git commit -m "feat(assets): generate photorealistic maritime assets (vessel, officer, terminal, seal)"
```

---

### Task 3: Redesign Screen 01 (Dashboard) & Screen 02 (Scenario Overview)

**Files:**
- Modify: `src/components/screens/01_Dashboard.tsx`
- Modify: `src/components/screens/02_ScenarioCard.tsx`
- Test: `tests/dashboard.test.tsx`, `tests/scenarioCard.test.tsx`

- [ ] **Step 1: Redesign `src/components/screens/01_Dashboard.tsx`**

Features:
- Bento Grid layout with `vessel-hero.png` as backdrop for the active assignment card.
- Circular progress ring with animated stroke for 1/3 completed.
- Glowing cyan pill badges for active status.
- Glassmorphic panels with subtle hover lift.
- Preserve all existing texts (`MIPS TRAINING CENTER`, `Welcome, Cadet`, `Container Vessel Arrival & Berthing Operation`, `Start Training`).

- [ ] **Step 2: Redesign `src/components/screens/02_ScenarioCard.tsx`**

Features:
- Integrated header banner with `vessel-hero.png` vignette.
- 2-Column layout: Objectives on the left, tabular monospace vessel specifications on the right (LOA 280m, Draft 10.2m, 50 TEU).
- Interactive parameter cards with custom tactical icons.
- Prominent Electric Amber CTA button `[ START TRAINING ]`.

- [ ] **Step 3: Run tests to verify zero regressions**

Run: `npx vitest run tests/dashboard.test.tsx tests/scenarioCard.test.tsx`
Expected: All tests PASS.

- [ ] **Step 4: Commit Screen 01 & 02 redesign**

```bash
git add src/components/screens/01_Dashboard.tsx src/components/screens/02_ScenarioCard.tsx
git commit -m "refactor(ui): modernize Dashboard and Scenario Overview with Bento Grid and hero imagery"
```

---

### Task 4: Redesign Screen 03 (Briefing) & Screen 04 (Document Center)

**Files:**
- Modify: `src/components/screens/03_Briefing.tsx`
- Modify: `src/components/screens/04_DocumentCenter.tsx`
- Modify: `src/components/common/Modal.tsx`
- Test: `tests/briefing.test.tsx`, `tests/documentCenter.test.tsx`

- [ ] **Step 1: Redesign `src/components/screens/03_Briefing.tsx`**

Features:
- Executive Briefing Room design with `officer-gunawan.png` circular portrait badge.
- Directive quote styled with vertical amber bar and official VTS dispatch stamp.
- 4-card checklist with tactical numbered indicators and illuminated checkmarks.
- Maintain existing text content for Capt. H. Gunawan, `Review Documents` button, and instructions.

- [ ] **Step 2: Redesign `src/components/screens/04_DocumentCenter.tsx`**

Features:
- Unified 3-panel workspace:
  - Left panel: Document list with custom badges, view counters, and technical summary card.
  - Center panel: PDF & Data Sheet viewer with glassmorphic tabs and full-height display.
  - Right panel: Pre-Arrival Clearance Dossier form with `focus:ring-2 focus:ring-cyan-400`, monospace inputs, locked banner without score spoiler.
- Maintain all 11 form inputs and confirmation modal integration.

- [ ] **Step 3: Redesign `src/components/common/Modal.tsx`**

Features:
- Deep oceanic backdrop blur (`bg-slate-950/90 backdrop-blur-md`).
- Glassmorphic modal container with top highlight border and rounded-2xl geometry.

- [ ] **Step 4: Run tests to verify zero regressions**

Run: `npx vitest run tests/briefing.test.tsx tests/documentCenter.test.tsx`
Expected: All tests PASS.

- [ ] **Step 5: Commit Screen 03 & 04 redesign**

```bash
git add src/components/screens/03_Briefing.tsx src/components/screens/04_DocumentCenter.tsx src/components/common/Modal.tsx
git commit -m "refactor(ui): upgrade Briefing room and Document Center to Tactical HUD Glassmorphism"
```

---

### Task 5: Redesign Screen 05 (Berth Decision) & Screen 06 (Simulation View)

**Files:**
- Modify: `src/components/screens/05_BerthDecision.tsx`
- Modify: `src/components/screens/06_SimulationView.tsx`
- Modify: `src/components/simulation/InteractivePortMap.tsx`
- Modify: `src/components/simulation/SimulationControls.tsx`
- Modify: `src/components/simulation/KPIDashboard.tsx`
- Modify: `src/components/simulation/EventTimeline.tsx`
- Test: `tests/berthDecision.test.tsx`, `tests/simulationView.test.tsx`, `tests/simulationStore.test.ts`

- [ ] **Step 1: Redesign `src/components/screens/05_BerthDecision.tsx`**

Features:
- Dynamic reference card showing cadet's submitted dossier data (LOA, Draft, UKC required).
- High-contrast comparison cards: B-01 (emerald border, depth gauge showing +0.5m UKC) vs B-02 (crimson border, depth gauge showing 2.5m deficit).
- Maintain `DECISION ACCEPTED` / `REVIEW REQUIRED` states and What-If modal.

- [ ] **Step 2: Modernize `src/components/simulation/InteractivePortMap.tsx`**

Features:
- Refined SVG vessel graphic for *MV Nusantara* with pointed bow, multi-colored container stacks, and glowing waterline buffer.
- Photorealistic quayside crane markers with illuminated operating indicators.
- Terminal tractor markers with payload indicators.
- Dark theme tile tuning and styled popup cards.

- [ ] **Step 3: Modernize `SimulationControls.tsx`, `KPIDashboard.tsx`, and `EventTimeline.tsx`**

Features:
- `SimulationControls`: Glassmorphic scrubber, speed multiplier pills, large JetBrains Mono time display.
- `KPIDashboard`: Neon cyan telemetry meters, gradient progress bars for container handling.
- `EventTimeline`: Glowing category badges (NAVIGATION in cyan, MOORING in amber, CRANE in emerald, TRUCK in yellow).

- [ ] **Step 4: Redesign `src/components/screens/06_SimulationView.tsx`**

Features:
- VTS Command Cockpit layout with top bar, left decision & controls panel, center GIS map, and bottom timeline/KPI monitors.
- Radio telegram styling for T+10 and T+15 dispatch clearance modals.

- [ ] **Step 5: Run tests to verify zero regressions**

Run: `npx vitest run tests/berthDecision.test.tsx tests/simulationView.test.tsx tests/simulationStore.test.ts`
Expected: All tests PASS.

- [ ] **Step 6: Commit Screen 05 & 06 redesign**

```bash
git add src/components/screens/05_BerthDecision.tsx src/components/screens/06_SimulationView.tsx src/components/simulation/*
git commit -m "refactor(ui): transform Berth Decision and Simulation Cockpit into high-end tactical console"
```

---

### Task 6: Redesign Screen 07 (Assessment), Header, Stepper & Full Verification

**Files:**
- Modify: `src/components/screens/07_AssessmentView.tsx`
- Modify: `src/components/common/Header.tsx`
- Modify: `src/components/common/ProgressBar.tsx`
- Test: `tests/assessmentView.test.tsx`, `tests/e2eFlow.test.tsx`

- [ ] **Step 1: Redesign `src/components/screens/07_AssessmentView.tsx`**

Features:
- Executive certification header with `seal-competency.png` embossed gold emblem.
- Large `92 / 100` score with glowing radial gradient.
- 4-Pillar breakdown grid with modern gradient progress meters (Document Review 20/20, Berth Decision 40/40, Operation 18/20, KPI 14/20).
- Operational statistics grid in clean tabular monospace layout.
- Formal debriefing card signed by Capt. H. Gunawan.
- Replay and return action buttons.

- [ ] **Step 2: Modernize `src/components/common/Header.tsx` & `src/components/common/ProgressBar.tsx`**

Features:
- `Header.tsx`: Deep navy glass banner with MIPS logo mark, cadet avatar pill, and live simulator status.
- `ProgressBar.tsx`: Illuminated connecting track with glowing cyan pulses on the active phase and emerald checkmarks on completed phases.

- [ ] **Step 3: Run complete automated test suite**

Run: `npx vitest run`
Expected: 46/46 tests PASS across all 14 test suites.

- [ ] **Step 4: Run production build verification**

Run: `npm run build`
Expected: Turbopack compile successful with 0 errors and 0 warnings.

- [ ] **Step 5: Commit Screen 07, Header, Stepper, and final redesign**

```bash
git add src/components/screens/07_AssessmentView.tsx src/components/common/Header.tsx src/components/common/ProgressBar.tsx
git commit -m "feat(ui): complete executive Assessment view and polished command center navigation"
```
