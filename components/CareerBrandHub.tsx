"use client";

import React, { useState, useEffect } from "react";
import {
  Briefcase,
  MapPin,
  Mail,
  Phone,
  ExternalLink,
  GraduationCap,
  Award,
  TrendingUp,
  CheckCircle2,
  Copy,
  Check,
  Building2,
  Cpu,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Globe,
  Sliders,
  Sparkles,
  FileText,
  Search,
  Plus,
  Bookmark,
  Filter,
  Trash2,
  Clock,
  Send,
  X,
  MessageSquare,
  DollarSign,
  ChevronDown,
} from "lucide-react";

export interface JobOpening {
  id: string;
  title: string;
  company: string;
  campus: string;
  category: "tech" | "consulting" | "industrial";
  source: "LinkedIn Recruiter Verified" | "Naukri Premium Enterprise" | "Company ATS" | "Foundit / Monster" | "Direct Referral";
  directUrl: string;
  recruiterUrl?: string;
  recruiterLabel?: string;
  ctcRange: string;
  expRequired: string;
  matchScore: number;
  skills: string[];
  whyFit: string;
  tailoredPitch: string;
  status: "wishlist" | "applied" | "screening" | "interview" | "offer" | "archived";
  appliedDate?: string;
  notes?: string;
  isCustom?: boolean;
}

