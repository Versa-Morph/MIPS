# MIPS (Maritime Integrated Port Simulator) — Design Specification & Visual System

**Version:** 1.0  
**Target:** Taruna / Cadet Training Simulation Demo  
**Visual Standard:** OpenBridge 5.0 Guidelines, IALA VTS Portrayal, & Modern Maritime Academics  
**Primary UI Palette:** Maritime Deep Navy + Tactical Cyan + Safety Gold / Marigold  

---

## 1. Executive Design Vision & Persona Context

MIPS is an interactive training simulation designed for **Taruna** (Maritime Cadets / Trainees). 

### The Core Visual Balance: *Academy Day vs. Tactical Night*
As established in maritime design research (OpenBridge 5.0 and IALA Guideline G1177) and demonstrated in the PRD's visual mockups:
1. **Academy / Learning Mode (Daylight Surface):** Used for **Dashboard**, **Briefing**, **Document Center**, and **Assessment Results**. Clean slate/white background, crisp deep navy headers, and official document card styling that evokes an elite maritime academy examination environment.
2. **Tactical Operations HUD (Night Radar Stage):** Used for the **Live Port Simulation**. An immersive, dark tactical display with deep sea-navy canvas (`#06101E`), cyan telemetry readouts, radar distance rings, and high-visibility safety amber accents.

---

## 2. Analysis of PRD Embedded References (Images 1–10)

The PRD explicitly incorporates 10 visual and domain reference assets:

| Image # | Module / Asset | Key Design Elements & Tokens Extracted from PRD |
| :--- | :--- | :--- |
| **Image 1** | **Main Dashboard** (`MARITIME SIM`) | Yellow anchor brand icon; dark navy top bar; 5-phase pipeline tracker (`Briefing` $\to$ `Analysis` $\to$ `Decision` $\to$ `Simulation` $\to$ `Evaluation`); competency radar gauges; clean card borders. |
| **Image 2** | **Phase 1: Mission Briefing** | Vessel dossier card with physical dimension callouts (LOA 280m, Draft 10.2m, Beam 42.5m, Capacity 8,500 TEU); dark navy instructor advisory card (*Capt. H. Gunawan*); checklist badges. |
| **Image 3** | **Phase 2: Document Center** | Authentic Indonesian Port Authority Notice of Arrival (NOA) form layout; red highlight on $10.20\text{ m}$ arrival draft; analysis checklist with key insight callout banner. |
| **Image 4** | **Phase 3: Decision & Berth Assignment** | Calculation header bar displaying required controlling depth ($10.2\text{ m} + 1.3\text{ m} \text{ UKC} = \mathbf{11.5\text{ m}}$); side-by-side comparison cards for **Berth B-01** (green pass) and **Berth B-02** (red fail warning). |
| **Image 5** | **Phase 4: Live Simulation HUD** | Tactical plan-view maritime radar; vessel approach channel with distance rings; live telemetry grid (Heading $085^\circ$, ROT $0.5^\circ/\text{min}$, Wind $12\text{kn}$, Current $0.8\text{kn}$); engine/rudder controls; terminal event log. |
| **Image 6** | **Phase 5: Assessment & Debriefing** | Score badge (**88/100** / "PASSED" / "EXCELLENT"); approach velocity analysis curve; competency breakdown (Berth Allocation, Handling, Safety); instructor debrief notes. |
| **Images 7–8** | **Authentic Maritime Documents** | Commercial Arrival Notice (King Ocean) and IMO Dangerous Goods Manifest template with official regulatory 14-column layout. |
| **Images 9–10** | **Geospatial & Port Authority Layouts** | Official Indonesian Geospatial Information Agency (BIG) map of Teluk Jakarta / Tanjung Priok and Pelindo port master plan & wharf facilities table. |

---

## 3. Color Palette & Token Architecture

The color system is calibrated for WCAG AAA contrast, adhering to the OpenBridge maritime standard.

