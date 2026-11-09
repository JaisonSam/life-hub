"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Sparkles,
  Briefcase,
  Target,
  Sprout,
  Library,
  Music,
  BookOpen,
  Flame,
  ArrowUpRight,
  ChevronRight,
  Clock,
  CheckCircle2,
  Circle,
  TrendingUp,
  Bookmark,
  ShieldCheck,
  BookMarked,
  MapPin,
} from "lucide-react";

interface Habit {
  id: string;
  name: string;
  category: "Spiritual" | "Health" | "Growth";
  streak: number;
  completedToday: boolean;
}

interface ExecutiveBentoDeckProps {
  onSelectTab: (tabId: "career" | "gmat" | "farm" | "books" | "bible" | "habits" | "projects" | "music") => void;
  completedHabitsCount: number;
  habits: Habit[];
  onToggleHabit: (id: string) => void;
  currentTime: string;
  currentDate: string;
  greeting: string;
  verseBookmarked: boolean;
  onToggleBookmarkVerse: () => void;
}

const ROLES = [
  "Senior ERP Business Analyst • Schneider Electric",
  "GMAT Focus Edition 715+ Sprint (99th %ile)",
  "Veerakeralapudur Agribusiness & Cash Flow Engineer",
  "Kobo Intellectual Hub & Strategic Mental Models",
];

