"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import {
  Crosshair,
  Anchor,
  ZoomIn,
  ZoomOut,
  MapPin,
} from "lucide-react";
import { useSimulationStore } from "@/store/useSimulationStore";

// Calibrated Coordinates for Pelabuhan Tanjung Priok & Teluk Jakarta
const PORT_CENTER: [number, number] = [-6.0950, 106.8860];

// Quaysides of Tanjung Priok:
const BERTH_B01_COORDS: [number, number] = [-6.1015, 106.8935];
const BERTH_B02_COORDS: [number, number] = [-6.0980, 106.8815];

// Calibrated Breakwater Alignments
const WEST_BREAKWATER: [number, number][] = [
  [-6.0865, 106.8785],
  [-6.0900, 106.8760],
  [-6.0950, 106.8750],
];
const EAST_BREAKWATER: [number, number][] = [
  [-6.0852, 106.8913],
  [-6.0880, 106.8960],
  [-6.0920, 106.9010],
];

// Fairway Channel Waypoints (Approaching from Teluk Jakarta into Tanjung Priok Basin)
const FAIRWAY_TRACK: [number, number][] = [
  [-6.0650, 106.8850],
  [-6.0760, 106.8850],
  [-6.0860, 106.8850],
  [-6.0950, 106.8880],
  [-6.1015, 106.8935],
];

const BIG_RBI_TILE_URL =
  "https://geoservices.big.go.id/rbi/rest/services/BASEMAP/Rupabumi_Indonesia/MapServer/tile/{z}/{y}/{x}";
const OSM_TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

function getVesselSvg(isOperating: boolean) {
  return `
    <svg width="84" height="28" viewBox="0 0 84 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="hullGrad" x1="0" y1="0" x2="0" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#0E2239"/>
          <stop offset="50%" stop-color="#08182B"/>
          <stop offset="100%" stop-color="#040D18"/>
        </linearGradient>
      </defs>
      <!-- Hull -->
      <path d="M5 3 H64 C73 3, 81 8, 83 14 C81 20, 73 25, 64 25 H5 C2.5 25, 1 22, 1 14 C1 6, 2.5 3, 5 3 Z" fill="url(#hullGrad)" stroke="#F59E0B" stroke-width="1.8"/>
      <!-- Waterline / Fender Buffer -->
      <path d="M5 4.5 H62 C69 4.5, 76 8.5, 79 14 C76 19.5, 69 23.5, 62 23.5 H5" stroke="${isOperating ? '#10B981' : '#00E5FF'}" stroke-width="1" stroke-dasharray="3,2" opacity="0.85"/>
      <!-- Superstructure / Wheelhouse Bridge (Aft) -->
      <rect x="6" y="6" width="13" height="16" rx="2" fill="#1E293B" stroke="#475569" stroke-width="1"/>
      <rect x="15" y="8" width="3" height="12" rx="0.5" fill="#00E5FF" opacity="0.9"/>
      <!-- Radar Mast & Scanner -->
      <line x1="12" y1="14" x2="16" y2="14" stroke="#F59E0B" stroke-width="1.5"/>
      <circle cx="12" cy="14" r="2" fill="#EF4444"/>
      <!-- Bay 01 Container Stacks -->
      <rect x="22" y="5.5" width="9" height="7" rx="1" fill="#0284C7" stroke="#0369A1" stroke-width="0.6"/>
      <rect x="22" y="15.5" width="9" height="7" rx="1" fill="#0284C7" stroke="#0369A1" stroke-width="0.6"/>
      <!-- Bay 02 Container Stacks -->
      <rect x="33" y="5.5" width="9" height="7" rx="1" fill="#10B981" stroke="#047857" stroke-width="0.6"/>
      <rect x="33" y="15.5" width="9" height="7" rx="1" fill="#F59E0B" stroke="#B45309" stroke-width="0.6"/>
      <!-- Bay 03 Container Stacks -->
      <rect x="44" y="5.5" width="9" height="7" rx="1" fill="#0284C7" stroke="#0369A1" stroke-width="0.6"/>
      <rect x="44" y="15.5" width="9" height="7" rx="1" fill="#10B981" stroke="#047857" stroke-width="0.6"/>
      <!-- Bay 04 Container Stacks (Bow section) -->
      <rect x="55" y="6.5" width="9" height="6" rx="1" fill="#F59E0B" stroke="#B45309" stroke-width="0.6"/>
      <rect x="55" y="15.5" width="9" height="6" rx="1" fill="#0284C7" stroke="#0369A1" stroke-width="0.6"/>
      <!-- Heading Arrow Tip -->
      <polygon points="80,14 74,10 74,18" fill="#F59E0B"/>
    </svg>
  `;
}

