---
title: MIPS Design System & Visual Specification
document_type: design_system_specification
project: Maritime Integrated Port Simulator (MIPS)
version: 2.0.0
standard: OpenBridge 5.0 / IALA Guideline G1177 / Modern Maritime LMS
target_stack:
  framework: Next.js 16 (App Router, Turbopack)
  ui_runtime: React 19, Tailwind CSS v3.4+, Lucide React
  state_management: Zustand 5
  rendering: HTML5 Canvas, Responsive SVG, Leaflet GIS
ai_agent_guidance:
  machine_parseable: true
  authoritative_tokens: true
  zero_slop_enforced: true
last_updated: "2026-10-03"
---

# MIPS (Maritime Integrated Port Simulator) — Design System & Visual Specification

This document provides the definitive, production-grade visual specification and design token architecture reverse-engineered from the official 8-slide MIPS UI and pedagogical flow set. It is tailored for human UI/UX engineers and autonomous AI coding agents constructing pixel-faithful, responsive, accessible maritime simulation software.

---

## 1. Executive Summary & Design Philosophy

MIPS is a specialized EdTech and operational port simulator for **Taruna Laut (Maritime Cadets & Trainees)**. Its visual design balances two operational environments:

1. **Academy Daylight Surface (Day Mode / Light Canvas):**
   * **Scope:** Dashboard, Session Entry, Scenario Briefing, Document Audit Center, Decision Workspace, and Assessment/Debrief.
   * **Aesthetics:** Clean, high-legibility crisp off-white canvas (`#F0F4FA` / `#F1F5F9`) framed by deep maritime navy (`#0A1931` / `#0B2546`), structured borders, and crisp high-contrast data tables. Evokes an elite maritime academy examination hall or harbor master dispatch terminal.
2. **Tactical Operations HUD (Night Radar Stage / Dark Canvas):**
   * **Scope:** Interactive Port Basin, Live Berthing Simulation Canvas, Tugboat Vector Manoeuvring, and Vessel Telemetry Grid.
   * **Aesthetics:** High-contrast tactical deep-sea viewport (`#081826` to `#0B192C`), luminous cyan vectors (`#00A3E0` / `#06B6D4`), radar distance rings, and high-visibility safety amber warning beacons.

---

## 2. Global Pedagogical Journey (5 Phases & Swimlanes)

MIPS structures the cadet's journey from initial access to certified competency through a deterministic 5-phase pipeline:

```
[Instructor] ──(Create Session & Generate Code: MIPS-BERTH-2048)──┐
                                                                  ▼
[Cadet Hub] ──► [Input Code] ──► [Access Granted] ───────────────┤
                                                                  ▼
┌───────────────┬───────────────┬───────────────┬────────────────┬────────────────┐
│ 1. LEARN      │ 2. ANALYZE    │ 3. DECIDE     │ 4. SIMULATE    │ 5. EVALUATE    │
│ Skenario &    │ Dokumen Kargo │ Alokasi Berth │ Live Vector    │ Evaluasi Skor  │
│ Vessel Specs  │ & Pelabuhan   │ B-01 vs B-02  │ T+00 s/d T+45  │ & Debriefing   │
└───────────────┴───────────────┴───────────────┴────────────────┴────────────────┘
                                                                  │
                                                                  ▼
[Result Saved] ◄── [Certificates & History] ◄── [Audit Passed] ───┘
```

---

## 3. Authoritative Design Tokens

### 3.1 Color Palette Matrix

