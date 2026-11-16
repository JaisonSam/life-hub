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

  // Compute smooth progressive volume fade-in with a softer beginning
  const applyFadeInVolume = useCallback((video: HTMLVideoElement) => {
    if (isMuted) {
      video.muted = true;
      return;
    }
    const t = video.currentTime;
    if (t <= 0) {
      video.volume = 0.001;
    } else if (t <= 3.0) {
      // Whisper-soft gentle beginning fade-in from 0.001 to 0.12 (smooth quadratic curve)
      const p = t / 3.0;
      const vol = 0.001 + (0.12 - 0.001) * Math.pow(p, 2.0);
      video.volume = Math.max(0.001, Math.min(TARGET_VOLUME, Number(vol.toFixed(3))));
    } else if (t < 6.0) {
      // Smooth swell from 0.12 up to TARGET_VOLUME (0.85)
      const p2 = (t - 3.0) / 3.0;
      const vol = 0.12 + (TARGET_VOLUME - 0.12) * (p2 * (2 - p2));
      video.volume = Math.max(0.01, Math.min(TARGET_VOLUME, Number(vol.toFixed(3))));
    } else {
      video.volume = TARGET_VOLUME;
    }
  }, [isMuted]);

  // Clean shutdown whenever video has ended
  useEffect(() => {
    if (hasVideoEnded) {
      const video = bgVideoRef.current;
      if (video) {
        video.pause();
        video.muted = true;
        video.currentTime = 0;
        try {
          video.src = "";
          video.load();
        } catch {}
      }
    }
  }, [hasVideoEnded]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const video = bgVideoRef.current;
      if (video) {
        video.pause();
        video.muted = true;
        try {
          video.src = "";
          video.load();
        } catch {}
      }
    };
  }, []);

  // MASTER AUDIO CONTROLLER: Sync audio volume & muted state with isMuted prop
  // bgVideoRef handles audio across the entire site (both intro and homescreen)
  useEffect(() => {
    if (hasVideoEnded) return;
    const video = bgVideoRef.current;
    if (!video || video.ended) return;

    video.muted = isMuted;
    if (!isMuted) {
      applyFadeInVolume(video);
      video.play().catch(() => {});
    }
  }, [isMuted, applyFadeInVolume, hasVideoEnded]);

  // Handle explicit audio unlock trigger from parent
  useEffect(() => {
    if (hasVideoEnded) return;
    if (triggerUnlockAudio && bgVideoRef.current && !isMuted && !bgVideoRef.current.ended) {
      bgVideoRef.current.muted = false;
      applyFadeInVolume(bgVideoRef.current);
      bgVideoRef.current.play().catch(() => {});
    }
  }, [triggerUnlockAudio, isMuted, applyFadeInVolume, hasVideoEnded]);

  // Robust instant start playback with zero stalling and 4-second volume fade-in
  const startVideoInstant = useCallback(() => {
    if (hasVideoEnded) return;
    const video = bgVideoRef.current;
    if (!video || video.ended) return;

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
  }, [hasVideoEnded, onVideoReady]);

  useEffect(() => {
    if (hasVideoEnded) return;
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
      video.pause();
      video.muted = true;
      try {
        video.src = "";
        video.load();
      } catch {}
      if (onVideoEnded) {
        onVideoEnded();
      }
    };
    video.addEventListener("ended", handleEnded);

    // Smooth volume fade-in animation frame loop from 4.0s to 6.2s
    let animId: number;
    const rampVolume = () => {
      if (hasVideoEnded) return;
      if (video && !video.paused && !video.ended && video.currentTime < 6.2) {
        applyFadeInVolume(video);
        animId = requestAnimationFrame(rampVolume);
      } else if (video && !video.paused && !video.ended && !isMuted) {
        video.volume = TARGET_VOLUME;
      }
    };
    animId = requestAnimationFrame(rampVolume);

    const handleTimeUpdate = () => {
      if (hasVideoEnded || video.ended) return;
      applyFadeInVolume(video);
    };
    video.addEventListener("timeupdate", handleTimeUpdate);

    let audioAllowed = false;

    // Audio starts 1 second later (decreased by 1s, matching "Hi, Jaison" entrance)
    const audioDelayTimer = setTimeout(() => {
      if (hasVideoEnded || video.ended) return;
      audioAllowed = true;
      if (video && !isMuted) {
        video.currentTime = 0;
        video.muted = false;
        applyFadeInVolume(video);
        video.play().catch(() => {});
      }
    }, 1000);

    // Audio Unlocker: On the very first user interaction anywhere on the window or document
    // Only unlocks once the initial 1-second black screen has passed and video has not ended
    const unlockMasterAudio = () => {
      if (hasVideoEnded || video.ended) return;
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
  }, [startVideoInstant, isMuted, applyFadeInVolume, hasVideoEnded, onVideoEnded]);

  return (
    <>
      {/* 
        AMBIENT BACKGROUND LAYER (Video or Scripture Verse)
        - When video is active (!hasVideoEnded): Plays video once
        - When video has finished (hasVideoEnded): Displays YouVersion Scripture Verse in the background on scroll!
      */}
      <div
        className={`fixed inset-0 w-full h-full z-0 overflow-hidden bg-black pointer-events-none select-none transition-opacity duration-1000 ease-out ${
          !isHomescreenVisible && !hasVideoEnded
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
