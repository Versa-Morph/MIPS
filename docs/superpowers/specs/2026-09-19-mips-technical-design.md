# MIPS (Maritime Integrated Port Simulator) — Technical Specification & System Design

**Version:** 1.2  
**Project:** MIPS Taruna Training Simulation Demo  
**Target Delivery:** $\le 5$ Working Days  
**Primary Framework:** Next.js 16 (App Router, React 19, TypeScript 5, Tailwind CSS)  
**Document Type:** Comprehensive Architecture & Implementation Specification  

---

## 1. System Overview & Architectural Principles

MIPS is a pedagogical simulation environment designed for maritime cadets (*Taruna*). Unlike standard passive demonstration simulators, MIPS enforces an active pedagogical loop:

$$\text{\bf Learn} \longrightarrow \text{\bf Document Analysis} \longrightarrow \text{\bf Decision Making} \longrightarrow \text{\bf Simulation Execution} \longrightarrow \text{\bf Assessment \& Evaluation}$$

### Architectural Tenets
1. **Deterministic Scripted Simulation Engine:** Physics simulation is strictly out-of-scope (PRD Section 17 & 32). The simulation runs on a normalized temporal clock ($T+00$ to $T+45$), interpolating positions for ship berthing, quay crane cycles, and container truck transfers.
2. **Deterministic Pedagogical State Machine:** The entire user journey is governed by a finite state machine (FSM) transitioning sequentially across 9 discrete phases.
3. **Zero-Backend Requirement (Self-Contained Client Architecture):** All scenario data, document packages, validation logic, timeline events, and scoring calculations reside in typed client-side stores (Zustand 5 + local storage persistence), ensuring instant deployment, zero server latency, and 100% offline demo reliability.
4. **Declarative Vector Simulation (SVG + Framer Motion/CSS):** Port geography, berths B-01/B-02, vessel MV Nusantara, quay cranes QC-01/02, and internal transfer trucks are rendered using crisp, responsive SVGs with hardware-accelerated transforms.

---

## 2. Technology Stack & Dependencies (Verified via Context7)

| Category | Technology | Version / Spec | Context7 Verification & Justification |
| :--- | :--- | :--- | :--- |
| **Framework** | **Next.js (App Router)** | `^16.2.0` | Latest major version (v16). Powered by Turbopack, fully asynchronous request runtime, and React 19 native integration. |
| **UI Library** | **React** | `^19.0.0` | Next.js 16 runtime foundation. Enhanced concurrent rendering, Actions, and View Transitions. |
| **Language** | **TypeScript** | `^5.6+` | Strict type safety for all domain models, events, and state transitions. |
| **Styling** | **Tailwind CSS** | `^3.4+` | Rapid utility styling, maritime operational dark/slate palette (`slate-900`, `sky-500`, `amber-500`, `emerald-500`). |
| **State Management**| **Zustand** | `^5.0.0` | Zustand v5 natively supports React 19 and Next.js 16 concurrency, preventing hydration mismatches. |
| **UI Components** | **Lucide React** | `^0.460+` | Clean, lightweight maritime, dashboard, and industrial iconography. |
| **Animation** | **Framer Motion / SVG** | `^11.x` | Smooth vector animations for ship berthing, crane trolley travel, and truck dispatch. |

### Next.js 16 Architectural Conventions & Breaking Changes (Context7 Verified)
- **Strictly Asynchronous Request APIs:** In Next.js 16, synchronous access to `params`, `searchParams`, `cookies()`, `headers()`, and `draftMode()` is **completely removed**. 
  - Any server page receiving props must type and await them:
    ```typescript
    export default async function Page(props: {
      params: Promise<{ id?: string }>;
      searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
    }) {
      const params = await props.params;
      const searchParams = await props.searchParams;
      // ...
    }
    ```
- **Client Boundaries (`"use client"`):** Interactive simulation views, document viewers, and SVG canvases are client modules, decoupling them from server request promises and ensuring instantaneous 60fps interaction.
- **Turbopack Dev Engine:** High-performance HMR and bundling via `next dev --turbo` by default.

---

## 3. Directory & File Structure