#### A. Core Surfaces & Backgrounds
| Token Name | Hex Code | HSL | Role / Usage | Tailwind Class |
| :--- | :--- | :--- | :--- | :--- |
| `bg-app-canvas` | `#F1F5F9` | `210°, 40%, 96%` | Global application canvas (Slate 100) | `bg-slate-100` |
| `bg-surface` | `#FFFFFF` | `0°, 0%, 100%` | Card base, modal surface, document background | `bg-white` |
| `bg-surface-subtle`| `#F8FAFC` | `210°, 40%, 98%` | Nested container, alternating table rows | `bg-slate-50` |
| `bg-sidebar` | `#0A1931` | `217°, 66%, 12%` | Academy navigation rail, sidebar | `bg-[#0A1931]` |
| `bg-sidebar-hover`| `#132B4F` | `216°, 61%, 19%` | Sidebar menu item hover state | `bg-[#132B4F]` |
| `bg-sidebar-active`| `#173562` | `216°, 62%, 24%` | Sidebar active menu item | `bg-[#173562]` |
| `bg-tactical-viewport`| `#081826`| `208°, 65%, 9%` | Simulation water basin, radar map background | `bg-[#081826]` |
| `bg-hero-deep` | `#0B2546` | `213°, 73%, 16%` | Dark hero banner gradient start | `bg-[#0B2546]` |
| `bg-hero-overlay`| `rgba(11, 27, 49, 0.88)` | `—` | Hero container scrim over port photography | `bg-slate-950/90` |

#### B. Brand & Interactive Accents
| Token Name | Hex Code | Role / Usage | Tailwind Class |
| :--- | :--- | :--- | :--- |
| `brand-navy` | `#0B2240` | Deep maritime navy, corporate headers, logos | `text-[#0B2240]` |
| `brand-cyan` | `#00A3E0` | Maritime primary accent, tactical telemetry | `text-[#00A3E0]` |
| `brand-blue` | `#0066FF` | Primary button CTA, active tab indicator | `bg-[#0066FF]` |
| `brand-blue-hover`| `#0052CC` | Button hover state | `hover:bg-[#0052CC]` |
| `brand-blue-subtle`| `#EFF6FF` | Active step background, selection highlight | `bg-blue-50` |
| `brand-gold` | `#F5B800` | Anchor symbol, star badges, primary alert | `text-[#F5B800]` |

#### C. The 5 Pedagogical Phase Color Tokens
Each phase has a dedicated tri-color token set: **Badge (Solid)**, **Surface (Tinted Container)**, and **Text (High-Contrast Label)**.

| Phase ID | Phase Name | Badge Hex | Surface Hex | Text Hex | Tailwind Combination |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **P-1** | **LEARN** | `#009FE3` | `#E1F5FE` | `#0077A8` | `bg-[#E1F5FE] text-[#0077A8] border-[#009FE3]` |
| **P-2** | **ANALYZE** | `#0284C7` | `#E0F2FE` | `#0369A1` | `bg-sky-50 text-sky-800 border-sky-500` |
| **P-3** | **DECIDE** | `#F59E0B` | `#FEF3C7` | `#B45309` | `bg-amber-50 text-amber-800 border-amber-500` |
| **P-4** | **SIMULATE**| `#00A887` | `#E6F7F4` | `#007A62` | `bg-teal-50 text-teal-800 border-teal-500` |
| **P-5** | **EVALUATE**| `#7C3AED` | `#F3E8FF` | `#6D28D9` | `bg-purple-50 text-purple-800 border-purple-500` |

#### D. Semantic Operational & Safety Tokens
| Status Role | Base Hex | Surface Hex | Text Hex | Usage in MIPS |
| :--- | :--- | :--- | :--- | :--- |
| **Success / Valid** | `#10B981` | `#DCFCE7` | `#15803D` | Berth B-01 validation, passed checklist, draft clearance OK |
| **Warning / Caution**| `#F59E0B` | `#FEF3C7` | `#B45309` | Training session mode badge, non-critical delay, pending step |
| **Danger / Grounding Risk**| `#EF4444` | `#FEE2E2` | `#B91C1C` | Berth B-02 draft violation, emergency stop, collision vector |
| **Info / Telemetry** | `#0284C7` | `#E0F2FE` | `#0369A1` | Information callouts, tidal telemetry, crane counter |
| **Neutral / Muted** | `#94A3B8` | `#F1F5F9` | `#475569` | Unreviewed document pill, disabled control, table header |

