"use client";

import React, { useEffect, useRef } from "react";

export default function AnimatedCosmicBackground() {
  const blobRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let currentScroll = 0;
    let requestId: number;

    const handleScroll = () => {
      const newScroll = window.pageYOffset;
      currentScroll = newScroll;

      blobRefs.current.forEach((blob, index) => {
        if (!blob) return;
        const xOffset = Math.sin(newScroll / 180 + index * 0.8) * 120;
        const yOffset = Math.cos(newScroll / 180 + index * 0.8) * 40;
        blob.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        blob.style.transition = "transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)";
      });

      requestId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(requestId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#030014]">
      {/* Ambient Parallax Orbs (EkiZR style customized for Life Hub domains) */}
      <div className="absolute inset-0">
        {/* Amber / Gold Orb: Scripture & Daily Zen Sanctuary (Top Left) */}
        <div
          ref={(el) => { blobRefs.current[0] = el; }}
          className="absolute -top-24 -left-16 w-80 h-80 sm:w-[480px] sm:h-[480px] bg-amber-500/15 rounded-full blur-[140px] mix-blend-screen"
        />

        {/* Indigo / Violet Orb: GMAT Sprint & Career (Top Right) */}
        <div
          ref={(el) => { blobRefs.current[1] = el; }}
          className="absolute top-12 -right-20 w-80 h-80 sm:w-[500px] sm:h-[500px] bg-indigo-600/15 rounded-full blur-[140px] mix-blend-screen"
        />

        {/* Emerald / Teal Orb: Veerakeralapudur Agribusiness (Center Bottom) */}
        <div
          ref={(el) => { blobRefs.current[2] = el; }}
          className="absolute top-[45%] left-[20%] w-72 h-72 sm:w-[420px] sm:h-[420px] bg-emerald-500/10 rounded-full blur-[130px] mix-blend-screen"
        />

        {/* Rose / Violet Orb: YouTube Devotional Sanctuary & Bookshelf (Bottom Right) */}
        <div
          ref={(el) => { blobRefs.current[3] = el; }}
          className="absolute -bottom-24 -right-16 w-80 h-80 sm:w-[460px] sm:h-[460px] bg-purple-600/15 rounded-full blur-[140px] mix-blend-screen"
        />
      </div>

      {/* EkiZR Technical 32px Grid Texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
    </div>
  );
}