```text
mips/
├── docs/
│   ├── PRD.md                       # Product Requirements Document
│   ├── TECHNICAL_SPEC.md            # Technical design document
│   └── superpowers/specs/
│       └── 2026-09-19-mips-technical-design.md
├── public/
│   └── assets/
│       ├── audio/                   # Sound effects (optional P1)
│       └── images/                  # Port badges, vessel blueprints, logos
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Root layout (fonts, theme, metadata)
│   │   ├── page.tsx                 # Root entry redirecting to /dashboard
│   │   └── simulation/
│   │       ├── layout.tsx           # Persistent simulation shell header & status bar
│   │       └── page.tsx             # Master reactive view switching based on FSM state
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.tsx           # Cadet profile, current time, training mode badge
│   │   │   ├── Modal.tsx            # Accessible modal dialog for document viewing
│   │   │   └── ProgressBar.tsx      # Multi-step training progress indicator
│   │   ├── screens/
│   │   │   ├── 01_Dashboard.tsx     # Training center overview & module list
│   │   │   ├── 02_ScenarioCard.tsx  # Scenario briefing overview & metadata
│   │   │   ├── 03_Briefing.tsx      # Operational briefing & mission directives
│   │   │   ├── 04_DocumentCenter.tsx# Document package grid & detail preview
│   │   │   ├── 05_BerthDecision.tsx # Decision form (B-01 vs B-02) & validation alerts
│   │   │   ├── 06_SimulationView.tsx# 2D Port stage, animated vessel, timeline & live KPIs
│   │   │   └── 07_AssessmentView.tsx# Scorecard (92/100), breakdown, feedback & review
│   │   ├── simulation/
│   │   │   ├── PortCanvas.tsx       # SVG/HTML5 stage for berths, water, apron, yard
│   │   │   ├── VesselGraphic.tsx    # MV Nusantara SVG graphic with animated trajectory
│   │   │   ├── CraneGraphic.tsx     # Quay Cranes QC-01 & QC-02 with spreader hoisting
│   │   │   ├── TruckGraphic.tsx     # Terminal trucks shuttling between apron and yard
│   │   │   ├── EventTimeline.tsx    # Live auto-scrolling log of timestamped operations
│   │   │   ├── KPIDashboard.tsx     # Real-time productivity, utilization & move meters
│   │   │   └── SimulationControls.tsx # Play, Pause, Speed (1x, 2x, 4x), Reset controls
│   │   └── documents/
│   │       ├── ArrivalNoticeDoc.tsx # Styled digital card for Notice of Readiness / Arrival
│   │       ├── VesselManifestDoc.tsx# Vessel dimensions, registry, engine & bunker data
│   │       ├── CargoManifestDoc.tsx # Container breakdown (Import, Export, Reefer, Hazmat)
│   │       └── BerthInfoDoc.tsx     # Technical spec sheet for Berths B-01 and B-02
│   ├── data/
│   │   ├── scenarioData.ts          # Static fixtures for MV Nusantara & MIPS Training Port
│   │   ├── documentsData.ts         # Document package content, badges, and metadata
│   │   └── simulationTimeline.ts    # Scripted timeline events (T+00 to T+45)
│   ├── store/
│   │   ├── useTrainingStore.ts      # Primary FSM state store (current step, review logs)
│   │   └── useSimulationStore.ts    # Real-time clock, tick loop, speed, and metric accumulators
│   ├── types/
│   │   ├── domain.ts                # Vessel, Berth, Container, Document data interfaces
│   │   ├── simulation.ts            # Timeline events, coordinates, state machine enums
│   │   └── assessment.ts            # Scoring weights, feedback rules, scorecard types
│   └── utils/
│       ├── formatters.ts            # Time formatters (HH:mm), unit converters (m, moves/hr)
│       └── scoringCalculator.ts     # Formula algorithms for the 4 assessment pillars
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 4. Domain Data Models & TypeScript Specifications

### 4.1 State Machine Enums & Types (`src/types/simulation.ts`)

```typescript
export enum TrainingState {
  DASHBOARD = 'DASHBOARD',
  SCENARIO_SELECTION = 'SCENARIO_SELECTION',
  BRIEFING = 'BRIEFING',
  DOCUMENT_REVIEW = 'DOCUMENT_REVIEW',
  DECISION = 'DECISION',
  DECISION_VALIDATED = 'DECISION_VALIDATED',
  SIMULATION_RUNNING = 'SIMULATION_RUNNING',
  SIMULATION_PAUSED = 'SIMULATION_PAUSED',
  SIMULATION_COMPLETED = 'SIMULATION_COMPLETED',
  ASSESSMENT = 'ASSESSMENT',
  TRAINING_COMPLETED = 'TRAINING_COMPLETED'
}

