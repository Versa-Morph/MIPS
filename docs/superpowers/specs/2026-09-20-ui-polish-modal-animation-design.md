# Design Specification: MIPS UI Polish — Adaptive Modals, Typography Scaling & Page Transitions

**Author:** Sisyphus (OhMyAntigravity)  
**Date:** September 20, 2026  
**Status:** Approved for Implementation Planning  
**Target:** MIPS (Maritime Integrated Port Simulator) Client Demonstration  
**Design Direction:** Tactical HUD Polish (Refined Adaptive Components, Accessible Typography, Dynamic Flow Transitions)

---

## 1. Problem Statement & User Feedback

During review of the modernized Tactical HUD interface, three key usability and aesthetic issues were identified:
1. **Oversized and Inflexible Modals:** `Modal.tsx` is hardcoded to a giant `h-[92vh] max-w-5xl` container intended for the PDF viewer. When used for brief dialogs (confirmation prompts in Screen 04, What-If Grounding warnings in Screen 05, checkpoint authorizations in Screen 06, or equipment telemetry inspections), it produces an awkward, mostly-empty box with redundant document viewer footers.
2. **Small Font Sizes on Critical Data:** Input fields in the Pre-Arrival Clearance Dossier (Screen 04) and technical specifications (LOA, Draft, UKC depth) in Screens 02, 05, and 06 use micro-typography (`text-[10px]` to `text-xs`) that is difficult to read and interact with on standard desktop displays.
3. **Abrupt Screen Transitions:** Switching between the 7 screens causes instantaneous component replacement without motion feedback, making state changes feel disconnected and jarring.

---

## 2. Component Architecture & Design Solutions

### 2.1 Adaptive & Contextual Modal System (`Modal.tsx`)

`Modal.tsx` will be refactored into a dual-mode adaptive component:

#### A. Document / PDF Mode (`isDocumentViewer = Boolean(pdfUrl)`)
* **Dimensions:** `max-w-5xl h-[88vh]` with vertical scroll for long documents.
* **Header:** Displays official document title, reference badge, PDF/Data Sheet toggle tabs, and download/open actions.
* **Footer:** Displays formal cryptographic signature verification status (`✓ Digital Signature Verified (BKI / KSOP Priok)`).

#### B. Tactical Dialog Mode (`!pdfUrl` — Confirmation, Clearance, Inspection, Warnings)
* **Dimensions:** Responsive auto-height `max-w-xl w-full max-h-[85vh]` with centered, compact layout.
* **Container Styling:** Premium dark glassmorphism (`bg-[#0B1528]/95 backdrop-blur-2xl border border-cyan-500/30 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] rounded-2xl`).
* **Header:** Streamlined title with contextual status badge (e.g. `RADIO TELEGRAM`, `OFFICIAL CLEARANCE`, `TELEMETRY FEED`) and close icon.
* **Footer:** Context-specific action bar without the irrelevant document signature status text.
* **Opening Animation:** Smooth scale-in transition (`scale-95 opacity-0 -> scale-100 opacity-100` over 200ms with `cubic-bezier(0.16, 1, 0.3, 1)`).

---

### 2.2 Typography Scaling (Form Inputs & Technical Specs)

Targeted font size enhancements to ensure high legibility and ergonomic input:

#### A. Screen 04 — Pre-Arrival Clearance Dossier Form:
* **Field Labels:** Upgraded from `text-[10px]` to `text-xs font-bold text-slate-300 tracking-wide uppercase`.
* **Input Elements:** Upgraded from `text-xs` (12px) to `text-sm font-mono font-medium text-slate-100` (14px) with increased touch/click targets (`py-2.5 px-3.5`).
* **Placeholders & Hints:** Distinct muted color with readable contrast (`placeholder:text-slate-500 text-xs`).
* **Section Headers:** Prominent `text-xs font-extrabold uppercase text-amber-400 tracking-wider`.

#### B. Screens 02, 05, 06 — Technical Data & Metrics:
* **Vessel Particulars (LOA, Draft, Beam):** Numeric values upgraded to `text-base sm:text-lg font-black font-mono text-slate-100`.
* **Depth & UKC Clearances:** Key safety values styled in high-contrast colored monospace (`text-emerald-400 font-bold text-base`).
* **Parameter Subtitles:** Increased from `text-[9px] / text-[10px]` to `text-xs text-slate-400`.

---

### 2.3 Page Transition Animations & Micro-Interactions

#### A. Smooth Slide & Fade Page Transition (`animate-page-enter`)
In `src/app/globals.css`, add a dedicated CSS animation:
```css
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
```

In `src/app/page.tsx`:
Wrap the active screen renderer with a keyed container:
```tsx
<div key={currentState} className="flex-1 flex flex-col animate-page-enter">
  {renderActiveScreen()}
</div>
```
Whenever `currentState` changes (e.g. from `BRIEFING` to `DOCUMENT_REVIEW`), React remounts the container and smoothly animates the incoming screen into view.

#### B. Component-Level Micro-Interactions:
* **Buttons:** `active:scale-[0.98] transition-transform duration-100`.
* **Selection Cards (Berth Decision B-01/B-02):** Subtle glowing border expansion on active selection.
* **Modal Overlay:** Fade-in backdrop with backdrop-blur over 200ms.

---

## 3. Scope & Non-Regression Constraints

1. **State Machine Integrity:** Zero changes to `useTrainingStore.ts` or `useSimulationStore.ts`. All state transitions, timers, and validations remain 100% untouched.
2. **Text & Test Continuity:** All exact string assertions, input placeholder strings, button names, and DOM IDs verified by tests must remain identical.
3. **100% Test Pass Rate:** All 58 existing unit, integration, and E2E tests across 17 test suites must pass without error.
4. **Clean Production Build:** `npm run build` must compile cleanly with 0 TypeScript errors and 0 warnings.
