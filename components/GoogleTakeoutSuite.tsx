"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Activity,
  Heart,
  Flame,
  Footprints,
  Moon,
  Dumbbell,
  StickyNote,
  CheckSquare,
  Pin,
  Image as ImageIcon,
  Bookmark as BookmarkIcon,
  Tag,
  Search,
  Plus,
  Upload,
  Trash2,
  ExternalLink,
  RefreshCw,
  Folder,
  Compass,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Filter,
  Check,
  MapPin,
  Calendar,
  Layers,
  Clock,
} from "lucide-react";
import {
  FitDailyMetric,
  KeepNote,
  ChromeBookmarkItem,
  PhotoMemory,
  parseGoogleFitCSV,
  parseGoogleKeepJSON,
  parseChromeBookmarksHTML,
} from "@/lib/googleTakeoutParsers";

export default function GoogleTakeoutSuite() {
  const [activeSubTab, setActiveSubTab] = useState<"fit" | "keep" | "photos" | "bookmarks">("fit");

  // ==========================================
  // 1. GOOGLE FIT STATE
  // ==========================================
  const [fitMetrics, setFitMetrics] = useState<FitDailyMetric[]>([]);
  const [fitStepGoal, setFitStepGoal] = useState<number>(10000);
  const [showFitUpload, setShowFitUpload] = useState<boolean>(false);
  const [fitNotification, setFitNotification] = useState<string | null>(null);
  const fitInputRef = useRef<HTMLInputElement>(null);

  // Default initial Fit data if none in storage
  const defaultFitMetrics: FitDailyMetric[] = useMemo(() => [
    { date: "Today", steps: 8420, calories: 2340, distanceKm: 6.4, activeMinutes: 52, heartRateAvg: 68, sleepHours: 7.4 },
    { date: "Yesterday", steps: 10850, calories: 2510, distanceKm: 8.2, activeMinutes: 68, heartRateAvg: 71, sleepHours: 7.8 },
    { date: "2 days ago", steps: 9320, calories: 2410, distanceKm: 7.1, activeMinutes: 58, heartRateAvg: 69, sleepHours: 6.9 },
    { date: "3 days ago", steps: 11400, calories: 2620, distanceKm: 8.7, activeMinutes: 74, heartRateAvg: 73, sleepHours: 7.5 },
    { date: "4 days ago", steps: 7890, calories: 2280, distanceKm: 5.9, activeMinutes: 46, heartRateAvg: 67, sleepHours: 7.1 },
    { date: "5 days ago", steps: 10150, calories: 2480, distanceKm: 7.8, activeMinutes: 63, heartRateAvg: 70, sleepHours: 8.0 },
    { date: "6 days ago", steps: 8900, calories: 2360, distanceKm: 6.8, activeMinutes: 54, heartRateAvg: 68, sleepHours: 7.2 },
  ], []);

  // ==========================================
  // 2. GOOGLE KEEP STATE
  // ==========================================
  const [keepNotes, setKeepNotes] = useState<KeepNote[]>([]);
  const [keepSearch, setKeepSearch] = useState<string>("");
  const [keepCategoryFilter, setKeepCategoryFilter] = useState<string>("All");
  const [showAddKeepModal, setShowAddKeepModal] = useState<boolean>(false);
  const [newKeepTitle, setNewKeepTitle] = useState("");
  const [newKeepContent, setNewKeepContent] = useState("");
  const [newKeepCategory, setNewKeepCategory] = useState<KeepNote["category"]>("Strategy");
  const keepInputRef = useRef<HTMLInputElement>(null);

  const defaultKeepNotes: KeepNote[] = useMemo(() => [
    {
      id: "k-1",
      title: "S/4HANA Order Scheduling Bottleneck Protocol",
      content: "Ensure continuous handshake between plant-level production orders and warehouse staging. Verify PP/DS scheduling heuristics prior to daily go-live cutover.",
      category: "ERP & Work",
      isPinned: true,
      updatedAt: "Nov 18, 2026",
      tags: ["SAP S/4HANA", "Manufacturing", "MES"],
    },
    {
      id: "k-2",
      title: "Taiwan Pink Guava Pruning & Micro-Drip Schedule",
      content: "Western Ghats post-monsoon foliage trimming. Maintain 4L/hr inline dripper pulse cycle between 06:00 and 08:30 IST for peak root zone aeration.",
      category: "Farm & Agri",
      isPinned: true,
      updatedAt: "Nov 17, 2026",
      tags: ["Agribusiness", "Orchard", "Irrigation"],
    },
    {
      id: "k-3",
      title: "GMAT Focus Readiness Checkpoints",
      content: "Data Insights Multi-Source Reasoning pacing: Max 2.5 min/item. Verbal Critical Reasoning: Pinpoint unstated assumption before reading answer choices.",
      category: "GMAT",
      isPinned: false,
      updatedAt: "Nov 15, 2026",
      tags: ["GMAT 705+", "Quant", "Data Insights"],
    },
    {
      id: "k-4",
      title: "Sunday Choral Communion Sanctuary Reflection",
      content: "Meditate on Psalm 23 and continuous guidance. Peace and focus for weekly team leadership.",
      category: "Spiritual",
      isPinned: false,
      updatedAt: "Nov 16, 2026",
      tags: ["Devotion", "Reflection"],
    },
  ], []);

  // ==========================================
  // 3. GOOGLE PHOTOS STATE
  // ==========================================
  const [photos, setPhotos] = useState<PhotoMemory[]>([]);
  const [photoFilter, setPhotoFilter] = useState<string>("All");

  const defaultPhotos: PhotoMemory[] = useMemo(() => [
    {
      id: "p-1",
      title: "Veerakeralapudur Guava Orchard Horizon",
      description: "Sunset over the Western Ghats foothills. 5-acre high-density Taiwan Pink guava trees with solar drip lines.",
      imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
      locationName: "Veerakeralapudur, Tenkasi",
      lat: 8.9564,
      lng: 77.4428,
      date: "Oct 2026",
      album: "Smart Agribusiness",
      category: "Agribusiness",
    },
    {
      id: "p-2",
      title: "Schneider Electric Prestige Tech Park Tower",
      description: "Corporate workspace and ERP architecture desk overlooking Bengaluru Outer Ring Road.",
      imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
      locationName: "Prestige Tech Park II, Bengaluru",
      lat: 12.941681,
      lng: 77.690741,
      date: "Nov 2026",
      album: "Corporate Command",
      category: "Corporate",
    },
    {
      id: "p-3",
      title: "Family Haven Backwaters Sunset",
      description: "Peaceful evening backwater vista at Tripunithura home base.",
      imageUrl: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80",
      locationName: "Tripunithura, Kochi",
      lat: 9.934426,
      lng: 76.38275,
      date: "Sep 2026",
      album: "Family Haven",
      category: "Personal",
    },
    {
      id: "p-4",
      title: "NIT Calicut Engineering Campus Walk",
      description: "Lush green tree-lined avenue near the Department of Production Engineering.",
      imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80",
      locationName: "Kattangal, NIT Calicut",
      lat: 11.321579,
      lng: 75.933636,
      date: "Aug 2026",
      album: "Alma Mater Memories",
      category: "Travel & Transit",
    },
  ], []);

  // ==========================================
  // 4. CHROME BOOKMARKS STATE
  // ==========================================
  const [bookmarks, setBookmarks] = useState<ChromeBookmarkItem[]>([]);
  const [bookmarkSearch, setBookmarkSearch] = useState<string>("");
  const [bookmarkCatFilter, setBookmarkCatFilter] = useState<string>("All");
  const [showAddBmModal, setShowAddBmModal] = useState<boolean>(false);
  const [newBmTitle, setNewBmTitle] = useState("");
  const [newBmUrl, setNewBmUrl] = useState("");
  const [newBmCategory, setNewBmCategory] = useState<ChromeBookmarkItem["category"]>("ERP & Tech");
  const bmInputRef = useRef<HTMLInputElement>(null);

  const defaultBookmarks: ChromeBookmarkItem[] = useMemo(() => [
    {
      id: "bm-1",
      title: "SAP Community: S/4HANA Manufacturing & MRP Live Best Practices",
      url: "https://community.sap.com",
      category: "ERP & Tech",
      notes: "Reference guide for high-speed multi-plant PP order sequencing.",
    },
    {
      id: "bm-2",
      title: "ICAR-CISH High-Density Meadow Guava Production Manual",
      url: "https://cish.icar.gov.in",
      category: "Agri-Tech",
      notes: "Precision spacing, canopy training, and micro-nutrient drip formulations.",
    },
    {
      id: "bm-3",
      title: "Official GMAT Focus Edition Prep Portal (mba.com)",
      url: "https://www.mba.com",
      category: "GMAT Prep",
      notes: "Official practice exams, scoring algorithm, and question banks.",
    },
    {
      id: "bm-4",
      title: "Harvard Business Review: Managing Global Supply Network Volatility",
      url: "https://hbr.org",
      category: "Executive Strategy",
      notes: "Frameworks for lead-time buffering and operations resilience.",
    },
    {
      id: "bm-5",
      title: "National Weather Service Radar & Rainfall Forecasting",
      url: "https://mausam.imd.gov.in",
      category: "Agri-Tech",
      notes: "IMD satellite imagery and precipitation tracking for Tenkasi.",
    },
  ], []);

  // ==========================================
  // LOCAL STORAGE HYDRATION
  // ==========================================
  useEffect(() => {
    try {
      // 1. Fit
      const storedFit = localStorage.getItem("lifehub_google_fit_metrics");
      if (storedFit) {
        const parsed = JSON.parse(storedFit);
        if (Array.isArray(parsed) && parsed.length > 0) setFitMetrics(parsed);
        else setFitMetrics(defaultFitMetrics);
      } else {
        setFitMetrics(defaultFitMetrics);
      }

      // 2. Keep
      const storedKeep = localStorage.getItem("lifehub_google_keep_notes");
      if (storedKeep) {
        const parsed = JSON.parse(storedKeep);
        if (Array.isArray(parsed) && parsed.length > 0) setKeepNotes(parsed);
        else setKeepNotes(defaultKeepNotes);
      } else {
        setKeepNotes(defaultKeepNotes);
      }

      // 3. Photos
      const storedPhotos = localStorage.getItem("lifehub_google_photos_memories");
      if (storedPhotos) {
        const parsed = JSON.parse(storedPhotos);
        if (Array.isArray(parsed) && parsed.length > 0) setPhotos(parsed);
        else setPhotos(defaultPhotos);
      } else {
        setPhotos(defaultPhotos);
      }

      // 4. Bookmarks
      const storedBm = localStorage.getItem("lifehub_chrome_bookmarks");
      if (storedBm) {
        const parsed = JSON.parse(storedBm);
        if (Array.isArray(parsed) && parsed.length > 0) setBookmarks(parsed);
        else setBookmarks(defaultBookmarks);
      } else {
        setBookmarks(defaultBookmarks);
      }
    } catch (e) {
      console.warn("Storage hydration error:", e);
      setFitMetrics(defaultFitMetrics);
      setKeepNotes(defaultKeepNotes);
      setPhotos(defaultPhotos);
      setBookmarks(defaultBookmarks);
    }
  }, [defaultFitMetrics, defaultKeepNotes, defaultPhotos, defaultBookmarks]);

  // ==========================================
  // HANDLERS
  // ==========================================
  const handleFitUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const parsed = parseGoogleFitCSV(text);
      if (parsed.length > 0) {
        setFitMetrics(parsed);
        try {
          localStorage.setItem("lifehub_google_fit_metrics", JSON.stringify(parsed));
        } catch {}
        setFitNotification(`Successfully imported ${parsed.length} days of Google Fit activity!`);
        setTimeout(() => setFitNotification(null), 4000);
      } else {
        setFitNotification("Could not parse Fit CSV. Please ensure it is a Google Fit activity metrics export.");
        setTimeout(() => setFitNotification(null), 4000);
      }
    };
    reader.readAsText(file);
  };

  const handleKeepUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const parsed = parseGoogleKeepJSON(text);
      if (parsed) {
        const updated = [parsed, ...keepNotes];
        setKeepNotes(updated);
        try {
          localStorage.setItem("lifehub_google_keep_notes", JSON.stringify(updated));
        } catch {}
      }
    };
    reader.readAsText(file);
  };

  const handleAddKeepNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeepTitle.trim()) return;

    const newNote: KeepNote = {
      id: `keep-${Date.now()}`,
      title: newKeepTitle.trim(),
      content: newKeepContent.trim(),
      category: newKeepCategory,
      isPinned: false,
      updatedAt: "Just now",
      tags: [newKeepCategory],
    };

    const updated = [newNote, ...keepNotes];
    setKeepNotes(updated);
    try {
      localStorage.setItem("lifehub_google_keep_notes", JSON.stringify(updated));
    } catch {}

    setNewKeepTitle("");
    setNewKeepContent("");
    setShowAddKeepModal(false);
  };

  const handleTogglePin = (id: string) => {
    const updated = keepNotes.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n));
    setKeepNotes(updated);
    try {
      localStorage.setItem("lifehub_google_keep_notes", JSON.stringify(updated));
    } catch {}
  };

  const handleDeleteKeep = (id: string) => {
    const updated = keepNotes.filter((n) => n.id !== id);
    setKeepNotes(updated);
    try {
      localStorage.setItem("lifehub_google_keep_notes", JSON.stringify(updated));
    } catch {}
  };

  const handleBookmarksUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const parsed = parseChromeBookmarksHTML(text);
      if (parsed.length > 0) {
        const merged = [...parsed, ...bookmarks];
        setBookmarks(merged);
        try {
          localStorage.setItem("lifehub_chrome_bookmarks", JSON.stringify(merged));
        } catch {}
      }
    };
    reader.readAsText(file);
  };

  const handleAddBookmark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBmTitle.trim() || !newBmUrl.trim()) return;

    const newBm: ChromeBookmarkItem = {
      id: `bm-${Date.now()}`,
      title: newBmTitle.trim(),
      url: newBmUrl.trim().startsWith("http") ? newBmUrl.trim() : `https://${newBmUrl.trim()}`,
      category: newBmCategory,
      addDate: "Just now",
    };

    const updated = [newBm, ...bookmarks];
    setBookmarks(updated);
    try {
      localStorage.setItem("lifehub_chrome_bookmarks", JSON.stringify(updated));
    } catch {}

    setNewBmTitle("");
    setNewBmUrl("");
    setShowAddBmModal(false);
  };

  const handleDeleteBookmark = (id: string) => {
    const updated = bookmarks.filter((b) => b.id !== id);
    setBookmarks(updated);
    try {
      localStorage.setItem("lifehub_chrome_bookmarks", JSON.stringify(updated));
    } catch {}
  };

  // Filtered Keep Notes
  const filteredKeepNotes = useMemo(() => {
    return keepNotes.filter((n) => {
      const matchesCat = keepCategoryFilter === "All" || n.category === keepCategoryFilter;
      const matchesSearch =
        !keepSearch ||
        n.title.toLowerCase().includes(keepSearch.toLowerCase()) ||
        n.content.toLowerCase().includes(keepSearch.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [keepNotes, keepCategoryFilter, keepSearch]);

  // Filtered Bookmarks
  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter((b) => {
      const matchesCat = bookmarkCatFilter === "All" || b.category === bookmarkCatFilter;
      const matchesSearch =
        !bookmarkSearch ||
        b.title.toLowerCase().includes(bookmarkSearch.toLowerCase()) ||
        b.url.toLowerCase().includes(bookmarkSearch.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [bookmarks, bookmarkCatFilter, bookmarkSearch]);

  // Active today fit metric
  const latestFit = fitMetrics[0] || defaultFitMetrics[0];
  const stepPercent = Math.min(100, Math.round((latestFit.steps / fitStepGoal) * 100));

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#14151b] border border-[#232530] shadow-2xl space-y-6">
      {/* HEADER & SUITE TABS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#232530]">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-neutral-900 border border-neutral-700 text-white shadow-md">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white tracking-tight flex items-center gap-2">
                Google Takeout 49GB Intelligence Vault
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-semibold">
                  4 Active Modules
                </span>
              </h3>
              <p className="text-xs text-neutral-400">
                Fit Health Telemetry, Keep Notes, Geotagged Photos, and Chrome Bookmarks from your Takeout archive
              </p>
            </div>
          </div>
        </div>

        {/* 4-WAY SUB-TAB SELECTOR */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#101116] border border-[#262834] font-mono text-xs overflow-x-auto">
          <button
            onClick={() => setActiveSubTab("fit")}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === "fit" ? "bg-white text-black shadow-md" : "text-neutral-400 hover:text-white"
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-500" />
            <span>Google Fit</span>
          </button>

          <button
            onClick={() => setActiveSubTab("keep")}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === "keep" ? "bg-white text-black shadow-md" : "text-neutral-400 hover:text-white"
            }`}
          >
            <StickyNote className="w-3.5 h-3.5 text-amber-500" />
            <span>Google Keep ({keepNotes.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab("photos")}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === "photos" ? "bg-white text-black shadow-md" : "text-neutral-400 hover:text-white"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
            <span>Photos & Map Memories ({photos.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab("bookmarks")}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === "bookmarks" ? "bg-white text-black shadow-md" : "text-neutral-400 hover:text-white"
            }`}
          >
            <BookmarkIcon className="w-3.5 h-3.5 text-purple-400" />
            <span>Bookmarks Vault ({bookmarks.length})</span>
          </button>
        </div>
      </div>

      {/* NOTIFICATION BANNER */}
      {fitNotification && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{fitNotification}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. GOOGLE FIT DECK                                                        */}
      {/* ========================================================================= */}
      {activeSubTab === "fit" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-bold text-sm text-white">Executive Vitality & Daily Physical Telemetry</h4>
              <p className="text-xs text-neutral-400">
                Step counts, active calorie burn, distance covered, and recovery metrics
              </p>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <input
                type="file"
                ref={fitInputRef}
                accept=".csv"
                onChange={handleFitUpload}
                className="hidden"
              />
              <button
                onClick={() => fitInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 hover:text-white transition-all cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Import Fit CSV</span>
              </button>
            </div>
          </div>

          {/* Top 4 Telemetry Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 font-mono">
            {/* Steps Ring Card */}
            <div className="p-4 rounded-2xl bg-[#101116] border border-[#232530] space-y-2">
              <div className="flex items-center justify-between text-neutral-400 text-xs">
                <span className="flex items-center gap-1.5">
                  <Footprints className="w-4 h-4 text-emerald-400" />
                  <span>Steps Today</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">{stepPercent}%</span>
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-white">
                {latestFit.steps.toLocaleString()}
                <span className="text-xs font-normal text-neutral-400 ml-1">/ 10k</span>
              </div>
              {/* Progress Bar */}
              <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                  style={{ width: `${stepPercent}%` }}
                />
              </div>
            </div>

            {/* Calories Burned */}
            <div className="p-4 rounded-2xl bg-[#101116] border border-[#232530] space-y-2">
              <div className="flex items-center justify-between text-neutral-400 text-xs">
                <span className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Energy Burn</span>
                </span>
                <span className="text-[10px] text-amber-400">Active</span>
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-white">
                {latestFit.calories.toLocaleString()}
                <span className="text-xs font-normal text-neutral-400 ml-1">kcal</span>
              </div>
              <p className="text-[10px] text-neutral-400">Total metabolic expenditure</p>
            </div>

            {/* Distance Covered */}
            <div className="p-4 rounded-2xl bg-[#101116] border border-[#232530] space-y-2">
              <div className="flex items-center justify-between text-neutral-400 text-xs">
                <span className="flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-sky-400" />
                  <span>Distance</span>
                </span>
                <span className="text-[10px] text-sky-400 font-bold">{latestFit.activeMinutes} mins</span>
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-white">
                {latestFit.distanceKm.toFixed(1)}
                <span className="text-xs font-normal text-neutral-400 ml-1">km</span>
              </div>
              <p className="text-[10px] text-neutral-400">Walking & active transit</p>
            </div>

            {/* Heart Rate / Sleep */}
            <div className="p-4 rounded-2xl bg-[#101116] border border-[#232530] space-y-2">
              <div className="flex items-center justify-between text-neutral-400 text-xs">
                <span className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-400" />
                  <span>Resting HR</span>
                </span>
                <span className="text-[10px] text-rose-400">{latestFit.sleepHours || 7.2}h sleep</span>
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-white">
                {latestFit.heartRateAvg || 68}
                <span className="text-xs font-normal text-neutral-400 ml-1">bpm</span>
              </div>
              <p className="text-[10px] text-neutral-400">Optimal recovery zone</p>
            </div>
          </div>

          {/* 7-Day Trend Visualizer */}
          <div className="p-5 rounded-2xl bg-[#101116] border border-[#262834] space-y-3 font-mono">
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span className="font-bold text-white uppercase tracking-wider">7-Day Step Activity Distribution</span>
              <span>Daily Target: 10,000 steps</span>
            </div>

            <div className="grid grid-cols-7 gap-2 pt-2 items-end h-32">
              {fitMetrics.slice(0, 7).reverse().map((m, idx) => {
                const heightPercent = Math.min(100, Math.round((m.steps / 12000) * 100));
                const hitGoal = m.steps >= fitStepGoal;
                return (
                  <div key={idx} className="flex flex-col items-center gap-1 h-full justify-end group">
                    <span className="text-[9px] text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {(m.steps / 1000).toFixed(1)}k
                    </span>
                    <div
                      className={`w-full rounded-t-lg transition-all duration-300 ${
                        hitGoal ? "bg-emerald-500 hover:bg-emerald-400" : "bg-neutral-700 hover:bg-neutral-600"
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="text-[10px] text-neutral-400 truncate max-w-full">{m.date.slice(0, 3)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. GOOGLE KEEP DECK                                                       */}
      {/* ========================================================================= */}
      {activeSubTab === "keep" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-bold text-sm text-white">Google Keep Executive Memos & Thought Capture</h4>
              <p className="text-xs text-neutral-400">
                Notes, checklists, ideas, and strategic mental frameworks synced from your Keep archive
              </p>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <input
                type="file"
                ref={keepInputRef}
                accept=".json,.html"
                onChange={handleKeepUpload}
                className="hidden"
              />
              <button
                onClick={() => keepInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 hover:text-white transition-all cursor-pointer"
                title="Import Keep JSON or HTML file"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Import Keep File</span>
              </button>

              <button
                onClick={() => setShowAddKeepModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Memo</span>
              </button>
            </div>
          </div>

          {/* Search & Category Pills */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-500" />
              <input
                type="text"
                placeholder="Search notes, ERP guidelines, farm ideas..."
                value={keepSearch}
                onChange={(e) => setKeepSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#101116] border border-[#262834] text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white font-sans"
              />
            </div>

            <div className="flex flex-wrap gap-1 text-[11px] font-mono">
              {["All", "Strategy", "ERP & Work", "Farm & Agri", "GMAT", "Spiritual", "Personal"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setKeepCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    keepCategoryFilter === cat
                      ? "bg-white text-black font-bold"
                      : "bg-[#101116] text-neutral-400 hover:text-white border border-[#262834]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Notes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredKeepNotes.map((note) => (
              <div
                key={note.id}
                className={`p-5 rounded-2xl border transition-all space-y-3 relative group ${
                  note.isPinned
                    ? "bg-[#161822] border-white/40 shadow-xl"
                    : "bg-[#101116] border-[#262834] hover:border-neutral-600 hover:bg-[#14151c]"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 font-mono font-semibold">
                      {note.category}
                    </span>
                    <h5 className="font-bold text-sm text-white leading-snug">{note.title}</h5>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleTogglePin(note.id)}
                      className={`p-1 rounded hover:bg-neutral-800 transition-colors cursor-pointer ${
                        note.isPinned ? "text-amber-400" : "text-neutral-500 hover:text-white"
                      }`}
                      title={note.isPinned ? "Unpin Note" : "Pin to top"}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteKeep(note.id)}
                      className="p-1 rounded text-neutral-500 hover:text-red-400 hover:bg-neutral-800 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                      title="Delete Note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed font-sans line-clamp-4">
                  {note.content}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-[#232530] text-[10px] font-mono text-neutral-500">
                  <span>{note.updatedAt}</span>
                  {note.tags && note.tags.length > 0 && (
                    <span className="truncate max-w-[120px]">#{note.tags[0]}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. GOOGLE PHOTOS DECK (Geotagged Memories linked with Maps)               */}
      {/* ========================================================================= */}
      {activeSubTab === "photos" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-bold text-sm text-white">Geotagged Photos & Map Memories</h4>
              <p className="text-xs text-neutral-400">
                Visual timeline linking your physical Google Map hubs with moments captured on camera
              </p>
            </div>

            <div className="flex flex-wrap gap-1 text-[11px] font-mono">
              {["All", "Agribusiness", "Corporate", "Travel & Transit", "Personal"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setPhotoFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    photoFilter === cat
                      ? "bg-white text-black font-bold"
                      : "bg-[#101116] text-neutral-400 hover:text-white border border-[#262834]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Photo Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {photos
              .filter((p) => photoFilter === "All" || p.category === photoFilter)
              .map((photo) => (
                <div
                  key={photo.id}
                  className="rounded-2xl overflow-hidden bg-[#101116] border border-[#262834] group hover:border-neutral-500 transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-neutral-900">
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-white border border-white/10">
                      {photo.date}
                    </div>
                  </div>

                  <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-mono">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{photo.locationName}</span>
                      </div>
                      <h5 className="font-bold text-sm text-white leading-tight">{photo.title}</h5>
                      <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                        {photo.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#232530] flex items-center justify-between text-[11px] font-mono">
                      <span className="text-[10px] text-neutral-500">{photo.album}</span>
                      {photo.lat && photo.lng && (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${photo.lat},${photo.lng}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-white hover:text-neutral-300 font-bold flex items-center gap-1"
                        >
                          <span>Open on Map</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. CHROME BOOKMARKS DECK (Knowledge Vault)                                */}
      {/* ========================================================================= */}
      {activeSubTab === "bookmarks" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-bold text-sm text-white">Chrome Bookmarks & Executive Knowledge Vault</h4>
              <p className="text-xs text-neutral-400">
                Curated research, ERP frameworks, agribusiness manuals, and GMAT preparation resources
              </p>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <input
                type="file"
                ref={bmInputRef}
                accept=".html,.htm"
                onChange={handleBookmarksUpload}
                className="hidden"
              />
              <button
                onClick={() => bmInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 hover:text-white transition-all cursor-pointer"
                title="Import Bookmarks.html export from Chrome"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Import Bookmarks HTML</span>
              </button>

              <button
                onClick={() => setShowAddBmModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Bookmark</span>
              </button>
            </div>
          </div>

          {/* Search & Category Pills */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-500" />
              <input
                type="text"
                placeholder="Search bookmarks, URLs, research notes..."
                value={bookmarkSearch}
                onChange={(e) => setBookmarkSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#101116] border border-[#262834] text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white font-sans"
              />
            </div>

            <div className="flex flex-wrap gap-1 text-[11px] font-mono">
              {["All", "ERP & Tech", "Agri-Tech", "GMAT Prep", "Executive Strategy", "Daily Life"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setBookmarkCatFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    bookmarkCatFilter === cat
                      ? "bg-white text-black font-bold"
                      : "bg-[#101116] text-neutral-400 hover:text-white border border-[#262834]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Bookmarks List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredBookmarks.map((bm) => (
              <div
                key={bm.id}
                className="p-4 rounded-2xl bg-[#101116] border border-[#262834] hover:border-neutral-600 transition-all flex items-center justify-between gap-3 group"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 font-mono font-semibold">
                      {bm.category}
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono truncate">{bm.url}</span>
                  </div>
                  <h5 className="font-bold text-sm text-white truncate leading-tight group-hover:text-white">
                    {bm.title}
                  </h5>
                  {bm.notes && (
                    <p className="text-xs text-neutral-400 line-clamp-1">{bm.notes}</p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href={bm.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-neutral-900 hover:bg-white text-neutral-300 hover:text-black transition-all shadow-md"
                    title="Launch URL"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleDeleteBookmark(bm.id)}
                    className="p-2 rounded-xl text-neutral-600 hover:text-red-400 hover:bg-neutral-900 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                    title="Delete bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD NEW KEEP NOTE                                                  */}
      {/* ========================================================================= */}
      {showAddKeepModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-[#14151b] border border-[#282a38] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#262834] pb-3">
              <h4 className="font-bold text-sm text-white">Create New Thought / Memo</h4>
              <button
                onClick={() => setShowAddKeepModal(false)}
                className="text-xs text-neutral-400 hover:text-white px-2 py-1 rounded bg-neutral-900 cursor-pointer"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleAddKeepNote} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 font-mono uppercase">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. S/4HANA Staging Logic"
                  value={newKeepTitle}
                  onChange={(e) => setNewKeepTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#101116] border border-[#282a38] text-white focus:outline-none focus:border-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 font-mono uppercase">Category</label>
                <select
                  value={newKeepCategory}
                  onChange={(e) => setNewKeepCategory(e.target.value as KeepNote["category"])}
                  className="w-full px-3 py-2 rounded-xl bg-[#101116] border border-[#282a38] text-white focus:outline-none focus:border-white font-mono"
                >
                  <option value="Strategy">Strategy</option>
                  <option value="ERP & Work">ERP & Work</option>
                  <option value="Farm & Agri">Farm & Agri</option>
                  <option value="GMAT">GMAT</option>
                  <option value="Spiritual">Spiritual</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 font-mono uppercase">Content / Bullet Points</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Key thoughts, action items, or framework..."
                  value={newKeepContent}
                  onChange={(e) => setNewKeepContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#101116] border border-[#282a38] text-white focus:outline-none focus:border-white resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddKeepModal(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-900 text-neutral-400 hover:text-white font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-white text-black font-bold font-mono hover:bg-neutral-200 cursor-pointer"
                >
                  Save Memo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD NEW BOOKMARK                                                   */}
      {/* ========================================================================= */}
      {showAddBmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-[#14151b] border border-[#282a38] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#262834] pb-3">
              <h4 className="font-bold text-sm text-white">Add Executive Bookmark</h4>
              <button
                onClick={() => setShowAddBmModal(false)}
                className="text-xs text-neutral-400 hover:text-white px-2 py-1 rounded bg-neutral-900 cursor-pointer"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleAddBookmark} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 font-mono uppercase">Resource Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SAP S/4HANA Community"
                  value={newBmTitle}
                  onChange={(e) => setNewBmTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#101116] border border-[#282a38] text-white focus:outline-none focus:border-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 font-mono uppercase">URL / Link</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={newBmUrl}
                  onChange={(e) => setNewBmUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#101116] border border-[#282a38] text-white focus:outline-none focus:border-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 font-mono uppercase">Folder / Category</label>
                <select
                  value={newBmCategory}
                  onChange={(e) => setNewBmCategory(e.target.value as ChromeBookmarkItem["category"])}
                  className="w-full px-3 py-2 rounded-xl bg-[#101116] border border-[#282a38] text-white focus:outline-none focus:border-white font-mono"
                >
                  <option value="ERP & Tech">ERP & Tech</option>
                  <option value="Agri-Tech">Agri-Tech</option>
                  <option value="GMAT Prep">GMAT Prep</option>
                  <option value="Executive Strategy">Executive Strategy</option>
                  <option value="Daily Life">Daily Life</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddBmModal(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-900 text-neutral-400 hover:text-white font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-white text-black font-bold font-mono hover:bg-neutral-200 cursor-pointer"
                >
                  Add Bookmark
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
