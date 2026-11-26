"use client";

import { useEffect, useRef } from "react";

/** A muted, looping background clip. Plays only while on screen; shows the poster for reduced motion. */
export function LoopVideo({ id, className = "", eager = false, rate = 1 }: { id: string; className?: string; eager?: boolean; rate?: number }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    v.muted = true;
    v.defaultMuted = true;
    v.playbackRate = rate;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) {
          v.pause();
          return;
        }
        if (!v.currentSrc) {
          const mobile = window.matchMedia("(max-width: 767px)").matches;
          v.src = mobile ? `/media/${id}-s.mp4` : `/media/${id}.mp4`;
          v.preload = eager ? "auto" : "metadata";
          v.load();
        }
        v.play().catch(() => {});
      },
      { rootMargin: "150px 0px", threshold: 0.15 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [rate]);

  return (
    <video
      ref={ref}
      className={`absolute inset-0 h-full w-full object-cover ${className}`}
      poster={`/media/${id}.jpg`}
      muted
      loop
      playsInline
      preload="none"
      autoPlay={eager}
      disablePictureInPicture
      aria-hidden
      tabIndex={-1}
    />
  );
}