#### E. Text & Neutral Typography Colors
| Token Name | Hex Code | Role | Tailwind Class |
| :--- | :--- | :--- | :--- |
| `text-primary` | `#0F172A` | Slate 900 — Main titles, card titles, table data | `text-slate-900` |
| `text-secondary` | `#475569` | Slate 600 — Subtitles, descriptions, captions | `text-slate-600` |
| `text-muted` | `#94A3B8` | Slate 400 — Metadata, placeholder, timestamp | `text-slate-400` |
| `text-inverse` | `#FFFFFF` | Hero title, button text, tactical HUD readouts | `text-white` |
| `border-default` | `#E2E8F0` | Slate 200 — Card borders, tab dividers | `border-slate-200` |
| `border-active` | `#0066FF` | Active selection card border, input focus ring | `border-[#0066FF]` |

---

### 3.2 Typography System

* **Primary Typeface:** `Inter`, `Plus Jakarta Sans`, or system neo-grotesque (`-apple-system`, `BlinkMacSystemFont`, `Segoe UI`).
* **Technical Monospace (Telemetry, Timers, Coordinates, Identifiers):** `JetBrains Mono`, `Roboto Mono`, or `monospace` with `font-variant-numeric: tabular-nums`.
* **Document Serif (Customs / Official Manifests):** `Newsreader`, `Times New Roman`, or `serif` (used for Notice of Arrival / Cargo Manifest authentic preview).

#### Type Scale & Hierarchy
| Hierarchy Level | Size (px/rem) | Weight | Line Height | Tracking | Target Element |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display H1** | `28px / 1.75rem` | Bold (700/800) | `36px` | `-0.02em` | Main Screen Title (Hero Banner) |
| **Section H2** | `18px / 1.125rem`| SemiBold (600) | `24px` | `-0.01em` | Card Title, Section Header |
| **Subhead H3** | `15px / 0.9375rem`| SemiBold (600) | `20px` | `normal` | Sub-section, Table Group Header |
| **KPI Value** | `26px / 1.625rem`| Bold (700) | `32px` | `-0.02em` | Score Value, Big Telemetry Numbers |
| **Body Regular** | `14px / 0.875rem` | Regular (400) | `20px` | `normal` | Paragraph text, scenario description |
| **Body Medium** | `14px / 0.875rem` | Medium (500) | `20px` | `normal` | Table cells, form values |
| **Label / Caption**| `12px / 0.75rem` | Medium (500) | `16px` | `+0.01em` | Metadata label, timestamp, table header |
| **Badge / Pill** | `11px / 0.6875rem`| Bold (700) | `14px` | `+0.04em` | Status badge, phase identifier (UPPERCASE) |
| **Telemetry HUD**| `13px / 0.8125rem`| Bold (700) Mono | `18px` | `0` | Coordinate, speed (knots), clock ($T+14$) |

---

### 3.3 Elevation, Shadows & Borders

| Token Name | Definition | Usage |
| :--- | :--- | :--- |
| `radius-sm` | `4px / 0.25rem` | Badges, small pills, table action icons |
| `radius-md` | `8px / 0.5rem` | Buttons, form inputs, secondary nested cards |
| `radius-lg` | `12px / 0.75rem` | Primary cards, hero containers, modal surfaces |
| `radius-full` | `9999px` | User avatar, circular step counters, status dots |
| `shadow-card`| `0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)` | Standard card elevation |
| `shadow-hover`| `0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.05)` | Card interactive hover |
| `shadow-modal`| `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)` | Centered floating modal, dropdown |

---

## 4. UI Component Catalog & Specifications

