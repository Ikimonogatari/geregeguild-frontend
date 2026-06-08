"use client";

import { useEffect, useRef, useState } from "react";

type Spark = { id: number; x: number; y: number; size: number; drift: number };

export default function EmberCursorTrail() {
  const [sparks, setSparks] = useState<Spark[]>([]);
  const idRef = useRef(0);
  const lastEmit = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (reduced || isTouch) return;

    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastEmit.current < 28) return;
      lastEmit.current = now;
      const id = ++idRef.current;
      const size = 3 + Math.random() * 4;
      const drift = (Math.random() - 0.5) * 22;
      const x = e.clientX + (Math.random() - 0.5) * 6;
      const y = e.clientY + (Math.random() - 0.5) * 6;
      setSparks((prev) => {
        const next = prev.concat({ id, x, y, size, drift });
        return next.length > 24 ? next.slice(next.length - 24) : next;
      });
      window.setTimeout(() => {
        setSparks((prev) => prev.filter((s) => s.id !== id));
      }, 950);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none z-[100]"
      style={{ mixBlendMode: "screen" }}
    >
      {sparks.map((s) => (
        <span
          key={s.id}
          style={{
            position: "absolute",
            left: s.x,
            top: s.y,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: "rgba(255, 218, 140, 0.95)",
            boxShadow:
              "0 0 8px 1px rgba(255, 200, 110, 0.85), 0 0 18px 4px rgba(201, 146, 42, 0.55)",
            transform: "translate(-50%, -50%)",
            animation: "spark-die 950ms ease-out forwards",
            ["--drift" as string]: `${s.drift}px`,
          }}
        />
      ))}
    </div>
  );
}
