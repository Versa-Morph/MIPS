# MIPS (Maritime Integrated Port Simulator) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the MIPS Taruna Training Simulation Demo, a pedagogical Next.js web application enabling maritime cadets to review port documents, make an operational berth assignment, execute an animated port simulation, and receive a comprehensive assessment.

**Architecture:** Two-phase delivery model starting with a **Frontend-First interactive demo**. 
* **Phase 1 (Active Scope):** Client-side reactive architecture built with Next.js 16 (App Router, React 19) and TypeScript. A centralized Zustand 5 Finite State Machine orchestrates 9 pedagogical states. A deterministic scripted simulation engine runs on a normalized 45-minute timeline, driving responsive 2D SVG animations for ship berthing, quay cranes, and container trucks with real-time KPI telemetry. Self-contained with typed local fixtures.
* **Phase 2 (Subsequent Scope):** Backend API and persistence integration developed after Frontend client validation.

**Tech Stack:** Next.js 16 (App Router, React 19), TypeScript 5+, Tailwind CSS, Zustand 5, Lucide React, Vitest + React Testing Library.

## Global Constraints

- **Execution Flow:** **Frontend-First (FE First)**. The entire 7-screen interactive simulator, document center, validation, timeline motion, and scoring evaluation must run end-to-end on the frontend with zero backend dependency before starting backend development.
- **Execution Timeline:** Frontend Demo delivered in $\le 5$ working days.
- **Pedagogical Gatekeeping:** The simulation stage cannot be unlocked until the cadet submits a validated berth assignment (Berth B-01).
- **Physical Accuracy:** Vessel MV Nusantara (LOA 280m, Draft 10.2m) is compatible with Berth B-01 (Max LOA 300m, Draft 12.0m) and incompatible with Berth B-02 (Max LOA 250m, Draft 9.0m).
- **Deterministic Evaluation:** Completed run produces a target score of 92/100 across 4 weighted pillars (Document Review 20%, Berth Decision 40%, Operation Completion 20%, KPI Performance 20%).

---