### 4.1 Global Navigation Header
* **Height:** `64px` (`h-16`)
* **Background:** Pure White (`#FFFFFF`) with bottom border `1px solid #E2E8F0`
* **Elements:**
  1. **Brand Lockup (Left):** Stylized Cyan Wave Emblem + `MIPS` (`text-xl font-extrabold text-[#0B2240]`) + Subtext `PORT SIMULATOR` (`text-[10px] text-slate-400 font-semibold tracking-wider`).
  2. **Breadcrumb Trail (Center-Left):** `Session > Scenario Briefing` (`text-sm font-medium text-slate-500` with active item in `text-slate-900 font-semibold`).
  3. **Global Search Input:** Compact search bar (`w-64 bg-slate-50 border-slate-200 rounded-lg text-xs`).
  4. **Action Items (Right):** Bell Notification icon with amber dot + User Badge (`Cadet Andika`, `NIT. 202300123`, avatar circle with gold border).

### 4.2 Sidebar Navigation (Academy Hub)
* **Width:** `240px` (`w-60`)
* **Background:** Deep Nautical Navy (`#0A1931`)
* **Active State:** Highlighted pill background `#173562` with left active border `#00A3E0` (3px) and white text.
* **Hover State:** `#132B4F` with smooth transition (`transition-colors duration-150`).
* **Menu Items:**
  * Dashboard (Command Hub)
  * Training Modules / Scenarios
  * Simulation History & Replay
  * Competency Logbook & Certs
  * Reference Documents & SOP
  * Account & Settings

### 4.3 Hero Session Banner
* **Structure:** Deep Navy background (`#0B2546` to `#102A45`) with container terminal or vessel photograph overlay at `opacity-20` and CSS gradient scrim.
* **Typography:**
  * Top Tag: Training Mode Badge (`bg-amber-500/20 text-amber-300 border border-amber-400/40 rounded-full px-3 py-0.5 text-xs font-bold tracking-wider uppercase`).
  * Title: Scenario Title (`text-2xl font-bold text-white tracking-tight`).
  * Subtitle / Metadata Row: Scenario ID (`ID: TRN-2048`), Difficulty (`Intermediate`), Est. Duration (`30-45 Min`), Instructor (`Capt. H. Gunawan, M.Mar.`).

### 4.4 5-Stage Pedagogical Stepper
* **Layout:** Horizontal progress bar spanning the width of the main content card.
* **Nodes:**
  * **Completed Node:** Solid Emerald Green (`bg-[#10B981]`) with White Checkmark icon.
  * **Active Node:** Solid Brand Blue (`bg-[#0066FF]`) with pulsing glow or high-contrast white number/label.
  * **Upcoming Node:** Soft Slate (`bg-slate-200 text-slate-500`).
* **Connecting Rail:** `2px` horizontal bar (`bg-emerald-500` for completed spans, `bg-slate-200` for upcoming).

### 4.5 Berth Decision Comparison Cards
* **Layout:** 2-column comparative grid (`grid grid-cols-1 md:grid-cols-2 gap-6`).
* **Berth Card Specifications:**
  * **Header:** Berth Identifier (`B-01 Deepwater Terminal` vs `B-02 Feeder Quay`).
  * **Status Pill:**
    * B-01: `COMPATIBLE` (`bg-emerald-100 text-emerald-800 border-emerald-300`).
    * B-02: `INSUFFICIENT DRAFT / LOA EXCEEDED` (`bg-red-100 text-red-800 border-red-300`).
  * **Telemetry Metric Table:**
    * `Max LOA`: Permissible vs Actual Vessel LOA.
    * `Max Draft`: Controlling depth vs Arrival Draft + UKC (Safety Clearance calculation).
    * `Cranes`: Super Post-Panamax (QC-01, QC-02) vs Panamax.
  * **Selection State:** Active radio border (`border-2 border-[#0066FF] bg-blue-50/30 shadow-md`).