export default function ExecutiveBentoDeck({
  onSelectTab,
  completedHabitsCount,
  habits,
  onToggleHabit,
  currentTime,
  currentDate,
  greeting,
  verseBookmarked,
  onToggleBookmarkVerse,
}: ExecutiveBentoDeckProps) {
  const habitCompletionPct = habits.length > 0 ? Math.round((completedHabitsCount / habits.length) * 100) : 0;

  // EkiZR-inspired Typewriter Subtitle Effect
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const handleTyping = useCallback(() => {
    const currentWord = ROLES[roleIndex];
    if (isTyping) {
      if (charIndex < currentWord.length) {
        setTypedText(currentWord.slice(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      } else {
        setTimeout(() => setIsTyping(false), 2400);
      }
    } else {
      if (charIndex > 0) {
        setTypedText(currentWord.slice(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
      } else {
        setRoleIndex((prev) => (prev + 1) % ROLES.length);
        setIsTyping(true);
      }
    }
  }, [charIndex, isTyping, roleIndex]);

  useEffect(() => {
    const timer = setTimeout(handleTyping, isTyping ? 50 : 25);
    return () => clearTimeout(timer);
  }, [handleTyping, isTyping]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative z-10">
      {/* 1. ZEN SANCTUARY HERO BANNER WITH EKIZR BACKLIT GLOW */}
      <div className="relative group">
        {/* EkiZR Floating Ambient Underlay */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/30 via-indigo-500/20 to-purple-600/30 rounded-3xl blur-xl opacity-40 group-hover:opacity-70 transition duration-1000 pointer-events-none" />

        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 bg-[#0b0c16]/85 backdrop-blur-2xl border border-white/[0.09] shadow-2xl">
          {/* Subtle Ambient Radial Glows */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-subtle-pulse" />
          <div className="absolute bottom-0 left-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-3.5 max-w-2xl">
              {/* EkiZR-Style Double-Ring Backlit Status Badge */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative group/badge inline-block">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#f59e0b] via-[#6366f1] to-[#10b981] rounded-full blur opacity-35 group-hover/badge:opacity-65 transition duration-500" />
                  <div className="relative px-3.5 py-1.5 rounded-full bg-[#030014]/90 backdrop-blur-xl border border-white/10 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase bg-gradient-to-r from-amber-200 via-white to-indigo-200 bg-clip-text text-transparent font-semibold">
                      READY TO INNOVATE • BLR {currentTime}
                    </span>
                  </div>
                </div>

                <span className="text-[11px] font-mono text-neutral-400">
                  {currentDate}
                </span>
              </div>

              {/* Greeting */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.15]">
                {greeting},{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-orange-400 font-extrabold">
                  Jaison.
                </span>
              </h1>

              {/* EkiZR Typewriter Subtitle */}
              <div className="h-6 flex items-center">
                <span className="text-xs sm:text-sm md:text-base font-mono bg-gradient-to-r from-indigo-200 via-purple-200 to-amber-200 bg-clip-text text-transparent font-medium">
                  {typedText}
                </span>
                <span className="w-[2px] h-4 bg-gradient-to-t from-amber-400 to-indigo-400 inline-block ml-1 animate-blink" />
              </div>

              {/* Scripture Anchor in Editorial Serif */}
              <p className="text-sm sm:text-base text-neutral-300 font-serif italic leading-relaxed border-l-2 border-amber-500/40 pl-4 py-1">
                "Commit your actions to the LORD, and your plans will succeed."
                <span className="block not-italic text-xs text-amber-400/80 font-mono mt-1 font-normal">
                  — Proverbs 16:3
                </span>
              </p>
            </div>

            {/* Quick Metrics Capsule */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 shrink-0">
              {/* Daily Habit Progress Radial / Metric */}
              <div className="p-4 rounded-2xl glass-card flex items-center gap-4 border border-white/[0.08]">
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <svg className="w-14 h-14 -rotate-90 transform" viewBox="0 0 36 36">
                    <path
                      className="text-neutral-800"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-amber-400 transition-all duration-700 ease-out"
                      strokeDasharray={`${habitCompletionPct}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute font-mono text-xs font-bold text-amber-300">
                    {habitCompletionPct}%
                  </span>
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">Habit Cadence</div>
                  <div className="text-sm font-bold text-white font-mono mt-0.5">
                    {completedHabitsCount} of {habits.length} Complete
                  </div>
                  <div className="text-[11px] text-emerald-400 font-mono mt-0.5">Active Compounding</div>
                </div>
              </div>

              {/* Bookmark Daily Verse Button */}
              <button
                onClick={onToggleBookmarkVerse}
                className={`p-4 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1 min-w-[76px] ${
                  verseBookmarked
                    ? "bg-amber-500/20 border-amber-500/50 text-amber-300"
                    : "glass-card text-neutral-400 hover:text-white"
                }`}
                title="Bookmark verse"
              >
                <Bookmark className="w-5 h-5" />
                <span className="text-[10px] font-mono uppercase">{verseBookmarked ? "Saved" : "Save"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. EXECUTIVE BENTO GRID WITH EKIZR BACKLIT HALO CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* CARD 1: CAREER BRANDING & BANGALORE RADAR */}
        <div
          onClick={() => onSelectTab("career")}
          className="relative group cursor-pointer"
        >
          {/* EkiZR Ambient Backlight */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-lg opacity-0 group-hover:opacity-45 transition-all duration-700 pointer-events-none" />

          <div className="relative rounded-3xl p-6 bg-[#0b0c16]/85 backdrop-blur-xl border border-white/[0.08] group-hover:border-blue-500/40 flex flex-col justify-between space-y-4 h-full transform transition-all duration-500 group-hover:scale-[1.015] group-hover:-translate-y-1">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
                  <ShieldCheck className="w-3 h-3" />
                  Executive Career
                </span>
                <div className="w-7 h-7 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-neutral-950 transition-colors">
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                  Senior ERP Business Analyst
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Schneider Electric • 6 European plant deployments • 2,500+ users enabled.
                </p>
              </div>

              {/* Quick Metrics Strip */}
              <div className="p-3 rounded-2xl bg-[#030014]/60 border border-white/[0.05] grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-neutral-400 font-mono">Openings Desk:</span>
                  <p className="text-base font-bold text-white font-mono">10 Curated Roles</p>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 font-mono">Target CTC:</span>
                  <p className="text-base font-bold text-emerald-400 font-mono">₹28L - ₹52L</p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold text-blue-400">
              <span>Explore Bangalore Job Radar & Pitch Copier</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* CARD 2: GMAT 715+ FOCUS SPRINT */}
        <div
          onClick={() => onSelectTab("gmat")}
          className="relative group cursor-pointer"
        >
          {/* EkiZR Ambient Backlight */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl blur-lg opacity-0 group-hover:opacity-45 transition-all duration-700 pointer-events-none" />

          <div className="relative rounded-3xl p-6 bg-[#0b0c16]/85 backdrop-blur-xl border border-white/[0.08] group-hover:border-amber-500/40 flex flex-col justify-between space-y-4 h-full transform transition-all duration-500 group-hover:scale-[1.015] group-hover:-translate-y-1">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                  <Target className="w-3 h-3" />
                  Sprint Target 715+
                </span>
                <div className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-neutral-950 transition-colors">
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                  GMAT Focus Edition Center
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  mba.com Mock Scorecard Engine • Percentile Ladder • 60-Min Timer.
                </p>
              </div>

              {/* Trajectory Box */}
              <div className="p-3 rounded-2xl bg-[#030014]/60 border border-white/[0.05] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-neutral-400 font-mono">Last Mock Score:</span>
                  <p className="text-xl font-black font-mono text-amber-400">675 <span className="text-[11px] font-normal text-neutral-400">(95th %ile)</span></p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-neutral-400 font-mono">Target Delta:</span>
                  <p className="text-xs font-bold font-mono text-emerald-400">+40 pts to 715+</p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold text-amber-400">
              <span>Launch 60-Min Sprint & Score Tracker</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* CARD 3: STRATEGIC BOOKSHELF & KOBO DIGEST */}
        <div
          onClick={() => onSelectTab("books")}
          className="relative group cursor-pointer"
        >
          {/* EkiZR Ambient Backlight */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-lg opacity-0 group-hover:opacity-45 transition-all duration-700 pointer-events-none" />

          <div className="relative rounded-3xl p-6 bg-[#0b0c16]/85 backdrop-blur-xl border border-white/[0.08] group-hover:border-purple-500/40 flex flex-col justify-between space-y-4 h-full transform transition-all duration-500 group-hover:scale-[1.015] group-hover:-translate-y-1">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold">
                  <Library className="w-3 h-3" />
                  Strategic Bookshelf
                </span>
                <div className="w-7 h-7 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-neutral-950 transition-colors">
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                  Kobo E-Reader & Daily Digest
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Google Drive EPUB bookshelf • In-browser reader • Farnam Street & Aeon spotlight.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#030014]/60 border border-white/[0.05] space-y-1">
                <div className="text-[10px] font-mono text-purple-300 flex items-center gap-1">
                  <BookMarked className="w-3 h-3" />
                  TODAY'S INTELLECTUAL READ
                </div>
                <p className="text-xs font-semibold text-neutral-200 line-clamp-1">
                  Farnam Street: The Map is Not the Territory & Mental Models
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold text-purple-400">
              <span>Read EPUBs & Aeon Essays</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* CARD 4: VEERAKERALAPUDUR AGRIBUSINESS */}
        <div
          onClick={() => onSelectTab("farm")}
          className="relative group cursor-pointer"
        >
          {/* EkiZR Ambient Backlight */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl blur-lg opacity-0 group-hover:opacity-45 transition-all duration-700 pointer-events-none" />

          <div className="relative rounded-3xl p-6 bg-[#0b0c16]/85 backdrop-blur-xl border border-white/[0.08] group-hover:border-emerald-500/40 flex flex-col justify-between space-y-4 h-full transform transition-all duration-500 group-hover:scale-[1.015] group-hover:-translate-y-1">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  <Sprout className="w-3 h-3" />
                  Agribusiness Modeler
                </span>
                <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-neutral-950 transition-colors">
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Veerakeralapudur Farm ROI
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  High-Density Guava • Perennial Moringa • Free-Range Chicken • CapEx Tracker.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#030014]/60 border border-white/[0.05] grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-neutral-400 font-mono">Top Crop Revenue:</span>
                  <p className="text-base font-bold text-emerald-400 font-mono">₹1.80L / yr</p>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 font-mono">CapEx Budget:</span>
                  <p className="text-base font-bold text-neutral-200 font-mono">₹1.50L Cap</p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold text-emerald-400">
              <span>Simulate Crop Yields & Payback</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* CARD 5: MUSIC & SANCTUARY EQUALIZER */}
        <div
          onClick={() => onSelectTab("music")}
          className="relative group cursor-pointer"
        >
          {/* EkiZR Ambient Backlight */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl blur-lg opacity-0 group-hover:opacity-45 transition-all duration-700 pointer-events-none" />

          <div className="relative rounded-3xl p-6 bg-[#0b0c16]/85 backdrop-blur-xl border border-white/[0.08] group-hover:border-cyan-500/40 flex flex-col justify-between space-y-4 h-full transform transition-all duration-500 group-hover:scale-[1.015] group-hover:-translate-y-1">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                  <Music className="w-3 h-3" />
                  Music Sanctuary
                </span>
                <div className="w-7 h-7 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-neutral-950 transition-colors">
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Worship & Deep Focus Deck
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Curated acoustic worship, ambient focus beats, and live sound equalizer.
                </p>
              </div>

              {/* Audio Wave Animation */}
              <div className="p-3 rounded-2xl bg-[#030014]/60 border border-white/[0.05] flex items-center justify-between">
                <div className="flex items-center gap-1.5 h-6">
                  <span className="w-1 bg-cyan-400 h-3 rounded-full animate-pulse" />
                  <span className="w-1 bg-cyan-400 h-5 rounded-full animate-pulse delay-75" />
                  <span className="w-1 bg-cyan-400 h-2 rounded-full animate-pulse delay-150" />
                  <span className="w-1 bg-cyan-400 h-6 rounded-full animate-pulse delay-300" />
                  <span className="w-1 bg-cyan-400 h-4 rounded-full animate-pulse delay-200" />
                </div>
                <span className="text-xs font-mono text-neutral-400">Acoustic & Sanctuary</span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold text-cyan-400">
              <span>Open Music Player & Playlists</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* CARD 6: DAILY HABITS QUICK CHECK-IN */}
        <div className="relative group">
          {/* EkiZR Ambient Backlight */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-500 to-amber-600 rounded-3xl blur-lg opacity-0 group-hover:opacity-45 transition-all duration-700 pointer-events-none" />

          <div className="relative rounded-3xl p-6 bg-[#0b0c16]/85 backdrop-blur-xl border border-white/[0.08] group-hover:border-rose-500/40 flex flex-col justify-between space-y-4 h-full transform transition-all duration-500 group-hover:scale-[1.015] group-hover:-translate-y-1">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold">
                  <Flame className="w-3 h-3" />
                  Daily Discipline
                </span>
                <button
                  onClick={() => onSelectTab("habits")}
                  className="w-7 h-7 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:bg-rose-500 group-hover:text-neutral-950 transition-colors"
                >
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">
                  Friction-Free Check-In
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Check off your key habits right here without leaving:
                </p>
              </div>

              {/* Interactive Habit List */}
              <div className="space-y-2 pt-1">
                {habits.slice(0, 4).map((habit) => (
                  <div
                    key={habit.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleHabit(habit.id);
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                      habit.completedToday
                        ? "bg-amber-500/15 border-amber-500/40 text-amber-200"
                        : "bg-[#030014]/60 border-white/[0.05] text-neutral-400 hover:border-white/[0.18] hover:text-neutral-200"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 text-xs font-medium">
                      {habit.completedToday ? (
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-neutral-600 shrink-0" />
                      )}
                      <span className={habit.completedToday ? "line-through opacity-80" : ""}>
                        {habit.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-amber-400/90">
                      🔥 {habit.streak}d
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div
              onClick={() => onSelectTab("habits")}
              className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold text-rose-400 cursor-pointer"
            >
              <span>Open Complete Habits Matrix</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
