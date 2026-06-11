"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { Journey } from "@/lib/journeys";
import { CATEGORY_SIGIL } from "@/lib/journeys";
import { formatPrice } from "@/lib/format";
import { EASE, DUR, STAGGER } from "@/lib/motion";
import JourneyQuickLook from "./JourneyQuickLook";

type Props = {
  journey: Journey;
  index?: number;
};

// Hand-curved "map routes" — one per card index. Each ends at a destination star.
const ROUTES: { d: string; ex: number; ey: number; sx: number; sy: number }[] = [
  { d: "M 24 168 Q 100 96, 184 138 T 332 56",   sx: 24, sy: 168, ex: 332, ey: 56  },
  { d: "M 28 56  Q 124 132, 204 88  T 372 168", sx: 28, sy: 56,  ex: 372, ey: 168 },
  { d: "M 24 142 C 110 32, 196 196, 372 52",    sx: 24, sy: 142, ex: 372, ey: 52  },
  { d: "M 28 50  Q 134 178, 222 122 T 372 60",  sx: 28, sy: 50,  ex: 372, ey: 60  },
  { d: "M 32 168 Q 96 72, 204 138 T 380 78",    sx: 32, sy: 168, ex: 380, ey: 78  },
  { d: "M 28 78  C 102 198, 204 32, 372 152",   sx: 28, sy: 78,  ex: 372, ey: 152 },
];