```
┌────────────────────────────────────────────────────────────────────────┐
│ MIPS MARITIME DESIGN SYSTEM COLOR PALETTE                              │
├───────────────────┬───────────────────┬────────────────────────────────┤
│ Deep Navy #08182B │ Tactical #06101E  │ Safety Gold #F5B800            │
│ (Brand & Headers) │ (Simulation HUD)  │ (Active State & CTA Accent)    │
├───────────────────┼───────────────────┼────────────────────────────────┤
│ Tactical Cyan     │ Emerald Green     │ Hazard Red #EF4444             │
│ #06B6D4 / #38BDF8 │ #10B981           │ (Depth Warning & Emergency)    │
│ (Telemetry & Map) │ (Pass & Verified) │                                │
└───────────────────┴───────────────────┴────────────────────────────────┘
```

### 3.1 Primary & Operational Palette

| Color Role | Hex Code | Tailwind Token | Usage in MIPS |
| :--- | :--- | :--- | :--- |
| **Brand Maritime Gold** | `#F5B800` | `amber-500` / `yellow-500` | Brand anchor logo, primary CTA buttons, active step pill indicator, focus rings. |
| **Brand Gold Hover** | `#D99B00` | `amber-600` | Hover state for primary buttons. |
| **Header Marine Navy** | `#08182B` | `slate-950` / custom | Top application bar, instructor panel, official card header bands. |
| **HUD Radar Canvas** | `#06101E` | `slate-950` (deep) | Water basin, tactical plan-view radar, approach fairway background. |
| **Tactical Cyan** | `#06B6D4` | `cyan-500` | Radar distance rings, vessel approach trajectory, rudder/heading indicators. |
| **Telemetry Sky Blue**| `#38BDF8` | `sky-400` | Active telemetry numbers, vessel velocity HUD tags, crane spreader lines. |

### 3.2 Semantic Status & Feedback Palette

| Semantic Role | Hex Code | Tailwind Token | Application |
| :--- | :--- | :--- | :--- |
| **Success / Valid** | `#10B981` | `emerald-500` | Berth B-01 validation banner, verified checklist items, "PASSED" score badge. |
| **Warning / Caution** | `#F59E0B` | `amber-500` | In-progress steps, instructor alerts, non-critical review advisories. |
| **Danger / Rejection** | `#EF4444` | `red-500` | Berth B-02 LOA/draft violation alert, Emergency Stop button, draft redline callout. |
| **Neutral Border** | `#E2E8F0` | `slate-200` | Document card borders, table dividers in light mode. |
| **Tactical Grid Line**| `#1E293B` | `slate-800` | Radar range circles, coordinate tick lines, berth boundary outlines. |
| **Light Canvas** | `#F8FAFC` | `slate-50` | Academy background for Dashboard, Briefing, Document Center, and Results. |
| **Card Surface** | `#FFFFFF` | `white` | Document preview cards, assessment metric containers. |

---

## 4. Typography Hierarchy & Font System

To convey both an authoritative naval academy atmosphere and high-precision instrument telemetry:

### 4.1 Font Families
1. **Primary Interface Font: `Plus Jakarta Sans`** (or `Inter` as neutral fallback)
   * *Why:* Clean, modern geometric sans-serif, widely used in Indonesian modern civic and enterprise applications; exceptional readability at compact sizes.
2. **Telemetry & Technical Monospace: `JetBrains Mono`** (or `Geist Mono`)
   * *Why:* High-legibility monospaced typeface equipped with `tabular-nums` so numbers (speed, knots, coordinates, timers, container counters) remain perfectly steady without layout jitter during high-speed 60fps simulation.
3. **Official Document Serif: `Newsreader` / `Courier Prime`** (or styled system mono)
   * *Why:* Used exclusively inside the Notice of Arrival and Manifest document cards to evoke authentic stamped customs and port authority manifests.

### 4.2 Type Scale & Hierarchy

| Element | Font Family | Size / Weight | Tailwind Class | Letter Spacing |
| :--- | :--- | :--- | :--- | :--- |
| **Display / Hero Header**| Plus Jakarta Sans | 24px / Bold (700) | `text-2xl font-bold` | `tracking-tight` |
| **Module / Screen Title** | Plus Jakarta Sans | 18px / SemiBold (600)| `text-lg font-semibold` | `tracking-normal` |
| **Section & Card Header** | Plus Jakarta Sans | 14px / Bold (700) | `text-sm font-bold uppercase` | `tracking-wider` |
| **Body Text** | Plus Jakarta Sans | 14px / Regular (400)| `text-sm font-normal` | `tracking-normal` |
| **HUD Telemetry Value** | JetBrains Mono | 20px / Bold (700) | `font-mono text-xl font-bold` | `tracking-tight tabular-nums` |
| **HUD Telemetry Label** | Plus Jakarta Sans | 11px / Medium (500)| `text-[11px] font-medium uppercase`| `tracking-widest text-slate-400` |
| **Document Body & Stamp**| JetBrains Mono | 12px / Regular (400)| `font-mono text-xs` | `tracking-normal` |

