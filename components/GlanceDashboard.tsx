"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  BookOpen,
  CheckCircle2,
  Circle,
  Flame,
  Bookmark,
  Share2,
  Sparkles,
  TrendingUp,
  Headphones,
  ShieldCheck,
  CloudSun,
  Droplets,
  Wind,
  Sprout,
  Briefcase,
  Play,
  RotateCcw,
  GitPullRequest,
  AlertCircle,
  Clock,
  ArrowUpRight,
  ChevronDown,
  Layers,
  Plus,
  Trash2,
  Settings,
  Link2,
  Check,
  FileText,
  Timer,
  Copy,
  CalendarCheck2,
  Radio,
  Upload,
  RefreshCw,
  Wallet,
  PieChart,
  MapPin,
  Navigation,
} from "lucide-react";
import { getDailyScripture, ScriptureDay } from "@/lib/dailyScripture";
import { DynamicHabit, DEFAULT_HABITS, loadDailyHabits, toggleDailyHabitStorage, getDateKey } from "@/lib/dailyHabits";
import {
  PlannedActivity,
  getPlannedActivitiesForDate,
  getGoogleCalendarAddUrl,
  parseICSContent,
} from "@/lib/calendarActivities";
import {
  GrowwHolding,
  DEFAULT_GROWW_HOLDINGS,
  calculatePortfolioSummary,
  parseGrowwHoldingsCSV,
  saveStoredGrowwHoldings,
} from "@/lib/growwPortfolio";

interface GlanceDashboardProps {
  onSelectTab: (tabId: "career" | "gmat" | "farm" | "books" | "bible" | "habits" | "projects" | "music") => void;
  currentTime?: string;
  currentDate?: string;
}

