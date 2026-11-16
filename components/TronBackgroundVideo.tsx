"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";

interface TronBackgroundVideoProps {
  isHomescreenVisible: boolean;
  onVideoReady?: () => void;
  triggerUnlockAudio?: boolean;
}

export default function TronBackgroundVideo({
  isHomescreenVisible,
  onVideoReady,
  triggerUnlockAudio,
}: TronBackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isPlayingRef = useRef(true);

  // Requirement 1: Music ALWAYS ON
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  const unlockAudio = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video.volume = 0.85;
    setIsMuted(false);
    video.play().catch(() => {});
  }, []);

  const toggleSound = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isMuted) {
      video.muted = false;
      video.volume = 0.85;
      setIsMuted(false);
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  }, [isMuted]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
      isPlayingRef.current = false;
      setIsPlaying(false);
    } else {
      video.play().catch(() => {});
      isPlayingRef.current = true;
      setIsPlaying(true);
    }
  }, [isPlaying]);

  // Handle external audio unlock trigger
  useEffect(() => {
    if (triggerUnlockAudio) {
      unlockAudio();
    }
  }, [triggerUnlockAudio, unlockAudio]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Set initial volume & unmuted intent
    video.volume = 0.85;
    video.muted = false;

    // Start video playback
    const startPlay = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsMuted(false);
            setIsPlaying(true);
            isPlayingRef.current = true;
          })
          .catch((err) => {
            console.warn("Browser blocked initial unmuted autoplay without gesture:", err);
            // Autoplay muted temporarily so video doesn't stall
            video.muted = true;
            setIsMuted(true);
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

    // Unmute on the very first user interaction (click, pointerdown, touchstart, keydown)
    const handleGesture = () => {
      unlockAudio();
    };

    window.addEventListener("pointerdown", handleGesture, { passive: true });
    window.addEventListener("click", handleGesture, { passive: true });
    window.addEventListener("touchstart", handleGesture, { passive: true });
    window.addEventListener("keydown", handleGesture, { passive: true });

    // Anti-pause safeguard: Prevent video from ever pausing unexpectedly on scroll
    const handlePause = () => {
      if (isPlayingRef.current && videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
    };
    video.addEventListener("pause", handlePause);

    // Seamless loop with music ON
    const handleEnded = () => {
      video.currentTime = 0;
      video.muted = isMuted;
      video.play().catch(() => {});
    };
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("pause", handlePause);
      window.removeEventListener("pointerdown", handleGesture);
      window.removeEventListener("click", handleGesture);
      window.removeEventListener("touchstart", handleGesture);
      window.removeEventListener("keydown", handleGesture);
    };
  }, [isMuted, onVideoReady, unlockAudio]);

  return (
    <>
      {/* 
        PERMANENT FIXED FULLSCREEN BACKGROUND VIDEO LAYER
        - Never changes DOM position or size on scroll
        - Never pauses when scrolling down
        - Video stays running continuously at 60fps
      */}
      <div
        className="fixed inset-0 w-full h-full z-0 overflow-hidden bg-black pointer-events-none select-none"
        aria-hidden="true"
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
      </div>

      {/* 
        CINEMATIC TINT OVERLAY:
        - When homescreen is visible: soft dark backdrop so dashboard cards are readable
      */}
      <div
        className={`fixed inset-0 pointer-events-none z-[1] transition-opacity duration-1000 ease-out ${
          isHomescreenVisible ? "opacity-100 bg-[#090a10]/75 backdrop-blur-[1px]" : "opacity-0"
        }`}
        aria-hidden="true"
      />

      {/* MINIMAL AMBIENT AUDIO PILL (Bottom-right, non-intrusive) */}
      {isHomescreenVisible && (
        <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#12131a]/90 border border-neutral-700/80 backdrop-blur-md shadow-2xl">
            <button
              onClick={togglePlay}
              className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
              title={isPlaying ? "Pause video" : "Resume video"}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={toggleSound}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono transition-all ${
                !isMuted
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold"
                  : "text-neutral-400 hover:text-white"
              }`}
              title={isMuted ? "Unmute Tron soundtrack" : "Mute soundtrack"}
            >
              {!isMuted ? (
                <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              ) : (
                <VolumeX className="w-3.5 h-3.5" />
              )}
              <span>{!isMuted ? "OST On" : "Muted"}</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
