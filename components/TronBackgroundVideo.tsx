"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface TronBackgroundVideoProps {
  isHomescreenVisible: boolean;
  isMuted: boolean;
  onToggleSound: () => void;
  onVideoReady?: () => void;
  triggerUnlockAudio?: boolean;
}

export default function TronBackgroundVideo({
  isHomescreenVisible,
  isMuted,
  onToggleSound,
  onVideoReady,
  triggerUnlockAudio,
}: TronBackgroundVideoProps) {
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const [scrollY, setScrollY] = useState(0);

  // Track scroll position to fade in background video when scrolling into dashboard
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update audio volume & muted state on bgVideoRef
  useEffect(() => {
    const video = bgVideoRef.current;
    if (!video) return;

    // During intro (!isHomescreenVisible), bgVideoRef is the main solo player and plays music
    // Once homescreen is visible, sectionVideo in page.tsx handles foreground audio so bgVideo is muted
    const shouldMute = isHomescreenVisible ? true : isMuted;
    video.muted = shouldMute;
    video.volume = 0.85;

    if (!shouldMute) {
      video.play().catch(() => {
        video.muted = true;
        video.play().catch(() => {});
      });
    }
  }, [isMuted, isHomescreenVisible]);

  // Robust instant start playback with zero stalling
  const startVideoInstant = useCallback(() => {
    const video = bgVideoRef.current;
    if (!video) return;

    video.volume = 0.85;
    video.muted = isMuted;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          if (onVideoReady) onVideoReady();
        })
        .catch(() => {
          // If browser restricts unmuted autoplay, immediately fall back to muted so video starts playing with 0 delay!
          video.muted = true;
          video.play().catch(() => {});
          if (onVideoReady) onVideoReady();
        });
    }
  }, [isMuted, onVideoReady]);

  useEffect(() => {
    const video = bgVideoRef.current;
    if (!video) return;

    if (video.readyState >= 1) {
      startVideoInstant();
    } else {
      video.addEventListener("loadedmetadata", startVideoInstant, { once: true });
      video.addEventListener("canplay", startVideoInstant, { once: true });
    }

    // Keep background video playing smoothly on loop
    const handleEnded = () => {
      video.currentTime = 0;
      video.play().catch(() => {});
    };
    video.addEventListener("ended", handleEnded);

    // Unmute on first user gesture
    const handleUserGesture = () => {
      if (bgVideoRef.current && !isHomescreenVisible) {
        bgVideoRef.current.muted = false;
        bgVideoRef.current.volume = 0.85;
        bgVideoRef.current.play().catch(() => {});
      }
    };
    window.addEventListener("pointerdown", handleUserGesture, { passive: true });
    window.addEventListener("click", handleUserGesture, { passive: true });
    window.addEventListener("touchstart", handleUserGesture, { passive: true });
    window.addEventListener("keydown", handleUserGesture, { passive: true });

    return () => {
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("loadedmetadata", startVideoInstant);
      video.removeEventListener("canplay", startVideoInstant);
      window.removeEventListener("pointerdown", handleUserGesture);
      window.removeEventListener("click", handleUserGesture);
      window.removeEventListener("touchstart", handleUserGesture);
      window.removeEventListener("keydown", handleUserGesture);
    };
  }, [startVideoInstant, isHomescreenVisible]);

  return (
    <>
      {/* 
        AMBIENT BACKGROUND VIDEO LAYER
        - Starts playing immediately with faststart 1-second keyframes
        - During Intro (!isHomescreenVisible): Full-screen solo video view
        - On Homescreen: Fades in behind dashboard contents as the user scrolls down (scrollY > 120)
        - When at the top (scrollY <= 120): Hidden (opacity-0) so video only shows inside the showcase section box!
      */}
      <div
        className={`fixed inset-0 w-full h-full z-0 overflow-hidden bg-black pointer-events-none select-none transition-opacity duration-1000 ease-out ${
          !isHomescreenVisible
            ? "opacity-100"
            : scrollY > 120
            ? "opacity-40"
            : "opacity-0"
        }`}
        aria-hidden="true"
      >
        <video
          ref={bgVideoRef}
          src="/videos/tron-intro.mp4"
          autoPlay
          loop
          muted={!isHomescreenVisible ? isMuted : true}
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
        />
      </div>

      {/* AMBIENT DARK OVERLAY WHEN SCROLLED DOWN IN DASHBOARD */}
      <div
        className={`fixed inset-0 pointer-events-none z-[1] transition-opacity duration-1000 ease-out ${
          isHomescreenVisible && scrollY > 120
            ? "opacity-100 bg-[#090a10]/60 backdrop-blur-[1px]"
            : "opacity-0"
        }`}
        aria-hidden="true"
      />

      {/* 
        AUDIO CONTROL FEATURE AT BOTTOM-RIGHT
        - Minimal & aesthetic audio toggle only
      */}
      {isHomescreenVisible && (
        <div className="fixed bottom-4 right-4 z-40 flex items-center">
          <button
            onClick={onToggleSound}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-mono backdrop-blur-md shadow-2xl transition-all cursor-pointer border ${
              !isMuted
                ? "bg-[#12131a]/95 text-cyan-300 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:border-cyan-400"
                : "bg-[#14151b]/90 text-neutral-400 hover:text-white border-neutral-700 hover:border-neutral-500"
            }`}
            title={!isMuted ? "Mute soundtrack (Audio Off)" : "Unmute soundtrack (Audio On)"}
          >
            {!isMuted ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span className="text-[11px] font-semibold tracking-wider">OST ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-neutral-400" />
                <span className="text-[11px] font-medium tracking-wider">AUDIO OFF</span>
              </>
            )}
          </button>
        </div>
      )}
    </>
  );
}
