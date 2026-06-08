"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const SIZE = 64;
const HALF = SIZE / 2;

/**
 * A wax-seal / compass sigil that lags behind the cursor with spring physics,
 * slowly rotates, and ignites + grows when over interactive elements.
 */
export default function CompassFollower() {
  const [enabled, setEnabled] = useState(false);
  const [hovered, setHovered] = useState(false);

  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 220, damping: 28, mass: 0.55 });
  const sy = useSpring(y, { stiffness: 220, damping: 28, mass: 0.55 });

  const scale = useSpring(1, { stiffness: 220, damping: 22 });
  const opacity = useSpring(0, { stiffness: 220, damping: 26 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (reduced || isTouch) return;
    setEnabled(true);

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX - HALF);
      y.set(e.clientY - HALF);
      opacity.set(1);
      const el = e.target as Element | null;
      const isInteractive = !!el?.closest(
        "a, button, [role='button'], input, textarea, label, summary"
      );
      setHovered(isInteractive);
    };

    const onLeave = () => opacity.set(0);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [x, y, opacity]);

  useEffect(() => {
    scale.set(hovered ? 1.65 : 1);
  }, [hovered, scale]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 pointer-events-none z-[98]"
      style={{ x: sx, y: sy, opacity, mixBlendMode: "screen" }}
    >
      <motion.div style={{ scale }}>
        <motion.svg
          width={SIZE}
          height={SIZE}
          viewBox="0 0 64 64"
          animate={{ rotate: 360 }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          style={{ filter: "drop-shadow(0 0 10px rgba(201,146,42,0.65))" }}
        >
          {/* Outer wax ring */}
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="rgba(201,146,42,0.32)"
            strokeWidth="0.7"
          />
          {/* Inner runic ring (dashed) */}
          <circle
            cx="32"
            cy="32"
            r="22"
            fill="none"
            stroke="rgba(201,146,42,0.6)"
            strokeWidth="0.6"
            strokeDasharray="1.6 5"
          />
          {/* 8-point compass star */}
          <g fill="rgba(255,215,135,0.78)">
            <polygon points="32,6 33.2,30 32,32 30.8,30" />
            <polygon points="58,32 34,33.2 32,32 34,30.8" />
            <polygon points="32,58 30.8,34 32,32 33.2,34" />
            <polygon points="6,32 30,30.8 32,32 30,33.2" />
            <polygon
              points="50.4,13.6 35,29 32,32 30,30 32,28"
              opacity="0.55"
            />
            <polygon
              points="13.6,13.6 30,30 32,32 29,30 28,28"
              opacity="0.55"
            />
            <polygon
              points="50.4,50.4 34,34 32,32 35,34 36,36"
              opacity="0.55"
            />
            <polygon
              points="13.6,50.4 30,33 32,32 29,33 27,36"
              opacity="0.55"
            />
          </g>
          {/* Glowing core */}
          <circle cx="32" cy="32" r="2.4" fill="rgba(255,225,160,0.95)" />
          <circle cx="32" cy="32" r="1.2" fill="rgba(255,250,220,1)" />
        </motion.svg>
      </motion.div>
    </motion.div>
  );
}
