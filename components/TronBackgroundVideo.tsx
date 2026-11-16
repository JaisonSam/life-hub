"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Film,
  Maximize2,
  Minimize2,
  ChevronDown,
} from "lucide-react";

interface TronBackgroundVideoProps {
  isHomescreenVisible: boolean;
  onVideoReady?: () => void;
  onSectionModeChange?: (isSection: boolean) => void;
}

export default function TronBackgroundVideo({
  isHomescreenVisible,
  onVideoReady,
  onSectionModeChange,
}: TronBackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Requirement 1: Music is ON ALWAYS by default!
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(false);

  // Scroll tracking for Requirement 3:
  // "when the screen is scrolled up a separate section should be made for the video to play over the content of the homescreen but below the main top tab"
  const [scrollY, setScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");
  const [manualSectionOverride, setManualSectionOverride] = useState<boolean | null>(null);

  const toggleSound = useCallback(() => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.muted = false;
      videoRef.current.volume = 0.8;
      setIsMuted(false);
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  }, [isMuted]);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  // Track window scrolling
  useEffect(() => {
    let lastY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrollY(currentY);

      if (currentY < lastY - 8) {
        setScrollDirection("up");
      } else if (currentY > lastY + 8) {
        setScrollDirection("down");
      }

      lastY = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine if Section Mode is active:
  // Active when homescreen is visible AND (scrolled to top < 260px OR scrolling up)
  const isSectionMode =
    isHomescreenVisible &&
    (manualSectionOverride !== null
      ? manualSectionOverride
      : scrollY < 260 || scrollDirection === "up");

  useEffect(() => {
    if (onSectionModeChange) {
      onSectionModeChange(isSectionMode);
    }
  }, [isSectionMode, onSectionModeChange]);

  // Video Autoplay & Music Always On Logic
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Set initial audio volume
    video.volume = 0.8;
    video.muted = false;

    const startPlay = () => {
      video.muted = false;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsMuted(false);
            setIsPlaying(true);
          })
          .catch((err) => {
            console.warn(
              "Initial unmuted autoplay blocked by browser policy without gesture. Playing muted until first user interaction:",
              err
            );
            // Autoplay muted temporarily so the video never freezes
            video.muted = true;
            video.play().catch(() => {});
          });
      }
      if (onVideoReady) onVideoReady();
    };

    if (video.readyState >= 2) {
      startPlay();
    } else {
      video.addEventListener("loadeddata", startPlay, { once: true });
    }

    // Immediately unmute on the very first user interaction anywhere (scroll, click, key, touch)
    const unmuteOnFirstGesture = () => {
      if (videoRef.current) {
        videoRef.current.muted = false;
        videoRef.current.volume = 0.8;
        setIsMuted(false);
        videoRef.current.play().catch(() => {});
      }
    };

    window.addEventListener("wheel", unmuteOnFirstGesture, { passive: true });
    window.addEventListener("scroll", unmuteOnFirstGesture, { passive: true });
    window.addEventListener("pointerdown", unmuteOnFirstGesture, { passive: true });
    window.addEventListener("touchstart", unmuteOnFirstGesture, { passive: true });
    window.addEventListener("keydown", unmuteOnFirstGesture, { passive: true });

    // When 86s clip finishes, seamlessly loop back with music ON
    const handleEnded = () => {
      video.currentTime = 0;
      video.muted = isMuted;
      video.play().catch(() => {});
    };
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("ended", handleEnded);
      window.removeEventListener("wheel", unmuteOnFirstGesture);
      window.removeEventListener("scroll", unmuteOnFirstGesture);
      window.removeEventListener("pointerdown", unmuteOnFirstGesture);
      window.removeEventListener("touchstart", unmuteOnFirstGesture);
      window.removeEventListener("keydown", unmuteOnFirstGesture);
    };
  }, [isMuted, onVideoReady]);

  return (
    <>
      {/* 
        MASTER DYNAMIC VIDEO CONTAINER
        - Mode 1 (Intro): Fixed Fullscreen, z-0
        - Mode 2 (Homescreen Scrolled Up / Section Mode): Fixed below Main Top Tab at top-[74px], z-20, border, shadow, crystal-clear!
        - Mode 3 (Homescreen Scrolled Down / Background Mode): Fixed Fullscreen, z-0, ambient dark overlay behind dashboard cards!
      */}
      <div
        ref={containerRef}
        className={`fixed overflow-hidden transition-all duration-600 ease-out ${
          !isHomescreenVisible
            ? "inset-0 w-full h-full z-0 rounded-none bg-black pointer-events-none"
            : isSectionMode
            ? "top-[72px] sm:top-[76px] left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] sm:w-[calc(100%-2rem)] max-w-7xl h-[320px] sm:h-[420px] md:h-[480px] z-20 rounded-2xl bg-black shadow-[0_0_45px_rgba(6,182,212,0.35)] border border-cyan-500/50 pointer-events-auto"
            : "inset-0 w-full h-full z-0 rounded-none bg-black pointer-events-none"
        }`}
        aria-label="Tron Motorcycle Ambient Experience"
      >
        <video
          ref={videoRef}
          src="/videos/tron-intro.mp4"
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
        />

        {/* SECTION MODE HUD OVERLAYS (Visible when playing over the content below the main top tab) */}
        {isHomescreenVisible && isSectionMode && (
          <>
            {/* Top HUD Bar */}
            <div className="absolute top-0 inset-x-0 p-3 sm:p-4 flex items-center justify-between z-30 bg-gradient-to-b from-black/85 via-black/40 to-transparent select-none">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <div className="flex flex-col">
                  <span className="text-cyan-300 font-mono font-bold text-xs sm:text-sm tracking-wider">
                    TRON: LEGACY // THE GRID
                  </span>
                  <span className="text-[10px] sm:text-xs font-mono text-neutral-400">
                    0:09 - 1:35 • DUCATI MOTORCYCLE SCENE
                  </span>
                </div>
              </div>

              {/* Sound & Controls HUD */}
              <div className="flex items-center gap-2">
                {/* Daft Punk Equalizer & Music Always On Badge */}
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-[11px] font-mono">
                  <div className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 h-3 bg-cyan-400 animate-pulse" />
                    <span className="w-0.5 h-4 bg-cyan-400 animate-pulse delay-75" />
                    <span className="w-0.5 h-2 bg-cyan-400 animate-pulse delay-150" />
                  </div>
                  <span>Daft Punk OST</span>
                </div>

                {/* Sound Toggle (Music Always On) */}
                <button
                  onClick={toggleSound}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono transition-all ${
                    !isMuted
                      ? "bg-cyan-500/25 text-cyan-300 border border-cyan-500/50 font-semibold"
                      : "bg-neutral-900/80 text-neutral-400 hover:text-white border border-neutral-700"
                  }`}
                  title={isMuted ? "Unmute Music (Music Always On)" : "Mute Sound"}
                >
                  {!isMuted ? (
                    <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                  ) : (
                    <VolumeX className="w-3.5 h-3.5 text-neutral-400" />
                  )}
                  <span>{!isMuted ? "Audio: On" : "Muted"}</span>
                </button>

                {/* Play / Pause Toggle */}
                <button
                  onClick={togglePlay}
                  className="p-1.5 rounded-full bg-black/60 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-white/10 transition-colors"
                  title={isPlaying ? "Pause Video" : "Resume Video"}
                >
                  {isPlaying ? (
                    <Pause className="w-3.5 h-3.5" />
                  ) : (
                    <Play className="w-3.5 h-3.5" />
                  )}
                </button>

                {/* Fullscreen Button */}
                <button
                  onClick={toggleFullscreen}
                  className="p-1.5 rounded-full bg-black/60 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-white/10 transition-colors hidden sm:block"
                  title="Fullscreen"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>

                {/* Dock to Background button */}
                <button
                  onClick={() => setManualSectionOverride(false)}
                  className="p-1.5 rounded-full bg-black/60 hover:bg-neutral-800 text-cyan-300 border border-cyan-500/30 transition-colors"
                  title="Send to Background View"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Bottom HUD Bar */}
            <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 flex items-center justify-between z-30 bg-gradient-to-t from-black/85 via-black/40 to-transparent select-none">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[10px] sm:text-xs font-mono font-medium">
                  CINEMA SECTION
                </span>
                <span className="hidden sm:inline text-xs font-mono text-neutral-300">
                  Playing Over Homescreen Content
                </span>
              </div>

              <div className="text-[11px] font-mono text-neutral-400 flex items-center gap-1.5">
                <span>Scroll down for Dashboard</span>
                <ChevronDown className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* 
        CINEMATIC TINT OVERLAY:
        - When Section Mode is active: 0% opacity (video in the section is 100% crisp, zero overlay).
        - When Background Mode is active: 75% dark overlay with backdrop-blur so dashboard cards are crisp & readable.
      */}
      <div
        className={`fixed inset-0 pointer-events-none z-[1] transition-opacity duration-600 ease-out ${
          isHomescreenVisible && !isSectionMode
            ? "opacity-100 bg-[#090a10]/75 backdrop-blur-[1.5px]"
            : "opacity-0"
        }`}
        aria-hidden="true"
      />

      {/* FLOATING AMBIENT CONTROLS PILL (Visible when in background mode) */}
      {isHomescreenVisible && !isSectionMode && (
        <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
          {showControls && (
            <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#14151b]/95 border border-cyan-500/40 backdrop-blur-md shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
              {/* Play / Pause Toggle */}
              <button
                onClick={togglePlay}
                className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
                title={isPlaying ? "Pause background video" : "Resume background video"}
              >
                {isPlaying ? (
                  <Pause className="w-3.5 h-3.5" />
                ) : (
                  <Play className="w-3.5 h-3.5" />
                )}
              </button>

              {/* Sound Toggle (Music Always On) */}
              <button
                onClick={toggleSound}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono transition-all ${
                  !isMuted
                    ? "bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 font-semibold"
                    : "text-neutral-400 hover:text-white"
                }`}
                title={isMuted ? "Unmute Tron soundtrack" : "Mute Tron soundtrack"}
              >
                {!isMuted ? (
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5" />
                )}
                <span>{!isMuted ? "Music: On" : "Muted"}</span>
              </button>

              {/* Switch to Section Mode */}
              <button
                onClick={() => setManualSectionOverride(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono text-cyan-300 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 transition-colors"
                title="Expand to Separate Section below Main Top Tab"
              >
                <Film className="w-3 h-3 text-cyan-400" />
                <span>Section View</span>
              </button>
            </div>
          )}

          {/* Master Ambient Badge Trigger */}
          <button
            onClick={() => setShowControls((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#12131a]/90 hover:bg-[#1a1b24] border border-cyan-500/40 text-cyan-300 text-xs font-mono backdrop-blur-md transition-all shadow-xl hover:border-cyan-400 group"
            title="Tron Ambience & Music Controls"
          >
            <div className="flex items-end gap-0.5 h-3">
              <span className="w-0.5 h-2.5 bg-cyan-400 animate-pulse" />
              <span className="w-0.5 h-3.5 bg-cyan-400 animate-pulse delay-75" />
              <span className="w-0.5 h-2 bg-cyan-400 animate-pulse delay-150" />
            </div>
            <span className="text-[11px] font-semibold tracking-wider">TRON MUSIC ON</span>
          </button>
        </div>
      )}
    </>
  );
}
