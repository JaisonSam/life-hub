"use client";

import React, { useState } from "react";
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
} from "lucide-react";

export default function CareerBrandHub() {
  const [copiedPitch, setCopiedPitch] = useState(false);
  const [activeEmployerCategory, setActiveEmployerCategory] = useState<"all" | "tech" | "consulting" | "industrial">("all");

  const elevatorPitch = `Hi, I'm Jaison Shanmugiah — a Senior ERP Business Analyst with 4.3+ years of experience leading multi-site SAP S/4HANA transformations and AVEVA LDS / MES manufacturing execution integrations for Schneider Electric across 6 European plants. Holding a B.Tech in Production Engineering from NIT Calicut (CGPA 8.47), I bridge high-level enterprise architecture with shop-floor production order flow to eliminate bottlenecks and stabilize concurrent go-lives.`;

  const handleCopyPitch = () => {
    navigator.clipboard.writeText(elevatorPitch);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 3000);
  };

  const bangaloreEmployers = [
    {
      id: "sap-labs",
      name: "SAP Labs India",
      campus: "Whitefield, Bengaluru",
      category: "tech",
      role: "Senior Solution Specialist / Product Expert — S/4HANA Manufacturing",
      typicalCtc: "₹28L - ₹42L",
      experience: "4 - 7 years",
      relevance: "Direct engineering on core S/4HANA Production Planning (PP) & Digital Supply Chain codebase.",
      link: "https://www.linkedin.com/jobs/search/?keywords=SAP%20Labs%20S4HANA%20Manufacturing&location=Bengaluru%2C%20Karnataka%2C%20India",
    },
    {
      id: "mckinsey",
      name: "McKinsey & Company (McKinsey Digital)",
      campus: "MG Road / UB City, Bengaluru",
      category: "consulting",
      role: "Senior Specialist / Associate — Operations & Enterprise Cloud",
      typicalCtc: "₹34L - ₹52L",
      experience: "4 - 8 years",
      relevance: "Advising Fortune 500 manufacturing CEOs on S/4HANA transformations and operational efficiency.",
      link: "https://www.linkedin.com/jobs/search/?keywords=McKinsey%20Enterprise%20ERP%20Operations&location=Bengaluru%2C%20Karnataka%2C%20India",
    },
    {
      id: "deloitte",
      name: "Deloitte India / USI",
      campus: "Prestige Tech Park, Outer Ring Road, Bengaluru",
      category: "consulting",
      role: "Manager / Lead Consultant — SAP S/4HANA Manufacturing Transformation",
      typicalCtc: "₹25L - ₹38L",
      experience: "4 - 7 years",
      relevance: "Global plant rollouts and integration between SAP S/4HANA and shop-floor MES platforms.",
      link: "https://www.linkedin.com/jobs/search/?keywords=Deloitte%20SAP%20S4HANA%20Manufacturing&location=Bengaluru%2C%20Karnataka%2C%20India",
    },
    {
      id: "siemens",
      name: "Siemens Technology India",
      campus: "Electronic City, Bengaluru",
      category: "industrial",
      role: "Lead Digital Enterprise Consultant — Smart Factory & S/4HANA MES",
      typicalCtc: "₹24L - ₹36L",
      experience: "4 - 7 years",
      relevance: "Industrial automation synergy: AVEVA/Siemens MES to enterprise S/4HANA supply chain.",
      link: "https://www.linkedin.com/jobs/search/?keywords=Siemens%20MES%20SAP%20S4HANA&location=Bengaluru%2C%20Karnataka%2C%20India",
    },
    {
      id: "bosch",
      name: "Bosch Global Software Technologies (BGSW)",
      campus: "Adugodi / Koramangala, Bengaluru",
      category: "industrial",
      role: "Senior ERP Solutions Architect — Smart Manufacturing & IIoT",
      typicalCtc: "₹24L - ₹35L",
      experience: "4 - 8 years",
      relevance: "Automotive and industrial production order flow optimization on multi-site global ERP templates.",
      link: "https://www.linkedin.com/jobs/search/?keywords=Bosch%20SAP%20S4HANA%20Manufacturing&location=Bengaluru%2C%20Karnataka%2C%20India",
    },
    {
      id: "honeywell",
      name: "Honeywell Technology Solutions",
      campus: "Devarabisanahalli, Bengaluru",
      category: "industrial",
      role: "Lead Business Analyst — Connected Enterprise & Global ERP",
      typicalCtc: "₹22L - ₹33L",
      experience: "4 - 7 years",
      relevance: "Deep shopfloor analytics, warehouse management, and enterprise integration governance.",
      link: "https://www.linkedin.com/jobs/search/?keywords=Honeywell%20ERP%20Business%20Analyst&location=Bengaluru%2C%20Karnataka%2C%20India",
    },
    {
      id: "accenture",
      name: "Accenture Strategy & Consulting",
      campus: "Bellandur / SEZ, Bengaluru",
      category: "consulting",
      role: "Supply Chain & Operations Strategy Consultant (S/4HANA)",
      typicalCtc: "₹26L - ₹40L",
      experience: "4 - 7 years",
      relevance: "End-to-end supply chain planning (Kinaxis + S/4HANA) for global discrete manufacturing clients.",
      link: "https://www.linkedin.com/jobs/search/?keywords=Accenture%20Supply%20Chain%20SAP%20S4HANA&location=Bengaluru%2C%20Karnataka%2C%20India",
    },
    {
      id: "schneider",
      name: "Schneider Electric (Global Hub Bengaluru)",
      campus: "Attibele / Bagmane Tech Park, Bengaluru",
      category: "industrial",
      role: "Principal Solution Architect / Senior Delivery Lead — Global ERP",
      typicalCtc: "₹28L - ₹42L",
      experience: "4 - 8 years",
      relevance: "Direct internal promotion trajectory across the European & BeNeDACH deployment programs.",
      link: "https://www.linkedin.com/jobs/search/?keywords=Schneider%20Electric%20SAP%20Architect&location=Bengaluru%2C%20Karnataka%2C%20India",
    },
  ];

  const filteredEmployers = bangaloreEmployers.filter((emp) => {
    if (activeEmployerCategory === "all") return true;
    return emp.category === activeEmployerCategory;
  });

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
              {/* LinkedIn SVG */}
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
                  <span className="text-emerald-400">Pitch Copied!</span>
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
          { label: "Workforce Impact", value: "2,500+", sub: "Personnel supported", color: "text-emerald-400" },
          { label: "Data Archival", value: "1 TB", sub: "Production order data archived", color: "text-amber-400" },
          { label: "Ales Go-Live", value: "3-4 / 1,000", sub: "Locked orders fixed on-site", color: "text-purple-400" },
          { label: "Governance Volume", value: "195+", sub: "145 SRs + 50 Incidents resolved", color: "text-rose-400" },
          { label: "Attibele Plant", value: "20% Cut", sub: "Workload saved via Tableau", color: "text-teal-400" },
        ].map((stat, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 text-center space-y-1">
            <span className={`text-xl sm:text-2xl font-extrabold font-mono ${stat.color}`}>
              {stat.value}
            </span>
            <p className="text-xs font-bold text-white leading-tight">{stat.label}</p>
            <p className="text-[10px] text-neutral-400 leading-tight">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* 3. CORE ARCHITECTURAL COMPETENCIES */}
      <div className="p-6 rounded-3xl bg-neutral-950/80 border border-neutral-800 space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-400" />
            <h3 className="font-extrabold text-base text-white">
              Enterprise Solution Architecture & Technical Depth
            </h3>
          </div>
          <span className="text-[10px] text-neutral-400 font-mono">
            Bridging Production Engineering & SAP Core
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 font-mono">
              Core Enterprise Platform
            </span>
            <h4 className="font-bold text-sm text-white">SAP S/4HANA & PP</h4>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Multi-site deployment templates, SAP Production Planning (PP), BeNeDACH EHP 8.0 upgrade, Quality Level reset solutions, and MDG/PIM enterprise data alignment.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
              Shopfloor Execution
            </span>
            <h4 className="font-bold text-sm text-white">AVEVA LDS & PMS MES</h4>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Industrial IoT connectivity, production order confirmation processing into S/4HANA, Stezzano Italy deployment, and delayed Automatic Goods Receipt stabilization.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 font-mono">
              Supply Chain & Analytics
            </span>
            <h4 className="font-bold text-sm text-white">Kinaxis & Tableau Dashboards</h4>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Kinaxis integration governance, Tableau plant visibility dashboards (cut Attibele warehouse manual effort by 20%), and 1 TB historical data lifecycle archiving.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono">
              Engineering Rigor
            </span>
            <h4 className="font-bold text-sm text-white">NIT Calicut Production Eng</h4>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Deep understanding of manufacturing bottlenecks, lean digitization dependencies, cycle time constraints, and multi-plant hypercare P1 incident triage.
            </p>
          </div>
        </div>
      </div>

      {/* 4. BANGALORE JOB MARKET RADAR & 1-CLICK LAUNCHERS */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-neutral-900 to-neutral-950 border border-blue-500/25 shadow-2xl space-y-6">
        {/* Radar Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-white tracking-tight">
                  Bengaluru Job Openings Radar & Market Connectors
                </h3>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold font-mono">
                  Live Bangalore Market
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Direct search queries and verified employer openings matching your SAP S/4HANA & Digital Manufacturing profile
              </p>
            </div>
          </div>

          {/* Salary Benchmark Pill */}
          <div className="p-2.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 flex items-center gap-3 text-xs">
            <span className="text-neutral-400 text-[11px]">Bangalore Market Range (4-7 yrs):</span>
            <span className="font-bold text-emerald-400 font-mono">₹24L - ₹42L PA</span>
          </div>
        </div>

        {/* 1-Click Search Launchers Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* LinkedIn Deep Search */}
          <a
            href="https://www.linkedin.com/jobs/search/?keywords=SAP%20S4HANA%20Manufacturing&location=Bengaluru%2C%20Karnataka%2C%20India&f_E=4%2C5"
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-2xl bg-[#0A66C2]/10 border border-[#0A66C2]/30 hover:border-[#0A66C2] text-white transition-all flex items-center justify-between group"
          >
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">
                LinkedIn Jobs (Bengaluru)
              </span>
              <p className="text-xs font-bold text-white group-hover:text-blue-300">
                SAP S/4HANA Manufacturing & BA
              </p>
              <p className="text-[10px] text-neutral-400">Pre-filtered: Bengaluru • Mid-Senior Level</p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-blue-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>

          {/* Naukri.com Deep Search */}
          <a
            href="https://www.naukri.com/sap-s4hana-manufacturing-jobs-in-bengaluru-bangalore?experience=4"
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 hover:border-indigo-400 text-white transition-all flex items-center justify-between group"
          >
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                Naukri.com (Bengaluru)
              </span>
              <p className="text-xs font-bold text-white group-hover:text-indigo-300">
                SAP Production Planning / S/4HANA
              </p>
              <p className="text-[10px] text-neutral-400">Pre-filtered: Bangalore • 4+ Years Experience</p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>

          {/* MES & Digital Supply Chain Radar */}
          <a
            href="https://www.linkedin.com/jobs/search/?keywords=MES%20AVEVA%20SAP%20Integration&location=Bengaluru%2C%20Karnataka%2C%20India"
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 hover:border-purple-400 text-white transition-all flex items-center justify-between group sm:col-span-2 lg:col-span-1"
          >
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">
                Industrial Tech Radar
              </span>
              <p className="text-xs font-bold text-white group-hover:text-purple-300">
                AVEVA LDS / MES Integration Lead
              </p>
              <p className="text-[10px] text-neutral-400">Smart Factory & Shopfloor-to-Cloud</p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-purple-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        {/* Category Filter Pills for Employers */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-amber-400" />
            Top Hiring Organizations in Bangalore ({filteredEmployers.length})
          </span>

          <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl text-xs border border-neutral-800">
            {[
              { id: "all", label: "All" },
              { id: "tech", label: "Tech Core" },
              { id: "consulting", label: "Tier 1 Consulting" },
              { id: "industrial", label: "Industrial Giants" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveEmployerCategory(tab.id as any)}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  activeEmployerCategory === tab.id
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bangalore Openings Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredEmployers.map((emp) => (
            <div
              key={emp.id}
              className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-blue-500/40 transition-all flex flex-col justify-between space-y-3 group hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-950/20"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-extrabold text-sm text-white group-hover:text-blue-300 transition-colors">
                      {emp.name}
                    </h4>
                    <p className="text-[10px] text-neutral-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-neutral-500" />
                      {emp.campus}
                    </p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold shrink-0">
                    {emp.typicalCtc}
                  </span>
                </div>

                <div className="pt-1">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Target Role:</span>
                  <p className="text-xs font-semibold text-neutral-200 leading-snug">{emp.role}</p>
                </div>

                <p className="text-[11px] text-neutral-400 leading-relaxed bg-neutral-950/50 p-2.5 rounded-xl border border-neutral-800/60">
                  {emp.relevance}
                </p>
              </div>

              <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                <span className="text-[10px] text-neutral-500 font-mono">Exp: {emp.experience}</span>
                <a
                  href={emp.link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-[11px] font-bold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <span>Search Jobs</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
