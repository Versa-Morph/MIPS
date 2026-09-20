# Design Specification: MIPS Visual Redesign & Modernization (Tactical HUD Glassmorphism)

**Author:** Sisyphus (OhMyAntigravity)  
**Date:** September 20, 2026  
**Status:** Approved for Implementation Planning  
**Target:** MIPS (Maritime Integrated Port Simulator) Client Demonstration  
**Design Direction:** Modern Maritime Tactical HUD (Glassmorphic Oceanic Command Console)

---

## 1. Problem Statement & Redesign Objective

### 1.1 Current Limitations
The current MIPS interface fulfills 100% of the functional and pedagogical requirements specified in `docs/PRD.md`. However, its visual presentation suffers from common AI-generated defaults:
* **Monotonous Color Palette:** Overuse of raw `slate-900` cards, harsh yellow buttons (`#F5B800`), and flat dark backgrounds that feel utilitarian rather than professional.
* **Generic Typography:** System-default sans-serif and unstyled monospace fonts without proportional hierarchy or typographical refinement.
* **Lack of Visual Imagery:** The application relies entirely on flat SVG drawings and icon placeholders, lacking the cinematic photography and photorealistic vessel/port assets that convey maritime prestige.
* **Component Clutter:** Rigid rectangular containers without subtle depth, lighting accents, or glassmorphic elevation.

### 1.2 Redesign Objective
Transform MIPS into a **World-Class Maritime Command Console (Tactical HUD Glassmorphic System)**:
* Retain 100% of the tested state machine (`useTrainingStore`, `useSimulationStore`), pedagogical validation rules, and PRD alur.
* Introduce a cohesive design system with custom oceanic depth, glassmorphic elevation, refined typography, and high-impact visual assets.
* Enhance cadet engagement with cinematic 3D renders of *MV Nusantara*, realistic port officer portraiture, and executive certification seals.

---

## 2. Design Language & Design System Tokens

### 2.1 Color Palette Tokens
All colors are calibrated for high-contrast visibility on dark oceanic command interfaces:

| Token Name | Hex Code / Tailwind Class | Intended Usage |
|---|---|---|
| **Abyssal Base (950)** | `#030712` (`bg-slate-950`) | Deep ocean background with subtle radial gradient (`radial-gradient(ellipse at 50% 0%, #0B1728 0%, #030712 100%)`). |
| **Console Navy (900)** | `#081325` (`bg-[#081325]`) | Main structural surfaces, header bars, and primary layout containers. |
| **Glass Panel** | `rgba(13, 27, 49, 0.70)` | Glassmorphic cards with `backdrop-blur-xl`, `border border-slate-700/50`, and subtle top-edge highlight (`border-t-slate-600/70`). |
| **Electric Amber** | `#F59E0B` (`text-amber-500`, `#F59E0B`) | Primary action CTA buttons, brand badges, and important milestones. Hover: `#D97706`. |
| **Tactical Cyan** | `#00E5FF` / `#38BDF8` (`text-sky-400`, `text-cyan-400`) | Live telemetry feeds, GPS coordinates, radar vectors, and active navigation indicators. |
| **Safety Emerald** | `#10B981` (`text-emerald-400`) | Validated decisions, compliant UKC clearances, approved checkpoints, and passing grades. Glow: `shadow-[0_0_12px_rgba(16,185,129,0.3)]`. |
| **Hazard Crimson** | `#EF4444` (`text-red-500`) | Grounding hazard warnings, negative feedback alerts, and emergency stop indicators. |
| **Text Primary** | `#F8FAFC` (`text-slate-50`) | Headings, card titles, and high-emphasis labels. |
| **Text Secondary** | `#94A3B8` (`text-slate-400`) | Descriptions, field notes, and contextual hints. |
| **Text Muted** | `#64748B` (`text-slate-500`) | Inactive labels, auxiliary metadata, and border dividers. |

