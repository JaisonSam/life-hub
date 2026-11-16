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
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showControls, setShowControls] = useState(false);

  // Send command to YouTube IFrame API via postMessage
  const postCommand = (func: string, args: any[] = []) => {
    try {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: "command", func, args }),
          "*"
        );
      }
    } catch {}
  };

  const toggleSound = () => {
    if (isMuted) {
      postCommand("unMute");
      postCommand("setVolume", [70]);
      setIsMuted(false);
    } else {
      postCommand("mute");
      setIsMuted(true);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      postCommand("pauseVideo");
      setIsPlaying(false);
    } else {
      postCommand("playVideo");
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    // Start clip at 0:09 (9 seconds)
    const clipStart = 9;
    const clipEnd = 95; // 1:35
    const clipDurationMs = (clipEnd - clipStart) * 1000; // 86,000ms

    // Initial seek and play
    const initTimer = setTimeout(() => {
      postCommand("seekTo", [clipStart, true]);
      postCommand("mute");
      postCommand("playVideo");
      setVideoLoaded(true);
      if (onVideoReady) onVideoReady();
    }, 1200);

    // Loop timer: seek back to 0:09 every 86 seconds
    const loopInterval = setInterval(() => {
      postCommand("seekTo", [clipStart, true]);
      postCommand("playVideo");
    }, clipDurationMs);

    // Also listen for YouTube state change postMessages as fallback loop
    const handleMessage = (event: MessageEvent) => {
      try {
        if (typeof event.data === "string") {
          const data = JSON.parse(event.data);
          // 0 = YT.PlayerState.ENDED
          if (data.event === "onStateChange" && data.info === 0) {
            postCommand("seekTo", [clipStart, true]);
            postCommand("playVideo");
          }
        }
      } catch {}
    };

    window.addEventListener("message", handleMessage);

    return () => {
      clearTimeout(initTimer);
      clearInterval(loopInterval);
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <>
      {/* Fixed Fullscreen YouTube Background Video Layer */}
      <div
        className="fixed inset-0 overflow-hidden pointer-events-none -z-20 bg-black"
        aria-hidden="true"
      >
        <div className="relative w-full h-full">
          <iframe
            ref={iframeRef}
            src="https://www.youtube-nocookie.com/embed/loGNj5jJBTQ?enablejsapi=1&autoplay=1&mute=1&controls=0&disablekb=1&fs=0&loop=1&playlist=loGNj5jJBTQ&start=9&end=95&modestbranding=1&playsinline=1&rel=0&iv_load_policy=3"
            title="Tron Motorcycle Intro Background"
            className="absolute top-1/2 left-1/2 pointer-events-none select-none"
            style={{
              width: "max(100vw, 177.78vh)",
              height: "max(100vh, 56.25vw)",
              transform: "translate(-50%, -50%) scale(1.08)",
              border: "none",
            }}
            allow="autoplay; encrypted-media"
          />
        </div>
      </div>

      {/* Cinematic Tint Overlay: Transitions from clear during 5s video intro to readable backdrop for homescreen */}
      <div
        className={`fixed inset-0 pointer-events-none -z-10 transition-all duration-1000 ease-out ${
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