function getCraneSvg(id: string, isOperating: boolean) {
  return `
    <div style="cursor: pointer; display: flex; flex-direction: column; align-items: center;">
      <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Crane Portal Base & Gantry Rail Bogies -->
        <rect x="9" y="25" width="20" height="10" rx="1" fill="#081325" stroke="#00E5FF" stroke-width="1.5"/>
        <circle cx="12" cy="33" r="1.8" fill="#00E5FF"/>
        <circle cx="26" cy="33" r="1.8" fill="#00E5FF"/>
        <!-- Main Gantry Portal Legs (A-frame) -->
        <line x1="13" y1="25" x2="17" y2="9" stroke="#F59E0B" stroke-width="2.2"/>
        <line x1="25" y1="25" x2="21" y2="9" stroke="#F59E0B" stroke-width="2.2"/>
        <line x1="14" y1="17" x2="24" y2="17" stroke="#F59E0B" stroke-width="1.2"/>
        <!-- Horizontal Gantry Boom (extending out over vessel) -->
        <rect x="2" y="6" width="34" height="4.5" rx="1" fill="#F59E0B" stroke="#78350F" stroke-width="0.8"/>
        <!-- Operator Cabin -->
        <rect x="18" y="11" width="5" height="4" rx="0.5" fill="#00E5FF" opacity="0.9"/>
        <!-- Spreader Trolley & Cable Suspension -->
        <line x1="11" y1="10" x2="11" y2="${isOperating ? '21' : '14'}" stroke="#EF4444" stroke-width="1.8" stroke-dasharray="${isOperating ? '2,1' : 'none'}"/>
        <!-- Spreader Frame / Twistlocks with Container Box -->
        <rect x="7" y="${isOperating ? '21' : '14'}" width="8" height="3.5" rx="0.5" fill="${isOperating ? '#10B981' : '#EF4444'}" stroke="#081325" stroke-width="0.8"/>
        <!-- Apex Pylon Tower & Stay Cables -->
        <polygon points="19,1 16,6 22,6" fill="#F59E0B"/>
        <line x1="19" y1="1" x2="3" y2="6" stroke="#F59E0B" stroke-width="0.9"/>
        <line x1="19" y1="1" x2="35" y2="6" stroke="#F59E0B" stroke-width="0.9"/>
      </svg>
      <div style="font-family: monospace; font-size: 8px; font-weight: 800; color: #030712; background: ${
        isOperating ? '#10B981' : '#F59E0B'
      }; padding: 1px 4px; border-radius: 3px; border: 1px solid #081325; white-space: nowrap; margin-top: -2px; box-shadow: 0 2px 5px rgba(0,0,0,0.6);">
        ${id} ${isOperating ? '●' : ''}
      </div>
    </div>
  `;
}

