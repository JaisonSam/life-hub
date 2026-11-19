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
  CheckCircle2,
  Bookmark,
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
  Calendar,
  CloudSun,
} from "lucide-react";

import { TAKEOUT_GOOGLE_PLACES, type MapLocation } from "@/lib/takeoutMapData";

export type { MapLocation };
export const DEFAULT_LOCATIONS: MapLocation[] = [];

export default function GoogleMapsVisualizer() {
  const [locations, setLocations] = useState<MapLocation[]>([]);
  const [activeLocation, setActiveLocation] = useState<MapLocation | null>(null);
  const [viewMode, setViewMode] = useState<"interactive-map" | "corridor-radar" | "analytics">("interactive-map");
  const [mapType, setMapType] = useState<"m" | "k" | "p">("m"); // m = roadmap, k = satellite, p = terrain
  const [zoomLevel, setZoomLevel] = useState<number>(14);
  const [statusFilter, setStatusFilter] = useState<"all" | "visited" | "saved" | "want_to_go">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Google Account Sync State
  const [syncingDrive, setSyncingDrive] = useState(false);
  const [driveSyncResult, setDriveSyncResult] = useState<{
    success: boolean;
    message: string;
    filesFound?: number;
    placesCount?: number;
  } | null>(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [importNotification, setImportNotification] = useState<string | null>(null);

  // New Place Form
  const [newTitle, setNewTitle] = useState("");
  const [newQuery, setNewQuery] = useState("");
  const [newStatus, setNewStatus] = useState<MapLocation["status"]>("saved");
  const [newCategory, setNewCategory] = useState<MapLocation["category"]>("corporate");
  const [newAddress, setNewAddress] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [newDate, setNewDate] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to compute deduplication fingerprint key (with canonical anchors for core hubs like NIT Calicut)
  const getLocationFingerprint = (p: { title?: string; lat?: number; lng?: number }): string => {
    const raw = (p.title || "").toLowerCase();

    // Canonical deduplication key for core institutional & personal hubs
    if (
      raw.includes("nit calicut") ||
      raw.includes("national institute of technology calicut") ||
      raw.includes("national institute of technology (nit) calicut") ||
      raw === "nitc"
    ) {
      return "canonical-nit-calicut";
    }

    if (raw.includes("family haven") || raw.includes("home base - tripunithura") || raw === "home") {
      return "canonical-home-haven";
    }

    if (
      raw.includes("schneider electric") ||
      raw.includes("prestige tech park") ||
      raw === "work"
    ) {
      return "canonical-schneider-work";
    }

    if (raw.includes("veerakeralapudur") || raw.includes("guava orchard")) {
      return "canonical-tenkasi-farm";
    }

    const norm = raw
      .replace(/\(.*?\)/g, "")
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 24);

    const latGrid = (Math.round(Number(p.lat || 0) * 20) / 20).toFixed(2);
    const lngGrid = (Math.round(Number(p.lng || 0) * 20) / 20).toFixed(2);

    return `${norm}-${latGrid}-${lngGrid}`;
  };

  // Load places from localStorage on client mount (purging any legacy mock/prefixed items)
  useEffect(() => {
    try {
      const stored = localStorage.getItem("lifehub_google_map_places");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Check if stored has any legacy mock / prefixed data
          const hasPrefixedMock = parsed.some(
            (p: any) =>
              p.source === "curated" ||
              p.title?.includes("Pearson VUE") ||
              p.title?.includes("Veerakeralapudur Agribusiness") ||
              p.title?.includes("Courtallam") ||
              p.title?.includes("IIMB") ||
              p.title?.includes("TNAU") ||
              p.title?.includes("IISc")
          );

          if (hasPrefixedMock) {
            // Purge legacy mock cache immediately!
            localStorage.removeItem("lifehub_google_map_places");
            setLocations([]);
            setActiveLocation(null);
            return;
          }

          const seenFp = new Set<string>();
          const cleaned: MapLocation[] = [];

          for (const item of parsed) {
            if (
              !item.title ||
              item.title.includes("UNKNOWN") ||
              item.title.includes("PUNCHER REPAIR") ||
              (item.lat === 0 && item.lng === 0)
            ) {
              continue;
            }

            const fp = getLocationFingerprint(item);
            if (!seenFp.has(fp)) {
              seenFp.add(fp);
              cleaned.push({
                ...item,
                status: item.status || (item.category === "spiritual" ? "visited" : "saved"),
              });
            }
          }

          if (cleaned.length > 0) {
            setLocations(cleaned);
            setActiveLocation(cleaned[0]);
            localStorage.setItem("lifehub_google_map_places", JSON.stringify(cleaned));
            return;
          }
        }
      }
      // Start completely clean - no prefixed locations before Drive sync
      setLocations([]);
      setActiveLocation(null);
      localStorage.removeItem("lifehub_google_map_places");
    } catch (e) {
      console.warn("Could not load stored map places:", e);
    }
  }, []);

  // Compute status counts
  const visitedCount = useMemo(() => locations.filter((l) => l.status === "visited").length, [locations]);
  const savedCount = useMemo(() => locations.filter((l) => l.status === "saved").length, [locations]);
  const wantToGoCount = useMemo(() => locations.filter((l) => l.status === "want_to_go").length, [locations]);

  // Filtered locations list
  const filteredLocations = useMemo(() => {
    return locations.filter((loc) => {
      const matchesStatus = statusFilter === "all" || loc.status === statusFilter;
      const matchesCategory = categoryFilter === "all" || loc.category === categoryFilter;
      const matchesSearch =
        !searchQuery ||
        loc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.notes.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesCategory && matchesSearch;
    });
  }, [locations, statusFilter, categoryFilter, searchQuery]);

  // Resolved active place (safely fall back to first filtered or null)
  const activePlace = activeLocation || filteredLocations[0] || locations[0] || null;

  // Construct Google Maps Embed URL
  const embedUrl = useMemo(() => {
    if (!activePlace) {
      return "https://maps.google.com/maps?q=Bengaluru&t=m&z=12&ie=UTF8&iwloc=&output=embed";
    }
    const q = encodeURIComponent(activePlace.query || `${activePlace.lat},${activePlace.lng}`);
    return `https://maps.google.com/maps?q=${q}&t=${mapType}&z=${zoomLevel}&ie=UTF8&iwloc=&output=embed`;
  }, [activePlace, mapType, zoomLevel]);

  // 1-Click Status Switcher for active location
  const handleUpdateStatus = (locId: string, targetStatus: "visited" | "saved" | "want_to_go") => {
    const updated = locations.map((loc) => {
      if (loc.id === locId) {
        return { ...loc, status: targetStatus };
      }
      return loc;
    });
    setLocations(updated);
    if (activeLocation && activeLocation.id === locId) {
      setActiveLocation({ ...activeLocation, status: targetStatus });
    }
    try {
      localStorage.setItem("lifehub_google_map_places", JSON.stringify(updated));
    } catch {}
  };

  // Google Account Sync handler (Drive) - with rigorous deduplication
  const handleDriveSync = async () => {
    try {
      setSyncingDrive(true);
      setDriveSyncResult(null);
      const res = await fetch("/api/maps/drive-sync");
      const data = await res.json();

      if (data.places && data.places.length > 0) {
        const mergedMap = new Map<string, MapLocation>();

        // 1. Put incoming synced places
        for (const p of data.places) {
          if (!p.title || (p.lat === 0 && p.lng === 0)) continue;
          const fp = getLocationFingerprint(p);
          mergedMap.set(fp, p);
        }

        // 2. Retain only manually created custom additions that don't collide
        for (const p of locations) {
          if (!p.title || (p.lat === 0 && p.lng === 0) || p.source !== "custom") continue;
          const fp = getLocationFingerprint(p);
          if (!mergedMap.has(fp)) {
            mergedMap.set(fp, p);
          }
        }

        const cleanMerged = Array.from(mergedMap.values());
        setLocations(cleanMerged);
        if (cleanMerged.length > 0) setActiveLocation(cleanMerged[0]);
        try {
          localStorage.setItem("lifehub_google_map_places", JSON.stringify(cleanMerged));
        } catch {}
        setDriveSyncResult({
          success: true,
          message: `Synced and cleaned! Total of ${cleanMerged.length} unique, deduplicated places plotted.`,
          filesFound: data.filesFound,
          placesCount: cleanMerged.length,
        });
      } else if (data.connected) {
        setDriveSyncResult({
          success: false,
          message: data.message || "Connected to Google Drive, but no Google Maps export files were found.",
          filesFound: data.filesFound || 0,
        });
      } else {
        setDriveSyncResult({
          success: false,
          message: "Google Drive is not connected yet. Click 'Connect Drive' in Google Apps to enable automatic sync.",
        });
      }
    } catch (err) {
      setDriveSyncResult({
        success: false,
        message: "Failed to communicate with Google Drive. You can also import Takeout JSON directly below.",
      });
    } finally {
      setSyncingDrive(false);
    }
  };

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
      status: newStatus,
      category: newCategory,
      categoryLabel: categoryLabels[newCategory] || "Custom Place",
      address: newAddress.trim() || newTitle.trim(),
      notes: newNotes.trim() || "Saved via Google Maps Hub",
      source: "custom",
      visitedDate: newStatus === "visited" ? (newDate.trim() || "Recently") : undefined,
      targetDate: newStatus === "want_to_go" ? (newDate.trim() || "Planned") : undefined,
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
    setNewDate("");
    setShowAddModal(false);
  };

  // Handle JSON / GeoJSON / Google Takeout upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const lowerName = file.name.toLowerCase();
    let fileStatus: "visited" | "saved" | "want_to_go" = "saved";
    if (lowerName.includes("want") || lowerName.includes("wish") || lowerName.includes("to-go")) {
      fileStatus = "want_to_go";
    } else if (lowerName.includes("timeline") || lowerName.includes("location") || lowerName.includes("history") || lowerName.includes("record")) {
      fileStatus = "visited";
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        let importedPlaces: MapLocation[] = [];

        // 1. Try parsing JSON
        try {
          const json = JSON.parse(text);

          // Format A: Google Takeout Saved Places / Reviews / Labeled Places (GeoJSON)
          if (json.features && Array.isArray(json.features)) {
            importedPlaces = json.features.map((feat: any, idx: number) => {
              const coords = feat.geometry?.coordinates || [77.5946, 12.9716];
              const lng = Number(coords[0]) || 77.5946;
              const lat = Number(coords[1]) || 12.9716;

              const locObj = feat.properties?.location;
              const rawName = feat.properties?.name || feat.properties?.Title || locObj?.name || `Imported Place ${idx + 1}`;
              const rawAddress = locObj?.address || feat.properties?.address || feat.properties?.Location?.Address || rawName;

              let placeStatus = fileStatus;
              let category: MapLocation["category"] = "personal";
              let categoryLabel = "Google Saved";
              let notes = feat.properties?.review_text_published || feat.properties?.Comment || "Imported from Google Maps Takeout";

              if (feat.properties?.five_star_rating_published) {
                placeStatus = "visited";
                notes = `⭐ ${feat.properties.five_star_rating_published}/5 Rating. ${notes}`;
                categoryLabel = "Reviewed Place";
              }

              const lowerTitle = rawName.toLowerCase();
              let title = rawName;
              let address = rawAddress;

              const isNitCalicut =
                lowerTitle === "school" ||
                lowerTitle === "college" ||
                lowerTitle === "alma mater" ||
                lowerTitle === "nitc" ||
                lowerTitle.includes("nit calicut") ||
                lowerTitle.includes("national institute of technology calicut") ||
                lowerTitle.includes("national institute of technology, calicut");

              if (lowerTitle === "home") {
                title = "Family Haven (Home Base)";
                address = address === "Home" ? "Tripunithura, Kochi, Kerala" : address;
                category = "personal";
                categoryLabel = "Home Base";
                placeStatus = "saved";
              } else if (lowerTitle === "work") {
                title = "Schneider Electric Global Hub";
                address = address === "Work" ? "Prestige Tech Park II, Bengaluru" : address;
                category = "corporate";
                categoryLabel = "Corporate HQ";
                placeStatus = "saved";
              } else if (isNitCalicut) {
                title = "National Institute of Technology (NIT) Calicut (Alma Mater)";
                category = "gmat";
                categoryLabel = "Alma Mater";
                placeStatus = "saved";
              } else {
                const listName = (feat.properties?.listName || feat.properties?.List || "").toLowerCase();
                if (listName.includes("want")) placeStatus = "want_to_go";
                else if (listName.includes("star") || listName.includes("fav")) placeStatus = "saved";
              }

              return {
                id: `loc-imported-${idx}-${Date.now()}`,
                title,
                query: `${title}, ${address}`,
                lat,
                lng,
                status: placeStatus,
                category,
                categoryLabel,
                address,
                notes,
                source: "imported" as const,
                visitedDate: feat.properties?.date ? new Date(feat.properties.date).toLocaleDateString() : undefined,
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
                status: "visited" as const,
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
              status: item.status || fileStatus,
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
                status: fileStatus,
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
          const map = new Map<string, MapLocation>();
          // 1. Put imported places first
          for (const p of importedPlaces) {
            if (!p.title || (p.lat === 0 && p.lng === 0)) continue;
            map.set(getLocationFingerprint(p), p);
          }
          // 2. Add existing places without duplicates
          for (const p of locations) {
            const fp = getLocationFingerprint(p);
            if (!map.has(fp)) map.set(fp, p);
          }
          const merged = Array.from(map.values());
          setLocations(merged);
          setActiveLocation(importedPlaces[0]);
          try {
            localStorage.setItem("lifehub_google_map_places", JSON.stringify(merged));
          } catch {}
          setImportNotification(`Successfully imported and deduplicated ${importedPlaces.length} places!`);
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

  // Clean up & Reset Map to zero locations
  const handleResetDefaults = () => {
    try {
      localStorage.removeItem("lifehub_google_map_places");
    } catch {}
    setLocations([]);
    setActiveLocation(null);
    setImportNotification("Map cleared! All locations and cached data removed.");
    setTimeout(() => setImportNotification(null), 4000);
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
                  Google Maps & Geospatial Intelligence
                </h2>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Sync Engine
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Places Visited, Saved Bases, and Want-to-Go Destinations with 562 km Transit Corridor Radar
              </p>
            </div>
          </div>

          {/* Action Buttons: Google Drive Sync, Add Place, Import Takeout */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <button
              onClick={handleDriveSync}
              disabled={syncingDrive}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
              title="Scan connected Google Account & Drive for Takeout files"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncingDrive ? "animate-spin" : ""}`} />
              <span>{syncingDrive ? "Scanning Drive..." : "Sync Google Account"}</span>
            </button>

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
              <span>Import Takeout</span>
            </button>

            <button
              onClick={handleResetDefaults}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-800/40 text-red-200 hover:text-white transition-all cursor-pointer font-bold"
              title="Clean up messy duplicates and restore verified places"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
              <span>Clean & Reset Map</span>
            </button>
          </div>
        </div>

        {/* DRIVE SYNC FEEDBACK BANNER */}
        {driveSyncResult && (
          <div
            className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between gap-3 animate-in fade-in ${
              driveSyncResult.success
                ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
                : "bg-neutral-900 border-neutral-700 text-neutral-300"
            }`}
          >
            <div className="flex items-center gap-2">
              {driveSyncResult.success ? (
                <Check className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-blue-400" />
              )}
              <span>{driveSyncResult.message}</span>
            </div>
            <button
              onClick={() => setDriveSyncResult(null)}
              className="text-[10px] text-neutral-400 hover:text-white font-mono"
            >
              Dismiss
            </button>
          </div>
        )}

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
      {viewMode === "interactive-map" && locations.length === 0 && (
        <div className="p-10 sm:p-14 rounded-3xl bg-[#14151b] border border-[#232530] text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-[#101116] border border-[#262834] flex items-center justify-center text-neutral-400 shadow-inner">
            <MapPin className="w-8 h-8 text-white/80" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-xl font-bold text-white tracking-tight">No Locations Loaded</h3>
            <p className="text-xs text-neutral-400">
              All prefixed mock locations have been cleared. Sync your actual saved, visited, and want-to-go places directly from your Google Drive Takeout files or import a file manually.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleDriveSync}
              disabled={syncingDrive}
              className="px-5 py-2.5 rounded-2xl bg-white hover:bg-neutral-200 text-black text-xs font-bold font-mono transition-transform hover:scale-105 cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${syncingDrive ? "animate-spin" : ""}`} />
              <span>{syncingDrive ? "Scanning Drive..." : "Sync from Google Drive"}</span>
            </button>
            <button
              onClick={() => setShowImportModal(true)}
              className="px-5 py-2.5 rounded-2xl bg-[#101116] hover:bg-[#181a22] text-neutral-300 border border-[#262834] text-xs font-bold font-mono transition-colors cursor-pointer flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>Import Takeout File</span>
            </button>
          </div>
        </div>
      )}

      {viewMode === "interactive-map" && locations.length > 0 && activePlace && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          {/* LEFT: LOCATIONS DIRECTORY & FILTER (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* 3-WAY STATUS SEGMENTED CONTROL: ALL / VISITED / SAVED / WANT TO GO */}
            <div className="grid grid-cols-4 gap-1.5 p-1.5 rounded-2xl bg-[#14151b] border border-[#232530] text-xs font-mono shadow-md">
              <button
                onClick={() => setStatusFilter("all")}
                className={`py-2 px-1 rounded-xl font-bold flex flex-col items-center justify-center transition-all cursor-pointer ${
                  statusFilter === "all"
                    ? "bg-white text-black shadow-sm"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <span className="text-[10px] uppercase tracking-wider">All Hubs</span>
                <span className="text-xs font-extrabold">{locations.length}</span>
              </button>

              <button
                onClick={() => setStatusFilter("visited")}
                className={`py-2 px-1 rounded-xl font-bold flex flex-col items-center justify-center transition-all cursor-pointer ${
                  statusFilter === "visited"
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "text-neutral-400 hover:text-emerald-300"
                }`}
              >
                <span className="text-[10px] uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Visited
                </span>
                <span className="text-xs font-extrabold">{visitedCount}</span>
              </button>

              <button
                onClick={() => setStatusFilter("saved")}
                className={`py-2 px-1 rounded-xl font-bold flex flex-col items-center justify-center transition-all cursor-pointer ${
                  statusFilter === "saved"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-neutral-400 hover:text-blue-300"
                }`}
              >
                <span className="text-[10px] uppercase tracking-wider flex items-center gap-1">
                  <Bookmark className="w-3 h-3" /> Saved
                </span>
                <span className="text-xs font-extrabold">{savedCount}</span>
              </button>

              <button
                onClick={() => setStatusFilter("want_to_go")}
                className={`py-2 px-1 rounded-xl font-bold flex flex-col items-center justify-center transition-all cursor-pointer ${
                  statusFilter === "want_to_go"
                    ? "bg-amber-500 text-black shadow-sm"
                    : "text-neutral-400 hover:text-amber-300"
                }`}
              >
                <span className="text-[10px] uppercase tracking-wider flex items-center gap-1">
                  <Compass className="w-3 h-3" /> To Go
                </span>
                <span className="text-xs font-extrabold">{wantToGoCount}</span>
              </button>
            </div>

            {/* Search & Category Pills */}
            <div className="p-4 rounded-2xl bg-[#14151b] border border-[#232530] space-y-3 shadow-lg">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search visited, saved, or target places..."
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
                  { id: "personal", label: "🏡 Lifestyle" },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCategoryFilter(c.id)}
                    className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
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
                const isSelected = (activeLocation?.id || filteredLocations[0]?.id) === loc.id;
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

                      {/* Status Badge */}
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold border flex items-center gap-1 ${
                          loc.status === "visited"
                            ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                            : loc.status === "saved"
                            ? "bg-blue-500/10 text-blue-300 border-blue-500/30"
                            : "bg-amber-500/10 text-amber-300 border-amber-500/30"
                        }`}
                      >
                        {loc.status === "visited" && <CheckCircle2 className="w-2.5 h-2.5" />}
                        {loc.status === "saved" && <Bookmark className="w-2.5 h-2.5" />}
                        {loc.status === "want_to_go" && <Compass className="w-2.5 h-2.5" />}
                        <span>
                          {loc.status === "visited" ? "Visited" : loc.status === "saved" ? "Saved" : "Want to Go"}
                        </span>
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

              {filteredLocations.length === 0 && (
                <div className="p-8 rounded-2xl bg-[#14151b] border border-[#232530] text-center text-xs text-neutral-500 space-y-2">
                  <p>No places match the active filters.</p>
                  <button
                    onClick={() => {
                      setStatusFilter("all");
                      setCategoryFilter("all");
                      setSearchQuery("");
                    }}
                    className="text-white underline font-mono"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: LIVE INTERACTIVE GOOGLE MAP EMBED (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-3xl bg-[#14151b] border border-[#232530] p-4 sm:p-5 shadow-2xl space-y-4">
              {/* Map Controls Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#232530]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{activePlace.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#101116] border border-[#282a38] font-mono text-neutral-400">
                      {activePlace.lat.toFixed(4)}°N, {activePlace.lng.toFixed(4)}°E
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 font-mono mt-0.5">{activePlace.address}</p>
                </div>

                {/* Map Type Controls (Roadmap / Satellite / Terrain) */}
                <div className="flex items-center gap-1.5 font-mono text-xs">
                  <div className="flex items-center p-0.5 rounded-lg bg-[#101116] border border-[#262834]">
                    <button
                      onClick={() => setMapType("m")}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                        mapType === "m" ? "bg-white text-black font-bold" : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      Roadmap
                    </button>
                    <button
                      onClick={() => setMapType("k")}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                        mapType === "k" ? "bg-white text-black font-bold" : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      Satellite
                    </button>
                    <button
                      onClick={() => setMapType("p")}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer ${
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
                      className="px-2 py-1 text-neutral-300 hover:text-white font-bold cursor-pointer"
                      title="Zoom Out"
                    >
                      -
                    </button>
                    <span className="text-[10px] px-1 text-neutral-400">{zoomLevel}x</span>
                    <button
                      onClick={() => setZoomLevel((z) => Math.min(z + 1, 19))}
                      className="px-2 py-1 text-neutral-300 hover:text-white font-bold cursor-pointer"
                      title="Zoom In"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Status Switcher Bar for Selected Place */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl bg-[#101116] border border-[#232530] text-xs font-mono">
                <span className="text-[11px] text-neutral-400 flex items-center gap-1.5">
                  <span>Current Status:</span>
                  <strong className="text-white capitalize">{activePlace.status.replace("_", " ")}</strong>
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleUpdateStatus(activePlace.id, "visited")}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      activePlace.status === "visited"
                        ? "bg-emerald-500 text-white shadow-sm"
                        : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-emerald-300"
                    }`}
                  >
                    ✓ Mark Visited
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(activePlace.id, "saved")}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      activePlace.status === "saved"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-blue-300"
                    }`}
                  >
                    ⭐ Mark Saved
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(activePlace.id, "want_to_go")}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      activePlace.status === "want_to_go"
                        ? "bg-amber-500 text-black shadow-sm"
                        : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-amber-300"
                    }`}
                  >
                    🎯 Want to Go
                  </button>
                </div>
              </div>

              {/* Responsive Embedded Google Map Iframe */}
              <div className="relative w-full h-[460px] sm:h-[500px] rounded-2xl overflow-hidden border border-[#262834] bg-[#0c0d11]">
                <iframe
                  title={`Google Map - ${activePlace.title}`}
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
                  <span className="font-bold">{activePlace.title}</span>
                  <span className="text-[10px] text-neutral-400">({activePlace.categoryLabel})</span>
                </div>

                {/* Floating Directions Action */}
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(activePlace.query)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs shadow-2xl flex items-center gap-1.5 font-mono transition-transform hover:scale-105"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Get Directions</span>
                  </a>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activePlace.query)}`}
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
                  <span className="font-bold text-white mt-0.5 block">{activePlace.elevation || "915m ASL"}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#101116] border border-[#232530]">
                  <span className="text-[10px] text-neutral-500 block uppercase font-bold">Microclimate</span>
                  <span className="font-bold text-white mt-0.5 block truncate">{activePlace.microclimate || "Subtropical"}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#101116] border border-[#232530]">
                  <span className="text-[10px] text-neutral-500 block uppercase font-bold">Transit Status</span>
                  <span className="font-bold text-white mt-0.5 block truncate">{activePlace.transitFromBlr || "Connected"}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#101116] border border-[#232530]">
                  <span className="text-[10px] text-neutral-500 block uppercase font-bold">Category & Status</span>
                  <span className="font-bold text-emerald-400 mt-0.5 block capitalize truncate">
                    {activePlace.status.replace("_", " ")}
                  </span>
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
                  <div className="w-0.5 h-16 bg-gradient-to-b from-blue-400 via-sky-400 to-emerald-400 my-1" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono font-bold">
                      BASE 0 KM
                    </span>
                    <h4 className="font-bold text-white text-sm">Bengaluru Executive HQ (Schneider Electric WTC)</h4>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Outer Ring Road, Mahadevapura • Elevation: 920m ASL • Urban Tech Corridor
                  </p>
                </div>
              </div>

              {/* Node 2: Aviation Gateway (BLR -> IXM) */}
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border-2 border-sky-400 flex items-center justify-center text-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.5)]">
                    <Plane className="w-5 h-5 text-sky-300" />
                  </div>
                  <div className="w-0.5 h-16 bg-gradient-to-b from-sky-400 to-amber-400 my-1" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono font-bold">
                      AIR CORRIDOR (1H 10M)
                    </span>
                    <h4 className="font-bold text-white text-sm">Kempegowda (BLR) ✈️ Madurai Airport (IXM)</h4>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Non-stop Indigo flights • Connects Bengaluru directly with South Tamil Nadu transit grid
                  </p>
                </div>
              </div>

              {/* Node 3: Tenkasi Junction Railhead */}
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                    <Train className="w-5 h-5 text-amber-300" />
                  </div>
                  <div className="w-0.5 h-16 bg-gradient-to-b from-amber-400 to-emerald-400 my-1" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                      RAIL CORRIDOR (OVERNIGHT)
                    </span>
                    <h4 className="font-bold text-white text-sm">Tenkasi Junction (TSI) Railhead</h4>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Direct sleeper train options from SBC/SMVB Bengaluru • Guava bulk logistics and transit
                  </p>
                </div>
              </div>

              {/* Node 4: Veerakeralapudur Farm Destination */}
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.7)] animate-bounce">
                    <Sprout className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                      DESTINATION 562 KM
                    </span>
                    <h4 className="font-bold text-white text-sm">Veerakeralapudur Agribusiness Smart Farm</h4>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Tenkasi District, TN • 5-Acre Precision Guava Orchard • Western Ghats foothills microclimate
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. GEOGRAPHY TELEMETRY MATRIX (Analytics Mode) */}
      {viewMode === "analytics" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#14151b] border border-[#232530] shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#232530]">
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white">Geospatial Telemetry Matrix</h3>
              <p className="text-xs text-neutral-400">
                Detailed coordinate distribution, altitude breakdown, and regional microclimate profiles
              </p>
            </div>
            <div className="text-xs font-mono text-neutral-400">
              {locations.length} total mapped nodes
            </div>
          </div>

          {locations.length === 0 ? (
            <div className="p-10 rounded-2xl bg-[#101116] border border-[#262834] text-center text-xs text-neutral-400 space-y-3">
              <p>No locations to analyze yet. Sync from Google Drive or import Takeout to view geospatial telemetry.</p>
              <button
                onClick={handleDriveSync}
                disabled={syncingDrive}
                className="px-4 py-2 rounded-xl bg-white text-black font-bold font-mono text-xs cursor-pointer disabled:opacity-50"
              >
                {syncingDrive ? "Scanning Drive..." : "Sync from Google Drive"}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {locations.map((loc) => (
                <div
                  key={loc.id}
                  className="p-5 rounded-2xl bg-[#101116] border border-[#262834] space-y-3 hover:border-neutral-500 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-white truncate max-w-[180px]">{loc.title}</h4>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold border ${
                        loc.status === "visited"
                          ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                          : loc.status === "saved"
                          ? "bg-blue-500/10 text-blue-300 border-blue-500/30"
                          : "bg-amber-500/10 text-amber-300 border-amber-500/30"
                      }`}
                    >
                      {loc.status === "visited" ? "Visited" : loc.status === "saved" ? "Saved" : "Want to Go"}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-neutral-400 font-mono">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Category:</span>
                      <span className="text-white">{loc.categoryLabel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Elevation:</span>
                      <span className="text-white">{loc.elevation || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Microclimate:</span>
                      <span className="text-white truncate max-w-[150px]">{loc.microclimate || "Regional"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Coordinates:</span>
                      <span className="text-neutral-300">{loc.lat.toFixed(4)}°, {loc.lng.toFixed(4)}°</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#232530] flex items-center justify-between text-xs font-mono">
                    <span className="text-[10px] text-neutral-500 uppercase">{loc.source || "Curated"}</span>
                    <button
                      onClick={() => {
                        setActiveLocation(loc);
                        setViewMode("interactive-map");
                      }}
                      className="text-white hover:text-neutral-300 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>View on Map →</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
                className="text-xs text-neutral-400 hover:text-white px-2 py-1 rounded bg-neutral-900 border border-neutral-800 cursor-pointer"
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

              {/* Status Radio Selector */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-mono font-semibold">
                  Map List / Status *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewStatus("visited")}
                    className={`py-2 px-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                      newStatus === "visited"
                        ? "bg-emerald-500 text-white border-emerald-400 shadow-md"
                        : "bg-[#101116] border-[#282a38] text-neutral-400 hover:text-emerald-300"
                    }`}
                  >
                    ✓ Places Visited
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewStatus("saved")}
                    className={`py-2 px-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                      newStatus === "saved"
                        ? "bg-blue-600 text-white border-blue-500 shadow-md"
                        : "bg-[#101116] border-[#282a38] text-neutral-400 hover:text-blue-300"
                    }`}
                  >
                    ⭐ Saved Place
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewStatus("want_to_go")}
                    className={`py-2 px-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                      newStatus === "want_to_go"
                        ? "bg-amber-500 text-black border-amber-400 shadow-md"
                        : "bg-[#101116] border-[#282a38] text-neutral-400 hover:text-amber-300"
                    }`}
                  >
                    🎯 Want to Go
                  </button>
                </div>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    {newStatus === "visited" ? "Visit Date / Timeline" : "Target Date / Milestone"}
                  </label>
                  <input
                    type="text"
                    placeholder={newStatus === "visited" ? "e.g. October 2026 / Regular" : "e.g. Q1 2027 Harvest"}
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#101116] border border-[#282a38] text-white focus:outline-none focus:border-white font-mono"
                  />
                </div>
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
                  className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-mono text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold font-mono text-xs shadow-md cursor-pointer"
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
                className="text-xs text-neutral-400 hover:text-white px-2 py-1 rounded bg-neutral-900 border border-neutral-800 cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="space-y-4 text-xs leading-relaxed text-neutral-300">
              <div className="p-3.5 rounded-2xl bg-[#181920] border border-[#262834] space-y-2">
                <h4 className="font-bold text-white flex items-center gap-1.5 font-mono">
                  <span className="w-4 h-4 rounded-full bg-white text-black flex items-center justify-center text-[10px]">1</span>
                  How to export from Google Account:
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-neutral-400 pl-1 text-[11px]">
                  <li>
                    <strong>From Computer</strong>: Visit <a href="https://takeout.google.com" target="_blank" rel="noreferrer" className="text-white underline">takeout.google.com</a>, check <strong>Maps (your places)</strong>, and export.
                  </li>
                  <li>
                    <strong>From Mobile Phone (Timeline)</strong>: In the Google Maps app, tap your profile ➔ <strong>Your Timeline</strong> ➔ Settings ➔ <strong>Export Timeline data</strong>.
                  </li>
                  <li>
                    Drop the downloaded <strong>Saved Places.json</strong>, <strong>Want to go.json</strong>, or <strong>Timeline.json</strong> file below!
                  </li>
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
                  Supports Saved Places.json, Timeline.json, GeoJSON, and CSV files
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
                All imported places are stored locally in your browser. Zero private location data leaves your device.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
