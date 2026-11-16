"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Play, Pause, Film } from "lucide-react";

interface TronBackgroundVideoProps {
  isHomescreenVisible: boolean;
  onVideoReady?: () => void;
}

export default function TronBackgroundVideo({
  isHomescreenVisible,
  onVideoReady,
}: TronBackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(false);

  const toggleSound = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.muted = false;
      videoRef.current.volume = 0.75;
      setIsMuted(false);
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Autoplay muted immediately for 100% browser compatibility (iOS, Safari, Chrome)
    const startPlay = () => {
      video.play().catch((err) => {
        console.warn("Video autoplay prevented:", err);
      });
      if (onVideoReady) onVideoReady();
    };

    if (video.readyState >= 2) {
      startPlay();
    } else {
      video.addEventListener("loadeddata", startPlay, { once: true });
    }

    // Safety restart on loop
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
      {/* Fixed Fullscreen Native Background Video Layer (0:09 - 1:35 scene) */}
      <div
        className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-black"
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

      {/* Cinematic Tint Overlay: Transitions from clear during 5s video intro to readable dark backdrop for homescreen */}
      <div
        className={`fixed inset-0 pointer-events-none z-[1] transition-all duration-1000 ease-out ${
          isHomescreenVisible
            ? "bg-[#090a10]/75 backdrop-blur-[1.5px]"
            : "bg-black/10"
        }`}
        aria-hidden="true"
      />

      {/* Floating Ambient Controls Pill (Visible once homescreen is loaded) */}
      {isHomescreenVisible && (
        <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
          {showControls && (
            <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#14151b]/90 border border-neutral-700/80 backdrop-blur-md shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
              {/* Play / Pause Toggle */}
              <button
                onClick={togglePlay}
                className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
                title={isPlaying ? "Pause background video" : "Resume background video"}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>

              {/* Sound Toggle (Daft Punk Soundtrack) */}
              <button
                onClick={toggleSound}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono transition-all ${
                  isMuted
                    ? "text-neutral-400 hover:text-white"
                    : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold"
                }`}
                title={isMuted ? "Unmute Tron soundtrack" : "Mute Tron soundtrack"}
              >
                {isMuted ? (
                  <VolumeX className="w-3.5 h-3.5" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                )}
                <span>{isMuted ? "Sound: Off" : "Tron OST"}</span>
              </button>
            </div>
          )}

          {/* Master Ambient Badge Trigger */}
          <button
            onClick={() => setShowControls((prev) => !prev)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#12131a]/85 hover:bg-[#1a1b24] border border-cyan-500/30 text-cyan-300 text-xs font-mono backdrop-blur-md transition-all shadow-xl hover:border-cyan-400"
            title="Tron Background Ambience Controls"
          >
            <Film className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline text-[11px] font-medium">TRON AMBIENCE</span>
          </button>
        </div>
      )}
    </>
  );
}
