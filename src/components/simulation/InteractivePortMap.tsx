"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import {
  Navigation,
  Compass,
  Map as MapIcon,
  Crosshair,
  Anchor,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from "lucide-react";
import { useSimulationStore } from "@/store/useSimulationStore";

// Coordinates for Tanjung Priok Port & Teluk Jakarta
const PORT_CENTER: [number, number] = [-6.0920, 106.8820];
const BERTH_B01_COORDS: [number, number] = [-6.0985, 106.8885];
const BERTH_B02_COORDS: [number, number] = [-6.1015, 106.8820];

// Breakwater coordinates from Peta RBI 1209-444
const WEST_BREAKWATER: [number, number][] = [
  [-6.0840, 106.8680],
  [-6.0850, 106.8730],
  [-6.0880, 106.8770],
];
const EAST_BREAKWATER: [number, number][] = [
  [-6.0880, 106.8830],
  [-6.0850, 106.8870],
  [-6.0840, 106.8920],
];

// Fairway Channel Waypoints
const FAIRWAY_TRACK: [number, number][] = [
  [-6.0680, 106.8740], // Fairway Outer Buoy
  [-6.0780, 106.8780],
  [-6.0860, 106.8805], // Entrance between breakwaters
  [-6.0940, 106.8850], // Harbor Turning Basin
  [-6.0985, 106.8885], // Berth B-01 Quayside
];

// Peta RBI Sheet 1209-444 Geographic Bounds (106°52'30"E - 107°00'00"E / 06°00'00"S - 06°07'30"S)
const RBI_BOUNDS: [[number, number], [number, number]] = [
  [-6.1250, 106.8750], // Southwest corner
  [-6.0000, 107.0000], // Northeast corner
];

function interpolatePosition(minute: number): {
  lat: number;
  lng: number;
  heading: number;
} {
  if (minute <= 0) {
    return { lat: FAIRWAY_TRACK[0][0], lng: FAIRWAY_TRACK[0][1], heading: 165 };
  }
  if (minute >= 8) {
    return { lat: BERTH_B01_COORDS[0], lng: BERTH_B01_COORDS[1], heading: 90 };
  }

  // Linear progression along fairway track segments
  if (minute < 3) {
    const factor = minute / 3;
    const lat =
      FAIRWAY_TRACK[0][0] +
      (FAIRWAY_TRACK[2][0] - FAIRWAY_TRACK[0][0]) * factor;
    const lng =
      FAIRWAY_TRACK[0][1] +
      (FAIRWAY_TRACK[2][1] - FAIRWAY_TRACK[0][1]) * factor;
    return { lat, lng, heading: 165 - 15 * factor };
  } else if (minute < 5) {
    const factor = (minute - 3) / 2;
    const lat =
      FAIRWAY_TRACK[2][0] +
      (FAIRWAY_TRACK[3][0] - FAIRWAY_TRACK[2][0]) * factor;
    const lng =
      FAIRWAY_TRACK[2][1] +
      (FAIRWAY_TRACK[3][1] - FAIRWAY_TRACK[2][1]) * factor;
    return { lat, lng, heading: 150 - 30 * factor };
  } else {
    const factor = (minute - 5) / 3;
    const lat =
      FAIRWAY_TRACK[3][0] +
      (FAIRWAY_TRACK[4][0] - FAIRWAY_TRACK[3][0]) * factor;
    const lng =
      FAIRWAY_TRACK[3][1] +
      (FAIRWAY_TRACK[4][1] - FAIRWAY_TRACK[3][1]) * factor;
    return { lat, lng, heading: 120 - 30 * factor };
  }
}

