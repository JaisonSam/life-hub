"use client";

import { useState, useEffect } from "react";

export default function WelcomeIntro() {
  const [stage, setStage] = useState<"start" | "enter" | "fade" | "done">("start");

  useEffect(() => {
    // Lock scrolling while full-screen black intro is active
    try {
      document.body.style.overflow = "hidden";
    } catch {}

    // Trigger smooth enter animation right after mount
    const enterTimer = setTimeout(() => {
      setStage("enter");
    }, 40);

    // After 2 seconds, begin fading out the black veil to reveal the homescreen
    const fadeTimer = setTimeout(() => {
      setStage("fade");
      try {
        document.body.style.overflow = "";
      } catch {}
    }, 2000);

    // After fade completes (2000ms + 750ms = 2750ms), unmount completely
    const doneTimer = setTimeout(() => {
      setStage("done");
    }, 2750);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
      try {
        document.body.style.overflow = "";
      } catch {}
    };
  }, []);

  if (stage === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] bg-black flex items-center justify-center transition-opacity duration-700 ease-out select-none ${
        stage === "fade" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
        backgroundColor: "#000000",
      }}
      aria-hidden="true"
    >
      {/* Subtle warm ambient glow in the center */}
      <div
        className={`absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-amber-400/10 blur-3xl pointer-events-none transition-all duration-1000 ease-out ${
          stage === "enter" ? "opacity-100 scale-100" : "opacity-0 scale-75"
        }`}
      />

      {/* "Hi, Jaison" animated text container */}
      <div
        className={`relative z-10 flex flex-col items-center justify-center text-center px-4 transition-all duration-800 ${
          stage === "start"
            ? "translate-y-24 opacity-0 scale-90"
            : stage === "enter"
            ? "translate-y-0 opacity-100 scale-100"
            : "-translate-y-4 opacity-0 scale-95"
        }`}
        style={{
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white flex items-center justify-center drop-shadow-2xl">
          <span>Hi, Jaison</span>
          <span className="inline-block w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-amber-400 ml-2 animate-pulse shadow-[0_0_12px_rgba(245,158,11,0.8)]" />
        </h1>

        <p
          className={`mt-3 text-xs sm:text-sm font-mono tracking-widest uppercase text-neutral-400 transition-all duration-700 delay-150 ${
            stage === "enter"
              ? "opacity-80 translate-y-0"
              : "opacity-0 translate-y-3"
          }`}
        >
          Life OS & Sanctuary
        </p>
      </div>
    </div>
  );
}
