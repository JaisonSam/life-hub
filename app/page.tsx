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

export default function LifeHub() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<"all" | "bible" | "habits" | "projects" | "music">("all");

  // Time & Greeting
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [greeting, setGreeting] = useState("Welcome");

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

  // Habits State
  const [habits, setHabits] = useState<Habit[]>([
    { id: "1", name: "Morning Scripture & Prayer", category: "Spiritual", streak: 7, completedToday: true },
    { id: "2", name: "30-min Physical Workout", category: "Health", streak: 4, completedToday: false },
    { id: "3", name: "Read 1 Chapter (Bible Organiser)", category: "Spiritual", streak: 12, completedToday: false },
    { id: "4", name: "Build & Code (Personal Website)", category: "Growth", streak: 3, completedToday: true },
  ]);

  // Projects State
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "Life Operating System (life-hub)",
      category: "Personal Website",
      progress: 80,
      status: "In Progress",
      deadline: "Nov 2026",
    },
    {
      id: "2",
      name: "Bible Reading & Study Organiser",
      category: "Spiritual Growth",
      progress: 50,
      status: "In Progress",
      deadline: "Dec 2026",
    },
    {
      id: "3",
      name: "YouTube Music Playlist Sync",
      category: "Media & Audio",
      progress: 30,
      status: "Planning",
      deadline: "Dec 2026",
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

          {/* BIBLE ORGANISER & READING PLAN */}
          {(activeTab === "all" || activeTab === "bible") && (
            <section className="p-6 rounded-2xl border border-neutral-800/80 bg-neutral-900/40 backdrop-blur-sm space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-bold text-base text-white">Bible Study Organiser</h2>
                    <p className="text-xs text-neutral-400">Active Reading Plan & Notes</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {readingPlan.name}
                </span>
              </div>

              {/* Reading Progress */}
              <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-300 font-medium">
                    Current Reading: Chapter {readingPlan.currentChapter} of {readingPlan.totalChapters}
                  </span>
                  <span className="text-emerald-400 font-mono font-semibold">
                    {Math.round((readingPlan.currentChapter / readingPlan.totalChapters) * 100)}% Complete
                  </span>
                </div>
                <div className="w-full bg-neutral-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(readingPlan.currentChapter / readingPlan.totalChapters) * 100}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between items-center pt-1 text-xs">
                  <button
                    onClick={() =>
                      setReadingPlan((p) => ({
                        ...p,
                        currentChapter: Math.max(1, p.currentChapter - 1),
                      }))
                    }
                    className="text-neutral-400 hover:text-white transition-colors"
                  >
                    ← Prev Chapter
                  </button>
                  <button
                    onClick={() =>
                      setReadingPlan((p) => ({
                        ...p,
                        currentChapter: Math.min(p.totalChapters, p.currentChapter + 1),
                      }))
                    }
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
                  >
                    Mark Chapter Done ✓
                  </button>
                </div>
              </div>

              {/* Study Notes Form */}
              <form onSubmit={addNote} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Verse Ref (e.g. Romans 8:28)"
                    value={newNoteRef}
                    onChange={(e) => setNewNoteRef(e.target.value)}
                    className="w-1/3 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="text"
                    placeholder="Write a reflection or study takeaway..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    className="w-2/3 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-semibold transition-colors"
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
          <section className="p-6 rounded-2xl border border-neutral-800/80 bg-neutral-900/40 backdrop-blur-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <Headphones className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-bold text-base text-white">Music & Worship Corner</h2>
                  <p className="text-xs text-neutral-400">YouTube Music curated moods & playlists</p>
                </div>
              </div>

              <a
                href={currentPlaylist.ytUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-all shadow-md shadow-rose-600/20"
              >
                Open in YouTube Music <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Playlist Cards */}
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
