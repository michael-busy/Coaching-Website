import { useEffect, useRef } from "react";

/** Muted looping background video. React doesn't reliably set `muted`, which autoplay needs. */
export function AutoplayVideo({ src, className }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {}); // can still be blocked, e.g. in low-power mode
  }, []);

  return (
    <video ref={ref} className={className} autoPlay muted loop playsInline preload="auto">
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}
