"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import {
  Compass,
  Crosshair,
  Anchor,
  ZoomIn,
  ZoomOut,
  MapPin,
  Layers,
  Map as MapIcon,
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

function interpolatePosition(minute: number): {
  lat: number;
  lng: number;
  heading: number;
} {
  if (minute <= 0) {
    return { lat: FAIRWAY_TRACK[0][0], lng: FAIRWAY_TRACK[0][1], heading: 180 };
  }
  if (minute >= 8) {
    return { lat: BERTH_B01_COORDS[0], lng: BERTH_B01_COORDS[1], heading: 110 };
  }

  if (minute < 3) {
    const factor = minute / 3;
    const lat =
      FAIRWAY_TRACK[0][0] +
      (FAIRWAY_TRACK[2][0] - FAIRWAY_TRACK[0][0]) * factor;
    const lng =
      FAIRWAY_TRACK[0][1] +
      (FAIRWAY_TRACK[2][1] - FAIRWAY_TRACK[0][1]) * factor;
    return { lat, lng, heading: 180 };
  } else if (minute < 5) {
    const factor = (minute - 3) / 2;
    const lat =
      FAIRWAY_TRACK[2][0] +
      (FAIRWAY_TRACK[3][0] - FAIRWAY_TRACK[2][0]) * factor;
    const lng =
      FAIRWAY_TRACK[2][1] +
      (FAIRWAY_TRACK[3][1] - FAIRWAY_TRACK[2][1]) * factor;
    return { lat, lng, heading: 180 - 35 * factor };
  } else {
    const factor = (minute - 5) / 3;
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
  const rbiLayerRef = useRef<L.TileLayer | null>(null);
  const osmLayerRef = useRef<L.TileLayer | null>(null);

  const [activeLayer, setActiveLayer] = useState<"RBI" | "OSM">("RBI");
  const isOperating = currentSimMinute >= 8;

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
      color: "#F5B800",
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

    const pos = interpolatePosition(0);
    const vesselIcon = L.divIcon({
      className: "vessel-div-icon",
      html: `
        <div style="transform: rotate(${pos.heading}deg); transform-origin: center; cursor: pointer;">
          <div style="width: 48px; height: 16px; background: #08182B; border: 2px solid #F5B800; border-radius: 6px; position: relative; box-shadow: 0 4px 12px rgba(0,0,0,0.7);">
            <div style="width: 6px; height: 8px; background: #EF4444; position: absolute; left: 4px; top: 2px; border-radius: 1px;"></div>
            <div style="width: 24px; height: 8px; background: #0284C7; position: absolute; left: 14px; top: 2px; border-radius: 1px;"></div>
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

    const tugIcon = L.divIcon({
      className: "tug-icon",
      html: `<div style="width: 14px; height: 14px; border-radius: 50%; background: #F5B800; border: 2px solid #08182B; box-shadow: 0 0 6px #F5B800;"></div>`,
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
        <div style="transform: rotate(${pos.heading}deg); transform-origin: center; cursor: pointer;">
          <div style="width: 48px; height: 16px; background: #08182B; border: 2px solid #F5B800; border-radius: 6px; position: relative; box-shadow: 0 4px 12px rgba(0,0,0,0.7);">
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

    if (tugBimaMarkerRef.current && tugArjunaMarkerRef.current) {
      if (currentSimMinute <= 8) {
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
    <div className="w-full h-full min-h-[440px] lg:min-h-[520px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative isolate flex flex-col select-none">
      <div className="absolute top-3 left-3 z-30 flex flex-wrap items-center gap-2 bg-[#08182B]/90 backdrop-blur-md border border-slate-700/80 p-1.5 rounded-xl shadow-xl text-xs text-white">
        <div className="flex items-center gap-1.5 px-2 py-0.5 border-r border-slate-700 font-bold text-amber-400">
          <MapPin className="w-4 h-4 text-emerald-400" />
          <span>Peta Alur Pelabuhan Tanjung Priok</span>
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveLayer("RBI")}
            className={`px-2 py-1 rounded text-[11px] font-bold transition-colors ${
              activeLayer === "RBI"
                ? "bg-[#F5B800] text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
            title="Muat Peta Rupabumi Indonesia (Resmi Badan Informasi Geospasial)"
          >
            Peta RBI (BIG)
          </button>
          <button
            onClick={() => setActiveLayer("OSM")}
            className={`px-2 py-1 rounded text-[11px] font-bold transition-colors ${
              activeLayer === "OSM"
                ? "bg-sky-500 text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
            title="Muat Peta Kartografi Standar OpenStreetMap"
          >
            OpenStreetMap
          </button>
        </div>

        <button
          onClick={handleCenterVessel}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center gap-1 transition-colors"
          title="Kunci Kamera ke Kapal MV Nusantara"
        >
          <Crosshair className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Track Ship</span>
        </button>

        <button
          onClick={handleCenterBerth}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center gap-1 transition-colors"
          title="Kamera ke Dermaga B-01"
        >
          <Anchor className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Berth B-01</span>
        </button>
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

      <div className="absolute bottom-2 left-3 right-3 z-30 flex items-center justify-between pointer-events-none text-[10px] text-slate-400 font-mono bg-[#08182B]/90 backdrop-blur-sm px-3 py-1 rounded-lg border border-slate-800">
        <span>
          {activeLayer === "RBI"
            ? "SUMBER: BADAN INFORMASI GEOSPASIAL (BIG) · PETA RUPABUMI INDONESIA (RBI)"
            : "SUMBER: OPENSTREETMAP CARTOGRAPHY"}
        </span>
        <span>TELUK JAKARTA · 06°05&apos;40&quot;S, 106°53&apos;15&quot;E</span>
      </div>
    </div>
  );
}
