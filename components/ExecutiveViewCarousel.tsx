"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  ArrowUpRight,
  ShieldCheck,
  Target,
  Timer,
  Sprout,
  Coins,
  Library,
  BookMarked,
  BookOpen,
  Heart,
  Flame,
  CheckCircle2,
  FolderKanban,
  TrendingUp,
  Headphones,
  Music,
  Sparkles,
  Maximize2,
  Compass,
} from "lucide-react";

export type ViewTabId =
  | "career"
  | "gmat"
  | "farm"
  | "books"
  | "bible"
  | "habits"
  | "projects"
  | "music";

interface CarouselViewItem {
  id: ViewTabId;
  title: string;
  category: string;
  badge: string;
  roleSubtitle: string;
  description: string;
  icon: React.ElementType;
  glowColor: string; // Tailwind glow / gradient classes
  haloColor: string; // Hex for inline radial glow
  accentBorder: string;
  badgeBg: string;
  badgeText: string;
  metrics: Array<{ label: string; value: string }>;
  actionLabel: string;
}

interface ExecutiveViewCarouselProps {
  onSelectTab: (tabId: ViewTabId) => void;
  completedHabitsCount: number;
  totalHabitsCount: number;
  projectsCount?: number;
}

export default function ExecutiveViewCarousel({
  onSelectTab,
  completedHabitsCount,
  totalHabitsCount,
  projectsCount = 6,
}: ExecutiveViewCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Hover on adjacent cards or tabs smoothly rotates the carousel
  const handleCardHover = useCallback((index: number, isCenter: boolean) => {
    if (isCenter) return;
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveIndex(index);
    }, 140);
  }, []);

  const handleCardLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  const views: CarouselViewItem[] = [
    {
      id: "career",
      title: "Senior ERP Business Analyst",
      category: "Executive Career",
      badge: "10 Bangalore Roles • ₹28L-₹52L",
      roleSubtitle: "Schneider Electric • 6 European Plant Deployments",
      description: "Direct talent radar connecting to Tier-1 recruiters at Schneider, Siemens, ABB, and Honeywell in Bangalore with 1-click tailored executive pitches.",
      icon: ShieldCheck,
      glowColor: "from-blue-600 via-indigo-600 to-cyan-500",
      haloColor: "rgba(59, 130, 246, 0.25)",
      accentBorder: "group-hover:border-blue-500/50",
      badgeBg: "bg-blue-500/10 border-blue-500/20",
      badgeText: "text-blue-400",
      metrics: [
        { label: "Openings Desk", value: "10 Curated Roles" },
        { label: "Target CTC", value: "₹28L - ₹52L" },
        { label: "Status", value: "Pitch Ready" },
      ],
      actionLabel: "Launch Bangalore Job Radar & Pitch Copier",
    },
    {
      id: "gmat",
      title: "GMAT Focus Edition 715+ Sprint",
      category: "Executive Growth",
      badge: "Target: 715+ (99th %ile)",
      roleSubtitle: "December 2026 Exam Target • ~45 Days Runway",
      description: "Intensive 60-minute daily compounding desk featuring Quant & Data Insights error-trap logging, timing-pressure tactics, and mock score trajectory tracking.",
      icon: Target,
      glowColor: "from-indigo-600 via-purple-600 to-violet-500",
      haloColor: "rgba(99, 102, 241, 0.25)",
      accentBorder: "group-hover:border-indigo-500/50",
      badgeBg: "bg-indigo-500/10 border-indigo-500/20",
      badgeText: "text-indigo-400",
      metrics: [
        { label: "Daily Sprint", value: "60-Min Stopwatch" },
        { label: "Diagnostic", value: "Quant & DI Traps" },
        { label: "Mock Radar", value: "Score Tracking" },
      ],
      actionLabel: "Enter GMAT Sprint Sanctuary & Timer",
    },
    {
      id: "farm",
      title: "Veerakeralapudur Agribusiness Modeler",
      category: "Agribusiness & Cash Flow",
      badge: "0.25 Acre (11 Cents)",
      roleSubtitle: "Tenkasi District, TN • High-Density Horticulture",
      description: "Scientific agro-forestry financial engineering for 0.25-acre land in Veerakeralapudur: Taiwan Pink Guava, dwarf coconuts, free-range native poultry & CapEx modeling.",
      icon: Sprout,
      glowColor: "from-emerald-500 via-teal-600 to-green-500",
      haloColor: "rgba(16, 185, 129, 0.25)",
      accentBorder: "group-hover:border-emerald-500/50",
      badgeBg: "bg-emerald-500/10 border-emerald-500/20",
      badgeText: "text-emerald-400",
      metrics: [
        { label: "Budgeted CapEx", value: "₹1,15,000" },
        { label: "Target Harvest", value: "₹1,85,000/yr" },
        { label: "Farming Mode", value: "High-Density" },
      ],
      actionLabel: "Open Agribusiness Cash Flow Modeler",
    },
    {
      id: "books",
      title: "Strategic Bookshelf & Kobo E-Reader",
      category: "Intellectual Digest",
      badge: "Google Drive Synced",
      roleSubtitle: "Curated Daily Strategic Reads & Aeon Essays",
      description: "Revolving around your Google Drive EPUBs with built-in in-browser reader, Aeon philosophical essay recommendations, and a commonplace notebook for synthesized models.",
      icon: Library,
      glowColor: "from-amber-500 via-indigo-600 to-purple-600",
      haloColor: "rgba(245, 158, 11, 0.25)",
      accentBorder: "group-hover:border-amber-500/50",
      badgeBg: "bg-amber-500/10 border-amber-500/20",
      badgeText: "text-amber-400",
      metrics: [
        { label: "Daily Read", value: "Aeon + Tech" },
        { label: "E-Reader", value: "EPUB Cloud Sync" },
        { label: "Commonplace", value: "Mental Models" },
      ],
      actionLabel: "Launch Kobo E-Reader & Bookshelf",
    },
    {
      id: "bible",
      title: "Bible Study Organiser & Devotional",
      category: "Spiritual Pillar",
      badge: "Book of Romans Companion",
      roleSubtitle: "Android YouVersion Sync • Daily Scripture Anchor",
      description: "Comprehensive spiritual sanctuary featuring daily inspired verses with personal reflections, translation switchers (NIV/ESV/NLT), and chapter-by-chapter study notes.",
      icon: BookOpen,
      glowColor: "from-amber-400 via-orange-500 to-yellow-600",
      haloColor: "rgba(245, 158, 11, 0.3)",
      accentBorder: "group-hover:border-amber-400/50",
      badgeBg: "bg-amber-500/10 border-amber-500/20",
      badgeText: "text-amber-300",
      metrics: [
        { label: "Daily Scripture", value: "Verse & Reflection" },
        { label: "Study Text", value: "Book of Romans" },
        { label: "App Link", value: "YouVersion Android" },
      ],
      actionLabel: "Enter Bible Sanctuary & Study Desk",
    },
    {
      id: "habits",
      title: "Daily Habit Compounding Engine",
      category: "Discipline & Health",
      badge: `${completedHabitsCount} of ${totalHabitsCount} Completed`,
      roleSubtitle: "Spiritual, Physical & Intellectual Streaks",
      description: "Track the atomic disciplines that compound into greatness. Real-time checklist and streak tracking for morning prayer, GMAT prep, gym workouts, and clean diet.",
      icon: Flame,
      glowColor: "from-orange-500 via-amber-500 to-red-500",
      haloColor: "rgba(249, 115, 22, 0.25)",
      accentBorder: "group-hover:border-orange-500/50",
      badgeBg: "bg-orange-500/10 border-orange-500/20",
      badgeText: "text-orange-400",
      metrics: [
        { label: "Today's Score", value: `${Math.round((completedHabitsCount / Math.max(1, totalHabitsCount)) * 100)}%` },
        { label: "Active Streaks", value: "Daily Momentum" },
        { label: "Habit Target", value: "3 Core Pillars" },
      ],
      actionLabel: "Open Daily Habit Tracker & Streaks",
    },
    {
      id: "projects",
      title: "Active Deliverables & Projects Tracker",
      category: "Operational Execution",
      badge: `${projectsCount} Active Workstreams`,
      roleSubtitle: "Schneider ERP Rollouts, Life Systems & Agro Milestones",
      description: "Deliverable monitoring with milestone progress bars, category tags, and priority tracking to ensure zero execution leakage across enterprise and personal goals.",
      icon: FolderKanban,
      glowColor: "from-cyan-500 via-blue-600 to-indigo-600",
      haloColor: "rgba(6, 182, 212, 0.25)",
      accentBorder: "group-hover:border-cyan-500/50",
      badgeBg: "bg-cyan-500/10 border-cyan-500/20",
      badgeText: "text-cyan-400",
      metrics: [
        { label: "Deliverables", value: `${projectsCount} Workstreams` },
        { label: "Velocity", value: "Weekly Milestones" },
        { label: "Scope", value: "Enterprise & Life" },
      ],
      actionLabel: "Review Active Deliverables & Milestones",
    },
    {
      id: "music",
      title: "YouTube Music & Worship Sanctuary",
      category: "Devotional & Focus",
      badge: "Android Live Mirror",
      roleSubtitle: "Worship Hymns, 432Hz Study Flow & Gym Hype",
      description: "Hand-crafted audio sanctuary with 8 curated listening rooms, instant launch in YouTube Music, and free real-time background playback tracking via Last.fm.",
      icon: Headphones,
      glowColor: "from-rose-500 via-red-600 to-pink-600",
      haloColor: "rgba(244, 63, 94, 0.25)",
      accentBorder: "group-hover:border-rose-500/50",
      badgeBg: "bg-rose-500/10 border-rose-500/20",
      badgeText: "text-rose-400",
      metrics: [
        { label: "Soundscapes", value: "8 Curated Rooms" },
        { label: "Android Sync", value: "Last.fm Scrobbler" },
        { label: "Ecosystem", value: "Google Connected" },
      ],
      actionLabel: "Launch YouTube Music Sanctuary Deck",
    },
  ];

  const total = views.length;

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Autoplay timer with pause on hover
  useEffect(() => {
    if (!isAutoplay || isHovered) return;
    const interval = setInterval(handleNext, 5500);
    return () => clearInterval(interval);
  }, [handleNext, isAutoplay, isHovered]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartXRef.current || !touchEndXRef.current) return;
    const distance = touchStartXRef.current - touchEndXRef.current;
    if (distance > 50) {
      handleNext();
    } else if (distance < -50) {
      handlePrev();
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  const activeItem = views[activeIndex];

  return (
    <div
      className="relative space-y-6 pt-2 pb-6"
      data-aos="fade-up"
      data-aos-duration="700"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Controls Strip: Section Title + Pagination Indicator + Play/Pause & Arrow Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-indigo-500 to-purple-600 rounded-xl blur-sm opacity-50 animate-pulse" />
            <div className="relative p-2 rounded-xl bg-[#0b0c16] border border-white/10 text-amber-400">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Executive View Deck
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono font-semibold">
                  3D Coverflow
                </span>
              </h2>
            </div>
            <p className="text-xs text-neutral-400">
              Glide through all 8 operational sanctuaries • Click any card or action pill to enter view
            </p>
          </div>
        </div>

        {/* Carousel Control Buttons */}
        <div className="flex items-center gap-2">
          {/* Autoplay Toggle */}
          <button
            onClick={() => setIsAutoplay(!isAutoplay)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
              isAutoplay
                ? "bg-amber-500/10 border-amber-500/30 text-amber-300 shadow-sm shadow-amber-500/20"
                : "bg-neutral-900/80 border-white/10 text-neutral-400 hover:text-white"
            }`}
            title={isAutoplay ? "Pause Autoplay" : "Start Autoplay"}
          >
            {isAutoplay ? (
              <>
                <Pause className="w-3 h-3 text-amber-400" />
                <span className="text-[10px] uppercase font-bold tracking-wider">Auto On</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-neutral-400" />
                <span className="text-[10px] uppercase font-bold tracking-wider">Auto Off</span>
              </>
            )}
          </button>

          {/* Previous Arrow */}
          <button
            onClick={handlePrev}
            className="p-2 rounded-xl bg-neutral-900/80 border border-white/10 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-all hover:scale-105 active:scale-95 shadow-md"
            title="Previous view (or Left Arrow)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Index Counter Indicator */}
          <div className="px-3 py-1 rounded-xl bg-neutral-950/80 border border-white/10 text-xs font-mono text-neutral-300">
            <span className="text-amber-400 font-bold">{activeIndex + 1}</span>
            <span className="text-neutral-500"> / {total}</span>
          </div>

          {/* Next Arrow */}
          <button
            onClick={handleNext}
            className="p-2 rounded-xl bg-neutral-900/80 border border-white/10 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-all hover:scale-105 active:scale-95 shadow-md"
            title="Next view (or Right Arrow)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3D COVERFLOW STAGE */}
      <div className="relative w-full h-[400px] sm:h-[420px] flex items-center justify-center overflow-hidden py-4 perspective-1000">
        {/* Ambient Backlight Halo mirroring the active card */}
        <div
          className="absolute w-[500px] h-[300px] rounded-full blur-[100px] pointer-events-none -z-10"
          style={{
            backgroundColor: activeItem.haloColor,
            transition: "all 900ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />

        {/* Carousel Cards Container */}
        <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
          {views.map((item, index) => {
            const Icon = item.icon;
            // Circular offset calculation
            let offset = (index - activeIndex + total) % total;
            if (offset > total / 2) offset -= total; // range: e.g. -3, -2, -1, 0, 1, 2, 3

            const isCenter = offset === 0;
            const absOffset = Math.abs(offset);

            // Hide cards beyond 2 steps away
            if (absOffset > 2) return null;

            // Geometry calculations for Apple 3D Coverflow
            let translateX = "0%";
            let translateZ = "0px";
            let rotateY = "0deg";
            let scale = 1;
            let opacity = 1;
            let zIndex = 30;

            if (isCenter) {
              translateX = "0%";
              translateZ = "50px";
              rotateY = "0deg";
              scale = 1;
              opacity = 1;
              zIndex = 30;
            } else if (offset === -1) {
              // Left immediate neighbor
              translateX = "-58%";
              translateZ = "-30px";
              rotateY = "14deg";
              scale = 0.88;
              opacity = 0.65;
              zIndex = 20;
            } else if (offset === 1) {
              // Right immediate neighbor
              translateX = "58%";
              translateZ = "-30px";
              rotateY = "-14deg";
              scale = 0.88;
              opacity = 0.65;
              zIndex = 20;
            } else if (offset === -2) {
              // Far left
              translateX = "-96%";
              translateZ = "-90px";
              rotateY = "22deg";
              scale = 0.76;
              opacity = 0.25;
              zIndex = 10;
            } else if (offset === 2) {
              // Far right
              translateX = "96%";
              translateZ = "-90px";
              rotateY = "-22deg";
              scale = 0.76;
              opacity = 0.25;
              zIndex = 10;
            }

            return (
              <div
                key={item.id}
                onClick={() => {
                  if (isCenter) {
                    onSelectTab(item.id);
                  } else {
                    setActiveIndex(index);
                  }
                }}
                onMouseEnter={() => handleCardHover(index, isCenter)}
                onMouseLeave={handleCardLeave}
                style={{
                  transform: `translateX(${translateX}) translateZ(${translateZ}) rotateY(${rotateY}) scale(${scale})`,
                  opacity,
                  zIndex,
                  transition: "all 800ms cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                className={`absolute w-[90%] sm:w-[540px] md:w-[600px] h-[340px] sm:h-[350px] rounded-3xl p-6 sm:p-7 flex flex-col justify-between cursor-pointer select-none group border transition-shadow duration-700 backdrop-blur-2xl ${
                  isCenter
                    ? "bg-[#0b0c16]/95 border-white/[0.14] shadow-2xl shadow-black/80 ring-1 ring-white/10"
                    : "bg-[#0b0c16]/75 border-white/[0.06] hover:border-white/20 hover:opacity-85"
                }`}
              >
                {/* Glowing edge highlight for active card */}
                {isCenter && (
                  <div className={`absolute -inset-[1px] bg-gradient-to-r ${item.glowColor} rounded-3xl opacity-35 blur-sm pointer-events-none group-hover:opacity-60 transition duration-500 -z-10`} />
                )}

                {/* Top Row: Category Badge + Status + Action Arrow */}
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase font-bold border ${item.badgeBg} ${item.badgeText}`}>
                        <Icon className="w-3.5 h-3.5" />
                        {item.category}
                      </span>
                      <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.05] text-neutral-400 border border-white/[0.05]">
                        {item.badge}
                      </span>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-neutral-300 group-hover:bg-amber-500 group-hover:text-neutral-950 transition-all duration-300">
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight group-hover:text-amber-200 transition-colors flex items-center gap-2">
                      {item.title}
                    </h3>
                    <p className="text-xs font-mono text-neutral-400 mt-1">
                      {item.roleSubtitle}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-neutral-300 leading-relaxed line-clamp-2 sm:line-clamp-3">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Row: 3 Live KPI Metrics + Action Pill */}
                <div className="space-y-3 pt-3 border-t border-white/[0.08]">
                  <div className="grid grid-cols-3 gap-2">
                    {item.metrics.map((m, mi) => (
                      <div
                        key={mi}
                        className="p-2 sm:p-2.5 rounded-2xl bg-neutral-950/60 border border-white/[0.05] flex flex-col justify-center"
                      >
                        <span className="text-[9px] uppercase tracking-wider font-mono text-neutral-400 truncate">
                          {m.label}
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-white font-mono mt-0.5 truncate">
                          {m.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Launch Pill */}
                  <div className="flex items-center justify-between text-xs font-semibold text-amber-400 group-hover:text-amber-300">
                    <span className="truncate">{item.actionLabel}</span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300">
                      Enter →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BOTTOM PAGINATION DOCK & THUMBNAIL PILLS */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-2">
        {views.map((v, vi) => {
          const isActive = vi === activeIndex;
          const VIcon = v.icon;
          return (
            <button
              key={v.id}
              onClick={() => setActiveIndex(vi)}
              onMouseEnter={() => {
                if (vi !== activeIndex) {
                  handleCardHover(vi, false);
                }
              }}
              onMouseLeave={handleCardLeave}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? "bg-amber-500 text-neutral-950 font-bold shadow-lg shadow-amber-500/25 scale-105"
                  : "bg-neutral-900/60 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-white/5"
              }`}
            >
              <VIcon className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="hidden md:inline whitespace-nowrap">{v.category}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-950 animate-pulse ml-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
