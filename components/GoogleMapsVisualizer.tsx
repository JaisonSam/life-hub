"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  MapPin,
  Navigation,
  Compass,
  Globe,
  Layers,
  Car,
  Plane,
  Train,
  Plus,
  Upload,
  Download,
  ExternalLink,
  RefreshCw,
  Check,
  AlertCircle,
  Trash2,
  Search,
  Filter,
  Building2,
  Sprout,
  Church,
  GraduationCap,
  Home,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  Clock,
  ChevronRight,
} from "lucide-react";

export interface MapLocation {
  id: string;
  title: string;
  query: string;
  lat: number;
  lng: number;
  category: "corporate" | "agri" | "spiritual" | "gmat" | "transit" | "personal";
  categoryLabel: string;
  address: string;
  notes: string;
  elevation?: string;
  microclimate?: string;
  transitFromBlr?: string;
  source?: "curated" | "imported" | "custom";
  visitedDate?: string;
}

export const DEFAULT_LOCATIONS: MapLocation[] = [
  {
    id: "loc-blr-corp",
    title: "Schneider Electric Global Hub",
    query: "Schneider Electric, Bagmane World Technology Center, Bengaluru, Karnataka",
    lat: 12.9866,
    lng: 77.6898,
    category: "corporate",
    categoryLabel: "Corporate & ERP",
    address: "Outer Ring Road, Mahadevapura, Bengaluru, Karnataka 560048",
    notes: "Senior ERP Business Analyst operational base • Global ERP governance, APAC milestone syncs, and financial ledger review.",
    elevation: "920m ASL",
    microclimate: "24°C • Urban Tech Corridor",
    transitFromBlr: "Base Station (0 km)",
    source: "curated",
  },
  {
    id: "loc-tenkasi-farm",
    title: "Veerakeralapudur Agribusiness Smart Farm",
    query: "Veerakeralapudur, Tenkasi District, Tamil Nadu",
    lat: 8.9564,
    lng: 77.4428,
    category: "agri",
    categoryLabel: "Agri-Tech & Farm",
    address: "Veerakeralapudur Taluk, Tenkasi District, Tamil Nadu 627861",
    notes: "5-Acre Precision Guava Orchard, Taiwan Pink rootstocks, IoT mesh sensor station, and solar-powered drip irrigation network.",
    elevation: "115m ASL",
    microclimate: "29°C • Western Ghats Rain Shadow",
    transitFromBlr: "562 km (NH 44 / Train / Flight via IXM)",
    source: "curated",
  },
  {
    id: "loc-st-marks",
    title: "St. Mark's Cathedral & Fellowship",
    query: "St. Mark's Cathedral, MG Road, Bengaluru, Karnataka",
    lat: 12.9738,
    lng: 77.6015,
    category: "spiritual",
    categoryLabel: "Spiritual Sanctuary",
    address: "1, Mahatma Gandhi Rd, Shanthala Nagar, Bengaluru, Karnataka 560001",
    notes: "Weekly Sunday morning Liturgical sanctuary, Holy Communion worship, choir hymnody, and community fellowship.",
    elevation: "916m ASL",
    microclimate: "Heritage Tree Canopy • 23°C",
    transitFromBlr: "12 km from Tech Park",
    source: "curated",
  },
  {
    id: "loc-gmat-test",
    title: "Pearson VUE Professional Testing Center",
    query: "Pearson Professional Centers, Bengaluru, Karnataka",
    lat: 12.9352,
    lng: 77.6245,
    category: "gmat",
    categoryLabel: "GMAT 705+ Milestone",
    address: "Koramangala 4th Block, Bengaluru, Karnataka 560034",
    notes: "Official GMAT Focus Edition appointment testing venue • Target score 705+ (Q85+ / V83+ / DI81+). High-focus test suite.",
    elevation: "910m ASL",
    microclimate: "Executive Testing Facility",
    transitFromBlr: "14 km from Hub",
    source: "curated",
  },
  {
    id: "loc-blr-airport",
    title: "Kempegowda International Airport (BLR)",
    query: "Kempegowda International Airport, Devanahalli, Bengaluru",
    lat: 13.1986,
    lng: 77.7066,
    category: "transit",
    categoryLabel: "Aviation Gateway",
    address: "KIAL Rd, Devanahalli, Bengaluru, Karnataka 560300",
    notes: "Aviation hub connecting weekly executive flight routes to Madurai (IXM) & Tuticorin (TCR) for agribusiness inspections.",
    elevation: "915m ASL",
    microclimate: "Airport North Sector",
    transitFromBlr: "42 km North via Airport Expressway",
    source: "curated",
  },
  {
    id: "loc-madurai-transit",
    title: "Madurai Airport Gateway (IXM)",
    query: "Madurai Airport, Madurai, Tamil Nadu",
    lat: 9.8345,
    lng: 78.0934,
    category: "transit",
    categoryLabel: "Transit Gateway",
    address: "Madurai Airport, Madurai, Tamil Nadu 625022",
    notes: "Key transfer hub connecting 1h 10m flight from Bengaluru with 2h taxi drive to the Veerakeralapudur farm.",
    elevation: "135m ASL",
    microclimate: "Southern Plains Transit Hub",
    transitFromBlr: "435 km South Flight Path",
    source: "curated",
  },
];

