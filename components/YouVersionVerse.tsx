"use client";

import { useState, useMemo } from "react";
import { Copy, Check, ChevronRight, ChevronLeft, Bookmark } from "lucide-react";

export interface BiblePassage {
  reference: string;
  version?: string;
  passage: string[];
}

export const SACRED_PASSAGES: BiblePassage[] = [
  {
    reference: "Romans 8:37–39",
    version: "KJV",
    passage: [
      "Nay, in all these things we are more than conquerors through him that loved us.",
      "For I am persuaded, that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come, nor height, nor depth, nor any other creature, shall be able to separate us from the love of God, which is in Christ Jesus our Lord.",
    ],
  },
  {
    reference: "Psalm 23:1–4",
    version: "KJV",
    passage: [
      "The Lord is my shepherd; I shall not want. He maketh me to lie down in green pastures: he leadeth me beside the still waters. He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake.",
      "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.",
    ],
  },
  {
    reference: "Isaiah 40:28–31",
    version: "KJV",
    passage: [
      "Hast thou not known? hast thou not heard, that the everlasting God, the Lord, the Creator of the ends of the earth, fainteth not, neither is weary? there is no searching of his understanding. He giveth power to the faint; and to them that have no might he increaseth strength.",
      "Even the youths shall faint and be weary, and the young men shall utterly fall: but they that wait upon the Lord shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.",
    ],
  },
  {
    reference: "Psalm 46:1–2, 10",
    version: "KJV",
    passage: [
      "God is our refuge and strength, a very present help in trouble. Therefore will not we fear, though the earth be removed, and though the mountains be carried into the midst of the sea.",
      "Be still, and know that I am God: I will be exalted among the nations, I will be exalted in the earth.",
    ],
  },
  {
    reference: "Philippians 4:6–8",
    version: "KJV",
    passage: [
      "Be careful for nothing; but in every thing by prayer and petition with thanksgiving let your requests be made known unto God. And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.",
      "Finally, brethren, whatsoever things are true, whatsoever things are honest, whatsoever things are just, whatsoever things are pure, whatsoever things are lovely, whatsoever things are of good report; if there be any virtue, and if there be any praise, think on these things.",
    ],
  },
  {
    reference: "Proverbs 3:5–6",
    version: "KJV",
    passage: [
      "Trust in the Lord with all thine heart; and lean not unto thine own understanding.",
      "In all thy ways acknowledge him, and he shall direct thy paths.",
    ],
  },
  {
    reference: "Joshua 1:9",
    version: "KJV",
    passage: [
      "Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the Lord thy God is with thee whithersoever thou goest.",
    ],
  },
];

interface YouVersionVerseProps {
  variant?: "showcase" | "ambient";
}

export default function YouVersionVerse({
  variant = "showcase",
}: YouVersionVerseProps) {
  const initialIndex = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    return dayOfYear % SACRED_PASSAGES.length;
  }, []);

  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const [copied, setCopied] = useState<boolean>(false);

  const selectedPassage = SACRED_PASSAGES[currentIndex] || SACRED_PASSAGES[0];

  const handleCopy = () => {
    const text = `"${selectedPassage.passage.join(" ")}" — ${selectedPassage.reference} (${selectedPassage.version || "KJV"})`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % SACRED_PASSAGES.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + SACRED_PASSAGES.length) % SACRED_PASSAGES.length);
  };

  if (variant === "ambient") {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-center px-6 sm:px-12 md:px-20 select-none pointer-events-none">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="space-y-3">
            {selectedPassage.passage.map((p, idx) => (
              <p
                key={idx}
                className="font-sans font-semibold text-base sm:text-xl md:text-2xl text-neutral-100/80 leading-relaxed tracking-normal not-italic drop-shadow-[0_2px_14px_rgba(0,0,0,0.9)]"
              >
                {p}
              </p>
            ))}
          </div>
          <cite className="block font-sans not-italic text-xs sm:text-sm font-bold tracking-[0.25em] uppercase text-neutral-400 pt-2">
            {selectedPassage.reference}
          </cite>
        </div>
      </div>
    );
  }

  // Showcase mode: modeled cleanly after the YouVersion Verse of the Day (Clean, Modern, Non-Cursive)
  return (
    <div className="relative w-full h-full min-h-[340px] sm:min-h-[420px] md:min-h-[480px] flex flex-col items-center justify-between text-center px-6 sm:px-12 md:px-16 py-8 sm:py-12 bg-gradient-to-b from-[#0f1118] via-[#12141e] to-[#0c0d14] overflow-hidden select-none">
      {/* Soft ambient background glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.08)_0%,_rgba(10,11,16,0)_75%)]"
        aria-hidden="true"
      />

      {/* Top Header: YouVersion-inspired Verse of the Day badge */}
      <div className="relative z-10 w-full flex items-center justify-between max-w-4xl border-b border-white/5 pb-3 sm:pb-4 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-neutral-800 border border-neutral-700/60 flex items-center justify-center text-neutral-300">
            <Bookmark className="w-3.5 h-3.5 fill-neutral-300" />
          </div>
          <span className="font-sans text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-neutral-300">
            Verse of the Day
          </span>
        </div>

        {/* Copy and Navigation Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-800/90 hover:bg-neutral-700/90 text-neutral-300 hover:text-white border border-neutral-700/60 text-xs font-sans transition-all cursor-pointer"
            title="Copy verse"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-[11px] font-semibold text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-neutral-400" />
                <span className="text-[11px] font-medium">Copy</span>
              </>
            )}
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              className="p-1 rounded-full bg-neutral-800/90 hover:bg-neutral-700 text-neutral-400 hover:text-white border border-neutral-700/60 transition-all cursor-pointer"
              title="Previous verse"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleNext}
              className="p-1 rounded-full bg-neutral-800/90 hover:bg-neutral-700 text-neutral-400 hover:text-white border border-neutral-700/60 transition-all cursor-pointer"
              title="Next verse"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Scripture: High-contrast, clean modern sans-serif (STRICTLY NON-CURSIVE) */}
      <div className="relative z-10 max-w-3xl mx-auto my-auto py-4 sm:py-6 flex flex-col items-center justify-center space-y-4">
        {selectedPassage.passage.map((p, idx) => (
          <p
            key={idx}
            className="font-sans font-semibold sm:font-bold text-lg sm:text-2xl md:text-3xl text-neutral-100 leading-snug sm:leading-relaxed md:leading-normal tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] not-italic"
          >
            {p}
          </p>
        ))}
      </div>

      {/* Reference & Translation Pill */}
      <div className="relative z-10 pt-2 sm:pt-4 flex items-center justify-center gap-2">
        <span className="font-sans text-xs sm:text-sm font-bold tracking-[0.25em] uppercase text-neutral-300 bg-neutral-900/90 border border-neutral-800 px-4 py-1.5 rounded-full shadow-lg">
          {selectedPassage.reference}
          {selectedPassage.version && (
            <span className="text-neutral-500 ml-1.5 font-normal">
              • {selectedPassage.version}
            </span>
          )}
        </span>
      </div>
    </div>
  );
}
