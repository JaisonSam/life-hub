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
} from "lucide-react";
import { getDailyScripture, ScriptureDay } from "@/lib/dailyScripture";
import { DynamicHabit, DEFAULT_HABITS, loadDailyHabits, toggleDailyHabitStorage, getDateKey } from "@/lib/dailyHabits";

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

  // On client mount, sync immediately with real client time & date
  useEffect(() => {
    const liveNow = new Date();
    setCalendarDate(liveNow);
    setTodayDate(liveNow);
    const liveKey = getDateKey(liveNow);
    setTodayKey(liveKey);
    setScriptureDay(getDailyScripture(liveNow, scriptureOffset));
    setDailyHabits(loadDailyHabits(liveKey));
  }, [scriptureOffset]);

  const handleToggleHabit = (id: string) => {
    const updated = toggleDailyHabitStorage(id, todayKey);
    setDailyHabits(updated);
  };

  const completedHabitsCount = dailyHabits.filter((h) => h.completedToday).length;
  const habitPct = dailyHabits.length > 0 ? Math.round((completedHabitsCount / dailyHabits.length) * 100) : 0;

  // 4. Center Column Sub-Tabs
  const [centerSubTab, setCenterSubTab] = useState<"career" | "gmat" | "tech" | "farm">("career");
  const [showMoreJobs, setShowMoreJobs] = useState(false);

  // 5. Community Feed Sub-Tabs
  const [communityTab, setCommunityTab] = useState<"erp" | "agri" | "gmat">("erp");

  // 6. Weather Location Toggle
  const [weatherLocation, setWeatherLocation] = useState<"blr" | "farm">("blr");

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

  return (
    <div className="w-full text-neutral-200 space-y-7 animate-in fade-in duration-500 font-sans">
      {/* GLANCE 3-COLUMN MASTER DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* ========================================================= */}
        {/* COLUMN 1: LEFT (Calendar, Daily Scripture, Daily Habits) */}
        {/* ========================================================= */}
        <div className="lg:col-span-3 space-y-6">
          {/* 1.1 CALENDAR WIDGET */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-neutral-400 uppercase font-semibold">
              <span className="flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5 text-neutral-400" />
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
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setCalendarDate(new Date())}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 hover:text-white transition-colors font-mono"
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
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Calendar Month & Week Number Header */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white text-sm">{monthName}</span>
              <span className="font-mono text-neutral-400 text-[11px]">
                Week {weekNumber} · {year}
              </span>
            </div>

            {/* Calendar Days Header: Mo Tu We Th Fr Sa Su */}
            <div className="grid grid-cols-7 gap-1 text-center font-mono text-[11px] text-neutral-500 pt-1 pb-1">
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
              {calendarDays.map((item, idx) => (
                <div
                  key={idx}
                  className={`h-7 flex items-center justify-center rounded-md transition-all ${
                    item.isToday
                      ? "border border-amber-400/90 text-amber-300 font-bold bg-amber-400/10 shadow-sm"
                      : item.isCurrentMonth
                      ? "text-neutral-300 hover:bg-neutral-800/60 cursor-pointer"
                      : "text-neutral-600"
                  }`}
                >
                  {item.day}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-neutral-800/80 pt-5" />

          {/* 1.2 DAILY SCRIPTURE & DEVOTIONAL (Dynamic everyday) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-neutral-400 uppercase font-semibold">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-neutral-400" />
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
                <span>Day {scriptureDay.dayOfYear}</span>
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
                  className="text-amber-400 hover:text-amber-300 font-medium text-xs sm:text-sm text-left flex items-center gap-1 group transition-colors"
                >
                  <span>{scriptureDay.reference}</span>
                  <ArrowUpRight className="w-3 h-3 text-neutral-500 group-hover:text-amber-300 transition-colors" />
                </button>
                <p className="text-xs text-neutral-300 leading-relaxed mt-1 font-serif italic">
                  "{scriptureDay.text}"
                </p>
              </div>

              {/* Reading Plan & Theme */}
              <div className="text-[11px] font-mono text-neutral-400 flex items-center justify-between">
                <span>{scriptureDay.readingPlan}</span>
                <span className="text-neutral-500">{scriptureDay.translation}</span>
              </div>

              {/* Devotional Reflection */}
              <div className="p-2.5 rounded-lg bg-neutral-900/70 border border-neutral-800/80 text-xs text-neutral-300 leading-relaxed font-sans">
                <span className="text-amber-400 font-mono text-[10px] uppercase tracking-wider block mb-1">
                  Daily Focus • {scriptureDay.theme}
                </span>
                {scriptureDay.reflection}
              </div>

              {/* Collapsible More / Prayer */}
              {showScriptureMore && (
                <div className="p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed font-sans animate-in fade-in duration-300">
                  <span className="text-amber-300 font-mono text-[10px] uppercase tracking-wider block mb-1">
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
                    scriptureCompleted ? "text-emerald-400 font-semibold" : "hover:text-white"
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
                    className="text-[10px] text-neutral-400 hover:text-white transition-colors uppercase tracking-wider flex items-center gap-0.5"
                  >
                    <span>{showScriptureMore ? "Less" : "Prayer"}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${showScriptureMore ? "rotate-180" : ""}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-800/80 pt-5" />

          {/* 1.3 DAILY HABIT TRACKER (Dynamic everyday, resets daily) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-neutral-400 uppercase font-semibold">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-neutral-400" />
                DAILY HABITS
              </span>
              <span className="text-amber-400 font-mono text-xs font-bold">
                {completedHabitsCount}/{dailyHabits.length} ({habitPct}%)
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800/80">
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
                  className="flex items-center justify-between p-2 rounded-lg bg-neutral-900/40 hover:bg-neutral-900/80 border border-neutral-800/50 hover:border-neutral-700/80 cursor-pointer transition-all group select-none"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <button
                      className={`w-4 h-4 rounded flex items-center justify-center transition-colors shrink-0 ${
                        habit.completedToday
                          ? "bg-amber-500 text-neutral-950 font-bold"
                          : "border border-neutral-600 group-hover:border-neutral-400"
                      }`}
                    >
                      {habit.completedToday && <span className="text-[10px] leading-none">✓</span>}
                    </button>
                    <span
                      className={`text-xs truncate transition-colors ${
                        habit.completedToday
                          ? "text-neutral-400 line-through"
                          : "text-neutral-200 group-hover:text-white"
                      }`}
                    >
                      {habit.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 font-mono text-[11px] shrink-0 ml-2">
                    <Flame className="w-3 h-3 text-amber-500" />
                    <span className="text-amber-400 font-semibold">{habit.streak}d</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onSelectTab("habits")}
              className="text-[10px] font-mono text-neutral-400 hover:text-white transition-colors uppercase tracking-wider pt-1 flex items-center gap-1"
            >
              <span>Deep Habit Architecture</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* COLUMN 2: CENTER (Sub-Tabs, High-Density Feed, Videos)   */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 space-y-6">
          {/* 2.1 SUB-TABS (Glance style: HACKER NEWS | LOBSTERS / CAREER | GMAT | TECH) */}
          <div className="space-y-4">
            <div className="flex items-center gap-5 border-b border-neutral-800/80 pb-2 text-xs font-mono tracking-wider uppercase font-semibold">
              <button
                onClick={() => setCenterSubTab("career")}
                className={`transition-colors flex items-center gap-1.5 relative ${
                  centerSubTab === "career"
                    ? "text-amber-400 after:absolute after:-bottom-[9px] after:left-0 after:right-0 after:h-[2px] after:bg-amber-400"
                    : "text-neutral-400 hover:text-neutral-200"
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
                    : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                <span>GMAT INTEL</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-400 font-normal">705+</span>
              </button>

              <button
                onClick={() => setCenterSubTab("tech")}
                className={`transition-colors relative ${
                  centerSubTab === "tech"
                    ? "text-amber-400 after:absolute after:-bottom-[9px] after:left-0 after:right-0 after:h-[2px] after:bg-amber-400"
                    : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                <span>TECH INTEL</span>
              </button>

              <button
                onClick={() => setCenterSubTab("farm")}
                className={`transition-colors relative ${
                  centerSubTab === "farm"
                    ? "text-amber-400 after:absolute after:-bottom-[9px] after:left-0 after:right-0 after:h-[2px] after:bg-amber-400"
                    : "text-neutral-400 hover:text-neutral-200"
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
                    className="text-amber-400 hover:text-amber-300 font-medium text-xs sm:text-sm leading-snug flex items-center gap-1 group transition-colors"
                  >
                    <span>Senior ERP Business Analyst • Global Energy Automation</span>
                    <span className="text-neutral-400 text-xs group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
                  </a>
                  <div className="text-xs font-mono text-neutral-400 flex items-center gap-2 flex-wrap">
                    <span>6h</span>
                    <span>·</span>
                    <span className="text-neutral-300">Schneider Electric Bengaluru</span>
                    <span>·</span>
                    <span className="text-emerald-400">Hybrid · ₹24-32 LPA</span>
                    <span>·</span>
                    <span className="text-neutral-500">Recruiter: SE Talent Acquisition ↗</span>
                  </div>
                </div>

                {/* Job Item 2 */}
                <div className="space-y-1">
                  <a
                    href="https://jobs.siemens.com/careers?query=ERP+Functional+Consultant+Bangalore"
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-400 hover:text-amber-300 font-medium text-xs sm:text-sm leading-snug flex items-center gap-1 group transition-colors"
                  >
                    <span>Principal Functional Consultant • SAP S/4HANA & Digital Core</span>
                    <span className="text-neutral-400 text-xs group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
                  </a>
                  <div className="text-xs font-mono text-neutral-400 flex items-center gap-2 flex-wrap">
                    <span>1d</span>
                    <span>·</span>
                    <span className="text-neutral-300">Siemens Technology India</span>
                    <span>·</span>
                    <span className="text-emerald-400">Electronic City, Bangalore · ₹26-35 LPA</span>
                    <span>·</span>
                    <span className="text-neutral-500">jobs.siemens.com ↗</span>
                  </div>
                </div>

                {/* Job Item 3 */}
                <div className="space-y-1">
                  <a
                    href="https://apply.deloitte.com/careers/SearchJobs/ERP%20Transformation%20Bangalore"
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-400 hover:text-amber-300 font-medium text-xs sm:text-sm leading-snug flex items-center gap-1 group transition-colors"
                  >
                    <span>ERP Transformation Solutions Architect • Cloud ERP Modernization</span>
                    <span className="text-neutral-400 text-xs group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
                  </a>
                  <div className="text-xs font-mono text-neutral-400 flex items-center gap-2 flex-wrap">
                    <span>2d</span>
                    <span>·</span>
                    <span className="text-neutral-300">Deloitte Consulting India</span>
                    <span>·</span>
                    <span className="text-emerald-400">RMZ EcoWorld, BLR · ₹28-38 LPA</span>
                    <span>·</span>
                    <span className="text-neutral-500">apply.deloitte.com ↗</span>
                  </div>
                </div>

                {/* Job Item 4 */}
                <div className="space-y-1">
                  <a
                    href="https://careers.abb/global/en/search-results?keywords=ERP%20Supply%20Chain%20Bangalore"
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-400 hover:text-amber-300 font-medium text-xs sm:text-sm leading-snug flex items-center gap-1 group transition-colors"
                  >
                    <span>Supply Chain & ERP Systems Lead • Industrial Discrete Mfg</span>
                    <span className="text-neutral-400 text-xs group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
                  </a>
                  <div className="text-xs font-mono text-neutral-400 flex items-center gap-2 flex-wrap">
                    <span>3d</span>
                    <span>·</span>
                    <span className="text-neutral-300">ABB India Nelamangala Campus</span>
                    <span>·</span>
                    <span className="text-emerald-400">₹22-30 LPA</span>
                    <span>·</span>
                    <span className="text-neutral-500">Workday Portal ↗</span>
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
                        className="text-amber-400 hover:text-amber-300 font-medium text-xs sm:text-sm leading-snug flex items-center gap-1 group transition-colors"
                      >
                        <span>Enterprise Applications Lead BA • Connected Enterprise</span>
                        <span className="text-neutral-400 text-xs">↗</span>
                      </a>
                      <div className="text-xs font-mono text-neutral-400 flex items-center gap-2 flex-wrap">
                        <span>4d</span>
                        <span>·</span>
                        <span className="text-neutral-300">Honeywell Bangalore</span>
                        <span>·</span>
                        <span className="text-emerald-400">₹23-31 LPA</span>
                        <span>·</span>
                        <span className="text-neutral-500">honeywell.com ↗</span>
                      </div>
                    </div>

                    <div className="space-y-1 animate-in fade-in duration-300">
                      <a
                        href="https://careers.microsoft.com/us/en/search-results?keywords=ERP%20Supply%20Chain%20Bangalore"
                        target="_blank"
                        rel="noreferrer"
                        className="text-amber-400 hover:text-amber-300 font-medium text-xs sm:text-sm leading-snug flex items-center gap-1 group transition-colors"
                      >
                        <span>Dynamics 365 Finance & Operations Functional Architect</span>
                        <span className="text-neutral-400 text-xs">↗</span>
                      </a>
                      <div className="text-xs font-mono text-neutral-400 flex items-center gap-2 flex-wrap">
                        <span>5d</span>
                        <span>·</span>
                        <span className="text-neutral-300">Microsoft India R&D</span>
                        <span>·</span>
                        <span className="text-emerald-400">₹32-45 LPA</span>
                        <span>·</span>
                        <span className="text-neutral-500">careers.microsoft.com ↗</span>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => setShowMoreJobs(!showMoreJobs)}
                    className="text-xs font-mono text-neutral-400 hover:text-white transition-colors uppercase tracking-wider flex items-center gap-1"
                  >
                    <span>{showMoreJobs ? "SHOW LESS ⌃" : "SHOW MORE ⌄"}</span>
                  </button>

                  <button
                    onClick={() => onSelectTab("career")}
                    className="text-xs font-mono text-amber-400 hover:text-amber-300 transition-colors uppercase tracking-wider flex items-center gap-1"
                  >
                    <span>Full Career Brand Hub</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {centerSubTab === "gmat" && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-amber-400 font-bold uppercase tracking-wider">
                      Target: 705+ Focus Edition (99th %ile)
                    </span>
                    <span className="text-neutral-400">{gmatDaysRemaining} Days to Exam</span>
                  </div>
                  <div className="text-xs text-neutral-300 leading-relaxed font-sans">
                    Focus: <strong className="text-white">Data Insights (Multi-Source & Tables)</strong> & Quant Algebra traps. Pacing rule: max 2m15s per question; blind-guess at 2m30s to protect section completion.
                  </div>
                  <div className="flex items-center gap-4 text-[11px] font-mono text-neutral-400 pt-1 border-t border-neutral-800/60">
                    <span>Diagnostic: <strong className="text-white">615</strong></span>
                    <span>Practice 2: <strong className="text-amber-300">645</strong> (+30)</span>
                    <span>Target: <strong className="text-emerald-400">705+</strong></span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-amber-400 font-medium text-xs sm:text-sm">
                    Concept of the Day: Work-Rate Harmonized Inverses
                  </div>
                  <div className="text-xs font-mono text-neutral-400 flex items-center gap-2">
                    <span>Daily Formula</span>
                    <span>·</span>
                    <span>1/A + 1/B = 1/Total</span>
                    <span>·</span>
                    <span className="text-neutral-500">Never average the speeds directly ↗</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-amber-400 font-medium text-xs sm:text-sm">
                    Critical Reasoning: Assumption vs Strengthener Scope
                  </div>
                  <div className="text-xs font-mono text-neutral-400 flex items-center gap-2">
                    <span>Negation Test</span>
                    <span>·</span>
                    <span>If negated assumption kills conclusion, it's correct</span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectTab("gmat")}
                  className="text-xs font-mono text-amber-400 hover:text-amber-300 transition-colors uppercase tracking-wider flex items-center gap-1 pt-1"
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
                    className="text-amber-400 hover:text-amber-300 font-medium text-xs sm:text-sm leading-snug flex items-center gap-1 group"
                  >
                    <span>Self-Hosted Executive Dashboards: Building Glance with Next.js 16</span>
                    <span className="text-neutral-400 text-xs">↗</span>
                  </a>
                  <div className="text-xs font-mono text-neutral-400 flex items-center gap-2">
                    <span>2h · 184 points · 42 comments · github.com/glanceapp/glance ↗</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <a
                    href="https://news.ycombinator.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-400 hover:text-amber-300 font-medium text-xs sm:text-sm leading-snug flex items-center gap-1 group"
                  >
                    <span>SAP S/4HANA Clean Core Extensibility with Cloud Event Mesh</span>
                    <span className="text-neutral-400 text-xs">↗</span>
                  </a>
                  <div className="text-xs font-mono text-neutral-400 flex items-center gap-2">
                    <span>5h · 92 points · 28 comments · sap.com/community ↗</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <a
                    href="https://news.ycombinator.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-400 hover:text-amber-300 font-medium text-xs sm:text-sm leading-snug flex items-center gap-1 group"
                  >
                    <span>Distributed Postgres and Agentic Reasoning Workflows in 2026</span>
                    <span className="text-neutral-400 text-xs">↗</span>
                  </a>
                  <div className="text-xs font-mono text-neutral-400 flex items-center gap-2">
                    <span>8h · 310 points · 112 comments</span>
                  </div>
                </div>
              </div>
            )}

            {centerSubTab === "farm" && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-amber-400 font-bold uppercase tracking-wider">
                      Veerakeralapudur Farm Model (0.25 Acre)
                    </span>
                    <span className="text-emerald-400">Soil Moisture: 42%</span>
                  </div>
                  <div className="text-xs text-neutral-300 leading-relaxed font-sans">
                    Today's Agro-Ops: <strong className="text-white">{farmDayTask.task}</strong> ({farmDayTask.metric}). Drip lines automated via solar pump tie-in.
                  </div>
                  <div className="flex items-center gap-4 text-[11px] font-mono text-neutral-400 pt-1 border-t border-neutral-800/60">
                    <span>High-Density Guava: <strong className="text-white">140 Trees</strong></span>
                    <span>Border: <strong className="text-white">18 Coconuts</strong></span>
                    <span>Target ROI: <strong className="text-emerald-400">₹1.85L/yr</strong></span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectTab("farm")}
                  className="text-xs font-mono text-amber-400 hover:text-amber-300 transition-colors uppercase tracking-wider flex items-center gap-1 pt-1"
                >
                  <span>Open Full Veerakeralapudur Agribusiness Simulator</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <div className="border-t border-neutral-800/80 pt-5" />

          {/* 2.3 VIDEOS & SANCTUARY SHELF (Horizontal Media Strip) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-neutral-400 uppercase font-semibold">
              <span className="flex items-center gap-1.5">
                <Headphones className="w-3.5 h-3.5 text-neutral-400" />
                VIDEOS & SANCTUARY
              </span>
              <button
                onClick={() => onSelectTab("music")}
                className="text-[10px] text-amber-400 hover:text-amber-300 uppercase tracking-wider flex items-center gap-0.5"
              >
                <span>All Rooms</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* Horizontal Video Cards Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Media Card 1 */}
              <div
                onClick={() => onSelectTab("music")}
                className="group cursor-pointer space-y-1.5"
              >
                <div className="relative aspect-video rounded-lg overflow-hidden bg-neutral-900 border border-neutral-800 group-hover:border-neutral-600 transition-colors">
                  <img
                    src="https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=400&q=80"
                    alt="Acoustic Worship"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-neutral-300">
                    Live
                  </span>
                </div>
                <div className="text-xs font-medium text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                  Acoustic Worship Sanctuary
                </div>
                <div className="text-[10px] font-mono text-neutral-400">
                  Elevation & Maverick
                </div>
              </div>

              {/* Media Card 2 */}
              <div
                onClick={() => onSelectTab("music")}
                className="group cursor-pointer space-y-1.5"
              >
                <div className="relative aspect-video rounded-lg overflow-hidden bg-neutral-900 border border-neutral-800 group-hover:border-neutral-600 transition-colors">
                  <img
                    src="https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=400&q=80"
                    alt="432Hz Study Flow"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-neutral-300">
                    432Hz
                  </span>
                </div>
                <div className="text-xs font-medium text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                  Deep Flow & GMAT Focus
                </div>
                <div className="text-[10px] font-mono text-neutral-400">
                  Alpha Brainwaves
                </div>
              </div>

              {/* Media Card 3 */}
              <div
                onClick={() => onSelectTab("gmat")}
                className="group cursor-pointer space-y-1.5"
              >
                <div className="relative aspect-video rounded-lg overflow-hidden bg-neutral-900 border border-neutral-800 group-hover:border-neutral-600 transition-colors">
                  <img
                    src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80"
                    alt="GMAT Strategy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-neutral-300">
                    705+
                  </span>
                </div>
                <div className="text-xs font-medium text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                  GMAT Quant & DI Traps
                </div>
                <div className="text-[10px] font-mono text-neutral-400">
                  MBA.com Official OG
                </div>
              </div>

              {/* Media Card 4 */}
              <div
                onClick={() => onSelectTab("career")}
                className="group cursor-pointer space-y-1.5"
              >
                <div className="relative aspect-video rounded-lg overflow-hidden bg-neutral-900 border border-neutral-800 group-hover:border-neutral-600 transition-colors">
                  <img
                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80"
                    alt="ERP Architecture"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-neutral-300">
                    Cloud
                  </span>
                </div>
                <div className="text-xs font-medium text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                  ERP Cloud Architectures
                </div>
                <div className="text-[10px] font-mono text-neutral-400">
                  Schneider Blueprint
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-800/80 pt-5" />

          {/* 2.4 COMMUNITY & REDDIT FEEDS (Glance style /r/technology /r/science) */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-xs font-mono tracking-wider uppercase font-semibold text-neutral-400">
              <button
                onClick={() => setCommunityTab("erp")}
                className={`transition-colors ${communityTab === "erp" ? "text-amber-400 font-bold" : "hover:text-white"}`}
              >
                /R/ERP_CONSULTING
              </button>
              <button
                onClick={() => setCommunityTab("agri")}
                className={`transition-colors ${communityTab === "agri" ? "text-amber-400 font-bold" : "hover:text-white"}`}
              >
                /R/AGRITECH_INDIA
              </button>
              <button
                onClick={() => setCommunityTab("gmat")}
                className={`transition-colors ${communityTab === "gmat" ? "text-amber-400 font-bold" : "hover:text-white"}`}
              >
                /R/GMAT_FOCUS
              </button>
            </div>

            {communityTab === "erp" && (
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0 text-neutral-400 font-bold font-mono text-xs">
                    SE
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="text-xs sm:text-sm font-medium text-neutral-200 hover:text-white transition-colors cursor-pointer flex items-center gap-2 flex-wrap">
                      <span>Bridging Functional BA Specifications to Agentic Cloud Automation</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-400 font-mono">Systems</span>
                    </div>
                    <div className="text-[11px] font-mono text-neutral-400 flex items-center gap-2">
                      <span>3h</span>
                      <span>·</span>
                      <span>1,842 points</span>
                      <span>·</span>
                      <span>148 comments</span>
                      <span>·</span>
                      <span className="text-neutral-500">schneider-electric.com ↗</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0 text-neutral-400 font-bold font-mono text-xs">
                    BLR
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="text-xs sm:text-sm font-medium text-neutral-200 hover:text-white transition-colors cursor-pointer flex items-center gap-2 flex-wrap">
                      <span>Bangalore Tech Corridor 2026: Shift toward AI-Native Business Analysts</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-400 font-mono">Market</span>
                    </div>
                    <div className="text-[11px] font-mono text-neutral-400 flex items-center gap-2">
                      <span>12h</span>
                      <span>·</span>
                      <span>965 points</span>
                      <span>·</span>
                      <span>82 comments</span>
                      <span>·</span>
                      <span className="text-neutral-500">economictimes.indiatimes.com ↗</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {communityTab === "agri" && (
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center shrink-0 text-emerald-400 font-bold font-mono text-xs">
                    TNL
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="text-xs sm:text-sm font-medium text-neutral-200 hover:text-white transition-colors cursor-pointer flex items-center gap-2 flex-wrap">
                      <span>Tirunelveli Red Sandy Loam: Precision Drip & Micro-Fertigation Economics</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950/40 text-emerald-300 font-mono">Agronomy</span>
                    </div>
                    <div className="text-[11px] font-mono text-neutral-400 flex items-center gap-2">
                      <span>1d</span>
                      <span>·</span>
                      <span>420 points</span>
                      <span>·</span>
                      <span>54 comments</span>
                      <span>·</span>
                      <span className="text-neutral-500">tnau.ac.in ↗</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {communityTab === "gmat" && (
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-950/60 border border-indigo-800/40 flex items-center justify-center shrink-0 text-indigo-400 font-bold font-mono text-xs">
                    705
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="text-xs sm:text-sm font-medium text-neutral-200 hover:text-white transition-colors cursor-pointer flex items-center gap-2 flex-wrap">
                      <span>Debrief: Moving from 645 to 715 on Focus Edition in 4 Weeks</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-950/40 text-indigo-300 font-mono">Debrief</span>
                    </div>
                    <div className="text-[11px] font-mono text-neutral-400 flex items-center gap-2">
                      <span>2d</span>
                      <span>·</span>
                      <span>1,204 points</span>
                      <span>·</span>
                      <span>198 comments</span>
                      <span>·</span>
                      <span className="text-neutral-500">gmatclub.com ↗</span>
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
        <div className="lg:col-span-3 space-y-6">
          {/* 3.1 WEATHER WIDGET */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-neutral-400 uppercase font-semibold">
              <span className="flex items-center gap-1.5">
                <CloudSun className="w-3.5 h-3.5 text-neutral-400" />
                WEATHER
              </span>
              <div className="flex items-center gap-1.5 text-[10px] font-mono">
                <button
                  onClick={() => setWeatherLocation("blr")}
                  className={`px-1.5 py-0.5 rounded transition-colors ${
                    weatherLocation === "blr"
                      ? "bg-amber-400/10 text-amber-300 font-bold"
                      : "text-neutral-500 hover:text-neutral-300"
                  }`}
                >
                  BLR
                </button>
                <button
                  onClick={() => setWeatherLocation("farm")}
                  className={`px-1.5 py-0.5 rounded transition-colors ${
                    weatherLocation === "farm"
                      ? "bg-amber-400/10 text-amber-300 font-bold"
                      : "text-neutral-500 hover:text-neutral-300"
                  }`}
                >
                  Tirunelveli
                </button>
              </div>
            </div>

            {/* Weather Main Display */}
            {weatherLocation === "blr" ? (
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white">Bengaluru (Electronic City)</div>
                    <div className="text-xs text-neutral-400">Partly Cloudy · Feels like 24°C</div>
                  </div>
                  <div className="text-2xl font-bold font-mono text-white">24°C</div>
                </div>

                {/* Glance Temperature Bar Chart */}
                <div className="pt-2">
                  <div className="flex items-end justify-between h-14 gap-1 px-1">
                    <div className="flex flex-col items-center gap-1 flex-1">
                      <div className="w-full bg-neutral-800 rounded-t h-5" />
                      <span className="text-[10px] font-mono text-neutral-500">6am</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 flex-1">
                      <div className="w-full bg-neutral-800 rounded-t h-8" />
                      <span className="text-[10px] font-mono text-neutral-500">10am</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 flex-1">
                      <div className="w-full bg-amber-400/80 rounded-t h-12 relative">
                        <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-mono text-amber-300 font-bold">
                          26°
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-300 font-semibold">2pm</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 flex-1">
                      <div className="w-full bg-neutral-800 rounded-t h-9" />
                      <span className="text-[10px] font-mono text-neutral-500">6pm</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 flex-1">
                      <div className="w-full bg-neutral-800 rounded-t h-6" />
                      <span className="text-[10px] font-mono text-neutral-500">10pm</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 pt-1">
                  <span>Humidity: 58%</span>
                  <span>Wind: 11 km/h ENE</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white">Veerakeralapudur Farm</div>
                    <div className="text-xs text-neutral-400">Sunny & Breezy · Feels like 31°C</div>
                  </div>
                  <div className="text-2xl font-bold font-mono text-amber-300">30°C</div>
                </div>

                {/* Glance Temperature Bar Chart */}
                <div className="pt-2">
                  <div className="flex items-end justify-between h-14 gap-1 px-1">
                    <div className="flex flex-col items-center gap-1 flex-1">
                      <div className="w-full bg-neutral-800 rounded-t h-6" />
                      <span className="text-[10px] font-mono text-neutral-500">6am</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 flex-1">
                      <div className="w-full bg-neutral-800 rounded-t h-10" />
                      <span className="text-[10px] font-mono text-neutral-500">10am</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 flex-1">
                      <div className="w-full bg-amber-500 rounded-t h-13 relative">
                        <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-mono text-amber-300 font-bold">
                          32°
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-300 font-semibold">2pm</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 flex-1">
                      <div className="w-full bg-neutral-800 rounded-t h-8" />
                      <span className="text-[10px] font-mono text-neutral-500">6pm</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 flex-1">
                      <div className="w-full bg-neutral-800 rounded-t h-5" />
                      <span className="text-[10px] font-mono text-neutral-500">10pm</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 pt-1">
                  <span>Soil Moisture: 42%</span>
                  <span>Solar Pump: Active</span>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-neutral-800/80 pt-5" />

          {/* 3.2 REPOSITORY WIDGET (Glance style glanceapp/glance) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-neutral-400 uppercase font-semibold">
              <span className="flex items-center gap-1.5">
                <GitPullRequest className="w-3.5 h-3.5 text-neutral-400" />
                REPOSITORY
              </span>
              <a
                href="https://github.com/JaisonSam/life-hub"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-neutral-400 hover:text-white transition-colors"
              >
                GitHub ↗
              </a>
            </div>

            <div className="space-y-2">
              <div>
                <a
                  href="https://github.com/JaisonSam/life-hub"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-white hover:text-amber-300 transition-colors text-xs sm:text-sm flex items-center gap-1"
                >
                  <span>JaisonSam/life-hub</span>
                  <ArrowUpRight className="w-3 h-3 text-neutral-500" />
                </a>
                <div className="text-xs font-mono text-neutral-400 mt-0.5">
                  24 stars · 6 forks
                </div>
              </div>

              {/* Open PRs */}
              <div className="text-xs space-y-1 pt-1">
                <div className="font-mono text-neutral-400 text-[11px]">
                  Open pull requests (2 total)
                </div>
                <div className="font-mono text-[11px] text-neutral-300 flex items-center justify-between">
                  <span className="truncate">2d feat: Glance dashboard revamp</span>
                  <span className="text-neutral-500 shrink-0 ml-1">#12</span>
                </div>
                <div className="font-mono text-[11px] text-neutral-300 flex items-center justify-between">
                  <span className="truncate">8d perf: 3D coverflow smooth glide</span>
                  <span className="text-neutral-500 shrink-0 ml-1">#11</span>
                </div>
              </div>

              {/* Open Issues */}
              <div className="text-xs space-y-1 pt-1">
                <div className="font-mono text-neutral-400 text-[11px]">
                  Open issues (3 total)
                </div>
                <div className="font-mono text-[11px] text-neutral-300 flex items-center justify-between">
                  <span className="truncate">2d [Feature] Daily dynamic scripture</span>
                  <span className="text-neutral-500 shrink-0 ml-1">#9</span>
                </div>
                <div className="font-mono text-[11px] text-neutral-300 flex items-center justify-between">
                  <span className="truncate">5d [Telemetry] Farm sensor live sync</span>
                  <span className="text-neutral-500 shrink-0 ml-1">#8</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-800/80 pt-5" />

          {/* 3.3 MARKETS WIDGET (Glance style with SVG Sparklines) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-neutral-400 uppercase font-semibold">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-neutral-400" />
                MARKETS
              </span>
              <span className="text-[10px] font-mono text-neutral-500">Live / EOD</span>
            </div>

            <div className="space-y-2.5">
              {/* Ticker 1: Schneider Electric */}
              <div className="flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white font-mono">SE.PA</div>
                  <div className="text-[11px] text-neutral-500 font-mono">Schneider Electric</div>
                </div>
                {/* SVG Sparkline (Green Up) */}
                <svg className="w-16 h-5" viewBox="0 0 64 20" fill="none">
                  <path
                    d="M2 14 L12 12 L22 15 L32 9 L42 11 L52 5 L62 3"
                    stroke="#10b981"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="text-right font-mono">
                  <div className="text-emerald-400 font-bold">+1.25%</div>
                  <div className="text-neutral-400 text-[11px]">€244.50</div>
                </div>
              </div>

              {/* Ticker 2: NIFTY 50 */}
              <div className="flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white font-mono">NIFTY 50</div>
                  <div className="text-[11px] text-neutral-500 font-mono">NSE India</div>
                </div>
                {/* SVG Sparkline */}
                <svg className="w-16 h-5" viewBox="0 0 64 20" fill="none">
                  <path
                    d="M2 15 L14 13 L26 10 L38 12 L50 6 L62 4"
                    stroke="#10b981"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="text-right font-mono">
                  <div className="text-emerald-400 font-bold">+0.48%</div>
                  <div className="text-neutral-400 text-[11px]">24,580.40</div>
                </div>
              </div>

              {/* Ticker 3: SENSEX */}
              <div className="flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white font-mono">SENSEX</div>
                  <div className="text-[11px] text-neutral-500 font-mono">BSE India</div>
                </div>
                {/* SVG Sparkline */}
                <svg className="w-16 h-5" viewBox="0 0 64 20" fill="none">
                  <path
                    d="M2 14 L15 13 L28 15 L40 9 L52 8 L62 5"
                    stroke="#10b981"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="text-right font-mono">
                  <div className="text-emerald-400 font-bold">+0.39%</div>
                  <div className="text-neutral-400 text-[11px]">80,620.10</div>
                </div>
              </div>

              {/* Ticker 4: BTC-USD */}
              <div className="flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white font-mono">BTC-USD</div>
                  <div className="text-[11px] text-neutral-500 font-mono">Bitcoin</div>
                </div>
                {/* SVG Sparkline */}
                <svg className="w-16 h-5" viewBox="0 0 64 20" fill="none">
                  <path
                    d="M2 16 L12 11 L24 13 L36 7 L48 9 L62 2"
                    stroke="#10b981"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="text-right font-mono">
                  <div className="text-emerald-400 font-bold">+2.14%</div>
                  <div className="text-neutral-400 text-[11px]">$91,420</div>
                </div>
              </div>

              {/* Ticker 5: USD-INR */}
              <div className="flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white font-mono">USD/INR</div>
                  <div className="text-[11px] text-neutral-500 font-mono">Rupee Rate</div>
                </div>
                {/* SVG Sparkline (Flat / Neutral) */}
                <svg className="w-16 h-5" viewBox="0 0 64 20" fill="none">
                  <path
                    d="M2 10 L14 11 L26 9 L38 10 L50 9 L62 10"
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="text-right font-mono">
                  <div className="text-neutral-400 font-bold">+0.04%</div>
                  <div className="text-neutral-400 text-[11px]">₹84.42</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
