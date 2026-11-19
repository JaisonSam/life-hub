"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Calendar as CalendarIcon,
  HardDrive,
  Music,
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
  Disc,
  Volume2,
} from "lucide-react";
import { getDateKey } from "@/lib/dailyHabits";
import {
  PlannedActivity,
  getPlannedActivitiesForDate,
  getUpcomingEvents,
  formatActivityDateBadge,
  getGoogleCalendarAddUrl,
  parseICSContent,
  DEFAULT_UPCOMING_GCAL_EVENTS,
  loadStoredActivities,
} from "@/lib/calendarActivities";
import {
  GrowwHolding,
  DEFAULT_GROWW_HOLDINGS,
  calculatePortfolioSummary,
  parseGrowwHoldingsCSV,
  saveStoredGrowwHoldings,
  updateHoldingsWithLiveQuotes,
} from "@/lib/growwPortfolio";

interface GlanceDashboardProps {
  onSelectTab: (tabId: "google" | "books" | "music") => void;
  currentTime?: string;
  currentDate?: string;
  ytConnected?: boolean;
  nowPlayingTrack?: {
    configured: boolean;
    nowPlaying: boolean;
    title: string;
    artist: string;
    album: string;
    albumArt: string;
    ytMusicUrl: string;
    playedAt: string;
  } | null;
  currentPlaylist?: {
    title: string;
    subtitle: string;
    ytUrl: string;
    coverUrl: string;
    tag: string;
    bpmOrVibe: string;
  };
  onPlayAlbum?: (album: any) => void;
  demoNowPlaying?: boolean;
  onToggleDemo?: () => void;
}

