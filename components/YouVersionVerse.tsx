"use client";

import { useMemo } from "react";

export interface BiblePassage {
  reference: string;
  passage: string[];
}

export const SACRED_PASSAGES: BiblePassage[] = [
  {
    reference: "Romans 8:37–39",
    passage: [
      "Nay, in all these things we are more than conquerors through him that loved us.",
      "For I am persuaded, that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come, nor height, nor depth, nor any other creature, shall be able to separate us from the love of God, which is in Christ Jesus our Lord.",
    ],
  },
  {
    reference: "Psalm 23:1–4",
    passage: [
      "The Lord is my shepherd; I shall not want. He maketh me to lie down in green pastures: he leadeth me beside the still waters. He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake.",
      "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.",
    ],
  },
  {
    reference: "Isaiah 40:28–31",
    passage: [
      "Hast thou not known? hast thou not heard, that the everlasting God, the Lord, the Creator of the ends of the earth, fainteth not, neither is weary? there is no searching of his understanding. He giveth power to the faint; and to them that have no might he increaseth strength.",
      "Even the youths shall faint and be weary, and the young men shall utterly fall: but they that wait upon the Lord shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.",
    ],
  },
  {
    reference: "Psalm 46:1–2, 10",
    passage: [
      "God is our refuge and strength, a very present help in trouble. Therefore will not we fear, though the earth be removed, and though the mountains be carried into the midst of the sea.",
      "Be still, and know that I am God: I will be exalted among the nations, I will be exalted in the earth.",
    ],
  },
  {
    reference: "Philippians 4:6–8",
    passage: [
      "Be careful for nothing; but in every thing by prayer and petition with thanksgiving let your requests be made known unto God. And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.",
      "Finally, brethren, whatsoever things are true, whatsoever things are honest, whatsoever things are just, whatsoever things are pure, whatsoever things are lovely, whatsoever things are of good report; if there be any virtue, and if there be any praise, think on these things.",
    ],
  },
];

interface YouVersionVerseProps {
  variant?: "showcase" | "ambient";
}

export default function YouVersionVerse({
  variant = "showcase",
}: YouVersionVerseProps) {
  const selectedPassage = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    return SACRED_PASSAGES[dayOfYear % SACRED_PASSAGES.length];
  }, []);

  if (variant === "ambient") {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-center px-6 sm:px-12 md:px-20 select-none pointer-events-none">
        <div className="max-w-4xl mx-auto space-y-5">
          <div className="space-y-4">
            {selectedPassage.passage.map((p, idx) => (
              <p
                key={idx}
                className="font-serif italic text-base sm:text-xl md:text-2xl text-neutral-200/75 leading-relaxed sm:leading-loose tracking-wide drop-shadow-[0_2px_18px_rgba(0,0,0,0.9)]"
              >
                &ldquo;{p}&rdquo;
              </p>
            ))}
          </div>
          <cite className="block font-sans not-italic text-xs sm:text-sm font-medium tracking-[0.3em] uppercase text-neutral-400 pt-2">
            {selectedPassage.reference}
          </cite>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center text-center px-6 sm:px-12 md:px-20 py-12 sm:py-16 bg-gradient-to-b from-[#090a0f] via-[#0d0e15] to-[#08090d] overflow-hidden select-none">
      {/* Soft monochrome ambient backlight */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.08)_0%,_rgba(10,11,16,0)_70%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center justify-center space-y-6 sm:space-y-7">
        {/* Sacred scripture passage in elegant YouVersion serif typography */}
        <div className="space-y-4">
          {selectedPassage.passage.map((p, idx) => (
            <p
              key={idx}
              className="font-serif italic text-lg sm:text-2xl md:text-3xl text-[#f8f6f0] leading-relaxed sm:leading-[1.75] tracking-wide drop-shadow-[0_3px_24px_rgba(0,0,0,0.95)]"
            >
              &ldquo;{p}&rdquo;
            </p>
          ))}
        </div>

        {/* Minimal clean reference badge - no devotion heading, no noise */}
        <div className="pt-2 flex items-center justify-center">
          <span className="font-sans text-xs sm:text-sm font-semibold tracking-[0.32em] uppercase text-neutral-300 drop-shadow-md">
            {selectedPassage.reference}
          </span>
        </div>
      </div>
    </div>
  );
}
