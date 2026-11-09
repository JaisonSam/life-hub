"use client";

import React, { useState } from "react";
import {
  Sparkles,
  ExternalLink,
  BookOpen,
  RefreshCw,
  BookmarkPlus,
  Check,
  Compass,
  Lightbulb,
  Globe,
  Quote,
  Flame,
} from "lucide-react";
import {
  dailyStrategicRecommendations,
  dailyAeonEssays,
  getDayOfYearIndex,
  StrategicRecommendation,
  AeonEssay,
} from "@/lib/readingDigest";

interface DailyRecommendationsDeckProps {
  onSaveToCommonplace: (
    title: string,
    author: string,
    category: string,
    mentalModel: string,
    quote: string,
    takeaway: string
  ) => void;
}

export default function DailyRecommendationsDeck({
  onSaveToCommonplace,
}: DailyRecommendationsDeckProps) {
  const [recOffset, setRecOffset] = useState(0);
  const [aeonOffset, setAeonOffset] = useState(0);
  const [savedToast, setSavedToast] = useState<string | null>(null);

  const currentRecIdx = getDayOfYearIndex(dailyStrategicRecommendations.length, recOffset);
  const currentAeonIdx = getDayOfYearIndex(dailyAeonEssays.length, aeonOffset);

  const currentRec: StrategicRecommendation = dailyStrategicRecommendations[currentRecIdx];
  const currentAeon: AeonEssay = dailyAeonEssays[currentAeonIdx];

  const handleSaveRec = () => {
    onSaveToCommonplace(
      currentRec.title,
      currentRec.author,
      currentRec.category === "Finance & Capital" ? "Macroeconomics" : "Systems Thinking",
      currentRec.mentalModel,
      currentRec.keyInsight,
      `From ${currentRec.source} (${currentRec.author}). Key framework: ${currentRec.mentalModel}`
    );
    setSavedToast(`Saved "${currentRec.title}" to Commonplace Notebook!`);
    setTimeout(() => setSavedToast(null), 3000);
  };

  const handleSaveAeon = () => {
    onSaveToCommonplace(
      currentAeon.title,
      currentAeon.author,
      "Executive Strategy",
      currentAeon.coreQuestion,
      currentAeon.keyExcerpt,
      `Aeon Essay by ${currentAeon.author} (${currentAeon.authorRole}). Core Inquiry: ${currentAeon.coreQuestion}`
    );
    setSavedToast(`Saved Aeon Essay to Commonplace Notebook!`);
    setTimeout(() => setSavedToast(null), 3000);
  };

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {savedToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-emerald-950 border border-emerald-500 text-emerald-200 px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-2xl animate-in zoom-in-95 duration-150">
          <Check className="w-4 h-4 text-emerald-400" />
          {savedToast}
        </div>
      )}

      {/* Grid of Two Daily Spotlights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 1. DAILY STRATEGIC READ FROM TOP INTELLECTUAL SOURCE */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950/30 via-neutral-900 to-neutral-950 border border-indigo-500/30 shadow-2xl flex flex-col justify-between space-y-4 relative overflow-hidden group hover:border-indigo-500/50 transition-all">
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-3 relative z-10">
            {/* Header row */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${currentRec.sourceBadgeColor}`}
                >
                  {currentRec.source}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 font-mono">
                  {currentRec.readTime}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Daily Strategic Read
                </span>
                <button
                  onClick={() => setRecOffset((prev) => prev + 1)}
                  className="p-1 rounded-lg border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800/60 transition-colors"
                  title="Next Recommendation"
                >
                  <RefreshCw className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Title & Author */}
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white group-hover:text-indigo-300 transition-colors leading-snug">
                {currentRec.title}
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">by {currentRec.author}</p>
            </div>

            {/* Mental Model Ribbon */}
            <div className="p-2.5 rounded-xl bg-neutral-950/80 border border-indigo-500/20 text-xs flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                  Core Model:{" "}
                </span>
                <span className="font-bold text-white text-xs">{currentRec.mentalModel}</span>
              </div>
            </div>

            {/* Key Quote / Insight */}
            <blockquote className="text-xs text-neutral-300 italic border-l-2 border-indigo-500/60 pl-3 leading-relaxed">
              "{currentRec.keyInsight}"
            </blockquote>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-neutral-800/80 gap-2 relative z-10 text-xs">
            <button
              onClick={handleSaveRec}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-800 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white font-semibold transition-all shadow-sm"
              title="Save key insight to Commonplace Notebook"
            >
              <BookmarkPlus className="w-3.5 h-3.5 text-indigo-400" />
              <span>Capture to Notes</span>
            </button>

            <a
              href={currentRec.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-md shadow-indigo-600/30"
            >
              <span>Read Essay</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* 2. DAILY AEON ESSAY RECOMMENDATION */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-950/30 via-neutral-900 to-neutral-950 border border-purple-500/30 shadow-2xl flex flex-col justify-between space-y-4 relative overflow-hidden group hover:border-purple-500/50 transition-all">
          <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-3 relative z-10">
            {/* Header row */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-rose-500/10 text-rose-300 border border-rose-500/20">
                  Aeon Magazine
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 font-mono">
                  {currentAeon.readTime}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Compass className="w-3 h-3 text-purple-400" />
                  Philosophy Spotlight
                </span>
                <button
                  onClick={() => setAeonOffset((prev) => prev + 1)}
                  className="p-1 rounded-lg border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800/60 transition-colors"
                  title="Next Aeon Essay"
                >
                  <RefreshCw className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Title & Author */}
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white group-hover:text-purple-300 transition-colors leading-snug">
                {currentAeon.title}
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                by {currentAeon.author}{" "}
                <span className="text-[10px] text-neutral-500">({currentAeon.authorRole})</span>
              </p>
            </div>

            {/* Core Philosophical Dilemma */}
            <div className="p-2.5 rounded-xl bg-neutral-950/80 border border-purple-500/20 text-xs flex items-center gap-2">
              <Quote className="w-4 h-4 text-purple-400 shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                  The Inquiry:{" "}
                </span>
                <span className="text-neutral-200 text-xs italic">{currentAeon.coreQuestion}</span>
              </div>
            </div>

            {/* Key Excerpt */}
            <blockquote className="text-xs text-neutral-300 italic border-l-2 border-purple-500/60 pl-3 leading-relaxed line-clamp-3">
              "{currentAeon.keyExcerpt}"
            </blockquote>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-neutral-800/80 gap-2 relative z-10 text-xs">
            <button
              onClick={handleSaveAeon}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-800 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white font-semibold transition-all shadow-sm"
              title="Save philosophical insight to Commonplace Notebook"
            >
              <BookmarkPlus className="w-3.5 h-3.5 text-purple-400" />
              <span>Capture to Notes</span>
            </button>

            <a
              href={currentAeon.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold transition-all shadow-md shadow-purple-600/30"
            >
              <span>Read on Aeon</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