export type DocumentType = 
  | 'ARRIVAL_NOTICE' 
  | 'VESSEL_MANIFEST' 
  | 'CARGO_MANIFEST' 
  | 'BERTH_INFORMATION';
```

### 4.2 Vessel, Berth & Cargo Models (`src/types/domain.ts`)

```typescript
export interface Vessel {
  id: string;
  name: string;
  imo: string;
  loa: number; // Length Overall in meters (280m)
  beam: number; // Width in meters (32.2m)
  draft: number; // Draft in meters (10.2m)
  eta: string; // "08:00"
  totalCargoCount: number; // 50 Containers
  flag: string; // "Indonesia"
  callSign: string; // "PKMN"
}

export interface Berth {
  id: string; // "B-01" | "B-02"
  name: string; // "Berth 01 (Deepwater)" | "Berth 02 (Feeder)"
  maxLoa: number; // 300m vs 250m
  maxDraft: number; // 12.0m vs 9.0m
  bollardCount: number;
  craneCount: number; // 2 Quay Cranes
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
  coordinates: {
    x: number;
    y: number;
    width: number;
    length: number;
  };
}

export interface CargoBreakdown {
  totalContainers: number; // 50
  importUnits: number;     // 30
  exportUnits: number;     // 20
  reeferUnits: number;     // 5
  dangerousUnits: number;  // 0
  twentyFoot: number;      // 35
  fortyFoot: number;       // 15
}

export interface OperationalDocument {
  id: string;
  type: DocumentType;
  title: string;
  referenceNumber: string;
  isViewed: boolean;
  viewDurationSeconds: number;
  summary: string;
}
```

### 4.3 Simulation & Timeline Interfaces (`src/types/simulation.ts`)

```typescript
export interface TimelineEvent {
  timeOffsetMinutes: number; // T+00, T+05, T+10, etc.
  clockTime: string;          // "08:00", "08:05", "08:10", etc.
  title: string;
  description: string;
  category: 'NAVIGATION' | 'MOORING' | 'CRANE' | 'TRUCK' | 'SYSTEM';
  containersCompleted: number;
  vesselStatus: 'APPROACHING' | 'MANEUVERING' | 'BERTHED' | 'OPERATING' | 'DEPARTING';
  craneStatus: 'IDLE' | 'POSITIONING' | 'OPERATING' | 'COMPLETED';
  truckStatus: 'STANDBY' | 'CYCLING' | 'COMPLETED';
}

export interface LiveKPIs {
  elapsedSimulationMinutes: number;
  containersHandled: number;
  totalContainers: number;
  grossProductivityMovesPerHour: number; // e.g. 71.4 moves/hr
  craneUtilizationPercent: number;       // e.g. 72%
  truckUtilizationPercent: number;       // e.g. 68%
  safetyViolations: number;              // 0
}
```

### 4.4 Assessment & Evaluation Types (`src/types/assessment.ts`)

```typescript
export interface AssessmentScoreBreakdown {
  documentReviewScore: number;    // Max 20
  documentReviewMax: number;      // 20
  berthDecisionScore: number;     // Max 40
  berthDecisionMax: number;       // 40
  operationScore: number;         // Max 20
  operationMax: number;           // 20
  kpiScore: number;               // Max 20
  kpiMax: number;                 // 20
  totalScore: number;             // Sum (target: 92/100)
  totalMax: number;               // 100
}