### Task 1: Project Scaffolding & Next.js Foundation

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tailwind.config.ts`
- Create: `postcss.config.mjs`
- Create: `src/app/layout.tsx`
- Create: `src/app/globals.css`
- Test: `tests/scaffolding.test.ts`

**Interfaces:**
- Consumes: Node.js 18+, npm / pnpm
- Produces: Runnable Next.js project with Tailwind CSS and TypeScript configured

- [ ] **Step 1: Create package.json and install dependencies**

```json
{
  "name": "mips",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "lucide-react": "^0.460.0",
    "next": "^16.2.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwind-merge": "^2.5.4",
    "zustand": "^5.0.0"
  },
  "devDependencies": {
    "@testing-library/react": "^16.0.1",
    "@types/node": "^20.16.11",
    "@types/react": "^18.3.11",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.2",
    "autoprefixer": "^10.4.20",
    "jsdom": "^25.0.1",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.14",
    "typescript": "^5.6.3",
    "vitest": "^2.1.3"
  }
}
```

- [ ] **Step 2: Create tsconfig.json and Tailwind configuration**

Write `tsconfig.json` with `@/*` path mapping to `./src/*`, and `tailwind.config.ts` configuring the maritime operational palette (`slate-950`, `navy-900`, `sky-500`, `amber-500`, `emerald-500`).

- [ ] **Step 3: Write root layout and globals.css**

Create `src/app/layout.tsx` and `src/app/globals.css` with dark theme styling and custom scrollbars.

- [ ] **Step 4: Run test to verify basic configuration**

Run: `npx vitest run tests/scaffolding.test.ts`  
Expected: PASS

---

### Task 2: Domain Data Types & Scenario Fixtures

**Files:**
- Create: `src/types/domain.ts`
- Create: `src/types/simulation.ts`
- Create: `src/types/assessment.ts`
- Create: `src/data/scenarioData.ts`
- Create: `src/data/documentsData.ts`
- Create: `src/data/simulationTimeline.ts`
- Test: `tests/domainData.test.ts`

**Interfaces:**
- Consumes: None
- Produces: `vesselData`, `berthsData`, `documentsData`, `timelineEvents`

- [ ] **Step 1: Write test for domain models and data fixtures**

```typescript
// tests/domainData.test.ts
import { describe, it, expect } from 'vitest';
import { vesselMVNusantara, berths } from '../src/data/scenarioData';
import { initialDocuments } from '../src/data/documentsData';
import { simulationTimeline } from '../src/data/simulationTimeline';

describe('Domain Data Integrity', () => {
  it('defines MV Nusantara with correct LOA and draft', () => {
    expect(vesselMVNusantara.loa).toBe(280);
    expect(vesselMVNusantara.draft).toBe(10.2);
    expect(vesselMVNusantara.totalCargoCount).toBe(50);
  });

  it('contains Berth B-01 (valid) and B-02 (invalid for MV Nusantara)', () => {
    const b01 = berths.find(b => b.id === 'B-01');
    const b02 = berths.find(b => b.id === 'B-02');
    expect(b01?.maxLoa).toBeGreaterThanOrEqual(vesselMVNusantara.loa);
    expect(b01?.maxDraft).toBeGreaterThanOrEqual(vesselMVNusantara.draft);
    expect(b02?.maxLoa).toBeLessThan(vesselMVNusantara.loa);
  });

  it('contains all 4 mandatory document packages', () => {
    expect(initialDocuments.length).toBe(4);
  });

  it('defines deterministic timeline ending at T+45 with 50 containers', () => {
    const lastEvent = simulationTimeline[simulationTimeline.length - 1];
    expect(lastEvent.timeOffsetMinutes).toBe(45);
    expect(lastEvent.containersCompleted).toBe(50);
  });
});
```

- [ ] **Step 2: Implement domain types in `src/types/`**

Write `src/types/domain.ts`, `src/types/simulation.ts`, and `src/types/assessment.ts` matching Section 4 of `docs/TECHNICAL_SPEC.md`.

- [ ] **Step 3: Implement data fixtures in `src/data/`**

Write `src/data/scenarioData.ts`, `src/data/documentsData.ts`, and `src/data/simulationTimeline.ts`.

- [ ] **Step 4: Run test to verify data integrity**

Run: `npx vitest run tests/domainData.test.ts`  
Expected: PASS

---

### Task 3: Training FSM State Store

**Files:**
- Create: `src/store/useTrainingStore.ts`
- Test: `tests/trainingStore.test.ts`

**Interfaces:**
- Consumes: `TrainingState`, `DocumentType`, `OperationalDocument`
- Produces: `useTrainingStore` hook with actions: `setStep`, `markDocumentViewed`, `submitBerthDecision`, `resetTraining`

- [ ] **Step 1: Write test for Training Store FSM**

```typescript
// tests/trainingStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useTrainingStore } from '../src/store/useTrainingStore';
import { TrainingState } from '../src/types/simulation';

describe('Training FSM Store', () => {
  beforeEach(() => {
    useTrainingStore.getState().resetTraining();
  });

  it('initializes in DASHBOARD state', () => {
    expect(useTrainingStore.getState().currentState).toBe(TrainingState.DASHBOARD);
  });

  it('transitions sequentially through steps', () => {
    useTrainingStore.getState().setStep(TrainingState.BRIEFING);
    expect(useTrainingStore.getState().currentState).toBe(TrainingState.BRIEFING);
  });

  it('records document view state and duration', () => {
    useTrainingStore.getState().markDocumentViewed('ARRIVAL_NOTICE', 15);
    const doc = useTrainingStore.getState().documents.find(d => d.type === 'ARRIVAL_NOTICE');
    expect(doc?.isViewed).toBe(true);
    expect(doc?.viewDurationSeconds).toBe(15);
  });

  it('validates correct berth selection (B-01)', () => {
    const result = useTrainingStore.getState().submitBerthDecision('B-01');
    expect(result.isValid).toBe(true);
    expect(useTrainingStore.getState().selectedBerth).toBe('B-01');
    expect(useTrainingStore.getState().currentState).toBe(TrainingState.DECISION_VALIDATED);
  });

  it('rejects invalid berth selection (B-02) without advancing FSM to validated', () => {
    const result = useTrainingStore.getState().submitBerthDecision('B-02');
    expect(result.isValid).toBe(false);
    expect(useTrainingStore.getState().currentState).toBe(TrainingState.DECISION);
    expect(useTrainingStore.getState().decisionAttempts).toBe(1);
  });
});
```

- [ ] **Step 2: Implement `src/store/useTrainingStore.ts`**

Implement Zustand store with typed state, state setters, document view tracking, decision validation, and full reset.

- [ ] **Step 3: Run test to verify store functionality**

Run: `npx vitest run tests/trainingStore.test.ts`  
Expected: PASS

---

### Task 4: Layout Shell, Header & Progress Indicator

**Files:**
- Create: `src/components/common/Header.tsx`
- Create: `src/components/common/ProgressBar.tsx`
- Modify: `src/app/layout.tsx`
- Test: `tests/layoutComponents.test.tsx`

**Interfaces:**
- Consumes: `useTrainingStore`
- Produces: Reusable navigation header and dynamic 7-step progress bar

- [ ] **Step 1: Write test for Header and ProgressBar components**

Verify header renders cadet name, training title, active step indicator, and progress bar highlights active/completed phases.

- [ ] **Step 2: Implement Header.tsx and ProgressBar.tsx**

Write components using Tailwind CSS and Lucide React icons (`Ship`, `Anchor`, `FileText`, `CheckCircle2`, `Activity`).

- [ ] **Step 3: Run test to verify rendering**

Run: `npx vitest run tests/layoutComponents.test.tsx`  
Expected: PASS

---

### Task 5: Screen 01 (Dashboard), Screen 02 (Scenario Card) & Screen 03 (Briefing)

**Files:**
- Create: `src/components/screens/01_Dashboard.tsx`
- Create: `src/components/screens/02_ScenarioCard.tsx`
- Create: `src/components/screens/03_Briefing.tsx`
- Test: `tests/introScreens.test.tsx`

**Interfaces:**
- Consumes: `useTrainingStore`
- Produces: Screen components for initial training onboarding

- [ ] **Step 1: Write test for Intro Screens**

Test transitions:
- Screen 01: Clicking `[Continue Training]` transitions state to `SCENARIO_SELECTION`.
- Screen 02: Clicking `[START TRAINING]` transitions state to `BRIEFING`.
- Screen 03: Clicking `[Review Documents]` transitions state to `DOCUMENT_REVIEW`.

- [ ] **Step 2: Implement 01_Dashboard.tsx, 02_ScenarioCard.tsx, 03_Briefing.tsx**

Render authentic academy training dashboard, scenario metadata card, and operational briefing directive with mission checklists.

- [ ] **Step 3: Run test to verify transitions**

Run: `npx vitest run tests/introScreens.test.tsx`  
Expected: PASS

---

### Task 6: Screen 04: Digital Document Center & Modal Viewer

**Files:**
- Create: `src/components/common/Modal.tsx`
- Create: `src/components/documents/ArrivalNoticeDoc.tsx`
- Create: `src/components/documents/VesselManifestDoc.tsx`
- Create: `src/components/documents/CargoManifestDoc.tsx`
- Create: `src/components/documents/BerthInfoDoc.tsx`
- Create: `src/components/screens/04_DocumentCenter.tsx`
- Test: `tests/documentCenter.test.tsx`

**Interfaces:**
- Consumes: `useTrainingStore`, `documentsData`
- Produces: Interactive document grid, modal dialog, and view tracking

- [ ] **Step 1: Write test for Document Center & Viewer**

Verify all 4 cards render, clicking a card opens the modal viewer, viewing a document sets `isViewed = true`, and clicking `[Proceed to Berth Assignment]` transitions state to `DECISION`.

- [ ] **Step 2: Implement digital document viewer components**

Build clean, styled operational document sheets (Arrival Notice, Manifests, Berth Specs) with reference stamps and official maritime document layout.

- [ ] **Step 3: Implement 04_DocumentCenter.tsx**

Wire grid display with status badges (`UNREAD` / `VIEWED`) and modal trigger.

- [ ] **Step 4: Run test to verify document review flow**

Run: `npx vitest run tests/documentCenter.test.tsx`  
Expected: PASS

---

### Task 7: Screen 05: Decision & Berth Allocation Validation Engine

**Files:**
- Create: `src/utils/validation.ts`
- Create: `src/components/screens/05_BerthDecision.tsx`
- Test: `tests/berthDecision.test.tsx`

**Interfaces:**
- Consumes: `useTrainingStore`, `vesselMVNusantara`, `berths`
- Produces: `validateBerthAssignment(berthId, vessel)` function and interactive decision UI

- [ ] **Step 1: Write test for Berth Allocation Validation**

```typescript
// tests/berthDecision.test.tsx
import { describe, it, expect } from 'vitest';
import { validateBerthAssignment } from '../src/utils/validation';
import { vesselMVNusantara, berths } from '../src/data/scenarioData';

describe('Berth Allocation Validation Logic', () => {
  it('accepts Berth B-01 since vessel fits LOA and draft', () => {
    const b01 = berths.find(b => b.id === 'B-01')!;
    const result = validateBerthAssignment(b01, vesselMVNusantara);
    expect(result.isValid).toBe(true);
    expect(result.feedback).toContain('compatible');
  });

  it('rejects Berth B-02 with explicit physical restriction warnings', () => {
    const b02 = berths.find(b => b.id === 'B-02')!;
    const result = validateBerthAssignment(b02, vesselMVNusantara);
    expect(result.isValid).toBe(false);
    expect(result.loaExceeded).toBe(true);
    expect(result.draftExceeded).toBe(true);
  });
});
```

- [ ] **Step 2: Implement `src/utils/validation.ts` and `05_BerthDecision.tsx`**

Implement comparative selection cards for B-01 and B-02. Display live feedback alert banner (Green on B-01 unlocking `[START SIMULATION]`; Amber warning on B-02 with prompt to re-read Berth Information document).

- [ ] **Step 3: Run test to verify decision validation**

Run: `npx vitest run tests/berthDecision.test.tsx`  
Expected: PASS

---

### Task 8: Simulation State Store & Deterministic Clock Engine

**Files:**
- Create: `src/store/useSimulationStore.ts`
- Test: `tests/simulationStore.test.ts`

**Interfaces:**
- Consumes: `simulationTimeline`
- Produces: `useSimulationStore` with playback controls (`play`, `pause`, `setSpeed`, `seek`, `tick`, `reset`)

- [ ] **Step 1: Write test for Simulation Clock & Event Interpolation**

Verify timer increments, speed multiplier accelerates clock ($1\times, 2\times, 4\times$), active events match time offset, container count updates, and auto-completes at $T+45$.

- [ ] **Step 2: Implement `src/store/useSimulationStore.ts`**

Implement temporal clock engine calculating elapsed simulated minutes ($0$ to $45$), active timeline slice, and accumulated KPI stats.

- [ ] **Step 3: Run test to verify clock engine**

Run: `npx vitest run tests/simulationStore.test.ts`  
Expected: PASS

---

### Task 9: Screen 06 (Part 1): 2D SVG Port Simulation Canvas

**Files:**
- Create: `src/components/simulation/PortCanvas.tsx`
- Create: `src/components/simulation/VesselGraphic.tsx`
- Create: `src/components/simulation/CraneGraphic.tsx`
- Create: `src/components/simulation/TruckGraphic.tsx`
- Test: `tests/portCanvas.test.tsx`

**Interfaces:**
- Consumes: `useSimulationStore`, coordinates from `docs/TECHNICAL_SPEC.md`
- Produces: Responsive SVG port stage with animated vessel, cranes, and trucks

- [ ] **Step 1: Write test for Port Canvas rendering**

Verify SVG element mounts with viewBox `0 0 1000 600`, renders Berth B-01 and B-02, and mounts vessel, cranes, and truck sub-components.

- [ ] **Step 2: Implement SVG graphics for Vessel, Cranes, and Trucks**

- `VesselGraphic.tsx`: Container vessel with bay grid, moving from port channel $(x:100, y:50)$ to Berth B-01 $(x:320, y:180)$.
- `CraneGraphic.tsx`: Rail-mounted quay cranes QC-01 and QC-02 with spreader hoisting animation.
- `TruckGraphic.tsx`: Terminal transfer vehicles cycling between quay apron and container yard.

- [ ] **Step 3: Implement `PortCanvas.tsx`**

Assemble the SVG stage with water basin, quay wall, bollards, crane rails, and yard stacks.

- [ ] **Step 4: Run test to verify SVG rendering**

Run: `npx vitest run tests/portCanvas.test.tsx`  
Expected: PASS

---

### Task 10: Screen 06 (Part 2): Simulation Cockpit, Timeline Log & Live KPIs

**Files:**
- Create: `src/components/simulation/EventTimeline.tsx`
- Create: `src/components/simulation/KPIDashboard.tsx`
- Create: `src/components/simulation/SimulationControls.tsx`
- Create: `src/components/screens/06_SimulationView.tsx`
- Test: `tests/simulationView.test.tsx`

**Interfaces:**
- Consumes: `useSimulationStore`, `useTrainingStore`
- Produces: Complete 3-panel simulation cockpit

- [ ] **Step 1: Write test for Simulation Cockpit**

Verify decision dossier displays B-01, timeline log lists active events up to current clock time, and KPI dashboard reflects real-time containers handled ($0 \to 50$) and productivity.

- [ ] **Step 2: Implement EventTimeline, KPIDashboard, SimulationControls**

Build auto-scrolling event log, metric gauges, and playback controls.

- [ ] **Step 3: Assemble `06_SimulationView.tsx`**

Integrate Left Dossier, Center Port Canvas, and Bottom Monitoring Deck. Auto-trigger transition to `ASSESSMENT` when timeline reaches $T+45$.

- [ ] **Step 4: Run test to verify cockpit integration**

Run: `npx vitest run tests/simulationView.test.tsx`  
Expected: PASS

---

### Task 11: Screen 07: Assessment & Scoring Calculation Engine

**Files:**
- Create: `src/utils/scoringCalculator.ts`
- Create: `src/components/screens/07_AssessmentView.tsx`
- Test: `tests/scoringCalculator.test.ts`

**Interfaces:**
- Consumes: `useTrainingStore`, `useSimulationStore`
- Produces: `calculateCadetScore()` and final Assessment Screen

- [ ] **Step 1: Write test for Scoring Engine**

```typescript
// tests/scoringCalculator.test.ts
import { describe, it, expect } from 'vitest';
import { calculateCadetScore } from '../src/utils/scoringCalculator';

describe('Cadet Scoring Calculation', () => {
  it('computes 92/100 for standard successful training run', () => {
    const result = calculateCadetScore({
      viewedDocumentCount: 4,
      totalDocumentCount: 4,
      isBerthCorrectFirstAttempt: true,
      containersCompleted: 50,
      totalContainers: 50,
      actualProductivity: 71.4,
      craneUtilPercent: 72,
      truckUtilPercent: 68
    });

    expect(result.score.documentReviewScore).toBe(20);
    expect(result.score.berthDecisionScore).toBe(40);
    expect(result.score.operationScore).toBe(18);
    expect(result.score.kpiScore).toBe(14);
    expect(result.score.totalScore).toBe(92);
    expect(result.grade).toBe('EXCELLENT');
  });
});
```

- [ ] **Step 2: Implement `src/utils/scoringCalculator.ts` and `07_AssessmentView.tsx`**

Implement formulas from Section 7 of `docs/TECHNICAL_SPEC.md`. Build scorecard view with breakdown bars, qualitative feedback, `[Review Simulation]`, and `[Back to Training Center]`.

- [ ] **Step 3: Run test to verify scoring calculations**

Run: `npx vitest run tests/scoringCalculator.test.ts`  
Expected: PASS

---

### Task 12: End-to-End Integration, Master Simulation View & Verification

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/app/simulation/page.tsx`
- Test: `tests/e2eFlow.test.tsx`

**Interfaces:**
- Consumes: All screen components and stores
- Produces: Complete end-to-end interactive training application

- [ ] **Step 1: Write test for complete end-to-end flow**

Simulate entire user journey from Dashboard $\to$ Scenario $\to$ Briefing $\to$ Document Center $\to$ Decision $\to$ Simulation $\to$ Assessment $\to$ Reset.

- [ ] **Step 2: Implement Master Simulation Controller in `src/app/simulation/page.tsx`**

Create reactive switcher rendering active screen based on `useTrainingStore.currentState`.

- [ ] **Step 3: Run test to verify complete user journey**

Run: `npx vitest run tests/e2eFlow.test.tsx`  
Expected: PASS

- [ ] **Step 4: Run production build verification**

Run: `npm run build`  
Expected: Build succeeds with 0 TypeScript errors and 0 warnings.
