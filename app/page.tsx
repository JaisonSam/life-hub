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

// VEERAKERALAPUDUR AGRIBUSINESS MODELER DATA
interface AgriCapexItem {
  id: string;
  category: "Infrastructure" | "Irrigation" | "Planting Material" | "Soil & Prep";
  name: string;
  budget: number;
  spent: number;
  status: "Planned" | "In Progress" | "Completed";
  notes?: string;
}

interface CropModel {
  id: string;
  name: string;
  subtitle: string;
  plantsOrUnits: string;
  spacing: string;
  initialCapex: number;
  annualOpex: number;
  gestationMonths: number;
  expectedAnnualYield: string;
  expectedPricePerUnit: string;
  grossRevenuePerYear: number;
  netProfitPerYear: number;
  paybackPeriodMonths: number;
  annualRoiPercent: number;
  laborIntensity: "Low" | "Medium" | "High";
  waterDemand: "Low" | "Medium" | "Moderate";
  advantages: string[];
  risks: string[];
}

const cropModelsList: CropModel[] = [
  {
    id: "guava",
    name: "High-Density Guava (Taiwan Pink)",
    subtitle: "High-Value Horticulture • Bi-Annual Harvest",
    plantsOrUnits: "140 Saplings",
    spacing: "8 x 8 ft grid",
    initialCapex: 45000,
    annualOpex: 12000,
    gestationMonths: 14,
    expectedAnnualYield: "3,000 kg / year",
    expectedPricePerUnit: "₹35 / kg (wholesale)",
    grossRevenuePerYear: 105000,
    netProfitPerYear: 93000,
    paybackPeriodMonths: 18,
    annualRoiPercent: 206,
    laborIntensity: "Low",
    waterDemand: "Medium",
    advantages: [
      "Consistent demand across Tenkasi & Tirunelveli wholesale mandis",
      "Hardy crop once established; responds vigorously to drip irrigation",
      "Two harvest flushes per year with long 15-year commercial tree life",
    ],
    risks: [
      "Fruit fly sensitivity during heavy monsoons (requires fruit bagging)",
      "Pruning discipline required twice a year to maintain canopy density",
    ],
  },
  {
    id: "moringa",
    name: "Perennial Drumstick (PKM-1 / ODC3)",
    subtitle: "Fast Cash-Flow • High Drought Resistance",
    plantsOrUnits: "180 Trees",
    spacing: "6 x 8 ft spacing",
    initialCapex: 28000,
    annualOpex: 8000,
    gestationMonths: 6,
    expectedAnnualYield: "3,500 kg pods / year",
    expectedPricePerUnit: "₹28 / kg average",
    grossRevenuePerYear: 98000,
    netProfitPerYear: 90000,
    paybackPeriodMonths: 9,
    annualRoiPercent: 321,
    laborIntensity: "Low",
    waterDemand: "Low",
    advantages: [
      "Rapid break-even: first harvest ready in just 6 months from planting",
      "Thrives in hot, dry climate with low water footprint (drip friendly)",
      "High-value byproduct: moringa leaf powder has booming health export demand",
    ],
    risks: [
      "Price volatility during peak harvest season (ranges ₹15 to ₹80/kg)",
      "High wind vulnerability (requires topping trunk at 3-4 feet height)",
    ],
  },
  {
    id: "poultry",
    name: "Free-Range Country Chicken (Nattu Kozhi)",
    subtitle: "High Turnaround • Synergistic Soil Manure",
    plantsOrUnits: "250 Birds / Batch (3 Batches/yr)",
    spacing: "300 sq ft shed + 0.20 acre run",
    initialCapex: 62000,
    annualOpex: 165000,
    gestationMonths: 4,
    expectedAnnualYield: "700 birds (~1,050 kg live weight)",
    expectedPricePerUnit: "₹320 / kg live weight",
    grossRevenuePerYear: 336000,
    netProfitPerYear: 109000,
    paybackPeriodMonths: 14,
    annualRoiPercent: 175,
    laborIntensity: "Medium",
    waterDemand: "Low",
    advantages: [
      "Huge premium for authentic free-range country chicken in South Tamil Nadu",
      "High cash liquidity: turnaround every 100-110 days per batch",
      "Organic chicken manure dramatically boosts soil microbial health for intercrops",
    ],
    risks: [
      "Predator risk (stray dogs, predatory birds) requires chainlink fencing",
      "Requires daily 30-minute feeding and water sanitation routine",
    ],
  },
  {
    id: "syntropic",
    name: "Syntropic Agroforestry (Coconut + Banana + Pepper)",
    subtitle: "Multi-Tier Regenerative Canopy • Wealth Compounding",
    plantsOrUnits: "16 Dwarf Palms + 80 G9 Bananas + Pepper",
    spacing: "Border perimeter + inner alleys",
    initialCapex: 54000,
    annualOpex: 14000,
    gestationMonths: 10,
    expectedAnnualYield: "80 Banana Bunches + 1,600 Coconuts/yr",
    expectedPricePerUnit: "₹250/bunch + ₹20/coconut",
    grossRevenuePerYear: 110000,
    netProfitPerYear: 96000,
    paybackPeriodMonths: 24,
    annualRoiPercent: 177,
    laborIntensity: "Low",
    waterDemand: "Medium",
    advantages: [
      "Tiered cash flows: bananas start in month 10, coconuts compound in year 3.5+",
      "Natural shade and heavy biomass mulch conserve 50% more soil moisture",
      "Self-sustaining perennial ecosystem with high asset value appreciation",
    ],
    risks: [
      "Longer gestation period for coconut palms (3 to 4 years)",
      "Banana plants require wind staking during South-West monsoon",
    ],
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
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<"all" | "gmat" | "farm" | "books" | "bible" | "habits" | "projects" | "music">("all");

  // Veerakeralapudur Agribusiness State
  const [activeAgriModelId, setActiveAgriModelId] = useState("guava");
  const [agriCapex, setAgriCapex] = useState<AgriCapexItem[]>([
    {
      id: "c-1",
      category: "Infrastructure",
      name: "Perimeter Fencing (Chainlink + Stone Posts)",
      budget: 35000,
      spent: 0,
      status: "Planned",
      notes: "Crucial for stray cattle and poultry biosecurity.",
    },
    {
      id: "c-2",
      category: "Irrigation",
      name: "Borewell Tie-in & Drip Automation Lines",
      budget: 22000,
      spent: 6000,
      status: "In Progress",
      notes: "Main 1-inch line + lateral drippers for 0.25 acre.",
    },
    {
      id: "c-3",
      category: "Soil & Prep",
      name: "Soil Conditioning (4 Tons FYM & Biochar)",
      budget: 10000,
      spent: 0,
      status: "Planned",
      notes: "Enriches red sandy loam for high microbial activity.",
    },
    {
      id: "c-4",
      category: "Planting Material",
      name: "Certified High-Density Saplings Stock",
      budget: 15000,
      spent: 0,
      status: "Planned",
      notes: "140 Taiwan Pink / PKM-1 stock from certified nursery.",
    },
    {
      id: "c-5",
      category: "Infrastructure",
      name: "Tool Locker & Weatherproof Storage Shed",
      budget: 8000,
      spent: 3500,
      status: "Completed",
      notes: "Secure lockable cabinet for tools, drip spares, and organic inputs.",
    },
  ]);
  const [showAddCapex, setShowAddCapex] = useState(false);
  const [newCapexName, setNewCapexName] = useState("");
  const [newCapexCategory, setNewCapexCategory] = useState<AgriCapexItem["category"]>("Infrastructure");
  const [newCapexBudget, setNewCapexBudget] = useState(15000);
  const [newCapexSpent, setNewCapexSpent] = useState(0);
  const [newCapexNotes, setNewCapexNotes] = useState("");

  // Interactive ROI Simulator State
  const [simCapex, setSimCapex] = useState(45000);
  const [simOpex, setSimOpex] = useState(12000);
  const [simYield, setSimYield] = useState(3000);
  const [simPrice, setSimPrice] = useState(35);

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

    // Try reading localStorage for saved habits/projects/notes/gmat
    try {
      const savedHabits = localStorage.getItem("lifehub_habits");
      if (savedHabits) setHabits(JSON.parse(savedHabits));

      const savedProjects = localStorage.getItem("lifehub_projects");
      if (savedProjects) setProjects(JSON.parse(savedProjects));

      const savedNotes = localStorage.getItem("lifehub_notes");
      if (savedNotes) setNotes(JSON.parse(savedNotes));

      const savedMocks = localStorage.getItem("lifehub_gmat_mocks");
      if (savedMocks) setMockScores(JSON.parse(savedMocks));

      const savedErrors = localStorage.getItem("lifehub_gmaterrors");
      if (savedErrors) setGmatErrors(JSON.parse(savedErrors));

      const savedLastFmUser = localStorage.getItem("lifehub_lastfm_user");
      if (savedLastFmUser) setLastFmUser(savedLastFmUser);

      const savedLastFmKey = localStorage.getItem("lifehub_lastfm_key");
      if (savedLastFmKey) setLastFmApiKey(savedLastFmKey);

      const savedCapex = localStorage.getItem("lifehub_agri_capex");
      if (savedCapex) setAgriCapex(JSON.parse(savedCapex));

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

  // Agribusiness CapEx Handlers
  const saveCapex = (updated: AgriCapexItem[]) => {
    setAgriCapex(updated);
    try {
      localStorage.setItem("lifehub_agri_capex", JSON.stringify(updated));
    } catch {}
  };

  const handleAddCapex = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCapexName.trim()) return;
    const newItem: AgriCapexItem = {
      id: Date.now().toString(),
      name: newCapexName.trim(),
      category: newCapexCategory,
      budget: Number(newCapexBudget) || 10000,
      spent: Number(newCapexSpent) || 0,
      status: Number(newCapexSpent) >= Number(newCapexBudget) && Number(newCapexBudget) > 0
        ? "Completed"
        : Number(newCapexSpent) > 0
        ? "In Progress"
        : "Planned",
      notes: newCapexNotes.trim(),
    };
    const updated = [newItem, ...agriCapex];
    saveCapex(updated);
    setShowAddCapex(false);
    setNewCapexName("");
    setNewCapexNotes("");
  };

  const deleteCapex = (id: string) => {
    const updated = agriCapex.filter((c) => c.id !== id);
    saveCapex(updated);
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

  // Computed variables for Agribusiness
  const selectedModel = cropModelsList.find((m) => m.id === activeAgriModelId) || cropModelsList[0];
  const totalAgriBudget = agriCapex.reduce((acc, item) => acc + item.budget, 0);
  const totalAgriSpent = agriCapex.reduce((acc, item) => acc + item.spent, 0);
  const simGross = Math.max(0, simYield * simPrice);
  const simNet = Math.max(0, simGross - simOpex);
  const simRoi = simCapex > 0 ? Math.round((simNet / simCapex) * 100) : 0;
  const simPayback = simNet > 0 ? (simCapex / (simNet / 12)).toFixed(1) : "N/A";

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
            { id: "farm", label: "VKP Agribusiness", icon: Sprout },
            { id: "books", label: "Strategic Bookshelf", icon: Library },
            { id: "bible", label: "Bible & Scripture", icon: BookOpen },
            { id: "habits", label: "Habit Tracker", icon: Flame },
            { id: "projects", label: "Projects Tracker", icon: FolderKanban },
            { id: "music", label: "Music & Sanctuary", icon: Music },
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

            {/* MBA.COM OFFICIAL MOCK TRACKER & TRAJECTORY CHART */}
            <div className="space-y-4 p-5 rounded-2xl border border-indigo-500/30 bg-neutral-950/70 backdrop-blur-sm shadow-xl">
              {/* Header & mba.com Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/25">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      mba.com Official Mock Trajectory
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-bold">
                        {deltaFromBaseline >= 0 ? `+${deltaFromBaseline}` : deltaFromBaseline} pts climb
                      </span>
                    </h3>
                    <p className="text-[11px] text-neutral-400">
                      Target: 715+ (99th %ile) by December 2026 • {pointsToTarget} points remaining
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="https://www.mba.com/exam-prep/gmat-official-practice-exams"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white text-xs font-medium transition-colors"
                    title="Launch mba.com practice exam portal"
                  >
                    <span>mba.com Portal</span>
                    <ExternalLink className="w-3 h-3 text-neutral-400" />
                  </a>
                  <button
                    onClick={() => setShowAddMock(!showAddMock)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/25 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {showAddMock ? "Close Form" : "Log Mock Score"}
                  </button>
                </div>
              </div>

              {/* 4 Score Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Latest Mock Score */}
                <div className="p-3.5 rounded-xl border border-indigo-500/20 bg-neutral-900/60 space-y-1">
                  <div className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold flex items-center justify-between">
                    <span>Latest Mock</span>
                    <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[9px] font-bold">
                      {currentPercentile}th %ile
                    </span>
                  </div>
                  <div className="text-2xl font-extrabold text-white font-mono tracking-tight">
                    {latestMock.total}
                  </div>
                  <div className="text-[11px] text-neutral-400 font-mono">
                    Q{latestMock.quant} • DI{latestMock.di} • V{latestMock.verbal}
                  </div>
                </div>

                {/* Baseline Mock */}
                <div className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-900/60 space-y-1">
                  <div className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold flex items-center justify-between">
                    <span>Baseline Diagnostic</span>
                    <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 font-mono text-[9px]">
                      {getGmatFocusPercentile(baselineMock.total)}th %ile
                    </span>
                  </div>
                  <div className="text-2xl font-extrabold text-neutral-300 font-mono tracking-tight">
                    {baselineMock.total}
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    Logged {baselineMock.date}
                  </div>
                </div>

                {/* Score Velocity */}
                <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-neutral-900/60 space-y-1">
                  <div className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold flex items-center justify-between">
                    <span>Score Velocity</span>
                    <span className="text-emerald-400 font-mono text-[9px]">
                      {mockScores.length} Mocks
                    </span>
                  </div>
                  <div className="text-2xl font-extrabold text-emerald-400 font-mono tracking-tight flex items-center gap-1">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    {deltaFromBaseline >= 0 ? `+${deltaFromBaseline}` : deltaFromBaseline} pts
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    Quant +{latestMock.quant - baselineMock.quant} • DI +{latestMock.di - baselineMock.di} • V +{latestMock.verbal - baselineMock.verbal}
                  </div>
                </div>

                {/* Target Runway */}
                <div className="p-3.5 rounded-xl border border-amber-500/20 bg-neutral-900/60 space-y-1">
                  <div className="text-[10px] uppercase tracking-wider text-amber-400 font-semibold flex items-center justify-between">
                    <span>December Goal</span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono text-[9px] font-bold">
                      99th %ile
                    </span>
                  </div>
                  <div className="text-2xl font-extrabold text-amber-400 font-mono tracking-tight">
                    715+
                  </div>
                  <div className="text-[11px] text-neutral-400 font-medium">
                    {pointsToTarget === 0 ? "Target Reached! 🎉" : `${pointsToTarget} pts to 715+`}
                  </div>
                </div>
              </div>

              {/* Visual Trajectory Chart (SVG) */}
              <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/40 relative overflow-hidden">
                <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-2">
                  <span className="font-semibold text-neutral-300 flex items-center gap-1.5">
                    <LineChart className="w-3.5 h-3.5 text-indigo-400" />
                    Official Mock Progression to 715+
                  </span>
                  <div className="flex items-center gap-3 text-[10px]">
                    <span className="flex items-center gap-1 text-indigo-400 font-medium">
                      <span className="w-2 h-2 rounded-full bg-indigo-500" /> Official Mocks
                    </span>
                    <span className="flex items-center gap-1 text-amber-400 font-medium">
                      <span className="w-2 h-0.5 bg-amber-400" /> 715+ Target (99th %ile)
                    </span>
                  </div>
                </div>

                <div className="w-full overflow-x-auto">
                  <svg
                    viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                    className="w-full h-40 sm:h-44 min-w-[540px] text-neutral-400 select-none"
                  >
                    <defs>
                      <linearGradient id="gmatGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                      </linearGradient>
                      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* Horizontal Score Gridlines */}
                    {[600, 650, 700].map((score) => {
                      const y = getSvgY(score);
                      return (
                        <g key={score}>
                          <line
                            x1={chartPadLeft}
                            y1={y}
                            x2={chartPadLeft + chartUsableWidth}
                            y2={y}
                            stroke="#262626"
                            strokeDasharray="2 3"
                            strokeWidth="1"
                          />
                          <text
                            x={chartPadLeft - 8}
                            y={y + 3}
                            fill="#737373"
                            fontSize="9"
                            fontFamily="monospace"
                            textAnchor="end"
                          >
                            {score}
                          </text>
                        </g>
                      );
                    })}

                    {/* 715 Target Line (Gold Dashed) */}
                    <g>
                      <line
                        x1={chartPadLeft}
                        y1={getSvgY(715)}
                        x2={chartPadLeft + chartUsableWidth}
                        y2={getSvgY(715)}
                        stroke="#f59e0b"
                        strokeDasharray="4 4"
                        strokeWidth="1.5"
                        strokeOpacity="0.8"
                      />
                      <text
                        x={chartPadLeft + 10}
                        y={getSvgY(715) - 6}
                        fill="#f59e0b"
                        fontSize="9"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        Target 715+ (99th %ile)
                      </text>
                    </g>

                    {/* Shaded Area Underneath Actual Mocks */}
                    {areaPath && <path d={areaPath} fill="url(#gmatGradient)" />}

                    {/* Actual Mock Polyline */}
                    {mockPlotPoints.length > 1 && (
                      <polyline
                        points={mockPlotPoints.map((p) => `${p.x},${p.y}`).join(" ")}
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}

                    {/* Projected Dashed Line to 715 Target */}
                    {lastMockPoint && (
                      <line
                        x1={lastMockPoint.x}
                        y1={lastMockPoint.y}
                        x2={targetPlotPoint.x}
                        y2={targetPlotPoint.y}
                        stroke="#f59e0b"
                        strokeDasharray="4 4"
                        strokeWidth="2"
                        strokeOpacity="0.7"
                      />
                    )}

                    {/* Actual Mock Data Nodes */}
                    {mockPlotPoints.map((pt, idx) => (
                      <g key={pt.id} className="cursor-pointer group">
                        {/* Outer Glow */}
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="7"
                          fill="#6366f1"
                          fillOpacity="0.25"
                          filter="url(#glow)"
                        />
                        {/* Core Circle */}
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="4.5"
                          fill="#4f46e5"
                          stroke="#ffffff"
                          strokeWidth="2"
                        />
                        {/* Score Tag Above Node */}
                        <rect
                          x={pt.x - 22}
                          y={pt.y - 28}
                          width="44"
                          height="18"
                          rx="5"
                          fill="#18181b"
                          stroke="#4f46e5"
                          strokeWidth="1"
                        />
                        <text
                          x={pt.x}
                          y={pt.y - 16}
                          fill="#ffffff"
                          fontSize="10"
                          fontWeight="bold"
                          fontFamily="monospace"
                          textAnchor="middle"
                        >
                          {pt.total}
                        </text>
                        {/* Mock Label Below Node */}
                        <text
                          x={pt.x}
                          y={pt.y + 18}
                          fill="#a3a3a3"
                          fontSize="9"
                          fontWeight="600"
                          textAnchor="middle"
                        >
                          {idx === 0 ? "Diagnostic" : `Mock ${idx + 1}`}
                        </text>
                        <text
                          x={pt.x}
                          y={pt.y + 28}
                          fill="#737373"
                          fontSize="8"
                          fontFamily="monospace"
                          textAnchor="middle"
                        >
                          {pt.date}
                        </text>
                      </g>
                    ))}

                    {/* Target Goal Node (Dec 2026) */}
                    <g className="cursor-pointer">
                      <circle
                        cx={targetPlotPoint.x}
                        cy={targetPlotPoint.y}
                        r="9"
                        fill="#f59e0b"
                        fillOpacity="0.3"
                        filter="url(#glow)"
                      />
                      <circle
                        cx={targetPlotPoint.x}
                        cy={targetPlotPoint.y}
                        r="5.5"
                        fill="#f59e0b"
                        stroke="#ffffff"
                        strokeWidth="2"
                      />
                      <rect
                        x={targetPlotPoint.x - 30}
                        y={targetPlotPoint.y - 28}
                        width="60"
                        height="18"
                        rx="5"
                        fill="#78350f"
                        stroke="#f59e0b"
                        strokeWidth="1"
                      />
                      <text
                        x={targetPlotPoint.x}
                        y={targetPlotPoint.y - 16}
                        fill="#fef3c7"
                        fontSize="10"
                        fontWeight="bold"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        ★ 715+
                      </text>
                      <text
                        x={targetPlotPoint.x}
                        y={targetPlotPoint.y + 18}
                        fill="#fbbf24"
                        fontSize="9"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        Dec 2026
                      </text>
                      <text
                        x={targetPlotPoint.x}
                        y={targetPlotPoint.y + 28}
                        fill="#d97706"
                        fontSize="8"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        Target
                      </text>
                    </g>
                  </svg>
                </div>
              </div>

              {/* Fast 10-Second Log Form (Collapsible) */}
              {showAddMock && (
                <form
                  onSubmit={handleAddMock}
                  className="p-4 rounded-xl bg-neutral-900/90 border border-indigo-500/40 space-y-3 shadow-2xl animate-in fade-in duration-200"
                >
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                      <Award className="w-4 h-4 text-indigo-400" />
                      Log mba.com Practice Exam Score (Takes ~10 Seconds)
                    </div>
                    <span className="text-[10px] text-neutral-400 font-mono">GMAT Focus Edition (205 - 805)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                    {/* Exam Name */}
                    <div className="sm:col-span-4 space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">
                        Exam Name
                      </label>
                      <select
                        value={newMockName}
                        onChange={(e) => setNewMockName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="Official Practice Exam 1 (Free)">Official Practice Exam 1 (Free)</option>
                        <option value="Official Practice Exam 2 (Free)">Official Practice Exam 2 (Free)</option>
                        <option value="Official Practice Exam 3">Official Practice Exam 3 (Pack 1)</option>
                        <option value="Official Practice Exam 4">Official Practice Exam 4 (Pack 1)</option>
                        <option value="Official Practice Exam 5">Official Practice Exam 5 (Pack 2)</option>
                        <option value="Official Practice Exam 6">Official Practice Exam 6 (Pack 2)</option>
                        <option value="Official Diagnostic / Sectional">Official Diagnostic / Sectional</option>
                        <option value="Official Real Exam">Official Real Exam (Test Center / Online)</option>
                      </select>
                    </div>

                    {/* Date */}
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">
                        Date
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Nov 15"
                        value={newMockDate}
                        onChange={(e) => setNewMockDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    {/* Total Score */}
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-indigo-400 font-semibold">
                        Total Score
                      </label>
                      <input
                        type="number"
                        min={205}
                        max={805}
                        step={10}
                        value={newMockTotal}
                        onChange={(e) => setNewMockTotal(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-indigo-500/50 text-xs font-bold text-indigo-300 focus:outline-none focus:border-indigo-400 font-mono"
                      />
                    </div>

                    {/* Quant (60-90) */}
                    <div className="sm:col-span-1 space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold text-center block">
                        Quant
                      </label>
                      <input
                        type="number"
                        min={60}
                        max={90}
                        value={newMockQuant}
                        onChange={(e) => setNewMockQuant(Number(e.target.value))}
                        className="w-full px-2 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs font-bold text-emerald-400 focus:outline-none focus:border-emerald-500 font-mono text-center"
                      />
                    </div>

                    {/* Data Insights (60-90) */}
                    <div className="sm:col-span-1 space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-indigo-400 font-semibold text-center block">
                        DI
                      </label>
                      <input
                        type="number"
                        min={60}
                        max={90}
                        value={newMockDI}
                        onChange={(e) => setNewMockDI(Number(e.target.value))}
                        className="w-full px-2 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs font-bold text-indigo-400 focus:outline-none focus:border-indigo-500 font-mono text-center"
                      />
                    </div>

                    {/* Verbal (60-90) */}
                    <div className="sm:col-span-1 space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-amber-400 font-semibold text-center block">
                        Verbal
                      </label>
                      <input
                        type="number"
                        min={60}
                        max={90}
                        value={newMockVerbal}
                        onChange={(e) => setNewMockVerbal(Number(e.target.value))}
                        className="w-full px-2 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs font-bold text-amber-400 focus:outline-none focus:border-amber-500 font-mono text-center"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="sm:col-span-1 flex items-end">
                      <button
                        type="submit"
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/25 transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  </div>

                  {/* Notes input */}
                  <div>
                    <input
                      type="text"
                      placeholder="Key takeaway / pacing observations (e.g., DI table analysis felt fast; spent too long on Q#14 in Quant)..."
                      value={newMockNotes}
                      onChange={(e) => setNewMockNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </form>
              )}

              {/* Logged Official Mock History Cards */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span className="font-semibold text-neutral-300 flex items-center gap-1.5">
                    <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
                    Logged Official Practice Exams ({mockScores.length})
                  </span>
                  <span className="text-[11px] text-neutral-500">Official algorithm simulation</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {mockScores.map((mock) => {
                    const pct = getGmatFocusPercentile(mock.total);
                    return (
                      <div
                        key={mock.id}
                        className="p-3 rounded-xl border border-neutral-800/80 bg-neutral-900/60 hover:border-neutral-700/80 transition-all flex flex-col justify-between gap-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-white">{mock.name}</span>
                              <span className="text-[10px] text-neutral-400 font-mono">{mock.date}</span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-1 text-[11px]">
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono font-bold border border-emerald-500/20">
                                Q{mock.quant}
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-mono font-bold border border-indigo-500/20">
                                DI{mock.di}
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-mono font-bold border border-amber-500/20">
                                V{mock.verbal}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <div className="font-extrabold text-base text-white font-mono leading-tight">
                                {mock.total}
                              </div>
                              <div className="text-[10px] font-semibold text-indigo-400 font-mono">
                                {pct}th %ile
                              </div>
                            </div>
                            {mockScores.length > 1 && (
                              <button
                                onClick={() => deleteMock(mock.id)}
                                className="p-1 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-neutral-800 transition-colors"
                                title="Delete Mock"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {mock.notes && (
                          <p className="text-[11px] text-neutral-400 italic bg-neutral-950/60 px-2.5 py-1.5 rounded-lg border border-neutral-800/50">
                            💡 {mock.notes}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Score Delta Ladder & 3 Section Breakdown (Dynamic from Latest Mock) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Quant Section */}
              <div className="p-4 rounded-2xl border border-neutral-800 bg-neutral-900/60 space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Quantitative Reasoning
                  </span>
                  <span className="font-mono text-emerald-400 font-semibold">Q{latestMock.quant} → Q88</span>
                </div>
                <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(15, ((latestMock.quant - 60) / 30) * 100))}%` }}
                  />
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
                  <span className="font-mono text-indigo-400 font-semibold">DI{latestMock.di} → DI85</span>
                </div>
                <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-blue-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(15, ((latestMock.di - 60) / 30) * 100))}%` }}
                  />
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
                  <span className="font-mono text-amber-400 font-semibold">V{latestMock.verbal} → V84</span>
                </div>
                <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-orange-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(15, ((latestMock.verbal - 60) / 30) * 100))}%` }}
                  />
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

        {/* VEERAKERALAPUDUR 0.25-ACRE AGRIBUSINESS MODELER */}
        {(activeTab === "all" || activeTab === "farm") && (
          <section className="p-6 sm:p-8 rounded-3xl border border-emerald-500/25 bg-gradient-to-br from-emerald-950/20 via-neutral-900 to-neutral-950 shadow-2xl space-y-6">
            {/* Top Header & Overview */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-800/80">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-extrabold text-lg text-white tracking-tight">
                      Veerakeralapudur Agribusiness Modeler
                    </h2>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold font-mono">
                      0.25 Acre (11 Cents)
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Tenkasi District, Tamil Nadu • High-Density Horticulture & Cash Flow Engineering
                  </p>
                </div>
              </div>

              {/* CapEx Summary Badges */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <div className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center gap-2">
                  <span className="text-neutral-400">CapEx Budget:</span>
                  <span className="font-bold text-white font-mono">₹{totalAgriBudget.toLocaleString("en-IN")}</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center gap-2">
                  <span className="text-neutral-400">Spent:</span>
                  <span className="font-bold text-emerald-400 font-mono">₹{totalAgriSpent.toLocaleString("en-IN")}</span>
                </div>
                <button
                  onClick={() => setShowAddCapex(!showAddCapex)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md shadow-emerald-600/20 transition-all text-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {showAddCapex ? "Close" : "Add CapEx Item"}
                </button>
              </div>
            </div>

            {/* ADD CAPEX FORM DRAWER */}
            {showAddCapex && (
              <form
                onSubmit={handleAddCapex}
                className="p-4 rounded-2xl bg-neutral-900/90 border border-emerald-500/30 space-y-3 shadow-xl animate-in fade-in duration-200"
              >
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-emerald-400" />
                    Record Capital Investment Item (CapEx)
                  </span>
                  <span className="text-[10px] text-neutral-400">Veerakeralapudur 0.25 Acre Site</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                  <div className="sm:col-span-4 space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">
                      Item Description
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Solar Drip Automation Timer..."
                      value={newCapexName}
                      onChange={(e) => setNewCapexName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="sm:col-span-3 space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">
                      Category
                    </label>
                    <select
                      value={newCapexCategory}
                      onChange={(e: any) => setNewCapexCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Infrastructure">Infrastructure (Fencing, Shed)</option>
                      <option value="Irrigation">Irrigation (Drip, Piping)</option>
                      <option value="Planting Material">Planting Material (Saplings)</option>
                      <option value="Soil & Prep">Soil & Prep (FYM, Biochar)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">
                      Budget (₹)
                    </label>
                    <input
                      type="number"
                      step={500}
                      value={newCapexBudget}
                      onChange={(e) => setNewCapexBudget(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">
                      Spent (₹)
                    </label>
                    <input
                      type="number"
                      step={500}
                      value={newCapexSpent}
                      onChange={(e) => setNewCapexSpent(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  <div className="sm:col-span-1 flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Vendor / specifications / timing notes..."
                    value={newCapexNotes}
                    onChange={(e) => setNewCapexNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </form>
            )}

            {/* CROP MODEL BENCHMARK SELECTION (4 MODELS FOR 0.25 ACRE) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Trees className="w-4 h-4 text-emerald-400" />
                  Select Agribusiness Prototype Model for 0.25 Acre
                </span>
                <span className="text-[11px] text-neutral-400">Click a model to load live ROI simulation</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {cropModelsList.map((model) => {
                  const isSelected = activeAgriModelId === model.id;
                  return (
                    <div
                      key={model.id}
                      onClick={() => {
                        setActiveAgriModelId(model.id);
                        setSimCapex(model.initialCapex);
                        setSimOpex(model.annualOpex);
                        const yVal = parseInt(model.expectedAnnualYield.replace(/\D/g, "")) || 3000;
                        setSimYield(yVal);
                        const pVal = parseInt(model.expectedPricePerUnit.replace(/\D/g, "")) || 35;
                        setSimPrice(pVal);
                      }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 group ${
                        isSelected
                          ? "bg-emerald-950/40 border-emerald-500 shadow-xl shadow-emerald-950/40 scale-[1.02]"
                          : "bg-neutral-900/60 border-neutral-800 hover:border-neutral-700"
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                              isSelected
                                ? "bg-emerald-500 text-neutral-950 font-mono"
                                : "bg-neutral-800 text-neutral-400 font-mono"
                            }`}
                          >
                            {model.plantsOrUnits}
                          </span>
                          <span className="text-[11px] font-mono text-emerald-400 font-bold">
                            ROI: {model.annualRoiPercent}%
                          </span>
                        </div>

                        <h4 className="font-bold text-sm text-white mt-2 group-hover:text-emerald-300 transition-colors">
                          {model.name}
                        </h4>
                        <p className="text-[11px] text-neutral-400 mt-0.5">{model.subtitle}</p>
                      </div>

                      {/* Financial Metrics */}
                      <div className="p-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800/80 space-y-1 text-xs">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-neutral-400">Est. Net Profit:</span>
                          <span className="font-bold text-emerald-400 font-mono">
                            ₹{model.netProfitPerYear.toLocaleString("en-IN")}/yr
                          </span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-neutral-400">Payback Period:</span>
                          <span className="font-mono text-white font-semibold">{model.paybackPeriodMonths} Months</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-neutral-400">Labor Demand:</span>
                          <span className="font-semibold text-neutral-300">{model.laborIntensity}</span>
                        </div>
                      </div>

                      {/* Advantages pill list */}
                      <div className="space-y-1 text-[11px] text-neutral-400">
                        <p className="line-clamp-2">✓ {model.advantages[0]}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2-COLUMN: INTERACTIVE ROI SIMULATOR & CAPEX EXPENDITURE MATRIX */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
              {/* INTERACTIVE FINANCIAL SIMULATOR (7 COLS) */}
              <div className="lg:col-span-7 p-5 rounded-2xl border border-neutral-800 bg-neutral-950/70 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-bold text-sm text-white">Live ROI & Financial Simulator</h3>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono">Active: {selectedModel.name}</span>
                </div>

                {/* 4 Interactive Input Sliders/Fields */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold block">
                      CapEx (₹)
                    </label>
                    <input
                      type="number"
                      step={1000}
                      value={simCapex}
                      onChange={(e) => setSimCapex(Number(e.target.value))}
                      className="w-full bg-transparent font-bold text-sm text-white font-mono focus:outline-none border-b border-neutral-700"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold block">
                      Annual OpEx (₹)
                    </label>
                    <input
                      type="number"
                      step={500}
                      value={simOpex}
                      onChange={(e) => setSimOpex(Number(e.target.value))}
                      className="w-full bg-transparent font-bold text-sm text-white font-mono focus:outline-none border-b border-neutral-700"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold block">
                      Yield (kg/units)
                    </label>
                    <input
                      type="number"
                      step={100}
                      value={simYield}
                      onChange={(e) => setSimYield(Number(e.target.value))}
                      className="w-full bg-transparent font-bold text-sm text-white font-mono focus:outline-none border-b border-neutral-700"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold block">
                      Price / Unit (₹)
                    </label>
                    <input
                      type="number"
                      step={1}
                      value={simPrice}
                      onChange={(e) => setSimPrice(Number(e.target.value))}
                      className="w-full bg-transparent font-bold text-sm text-emerald-400 font-mono focus:outline-none border-b border-neutral-700"
                    />
                  </div>
                </div>

                {/* Real-Time Computed Returns Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-950/20 space-y-0.5">
                    <div className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold">
                      Net Profit / Year
                    </div>
                    <div className="text-xl font-extrabold text-emerald-400 font-mono">
                      ₹{simNet.toLocaleString("en-IN")}
                    </div>
                    <div className="text-[10px] text-neutral-400">
                      ₹{Math.round(simNet / 12).toLocaleString("en-IN")}/month
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-900/60 space-y-0.5">
                    <div className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">
                      Gross Revenue
                    </div>
                    <div className="text-xl font-extrabold text-white font-mono">
                      ₹{simGross.toLocaleString("en-IN")}
                    </div>
                    <div className="text-[10px] text-neutral-400">From {simYield} units</div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-900/60 space-y-0.5">
                    <div className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">
                      Payback Period
                    </div>
                    <div className="text-xl font-extrabold text-amber-400 font-mono">
                      {simPayback} mos
                    </div>
                    <div className="text-[10px] text-neutral-400">To recover CapEx</div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-900/60 space-y-0.5">
                    <div className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">
                      Return on CapEx
                    </div>
                    <div className="text-xl font-extrabold text-teal-400 font-mono">
                      {simRoi}%
                    </div>
                    <div className="text-[10px] text-neutral-400">Annualized yield</div>
                  </div>
                </div>

                {/* Model Details Briefing */}
                <div className="p-3.5 rounded-xl bg-neutral-900/40 border border-neutral-800 text-xs space-y-1.5">
                  <div className="font-bold text-neutral-300 flex items-center justify-between">
                    <span>💡 Model Highlights for {selectedModel.name}</span>
                    <span className="text-[10px] text-neutral-500 font-mono">Water: {selectedModel.waterDemand}</span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-neutral-400">
                    {selectedModel.advantages.map((adv, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-400">✔</span> {adv}
                      </li>
                    ))}
                    <li className="flex items-start gap-1.5 text-amber-400/90">
                      <span>⚠</span> Risk Mitigation: {selectedModel.risks[0]}
                    </li>
                  </ul>
                </div>
              </div>

              {/* CAPEX BUDGET & EXPENDITURE MATRIX (5 COLS) */}
              <div className="lg:col-span-5 p-5 rounded-2xl border border-neutral-800 bg-neutral-950/70 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-bold text-sm text-white">CapEx Expenditure Tracker</h3>
                  </div>
                  <span className="text-[11px] text-neutral-400 font-mono">
                    {Math.round((totalAgriSpent / (totalAgriBudget || 1)) * 100)}% Deployed
                  </span>
                </div>

                {/* CapEx Budget Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-neutral-400">
                    <span>Deployed: ₹{totalAgriSpent.toLocaleString("en-IN")}</span>
                    <span>Budget: ₹{totalAgriBudget.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="w-full bg-neutral-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (totalAgriSpent / (totalAgriBudget || 1)) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {agriCapex.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl border border-neutral-800/80 bg-neutral-900/60 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs">{item.name}</span>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${
                              item.status === "Completed"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : item.status === "In Progress"
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                : "bg-neutral-800 text-neutral-400"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-neutral-400">{item.notes}</p>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <div className="font-mono font-bold text-emerald-400">
                          ₹{item.spent.toLocaleString("en-IN")}
                        </div>
                        <div className="text-[10px] text-neutral-500 font-mono">
                          of ₹{item.budget.toLocaleString("en-IN")}
                        </div>
                        {agriCapex.length > 1 && (
                          <button
                            onClick={() => deleteCapex(item.id)}
                            className="text-[10px] text-neutral-500 hover:text-rose-400 transition-colors mt-1"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* STRATEGIC BOOKSHELF & COMMONPLACE NOTEBOOK */}
        {(activeTab === "all" || activeTab === "books") && (
          <section className="p-6 sm:p-8 rounded-3xl border border-indigo-500/25 bg-gradient-to-br from-indigo-950/20 via-neutral-900 to-neutral-950 shadow-2xl space-y-6">
            {/* Top Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-800/80">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25">
                  <Library className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-extrabold text-lg text-white tracking-tight">
                      Strategic Bookshelf & Commonplace
                    </h2>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold font-mono">
                      {booksCompleted} Completed • {booksReading} Active
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    High-leverage mental models: Semiconductor supply chains, Systems dynamics & Macroeconomics
                  </p>
                </div>
              </div>

              {/* Filter Pills & Add Book */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 bg-neutral-950/80 border border-neutral-800 p-1 rounded-xl text-xs">
                  {[
                    { id: "all", label: `All (${bookshelf.length})` },
                    { id: "reading", label: `Reading (${booksReading})` },
                    { id: "completed", label: `Completed (${booksCompleted})` },
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      onClick={() => setBookFilter(btn.id as any)}
                      className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                        bookFilter === btn.id
                          ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
                          : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setShowAddBook(!showAddBook)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md shadow-indigo-600/20 transition-all text-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {showAddBook ? "Close" : "Log Book"}
                </button>
              </div>
            </div>

            {/* ADD BOOK FORM DRAWER */}
            {showAddBook && (
              <form
                onSubmit={handleAddBook}
                className="p-4 rounded-2xl bg-neutral-950/90 border border-indigo-500/40 space-y-3 shadow-xl animate-in fade-in duration-200"
              >
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <BookMarked className="w-4 h-4 text-indigo-400" />
                    Log Strategic Work & Mental Model
                  </span>
                  <span className="text-[10px] text-neutral-400">Synthesize deep takeaways</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                  <div className="sm:col-span-4 space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Zero to One..."
                      value={newBookTitle}
                      onChange={(e) => setNewBookTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="sm:col-span-3 space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">Author</label>
                    <input
                      type="text"
                      placeholder="e.g. Peter Thiel..."
                      value={newBookAuthor}
                      onChange={(e) => setNewBookAuthor(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="sm:col-span-3 space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">Category</label>
                    <select
                      value={newBookCategory}
                      onChange={(e: any) => setNewBookCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Geopolitics & Tech">Geopolitics & Tech</option>
                      <option value="Systems Thinking">Systems Thinking</option>
                      <option value="Macroeconomics">Macroeconomics</option>
                      <option value="Executive Strategy">Executive Strategy</option>
                      <option value="Personal Systems">Personal Systems</option>
                    </select>
                  </div>

                  <div className="sm:col-span-1 space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">Progress %</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={newBookProgress}
                      onChange={(e) => setNewBookProgress(Number(e.target.value))}
                      className="w-full px-2 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono text-center"
                    />
                  </div>

                  <div className="sm:col-span-1 flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/25 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    placeholder="Core Mental Model (e.g. Monopoly Moats vs Perfect Competition)..."
                    value={newBookModel}
                    onChange={(e) => setNewBookModel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
                  />
                  <input
                    type="text"
                    placeholder="Actionable strategic takeaway for your operations..."
                    value={newBookTakeaway}
                    onChange={(e) => setNewBookTakeaway(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </form>
            )}

            {/* MENTAL MODEL MATRIX RIBBON */}
            <div className="p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="font-bold text-neutral-300 flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-purple-400" />
                Active Strategic Mental Models
              </span>
              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                <span className="px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300">
                  ⚡ Chokepoint Moats
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300">
                  🔄 Feedback Loop Delays
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300">
                  🎯 Limiting Bottleneck
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300">
                  📈 Productive Equity
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300">
                  🔁 1% Compounding
                </span>
              </div>
            </div>

            {/* STRATEGIC BOOK CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  className="p-5 rounded-2xl border border-neutral-800/80 bg-neutral-900/60 hover:border-indigo-500/40 backdrop-blur-sm transition-all duration-300 flex flex-col justify-between space-y-4 group hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-950/20"
                >
                  <div className="space-y-3">
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {book.category}
                        </span>
                        <h3 className="font-extrabold text-base text-white group-hover:text-indigo-300 transition-colors leading-snug">
                          {book.title}
                        </h3>
                        <p className="text-xs text-neutral-400">by {book.author}</p>
                      </div>

                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${
                          book.status === "Completed"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {book.status}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-neutral-400">
                        <span>Reading Progress</span>
                        <span className="font-mono text-white font-semibold">{book.progress}%</span>
                      </div>
                      <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${book.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Core Mental Model Card */}
                    <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800/80 space-y-1 text-xs">
                      <div className="text-[10px] font-bold text-indigo-300 flex items-center gap-1 uppercase tracking-wider">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                        Mental Model
                      </div>
                      <div className="font-bold text-white text-xs">{book.keyMentalModel}</div>
                    </div>

                    {/* Key Quote */}
                    <blockquote className="text-[11px] text-neutral-300 italic border-l-2 border-indigo-500/50 pl-3 leading-relaxed">
                      "{book.keyQuote}"
                    </blockquote>
                  </div>

                  {/* Strategic Takeaway & Footer */}
                  <div className="pt-3 border-t border-neutral-800/80 space-y-2 text-xs">
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      <strong className="text-neutral-300 font-semibold">Strategic Takeaway:</strong> {book.takeaway}
                    </p>

                    <div className="flex justify-between items-center text-[10px] text-neutral-500 pt-1">
                      <span>{book.pagesOrTime}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-amber-400">★★★★★</span>
                        {bookshelf.length > 1 && (
                          <button
                            onClick={() => deleteBook(book.id)}
                            className="text-neutral-500 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. YOUTUBE MUSIC & WORSHIP SANCTUARY */}
        {(activeTab === "all" || activeTab === "music") && (
          <section className="p-6 sm:p-8 rounded-3xl border border-rose-500/20 bg-gradient-to-br from-rose-950/20 via-neutral-900 to-neutral-950 shadow-2xl space-y-6">
            {/* Top Header & Account Sync Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-800/80">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-rose-500 to-red-600 text-white shadow-lg shadow-rose-500/25">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-extrabold text-lg text-white tracking-tight">
                      YouTube Music & Sanctuary Deck
                    </h2>
                    {ytConnected ? (
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Google Connected
                      </span>
                    ) : (
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-400 font-medium">
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
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setShowLastFmConfig(!showLastFmConfig)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                    lastFmUser
                      ? "bg-rose-500/10 border-rose-500/30 text-rose-300 hover:bg-rose-500/20"
                      : "bg-neutral-900 border-neutral-800 hover:border-neutral-700 text-neutral-300"
                  }`}
                  title="Configure Android YouTube Music Live Mirror"
                >
                  <Radio className="w-3.5 h-3.5 text-rose-400" />
                  <span>{lastFmUser ? `Synced: @${lastFmUser}` : "Android Mirror Setup"}</span>
                  <Settings className="w-3 h-3 text-neutral-400 ml-1" />
                </button>

                {ytConnected ? (
                  <button
                    onClick={disconnectYouTube}
                    className="px-3 py-1.5 rounded-xl border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white text-xs transition-colors"
                  >
                    Disconnect
                  </button>
                ) : (
                  <a
                    href="/api/auth/youtube/login"
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/25 transition-all"
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
                className="p-5 rounded-2xl bg-neutral-950/90 border border-rose-500/40 space-y-4 shadow-2xl animate-in fade-in duration-200"
              >
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
                    Android YouTube Music Live Mirror Setup (via Last.fm)
                  </div>
                  <span className="text-[10px] text-neutral-400">100% Free • Works in background on Android</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-1">
                    <div className="font-bold text-rose-400 flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center text-[10px]">1</span>
                      Install Pano Scrobbler
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      Download the free <strong>Pano Scrobbler</strong> app from Google Play Store on your Android phone and toggle on <strong>YouTube Music</strong>.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-1">
                    <div className="font-bold text-rose-400 flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center text-[10px]">2</span>
                      Free Last.fm Account
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      Create a free profile at <strong>last.fm</strong> and get a 15-second free API key from <strong>last.fm/api/account/create</strong>.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-1">
                    <div className="font-bold text-rose-400 flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center text-[10px]">3</span>
                      Enter Credentials Below
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      Paste your username and API key once. Life Hub will automatically mirror whatever song you play on your phone.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
                  <div className="sm:col-span-5 space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">
                      Last.fm Username
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. jaisonsam"
                      value={lastFmUser}
                      onChange={(e) => setLastFmUser(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div className="sm:col-span-5 space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">
                      Last.fm API Key (32 characters)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 4a9f5581a9cd..."
                      value={lastFmApiKey}
                      onChange={(e) => setLastFmApiKey(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-rose-500 font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2 flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/25 transition-colors"
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
                <div className="relative overflow-hidden rounded-2xl border border-rose-500/30 bg-gradient-to-r from-neutral-950 via-rose-950/20 to-neutral-950 p-4 sm:p-5 shadow-xl">
                  {/* Background Ambient Glow */}
                  <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                    <div className="flex items-center gap-4">
                      {/* Album Art with Vinyl / Glow Effect */}
                      <div className="relative group flex-shrink-0">
                        {displayTrack?.albumArt ? (
                          <img
                            src={displayTrack.albumArt}
                            alt={displayTrack.title}
                            className={`w-16 h-16 rounded-xl object-cover border border-rose-500/40 shadow-lg shadow-rose-950/50 ${
                              isLive ? "ring-2 ring-rose-500/50" : ""
                            }`}
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-rose-400">
                            <Disc className={`w-8 h-8 ${isLive ? "animate-spin text-rose-500" : "text-neutral-600"}`} />
                          </div>
                        )}
                        {isLive && (
                          <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
                          </span>
                        )}
                      </div>

                      {/* Track Details & Status */}
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                              isLive
                                ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                : "bg-neutral-800 text-neutral-400"
                            }`}
                          >
                            {isLive ? (
                              <>
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                                Live from Android • YouTube Music
                              </>
                            ) : (
                              "Android Mirror Standby"
                            )}
                          </span>

                          {/* Sound Equalizer Bars (When Active) */}
                          {isLive && (
                            <div className="flex items-end gap-0.5 h-3">
                              <span className="w-0.5 bg-rose-500 rounded-full animate-pulse h-full" />
                              <span className="w-0.5 bg-pink-400 rounded-full animate-bounce h-2/3" />
                              <span className="w-0.5 bg-amber-400 rounded-full animate-pulse h-5/6" />
                              <span className="w-0.5 bg-rose-400 rounded-full animate-bounce h-1/2" />
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
                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-0 border-neutral-800/80">
                      {displayTrack?.ytMusicUrl && (
                        <a
                          href={displayTrack.ytMusicUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/25 transition-all"
                        >
                          <Music className="w-3.5 h-3.5" />
                          <span>Open in YT Music</span>
                          <ExternalLink className="w-3 h-3 text-white/80" />
                        </a>
                      )}

                      {lastFmUser && (
                        <button
                          onClick={manualRefreshNowPlaying}
                          disabled={isFetchingNowPlaying}
                          className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white transition-colors"
                          title="Refresh Now Playing Status"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isFetchingNowPlaying ? "animate-spin text-rose-400" : ""}`} />
                        </button>
                      )}

                      <button
                        onClick={() => setDemoNowPlaying(!demoNowPlaying)}
                        className={`text-xs px-2.5 py-1.5 rounded-xl border transition-colors ${
                          demoNowPlaying
                            ? "bg-rose-500/20 text-rose-300 border-rose-500/40 font-semibold"
                            : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white"
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
                  <Disc className="w-4 h-4 text-rose-400" />
                  <h3 className="font-bold text-sm text-white">Curated Album & Playlist Deck</h3>
                </div>

                {/* Category Filter Pills */}
                <div className="flex flex-wrap items-center gap-1.5 bg-neutral-950/80 border border-neutral-800 p-1 rounded-xl text-xs">
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
                          ? "bg-rose-500 text-white shadow-sm shadow-rose-500/30"
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
                      className="group rounded-2xl border border-neutral-800/80 bg-neutral-900/40 hover:border-rose-500/40 backdrop-blur-sm overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-950/20 cursor-pointer"
                    >
                      <div className="aspect-square relative overflow-hidden bg-neutral-950">
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
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />
                        
                        {/* Floating Top Badges */}
                        <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-center text-[10px]">
                          <span className="px-2 py-0.5 rounded-full bg-neutral-900/90 text-emerald-400 font-semibold border border-emerald-500/30 backdrop-blur-md">
                            Google Cloud
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-neutral-950/80 text-neutral-300 font-mono backdrop-blur-md">
                            {pl.itemCount} tracks
                          </span>
                        </div>

                        {/* Hover Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-12 h-12 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/50 scale-90 group-hover:scale-100 transition-transform">
                            <Play className="w-5 h-5 ml-0.5 fill-white" />
                          </div>
                        </div>
                      </div>

                      <div className="p-3.5 space-y-2">
                        <div>
                          <h4 className="font-bold text-sm text-white truncate group-hover:text-rose-300 transition-colors">
                            {pl.title}
                          </h4>
                          <p className="text-[11px] text-neutral-400 mt-0.5">Personal YouTube Playlist</p>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-2 border-t border-neutral-800">
                          <span>Sync Account</span>
                          <a
                            href={pl.ytMusicUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-neutral-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
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
                      className="group rounded-2xl border border-neutral-800/80 bg-neutral-900/40 hover:border-rose-500/40 backdrop-blur-sm overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-950/20 cursor-pointer"
                    >
                      {/* Album Cover with Badges & Hover Play */}
                      <div className="aspect-square relative overflow-hidden bg-neutral-950">
                        <img
                          src={album.coverUrl}
                          alt={album.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />

                        {/* Badges */}
                        <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-center text-[10px]">
                          <span
                            className={`px-2 py-0.5 rounded-full font-semibold border backdrop-blur-md ${
                              album.category === "worship"
                                ? "bg-amber-950/70 text-amber-300 border-amber-500/30"
                                : album.category === "focus"
                                ? "bg-indigo-950/70 text-indigo-300 border-indigo-500/30"
                                : "bg-rose-950/70 text-rose-300 border-rose-500/30"
                            }`}
                          >
                            {album.tag}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-neutral-950/80 text-neutral-300 font-mono backdrop-blur-md">
                            {album.bpmOrVibe}
                          </span>
                        </div>

                        {/* Hover Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-12 h-12 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/50 scale-90 group-hover:scale-100 transition-transform">
                            <Play className="w-5 h-5 ml-0.5 fill-white" />
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-3.5 space-y-2">
                        <div>
                          <h4 className="font-bold text-sm text-white group-hover:text-rose-300 transition-colors line-clamp-1">
                            {album.title}
                          </h4>
                          <p className="text-[11px] text-neutral-400 mt-0.5 line-clamp-1">{album.artist}</p>
                        </div>

                        <p className="text-[11px] text-neutral-400/90 leading-tight line-clamp-2">
                          {album.moodDescription}
                        </p>

                        <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-2 border-t border-neutral-800">
                          <span>{album.trackCount} tracks</span>
                          <a
                            href={album.ytUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-neutral-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
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
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-neutral-800 bg-neutral-950/90 shadow-xl">
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  {currentPlaylist.coverUrl ? (
                    <img
                      src={currentPlaylist.coverUrl}
                      alt={currentPlaylist.title}
                      className="w-12 h-12 rounded-xl object-cover border border-rose-500/30 shadow-md"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                      <Volume2 className="w-6 h-6 animate-pulse" />
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-rose-500 text-white">
                    <Music className="w-2.5 h-2.5" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{currentPlaylist.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium">
                      {currentPlaylist.tag || "Queued"}
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">{currentPlaylist.subtitle}</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <a
                  href={currentPlaylist.ytUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Launch in YouTube Music</span>
                  <ExternalLink className="w-3 h-3 text-white/80" />
                </a>
              </div>
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