function getTruckSvg(id: string, isOperating: boolean, containerColor: string) {
  return `
    <div style="cursor: pointer; display: flex; flex-direction: column; align-items: center;">
      <svg width="32" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Chassis & Mudguards -->
        <rect x="2" y="11" width="28" height="4.5" rx="0.8" fill="#1E293B" stroke="#475569" stroke-width="0.8"/>
        <!-- Tractor Cab -->
        <path d="M23 5 H28 C29.5 5, 30.5 6.5, 30.5 8 V14.5 H22 V6 C22 5.4, 22.4 5, 23 5 Z" fill="#F59E0B" stroke="#78350F" stroke-width="0.9"/>
        <rect x="24.5" y="7" width="4" height="3.5" rx="0.5" fill="#081325"/>
        <!-- Exhaust Stack -->
        <line x1="22.5" y1="3" x2="22.5" y2="6" stroke="#94A3B8" stroke-width="1.2"/>
        <!-- Container Payload on Flatbed -->
        ${
          isOperating
            ? `<rect x="3" y="4.5" width="18" height="8" rx="1" fill="${containerColor}" stroke="#081325" stroke-width="0.9"/>
               <line x1="9" y1="4.5" x2="9" y2="12.5" stroke="#081325" stroke-width="0.6" opacity="0.6"/>
               <line x1="15" y1="4.5" x2="15" y2="12.5" stroke="#081325" stroke-width="0.6" opacity="0.6"/>`
            : `<rect x="3" y="10" width="18" height="2" fill="#334155" opacity="0.7"/>`
        }
        <!-- Heavy Rubber Wheels -->
        <circle cx="6" cy="16" r="2.4" fill="#081325" stroke="#64748B" stroke-width="1"/>
        <circle cx="16" cy="16" r="2.4" fill="#081325" stroke="#64748B" stroke-width="1"/>
        <circle cx="26.5" cy="16" r="2.4" fill="#081325" stroke="#64748B" stroke-width="1"/>
      </svg>
      <div style="font-family: monospace; font-size: 7.5px; font-weight: 800; color: #FFFFFF; background: #081325; padding: 1px 3px; border-radius: 3px; border: 1px solid #F59E0B; white-space: nowrap; margin-top: -2px; box-shadow: 0 2px 4px rgba(0,0,0,0.5);">
        ${id}
      </div>
    </div>
  `;
}