### 4.6 Tactical Simulation HUD & Vector Viewport
* **Canvas Style:** Dark nautical slate viewport (`#081826`).
* **Elements:**
  * Approach Fairway: Dashed navigation channel bounds (`stroke-[#00A3E0]/40 stroke-dasharray="6,6"`).
  * Radar Distance Rings: Concentric circles at `50m`, `100m`, `200m` (`stroke-[#00A3E0]/20`).
  * Vessel Symbol: Realistic container ship silhouette with heading vector arrow and rudder indicator.
  * Quay & Berth: Crisp grey concrete wharf (`#334155`) with yellow safety curb edge (`#F5B800`).
  * Gantry Cranes: QC-01 and QC-02 positioned on rail with trolley travel axis.
* **Control Floating Bar:** Semitransparent bottom HUD bar (`bg-slate-900/90 backdrop-blur border border-slate-700 rounded-xl px-4 py-2 flex items-center gap-4 text-white`). Includes Play/Pause, Speed (1x, 2x, 4x), Audio toggle, and Step Forward.

---

## 5. Screen-by-Screen Specification (8 Canonical Screens)

### Screen 1: Cadet Academy Dashboard & Command Hub (Slide 6)
* **Route:** `/dashboard`
* **Purpose:** Cadet's primary overview of training progress, upcoming simulation exams, and competency certifications.
* **Key Components:**
  * Top Metric Grid (4 cards): Total Simulations Completed, Average Score (86.4%), Competency Badges (7), Required Modules Remaining (2).
  * Active Training Session Banner: Prominent card prompting to join or continue `TRN-2048`.
  * Module Catalog Carousel: Cards for Container Vessel Arrival, Chemical Tanker Handling, and Bulk Carrier Trimming.
  * Recent Performance Activity Table: Date, Scenario Name, Vessel Type, Final Score, Certification Status.

### Screen 2: Session Entry & Code Validation (Slide 5)
* **Route:** `/session/join`
* **Purpose:** Cadet enters session code issued by the maritime instructor.
* **Key Components:**
  * Centered Card / Modal: Clean card with maritime badge header.
  * Cadet Identity Dossier: Name (`Cadet Andika`), Institutional ID (`NIT. 202300123`), Instructor (`Capt. H. Gunawan, M.Mar.`).
  * Keypad / Code Input: 4-slot segmented input formatted for `MIPS-BERTH-2048` with auto-hyphenation.
  * Validation Status Banner: Green checkmark animation on successful validation.
  * Primary Action: "Masuk ke Sesi Pelatihan" (`w-full bg-[#0066FF] hover:bg-[#0052CC] text-white py-3 rounded-lg font-semibold`).

### Screen 3: Phase 1 — Scenario Briefing [LEARN] (Slide 4)
* **Route:** `/session/[id]/briefing`
* **Purpose:** Mission briefing, vessel particulars review, and operational objective setting.
* **Key Components:**
  * Hero Banner: Scenario title `Container Vessel Arrival & Berthing`, Phase Badge `LEARN` (`#009FE3`).
  * Vessel Particulars Grid: Fully Cellular Container Ship (MV Nusantara), LOA 280.0m, Beam 42.5m, Arrival Draft 10.20m, Cargo 8,500 TEU.
  * Environmental & Weather Forecast Card: Tidal state (+1.2m High Tide), Wind (12 kts NE), Current (0.8 kts Flood), Visibility (Good > 5 NM).
  * Operational Target KPIs: Target BCH $\ge 25$, Safety zero-incident, Berth turnaround time $< 120\text{ mins}$.
  * Action: "Lanjut ke Analisis Dokumen" (`Button` with right arrow icon).

### Screen 4: Phase 2 — Document Package Audit [ANALYZE] (Slide 3)
* **Route:** `/session/[id]/documents`
* **Purpose:** Taruna inspects official cargo and port documents to identify critical operational data and safety anomalies.
* **Key Components:**
  * Phase Badge: `ANALYZE` (`#0284C7`).
  * Document Tab Navigation (4 Documents):
    1. Notice of Arrival (NOA / Notice of Readiness) — Marked with critical draft callout ($10.20\text{ m}$).
    2. Cargo & Dangerous Goods Manifest — Highlights DG Class 3 (Flammable Liquid).
    3. Berth Specifications Table — Depths and length limits of B-01 vs B-02.
    4. Vessel Particulars & Stability Booklet.
  * Interactive Document Canvas: Form-styled document preview with authentic stamped headers and regulatory stamps.
  * Cadet Audit Checklist Panel: Interactive checkboxes for the cadet to flag verified items and discrepancies before proceeding.

