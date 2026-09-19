"use client";

import React from "react";

interface TugboatGraphicProps {
  id: string; // "BIMA" | "ARJUNA"
  x: number;
  y: number;
  rotation: number;
  isPushing: boolean;
}

export function TugboatGraphic({
  id,
  x,
  y,
  rotation,
  isPushing,
}: TugboatGraphicProps) {
  return (
    <g
      transform={`translate(${x}, ${y}) rotate(${rotation})`}
      className="transition-all duration-700 ease-out select-none"
    >
      {/* Water wash foam when pushing */}
      {isPushing && (
        <ellipse
          cx="0"
          cy="18"
          rx="14"
          ry="6"
          fill="#38BDF8"
          opacity="0.3"
          className="animate-pulse"
        />
      )}

      {/* Tugboat Hull Shadow */}
      <rect
        x="-14"
        y="-20"
        width="28"
        height="40"
        rx="12"
        fill="#020617"
        opacity="0.5"
      />

      {/* Main Tugboat Hull */}
      <path
        d="M -12,18 L 12,18 L 12,-6 Q 12,-20 0,-24 Q -12,-20 -12,-6 Z"
        fill="#0284C7"
        stroke="#0369A1"
        strokeWidth="1.2"
      />

      {/* Heavy Rubber Bow Fender */}
      <path
        d="M -12,-6 Q -12,-20 0,-24 Q 12,-20 12,-6"
        fill="none"
        stroke="#0F172A"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Wheelhouse / Cabin */}
      <rect
        x="-7"
        y="-6"
        width="14"
        height="14"
        rx="2"
        fill="#FFFFFF"
        stroke="#475569"
        strokeWidth="0.8"
      />
      {/* Windows */}
      <rect x="-5" y="-5" width="10" height="4" rx="0.5" fill="#38BDF8" opacity="0.9" />

      {/* Exhaust Funnel */}
      <circle cx="0" cy="5" r="2.5" fill="#EF4444" stroke="#991B1B" strokeWidth="0.5" />

      {/* Towing Winch on Aft Deck */}
      <rect x="-4" y="11" width="8" height="4" rx="1" fill="#334155" />

      {/* Name Label */}
      <text
        x="0"
        y="28"
        textAnchor="middle"
        fill="#F5B800"
        fontSize="7.5"
        fontWeight="bold"
        fontFamily="monospace"
      >
        TUG {id}
      </text>
    </g>
  );
}
