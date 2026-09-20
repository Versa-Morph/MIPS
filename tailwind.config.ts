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