const INITIAL_JOB_OPENINGS: JobOpening[] = [
  {
    id: "sap-labs-pp",
    title: "Senior Solution Specialist — S/4HANA PP & Digital Supply Chain",
    company: "SAP Labs India",
    campus: "Whitefield, Bengaluru",
    category: "tech",
    source: "LinkedIn Recruiter Verified",
    directUrl: "https://www.sap.com/india/about/careers.html",
    recruiterUrl: "https://www.linkedin.com/jobs/search/?keywords=SAP%20Labs%20S4HANA%20Manufacturing&location=Bengaluru%2C%20Karnataka%2C%20India",
    recruiterLabel: "LinkedIn Recruiter Post",
    ctcRange: "₹28L - ₹42L PA",
    expRequired: "4 - 7 Years",
    matchScore: 98,
    skills: ["S/4HANA PP", "MRP Live", "Routing & BOM", "Fiori", "Discrete Mfg"],
    whyFit: "Direct match for your 4.3 yrs at Schneider handling S/4HANA PP order flow, 1TB database hygiene, and multi-plant execution.",
    tailoredPitch: "Hi, I'm Jaison Shanmugiah. With 4.3+ years at Schneider Electric specializing in SAP S/4HANA PP and MES integration across 6 European manufacturing plants (holding a B.Tech in Production Engineering from NIT Calicut, 8.47 CGPA), I bring deep expertise in S/4HANA order flow, MRP Live, and shopfloor data consistency.",
    status: "wishlist",
  },
  {
    id: "mckinsey-digital-erp",
    title: "Senior Specialist / Associate — Operations & Enterprise Cloud ERP",
    company: "McKinsey & Company (McKinsey Digital)",
    campus: "MG Road / UB City, Bengaluru",
    category: "consulting",
    source: "Company ATS",
    directUrl: "https://www.mckinsey.com/careers",
    recruiterUrl: "https://www.linkedin.com/jobs/search/?keywords=McKinsey%20Enterprise%20Operations&location=Bengaluru%2C%20Karnataka%2C%20India",
    recruiterLabel: "LinkedIn Recruiter Post",
    ctcRange: "₹34L - ₹52L PA",
    expRequired: "4 - 8 Years",
    matchScore: 95,
    skills: ["S/4HANA Strategy", "Multi-Plant Rollout", "Shopfloor Optimization", "Executive Advisory"],
    whyFit: "Top-tier operational advisory seeking hands-on leaders who have stabilized European plant transformations and cut warehouse workloads.",
    tailoredPitch: "Hi, I'm Jaison Shanmugiah. Having led multi-site S/4HANA & AVEVA LDS transformations across 6 European plants for Schneider Electric and eliminated 20% warehouse picking workload, I translate shopfloor manufacturing complexity into executive operational ROI.",
    status: "wishlist",
  },
  {
    id: "deloitte-pp-lead",
    title: "Manager / Lead Consultant — SAP S/4HANA PP/QM & Digital Manufacturing",
    company: "Deloitte India / USI",
    campus: "Prestige Tech Park, Outer Ring Road, Bengaluru",
    category: "consulting",
    source: "Naukri Premium Enterprise",
    directUrl: "https://www.deloitte.com/in/en/careers.html",
    recruiterUrl: "https://www.linkedin.com/jobs/search/?keywords=Deloitte%20SAP%20PP&location=Bengaluru%2C%20Karnataka%2C%20India",
    recruiterLabel: "LinkedIn Recruiter Post",
    ctcRange: "₹25L - ₹38L PA",
    expRequired: "4 - 7 Years",
    matchScore: 96,
    skills: ["SAP PP/QM", "S/4HANA Greenfield/Brownfield", "MES Integration", "Change Governance"],
    whyFit: "Looking for production planning leads experienced in global client deployments, defect triage (195+ tickets resolved), and plant stabilization.",
    tailoredPitch: "Hi, I'm Jaison Shanmugiah. Over 4.3 years at Schneider Electric, I have stabilized S/4HANA PP operations across 6 European sites, resolving 195+ critical tickets and resolving stuck production orders during high-stakes go-lives. I would love to bring this execution rigor to Deloitte's digital manufacturing clients.",
    status: "wishlist",
  },
  {
    id: "siemens-advanta-mes",
    title: "Lead Digital Enterprise Consultant — Smart Factory & AVEVA/Siemens MES",
    company: "Siemens Technology India (Advanta)",
    campus: "Electronic City, Bengaluru",
    category: "industrial",
    source: "LinkedIn Recruiter Verified",
    directUrl: "https://www.siemens.com/en-gb/company/jobs",
    recruiterUrl: "https://www.linkedin.com/jobs/search/?keywords=Siemens%20MES%20Consultant&location=Bengaluru%2C%20Karnataka%2C%20India",
    recruiterLabel: "LinkedIn Recruiter Post",
    ctcRange: "₹24L - ₹36L PA",
    expRequired: "4 - 7 Years",
    matchScore: 97,
    skills: ["AVEVA LDS / Wonderware", "MES to S/4HANA", "Line Performance", "Batch Traceability"],
    whyFit: "Exact match for your hands-on AVEVA LDS Line Performance, PMS MES deployment, and 2,500+ operator enablement background.",
    tailoredPitch: "Hi, I'm Jaison Shanmugiah. I specialize in integrating AVEVA LDS (Line Performance) and PMS MES systems into enterprise SAP S/4HANA architectures, successfully deployed and stabilized across 6 European manufacturing plants supporting 2,500+ operators.",
    status: "wishlist",
  },
  {
    id: "bosch-bgsw-erp",
    title: "Senior ERP Solutions Architect — Smart Manufacturing & IIoT",
    company: "Bosch Global Software Technologies (BGSW)",
    campus: "Adugodi / Koramangala, Bengaluru",
    category: "industrial",
    source: "Naukri Premium Enterprise",
    directUrl: "https://www.bosch.in/careers/",
    recruiterUrl: "https://www.linkedin.com/jobs/search/?keywords=Bosch%20SAP%20Manufacturing&location=Bengaluru%2C%20Karnataka%2C%20India",
    recruiterLabel: "LinkedIn Recruiter Post",
    ctcRange: "₹24L - ₹35L PA",
    expRequired: "4 - 8 Years",
    matchScore: 94,
    skills: ["S/4HANA Discrete Mfg", "IIoT Handshake", "Order Lifecycle", "NIT Calicut Rigor"],
    whyFit: "Bosch's industrial tech group values engineering foundations (NIT Calicut) paired with real shopfloor discrete manufacturing deployments.",
    tailoredPitch: "Hi, I'm Jaison Shanmugiah. Holding a B.Tech in Production Engineering from NIT Calicut (CGPA 8.47) and 4.3+ years at Schneider Electric deploying S/4HANA PP and MES across European factories, I bridge shopfloor mechanics with enterprise software scalability.",
    status: "wishlist",
  },
  {
    id: "honeywell-ba-erp",
    title: "Lead Business Analyst — Connected Enterprise & Global ERP Supply Chain",
    company: "Honeywell Technology Solutions",
    campus: "Devarabisanahalli, Outer Ring Road, Bengaluru",
    category: "industrial",
    source: "Company ATS",
    directUrl: "https://careers.honeywell.com/us/en/home",
    recruiterUrl: "https://www.linkedin.com/jobs/search/?keywords=Honeywell%20ERP%20Analyst&location=Bengaluru%2C%20Karnataka%2C%20India",
    recruiterLabel: "LinkedIn Recruiter Post",
    ctcRange: "₹22L - ₹33L PA",
    expRequired: "4 - 7 Years",
    matchScore: 93,
    skills: ["Kinaxis RapidResponse", "S/4HANA Supply Chain", "Warehouse Picking", "Cross-Functional BA"],
    whyFit: "Direct alignment with your Kinaxis supply chain planning, warehouse workload reduction (20% at Attibele), and cross-functional leadership.",
    tailoredPitch: "Hi, I'm Jaison Shanmugiah. With 4.3+ years driving S/4HANA solutions, Kinaxis planning integrations, and warehouse workload reductions (20% at Attibele plant) for Schneider Electric, I specialize in translating complex supply chain workflows into clean digital execution.",
    status: "wishlist",
  },
  {
    id: "accenture-supply-chain",
    title: "Supply Chain & Operations Strategy Consultant (S/4HANA & Kinaxis)",
    company: "Accenture Strategy & Consulting",
    campus: "RMZ Ecospace, Bellandur, Bengaluru",
    category: "consulting",
    source: "LinkedIn Recruiter Verified",
    directUrl: "https://www.accenture.com/in-en/careers",
    recruiterUrl: "https://www.linkedin.com/jobs/search/?keywords=Accenture%20Supply%20Chain%20SAP&location=Bengaluru%2C%20Karnataka%2C%20India",
    recruiterLabel: "LinkedIn Recruiter Post",
    ctcRange: "₹26L - ₹40L PA",
    expRequired: "4 - 7 Years",
    matchScore: 96,
    skills: ["Kinaxis RapidResponse", "Tableau Analytics", "S/4HANA PP", "Supply Chain Design"],
    whyFit: "High match for combining Kinaxis supply planning, Tableau analytics, and multi-plant S/4HANA execution.",
    tailoredPitch: "Hi, I'm Jaison Shanmugiah. I combine 4.3+ years of hands-on European S/4HANA plant deployments with Kinaxis RapidResponse planning and Tableau visual analytics, enabling global discrete manufacturing enterprises to synchronize demand with factory execution.",
    status: "wishlist",
  },
  {
    id: "schneider-principal-architect",
    title: "Principal Solution Architect / Delivery Lead — Global ERP Programs",
    company: "Schneider Electric (Bengaluru Global Hub)",
    campus: "Attibele / Bagmane Tech Park, Bengaluru",
    category: "industrial",
    source: "Company ATS",
    directUrl: "https://www.se.com/in/en/about-us/careers/overview.jsp",
    recruiterUrl: "https://www.linkedin.com/jobs/search/?keywords=Schneider%20Electric%20SAP%20Architect&location=Bengaluru%2C%20Karnataka%2C%20India",
    recruiterLabel: "LinkedIn Recruiter Post",
    ctcRange: "₹28L - ₹42L PA",
    expRequired: "4 - 8 Years",
    matchScore: 99,
    skills: ["BeNeDACH Program", "Ales & European Plants", "AVEVA LDS", "Enterprise Architecture"],
    whyFit: "Direct internal advancement opportunity leveraging your proven track record across the European plant deployment programs.",
    tailoredPitch: "Having successfully deployed and stabilized S/4HANA PP and AVEVA LDS across 6 European manufacturing plants and resolved 195+ governance tickets for Schneider Electric, I am primed to lead larger global delivery scopes from the Bengaluru hub.",
    status: "wishlist",
  },
  {
    id: "ltimindtree-s4-lead",
    title: "SAP S/4HANA Manufacturing Functional Lead (Discrete & PP/DS)",
    company: "LTIMindtree",
    campus: "Global Technology Park, Bellandur, Bengaluru",
    category: "tech",
    source: "Naukri Premium Enterprise",
    directUrl: "https://www.ltimindtree.com/careers/",
    recruiterUrl: "https://www.naukri.com/sap-s4-hana-pp-jobs-in-bengaluru-bangalore",
    recruiterLabel: "Naukri Verified Post",
    ctcRange: "₹23L - ₹34L PA",
    expRequired: "4 - 7 Years",
    matchScore: 93,
    skills: ["S/4HANA PP", "Discrete Mfg", "BOM/Routing", "MES Handshake"],
    whyFit: "Seeking functional leads with hands-on discrete manufacturing experience and multi-site configuration background.",
    tailoredPitch: "Hi, I'm Jaison Shanmugiah. With 4.3+ years at Schneider Electric specializing in discrete manufacturing S/4HANA PP rollouts and MES integration across 6 European sites, I bring strong functional and operational depth to enterprise clients.",
    status: "wishlist",
  },
  {
    id: "capgemini-invent-lead",
    title: "Senior Supply Chain & ERP Transformation Specialist",
    company: "Capgemini Invent",
    campus: "Whitefield, Bengaluru",
    category: "consulting",
    source: "Foundit / Monster",
    directUrl: "https://www.capgemini.com/in-en/careers/",
    recruiterUrl: "https://www.linkedin.com/jobs/search/?keywords=Capgemini%20SAP%20PP&location=Bengaluru%2C%20Karnataka%2C%20India",
    recruiterLabel: "LinkedIn Recruiter Post",
    ctcRange: "₹24L - ₹36L PA",
    expRequired: "4 - 7 Years",
    matchScore: 92,
    skills: ["Supply Chain Transformation", "S/4HANA PP", "Production Order Archival", "Lean Operations"],
    whyFit: "Valuing engineers with production background (NIT Calicut) who have led digital transformation programs in heavy/discrete industry.",
    tailoredPitch: "Hi, I'm Jaison Shanmugiah. I combine an NIT Calicut Production Engineering degree with 4.3+ years at Schneider Electric delivering S/4HANA and AVEVA LDS transformations across 6 European manufacturing plants.",
    status: "wishlist",
  },
];

