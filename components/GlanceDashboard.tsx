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
} from "lucide-react";
import { getDailyScripture, ScriptureDay } from "@/lib/dailyScripture";
import { DynamicHabit, DEFAULT_HABITS, loadDailyHabits, toggleDailyHabitStorage, getDateKey } from "@/lib/dailyHabits";
import { PlannedActivity, getPlannedActivitiesForDate, getGoogleCalendarAddUrl } from "@/lib/calendarActivities";

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
  const [customActivities, setCustomActivities] = useState<PlannedActivity[]>([]);
  const [completedActivityIds, setCompletedActivityIds] = useState<Record<string, boolean>>({});
  const [showAddActivityForm, setShowAddActivityForm] = useState<boolean>(false);
  const [newActTitle, setNewActTitle] = useState<string>("");
  const [newActTime, setNewActTime] = useState<string>("09:30 AM");
  const [newActCategory, setNewActCategory] = useState<PlannedActivity["category"]>("Career");

  // 5. Executive Scratchpad & Pomodoro HUD
  const [scratchpadNote, setScratchpadNote] = useState<string>(
    "• Review Schneider Electric ERP integration architecture\n• GMAT Quant: complete 20 Work-Rate problems\n• Farm: check soil moisture probe logs"
  );
  const [noteCopied, setNoteCopied] = useState<boolean>(false);
  const [pomodoroSeconds, setPomodoroSeconds] = useState<number>(25 * 60);
  const [pomodoroRunning, setPomodoroRunning] = useState<boolean>(false);

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
          category: "Personal" as const,
          source: "google-calendar" as const,
          notes: evt.description,
        }));
        setCustomActivities((prev) => {
          const nonGcal = prev.filter((p) => p.source !== "google-calendar");
          const combined = [...nonGcal, ...mapped];
          try {
            localStorage.setItem("lifehub_custom_activities", JSON.stringify(combined));
            localStorage.setItem("lifehub_gcal_ics", url.trim());
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

    try {
      const savedIcs = localStorage.getItem("lifehub_gcal_ics");
      if (savedIcs) {
        setGcalIcsUrl(savedIcs);
        syncGCal(savedIcs);
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

  // 6. Weather Location Toggle
  const [weatherLocation, setWeatherLocation] = useState<"blr" | "farm">("blr");

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

  const plannedActivities = useMemo(() => {
    return getPlannedActivitiesForDate(selectedDateObj, customActivities);
  }, [selectedDateObj, customActivities]);

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
                  <button
                    onClick={() => setShowGCalModal(true)}
                    className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-neutral-900 hover:bg-neutral-800 text-amber-300 border border-amber-500/30 transition-colors font-semibold"
                    title="Link Google Calendar feed"
                  >
                    <Link2 className="w-3 h-3 text-amber-400" />
                    <span>Link GCal</span>
                  </button>
                  <a
                    href="https://calendar.google.com/calendar/r"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-0.5 text-neutral-400 hover:text-white transition-colors"
                    title="Open Google Calendar"
                  >
                    <span>GCal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

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
                  className="p-2.5 rounded-lg bg-[#1a1b23] border border-neutral-700 space-y-2 animate-in fade-in duration-200"
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
                    No activities scheduled for this date.
                  </div>
                ) : (
                  plannedActivities.map((act) => {
                    const isDone = Boolean(completedActivityIds && typeof completedActivityIds === "object" && completedActivityIds[act.id]);
                    const gcalAddLink = getGoogleCalendarAddUrl(act, selectedDateObj);

                    return (
                      <div
                        key={act.id}
                        className={`p-2.5 rounded-lg border transition-all flex items-start justify-between gap-2 group ${
                          isDone
                            ? "bg-[#111216]/60 border-[#202129] opacity-60"
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
                              <span className="text-[9px] font-mono px-1 rounded bg-white/[0.08] text-neutral-300 border border-white/[0.08] shrink-0">
                                {act.category}
                              </span>
                            </div>
                            <p
                              className={`text-xs mt-0.5 leading-snug line-clamp-2 transition-colors font-medium ${
                                isDone ? "text-neutral-500 line-through" : "text-neutral-100 group-hover:text-white"
                              }`}
                            >
                              {act.title}
                            </p>
                          </div>
                        </div>

                        {/* Quick Add to Google Calendar Icon */}
                        <a
                          href={gcalAddLink}
                          target="_blank"
                          rel="noreferrer"
                          className="shrink-0 p-1 text-neutral-400 hover:text-amber-400 transition-colors opacity-0 group-hover:opacity-100"
                          title="Add this activity directly to Google Calendar"
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
          {/* 3.1 WEATHER WIDGET CARD */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#14151b] border border-[#232530] shadow-lg space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-neutral-300 uppercase font-bold">
              <span className="flex items-center gap-1.5 text-white">
                <CloudSun className="w-3.5 h-3.5 text-amber-400" />
                WEATHER
              </span>
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold">
                <button
                  onClick={() => setWeatherLocation("blr")}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    weatherLocation === "blr"
                      ? "bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  BLR
                </button>
                <button
                  onClick={() => setWeatherLocation("farm")}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    weatherLocation === "farm"
                      ? "bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Tirunelveli
                </button>
              </div>
            </div>

            {/* Weather Main Display */}
            {weatherLocation === "blr" ? (
              <div className="space-y-2.5">
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-sm font-bold text-white">Bengaluru (Electronic City)</div>
                    <div className="text-xs text-neutral-300 font-medium">Partly Cloudy · Feels like 24°C</div>
                  </div>
                  <div className="text-2xl font-bold font-mono text-white">24°C</div>
                </div>

                {/* Glance Temperature Bar Chart */}
                <div className="pt-2">
                  <div className="flex items-end justify-between h-14 gap-1 px-1">
                    <div className="flex flex-col items-center gap-1 flex-1">
                      <div className="w-full bg-[#1e202a] rounded-t h-5" />
                      <span className="text-[10px] font-mono text-neutral-400 font-semibold">6am</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 flex-1">
                      <div className="w-full bg-[#1e202a] rounded-t h-8" />
                      <span className="text-[10px] font-mono text-neutral-400 font-semibold">10am</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 flex-1">
                      <div className="w-full bg-amber-400 rounded-t h-12 relative shadow-md">
                        <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-mono text-amber-300 font-bold">
                          26°
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-amber-300 font-bold">2pm</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 flex-1">
                      <div className="w-full bg-[#1e202a] rounded-t h-9" />
                      <span className="text-[10px] font-mono text-neutral-400 font-semibold">6pm</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 flex-1">
                      <div className="w-full bg-[#1e202a] rounded-t h-6" />
                      <span className="text-[10px] font-mono text-neutral-400 font-semibold">10pm</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-300 pt-1 border-t border-[#232530]">
                  <span>Humidity: <strong className="text-white">58%</strong></span>
                  <span>Wind: <strong className="text-white">11 km/h ENE</strong></span>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
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

          {/* 3.3 MARKETS WIDGET CARD (Glance Parity + Jaison's Portfolio) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#14151b] border border-[#232530] shadow-lg space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-[#8b91a0] uppercase font-bold">
              <span className="flex items-center gap-1.5 text-white">
                <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                MARKETS
              </span>
              <span className="text-[10px] font-mono text-[#8b91a0] font-semibold">Live Feed</span>
            </div>

            <div className="space-y-3">
              {/* Ticker 1: BTC-USD (Glance Screenshot) */}
              <div className="flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white font-mono text-sm">BTC-USD</div>
                  <div className="text-[11px] text-[#8b91a0] font-mono">Bitcoin</div>
                </div>
                {/* SVG Sparkline (Red Down, Glance style) */}
                <svg className="w-16 h-5" viewBox="0 0 64 20" fill="none">
                  <path
                    d="M2 4 L14 6 L26 5 L38 11 L50 12 L62 17"
                    stroke="#f87171"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="text-right font-mono">
                  <div className="text-rose-400 font-bold">-4.80%</div>
                  <div className="text-neutral-200 text-[11px] font-semibold">$53,464.86</div>
                </div>
              </div>

              {/* Ticker 2: AMD (Glance Screenshot) */}
              <div className="flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white font-mono text-sm">AMD</div>
                  <div className="text-[11px] text-[#8b91a0] font-mono">AMD</div>
                </div>
                <svg className="w-16 h-5" viewBox="0 0 64 20" fill="none">
                  <path
                    d="M2 5 L14 7 L26 6 L38 13 L50 14 L62 18"
                    stroke="#f87171"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="text-right font-mono">
                  <div className="text-rose-400 font-bold">-4.27%</div>
                  <div className="text-neutral-200 text-[11px] font-semibold">$133.48</div>
                </div>
              </div>

              {/* Ticker 3: NVDA (Glance Screenshot) */}
              <div className="flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white font-mono text-sm">NVDA</div>
                  <div className="text-[11px] text-[#8b91a0] font-mono">NVIDIA</div>
                </div>
                <svg className="w-16 h-5" viewBox="0 0 64 20" fill="none">
                  <path
                    d="M2 6 L14 8 L26 7 L38 14 L50 13 L62 17"
                    stroke="#f87171"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="text-right font-mono">
                  <div className="text-rose-400 font-bold">-4.12%</div>
                  <div className="text-neutral-200 text-[11px] font-semibold">$102.79</div>
                </div>
              </div>

              {/* Ticker 4: GOOGL (Glance Screenshot) */}
              <div className="flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white font-mono text-sm">GOOGL</div>
                  <div className="text-[11px] text-[#8b91a0] font-mono">Alphabet</div>
                </div>
                <svg className="w-16 h-5" viewBox="0 0 64 20" fill="none">
                  <path
                    d="M2 5 L14 6 L26 8 L38 12 L50 13 L62 16"
                    stroke="#f87171"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="text-right font-mono">
                  <div className="text-rose-400 font-bold">-3.46%</div>
                  <div className="text-neutral-200 text-[11px] font-semibold">$151.84</div>
                </div>
              </div>

              {/* Ticker 5: Schneider Electric (Jaison's Core) */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-[#232530]">
                <div>
                  <div className="font-bold text-white font-mono text-sm">SE.PA</div>
                  <div className="text-[11px] text-[#8b91a0] font-mono">Schneider Electric</div>
                </div>
                <svg className="w-16 h-5" viewBox="0 0 64 20" fill="none">
                  <path
                    d="M2 14 L12 12 L22 15 L32 9 L42 11 L52 5 L62 3"
                    stroke="#10b981"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="text-right font-mono">
                  <div className="text-emerald-400 font-bold">+1.45%</div>
                  <div className="text-neutral-200 text-[11px] font-semibold">€242.80</div>
                </div>
              </div>

              {/* Ticker 6: USD/INR */}
              <div className="flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white font-mono text-sm">USD/INR</div>
                  <div className="text-[11px] text-[#8b91a0] font-mono">Rupee Rate</div>
                </div>
                <svg className="w-16 h-5" viewBox="0 0 64 20" fill="none">
                  <path
                    d="M2 10 L14 11 L26 9 L38 10 L50 9 L62 10"
                    stroke="#94a3b8"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="text-right font-mono">
                  <div className="text-neutral-300 font-bold">+0.04%</div>
                  <div className="text-neutral-200 text-[11px] font-semibold">₹84.42</div>
                </div>
              </div>
            </div>
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

      {/* GOOGLE CALENDAR LINK MODAL */}
      {showGCalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-[#111215] border border-neutral-700/80 p-5 sm:p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">Link Google Calendar</h3>
              </div>
              <button
                onClick={() => setShowGCalModal(false)}
                className="text-neutral-400 hover:text-white text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              Sync your live Google Calendar agenda directly into your Glance dashboard using your private iCal link.
            </p>

            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block font-semibold">
                Google Calendar Secret iCal Address
              </label>
              <input
                type="text"
                placeholder="https://calendar.google.com/calendar/ical/.../basic.ics"
                value={gcalIcsUrl}
                onChange={(e) => setGcalIcsUrl(e.target.value)}
                className="w-full text-xs font-mono px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400"
              />
              <div className="p-2.5 rounded-lg bg-neutral-900/60 border border-neutral-800 text-[11px] font-mono text-neutral-400 space-y-1">
                <div className="text-neutral-300 font-semibold">How to get your private iCal link:</div>
                <div>1. Open <a href="https://calendar.google.com" target="_blank" rel="noreferrer" className="text-amber-400 underline">calendar.google.com</a> in your browser.</div>
                <div>2. Go to <strong>Settings</strong> &gt; Click your primary calendar on the left.</div>
                <div>3. Scroll to <strong>Integrate calendar</strong> &gt; Copy <strong>"Secret address in iCal format"</strong>.</div>
                <div>4. Paste it above and click Sync.</div>
              </div>
            </div>

            {gcalStatus && (
              <div className="text-xs font-mono p-2 rounded bg-neutral-900 text-amber-300 border border-neutral-800">
                {gcalStatus}
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <a
                href="https://calendar.google.com/calendar/r"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono text-neutral-400 hover:text-white flex items-center gap-1"
              >
                <span>Open GCal Web</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowGCalModal(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-mono text-neutral-400 hover:text-white"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => syncGCal(gcalIcsUrl)}
                  disabled={gcalLoading || !gcalIcsUrl.trim()}
                  className="px-4 py-1.5 rounded-xl text-xs font-mono font-bold bg-amber-500 text-neutral-950 hover:bg-amber-400 transition-colors disabled:opacity-50"
                >
                  {gcalLoading ? "Syncing..." : "Save & Sync"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
