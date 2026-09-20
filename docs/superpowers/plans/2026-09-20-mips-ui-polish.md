# MIPS UI Polish — Adaptive Modals, Typography Scaling & Page Transitions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor `Modal.tsx` into an adaptive dual-mode component (compact dialog vs wide document viewer), scale up font sizes for form inputs and technical metrics for optimal desktop legibility, and add smooth 300ms slide-fade page transition animations across all screen transitions.

**Architecture:** An animation utility layer in `globals.css` and keyed wrapper in `page.tsx` introduces screen transitions. `Modal.tsx` dynamically adjusts layout dimensions, styling, and action bars based on document vs dialog context. Key data displays across Screens 02, 04, 05, and 06 receive proportional font bumps (`text-sm` for inputs, `text-base`/`text-lg` for vessel specs).

**Tech Stack:** Next.js 16.3.5, React 19, Tailwind CSS, Lucide React, Vitest.

## Global Constraints

- **Design Personality:** Modern Maritime Tactical HUD Glassmorphism (`#030712`, glass panels, `#F59E0B` electric amber, `#00E5FF` tactical cyan, `#10B981` safety emerald).
- **Modal Adaptability:** If `pdfUrl` is provided, render `max-w-5xl h-[88vh]` with tabs and BKI/KSOP signature footer; otherwise render compact `max-w-xl max-h-[85vh]` dialog without redundant document footers.
- **Font Scaling Target:** Pre-Arrival Dossier form inputs bumped from `text-xs` (12px) to `text-sm font-mono font-medium` (14px) with `py-2.5 px-3.5`; labels bumped to `text-xs font-bold`. Technical vessel specs in Screens 02, 05, and 06 bumped to `text-base` / `text-lg font-black font-mono`.
- **Transitions:** 300ms smooth slide-up + fade-in with cubic-bezier `(0.16, 1, 0.3, 1)` keyed by `currentState`.
- **Zero Test Regressions:** All 58 existing unit, integration, and E2E tests across 17 test files must continue to pass cleanly.
- **Zero Build Warnings/Errors:** `npm run build` must compile cleanly with 0 errors.

---

## File Structure Map

```
mips/
├── src/
│   ├── app/
│   │   ├── globals.css                    # Task 1: Add @keyframes pageEnter, .animate-page-enter, modal pop-in
│   │   └── page.tsx                       # Task 1: Add keyed transition wrapper <div key={currentState}>
│   ├── components/
│   │   ├── common/
│   │   │   └── Modal.tsx                  # Task 2: Adaptive modal (pdfUrl check -> doc vs dialog mode)
│   │   └── screens/
│   │       ├── 04_DocumentCenter.tsx      # Task 3: Font scale up for form inputs & labels
│   │       ├── 02_ScenarioCard.tsx        # Task 4: Font scale up for target vessel specs
│   │       ├── 05_BerthDecision.tsx       # Task 4: Font scale up for dossier reference & depth metrics
│   │       └── 06_SimulationView.tsx      # Task 4: Font scale up for left decision summary & telemetry cards
└── tests/                                 # Verification test suites
```

---

