"use client";

import React, { useState } from "react";
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
  Coins,
  Compass,
  Sliders,
  Volume2,
  Play,
  Check,
  Bookmark,
  ShieldCheck,
  Award,
  Cpu,
  Layers,
  Building2,
  ExternalLink,
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

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* 1. ZEN SANCTUARY HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 glass-panel border border-white/[0.08] shadow-2xl">
        {/* Subtle Ambient Radial Glow (Anime.js style) */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-subtle-pulse" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            {/* Technical Index Header (Wodniack style) */}
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                DAILY SANCTUARY • OVERVIEW
              </span>
              <span className="text-[11px] font-mono text-neutral-400">
                {currentDate}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium text-white tracking-tight leading-[1.15]">
              {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-orange-400 font-semibold">Jaison.</span>
            </h1>

            {/* Scripture Anchor in Editorial Serif */}
            <p className="text-sm sm:text-base text-neutral-300 font-serif italic leading-relaxed border-l-2 border-amber-500/40 pl-4 py-1">
              "Commit your actions to the LORD, and your plans will succeed."
              <span className="block not-italic text-xs text-amber-400/80 font-mono mt-1 font-normal">— Proverbs 16:3</span>
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

      {/* 2. EXECUTIVE BENTO GRID (Decluttered, Modern, High-Signal) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* CARD 1: CAREER BRANDING & BANGALORE RADAR */}
        <div
          onClick={() => onSelectTab("career")}
          className="group cursor-pointer rounded-3xl p-6 glass-card border border-white/[0.08] relative overflow-hidden flex flex-col justify-between space-y-4 hover:border-blue-500/40"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
                <ShieldCheck className="w-3 h-3" />
                Executive Career
              </span>
              <span className="text-[10px] font-mono text-neutral-400 flex items-center gap-1">
                Bangalore Market <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-blue-400" />
              </span>
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
            <div className="p-3 rounded-2xl bg-neutral-950/60 border border-white/[0.05] grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-neutral-400 font-mono">Openings Desk:</span>
                <p className="font-bold text-white font-mono">10 Curated Roles</p>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 font-mono">Target CTC:</span>
                <p className="font-bold text-emerald-400 font-mono">₹28L - ₹52L PA</p>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold text-blue-400">
            <span>Explore Bangalore Job Radar & Pitch Copier</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* CARD 2: GMAT 715+ FOCUS SPRINT */}
        <div
          onClick={() => onSelectTab("gmat")}
          className="group cursor-pointer rounded-3xl p-6 glass-card border border-white/[0.08] relative overflow-hidden flex flex-col justify-between space-y-4 hover:border-amber-500/40"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                <Target className="w-3 h-3" />
                Sprint Target 715+
              </span>
              <span className="text-[10px] font-mono text-neutral-400 flex items-center gap-1">
                Dec 2026 <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-amber-400" />
              </span>
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
            <div className="p-3 rounded-2xl bg-neutral-950/60 border border-white/[0.05] flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-neutral-400 font-mono">Last Mock Score:</span>
                <p className="text-lg font-black font-mono text-amber-400">675 <span className="text-[11px] font-normal text-neutral-400">(95th %ile)</span></p>
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

        {/* CARD 3: STRATEGIC BOOKSHELF & KOBO DIGEST */}
        <div
          onClick={() => onSelectTab("books")}
          className="group cursor-pointer rounded-3xl p-6 glass-card border border-white/[0.08] relative overflow-hidden flex flex-col justify-between space-y-4 hover:border-purple-500/40"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold">
                <Library className="w-3 h-3" />
                Strategic Bookshelf
              </span>
              <span className="text-[10px] font-mono text-neutral-400 flex items-center gap-1">
                Kobo + Drive <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-purple-400" />
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                Kobo E-Reader & Daily Digest
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Google Drive EPUB bookshelf • In-browser reader • Farnam Street & Aeon spotlight.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-neutral-950/60 border border-white/[0.05] space-y-1">
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

        {/* CARD 4: VEERAKERALAPUDUR AGRIBUSINESS */}
        <div
          onClick={() => onSelectTab("farm")}
          className="group cursor-pointer rounded-3xl p-6 glass-card border border-white/[0.08] relative overflow-hidden flex flex-col justify-between space-y-4 hover:border-emerald-500/40"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                <Sprout className="w-3 h-3" />
                Agribusiness Modeler
              </span>
              <span className="text-[10px] font-mono text-neutral-400 flex items-center gap-1">
                0.25-Acre VKP <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-emerald-400" />
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                Veerakeralapudur Farm ROI
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                High-Density Guava • Perennial Moringa • Free-Range Chicken • CapEx Tracker.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-neutral-950/60 border border-white/[0.05] grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-neutral-400 font-mono">Top Crop Revenue:</span>
                <p className="font-bold text-emerald-400 font-mono">₹1.80L / yr</p>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 font-mono">CapEx Budget:</span>
                <p className="font-bold text-neutral-200 font-mono">₹1.50L Cap</p>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold text-emerald-400">
            <span>Simulate Crop Yields & Payback</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* CARD 5: MUSIC & SANCTUARY EQUALIZER */}
        <div
          onClick={() => onSelectTab("music")}
          className="group cursor-pointer rounded-3xl p-6 glass-card border border-white/[0.08] relative overflow-hidden flex flex-col justify-between space-y-4 hover:border-cyan-500/40"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                <Music className="w-3 h-3" />
                Music Sanctuary
              </span>
              <span className="text-[10px] font-mono text-neutral-400 flex items-center gap-1">
                YouTube Music <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-cyan-400" />
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                Worship & Deep Focus Deck
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Curated acoustic worship, ambient focus beats, and live sound equalizer.
              </p>
            </div>

            {/* Anime.js-style Audio Wave Animation */}
            <div className="p-3 rounded-2xl bg-neutral-950/60 border border-white/[0.05] flex items-center justify-between">
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

        {/* CARD 6: DAILY HABITS QUICK CHECK-IN (Actionable in 1 click!) */}
        <div className="rounded-3xl p-6 glass-card border border-white/[0.08] relative overflow-hidden flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold">
                <Flame className="w-3 h-3" />
                Daily Discipline
              </span>
              <button
                onClick={() => onSelectTab("habits")}
                className="text-[10px] font-mono text-neutral-400 hover:text-white flex items-center gap-1"
              >
                View All <ArrowUpRight className="w-3 h-3 text-rose-400" />
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
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-200"
                      : "bg-neutral-950/40 border-white/[0.05] text-neutral-400 hover:border-white/[0.15] hover:text-neutral-200"
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
                  <span className="text-[10px] font-mono font-bold text-amber-400/80">
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
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