### 2.2 Typography Hierarchy
Imported directly from Google Fonts via `next/font/google` in `src/app/layout.tsx`:

* **Display & User Interface (`Plus Jakarta Sans`):**
  * Weights: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold), 800 (ExtraBold).
  * Application: Page headings, card titles, button labels, navigation breadcrumbs, and modal headers.
  * Quality: Clean geometric curves, tall x-height, and superior screen legibility.
* **Data, Telemetry, & Calculations (`JetBrains Mono`):**
  * Weights: 400 (Regular), 600 (SemiBold), 700 (Bold).
  * Application: Vessel dimensions (LOA, Draft, Beam), coordinate pairs (lat/lng), clock times (`08:00 WIB`), container counts (`50/50`), speed over ground, and KPI scores.
  * Quality: Tabular numeric alignment with zero jitter during live simulation updates.

### 2.3 Surface Geometry & Glassmorphism Rules
* **Containers:** `rounded-2xl` (16px border-radius) for major viewports and main panels.
* **Cards:** `rounded-xl` (12px border-radius) with `border border-slate-700/60 shadow-xl shadow-black/40`.
* **Elevated Highlights:** Top border highlight using `border-t-slate-600/60` to simulate overhead bridge console lighting.
* **Micro-Interactions:** Smooth CSS hover transitions (`transition-all duration-200 ease-out transform hover:scale-[1.01] hover:border-amber-500/40`).

---

## 3. Cinematic Visual Assets Architecture

Four production-grade visual assets will be generated and hosted in `public/images/`:

### 3.1 Asset Catalog

```
public/images/
├── vessel-hero.png          # Photorealistic 3D render of MV Nusantara container ship
├── officer-gunawan.png       # Formal portrait of Senior Training Officer Capt. Gunawan
├── terminal-panorama.png     # Panoramic dusk photograph of Tanjung Priok Container Terminal
└── seal-competency.png      # Gold embossed MIPS Maritime Competency Verification Seal
```

### 3.2 Art Direction Specifications
1. **`vessel-hero.png` (1920x1080, WebP/PNG optimized):**
   * *Subject:* Modern 280-meter cellular container ship (*MV Nusantara*) loaded with stacked multi-colored ISO shipping containers, cruising through the entrance channel of Tanjung Priok harbor at sunset.
   * *Mood & Lighting:* Dramatic warm golden light on vessel bridge, dark oceanic blue water with foaming bow wave, subtle industrial harbor cranes visible in distant background haze.
   * *Usage:* Dashboard active assignment hero banner (Screen 01), Scenario Overview header (Screen 02), and Assessment summary background (Screen 07).
2. **`officer-gunawan.png` (800x800, WebP/PNG):**
   * *Subject:* Distinguished Indonesian maritime training captain (Capt. H. Gunawan), aged 50s, dressed in immaculate white Merchant Marine service uniform with gold shoulder boards (four stripes), maritime insignia badge, and confident professional demeanor.
   * *Background:* Port operations VTS control tower interior with console displays and harbor window.
   * *Usage:* Mission briefing advisory card (Screen 03) and Instructor debriefing card (Screen 07).
3. **`terminal-panorama.png` (1920x600, WebP/PNG):**
   * *Subject:* High-angle aerial photograph of modern deepwater container terminal with twin Super Post-Panamax quay cranes illuminated under industrial floodlights, transfer yard blocks, and breakwater.
   * *Usage:* Header accent background across all screens and briefing background.
4. **`seal-competency.png` (600x600, PNG with alpha transparency):**
   * *Subject:* Formal circular gold medallion seal with raised embossed relief, featuring dual nautical anchors, compass rose, Indonesian maritime ribbon, and inscription: *"MIPS TRAINING CENTER · VERIFIED OPERATIONAL COMPETENCY"*.
   * *Usage:* Screen 07 Assessment Scorecard and Certificate modal.