### Screen 5: Phase 3 — Decision Interface [DECIDE] (Slide 2)
* **Route:** `/session/[id]/decision`
* **Purpose:** Taruna selects berth allocation, tugboat assistance, and crane resources based on document calculations.
* **Key Components:**
  * Phase Badge: `DECIDE` (`#F59E0B`).
  * Safety Calculation Callout:
    $$\text{Controlling Depth Required} = \text{Draft Kapal } (10.2\text{ m}) + \text{UKC Margin } (1.3\text{ m}) = \mathbf{11.5\text{ m}}$$
  * Side-by-side Comparative Selection:
    * **Berth B-01 (Deepwater):** Depth 14.0m, LOA 300m $\to$ Validated PASS (`border-[#0066FF] bg-blue-50/20`).
    * **Berth B-02 (Feeder):** Depth 9.5m, LOA 250m $\to$ WARNING FAIL (Grounding risk: depth insufficient by $2.0\text{ m}$).
  * Resource Dispatch Form: Tugboat allocation (2 units selected) and Quay Crane selection (QC-01 & QC-02).
  * Action: "Confirm & Launch Simulation" (`bg-[#0066FF] text-white`).

### Screen 6: Phase 4 — Live Simulation Hub [SIMULATE] (Slide 1)
* **Route:** `/session/[id]/simulation`
* **Purpose:** Real-time 2D vector execution of vessel maneuvering, berthing, and container transfer.
* **Key Components:**
  * Phase Badge: `SIMULATE` (`#00A887`).
  * Interactive Tactical Viewport: High-contrast map showing vessel trajectory, tugboat push lines, wharf bollards, and crane rails.
  * Real-time Temporal Clock: Displays elapsed simulation time ($T+00:00$ to $T+45:00$).
  * Live Telemetry Dashboard: Speed over ground (SOG in kts), Rate of Turn (ROT), Heading, Distance to Wharf (meters), Approach Velocity ($< 0.15\text{ m/s}$ safety limit).
  * Event Log Stream: Chronological events (e.g., $T+12:00$ *Tugboat secured starboard bow*, $T+24:00$ *First line on bollard #14*).

### Screen 7: Phase 5 — Assessment & Debriefing [EVALUATE] (Slide 0)
* **Route:** `/session/[id]/assessment`
* **Purpose:** Automated evaluation of cadet decisions, safety compliance, and operational efficiency with instructor debrief.
* **Key Components:**
  * Phase Badge: `EVALUATE` (`#7C3AED`).
  * Score Banner: Large score dial `88 / 100` with badge `PASSED / KOMPETEN`.
  * KPI Evaluation Grid:
    * Berth Selection & Safety Clearance: $100\%$ (Passed)
    * Document Audit Compliance: $95\%$ (1 anomaly flagged)
    * Vessel Approach Velocity: $82\%$ (Minor surge on approach)
    * Crane & Turnaround Efficiency: $85\%$
  * Instructor Advisory Notes: Capt. H. Gunawan debrief remarks and competency endorsement stamp.
  * Primary Actions: "Download Certificate / Evaluation PDF" and "Kembali ke Dashboard".

### Screen 8: Master Architecture & Process Flow Infographic (Slide 7)
* **Route:** Reference Infographic / Marketing Architecture
* **Purpose:** System-level visualization of the complete operational journey, instructor setup, and learning outcomes.
* **Key Components:**
  * Header: Title `Process Flow Demo MIPS` with slogan `Learn • Practice • Decide • Perform`.
  * Instructor Swimlane (Top): Sesi Setup $\to$ Generate Kode $\to$ Dispatch ke Taruna.
  * Taruna Swimlane (Middle): 9-step sequential flow matching the 5 pedagogical phases.
  * 5-Phase Color Ribbon (Bottom of flow): Ribbon highlighting Learn (`#009FE3`), Analyze (`#0284C7`), Decide (`#F59E0B`), Simulate (`#00A887`), Evaluate (`#7C3AED`).
  * Output Demo Summary: Checklist verifying document analyzed, decision validated, simulation executed, and scores archived.

---

## 6. Implementation Reference: Tailwind CSS Configuration

Autonomous agents implementing this design system should apply the following extensions to `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  theme: {
    extend: {
      colors: {
        mips: {
          navy: {
            DEFAULT: '#0A2540',
            dark: '#0A1931',
            deep: '#0B2240',
            hover: '#132B4F',
            active: '#173562',
          },
          cyan: {
            DEFAULT: '#00A3E0',
            light: '#E1F5FE',
            dark: '#0077A8',
          },
          blue: {
            DEFAULT: '#0066FF',
            hover: '#0052CC',
            subtle: '#EFF6FF',
          },
          gold: {
            DEFAULT: '#F5B800',
            hover: '#D99B00',
            light: '#FEF3C7',
            dark: '#B45309',
          },
          tactical: {
            canvas: '#081826',
            grid: '#1E293B',
            ring: '#06B6D4',
          },
          phase: {
            learn: { badge: '#009FE3', surface: '#E1F5FE', text: '#0077A8' },
            analyze: { badge: '#0284C7', surface: '#E0F2FE', text: '#0369A1' },
            decide: { badge: '#F59E0B', surface: '#FEF3C7', text: '#B45309' },
            simulate: { badge: '#00A887', surface: '#E6F7F4', text: '#007A62' },
            evaluate: { badge: '#7C3AED', surface: '#F3E8FF', text: '#6D28D9' },
          },
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'Roboto Mono', 'monospace'],
        serif: ['var(--font-serif)', 'Newsreader', 'Times New Roman', 'serif'],
      },
      boxShadow: {
        'card-subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        'tactical-glow': '0 0 15px rgba(0, 163, 224, 0.25)',
      },
    },
  },
};

export default config;
```

---

## 7. AI Agent Guardrails & Invariants

When generating or modifying frontend code in MIPS:

1. **Zero AI Slop Rule:** Never apply generic purple/rainbow gradients or random frosted glass cards to maritime operational views. MIPS is a technical simulation tool; prioritize high contrast, crisp 1px borders (`border-slate-200`), and structured card padding (`p-4` to `p-6`).
2. **Tabular Numerics Invariant:** Every dynamic telemetry number (speed, heading, distance, countdown timer, container count) **MUST** use `font-mono tabular-nums`. Non-monospace numbers cause visual layout vibration at 60fps.
3. **Draft Margin Redline Rule:** Any calculation involving Under Keel Clearance (UKC) must visibly highlight the formula:
   $$\text{Required Depth} = \text{Arrival Draft } (10.2\text{m}) + \text{UKC } (1.3\text{m}) = 11.5\text{m}$$
   Selecting Berth B-02 (depth 9.5m) must trigger an immediate red danger boundary (`#EF4444`).
4. **Phase Consistency:** Always pair phase names with their certified badge colors:
   * `LEARN` $\to$ Sky `#009FE3`
   * `ANALYZE` $\to$ Blue `#0284C7`
   * `DECIDE` $\to$ Gold `#F59E0B`
   * `SIMULATE` $\to$ Teal `#00A887`
   * `EVALUATE` $\to$ Purple `#7C3AED`
5. **No Layout Shift on Map Viewport:** The tactical radar/basin canvas must have fixed aspect ratios or strict flex-fill containers so that zooming or resizing does not break coordinate translation.
