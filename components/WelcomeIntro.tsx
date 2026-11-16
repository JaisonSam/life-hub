"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface WelcomeIntroProps {
  onRevealHomescreen: () => void;
  onUserGesture?: () => void;
}

export default function WelcomeIntro({
  onRevealHomescreen,
  onUserGesture,
}: WelcomeIntroProps) {
  // Stages:
  // "greeting_enter": Black screen, "Hi, Jaison" gliding up from bottom to middle (0 - 2s)
  // "greeting_exit": "Hi, Jaison" dissolves and black overlay fades out (2s - 2.6s)
  // "video_solo": Tron video playing full-screen without homescreen (2.6s onwards)
  // "done": User has scrolled down; homescreen has faded in overlapping the video; intro unmounts
  const [stage, setStage] = useState<
    "greeting_start" | "greeting_enter" | "greeting_exit" | "video_solo" | "done"
  >("greeting_start");

  // Show "Scroll Down" prompt 5 seconds after the video starts playing
  const [showScrollPrompt, setShowScrollPrompt] = useState(false);

  const triggerEnterHomescreen = useCallback(() => {
    if (stage === "done") return;
    if (onUserGesture) onUserGesture();
    setStage("done");
    onRevealHomescreen();
    try {
      document.body.style.overflow = "";
    } catch {}
  }, [stage, onRevealHomescreen, onUserGesture]);

  useEffect(() => {
    // Lock scroll during initial "Hi, Jaison" greeting
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

    // 3. Black veil clears, Tron video plays solo
    const videoSoloTimer = setTimeout(() => {
      setStage("video_solo");
    }, 2600);

    // 4. After 5 seconds of the video loading (2.6s + 5.0s = 7.6s), make "Scroll Down" prompt visible!
    const promptTimer = setTimeout(() => {
      setShowScrollPrompt(true);
    }, 7600);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitGreetingTimer);
      clearTimeout(videoSoloTimer);
      clearTimeout(promptTimer);
      try {
        document.body.style.overflow = "";
      } catch {}
    };
  }, []);

  // Listen for user scroll down to fade in homescreen (only active during video_solo)
  useEffect(() => {
    if (stage !== "video_solo") return;

    let touchStartY = 0;

    const handleWheel = (e: WheelEvent) => {
      // User scrolls down
      if (e.deltaY > 8) {
        triggerEnterHomescreen();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        const touchCurrentY = e.touches[0].clientY;
        // User swipes up (scrolling page down)
        if (touchStartY - touchCurrentY > 20) {
          triggerEnterHomescreen();
        }
      }
    };

    const handleScroll = () => {
      if (window.scrollY > 8) {
        triggerEnterHomescreen();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        triggerEnterHomescreen();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [stage, triggerEnterHomescreen]);

  if (stage === "done") return null;

  return (
    <>
      {/* Black Curtain for the initial "Hi, Jaison" Greeting */}
      {(stage === "greeting_start" ||
        stage === "greeting_enter" ||
        stage === "greeting_exit") && (
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

      {/* Video Solo Phase Overlay (Fullscreen video playing solo with music on) */}
      {stage === "video_solo" && (
        <div className="fixed inset-0 z-[99990] pointer-events-none flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-500">
          {/* Top Title Tag & Quick Enter Button */}
          <div className="flex items-center justify-between pointer-events-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/65 border border-cyan-500/40 text-cyan-300 font-mono text-xs backdrop-blur-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="font-semibold tracking-wider">TRON: LEGACY</span>
              <span className="hidden sm:inline text-neutral-500">•</span>
              <span className="hidden sm:inline text-neutral-300">DUCATI ESCAPE (0:09 - 1:35)</span>
            </div>

            {/* Quick Skip Pill */}
            <button
              onClick={triggerEnterHomescreen}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-900/85 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-neutral-700 text-xs font-mono backdrop-blur-md transition-all shadow-xl hover:border-cyan-500/50 group"
            >
              <span>Enter Life Hub</span>
              <ChevronRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* BOTTOM SCROLL DOWN PROMPT: Visible after 5 seconds of the video loading */}
          {showScrollPrompt && (
            <div
              onClick={triggerEnterHomescreen}
              className="pointer-events-auto self-center flex flex-col items-center gap-2 cursor-pointer group animate-in fade-in slide-in-from-bottom-6 duration-700 select-none pb-4"
            >
              <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-black/80 hover:bg-black/95 border border-cyan-500/50 hover:border-cyan-400 shadow-[0_0_35px_rgba(6,182,212,0.45)] backdrop-blur-md transition-all group-hover:scale-105 active:scale-95">
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 animate-bounce group-hover:text-cyan-300 transition-colors" />
                <span className="text-xs sm:text-sm font-mono font-bold tracking-widest text-cyan-200 group-hover:text-white uppercase">
                  Scroll Down to Enter Life Hub
                </span>
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 animate-bounce group-hover:text-cyan-300 transition-colors" />
              </div>

              <div className="text-[11px] font-mono text-neutral-400 tracking-widest uppercase bg-black/60 px-3.5 py-1 rounded-full border border-white/10 backdrop-blur-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Music Always On • Daft Punk "The Grid"</span>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