export default function InteractivePortMap() {
  const { currentSimMinute, containersHandled, inspectEquipment } =
    useSimulationStore();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const vesselMarkerRef = useRef<L.Marker | null>(null);
  const tugBimaMarkerRef = useRef<L.Marker | null>(null);
  const tugArjunaMarkerRef = useRef<L.Marker | null>(null);
  const rbiOverlayRef = useRef<L.ImageOverlay | null>(null);

  const [showRbiOverlay, setShowRbiOverlay] = useState(true);
  const [overlayOpacity, setOverlayOpacity] = useState(0.55);

  const isOperating = currentSimMinute >= 8;

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: PORT_CENTER,
      zoom: 14,
      minZoom: 12,
      maxZoom: 18,
      zoomControl: false,
    });

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Peta RBI BIG Lembar 1209-444',
      maxZoom: 19,
    }).addTo(map);

    // Georeferenced Peta RBI Image Overlay (BIG Lembar 1209-444 Tanjungpriok)
    const rbiOverlay = L.imageOverlay(
      "/assets/images/peta-rbi-tanjungpriok.png",
      RBI_BOUNDS,
      {
        opacity: 0.55,
        interactive: false,
      }
    ).addTo(map);
    rbiOverlayRef.current = rbiOverlay;

    // Draw Tanjung Priok Breakwaters
    L.polyline(WEST_BREAKWATER, {
      color: "#0F172A",
      weight: 6,
      opacity: 0.9,
    })
      .addTo(map)
      .bindTooltip("West Breakwater (Tanggul Barat)", { permanent: false });

    L.polyline(EAST_BREAKWATER, {
      color: "#0F172A",
      weight: 6,
      opacity: 0.9,
    })
      .addTo(map)
      .bindTooltip("East Breakwater (Tanggul Timur)", { permanent: false });

    // Draw Fairway Approach Channel Polyline
    L.polyline(FAIRWAY_TRACK, {
      color: "#F5B800",
      weight: 2,
      dashArray: "6,6",
      opacity: 0.7,
    })
      .addTo(map)
      .bindTooltip("Fairway Entrance Channel (-14.0m LWS)");

    // Fairway Buoy Markers
    const greenBuoyIcon = L.divIcon({
      className: "custom-buoy",
      html: `<div style="width:12px;height:12px;border-radius:50%;background:#10B981;border:2px solid #064E3B;box-shadow:0 0 6px #10B981;"></div>`,
      iconSize: [12, 12],
    });
    L.marker([-6.0780, 106.8770], { icon: greenBuoyIcon })
      .addTo(map)
      .bindPopup("<strong>Starboard Fairway Buoy #1</strong><br>Fl.G.4s");

    const redBuoyIcon = L.divIcon({
      className: "custom-buoy",
      html: `<div style="width:12px;height:12px;border-radius:50%;background:#EF4444;border:2px solid #991B1B;box-shadow:0 0 6px #EF4444;"></div>`,
      iconSize: [12, 12],
    });
    L.marker([-6.0780, 106.8795], { icon: redBuoyIcon })
      .addTo(map)
      .bindPopup("<strong>Port Fairway Buoy #2</strong><br>Fl.R.4s");

    // Berth B-01 Marker & Area (Deepwater Quay)
    const b01Marker = L.circleMarker(BERTH_B01_COORDS, {
      radius: 10,
      fillColor: "#10B981",
      color: "#064E3B",
      weight: 2,
      fillOpacity: 0.85,
    })
      .addTo(map)
      .bindPopup(
        "<strong>BERTH B-01 (DEEPWATER TERMINAL)</strong><br>Max LOA: 300.0m<br>Depth: 12.0m LWS<br>Status: OPERATIONAL • ASSIGNED"
      );

    // Berth B-02 Marker & Area (Feeder Quay - Dermaga Nusantara II)
    const b02Marker = L.circleMarker(BERTH_B02_COORDS, {
      radius: 8,
      fillColor: "#EF4444",
      color: "#991B1B",
      weight: 2,
      fillOpacity: 0.75,
    })
      .addTo(map)
      .bindPopup(
        "<strong>BERTH B-02 (DERMAGA NUSANTARA II)</strong><br>Max LOA: 250.0m<br>Depth: 9.0m LWS (RESTRICTED)<br>Hazard: Grounding risk for MV Nusantara"
      );

    // Vessel Marker (MV Nusantara)
    const pos = interpolatePosition(0);
    const vesselIcon = L.divIcon({
      className: "vessel-div-icon",
      html: `
        <div style="transform: rotate(${pos.heading}deg); transform-origin: center; cursor: pointer;">
          <div style="width: 44px; height: 16px; background: #08182B; border: 2px solid #F5B800; border-radius: 6px; position: relative; box-shadow: 0 4px 10px rgba(0,0,0,0.6);">
            <div style="width: 6px; height: 8px; background: #EF4444; position: absolute; left: 4px; top: 2px; border-radius: 1px;"></div>
            <div style="width: 22px; height: 8px; background: #0284C7; position: absolute; left: 14px; top: 2px; border-radius: 1px;"></div>
            <div style="width: 0; height: 0; border-top: 4px solid transparent; border-bottom: 4px solid transparent; border-left: 8px solid #F5B800; position: absolute; right: -8px; top: 2px;"></div>
          </div>
          <div style="font-family: monospace; font-size: 8px; font-weight: bold; color: #08182B; background: #F5B800; padding: 1px 3px; border-radius: 2px; margin-top: 2px; text-align: center; white-space: nowrap;">
            MV NUSANTARA
          </div>
        </div>
      `,
      iconSize: [60, 30],
      iconAnchor: [30, 15],
    });

    const vesselMarker = L.marker([pos.lat, pos.lng], { icon: vesselIcon })
      .addTo(map)
      .on("click", () => {
        inspectEquipment({
          type: "VESSEL",
          id: "MV-NUSANTARA",
          name: "MV Nusantara",
          status: "Under Way Fairway Channel / Docking at B-01",
          metrics: [
            { label: "Position", value: `${pos.lat.toFixed(4)}°S, ${pos.lng.toFixed(4)}°E` },
            { label: "LOA", value: "280.00 Meters" },
            { label: "Arrival Draft", value: "10.20 Meters" },
            { label: "Required Depth", value: "11.50 Meters (UKC Safe)" },
            { label: "Containers Handled", value: `${containersHandled} / 50 Units` },
          ],
          operationalNotes:
            "Vessel navigates inside Teluk Jakarta fairway per Peta RBI 1209-444. Mooring clearance and twin quay cranes standing by at Berth B-01.",
        });
      });
    vesselMarkerRef.current = vesselMarker;

    // Tugboat Bima Marker
    const tugIcon = L.divIcon({
      className: "tug-icon",
      html: `<div style="width: 14px; height: 14px; border-radius: 50%; background: #F5B800; border: 2px solid #08182B; box-shadow: 0 0 5px #F5B800;"></div>`,
      iconSize: [14, 14],
    });
    const tugBimaMarker = L.marker([pos.lat + 0.002, pos.lng + 0.002], {
      icon: tugIcon,
    })
      .addTo(map)
      .bindTooltip("Tug Bima (Bow Assist)");
    tugBimaMarkerRef.current = tugBimaMarker;

    // Tugboat Arjuna Marker
    const tugArjunaMarker = L.marker([pos.lat - 0.002, pos.lng - 0.002], {
      icon: tugIcon,
    })
      .addTo(map)
      .bindTooltip("Tug Arjuna (Stern Assist)");
    tugArjunaMarkerRef.current = tugArjunaMarker;

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Vessel & Tug Positions based on simulation time
  useEffect(() => {
    if (!vesselMarkerRef.current || !mapInstanceRef.current) return;

    const pos = interpolatePosition(currentSimMinute);
    vesselMarkerRef.current.setLatLng([pos.lat, pos.lng]);

    // Update rotation HTML
    const vesselIcon = L.divIcon({
      className: "vessel-div-icon",
      html: `
        <div style="transform: rotate(${pos.heading}deg); transform-origin: center; cursor: pointer;">
          <div style="width: 46px; height: 16px; background: #08182B; border: 2px solid #F5B800; border-radius: 6px; position: relative; box-shadow: 0 4px 10px rgba(0,0,0,0.6);">
            <div style="width: 6px; height: 8px; background: #EF4444; position: absolute; left: 4px; top: 2px; border-radius: 1px;"></div>
            <div style="width: 24px; height: 8px; background: ${
              isOperating ? "#10B981" : "#0284C7"
            }; position: absolute; left: 14px; top: 2px; border-radius: 1px;"></div>
            <div style="width: 0; height: 0; border-top: 4px solid transparent; border-bottom: 4px solid transparent; border-left: 8px solid #F5B800; position: absolute; right: -8px; top: 2px;"></div>
          </div>
          <div style="font-family: monospace; font-size: 8px; font-weight: bold; color: #08182B; background: #F5B800; padding: 1px 3px; border-radius: 2px; margin-top: 2px; text-align: center; white-space: nowrap;">
            MV NUSANTARA (${isOperating ? "BERTHED B-01" : "APPROACHING"})
          </div>
        </div>
      `,
      iconSize: [60, 30],
      iconAnchor: [30, 15],
    });
    vesselMarkerRef.current.setIcon(vesselIcon);

    // Update tugboats
    if (tugBimaMarkerRef.current && tugArjunaMarkerRef.current) {
      if (currentSimMinute <= 8) {
        tugBimaMarkerRef.current.setLatLng([pos.lat + 0.0015, pos.lng + 0.0015]);
        tugArjunaMarkerRef.current.setLatLng([pos.lat - 0.0015, pos.lng - 0.0015]);
      } else {
        // Staged back at tug base
        tugBimaMarkerRef.current.setLatLng([-6.0960, 106.8830]);
        tugArjunaMarkerRef.current.setLatLng([-6.0970, 106.8835]);
      }
    }
  }, [currentSimMinute, isOperating, inspectEquipment, containersHandled]);

  // Update Peta RBI Overlay Opacity/Visibility
  useEffect(() => {
    if (!rbiOverlayRef.current) return;
    if (showRbiOverlay) {
      rbiOverlayRef.current.setOpacity(overlayOpacity);
    } else {
      rbiOverlayRef.current.setOpacity(0);
    }
  }, [showRbiOverlay, overlayOpacity]);

  const handleCenterVessel = () => {
    if (!mapInstanceRef.current) return;
    const pos = interpolatePosition(currentSimMinute);
    mapInstanceRef.current.flyTo([pos.lat, pos.lng], 15, { duration: 1.2 });
  };

  const handleCenterBerth = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo(BERTH_B01_COORDS, 16, { duration: 1.2 });
  };

  return (
    <div className="w-full h-full min-h-[440px] lg:min-h-[520px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative isolate flex flex-col select-none">
      <div className="absolute top-3 left-3 z-30 flex flex-wrap items-center gap-2 bg-[#08182B]/90 backdrop-blur-md border border-slate-700/80 p-1.5 rounded-xl shadow-xl text-xs text-white">
        <div className="flex items-center gap-1.5 px-2 py-0.5 border-r border-slate-700 font-bold text-amber-400">
          <MapIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Peta RBI 1209-444 Tanjungpriok</span>
          <span className="sm:hidden">Peta RBI</span>
        </div>

        <button
          onClick={handleCenterVessel}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center gap-1 transition-colors"
          title="Center on MV Nusantara"
        >
          <Crosshair className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden md:inline">Track Ship</span>
        </button>

        <button
          onClick={handleCenterBerth}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center gap-1 transition-colors"
          title="Zoom to Berth B-01 Quayside"
        >
          <Anchor className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden md:inline">Berth B-01</span>
        </button>

        <div className="flex items-center gap-1.5 px-2 border-l border-slate-700">
          <span className="text-[10px] text-slate-400">RBI Sheet:</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={showRbiOverlay ? overlayOpacity : 0}
            onChange={(e) => {
              setShowRbiOverlay(true);
              setOverlayOpacity(parseFloat(e.target.value));
            }}
            className="w-16 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#F5B800]"
            title="Adjust Peta RBI Layer Opacity"
          />
        </div>
      </div>

      <div className="absolute top-3 right-3 z-30 flex flex-col gap-1 bg-[#08182B]/90 backdrop-blur-md border border-slate-700 p-1 rounded-xl shadow-xl">
        <button
          onClick={() => mapInstanceRef.current?.zoomIn()}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          title="Zoom In (+)"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => mapInstanceRef.current?.zoomOut()}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          title="Zoom Out (-)"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>

      <div ref={mapContainerRef} className="w-full h-full flex-1 z-0 bg-[#06101E]" />

      <div className="absolute bottom-2 left-3 right-3 z-30 flex items-center justify-between pointer-events-none text-[10px] text-slate-400 font-mono bg-[#08182B]/85 backdrop-blur-sm px-3 py-1 rounded-lg border border-slate-800">
        <span>TELUK JAKARTA · LAT: 06°05&apos;40&quot;S, LNG: 106°53&apos;15&quot;E</span>
        <span>DATUM: WGS 84 / UTM ZONE 48S · SKALA 1:25.000</span>
      </div>
    </div>
  );
}