### 3.3 Zero-Failure Fallback Guarantee
All image references will include robust CSS fallback backgrounds (gradient meshes with icon watermarks) to ensure that even if an image fails to load or network latency occurs, the interface remains visually stunning and 100% operational.

---

## 4. Detailed Screen-by-Screen Redesign Specifications

### 4.1 Screen 01: Cadet Training Dashboard (`01_Dashboard.tsx`)
* **Layout:** Asymmetric Bento Grid (Modern 12-column layout):
  * **Top Hero Banner (Col 1-12):** Deep navy glass card with aerial terminal silhouette, cadet welcoming badge, and real-time status timestamp.
  * **Active Assignment Card (Col 1-7, Span 2):** Large prominent card showcasing `vessel-hero.png` with overlaid dark gradient, vessel particulars at a glance, and glowing Electric Amber CTA button `[ START TRAINING ]`.
  * **Cadet Readiness & Progress Card (Col 8-12):** Interactive circular progress ring (33% completed), overall qualification score pill (`88/100`), and next operational milestone.
  * **Training Modules Roster (Col 1-12):** Interactive card list:
    * *Module 1 (Vessel Arrival & Berthing):* Active cyan border, glowing pulse indicator.
    * *Module 2 (Cargo Handling):* Elegant locked state with frosted glass overlay and keyhole badge.
    * *Module 3 (Yard Operations):* Locked state with dependency indicator.

### 4.2 Screen 02: Scenario Specification Overview (`02_ScenarioCard.tsx`)
* **Layout:** Executive 2-Column Split:
  * **Header:** Integrated banner featuring `vessel-hero.png` as backdrop with dark vignette, displaying mission ID `SCN-PRIOK-001`.
  * **Left Panel (Objectives & Methodology):** Clean card hierarchy detailing foundational berth allocation criteria, LOA/draft compliance mandates, and passing standards (70%).
  * **Right Panel (Vessel Profile & Terminal Conditions):** Refined specification card with tabular monospace values for LOA (280m), Draft (10.2m), Total Cargo (50 TEU), and Tanjung Priok tidal conditions (+1.5m High Water).
  * **Action Footer:** Back button with hover slide effect and prominent `[ START TRAINING ]` CTA.

### 4.3 Screen 03: Operational Mission Briefing (`03_Briefing.tsx`)
* **Layout:** High-Authority Briefing Room:
  * **Officer Directive Card:** Features `officer-gunawan.png` portrait in an executive glass badge, quote styling with amber vertical border, and official dispatch stamp (`DISPATCH: VTS-PRIOK-0730`).
  * **Operational Directive Checklist:** 4-card interactive grid with illuminated checkmark badges and tactical step numbering.
  * **Safety Guidance Callout:** Styled as an official KSOP / Harbor Master safety bulletin warning of shallow depth hazards at Berth B-02.
  * **Action Footer:** Styled `[ Review Documents ]` CTA with forward chevron animation.

### 4.4 Screen 04: Document Center & Clearance Dossier (`04_DocumentCenter.tsx`)
* **Layout:** Polished 3-Panel Unified Operations Center:
  * **Panel 1 (Left - 25% Width):** Document list with custom icon badges (NOA, Manifest, Berth Sheet, Dangerous Goods), view count counters, and Technical Quick-Reference Card.
  * **Panel 2 (Center - 45% Width):** Embedded PDF viewer and Data Sheet viewer with high-contrast tab controls, download action, and full-screen preview.
  * **Panel 3 (Right - 30% Width):** Pre-Arrival Clearance Dossier form:
    * Re-architected form fields with `focus:ring-2 focus:ring-cyan-400 focus:border-transparent`, monospace input styling, and inline validation helpers.
    * Submit action triggers the official modal dialog with darkened backdrop and permanently locks inputs into an immutable command state.
    * Feedback message confirms lock without score spoilers.