function interpolatePosition(minute: number): {
  lat: number;
  lng: number;
  heading: number;
} {
  if (minute <= 0) {
    return { lat: FAIRWAY_TRACK[0][0], lng: FAIRWAY_TRACK[0][1], heading: 180 };
  }
  if (minute >= 10) {
    return { lat: BERTH_B01_COORDS[0], lng: BERTH_B01_COORDS[1], heading: 110 };
  }

  if (minute < 5) {
    const factor = minute / 5;
    const lat =
      FAIRWAY_TRACK[0][0] +
      (FAIRWAY_TRACK[2][0] - FAIRWAY_TRACK[0][0]) * factor;
    const lng =
      FAIRWAY_TRACK[0][1] +
      (FAIRWAY_TRACK[2][1] - FAIRWAY_TRACK[0][1]) * factor;
    return { lat, lng, heading: 180 };
  } else if (minute < 8) {
    const factor = (minute - 5) / 3;
    const lat =
      FAIRWAY_TRACK[2][0] +
      (FAIRWAY_TRACK[3][0] - FAIRWAY_TRACK[2][0]) * factor;
    const lng =
      FAIRWAY_TRACK[2][1] +
      (FAIRWAY_TRACK[3][1] - FAIRWAY_TRACK[2][1]) * factor;
    return { lat, lng, heading: 180 - 35 * factor };
  } else {
    const factor = (minute - 8) / 2;
    const lat =
      FAIRWAY_TRACK[3][0] +
      (FAIRWAY_TRACK[4][0] - FAIRWAY_TRACK[3][0]) * factor;
    const lng =
      FAIRWAY_TRACK[3][1] +
      (FAIRWAY_TRACK[4][1] - FAIRWAY_TRACK[3][1]) * factor;
    return { lat, lng, heading: 145 - 35 * factor };
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
  const craneQc01MarkerRef = useRef<L.Marker | null>(null);
  const craneQc02MarkerRef = useRef<L.Marker | null>(null);
  const truckTt01MarkerRef = useRef<L.Marker | null>(null);
  const truckTt02MarkerRef = useRef<L.Marker | null>(null);
  const rbiLayerRef = useRef<L.TileLayer | null>(null);
  const osmLayerRef = useRef<L.TileLayer | null>(null);

  const [activeLayer, setActiveLayer] = useState<"RBI" | "OSM">("RBI");
  const isOperating = currentSimMinute >= 15;

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: PORT_CENTER,
      zoom: 14,
      minZoom: 12,
      maxZoom: 18,
      zoomControl: false,
    });

    const rbiLayer = L.tileLayer(BIG_RBI_TILE_URL, {
      attribution:
        '&copy; <a href="https://sinergik.big.go.id/" target="_blank">Badan Informasi Geospasial (BIG)</a> · Peta Rupabumi Indonesia',
      maxZoom: 18,
    });
    rbiLayerRef.current = rbiLayer;

    const osmLayer = L.tileLayer(OSM_TILE_URL, {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    });
    osmLayerRef.current = osmLayer;

    rbiLayer.addTo(map);

    L.polyline(WEST_BREAKWATER, {
      color: "#0F172A",
      weight: 6,
      opacity: 0.9,
    })
      .addTo(map)
      .bindTooltip("Breakwater Barat (Tanggul Pemecah Gelombang)", { permanent: false });

    L.polyline(EAST_BREAKWATER, {
      color: "#0F172A",
      weight: 6,
      opacity: 0.9,
    })
      .addTo(map)
      .bindTooltip("Breakwater Timur (Tanggul Pemecah Gelombang)", { permanent: false });

    L.polyline(FAIRWAY_TRACK, {
      color: "#F59E0B",
      weight: 2.5,
      dashArray: "6,6",
      opacity: 0.75,
    })
      .addTo(map)
      .bindTooltip("Alur Pelayaran Masuk Tanjung Priok (-14.0m LWS)");

    const greenBuoyIcon = L.divIcon({
      className: "custom-buoy",
      html: `<div style="width:14px;height:14px;border-radius:50%;background:#10B981;border:2px solid #064E3B;box-shadow:0 0 8px #10B981;"></div>`,
      iconSize: [14, 14],
    });
    L.marker([-6.0860, 106.8830], { icon: greenBuoyIcon })
      .addTo(map)
      .bindPopup("<strong>Starboard Fairway Buoy #1</strong><br>Karakteristik: Fl.G.4s (Hijau/Kanan)");

    const redBuoyIcon = L.divIcon({
      className: "custom-buoy",
      html: `<div style="width:14px;height:14px;border-radius:50%;background:#EF4444;border:2px solid #991B1B;box-shadow:0 0 8px #EF4444;"></div>`,
      iconSize: [14, 14],
    });
    L.marker([-6.0860, 106.8870], { icon: redBuoyIcon })
      .addTo(map)
      .bindPopup("<strong>Port Fairway Buoy #2</strong><br>Karakteristik: Fl.R.4s (Merah/Kiri)");

    L.circleMarker(BERTH_B01_COORDS, {
      radius: 11,
      fillColor: "#10B981",
      color: "#064E3B",
      weight: 2,
      fillOpacity: 0.9,
    })
      .addTo(map)
      .bindPopup(
        "<strong>BERTH B-01 (DEEPWATER CONTAINER TERMINAL)</strong><br>Panjang LOA: 300.0m<br>Kedalaman: -12.0m LWS<br>Alat: 4x Super Post-Panamax Cranes<br>Status: <strong>LOLOS & DISETUJUI</strong>"
      );

    L.circleMarker(BERTH_B02_COORDS, {
      radius: 9,
      fillColor: "#EF4444",
      color: "#991B1B",
      weight: 2,
      fillOpacity: 0.8,
    })
      .addTo(map)
      .bindPopup(
        "<strong>BERTH B-02 (PELINDO DERMAGA NUSANTARA II)</strong><br>Panjang LOA: 250.0m<br>Kedalaman: -9.0m LWS (RESTRICTED)<br>Bahaya: Grounding Hazard (Defisit kedalaman 2.5m)"
      );

    L.polygon(
      [
        [-6.1023, 106.8936],
        [-6.1023, 106.8952],
        [-6.1035, 106.8952],
        [-6.1035, 106.8936],
      ],
      {
        color: "#F59E0B",
        weight: 1.5,
        dashArray: "4,4",
        fillColor: "#08182B",
        fillOpacity: 0.6,
      }
    )
      .addTo(map)
      .bindTooltip("Lapangan Penumpukan Petikemas (Terminal Yard Stacks A, B, C)");

    const pos = interpolatePosition(0);
    const vesselIcon = L.divIcon({
      className: "vessel-div-icon",
      html: `
        <div style="transform: rotate(${pos.heading}deg); transform-origin: center; cursor: pointer; display: flex; flex-direction: column; align-items: center;">
          ${getVesselSvg(false)}
          <div style="font-family: monospace; font-size: 8px; font-weight: 800; color: #030712; background: #F59E0B; padding: 1px 4px; border-radius: 3px; margin-top: 2px; text-align: center; white-space: nowrap; box-shadow: 0 2px 4px rgba(0,0,0,0.6); border: 1px solid #081325;">
            MV NUSANTARA
          </div>
        </div>
      `,
      iconSize: [84, 36],
      iconAnchor: [42, 18],
    });

    const vesselMarker = L.marker([pos.lat, pos.lng], { icon: vesselIcon })
      .addTo(map)
      .on("click", () => {
        inspectEquipment({
          type: "VESSEL",
          id: "MV-NUSANTARA",
          name: "MV Nusantara",
          status: "Navigasi Alur Pelabuhan Tanjung Priok",
          metrics: [
            { label: "Posisi GPS", value: `${pos.lat.toFixed(4)}°S, ${pos.lng.toFixed(4)}°E` },
            { label: "Panjang LOA", value: "280.00 Meters" },
            { label: "Draft Kedatangan", value: "10.20 Meters" },
            { label: "Kedalaman Wajib", value: "11.50 Meters (UKC Safe)" },
            { label: "Muatan Ditangani", value: `${containersHandled} / 50 Units` },
          ],
          operationalNotes:
            "Kapal berlayar melintasi alur masuk Pelabuhan Tanjung Priok menuju Berth B-01. Alokasi kedalaman -12.0m LWS aman dari bahaya kandas.",
        });
      });
    vesselMarkerRef.current = vesselMarker;

    const crane01Icon = L.divIcon({
      className: "crane-div-icon",
      html: getCraneSvg("QC-01", false),
      iconSize: [38, 44],
      iconAnchor: [19, 22],
    });
    const craneQc01Marker = L.marker([-6.1011, 106.8929], { icon: crane01Icon })
      .addTo(map)
      .on("click", () => {
        inspectEquipment({
          type: "CRANE",
          id: "QC-01",
          name: "Quay Crane QC-01 (Super Post-Panamax)",
          status: "Standby Positioning di Berth B-01",
          metrics: [
            { label: "Outreach Capacity", value: "52 Meters (18 Rows)" },
            { label: "Safe Working Load (SWL)", value: "65 Metric Tons" },
            { label: "Current Hoist Pace", value: "36.2 Moves / Hour" },
            { label: "Spreader Status", value: "Twin-Lift Ready" },
            { label: "Assigned Target", value: "Bay 02 - 40ft Import Boxes" },
          ],
          operationalNotes:
            "Sistem interlocking hoist dan sensor anti-sway beroperasi normal. Pendaratan spreader di atas sasis truk aman.",
        });
      });
    craneQc01MarkerRef.current = craneQc01Marker;

    const crane02Icon = L.divIcon({
      className: "crane-div-icon",
      html: getCraneSvg("QC-02", false),
      iconSize: [38, 44],
      iconAnchor: [19, 22],
    });
    const craneQc02Marker = L.marker([-6.1018, 106.8941], { icon: crane02Icon })
      .addTo(map)
      .on("click", () => {
        inspectEquipment({
          type: "CRANE",
          id: "QC-02",
          name: "Quay Crane QC-02 (Super Post-Panamax)",
          status: "Standby Positioning di Berth B-01",
          metrics: [
            { label: "Outreach Capacity", value: "52 Meters (18 Rows)" },
            { label: "Safe Working Load (SWL)", value: "65 Metric Tons" },
            { label: "Current Hoist Pace", value: "35.2 Moves / Hour" },
            { label: "Spreader Status", value: "Twin-Lift Ready" },
            { label: "Assigned Target", value: "Bay 06 - Reefer & Export Boxes" },
          ],
          operationalNotes:
            "Siklus pemindahan twin-lift beroperasi sinkron. Komunikasi radio dengan tim tali darat berjalan di Channel 14.",
        });
      });
    craneQc02MarkerRef.current = craneQc02Marker;

    const truck01Icon = L.divIcon({
      className: "truck-div-icon",
      html: getTruckSvg("TT-01", false, "#0284C7"),
      iconSize: [32, 24],
      iconAnchor: [16, 12],
    });
    const truckTt01Marker = L.marker([-6.1026, 106.8942], { icon: truck01Icon })
      .addTo(map)
      .on("click", () => {
        inspectEquipment({
          type: "TRUCK",
          id: "TT-01",
          name: "Internal Transfer Vehicle TT-01",
          status: "Standby di Yard Block A",
          metrics: [
            { label: "Vehicle Type", value: "Terminal Tractor 4x2 Heavy" },
            { label: "Payload Capacity", value: "45 Metric Tons (1x40ft or 2x20ft)" },
            { label: "Current Payload", value: "Standby" },
            { label: "Cycle Speed", value: "18 km/h Apron Lane" },
            { label: "Destination", value: "Yard Stacks Block A (Import)" },
          ],
          operationalNotes:
            "Penerimaan kontainer dari spreader QC-01 tercatat pada sistem TOS. Waktu tunggu transfer di bawah 90 detik.",
        });
      });
    truckTt01MarkerRef.current = truckTt01Marker;

    const truck02Icon = L.divIcon({
      className: "truck-div-icon",
      html: getTruckSvg("TT-02", false, "#F59E0B"),
      iconSize: [32, 24],
      iconAnchor: [16, 12],
    });
    const truckTt02Marker = L.marker([-6.1028, 106.8946], { icon: truck02Icon })
      .addTo(map)
      .on("click", () => {
        inspectEquipment({
          type: "TRUCK",
          id: "TT-02",
          name: "Internal Transfer Vehicle TT-02",
          status: "Standby di Yard Block C",
          metrics: [
            { label: "Vehicle Type", value: "Terminal Tractor 4x2 Heavy" },
            { label: "Payload Capacity", value: "45 Metric Tons" },
            { label: "Current Payload", value: "Standby" },
            { label: "Cycle Speed", value: "16 km/h Apron Lane" },
            { label: "Destination", value: "Yard Block C (Reefer Stacking Tower)" },
          ],
          operationalNotes:
            "Membawa kontainer reefer dengan instruksi prioritas colok daya listrik < 45 menit pasca pembongkaran.",
        });
      });
    truckTt02MarkerRef.current = truckTt02Marker;

    const tugIcon = L.divIcon({
      className: "tug-icon",
      html: `<div style="width: 14px; height: 14px; border-radius: 50%; background: #F59E0B; border: 2px solid #08182B; box-shadow: 0 0 6px #F59E0B;"></div>`,
      iconSize: [14, 14],
    });
    const tugBimaMarker = L.marker([pos.lat + 0.0015, pos.lng + 0.0015], {
      icon: tugIcon,
    })
      .addTo(map)
      .bindTooltip("Tug Bima (Pandu Haluan)");
    tugBimaMarkerRef.current = tugBimaMarker;

    const tugArjunaMarker = L.marker([pos.lat - 0.0015, pos.lng - 0.0015], {
      icon: tugIcon,
    })
      .addTo(map)
      .bindTooltip("Tug Arjuna (Pandu Buritan)");
    tugArjunaMarkerRef.current = tugArjunaMarker;

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !rbiLayerRef.current || !osmLayerRef.current)
      return;

    const map = mapInstanceRef.current;
    if (activeLayer === "RBI") {
      map.removeLayer(osmLayerRef.current);
      if (!map.hasLayer(rbiLayerRef.current)) {
        rbiLayerRef.current.addTo(map);
      }
    } else {
      map.removeLayer(rbiLayerRef.current);
      if (!map.hasLayer(osmLayerRef.current)) {
        osmLayerRef.current.addTo(map);
      }
    }
  }, [activeLayer]);

  useEffect(() => {
    if (!vesselMarkerRef.current || !mapInstanceRef.current) return;

    const pos = interpolatePosition(currentSimMinute);
    vesselMarkerRef.current.setLatLng([pos.lat, pos.lng]);

    const vesselIcon = L.divIcon({
      className: "vessel-div-icon",
      html: `
        <div style="transform: rotate(${pos.heading}deg); transform-origin: center; cursor: pointer; display: flex; flex-direction: column; align-items: center;">
          ${getVesselSvg(isOperating)}
          <div style="font-family: monospace; font-size: 8px; font-weight: 800; color: #030712; background: #F59E0B; padding: 1px 4px; border-radius: 3px; margin-top: 2px; text-align: center; white-space: nowrap; box-shadow: 0 2px 4px rgba(0,0,0,0.6); border: 1px solid #081325;">
            MV NUSANTARA (${isOperating ? "BERTHED B-01" : currentSimMinute >= 10 ? "DOCKING B-01" : "APPROACHING"})
          </div>
        </div>
      `,
      iconSize: [84, 36],
      iconAnchor: [42, 18],
    });
    vesselMarkerRef.current.setIcon(vesselIcon);

    if (craneQc01MarkerRef.current) {
      craneQc01MarkerRef.current.setIcon(
        L.divIcon({
          className: "crane-div-icon",
          html: getCraneSvg("QC-01", isOperating),
          iconSize: [38, 44],
          iconAnchor: [19, 22],
        })
      );
    }

    if (craneQc02MarkerRef.current) {
      craneQc02MarkerRef.current.setIcon(
        L.divIcon({
          className: "crane-div-icon",
          html: getCraneSvg("QC-02", isOperating),
          iconSize: [38, 44],
          iconAnchor: [19, 22],
        })
      );
    }

    if (truckTt01MarkerRef.current && truckTt02MarkerRef.current) {
      if (currentSimMinute >= 10) {
        const cycle1 = (currentSimMinute % 4) / 4;
        const prog1 = cycle1 < 0.5 ? cycle1 * 2 : (1 - cycle1) * 2;
        const tt01Lat = -6.1013 + (-6.1026 - -6.1013) * prog1;
        const tt01Lng = 106.8933 + (106.8942 - 106.8933) * prog1;
        truckTt01MarkerRef.current.setLatLng([tt01Lat, tt01Lng]);

        const cycle2 = ((currentSimMinute + 2) % 4) / 4;
        const prog2 = cycle2 < 0.5 ? cycle2 * 2 : (1 - cycle2) * 2;
        const tt02Lat = -6.1017 + (-6.1028 - -6.1017) * prog2;
        const tt02Lng = 106.8938 + (106.8946 - 106.8938) * prog2;
        truckTt02MarkerRef.current.setLatLng([tt02Lat, tt02Lng]);
      } else {
        truckTt01MarkerRef.current.setLatLng([-6.1026, 106.8942]);
        truckTt02MarkerRef.current.setLatLng([-6.1028, 106.8946]);
      }

      truckTt01MarkerRef.current.setIcon(
        L.divIcon({
          className: "truck-div-icon",
          html: getTruckSvg("TT-01", isOperating, "#0284C7"),
          iconSize: [32, 24],
          iconAnchor: [16, 12],
        })
      );

      truckTt02MarkerRef.current.setIcon(
        L.divIcon({
          className: "truck-div-icon",
          html: getTruckSvg("TT-02", isOperating, "#F59E0B"),
          iconSize: [32, 24],
          iconAnchor: [16, 12],
        })
      );
    }

    if (tugBimaMarkerRef.current && tugArjunaMarkerRef.current) {
      if (currentSimMinute <= 10) {
        tugBimaMarkerRef.current.setLatLng([pos.lat + 0.0012, pos.lng + 0.0012]);
        tugArjunaMarkerRef.current.setLatLng([pos.lat - 0.0012, pos.lng - 0.0012]);
      } else {
        tugBimaMarkerRef.current.setLatLng([-6.0980, 106.8870]);
        tugArjunaMarkerRef.current.setLatLng([-6.0990, 106.8875]);
      }
    }
  }, [currentSimMinute, isOperating, inspectEquipment, containersHandled]);

  const handleCenterVessel = () => {
    if (!mapInstanceRef.current) return;
    const pos = interpolatePosition(currentSimMinute);
    mapInstanceRef.current.flyTo([pos.lat, pos.lng], 16, { duration: 1.2 });
  };

  const handleCenterBerth = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo(BERTH_B01_COORDS, 16, { duration: 1.2 });
  };

  return (
    <div className="w-full h-full min-h-[440px] lg:min-h-[520px] rounded-2xl overflow-hidden border border-glass-border shadow-glass relative isolate flex flex-col select-none">
      {/* Top Left Floating Tactical Controls */}
      <div className="absolute top-3 left-3 z-30 flex flex-wrap items-center gap-2 glass-panel p-1.5 rounded-xl shadow-xl text-xs text-white">
        <div className="flex items-center gap-1.5 px-2 py-0.5 border-r border-slate-700/80 font-bold text-electric-amber font-mono">
          <MapPin className="w-4 h-4 text-safety-emerald" />
          <span>Peta Alur Pelabuhan Tanjung Priok</span>
        </div>

        <div className="flex items-center gap-1 bg-abyssal p-0.5 rounded-lg border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveLayer("RBI")}
            className={`px-2 py-1 rounded-md text-[11px] font-bold font-mono transition-all ${
              activeLayer === "RBI"
                ? "bg-electric-amber text-abyssal shadow-sm font-black"
                : "text-slate-400 hover:text-white"
            }`}
            title="Muat Peta Rupabumi Indonesia (Resmi Badan Informasi Geospasial)"
          >
            Peta RBI (BIG)
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer("OSM")}
            className={`px-2 py-1 rounded-md text-[11px] font-bold font-mono transition-all ${
              activeLayer === "OSM"
                ? "bg-tactical-cyan text-abyssal shadow-sm font-black"
                : "text-slate-400 hover:text-white"
            }`}
            title="Muat Peta Kartografi Standar OpenStreetMap"
          >
            OpenStreetMap
          </button>
        </div>

        <button
          type="button"
          onClick={handleCenterVessel}
          className="p-1.5 rounded-lg bg-abyssal-surface hover:bg-slate-800 text-slate-200 font-semibold font-mono flex items-center gap-1 transition-colors border border-slate-800"
          title="Kunci Kamera ke Kapal MV Nusantara"
        >
          <Crosshair className="w-3.5 h-3.5 text-electric-amber" />
          <span className="hidden sm:inline">Track Ship</span>
        </button>

        <button
          type="button"
          onClick={handleCenterBerth}
          className="p-1.5 rounded-lg bg-abyssal-surface hover:bg-slate-800 text-slate-200 font-semibold font-mono flex items-center gap-1 transition-colors border border-slate-800"
          title="Kamera ke Dermaga B-01, Crane QC, dan Area Operasi"
        >
          <Anchor className="w-3.5 h-3.5 text-safety-emerald" />
          <span className="hidden sm:inline">Berth B-01 & Cranes</span>
        </button>
      </div>

      {/* Top Right Zoom Controls */}
      <div className="absolute top-3 right-3 z-30 flex flex-col gap-1 glass-panel p-1 rounded-xl shadow-xl">
        <button
          type="button"
          onClick={() => mapInstanceRef.current?.zoomIn()}
          className="p-2 rounded-lg bg-abyssal-surface hover:bg-slate-800 text-white transition-colors border border-slate-800"
          title="Zoom In (+)"
        >
          <ZoomIn className="w-4 h-4 text-slate-200 hover:text-tactical-cyan" />
        </button>
        <button
          type="button"
          onClick={() => mapInstanceRef.current?.zoomOut()}
          className="p-2 rounded-lg bg-abyssal-surface hover:bg-slate-800 text-white transition-colors border border-slate-800"
          title="Zoom Out (-)"
        >
          <ZoomOut className="w-4 h-4 text-slate-200 hover:text-tactical-cyan" />
        </button>
      </div>

      {/* GIS Leaflet Map Container */}
      <div ref={mapContainerRef} className="w-full h-full flex-1 z-0 bg-[#06101E]" />

      {/* Bottom Coordinates & Source Banner */}
      <div className="absolute bottom-2 left-3 right-3 z-30 flex items-center justify-between pointer-events-none text-[10px] text-slate-400 font-mono glass-panel px-3 py-1 rounded-lg border border-slate-800/80">
        <span>
          {activeLayer === "RBI"
            ? "SUMBER: BADAN INFORMASI GEOSPASIAL (BIG) · PETA RUPABUMI INDONESIA (RBI)"
            : "SUMBER: OPENSTREETMAP CARTOGRAPHY"}
        </span>
        <span className="text-tactical-cyan font-semibold">TELUK JAKARTA · 06°05&apos;40&quot;S, 106°53&apos;15&quot;E</span>
      </div>
    </div>
  );
}
