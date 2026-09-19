"use client";

import React from "react";
import { Ship } from "lucide-react";

interface VesselGraphicProps {
  x: number;
  y: number;
  rotation: number;
  vesselName: string;
  containersCompleted: number;
  totalContainers: number;
  isOperating: boolean;
}

export function VesselGraphic({
  x,
  y,
  rotation,
  vesselName,
  containersCompleted,
  totalContainers,
  isOperating,
}: VesselGraphicProps) {
  // 50 container boxes arranged on deck (5 rows of 10 bays)
  const rows = 5;
  const cols = 10;
  const containerWidth = 14;
  const containerHeight = 6;

  return (
    <g
      transform={`translate(${x}, ${y}) rotate(${rotation})`}
      className="transition-all duration-700 ease-out"
    >
      {/* Ship Hull Shadow */}
      <rect
        x="-115"
        y="-28"
        width="230"
        height="56"
        rx="26"
        fill="#020617"
        opacity="0.6"
        filter="blur(4px)"
      />

      {/* Main Hull */}
      <path
        d="M -110,-24 L 80,-24 Q 120,0 80,24 L -110,24 Q -120,0 -110,-24 Z"
        fill="#1E293B"
        stroke="#475569"
        strokeWidth="2"
      />

      {/* Hull Deck Plate */}
      <path
        d="M -102,-20 L 70,-20 Q 105,0 70,20 L -102,20 Z"
        fill="#0F172A"
        stroke="#334155"
        strokeWidth="1"
      />

      {/* Deck Container Bays (Grid of 50 containers) */}
      <g transform="translate(-75, -16)">
        {Array.from({ length: totalContainers }).map((_, index) => {
          const col = Math.floor(index / rows);
          const row = index % rows;
          const isDischarged = index < containersCompleted;

          // Color palette for container types
          const isReefer = index < 5;
          const containerColor = isDischarged
            ? "#1E293B" // Empty bay
            : isReefer
            ? "#F59E0B" // Amber reefer
            : index % 3 === 0
            ? "#0284C7" // Blue import
            : index % 2 === 0
            ? "#10B981" // Green export
            : "#64748B"; // Slate standard

          return (
            <rect
              key={index}
              x={col * (containerWidth + 1.5)}
              y={row * (containerHeight + 1)}
              width={containerWidth}
              height={containerHeight}
              rx="1"
              fill={containerColor}
              stroke={isDischarged ? "#334155" : "#0F172A"}
              strokeWidth="0.5"
              opacity={isDischarged ? 0.35 : 1}
              className="transition-all duration-300"
            />
          );
        })}
      </g>

      {/* Aft Navigation Bridge & Funnel */}
      <g transform="translate(-100, -14)">
        <rect
          x="0"
          y="0"
          width="18"
          height="28"
          rx="3"
          fill="#334155"
          stroke="#64748B"
          strokeWidth="1"
        />
        {/* Bridge Wing & Windows */}
        <rect x="3" y="4" width="12" height="20" rx="1" fill="#0284C7" opacity="0.8" />
        {/* Red Funnel */}
        <circle cx="8" cy="14" r="3.5" fill="#EF4444" stroke="#991B1B" strokeWidth="1" />
      </g>

      {/* Bow Mooring Deck */}
      <g transform="translate(85, 0)">
        <circle cx="0" cy="0" r="4" fill="#64748B" />
        <line x1="-5" y1="0" x2="5" y2="0" stroke="#94A3B8" strokeWidth="1" />
      </g>

      {/* Floating HUD Telemetry Tag */}
      <g transform="translate(0, -42)" className="select-none">
        <rect
          x="-70"
          y="-14"
          width="140"
          height="24"
          rx="6"
          fill="#08182B"
          stroke={isOperating ? "#10B981" : "#F5B800"}
          strokeWidth="1.5"
          opacity="0.95"
        />
        <text
          x="0"
          y="2"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="11"
          fontWeight="bold"
          fontFamily="monospace"
        >
          {vesselName} · {isOperating ? "OPERATING" : "DOCKING"}
        </text>
      </g>
    </g>
  );
}
