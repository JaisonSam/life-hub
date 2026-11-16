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

  useEffect(() => {
    const video = bgVideoRef.current;
    if (!video) return;

    // Start video playback
    const startPlay = () => {
      video.play().catch(() => {});
      if (onVideoReady) onVideoReady();
    };

    if (video.readyState >= 2) {
      startPlay();
    } else {
      video.addEventListener("loadeddata", startPlay, { once: true });
    }

    // Keep background video playing smoothly
    const handleEnded = () => {
      video.currentTime = 0;
      video.play().catch(() => {});
    };
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("ended", handleEnded);
    };
  }, [onVideoReady]);

  return (
    <>
      {/* 
        AMBIENT BACKGROUND VIDEO LAYER
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
          muted={true}
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
        - User requirement: "Have only the audio off feature at the bottom right which should function. No need to have the video off function"
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
