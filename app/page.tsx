"use client";

import { useState, useEffect } from "react";
import {
  BookOpen,
  CheckCircle2,
  Circle,
  FolderKanban,
  Flame,
  Headphones,
  Music,
  Plus,
  Bookmark,
  Share2,
  Sparkles,
  Clock,
  Calendar,
  ExternalLink,
  ChevronRight,
  Heart,
  Volume2,
  Target,
  GraduationCap,
  Timer,
  Play,
  Pause,
  RotateCcw,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  category: string;
  progress: number;
  status: "In Progress" | "Planning" | "Completed";
  deadline: string;
}

interface Habit {
  id: string;
  name: string;
  category: "Spiritual" | "Health" | "Growth";
  streak: number;
  completedToday: boolean;
}

interface StudyNote {
  id: string;
  reference: string;
  note: string;
  date: string;
}

interface GmatErrorLog {
  id: string;
  question: string;
  section: "Quant" | "Data Insights" | "Verbal";
  trapType: "Math Trap" | "RC Scope Shift" | "Careless / Arithmetic" | "Timing Pressure";
  takeaway: string;
  date: string;
}

export default function LifeHub() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<"all" | "gmat" | "bible" | "habits" | "projects" | "music">("all");

  // Time & Greeting
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [greeting, setGreeting] = useState("Welcome");

  // GMAT December Sprint State
  const [gmatTimerSeconds, setGmatTimerSeconds] = useState(3600); // 60 minutes
  const [gmatTimerRunning, setGmatTimerRunning] = useState(false);
  const [gmatErrors, setGmatErrors] = useState<GmatErrorLog[]>([
    {
      id: "1",
      question: "OG Quant PS #42",
      section: "Quant",
      trapType: "Math Trap",
      takeaway: "Check constraint x < 0 before simplifying inequalities with variables.",
      date: "Nov 9",
    },
    {
      id: "2",
      question: "Data Insights Multi-Source",
      section: "Data Insights",
      trapType: "Timing Pressure",
      takeaway: "Skim Tab 1 first to grasp structure; don't read full paragraphs until checking question.",
      date: "Nov 8",
    },
  ]);
  const [newErrorQ, setNewErrorQ] = useState("");
  const [newErrorSection, setNewErrorSection] = useState<"Quant" | "Data Insights" | "Verbal">("Quant");
  const [newErrorTrap, setNewErrorTrap] = useState<"Math Trap" | "RC Scope Shift" | "Careless / Arithmetic" | "Timing Pressure">("Math Trap");
  const [newErrorTakeaway, setNewErrorTakeaway] = useState("");

  // Bible Verse State
  const [dailyVerse, setDailyVerse] = useState({
    reference: "Proverbs 3:5-6",
    text: "Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
    translation: "NIV",
    theme: "Trust & Guidance",
    reflection: "Surrender worries today and focus on taking each faithful step forward with confidence.",
  });
  const [verseCopied, setVerseCopied] = useState(false);
  const [verseBookmarked, setVerseBookmarked] = useState(false);

  // Bible Reading Plan State
  const [bibleTranslation, setBibleTranslation] = useState<"NIV" | "ESV" | "NLT" | "KJV">("NIV");
  const [readingPlan, setReadingPlan] = useState({
    name: "Romans Deep Study",
    currentChapter: 8,
    totalChapters: 16,
  });

  // Notes state
  const [notes, setNotes] = useState<StudyNote[]>([
    {
      id: "1",
      reference: "Romans 8:1",
      note: "There is now no condemnation for those who are in Christ Jesus. True freedom starts in the mind.",
      date: "Nov 8, 2026",
    },
  ]);
  const [newNoteRef, setNewNoteRef] = useState("");
  const [newNoteText, setNewNoteText] = useState("");

  // Calibrated Habits State (Reflecting Jaison's 4 Core Pillars)
  const [habits, setHabits] = useState<Habit[]>([
    { id: "1", name: "GMAT 60-min Focus Session", category: "Growth", streak: 5, completedToday: false },
    { id: "2", name: "Morning Scripture (Romans) & Prayer", category: "Spiritual", streak: 7, completedToday: true },
    { id: "3", name: "30-min Physical Training / Workout", category: "Health", streak: 4, completedToday: false },
    { id: "4", name: "AI & Tech Strategy Synthesis", category: "Growth", streak: 3, completedToday: true },
  ]);

  // Projects State
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "GMAT Focus Edition 715+ Sprint (Dec 2026)",
      category: "Career & Education",
      progress: 65,
      status: "In Progress",
      deadline: "Dec 2026",
    },
    {
      id: "2",
      name: "Veerakeralapudur Farm Model (0.25 Acre)",
      category: "Entrepreneurship",
      progress: 25,
      status: "Planning",
      deadline: "2027",
    },
    {
      id: "3",
      name: "Life Operating System (life-hub)",
      category: "Applied AI & Portfolio",
      progress: 90,
      status: "In Progress",
      deadline: "Nov 2026",
    },
  ]);

  // New project modal / inputs
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjName, setNewProjName] = useState("");
  const [newProjCategory, setNewProjCategory] = useState("Personal");

  // Music Player state
  const [currentPlaylist, setCurrentPlaylist] = useState({
    title: "Deep Worship & Peaceful Acoustic",
    subtitle: "Elevation, Hillsong, Instrumental Hymns",
    ytUrl: "https://music.youtube.com/search?q=acoustic+worship",
  });
  const [ytConnected, setYtConnected] = useState(false);
  const [ytLoading, setYtLoading] = useState(true);
  const [userPlaylists, setUserPlaylists] = useState<any[]>([]);

  // Disconnect YouTube
  const disconnectYouTube = async () => {
    await fetch("/api/auth/youtube/logout", { method: "POST" });
    setYtConnected(false);
    setUserPlaylists([]);
  };

  // Load / Save localStorage for persistence
  useEffect(() => {
    // Clock & Greeting
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      setCurrentDate(
        now.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" })
      );

      const hour = now.getHours();
      if (hour < 12) setGreeting("Good morning");
      else if (hour < 18) setGreeting("Good afternoon");
      else setGreeting("Good evening");
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    // Fetch daily verse from backend API
    fetch("/api/bible/daily")
      .then((res) => res.json())
      .then((data) => {
        if (data.verse) setDailyVerse(data.verse);
      })
      .catch(() => {});

    // Check YouTube Music connection & fetch real playlists
    fetch("/api/youtube/playlists")
      .then((res) => res.json())
      .then((data) => {
        if (data.connected && data.playlists) {
          setYtConnected(true);
          setUserPlaylists(data.playlists);
        }
        setYtLoading(false);
      })
      .catch(() => setYtLoading(false));

    // Try reading localStorage for saved habits/projects/notes
    try {
      const savedHabits = localStorage.getItem("lifehub_habits");
      if (savedHabits) setHabits(JSON.parse(savedHabits));

      const savedProjects = localStorage.getItem("lifehub_projects");
      if (savedProjects) setProjects(JSON.parse(savedProjects));

      const savedNotes = localStorage.getItem("lifehub_notes");
      if (savedNotes) setNotes(JSON.parse(savedNotes));
    } catch {}

    return () => clearInterval(timer);
  }, []);

  // 60-minute GMAT focus countdown timer
  useEffect(() => {
    let interval: any = null;
    if (gmatTimerRunning && gmatTimerSeconds > 0) {
      interval = setInterval(() => {
        setGmatTimerSeconds((s) => s - 1);
      }, 1000);
    } else if (gmatTimerSeconds === 0 && gmatTimerRunning) {
      setGmatTimerRunning(false);
      // Auto-complete GMAT focus habit
      const updated = habits.map((h) => {
        if (h.name.includes("GMAT 60-min")) {
          return { ...h, completedToday: true, streak: h.completedToday ? h.streak : h.streak + 1 };
        }
        return h;
      });
      saveHabits(updated);
    }
    return () => clearInterval(interval);
  }, [gmatTimerRunning, gmatTimerSeconds, habits]);

  const addGmatError = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newErrorQ.trim() || !newErrorTakeaway.trim()) return;
    const item: GmatErrorLog = {
      id: Date.now().toString(),
      question: newErrorQ,
      section: newErrorSection,
      trapType: newErrorTrap,
      takeaway: newErrorTakeaway,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    };
    const updated = [item, ...gmatErrors];
    setGmatErrors(updated);
    try {
      localStorage.setItem("lifehub_gmaterrors", JSON.stringify(updated));
    } catch {}
    setNewErrorQ("");
    setNewErrorTakeaway("");
  };

  // Save changes to localStorage
  const saveHabits = (updated: Habit[]) => {
    setHabits(updated);
    try {
      localStorage.setItem("lifehub_habits", JSON.stringify(updated));
    } catch {}
  };

  const toggleHabit = (id: string) => {
    const updated = habits.map((h) => {
      if (h.id === id) {
        const nextCompleted = !h.completedToday;
        return {
          ...h,
          completedToday: nextCompleted,
          streak: nextCompleted ? h.streak + 1 : Math.max(0, h.streak - 1),
        };
      }
      return h;
    });
    saveHabits(updated);
  };

  const addProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim()) return;
    const newProj: Project = {
      id: Date.now().toString(),
      name: newProjName,
      category: newProjCategory,
      progress: 10,
      status: "In Progress",
      deadline: "Q4 2026",
    };
    const updated = [newProj, ...projects];
    setProjects(updated);
    try {
      localStorage.setItem("lifehub_projects", JSON.stringify(updated));
    } catch {}
    setNewProjName("");
    setShowNewProject(false);
  };

  const addNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    const note: StudyNote = {
      id: Date.now().toString(),
      reference: newNoteRef.trim() || "Reflection",
      note: newNoteText,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    };
    const updated = [note, ...notes];
    setNotes(updated);
    try {
      localStorage.setItem("lifehub_notes", JSON.stringify(updated));
    } catch {}
    setNewNoteRef("");
    setNewNoteText("");
  };

  const completedHabitsCount = habits.filter((h) => h.completedToday).length;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-amber-500/20">
      {/* Top Header / Status Bar */}
      <header className="border-b border-neutral-800/70 bg-neutral-900/40 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center font-bold text-white shadow-lg shadow-amber-500/20">
              ✝
            </div>
            <div>
              <div className="font-bold text-lg text-white tracking-tight flex items-center gap-2">
                Jaison's Life OS
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                  Personal Hub
                </span>
              </div>
              <div className="text-xs text-neutral-400 flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                {currentDate || "Loading date..."}
              </div>
            </div>
          </div>

          {/* Time & Quick Stats */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-3.5 py-1.5 rounded-full text-xs font-mono text-neutral-300">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              {currentTime || "--:--"}
            </div>
            <a
              href="https://github.com/JaisonSam/life-hub"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              GitHub <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Navigation Filter Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex gap-2 overflow-x-auto pb-3 text-xs font-medium">
          {[
            { id: "all", label: "Overview Hub", icon: Sparkles },
            { id: "gmat", label: "GMAT 715+ Sprint", icon: Target },
            { id: "bible", label: "Bible & Scripture", icon: BookOpen },
            { id: "habits", label: "Habit Tracker", icon: Flame },
            { id: "projects", label: "Projects Tracker", icon: FolderKanban },
            { id: "music", label: "Music & Worship", icon: Music },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all ${
                  active
                    ? "bg-amber-500 text-neutral-950 font-semibold shadow-md shadow-amber-500/20"
                    : "bg-neutral-900/60 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800/60"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Welcome Greeting Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900/80 to-neutral-950 border border-neutral-800 shadow-xl">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {greeting}, Jaison.
            </h1>
            <p className="text-sm text-neutral-400 mt-1">
              "Commit your actions to the LORD, and your plans will succeed." — Proverbs 16:3
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-neutral-400">Daily Habits</div>
              <div className="text-sm font-bold text-amber-400 font-mono">
                {completedHabitsCount} / {habits.length} Done
              </div>
            </div>
            <div className="h-10 w-10 rounded-full border border-amber-500/30 bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold text-xs">
              {Math.round((completedHabitsCount / habits.length) * 100)}%
            </div>
          </div>
        </div>

        {/* 1. DAILY BIBLE QUOTE MODULE */}
        {(activeTab === "all" || activeTab === "bible") && (
          <section className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-950/20 via-neutral-900 to-neutral-950 p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
                <BookOpen className="w-4 h-4" />
                Daily Verse & Scripture Inspiration
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setVerseBookmarked(!verseBookmarked)}
                  className={`p-2 rounded-lg border text-xs transition-colors ${
                    verseBookmarked
                      ? "bg-amber-500 text-neutral-950 border-amber-500 font-semibold"
                      : "border-neutral-800 text-neutral-400 hover:text-white"
                  }`}
                  title="Bookmark Verse"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`"${dailyVerse.text}" - ${dailyVerse.reference}`);
                    setVerseCopied(true);
                    setTimeout(() => setVerseCopied(false), 2000);
                  }}
                  className="p-2 rounded-lg border border-neutral-800 text-neutral-400 hover:text-white text-xs transition-colors flex items-center gap-1"
                  title="Copy Verse"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  {verseCopied ? "Copied!" : ""}
                </button>
              </div>
            </div>

            <blockquote className="text-xl sm:text-2xl font-serif leading-relaxed text-neutral-100 my-4 italic">
              "{dailyVerse.text}"
            </blockquote>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-neutral-800/80">
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-300 text-base">{dailyVerse.reference}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 font-mono">
                  {dailyVerse.translation}
                </span>
                <span className="text-xs text-neutral-400">• {dailyVerse.theme}</span>
              </div>
              <p className="text-xs text-neutral-400 max-w-md italic">
                💡 Reflection: {dailyVerse.reflection}
              </p>
            </div>
          </section>
        )}

        {/* GMAT FOCUS EDITION DECEMBER SPRINT MODULE */}
        {(activeTab === "all" || activeTab === "gmat") && (
          <section className="p-6 sm:p-8 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/25 via-neutral-900 to-neutral-950 shadow-2xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-md">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-extrabold text-lg text-white flex items-center gap-2">
                    GMAT Focus Edition Sprint
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold">
                      Target: 715+ (99th %ile)
                    </span>
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Exam Target: <span className="text-indigo-300 font-semibold">December 2026</span> • ~45 Days Runway • 1 Hour Daily Compounding
                  </p>
                </div>
              </div>

              {/* 60-Minute Focus Session Stopwatch / Countdown */}
              <div className="flex items-center gap-3 p-2 px-3 rounded-2xl border border-neutral-800 bg-neutral-950/80">
                <Timer className="w-4 h-4 text-indigo-400 animate-pulse" />
                <div className="text-sm font-mono font-bold text-white">
                  {Math.floor(gmatTimerSeconds / 60)
                    .toString()
                    .padStart(2, "0")}
                  :{(gmatTimerSeconds % 60).toString().padStart(2, "0")}
                </div>
                <button
                  onClick={() => setGmatTimerRunning(!gmatTimerRunning)}
                  className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    gmatTimerRunning
                      ? "bg-amber-500 text-neutral-950"
                      : "bg-indigo-600 hover:bg-indigo-500 text-white"
                  }`}
                  title={gmatTimerRunning ? "Pause Focus Hour" : "Start 60m Focus Hour"}
                >
                  {gmatTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => {
                    setGmatTimerRunning(false);
                    setGmatTimerSeconds(3600);
                  }}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-white transition-colors"
                  title="Reset to 60 Minutes"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Score Delta Ladder & 3 Section Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Quant Section */}
              <div className="p-4 rounded-2xl border border-neutral-800 bg-neutral-900/60 space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Quantitative Reasoning
                  </span>
                  <span className="font-mono text-emerald-400 font-semibold">Q82 → Q88</span>
                </div>
                <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full" style={{ width: "78%" }} />
                </div>
                <p className="text-[11px] text-neutral-400 leading-tight">
                  Strengths: Algebra, Arithmetic, Problem Solving. Focus: Trap avoidance.
                </p>
              </div>

              {/* Data Insights Section */}
              <div className="p-4 rounded-2xl border border-neutral-800 bg-neutral-900/60 space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-400" />
                    Data Insights (DI)
                  </span>
                  <span className="font-mono text-indigo-400 font-semibold">DI80 → DI85</span>
                </div>
                <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-blue-400 h-full rounded-full" style={{ width: "70%" }} />
                </div>
                <p className="text-[11px] text-neutral-400 leading-tight">
                  Multi-source reasoning, Table analysis, Data Sufficiency (ERP analytical synergy).
                </p>
              </div>

              {/* Verbal Section */}
              <div className="p-4 rounded-2xl border border-neutral-800 bg-neutral-900/60 space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    Verbal Reasoning
                  </span>
                  <span className="font-mono text-amber-400 font-semibold">V80 → V84</span>
                </div>
                <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-400 h-full rounded-full" style={{ width: "65%" }} />
                </div>
                <p className="text-[11px] text-neutral-400 leading-tight">
                  Critical Reasoning & Reading Comprehension. Focus: Structural passage mapping.
                </p>
              </div>
            </div>

            {/* Error Log & Trap Notebook Drawer */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-neutral-300 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  Trap & Error Diagnosis Notebook ({gmatErrors.length} Logged)
                </span>
                <span className="text-[11px] text-neutral-500">Every error understood is +5 points</span>
              </div>

              {/* Error Entry Form */}
              <form onSubmit={addGmatError} className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <input
                  type="text"
                  placeholder="Question / Source (e.g. OG Quant PS #45)..."
                  value={newErrorQ}
                  onChange={(e) => setNewErrorQ(e.target.value)}
                  className="sm:col-span-3 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
                />
                <select
                  value={newErrorSection}
                  onChange={(e: any) => setNewErrorSection(e.target.value)}
                  className="sm:col-span-2 px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Quant">Quant</option>
                  <option value="Data Insights">Data Insights</option>
                  <option value="Verbal">Verbal</option>
                </select>
                <select
                  value={newErrorTrap}
                  onChange={(e: any) => setNewErrorTrap(e.target.value)}
                  className="sm:col-span-2 px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Math Trap">Math Trap</option>
                  <option value="RC Scope Shift">RC Scope Shift</option>
                  <option value="Careless / Arithmetic">Careless</option>
                  <option value="Timing Pressure">Timing</option>
                </select>
                <input
                  type="text"
                  placeholder="What was the trap & takeaway rule?..."
                  value={newErrorTakeaway}
                  onChange={(e) => setNewErrorTakeaway(e.target.value)}
                  className="sm:col-span-4 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="sm:col-span-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  Log
                </button>
              </form>

              {/* Error Log Entries */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-36 overflow-y-auto pr-1">
                {gmatErrors.map((err) => (
                  <div key={err.id} className="p-3 rounded-xl border border-neutral-800/80 bg-neutral-950/70 text-xs space-y-1">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-bold text-indigo-300">{err.question}</span>
                      <span className="px-2 py-0.5 rounded bg-neutral-800 text-amber-400 font-semibold">{err.trapType}</span>
                    </div>
                    <p className="text-neutral-300 text-[11px] leading-relaxed">
                      💡 {err.takeaway}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 2-COLUMN GRID: HABITS & BIBLE ORGANISER */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* HABIT TRACKER */}
          {(activeTab === "all" || activeTab === "habits") && (
            <section className="p-6 rounded-2xl border border-neutral-800/80 bg-neutral-900/40 backdrop-blur-sm space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-bold text-base text-white">Daily Habit Tracker</h2>
                    <p className="text-xs text-neutral-400">Consistency builds destiny</p>
                  </div>
                </div>
                <div className="text-xs text-neutral-400">
                  {completedHabitsCount} of {habits.length} Completed
                </div>
              </div>

              {/* Habit List */}
              <div className="space-y-2.5">
                {habits.map((h) => (
                  <div
                    key={h.id}
                    onClick={() => toggleHabit(h.id)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                      h.completedToday
                        ? "bg-amber-500/10 border-amber-500/40 text-white"
                        : "bg-neutral-900/60 border-neutral-800 hover:border-neutral-700 text-neutral-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {h.completedToday ? (
                        <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-neutral-500 flex-shrink-0" />
                      )}
                      <div>
                        <div className={`text-sm font-medium ${h.completedToday ? "line-through text-neutral-400" : ""}`}>
                          {h.name}
                        </div>
                        <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">
                          {h.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-800/80 border border-neutral-700/50 text-xs font-mono text-orange-400">
                      <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                      {h.streak}d
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* BIBLE ORGANISER & YOUVERSION INTEGRATION */}
          {(activeTab === "all" || activeTab === "bible") && (
            <section className="p-6 rounded-2xl border border-neutral-800/80 bg-neutral-900/40 backdrop-blur-sm space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-bold text-base text-white flex items-center gap-2">
                      Bible Study Organiser
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                        YouVersion Companion
                      </span>
                    </h2>
                    <p className="text-xs text-neutral-400">Book of Romans • Android YouVersion App Integration</p>
                  </div>
                </div>

                {/* Translation Switcher */}
                <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 p-1 rounded-xl text-xs">
                  {(["NIV", "ESV", "NLT", "KJV"] as const).map((ver) => (
                    <button
                      key={ver}
                      onClick={() => setBibleTranslation(ver)}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                        bibleTranslation === ver
                          ? "bg-emerald-500 text-neutral-950 shadow-sm"
                          : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      {ver}
                    </button>
                  ))}
                </div>
              </div>

              {/* Book of Romans - Chapter Quick Navigator */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs text-neutral-400">
                  <span className="font-medium text-neutral-300">Book of Romans (16 Chapters)</span>
                  <span>Chapter {readingPlan.currentChapter} of 16</span>
                </div>
                <div className="grid grid-cols-8 gap-1.5 sm:grid-cols-16">
                  {Array.from({ length: 16 }, (_, i) => i + 1).map((ch) => {
                    const isCurrent = readingPlan.currentChapter === ch;
                    const isDone = ch < readingPlan.currentChapter;
                    return (
                      <button
                        key={ch}
                        onClick={() =>
                          setReadingPlan((p) => ({
                            ...p,
                            currentChapter: ch,
                          }))
                        }
                        className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                          isCurrent
                            ? "bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/30 scale-105"
                            : isDone
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-neutral-900 hover:bg-neutral-800 text-neutral-400 border border-neutral-800"
                        }`}
                      >
                        {ch}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Chapter Card & YouVersion Launchers */}
              <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
                      Today's Reading Target
                    </div>
                    <div className="text-base font-bold text-white mt-0.5">
                      Romans Chapter {readingPlan.currentChapter} ({bibleTranslation})
                    </div>
                    <p className="text-xs text-neutral-400 mt-1">
                      {readingPlan.currentChapter === 8
                        ? "Life in the Spirit & God's Everlasting Love (No condemnation in Christ)"
                        : readingPlan.currentChapter === 12
                        ? "Living Sacrifices & Transformed Minds"
                        : "Walk in faithful obedience and deep scripture meditation"}
                    </p>
                  </div>

                  {/* YouVersion Version IDs for Android: NIV=111, ESV=59, NLT=116, KJV=1 */}
                  {(() => {
                    const versionIds: Record<string, number> = { NIV: 111, ESV: 59, NLT: 116, KJV: 1 };
                    const vId = versionIds[bibleTranslation] || 111;
                    const youversionUrl = `https://www.bible.com/bible/${vId}/ROM.${readingPlan.currentChapter}.${bibleTranslation}`;

                    return (
                      <a
                        href={youversionUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-bold shadow-lg shadow-red-600/25 transition-all text-center flex-shrink-0"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open in YouVersion App
                      </a>
                    );
                  })()}
                </div>

                {/* Mark Chapter Read + Streak Advance */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-800 text-xs">
                  <div className="flex items-center gap-2 text-neutral-400">
                    <span>Reading Progress:</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {Math.round((readingPlan.currentChapter / 16) * 100)}% Complete
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      // Advance chapter
                      const nextCh = Math.min(16, readingPlan.currentChapter + 1);
                      setReadingPlan((p) => ({ ...p, currentChapter: nextCh }));

                      // Also mark the daily habit 'Read 1 Chapter' as completed!
                      const updatedHabits = habits.map((h) => {
                        if (h.name.includes("Read 1 Chapter")) {
                          return {
                            ...h,
                            completedToday: true,
                            streak: h.completedToday ? h.streak : h.streak + 1,
                          };
                        }
                        return h;
                      });
                      saveHabits(updatedHabits);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Mark Chapter Done & Sync Habit
                  </button>
                </div>
              </div>

              {/* Study Notes Form */}
              <form onSubmit={addNote} className="space-y-2">
                <div className="text-xs font-semibold text-neutral-300">Takeaway & Study Journal</div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={`Romans ${readingPlan.currentChapter}:...`}
                    value={newNoteRef}
                    onChange={(e) => setNewNoteRef(e.target.value)}
                    className="w-1/3 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="text"
                    placeholder="Write a personal reflection or sermon note..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    className="w-2/3 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    Save
                  </button>
                </div>
              </form>

              {/* Recent Saved Notes */}
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {notes.map((n) => (
                  <div key={n.id} className="p-3 rounded-lg border border-neutral-800/80 bg-neutral-950/60 text-xs">
                    <div className="flex justify-between items-center text-neutral-400 text-[10px] mb-1">
                      <span className="font-bold text-amber-300">{n.reference}</span>
                      <span>{n.date}</span>
                    </div>
                    <p className="text-neutral-300 leading-relaxed">{n.note}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* 3. PROJECTS TRACKER MODULE */}
        {(activeTab === "all" || activeTab === "projects") && (
          <section className="p-6 rounded-2xl border border-neutral-800/80 bg-neutral-900/40 backdrop-blur-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <FolderKanban className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-bold text-base text-white">Active Projects Tracker</h2>
                  <p className="text-xs text-neutral-400">Goals, deliverables, and progress</p>
                </div>
              </div>

              <button
                onClick={() => setShowNewProject(!showNewProject)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-md shadow-blue-600/20"
              >
                <Plus className="w-3.5 h-3.5" />
                New Project
              </button>
            </div>

            {/* New Project Form Modal */}
            {showNewProject && (
              <form onSubmit={addProject} className="p-4 rounded-xl border border-blue-500/30 bg-blue-950/20 space-y-3">
                <div className="text-xs font-semibold text-blue-300">Add New Project</div>
                <div className="flex flex-wrap gap-2">
                  <input
                    type="text"
                    placeholder="Project Name..."
                    value={newProjName}
                    onChange={(e) => setNewProjName(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Category (e.g. Life, Tech, Spiritual)..."
                    value={newProjCategory}
                    onChange={(e) => setNewProjCategory(e.target.value)}
                    className="w-48 px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    Create
                  </button>
                </div>
              </form>
            )}

            {/* Project Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 hover:border-neutral-700 transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-2">
                      <span className="text-neutral-400 font-medium">{proj.category}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          proj.status === "Completed"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        }`}
                      >
                        {proj.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-white">{proj.name}</h3>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-neutral-400">
                      <span>Progress</span>
                      <span className="font-mono text-white">{proj.progress}%</span>
                    </div>
                    <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all"
                        style={{ width: `${proj.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. MUSIC & WORSHIP RECOMMENDATIONS */}
        {(activeTab === "all" || activeTab === "music") && (
          <section className="p-6 rounded-2xl border border-neutral-800/80 bg-neutral-900/40 backdrop-blur-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <Headphones className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-bold text-base text-white flex items-center gap-2">
                    YouTube Music & Worship
                    {ytConnected ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                        ✓ Account Connected
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 font-medium">
                        Not Connected
                      </span>
                    )}
                  </h2>
                  <p className="text-xs text-neutral-400">Personal playlists, worship, and study soundtracks</p>
                </div>
              </div>

              {ytConnected ? (
                <button
                  onClick={disconnectYouTube}
                  className="px-3 py-1.5 rounded-lg border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white text-xs transition-colors"
                >
                  Disconnect Account
                </button>
              ) : (
                <a
                  href="/api/auth/youtube/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/25 transition-all"
                >
                  <Music className="w-3.5 h-3.5" />
                  Connect YouTube Account
                </a>
              )}
            </div>

            {/* IF CONNECTED: SHOW AUTHENTIC USER PLAYLISTS */}
            {ytConnected && (
              <div className="space-y-3">
                <div className="text-xs font-semibold text-neutral-300 flex items-center justify-between">
                  <span>Your Personal YouTube Music Playlists ({userPlaylists.length})</span>
                  <span className="text-[11px] text-neutral-500">Synced via YouTube Data API</span>
                </div>

                {userPlaylists.length === 0 ? (
                  <div className="p-6 rounded-xl border border-neutral-800/80 bg-neutral-950/60 text-center text-xs text-neutral-400">
                    No custom playlists found in this YouTube account. Create one in YouTube Music to see it here!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {userPlaylists.map((pl: any) => (
                      <a
                        key={pl.id}
                        href={pl.ytMusicUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-900/60 hover:border-rose-500/40 transition-all flex flex-col justify-between space-y-3 group"
                      >
                        <div className="flex items-center gap-3">
                          {pl.thumbnail ? (
                            <img
                              src={pl.thumbnail}
                              alt={pl.title}
                              className="w-12 h-12 rounded-lg object-cover border border-neutral-800 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-500 flex-shrink-0">
                              <Music className="w-5 h-5" />
                            </div>
                          )}
                          <div className="overflow-hidden">
                            <h4 className="font-bold text-xs text-white truncate group-hover:text-rose-300 transition-colors">
                              {pl.title}
                            </h4>
                            <p className="text-[11px] text-neutral-400 mt-0.5">
                              {pl.itemCount} tracks
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-2 border-t border-neutral-800">
                          <span>Open in YT Music</span>
                          <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-rose-400 transition-colors" />
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* CURATED MOOD CHANNELS (ALWAYS AVAILABLE) */}
            <div className="space-y-3">
              <div className="text-xs font-semibold text-neutral-400">
                {ytConnected ? "Quick Curated Channels" : "Curated Worship & Focus Channels"}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    title: "Acoustic Worship & Prayer",
                    artist: "Elevation Worship, Hillsong, Maverick City",
                    mood: "Spiritual Reflection",
                    ytQuery: "acoustic+worship+elevation+maverick+city",
                    tag: "Worship",
                  },
                  {
                    title: "Deep Focus & Study Flow",
                    artist: "Lo-Fi Instrumental & Ambient Piano",
                    mood: "Calm & Deep Coding",
                    ytQuery: "lofi+instrumental+focus+beats",
                    tag: "Focus",
                  },
                  {
                    title: "Morning Energy & Motivation",
                    artist: "Uplifting Contemporary Christian & Gospel",
                    mood: "High Energy & Drive",
                    ytQuery: "uplifting+christian+contemporary+energy",
                    tag: "Energy",
                  },
                ].map((p, idx) => (
                  <div
                    key={idx}
                    onClick={() =>
                      setCurrentPlaylist({
                        title: p.title,
                        subtitle: p.artist,
                        ytUrl: `https://music.youtube.com/search?q=${p.ytQuery}`,
                      })
                    }
                    className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 hover:border-rose-500/40 transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
                  >
                    <div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        {p.tag}
                      </span>
                      <h4 className="font-bold text-sm text-white mt-2 group-hover:text-rose-300 transition-colors">
                        {p.title}
                      </h4>
                      <p className="text-xs text-neutral-400 mt-1">{p.artist}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-neutral-500 pt-2 border-t border-neutral-800">
                      <span>{p.mood}</span>
                      <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Currently Selected Bar */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-neutral-800 bg-neutral-950/80">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <Volume2 className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{currentPlaylist.title}</div>
                  <div className="text-[11px] text-neutral-400">{currentPlaylist.subtitle}</div>
                </div>
              </div>
              <a
                href={currentPlaylist.ytUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white transition-colors flex items-center gap-1"
              >
                Listen Now <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800/80 py-6 text-center text-xs text-neutral-500">
        <div>Jaison's Personal Life Operating System • Built with Next.js, React 19 & Tailwind CSS</div>
        <div className="text-[11px] text-neutral-600 mt-1">
          Connected to GitHub (JaisonSam/life-hub) & Deployed on Vercel
        </div>
      </footer>
    </div>
  );
}