export interface CadetAssessment {
  score: AssessmentScoreBreakdown;
  grade: 'EXCELLENT' | 'SATISFACTORY' | 'NEEDS_IMPROVEMENT';
  decisionCorrect: boolean;
  selectedBerth: string;
  correctBerth: string;
  viewedDocumentCount: number;
  totalDocumentCount: number;
  elapsedOperationMinutes: number;
  productivity: number;
  feedbackText: string;
  learningHighlights: string[];
}
```

---

## 5. Screen-by-Screen UI/UX Specifications

### Screen 01: Taruna Dashboard (`src/components/screens/01_Dashboard.tsx`)
* **Purpose:** Serves as the Cadet Training Center portal (PRD Section 9).
* **Layout:**
  * **Header:** Academy logo, Cadet Name (*Cadet Ahmad - Class of 2026*), Module Progress: `1 / 3 Modules Completed`.
  * **Hero Training Card:** "Container Vessel Arrival & Berthing Operation" with "READY" badge and `[Continue Training]` button.
  * **Course Grid:** 
    1. *Module 1: Vessel Arrival & Berthing* (Unlocked / Active)
    2. *Module 2: Container Yard Logistics* (Locked / Badge: "Prerequisite Required")
    3. *Module 3: Dangerous Cargo Handling* (Locked / Badge: "Advanced Level")
* **Action:** Clicking `[Continue Training]` transitions state to `SCENARIO_SELECTION`.

### Screen 02: Training Scenario (`src/components/screens/02_ScenarioCard.tsx`)
* **Purpose:** Detailed briefing specification of the scenario (PRD Section 10).
* **Metadata Card:**
  * **Scenario Name:** Container Vessel Arrival & Berthing Operation
  * **Difficulty:** Basic / Level 1
  * **Target Duration:** ~10-15 Minutes
  * **Competencies Evaluated:** Document Verification, Vessel-Berth Compatibility, Operations Monitoring, KPI Evaluation.
* **Action:** Clicking `[START TRAINING]` transitions state to `BRIEFING`.

### Screen 03: Scenario Briefing (`src/components/screens/03_Briefing.tsx`)
* **Purpose:** Operational orders and mission directives (PRD Section 11).
* **Content:**
  * High-priority operational dispatch message:
    > "MV Nusantara is scheduled to arrive at MIPS Training Port at 08:00 hrs. Your duty as Cadet Port Operations Officer is to examine arrival notices and ship particulars, check physical berth limitations, and approve the appropriate berth allocation."
  * Checklist of instructions:
    - [ ] Inspect Vessel Dimensions (LOA & Draft)
    - [ ] Verify Depth and Length of Available Berths
    - [ ] Authorize Berth Allocation
    - [ ] Supervise Cargo Discharge of 50 Containers
* **Action:** Clicking `[Review Documents]` transitions state to `DOCUMENT_REVIEW`.

### Screen 04: Document Center (`src/components/screens/04_DocumentCenter.tsx`)
* **Purpose:** Digital Document Package inspection (PRD Section 12 & 13).
* **Document Package Grid (4 Cards):**
  1. **Arrival Notice:** Reference #`ARR-2026-NUS-001`, Status: *Available for Review*. Displays MV Nusantara, ETA 08:00, LOA 280m, Draft 10.2m.
  2. **Vessel Manifest:** Reference #`VM-1234567`, Registry: Jakarta, Call Sign: PKMN, Beam: 32.2m, Gross Tonnage: 54,000 GT.
  3. **Cargo Manifest:** Reference #`CM-50-CTN`, 50 TEUs total (30 Import, 20 Export, 5 Reefer, 0 Hazardous/IMDG).
  4. **Berth Information Sheet:** Reference #`BIS-MIPS-01`, Detailed specifications comparing B-01 (Max LOA 300m, Depth 12m) and B-02 (Max LOA 250m, Depth 9m).
* **Interaction:** Clicking any document opens an authentic digital document viewer modal. Viewing tracks `isViewed = true` and accumulates view time.
* **Action:** Clicking `[Proceed to Berth Assignment]` transitions state to `DECISION`.

### Screen 05: Decision & Berth Assignment (`src/components/screens/05_BerthDecision.tsx`)
* **Purpose:** Active decision-making point (PRD Section 14 & 15).
* **Question Prompt:** *"Select the appropriate berth for MV Nusantara."*
* **Interactive Radio Cards:**
  * **Option A — Berth B-01:** Max LOA: 300 m | Max Draft: 12.0 m | Cranes: 2x Super Post-Panamax | Status: Available.
  * **Option B — Berth B-02:** Max LOA: 250 m | Max Draft: 9.0 m | Cranes: 2x Panamax | Status: Available.
* **Validation Logic:**
  * If **B-01** selected:
    * Validation evaluates: $280\text{ m} \le 300\text{ m}$ (Valid) and $10.2\text{ m} \le 12.0\text{ m}$ (Valid).
    * Banner: `✓ DECISION ACCEPTED — B-01 is fully compatible with vessel LOA and draft requirements.`
    * Action button updates to `[START SIMULATION]` (transitions to `SIMULATION_RUNNING`).
  * If **B-02** selected:
    * Validation evaluates: $280\text{ m} > 250\text{ m}$ (Exceeded by 30m) and $10.2\text{ m} > 9.0\text{ m}$ (Exceeded by 1.2m).
    * Banner: `⚠ REVIEW REQUIRED — The selected berth does not meet vessel requirements (Risk of grounding and LOA overreach). Review the Berth Information document and select again.`
    * Simulation button remains locked.

### Screen 06: Simulation Dashboard (`src/components/screens/06_SimulationView.tsx`)
* **Purpose:** Core animated execution view with live KPIs and event timeline (PRD Section 16 to 19).
* **Layout (3-Panel Cockpit):**
  1. **Left Sidebar (Cadet Decision Dossier):**
     * Assigned Berth: `B-01 (Validated)`
     * Vessel: `MV Nusantara` | LOA: `280m` | Draft: `10.2m`
     * Active Operation: `Container Discharge & Loading`
     * Simulation Controls: Play / Pause toggle, Speed multipliers ($1\times, 2\times, 4\times$), Restart button.
  2. **Center/Top Canvas (2D SVG Port Simulation Stage):**
     * **Water Basin:** Blue-slate gradient water with docking fairway.
     * **Berth Structure:** Concrete quay wall labeled `B-01` (active) and `B-02` (standby).
     * **Vessel (MV Nusantara):** Stylized top-down/isometric container ship graphic with bay lines. Animates from water channel $\to$ berth B-01 mooring.
     * **Quay Cranes (QC-01 & QC-02):** Rail-mounted gantry cranes positioned over vessel bays. Spreaders move between ship deck and terminal trucks.
     * **Terminal Trucks (TT-01, TT-02, TT-03):** Yellow container haulers cycling along the quay apron into the container yard.
  3. **Bottom Panel (Dual Monitoring Feeds):**
     * **Event Timeline Feed:** Auto-scrolling, timestamped event log (08:00 to 08:42).
     * **Live Operational KPIs:**
       * Containers Handled: `[ 0 / 50 ]` $\to$ `[ 50 / 50 ]` with dynamic fill bar.
       * Gross Productivity: `71.4 Moves / Hour` (calculated dynamically).
       * Quay Crane Utilization: `72%` active duty cycle.
       * Yard Truck Utilization: `68%` active duty cycle.
* **Completion Trigger:** When timeline reaches $T+45$ (all 50 containers completed), the state transitions automatically to `ASSESSMENT`.

### Screen 07: Result & Assessment (`src/components/screens/07_AssessmentView.tsx`)
* **Purpose:** Pedagogical scorecard, performance breakdown, and cadet feedback (PRD Section 20 to 23).
* **Score Card Header:**
  * Overall Training Score: **92 / 100** (Grade: *Excellent Cadet Performance*)
* **Weighted Breakdown Grid (PRD Section 22):**
  1. **Document Review (20% Weight):** `20 / 20 pts` (All 4 operational documents inspected).
  2. **Berth Selection Decision (40% Weight):** `40 / 40 pts` (Correctly verified LOA & draft compatibility for B-01).
  3. **Operation Completion (20% Weight):** `18 / 20 pts` (100% container transfer achieved within standard allowable timeline).
  4. **KPI Performance (20% Weight):** `14 / 20 pts` (Average productivity 71.4 moves/hr vs target 70 moves/hr, crane utilization 72%).
* **Formative Feedback Card:**
  > *"Outstanding work, Cadet. You systematically identified berth physical restrictions, matched vessel requirements without grounding hazard, and maintained efficient terminal turnaround times."*
* **Action CTAs:**
  * `[Review Simulation Replay]` (rewinds simulation to $T+00$ for analytical replay).
  * `[Back to Training Center]` (resets session and returns to Dashboard).

---

## 6. Simulation Engine & Motion Timeline

### 6.1 Simulation Clock & Temporal Resolution
* Real-world duration: 45 operational minutes ($08:00$ to $08:45$).
* Demo playback duration:
  * At $1\times$ speed: 90 seconds (1 sim-minute = 2 real-seconds).
  * At $2\times$ speed: 45 seconds (1 sim-minute = 1 real-second).
  * At $4\times$ speed: 22.5 seconds (1 sim-minute = 0.5 real-seconds).

### 6.2 Deterministic Scripted Timeline Matrix

| Time Offset | Simulated Clock | Vessel State | Crane QC-01/02 State | Truck State | Containers Done | Log Event Text |
| :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **T+00** | 08:00 | Entering Port Channel (x: 100, y: 50) | Parked at Quay End | Staged at Yard | 0 / 50 | Vessel MV Nusantara reported at port fairway entrance. |
| **T+03** | 08:03 | Approaching Turning Basin | Boom lowered | Standby | 0 / 50 | Port Control confirms Berth B-01 allocation. |
| **T+05** | 08:05 | Alongside Berth B-01 (x: 320, y: 180) | Moving to Bays 02 & 06 | Mobilizing to Apron | 0 / 50 | Mooring lines secured. Port Health & Customs cleared. |
| **T+08** | 08:08 | Berthed & Fast | Trolley positioning | TT-01 under QC-01 | 0 / 50 | Gangway lowered. Pre-operation safety checklist passed. |
| **T+10** | 08:10 | Cargo Operations Active | Spreader cycle active | TT-01 & TT-02 cycling | 4 / 50 | QC-01 & QC-02 commenced discharge operation. |
| **T+15** | 08:15 | Cargo Operations Active | Continuous cycles | 3 trucks cycling | 12 / 50 | Container handling proceeding at 72 moves/hr pace. |
| **T+25** | 08:25 | Cargo Operations Active | Continuous cycles | 3 trucks cycling | 28 / 50 | Import discharge 50% completed; Reefer units connected. |
| **T+35** | 08:35 | Cargo Operations Active | Finishing final bays | Return to yard | 42 / 50 | Final container lot undergoing terminal transfer. |
| **T+40** | 08:40 | Cargo Operations Complete | Spreaders parked | Parked at depot | 50 / 50 | 50 of 50 containers discharged & loaded. Operation completed. |
| **T+45** | 08:45 | Ready for Departure Check | Boom hoisted | Idle | 50 / 50 | All operations concluded. Generating cadet assessment. |

### 6.3 2D SVG Spatial Layout & Coordinate System
The port canvas is rendered as a responsive SVG with viewBox `0 0 1000 600`:
* `y: 0 - 220`: Sea Basin & Navigation Fairway.
* `y: 220 - 240`: Quay Wall & Bollards.
  * `x: 50 - 450`: Berth B-02 (Length 250m, Depth 9m watermark).
  * `x: 500 - 950`: Berth B-01 (Length 300m, Depth 12m watermark).
* `y: 240 - 320`: Quay Apron (Crane tracks, QC-01 at x=620, QC-02 at x=780, truck transfer lanes).
* `y: 320 - 600`: Terminal Yard (Storage stacks: Import, Export, Reefer plugs, security gate).

---

## 7. Assessment & Scoring Mathematical Model

The final score $S_{\text{total}} \in [0, 100]$ is computed using 4 weighted pillars:

$$S_{\text{total}} = S_{\text{doc}} + S_{\text{berth}} + S_{\text{ops}} + S_{\text{kpi}}$$

### 1. Document Review Score ($S_{\text{doc}} \le 20\text{ pts}$)
Evaluates whether the cadet opened and read all 4 required operational documents:
$$S_{\text{doc}} = \sum_{i=1}^{4} w_i \quad \text{where } w_i = 5\text{ pts if } \text{isViewed}_i = \text{true else } 0$$
* All 4 viewed: $20 / 20\text{ pts}$.

### 2. Berth Decision Score ($S_{\text{berth}} \le 40\text{ pts}$)
Evaluates berth allocation accuracy:
$$S_{\text{berth}} = \begin{cases} 
40 & \text{if selectedBerth} = \text{'B-01'} \text{ on first attempt} \\
30 & \text{if selectedBerth} = \text{'B-01'} \text{ after 1 review warning} \\
0  & \text{if invalid} 
\end{cases}$$
* Standard target: $40 / 40\text{ pts}$.

### 3. Operation Completion Score ($S_{\text{ops}} \le 20\text{ pts}$)
Measures operational throughput completion:
$$S_{\text{ops}} = 20 \times \left( \frac{C_{\text{completed}}}{C_{\text{total}}} \right) - \text{Penalty}_{\text{stoppage}}$$
* At 50/50 containers with standard schedule: $18 - 20 / 20\text{ pts}$ (default baseline: $18\text{ pts}$).

### 4. KPI Performance Score ($S_{\text{kpi}} \le 20\text{ pts}$)
Measures terminal crane productivity ($P_{\text{actual}}$ vs benchmark $70\text{ moves/hr}$):
$$S_{\text{kpi}} = 10 \times \min\left(1.0, \frac{P_{\text{actual}}}{70}\right) + 10 \times \left(\frac{\text{CraneUtil} + \text{TruckUtil}}{2 \times 70\%}\right)$$
* Baseline prototype calibration: $14 / 20\text{ pts}$.

### Resultant Scorecard Sum
$$\text{Total Score} = 20 + 40 + 18 + 14 = \mathbf{92} \text{ / } 100 \text{ pts}$$

---

## 8. Implementation Roadmap (5-Day Plan)

```
Day 1: Project Foundation & FSM
  ├── Initialize Next.js 14+ with TypeScript & Tailwind CSS
  ├── Setup Zustand store for Training State Machine (9 states)
  └── Implement Header, Layout Shell, Dashboard (Screen 01) & Scenario Briefing (Screen 02 & 03)