export default function GoogleMapsVisualizer() {
  const [locations, setLocations] = useState<MapLocation[]>(DEFAULT_LOCATIONS);
  const [activeLocation, setActiveLocation] = useState<MapLocation>(DEFAULT_LOCATIONS[0]);
  const [viewMode, setViewMode] = useState<"interactive-map" | "corridor-radar" | "analytics">("interactive-map");
  const [mapType, setMapType] = useState<"m" | "k" | "p">("m"); // m = roadmap, k = satellite, p = terrain
  const [zoomLevel, setZoomLevel] = useState<number>(14);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modals
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [importNotification, setImportNotification] = useState<string | null>(null);

  // New Place Form
  const [newTitle, setNewTitle] = useState("");
  const [newQuery, setNewQuery] = useState("");
  const [newCategory, setNewCategory] = useState<MapLocation["category"]>("corporate");
  const [newAddress, setNewAddress] = useState("");
  const [newNotes, setNewNotes] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved places from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("lifehub_google_map_places");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setLocations(parsed);
          setActiveLocation(parsed[0]);
        }
      }
    } catch (e) {
      console.warn("Could not load stored map places:", e);
    }
  }, []);

  // Filtered locations list
  const filteredLocations = useMemo(() => {
    return locations.filter((loc) => {
      const matchesCategory = categoryFilter === "all" || loc.category === categoryFilter;
      const matchesSearch =
        !searchQuery ||
        loc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.notes.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [locations, categoryFilter, searchQuery]);

  // Construct Google Maps Embed URL
  const embedUrl = useMemo(() => {
    const q = encodeURIComponent(activeLocation.query || `${activeLocation.lat},${activeLocation.lng}`);
    return `https://maps.google.com/maps?q=${q}&t=${mapType}&z=${zoomLevel}&ie=UTF8&iwloc=&output=embed`;
  }, [activeLocation, mapType, zoomLevel]);

  // Handle saving new custom place
  const handleAddPlace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const categoryLabels: Record<string, string> = {
      corporate: "Corporate & ERP",
      agri: "Agri-Tech & Farm",
      spiritual: "Spiritual Sanctuary",
      gmat: "GMAT & Education",
      transit: "Transit & Travel",
      personal: "Personal Haven",
    };

    const newLoc: MapLocation = {
      id: `loc-custom-${Date.now()}`,
      title: newTitle.trim(),
      query: newQuery.trim() || newTitle.trim(),
      lat: 12.9716, // Default fallback center
      lng: 77.5946,
      category: newCategory,
      categoryLabel: categoryLabels[newCategory] || "Custom Place",
      address: newAddress.trim() || newTitle.trim(),
      notes: newNotes.trim() || "Saved via Google Maps Hub",
      source: "custom",
    };

    const updated = [newLoc, ...locations];
    setLocations(updated);
    setActiveLocation(newLoc);
    try {
      localStorage.setItem("lifehub_google_map_places", JSON.stringify(updated));
    } catch {}

    setNewTitle("");
    setNewQuery("");
    setNewAddress("");
    setNewNotes("");
    setShowAddModal(false);
  };

  // Handle JSON / GeoJSON / Google Takeout upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        let importedPlaces: MapLocation[] = [];

        // 1. Try parsing JSON
        try {
          const json = JSON.parse(text);

          // Format A: Google Takeout Saved Places (GeoJSON)
          if (json.features && Array.isArray(json.features)) {
            importedPlaces = json.features.map((feat: any, idx: number) => {
              const coords = feat.geometry?.coordinates || [77.5946, 12.9716];
              const title = feat.properties?.Title || feat.properties?.name || `Imported Place ${idx + 1}`;
              const address = feat.properties?.address || feat.properties?.Location?.Address || title;
              return {
                id: `loc-imported-${idx}-${Date.now()}`,
                title,
                query: `${title}, ${address}`,
                lat: coords[1] || 12.9716,
                lng: coords[0] || 77.5946,
                category: "personal" as const,
                categoryLabel: "Google Takeout Saved",
                address,
                notes: feat.properties?.Comment || "Imported from Google Maps Takeout",
                source: "imported" as const,
              };
            });
          }
          // Format B: Google Location History / Records JSON
          else if (json.locations && Array.isArray(json.locations)) {
            importedPlaces = json.locations.slice(0, 50).map((item: any, idx: number) => {
              const lat = item.latitudeE7 ? item.latitudeE7 / 1e7 : 12.9716;
              const lng = item.longitudeE7 ? item.longitudeE7 / 1e7 : 77.5946;
              return {
                id: `loc-timeline-${idx}-${Date.now()}`,
                title: `Timeline Visit #${idx + 1}`,
                query: `${lat},${lng}`,
                lat,
                lng,
                category: "personal" as const,
                categoryLabel: "Timeline Stop",
                address: `GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
                notes: `Recorded on ${item.timestamp ? new Date(item.timestamp).toLocaleDateString() : "Timeline"}`,
                source: "imported" as const,
              };
            });
          }
          // Format C: Direct Array of Places
          else if (Array.isArray(json)) {
            importedPlaces = json.map((item: any, idx: number) => ({
              id: item.id || `loc-arr-${idx}-${Date.now()}`,
              title: item.title || item.name || `Imported #${idx + 1}`,
              query: item.query || item.title || item.name,
              lat: item.lat || 12.9716,
              lng: item.lng || 77.5946,
              category: item.category || "personal",
              categoryLabel: item.categoryLabel || "Imported Place",
              address: item.address || "",
              notes: item.notes || "Imported data",
              source: "imported" as const,
            }));
          }
        } catch {
          // 2. Try parsing simple CSV if JSON fails
          const lines = text.split("\n").filter((l) => l.trim().length > 0);
          if (lines.length > 1) {
            const parsed = lines.slice(1).map((line, idx) => {
              const cols = line.split(",").map((c) => c.replace(/["']/g, "").trim());
              return {
                id: `loc-csv-${idx}-${Date.now()}`,
                title: cols[0] || `CSV Place ${idx + 1}`,
                query: cols[0] || "Bengaluru",
                lat: parseFloat(cols[1]) || 12.9716,
                lng: parseFloat(cols[2]) || 77.5946,
                category: "personal" as const,
                categoryLabel: "CSV Imported",
                address: cols[3] || cols[0],
                notes: cols[4] || "Imported from CSV",
                source: "imported" as const,
              };
            });
            if (parsed.length > 0) importedPlaces = parsed;
          }
        }

        if (importedPlaces.length > 0) {
          const merged = [...importedPlaces, ...locations];
          setLocations(merged);
          setActiveLocation(importedPlaces[0]);
          try {
            localStorage.setItem("lifehub_google_map_places", JSON.stringify(merged));
          } catch {}
          setImportNotification(`Successfully imported ${importedPlaces.length} places from Google Maps file!`);
          setShowImportModal(false);
          setTimeout(() => setImportNotification(null), 4000);
        } else {
          setImportNotification("Could not recognize Google Maps data structure. Please ensure it is a valid JSON, GeoJSON, or CSV file.");
        }
      } catch (err) {
        console.error("Failed to parse map file:", err);
        setImportNotification("Failed to parse file. Please upload a valid Google Takeout JSON or CSV.");
      }
    };
    reader.readAsText(file);
  };

  // Reset to default locations
  const handleResetDefaults = () => {
    setLocations(DEFAULT_LOCATIONS);
    setActiveLocation(DEFAULT_LOCATIONS[0]);
    try {
      localStorage.removeItem("lifehub_google_map_places");
    } catch {}
    setImportNotification("Reset to calibrated executive coordinates.");
    setTimeout(() => setImportNotification(null), 3000);
  };

  return (
    <div className="w-full text-neutral-200 space-y-6 font-sans">
      {/* 1. TOP HEADER & TELEMETRY BAR */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#14151b] border border-[#232530] shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#232530]">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-[#181920] border border-[#262834] text-white shadow-md">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-lg sm:text-xl text-white tracking-tight">
                  Google Maps & Strategic Geography Deck
                </h2>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Geospatial Radar
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Satellite intelligence, transit corridors, and Google Takeout Timeline visualization
              </p>
            </div>
          </div>

          {/* Action Buttons: Add Place & Import Takeout */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Place</span>
            </button>

            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#181920] hover:bg-[#20222a] border border-[#262834] hover:border-neutral-500 text-neutral-200 transition-all cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-neutral-400" />
              <span>Import Takeout JSON</span>
            </button>

            <button
              onClick={handleResetDefaults}
              className="p-2 rounded-xl bg-[#181920] hover:bg-[#20222a] border border-[#262834] text-neutral-400 hover:text-white transition-all cursor-pointer"
              title="Reset to default locations"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* NOTIFICATION BANNER */}
        {importNotification && (
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{importNotification}</span>
          </div>
        )}

        {/* VIEW MODE TABS */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1 bg-[#101116] p-1 rounded-xl border border-[#232530] text-xs font-mono">
            <button
              onClick={() => setViewMode("interactive-map")}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                viewMode === "interactive-map"
                  ? "bg-white text-black shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Interactive Google Map</span>
            </button>

            <button
              onClick={() => setViewMode("corridor-radar")}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                viewMode === "corridor-radar"
                  ? "bg-white text-black shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Corridor Radar (562 km)</span>
            </button>

            <button
              onClick={() => setViewMode("analytics")}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                viewMode === "analytics"
                  ? "bg-white text-black shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Geography Telemetry</span>
            </button>
          </div>

          <div className="text-xs font-mono text-neutral-400">
            <span>{filteredLocations.length} locations plotted</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN VISUALIZATION AREA */}
      {viewMode === "interactive-map" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          {/* LEFT: LOCATIONS DIRECTORY & FILTER (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Search & Category Pills */}
            <div className="p-4 rounded-2xl bg-[#14151b] border border-[#232530] space-y-3 shadow-lg">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search mapped locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#101116] border border-[#262834] text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white font-sans"
                />
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-1 text-[11px] font-mono">
                {[
                  { id: "all", label: "All" },
                  { id: "corporate", label: "🏢 Corporate" },
                  { id: "agri", label: "🌾 Farm" },
                  { id: "spiritual", label: "⛪ Spiritual" },
                  { id: "gmat", label: "🎯 GMAT" },
                  { id: "transit", label: "✈️ Transit" },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCategoryFilter(c.id)}
                    className={`px-2 py-1 rounded-lg transition-all ${
                      categoryFilter === c.id
                        ? "bg-white text-black font-bold"
                        : "bg-[#181920] text-neutral-400 hover:text-white border border-[#262834]"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Location Cards Scroll List */}
            <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
              {filteredLocations.map((loc) => {
                const isSelected = activeLocation.id === loc.id;
                return (
                  <div
                    key={loc.id}
                    onClick={() => setActiveLocation(loc)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 group ${
                      isSelected
                        ? "bg-[#181920] border-white shadow-xl ring-1 ring-white/20"
                        : "bg-[#14151b] border-[#232530] hover:border-neutral-500 hover:bg-[#16171e]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isSelected ? "bg-white animate-pulse" : "bg-neutral-600 group-hover:bg-neutral-400"
                          }`}
                        />
                        <h4 className="font-bold text-sm text-white group-hover:text-white transition-colors">
                          {loc.title}
                        </h4>
                      </div>

                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-semibold border ${
                          loc.category === "corporate"
                            ? "bg-blue-500/10 text-blue-300 border-blue-500/30"
                            : loc.category === "agri"
                            ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                            : loc.category === "spiritual"
                            ? "bg-purple-500/10 text-purple-300 border-purple-500/30"
                            : loc.category === "gmat"
                            ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                            : "bg-sky-500/10 text-sky-300 border-sky-500/30"
                        }`}
                      >
                        {loc.categoryLabel}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                      {loc.notes}
                    </p>

                    <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-neutral-400 pt-2 border-t border-[#232530]">
                      <span className="truncate max-w-[210px]">{loc.address}</span>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.query)}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-neutral-300 hover:text-white flex items-center gap-0.5 transition-colors font-medium shrink-0"
                      >
                        <span>Open Maps</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: LIVE INTERACTIVE GOOGLE MAP EMBED (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-3xl bg-[#14151b] border border-[#232530] p-4 sm:p-5 shadow-2xl space-y-4">
              {/* Map Controls Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#232530]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{activeLocation.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#101116] border border-[#282a38] font-mono text-neutral-400">
                      {activeLocation.lat.toFixed(4)}°N, {activeLocation.lng.toFixed(4)}°E
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 font-mono mt-0.5">{activeLocation.address}</p>
                </div>

                {/* Map Type Controls (Roadmap / Satellite / Terrain) */}
                <div className="flex items-center gap-1.5 font-mono text-xs">
                  <div className="flex items-center p-0.5 rounded-lg bg-[#101116] border border-[#262834]">
                    <button
                      onClick={() => setMapType("m")}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                        mapType === "m" ? "bg-white text-black font-bold" : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      Roadmap
                    </button>
                    <button
                      onClick={() => setMapType("k")}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                        mapType === "k" ? "bg-white text-black font-bold" : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      Satellite
                    </button>
                    <button
                      onClick={() => setMapType("p")}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                        mapType === "p" ? "bg-white text-black font-bold" : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      Terrain
                    </button>
                  </div>

                  {/* Zoom controls */}
                  <div className="flex items-center p-0.5 rounded-lg bg-[#101116] border border-[#262834]">
                    <button
                      onClick={() => setZoomLevel((z) => Math.max(z - 1, 8))}
                      className="px-2 py-1 text-neutral-300 hover:text-white font-bold"
                      title="Zoom Out"
                    >
                      -
                    </button>
                    <span className="text-[10px] px-1 text-neutral-400">{zoomLevel}x</span>
                    <button
                      onClick={() => setZoomLevel((z) => Math.min(z + 1, 19))}
                      className="px-2 py-1 text-neutral-300 hover:text-white font-bold"
                      title="Zoom In"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Responsive Embedded Google Map Iframe */}
              <div className="relative w-full h-[460px] sm:h-[520px] rounded-2xl overflow-hidden border border-[#262834] bg-[#0c0d11]">
                <iframe
                  title={`Google Map - ${activeLocation.title}`}
                  src={embedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: mapType === "m" ? "invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)" : "none" }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full transition-opacity duration-300"
                />

                {/* Floating Map Legend Overlay */}
                <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-neutral-700 text-xs font-mono text-white shadow-xl flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold">{activeLocation.title}</span>
                  <span className="text-[10px] text-neutral-400">({activeLocation.categoryLabel})</span>
                </div>

                {/* Floating Directions Action */}
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(activeLocation.query)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs shadow-2xl flex items-center gap-1.5 font-mono transition-transform hover:scale-105"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Get Directions</span>
                  </a>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeLocation.query)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-black/80 hover:bg-black text-white border border-neutral-700 shadow-xl transition-all"
                    title="Open full Google Maps web"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Location Detail & Telemetry Footer */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 text-xs font-mono">
                <div className="p-3 rounded-xl bg-[#101116] border border-[#232530]">
                  <span className="text-[10px] text-neutral-500 block uppercase font-bold">Elevation</span>
                  <span className="font-bold text-white mt-0.5 block">{activeLocation.elevation || "915m ASL"}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#101116] border border-[#232530]">
                  <span className="text-[10px] text-neutral-500 block uppercase font-bold">Microclimate</span>
                  <span className="font-bold text-white mt-0.5 block truncate">{activeLocation.microclimate || "Subtropical"}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#101116] border border-[#232530]">
                  <span className="text-[10px] text-neutral-500 block uppercase font-bold">Transit Status</span>
                  <span className="font-bold text-white mt-0.5 block truncate">{activeLocation.transitFromBlr || "Connected"}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#101116] border border-[#232530]">
                  <span className="text-[10px] text-neutral-500 block uppercase font-bold">Data Source</span>
                  <span className="font-bold text-emerald-400 mt-0.5 block capitalize">{activeLocation.source || "Curated"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. TRANSIT CORRIDOR RADAR VIEW (South India Strategic Axis) */}
      {viewMode === "corridor-radar" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#14151b] border border-[#232530] shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#232530]">
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                South India Transit Corridor • Bengaluru ⇄ Veerakeralapudur
              </h3>
              <p className="text-xs text-neutral-400">
                562 km multimodal transit corridor connecting the executive command center with the agribusiness smart farm
              </p>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-semibold">
                NH 44 National Highway
              </span>
              <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/30 font-semibold">
                Air via Madurai (IXM)
              </span>
            </div>
          </div>

          {/* High-Tech Animated Radar Transit Track */}
          <div className="relative p-6 sm:p-8 rounded-2xl bg-[#0c0d11] border border-[#262834] overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#1e2230_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

            <div className="relative z-10 space-y-8">
              {/* Node 1: Bengaluru Executive Base */}
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border-2 border-blue-400 flex items-center justify-center text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                    <Building2 className="w-5 h-5 text-blue-300" />
                  </div>
                  <div className="w-0.5 h-16 bg-gradient-to-b from-blue-400 via-sky-400 to-amber-400" />
                </div>
                <div className="space-y-1 pt-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">KM 0</span>
                    <span className="text-neutral-400">12.9716° N, 77.5946° E • 920m ASL</span>
                  </div>
                  <h4 className="font-extrabold text-base text-white">Bengaluru Executive Command & Tech Park</h4>
                  <p className="text-xs text-neutral-400">
                    Corporate headquarters, Schneider Electric ERP operations, St. Mark's fellowship, and GMAT 705+ test suite.
                  </p>
                </div>
              </div>

              {/* Waypoint: Salem & Dindigul Central Junctions */}
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300">
                    <Car className="w-4 h-4 text-amber-300" />
                  </div>
                  <div className="w-0.5 h-16 bg-gradient-to-b from-amber-400 via-purple-400 to-emerald-400" />
                </div>
                <div className="space-y-1 pt-0.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">KM 202 - 370</span>
                    <span className="text-neutral-400">Salem ⇄ Namakkal ⇄ Dindigul Express Tollway</span>
                  </div>
                  <h5 className="font-bold text-sm text-neutral-200">Central Tamil Nadu Transit Highway</h5>
                  <p className="text-xs text-neutral-400">
                    Six-lane high-speed expressway transit with multiple fast-fuel EV charging and refreshment waypoints.
                  </p>
                </div>
              </div>

              {/* Waypoint: Madurai Aviation Gateway */}
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400 flex items-center justify-center text-sky-300">
                    <Plane className="w-4 h-4 text-sky-300" />
                  </div>
                  <div className="w-0.5 h-16 bg-gradient-to-b from-sky-400 to-emerald-400" />
                </div>
                <div className="space-y-1 pt-0.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold">KM 435</span>
                    <span className="text-neutral-400">Madurai Airport (IXM)</span>
                  </div>
                  <h5 className="font-bold text-sm text-neutral-200">Aviation Node & Western Ghats Foothills</h5>
                  <p className="text-xs text-neutral-400">
                    Flight landing from BLR in 70 mins; direct highway link to Tenkasi District via Rajapalayam / Srivilliputhur.
                  </p>
                </div>
              </div>

              {/* Node 2: Veerakeralapudur Agribusiness Smart Farm */}
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                    <Sprout className="w-5 h-5 text-emerald-300" />
                  </div>
                </div>
                <div className="space-y-1 pt-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">KM 562</span>
                    <span className="text-neutral-400">8.9564° N, 77.4428° E • 115m ASL</span>
                  </div>
                  <h4 className="font-extrabold text-base text-white">Veerakeralapudur Agribusiness Smart Farm</h4>
                  <p className="text-xs text-neutral-400">
                    5-Acre Precision Guava Orchard, Taiwan Pink graft rootstocks, solar-powered drip irrigation, and telemetry soil node.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Transit Modes Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-[#181920] border border-[#262834] space-y-1.5">
              <div className="flex items-center gap-2 text-white font-bold">
                <Car className="w-4 h-4 text-amber-400" />
                <span>Expressway Drive</span>
              </div>
              <p className="text-neutral-400 font-sans text-xs">
                NH 44 via Hosur, Krishnagiri, Salem, Madurai, Tenkasi. ~9 hours 15 mins driving time.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#181920] border border-[#262834] space-y-1.5">
              <div className="flex items-center gap-2 text-white font-bold">
                <Plane className="w-4 h-4 text-sky-400" />
                <span>Flight + Cab</span>
              </div>
              <p className="text-neutral-400 font-sans text-xs">
                BLR ✈️ IXM (Madurai) 1h 10m + 2h taxi to Veerakeralapudur farm. Peak efficiency travel.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#181920] border border-[#262834] space-y-1.5">
              <div className="flex items-center gap-2 text-white font-bold">
                <Train className="w-4 h-4 text-purple-400" />
                <span>Overnight Express</span>
              </div>
              <p className="text-neutral-400 font-sans text-xs">
                Bengaluru (SBC) to Tenkasi Junction (TSI) via Tuticorin / Tirunelveli sleeper train.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. GEOGRAPHY TELEMETRY & ANALYTICS VIEW */}
      {viewMode === "analytics" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#14151b] border border-[#232530] shadow-2xl space-y-6">
          <div className="border-b border-[#232530] pb-4">
            <h3 className="font-extrabold text-base sm:text-lg text-white">Geospatial Telemetry & Asset Matrix</h3>
            <p className="text-xs text-neutral-400">
              Microclimate conditions, altitude gradients, and strategic category allocation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {locations.map((loc) => (
              <div key={loc.id} className="p-4 rounded-2xl bg-[#181920] border border-[#262834] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white truncate">{loc.title}</span>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono">
                    {loc.categoryLabel}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-neutral-400">
                  <div className="p-2 rounded-lg bg-[#12131a] border border-[#232530]">
                    <span className="text-[9px] text-neutral-500 block">COORDINATES</span>
                    <span className="text-white font-bold">{loc.lat.toFixed(2)}°N, {loc.lng.toFixed(2)}°E</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#12131a] border border-[#232530]">
                    <span className="text-[9px] text-neutral-500 block">ELEVATION</span>
                    <span className="text-white font-bold">{loc.elevation || "N/A"}</span>
                  </div>
                </div>

                <p className="text-[11px] text-neutral-400 line-clamp-2">{loc.notes}</p>

                <div className="pt-2 border-t border-[#232530] flex items-center justify-between text-xs font-mono">
                  <span className="text-[10px] text-neutral-500">{loc.microclimate || "Active Zone"}</span>
                  <button
                    onClick={() => {
                      setActiveLocation(loc);
                      setViewMode("interactive-map");
                    }}
                    className="text-white hover:text-neutral-300 font-bold flex items-center gap-1"
                  >
                    <span>View on Map →</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: ADD NEW PLACE */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-[#14151b] border border-[#282a38] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#262834] pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-white" />
                <h3 className="font-extrabold text-base text-white">Add New Place to Google Maps Hub</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-xs text-neutral-400 hover:text-white px-2 py-1 rounded bg-neutral-900 border border-neutral-800"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleAddPlace} className="space-y-3.5 text-xs font-sans">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-mono font-semibold">
                  Place Name / Venue *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tenkasi High-Tech Polyhouse Nursery"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#101116] border border-[#282a38] text-white focus:outline-none focus:border-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-mono font-semibold">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#101116] border border-[#282a38] text-white focus:outline-none focus:border-white font-mono"
                  >
                    <option value="corporate">🏢 Corporate & ERP</option>
                    <option value="agri">🌾 Agri-Tech & Farm</option>
                    <option value="spiritual">⛪ Spiritual Sanctuary</option>
                    <option value="gmat">🎯 GMAT & Education</option>
                    <option value="transit">✈️ Transit & Travel</option>
                    <option value="personal">🏡 Personal Haven</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-mono font-semibold">
                    Google Maps Search Query
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Tenkasi, Tamil Nadu"
                    value={newQuery}
                    onChange={(e) => setNewQuery(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#101116] border border-[#282a38] text-white focus:outline-none focus:border-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-mono font-semibold">
                  Full Address / City
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tenkasi Main Road, Tamil Nadu 627811"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#101116] border border-[#282a38] text-white focus:outline-none focus:border-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-mono font-semibold">
                  Strategic Notes & Operating Details
                </label>
                <textarea
                  rows={2}
                  placeholder="Key milestones, operational equipment, or schedule notes..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#101116] border border-[#282a38] text-white focus:outline-none focus:border-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-mono text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold font-mono text-xs shadow-md"
                >
                  Save to Map
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: IMPORT GOOGLE TAKEOUT DATA */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-[#14151b] border border-[#282a38] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#262834] pb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-white" />
                <h3 className="font-extrabold text-base text-white">Import Google Maps & Takeout Data</h3>
              </div>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-xs text-neutral-400 hover:text-white px-2 py-1 rounded bg-neutral-900 border border-neutral-800"
              >
                Close
              </button>
            </div>

            <div className="space-y-4 text-xs leading-relaxed text-neutral-300">
              <div className="p-3.5 rounded-2xl bg-[#181920] border border-[#262834] space-y-2">
                <h4 className="font-bold text-white flex items-center gap-1.5 font-mono">
                  <span className="w-4 h-4 rounded-full bg-white text-black flex items-center justify-center text-[10px]">1</span>
                  How to export from Google Takeout:
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-neutral-400 pl-1 text-[11px]">
                  <li>Visit <strong>takeout.google.com</strong> signed in with your Google account.</li>
                  <li>Deselect all, then check <strong>Maps (your places)</strong> or <strong>Location History (Timeline)</strong>.</li>
                  <li>Click Export and download the ZIP file.</li>
                  <li>Drop the extracted <strong>Saved Places.json</strong> or <strong>Records.json</strong> below!</li>
                </ol>
              </div>

              {/* Upload Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-8 rounded-2xl border-2 border-dashed border-[#282a38] hover:border-white bg-[#101116] text-center cursor-pointer transition-all space-y-2 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-700 mx-auto flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="font-bold text-white">Drop your Google Maps file here, or click to browse</div>
                <p className="text-[11px] text-neutral-500 font-mono">
                  Supports .json, .geojson, .kml, and .csv files
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".json,.geojson,.kml,.csv"
                  className="hidden"
                />
              </div>

              <div className="text-[11px] text-neutral-500 font-mono text-center">
                All imported places are stored locally in your browser storage. Zero private location data leaves your device.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
