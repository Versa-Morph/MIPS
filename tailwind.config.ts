import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // MIPS Authoritative Maritime Design System Tokens
        mips: {
          navy: {
            DEFAULT: "#0A2540",
            dark: "#0A1931",
            deep: "#0B2240",
            hover: "#132B4F",
            active: "#173562",
          },
          cyan: {
            DEFAULT: "#00A3E0",
            light: "#E1F5FE",
            dark: "#0077A8",
          },
          blue: {
            DEFAULT: "#0066FF",
            hover: "#0052CC",
            subtle: "#EFF6FF",
          },
          gold: {
            DEFAULT: "#F5B800",
            hover: "#D99B00",
            light: "#FEF3C7",
            dark: "#B45309",
          },
          tactical: {
            canvas: "#081826",
            grid: "#1E293B",
            ring: "#06B6D4",
          },
          phase: {
            learn: { badge: "#009FE3", surface: "#E1F5FE", text: "#0077A8" },
            analyze: { badge: "#0284C7", surface: "#E0F2FE", text: "#0369A1" },
            decide: { badge: "#F59E0B", surface: "#FEF3C7", text: "#B45309" },
            simulate: { badge: "#00A887", surface: "#E6F7F4", text: "#007A62" },
            evaluate: { badge: "#7C3AED", surface: "#F3E8FF", text: "#6D28D9" },
          },
        },
        // Backward-compatible coral mapping to Brand Maritime Blue
        coral: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#0066FF",
          DEFAULT: "#0066FF",
          600: "#0052CC",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
          950: "#0B2240",
        },
        surface: {
          light: "#FFFFFF",
          "light-subtle": "#F8FAFC",
          "light-border": "#E2E8F0",
          dark: "#0A1931",
          "dark-subtle": "#102A45",
          "dark-border": "#1E3A5F",
        },
        abyssal: "#081826",
        "abyssal-surface": "#0B192C",
        "glass-panel": "rgba(10, 25, 49, 0.75)",
        "glass-border": "rgba(51, 65, 85, 0.60)",
        "glass-highlight": "rgba(0, 163, 224, 0.15)",
        "tactical-cyan": "#00A3E0",
        "tactical-cyan-dim": "#0284C7",
        "electric-amber": "#F59E0B",
        "electric-amber-hover": "#D97706",
        "safety-emerald": "#10B981",
        "hazard-crimson": "#EF4444",
        maritime: {
          gold: "#F5B800",
          "gold-hover": "#D99B00",
          navy: "#0A2540",
          hud: "#081826",
          cyan: "#00A3E0",
          telemetry: "#38BDF8",
          quay: "#334155",
          apron: "#1E293B",
          surface: "#F8FAFC",
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "JetBrains Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        soft: "0 2px 10px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)",
        card: "0 4px 20px -2px rgba(10, 25, 49, 0.05), 0 2px 6px -1px rgba(10, 25, 49, 0.02)",
        "card-dark": "0 15px 35px -10px rgba(0, 0, 0, 0.6), 0 2px 6px -1px rgba(0, 0, 0, 0.4)",
        coral: "0 8px 24px -4px rgba(0, 102, 255, 0.35)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        "cyan-glow": "0 0 15px rgba(0, 163, 224, 0.25)",
        "amber-glow": "0 0 15px rgba(245, 184, 0, 0.25)",
        "emerald-glow": "0 0 15px rgba(16, 185, 129, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
