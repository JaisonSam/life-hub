"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface WelcomeIntroProps {
  onRevealHomescreen: () => void;
  onUserGesture?: () => void;
  onGreetingAppear?: () => void;
  hasVideoEnded?: boolean;
}

export default function WelcomeIntro({
  onRevealHomescreen,
  onUserGesture,
  onGreetingAppear,
  hasVideoEnded,
}: WelcomeIntroProps) {
  // Stages:
  // "greeting_start": Pure black for 1 second (0 - 1.0s)
  // "greeting_enter": "Hi, Jaison" enters with slow, smooth animation (1.0s - 5.0s)
  // "greeting_exit": "Hi, Jaison" smoothly dissolves (5.0s - 6.0s)
  // "video_solo": Tron video playing full-screen with music on (6.0s onwards)
  // "done": User has scrolled down; homescreen has faded in; intro unmounts
  const [stage, setStage] = useState<
    "greeting_start" | "greeting_enter" | "greeting_exit" | "video_solo" | "done"
  >("greeting_start");

  // Show "Scroll Down" prompt 5 seconds after the video starts playing
  const [showScrollPrompt, setShowScrollPrompt] = useState(false);

  const handleUserInteraction = useCallback(() => {
    if (onUserGesture) {
      onUserGesture();
    }
  }, [onUserGesture]);

  const triggerEnterHomescreen = useCallback(() => {
    if (stage === "done") return;
    handleUserInteraction();
    setStage("done");
    onRevealHomescreen();
    try {
      document.body.style.overflow = "";
    } catch {}
  }, [stage, onRevealHomescreen, handleUserInteraction]);

  useEffect(() => {
    if (hasVideoEnded) {
      setStage("done");
      try {
        document.body.style.overflow = "";
      } catch {}
    }
  }, [hasVideoEnded]);

  useEffect(() => {
    if (hasVideoEnded) return;

    // Lock scroll during initial "Hi, Jaison" greeting
    try {
      document.body.style.overflow = "hidden";
    } catch {}

    // 1. "Hi, Jaison" shows up after 1 sec (stays pure black for 1000ms)
    const enterTimer = setTimeout(() => {
      setStage("greeting_enter");
      if (onGreetingAppear) {
        onGreetingAppear();
      } else {
        handleUserInteraction();
      }
    }, 1000);

    // 2. Stays for 4 full seconds: 1.0s + 4.0s = 5.0s (5000ms)
    const exitGreetingTimer = setTimeout(() => {
      setStage("greeting_exit");
    }, 5000);

    // 3. Black veil clears at 6.0s (6000ms), matching audio reaching full volume!
    const videoSoloTimer = setTimeout(() => {
      setStage("video_solo");
      handleUserInteraction();
    }, 6000);

    // 4. After 5 seconds of the solo video playing (6.0s + 5.0s = 11.0s), show minimal "Scroll down" prompt!
    const promptTimer = setTimeout(() => {
      setShowScrollPrompt(true);
    }, 11000);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitGreetingTimer);
      clearTimeout(videoSoloTimer);
      clearTimeout(promptTimer);
      try {
        document.body.style.overflow = "";
      } catch {}
    };
  }, [handleUserInteraction, onGreetingAppear, hasVideoEnded]);

  // Listen for user scroll down or gestures to fade in homescreen (only active during video_solo)
  useEffect(() => {
    if (stage !== "video_solo") return;

    let touchStartY = 0;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 8) {
        triggerEnterHomescreen();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        touchStartY = e.touches[0].clientY;
      }
      handleUserInteraction();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        const touchCurrentY = e.touches[0].clientY;
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
      handleUserInteraction();
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
  }, [stage, triggerEnterHomescreen, handleUserInteraction]);

  if (stage === "done" || hasVideoEnded) return null;

  return (
    <>
      {/* Black Curtain for the initial "Hi, Jaison" Greeting */}
      {(stage === "greeting_start" ||
        stage === "greeting_enter" ||
        stage === "greeting_exit") && (
        <div
          onPointerDown={handleUserInteraction}
          className={`fixed inset-0 z-[99999] bg-black flex items-center justify-center transition-opacity duration-1000 ease-in-out select-none cursor-pointer ${
            stage === "greeting_exit" ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
          style={{ backgroundColor: "#000000" }}
          aria-hidden="true"
        >
          {/* Subtle warm ambient backlight (slower, more luxurious expansion) */}
          <div
            className={`absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-amber-400/10 blur-3xl pointer-events-none transition-all duration-[2200ms] ease-out ${
              stage === "greeting_enter" ? "opacity-100 scale-100" : "opacity-0 scale-75"
            }`}
          />

          {/* "Hi, Jaison" text moving from bottom to middle (Loads after 1s, slowed 1800ms animation, stays 4s) */}
          <div
            className={`relative z-10 flex flex-col items-center justify-center text-center px-4 transition-all duration-[1800ms] ${
              stage === "greeting_start"
                ? "translate-y-28 opacity-0 scale-90"
                : stage === "greeting_enter"
                ? "translate-y-0 opacity-100 scale-100"
                : "-translate-y-8 opacity-0 scale-95"
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
              className={`mt-4 text-xs sm:text-sm font-mono tracking-widest uppercase text-neutral-400 transition-all duration-[1600ms] delay-300 ${
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
        <div
          onPointerDown={handleUserInteraction}
          className="fixed inset-0 z-[99990] pointer-events-none flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-500"
        >
          {/* Top Title Tag & Quick Enter Button */}
          <div className="flex items-center justify-between pointer-events-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/65 border border-white/10 text-neutral-300 font-mono text-xs backdrop-blur-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="font-semibold tracking-wider text-white">TRON: LEGACY</span>
              <span className="hidden sm:inline text-neutral-500">•</span>
              <span className="hidden sm:inline text-neutral-400">DUCATI ESCAPE</span>
            </div>

            {/* Quick Skip Pill */}
            <button
              onClick={triggerEnterHomescreen}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-900/85 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-neutral-700 text-xs font-mono backdrop-blur-md transition-all shadow-xl group"
            >
              <span>Enter Life Hub</span>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* 
            BOTTOM SCROLL DOWN PROMPT (Minimal & Aesthetic):
            - White font ("Scroll down for dashboard")
            - Exactly one small arrow pointing below that
            - No two arrows, no heavy border box
          */}
          {showScrollPrompt && (
            <div
              onClick={triggerEnterHomescreen}
              className="pointer-events-auto self-center flex flex-col items-center gap-1.5 cursor-pointer group animate-in fade-in slide-in-from-bottom-4 duration-1000 select-none pb-6"
            >
              <span className="text-xs sm:text-sm font-light tracking-[0.25em] text-white/90 group-hover:text-white uppercase transition-colors drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
                Scroll down for dashboard
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-white/70 group-hover:text-white animate-bounce transition-colors drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]" />
            </div>
          )}
        </div>
      )}
    </>
  );
}