---

## 5. UI Components & Visual Patterns

### 5.1 Training Step Pipeline Badge (Header Bar)
Displays cadet progression through the 5 pedagogical milestones:
* **Completed Step:** Circle with emerald checkmark `✓` + subdued text.
* **Active Step:** Solid `#F5B800` circle with white step number + bold active title.
* **Pending Step:** Dark slate ring with muted number + grayed label.

### 5.2 Document Cards & Modal Viewer
* **Card Style:** White surface (`#FFFFFF`), subtle shadow (`shadow-sm`), $1\text{px}$ slate border (`border-slate-200`).
* **Document Badges:** 
  * Unopened: `UNREVIEWED` in muted gray (`bg-slate-100 text-slate-600`).
  * Opened: `✓ VERIFIED` in emerald (`bg-emerald-50 text-emerald-700 border border-emerald-200`).
* **Digital Document Viewer (Modal):**
  * Simulated paper sheet with official Jakarta Port Authority letterhead, watermark emblem, reference code (`ARR-2026-NUS-001`), tabular specification grid, and official seal.
  * Critical values (e.g. `Draft: 10.20 m`) subtly highlighted in red with an interactive "Flag as Constraint" tooltip.

### 5.3 Berth Decision Comparative Cards (Screen 05)
Side-by-side comparative cards with high semantic clarity:
* **Berth B-01 (Feasible):**
  * Border: `border-slate-200 hover:border-emerald-500`
  * Dimension comparison table:
    * LOA: $300\text{ m} \ge 280\text{ m}$ vessel $\rightarrow$ **PASS (Emerald badge)**
    * Depth: $12.5\text{ m} \ge 11.5\text{ m}$ req. $\rightarrow$ **PASS (Emerald badge)**
    * Cranes: 4 Super Post-Panamax $\rightarrow$ **PASS (Emerald badge)**
  * CTA: Green bordered `SELECT BERTH B-01`.
* **Berth B-02 (Infeasible):**
  * Border: `border-slate-200 hover:border-red-400`
  * Dimension comparison table:
    * LOA: $250\text{ m} < 280\text{ m}$ vessel $\rightarrow$ **FAIL (Red badge: -30m)**
    * Depth: $9.5\text{ m} < 11.5\text{ m}$ req. $\rightarrow$ **FAIL (Red badge: -2.0m grounding hazard)**
  * Top Warning Banner: `⚠ CRITICAL RESTRICTION: GROUNDING RISK`.

---

## 6. Simulation Stage & Visual Radar Cockpit (Screen 06)

