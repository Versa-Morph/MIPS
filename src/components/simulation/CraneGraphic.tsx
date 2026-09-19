"use client";

import React from "react";

interface CraneGraphicProps {
  id: string; // "QC-01" | "QC-02"
  x: number; // Horizontal rail coordinate
  y: number; // Base quay coordinate (approx 210)
  spreaderY: number; // Spreader vertical height (180 to 260)
  isOperating: boolean;
}

export function CraneGraphic({
  id,
  x,
  y,
  spreaderY,
  isOperating,
}: CraneGraphicProps) {
  return (
    <g transform={`translate(${x}, ${y})`} className="select-none">
      {/* Crane Gantry Frame Base Legs on Rails */}
      <rect
        x="-18"
        y="0"
        width="6"
        height="35"
        fill="#334155"
        stroke="#1E293B"
        strokeWidth="1"
      />
      <rect
        x="12"
        y="0"
        width="6"
        height="35"
        fill="#334155"
        stroke="#1E293B"
        strokeWidth="1"
      />

      {/* Rail Wheels / Bogies */}
      <circle cx="-15" cy="36" r="3" fill="#64748B" />
      <circle cx="15" cy="36" r="3" fill="#64748B" />

      {/* Gantry Horizontal Portal Beam */}
      <rect
        x="-22"
        y="-8"
        width="44"
        height="8"
        fill="#475569"
        stroke="#1E293B"
        strokeWidth="1"
      />

      {/* Crane Boom Tower / Pylon */}
      <path
        d="M -16,-8 L -8,-45 L 8,-45 L 16,-8 Z"
        fill="#1E293B"
        stroke="#F5B800"
        strokeWidth="1.5"
      />

      {/* Operator Cabin */}
      <rect
        x="-6"
        y="-32"
        width="12"
        height="10"
        rx="2"
        fill="#0284C7"
        stroke="#0F172A"
        strokeWidth="1"
      />

      {/* Boom Jib extending over vessel waterside (towards y negative) */}
      <line
        x1="0"
        y1="-45"
        x2="0"
        y2="-105"
        stroke="#F5B800"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Tension Cables */}
      <line x1="-12" y1="-45" x2="0" y2="-100" stroke="#94A3B8" strokeWidth="1" />
      <line x1="12" y1="-45" x2="0" y2="-100" stroke="#94A3B8" strokeWidth="1" />

      {/* Trolley moving along Boom */}
      <g transform={`translate(0, -85)`}>
        <rect
          x="-7"
          y="-3"
          width="14"
          height="6"
          rx="1"
          fill="#38BDF8"
          stroke="#0F172A"
          strokeWidth="1"
        />

        {/* Spreader Hoist Cables extending down to ship bay */}
        <line
          x1="-4"
          y1="3"
          x2="-4"
          y2={Math.max(10, spreaderY - y + 85)}
          stroke="#E2E8F0"
          strokeWidth="1"
          strokeDasharray={isOperating ? "2,2" : "none"}
        />
        <line
          x1="4"
          y1="3"
          x2="4"
          y2={Math.max(10, spreaderY - y + 85)}
          stroke="#E2E8F0"
          strokeWidth="1"
          strokeDasharray={isOperating ? "2,2" : "none"}
        />

        {/* Spreader Bar & Hoisted Container */}
        <g transform={`translate(0, ${Math.max(10, spreaderY - y + 85)})`}>
          {/* Spreader Head */}
          <rect
            x="-9"
            y="-2"
            width="18"
            height="4"
            rx="1"
            fill="#F59E0B"
            stroke="#78350F"
            strokeWidth="0.8"
          />

          {/* Active Container being handled */}
          {isOperating && (
            <rect
              x="-8"
              y="2"
              width="16"
              height="8"
              rx="1"
              fill="#0284C7"
              stroke="#0C4A6E"
              strokeWidth="0.5"
              className="animate-pulse"
            />
          )}
        </g>
      </g>

      {/* Crane Identification Badge */}
      <g transform="translate(0, 16)">
        <rect
          x="-14"
          y="-7"
          width="28"
          height="14"
          rx="3"
          fill="#08182B"
          stroke="#F5B800"
          strokeWidth="1"
        />
        <text
          x="0"
          y="3.5"
          textAnchor="middle"
          fill="#F5B800"
          fontSize="9"
          fontWeight="bold"
          fontFamily="monospace"
        >
          {id}
        </text>
      </g>
    </g>
  );
}