### Task 1: Page Transition Animations & Micro-Interactions

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/page.tsx`
- Test: `tests/e2eFlow.test.tsx`

**Interfaces:**
- Produces: CSS utility class `.animate-page-enter` with 300ms duration, smooth cubic-bezier easing, and subtle vertical slide.

- [ ] **Step 1: Add page enter and modal pop-in animations in `src/app/globals.css`**

Add the following animation definitions:
```css
/* Page & Screen Transition Animations */
@keyframes pageEnter {
  0% {
    opacity: 0;
    transform: translateY(12px) scale(0.995);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-page-enter {
  animation: pageEnter 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes modalPopIn {
  0% {
    opacity: 0;
    transform: scale(0.95) translateY(8px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-modal-pop {
  animation: modalPopIn 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
```

- [ ] **Step 2: Wrap screen renderer in `src/app/page.tsx` with keyed container**

```tsx
<main className="flex-1 overflow-y-auto flex flex-col">
  <div key={currentState} className="flex-1 flex flex-col animate-page-enter">
    {renderActiveScreen()}
  </div>
</main>
```

- [ ] **Step 3: Verify tests pass**

Run: `npx vitest run tests/e2eFlow.test.tsx`
Expected: 1/1 passed.

- [ ] **Step 4: Commit Task 1**

```bash
git add src/app/globals.css src/app/page.tsx
git commit -m "feat(animation): add smooth 300ms page transitions and modal pop-in animations"
```

---

### Task 2: Adaptive & Contextual Modal Component (`Modal.tsx`)

**Files:**
- Modify: `src/components/common/Modal.tsx`
- Test: `tests/documentCenter.test.tsx`, `tests/berthDecision.test.tsx`, `tests/simulationView.test.tsx`

**Interfaces:**
- Consumes: `pdfUrl?: string`, `title: string`, `referenceNumber?: string`, `isOpen: boolean`, `onClose: () => void`, `children: React.ReactNode`.
- Produces: If `pdfUrl` is present, renders wide document viewer (`max-w-5xl h-[88vh]`) with signature status footer. If `pdfUrl` is absent, renders sleek dialog (`max-w-xl max-h-[85vh]`) without signature footer.

- [ ] **Step 1: Refactor `src/components/common/Modal.tsx` to support adaptive sizing**

Implementation requirements:
- Check `const isDoc = Boolean(pdfUrl);`.
- Container class:
  - If `isDoc`: `max-w-5xl h-[88vh] flex flex-col`.
  - If `!isDoc`: `max-w-xl w-full max-h-[85vh] flex flex-col animate-modal-pop shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border-cyan-500/30`.
- Backdrop: `bg-abyssal/90 backdrop-blur-md`.
- Header:
  - If `isDoc`: Shows document viewer badge and PDF/Data Sheet tabs, download, external link, and close button.
  - If `!isDoc`: Shows tactical title, reference number pill, and clean close button with hover ring.
- Body:
  - If `isDoc`: Embedded iframe or sheet with scrollable container.
  - If `!isDoc`: `p-5 sm:p-6 overflow-y-auto flex-1`.
- Footer:
  - If `isDoc`: Renders cryptographic security status footer (`✓ Digital Signature Verified (BKI / KSOP Priok)`).
  - If `!isDoc`: Omits the document signature footer entirely, allowing children to render their own action buttons cleanly.

- [ ] **Step 2: Run test suite to verify all modals work cleanly**

Run: `npx vitest run tests/documentCenter.test.tsx tests/berthDecision.test.tsx tests/simulationView.test.tsx`
Expected: All tests pass.

- [ ] **Step 3: Commit Task 2**

```bash
git add src/components/common/Modal.tsx
git commit -m "refactor(modal): convert Modal into adaptive component with compact dialog mode and sleek glassmorphism"
```

---

### Task 3: Typography Scaling in Pre-Arrival Clearance Dossier (`04_DocumentCenter.tsx`)

**Files:**
- Modify: `src/components/screens/04_DocumentCenter.tsx`
- Test: `tests/documentCenter.test.tsx`, `tests/e2eFlow.test.tsx`

**Interfaces:**
- Consumes: `cadetDossier`, `submitCadetDossier`.
- Produces: Upgraded input fields with `text-sm font-mono font-medium` (14px) and `py-2.5 px-3.5`, label elements with `text-xs font-bold text-slate-300`, while preserving exact input placeholders, labels, and state binding.

- [ ] **Step 1: Update form fields and labels in `src/components/screens/04_DocumentCenter.tsx`**

Implementation requirements:
- Section titles: `text-xs font-extrabold uppercase text-electric-amber tracking-wider`.
- Field labels: `text-xs font-bold text-slate-300 block mb-1.5`.
- Input fields:
  - Class: `w-full py-2.5 px-3.5 rounded-xl bg-abyssal border border-slate-700/80 text-sm font-mono font-medium text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-tactical-cyan/50 focus:border-tactical-cyan transition-all`.
- Preserve all 11 exact placeholder strings:
  - `cth: MV Nusantara`
  - `cth: PK-47A`
  - `cth: 1234567`
  - `cth: Singapore`
  - `cth: 280.0`
  - `cth: 10.20`
  - `Hitung: Draft + 1.3m UKC`
  - `cth: 50`
  - `cth: 5`
  - `cth: 4.1`
  - `cth: 3`
- Preserve submit confirmation button and locked state banner.

- [ ] **Step 2: Run tests to verify zero regressions**

Run: `npx vitest run tests/documentCenter.test.tsx tests/e2eFlow.test.tsx`
Expected: All tests pass.

- [ ] **Step 3: Commit Task 3**

```bash
git add src/components/screens/04_DocumentCenter.tsx
git commit -m "refactor(typography): enhance Pre-Arrival Dossier form input typography and padding for desktop readability"
```

---

### Task 4: Typography Scaling in Technical Specification & Metrics Tables

**Files:**
- Modify: `src/components/screens/02_ScenarioCard.tsx`
- Modify: `src/components/screens/05_BerthDecision.tsx`
- Modify: `src/components/screens/06_SimulationView.tsx`
- Test: `tests/scenarioCard.test.tsx`, `tests/berthDecision.test.tsx`, `tests/simulationView.test.tsx`

**Interfaces:**
- Consumes: `vessel`, `berths`, `cadetDossier`, `maneuver`.
- Produces: Large, high-contrast monospace metrics across vessel overview, berth comparison cards, and simulation controls.

- [ ] **Step 1: Scale up metrics in `src/components/screens/02_ScenarioCard.tsx`**

- Target Vessel Overview table:
  - Numeric specs (LOA `280 m`, Draft `10.2 m`, ETA `08:00 WIB`, Cargo `50 ISO Containers`): Upgrade to `text-base sm:text-lg font-black font-mono text-slate-100`.
  - Metric sub-labels: `text-xs text-slate-400`.

- [ ] **Step 2: Scale up reference card and comparison metrics in `src/components/screens/05_BerthDecision.tsx`**

- Dossier reference card:
  - Values (`280 Meters`, `10.2 Meters`, `11.5 Meters`): Ensure `text-base sm:text-lg font-black font-mono`.
  - Sub-labels: `text-xs text-slate-400`.
- Comparison cards B-01 & B-02:
  - Depth clearance values: `text-base sm:text-lg font-black font-mono`.
  - Compatibility badges: `text-xs font-bold`.

- [ ] **Step 3: Scale up telemetry numbers in `src/components/screens/06_SimulationView.tsx`**

- `YOUR DECISION` card:
  - Values (Berth `B-01`, LOA `280m`, Draft `10.2m`): `text-sm font-bold font-mono text-slate-200`.

- [ ] **Step 4: Run tests to verify zero regressions**

Run: `npx vitest run tests/scenarioCard.test.tsx tests/berthDecision.test.tsx tests/simulationView.test.tsx`
Expected: All tests pass.

- [ ] **Step 5: Commit Task 4**

```bash
git add src/components/screens/02_ScenarioCard.tsx src/components/screens/05_BerthDecision.tsx src/components/screens/06_SimulationView.tsx
git commit -m "refactor(typography): scale up technical metrics and vessel specifications for high legibility"
```

---

### Task 5: End-to-End Test Verification & Production Build

**Files:**
- Test: Full repository test suite (`npx vitest run`)
- Build: `npm run build`

- [ ] **Step 1: Run TypeScript compiler check**

Run: `npx tsc --noEmit`
Expected: 0 errors, 0 warnings.

- [ ] **Step 2: Run complete Vitest test suite**

Run: `npx vitest run`
Expected: 17/17 test files passed, 58/58 tests passed (100%).

- [ ] **Step 3: Run Next.js production build**

Run: `npm run build`
Expected: Next.js 16.3.5 Turbopack production build succeeds with 0 errors.

- [ ] **Step 4: Commit any final refinements**

```bash
git add -A
git commit -m "chore: verify full test suite and production build pass cleanly after UI polish"
```