The simulation layout adopts a **3-panel cockpit** layout:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ TOP BAR: MIPS SIMULATOR ● LIVE | MV NUSANTARA | BERTH B-01 | [EMERGENCY STOP]           │
├───────────────────────────────┬────────────────────────────────────────────────────────┤
│ LEFT PANEL:                   │ CENTER: TACTICAL 2D SVG RADAR PORT STAGE               │
│ CADET DOSSIER & CONTROLS      │                                                        │
│ • Vessel: MV Nusantara        │      [ Range Ring: 500m ]                              │
│ • Assigned: B-01 (Validated)  │               ~ ~ ~ ~ ~ ~ ~                            │
│ • Speed: [1x] [2x] [4x]       │               ~ ~ ~ 🚢 MV Nusantara                    │
│ • State: [❚❚ Pause] [▶ Play]  │                     ↘ [2.4 kn | 142m]                  │
│                               │      ─────────────────┬──────────────────              │
│ • Telemetry Grid:             │      Berth B-02       │ Berth B-01 (Active)            │
│   - Heading: 085°             │      (Feeder Quay)    │ 🏗 QC-01   🏗 QC-02           │
│   - Rate of Turn: 0.5°/min    │      ─────────────────┴──────────────────              │
│   - Wind: 12kn NW             │      Quay Apron: 🚚 TT-01  🚚 TT-02                    │
│   - Current: 0.8kn            │      Container Yard: [][][][] [][][][]                 │
├───────────────────────────────┴────────────────────────────────────────────────────────┤
│ BOTTOM PANEL: DUAL MONITORING DECKS                                                    │
│ ┌───────────────────────────────────────────┬────────────────────────────────────────┐ │
│ │ LIVE EVENT TIMELINE                       │ REAL-TIME OPERATION KPIS               │ │
│ │ [08:00] Vessel fairway entry confirmed    │ Containers Handled:  [ 28 / 50 ]  56%  │ │
│ │ [08:03] Berth B-01 allocation active      │ Gross Productivity:  71.4 Moves / Hour │ │
│ │ [08:05] Mooring lines made fast           │ Crane Utilization:   72% Active        │ │
│ │ [08:10] QC-01 & QC-02 commenced discharge │ Truck Utilization:   68% Active        │ │
│ └───────────────────────────────────────────┴────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### 6.1 SVG Canvas Graphical Specs
* **ViewBox:** `0 0 1000 600` (Responsive SVG scaling maintaining 5:3 aspect ratio).
* **Water Layer:** Dark slate-blue gradient (`#06101E` to `#0B1E36`) with animated subtle sea ripples.
* **Radar Overlay:** Concentric range rings ($100\text{m}$, $250\text{m}$, $500\text{m}$) styled with `#1E293B` stroke and `$0.5\text{px}$` dashed lines.
* **Berth Structure:** Concrete texture border `#334155` with bright yellow hazard bollards along the edge.
* **Vessel (MV Nusantara):** 
  * Stylized container ship hull (Length: $180\text{px}$, Width: $32\text{px}$).
  * Container bay grid on deck colored in multi-color TEU blocks (slate-600, blue-500, green-500, orange-500 for reefer).
  * Smooth translation trajectory along fairway into Berth B-01.
* **Quay Cranes (QC-01 & QC-02):**
  * Gantry frame on rails over Berth B-01.
  * Moving trolley and vertical spreader hoist cable.
* **Terminal Trucks (TT-01, TT-02):**
  * Mini container chassis moving in a circular path between quay apron and yard slots.

---

## 7. Assessment Scorecard Design (Screen 07)

* **Hero Score Badge:** Large circular or rounded gauge displaying `92 / 100` in bold gold typography (`#F5B800`) with emerald `EXCELLENT CADET EVALUATION` banner.
* **4-Pillar Weighted Breakdown Bars:**
  1. **Document Review:** `20 / 20 pts` (Progress bar: 100% fill, Emerald).
  2. **Berth Selection:** `40 / 40 pts` (Progress bar: 100% fill, Emerald).
  3. **Operation Completion:** `18 / 20 pts` (Progress bar: 90% fill, Sky Blue).
  4. **KPI Performance:** `14 / 20 pts` (Progress bar: 70% fill, Amber).
* **Feedback Container:** Slate-900 bordered box with cadet instructor badge and actionable debrief takeaways.
* **CTAs:** Dual buttons:
  * Primary: `[Back to Training Center]` (`bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold`).
  * Secondary: `[Review Simulation Replay]` (`border border-slate-300 hover:bg-slate-100 text-slate-700`).

---

## 8. Tailwind Configuration Theme Extension

```typescript
// tailwind.config.ts extension for MIPS Design System
export const themeExtension = {
  colors: {
    maritime: {
      gold: '#F5B800',
      'gold-hover': '#D99B00',
      navy: '#08182B',
      hud: '#06101E',
      cyan: '#06B6D4',
      telemetry: '#38BDF8',
      quay: '#334155',
      apron: '#1E293B',
      surface: '#F8FAFC'
    }
  },
  fontFamily: {
    sans: ['var(--font-jakarta)', 'Inter', 'sans-serif'],
    mono: ['var(--font-jetbrains-mono)', 'monospace'],
    doc: ['var(--font-courier)', 'Courier New', 'monospace']
  }
};
```
