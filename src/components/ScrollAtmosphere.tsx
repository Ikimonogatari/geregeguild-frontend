"use client";

import { useEffect } from "react";

/**
 * Writes scroll progress (0→1) to `--scroll-depth` on <html>, rAF-throttled.
 * The ember vignette in globals.css reads it to deepen as you descend.
 * No-op under reduced-motion. Works with Lenis (it drives native scroll).
 */
export default function ScrollAtmosphere() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = root.scrollHeight - window.innerHeight;
      const depth = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      root.style.setProperty("--scroll-depth", depth.toFixed(3));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
