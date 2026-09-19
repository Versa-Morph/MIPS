"use client";

import React from "react";

interface TruckGraphicProps {
  id: string; // "TT-01" | "TT-02"
  x: number;
  y: number;
  direction: "EAST" | "WEST";
  hasContainer: boolean;
  containerColor?: string;
}

export function TruckGraphic({
  id,
  x,
  y,
  direction,
  hasContainer,
  containerColor = "#0284C7",
}: TruckGraphicProps) {
  const isWest = direction === "WEST";

  return (
    <g
      transform={`translate(${x}, ${y}) ${isWest ? "scale(-1, 1)" : ""}`}
      className="transition-all duration-500 ease-linear select-none"
    >
      {/* Truck Chassis Frame */}
      <rect
        x="-16"
        y="-5"
        width="32"
        height="10"
        rx="2"
        fill="#334155"
        stroke="#1E293B"
        strokeWidth="0.8"
      />

      {/* Wheels */}
      <circle cx="-10" cy="-6" r="2.5" fill="#0F172A" />
      <circle cx="-10" cy="6" r="2.5" fill="#0F172A" />
      <circle cx="8" cy="-6" r="2.5" fill="#0F172A" />
      <circle cx="8" cy="6" r="2.5" fill="#0F172A" />

      {/* Driver Cabin */}
      <rect
        x="9"
        y="-4"
        width="8"
        height="8"
        rx="1.5"
        fill="#F5B800"
        stroke="#B45309"
        strokeWidth="0.6"
      />
      {/* Windshield */}
      <rect x="13" y="-3" width="3" height="6" rx="0.5" fill="#38BDF8" opacity="0.8" />

      {/* Loaded Container on Flatbed */}
      {hasContainer && (
        <rect
          x="-14"
          y="-4"
          width="20"
          height="8"
          rx="1"
          fill={containerColor}
          stroke="#0F172A"
          strokeWidth="0.5"
        />
      )}

      {/* Identification Tag */}
      <text
        x="0"
        y={isWest ? 14 : -9}
        textAnchor="middle"
        fill="#94A3B8"
        fontSize="7"
        fontWeight="bold"
        fontFamily="monospace"
        transform={isWest ? "scale(-1, 1)" : ""}
      >
        {id}
      </text>
    </g>
  );
}