export default function GlanceDashboard({
  onSelectTab,
  currentTime,
  currentDate,
}: GlanceDashboardProps) {
  // Stable reference date for clean SSR prerender
  const defaultDate = useMemo(() => new Date(2026, 10, 16), []);
  const [calendarDate, setCalendarDate] = useState<Date>(defaultDate);
  const [todayDate, setTodayDate] = useState<Date>(defaultDate);

  // 2. Daily Scripture State (Dynamic everyday)
  const [scriptureOffset, setScriptureOffset] = useState(0);
  const [scriptureDay, setScriptureDay] = useState<ScriptureDay>(() => getDailyScripture(defaultDate, 0));
  const [scriptureCompleted, setScriptureCompleted] = useState(false);
  const [scriptureSaved, setScriptureSaved] = useState(false);
  const [showScriptureMore, setShowScriptureMore] = useState(false);

  // 3. Daily Habits State (Dynamic everyday)
  const [todayKey, setTodayKey] = useState<string>("2026-11-16");
  const [dailyHabits, setDailyHabits] = useState<DynamicHabit[]>(DEFAULT_HABITS);

  // 4. Day-to-Day Planned Activities & Google Calendar State
  const [selectedDay, setSelectedDay] = useState<number>(16);
  const [showGCalModal, setShowGCalModal] = useState<boolean>(false);
  const [gcalIcsUrl, setGcalIcsUrl] = useState<string>("");
  const [gcalLoading, setGcalLoading] = useState<boolean>(false);
  const [gcalStatus, setGcalStatus] = useState<string>("");
  const [gcalLastSynced, setGcalLastSynced] = useState<string | null>(null);
  const [calendarFilter, setCalendarFilter] = useState<"all" | "gcal" | "routine">("all");
  const [customActivities, setCustomActivities] = useState<PlannedActivity[]>([]);
  const [completedActivityIds, setCompletedActivityIds] = useState<Record<string, boolean>>({});
  const [showAddActivityForm, setShowAddActivityForm] = useState<boolean>(false);
  const [newActTitle, setNewActTitle] = useState<string>("");
  const [newActTime, setNewActTime] = useState<string>("09:30 AM");
  const [newActCategory, setNewActCategory] = useState<PlannedActivity["category"]>("Career");
  const [newActAlsoGCal, setNewActAlsoGCal] = useState<boolean>(true);

  // 5. Executive Scratchpad & Pomodoro HUD
  const [scratchpadNote, setScratchpadNote] = useState<string>(
    "• Review Schneider Electric ERP integration architecture\n• GMAT Quant: complete 20 Work-Rate problems\n• Farm: check soil moisture probe logs"
  );
  const [noteCopied, setNoteCopied] = useState<boolean>(false);
  const [pomodoroSeconds, setPomodoroSeconds] = useState<number>(25 * 60);
  const [pomodoroRunning, setPomodoroRunning] = useState<boolean>(false);

  // 6. Indian Market Trends & Groww Portfolio Tracker State
  const [growwViewMode, setGrowwViewMode] = useState<"markets" | "portfolio">("markets");
  const [marketFilter, setMarketFilter] = useState<"all" | "indices" | "stocks">("all");
  const [marketTickVersion, setMarketTickVersion] = useState<number>(0);
  const [marketLastUpdated, setMarketLastUpdated] = useState<string>("Just now");
  const [marketRefreshing, setMarketRefreshing] = useState<boolean>(false);
  const [isIndianMarketOpen, setIsIndianMarketOpen] = useState<boolean>(true);

  // Groww Holdings & Portfolio State
  const [growwHoldings, setGrowwHoldings] = useState<GrowwHolding[]>(DEFAULT_GROWW_HOLDINGS);
  const [showAddHoldingForm, setShowAddHoldingForm] = useState<boolean>(false);
  const [newHoldingSymbol, setNewHoldingSymbol] = useState<string>("");
  const [newHoldingName, setNewHoldingName] = useState<string>("");
  const [newHoldingShares, setNewHoldingShares] = useState<string>("10");
  const [newHoldingAvgPrice, setNewHoldingAvgPrice] = useState<string>("500");
  const [newHoldingCurrentPrice, setNewHoldingCurrentPrice] = useState<string>("520");
  const [portfolioImportStatus, setPortfolioImportStatus] = useState<string>("");

  // 7. Device GPS & Live Weather State
  const [weatherLocation, setWeatherLocation] = useState<"gps" | "blr" | "farm">("gps");
  const [gpsStatus, setGpsStatus] = useState<"locating" | "synced" | "denied" | "unsupported">("locating");
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [weatherLoading, setWeatherLoading] = useState<boolean>(false);
  const [liveWeather, setLiveWeather] = useState<{
    locationName: string;
    locality: string;
    temp: number;
    feelsLike: number;
    condition: string;
    humidity: number;
    windSpeed: string;
    isDay: boolean;
    hourly: Array<{ time: string; temp: number; isPeak: boolean }>;
    maxTemp: number;
    source: "gps" | "default";
  }>({
    locationName: "Bengaluru",
    locality: "Electronic City",
    temp: 24,
    feelsLike: 24,
    condition: "Partly Cloudy",
    humidity: 58,
    windSpeed: "11 km/h",
    isDay: true,
    hourly: [
      { time: "6am", temp: 21, isPeak: false },
      { time: "10am", temp: 24, isPeak: false },
      { time: "2pm", temp: 26, isPeak: true },
      { time: "6pm", temp: 25, isPeak: false },
      { time: "10pm", temp: 22, isPeak: false },
    ],
    maxTemp: 27,
    source: "default",
  });

  const fetchWeatherForCoords = async (lat: number, lon: number, isFromGps = false) => {
    setWeatherLoading(true);
    try {
      const res = await fetch(`/api/weather/live?lat=${lat}&lon=${lon}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setLiveWeather({
            locationName: data.locationName,
            locality: data.locality,
            temp: data.temp,
            feelsLike: data.feelsLike,
            condition: data.condition,
            humidity: data.humidity,
            windSpeed: data.windSpeed,
            isDay: data.isDay,
            hourly: data.hourly || [],
            maxTemp: data.maxTemp || 30,
            source: isFromGps ? "gps" : "default",
          });
        }
      }
    } catch (e) {
      console.warn("Weather fetch failed:", e);
    } finally {
      setWeatherLoading(false);
    }
  };

  const requestDeviceGPS = () => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setGpsStatus("unsupported");
      return;
    }
    setGpsStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setGpsCoords({ lat: latitude, lon: longitude });
        setGpsStatus("synced");
        setWeatherLocation("gps");
        fetchWeatherForCoords(latitude, longitude, true);
        try {
          localStorage.setItem(
            "lifehub_last_gps",
            JSON.stringify({ lat: latitude, lon: longitude })
          );
        } catch {}
      },
      (err) => {
        console.warn("Geolocation permission denied or timed out:", err.message);
        setGpsStatus("denied");
        fetchWeatherForCoords(12.9716, 77.5946, false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 }
    );
  };

  useEffect(() => {
    let t: any = null;
    if (pomodoroRunning && pomodoroSeconds > 0) {
      t = setInterval(() => setPomodoroSeconds((s) => s - 1), 1000);
    } else if (pomodoroSeconds === 0 && pomodoroRunning) {
      setPomodoroRunning(false);
    }
    return () => clearInterval(t);
  }, [pomodoroRunning, pomodoroSeconds]);

  // Sync Google Calendar ICS Feed via API
  const syncGCal = async (url: string) => {
    if (!url.trim()) return;
    setGcalLoading(true);
    setGcalStatus("Syncing Google Calendar events...");
    try {
      const res = await fetch("/api/calendar/ics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (data.success && data.events) {
        const mapped: PlannedActivity[] = data.events.map((evt: any) => ({
          id: evt.id,
          title: evt.title,
          time: evt.time || "All Day",
          date: evt.date,
          category: (evt.category || "Google-Calendar") as PlannedActivity["category"],
          source: "google-calendar" as const,
          notes: evt.notes || evt.description,
          location: evt.location,
        }));
        setCustomActivities((prev) => {
          const nonGcal = prev.filter((p) => p.source !== "google-calendar");
          const combined = [...nonGcal, ...mapped];
          try {
            localStorage.setItem("lifehub_custom_activities", JSON.stringify(combined));
            localStorage.setItem("lifehub_gcal_ics", url.trim());
            const nowTime = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
            localStorage.setItem("lifehub_gcal_synced_at", nowTime);
            setGcalLastSynced(nowTime);
          } catch {}
          return combined;
        });
        setGcalStatus(`✓ Synced ${data.count} events from Google Calendar!`);
      } else {
        setGcalStatus(`Error: ${data.error || "Unable to sync feed"}`);
      }
    } catch (e: any) {
      setGcalStatus(`Sync failed: ${e.message}`);
    } finally {
      setGcalLoading(false);
    }
  };

  // Upload and parse local .ics file directly in browser
  const handleIcsFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setGcalLoading(true);
    setGcalStatus(`Parsing ${file.name}...`);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = parseICSContent(text);
        if (parsed.length > 0) {
          setCustomActivities((prev) => {
            const nonGcal = prev.filter((p) => p.source !== "google-calendar");
            const combined = [...nonGcal, ...parsed];
            try {
              localStorage.setItem("lifehub_custom_activities", JSON.stringify(combined));
              const nowTime = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
              localStorage.setItem("lifehub_gcal_synced_at", `${nowTime} (file)`);
              setGcalLastSynced(`${nowTime} (file)`);
            } catch {}
            return combined;
          });
          setGcalStatus(`✓ Successfully imported ${parsed.length} events from ${file.name}!`);
        } else {
          setGcalStatus("No events found in this .ics file.");
        }
      } catch (err: any) {
        setGcalStatus(`Failed to read file: ${err.message}`);
      } finally {
        setGcalLoading(false);
      }
    };
    reader.onerror = () => {
      setGcalStatus("Failed to open file.");
      setGcalLoading(false);
    };
    reader.readAsText(file);
  };

  // Disconnect Google Calendar feed
  const handleDisconnectGCal = () => {
    setGcalIcsUrl("");
    setGcalLastSynced(null);
    setGcalStatus("");
    setCustomActivities((prev) => {
      const nonGcal = prev.filter((p) => p.source !== "google-calendar");
      try {
        localStorage.removeItem("lifehub_gcal_ics");
        localStorage.removeItem("lifehub_gcal_synced_at");
        localStorage.setItem("lifehub_custom_activities", JSON.stringify(nonGcal));
      } catch {}
      return nonGcal;
    });
  };

  // Check if Indian markets are currently open (09:15 AM - 03:30 PM IST, Mon-Fri)
  const checkIndianMarketHours = () => {
    try {
      const now = new Date();
      const istTimeStr = now.toLocaleTimeString("en-US", {
        timeZone: "Asia/Kolkata",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });
      const parts = istTimeStr.split(":");
      const h = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      const totalMinutes = h * 60 + m;

      const istDate = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
      const day = istDate.getDay(); // 0 is Sun, 6 is Sat
      if (day === 0 || day === 6) return false;

      return totalMinutes >= 555 && totalMinutes <= 930;
    } catch {
      return false;
    }
  };

  // Refresh Indian Market quotes (simulating live tick)
  const handleRefreshMarkets = () => {
    setMarketRefreshing(true);
    setTimeout(() => {
      setMarketTickVersion((v) => v + 1);
      const timeStr = new Date().toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
      });
      setMarketLastUpdated(`${timeStr} IST`);
      setIsIndianMarketOpen(checkIndianMarketHours());
      setMarketRefreshing(false);
    }, 400);
  };

  // Groww Portfolio Handlers & Summary
  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(val);
  };

  const portfolioSummary = useMemo(() => {
    return calculatePortfolioSummary(growwHoldings);
  }, [growwHoldings]);

  const handleAddHolding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHoldingSymbol.trim()) return;
    const sharesNum = parseFloat(newHoldingShares) || 1;
    const avgPriceNum = parseFloat(newHoldingAvgPrice) || 0;
    const currPriceNum = parseFloat(newHoldingCurrentPrice) || avgPriceNum;
    const sym = newHoldingSymbol.trim().toUpperCase();
    const nm = newHoldingName.trim() || sym;
    const slug = nm.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const newH: GrowwHolding = {
      id: `groww-h-${Date.now()}`,
      symbol: sym,
      name: nm,
      shares: sharesNum,
      avgPrice: avgPriceNum,
      currentPrice: currPriceNum,
      dayChangePct: currPriceNum >= avgPriceNum ? 1.25 : -0.85,
      growwUrl: `https://groww.in/stocks/${slug}`,
      category: "Large Cap",
    };

    const updated = [newH, ...growwHoldings];
    setGrowwHoldings(updated);
    saveStoredGrowwHoldings(updated);
    setNewHoldingSymbol("");
    setNewHoldingName("");
    setShowAddHoldingForm(false);
  };

  const handleDeleteHolding = (id: string) => {
    const updated = growwHoldings.filter((h) => h.id !== id);
    setGrowwHoldings(updated);
    saveStoredGrowwHoldings(updated);
  };

  const handleGrowwCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = parseGrowwHoldingsCSV(text);
        if (parsed.length > 0) {
          setGrowwHoldings(parsed);
          saveStoredGrowwHoldings(parsed);
          setPortfolioImportStatus(`✓ Imported ${parsed.length} holdings from ${file.name}!`);
          setTimeout(() => setPortfolioImportStatus(""), 4000);
        } else {
          setPortfolioImportStatus("Could not find valid holdings in CSV.");
          setTimeout(() => setPortfolioImportStatus(""), 4000);
        }
      } catch (err: any) {
        setPortfolioImportStatus(`Import failed: ${err.message}`);
        setTimeout(() => setPortfolioImportStatus(""), 4000);
      }
    };
    reader.readAsText(file);
  };

  // Indian Market Instruments on Groww
  const indianMarketData = useMemo(() => {
    return [
      {
        symbol: "NIFTY 50",
        name: "NSE Benchmark Index",
        type: "indices" as const,
        price: "₹24,148.20",
        change: "+101.40 (+0.42%)",
        isPositive: true,
        growwUrl: "https://groww.in/indices/nifty-50",
        sparkline: "M2 14 L12 12 L22 15 L32 9 L42 11 L52 5 L62 3",
        tag: "National Index",
      },
      {
        symbol: "SENSEX",
        name: "BSE Benchmark Index",
        type: "indices" as const,
        price: "₹79,485.60",
        change: "+302.20 (+0.38%)",
        isPositive: true,
        growwUrl: "https://groww.in/indices/bse-sensex",
        sparkline: "M2 13 L12 14 L22 10 L32 11 L42 7 L52 8 L62 4",
        tag: "Bombay 30",
      },
      {
        symbol: "BANK NIFTY",
        name: "NSE Banking Index",
        type: "indices" as const,
        price: "₹51,820.10",
        change: "+334.80 (+0.65%)",
        isPositive: true,
        growwUrl: "https://groww.in/indices/nifty-bank",
        sparkline: "M2 15 L12 11 L22 13 L32 8 L42 9 L52 4 L62 2",
        tag: "Banking",
      },
      {
        symbol: "SCHNEIDER",
        name: "Schneider Electric Infra Ltd",
        type: "stocks" as const,
        price: "₹842.50",
        change: "+₹19.35 (+2.35%)",
        isPositive: true,
        growwUrl: "https://groww.in/stocks/schneider-electric-infrastructure-ltd",
        sparkline: "M2 16 L12 14 L22 12 L32 10 L42 6 L52 5 L62 2",
        tag: "Jaison's Company",
        highlight: true,
      },
      {
        symbol: "TATAMOTORS",
        name: "Tata Motors Ltd",
        type: "stocks" as const,
        price: "₹784.90",
        change: "+₹8.90 (+1.15%)",
        isPositive: true,
        growwUrl: "https://groww.in/stocks/tata-motors-ltd",
        sparkline: "M2 14 L12 13 L22 11 L32 12 L42 8 L52 7 L62 4",
        tag: "Auto / EV",
      },
      {
        symbol: "RELIANCE",
        name: "Reliance Industries Ltd",
        type: "stocks" as const,
        price: "₹1,268.40",
        change: "-₹3.55 (-0.28%)",
        isPositive: false,
        growwUrl: "https://groww.in/stocks/reliance-industries-ltd",
        sparkline: "M2 5 L14 6 L26 8 L38 12 L50 13 L62 16",
        tag: "Energy & Retail",
      },
      {
        symbol: "HDFCBANK",
        name: "HDFC Bank Ltd",
        type: "stocks" as const,
        price: "₹1,742.00",
        change: "+₹14.15 (+0.82%)",
        isPositive: true,
        growwUrl: "https://groww.in/stocks/hdfc-bank-ltd",
        sparkline: "M2 12 L12 14 L22 10 L32 9 L42 7 L52 8 L62 5",
        tag: "Private Bank",
      },
      {
        symbol: "USD/INR",
        name: "Indian Rupee Forex Spot",
        type: "indices" as const,
        price: "₹84.42",
        change: "+0.04%",
        isPositive: null,
        growwUrl: "https://groww.in/us-stocks",
        sparkline: "M2 10 L14 11 L26 9 L38 10 L50 9 L62 10",
        tag: "Forex",
      },
    ];
  }, [marketTickVersion]);

  const filteredMarketData = useMemo(() => {
    if (marketFilter === "indices") {
      return indianMarketData.filter((m) => m.type === "indices");
    }
    if (marketFilter === "stocks") {
      return indianMarketData.filter((m) => m.type === "stocks");
    }
    return indianMarketData;
  }, [indianMarketData, marketFilter]);

  // On client mount, sync immediately with real client time, date, GCal & storage
  useEffect(() => {
    const liveNow = new Date();
    setCalendarDate(liveNow);
    setTodayDate(liveNow);
    setSelectedDay(liveNow.getDate());
    const liveKey = getDateKey(liveNow);
    setTodayKey(liveKey);
    setScriptureDay(getDailyScripture(liveNow, scriptureOffset));
    setDailyHabits(loadDailyHabits(liveKey));
    setIsIndianMarketOpen(checkIndianMarketHours());

    try {
      const savedIcs = localStorage.getItem("lifehub_gcal_ics");
      if (savedIcs) {
        setGcalIcsUrl(savedIcs);
        syncGCal(savedIcs);
      }
      const savedSyncTime = localStorage.getItem("lifehub_gcal_synced_at");
      if (savedSyncTime) {
        setGcalLastSynced(savedSyncTime);
      }
      const savedCustom = localStorage.getItem("lifehub_custom_activities");
      if (savedCustom) {
        try {
          const parsed = JSON.parse(savedCustom);
          if (Array.isArray(parsed)) setCustomActivities(parsed);
        } catch {}
      }

      const savedChecks = localStorage.getItem(`lifehub_act_checks_${liveKey}`);
      if (savedChecks) {
        try {
          const parsed = JSON.parse(savedChecks);
          if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
            setCompletedActivityIds(parsed);
          }
        } catch {}
      }

      const savedPad = localStorage.getItem("lifehub_scratchpad");
      if (savedPad && typeof savedPad === "string") setScratchpadNote(savedPad);

      const savedHoldings = localStorage.getItem("lifehub_groww_portfolio");
      if (savedHoldings) {
        try {
          const parsed = JSON.parse(savedHoldings);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setGrowwHoldings(parsed);
          }
        } catch {}
      }

      // Auto-sync device GPS location on mount
      if (typeof window !== "undefined" && "geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            setGpsCoords({ lat: latitude, lon: longitude });
            setGpsStatus("synced");
            setWeatherLocation("gps");
            fetchWeatherForCoords(latitude, longitude, true);
            try {
              localStorage.setItem(
                "lifehub_last_gps",
                JSON.stringify({ lat: latitude, lon: longitude })
              );
            } catch {}
          },
          (err) => {
            setGpsStatus("denied");
            const cachedGps = localStorage.getItem("lifehub_last_gps");
            if (cachedGps) {
              try {
                const parsed = JSON.parse(cachedGps);
                if (parsed.lat && parsed.lon) {
                  fetchWeatherForCoords(parsed.lat, parsed.lon, true);
                  setGpsStatus("synced");
                  setWeatherLocation("gps");
                  return;
                }
              } catch {}
            }
            fetchWeatherForCoords(12.9716, 77.5946, false);
          },
          { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 }
        );
      } else {
        setGpsStatus("unsupported");
        fetchWeatherForCoords(12.9716, 77.5946, false);
      }
    } catch {}
  }, [scriptureOffset]);

  const handleToggleActivity = (id: string) => {
    const nextVal = !completedActivityIds?.[id];
    const updated = { ...(completedActivityIds || {}), [id]: nextVal };
    setCompletedActivityIds(updated);
    try {
      localStorage.setItem(`lifehub_act_checks_${todayKey}`, JSON.stringify(updated));
    } catch {}
  };

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActTitle.trim()) return;
    const newAct: PlannedActivity = {
      id: `act-${Date.now()}`,
      title: newActTitle.trim(),
      time: newActTime,
      category: newActCategory,
      date: selectedDateKey,
      completed: false,
      source: "local",
    };
    const currentList = Array.isArray(customActivities) ? customActivities : [];
    const updated = [newAct, ...currentList];
    setCustomActivities(updated);
    try {
      localStorage.setItem("lifehub_custom_activities", JSON.stringify(updated));
    } catch {}

    // If also selected to add to Google Calendar, launch 1-click GCal event creation
    if (newActAlsoGCal) {
      try {
        const gcalUrl = getGoogleCalendarAddUrl(newAct, selectedDateObj);
        window.open(gcalUrl, "_blank", "noopener,noreferrer");
      } catch {}
    }

    setNewActTitle("");
    setShowAddActivityForm(false);
  };

  const handleSaveScratchpad = (text: string) => {
    setScratchpadNote(text);
    try {
      localStorage.setItem("lifehub_scratchpad", text);
    } catch {}
  };

  const handleToggleHabit = (id: string) => {
    const updated = toggleDailyHabitStorage(id, todayKey);
    setDailyHabits(updated);
  };

  const safeHabits = Array.isArray(dailyHabits) ? dailyHabits : DEFAULT_HABITS;
  const completedHabitsCount = safeHabits.filter((h) => h?.completedToday).length;
  const habitPct = safeHabits.length > 0 ? Math.round((completedHabitsCount / safeHabits.length) * 100) : 0;

  // 4. Center Column Sub-Tabs
  const [centerSubTab, setCenterSubTab] = useState<"career" | "gmat" | "tech" | "farm">("career");
  const [showMoreJobs, setShowMoreJobs] = useState(false);

  // 5. Community Feed Sub-Tabs
  const [communityTab, setCommunityTab] = useState<"erp" | "agri" | "gmat">("erp");

  // 7. Repository Toggle (Glance screenshot parity)
  const [repoTab, setRepoTab] = useState<"glance" | "lifehub">("glance");

  // Calendar calculations
  const { monthName, year, weekNumber, calendarDays, currentDayOfMonth } = useMemo(() => {
    const currYear = calendarDate.getFullYear();
    const currMonth = calendarDate.getMonth();

    const mName = calendarDate.toLocaleString("en-US", { month: "long" });

    // Calculate Week Number (ISO)
    const firstJan = new Date(currYear, 0, 1);
    const daysSinceFirstJan = Math.floor((calendarDate.getTime() - firstJan.getTime()) / 86400000);
    const weekNum = Math.ceil((daysSinceFirstJan + firstJan.getDay() + 1) / 7);

    // Days Grid: Monday = 0, Sunday = 6
    const firstDayOfMonth = new Date(currYear, currMonth, 1);
    const lastDayOfMonth = new Date(currYear, currMonth + 1, 0);

    // Convert JS Sunday(0)-Saturday(6) to Monday(0)-Sunday(6)
    let startDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const daysInMonth = lastDayOfMonth.getDate();
    const daysInPrevMonth = new Date(currYear, currMonth, 0).getDate();

    const days: Array<{ day: number; isCurrentMonth: boolean; isToday: boolean }> = [];

    // Previous month trailing days
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        isToday: false,
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday =
        todayDate.getFullYear() === currYear &&
        todayDate.getMonth() === currMonth &&
        todayDate.getDate() === d;
      days.push({
        day: d,
        isCurrentMonth: true,
        isToday,
      });
    }

    // Trailing next month days to fill 35 or 42 slots
    const totalSlots = days.length <= 35 ? 35 : 42;
    const remaining = totalSlots - days.length;
    for (let n = 1; n <= remaining; n++) {
      days.push({
        day: n,
        isCurrentMonth: false,
        isToday: false,
      });
    }

    return {
      monthName: mName,
      year: currYear,
      weekNumber: weekNum,
      calendarDays: days,
      currentDayOfMonth: todayDate.getDate(),
    };
  }, [calendarDate, todayDate]);

  // GMAT countdown calculation (target: Dec 20, 2026)
  const gmatDaysRemaining = useMemo(() => {
    const target = new Date(todayDate.getFullYear(), 11, 20); // Dec 20
    const diff = target.getTime() - todayDate.getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [todayDate]);

  // Today's Farm Ops Task (Rotates by day of week)
  const farmDayTask = useMemo(() => {
    const tasks = [
      { day: "Sunday", task: "Grove Walk & Canopy Health Audit", metric: "Soil: Rest" },
      { day: "Monday", task: "Drip Line 1 Fertigation (Bio-Enzyme)", metric: "45m Cycle" },
      { day: "Tuesday", task: "Moisture Probe & Sensor Log Review", metric: "Sensor 42%" },
      { day: "Wednesday", task: "High-Density Guava Pruning & Weed Patrol", metric: "Zone A" },
      { day: "Thursday", task: "Borewell Solar Inverter & Pump Servicing", metric: "Solar 4.2kW" },
      { day: "Friday", task: "Organic Pest Trap Inspection & Neem Spray", metric: "Eco Care" },
      { day: "Saturday", task: "Agribusiness Cash Flow & Procurement Audit", metric: "Capex Plan" },
    ];
    const dayOfWeek = todayDate.getDay();
    return tasks[dayOfWeek];
  }, [todayDate]);

  // Selected date derivations for day-to-day planned activities
  const selectedDateObj = useMemo(() => {
    return new Date(calendarDate.getFullYear(), calendarDate.getMonth(), selectedDay);
  }, [calendarDate, selectedDay]);

  const selectedDateKey = useMemo(() => {
    return getDateKey(selectedDateObj);
  }, [selectedDateObj]);

  const isSelectedDateToday = useMemo(() => {
    return selectedDateKey === getDateKey(todayDate);
  }, [selectedDateKey, todayDate]);

  const rawPlannedActivities = useMemo(() => {
    return getPlannedActivitiesForDate(selectedDateObj, customActivities);
  }, [selectedDateObj, customActivities]);

  const gcalCountForDate = useMemo(() => {
    return rawPlannedActivities.filter(
      (a) => a.source === "google-calendar" || a.category === "Google-Calendar"
    ).length;
  }, [rawPlannedActivities]);

  const routineCountForDate = useMemo(() => {
    return rawPlannedActivities.filter(
      (a) => a.source !== "google-calendar" && a.category !== "Google-Calendar"
    ).length;
  }, [rawPlannedActivities]);

  const plannedActivities = useMemo(() => {
    if (calendarFilter === "gcal") {
      return rawPlannedActivities.filter(
        (a) => a.source === "google-calendar" || a.category === "Google-Calendar"
      );
    }
    if (calendarFilter === "routine") {
      return rawPlannedActivities.filter(
        (a) => a.source !== "google-calendar" && a.category !== "Google-Calendar"
      );
    }
    return rawPlannedActivities;
  }, [rawPlannedActivities, calendarFilter]);

  return (
    <div className="w-full text-neutral-200 space-y-6 animate-in fade-in duration-500 font-sans">
      {/* GLANCE 3-COLUMN MASTER DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* ========================================================= */}
        {/* COLUMN 1: LEFT (Calendar, Daily Scripture, Daily Habits) */}
        {/* ========================================================= */}
        <div className="lg:col-span-3 space-y-5">
          {/* 1.1 CALENDAR & PLANNED ACTIVITIES WIDGET CARD */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#14151b] border border-[#232530] shadow-lg space-y-3.5">
            <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-neutral-300 uppercase font-bold">
              <span className="flex items-center gap-1.5 text-white">
                <CalendarIcon className="w-3.5 h-3.5 text-amber-400" />
                CALENDAR
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))
                  }
                  className="p-1 hover:text-white transition-colors"
                  title="Previous Month"
                >
                  <ChevronLeft className="w-3.5 h-3.5 text-neutral-400 hover:text-white" />
                </button>
                <button
                  onClick={() => setCalendarDate(new Date())}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-200 hover:text-white transition-colors font-mono font-semibold"
                  title="Today"
                >
                  Today
                </button>
                <button
                  onClick={() =>
                    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))
                  }
                  className="p-1 hover:text-white transition-colors"
                  title="Next Month"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-400 hover:text-white" />
                </button>
              </div>
            </div>

            {/* Calendar Month & Week Number Header */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white text-sm">{monthName}</span>
              <span className="font-mono text-neutral-400 text-[11px]">
                Week {weekNumber} · {year}
              </span>
            </div>

            {/* Calendar Days Header: Mo Tu We Th Fr Sa Su */}
            <div className="grid grid-cols-7 gap-1 text-center font-mono text-[11px] text-neutral-400 font-semibold pt-1 pb-1">
              <span>Mo</span>
              <span>Tu</span>
              <span>We</span>
              <span>Th</span>
              <span>Fr</span>
              <span>Sa</span>
              <span>Su</span>
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center font-mono text-xs">
              {calendarDays.map((item, idx) => {
                const isSelected = item.isCurrentMonth && item.day === selectedDay;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (item.isCurrentMonth) {
                        setSelectedDay(item.day);
                      }
                    }}
                    className={`h-7 flex items-center justify-center rounded-md transition-all select-none ${
                      isSelected
                        ? "border-2 border-amber-400 text-amber-200 font-bold bg-amber-400/25 shadow-md ring-1 ring-amber-400/50 scale-105 cursor-pointer z-10"
                        : item.isToday
                        ? "border border-amber-400/90 text-amber-300 font-bold bg-amber-400/15 shadow-sm cursor-pointer"
                        : item.isCurrentMonth
                        ? "text-neutral-200 hover:bg-[#20222d] hover:text-white cursor-pointer"
                        : "text-neutral-600"
                    }`}
                  >
                    {item.day}
                  </div>
                );
              })}
            </div>

            {/* 1.1B PLANNED DAY-TO-DAY ACTIVITIES & GOOGLE CALENDAR LINK */}
            <div className="pt-3 border-t border-[#232530] space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-neutral-300 uppercase font-bold">
                <span className="flex items-center gap-1.5 text-white">
                  <CalendarCheck2 className="w-3.5 h-3.5 text-amber-400" />
                  PLANNED ACTIVITIES
                </span>
                <div className="flex items-center gap-1.5 text-[10px] font-mono">
                  {gcalLastSynced ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => syncGCal(gcalIcsUrl)}
                        disabled={gcalLoading}
                        className="p-1 hover:text-white text-neutral-400 transition-colors"
                        title="Re-sync Google Calendar"
                      >
                        <RefreshCw className={`w-3 h-3 text-emerald-400 ${gcalLoading ? "animate-spin" : ""}`} />
                      </button>
                      <button
                        onClick={() => setShowGCalModal(true)}
                        className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 transition-colors font-semibold"
                        title={`Synced at ${gcalLastSynced}. Click for settings.`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>GCal Synced</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowGCalModal(true)}
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/30 transition-colors font-semibold"
                      title="Link Google Calendar feed"
                    >
                      <Link2 className="w-3 h-3 text-blue-400" />
                      <span>Link GCal</span>
                    </button>
                  )}
                  <a
                    href="https://calendar.google.com/calendar/u/0/r"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-0.5 text-neutral-400 hover:text-white transition-colors"
                    title="Open Google Calendar web"
                  >
                    <span>GCal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Activity Category / Source Filter Pills */}
              <div className="flex items-center gap-1 text-[10px] font-mono">
                <button
                  onClick={() => setCalendarFilter("all")}
                  className={`px-2 py-0.5 rounded transition-colors font-medium ${
                    calendarFilter === "all"
                      ? "bg-amber-400/20 text-amber-300 border border-amber-400/30 font-bold"
                      : "text-neutral-400 hover:text-white bg-neutral-900/60"
                  }`}
                >
                  All ({rawPlannedActivities.length})
                </button>
                <button
                  onClick={() => setCalendarFilter("gcal")}
                  className={`px-2 py-0.5 rounded transition-colors flex items-center gap-1 font-medium ${
                    calendarFilter === "gcal"
                      ? "bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold"
                      : "text-neutral-400 hover:text-white bg-neutral-900/60"
                  }`}
                >
                  <span>Google Cal</span>
                  <span className="text-[9px] opacity-80">({gcalCountForDate})</span>
                </button>
                <button
                  onClick={() => setCalendarFilter("routine")}
                  className={`px-2 py-0.5 rounded transition-colors font-medium ${
                    calendarFilter === "routine"
                      ? "bg-neutral-700 text-white border border-neutral-600 font-bold"
                      : "text-neutral-400 hover:text-white bg-neutral-900/60"
                  }`}
                >
                  Routines ({routineCountForDate})
                </button>
              </div>

              {/* Unlinked Google Calendar Prompt Banner */}
              {!gcalLastSynced && (
                <div className="p-2.5 rounded-lg bg-sky-950/30 border border-sky-800/40 flex items-center justify-between text-xs font-mono">
                  <div className="text-sky-200 text-[11px] leading-tight">
                    <span className="font-bold text-sky-100">Connect Google Calendar:</span> Sync meetings & ERP agenda live.
                  </div>
                  <button
                    onClick={() => setShowGCalModal(true)}
                    className="px-2 py-0.5 rounded bg-sky-500 text-neutral-950 font-bold hover:bg-sky-400 shrink-0 text-[10px] ml-2 transition-colors"
                  >
                    Connect
                  </button>
                </div>
              )}

              {/* Selected Date Header + Quick Add Button */}
              <div className="flex items-center justify-between text-xs font-mono bg-[#1a1b23] p-2.5 rounded-lg border border-[#282a37]">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-white">
                    {selectedDateObj.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                  </span>
                  {isSelectedDateToday && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30">
                      TODAY
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowAddActivityForm(!showAddActivityForm)}
                  className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white transition-colors flex items-center gap-0.5 font-semibold"
                >
                  <Plus className="w-3 h-3 text-amber-400" />
                  <span>Add</span>
                </button>
              </div>

              {/* Inline Add Activity Form */}
              {showAddActivityForm && (
                <form
                  onSubmit={handleAddActivity}
                  className="p-2.5 rounded-lg bg-[#1a1b23] border border-neutral-700 space-y-2.5 animate-in fade-in duration-200"
                >
                  <input
                    type="text"
                    placeholder="e.g. Schneider ERP Sprint Review"
                    value={newActTitle}
                    onChange={(e) => setNewActTitle(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded bg-[#101116] border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 font-sans"
                    autoFocus
                  />
                  <div className="flex items-center gap-2 text-xs">
                    <input
                      type="text"
                      placeholder="09:30 AM"
                      value={newActTime}
                      onChange={(e) => setNewActTime(e.target.value)}
                      className="w-24 text-xs font-mono px-2 py-1 rounded bg-[#101116] border border-neutral-800 text-white"
                    />
                    <select
                      value={newActCategory}
                      onChange={(e) => setNewActCategory(e.target.value as any)}
                      className="text-xs px-2 py-1 rounded bg-[#101116] border border-neutral-800 text-neutral-200 flex-1 font-mono"
                    >
                      <option value="Career">Career</option>
                      <option value="GMAT">GMAT</option>
                      <option value="Spiritual">Spiritual</option>
                      <option value="Agri-Tech">Agri-Tech</option>
                      <option value="Health">Health</option>
                      <option value="Personal">Personal</option>
                    </select>
                  </div>
                  <label className="flex items-center gap-2 text-[11px] font-mono text-neutral-300 cursor-pointer pt-0.5 select-none">
                    <input
                      type="checkbox"
                      checked={newActAlsoGCal}
                      onChange={(e) => setNewActAlsoGCal(e.target.checked)}
                      className="rounded accent-amber-500"
                    />
                    <span>Open & save in Google Calendar</span>
                  </label>
                  <div className="flex items-center justify-end gap-2 pt-1 font-mono text-[11px]">
                    <button
                      type="button"
                      onClick={() => setShowAddActivityForm(false)}
                      className="px-2 py-0.5 text-neutral-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-2.5 py-1 rounded bg-amber-500 text-neutral-950 font-bold hover:bg-amber-400 transition-colors"
                    >
                      Save Activity
                    </button>
                  </div>
                </form>
              )}

              {/* Planned Activities Items List */}
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 no-scrollbar">
                {plannedActivities.length === 0 ? (
                  <div className="p-3 text-center text-xs font-mono text-neutral-400 bg-[#181920]/60 rounded-lg border border-dashed border-[#282a37]">
                    {calendarFilter === "gcal"
                      ? "No Google Calendar events for this date."
                      : calendarFilter === "routine"
                      ? "No routines for this date."
                      : "No activities scheduled for this date."}
                  </div>
                ) : (
                  plannedActivities.map((act) => {
                    const isDone = Boolean(completedActivityIds && typeof completedActivityIds === "object" && completedActivityIds[act.id]);
                    const isGCal = act.source === "google-calendar" || act.category === "Google-Calendar";
                    const gcalAddLink = getGoogleCalendarAddUrl(act, selectedDateObj);

                    return (
                      <div
                        key={act.id}
                        className={`p-2.5 rounded-lg border transition-all flex items-start justify-between gap-2 group ${
                          isDone
                            ? "bg-[#111216]/60 border-[#202129] opacity-60"
                            : isGCal
                            ? "bg-[#151824] hover:bg-[#1b2030] border-sky-900/40 hover:border-sky-600/60"
                            : "bg-[#181920] hover:bg-[#20222a] border-[#262834] hover:border-neutral-600"
                        }`}
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          <button
                            onClick={() => handleToggleActivity(act.id)}
                            className={`w-3.5 h-3.5 mt-0.5 rounded flex items-center justify-center transition-colors shrink-0 ${
                              isDone
                                ? "bg-amber-500 text-neutral-950 font-bold"
                                : "border border-neutral-500 group-hover:border-neutral-300"
                            }`}
                          >
                            {isDone && <span className="text-[9px] leading-none">✓</span>}
                          </button>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-mono text-amber-400 font-bold shrink-0">
                                {act.time}
                              </span>
                              {isGCal ? (
                                <span className="text-[9px] font-mono px-1 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 shrink-0 font-semibold flex items-center gap-0.5">
                                  <CalendarIcon className="w-2.5 h-2.5 text-sky-400" />
                                  GCal
                                </span>
                              ) : (
                                <span className="text-[9px] font-mono px-1 rounded bg-white/[0.08] text-neutral-300 border border-white/[0.08] shrink-0">
                                  {act.category}
                                </span>
                              )}
                            </div>
                            <p
                              className={`text-xs mt-0.5 leading-snug line-clamp-2 transition-colors font-medium ${
                                isDone ? "text-neutral-500 line-through" : "text-neutral-100 group-hover:text-white"
                              }`}
                            >
                              {act.title}
                            </p>
                            {act.location && (
                              <div className="text-[10px] font-mono text-neutral-400 truncate mt-0.5">
                                📍 {act.location}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Quick 1-Click Action to Google Calendar */}
                        <a
                          href={gcalAddLink}
                          target="_blank"
                          rel="noreferrer"
                          className="shrink-0 p-1 text-neutral-400 hover:text-amber-400 transition-colors opacity-0 group-hover:opacity-100"
                          title={isGCal ? "Open event in Google Calendar" : "Add this activity directly to Google Calendar"}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* 1.2 DAILY SCRIPTURE & DEVOTIONAL (Dynamic everyday) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#14151b] border border-[#232530] shadow-lg space-y-3.5">
            <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-neutral-300 uppercase font-bold">
              <span className="flex items-center gap-1.5 text-white">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                DAILY SCRIPTURE
              </span>
              <div className="flex items-center gap-1 text-neutral-400 font-mono text-[10px]">
                <button
                  onClick={() => setScriptureOffset((prev) => prev - 1)}
                  className="hover:text-white p-0.5"
                  title="Previous Day"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="text-neutral-300 font-semibold">Day {scriptureDay.dayOfYear}</span>
                <button
                  onClick={() => setScriptureOffset((prev) => prev + 1)}
                  className="hover:text-white p-0.5"
                  title="Next Day"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Scripture Item Card */}
            <div className="space-y-2.5">
              <div>
                <button
                  onClick={() => onSelectTab("bible")}
                  className="text-amber-400 hover:text-amber-300 font-bold text-sm text-left flex items-center gap-1 group transition-colors"
                >
                  <span>{scriptureDay.reference}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-amber-300 transition-colors" />
                </button>
                <p className="text-xs text-neutral-100 leading-relaxed mt-1 font-serif italic">
                  "{scriptureDay.text}"
                </p>
              </div>

              {/* Reading Plan & Theme */}
              <div className="text-[11px] font-mono text-neutral-300 flex items-center justify-between">
                <span>{scriptureDay.readingPlan}</span>
                <span className="text-amber-400 font-semibold">{scriptureDay.translation}</span>
              </div>

              {/* Devotional Reflection */}
              <div className="p-2.5 rounded-lg bg-[#1a1b23] border border-[#282a37] text-xs text-neutral-200 leading-relaxed font-sans">
                <span className="text-amber-400 font-mono text-[10px] uppercase tracking-wider block mb-1 font-bold">
                  Daily Focus • {scriptureDay.theme}
                </span>
                {scriptureDay.reflection}
              </div>

              {/* Collapsible More / Prayer */}
              {showScriptureMore && (
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-xs text-amber-100 leading-relaxed font-sans animate-in fade-in duration-300">
                  <span className="text-amber-300 font-mono text-[10px] uppercase tracking-wider block mb-1 font-bold">
                    Morning Prayer
                  </span>
                  {scriptureDay.prayer}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between text-xs font-mono text-neutral-400 pt-1">
                <button
                  onClick={() => setScriptureCompleted(!scriptureCompleted)}
                  className={`flex items-center gap-1.5 transition-colors ${
                    scriptureCompleted ? "text-emerald-400 font-bold" : "hover:text-white"
                  }`}
                >
                  <CheckCircle2 className={`w-3.5 h-3.5 ${scriptureCompleted ? "text-emerald-400" : "text-neutral-500"}`} />
                  <span>{scriptureCompleted ? "Reading Completed" : "Mark Read"}</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setScriptureSaved(!scriptureSaved)}
                    className={`hover:text-white transition-colors ${scriptureSaved ? "text-amber-400" : ""}`}
                    title="Bookmark Verse"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setShowScriptureMore(!showScriptureMore)}
                    className="text-[10px] text-neutral-300 hover:text-white transition-colors uppercase tracking-wider flex items-center gap-0.5 font-semibold"
                  >
                    <span>{showScriptureMore ? "Less" : "Prayer"}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${showScriptureMore ? "rotate-180" : ""}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 1.3 DAILY HABIT TRACKER (Dynamic everyday, resets daily) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#14151b] border border-[#232530] shadow-lg space-y-3.5">
            <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-neutral-300 uppercase font-bold">
              <span className="flex items-center gap-1.5 text-white">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                DAILY HABITS
              </span>
              <span className="text-amber-400 font-mono text-xs font-bold">
                {completedHabitsCount}/{dailyHabits.length} ({habitPct}%)
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-[#1a1b23] rounded-full overflow-hidden border border-[#282a37]">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-500"
                style={{ width: `${habitPct}%` }}
              />
            </div>

            {/* Habits List */}
            <div className="space-y-2 pt-1">
              {dailyHabits.map((habit) => (
                <div
                  key={habit.id}
                  onClick={() => handleToggleHabit(habit.id)}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#181920] hover:bg-[#20222a] border border-[#262834] hover:border-neutral-600 cursor-pointer transition-all group select-none"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <button
                      className={`w-4 h-4 rounded flex items-center justify-center transition-colors shrink-0 ${
                        habit.completedToday
                          ? "bg-amber-500 text-neutral-950 font-bold"
                          : "border border-neutral-500 group-hover:border-neutral-300"
                      }`}
                    >
                      {habit.completedToday && <span className="text-[10px] leading-none">✓</span>}
                    </button>
                    <span
                      className={`text-xs truncate transition-colors font-medium ${
                        habit.completedToday
                          ? "text-neutral-500 line-through"
                          : "text-neutral-100 group-hover:text-white"
                      }`}
                    >
                      {habit.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 font-mono text-[11px] shrink-0 ml-2">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-amber-400 font-bold">{habit.streak}d</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onSelectTab("habits")}
              className="text-[10px] font-mono text-neutral-300 hover:text-white transition-colors uppercase tracking-wider pt-1 flex items-center gap-1 font-semibold"
            >
              <span>Deep Habit Architecture</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          {/* 1.4 TWITCH CHANNELS & EXECUTIVE STREAMS (Glance Signature Widget) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#14151b] border border-[#232530] shadow-lg space-y-3.5">
            <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-[#8b91a0] uppercase font-bold">
              <span className="flex items-center gap-1.5 text-white">
                <Radio className="w-3.5 h-3.5 text-amber-400" />
                TWITCH CHANNELS
              </span>
              <span className="text-[10px] text-emerald-400 font-mono font-semibold">2 LIVE</span>
            </div>

            <div className="space-y-2.5">
              {/* Channel 1 */}
              <a
                href="https://twitch.tv/zackrawrr"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2 rounded-lg bg-[#181920] border border-[#262834] hover:border-neutral-600 transition-colors group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative w-7 h-7 rounded-full bg-neutral-800 border border-neutral-700 overflow-hidden shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80"
                      alt="zackrawrr"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-neutral-900" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white group-hover:text-[#e5c07b] truncate flex items-center gap-1.5 transition-colors">
                      <span>zackrawrr</span>
                      <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                        LIVE
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-[#8b91a0] truncate">
                      Just Chatting · 2h · 64k viewers
                    </div>
                  </div>
                </div>
              </a>

              {/* Channel 2 */}
              <a
                href="https://twitch.tv/ThePrimeagen"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2 rounded-lg bg-[#181920] border border-[#262834] hover:border-neutral-600 transition-colors group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative w-7 h-7 rounded-full bg-neutral-800 border border-neutral-700 overflow-hidden shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&q=80"
                      alt="ThePrimeagen"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-neutral-900" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white group-hover:text-[#e5c07b] truncate flex items-center gap-1.5 transition-colors">
                      <span>ThePrimeagen</span>
                      <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                        LIVE
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-[#8b91a0] truncate">
                      Software & Architecture · 26m · 1.6k viewers
                    </div>
                  </div>
                </div>
              </a>

              {/* Channel 3 */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#181920] border border-[#262834] hover:border-neutral-600 transition-colors opacity-75">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-neutral-800 border border-neutral-700 overflow-hidden shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80"
                      alt="KevinPowellCSS"
                      className="w-full h-full object-cover grayscale"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-neutral-300 truncate">
                      KevinPowellCSS
                    </div>
                    <div className="text-[10px] font-mono text-neutral-500 truncate">
                      Offline
                    </div>
                  </div>
                </div>
              </div>

              {/* Channel 4 */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#181920] border border-[#262834] hover:border-neutral-600 transition-colors opacity-75">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-neutral-800 border border-neutral-700 overflow-hidden shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80"
                      alt="j_blow"
                      className="w-full h-full object-cover grayscale"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-neutral-300 truncate">
                      j_blow
                    </div>
                    <div className="text-[10px] font-mono text-neutral-500 truncate">
                      Offline
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* COLUMN 2: CENTER (Bookmarks Dock, Sub-Tabs, Feeds, Videos) */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 space-y-5">
          {/* 2.0 GLANCE QUICK LAUNCH BOOKMARKS STRIP */}
          <div className="p-3 sm:p-3.5 rounded-2xl bg-[#14151b] border border-[#232530] shadow-lg flex items-center gap-2 overflow-x-auto no-scrollbar text-xs font-mono">
            {[
              { label: "Google Calendar", url: "https://calendar.google.com", icon: "📅" },
              { label: "Schneider Portal", url: "https://www.se.com", icon: "⚡" },
              { label: "MBA.com GMAT", url: "https://www.mba.com", icon: "🎯" },
              { label: "YouVersion Bible", url: "https://www.bible.com", icon: "✝" },
              { label: "GitHub Repo", url: "https://github.com/JaisonSam/life-hub", icon: "💻" },
              { label: "YouTube Music", url: "https://music.youtube.com", icon: "🎵" },
              { label: "Veerakeralapudur Farm", url: "#farm", icon: "🌾", onClick: () => onSelectTab("farm") },
            ].map((bm, bi) => (
              <a
                key={bi}
                href={bm.url}
                target={bm.url.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                onClick={bm.onClick}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a1b24] hover:bg-[#222430] text-neutral-200 hover:text-white border border-[#282a38] transition-colors shrink-0 font-medium"
              >
                <span>{bm.icon}</span>
                <span>{bm.label}</span>
              </a>
            ))}
          </div>

          {/* 2.1 SUB-TABS (Glance style: HACKER NEWS | LOBSTERS / CAREER | GMAT | TECH | FARM) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#14151b] border border-[#232530] shadow-lg space-y-4">
            <div className="flex items-center gap-5 border-b border-[#232530] pb-2 text-xs font-mono tracking-wider uppercase font-bold">
              <button
                onClick={() => setCenterSubTab("career")}
                className={`transition-colors flex items-center gap-1.5 relative ${
                  centerSubTab === "career"
                    ? "text-amber-400 after:absolute after:-bottom-[9px] after:left-0 after:right-0 after:h-[2px] after:bg-amber-400"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <span>CAREER RADAR</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 font-normal">BLR</span>
              </button>

              <button
                onClick={() => setCenterSubTab("gmat")}
                className={`transition-colors flex items-center gap-1.5 relative ${
                  centerSubTab === "gmat"
                    ? "text-amber-400 after:absolute after:-bottom-[9px] after:left-0 after:right-0 after:h-[2px] after:bg-amber-400"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <span>GMAT INTEL</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-300 font-normal">705+</span>
              </button>

              <button
                onClick={() => setCenterSubTab("tech")}
                className={`transition-colors relative ${
                  centerSubTab === "tech"
                    ? "text-amber-400 after:absolute after:-bottom-[9px] after:left-0 after:right-0 after:h-[2px] after:bg-amber-400"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <span>TECH INTEL</span>
              </button>

              <button
                onClick={() => setCenterSubTab("farm")}
                className={`transition-colors relative ${
                  centerSubTab === "farm"
                    ? "text-amber-400 after:absolute after:-bottom-[9px] after:left-0 after:right-0 after:h-[2px] after:bg-amber-400"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <span>FARM OPS</span>
              </button>
            </div>

            {/* 2.2 HIGH-DENSITY FEED CONTENT */}
            {centerSubTab === "career" && (
              <div className="space-y-4">
                {/* Job Item 1 */}
                <div className="space-y-1">
                  <a
                    href="https://www.se.com/in/en/about-us/careers/job-details/senior-business-analyst/008XYZ/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-400 hover:text-amber-300 font-semibold text-xs sm:text-sm leading-snug flex items-center gap-1 group transition-colors"
                  >
                    <span>Senior ERP Business Analyst • Global Energy Automation</span>
                    <span className="text-neutral-400 text-xs group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
                  </a>
                  <div className="text-xs font-mono text-neutral-300 flex items-center gap-2 flex-wrap">
                    <span className="text-neutral-400">6h</span>
                    <span>·</span>
                    <span className="text-white font-medium">Schneider Electric Bengaluru</span>
                    <span>·</span>
                    <span className="text-emerald-400 font-semibold">Hybrid · ₹24-32 LPA</span>
                    <span>·</span>
                    <span className="text-neutral-400">Recruiter: SE Talent Acquisition ↗</span>
                  </div>
                </div>

                {/* Job Item 2 */}
                <div className="space-y-1">
                  <a
                    href="https://jobs.siemens.com/careers?query=ERP+Functional+Consultant+Bangalore"
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-400 hover:text-amber-300 font-semibold text-xs sm:text-sm leading-snug flex items-center gap-1 group transition-colors"
                  >
                    <span>Principal Functional Consultant • SAP S/4HANA & Digital Core</span>
                    <span className="text-neutral-400 text-xs group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
                  </a>
                  <div className="text-xs font-mono text-neutral-300 flex items-center gap-2 flex-wrap">
                    <span className="text-neutral-400">1d</span>
                    <span>·</span>
                    <span className="text-white font-medium">Siemens Technology India</span>
                    <span>·</span>
                    <span className="text-emerald-400 font-semibold">Electronic City, Bangalore · ₹26-35 LPA</span>
                    <span>·</span>
                    <span className="text-neutral-400">jobs.siemens.com ↗</span>
                  </div>
                </div>

                {/* Job Item 3 */}
                <div className="space-y-1">
                  <a
                    href="https://apply.deloitte.com/careers/SearchJobs/ERP%20Transformation%20Bangalore"
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-400 hover:text-amber-300 font-semibold text-xs sm:text-sm leading-snug flex items-center gap-1 group transition-colors"
                  >
                    <span>ERP Transformation Solutions Architect • Cloud ERP Modernization</span>
                    <span className="text-neutral-400 text-xs group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
                  </a>
                  <div className="text-xs font-mono text-neutral-300 flex items-center gap-2 flex-wrap">
                    <span className="text-neutral-400">2d</span>
                    <span>·</span>
                    <span className="text-white font-medium">Deloitte Consulting India</span>
                    <span>·</span>
                    <span className="text-emerald-400 font-semibold">RMZ EcoWorld, BLR · ₹28-38 LPA</span>
                    <span>·</span>
                    <span className="text-neutral-400">apply.deloitte.com ↗</span>
                  </div>
                </div>

                {/* Job Item 4 */}
                <div className="space-y-1">
                  <a
                    href="https://careers.abb/global/en/search-results?keywords=ERP%20Supply%20Chain%20Bangalore"
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-400 hover:text-amber-300 font-semibold text-xs sm:text-sm leading-snug flex items-center gap-1 group transition-colors"
                  >
                    <span>Supply Chain & ERP Systems Lead • Industrial Discrete Mfg</span>
                    <span className="text-neutral-400 text-xs group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
                  </a>
                  <div className="text-xs font-mono text-neutral-300 flex items-center gap-2 flex-wrap">
                    <span className="text-neutral-400">3d</span>
                    <span>·</span>
                    <span className="text-white font-medium">ABB India Nelamangala Campus</span>
                    <span>·</span>
                    <span className="text-emerald-400 font-semibold">₹22-30 LPA</span>
                    <span>·</span>
                    <span className="text-neutral-400">Workday Portal ↗</span>
                  </div>
                </div>

                {/* Show More Expandable Items */}
                {showMoreJobs && (
                  <>
                    <div className="space-y-1 animate-in fade-in duration-300">
                      <a
                        href="https://careers.honeywell.com/us/en/search-results?keywords=ERP%20Business%20Analyst%20Bangalore"
                        target="_blank"
                        rel="noreferrer"
                        className="text-amber-400 hover:text-amber-300 font-semibold text-xs sm:text-sm leading-snug flex items-center gap-1 group transition-colors"
                      >
                        <span>Enterprise Applications Lead BA • Connected Enterprise</span>
                        <span className="text-neutral-400 text-xs">↗</span>
                      </a>
                      <div className="text-xs font-mono text-neutral-300 flex items-center gap-2 flex-wrap">
                        <span className="text-neutral-400">4d</span>
                        <span>·</span>
                        <span className="text-white font-medium">Honeywell Bangalore</span>
                        <span>·</span>
                        <span className="text-emerald-400 font-semibold">₹23-31 LPA</span>
                        <span>·</span>
                        <span className="text-neutral-400">honeywell.com ↗</span>
                      </div>
                    </div>

                    <div className="space-y-1 animate-in fade-in duration-300">
                      <a
                        href="https://careers.microsoft.com/us/en/search-results?keywords=ERP%20Supply%20Chain%20Bangalore"
                        target="_blank"
                        rel="noreferrer"
                        className="text-amber-400 hover:text-amber-300 font-semibold text-xs sm:text-sm leading-snug flex items-center gap-1 group transition-colors"
                      >
                        <span>Dynamics 365 Finance & Operations Functional Architect</span>
                        <span className="text-neutral-400 text-xs">↗</span>
                      </a>
                      <div className="text-xs font-mono text-neutral-300 flex items-center gap-2 flex-wrap">
                        <span className="text-neutral-400">5d</span>
                        <span>·</span>
                        <span className="text-white font-medium">Microsoft India R&D</span>
                        <span>·</span>
                        <span className="text-emerald-400 font-semibold">₹32-45 LPA</span>
                        <span>·</span>
                        <span className="text-neutral-400">careers.microsoft.com ↗</span>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => setShowMoreJobs(!showMoreJobs)}
                    className="text-xs font-mono text-neutral-300 hover:text-white transition-colors uppercase tracking-wider flex items-center gap-1 font-semibold"
                  >
                    <span>{showMoreJobs ? "SHOW LESS ⌃" : "SHOW MORE ⌄"}</span>
                  </button>

                  <button
                    onClick={() => onSelectTab("career")}
                    className="text-xs font-mono text-amber-400 hover:text-amber-300 transition-colors uppercase tracking-wider flex items-center gap-1 font-bold"
                  >
                    <span>Full Career Brand Hub</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {centerSubTab === "gmat" && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-[#1a1b23] border border-[#282a37] space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-amber-400 font-bold uppercase tracking-wider">
                      Target: 705+ Focus Edition (99th %ile)
                    </span>
                    <span className="text-neutral-300 font-semibold">{gmatDaysRemaining} Days to Exam</span>
                  </div>
                  <div className="text-xs text-neutral-200 leading-relaxed font-sans">
                    Focus: <strong className="text-white">Data Insights (Multi-Source & Tables)</strong> & Quant Algebra traps. Pacing rule: max 2m15s per question; blind-guess at 2m30s to protect section completion.
                  </div>
                  <div className="flex items-center gap-4 text-[11px] font-mono text-neutral-300 pt-1 border-t border-[#232530]">
                    <span>Diagnostic: <strong className="text-white">615</strong></span>
                    <span>Practice 2: <strong className="text-amber-300">645</strong> (+30)</span>
                    <span>Target: <strong className="text-emerald-400">705+</strong></span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-amber-400 font-semibold text-xs sm:text-sm">
                    Concept of the Day: Work-Rate Harmonized Inverses
                  </div>
                  <div className="text-xs font-mono text-neutral-300 flex items-center gap-2">
                    <span className="text-neutral-400">Daily Formula</span>
                    <span>·</span>
                    <span className="text-white font-medium">1/A + 1/B = 1/Total</span>
                    <span>·</span>
                    <span className="text-neutral-400">Never average the speeds directly ↗</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-amber-400 font-semibold text-xs sm:text-sm">
                    Critical Reasoning: Assumption vs Strengthener Scope
                  </div>
                  <div className="text-xs font-mono text-neutral-300 flex items-center gap-2">
                    <span className="text-neutral-400">Negation Test</span>
                    <span>·</span>
                    <span className="text-white font-medium">If negated assumption kills conclusion, it's correct</span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectTab("gmat")}
                  className="text-xs font-mono text-amber-400 hover:text-amber-300 transition-colors uppercase tracking-wider flex items-center gap-1 pt-1 font-bold"
                >
                  <span>Launch GMAT Focus Command Center</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {centerSubTab === "tech" && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <a
                    href="https://news.ycombinator.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-400 hover:text-amber-300 font-semibold text-xs sm:text-sm leading-snug flex items-center gap-1 group"
                  >
                    <span>Self-Hosted Executive Dashboards: Building Glance with Next.js 16</span>
                    <span className="text-neutral-400 text-xs">↗</span>
                  </a>
                  <div className="text-xs font-mono text-neutral-300 flex items-center gap-2">
                    <span>2h · 184 points · 42 comments · github.com/glanceapp/glance ↗</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <a
                    href="https://news.ycombinator.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-400 hover:text-amber-300 font-semibold text-xs sm:text-sm leading-snug flex items-center gap-1 group"
                  >
                    <span>SAP S/4HANA Clean Core Extensibility with Cloud Event Mesh</span>
                    <span className="text-neutral-400 text-xs">↗</span>
                  </a>
                  <div className="text-xs font-mono text-neutral-300 flex items-center gap-2">
                    <span>5h · 92 points · 28 comments · sap.com/community ↗</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <a
                    href="https://news.ycombinator.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-400 hover:text-amber-300 font-semibold text-xs sm:text-sm leading-snug flex items-center gap-1 group"
                  >
                    <span>Distributed Postgres and Agentic Reasoning Workflows in 2026</span>
                    <span className="text-neutral-400 text-xs">↗</span>
                  </a>
                  <div className="text-xs font-mono text-neutral-300 flex items-center gap-2">
                    <span>8h · 310 points · 112 comments</span>
                  </div>
                </div>
              </div>
            )}

            {centerSubTab === "farm" && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-[#1a1b23] border border-[#282a37] space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-amber-400 font-bold uppercase tracking-wider">
                      Veerakeralapudur Farm Model (0.25 Acre)
                    </span>
                    <span className="text-emerald-400 font-bold">Soil Moisture: 42%</span>
                  </div>
                  <div className="text-xs text-neutral-200 leading-relaxed font-sans">
                    Today's Agro-Ops: <strong className="text-white">{farmDayTask.task}</strong> ({farmDayTask.metric}). Drip lines automated via solar pump tie-in.
                  </div>
                  <div className="flex items-center gap-4 text-[11px] font-mono text-neutral-300 pt-1 border-t border-[#232530]">
                    <span>High-Density Guava: <strong className="text-white">140 Trees</strong></span>
                    <span>Border: <strong className="text-white">18 Coconuts</strong></span>
                    <span>Target ROI: <strong className="text-emerald-400">₹1.85L/yr</strong></span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectTab("farm")}
                  className="text-xs font-mono text-amber-400 hover:text-amber-300 transition-colors uppercase tracking-wider flex items-center gap-1 pt-1 font-bold"
                >
                  <span>Open Full Veerakeralapudur Agribusiness Simulator</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* 2.2 VIDEOS & SANCTUARY SHELF (Horizontal Media Strip) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#14151b] border border-[#232530] shadow-lg space-y-3.5">
            <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-neutral-300 uppercase font-bold">
              <span className="flex items-center gap-1.5 text-white">
                <Headphones className="w-3.5 h-3.5 text-amber-400" />
                VIDEOS & SANCTUARY
              </span>
              <button
                onClick={() => onSelectTab("music")}
                className="text-[10px] text-amber-400 hover:text-amber-300 uppercase tracking-wider flex items-center gap-0.5 font-semibold"
              >
                <span>All Rooms</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* Horizontal Video Cards Row (5 Cards Glance Architecture) */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {/* Media Card 1 */}
              <div
                onClick={() => onSelectTab("music")}
                className="group cursor-pointer space-y-1.5"
              >
                <div className="relative aspect-video rounded-lg overflow-hidden bg-neutral-900 border border-[#262834] group-hover:border-neutral-500 transition-colors">
                  <img
                    src="https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=400&q=80"
                    alt="Acoustic Worship"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-neutral-200">
                    Live
                  </span>
                </div>
                <div className="text-xs font-medium text-white group-hover:text-[#e5c07b] transition-colors line-clamp-1">
                  Acoustic Worship Sanctuary
                </div>
                <div className="text-[10px] font-mono text-[#8b91a0]">
                  Elevation & Maverick
                </div>
              </div>

              {/* Media Card 2 */}
              <div
                onClick={() => onSelectTab("music")}
                className="group cursor-pointer space-y-1.5"
              >
                <div className="relative aspect-video rounded-lg overflow-hidden bg-neutral-900 border border-[#262834] group-hover:border-neutral-500 transition-colors">
                  <img
                    src="https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=400&q=80"
                    alt="432Hz Study Flow"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-neutral-200">
                    432Hz
                  </span>
                </div>
                <div className="text-xs font-medium text-white group-hover:text-[#e5c07b] transition-colors line-clamp-1">
                  Deep Flow & GMAT Focus
                </div>
                <div className="text-[10px] font-mono text-[#8b91a0]">
                  Alpha Brainwaves
                </div>
              </div>

              {/* Media Card 3 */}
              <div
                onClick={() => onSelectTab("gmat")}
                className="group cursor-pointer space-y-1.5"
              >
                <div className="relative aspect-video rounded-lg overflow-hidden bg-neutral-900 border border-[#262834] group-hover:border-neutral-500 transition-colors">
                  <img
                    src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80"
                    alt="GMAT Strategy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-neutral-200">
                    705+
                  </span>
                </div>
                <div className="text-xs font-medium text-white group-hover:text-[#e5c07b] transition-colors line-clamp-1">
                  GMAT Quant & DI Traps
                </div>
                <div className="text-[10px] font-mono text-[#8b91a0]">
                  MBA.com Official OG
                </div>
              </div>

              {/* Media Card 4 */}
              <div
                onClick={() => onSelectTab("career")}
                className="group cursor-pointer space-y-1.5"
              >
                <div className="relative aspect-video rounded-lg overflow-hidden bg-neutral-900 border border-[#262834] group-hover:border-neutral-500 transition-colors">
                  <img
                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80"
                    alt="ERP Architecture"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-neutral-200">
                    Cloud
                  </span>
                </div>
                <div className="text-xs font-medium text-white group-hover:text-[#e5c07b] transition-colors line-clamp-1">
                  ERP Cloud Architectures
                </div>
                <div className="text-[10px] font-mono text-[#8b91a0]">
                  Schneider Blueprint
                </div>
              </div>

              {/* Media Card 5 (Glance 5th Card) */}
              <div
                onClick={() => onSelectTab("farm")}
                className="group cursor-pointer space-y-1.5"
              >
                <div className="relative aspect-video rounded-lg overflow-hidden bg-neutral-900 border border-[#262834] group-hover:border-neutral-500 transition-colors">
                  <img
                    src="https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&w=400&q=80"
                    alt="Farm Agribusiness"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-neutral-200">
                    IoT
                  </span>
                </div>
                <div className="text-xs font-medium text-white group-hover:text-[#e5c07b] transition-colors line-clamp-1">
                  Veerakeralapudur Smart Agri
                </div>
                <div className="text-[10px] font-mono text-[#8b91a0]">
                  Solar Drip & Telemetry
                </div>
              </div>
            </div>
          </div>

          {/* 2.3 COMMUNITY & REDDIT FEEDS (Glance style /r/technology /r/science) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#14151b] border border-[#232530] shadow-lg space-y-4">
            <div className="flex items-center gap-4 text-xs font-mono tracking-wider uppercase font-bold text-neutral-300">
              <button
                onClick={() => setCommunityTab("erp")}
                className={`transition-colors ${communityTab === "erp" ? "text-amber-400 font-bold" : "text-neutral-400 hover:text-white"}`}
              >
                /R/ERP_CONSULTING
              </button>
              <button
                onClick={() => setCommunityTab("agri")}
                className={`transition-colors ${communityTab === "agri" ? "text-amber-400 font-bold" : "text-neutral-400 hover:text-white"}`}
              >
                /R/AGRITECH_INDIA
              </button>
              <button
                onClick={() => setCommunityTab("gmat")}
                className={`transition-colors ${communityTab === "gmat" ? "text-amber-400 font-bold" : "text-neutral-400 hover:text-white"}`}
              >
                /R/GMAT_FOCUS
              </button>
            </div>

            {communityTab === "erp" && (
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-700 flex items-center justify-center shrink-0 text-amber-400 font-bold font-mono text-xs">
                    SE
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="text-xs sm:text-sm font-semibold text-white hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-2 flex-wrap">
                      <span>Bridging Functional BA Specifications to Agentic Cloud Automation</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-300 font-mono">Systems</span>
                    </div>
                    <div className="text-[11px] font-mono text-neutral-300 flex items-center gap-2">
                      <span className="text-neutral-400">3h</span>
                      <span>·</span>
                      <span className="text-white font-medium">1,842 points</span>
                      <span>·</span>
                      <span className="text-neutral-400">148 comments</span>
                      <span>·</span>
                      <span className="text-amber-400/80">schneider-electric.com ↗</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-700 flex items-center justify-center shrink-0 text-amber-400 font-bold font-mono text-xs">
                    BLR
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="text-xs sm:text-sm font-semibold text-white hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-2 flex-wrap">
                      <span>Bangalore Tech Corridor 2026: Shift toward AI-Native Business Analysts</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-300 font-mono">Market</span>
                    </div>
                    <div className="text-[11px] font-mono text-neutral-300 flex items-center gap-2">
                      <span className="text-neutral-400">12h</span>
                      <span>·</span>
                      <span className="text-white font-medium">965 points</span>
                      <span>·</span>
                      <span className="text-neutral-400">82 comments</span>
                      <span>·</span>
                      <span className="text-amber-400/80">economictimes.indiatimes.com ↗</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {communityTab === "agri" && (
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center shrink-0 text-emerald-400 font-bold font-mono text-xs">
                    TNL
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="text-xs sm:text-sm font-semibold text-white hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-2 flex-wrap">
                      <span>Tirunelveli Red Sandy Loam: Precision Drip & Micro-Fertigation Economics</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950/60 text-emerald-300 font-mono">Agronomy</span>
                    </div>
                    <div className="text-[11px] font-mono text-neutral-300 flex items-center gap-2">
                      <span className="text-neutral-400">1d</span>
                      <span>·</span>
                      <span className="text-white font-medium">420 points</span>
                      <span>·</span>
                      <span className="text-neutral-400">54 comments</span>
                      <span>·</span>
                      <span className="text-amber-400/80">tnau.ac.in ↗</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {communityTab === "gmat" && (
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-950/80 border border-indigo-700/60 flex items-center justify-center shrink-0 text-indigo-400 font-bold font-mono text-xs">
                    705
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="text-xs sm:text-sm font-semibold text-white hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-2 flex-wrap">
                      <span>Debrief: Moving from 645 to 715 on Focus Edition in 4 Weeks</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-950/60 text-indigo-300 font-mono">Debrief</span>
                    </div>
                    <div className="text-[11px] font-mono text-neutral-300 flex items-center gap-2">
                      <span className="text-neutral-400">2d</span>
                      <span>·</span>
                      <span className="text-white font-medium">1,204 points</span>
                      <span>·</span>
                      <span className="text-neutral-400">198 comments</span>
                      <span>·</span>
                      <span className="text-amber-400/80">gmatclub.com ↗</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* COLUMN 3: RIGHT (Weather, Repository, Markets, Farm IoT)  */}
        {/* ========================================================= */}
        <div className="lg:col-span-3 space-y-5">
          {/* 3.1 WEATHER WIDGET CARD (Synced to Device GPS) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#14151b] border border-[#232530] shadow-lg space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-neutral-300 uppercase font-bold">
              <div className="flex items-center gap-1.5 text-white">
                <CloudSun className="w-3.5 h-3.5 text-amber-400" />
                <span>WEATHER</span>
                {weatherLocation === "gps" && gpsStatus === "synced" && (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <Navigation className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                    <span>GPS SYNC</span>
                  </span>
                )}
                {weatherLoading && (
                  <RefreshCw className="w-2.5 h-2.5 text-neutral-400 animate-spin ml-1" />
                )}
              </div>
              <div className="flex items-center gap-1 text-[10px] font-mono font-semibold">
                <button
                  onClick={requestDeviceGPS}
                  className={`px-1.5 py-0.5 rounded transition-colors flex items-center gap-0.5 ${
                    weatherLocation === "gps"
                      ? "bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30"
                      : "text-neutral-400 hover:text-white"
                  }`}
                  title="Sync live weather to your device GPS location"
                >
                  <MapPin className="w-2.5 h-2.5" />
                  <span>GPS</span>
                </button>
                <button
                  onClick={() => {
                    setWeatherLocation("blr");
                    fetchWeatherForCoords(12.9716, 77.5946, false);
                  }}
                  className={`px-1.5 py-0.5 rounded transition-colors ${
                    weatherLocation === "blr"
                      ? "bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  BLR
                </button>
                <button
                  onClick={() => setWeatherLocation("farm")}
                  className={`px-1.5 py-0.5 rounded transition-colors ${
                    weatherLocation === "farm"
                      ? "bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Farm
                </button>
              </div>
            </div>

            {/* Weather Main Display */}
            {weatherLocation === "farm" ? (
              <div className="space-y-2.5 animate-in fade-in duration-200">
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-sm font-bold text-white">Veerakeralapudur Farm</div>
                    <div className="text-xs text-neutral-300 font-medium">Sunny & Breezy · Feels like 31°C</div>
                  </div>
                  <div className="text-2xl font-bold font-mono text-amber-300">30°C</div>
                </div>

                {/* Glance Temperature Bar Chart */}
                <div className="pt-2">
                  <div className="flex items-end justify-between h-14 gap-1 px-1">
                    <div className="flex flex-col items-center gap-1 flex-1">
                      <div className="w-full bg-[#1e202a] rounded-t h-6" />
                      <span className="text-[10px] font-mono text-neutral-400 font-semibold">6am</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 flex-1">
                      <div className="w-full bg-[#1e202a] rounded-t h-10" />
                      <span className="text-[10px] font-mono text-neutral-400 font-semibold">10am</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 flex-1">
                      <div className="w-full bg-amber-500 rounded-t h-13 relative shadow-md">
                        <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-mono text-amber-300 font-bold">
                          32°
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-amber-300 font-bold">2pm</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 flex-1">
                      <div className="w-full bg-[#1e202a] rounded-t h-8" />
                      <span className="text-[10px] font-mono text-neutral-400 font-semibold">6pm</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 flex-1">
                      <div className="w-full bg-[#1e202a] rounded-t h-5" />
                      <span className="text-[10px] font-mono text-neutral-400 font-semibold">10pm</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-300 pt-1 border-t border-[#232530]">
                  <span>Soil Moisture: <strong className="text-emerald-400 font-bold">42%</strong></span>
                  <span>Solar Pump: <strong className="text-white font-bold">Active</strong></span>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5 animate-in fade-in duration-200">
                <div className="flex items-baseline justify-between">
                  <div className="min-w-0 pr-2">
                    <div className="text-sm font-bold text-white truncate flex items-center gap-1.5">
                      <span>{weatherLocation === "blr" ? "Bengaluru (Electronic City)" : `${liveWeather.locationName} (${liveWeather.locality})`}</span>
                    </div>
                    <div className="text-xs text-neutral-300 font-medium">
                      {liveWeather.condition} · Feels like {liveWeather.feelsLike}°C
                    </div>
                  </div>
                  <div className="text-2xl font-bold font-mono text-white shrink-0">
                    {liveWeather.temp}°C
                  </div>
                </div>

                {/* Glance Dynamic Temperature Bar Chart */}
                <div className="pt-2">
                  <div className="flex items-end justify-between h-14 gap-1 px-1">
                    {liveWeather.hourly.map((slot, idx) => {
                      const maxT = liveWeather.maxTemp || 32;
                      const heightPx = Math.max(18, Math.min(50, Math.round((slot.temp / maxT) * 48)));

                      return (
                        <div key={idx} className="flex flex-col items-center gap-1 flex-1">
                          {slot.isPeak ? (
                            <div
                              className="w-full bg-amber-400 rounded-t relative shadow-md transition-all"
                              style={{ height: `${heightPx}px` }}
                            >
                              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-mono text-amber-300 font-bold">
                                {slot.temp}°
                              </span>
                            </div>
                          ) : (
                            <div
                              className="w-full bg-[#1e202a] hover:bg-[#282a38] rounded-t transition-all"
                              style={{ height: `${heightPx}px` }}
                              title={`${slot.temp}°C at ${slot.time}`}
                            />
                          )}
                          <span
                            className={`text-[10px] font-mono ${
                              slot.isPeak ? "text-amber-300 font-bold" : "text-neutral-400 font-semibold"
                            }`}
                          >
                            {slot.time}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Humidity, Wind & GPS status footer */}
                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-300 pt-1 border-t border-[#232530]">
                  <span>
                    Humidity: <strong className="text-white">{liveWeather.humidity}%</strong>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span>
                      Wind: <strong className="text-white">{liveWeather.windSpeed}</strong>
                    </span>
                    {weatherLocation === "gps" && (
                      <button
                        onClick={requestDeviceGPS}
                        className="p-0.5 text-neutral-400 hover:text-emerald-400 transition-colors"
                        title="Re-ping GPS"
                      >
                        <RefreshCw className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3.2 REPOSITORY WIDGET CARD */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#14151b] border border-[#232530] shadow-lg space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-[#8b91a0] uppercase font-bold">
              <span className="flex items-center gap-1.5 text-white">
                <GitPullRequest className="w-3.5 h-3.5 text-amber-400" />
                REPOSITORY
              </span>
              <div className="flex items-center gap-1 text-[10px] font-mono">
                <button
                  onClick={() => setRepoTab("glance")}
                  className={`px-1.5 py-0.5 rounded transition-colors ${
                    repoTab === "glance"
                      ? "bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  glance
                </button>
                <button
                  onClick={() => setRepoTab("lifehub")}
                  className={`px-1.5 py-0.5 rounded transition-colors ${
                    repoTab === "lifehub"
                      ? "bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  life-hub
                </button>
              </div>
            </div>

            {repoTab === "glance" ? (
              <div className="space-y-2.5">
                <div>
                  <a
                    href="https://github.com/glanceapp/glance"
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-white hover:text-[#e5c07b] transition-colors text-xs sm:text-sm flex items-center gap-1"
                  >
                    <span>glanceapp/glance</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
                  </a>
                  <div className="text-xs font-mono text-[#8b91a0] mt-0.5">
                    7,281 stars · 251 forks
                  </div>
                </div>

                {/* Open PRs */}
                <div className="text-xs space-y-1.5 pt-1 border-t border-[#232530]">
                  <div className="font-mono text-[#8b91a0] text-[11px] font-semibold">
                    Open pull requests (9 total)
                  </div>
                  <div className="font-mono text-[11px] text-[#d6daf0] flex items-center justify-between">
                    <span className="truncate">25d !bangs at the end</span>
                  </div>
                  <div className="font-mono text-[11px] text-[#d6daf0] flex items-center justify-between">
                    <span className="truncate">1mo Bookmark status indicator</span>
                  </div>
                  <div className="font-mono text-[11px] text-[#d6daf0] flex items-center justify-between">
                    <span className="truncate">1mo CSS dynamic columns refactor an...</span>
                  </div>
                </div>

                {/* Open Issues */}
                <div className="text-xs space-y-1.5 pt-1 border-t border-[#232530]">
                  <div className="font-mono text-[#8b91a0] text-[11px] font-semibold">
                    Open issues (54 total)
                  </div>
                  <div className="font-mono text-[11px] text-[#d6daf0] flex items-center justify-between">
                    <span className="truncate">7d [Bug(?)] Version tag not showin...</span>
                  </div>
                  <div className="font-mono text-[11px] text-[#d6daf0] flex items-center justify-between">
                    <span className="truncate">7d [Request] Mark as read</span>
                  </div>
                  <div className="font-mono text-[11px] text-[#d6daf0] flex items-center justify-between">
                    <span className="truncate">13d [Feature Request] Ability to ch...</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                <div>
                  <a
                    href="https://github.com/JaisonSam/life-hub"
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-white hover:text-[#e5c07b] transition-colors text-xs sm:text-sm flex items-center gap-1"
                  >
                    <span>JaisonSam/life-hub</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
                  </a>
                  <div className="text-xs font-mono text-[#8b91a0] mt-0.5">
                    24 stars · 6 forks
                  </div>
                </div>

                {/* Open PRs */}
                <div className="text-xs space-y-1.5 pt-1 border-t border-[#232530]">
                  <div className="font-mono text-[#8b91a0] text-[11px] font-semibold">
                    Open pull requests (2 total)
                  </div>
                  <div className="font-mono text-[11px] text-[#d6daf0] flex items-center justify-between">
                    <span className="truncate">2d feat: Glance dashboard revamp</span>
                    <span className="text-amber-400 font-bold shrink-0 ml-1">#12</span>
                  </div>
                  <div className="font-mono text-[11px] text-[#d6daf0] flex items-center justify-between">
                    <span className="truncate">8d perf: 3D coverflow smooth glide</span>
                    <span className="text-amber-400 font-bold shrink-0 ml-1">#11</span>
                  </div>
                </div>

                {/* Open Issues */}
                <div className="text-xs space-y-1.5 pt-1 border-t border-[#232530]">
                  <div className="font-mono text-[#8b91a0] text-[11px] font-semibold">
                    Open issues (3 total)
                  </div>
                  <div className="font-mono text-[11px] text-[#d6daf0] flex items-center justify-between">
                    <span className="truncate">2d [Feature] Daily dynamic scripture</span>
                    <span className="text-neutral-400 shrink-0 ml-1">#9</span>
                  </div>
                  <div className="font-mono text-[11px] text-[#d6daf0] flex items-center justify-between">
                    <span className="truncate">5d [Telemetry] Farm sensor live sync</span>
                    <span className="text-neutral-400 shrink-0 ml-1">#8</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3.3 INDIAN MARKETS & GROWW PORTFOLIO WIDGET CARD */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#14151b] border border-[#232530] shadow-lg space-y-3.5">
            {/* Header: Title + Groww Badge + Market Status */}
            <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-[#8b91a0] uppercase font-bold">
              <div className="flex items-center gap-1.5 text-white">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>INDIAN MARKETS</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[#00d09c]/15 text-[#00d09c] border border-[#00d09c]/30">
                  GROWW
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {isIndianMarketOpen ? (
                  <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-mono text-neutral-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-500" />
                    CLOSED
                  </span>
                )}
                <button
                  onClick={handleRefreshMarkets}
                  disabled={marketRefreshing}
                  className="p-0.5 hover:text-white text-neutral-400 transition-colors"
                  title="Refresh market quotes"
                >
                  <RefreshCw className={`w-3 h-3 text-neutral-400 hover:text-emerald-400 transition-colors ${marketRefreshing ? "animate-spin text-emerald-400" : ""}`} />
                </button>
              </div>
            </div>

            {/* Primary Toggle: Live Markets vs My Groww Portfolio */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-[#101116] rounded-xl border border-[#232530] text-xs font-mono">
              <button
                onClick={() => setGrowwViewMode("markets")}
                className={`py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 font-semibold ${
                  growwViewMode === "markets"
                    ? "bg-[#181920] text-white shadow-sm border border-[#282a37]"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <TrendingUp className="w-3 h-3 text-amber-400" />
                <span>Live Watchlist</span>
              </button>
              <button
                onClick={() => setGrowwViewMode("portfolio")}
                className={`py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 font-semibold ${
                  growwViewMode === "portfolio"
                    ? "bg-[#181920] text-[#00d09c] shadow-sm border border-[#00d09c]/30 font-bold"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <Wallet className="w-3 h-3 text-[#00d09c]" />
                <span>My Groww ({growwHoldings.length})</span>
              </button>
            </div>

            {/* ========================================================= */}
            {/* VIEW A: LIVE MARKETS WATCHLIST                            */}
            {/* ========================================================= */}
            {growwViewMode === "markets" && (
              <div className="space-y-3 animate-in fade-in duration-200">
                {/* Filter Sub-Tabs */}
                <div className="flex items-center justify-between text-[10px] font-mono border-b border-[#232530] pb-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setMarketFilter("all")}
                      className={`px-2 py-0.5 rounded transition-colors font-medium ${
                        marketFilter === "all"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold"
                          : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      All ({indianMarketData.length})
                    </button>
                    <button
                      onClick={() => setMarketFilter("indices")}
                      className={`px-2 py-0.5 rounded transition-colors font-medium ${
                        marketFilter === "indices"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold"
                          : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      Indices
                    </button>
                    <button
                      onClick={() => setMarketFilter("stocks")}
                      className={`px-2 py-0.5 rounded transition-colors font-medium ${
                        marketFilter === "stocks"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold"
                          : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      Groww Stocks
                    </button>
                  </div>
                  <span className="text-[9px] text-neutral-500 font-mono hidden sm:inline">
                    {marketLastUpdated}
                  </span>
                </div>

                {/* Market Tickers List */}
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1 no-scrollbar">
                  {filteredMarketData.map((item) => {
                    const isPos = item.isPositive === true;
                    const isNeg = item.isPositive === false;

                    return (
                      <a
                        key={item.symbol}
                        href={item.growwUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={`flex items-center justify-between p-2 rounded-lg border transition-all group select-none ${
                          (item as any).highlight
                            ? "bg-[#181922] border-amber-500/40 hover:border-amber-400 hover:bg-[#1f212d]"
                            : "bg-[#181920]/60 hover:bg-[#1f2029] border-[#262834] hover:border-neutral-600"
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white font-mono text-xs group-hover:text-emerald-400 transition-colors">
                              {item.symbol}
                            </span>
                            {item.tag && (
                              <span
                                className={`text-[9px] font-mono px-1 py-0.2 rounded font-semibold ${
                                  (item as any).highlight
                                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                    : "bg-neutral-800 text-neutral-400"
                                }`}
                              >
                                {item.tag}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-[#8b91a0] font-mono truncate">
                            {item.name}
                          </div>
                        </div>

                        {/* SVG Sparkline */}
                        <div className="shrink-0 px-1">
                          <svg className="w-14 h-4.5" viewBox="0 0 64 20" fill="none">
                            <path
                              d={item.sparkline}
                              stroke={isPos ? "#00d09c" : isNeg ? "#f87171" : "#94a3b8"}
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>

                        {/* Price and Delta */}
                        <div className="text-right font-mono shrink-0 pl-1">
                          <div
                            className={`text-xs font-bold ${
                              isPos
                                ? "text-[#00d09c]"
                                : isNeg
                                ? "text-rose-400"
                                : "text-neutral-300"
                            }`}
                          >
                            {item.change}
                          </div>
                          <div className="text-neutral-200 text-[11px] font-semibold flex items-center justify-end gap-1">
                            <span>{item.price}</span>
                            <ArrowUpRight className="w-2.5 h-2.5 text-neutral-500 group-hover:text-emerald-400 transition-colors" />
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>

                {/* Groww Quick Action Footer */}
                <div className="pt-2 border-t border-[#232530] flex items-center justify-between text-[11px] font-mono">
                  <span className="text-neutral-400">Trade on Groww</span>
                  <a
                    href="https://groww.in/dashboard/explore/stocks"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[#00d09c] hover:text-[#2ae2b1] font-semibold transition-colors"
                  >
                    <span>Open Groww App</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* VIEW B: PERSONAL GROWW PORTFOLIO & HOLDINGS TRACKER      */}
            {/* ========================================================= */}
            {growwViewMode === "portfolio" && (
              <div className="space-y-3.5 animate-in fade-in duration-200">
                {/* Portfolio Summary Performance Card */}
                <div className="p-3.5 rounded-xl bg-[#181920] border border-[#282a37] space-y-2.5">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                    <span>Portfolio Value</span>
                    <span>1-Day Return</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <div className="text-xl font-bold font-mono text-white">
                      {formatINR(portfolioSummary.currentValue)}
                    </div>
                    <div
                      className={`text-xs font-mono font-bold ${
                        portfolioSummary.dayReturns >= 0 ? "text-[#00d09c]" : "text-rose-400"
                      }`}
                    >
                      {portfolioSummary.dayReturns >= 0 ? "+" : ""}
                      {formatINR(portfolioSummary.dayReturns)} ({portfolioSummary.dayReturnsPct >= 0 ? "+" : ""}
                      {portfolioSummary.dayReturnsPct.toFixed(2)}%)
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#232530] text-[11px] font-mono">
                    <div>
                      <div className="text-neutral-400 text-[10px]">Total Invested</div>
                      <div className="text-neutral-200 font-semibold">
                        {formatINR(portfolioSummary.totalInvested)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-neutral-400 text-[10px]">Total Profit / Loss</div>
                      <div
                        className={`font-bold ${
                          portfolioSummary.totalReturns >= 0 ? "text-[#00d09c]" : "text-rose-400"
                        }`}
                      >
                        {portfolioSummary.totalReturns >= 0 ? "+" : ""}
                        {formatINR(portfolioSummary.totalReturns)} ({portfolioSummary.totalReturnsPct >= 0 ? "+" : ""}
                        {portfolioSummary.totalReturnsPct.toFixed(2)}%)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Import Status Alert */}
                {portfolioImportStatus && (
                  <div className="p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[11px]">
                    {portfolioImportStatus}
                  </div>
                )}

                {/* Action Bar: Add Holding + Import CSV */}
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setShowAddHoldingForm(!showAddHoldingForm)}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-[#00d09c] border border-emerald-500/30 transition-colors font-semibold"
                    >
                      <Plus className="w-3 h-3 text-[#00d09c]" />
                      <span>Add Stock</span>
                    </button>

                    <label className="flex items-center gap-1 px-2 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 cursor-pointer transition-colors font-medium">
                      <Upload className="w-3 h-3 text-neutral-400" />
                      <span>Import CSV</span>
                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleGrowwCSVUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <a
                    href="https://groww.in/dashboard/stocks/user-holdings"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-neutral-400 hover:text-white transition-colors"
                    title="Open your holdings in Groww app"
                  >
                    <span>Groww Holdings</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Inline Add Stock Form */}
                {showAddHoldingForm && (
                  <form
                    onSubmit={handleAddHolding}
                    className="p-3 rounded-xl bg-[#161720] border border-[#2a2c3a] space-y-2.5 animate-in fade-in duration-200"
                  >
                    <div className="text-xs font-mono font-bold text-white flex items-center justify-between">
                      <span>Add Stock to Groww Portfolio</span>
                      <button
                        type="button"
                        onClick={() => setShowAddHoldingForm(false)}
                        className="text-neutral-400 hover:text-white"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-[10px] font-mono text-neutral-400 block mb-0.5">Symbol</label>
                        <input
                          type="text"
                          placeholder="e.g. SCHNEIDER"
                          value={newHoldingSymbol}
                          onChange={(e) => setNewHoldingSymbol(e.target.value)}
                          className="w-full text-xs font-mono px-2.5 py-1.5 rounded-lg bg-[#101116] border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-[#00d09c]"
                          autoFocus
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-neutral-400 block mb-0.5">Company Name</label>
                        <input
                          type="text"
                          placeholder="Schneider Electric Infra"
                          value={newHoldingName}
                          onChange={(e) => setNewHoldingName(e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-[#101116] border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-[#00d09c]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                      <div>
                        <label className="text-[10px] text-neutral-400 block mb-0.5">Quantity</label>
                        <input
                          type="number"
                          placeholder="100"
                          value={newHoldingShares}
                          onChange={(e) => setNewHoldingShares(e.target.value)}
                          className="w-full text-xs px-2 py-1.5 rounded-lg bg-[#101116] border border-neutral-800 text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-neutral-400 block mb-0.5">Avg Buy (₹)</label>
                        <input
                          type="number"
                          step="any"
                          placeholder="710"
                          value={newHoldingAvgPrice}
                          onChange={(e) => setNewHoldingAvgPrice(e.target.value)}
                          className="w-full text-xs px-2 py-1.5 rounded-lg bg-[#101116] border border-neutral-800 text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-neutral-400 block mb-0.5">Current (₹)</label>
                        <input
                          type="number"
                          step="any"
                          placeholder="842.5"
                          value={newHoldingCurrentPrice}
                          onChange={(e) => setNewHoldingCurrentPrice(e.target.value)}
                          className="w-full text-xs px-2 py-1.5 rounded-lg bg-[#101116] border border-neutral-800 text-white"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1 font-mono text-[11px]">
                      <button
                        type="button"
                        onClick={() => setShowAddHoldingForm(false)}
                        className="px-2.5 py-1 text-neutral-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1 rounded-lg bg-[#00d09c] text-neutral-950 font-bold hover:bg-[#2ae2b1] transition-colors"
                      >
                        Save Holding
                      </button>
                    </div>
                  </form>
                )}

                {/* Holdings Items List */}
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1 no-scrollbar">
                  {growwHoldings.length === 0 ? (
                    <div className="p-4 text-center text-xs font-mono text-neutral-400 bg-[#181920]/60 rounded-xl border border-dashed border-[#282a37]">
                      No holdings added yet. Click "+ Add Stock" or "Import CSV" to start tracking.
                    </div>
                  ) : (
                    growwHoldings.map((h) => {
                      const totalVal = (h.shares || 0) * (h.currentPrice || 0);
                      const totalCost = (h.shares || 0) * (h.avgPrice || 0);
                      const pnl = totalVal - totalCost;
                      const pnlPct = totalCost > 0 ? (pnl / totalCost) * 100 : 0;
                      const isProfit = pnl >= 0;

                      return (
                        <div
                          key={h.id}
                          className="p-2.5 rounded-lg bg-[#181920] border border-[#262834] hover:border-neutral-600 transition-all flex items-center justify-between gap-2 group"
                        >
                          <div className="min-w-0 pr-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-white font-mono text-xs">
                                {h.symbol}
                              </span>
                              {h.category && (
                                <span className="text-[9px] font-mono px-1 rounded bg-neutral-800 text-neutral-400">
                                  {h.category}
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-neutral-400 font-mono truncate">
                              {h.shares} shares · Avg {formatINR(h.avgPrice)}
                            </div>
                          </div>

                          {/* Current Price & P&L */}
                          <div className="text-right font-mono shrink-0 pl-1">
                            <div className="text-xs font-bold text-white">
                              {formatINR(totalVal)}
                            </div>
                            <div
                              className={`text-[11px] font-semibold flex items-center justify-end gap-1 ${
                                isProfit ? "text-[#00d09c]" : "text-rose-400"
                              }`}
                            >
                              <span>
                                {isProfit ? "+" : ""}
                                {formatINR(pnl)} ({isProfit ? "+" : ""}
                                {pnlPct.toFixed(1)}%)
                              </span>
                            </div>
                          </div>

                          {/* Action Links */}
                          <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <a
                              href={h.growwUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 text-neutral-400 hover:text-[#00d09c] transition-colors"
                              title="Open on Groww"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                            <button
                              onClick={() => handleDeleteHolding(h.id)}
                              className="p-1 text-neutral-400 hover:text-rose-400 transition-colors"
                              title="Remove holding"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Footer notes */}
                <div className="pt-2 border-t border-[#232530] flex items-center justify-between text-[10px] font-mono text-neutral-400">
                  <span>Tracked in browser localStorage</span>
                  <a
                    href="https://groww.in/dashboard/stocks/user-holdings"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#00d09c] hover:underline flex items-center gap-0.5"
                  >
                    <span>Groww Web</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* 3.4 EXECUTIVE SCRATCHPAD & TIMER CARD */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#14151b] border border-[#232530] shadow-lg space-y-4">
            <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-neutral-300 uppercase font-bold">
              <span className="flex items-center gap-1.5 text-white">
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                EXECUTIVE SCRATCHPAD
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(scratchpadNote);
                  setNoteCopied(true);
                  setTimeout(() => setNoteCopied(false), 2000);
                }}
                className="text-[10px] text-neutral-300 hover:text-white transition-colors flex items-center gap-1 font-mono font-semibold"
                title="Copy scratchpad notes"
              >
                <Copy className="w-3 h-3 text-amber-400" />
                <span>{noteCopied ? "Copied" : "Copy"}</span>
              </button>
            </div>

            <textarea
              value={scratchpadNote}
              onChange={(e) => handleSaveScratchpad(e.target.value)}
              placeholder="Jot down quick meeting notes, GMAT error takeaways, or daily thoughts..."
              rows={4}
              className="w-full text-xs font-mono p-3 rounded-xl bg-[#1a1b23] border border-[#282a37] text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400/80 leading-relaxed resize-none font-medium"
            />
            <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
              <span>Auto-saved in browser</span>
              <span>Markdown ready</span>
            </div>

            {/* DEEP WORK FOCUS TIMER HUD */}
            <div className="p-3 rounded-xl bg-[#1a1b23] border border-[#282a37] flex items-center justify-between text-xs font-mono pt-3">
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="text-neutral-300 font-semibold">Sprint: </span>
                  <span className="text-amber-300 font-bold text-sm">
                    {Math.floor(pomodoroSeconds / 60).toString().padStart(2, "0")}:
                    {(pomodoroSeconds % 60).toString().padStart(2, "0")}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPomodoroRunning(!pomodoroRunning)}
                  className={`px-3 py-1 rounded-md text-[11px] font-bold transition-colors ${
                    pomodoroRunning
                      ? "bg-amber-500/25 text-amber-300 border border-amber-500/40"
                      : "bg-neutral-800 text-white hover:bg-neutral-700"
                  }`}
                >
                  {pomodoroRunning ? "Pause" : "Start 25m"}
                </button>
                <button
                  onClick={() => {
                    setPomodoroRunning(false);
                    setPomodoroSeconds(25 * 60);
                  }}
                  className="p-1 text-neutral-400 hover:text-white"
                  title="Reset timer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GOOGLE CALENDAR LINK & SYNC MODAL */}
      {showGCalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-[#111215] border border-neutral-700/80 p-5 sm:p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-sky-400" />
                <h3 className="font-bold text-white text-base">Google Calendar Integration</h3>
              </div>
              <button
                onClick={() => setShowGCalModal(false)}
                className="text-neutral-400 hover:text-white text-sm font-mono p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed font-sans">
              Sync your live Google Calendar agenda into your Glance dashboard to view your meetings, sprint reviews, and day-to-day commitments alongside your executive routines.
            </p>

            {/* Connection Status Banner (if connected) */}
            {gcalLastSynced && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-300 font-semibold">
                    Synced at {gcalLastSynced}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleDisconnectGCal}
                  className="text-[11px] text-rose-400 hover:text-rose-300 font-bold underline"
                >
                  Disconnect
                </button>
              </div>
            )}

            {/* Option 1: Live iCal URL Sync */}
            <div className="space-y-2 p-3.5 rounded-xl bg-[#171821] border border-[#262834]">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono uppercase tracking-wider text-amber-300 font-bold flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5 text-amber-400" />
                  Option 1: Live iCal Link (Auto-Sync)
                </label>
              </div>
              <input
                type="text"
                placeholder="https://calendar.google.com/calendar/ical/.../basic.ics"
                value={gcalIcsUrl}
                onChange={(e) => setGcalIcsUrl(e.target.value)}
                className="w-full text-xs font-mono px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400"
              />
              <div className="p-2.5 rounded-lg bg-neutral-900/70 border border-neutral-800 text-[11px] font-mono text-neutral-400 space-y-1">
                <div className="text-neutral-200 font-semibold">Quick setup steps:</div>
                <div>1. Open <a href="https://calendar.google.com/calendar/u/0/r/settings" target="_blank" rel="noreferrer" className="text-amber-400 underline font-semibold">Google Calendar Settings ↗</a></div>
                <div>2. Under <strong>Settings for my calendars</strong>, click your calendar on the left.</div>
                <div>3. Scroll to <strong>Integrate calendar</strong> &gt; copy <strong>"Secret address in iCal format"</strong>.</div>
                <div>4. Paste it above and click "Save & Sync Feed".</div>
              </div>
            </div>

            {/* Option 2: Instant .ics File Upload */}
            <div className="p-3.5 rounded-xl bg-[#171821] border border-[#262834] space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-sky-300 font-bold flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-sky-400" />
                Option 2: Import .ics Export File
              </label>
              <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                Export your calendar (.ics) from Google Calendar and upload it directly. It will be parsed instantly in your browser without sharing secret URLs.
              </p>
              <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 cursor-pointer border border-neutral-700 transition-colors">
                <Upload className="w-3.5 h-3.5 text-sky-400" />
                <span>Choose .ics file from Mac</span>
                <input
                  type="file"
                  accept=".ics,text/calendar"
                  onChange={handleIcsFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Status message */}
            {gcalStatus && (
              <div className="text-xs font-mono p-2.5 rounded-xl bg-neutral-900 text-amber-300 border border-neutral-800">
                {gcalStatus}
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <a
                href="https://calendar.google.com/calendar/u/0/r"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono text-neutral-400 hover:text-white flex items-center gap-1"
              >
                <span>Open Google Calendar Web</span>
                <ExternalLink className="w-3 h-3 text-neutral-400" />
              </a>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowGCalModal(false)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-mono text-neutral-400 hover:text-white transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => syncGCal(gcalIcsUrl)}
                  disabled={gcalLoading || !gcalIcsUrl.trim()}
                  className="px-4 py-1.5 rounded-xl text-xs font-mono font-bold bg-amber-500 text-neutral-950 hover:bg-amber-400 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  {gcalLoading && <RefreshCw className="w-3 h-3 animate-spin" />}
                  <span>{gcalLoading ? "Syncing..." : "Save & Sync Feed"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