Day 2: Digital Document Center
  ├── Implement Document Center & Modal Viewer (Screen 04)
  ├── Build Arrival Notice, Vessel Manifest, Cargo Manifest & Berth Spec cards
  └── Wire document view tracking (isViewed state)

Day 3: Decision Logic & Port Canvas
  ├── Implement Berth Assignment Selection (Screen 05) with real-time validation banner
  ├── Construct SVG Port Canvas (Berth B-01/B-02, water, quay apron, yard)
  └── Implement animated Vessel (MV Nusantara) positioning & mooring logic

Day 4: Operations Simulation & Live KPIs
  ├── Implement Quay Cranes & Yard Trucks SVG motion loop (Screen 06)
  ├── Build Simulation Clock, Speed Controller (1x, 2x, 4x), and Play/Pause engine
  ├── Build auto-scrolling Event Timeline feed (08:00 to 08:42)
  └── Wire real-time KPI indicators (Containers Handled, Productivity, Crane/Truck Util)

Day 5: Assessment Engine & QA Polish
  ├── Implement Scorecard calculation & Result View (Screen 07)
  ├── Build replay and reset handlers
  ├── Audio/visual feedback polish (subtle CSS transitions, alert banners)
  └── End-to-end user journey verification & client demonstration dry-run
```

---

## 9. Verification & Acceptance Criteria

1. **State Machine Integrity:** The app must smoothly advance through all 9 states without broken navigation or unhandled exceptions.
2. **Pedagogical Gatekeeping:** The simulation *cannot* be accessed until Berth B-01 is explicitly submitted and validated.
3. **Responsive SVG Simulation:** The port animation must render smoothly at 60fps on desktop and tablet viewports without layout clipping.
4. **Scoring Accuracy:** The assessment view must dynamically reflect whether documents were opened and present the exact weighted score of 92/100 upon completion.
5. **Zero External Errors:** Codebase must build cleanly (`next build`) with 0 TypeScript errors and 0 ESLint warnings.
