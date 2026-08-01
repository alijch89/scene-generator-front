"use client";

import { cn } from "@/lib/utils";
import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "۰:۰۰";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function AudioPlayer({
  src,
  title,
  variant = "full",
}: {
  src: string;
  title?: string;
  variant?: "compact" | "full";
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Reset playback state during render when the track changes (React's
  // recommended pattern for state that depends on a prop), then let the
  // effect below do the one real side effect: telling the <audio> element
  // to reload its new source.
  const [trackedSrc, setTrackedSrc] = useState(src);
  if (trackedSrc !== src) {
    setTrackedSrc(src);
    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }
  useEffect(() => {
    audioRef.current?.load();
  }, [src]);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) void audio.play();
    else audio.pause();
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3.5",
        variant === "compact" && "rounded-full py-2 pe-4",
      )}
    >
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onEnded={() => setPlaying(false)}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "توقف" : "پخش"}
        className="grid size-11 shrink-0 place-items-center rounded-full bg-[var(--primary)] text-[var(--primary-ink)]"
      >
        {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
      </button>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        {title && (
          <span className="truncate text-sm font-semibold">{title}</span>
        )}
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime}
          onChange={(e) => {
            const audio = audioRef.current;
            if (!audio) return;
            audio.currentTime = Number(e.target.value);
            setCurrentTime(audio.currentTime);
          }}
          className="h-1.5 w-full accent-[var(--primary)]"
        />
      </div>
      <span className="shrink-0 text-xs text-[var(--ink-3)]" dir="ltr">
        {formatTime(currentTime)}/{formatTime(duration)}
      </span>
    </div>
  );
}
