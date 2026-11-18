"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  BookmarkPlus,
  Share2,
  Sparkles,
  Clock,
  Calendar,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
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
  BarChart3,
  Award,
  Trash2,
  LineChart,
  Radio,
  Settings,
  RefreshCw,
  Disc,
  PlayCircle,
  Sprout,
  Trees,
  Wheat,
  Calculator,
  Coins,
  BookMarked,
  Library,
  Brain,
  Lightbulb,
  Layers,
  Cpu,
  Check,
  Droplets,
  Sun,
  FolderSync,
  Briefcase,
} from "lucide-react";
import EpubReaderModal from "@/components/EpubReaderModal";
import KoboHighlightsModal, { ExtractedHighlight } from "@/components/KoboHighlightsModal";
import DailyRecommendationsDeck from "@/components/DailyRecommendationsDeck";
import GoogleDriveBookshelf from "@/components/GoogleDriveBookshelf";
import GoogleConnectedAppsDeck from "@/components/GoogleConnectedAppsDeck";
import GlanceDashboard from "@/components/GlanceDashboard";
import GlanceErrorBoundary from "@/components/GlanceErrorBoundary";
import AOSInit from "@/components/AOSInit";
import WelcomeIntro from "@/components/WelcomeIntro";
import TronBackgroundVideo from "@/components/TronBackgroundVideo";
import YouVersionVerse from "@/components/YouVersionVerse";
import { loadDailyHabits, toggleDailyHabitStorage, getDateKey } from "@/lib/dailyHabits";

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

interface GmatErrorLog {
  id: string;
  question: string;
  section: "Quant" | "Data Insights" | "Verbal";
  trapType: "Math Trap" | "RC Scope Shift" | "Careless / Arithmetic" | "Timing Pressure";
  takeaway: string;
  date: string;
}

interface GmatMockScore {
  id: string;
  name: string;
  date: string;
  total: number;
  quant: number;
  di: number;
  verbal: number;
  notes?: string;
}

function getGmatFocusPercentile(score: number): number {
  if (score >= 755) return 100;
  if (score >= 715) return 99;
  if (score >= 705) return 98;
  if (score >= 695) return 97;
  if (score >= 685) return 96;
  if (score >= 675) return 95;
  if (score >= 665) return 93;
  if (score >= 655) return 90;
  if (score >= 645) return 86;
  if (score >= 635) return 81;
  if (score >= 625) return 76;
  if (score >= 615) return 70;
  if (score >= 605) return 64;
  if (score >= 595) return 58;
  if (score >= 585) return 52;
  return 45;
}

interface CuratedAlbum {
  id: string;
  title: string;
  artist: string;
  category: "worship" | "focus" | "energy";
  tag: string;
  trackCount: number;
  coverUrl: string;
  ytUrl: string;
  moodDescription: string;
  bpmOrVibe: string;
}

const curatedAlbums: CuratedAlbum[] = [
  // Worship & Sanctuary
  {
    id: "w-1",
    title: "Acoustic Worship & Intimate Prayer",
    artist: "Maverick City Music, Elevation, Bethel",
    category: "worship",
    tag: "Devotional Sanctuary",
    trackCount: 38,
    coverUrl: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=600&q=80",
    ytUrl: "https://music.youtube.com/search?q=acoustic+worship+intimate+prayer+elevation+maverick+city",
    moodDescription: "Deep acoustic strings, peaceful worship, and prayerful surrender.",
    bpmOrVibe: "Acoustic & Piano",
  },
  {
    id: "w-2",
    title: "Instrumental Peace: Romans Companion",
    artist: "Peaceful Piano & Ambient Cello Hymns",
    category: "worship",
    tag: "Scripture Study",
    trackCount: 24,
    coverUrl: "https://images.unsplash.com/photo-1520523839898-507127053c37?auto=format&fit=crop&w=600&q=80",
    ytUrl: "https://music.youtube.com/search?q=peaceful+christian+instrumental+piano+hymns",
    moodDescription: "Calm instrumental hymnody calibrated for morning reading in Book of Romans.",
    bpmOrVibe: "60 BPM Calm",
  },
  {
    id: "w-3",
    title: "Live Kingdom Anthems & Praise",
    artist: "Brandon Lake, Phil Wickham, Chris Tomlin",
    category: "worship",
    tag: "Faith Anthems",
    trackCount: 42,
    coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    ytUrl: "https://music.youtube.com/search?q=brandon+lake+phil+wickham+live+worship+anthems",
    moodDescription: "Bold, soaring declarations of victory and sovereign faith.",
    bpmOrVibe: "High Inspiration",
  },

  // Focus & GMAT Sprint
  {
    id: "f-1",
    title: "GMAT 715+ Quant Flow: Lo-Fi Beats",
    artist: "Chilled Beats & Calm Keyboard",
    category: "focus",
    tag: "GMAT Sprint Flow",
    trackCount: 50,
    coverUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
    ytUrl: "https://music.youtube.com/search?q=lofi+beats+to+study+solve+quant+problems",
    moodDescription: "Steady 80 BPM rhythm designed to eliminate cognitive fatigue during algebra & DI sprints.",
    bpmOrVibe: "80 BPM Lo-Fi",
  },
  {
    id: "f-2",
    title: "Alpha Brainwaves & Ambient Focus (432Hz)",
    artist: "Binaural Synthesis & Deep Space Piano",
    category: "focus",
    tag: "Deep Concentration",
    trackCount: 18,
    coverUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    ytUrl: "https://music.youtube.com/search?q=432hz+alpha+waves+deep+study+focus+piano",
    moodDescription: "Zero-vocal binaural soundscapes for reading comprehension passage mapping.",
    bpmOrVibe: "432Hz Ambient",
  },
  {
    id: "f-3",
    title: "Cyberpunk & High-Speed Synthesis",
    artist: "Synthwave / Dark Ambient Electronic",
    category: "focus",
    tag: "Analytical Drive",
    trackCount: 32,
    coverUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80",
    ytUrl: "https://music.youtube.com/search?q=synthwave+coding+focus+electronic+instrumental",
    moodDescription: "Driving electronic pulse for high-tempo problem solving and data analysis.",
    bpmOrVibe: "Electronic Drive",
  },

  // Gym & High Energy
  {
    id: "e-1",
    title: "Kingdom High-BPM Workout & Training",
    artist: "Lecrae, Andy Mineo, KB, Hulvey",
    category: "energy",
    tag: "Physical Training",
    trackCount: 35,
    coverUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
    ytUrl: "https://music.youtube.com/search?q=christian+hip+hop+workout+lecrae+kb+mineo",
    moodDescription: "Heavy bass, high intensity, and spiritually grounded motivation for gym workouts.",
    bpmOrVibe: "140 BPM Hype",
  },
  {
    id: "e-2",
    title: "Joyful African & Caribbean Gospel Praise",
    artist: "Sinach, Moses Bliss, Limoblaze, Ada Ehi",
    category: "energy",
    tag: "Celebration",
    trackCount: 30,
    coverUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80",
    ytUrl: "https://music.youtube.com/search?q=afrobeats+gospel+praise+limoblaze+moses+bliss",
    moodDescription: "Infectious Afro-gospel groove for morning energy and celebratory walks.",
    bpmOrVibe: "Afrobeats Praise",
  },
];



// STRATEGIC BOOKSHELF DATA
interface StrategicBook {
  id: string;
  title: string;
  author: string;
  category: "Geopolitics & Tech" | "Systems Thinking" | "Macroeconomics" | "Executive Strategy" | "Personal Systems";
  coverUrl: string;
  status: "Currently Reading" | "Completed" | "Queue";
  progress: number;
  rating: number;
  keyMentalModel: string;
  keyQuote: string;
  takeaway: string;
  pagesOrTime: string;
}

