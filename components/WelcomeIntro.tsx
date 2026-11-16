"use client";

import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";

interface WelcomeIntroProps {
  onRevealHomescreen: () => void;
}

export default function WelcomeIntro({ onRevealHomescreen }: WelcomeIntroProps) {
  // Stages:
  // "greeting_enter": Black screen, "Hi, Jaison" gliding up from bottom to middle (0 - 2s)
  // "greeting_exit": "Hi, Jaison" dissolves and black overlay fades out (2s - 2.6s)
  // "video_solo": Tron video playing full-screen without homescreen (2.6s - 7.6s, exactly 5 seconds)
  // "done": Homescreen has faded in overlapping the video; intro unmounts
  const [stage, setStage] = useState<"greeting_start" | "greeting_enter" | "greeting_exit" | "video_solo" | "done">("greeting_start");

  const skipToHomescreen = () => {
    setStage("done");
    onRevealHomescreen();
    try {
      document.body.style.overflow = "";
    } catch {}
  };

  useEffect(() => {
    // Lock scroll during the intro
    try {
      document.body.style.overflow = "hidden";
    } catch {}

    // 1. Pop up "Hi, Jaison" from bottom to middle
    const enterTimer = setTimeout(() => {
      setStage("greeting_enter");
    }, 50);

    // 2. After 2s, dissolve "Hi, Jaison" and reveal the video
    const exitGreetingTimer = setTimeout(() => {
      setStage("greeting_exit");
    }, 2000);

    // 3. Black veil clears, Tron video plays solo for 5 full seconds
    const videoSoloTimer = setTimeout(() => {
      setStage("video_solo");
    }, 2600);

    // 4. After 5 seconds of video playing solo (2.6s + 5.0s = 7.6s), fade in the homescreen!
    const revealHomescreenTimer = setTimeout(() => {
      skipToHomescreen();
    }, 7600);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitGreetingTimer);
      clearTimeout(videoSoloTimer);
      clearTimeout(revealHomescreenTimer);
      try {
        document.body.style.overflow = "";
      } catch {}
    };
  }, []);

  if (stage === "done") return null;

  return (
    <>
      {/* Black Curtain for the initial "Hi, Jaison" Greeting */}
      {(stage === "greeting_start" || stage === "greeting_enter" || stage === "greeting_exit") && (
        <div
          className={`fixed inset-0 z-[99999] bg-black flex items-center justify-center transition-opacity duration-600 ease-out select-none ${
            stage === "greeting_exit" ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
          style={{ backgroundColor: "#000000" }}
          aria-hidden="true"
        >
          {/* Subtle warm ambient backlight */}
          <div
            className={`absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-amber-400/10 blur-3xl pointer-events-none transition-all duration-1000 ease-out ${
              stage === "greeting_enter" ? "opacity-100 scale-100" : "opacity-0 scale-75"
            }`}
          />

          {/* "Hi, Jaison" text moving from bottom to middle */}
          <div
            className={`relative z-10 flex flex-col items-center justify-center text-center px-4 transition-all duration-800 ${
              stage === "greeting_start"
                ? "translate-y-24 opacity-0 scale-90"
                : stage === "greeting_enter"
                ? "translate-y-0 opacity-100 scale-100"
                : "-translate-y-6 opacity-0 scale-95"
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
                stage === "greeting_enter" ? "opacity-80 translate-y-0" : "opacity-0 translate-y-3"
              }`}
            >
              Life OS & Sanctuary
            </p>
          </div>
        </div>
      )}

      {/* Video Solo Phase Overlay (First 5 seconds of Tron video playing full-screen without homescreen) */}
      {stage === "video_solo" && (
        <div className="fixed inset-0 z-[99990] pointer-events-auto flex flex-col justify-between p-6 sm:p-8 animate-in fade-in duration-500">
          {/* Top Title Tag */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-cyan-500/30 text-cyan-300 font-mono text-xs backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>TRON AMBIENCE • 0:09 - 1:35</span>
            </div>

            {/* Quick Skip Pill */}
            <button
              onClick={skipToHomescreen}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-neutral-700 text-xs font-mono backdrop-blur-md transition-all group"
            >
              <span>Enter Life Hub</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Bottom Countdown Subtitle */}
          <div className="text-center font-mono text-xs text-neutral-400/80 tracking-widest uppercase bg-black/40 backdrop-blur-sm self-center px-4 py-1.5 rounded-full border border-white/5">
            Launching Executive Homescreen...
          </div>
        </div>
      )}
    </>
  );
}
