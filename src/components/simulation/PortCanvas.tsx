"use client";

import React from "react";
import { useSimulationStore } from "@/store/useSimulationStore";
import { VesselGraphic } from "./VesselGraphic";
import { CraneGraphic } from "./CraneGraphic";
import { TruckGraphic } from "./TruckGraphic";
import { TugboatGraphic } from "./TugboatGraphic";

export function PortCanvas() {
  const {
    currentSimMinute,
    vesselPosition,
    craneSpreaderY,
    containersHandled,
    totalContainers,
    currentEvent,
    weatherMode,
  } = useSimulationStore();

  const isOperating = currentEvent.vesselStatus === "OPERATING";
  const isDocked =
    currentEvent.vesselStatus === "BERTHED" ||
    currentEvent.vesselStatus === "OPERATING" ||
    currentEvent.vesselStatus === "COMPLETED";

  // Dynamic truck positions cycling along the quay apron
  const truck1Progress = (currentSimMinute * 45) % 800;
  const truck1X = 450 + (truck1Progress < 400 ? truck1Progress : 800 - truck1Progress);
  const truck1Dir = truck1Progress < 400 ? "EAST" : "WEST";

  const truck2Progress = ((currentSimMinute + 3) * 55) % 800;
  const truck2X = 450 + (truck2Progress < 400 ? truck2Progress : 800 - truck2Progress);
  const truck2Dir = truck2Progress < 400 ? "EAST" : "WEST";

  return (
    <div className="w-full h-full bg-[#06101E] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative select-none">
      <svg
        viewBox="0 0 1000 560"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Water gradient */}
          <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop
              offset="0%"
              stopColor={
                weatherMode === "DAY_FAIRWAY"
                  ? "#0284C7"
                  : weatherMode === "COASTAL_FOG"
                  ? "#1E293B"
                  : "#061224"
              }
            />
            <stop
              offset="100%"
              stopColor={
                weatherMode === "DAY_FAIRWAY"
                  ? "#075985"
                  : weatherMode === "COASTAL_FOG"
                  ? "#334155"
                  : "#0B1E36"
              }
            />
          </linearGradient>

          {/* Quay concrete gradient */}
          <linearGradient id="quayGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          {/* Yard asphalt gradient */}
          <linearGradient id="yardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0B1322" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
        </defs>

        {/* 1. Water Basin (Top half: y = 0 to 220) */}
        <rect x="0" y="0" width="1000" height="220" fill="url(#waterGrad)" />

        {/* Radar Range Rings (Concentric circles centered at Fairway Channel) */}
        <g opacity="0.15">
          <circle
            cx="480"
            cy="120"
            r="120"
            fill="none"
            stroke="#38BDF8"
            strokeWidth="1"
            strokeDasharray="4,4"
          />
          <circle
            cx="480"
            cy="120"
            r="240"
            fill="none"
            stroke="#38BDF8"
            strokeWidth="1"
            strokeDasharray="4,4"
          />
          <circle
            cx="480"
            cy="120"
            r="380"
            fill="none"
            stroke="#38BDF8"
            strokeWidth="1"
            strokeDasharray="4,4"
          />
          {/* Coordinate grid crosshair lines */}
          <line x1="0" y1="120" x2="1000" y2="120" stroke="#38BDF8" strokeWidth="0.5" />
          <line x1="480" y1="0" x2="480" y2="220" stroke="#38BDF8" strokeWidth="0.5" />
        </g>

        {/* Approach Fairway Navigation Buoys */}
        <g opacity="0.8">
          <circle cx="80" cy="50" r="3.5" fill="#10B981" />
          <circle cx="80" cy="90" r="3.5" fill="#EF4444" />
          <line
            x1="80"
            y1="70"
            x2="350"
            y2="150"
            stroke="#F5B800"
            strokeWidth="1"
            strokeDasharray="5,5"
            opacity="0.35"
          />
        </g>

        {/* 2. Quay Wall Structure (y = 220 to 230) */}
        <rect x="0" y="218" width="1000" height="12" fill="#334155" stroke="#475569" strokeWidth="1" />

        {/* Hazard Safety Striping along Quay Edge */}
        <g opacity="0.7">
          {Array.from({ length: 40 }).map((_, i) => (
            <line
              key={i}
              x1={i * 25}
              y1="220"
              x2={i * 25 + 12}
              y2="230"
              stroke="#F5B800"
              strokeWidth="2.5"
            />
          ))}
        </g>

        {/* Bollards along Quay Wall */}
        <g>
          {Array.from({ length: 25 }).map((_, i) => (
            <circle
              key={i}
              cx={30 + i * 40}
              cy="224"
              r="2.5"
              fill="#F5B800"
              stroke="#78350F"
              strokeWidth="0.8"
            />
          ))}
        </g>

        {/* Mooring Lines (when vessel is docked at B-01) */}
        {isDocked && (
          <g stroke="#F8FAFC" strokeWidth="1.2" opacity="0.85">
            {/* Bow Lines */}
            <line x1="465" y1="150" x2="490" y2="224" />
            <line x1="465" y1="150" x2="520" y2="224" />
            {/* Stern Lines */}
            <line x1="280" y1="150" x2="260" y2="224" />
            <line x1="280" y1="150" x2="290" y2="224" />
          </g>
        )}

        {/* Berth B-02 Zone Label (Feeder Quay - Restricted) */}
        <g transform="translate(180, 205)">
          <rect x="-85" y="-12" width="170" height="20" rx="4" fill="#08182B" stroke="#EF4444" strokeWidth="1" opacity="0.9" />
          <text x="0" y="2" textAnchor="middle" fill="#EF4444" fontSize="10" fontWeight="bold" fontFamily="monospace">
            BERTH B-02 · 250m (9.0m DRAFT)
          </text>
        </g>

        {/* Berth B-01 Zone Label (Deepwater Active Berth) */}
        <g transform="translate(680, 205)">
          <rect x="-95" y="-12" width="190" height="20" rx="4" fill="#08182B" stroke="#10B981" strokeWidth="1.2" opacity="0.9" />
          <text x="0" y="2" textAnchor="middle" fill="#10B981" fontSize="10" fontWeight="bold" fontFamily="monospace">
            ★ BERTH B-01 · 300m (12.0m DRAFT)
          </text>
        </g>

        {/* 3. Quay Apron (Crane Tracks & Transfer Lanes: y = 230 to 320) */}
        <rect x="0" y="230" width="1000" height="90" fill="url(#quayGrad)" />

        {/* Crane Rails (Double horizontal rail tracks) */}
        <line x1="0" y1="240" x2="1000" y2="240" stroke="#64748B" strokeWidth="1.5" strokeDasharray="6,2" />
        <line x1="0" y1="275" x2="1000" y2="275" stroke="#64748B" strokeWidth="1.5" strokeDasharray="6,2" />

        {/* Internal Truck Transfer Lanes */}
        <line x1="0" y1="295" x2="1000" y2="295" stroke="#F5B800" strokeWidth="1" strokeDasharray="8,6" opacity="0.4" />

        {/* 4. Container Yard Stacks (y = 320 to 560) */}
        <rect x="0" y="320" width="1000" height="240" fill="url(#yardGrad)" />

        {/* Yard Lane Markings */}
        <g opacity="0.3" stroke="#475569" strokeWidth="1" strokeDasharray="4,4">
          <line x1="0" y1="380" x2="1000" y2="380" />
          <line x1="0" y1="450" x2="1000" y2="450" />
          <line x1="0" y1="520" x2="1000" y2="520" />
        </g>

        {/* Yard Container Blocks */}
        <g transform="translate(60, 335)">
          {/* Block A: Import Stacks */}
          <g>
            <text x="0" y="-5" fill="#38BDF8" fontSize="9" fontWeight="bold" fontFamily="monospace">
              YARD BLOCK A · IMPORT STORAGE
            </text>
            {Array.from({ length: 18 }).map((_, i) => (
              <rect
                key={i}
                x={(i % 6) * 38}
                y={Math.floor(i / 6) * 22}
                width="34"
                height="16"
                rx="2"
                fill={i < containersHandled ? "#0284C7" : "#1E293B"}
                stroke="#0F172A"
                strokeWidth="1"
                className="transition-all duration-300"
              />
            ))}
          </g>

          {/* Block B: Export Stacks */}
          <g transform="translate(360, 0)">
            <text x="0" y="-5" fill="#10B981" fontSize="9" fontWeight="bold" fontFamily="monospace">
              YARD BLOCK B · EXPORT STAGING
            </text>
            {Array.from({ length: 14 }).map((_, i) => (
              <rect
                key={i}
                x={(i % 5) * 38}
                y={Math.floor(i / 5) * 22}
                width="34"
                height="16"
                rx="2"
                fill="#10B981"
                stroke="#064E3B"
                strokeWidth="1"
                opacity="0.8"
              />
            ))}
          </g>

          {/* Block C: Reefer Plugs */}
          <g transform="translate(680, 0)">
            <text x="0" y="-5" fill="#F5B800" fontSize="9" fontWeight="bold" fontFamily="monospace">
              YARD BLOCK C · REEFER 440V TOWER
            </text>
            {Array.from({ length: 8 }).map((_, i) => (
              <rect
                key={i}
                x={(i % 4) * 38}
                y={Math.floor(i / 4) * 22}
                width="34"
                height="16"
                rx="2"
                fill="#F59E0B"
                stroke="#78350F"
                strokeWidth="1"
              />
            ))}
          </g>
        </g>

        {/* 5. Animated Vessel: MV Nusantara */}
        <VesselGraphic
          x={vesselPosition.x}
          y={vesselPosition.y}
          rotation={vesselPosition.rotation}
          vesselName="MV NUSANTARA"
          containersCompleted={containersHandled}
          totalContainers={totalContainers}
          isOperating={isOperating}
        />

        {/* 5.1 Harbor Tugs Assisting Maneuver (PRD Image 5: Tug Bima & Tug Arjuna) */}
        {currentSimMinute <= 10 && (
          <g className="transition-all duration-700">
            {/* Towing / Pushing lines from Tug Bima to Vessel Bow */}
            <line
              x1={vesselPosition.x + 70}
              y1={vesselPosition.y - 10}
              x2={vesselPosition.x + 85}
              y2={vesselPosition.y - 40}
              stroke="#F5B800"
              strokeWidth="1.2"
              strokeDasharray="3,2"
              opacity="0.75"
            />
            <TugboatGraphic
              id="BIMA"
              x={vesselPosition.x + 85}
              y={vesselPosition.y - 45}
              rotation={vesselPosition.rotation + 45}
              isPushing={currentSimMinute >= 3 && currentSimMinute <= 8}
            />

            {/* Towing / Pushing lines from Tug Arjuna to Vessel Stern */}
            <line
              x1={vesselPosition.x - 70}
              y1={vesselPosition.y - 10}
              x2={vesselPosition.x - 85}
              y2={vesselPosition.y - 40}
              stroke="#F5B800"
              strokeWidth="1.2"
              strokeDasharray="3,2"
              opacity="0.75"
            />
            <TugboatGraphic
              id="ARJUNA"
              x={vesselPosition.x - 85}
              y={vesselPosition.y - 45}
              rotation={vesselPosition.rotation - 35}
              isPushing={currentSimMinute >= 3 && currentSimMinute <= 8}
            />
          </g>
        )}

        {/* 6. Rail-Mounted Quay Cranes QC-01 & QC-02 */}
        <CraneGraphic
          id="QC-01"
          x={550}
          y={235}
          spreaderY={craneSpreaderY}
          isOperating={isOperating}
        />
        <CraneGraphic
          id="QC-02"
          x={720}
          y={235}
          spreaderY={craneSpreaderY}
          isOperating={isOperating}
        />

        {/* 7. Animated Terminal Trucks shuttling containers */}
        {isDocked && (
          <>
            <TruckGraphic
              id="TT-01"
              x={truck1X}
              y={295}
              direction={truck1Dir}
              hasContainer={isOperating}
              containerColor="#0284C7"
            />
            <TruckGraphic
              id="TT-02"
              x={truck2X}
              y={308}
              direction={truck2Dir}
              hasContainer={isOperating}
              containerColor="#F59E0B"
            />
          </>
        )}

        {weatherMode === "COASTAL_FOG" && (
          <rect
            x="0"
            y="0"
            width="1000"
            height="560"
            fill="#CBD5E1"
            opacity="0.22"
            className="pointer-events-none animate-pulse"
          />
        )}
      </svg>
    </div>
  );
}