const initialStrategicBooks: StrategicBook[] = [
  {
    id: "b-1",
    title: "Chip War: The Fight for the World's Most Critical Technology",
    author: "Chris Miller",
    category: "Geopolitics & Tech",
    coverUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    status: "Currently Reading",
    progress: 85,
    rating: 5,
    keyMentalModel: "Chokepoint Capitalism & Lithography Moats (ASML, TSMC)",
    keyQuote: "Microchips are the new oil — the scarce resource the modern world depends on. But unlike oil, which is distributed across continents, 90% of the world's most advanced chips are made by one company on an island 100 miles from China.",
    takeaway: "Extreme technological concentration creates structural geopolitics. In software and enterprise architecture, identify and master single-point-of-leverage dependencies.",
    pagesOrTime: "370 of 430 pages",
  },
  {
    id: "b-2",
    title: "Thinking in Systems: A Primer",
    author: "Donella H. Meadows",
    category: "Systems Thinking",
    coverUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    status: "Completed",
    progress: 100,
    rating: 5,
    keyMentalModel: "Stocks, Flows, and Reinforcing Feedback Delays",
    keyQuote: "You think that because you understand 'one' that you must therefore understand 'two' because one and one make two. But you must also understand 'and'.",
    takeaway: "Never fix complex enterprise or agricultural systems through linear symptom treatment. Alter system rules, information flows, and delays at the leverage points.",
    pagesOrTime: "Completed • Essential mental model reference",
  },
  {
    id: "b-3",
    title: "Principles for Navigating Big Debt Crises",
    author: "Ray Dalio",
    category: "Macroeconomics",
    coverUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80",
    status: "Currently Reading",
    progress: 60,
    rating: 5,
    keyMentalModel: "Short vs Long-Term Debt Cycles & Beautiful Deleveraging",
    keyQuote: "An economy's capacity to grow is ultimately determined by productivity growth, while its volatility is determined by debt cycles.",
    takeaway: "Distinguish strictly between cash-flowing productive equity (farms, high-margin software skills) and consumption liabilities. Protect downside runway before levering upside.",
    pagesOrTime: "Part 2: Case Studies",
  },
  {
    id: "b-4",
    title: "High Output Management",
    author: "Andrew S. Grove (Former Intel CEO)",
    category: "Executive Strategy",
    coverUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
    status: "Completed",
    progress: 100,
    rating: 5,
    keyMentalModel: "Managerial Leverage & Limiting Steps in Production",
    keyQuote: "A manager's output = the output of his organization + the output of the neighboring organizations under his influence.",
    takeaway: "Find the single limiting step in every production line (whether manufacturing, GMAT Verbal pacing, or farm planting) and build all other activities around it.",
    pagesOrTime: "Completed • Core engineering framework",
  },
  {
    id: "b-5",
    title: "Atomic Habits",
    author: "James Clear",
    category: "Personal Systems",
    coverUrl: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=600&q=80",
    status: "Completed",
    progress: 100,
    rating: 5,
    keyMentalModel: "1% Daily Compounding & Environment Architecture",
    keyQuote: "You do not rise to the level of your goals. You fall to the level of your systems.",
    takeaway: "Life Hub is the software architecture of this principle — frictionless daily logging, streaks, and visible metric feedback loops build destiny automatically.",
    pagesOrTime: "Completed",
  },
];