export default function JourneyCard({ journey, index = 0 }: Props) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const isCustom = journey.category === "Custom";
  const route = ROUTES[index % ROUTES.length];

  const ref = useRef<HTMLButtonElement>(null);
  // Normalized cursor pos within the card: 0..1
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  // Tilt — subtle, cinematic parchment angle (~3° max each axis).
  const rotateX = useTransform(my, [0, 1], [3, -3]);
  const rotateY = useTransform(mx, [0, 1], [-3, 3]);
  const sRotX = useSpring(rotateX, { stiffness: 120, damping: 18, mass: 0.6 });
  const sRotY = useSpring(rotateY, { stiffness: 120, damping: 18, mass: 0.6 });

  // Firelight position — percent strings used as CSS vars on hover
  const fireX = useTransform(mx, (v) => `${v * 100}%`);
  const fireY = useTransform(my, (v) => `${v * 100}%`);

  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };

  const handleLeave = () => {
    mx.set(0.5);
    my.set(0.5);
    setHovered(false);
  };

  return (
    <>
      <motion.button
        ref={ref}
        type="button"
        onClick={() => setOpen(true)}
        onMouseMove={handleMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleLeave}
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: DUR.base, delay: index * STAGGER.tight, ease: EASE }}
        style={{
          rotateX: sRotX,
          rotateY: sRotY,
          transformPerspective: 1100,
          transformStyle: "preserve-3d",
          ["--mx" as string]: fireX,
          ["--my" as string]: fireY,
        }}
        className="group relative text-left w-full bg-surface/60 border border-highlight/40 hover:border-accent/70 transition-[border-color,box-shadow] duration-500 ember-glow overflow-hidden flex flex-col will-change-transform hover:shadow-[0_0_0_1px_rgba(201,146,42,0.45),0_0_40px_-6px_rgba(201,146,42,0.6),0_30px_70px_-22px_rgba(0,0,0,0.85)]"
      >
        {/* Cursor-tracked firelight wash — sits over everything, screen blend */}
        <span aria-hidden className="card-firelight" />

        {/* Ember-rim top sweep — ignites on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(201,146,42,0) 12%, rgba(201,146,42,0.9) 50%, rgba(201,146,42,0) 88%, transparent 100%)",
            backgroundSize: "200% 100%",
            animation: "ember-trace 3.5s linear infinite",
          }}
        />

        {/* Image plate — pushed slightly out of plane for parallax depth */}
        <div
          className="relative h-[208px] w-full overflow-hidden vignette"
          style={{ transform: "translateZ(28px)" }}
        >
          <img
            src={journey.image}
            alt={journey.title}
            className="w-full h-full object-cover grayscale-[15%] sepia-[28%] brightness-[0.82] transition-all duration-700 group-hover:brightness-[0.95] group-hover:scale-[1.06]"
          />
          {/* Slow ember wash bottom-up on hover */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{
              background:
                "linear-gradient(to top, rgba(201,146,42,0.22), transparent 70%)",
            }}
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-surface to-transparent" />

          {/* Map route — ember trail that draws itself across the plate on hover */}
          <svg
            aria-hidden
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 400 208"
            preserveAspectRatio="none"
          >
            {/* Origin wax-seal */}
            <motion.circle
              cx={route.sx}
              cy={route.sy}
              r={4.5}
              fill="rgba(255, 215, 135, 1)"
              style={{ filter: "drop-shadow(0 0 8px rgba(201,146,42,0.95))" }}
              initial={{ opacity: 0, scale: 0 }}
              animate={hovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            />
            {/* The trail itself */}
            <motion.path
              d={route.d}
              stroke="rgba(255, 215, 135, 0.95)"
              strokeWidth={2.4}
              strokeLinecap="round"
              fill="none"
              style={{ filter: "drop-shadow(0 0 8px rgba(201,146,42,0.9))" }}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={
                hovered
                  ? { pathLength: 1, opacity: 1 }
                  : { pathLength: 0, opacity: 0 }
              }
              transition={{
                pathLength: { duration: 1.4, ease: [0.2, 0.7, 0.2, 1], delay: hovered ? 0.15 : 0 },
                opacity: { duration: 0.25, delay: hovered ? 0.1 : 0 },
              }}
            />
            {/* Destination — pulsing landing star */}
            <motion.circle
              cx={route.ex}
              cy={route.ey}
              r={7}
              fill="rgba(255, 225, 160, 1)"
              style={{ filter: "drop-shadow(0 0 14px rgba(201,146,42,1))" }}
              initial={{ opacity: 0, scale: 0 }}
              animate={
                hovered
                  ? { opacity: [0, 1, 0.85], scale: [0, 1.4, 1] }
                  : { opacity: 0, scale: 0 }
              }
              transition={{ duration: 0.7, delay: hovered ? 1.4 : 0, ease: "easeOut" }}
            />
            <motion.circle
              cx={route.ex}
              cy={route.ey}
              r={2.6}
              fill="rgba(255, 250, 220, 1)"
              initial={{ opacity: 0 }}
              animate={hovered ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.3, delay: hovered ? 1.5 : 0 }}
            />
          </svg>

          <div className="absolute top-3 left-3 flex items-center gap-2 bg-background/70 backdrop-blur-sm border border-accent/30 group-hover:border-accent/70 transition-colors duration-500 px-3 py-1.5">
            <span className="text-accent text-base leading-none transition-all duration-500 group-hover:[text-shadow:0_0_12px_rgba(201,146,42,0.85)]">
              {CATEGORY_SIGIL[journey.category]}
            </span>
            <span className="font-accent uppercase tracking-[0.22em] text-[10px] text-foreground/90">
              {journey.category}
            </span>
          </div>
          <span className="absolute bottom-3 right-3 font-accent italic text-accent text-[12px] tracking-[0.2em] uppercase">
            {journey.region}
          </span>
        </div>

        {/* Body — title floats slightly forward */}
        <div className="p-6 flex flex-col flex-1" style={{ transform: "translateZ(14px)" }}>
          <h3 className="font-heading uppercase tracking-[0.08em] text-[21px] leading-tight text-foreground group-hover:text-accent transition-colors duration-500 line-clamp-2 min-h-[2.5em] flex items-start">
            {journey.title}
          </h3>
          <p className="mt-3 text-foreground/80 text-[15px] leading-relaxed font-serif italic line-clamp-3 min-h-[4.9em]">
            {journey.hook}
          </p>

          <div className="ink-divider my-5" />

          {isCustom ? (
            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
              <Stat label="Region" value="Anywhere" />
              <Stat label="Season" value="Any" />
              <Stat label="Difficulty" value="Your call" />
              <Stat label="Vehicle" value="Matched" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
              <Stat label="Duration" value={`${journey.days} days`} />
              <Stat label="Distance" value={`${journey.distanceKm} km`} />
              <Stat label="Difficulty" value={journey.difficulty} />
              <Stat label="Best season" value={journey.season.split("·")[0].trim()} />
            </div>
          )}

          <div className="mt-auto pt-4 border-t border-highlight/30 flex items-center justify-between">
            <span className="font-accent uppercase tracking-[0.2em] text-[11px] text-muted">
              {isCustom ? "By design" : "From"}{" "}
              <span className="text-accent not-italic">
                {isCustom ? "" : formatPrice(journey.priceFrom)}
              </span>
            </span>
            <span className="font-accent uppercase tracking-[0.25em] text-[11px] text-accent inline-flex items-center gap-1.5 group-hover:translate-x-1 transition-transform duration-300 group-hover:[text-shadow:0_0_10px_rgba(201,146,42,0.7)]">
              Quick look <span className="inline-block group-hover:translate-x-0.5 transition-transform duration-500">→</span>
            </span>
          </div>
        </div>
      </motion.button>

      <JourneyQuickLook journey={journey} open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="font-accent uppercase tracking-[0.2em] text-[9px] text-muted">
        {label}
      </span>
      <span className="font-serif text-foreground text-[14px] leading-tight mt-0.5">
        {value}
      </span>
    </div>
  );
}