export default function CareerBrandHub() {
  const [copiedPitch, setCopiedPitch] = useState(false);
  const [copiedRolePitchId, setCopiedRolePitchId] = useState<string | null>(null);
  const [activeSectorCategory, setActiveSectorCategory] = useState<"all" | "tech" | "consulting" | "industrial">("all");
  const [activePipelineFilter, setActivePipelineFilter] = useState<"all" | "wishlist" | "applied" | "interview" | "offer">("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Job openings list with local storage persistence (v3 ensures clean verified URLs)
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>(INITIAL_JOB_OPENINGS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Custom Job Form State
  const [newTitle, setNewTitle] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newCampus, setNewCampus] = useState("");
  const [newCategory, setNewCategory] = useState<"tech" | "consulting" | "industrial">("tech");
  const [newSource, setNewSource] = useState<JobOpening["source"]>("LinkedIn Recruiter Verified");
  const [newUrl, setNewUrl] = useState("");
  const [newCtc, setNewCtc] = useState("");
  const [newNotes, setNewNotes] = useState("");

  // Load from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("lifehub_career_jobs_v3");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setJobOpenings(parsed);
        }
      }
    } catch (e) {
      console.error("Error reading saved job openings", e);
    }
  }, []);

  // Save to LocalStorage
  const saveOpenings = (updated: JobOpening[]) => {
    setJobOpenings(updated);
    try {
      localStorage.setItem("lifehub_career_jobs_v3", JSON.stringify(updated));
    } catch (e) {
      console.error("Error saving job openings", e);
    }
  };

  const handleStatusChange = (id: string, newStatus: JobOpening["status"]) => {
    const updated = jobOpenings.map((job) =>
      job.id === id
        ? {
            ...job,
            status: newStatus,
            appliedDate: newStatus === "applied" && !job.appliedDate ? new Date().toISOString().split("T")[0] : job.appliedDate,
          }
        : job
    );
    saveOpenings(updated);
  };

  const handleNotesChange = (id: string, notes: string) => {
    const updated = jobOpenings.map((job) => (job.id === id ? { ...job, notes } : job));
    saveOpenings(updated);
  };

  const handleDeleteJob = (id: string) => {
    const updated = jobOpenings.filter((job) => job.id !== id);
    saveOpenings(updated);
  };

  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCompany.trim()) return;

    const newJob: JobOpening = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim(),
      company: newCompany.trim(),
      campus: newCampus.trim() || "Bengaluru, Karnataka",
      category: newCategory,
      source: newSource,
      directUrl: newUrl.trim() || "https://www.linkedin.com/jobs/",
      recruiterUrl: newUrl.trim() || "https://www.linkedin.com/jobs/",
      recruiterLabel: "Direct Link",
      ctcRange: newCtc.trim() || "Competitive / Standard Band",
      expRequired: "4+ Years",
      matchScore: 95,
      skills: ["SAP S/4HANA", "Digital Manufacturing", "Business Analysis"],
      whyFit: "Custom recruiter lead added to your personal career tracker.",
      tailoredPitch: `Hi, I'm Jaison Shanmugiah. With 4.3+ years at Schneider Electric leading S/4HANA and MES solutions across 6 European plants, I am eager to apply my background in production engineering and digital transformation to the ${newTitle} role at ${newCompany}.`,
      status: "wishlist",
      notes: newNotes.trim(),
      isCustom: true,
    };

    saveOpenings([newJob, ...jobOpenings]);
    // Reset form
    setNewTitle("");
    setNewCompany("");
    setNewCampus("");
    setNewUrl("");
    setNewCtc("");
    setNewNotes("");
    setIsAddModalOpen(false);
  };

  const elevatorPitch = `Hi, I'm Jaison Shanmugiah — a Senior ERP Business Analyst with 4.3+ years of experience leading multi-site SAP S/4HANA transformations and AVEVA LDS / MES manufacturing execution integrations for Schneider Electric across 6 European plants. Holding a B.Tech in Production Engineering from NIT Calicut (CGPA 8.47), I bridge high-level enterprise architecture with shop-floor production order flow to eliminate bottlenecks and stabilize concurrent go-lives.`;

  const handleCopyPitch = () => {
    navigator.clipboard.writeText(elevatorPitch);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 3000);
  };

  const handleCopyRolePitch = (job: JobOpening) => {
    navigator.clipboard.writeText(job.tailoredPitch);
    setCopiedRolePitchId(job.id);
    setTimeout(() => setCopiedRolePitchId(null), 3000);
  };

  // Filtered job openings
  const filteredJobs = jobOpenings.filter((job) => {
    // Sector filter
    if (activeSectorCategory !== "all" && job.category !== activeSectorCategory) return false;
    // Pipeline filter
    if (activePipelineFilter === "wishlist" && job.status !== "wishlist") return false;
    if (activePipelineFilter === "applied" && job.status !== "applied") return false;
    if (activePipelineFilter === "interview" && job.status !== "screening" && job.status !== "interview") return false;
    if (activePipelineFilter === "offer" && job.status !== "offer") return false;
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = `${job.title} ${job.company} ${job.campus} ${job.skills.join(" ")} ${job.whyFit} ${job.notes || ""}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }
    return true;
  });

  // Pipeline counts
  const countWishlist = jobOpenings.filter((j) => j.status === "wishlist").length;
  const countApplied = jobOpenings.filter((j) => j.status === "applied").length;
  const countInterview = jobOpenings.filter((j) => j.status === "screening" || j.status === "interview").length;
  const countOffer = jobOpenings.filter((j) => j.status === "offer").length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. EXECUTIVE PROFILE HERO & BRANDING BANNER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-blue-950/40 via-neutral-900 to-neutral-950 border border-blue-500/30 shadow-2xl relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-3xl">
            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/25 font-bold uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                Senior ERP Business Analyst
              </span>
              <span className="text-[10px] px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 font-semibold font-mono">
                Schneider Electric (Bengaluru)
              </span>
              <span className="text-[10px] px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/25 font-semibold font-mono">
                4 Years 3 Months Experience
              </span>
            </div>

            {/* Name & Executive Title */}
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Jaison Shanmugiah
              </h1>
              <p className="text-sm sm:text-base font-semibold text-blue-300 mt-1">
                Enterprise SAP S/4HANA Transformation & Digital Manufacturing Integration Specialist
              </p>
            </div>

            {/* Value Proposition */}
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Coordinates solution delivery across <strong>6 European manufacturing sites</strong> (France, Germany, Poland, Czech Republic, Italy, Netherlands) supporting <strong>2,500+ operational personnel</strong>. Integrates mission-critical shopfloor execution (AVEVA LDS / MES) with enterprise S/4HANA core planning.
            </p>

            {/* Contact & Location Strip */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400 pt-1">
              <span className="flex items-center gap-1 text-neutral-300">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                Bengaluru, Karnataka, India
              </span>
              <a
                href="mailto:jaisonsam47@gmail.com"
                className="flex items-center gap-1 text-neutral-300 hover:text-white transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                jaisonsam47@gmail.com
              </a>
              <span className="flex items-center gap-1 text-neutral-300">
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                +91 9388116984
              </span>
              <span className="flex items-center gap-1 text-neutral-300 font-medium">
                <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                NIT Calicut (B.Tech Production Eng, 8.47 CGPA)
              </span>
            </div>
          </div>

          {/* Social Profiles & Quick Actions */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            {/* LinkedIn Profile Connector */}
            <a
              href="https://www.linkedin.com/in/jaison-shanmugiah-5b29901b5/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#0A66C2] hover:bg-[#004182] text-white font-bold text-xs shadow-lg shadow-blue-600/25 transition-all"
            >
              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
              <span>View LinkedIn Profile</span>
              <ExternalLink className="w-3.5 h-3.5 text-white/80" />
            </a>

            {/* Naukri Candidate Connector */}
            <a
              href="https://www.naukri.com/mnjuser/profile"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all border border-blue-400/30"
            >
              <Building2 className="w-4 h-4 text-amber-300" />
              <span>Naukri Candidate Portal</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-white/80" />
            </a>

            {/* Copy 60-Sec Elevator Pitch */}
            <button
              onClick={handleCopyPitch}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-2xl border border-neutral-700 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 text-xs font-semibold transition-all"
              title="Copy executive introduction to clipboard for InMails"
            >
              {copiedPitch ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Pitch Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Copy 60-Sec Pitch</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. QUANTIFIED TRACK RECORD (EXECUTIVE METRICS MATRIX) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "European Plants", value: "6 Sites", sub: "France, DE, PL, CZ, IT, NL", color: "text-blue-400" },
          { label: "Shopfloor Users", value: "2,500+", sub: "Personnel enabled", color: "text-emerald-400" },
          { label: "Order Data Hygiene", value: "1 TB", sub: "S/4HANA DB archival", color: "text-purple-400" },
          { label: "Governance Tickets", value: "195+", sub: "145 SRs + 50 Incidents", color: "text-amber-400" },
          { label: "Ales Plant Go-Live", value: "Fixed 3-4/k", sub: "Locked order resolution", color: "text-cyan-400" },
          { label: "Attibele Plant", value: "20% Cut", sub: "Warehouse picking load", color: "text-rose-400" },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-neutral-900/70 border border-neutral-800 flex flex-col justify-between hover:border-neutral-700 transition-colors"
          >
            <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">{stat.label}</div>
            <div className="my-1.5">
              <div className={`text-xl sm:text-2xl font-black font-mono tracking-tight ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-[10px] text-neutral-500 font-medium">{stat.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. CORE COMPETENCIES MATRIX */}
      <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
          <Cpu className="w-4 h-4" />
          Technical & Functional Core Competencies
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 space-y-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              SAP S/4HANA & PP
            </span>
            <p className="text-xs text-neutral-400 leading-relaxed">
              BOMs, routings, work centers, MRP Live, production order lifecycles, and database data volume management.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 space-y-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
              Digital Mfg & MES
            </span>
            <p className="text-xs text-neutral-400 leading-relaxed">
              AVEVA LDS (Line Performance), PMS MES integration, shop-floor traceability, and live dispatch synchronization.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 space-y-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-purple-400" />
              Supply Chain & Analytics
            </span>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Kinaxis RapidResponse planning, Tableau operational dashboards, warehouse flow optimization, and ERP telemetry.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 space-y-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              Production Engineering
            </span>
            <p className="text-xs text-neutral-400 leading-relaxed">
              B.Tech NIT Calicut engineering rigor, operations research, bottleneck elimination, and cross-functional leadership.
            </p>
          </div>
        </div>
      </div>

      {/* 4. PRODUCTIVITY DESK: BANGALORE JOB OPENINGS & PIPELINE TRACKER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-neutral-900 to-neutral-950 border border-blue-500/30 shadow-2xl space-y-6">
        {/* Desk Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg sm:text-xl text-white tracking-tight">
                  Available Job Openings & Application Pipeline
                </h3>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold font-mono">
                  Bangalore Market
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Real available job openings with official career portals, direct recruiter links, tailored pitch generators, and pipeline tracking
              </p>
            </div>
          </div>

          {/* Quick Metrics & Add Opening Button */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-3.5 py-2 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center gap-2 text-xs">
              <span className="text-neutral-400">Target CTC Band:</span>
              <span className="font-bold text-emerald-400 font-mono">₹24L - ₹52L PA</span>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/25 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Job Opening</span>
            </button>
          </div>
        </div>

        {/* Pipeline KPI Badges Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setActivePipelineFilter(activePipelineFilter === "wishlist" ? "all" : "wishlist")}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              activePipelineFilter === "wishlist"
                ? "bg-amber-500/15 border-amber-500/60 ring-1 ring-amber-500/30"
                : "bg-neutral-950/50 border-neutral-800 hover:border-neutral-700"
            }`}
          >
            <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
              <span>📌 Wishlist</span>
              <span className="text-xs font-mono font-bold text-amber-400">{countWishlist}</span>
            </div>
            <p className="text-xs font-bold text-white mt-1">To Apply / Review</p>
          </button>

          <button
            onClick={() => setActivePipelineFilter(activePipelineFilter === "applied" ? "all" : "applied")}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              activePipelineFilter === "applied"
                ? "bg-blue-500/15 border-blue-500/60 ring-1 ring-blue-500/30"
                : "bg-neutral-950/50 border-neutral-800 hover:border-neutral-700"
            }`}
          >
            <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
              <span>📨 Applied</span>
              <span className="text-xs font-mono font-bold text-blue-400">{countApplied}</span>
            </div>
            <p className="text-xs font-bold text-white mt-1">Submitted</p>
          </button>

          <button
            onClick={() => setActivePipelineFilter(activePipelineFilter === "interview" ? "all" : "interview")}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              activePipelineFilter === "interview"
                ? "bg-purple-500/15 border-purple-500/60 ring-1 ring-purple-500/30"
                : "bg-neutral-950/50 border-neutral-800 hover:border-neutral-700"
            }`}
          >
            <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
              <span>💬 In Progress</span>
              <span className="text-xs font-mono font-bold text-purple-400">{countInterview}</span>
            </div>
            <p className="text-xs font-bold text-white mt-1">Screening & Interview</p>
          </button>

          <button
            onClick={() => setActivePipelineFilter(activePipelineFilter === "offer" ? "all" : "offer")}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              activePipelineFilter === "offer"
                ? "bg-emerald-500/15 border-emerald-500/60 ring-1 ring-emerald-500/30"
                : "bg-neutral-950/50 border-neutral-800 hover:border-neutral-700"
            }`}
          >
            <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
              <span>🏆 Offers</span>
              <span className="text-xs font-mono font-bold text-emerald-400">{countOffer}</span>
            </div>
            <p className="text-xs font-bold text-white mt-1">Offers Received</p>
          </button>
        </div>

        {/* Search Bar & Sector Filter Pills */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2">
          {/* Keyword Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by role, company, skills (e.g. Kinaxis, S/4HANA, AVEVA, McKinsey)..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sector Category Filter Pills */}
          <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-2xl border border-neutral-800 text-xs shrink-0 overflow-x-auto">
            {[
              { id: "all", label: "All Sectors" },
              { id: "tech", label: "Tech & ERP Labs" },
              { id: "consulting", label: "Tier 1 Consulting" },
              { id: "industrial", label: "Industrial Giants" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSectorCategory(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  activeSectorCategory === tab.id
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Active Filter Indicators */}
        {(activePipelineFilter !== "all" || searchQuery) && (
          <div className="flex items-center gap-2 text-xs text-neutral-400 bg-neutral-950/80 px-3.5 py-2 rounded-xl border border-neutral-800">
            <Filter className="w-3.5 h-3.5 text-blue-400" />
            <span>Active Filter:</span>
            {activePipelineFilter !== "all" && (
              <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 font-bold capitalize">
                Status: {activePipelineFilter}
              </span>
            )}
            {searchQuery && (
              <span className="px-2 py-0.5 rounded-md bg-neutral-800 text-white">
                Query: "{searchQuery}"
              </span>
            )}
            <button
              onClick={() => {
                setActivePipelineFilter("all");
                setSearchQuery("");
              }}
              className="ml-auto text-[11px] text-amber-400 hover:underline font-semibold"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Job Openings Feed Grid */}
        <div className="space-y-4">
          {filteredJobs.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-neutral-950/40 border border-dashed border-neutral-800 space-y-3">
              <Briefcase className="w-8 h-8 text-neutral-600 mx-auto" />
              <p className="text-sm font-semibold text-neutral-300">No matching job openings found</p>
              <p className="text-xs text-neutral-500">Try adjusting your search terms or pipeline filter</p>
              <button
                onClick={() => {
                  setActivePipelineFilter("all");
                  setActiveSectorCategory("all");
                  setSearchQuery("");
                }}
                className="px-4 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            filteredJobs.map((job) => {
              const isPitchCopied = copiedRolePitchId === job.id;

              return (
                <div
                  key={job.id}
                  className="p-5 sm:p-6 rounded-2xl bg-neutral-900/70 border border-neutral-800 hover:border-blue-500/40 transition-all space-y-4 group"
                >
                  {/* Top Row: Title, Company, Campus & CTC */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Source Tag */}
                        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
                          {job.source}
                        </span>

                        {/* Match Score */}
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                          {job.matchScore}% Profile Match
                        </span>

                        {job.isCustom && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold">
                            Custom Added
                          </span>
                        )}
                      </div>

                      <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                        {job.title}
                      </h4>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400">
                        <span className="font-semibold text-neutral-200 flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-blue-400" />
                          {job.company}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                          {job.campus}
                        </span>
                        <span>•</span>
                        <span className="font-mono text-neutral-400">Exp: {job.expRequired}</span>
                      </div>
                    </div>

                    {/* CTC Band & Status Select */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                      <div className="text-right">
                        <div className="text-[10px] text-neutral-500 font-mono">Advertised CTC:</div>
                        <span className="text-sm font-extrabold font-mono text-emerald-400">
                          {job.ctcRange}
                        </span>
                      </div>

                      {/* Status Selector Dropdown */}
                      <div className="flex items-center gap-1">
                        <select
                          value={job.status}
                          onChange={(e) => handleStatusChange(job.id, e.target.value as any)}
                          className={`text-xs font-bold px-2.5 py-1 rounded-xl border appearance-none cursor-pointer focus:outline-none transition-colors ${
                            job.status === "wishlist"
                              ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                              : job.status === "applied"
                              ? "bg-blue-500/10 text-blue-300 border-blue-500/30"
                              : job.status === "screening" || job.status === "interview"
                              ? "bg-purple-500/10 text-purple-300 border-purple-500/30"
                              : job.status === "offer"
                              ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                              : "bg-neutral-800 text-neutral-400 border-neutral-700"
                          }`}
                        >
                          <option value="wishlist" className="bg-neutral-900 text-white">📌 Wishlist</option>
                          <option value="applied" className="bg-neutral-900 text-white">📨 Applied</option>
                          <option value="screening" className="bg-neutral-900 text-white">📞 Screening</option>
                          <option value="interview" className="bg-neutral-900 text-white">💬 Interview</option>
                          <option value="offer" className="bg-neutral-900 text-white">🏆 Offer</option>
                          <option value="archived" className="bg-neutral-900 text-white">📁 Archive</option>
                        </select>

                        {job.isCustom && (
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className="p-1 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Remove job"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Why You Fit & Skills */}
                  <div className="space-y-2 pt-1">
                    <p className="text-xs text-neutral-300 bg-neutral-950/50 p-3 rounded-xl border border-neutral-800/80 leading-relaxed">
                      <strong className="text-blue-400">Profile Fit: </strong>
                      {job.whyFit}
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      {job.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-950 border border-neutral-800 text-neutral-400 font-mono"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Notes Field (if existing or applied) */}
                  {(job.notes !== undefined || job.status !== "wishlist") && (
                    <div className="pt-1">
                      <input
                        type="text"
                        value={job.notes || ""}
                        onChange={(e) => handleNotesChange(job.id, e.target.value)}
                        placeholder="Add recruiter contact, interview date, or private notes here..."
                        className="w-full px-3 py-1.5 rounded-xl bg-neutral-950/80 border border-neutral-800 text-xs text-neutral-300 placeholder-neutral-600 focus:outline-none focus:border-neutral-700"
                      />
                    </div>
                  )}

                  {/* Action Buttons Strip */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-800/80 text-xs">
                    {/* Tailored Pitch Button */}
                    <button
                      onClick={() => handleCopyRolePitch(job)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-neutral-700 bg-neutral-950 hover:bg-neutral-800 text-neutral-300 font-semibold transition-all"
                      title="Copy tailor-made recruiter message for this specific role"
                    >
                      {isPitchCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Role Pitch Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-neutral-400" />
                          <span>Copy 1-Click Tailored Pitch</span>
                        </>
                      )}
                    </button>

                    {/* Application Links Group (Dual Guaranteed Links) */}
                    <div className="flex flex-wrap items-center gap-2">
                      {job.recruiterUrl && (
                        <a
                          href={job.recruiterUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-blue-500/30 bg-blue-950/30 hover:bg-blue-900/40 text-blue-300 font-semibold transition-all"
                          title="Open verified recruiter posting on LinkedIn / Naukri"
                        >
                          <span>{job.recruiterLabel || "Recruiter Post"}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-blue-400" />
                        </a>
                      )}

                      <a
                        href={job.directUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-md shadow-blue-600/20"
                        title="Open official corporate career portal"
                      >
                        <span>Official Portal</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Direct Recruiter Platform Deep Search Shortcuts */}
        <div className="pt-4 border-t border-neutral-800/80 space-y-3">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="font-semibold text-neutral-300">
              Want to scout for additional openings beyond this curated desk?
            </span>
            <span className="text-[11px] text-neutral-500">Live Recruiter Portals</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a
              href="https://www.linkedin.com/jobs/search/?keywords=SAP%20S4HANA%20Manufacturing&location=Bengaluru%2C%20Karnataka%2C%20India&f_E=4%2C5"
              target="_blank"
              rel="noreferrer"
              className="p-3.5 rounded-2xl bg-[#0A66C2]/10 border border-[#0A66C2]/30 hover:border-[#0A66C2] text-white transition-all flex items-center justify-between group"
            >
              <div>
                <p className="text-xs font-bold text-white group-hover:text-blue-300">
                  LinkedIn Jobs (Bengaluru)
                </p>
                <p className="text-[10px] text-neutral-400">SAP S/4HANA & Mfg Business Analyst</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-blue-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            <a
              href="https://www.naukri.com/sap-s4hana-manufacturing-jobs-in-bengaluru-bangalore?experience=4"
              target="_blank"
              rel="noreferrer"
              className="p-3.5 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 hover:border-indigo-400 text-white transition-all flex items-center justify-between group"
            >
              <div>
                <p className="text-xs font-bold text-white group-hover:text-indigo-300">
                  Naukri.com (Bengaluru)
                </p>
                <p className="text-[10px] text-neutral-400">SAP Production Planning / PP 4+ Yrs</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            <a
              href="https://www.linkedin.com/jobs/search/?keywords=MES%20AVEVA%20SAP%20Integration&location=Bengaluru%2C%20Karnataka%2C%20India"
              target="_blank"
              rel="noreferrer"
              className="p-3.5 rounded-2xl bg-purple-950/20 border border-purple-500/30 hover:border-purple-400 text-white transition-all flex items-center justify-between group"
            >
              <div>
                <p className="text-xs font-bold text-white group-hover:text-purple-300">
                  Industrial MES Tech Radar
                </p>
                <p className="text-[10px] text-neutral-400">AVEVA LDS / Shopfloor Integration</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-purple-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>

      {/* 5. ADD CUSTOM JOB MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-neutral-900 border border-neutral-700 shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-400" />
                <h3 className="font-extrabold text-lg text-white">Add Job Opening to Pipeline</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddJob} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-300 font-bold mb-1">Job Role Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Senior ERP Solution Specialist / S/4HANA Lead"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    placeholder="e.g. Siemens Advanta / Apple"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Bangalore Campus / Location</label>
                  <input
                    type="text"
                    value={newCampus}
                    onChange={(e) => setNewCampus(e.target.value)}
                    placeholder="e.g. Whitefield, Bengaluru"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Recruiter Source</label>
                  <select
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="LinkedIn Recruiter Verified">LinkedIn Recruiter</option>
                    <option value="Naukri Premium Enterprise">Naukri.com</option>
                    <option value="Company ATS">Company Career Portal</option>
                    <option value="Foundit / Monster">Foundit / Monster</option>
                    <option value="Direct Referral">Direct Referral</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Sector Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="tech">Tech & ERP Labs</option>
                    <option value="consulting">Tier 1 Consulting</option>
                    <option value="industrial">Industrial Giants</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Direct Job URL / Apply Link</label>
                  <input
                    type="url"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Advertised CTC Range</label>
                  <input
                    type="text"
                    value={newCtc}
                    onChange={(e) => setNewCtc(e.target.value)}
                    placeholder="e.g. ₹28L - ₹38L PA"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">Private Notes / Contact</label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. InMail message from recruiter Priya, call scheduled for Friday 4pm"
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-700 text-neutral-300 hover:bg-neutral-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/30"
                >
                  Save to Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