export default function LifeHub() {
  // Intro & Homescreen visibility (Tron background integration)
  const [homescreenVisible, setHomescreenVisible] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [hasVideoEnded, setHasVideoEnded] = useState<boolean>(false);
  const sectionVideoRef = useRef<HTMLVideoElement>(null);

  const handleToggleSound = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const handleStopVideoAndShowScripture = useCallback(() => {
    setHasVideoEnded(true);
    setIsMuted(true);
    setHomescreenVisible(true);
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }

    // Stop background video and release audio stream immediately
    const bg = document.getElementById("tron-bg-video") as HTMLVideoElement | null;
    if (bg) {
      bg.pause();
      bg.muted = true;
      bg.currentTime = 0;
      try {
        bg.src = "";
        bg.load();
      } catch {}
    }

    // Stop section video immediately
    const sectionVideo = sectionVideoRef.current;
    if (sectionVideo) {
      sectionVideo.pause();
      sectionVideo.muted = true;
      try {
        sectionVideo.src = "";
        sectionVideo.load();
      } catch {}
    }
  }, []);

  const handleUnlockAudio = useCallback(() => {
    if (hasVideoEnded) return;
    setIsMuted(false);
    const bg = document.getElementById("tron-bg-video") as HTMLVideoElement | null;
    if (bg && !bg.ended) {
      bg.muted = false;
      bg.volume = 0.85;
      bg.play().catch(() => {});
    }
  }, [hasVideoEnded]);

  const handleGreetingAppear = useCallback(() => {
    if (hasVideoEnded) return;
    setIsMuted(false);
    const bg = document.getElementById("tron-bg-video") as HTMLVideoElement | null;
    if (bg && !bg.ended) {
      bg.currentTime = 0;
      bg.muted = false;
      const playPromise = bg.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If browser restricts unmuted autoplay, start muted initially until gesture
          bg.muted = true;
          bg.play().catch(() => {});
        });
      }
    }
  }, [hasVideoEnded]);

  // Section Video Manager:
  // - Keeps section video actively playing at all times (never freezes when scrolling down or up)
  // - Syncs timestamp continuously with the background video
  // - Visual-only (always muted) so browsers never restrict or block it
  useEffect(() => {
    if (hasVideoEnded) return;
    const video = sectionVideoRef.current;
    if (!video || video.ended) return;

    video.muted = true; // Visual only, background player handles master soundtrack

    const ensurePlayingAndSynced = () => {
      if (hasVideoEnded || video.ended) return;
      const bg = document.getElementById("tron-bg-video") as HTMLVideoElement | null;
      if (bg && !bg.ended && !isNaN(bg.currentTime) && bg.currentTime > 0) {
        const diff = Math.abs(video.currentTime - bg.currentTime);
        if (diff > 0.6) {
          video.currentTime = bg.currentTime;
        }
      }
      if (video.paused && !video.ended) {
        video.play().catch(() => {});
      }
    };

    // 1. Initial play attempt
    ensurePlayingAndSynced();
    video.addEventListener("loadedmetadata", ensurePlayingAndSynced);
    video.addEventListener("canplay", ensurePlayingAndSynced);

    // 2. Anti-pause safeguard: if browser tries to pause offscreen, immediately resume
    const handlePause = () => {
      if (!document.hidden && !hasVideoEnded && !video.ended) {
        requestAnimationFrame(() => {
          ensurePlayingAndSynced();
        });
      }
    };
    video.addEventListener("pause", handlePause);

    // 3. Scroll listener: whenever user scrolls down or back up, ensure playing & synced
    const handleScroll = () => {
      if (!hasVideoEnded && !video.ended) {
        ensurePlayingAndSynced();
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // 4. IntersectionObserver: whenever section is near or in viewport, ensure playing
    let observer: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasVideoEnded && !video.ended) {
              ensurePlayingAndSynced();
            }
          });
        },
        { rootMargin: "400px 0px" }
      );
      observer.observe(video);
    }

    // 5. Visibility change (when switching tabs)
    const handleVisibilityChange = () => {
      if (!document.hidden && !hasVideoEnded && !video.ended) {
        ensurePlayingAndSynced();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // 6. Periodic sync (every 1s) to keep showcase in lockstep with background video
    const syncInterval = setInterval(() => {
      if (!hasVideoEnded && !video.ended) {
        ensurePlayingAndSynced();
      }
    }, 1000);

    return () => {
      video.removeEventListener("loadedmetadata", ensurePlayingAndSynced);
      video.removeEventListener("canplay", ensurePlayingAndSynced);
      video.removeEventListener("pause", handlePause);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (observer) observer.disconnect();
      clearInterval(syncInterval);
    };
  }, [homescreenVisible, hasVideoEnded]);

  // Navigation tabs
  const [activeTab, setActiveTab] = useState<"all" | "google" | "books" | "habits" | "projects" | "music">("all");
  const [homeViewMode, setHomeViewMode] = useState<"glance" | "carousel" | "bento">("glance");

  // Strategic Bookshelf State
  const [bookshelf, setBookshelf] = useState<StrategicBook[]>(initialStrategicBooks);
  const [bookFilter, setBookFilter] = useState<"all" | "reading" | "completed" | "queue">("all");
  const [selectedBookModal, setSelectedBookModal] = useState<StrategicBook | null>(null);
  const [showAddBook, setShowAddBook] = useState(false);
  const [newBookTitle, setNewBookTitle] = useState("");
  const [newBookAuthor, setNewBookAuthor] = useState("");
  const [newBookCategory, setNewBookCategory] = useState<StrategicBook["category"]>("Geopolitics & Tech");
  const [newBookModel, setNewBookModel] = useState("");
  const [newBookQuote, setNewBookQuote] = useState("");
  const [newBookTakeaway, setNewBookTakeaway] = useState("");
  const [newBookProgress, setNewBookProgress] = useState(10);

  // Kobo & EPUB Reader State
  const [readerSource, setReaderSource] = useState<ArrayBuffer | File | string | null>(null);
  const [readerTitle, setReaderTitle] = useState("EPUB Reader");
  const [showKoboHighlightsModal, setShowKoboHighlightsModal] = useState(false);
  const [showKoboDeck, setShowKoboDeck] = useState(true);

  // Time & Greeting
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [greeting, setGreeting] = useState("Welcome");

  // GMAT December Sprint State
  const [gmatTimerSeconds, setGmatTimerSeconds] = useState(3600); // 60 minutes
  const [gmatTimerRunning, setGmatTimerRunning] = useState(false);
  const [mockScores, setMockScores] = useState<GmatMockScore[]>([
    {
      id: "mock-1",
      name: "Official Practice Exam 1 (Diagnostic)",
      date: "Nov 2, 2026",
      total: 615,
      quant: 81,
      di: 79,
      verbal: 81,
      notes: "Official mba.com baseline. Need to tighten DI pacing and eliminate careless Quant algebra traps.",
    },
    {
      id: "mock-2",
      name: "Official Practice Exam 2",
      date: "Nov 8, 2026",
      total: 645,
      quant: 83,
      di: 81,
      verbal: 82,
      notes: "+30 pts gained. Quant problem solving was solid. Focus now on Multi-Source Reasoning in DI and CR assumption traps.",
    },
  ]);
  const [showAddMock, setShowAddMock] = useState(false);
  const [newMockName, setNewMockName] = useState("Official Practice Exam 3");
  const [newMockDate, setNewMockDate] = useState("");
  const [newMockTotal, setNewMockTotal] = useState(665);
  const [newMockQuant, setNewMockQuant] = useState(84);
  const [newMockDI, setNewMockDI] = useState(82);
  const [newMockVerbal, setNewMockVerbal] = useState(83);
  const [newMockNotes, setNewMockNotes] = useState("");

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

  // Calibrated Habits State (Reflecting Jaison's Core Pillars)
  const [habits, setHabits] = useState<Habit[]>([
    { id: "1", name: "GMAT 60-min Focus Session", category: "Growth", streak: 5, completedToday: false },
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
      name: "Senior ERP Business Analyst Advancement",
      category: "Career & Leadership",
      progress: 75,
      status: "In Progress",
      deadline: "2026-2027",
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
    title: "Acoustic Worship & Intimate Prayer",
    subtitle: "Maverick City Music, Elevation, Bethel",
    ytUrl: "https://music.youtube.com/search?q=acoustic+worship+intimate+prayer+elevation+maverick+city",
    coverUrl: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=600&q=80",
    tag: "Devotional Sanctuary",
    bpmOrVibe: "Acoustic & Piano",
  });
  const [ytConnected, setYtConnected] = useState(false);
  const [ytLoading, setYtLoading] = useState(true);
  const [userPlaylists, setUserPlaylists] = useState<any[]>([]);

  // Last.fm & Android Live Mirror state
  const [lastFmUser, setLastFmUser] = useState("");
  const [lastFmApiKey, setLastFmApiKey] = useState("");
  const [showLastFmConfig, setShowLastFmConfig] = useState(false);
  const [nowPlayingTrack, setNowPlayingTrack] = useState<{
    configured: boolean;
    nowPlaying: boolean;
    title: string;
    artist: string;
    album: string;
    albumArt: string;
    ytMusicUrl: string;
    playedAt: string;
  } | null>(null);
  const [isFetchingNowPlaying, setIsFetchingNowPlaying] = useState(false);
  const [demoNowPlaying, setDemoNowPlaying] = useState(false);
  const [musicDeckFilter, setMusicDeckFilter] = useState<"all" | "worship" | "focus" | "energy" | "cloud">("all");

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

    // Try reading localStorage for saved habits/projects/notes/gmat
    try {
      const todayKey = getDateKey(new Date());
      const dailyHabits = loadDailyHabits(todayKey);
      if (dailyHabits && dailyHabits.length > 0) {
        setHabits(dailyHabits as any);
      } else {
        const savedHabits = localStorage.getItem("lifehub_habits");
        if (savedHabits) setHabits(JSON.parse(savedHabits));
      }

      const savedProjects = localStorage.getItem("lifehub_projects");
      if (savedProjects) setProjects(JSON.parse(savedProjects));

      const savedMocks = localStorage.getItem("lifehub_gmat_mocks");
      if (savedMocks) setMockScores(JSON.parse(savedMocks));

      const savedErrors = localStorage.getItem("lifehub_gmaterrors");
      if (savedErrors) setGmatErrors(JSON.parse(savedErrors));

      const savedLastFmUser = localStorage.getItem("lifehub_lastfm_user");
      if (savedLastFmUser) setLastFmUser(savedLastFmUser);

      const savedLastFmKey = localStorage.getItem("lifehub_lastfm_key");
      if (savedLastFmKey) setLastFmApiKey(savedLastFmKey);


      const savedBooks = localStorage.getItem("lifehub_bookshelf");
      if (savedBooks) setBookshelf(JSON.parse(savedBooks));
    } catch {}

    return () => clearInterval(timer);
  }, []);

  // Poll Last.fm live now-playing track every 10 seconds
  useEffect(() => {
    if (!lastFmUser || !lastFmApiKey) return;

    const fetchLiveNowPlaying = async () => {
      try {
        setIsFetchingNowPlaying(true);
        const res = await fetch(
          `/api/music/now-playing?user=${encodeURIComponent(lastFmUser)}&apiKey=${encodeURIComponent(lastFmApiKey)}`
        );
        const data = await res.json();
        if (data.configured) {
          setNowPlayingTrack(data);
        }
      } catch (e) {
        console.error("Live now playing fetch error:", e);
      } finally {
        setIsFetchingNowPlaying(false);
      }
    };

    fetchLiveNowPlaying();
    const interval = setInterval(fetchLiveNowPlaying, 10000);
    return () => clearInterval(interval);
  }, [lastFmUser, lastFmApiKey]);

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

  // Handle tab selection for desktop and smooth scrolling on mobile
  const handleSelectTab = (tabId: "all" | "google" | "books" | "habits" | "projects" | "music") => {
    setActiveTab(tabId);
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      if (tabId === "all") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const el = document.getElementById(`module-${tabId}`);
        if (el) {
          const targetY = el.getBoundingClientRect().top + window.pageYOffset - 95;
          window.scrollTo({ top: targetY, behavior: "smooth" });
        }
      }
    }
  };

  // Helper for responsive module visibility:
  // On desktop (md:), only show if activeTab === tabId
  // On mobile (< md:), always show in the continuous animated scroll feed!
  const getModuleVisibilityClass = (tabId: string) => {
    return activeTab === tabId ? "block" : "block md:hidden";
  };

  // Mobile Scroll-Spy: update activeTab indicator in header as user scrolls down continuous feed
  useEffect(() => {
    const handleScroll = () => {
      // Only run scroll-spy on mobile screens (< 768px)
      if (typeof window === "undefined" || window.innerWidth >= 768) return;

      const sectionIds: Array<{ id: "all" | "google" | "books" | "habits" | "projects" | "music"; elId: string }> = [
        { id: "all", elId: "module-all" },
        { id: "google", elId: "module-google" },
        { id: "books", elId: "module-books" },
        { id: "habits", elId: "module-habits" },
        { id: "projects", elId: "module-projects" },
        { id: "music", elId: "module-music" },
      ];

      const scrollPos = window.scrollY + 140;
      let currentTab: "all" | "google" | "books" | "habits" | "projects" | "music" = "all";

      for (const item of sectionIds) {
        const el = document.getElementById(item.elId);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            currentTab = item.id;
          }
        }
      }

      setActiveTab((prev) => (prev !== currentTab ? currentTab : prev));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  // Mock scores persistence and handlers
  const saveMockScores = (updated: GmatMockScore[]) => {
    setMockScores(updated);
    try {
      localStorage.setItem("lifehub_gmat_mocks", JSON.stringify(updated));
    } catch {}
  };

  const handleAddMock = (e: React.FormEvent) => {
    e.preventDefault();
    const newMock: GmatMockScore = {
      id: Date.now().toString(),
      name: newMockName,
      date: newMockDate.trim() || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      total: Number(newMockTotal) || 655,
      quant: Number(newMockQuant) || 80,
      di: Number(newMockDI) || 80,
      verbal: Number(newMockVerbal) || 80,
      notes: newMockNotes.trim(),
    };
    const updated = [...mockScores, newMock];
    saveMockScores(updated);
    setShowAddMock(false);
    setNewMockNotes("");
    setNewMockDate("");
  };

  const deleteMock = (id: string) => {
    const updated = mockScores.filter((m) => m.id !== id);
    saveMockScores(updated);
  };

  // Last.fm Android Mirror Save & Refresh
  const handleSaveLastFm = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem("lifehub_lastfm_user", lastFmUser.trim());
      localStorage.setItem("lifehub_lastfm_key", lastFmApiKey.trim());
    } catch {}
    setShowLastFmConfig(false);
    if (lastFmUser && lastFmApiKey) {
      setIsFetchingNowPlaying(true);
      fetch(
        `/api/music/now-playing?user=${encodeURIComponent(lastFmUser.trim())}&apiKey=${encodeURIComponent(lastFmApiKey.trim())}`
      )
        .then((r) => r.json())
        .then((data) => {
          if (data.configured) setNowPlayingTrack(data);
        })
        .finally(() => setIsFetchingNowPlaying(false));
    }
  };

  const manualRefreshNowPlaying = () => {
    if (!lastFmUser || !lastFmApiKey) return;
    setIsFetchingNowPlaying(true);
    fetch(
      `/api/music/now-playing?user=${encodeURIComponent(lastFmUser)}&apiKey=${encodeURIComponent(lastFmApiKey)}`
    )
      .then((r) => r.json())
      .then((data) => {
        if (data.configured) setNowPlayingTrack(data);
      })
      .finally(() => setIsFetchingNowPlaying(false));
  };



  // Strategic Bookshelf Handlers
  const saveBookshelf = (updated: StrategicBook[]) => {
    setBookshelf(updated);
    try {
      localStorage.setItem("lifehub_bookshelf", JSON.stringify(updated));
    } catch {}
  };

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookTitle.trim() || !newBookAuthor.trim()) return;
    const newBook: StrategicBook = {
      id: Date.now().toString(),
      title: newBookTitle.trim(),
      author: newBookAuthor.trim(),
      category: newBookCategory,
      coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
      status: Number(newBookProgress) >= 100 ? "Completed" : Number(newBookProgress) > 0 ? "Currently Reading" : "Queue",
      progress: Math.min(100, Math.max(0, Number(newBookProgress) || 0)),
      rating: 5,
      keyMentalModel: newBookModel.trim() || "Strategic Systems Leverage",
      keyQuote: newBookQuote.trim() || "Deep reading compounds cognitive leverage.",
      takeaway: newBookTakeaway.trim() || "Key strategic insight applied to current operations.",
      pagesOrTime: `${newBookProgress}% completed`,
    };
    const updated = [newBook, ...bookshelf];
    saveBookshelf(updated);
    setShowAddBook(false);
    setNewBookTitle("");
    setNewBookAuthor("");
    setNewBookModel("");
    setNewBookQuote("");
    setNewBookTakeaway("");
  };

  const deleteBook = (id: string) => {
    const updated = bookshelf.filter((b) => b.id !== id);
    saveBookshelf(updated);
  };

  const handleOpenReader = (source: ArrayBuffer | File | string, title: string) => {
    setReaderSource(source);
    setReaderTitle(title);
  };

  const handleCaptureReaderQuote = (quote: string, chapterTitle: string) => {
    const matchingBook = bookshelf.find(
      (b) =>
        b.title.toLowerCase().includes(readerTitle.toLowerCase()) ||
        readerTitle.toLowerCase().includes(b.title.toLowerCase())
    );

    if (matchingBook) {
      const updated = bookshelf.map((b) =>
        b.id === matchingBook.id
          ? {
              ...b,
              keyQuote: quote,
              takeaway: `${b.takeaway} • [${chapterTitle}]: "${quote.slice(0, 100)}..."`,
            }
          : b
      );
      saveBookshelf(updated);
    } else {
      const newBook: StrategicBook = {
        id: Date.now().toString(),
        title: readerTitle,
        author: "eBook Author",
        category: "Executive Strategy",
        coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
        status: "Currently Reading",
        progress: 25,
        rating: 5,
        keyMentalModel: "Strategic Insight",
        keyQuote: quote,
        takeaway: `Captured from ${chapterTitle}`,
        pagesOrTime: chapterTitle,
      };
      saveBookshelf([newBook, ...bookshelf]);
    }
  };

  const handleImportKoboHighlights = (highlights: ExtractedHighlight[]) => {
    let updatedBookshelf = [...bookshelf];

    for (const hl of highlights) {
      const existingIdx = updatedBookshelf.findIndex(
        (b) =>
          b.title.toLowerCase().includes(hl.bookTitle.toLowerCase()) ||
          hl.bookTitle.toLowerCase().includes(b.title.toLowerCase())
      );

      if (existingIdx !== -1) {
        const existing = updatedBookshelf[existingIdx];
        updatedBookshelf[existingIdx] = {
          ...existing,
          keyQuote: hl.quote,
          keyMentalModel: hl.mentalModel || existing.keyMentalModel,
          takeaway: hl.note ? `${existing.takeaway} | [Kobo Note]: ${hl.note}` : existing.takeaway,
        };
      } else {
        const newBook: StrategicBook = {
          id: `kobo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          title: hl.bookTitle,
          author: hl.author || "Kobo Author",
          category: "Executive Strategy",
          coverUrl: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80",
          status: "Currently Reading",
          progress: 30,
          rating: 5,
          keyMentalModel: hl.mentalModel || "Strategic Model",
          keyQuote: hl.quote,
          takeaway: hl.note || `Imported passage from ${hl.chapter}`,
          pagesOrTime: hl.chapter,
        };
        updatedBookshelf = [newBook, ...updatedBookshelf];
      }
    }

    saveBookshelf(updatedBookshelf);
  };

  const handleSaveDailyTakeaway = (
    title: string,
    author: string,
    category: string,
    mentalModel: string,
    quote: string,
    takeaway: string
  ) => {
    const newNote: StrategicBook = {
      id: `digest-${Date.now()}`,
      title,
      author,
      category: (category as any) || "Systems Thinking",
      coverUrl: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80",
      status: "Completed",
      progress: 100,
      rating: 5,
      keyMentalModel: mentalModel,
      keyQuote: quote,
      takeaway,
      pagesOrTime: "Daily Strategic Digest",
    };
    saveBookshelf([newNote, ...bookshelf]);
  };

  // Save changes to localStorage
  const saveHabits = (updated: Habit[]) => {
    setHabits(updated);
    try {
      localStorage.setItem("lifehub_habits", JSON.stringify(updated));
    } catch {}
  };

  const toggleHabit = (id: string) => {
    try {
      const todayKey = getDateKey(new Date());
      const updated = toggleDailyHabitStorage(id, todayKey);
      setHabits(updated as any);
      saveHabits(updated as any);
    } catch {
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
    }
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

  // Dynamic metrics from official mocks
  const latestMock = mockScores[mockScores.length - 1] || {
    id: "default",
    name: "Diagnostic Mock",
    date: "Nov 2, 2026",
    total: 615,
    quant: 81,
    di: 79,
    verbal: 81,
    notes: "",
  };
  const baselineMock = mockScores[0] || latestMock;
  const deltaFromBaseline = latestMock.total - baselineMock.total;
  const pointsToTarget = Math.max(0, 715 - latestMock.total);
  const currentPercentile = getGmatFocusPercentile(latestMock.total);

  // SVG Trajectory Chart Coordinates
  const svgWidth = 680;
  const svgHeight = 170;
  const chartPadLeft = 60;
  const chartPadRight = 80;
  const chartPadTop = 35;
  const chartPadBottom = 35;
  const chartUsableWidth = svgWidth - chartPadLeft - chartPadRight;
  const chartUsableHeight = svgHeight - chartPadTop - chartPadBottom;
  const minChartScore = 580;
  const maxChartScore = 740;
  const scoreSpan = maxChartScore - minChartScore;

  const getSvgY = (score: number) => {
    const clamped = Math.max(minChartScore, Math.min(maxChartScore, score));
    return chartPadTop + chartUsableHeight - ((clamped - minChartScore) / scoreSpan) * chartUsableHeight;
  };

  const totalSlots = Math.max(1, mockScores.length);
  const mockPlotPoints = mockScores.map((m, idx) => {
    const x = chartPadLeft + (idx / totalSlots) * (chartUsableWidth * 0.78);
    const y = getSvgY(m.total);
    return { ...m, x, y };
  });

  const targetPlotPoint = {
    name: "Target Goal (Dec 2026)",
    total: 715,
    x: chartPadLeft + chartUsableWidth,
    y: getSvgY(715),
  };

  const lastMockPoint = mockPlotPoints[mockPlotPoints.length - 1] || { x: chartPadLeft, y: getSvgY(615) };
  const areaPath = mockPlotPoints.length > 0
    ? `M ${mockPlotPoints[0].x},${chartPadTop + chartUsableHeight} L ${mockPlotPoints.map((p) => `${p.x},${p.y}`).join(" L ")} L ${lastMockPoint.x},${chartPadTop + chartUsableHeight} Z`
    : "";

  const completedHabitsCount = habits.filter((h) => h.completedToday).length;



  // Computed variables for Bookshelf
  const booksCompleted = bookshelf.filter((b) => b.status === "Completed").length;
  const booksReading = bookshelf.filter((b) => b.status === "Currently Reading").length;
  const filteredBooks = bookshelf.filter((b) => {
    if (bookFilter === "all") return true;
    if (bookFilter === "reading") return b.status === "Currently Reading";
    if (bookFilter === "completed") return b.status === "Completed";
    if (bookFilter === "queue") return b.status === "Queue";
    return true;
  });

  return (
    <div className="min-h-screen text-neutral-100 font-sans selection:bg-neutral-800 selection:text-white relative pb-16">
      {/* Tron Motorcycle Ambient Video (0:09 - 1:35) or Ambient Scripture Verse */}
      <TronBackgroundVideo
        isHomescreenVisible={homescreenVisible}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
        hasVideoEnded={hasVideoEnded}
        onVideoEnded={handleStopVideoAndShowScripture}
      />

      {/* Intro Sequence: Black Greeting -> 5s Video Solo -> Homescreen Reveal */}
      {!homescreenVisible && !hasVideoEnded && (
        <WelcomeIntro
          onRevealHomescreen={() => setHomescreenVisible(true)}
          onUserGesture={handleUnlockAudio}
          onGreetingAppear={handleGreetingAppear}
          hasVideoEnded={hasVideoEnded}
        />
      )}

      {/* Homescreen Layer: Fades in smoothly overlapping the video */}
      <div
        className={`relative z-10 transition-opacity duration-1000 ease-out ${
          homescreenVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* AOS Scroll Animation Engine for Mobile & Desktop */}
        <AOSInit />

      {/* TOP NAVIGATION BAR */}
      <header className="sticky top-2.5 z-50 max-w-7xl mx-auto px-2 sm:px-4 mb-5">
        <div className="bg-[#14151b] border border-[#232530] rounded-2xl px-3 sm:px-5 py-2.5 flex items-center justify-between shadow-2xl">
          {/* Navigation Tabs (Optimized, no G monogram, no scroll) */}
          <div className="flex items-center min-w-0 flex-1 mr-3">
            <nav className="flex items-center gap-1 sm:gap-1.5 md:gap-2 flex-wrap sm:flex-nowrap py-0.5">
              {[
                { id: "all", label: "Home" },
                { id: "google", label: "Google Apps" },
                { id: "books", label: "Books" },
                { id: "habits", label: "Habits" },
                { id: "projects", label: "Projects" },
                { id: "music", label: "Music" },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleSelectTab(tab.id as any)}
                    className={`relative text-xs sm:text-sm font-medium px-2.5 sm:px-3 md:px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                      isActive
                        ? "text-white font-semibold bg-neutral-800/80 shadow-sm after:absolute after:-bottom-[11px] after:left-2.5 after:right-2.5 after:h-[2px] after:bg-white"
                        : "text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900/60"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right: Date, Time & GitHub Link */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0 text-xs font-mono text-neutral-400">
            {activeTab !== "all" && (
              <button
                onClick={() => handleSelectTab("all")}
                className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white transition-colors"
                title="Return to Home"
              >
                <ChevronLeft className="w-3 h-3 text-white" />
                <span>Home</span>
              </button>
            )}

            <span className="hidden sm:inline text-neutral-400">
              {currentDate}
            </span>
            <span className="text-neutral-300">
              {currentTime}
            </span>

            {/* GitHub Repo Link */}
            <a
              href="https://github.com/JaisonSam/life-hub"
              target="_blank"
              rel="noreferrer"
              className="text-neutral-400 hover:text-white transition-colors flex items-center gap-0.5"
              title="GitHub Repository"
            >
              <span>GH</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="dashboard-contents" className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-7 sm:space-y-8">
        {/* Return Breadcrumb banner when viewing a deep-dive module */}
        {activeTab !== "all" && (
          <div className="flex items-center justify-between p-3 px-4 rounded-xl bg-[#111215] border border-neutral-800 text-xs font-mono shadow-md">
            <button
              onClick={() => handleSelectTab("all")}
              className="flex items-center gap-1.5 text-neutral-300 hover:text-white transition-colors group"
            >
              <ChevronLeft className="w-4 h-4 text-white group-hover:-translate-x-0.5 transition-transform" />
              <span>← Back to Home</span>
            </button>
            <div className="flex items-center gap-2 text-neutral-400 uppercase tracking-wider text-[11px]">
              <span>Viewing:</span>
              <span className="text-white font-bold">{activeTab} Deck</span>
            </div>
          </div>
        )}

        {/* MASTER HOME DASHBOARD */}
        <div id="module-all" className={activeTab === "all" ? "block" : "block md:hidden"}>
          <GlanceErrorBoundary>
            <GlanceDashboard
              onSelectTab={handleSelectTab}
              currentTime={currentTime}
              currentDate={currentDate}
            />
          </GlanceErrorBoundary>
        </div>

        {/* GOOGLE CONNECTED APPS HUB MODULE */}
        <div
          id="module-google"
          className={getModuleVisibilityClass("google")}
          data-aos="fade-up"
          data-aos-duration="700"
          data-aos-offset="80"
        >
          <GoogleConnectedAppsDeck />
        </div>

        {/* KOBO E-READER BOOKSHELF & INTELLECTUAL DIGEST */}
        <div
          id="module-books"
          className={getModuleVisibilityClass("books")}
          data-aos="fade-up"
          data-aos-duration="700"
          data-aos-offset="80"
        >
          <section className="p-6 sm:p-8 rounded-2xl bg-[#14151b] border border-[#232530] shadow-lg space-y-8">
            {/* Top Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#262834]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#181920] border border-[#262834] text-white shadow-sm">
                  <Library className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-extrabold text-lg text-white tracking-tight">
                      Kobo E-Reader & Intellectual Hub
                    </h2>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-200 border border-neutral-700 font-semibold font-mono">
                      Google Drive Synced • Daily Digest
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Revolves around your Google Drive EPUBs, with daily strategic reads and Aeon philosophical essays
                  </p>
                </div>
              </div>

              {/* Action Buttons: Kobo Notes Importer & Log Manual Note */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 bg-[#181920] border border-[#262834] p-1 rounded-xl text-xs">
                  {[
                    { id: "all", label: "All Ebooks" },
                    { id: "reading", label: "Reading" },
                    { id: "completed", label: "Completed" },
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      onClick={() => setBookFilter(btn.id as any)}
                      className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                        bookFilter === btn.id
                          ? "bg-white text-black font-bold shadow-sm"
                          : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setShowKoboHighlightsModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#181920] hover:bg-[#222430] text-neutral-200 hover:text-white border border-[#262834] text-xs font-semibold transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  <span>Kobo Notes</span>
                </button>

                <button
                  onClick={() => setShowAddBook(!showAddBook)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold shadow-sm transition-all text-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {showAddBook ? "Close" : "Log Note"}
                </button>
              </div>
            </div>

            {/* ADD NOTE DRAWER */}
            {showAddBook && (
              <form
                onSubmit={handleAddBook}
                className="p-4 rounded-xl bg-[#181920] border border-[#262834] space-y-3 shadow-xl animate-in fade-in duration-200"
              >
                <div className="flex items-center justify-between border-b border-[#262834] pb-2 font-mono">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <BookMarked className="w-4 h-4 text-white" />
                    Log Strategic Takeaway to Commonplace
                  </span>
                  <span className="text-[10px] text-[#8b91a0]">Synthesize deep insights</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                  <div className="sm:col-span-4 space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-[#8b91a0] font-semibold font-mono">Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Chip War or Essay title..."
                      value={newBookTitle}
                      onChange={(e) => setNewBookTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#101116] border border-[#282a38] text-xs text-white focus:outline-none focus:border-white font-sans"
                    />
                  </div>

                  <div className="sm:col-span-3 space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-[#8b91a0] font-semibold font-mono">Author</label>
                    <input
                      type="text"
                      placeholder="e.g. Chris Miller / Paul Graham..."
                      value={newBookAuthor}
                      onChange={(e) => setNewBookAuthor(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#101116] border border-[#282a38] text-xs text-white focus:outline-none focus:border-white font-sans"
                    />
                  </div>

                  <div className="sm:col-span-3 space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-[#8b91a0] font-semibold font-mono">Category</label>
                    <select
                      value={newBookCategory}
                      onChange={(e: any) => setNewBookCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#101116] border border-[#282a38] text-xs text-white focus:outline-none focus:border-white font-sans"
                    >
                      <option value="Geopolitics & Tech">Geopolitics & Tech</option>
                      <option value="Systems Thinking">Systems Thinking</option>
                      <option value="Macroeconomics">Macroeconomics</option>
                      <option value="Executive Strategy">Executive Strategy</option>
                      <option value="Personal Systems">Personal Systems</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2 bg-white hover:bg-neutral-200 text-black rounded-xl text-xs font-bold shadow-md transition-colors"
                    >
                      Save Note
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    placeholder="Core Mental Model (e.g. Chokepoint Moats, Second-Order Thinking)..."
                    value={newBookModel}
                    onChange={(e) => setNewBookModel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#101116] border border-[#282a38] text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-white font-sans"
                  />
                  <input
                    type="text"
                    placeholder="Actionable strategic takeaway for operations..."
                    value={newBookTakeaway}
                    onChange={(e) => setNewBookTakeaway(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#101116] border border-[#282a38] text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-white font-sans"
                  />
                </div>
              </form>
            )}

            {/* 1. DAILY INTELLECTUAL DIGEST: WEBSITE RECOMMENDATION + AEON ESSAY */}
            <DailyRecommendationsDeck onSaveToCommonplace={handleSaveDailyTakeaway} />

            {/* 2. THE CORE BOOKSHELF: REVOLVED AROUND GOOGLE DRIVE EPUBS */}
            <GoogleDriveBookshelf
              onOpenReader={handleOpenReader}
              onOpenHighlightsModal={() => setShowKoboHighlightsModal(true)}
              filter={bookFilter as any}
              searchQuery=""
            />

            {/* 3. STRATEGIC COMMONPLACE NOTEBOOK (SAVED NOTES & QUOTES) */}
            {bookshelf.length > 0 && (
              <div className="p-6 rounded-2xl bg-[#181920] border border-[#262834] space-y-4">
                <div className="flex items-center justify-between border-b border-[#262834] pb-3 font-mono">
                  <div className="flex items-center gap-2">
                    <BookmarkPlus className="w-4 h-4 text-white" />
                    <h3 className="font-extrabold text-sm text-white">
                      Strategic Commonplace Notebook ({bookshelf.length} Synthesized Notes)
                    </h3>
                  </div>
                  <span className="text-[10px] text-[#8b91a0]">
                    Captured from Kobo EPUBs, Aeon essays, and daily strategic reads
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {bookshelf.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-[#14151b] border border-[#262834] hover:border-neutral-500 transition-all space-y-2.5 flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700 font-bold uppercase">
                            {item.category}
                          </span>
                          <span className="text-neutral-400">{item.pagesOrTime}</span>
                        </div>
                        <h4 className="font-bold text-xs text-white leading-snug">{item.title}</h4>
                        {item.author && (
                          <p className="text-[10px] text-neutral-400">by {item.author}</p>
                        )}
                        {item.keyMentalModel && (
                          <div className="text-[10px] text-neutral-300 font-semibold flex items-center gap-1 font-mono">
                            <Lightbulb className="w-3.5 h-3.5 text-white" />
                            {item.keyMentalModel}
                          </div>
                        )}
                        {item.keyQuote && (
                          <blockquote className="text-[11px] text-neutral-300 italic border-l-2 border-neutral-600 pl-2.5 leading-relaxed line-clamp-3">
                            "{item.keyQuote}"
                          </blockquote>
                        )}
                        {item.takeaway && (
                          <p className="text-[10px] text-neutral-300 leading-relaxed bg-[#101116] p-2 rounded-lg border border-[#282a38]">
                            {item.takeaway}
                          </p>
                        )}
                      </div>

                      <div className="pt-2 border-t border-[#262834] flex items-center justify-end">
                        <button
                          onClick={() => deleteBook(item.id)}
                          className="text-[#8b91a0] hover:text-rose-400 transition-colors"
                          title="Delete note"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>

        {/* HABIT TRACKER */}
        <div
          id="module-habits"
          className={getModuleVisibilityClass("habits")}
          data-aos="fade-up"
          data-aos-duration="700"
          data-aos-offset="80"
        >
          <section className="p-6 sm:p-8 rounded-2xl bg-[#14151b] border border-[#232530] shadow-lg space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#262834]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#181920] border border-[#262834] text-white shadow-sm">
                  <Flame className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-extrabold text-base text-white">Daily Habit Tracker</h2>
                  <p className="text-xs text-neutral-400">Consistency builds destiny • Dynamic daily rhythm</p>
                </div>
              </div>
              <div className="text-xs font-mono text-neutral-400">
                <span className="text-white font-bold">{completedHabitsCount}</span> of {habits.length} Completed
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
                      ? "bg-[#181920] border-white/40 text-white"
                      : "bg-[#181920] border-[#262834] hover:border-neutral-500 text-neutral-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {h.completedToday ? (
                      <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-neutral-500 flex-shrink-0" />
                    )}
                    <div>
                      <div className={`text-sm font-medium ${h.completedToday ? "line-through text-neutral-500" : "text-white"}`}>
                        {h.name}
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#8b91a0] font-semibold">
                        {h.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#14151b] border border-[#262834] text-xs font-mono text-white">
                    <Flame className="w-3.5 h-3.5 fill-white text-white" />
                    {h.streak}d
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ACTIVE PROJECTS TRACKER */}
        <div
          id="module-projects"
          className={getModuleVisibilityClass("projects")}
          data-aos="fade-up"
          data-aos-duration="700"
          data-aos-offset="80"
        >
          <section className="p-6 sm:p-8 rounded-2xl bg-[#14151b] border border-[#232530] shadow-lg space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#262834]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#181920] border border-[#262834] text-white shadow-sm">
                  <FolderKanban className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-extrabold text-base text-white">Active Projects Tracker</h2>
                  <p className="text-xs text-neutral-400">Goals, deliverables, and progress</p>
                </div>
              </div>

              <button
                onClick={() => setShowNewProject(!showNewProject)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white hover:bg-neutral-200 text-black text-xs font-bold transition-all shadow-sm font-mono"
              >
                <Plus className="w-3.5 h-3.5" />
                {showNewProject ? "Close" : "New Project"}
              </button>
            </div>

            {/* New Project Form Modal */}
            {showNewProject && (
              <form onSubmit={addProject} className="p-4 rounded-xl border border-[#262834] bg-[#181920] space-y-3 shadow-xl">
                <div className="text-xs font-semibold text-white font-mono">Add New Project</div>
                <div className="flex flex-wrap gap-2">
                  <input
                    type="text"
                    placeholder="Project Name..."
                    value={newProjName}
                    onChange={(e) => setNewProjName(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-[#101116] border border-[#282a38] text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white font-sans"
                  />
                  <input
                    type="text"
                    placeholder="Category (e.g. Life, Tech, Spiritual)..."
                    value={newProjCategory}
                    onChange={(e) => setNewProjCategory(e.target.value)}
                    className="w-48 px-3 py-2 rounded-xl bg-[#101116] border border-[#282a38] text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white font-sans"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-white hover:bg-neutral-200 text-black font-bold rounded-xl text-xs transition-colors font-mono"
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
                  className="p-4 rounded-xl border border-[#262834] bg-[#181920] hover:border-neutral-500 transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-2 font-mono">
                      <span className="text-neutral-400 font-medium">{proj.category}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          proj.status === "Completed"
                            ? "bg-neutral-800 text-neutral-200 border border-neutral-700"
                            : "bg-neutral-800 text-neutral-300 border border-neutral-700"
                        }`}
                      >
                        {proj.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-white">{proj.name}</h3>
                  </div>

                  <div className="space-y-1.5 font-mono">
                    <div className="flex justify-between text-xs text-neutral-400">
                      <span>Progress</span>
                      <span className="text-white font-bold">{proj.progress}%</span>
                    </div>
                    <div className="w-full bg-[#101116] h-2 rounded-full overflow-hidden border border-[#282a38]">
                      <div
                        className="bg-white h-full rounded-full transition-all"
                        style={{ width: `${proj.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* YOUTUBE MUSIC & WORSHIP SANCTUARY */}
        <div
          id="module-music"
          className={getModuleVisibilityClass("music")}
          data-aos="fade-up"
          data-aos-duration="700"
          data-aos-offset="80"
        >
          <section className="p-6 sm:p-8 rounded-2xl bg-[#14151b] border border-[#232530] shadow-lg space-y-6">
            {/* Top Header & Account Sync Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#262834]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#181920] border border-[#262834] text-white shadow-sm">
                  <Headphones className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-extrabold text-lg text-white tracking-tight">
                      YouTube Music & Sanctuary Deck
                    </h2>
                    {ytConnected ? (
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold flex items-center gap-1 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Google Connected
                      </span>
                    ) : (
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#181920] text-[#8b91a0] font-medium font-mono border border-[#262834]">
                        Cloud Sync Optional
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-400">
                    Curated devotional sanctuary, GMAT study flow, and real-time Android playback mirror
                  </p>
                </div>
              </div>

              {/* Action Buttons: Android Sync Settings & Google OAuth */}
              <div className="flex items-center gap-2.5 font-mono">
                <button
                  onClick={() => setShowLastFmConfig(!showLastFmConfig)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                    lastFmUser
                      ? "bg-white/10 border-white/20 text-white hover:bg-white/15"
                      : "bg-[#181920] border-[#262834] hover:border-neutral-500 text-neutral-300"
                  }`}
                  title="Configure Android YouTube Music Live Mirror"
                >
                  <Radio className="w-3.5 h-3.5 text-white" />
                  <span>{lastFmUser ? `Synced: @${lastFmUser}` : "Android Mirror Setup"}</span>
                  <Settings className="w-3 h-3 text-neutral-400 ml-1" />
                </button>

                {ytConnected ? (
                  <button
                    onClick={disconnectYouTube}
                    className="px-3 py-1.5 rounded-xl border border-[#262834] hover:border-neutral-500 text-neutral-400 hover:text-white text-xs transition-colors"
                  >
                    Disconnect
                  </button>
                ) : (
                  <a
                    href="/api/auth/youtube/login"
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold shadow-sm transition-all"
                  >
                    <Music className="w-3.5 h-3.5" />
                    <span>Connect Google</span>
                  </a>
                )}
              </div>
            </div>

            {/* LAST.FM / ANDROID LIVE SYNC CONFIG DRAWER */}
            {showLastFmConfig && (
              <form
                onSubmit={handleSaveLastFm}
                className="p-5 rounded-xl bg-[#181920] border border-[#262834] space-y-4 shadow-2xl animate-in fade-in duration-200"
              >
                <div className="flex items-center justify-between border-b border-[#262834] pb-2.5 font-mono">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <Radio className="w-4 h-4 text-white animate-pulse" />
                    Android YouTube Music Live Mirror Setup (via Last.fm)
                  </div>
                  <span className="text-[10px] text-[#8b91a0]">100% Free • Works in background on Android</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#14151b] border border-[#262834] space-y-1">
                    <div className="font-bold text-white flex items-center gap-1.5 font-mono">
                      <span className="w-4 h-4 rounded-full bg-[#181920] text-white border border-[#262834] flex items-center justify-center text-[10px]">1</span>
                      Install Pano Scrobbler
                    </div>
                    <p className="text-[11px] text-neutral-300 leading-relaxed">
                      Download the free <strong>Pano Scrobbler</strong> app from Google Play Store on your Android phone and toggle on <strong>YouTube Music</strong>.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#14151b] border border-[#262834] space-y-1">
                    <div className="font-bold text-white flex items-center gap-1.5 font-mono">
                      <span className="w-4 h-4 rounded-full bg-[#181920] text-white border border-[#262834] flex items-center justify-center text-[10px]">2</span>
                      Free Last.fm Account
                    </div>
                    <p className="text-[11px] text-neutral-300 leading-relaxed">
                      Create a free profile at <strong>last.fm</strong> and get a 15-second free API key from <strong>last.fm/api/account/create</strong>.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#14151b] border border-[#262834] space-y-1">
                    <div className="font-bold text-white flex items-center gap-1.5 font-mono">
                      <span className="w-4 h-4 rounded-full bg-[#181920] text-white border border-[#262834] flex items-center justify-center text-[10px]">3</span>
                      Enter Credentials Below
                    </div>
                    <p className="text-[11px] text-neutral-300 leading-relaxed">
                      Paste your username and API key once. Life Hub will automatically mirror whatever song you play on your phone.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
                  <div className="sm:col-span-5 space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-[#8b91a0] font-semibold font-mono">
                      Last.fm Username
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. jaisonsam"
                      value={lastFmUser}
                      onChange={(e) => setLastFmUser(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#101116] border border-[#282a38] text-xs text-white focus:outline-none focus:border-white font-sans"
                    />
                  </div>

                  <div className="sm:col-span-5 space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-[#8b91a0] font-semibold font-mono">
                      Last.fm API Key (32 characters)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 4a9f5581a9cd..."
                      value={lastFmApiKey}
                      onChange={(e) => setLastFmApiKey(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#101116] border border-[#282a38] text-xs text-white focus:outline-none focus:border-white font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2 flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2 bg-white hover:bg-neutral-200 text-black font-bold rounded-xl text-xs shadow-md transition-colors font-mono"
                    >
                      Save Mirror
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* LIVE ANDROID "NOW PLAYING" DOCK (FEATURED WIDGET) */}
            {(() => {
              // Active display data (real nowPlayingTrack or demo mode)
              const isLive = demoNowPlaying || nowPlayingTrack?.nowPlaying;
              const displayTrack = demoNowPlaying
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

              return (
                <div className="relative overflow-hidden rounded-xl border border-[#262834] bg-[#181920] p-4 sm:p-5 shadow-lg">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                    <div className="flex items-center gap-4">
                      {/* Album Art with Vinyl / Glow Effect */}
                      <div className="relative group flex-shrink-0">
                        {displayTrack?.albumArt ? (
                          <img
                            src={displayTrack.albumArt}
                            alt={displayTrack.title}
                            className={`w-16 h-16 rounded-xl object-cover border border-[#282a38] shadow-md ${
                              isLive ? "ring-2 ring-white/50" : ""
                            }`}
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-[#14151b] border border-[#262834] flex items-center justify-center text-white">
                            <Disc className={`w-8 h-8 ${isLive ? "animate-spin text-white" : "text-neutral-600"}`} />
                          </div>
                        )}
                        {isLive && (
                          <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
                          </span>
                        )}
                      </div>

                      {/* Track Details & Status */}
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1.5 font-mono ${
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
                            <div className="flex items-end gap-0.5 h-3">
                              <span className="w-0.5 bg-white rounded-full animate-pulse h-full" />
                              <span className="w-0.5 bg-white rounded-full animate-bounce h-2/3" />
                              <span className="w-0.5 bg-white rounded-full animate-pulse h-5/6" />
                              <span className="w-0.5 bg-white rounded-full animate-bounce h-1/2" />
                            </div>
                          )}
                        </div>

                        <h3 className="font-extrabold text-base sm:text-lg text-white tracking-tight leading-tight">
                          {displayTrack ? displayTrack.title : "No active track detected"}
                        </h3>
                        <p className="text-xs text-neutral-400">
                          {displayTrack
                            ? `${displayTrack.artist} ${displayTrack.album ? `• ${displayTrack.album}` : ""}`
                            : lastFmUser
                            ? "Waiting for playback in YouTube Music on your Android device..."
                            : "Configure your Last.fm mirror or toggle demo track below to test."}
                        </p>
                      </div>
                    </div>

                    {/* Interactive Controls */}
                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-0 border-[#262834] font-mono">
                      {displayTrack?.ytMusicUrl && (
                        <a
                          href={displayTrack.ytMusicUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold shadow-sm transition-all"
                        >
                          <Music className="w-3.5 h-3.5" />
                          <span>Open in YT Music</span>
                          <ExternalLink className="w-3 h-3 text-black/80" />
                        </a>
                      )}

                      {lastFmUser && (
                        <button
                          onClick={manualRefreshNowPlaying}
                          disabled={isFetchingNowPlaying}
                          className="p-2 rounded-xl bg-[#14151b] border border-[#262834] hover:border-neutral-500 text-neutral-300 hover:text-white transition-colors"
                          title="Refresh Now Playing Status"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isFetchingNowPlaying ? "animate-spin text-white" : ""}`} />
                        </button>
                      )}

                      <button
                        onClick={() => setDemoNowPlaying(!demoNowPlaying)}
                        className={`text-xs px-2.5 py-1.5 rounded-xl border transition-colors ${
                          demoNowPlaying
                            ? "bg-white/10 text-white border-white/20 font-semibold"
                            : "bg-[#14151b] border-[#262834] text-neutral-400 hover:text-white"
                        }`}
                        title="Toggle demo song playback state"
                      >
                        {demoNowPlaying ? "Stop Demo" : "Test Demo"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* CURATED ALBUM DECK - ORGANIZED CATEGORY TABS */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Disc className="w-4 h-4 text-white" />
                  <h3 className="font-bold text-sm text-white">Curated Album & Playlist Deck</h3>
                </div>

                {/* Category Filter Pills */}
                <div className="flex flex-wrap items-center gap-1.5 bg-[#181920] border border-[#262834] p-1 rounded-xl text-xs font-mono">
                  {[
                    { id: "all", label: "All Decks" },
                    { id: "worship", label: "🕊️ Worship & Sanctuary" },
                    { id: "focus", label: "🎯 GMAT & Focus" },
                    { id: "energy", label: "⚡ Training & Drive" },
                    ...(ytConnected ? [{ id: "cloud", label: `☁️ My Playlists (${userPlaylists.length})` }] : []),
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setMusicDeckFilter(tab.id as any)}
                      className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                        musicDeckFilter === tab.id
                          ? "bg-white text-black font-bold shadow-sm"
                          : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ALBUM CARDS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Show Google Cloud Playlists when selected */}
                {(musicDeckFilter === "all" || musicDeckFilter === "cloud") &&
                  ytConnected &&
                  userPlaylists.map((pl: any) => (
                    <div
                      key={pl.id}
                      onClick={() =>
                        setCurrentPlaylist({
                          title: pl.title,
                          subtitle: `${pl.itemCount} tracks • Personal YouTube Playlist`,
                          ytUrl: pl.ytMusicUrl,
                          coverUrl: pl.thumbnail || "",
                          tag: "Cloud Playlist",
                          bpmOrVibe: "Personal Curated",
                        })
                      }
                      className="group rounded-xl border border-[#262834] bg-[#181920] hover:border-neutral-500 overflow-hidden flex flex-col justify-between transition-all duration-300 cursor-pointer"
                    >
                      <div className="aspect-square relative overflow-hidden bg-[#101116]">
                        {pl.thumbnail ? (
                          <img
                            src={pl.thumbnail}
                            alt={pl.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-600">
                            <Music className="w-12 h-12" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#14151b] via-transparent to-transparent opacity-80" />
                        
                        {/* Floating Top Badges */}
                        <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-center text-[10px] font-mono">
                          <span className="px-2 py-0.5 rounded-full bg-[#14151b]/90 text-emerald-400 font-semibold border border-emerald-500/30">
                            Google Cloud
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-[#101116]/80 text-neutral-300 border border-[#282a38]">
                            {pl.itemCount} tracks
                          </span>
                        </div>

                        {/* Hover Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-lg scale-90 group-hover:scale-100 transition-transform">
                            <Play className="w-5 h-5 ml-0.5 fill-black text-black" />
                          </div>
                        </div>
                      </div>

                      <div className="p-3.5 space-y-2">
                        <div>
                          <h4 className="font-bold text-sm text-white truncate group-hover:text-white transition-colors">
                            {pl.title}
                          </h4>
                          <p className="text-[11px] text-[#8b91a0] mt-0.5">Personal YouTube Playlist</p>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-[#8b91a0] pt-2 border-t border-[#262834] font-mono">
                          <span>Sync Account</span>
                          <a
                            href={pl.ytMusicUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
                          >
                            Open <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}

                {/* 2. Show Curated Albums */}
                {curatedAlbums
                  .filter((album) => musicDeckFilter === "all" || album.category === musicDeckFilter)
                  .map((album) => (
                    <div
                      key={album.id}
                      onClick={() =>
                        setCurrentPlaylist({
                          title: album.title,
                          subtitle: album.artist,
                          ytUrl: album.ytUrl,
                          coverUrl: album.coverUrl,
                          tag: album.tag,
                          bpmOrVibe: album.bpmOrVibe,
                        })
                      }
                      className="group rounded-xl border border-[#262834] bg-[#181920] hover:border-neutral-500 overflow-hidden flex flex-col justify-between transition-all duration-300 cursor-pointer"
                    >
                      {/* Album Cover with Badges & Hover Play */}
                      <div className="aspect-square relative overflow-hidden bg-[#101116]">
                        <img
                          src={album.coverUrl}
                          alt={album.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#14151b] via-transparent to-transparent opacity-80" />

                        {/* Badges */}
                        <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-center text-[10px] font-mono">
                          <span
                            className={`px-2 py-0.5 rounded-full font-semibold border ${
                              album.category === "worship"
                                ? "bg-white/10 text-white border-white/20"
                                : album.category === "focus"
                                ? "bg-sky-500/10 text-sky-300 border-sky-500/30"
                                : "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                            }`}
                          >
                            {album.tag}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-[#101116]/90 text-neutral-300 border border-[#282a38]">
                            {album.bpmOrVibe}
                          </span>
                        </div>

                        {/* Hover Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-lg scale-90 group-hover:scale-100 transition-transform">
                            <Play className="w-5 h-5 ml-0.5 fill-black text-black" />
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-3.5 space-y-2">
                        <div>
                          <h4 className="font-bold text-sm text-white group-hover:text-white transition-colors line-clamp-1">
                            {album.title}
                          </h4>
                          <p className="text-[11px] text-[#8b91a0] mt-0.5 line-clamp-1">{album.artist}</p>
                        </div>

                        <p className="text-[11px] text-neutral-400 leading-tight line-clamp-2">
                          {album.moodDescription}
                        </p>

                        <div className="flex items-center justify-between text-[11px] text-[#8b91a0] pt-2 border-t border-[#262834] font-mono">
                          <span>{album.trackCount} tracks</span>
                          <a
                            href={album.ytUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
                          >
                            Listen in YT Music <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* CURRENTLY QUEUED SOUNDTRACK DOCK */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-[#262834] bg-[#181920] shadow-lg">
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  {currentPlaylist.coverUrl ? (
                    <img
                      src={currentPlaylist.coverUrl}
                      alt={currentPlaylist.title}
                      className="w-12 h-12 rounded-xl object-cover border border-[#282a38] shadow-md"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-[#14151b] border border-[#262834] flex items-center justify-center text-white">
                      <Volume2 className="w-6 h-6 animate-pulse" />
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-white text-black">
                    <Music className="w-2.5 h-2.5" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{currentPlaylist.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-200 border border-neutral-700 font-medium font-mono">
                      {currentPlaylist.tag || "Queued"}
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">{currentPlaylist.subtitle}</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 font-mono">
                <a
                  href={currentPlaylist.ytUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold shadow-md transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-black text-black" />
                  <span>Launch in YouTube Music</span>
                  <ExternalLink className="w-3 h-3 text-black/80" />
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* SEPARATE VIDEO OR YOUVERSION SCRIPTURE SHOWCASE SECTION (At Bottom of Website) */}
      <section className="max-w-7xl mx-auto px-2 sm:px-4 my-10 sm:my-14">
        <div className="relative rounded-2xl overflow-hidden min-h-[320px] sm:min-h-[420px] md:min-h-[480px] bg-black shadow-2xl border border-neutral-800/80">
          {!hasVideoEnded ? (
            <div className="relative w-full h-full min-h-[320px] sm:min-h-[420px] md:min-h-[480px] flex items-center justify-center bg-black">
              {/* Native Video Playing INSIDE the Section (Plays only once) */}
              <video
                ref={sectionVideoRef}
                src="/videos/tron-intro.mp4"
                autoPlay
                muted
                playsInline
                preload="auto"
                onEnded={handleStopVideoAndShowScripture}
                className="w-full h-full object-cover min-h-[320px] sm:min-h-[420px] md:min-h-[480px]"
              />
              {/* Subtle button to switch to scripture passage directly */}
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={handleStopVideoAndShowScripture}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/80 hover:bg-black text-neutral-300 hover:text-white border border-white/15 text-xs font-sans backdrop-blur-md transition-all shadow-lg cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-white" />
                  <span>Scripture Passage</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full h-full relative">
              <YouVersionVerse variant="showcase" />
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800/80 py-6 text-center text-xs text-neutral-500">
        <div>Jaison's Personal Life Operating System • Built with Next.js, React 19 & Tailwind CSS</div>
        <div className="text-[11px] text-neutral-600 mt-1">
          Connected to GitHub (JaisonSam/life-hub) & Deployed on Vercel
        </div>
      </footer>

      {/* IN-BROWSER EPUB READER MODAL */}
      {readerSource && (
        <EpubReaderModal
          epubSource={readerSource}
          bookTitle={readerTitle}
          onClose={() => setReaderSource(null)}
          onCaptureQuote={handleCaptureReaderQuote}
        />
      )}

      {/* KOBO HIGHLIGHTS & ANNOTATIONS IMPORTER MODAL */}
      {showKoboHighlightsModal && (
        <KoboHighlightsModal
          onClose={() => setShowKoboHighlightsModal(false)}
          onImport={handleImportKoboHighlights}
          existingBookTitles={bookshelf.map((b) => b.title)}
        />
      )}
      </div>
    </div>
  );
}
