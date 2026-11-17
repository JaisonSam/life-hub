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
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#181920] border border-neutral-700 text-neutral-200 px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-2xl animate-in zoom-in-95 duration-150 font-mono">
          <Check className="w-4 h-4 text-white" />
          {savedToast}
        </div>
      )}

      {/* Grid of Two Daily Spotlights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 1. DAILY STRATEGIC READ FROM TOP INTELLECTUAL SOURCE */}
        <div className="p-6 rounded-2xl bg-[#14151b] border border-[#232530] shadow-lg flex flex-col justify-between space-y-4 relative overflow-hidden group hover:border-neutral-500 transition-all">
          <div className="space-y-3 relative z-10">
            {/* Header row */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-mono">
                <span
                  className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-[#181920] border border-[#262834] text-white"
                >
                  {currentRec.source}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#181920] text-[#8b91a0] border border-[#262834]">
                  {currentRec.readTime}
                </span>
              </div>

              <div className="flex items-center gap-1.5 font-mono">
                <span className="text-[10px] text-white font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-white" />
                  Daily Strategic Read
                </span>
                <button
                  onClick={() => setRecOffset((prev) => prev + 1)}
                  className="p-1 rounded-lg border border-[#262834] bg-[#181920] text-neutral-400 hover:text-white hover:bg-[#20222a] transition-colors"
                  title="Next Recommendation"
                >
                  <RefreshCw className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Title & Author */}
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white group-hover:text-neutral-200 transition-colors leading-snug">
                {currentRec.title}
              </h3>
              <p className="text-xs text-[#8b91a0] mt-0.5">by {currentRec.author}</p>
            </div>

            {/* Mental Model Ribbon */}
            <div className="p-2.5 rounded-xl bg-[#181920] border border-[#262834] text-xs flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-white shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold text-[#8b91a0] tracking-wider font-mono">
                  Core Model:{" "}
                </span>
                <span className="font-bold text-white text-xs font-mono">{currentRec.mentalModel}</span>
              </div>
            </div>

            {/* Key Quote / Insight */}
            <blockquote className="text-xs text-neutral-300 italic border-l-2 border-neutral-600 pl-3 leading-relaxed">
              "{currentRec.keyInsight}"
            </blockquote>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-[#262834] gap-2 relative z-10 text-xs font-mono">
            <button
              onClick={handleSaveRec}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#262834] bg-[#181920] hover:bg-[#222430] text-neutral-300 hover:text-white font-semibold transition-all shadow-sm"
              title="Save key insight to Commonplace Notebook"
            >
              <BookmarkPlus className="w-3.5 h-3.5 text-white" />
              <span>Capture to Notes</span>
            </button>

            <a
              href={currentRec.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-white hover:bg-neutral-200 text-black font-bold transition-all shadow-sm"
            >
              <span>Read Essay</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* 2. DAILY AEON ESSAY RECOMMENDATION */}
        <div className="p-6 rounded-2xl bg-[#14151b] border border-[#232530] shadow-lg flex flex-col justify-between space-y-4 relative overflow-hidden group hover:border-neutral-500 transition-all">
          <div className="space-y-3 relative z-10">
            {/* Header row */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-mono">
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-[#181920] text-rose-300 border border-[#262834]">
                  Aeon Magazine
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#181920] text-[#8b91a0] border border-[#262834]">
                  {currentAeon.readTime}
                </span>
              </div>

              <div className="flex items-center gap-1.5 font-mono">
                <span className="text-[10px] text-white font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Compass className="w-3 h-3 text-white" />
                  Philosophy Spotlight
                </span>
                <button
                  onClick={() => setAeonOffset((prev) => prev + 1)}
                  className="p-1 rounded-lg border border-[#262834] bg-[#181920] text-neutral-400 hover:text-white hover:bg-[#20222a] transition-colors"
                  title="Next Aeon Essay"
                >
                  <RefreshCw className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Title & Author */}
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white group-hover:text-neutral-200 transition-colors leading-snug">
                {currentAeon.title}
              </h3>
              <p className="text-xs text-[#8b91a0] mt-0.5">
                by {currentAeon.author}{" "}
                <span className="text-[10px] text-neutral-500">({currentAeon.authorRole})</span>
              </p>
            </div>

            {/* Core Philosophical Dilemma */}
            <div className="p-2.5 rounded-xl bg-[#181920] border border-[#262834] text-xs flex items-center gap-2">
              <Quote className="w-4 h-4 text-white shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold text-[#8b91a0] tracking-wider font-mono">
                  The Inquiry:{" "}
                </span>
                <span className="text-neutral-200 text-xs italic">{currentAeon.coreQuestion}</span>
              </div>
            </div>

            {/* Key Excerpt */}
            <blockquote className="text-xs text-neutral-300 italic border-l-2 border-neutral-600 pl-3 leading-relaxed line-clamp-3">
              "{currentAeon.keyExcerpt}"
            </blockquote>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-[#262834] gap-2 relative z-10 text-xs font-mono">
            <button
              onClick={handleSaveAeon}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#262834] bg-[#181920] hover:bg-[#222430] text-neutral-300 hover:text-white font-semibold transition-all shadow-sm"
              title="Save philosophical insight to Commonplace Notebook"
            >
              <BookmarkPlus className="w-3.5 h-3.5 text-white" />
              <span>Capture to Notes</span>
            </button>

            <a
              href={currentAeon.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-white hover:bg-neutral-200 text-black font-bold transition-all shadow-sm"
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
