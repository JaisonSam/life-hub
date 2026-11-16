"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";

import YouVersionVerse from "./YouVersionVerse";

interface TronBackgroundVideoProps {
  isHomescreenVisible: boolean;
  isMuted: boolean;
  onToggleSound: () => void;
  onVideoReady?: () => void;
  triggerUnlockAudio?: boolean;
  hasVideoEnded: boolean;
  onVideoEnded: () => void;
}

const TARGET_VOLUME = 0.85;
const FADE_START = 4.0; // Audio fade-in starts at 4.0s
const FADE_END = 6.0;   // Audio reaches full volume at 6.0s
const BASE_VOLUME = 0.05; // Subtle ambient volume before 4.0s

export default function TronBackgroundVideo({
  isHomescreenVisible,
  isMuted,
  onToggleSound,
  onVideoReady,
  triggerUnlockAudio,
  hasVideoEnded,
  onVideoEnded,
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

  // Compute smooth volume fade-in from 4.0s to 6.0s
  const applyFadeInVolume = useCallback((video: HTMLVideoElement) => {
    if (isMuted) {
      video.muted = true;
      return;
    }
    const t = video.currentTime;
    if (t < FADE_START) {
      // Very gentle, subtle ambient sound before 4.0 seconds
      video.volume = BASE_VOLUME;
    } else if (t >= FADE_START && t < FADE_END) {
      // Smooth fade-in between 4.0s and 6.0s
      const progress = Math.max(0, Math.min((t - FADE_START) / (FADE_END - FADE_START), 1.0));
      // Smooth ease-out quad curve
      const currentVol = BASE_VOLUME + (TARGET_VOLUME - BASE_VOLUME) * (progress * (2 - progress));
      video.volume = Math.max(0.01, Math.min(TARGET_VOLUME, Number(currentVol.toFixed(3))));
    } else {
      video.volume = TARGET_VOLUME;
    }
  }, [isMuted]);

  // MASTER AUDIO CONTROLLER: Sync audio volume & muted state with isMuted prop
  // bgVideoRef handles audio across the entire site (both intro and homescreen)
  useEffect(() => {
    const video = bgVideoRef.current;
    if (!video) return;

    video.muted = isMuted;
    if (!isMuted) {
      applyFadeInVolume(video);
      video.play().catch(() => {});
    }
  }, [isMuted, applyFadeInVolume]);

  // Handle explicit audio unlock trigger from parent
  useEffect(() => {
    if (triggerUnlockAudio && bgVideoRef.current && !isMuted) {
      bgVideoRef.current.muted = false;
      applyFadeInVolume(bgVideoRef.current);
      bgVideoRef.current.play().catch(() => {});
    }
  }, [triggerUnlockAudio, isMuted, applyFadeInVolume]);

  // Robust instant start playback with zero stalling and 4-second volume fade-in
  const startVideoInstant = useCallback(() => {
    const video = bgVideoRef.current;
    if (!video) return;

    // Start with low initial volume; keep muted during initial 2s black screen
    video.volume = 0.01;
    video.muted = true;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          if (onVideoReady) onVideoReady();
        })
        .catch(() => {
          // If browser restricts autoplay, ensure muted
          video.muted = true;
          video.play().catch(() => {});
          if (onVideoReady) onVideoReady();
        });
    }
  }, [onVideoReady]);

  useEffect(() => {
    const video = bgVideoRef.current;
    if (!video) return;

    if (video.readyState >= 1) {
      startVideoInstant();
    } else {
      video.addEventListener("loadedmetadata", startVideoInstant, { once: true });
      video.addEventListener("canplay", startVideoInstant, { once: true });
    }

    // Video plays only once: trigger completion callback when it finishes
    const handleEnded = () => {
      if (onVideoEnded) {
        onVideoEnded();
      }
    };
    video.addEventListener("ended", handleEnded);

    // Smooth volume fade-in animation frame loop from 4.0s to 6.2s
    let animId: number;
    const rampVolume = () => {
      if (video && !video.paused && video.currentTime < 6.2) {
        applyFadeInVolume(video);
        animId = requestAnimationFrame(rampVolume);
      } else if (video && !video.paused && !isMuted) {
        video.volume = TARGET_VOLUME;
      }
    };
    animId = requestAnimationFrame(rampVolume);

    const handleTimeUpdate = () => {
      applyFadeInVolume(video);
    };
    video.addEventListener("timeupdate", handleTimeUpdate);

    let audioAllowed = false;

    // Audio starts 2 seconds later (exactly when "Hi, Jaison" appears)
    const audioDelayTimer = setTimeout(() => {
      audioAllowed = true;
      if (video && !isMuted) {
        video.currentTime = 0;
        video.muted = false;
        applyFadeInVolume(video);
        video.play().catch(() => {});
      }
    }, 2000);

    // Audio Unlocker: On the very first user interaction anywhere on the window or document
    // Only unlocks once the initial 2-second black screen has passed
    const unlockMasterAudio = () => {
      if (audioAllowed && video && !isMuted) {
        video.muted = false;
        applyFadeInVolume(video);
        video.play().catch(() => {});
      }
    };

    const interactionEvents = [
      "pointermove",
      "mousemove",
      "pointerdown",
      "touchstart",
      "click",
      "keydown",
      "wheel",
      "scroll",
      "mousedown",
      "focus",
    ];

    interactionEvents.forEach((evt) => {
      window.addEventListener(evt, unlockMasterAudio, { passive: true });
      document.addEventListener(evt, unlockMasterAudio, { passive: true });
    });

    return () => {
      clearTimeout(audioDelayTimer);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("loadedmetadata", startVideoInstant);
      video.removeEventListener("canplay", startVideoInstant);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      cancelAnimationFrame(animId);
      interactionEvents.forEach((evt) => {
        window.removeEventListener(evt, unlockMasterAudio);
        document.removeEventListener(evt, unlockMasterAudio);
      });
    };
  }, [startVideoInstant, isMuted, applyFadeInVolume]);

  return (
    <>
      {/* 
        AMBIENT BACKGROUND LAYER (Video or Scripture Verse)
        - When video is active (!hasVideoEnded): Plays video once
        - When video has finished (hasVideoEnded): Displays YouVersion Scripture Verse in the background on scroll!
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
        {!hasVideoEnded ? (
          <video
            ref={bgVideoRef}
            id="tron-bg-video"
            src="/videos/tron-intro.mp4"
            autoPlay
            muted={isMuted}
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#090a0f]">
            <YouVersionVerse variant="ambient" />
          </div>
        )}
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