### 4.5 Screen 05: Berth Allocation Decision Console (`05_BerthDecision.tsx`)
* **Layout:** Tactical Comparison Matrix:
  * **Cadet Reference Card:** Displays data directly populated from the cadet's submitted dossier (LOA 280m, Draft 10.2m, UKC Safe 11.5m).
  * **Berth B-01 Card (Compliant):** Dark oceanic card with emerald compatibility badges, depth gauge graphic showing +0.5m surplus UKC, and crane assignment notes.
  * **Berth B-02 Card (Hazardous):** Restricted card with crimson hazard badges, depth gauge showing 2.5m deficit grounding danger, and access to the What-If Grounding simulation modal.
  * **Decision Confirmation:** Dynamic feedback banner displaying official approval or review required notices, unlocking the pulse-animated `[ START SIMULATION ]` button.

### 4.6 Screen 06: Port Simulation Cockpit (`06_SimulationView.tsx`)
* **Layout:** VTS Command Center Cockpit:
  * **Left Panel (Decision & Telemetry):** Clean decision summary card, playback scrubber controls (1x, 2x, 4x, Pause, Play, Step +5m, Reset), and simulation clock in large JetBrains Mono numerals.
  * **Center Map Panel:** Interactive Leaflet GIS map with Peta RBI layer from BIG, custom photorealistic SVG vessel silhouette (*MV Nusantara* with pointed bow and multi-colored container stacks), twin quay cranes with dynamic spreader animations, moving terminal tractors, and fairway buoys.
  * **Bottom Monitors:** Auto-scrolling terminal event log on the left, live KPI telemetry dashboard on the right with progress bars, gross productivity meters, and equipment utilization percentages.
  * **Authorization Modals:** Radio dispatch dialogs for T+10 Mooring clearance and T+15 Crane clearance styled as official maritime radio telegrams.

### 4.7 Screen 07: Assessment & Competency Certification (`07_AssessmentView.tsx`)
* **Layout:** Executive Certification Report:
  * **Header Card:** Gold gradient banner with `seal-competency.png` badge, large `92 / 100` total score display, and `COMPETENT / PASSED` distinction.
  * **Four Weighted Pillars Grid:** Document Review (20/20), Berth Decision (40/40), Operation (18/20), and KPI Performance (14/20) with proportional gradient progress bars.
  * **Operational Performance Stats:** Containers (50/50), simulated duration (42 min), productivity (71.4 moves/hr), decision accuracy (100%), and zero safety violations.
  * **Instructor Debriefing Card:** Formal feedback signed by Capt. H. Gunawan.
  * **Action Footer:** Buttons to replay simulation or return to the Training Dashboard.

---

## 5. Non-Functional Requirements & Architectural Constraints

1. **Zero Backend Dependency:** The redesign is strictly client-side presentation and styling. No backend servers, SQLite databases, or external APIs are added.
2. **State Machine Immutability:** `useTrainingStore` and `useSimulationStore` interfaces, actions, and state transitions remain unchanged.
3. **100% Test Suite Continuity:** All existing 46 unit and integration test suites in `tests/` must continue to pass cleanly without regression.
4. **Performance & Bundle Size:** WebP/PNG image assets must be optimized (under 250KB each). Next.js Turbopack build must compile with 0 errors and 0 warnings.
5. **Accessibility & Contrast:** All text must maintain a minimum contrast ratio of 4.5:1 against glassmorphic backgrounds according to WCAG 2.1 AA standards.

---

## 6. Implementation Stages (Preview)

* **Stage 1:** Google Fonts integration (`Plus Jakarta Sans` & `JetBrains Mono`) and Tailwind theme token configuration.
* **Stage 2:** Generation and placement of the 4 visual assets (`public/images/`).
* **Stage 3:** Component & Layout overhaul of Screens 01 through 03 (Dashboard, Overview, Briefing).
* **Stage 4:** Component & Layout overhaul of Screens 04 through 07 (Document Center, Decision, Simulation, Assessment).
* **Stage 5:** End-to-end verification, responsive audit, test validation (`vitest`), and production build verification.
