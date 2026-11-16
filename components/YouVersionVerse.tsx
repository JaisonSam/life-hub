"use client";

import { useMemo } from "react";
import { getDailyScripture } from "@/lib/dailyScripture";

interface YouVersionVerseProps {
  variant?: "showcase" | "ambient";
  customReference?: string;
  customText?: string;
  customTranslation?: string;
}

export default function YouVersionVerse({
  variant = "showcase",
  customReference,
  customText,
  customTranslation,
}: YouVersionVerseProps) {
  const scripture = useMemo(() => {
    const daily = getDailyScripture(new Date());
    return {
      reference: customReference || daily.reference,
      text: customText || daily.text,
      translation: customTranslation || daily.translation,
    };
  }, [customReference, customText, customTranslation]);

  if (variant === "ambient") {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-center px-6 sm:px-12 md:px-20 select-none pointer-events-none">
        <div className="max-w-4xl mx-auto space-y-6">
          <blockquote className="font-serif italic text-lg sm:text-2xl md:text-3xl text-neutral-200/80 leading-relaxed tracking-wide drop-shadow-[0_2px_20px_rgba(0,0,0,0.9)]">
            &ldquo;{scripture.text}&rdquo;
          </blockquote>
          <cite className="block font-sans not-italic text-xs sm:text-sm font-medium tracking-[0.28em] uppercase text-amber-400/75">
            {scripture.reference} &bull; {scripture.translation}
          </cite>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center text-center px-6 sm:px-12 md:px-20 py-10 sm:py-14 bg-gradient-to-b from-[#090a0f] via-[#0d0e15] to-[#08090d] overflow-hidden select-none">
      {/* Soft warm radial glow reminiscent of YouVersion verse displays */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_center,_rgba(245,158,11,0.14)_0%,_rgba(10,11,16,0)_70%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center justify-center">
        {/* Sacred scripture text in elegant serif typography */}
        <blockquote className="font-serif italic text-xl sm:text-2xl md:text-3xl lg:text-[32px] text-[#f8f6f0] leading-relaxed sm:leading-[1.7] tracking-wide drop-shadow-[0_3px_24px_rgba(0,0,0,0.95)]">
          &ldquo;{scripture.text}&rdquo;
        </blockquote>

        {/* Minimal clean reference badge */}
        <div className="mt-6 sm:mt-8 flex items-center justify-center">
          <span className="font-sans text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase text-amber-400/90 drop-shadow-md">
            {scripture.reference}
          </span>
          <span className="mx-2.5 text-neutral-600 font-mono text-xs">&bull;</span>
          <span className="font-sans text-[11px] sm:text-xs tracking-widest uppercase text-neutral-400 font-medium">
            {scripture.translation}
          </span>
        </div>
      </div>
    </div>
  );
}