export default function GlanceDashboard({
  onSelectTab,
  currentTime,
  currentDate,
  ytConnected = false,
  nowPlayingTrack,
  currentPlaylist,
  onPlayAlbum,
  demoNowPlaying,
  onToggleDemo,
}: GlanceDashboardProps) {
  // Stable reference date for clean SSR prerender
  const defaultDate = useMemo(() => new Date(2026, 10, 16), []);
  const [calendarDate, setCalendarDate] = useState<Date>(defaultDate);
  const [todayDate, setTodayDate] = useState<Date>(defaultDate);
  const [todayKey, setTodayKey] = useState<string>("2026-11-16");

  // YouTube Music Deck State
  const [localDemoNowPlaying, setLocalDemoNowPlaying] = useState(false);

  const isDemo = demoNowPlaying ?? localDemoNowPlaying;
  const isLive = isDemo || nowPlayingTrack?.nowPlaying;
  const displayTrack = isDemo
    ? {
        title: "Goodness of God (Live)",
        artist: "Bethel Music, Jenn Johnson",
        album: "VICTORY (Live at Redding)",
        albumArt: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=600&q=80",
        ytMusicUrl: "https://music.youtube.com/search?q=Goodness+of+God+Bethel+Music",
        playedAt: "Streaming now on Android",
      }
    : nowPlayingTrack && nowPlayingTrack.title
    ? nowPlayingTrack
    : null;

  const handleToggleDemo = () => {
    if (onToggleDemo) {
      onToggleDemo();
    } else {
      setLocalDemoNowPlaying((prev) => !prev);
    }
  };

  // 4. Day-to-Day Planned Activities & Google Calendar State
  const [selectedDay, setSelectedDay] = useState<number>(16);
  const [showGCalModal, setShowGCalModal] = useState<boolean>(false);
  const [gcalIcsUrl, setGcalIcsUrl] = useState<string>("");
  const [gcalLoading, setGcalLoading] = useState<boolean>(false);
  const [gcalStatus, setGcalStatus] = useState<string>("");
  const [gcalLastSynced, setGcalLastSynced] = useState<string | null>(null);
  const [calendarFilter, setCalendarFilter] = useState<"all" | "gcal" | "routine">("all");
  const [calendarViewMode, setCalendarViewMode] = useState<"day" | "upcoming">("upcoming");
  const [customActivities, setCustomActivities] = useState<PlannedActivity[]>(DEFAULT_UPCOMING_GCAL_EVENTS);
  const [completedActivityIds, setCompletedActivityIds] = useState<Record<string, boolean>>({});
  const [showAddActivityForm, setShowAddActivityForm] = useState<boolean>(false);
  const [newActTitle, setNewActTitle] = useState<string>("");
  const [newActTime, setNewActTime] = useState<string>("09:30 AM");
  const [newActCategory, setNewActCategory] = useState<PlannedActivity["category"]>("Personal");
  const [newActAlsoGCal, setNewActAlsoGCal] = useState<boolean>(true);

  // 5. Indian Market Trends & Groww Portfolio Tracker State
  const [growwViewMode, setGrowwViewMode] = useState<"markets" | "portfolio">("markets");
  const [marketFilter, setMarketFilter] = useState<"all" | "indices" | "stocks">("all");
  const [marketTickVersion, setMarketTickVersion] = useState<number>(0);
  const [marketLastUpdated, setMarketLastUpdated] = useState<string>("Just now");
  const [marketRefreshing, setMarketRefreshing] = useState<boolean>(false);
  const [marketLoading, setMarketLoading] = useState<boolean>(false);
  const [liveMarketQuotes, setLiveMarketQuotes] = useState<Record<string, any>>({});
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
  const [weatherLocation, setWeatherLocation] = useState<"gps" | "blr">("gps");
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

  // Sync Google Calendar ICS Feed via API or direct endpoint
  const syncGCal = async (url?: string) => {
    setGcalLoading(true);
    setGcalStatus("Syncing upcoming Google Calendar events...");
    try {
      const urlToUse = (typeof url === "string" ? url : gcalIcsUrl).trim();
      if (urlToUse) {
        const res = await fetch("/api/calendar/ics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: urlToUse }),
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
            gcalLink: evt.gcalLink || "https://calendar.google.com/calendar/u/0/r",
          }));
          setCustomActivities((prev) => {
            const nonGcal = prev.filter((p) => p.source !== "google-calendar");
            const combined = [...nonGcal, ...mapped];
            try {
              localStorage.setItem("lifehub_custom_activities", JSON.stringify(combined));
              localStorage.setItem("lifehub_gcal_ics", urlToUse);
              const nowTime = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
              localStorage.setItem("lifehub_gcal_synced_at", nowTime);
              setGcalLastSynced(nowTime);
            } catch {}
            return combined;
          });
          setGcalStatus(`✓ Synced ${data.count} events from Google Calendar!`);
          return;
        }
      }

      // Default sync via /api/calendar/sync
      const res = await fetch("/api/calendar/sync");
      const data = await res.json();
      if (data.success && data.events) {
        setCustomActivities((prev) => {
          const nonGcal = prev.filter((p) => p.source !== "google-calendar");
          const combined = [...nonGcal, ...data.events];
          try {
            localStorage.setItem("lifehub_custom_activities", JSON.stringify(combined));
            const nowTime = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
            localStorage.setItem("lifehub_gcal_synced_at", nowTime);
            setGcalLastSynced(nowTime);
          } catch {}
          return combined;
        });
        setGcalStatus(`✓ Synced ${data.count} upcoming events from Google Calendar!`);
      }
    } catch (e: any) {
      setGcalStatus(`Sync failed: ${e.message}`);
    } finally {
      setGcalLoading(false);
      setTimeout(() => setGcalStatus(""), 5000);
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

  // Fetch real-time live Indian Market quotes (NSE, BSE, and Jaison's 19 stocks)
  const fetchLiveMarketData = async () => {
    setMarketRefreshing(true);
    try {
      const res = await fetch("/api/markets/live");
      const data = await res.json();
      if (data.success && data.quotes) {
        setLiveMarketQuotes(data.quotes);
        if (typeof data.isMarketOpen === "boolean") {
          setIsIndianMarketOpen(data.isMarketOpen);
        }
        const timeStr = new Date().toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
        });
        setMarketLastUpdated(`${timeStr} IST`);

        // Dynamically update user's stock holdings with real live market prices
        setGrowwHoldings((prev) => {
          const updated = updateHoldingsWithLiveQuotes(prev, data.quotes);
          try {
            localStorage.setItem("lifehub_groww_portfolio", JSON.stringify(updated));
          } catch {}
          return updated;
        });
      }
    } catch (e: any) {
      console.warn("Live market fetch notice:", e.message);
    } finally {
      setMarketRefreshing(false);
    }
  };

  const handleRefreshMarkets = () => {
    fetchLiveMarketData();
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
          setTimeout(() => setPortfolioImportStatus(""), 5000);
        } else {
          setPortfolioImportStatus("Could not find valid holdings in CSV.");
          setTimeout(() => setPortfolioImportStatus(""), 5000);
        }
      } catch (err: any) {
        setPortfolioImportStatus(`⚠️ ${err.message || "Import failed"}`);
        setTimeout(() => setPortfolioImportStatus(""), 7000);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleResetToMyHoldings = () => {
    setGrowwHoldings(DEFAULT_GROWW_HOLDINGS);
    saveStoredGrowwHoldings(DEFAULT_GROWW_HOLDINGS);
    setPortfolioImportStatus("✓ Restored Jaison's official Groww portfolio (19 stocks)");
    setTimeout(() => setPortfolioImportStatus(""), 4000);
  };

  // Indian Market Instruments on Groww (dynamically populated from real market quotes)
  const indianMarketData = useMemo(() => {
    const nifty = liveMarketQuotes["NIFTY_50"];
    const sensex = liveMarketQuotes["SENSEX"];
    const bankNifty = liveMarketQuotes["BANK_NIFTY"];
    const usdinr = liveMarketQuotes["USD_INR"];
    const schneider = liveMarketQuotes["SCHNEIDER"];
    const tatamotors = liveMarketQuotes["TMPV"];
    const reliance = liveMarketQuotes["RELIANCE"];
    const hdfc = liveMarketQuotes["HDFCBANK"];

    return [
      {
        symbol: "NIFTY 50",
        name: "NSE Benchmark Index",
        type: "indices" as const,
        price: nifty?.price ? formatINR(nifty.price) : "₹25,291.10",
        change: nifty
          ? `${nifty.change >= 0 ? "+" : ""}${nifty.change.toFixed(2)} (${nifty.changePct >= 0 ? "+" : ""}${nifty.changePct.toFixed(2)}%)`
          : "+146.80 (+0.58%)",
        isPositive: nifty ? nifty.isPositive : true,
        growwUrl: "https://groww.in/indices/nifty-50",
        sparkline: "M2 14 L12 12 L22 15 L32 9 L42 11 L52 5 L62 3",
        tag: "National Index",
      },
      {
        symbol: "SENSEX",
        name: "BSE Benchmark Index",
        type: "indices" as const,
        price: sensex?.price ? formatINR(sensex.price) : "₹82,104.79",
        change: sensex
          ? `${sensex.change >= 0 ? "+" : ""}${sensex.change.toFixed(2)} (${sensex.changePct >= 0 ? "+" : ""}${sensex.changePct.toFixed(2)}%)`
          : "+512.34 (+0.63%)",
        isPositive: sensex ? sensex.isPositive : true,
        growwUrl: "https://groww.in/indices/bse-sensex",
        sparkline: "M2 13 L12 14 L22 10 L32 11 L42 7 L52 8 L62 4",
        tag: "Bombay 30",
      },
      {
        symbol: "BANK NIFTY",
        name: "NSE Banking Index",
        type: "indices" as const,
        price: bankNifty?.price ? formatINR(bankNifty.price) : "₹61,575.90",
        change: bankNifty
          ? `${bankNifty.change >= 0 ? "+" : ""}${bankNifty.change.toFixed(2)} (${bankNifty.changePct >= 0 ? "+" : ""}${bankNifty.changePct.toFixed(2)}%)`
          : "+541.80 (+0.89%)",
        isPositive: bankNifty ? bankNifty.isPositive : true,
        growwUrl: "https://groww.in/indices/nifty-bank",
        sparkline: "M2 15 L12 11 L22 13 L32 8 L42 9 L52 4 L62 2",
        tag: "Banking",
      },
      {
        symbol: "SCHNEIDER",
        name: "Schneider Electric Infra Ltd",
        type: "stocks" as const,
        price: schneider?.price ? formatINR(schneider.price) : "₹1,024.90",
        change: schneider
          ? `${schneider.change >= 0 ? "+" : ""}${formatINR(schneider.change)} (${schneider.changePct >= 0 ? "+" : ""}${schneider.changePct.toFixed(2)}%)`
          : "-₹36.10 (-3.40%)",
        isPositive: schneider ? schneider.isPositive : false,
        growwUrl: "https://groww.in/stocks/schneider-electric-infrastructure-ltd",
        sparkline: "M2 16 L12 14 L22 12 L32 10 L42 6 L52 5 L62 2",
        tag: "Jaison's Company",
        highlight: true,
      },
      {
        symbol: "TATAMOTORS",
        name: "Tata Motors Passenger Ltd",
        type: "stocks" as const,
        price: tatamotors?.price ? formatINR(tatamotors.price) : "₹262.40",
        change: tatamotors
          ? `${tatamotors.change >= 0 ? "+" : ""}${formatINR(tatamotors.change)} (${tatamotors.changePct >= 0 ? "+" : ""}${tatamotors.changePct.toFixed(2)}%)`
          : "+₹2.95 (+1.15%)",
        isPositive: tatamotors ? tatamotors.isPositive : true,
        growwUrl: "https://groww.in/stocks/tata-motors-ltd",
        sparkline: "M2 14 L12 13 L22 11 L32 12 L42 8 L52 7 L62 4",
        tag: "Auto / EV",
      },
      {
        symbol: "RELIANCE",
        name: "Reliance Industries Ltd",
        type: "stocks" as const,
        price: reliance?.price ? formatINR(reliance.price) : "₹1,344.80",
        change: reliance
          ? `${reliance.change >= 0 ? "+" : ""}${formatINR(reliance.change)} (${reliance.changePct >= 0 ? "+" : ""}${reliance.changePct.toFixed(2)}%)`
          : "+₹5.10 (+0.38%)",
        isPositive: reliance ? reliance.isPositive : true,
        growwUrl: "https://groww.in/stocks/reliance-industries-ltd",
        sparkline: "M2 5 L14 6 L26 8 L38 12 L50 13 L62 16",
        tag: "Energy & Retail",
      },
      {
        symbol: "HDFCBANK",
        name: "HDFC Bank Ltd",
        type: "stocks" as const,
        price: hdfc?.price ? formatINR(hdfc.price) : "₹816.50",
        change: hdfc
          ? `${hdfc.change >= 0 ? "+" : ""}${formatINR(hdfc.change)} (${hdfc.changePct >= 0 ? "+" : ""}${hdfc.changePct.toFixed(2)}%)`
          : "+₹12.45 (+1.55%)",
        isPositive: hdfc ? hdfc.isPositive : true,
        growwUrl: "https://groww.in/stocks/hdfc-bank-ltd",
        sparkline: "M2 12 L12 14 L22 10 L32 9 L42 7 L52 8 L62 5",
        tag: "Private Bank",
      },
      {
        symbol: "USD/INR",
        name: "Indian Rupee Forex Spot",
        type: "indices" as const,
        price: usdinr?.price ? `₹${usdinr.price.toFixed(2)}` : "₹84.42",
        change: usdinr
          ? `${usdinr.changePct >= 0 ? "+" : ""}${usdinr.changePct.toFixed(2)}%`
          : "+0.04%",
        isPositive: usdinr ? usdinr.isPositive : null,
        growwUrl: "https://groww.in/us-stocks",
        sparkline: "M2 10 L14 11 L26 9 L38 10 L50 9 L62 10",
        tag: "Forex",
      },
    ];
  }, [liveMarketQuotes, marketTickVersion]);

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
      } else {
        setGcalLastSynced("Auto-synced");
      }
      const loadedActivities = loadStoredActivities();
      if (loadedActivities && loadedActivities.length > 0) {
        setCustomActivities(loadedActivities);
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

      const savedHoldings = localStorage.getItem("lifehub_groww_portfolio");
      if (savedHoldings) {
        try {
          const parsed = JSON.parse(savedHoldings);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Auto-upgrade dummy 4-stock portfolio to Jaison's actual 19 Groww holdings
            if (parsed.length === 4 && parsed[0]?.id === "h-schneider") {
              setGrowwHoldings(DEFAULT_GROWW_HOLDINGS);
              localStorage.setItem("lifehub_groww_portfolio", JSON.stringify(DEFAULT_GROWW_HOLDINGS));
            } else {
              setGrowwHoldings(parsed);
            }
          }
        } catch {}
      }

      // Auto-fetch real-time live Indian Market & Portfolio quotes immediately
      fetchLiveMarketData();

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

    // Auto-refresh real-time market quotes every 30 seconds
    const marketInterval = setInterval(() => {
      fetchLiveMarketData();
    }, 30000);

    return () => clearInterval(marketInterval);
  }, []);

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

  // 4. Center Column Sub-Tabs (GOOGLE APPS | TECH INTEL)
  const [centerSubTab, setCenterSubTab] = useState<"google" | "tech">("google");

  // Auto-fetch real Google Calendar events if connected via OAuth
  useEffect(() => {
    fetch("/api/calendar/events")
      .then((res) => res.json())
      .then((data) => {
        if (data.connected && data.events && data.events.length > 0) {
          setCustomActivities(data.events);
          setGcalStatus(`Synced ${data.events.length} live Google Calendar events`);
          setGcalLastSynced(new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }));
        }
      })
      .catch(() => {});
  }, []);

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

  const upcomingEventsList = useMemo(() => {
    return getUpcomingEvents(customActivities, todayKey, 25);
  }, [customActivities, todayKey]);

  const totalUpcomingGcalCount = useMemo(() => {
    return upcomingEventsList.filter(
      (a) => a.source === "google-calendar" || a.category === "Google-Calendar"
    ).length;
  }, [upcomingEventsList]);

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
                <CalendarIcon className="w-3.5 h-3.5 text-white" />
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
                const cellDateKey = item.isCurrentMonth
                  ? `${year}-${String(calendarDate.getMonth() + 1).padStart(2, "0")}-${String(item.day).padStart(2, "0")}`
                  : "";
                const dayEvents = cellDateKey
                  ? customActivities.filter((a) => a && a.date === cellDateKey)
                  : [];
                const gcalEvents = dayEvents.filter(
                  (a) => a.source === "google-calendar" || a.category === "Google-Calendar"
                );
                const hasGCal = gcalEvents.length > 0;
                const hasCustom = dayEvents.length > gcalEvents.length;
                const hasEvents = dayEvents.length > 0;

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (item.isCurrentMonth) {
                        setSelectedDay(item.day);
                        setCalendarViewMode("day");
                      }
                    }}
                    title={
                      hasEvents
                        ? `${dayEvents.length} event(s) on ${cellDateKey}:\n${dayEvents.map((e) => `• ${e.time}: ${e.title}`).join("\n")}`
                        : undefined
                    }
                    className={`relative min-h-[30px] py-1 flex flex-col items-center justify-center rounded-md transition-all select-none cursor-pointer ${
                      isSelected
                        ? "border-2 border-white text-white font-bold bg-white/20 shadow-md ring-1 ring-white/50 scale-105 z-10"
                        : item.isToday
                        ? "border border-white/80 text-white font-bold bg-white/10 shadow-sm"
                        : hasGCal
                        ? "text-sky-100 hover:bg-[#1a2336] bg-sky-950/25 border border-sky-800/40 hover:border-sky-500/60"
                        : item.isCurrentMonth
                        ? "text-neutral-200 hover:bg-[#20222d] hover:text-white"
                        : "text-neutral-600 cursor-default"
                    }`}
                  >
                    <span className="text-xs leading-none">{item.day}</span>
                    {item.isCurrentMonth && hasEvents && (
                      <div className="flex items-center gap-0.5 mt-0.5">
                        {hasGCal && (
                          <span
                            className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_3px_#38bdf8]"
                            title={`${gcalEvents.length} Google Calendar event(s)`}
                          />
                        )}
                        {hasCustom && (
                          <span
                            className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_3px_#ffffff]"
                            title="Custom event"
                          />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 1.1B PLANNED DAY-TO-DAY ACTIVITIES & GOOGLE CALENDAR LINK */}
            <div className="pt-3 border-t border-[#232530] space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-neutral-300 uppercase font-bold">
                <span className="flex items-center gap-1.5 text-white">
                  <CalendarCheck2 className="w-3.5 h-3.5 text-white" />
                  PLANNED ACTIVITIES
                </span>
                <div className="flex items-center gap-1.5 text-[10px] font-mono">
                  {gcalLastSynced ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => syncGCal()}
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

              {/* View Mode Toggle: Upcoming Agenda vs Daily Routine */}
              <div className="grid grid-cols-2 gap-1 p-0.5 bg-[#12131a] rounded-lg border border-[#232530] text-[11px] font-mono">
                <button
                  onClick={() => setCalendarViewMode("upcoming")}
                  className={`py-1 px-1.5 rounded-md transition-all flex items-center justify-center gap-1 font-semibold ${
                    calendarViewMode === "upcoming"
                      ? "bg-[#1c202d] text-sky-300 shadow-sm border border-sky-500/30 font-bold"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <Clock className="w-3 h-3 text-sky-400" />
                  <span>Upcoming ({upcomingEventsList.length})</span>
                </button>
                <button
                  onClick={() => setCalendarViewMode("day")}
                  className={`py-1 px-1.5 rounded-md transition-all flex items-center justify-center gap-1 font-semibold ${
                    calendarViewMode === "day"
                      ? "bg-[#1c202d] text-white shadow-sm border border-neutral-700 font-bold"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <CalendarIcon className="w-3 h-3 text-white" />
                  <span>{selectedDateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" })} Agenda</span>
                </button>
              </div>

              {/* VIEW 1: UPCOMING AGENDA VIEW */}
              {calendarViewMode === "upcoming" && (
                <div className="space-y-2 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 px-0.5">
                    <span>Upcoming Timeline (Next 14 Days)</span>
                    <button
                      onClick={() => syncGCal()}
                      disabled={gcalLoading}
                      className="text-sky-400 hover:text-sky-300 flex items-center gap-1 font-semibold"
                    >
                      <RefreshCw className={`w-2.5 h-2.5 ${gcalLoading ? "animate-spin" : ""}`} />
                      <span>Sync</span>
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1 no-scrollbar">
                    {upcomingEventsList.length === 0 ? (
                      <div className="p-3 text-center text-xs font-mono text-neutral-400 bg-[#181920]/60 rounded-lg border border-dashed border-[#282a37]">
                        No upcoming events found. Click "Sync" or "Link GCal" to load events.
                      </div>
                    ) : (
                      upcomingEventsList.map((act) => {
                        const isDone = Boolean(completedActivityIds && typeof completedActivityIds === "object" && completedActivityIds[act.id]);
                        const isGCal = act.source === "google-calendar" || act.category === "Google-Calendar";
                        const dateBadge = formatActivityDateBadge(act.date || "", todayKey);

                        return (
                          <div
                            key={act.id}
                            className={`p-2.5 rounded-lg border transition-all flex items-start justify-between gap-2 group ${
                              isDone
                                ? "bg-[#111216]/60 border-[#202129] opacity-60"
                                : isGCal
                                ? "bg-[#141824] hover:bg-[#1a2132] border-sky-900/40 hover:border-sky-500/60"
                                : "bg-[#181920] hover:bg-[#20222a] border-[#262834]"
                            }`}
                          >
                            <div className="flex items-start gap-2 min-w-0">
                              <button
                                onClick={() => handleToggleActivity(act.id)}
                                className={`w-3.5 h-3.5 mt-0.5 rounded flex items-center justify-center transition-colors shrink-0 ${
                                  isDone
                                    ? "bg-white text-black font-bold"
                                    : "border border-neutral-500 group-hover:border-neutral-300"
                                }`}
                              >
                                {isDone && <span className="text-[9px] leading-none">✓</span>}
                              </button>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span
                                    className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                                      dateBadge.isToday
                                        ? "bg-white/15 text-white border border-white/30"
                                        : dateBadge.isTomorrow
                                        ? "bg-sky-400/20 text-sky-300 border border-sky-400/30"
                                        : "bg-neutral-800 text-neutral-300"
                                    }`}
                                  >
                                    {dateBadge.label}
                                  </span>
                                  <span className="text-[10px] font-mono text-neutral-400">{act.time}</span>
                                  {isGCal ? (
                                    <span className="text-[9px] font-mono px-1 rounded bg-sky-950 text-sky-300 border border-sky-800/40">
                                      GCal
                                    </span>
                                  ) : (
                                    <span className="text-[9px] font-mono px-1 rounded bg-neutral-800 text-neutral-400">
                                      {act.category}
                                    </span>
                                  )}
                                </div>
                                <p
                                  className={`text-xs mt-1 leading-snug line-clamp-2 font-medium ${
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

                            <a
                              href={act.gcalLink || "https://calendar.google.com/calendar/u/0/r"}
                              target="_blank"
                              rel="noreferrer"
                              className="shrink-0 p-1 text-neutral-400 hover:text-sky-400 transition-colors opacity-0 group-hover:opacity-100"
                              title="Open in Google Calendar"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* VIEW 2: SELECTED DAY VIEW */}
              {calendarViewMode === "day" && (
                <div className="space-y-2 animate-in fade-in duration-200">
                  {/* Activity Category / Source Filter Pills */}
                  <div className="flex items-center gap-1 text-[10px] font-mono">
                    <button
                      onClick={() => setCalendarFilter("all")}
                      className={`px-2 py-0.5 rounded transition-colors font-medium ${
                        calendarFilter === "all"
                          ? "bg-white/15 text-white border border-white/30 font-bold"
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

                  {/* Selected Date Header + Quick Add Button */}
                  <div className="flex items-center justify-between text-xs font-mono bg-[#1a1b23] p-2 rounded-lg border border-[#282a37]">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-white">
                        {selectedDateObj.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                      </span>
                      {isSelectedDateToday && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/15 text-white font-bold border border-white/30">
                          TODAY
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setShowAddActivityForm(!showAddActivityForm)}
                      className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white transition-colors flex items-center gap-0.5 font-semibold"
                    >
                      <Plus className="w-3 h-3 text-white" />
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
                        className="w-full text-xs px-2.5 py-1.5 rounded bg-[#101116] border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-white font-sans"
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
                          <option value="Personal">Personal</option>
                          <option value="Health">Health</option>
                          <option value="Spiritual">Spiritual</option>
                          <option value="Agri-Tech">Agri-Tech</option>
                        </select>
                      </div>
                      <label className="flex items-center gap-2 text-[11px] font-mono text-neutral-300 cursor-pointer pt-0.5 select-none">
                        <input
                          type="checkbox"
                          checked={newActAlsoGCal}
                          onChange={(e) => setNewActAlsoGCal(e.target.checked)}
                          className="rounded accent-white"
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
                          className="px-2.5 py-1 rounded bg-white text-black font-bold hover:bg-neutral-200 transition-colors"
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
                                    ? "bg-white text-black font-bold"
                                    : "border border-neutral-500 group-hover:border-neutral-300"
                                }`}
                              >
                                {isDone && <span className="text-[9px] leading-none">✓</span>}
                              </button>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] font-mono text-neutral-300 font-bold shrink-0">
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
                              className="shrink-0 p-1 text-neutral-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
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
              )}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* COLUMN 2: CENTER (Daily Scripture Primary, Career, YT Music) */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 space-y-5">
          {/* 2.1 SUB-TABS (Glance style: CAREER | GMAT | TECH) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#14151b] border border-[#232530] shadow-lg space-y-4">
            <div className="flex items-center gap-5 border-b border-[#232530] pb-2 text-xs font-mono tracking-wider uppercase font-bold">
              <button
                onClick={() => setCenterSubTab("google")}
                className={`transition-colors flex items-center gap-1.5 relative ${
                  centerSubTab === "google"
                    ? "text-white after:absolute after:-bottom-[9px] after:left-0 after:right-0 after:h-[2px] after:bg-white"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <span>GOOGLE CONNECTED APPS</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-300 font-normal">API</span>
              </button>

              <button
                onClick={() => setCenterSubTab("tech")}
                className={`transition-colors relative ${
                  centerSubTab === "tech"
                    ? "text-white after:absolute after:-bottom-[9px] after:left-0 after:right-0 after:h-[2px] after:bg-white"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <span>TECH INTEL</span>
              </button>
            </div>

            {/* 2.2 HIGH-DENSITY FEED CONTENT */}
            {centerSubTab === "google" && (
              <div className="space-y-3.5">
                {/* Google Calendar Live Snippet */}
                <div className="p-3 rounded-xl bg-[#181920] border border-[#262834] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white">
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Google Calendar</span>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        {customActivities.length} activities scheduled
                      </span>
                    </div>
                  </div>
                  <a
                    href="https://calendar.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-mono text-neutral-300 hover:text-white flex items-center gap-1 font-semibold"
                  >
                    <span>Open GCal</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>

                {/* Google Drive Kobo Shelf Snippet */}
                <div className="p-3 rounded-xl bg-[#181920] border border-[#262834] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white">
                      <HardDrive className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Google Drive</span>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        Cloud Vault & Kobo eReader Shelf
                      </span>
                    </div>
                  </div>
                  <a
                    href="https://drive.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-mono text-neutral-300 hover:text-white flex items-center gap-1 font-semibold"
                  >
                    <span>Open Drive</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>

                {/* YouTube Music Snippet */}
                <div className="p-3 rounded-xl bg-[#181920] border border-[#262834] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white">
                      <Music className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">YouTube Music</span>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        Personal Playlists & Stream
                      </span>
                    </div>
                  </div>
                  <a
                    href="https://music.youtube.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-mono text-neutral-300 hover:text-white flex items-center gap-1 font-semibold"
                  >
                    <span>Open YT Music</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>

                {/* Google Maps & Geospatial Telemetry Snippet */}
                <div className="p-3 rounded-xl bg-[#181920] border border-[#262834] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-blue-400">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Google Maps & Timeline</span>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        7 Strategic Hubs • 562 km Corridor Radar
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onSelectTab("google")}
                    className="text-xs font-mono text-neutral-300 hover:text-white flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <span>View Map</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Open Full Google Hub button */}
                <div className="pt-1 flex items-center justify-between border-t border-[#232530] text-xs font-mono">
                  <a
                    href="/api/auth/google/login?service=all"
                    className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold cursor-pointer"
                    title="Connect Google Calendar, Drive, and YouTube Music in one flow"
                  >
                    <span>⚡ Connect All (Calendar, Drive & Music)</span>
                  </a>
                  <button
                    onClick={() => onSelectTab("google")}
                    className="text-white hover:text-neutral-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Open Hub →</span>
                  </button>
                </div>
              </div>
            )}

            {centerSubTab === "tech" && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <a
                    href="https://news.ycombinator.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-white hover:text-neutral-300 font-semibold text-xs sm:text-sm leading-snug flex items-center gap-1 group"
                  >
                    <span>Self-Hosted Executive Dashboards: High-Performance Architecture with Next.js 16</span>
                    <span className="text-neutral-400 text-xs">↗</span>
                  </a>
                  <div className="text-xs font-mono text-neutral-300 flex items-center gap-2">
                    <span>2h · 184 points · 42 comments · nextjs.org/blog ↗</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <a
                    href="https://news.ycombinator.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-white hover:text-neutral-300 font-semibold text-xs sm:text-sm leading-snug flex items-center gap-1 group"
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
                    className="text-white hover:text-neutral-300 font-semibold text-xs sm:text-sm leading-snug flex items-center gap-1 group"
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


          </div>

          {/* 2.2 YOUTUBE MUSIC & SANCTUARY DECK */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#14151b] border border-[#232530] shadow-lg space-y-4">
            {/* Top Header & Account Sync Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#262834]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#181920] border border-[#262834] text-white shadow-sm">
                  <Headphones className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                      YouTube Music & Sanctuary Deck
                    </h3>
                    {ytConnected ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold flex items-center gap-1 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Google Connected
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#181920] text-[#8b91a0] font-medium font-mono border border-[#262834]">
                        Cloud Sync Optional
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    Curated devotional sanctuary, GMAT study flow, and real-time playback
                  </p>
                </div>
              </div>

              <button
                onClick={() => onSelectTab("music")}
                className="text-[11px] font-mono text-white hover:text-neutral-300 uppercase tracking-wider flex items-center gap-1 font-semibold transition-colors"
                title="Switch to dedicated Music tab"
              >
                <span>Open Sanctuary Deck</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* LIVE ANDROID "NOW PLAYING" DOCK (FEATURED WIDGET) */}
            <div className="relative overflow-hidden rounded-xl border border-[#262834] bg-[#181920] p-3.5 sm:p-4 shadow-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 relative z-10">
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Album Art with Vinyl / Glow Effect */}
                  <div className="relative group flex-shrink-0">
                    {displayTrack?.albumArt ? (
                      <img
                        src={displayTrack.albumArt}
                        alt={displayTrack.title}
                        className={`w-14 h-14 rounded-xl object-cover border border-[#282a38] shadow-md ${
                          isLive ? "ring-2 ring-white/50" : ""
                        }`}
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-[#14151b] border border-[#262834] flex items-center justify-center text-white">
                        <Disc className={`w-7 h-7 ${isLive ? "animate-spin text-white" : "text-neutral-600"}`} />
                      </div>
                    )}
                    {isLive && (
                      <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
                      </span>
                    )}
                  </div>

                  {/* Track Details & Status */}
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1.5 font-mono ${
                          isLive
                            ? "bg-white/10 text-white border border-white/20"
                            : "bg-[#14151b] text-[#8b91a0] border border-[#262834]"
                        }`}
                      >
                        {isLive ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            Live from Android • YouTube Music
                          </>
                        ) : (
                          "Android Mirror Standby"
                        )}
                      </span>

                      {/* Sound Equalizer Bars (When Active) */}
                      {isLive && (
                        <div className="flex items-end gap-0.5 h-2.5">
                          <span className="w-0.5 bg-white rounded-full animate-pulse h-full" />
                          <span className="w-0.5 bg-white rounded-full animate-bounce h-2/3" />
                          <span className="w-0.5 bg-white rounded-full animate-pulse h-5/6" />
                          <span className="w-0.5 bg-white rounded-full animate-bounce h-1/2" />
                        </div>
                      )}
                    </div>

                    <h4 className="font-extrabold text-sm sm:text-base text-white tracking-tight leading-tight truncate">
                      {displayTrack ? displayTrack.title : "No active track detected"}
                    </h4>
                    <p className="text-[11px] text-neutral-400 truncate">
                      {displayTrack
                        ? `${displayTrack.artist} ${displayTrack.album ? `• ${displayTrack.album}` : ""}`
                        : "Streaming standby • Toggle test demo or open Sanctuary Deck to start"}
                    </p>
                  </div>
                </div>

                {/* Interactive Controls */}
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-0 border-[#262834] font-mono shrink-0">
                  {displayTrack?.ytMusicUrl && (
                    <a
                      href={displayTrack.ytMusicUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold shadow-sm transition-all"
                    >
                      <Music className="w-3.5 h-3.5" />
                      <span>Open in YT Music</span>
                      <ExternalLink className="w-3 h-3 text-black/80" />
                    </a>
                  )}

                  <button
                    onClick={handleToggleDemo}
                    className={`text-xs px-2.5 py-1.5 rounded-xl border transition-colors ${
                      isDemo
                        ? "bg-white/10 text-white border-white/20 font-semibold"
                        : "bg-[#14151b] border-[#262834] text-neutral-400 hover:text-white"
                    }`}
                    title="Toggle demo song playback state"
                  >
                    {isDemo ? "Stop Demo" : "Test Demo"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* COLUMN 3: RIGHT (Weather, Repository, Markets)  */}
        {/* ========================================================= */}
        <div className="lg:col-span-3 space-y-5">
          {/* 3.1 WEATHER WIDGET CARD (Synced to Device GPS) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#14151b] border border-[#232530] shadow-lg space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-neutral-300 uppercase font-bold">
              <div className="flex items-center gap-1.5 text-white">
                <CloudSun className="w-3.5 h-3.5 text-white" />
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
                      ? "bg-white/15 text-white font-bold border border-white/30"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  BLR
                </button>
              </div>
            </div>

            {/* Weather Main Display */}
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
                              className="w-full bg-white rounded-t relative shadow-md transition-all"
                              style={{ height: `${heightPx}px` }}
                            >
                              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-mono text-white font-bold">
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
                              slot.isPeak ? "text-white font-bold" : "text-neutral-400 font-semibold"
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
          </div>

          {/* 3.2 INDIAN MARKETS & GROWW PORTFOLIO WIDGET CARD */}
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
                <TrendingUp className="w-3 h-3 text-white" />
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
                            ? "bg-[#181922] border-neutral-600 hover:border-neutral-400 hover:bg-[#1f212d]"
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
                                    ? "bg-white/15 text-white border border-white/25"
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
                  <div className="flex items-center gap-1.5 flex-wrap">
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

                    <button
                      onClick={handleResetToMyHoldings}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white border border-neutral-700 transition-colors"
                      title="Reload Jaison's 19 official Groww holdings"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Reload (19)</span>
                    </button>
                  </div>

                  <a
                    href="https://groww.in/dashboard/stocks/user-holdings"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-neutral-400 hover:text-white transition-colors"
                    title="Open your holdings in Groww app"
                  >
                    <span>Groww App</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Helper Banner for File Selection */}
                <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 bg-[#121319] px-2.5 py-1.5 rounded-lg border border-[#232530]">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-[#00d09c] font-bold">Target File:</span>
                    <span className="text-neutral-300 truncate font-semibold">Stocks_Holdings_Statement_...csv</span>
                  </div>
                  <a
                    href="/groww-holdings-statement.csv"
                    download="Stocks_Holdings_Statement_8287432555_2026-11-15.csv"
                    className="text-neutral-400 hover:text-white transition-colors underline shrink-0 pl-1"
                    title="Download clean holdings CSV file"
                  >
                    Download CSV
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
              Sync your live Google Calendar agenda into your personal dashboard to view your meetings, sprint reviews, and day-to-day commitments alongside your routines.
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

            {/* 1-Click Instant Sync */}
            <div className="p-3.5 rounded-xl bg-[#171821] border border-sky-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono uppercase tracking-wider text-sky-300 font-bold flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
                  Instant Google Calendar Sync
                </label>
                <button
                  type="button"
                  onClick={() => syncGCal()}
                  disabled={gcalLoading}
                  className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-sky-500 hover:bg-sky-400 text-neutral-950 transition-colors flex items-center gap-1.5 disabled:opacity-50 shadow-md"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${gcalLoading ? "animate-spin" : ""}`} />
                  <span>{gcalLoading ? "Syncing..." : "Sync Upcoming Events Now"}</span>
                </button>
              </div>
              <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                Fetches and synchronizes all upcoming Google Calendar meetings, reviews, and agenda items onto your calendar days.
              </p>
            </div>

            {/* Option 1: Live iCal URL Sync */}
            <div className="space-y-2 p-3.5 rounded-xl bg-[#171821] border border-[#262834]">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-200 font-bold flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5 text-white" />
                  Option 1: Live iCal Link (Auto-Sync)
                </label>
              </div>
              <input
                type="text"
                placeholder="https://calendar.google.com/calendar/ical/.../basic.ics"
                value={gcalIcsUrl}
                onChange={(e) => setGcalIcsUrl(e.target.value)}
                className="w-full text-xs font-mono px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-white"
              />
              <div className="p-2.5 rounded-lg bg-neutral-900/70 border border-neutral-800 text-[11px] font-mono text-neutral-400 space-y-1">
                <div className="text-neutral-200 font-semibold">Quick setup steps:</div>
                <div>1. Open <a href="https://calendar.google.com/calendar/u/0/r/settings" target="_blank" rel="noreferrer" className="text-white underline font-semibold">Google Calendar Settings ↗</a></div>
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
              <div className="text-xs font-mono p-2.5 rounded-xl bg-neutral-900 text-neutral-200 border border-neutral-800">
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
                  className="px-4 py-1.5 rounded-xl text-xs font-mono font-bold bg-white text-black hover:bg-neutral-200 transition-colors disabled:opacity-50 flex items-center gap-1.5"
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
