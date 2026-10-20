import { useEffect, useRef } from "react";

/**
 * Muted, looping background video without controls.
 * React does not reliably reflect `muted` as an attribute, and browsers only autoplay muted
 * video, so the property is set explicitly and playback started after hydration.
 */
export function AutoplayVideo({ src, className }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {
      // Autoplay can still be blocked (e.g. low-power mode); the poster frame stays visible.
    });
  }, []);

  return (
    <video ref={ref} className={className} autoPlay muted loop playsInline preload="auto">
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}
