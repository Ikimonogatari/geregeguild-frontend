"use client";

/* ────────────────────────────────────────────────────────────
   The Long Ride — painterly SVG scroll section.

   A ~450vh tall section with a sticky viewport-height stage.
   Four acts unfold as you scroll:

     ACT I   0.00–0.25   Dawn on the steppe          · horse rider
     ACT II  0.25–0.50   High sun in the Gobi        · camel rider
     ACT III 0.50–0.75   Overland into the Altai     · 4×4 vehicle
     ACT IV  0.75–1.00   Dusk, approach to the stupa · walking

   Layered SVG silhouettes on a color-interpolated sky, three
   depths of parallax mountains, atmospheric haze band, drifting
   clouds, distant birds, ovoo cairn with prayer scarves.

   Fully responsive — copy stacks into a bottom sheet with a
   dark scrim on mobile, side rails only above md.

   Respects prefers-reduced-motion.
   ──────────────────────────────────────────────────────────── */

import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useMemo, useRef } from "react";

const SECTION_HEIGHT_VH_DESKTOP = 450;

export default function TheLongRide() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, { stiffness: 55, damping: 22, mass: 0.6 });

  if (prefersReduced) return <ReducedFallback />;

  return (
    <section
      ref={wrapRef}
      aria-label="The long ride — a cinematic scroll through Mongolia"
      className="relative bg-background"
      style={{ height: `${SECTION_HEIGHT_VH_DESKTOP}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <Sky p={p} />
        <Rays p={p} />
        <Celestial p={p} />
        <Clouds p={p} />
        <StarField p={p} />
        <Birds p={p} />
        <FarRange p={p} />
        <MidRange p={p} />
        <NearRange p={p} />
        <HazeBand p={p} />
        <Ground p={p} />
        <Landmarks p={p} />
        <ForegroundDetail p={p} />
        <TravellerShadow p={p} />
        <Traveller p={p} />
        <ActChrome p={p} />
        <Vignette />
        <Grain />
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   SKY — color-interpolated gradient, dawn/day/dusk/night.
   ──────────────────────────────────────────────────────────── */

function Sky({ p }: { p: MotionValue<number> }) {
  const top = useTransform(
    p,
    [0, 0.12, 0.28, 0.52, 0.72, 0.88, 1],
    ["#2a0e05", "#4a1a09", "#7a3812", "#c66a2b", "#8b3a1a", "#1f0a08", "#050307"],
  );
  const mid = useTransform(
    p,
    [0, 0.12, 0.28, 0.52, 0.72, 0.88, 1],
    ["#8f4820", "#c46530", "#e69146", "#f4c374", "#c6663a", "#3a1712", "#0a0710"],
  );
  const bottom = useTransform(
    p,
    [0, 0.12, 0.28, 0.52, 0.72, 0.88, 1],
    ["#c9863a", "#e29e4a", "#f2b358", "#f9d488", "#e08246", "#5a1e10", "#0e0912"],
  );
  const background = useMotionTemplate`linear-gradient(180deg, ${top} 0%, ${mid} 55%, ${bottom} 100%)`;
  return <motion.div className="absolute inset-0" style={{ background }} />;
}

/* ────────────────────────────────────────────────────────────
   RAYS — soft radial light rays cast from the sun's position.
   ──────────────────────────────────────────────────────────── */

function Rays({ p }: { p: MotionValue<number> }) {
  const cx = useTransform(p, [0, 1], [15, 85]);
  const cy = useTransform(p, [0, 0.5, 1], [70, 20, 60]);
  const opacity = useTransform(p, [0, 0.1, 0.55, 0.75, 0.9], [0.35, 0.6, 0.85, 0.5, 0]);
  const bg = useMotionTemplate`radial-gradient(ellipse 120% 90% at ${cx}% ${cy}%, rgba(255,220,150,0.55) 0%, rgba(255,180,90,0.28) 20%, rgba(255,140,60,0) 55%)`;
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none mix-blend-screen"
      style={{ background: bg, opacity }}
      aria-hidden
    />
  );
}

/* ────────────────────────────────────────────────────────────
   CELESTIAL — sun/moon disc arcs across the sky.
   ──────────────────────────────────────────────────────────── */

function Celestial({ p }: { p: MotionValue<number> }) {
  const x = useTransform(p, [0, 1], ["10%", "88%"]);
  const y = useTransform(p, [0, 0.5, 1], ["72%", "16%", "62%"]);
  const scale = useTransform(p, [0, 0.5, 1], [1.6, 1.05, 1.4]);
  const opacity = useTransform(p, [0, 0.05, 0.9, 1], [0.85, 1, 1, 0.7]);
  const fill = useTransform(
    p,
    [0, 0.4, 0.7, 0.9, 1],
    ["#ffd9a1", "#fff2c8", "#ffb26a", "#e8ccb0", "#d9d9e6"],
  );
  const glow = useTransform(
    p,
    [0, 0.4, 0.9, 1],
    [
      "rgba(255, 200, 120, 0.75)",
      "rgba(255, 240, 200, 0.95)",
      "rgba(255, 160, 100, 0.65)",
      "rgba(200, 210, 240, 0.45)",
    ],
  );
  const filter = useMotionTemplate`drop-shadow(0 0 60px ${glow}) drop-shadow(0 0 24px ${glow})`;

  return (
    <motion.div
      className="absolute size-20 md:size-28 rounded-full will-change-transform"
      style={{
        left: x,
        top: y,
        translateX: "-50%",
        translateY: "-50%",
        scale,
        opacity,
        filter,
        backgroundColor: fill,
      }}
      aria-hidden
    />
  );
}

/* ────────────────────────────────────────────────────────────
   CLOUDS — two layers drifting at different speeds.
   ──────────────────────────────────────────────────────────── */

function Clouds({ p }: { p: MotionValue<number> }) {
  const xA = useTransform(p, [0, 1], ["0%", "-40%"]);
  const xB = useTransform(p, [0, 1], ["0%", "-20%"]);
  const opacity = useTransform(p, [0, 0.15, 0.55, 0.75, 0.9], [0.4, 0.75, 0.6, 0.3, 0]);
  return (
    <div className="absolute inset-x-0 top-[6%] h-[38%] pointer-events-none" aria-hidden>
      <motion.svg
        className="absolute inset-0 h-full w-[160%] will-change-transform"
        style={{ x: xA, opacity }}
        viewBox="0 0 1600 300"
        preserveAspectRatio="none"
      >
        {[
          { x: 80, y: 60, s: 1 },
          { x: 320, y: 90, s: 0.8 },
          { x: 640, y: 40, s: 1.2 },
          { x: 950, y: 100, s: 0.9 },
          { x: 1280, y: 70, s: 1.1 },
        ].map((c, i) => (
          <g key={i} transform={`translate(${c.x} ${c.y}) scale(${c.s})`}>
            <ellipse cx="60" cy="30" rx="80" ry="16" fill="rgba(255,230,190,0.55)" />
            <ellipse cx="30" cy="24" rx="30" ry="14" fill="rgba(255,230,190,0.6)" />
            <ellipse cx="95" cy="26" rx="26" ry="13" fill="rgba(255,230,190,0.55)" />
          </g>
        ))}
      </motion.svg>
      <motion.svg
        className="absolute inset-0 h-full w-[160%] will-change-transform"
        style={{ x: xB, opacity }}
        viewBox="0 0 1600 300"
        preserveAspectRatio="none"
      >
        {[
          { x: 150, y: 150, s: 1.4 },
          { x: 520, y: 180, s: 1 },
          { x: 880, y: 140, s: 1.3 },
          { x: 1250, y: 170, s: 1.1 },
        ].map((c, i) => (
          <g key={i} transform={`translate(${c.x} ${c.y}) scale(${c.s})`}>
            <ellipse cx="70" cy="24" rx="95" ry="12" fill="rgba(255,220,170,0.28)" />
            <ellipse cx="35" cy="20" rx="26" ry="11" fill="rgba(255,220,170,0.3)" />
            <ellipse cx="110" cy="22" rx="30" ry="10" fill="rgba(255,220,170,0.28)" />
          </g>
        ))}
      </motion.svg>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   BIRDS — a few Vs drifting across at midday.
   ──────────────────────────────────────────────────────────── */

function Birds({ p }: { p: MotionValue<number> }) {
  const x = useTransform(p, [0, 1], ["10%", "-30%"]);
  const opacity = useTransform(p, [0.15, 0.28, 0.55, 0.7], [0, 0.75, 0.75, 0]);
  return (
    <motion.div
      className="absolute top-[22%] left-0 w-[130%] h-[10%] pointer-events-none"
      style={{ x, opacity }}
      aria-hidden
    >
      <svg viewBox="0 0 1000 80" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        {[
          { x: 120, y: 30 },
          { x: 190, y: 50 },
          { x: 260, y: 26 },
          { x: 340, y: 44 },
          { x: 720, y: 34 },
          { x: 790, y: 20 },
        ].map((b, i) => (
          <motion.path
            key={i}
            d={`M ${b.x} ${b.y} Q ${b.x + 6} ${b.y - 6}, ${b.x + 12} ${b.y} Q ${b.x + 18} ${b.y - 6}, ${b.x + 24} ${b.y}`}
            stroke="rgba(20,10,6,0.65)"
            strokeWidth="1.4"
            strokeLinecap="round"
            fill="none"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2.6 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </svg>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────
   STARS — appear at dusk / night, twinkle softly.
   ──────────────────────────────────────────────────────────── */

function StarField({ p }: { p: MotionValue<number> }) {
  const opacity = useTransform(p, [0.65, 0.85, 1], [0, 0.75, 1]);
  const stars = useMemo(() => {
    return Array.from({ length: 64 }).map((_, i) => {
      const rx = ((i * 9301 + 49297) * 17) % 233280;
      const ry = ((i * 233280 + 3491) * 17) % 233280;
      return {
        x: (rx / 233280) * 100,
        y: (ry / 233280) * 55,
        size: 1 + ((i * 3) % 3) * 0.6,
        twinkle: 1.4 + (i % 5) * 0.6,
      };
    });
  }, []);
  return (
    <motion.svg
      className="absolute inset-0 h-full w-full"
      style={{ opacity }}
      aria-hidden
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
    >
      {stars.map((s, i) => (
        <motion.circle
          key={i}
          cx={s.x}
          cy={s.y}
          r={s.size * 0.06}
          fill="#f7f0dc"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: s.twinkle,
            repeat: Infinity,
            ease: "easeInOut",
            delay: (i % 7) * 0.3,
          }}
        />
      ))}
    </motion.svg>
  );
}

/* ────────────────────────────────────────────────────────────
   MOUNTAIN RANGES — 3 depths + haze band between.
   ──────────────────────────────────────────────────────────── */

function FarRange({ p }: { p: MotionValue<number> }) {
  const x = useTransform(p, [0, 1], ["0%", "-14%"]);
  const opacity = useTransform(p, [0, 0.1, 0.9, 1], [0.55, 0.7, 0.7, 0.4]);
  const snowOpacity = useTransform(p, [0.44, 0.55, 0.72, 0.82], [0, 0.85, 0.85, 0]);
  return (
    <motion.svg
      className="absolute inset-x-0 bottom-0 h-[55%] w-[128%] will-change-transform"
      style={{ x, opacity }}
      viewBox="0 0 1600 440"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="far-fill-v2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5a2a15" stopOpacity="0.9" />
          <stop offset="1" stopColor="#1c0d06" stopOpacity="1" />
        </linearGradient>
      </defs>
      <path
        d="M0 440 L0 240 Q 60 190, 130 220 T 260 210 Q 340 150, 420 200 T 560 180
           Q 640 120, 720 175 T 860 160 Q 940 100, 1020 165 T 1180 150 Q 1260 120, 1340 190
           T 1500 175 Q 1560 205, 1600 190 L 1600 440 Z"
        fill="url(#far-fill-v2)"
      />
      <motion.g style={{ opacity: snowOpacity }} fill="rgba(230,220,200,0.75)">
        <path d="M 400 200 L 430 175 L 448 205 Z" />
        <path d="M 720 175 L 740 148 L 762 178 Z" />
        <path d="M 1020 165 L 1042 138 L 1068 168 Z" />
        <path d="M 1340 190 L 1362 165 L 1385 195 Z" />
      </motion.g>
    </motion.svg>
  );
}

function MidRange({ p }: { p: MotionValue<number> }) {
  const x = useTransform(p, [0, 1], ["0%", "-24%"]);
  return (
    <motion.svg
      className="absolute inset-x-0 bottom-0 h-[45%] w-[144%] will-change-transform"
      style={{ x }}
      viewBox="0 0 1600 400"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="mid-fill-v2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a180c" stopOpacity="1" />
          <stop offset="1" stopColor="#100904" stopOpacity="1" />
        </linearGradient>
      </defs>
      <path
        d="M 0 400 L 0 320 Q 100 260, 200 305 Q 280 240, 380 280 Q 460 210, 560 260
           Q 640 210, 740 250 Q 820 180, 920 240 Q 1020 190, 1120 240 Q 1220 175, 1320 235
           Q 1420 205, 1520 245 Q 1580 265, 1600 250 L 1600 400 Z"
        fill="url(#mid-fill-v2)"
      />
      <path
        d="M 0 320 Q 100 260, 200 305 Q 280 240, 380 280 Q 460 210, 560 260
           Q 640 210, 740 250 Q 820 180, 920 240 Q 1020 190, 1120 240 Q 1220 175, 1320 235
           Q 1420 205, 1520 245 Q 1580 265, 1600 250"
        stroke="rgba(255,180,110,0.28)"
        strokeWidth="1.5"
        fill="none"
      />
    </motion.svg>
  );
}

function NearRange({ p }: { p: MotionValue<number> }) {
  const x = useTransform(p, [0, 1], ["0%", "-42%"]);
  return (
    <motion.svg
      className="absolute inset-x-0 bottom-0 h-[36%] w-[180%] will-change-transform"
      style={{ x }}
      viewBox="0 0 1800 360"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="near-fill-v2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1e0d06" />
          <stop offset="1" stopColor="#050301" />
        </linearGradient>
      </defs>
      <path
        d="M 0 360 L 0 300 Q 90 258, 180 292 T 360 282 Q 450 240, 540 288 T 720 270
           Q 810 232, 900 282 T 1080 268 Q 1170 220, 1260 275 T 1440 260 Q 1530 232, 1620 272
           T 1800 260 L 1800 360 Z"
        fill="url(#near-fill-v2)"
      />
    </motion.svg>
  );
}

/* ────────────────────────────────────────────────────────────
   HAZE BAND — warm mist at the horizon.
   ──────────────────────────────────────────────────────────── */

function HazeBand({ p }: { p: MotionValue<number> }) {
  const opacity = useTransform(p, [0, 0.1, 0.5, 0.8, 1], [0.55, 0.75, 0.8, 0.55, 0.2]);
  const color = useTransform(
    p,
    [0, 0.4, 0.7, 1],
    [
      "linear-gradient(180deg, rgba(255,180,110,0) 0%, rgba(255,180,110,0.35) 45%, rgba(255,180,110,0) 100%)",
      "linear-gradient(180deg, rgba(255,210,140,0) 0%, rgba(255,210,140,0.5) 45%, rgba(255,210,140,0) 100%)",
      "linear-gradient(180deg, rgba(240,120,80,0) 0%, rgba(240,120,80,0.4) 45%, rgba(240,120,80,0) 100%)",
      "linear-gradient(180deg, rgba(90,80,120,0) 0%, rgba(90,80,120,0.35) 45%, rgba(90,80,120,0) 100%)",
    ],
  );
  return (
    <motion.div
      aria-hidden
      className="absolute inset-x-0 h-[10%] bottom-[52vh] sm:bottom-[46vh] lg:bottom-[38vh] pointer-events-none"
      style={{ background: color, opacity }}
    />
  );
}

/* ────────────────────────────────────────────────────────────
   GROUND — the plane the traveller crosses.
   ──────────────────────────────────────────────────────────── */

function Ground({ p }: { p: MotionValue<number> }) {
  const x = useTransform(p, [0, 1], ["0%", "-80%"]);
  const grassOpacity = useTransform(p, [0, 0.22, 0.35, 0.55, 0.7, 1], [1, 1, 0.15, 0.15, 0.35, 0.9]);
  const sandOpacity = useTransform(p, [0.22, 0.35, 0.55, 0.65], [0, 1, 1, 0]);
  const boulderOpacity = useTransform(p, [0.5, 0.6, 0.72, 0.8], [0, 1, 1, 0]);

  return (
    <>
      <div className="absolute inset-x-0 bottom-0 h-[36vh] sm:h-[30vh] lg:h-[22vh] bg-[#0d0603]" aria-hidden />
      <div
        className="absolute inset-x-0 bottom-[36vh] sm:bottom-[30vh] lg:bottom-[22vh] h-4 bg-gradient-to-t from-[#0d0603] to-transparent pointer-events-none"
        aria-hidden
      />
      <motion.svg
        className="absolute inset-x-0 bottom-0 h-[34vh] sm:h-[28vh] lg:h-[20vh] w-[300%] will-change-transform"
        style={{ x }}
        viewBox="0 0 3000 140"
        preserveAspectRatio="none"
        aria-hidden
      >
        <motion.g style={{ opacity: grassOpacity }} fill="#1c0d06">
          {Array.from({ length: 110 }).map((_, i) => {
            const cx = i * 27 + ((i * 37) % 20);
            const h = 3 + ((i * 13) % 10);
            const w = 2 + ((i * 7) % 3);
            return (
              <g key={`g-${i}`}>
                <path d={`M ${cx} 140 L ${cx - w} ${140 - h} L ${cx} ${140 - h - 2} L ${cx + w} ${140 - h} Z`} />
                {i % 4 === 0 && (
                  <path
                    d={`M ${cx + 1} 140 Q ${cx + 3} ${140 - h - 4}, ${cx + 5} ${140 - h - 8}`}
                    stroke="#1c0d06"
                    strokeWidth="1"
                    fill="none"
                  />
                )}
              </g>
            );
          })}
        </motion.g>
        <motion.g style={{ opacity: sandOpacity }}>
          {Array.from({ length: 45 }).map((_, i) => {
            const cx = i * 67 + ((i * 41) % 30);
            return (
              <g key={`s-${i}`}>
                <path
                  d={`M ${cx} 132 Q ${cx + 15} 122, ${cx + 30} 132 T ${cx + 60} 132`}
                  stroke="#1c0d06"
                  strokeWidth="1.5"
                  fill="none"
                  opacity="0.85"
                />
                <path
                  d={`M ${cx + 2} 128 Q ${cx + 15} 120, ${cx + 28} 128`}
                  stroke="rgba(200,120,60,0.35)"
                  strokeWidth="1"
                  fill="none"
                />
              </g>
            );
          })}
        </motion.g>
        <motion.g style={{ opacity: boulderOpacity }} fill="#08040a">
          {[100, 340, 620, 940, 1220, 1540, 1860, 2200, 2560, 2820].map((cx, i) => {
            const w = 24 + ((i * 11) % 18);
            const h = 12 + ((i * 7) % 8);
            return (
              <path
                key={`b-${i}`}
                d={`M ${cx} 140 Q ${cx + w * 0.15} ${140 - h * 1.2}, ${cx + w * 0.5} ${140 - h} Q ${cx + w * 0.85} ${140 - h * 1.15}, ${cx + w} 140 Z`}
              />
            );
          })}
        </motion.g>
      </motion.svg>
    </>
  );
}

/* ────────────────────────────────────────────────────────────
   LANDMARKS — ger cluster, dune, ovoo cairn, monastery
   ──────────────────────────────────────────────────────────── */

function Landmarks({ p }: { p: MotionValue<number> }) {
  const gerOpacity = useTransform(p, [0.02, 0.08, 0.22, 0.28], [0, 1, 1, 0]);
  const duneOpacity = useTransform(p, [0.28, 0.34, 0.48, 0.54], [0, 1, 1, 0]);
  const ovooOpacity = useTransform(p, [0.55, 0.62, 0.72, 0.78], [0, 1, 1, 0]);
  const stupaOpacity = useTransform(p, [0.72, 0.82, 0.98, 1], [0, 1, 1, 1]);
  const stupaScale = useTransform(p, [0.72, 1], [0.7, 1.3]);
  const stupaGlow = useTransform(p, [0.72, 0.9, 1], [0, 0.6, 0.9]);
  const stupaFilter = useMotionTemplate`drop-shadow(0 0 32px rgba(201,146,42,${stupaGlow}))`;

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      {/* Ger cluster + smoke */}
      <motion.svg
        style={{ opacity: gerOpacity }}
        className="absolute bottom-[36vh] sm:bottom-[30vh] lg:bottom-[22vh] left-[45%] sm:left-[55%] lg:left-[62%] h-[7vh] sm:h-[9vh] lg:h-[11vh] max-w-[40vw]"
        viewBox="0 0 360 100"
        preserveAspectRatio="xMidYEnd meet"
      >
        <g>
          {[0, 90, 175, 250].map((tx, i) => {
            const s = 1 - i * 0.05;
            return (
              <g key={i} transform={`translate(${tx}, 0) scale(${s})`}>
                <path d="M 0 78 Q 30 30, 60 78 Z" fill="#0d0603" />
                <path d="M 8 60 Q 30 42, 52 60" stroke="#2a1409" strokeWidth="2" fill="none" />
                <rect x="24" y="56" width="12" height="22" fill="#c9922a" opacity="0.55" />
                <line x1="30" y1="12" x2="30" y2="0" stroke="#0d0603" strokeWidth="2.5" />
                <motion.path
                  d="M 30 0 Q 36 -8, 32 -18 Q 26 -26, 34 -34"
                  stroke="rgba(255,220,190,0.65)"
                  strokeWidth="2"
                  fill="none"
                  animate={{ opacity: [0.35, 0.7, 0.35] }}
                  transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                />
              </g>
            );
          })}
          <g transform="translate(75, 62)" fill="#08040a">
            <circle cx="0" cy="0" r="2.5" />
            <path d="M -2 3 L 2 3 L 3 16 L -3 16 Z" />
          </g>
        </g>
      </motion.svg>

      {/* Dune — Gobi phase. Flush to the right edge, no palm on top. */}
      <motion.svg
        style={{ opacity: duneOpacity }}
        className="absolute bottom-[36vh] sm:bottom-[30vh] lg:bottom-[22vh] right-0 h-[18vh] sm:h-[22vh] lg:h-[26vh] w-[42vw] max-w-[560px]"
        viewBox="0 0 560 260"
        preserveAspectRatio="xMaxYEnd meet"
      >
        <defs>
          <linearGradient id="dune-lg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8b4a20" />
            <stop offset="0.55" stopColor="#4a2612" />
            <stop offset="1" stopColor="#160a05" />
          </linearGradient>
          <linearGradient id="dune-shadow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="rgba(0,0,0,0.5)" />
            <stop offset="1" stopColor="rgba(0,0,0,0)" />
          </linearGradient>
        </defs>
        {/* Dune body — long sweeping curve to the right edge */}
        <path
          d="M 0 260 Q 140 80, 320 130 Q 440 155, 560 130 L 560 260 Z"
          fill="url(#dune-lg)"
        />
        {/* Windward shadow on the leeward face */}
        <path
          d="M 0 260 Q 140 80, 320 130 L 320 260 Z"
          fill="url(#dune-shadow)"
        />
        {/* Warm crest highlight following the ridgeline */}
        <path
          d="M 40 260 Q 170 130, 320 148 Q 440 168, 560 148"
          stroke="rgba(255,200,140,0.55)"
          strokeWidth="1.8"
          fill="none"
        />
      </motion.svg>

      {/* Ovoo cairn with prayer scarves */}
      <motion.svg
        style={{ opacity: ovooOpacity }}
        className="absolute bottom-[36vh] sm:bottom-[30vh] lg:bottom-[22vh] left-[6%] sm:left-[10%] lg:left-[12%] h-[13vh] sm:h-[16vh] lg:h-[22vh]"
        viewBox="0 0 140 200"
        preserveAspectRatio="xMinYEnd meet"
      >
        <g fill="#0d0603">
          <path d="M 50 200 L 38 170 L 55 155 L 72 140 L 88 155 L 96 175 L 92 200 Z" />
          <path d="M 60 155 L 55 138 L 68 128 L 82 138 L 85 155 Z" />
          <path d="M 65 128 L 62 115 L 74 108 L 80 115 L 78 128 Z" />
          <path
            d="M 55 170 L 62 168 M 65 155 L 72 152 M 68 138 L 74 135"
            stroke="rgba(180,100,60,0.25)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </g>
        <line x1="70" y1="108" x2="70" y2="20" stroke="#1c0d06" strokeWidth="2.5" />
        <motion.path
          d="M 70 32 Q 108 44, 96 62 Q 78 68, 70 50 Z"
          fill="#c9922a"
          opacity="0.6"
          animate={{ opacity: [0.4, 0.75, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M 70 44 Q 34 52, 46 70 Q 62 74, 70 60 Z"
          fill="#8b5e3c"
          opacity="0.55"
          animate={{ opacity: [0.7, 0.4, 0.7] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M 70 58 Q 96 66, 90 78 Q 78 82, 70 72 Z"
          fill="#5a3a24"
          opacity="0.55"
          animate={{ opacity: [0.35, 0.7, 0.35] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.svg>

      {/* Monastery / stupa */}
      <motion.svg
        style={{ opacity: stupaOpacity, scale: stupaScale, filter: stupaFilter }}
        className="absolute bottom-[36vh] sm:bottom-[30vh] lg:bottom-[22vh] left-1/2 -translate-x-1/2 h-[28vh] sm:h-[34vh] lg:h-[46vh] origin-bottom"
        viewBox="0 0 280 360"
        preserveAspectRatio="xMidYEnd meet"
      >
        <g fill="#0d0603">
          <path d="M 10 320 Q 140 300, 270 320 L 280 340 L 0 340 Z" fill="#1c0d06" />
          <rect x="30" y="290" width="220" height="30" />
          <rect x="70" y="220" width="140" height="70" />
          <path d="M 45 220 Q 90 200, 140 195 Q 190 200, 235 220 L 220 213 Q 190 198, 140 193 Q 90 198, 60 213 Z" />
          <rect x="95" y="170" width="90" height="50" />
          <path d="M 78 170 Q 115 152, 140 148 Q 165 152, 202 170 L 190 164 Q 165 150, 140 146 Q 115 150, 90 164 Z" />
          <rect x="115" y="120" width="50" height="50" />
          <path d="M 100 120 Q 122 106, 140 102 Q 158 106, 180 120 L 168 116 Q 158 104, 140 100 Q 122 104, 112 116 Z" />
          <line x1="140" y1="100" x2="140" y2="52" stroke="#0d0603" strokeWidth="3.5" />
          <circle cx="140" cy="50" r="5" />
          <circle cx="140" cy="62" r="3" />
          <circle cx="140" cy="74" r="3" />
          <rect x="90" y="240" width="12" height="24" fill="#c9922a" opacity="0.65" />
          <rect x="118" y="240" width="12" height="24" fill="#c9922a" opacity="0.65" />
          <rect x="146" y="240" width="12" height="24" fill="#c9922a" opacity="0.65" />
          <rect x="174" y="240" width="12" height="24" fill="#c9922a" opacity="0.65" />
          <rect x="115" y="185" width="30" height="22" fill="#c9922a" opacity="0.7" />
          <rect x="150" y="185" width="20" height="22" fill="#c9922a" opacity="0.7" />
          <path d="M 120 290 L 160 290 L 168 320 L 112 320 Z" fill="#1c0d06" />
        </g>
      </motion.svg>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   TRAVELLER SHADOW — pulsing cast shadow beneath the mount
   ──────────────────────────────────────────────────────────── */

function TravellerShadow({ p: _p }: { p: MotionValue<number> }) {
  return (
    <div className="absolute inset-0 flex items-end justify-center pb-[36vh] sm:pb-[30vh] lg:pb-[20vh] pointer-events-none" aria-hidden>
      <motion.div
        className="w-[22vw] max-w-[260px] min-w-[150px] h-3 rounded-[50%] blur-md"
        style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0.8), rgba(0,0,0,0) 65%)" }}
        animate={{ scaleX: [1, 0.94, 1], opacity: [0.7, 0.9, 0.7] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   TRAVELLER — layered SVG mounts crossfading per act
   ──────────────────────────────────────────────────────────── */

function Traveller({ p }: { p: MotionValue<number> }) {
  const horseO = useTransform(p, [0, 0.18, 0.24], [1, 1, 0]);
  const camelO = useTransform(p, [0.2, 0.28, 0.44, 0.5], [0, 1, 1, 0]);
  const uazO = useTransform(p, [0.46, 0.54, 0.68, 0.76], [0, 1, 1, 0]);
  const walkerO = useTransform(p, [0.72, 0.82, 1], [0, 1, 1]);

  return (
    <div className="absolute inset-0 flex items-end justify-center pb-[36vh] sm:pb-[30vh] lg:pb-[20vh]" aria-hidden>
      <motion.div
        className="relative w-[52vw] max-w-[360px] min-w-[180px] sm:w-[38vw] lg:w-[30vw] aspect-[220/120]"
        animate={{ y: [0, -4, 0, -3, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <DustPlume />
        <MountHorse opacity={horseO} />
        <MountCamel opacity={camelO} />
        <MountUAZ opacity={uazO} />
        <MountWalker opacity={walkerO} />
      </motion.div>
    </div>
  );
}

function MountHorse({ opacity }: { opacity: MotionValue<number> }) {
  return (
    <motion.svg
      style={{ opacity }}
      className="absolute inset-0 h-full w-full drop-shadow-[0_12px_20px_rgba(0,0,0,0.75)]"
      viewBox="0 0 220 120"
      preserveAspectRatio="xMidYMax meet"
    >
      {/* Cast shadow directly under the hooves */}
      <ellipse cx="105" cy="119" rx="70" ry="2.8" fill="rgba(0,0,0,0.65)" />

      {/* Body — tight barrel, correct horse proportions */}
      <path
        d="M 62 75
           Q 62 62, 78 60
           L 132 60
           Q 148 60, 152 72
           Q 148 82, 132 82
           L 78 82
           Q 62 82, 62 75 Z"
        fill="#080306"
      />
      {/* Under-belly darker band */}
      <path d="M 68 80 L 146 80 L 146 82 L 68 82 Z" fill="#1c0d06" />

      {/* Rump — round hindquarters */}
      <ellipse cx="65" cy="70" rx="16" ry="16" fill="#080306" />
      {/* Chest — bulging forward */}
      <ellipse cx="148" cy="72" rx="12" ry="14" fill="#080306" />

      {/* Neck — arching from withers up to head */}
      <path
        d="M 148 65
           Q 168 42, 180 34
           L 188 40
           Q 176 50, 162 65
           Z"
        fill="#080306"
      />

      {/* Head — muzzle profile */}
      <path
        d="M 178 32
           L 200 32
           Q 206 33, 206 38
           L 202 46
           L 190 47
           Q 182 45, 180 40
           Z"
        fill="#080306"
      />
      {/* Muzzle lighter */}
      <path d="M 195 40 L 206 38 L 204 47 L 195 46 Z" fill="#1c0d06" />
      <circle cx="203" cy="42" r="0.9" fill="#2a1409" />
      {/* Eye */}
      <circle cx="188" cy="36" r="0.9" fill="#c9922a" opacity="0.85" />

      {/* Ear — pointed forward */}
      <path d="M 183 30 L 182 20 L 189 27 Z" fill="#080306" />

      {/* Mane — flowing on the neck */}
      <path
        d="M 158 58
           L 155 46 L 162 52
           L 158 40 L 168 48
           L 168 36 L 178 44
           L 182 30 L 186 40
           L 182 52
           Z"
        fill="#080306"
      />
      <path
        d="M 168 54 Q 172 44, 180 42"
        stroke="#2a1409"
        strokeWidth="1.1"
        fill="none"
      />
      {/* Forelock */}
      <path d="M 184 30 L 186 22 L 190 28 L 192 22 L 192 30 Z" fill="#080306" />

      {/* Tail — flowing behind the rump */}
      <path
        d="M 50 68
           Q 32 66, 20 82
           Q 14 92, 22 94
           Q 32 82, 48 74
           Z"
        fill="#080306"
      />
      <path
        d="M 24 78 Q 20 88, 22 94"
        stroke="#2a1409"
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M 34 70 Q 28 78, 28 84"
        stroke="#2a1409"
        strokeWidth="0.9"
        fill="none"
      />

      {/* Legs — two front, two rear, straight down to y=118 */}
      {/* rear pair (near tail, x ~ 68 / 82) */}
      <rect x="66" y="80" width="7" height="38" rx="1.2" fill="#080306" />
      <rect x="82" y="80" width="7" height="38" rx="1.2" fill="#080306" />
      {/* front pair (near chest, x ~ 128 / 142) */}
      <rect x="126" y="80" width="7" height="38" rx="1.2" fill="#080306" />
      <rect x="140" y="80" width="7" height="38" rx="1.2" fill="#080306" />
      {/* Front-facing rim light on legs */}
      <rect x="72" y="82" width="0.9" height="32" fill="rgba(255,180,110,0.3)" />
      <rect x="88" y="82" width="0.9" height="32" fill="rgba(255,180,110,0.25)" />
      <rect x="132" y="82" width="0.9" height="32" fill="rgba(255,180,110,0.32)" />
      <rect x="146" y="82" width="0.9" height="32" fill="rgba(255,180,110,0.28)" />

      {/* Hooves — flat pads at bottom */}
      <rect x="65" y="115" width="9" height="4" rx="1" fill="#0d0603" />
      <rect x="81" y="115" width="9" height="4" rx="1" fill="#0d0603" />
      <rect x="125" y="115" width="9" height="4" rx="1" fill="#0d0603" />
      <rect x="139" y="115" width="9" height="4" rx="1" fill="#0d0603" />

      {/* Back rim highlight along the top */}
      <path
        d="M 62 62 Q 90 58, 108 60 Q 134 60, 148 65 Q 162 60, 176 50"
        stroke="rgba(255,180,110,0.55)"
        strokeWidth="1.5"
        fill="none"
      />

      {/* Saddle — under the rider */}
      <path
        d="M 88 58 L 118 58 Q 124 58, 124 62 L 124 66 Q 118 68, 88 68 Q 84 66, 84 62 Q 84 58, 88 58 Z"
        fill="#3a1a0c"
      />
      <path
        d="M 88 60 L 122 60"
        stroke="rgba(255,180,110,0.3)"
        strokeWidth="0.6"
        fill="none"
      />

      {/* ── Rider ─────────────────────────────────────── */}
      {/* Torso — deel */}
      <path d="M 92 40 L 118 40 L 122 60 L 88 60 Z" fill="#080306" />
      {/* Shadow side */}
      <path d="M 106 40 L 118 40 L 122 60 L 110 60 Z" fill="#1c0d06" />
      {/* Front seam highlight */}
      <path d="M 92 42 L 90 58" stroke="rgba(255,180,110,0.3)" strokeWidth="0.7" fill="none" />

      {/* Gold sash */}
      <path
        d="M 86 52 Q 105 55, 124 51 L 124 55 Q 105 59, 86 56 Z"
        fill="#c9922a"
      />
      <path
        d="M 86 54 Q 105 57, 124 53"
        stroke="#8b5e3c"
        strokeWidth="0.5"
        fill="none"
      />

      {/* Head */}
      <circle cx="103" cy="30" r="7" fill="#080306" />
      <path d="M 104 30 Q 108 32, 107 36 Q 103 38, 100 34 Z" fill="#1c0d06" />

      {/* Loovuuz hat */}
      <path d="M 95 26 L 103 12 L 111 20 L 109 28 L 96 28 Z" fill="#080306" />
      <path d="M 93 28 L 113 28 L 113 31 L 93 31 Z" fill="#080306" />
      <path d="M 94 28 L 112 28 L 112 30 L 94 30 Z" fill="#2a1409" />
      <circle cx="103" cy="12" r="1.8" fill="#c9922a" />

      {/* Arm forward with reins */}
      <path d="M 118 44 L 148 50 L 154 54 L 148 56 L 118 50 Z" fill="#080306" />
      <path
        d="M 118 45 L 148 51"
        stroke="rgba(255,180,110,0.3)"
        strokeWidth="0.6"
        fill="none"
      />

      {/* Rein line to mouth */}
      <path
        d="M 154 54 Q 175 48, 200 42"
        stroke="#080306"
        strokeWidth="1.5"
        fill="none"
      />
    </motion.svg>
  );
}

function MountCamel({ opacity }: { opacity: MotionValue<number> }) {
  return (
    <motion.svg
      style={{ opacity }}
      className="absolute inset-0 h-full w-full drop-shadow-[0_12px_20px_rgba(0,0,0,0.75)]"
      viewBox="0 0 220 120"
      preserveAspectRatio="xMidYMax meet"
    >
      {/* Cast shadow */}
      <ellipse cx="105" cy="119" rx="66" ry="2.8" fill="rgba(0,0,0,0.65)" />

      {/* Continuous camel silhouette — belly, humps, and shoulder all in
          one closed shape so it doesn't read as stacked blocks. */}
      <path
        d="M 47 80
           Q 47 74, 54 72
           Q 58 68, 62 68
           Q 68 46, 82 46
           Q 96 46, 96 68
           Q 100 66, 106 68
           Q 108 68, 112 68
           Q 118 46, 132 46
           Q 146 46, 146 68
           Q 150 66, 156 70
           Q 162 68, 168 66
           Q 178 58, 184 40
           Q 186 30, 192 24
           L 198 28
           Q 192 36, 190 44
           Q 186 56, 178 66
           Q 172 72, 162 76
           L 158 80
           Q 158 82, 155 82
           L 50 82
           Q 47 82, 47 80
           Z"
        fill="#080306"
      />

      {/* Head — small, elongated muzzle */}
      <path
        d="M 182 22
           L 200 22
           Q 204 24, 202 28
           L 198 32
           L 186 32
           Q 180 30, 180 26
           Z"
        fill="#080306"
      />
      <path d="M 194 28 L 202 26 L 200 32 L 194 32 Z" fill="#1c0d06" />
      <circle cx="200" cy="26" r="0.9" fill="#2a1409" />
      <circle cx="187" cy="26" r="0.9" fill="#c9922a" opacity="0.85" />

      {/* Small pointed ear */}
      <path d="M 184 20 L 184 12 L 190 18 Z" fill="#080306" />

      {/* Under-belly darker */}
      <path d="M 50 80 L 155 80 L 155 82 L 50 82 Z" fill="#1c0d06" />

      {/* 4 long thin legs — slightly angled */}
      <rect x="54" y="80" width="5" height="38" rx="1" fill="#080306" />
      <rect x="66" y="80" width="5" height="38" rx="1" fill="#080306" />
      <rect x="132" y="80" width="5" height="38" rx="1" fill="#080306" />
      <rect x="144" y="80" width="5" height="38" rx="1" fill="#080306" />
      {/* Front-facing rim */}
      <rect x="58.5" y="82" width="0.8" height="34" fill="rgba(255,200,140,0.28)" />
      <rect x="70.5" y="82" width="0.8" height="34" fill="rgba(255,200,140,0.25)" />
      <rect x="136.5" y="82" width="0.8" height="34" fill="rgba(255,200,140,0.28)" />
      <rect x="148.5" y="82" width="0.8" height="34" fill="rgba(255,200,140,0.25)" />

      {/* Split-toe padded feet */}
      <path d="M 51 115 L 62 115 L 61 118 L 52 118 Z" fill="#0d0603" />
      <line x1="56.5" y1="115" x2="56.5" y2="118" stroke="#080306" strokeWidth="0.8" />
      <path d="M 63 115 L 74 115 L 73 118 L 64 118 Z" fill="#0d0603" />
      <line x1="68.5" y1="115" x2="68.5" y2="118" stroke="#080306" strokeWidth="0.8" />
      <path d="M 129 115 L 140 115 L 139 118 L 130 118 Z" fill="#0d0603" />
      <line x1="134.5" y1="115" x2="134.5" y2="118" stroke="#080306" strokeWidth="0.8" />
      <path d="M 141 115 L 152 115 L 151 118 L 142 118 Z" fill="#0d0603" />
      <line x1="146.5" y1="115" x2="146.5" y2="118" stroke="#080306" strokeWidth="0.8" />

      {/* Tail with tuft */}
      <path
        d="M 47 74 Q 34 78, 26 84 Q 24 90, 30 90 L 34 86 L 32 90 L 38 86 Z"
        fill="#080306"
      />

      {/* Hump rim highlights (sun on top) */}
      <path
        d="M 62 74 Q 62 56, 78 52 Q 92 52, 92 74"
        stroke="rgba(255,200,140,0.55)"
        strokeWidth="1.4"
        fill="none"
      />
      <path
        d="M 112 74 Q 112 54, 128 50 Q 142 50, 142 74"
        stroke="rgba(255,200,140,0.55)"
        strokeWidth="1.4"
        fill="none"
      />

      {/* Neck ridge highlight */}
      <path
        d="M 158 74 Q 172 58, 180 44"
        stroke="rgba(255,200,140,0.4)"
        strokeWidth="1"
        fill="none"
      />

      {/* ── Rider — sits between the humps ──────────── */}
      {/* Saddle rug */}
      <path
        d="M 92 66 L 112 66 L 116 74 L 88 74 Z"
        fill="#3a1a0c"
      />
      {/* Body */}
      <path d="M 92 46 L 112 46 L 114 66 L 90 66 Z" fill="#080306" />
      <path d="M 104 46 L 112 46 L 114 66 L 106 66 Z" fill="#1c0d06" />
      {/* Sash */}
      <path
        d="M 90 56 Q 102 58, 114 55 L 114 59 Q 102 62, 90 60 Z"
        fill="#c9922a"
      />
      {/* Head */}
      <circle cx="102" cy="38" r="6.5" fill="#080306" />
      <path d="M 103 38 Q 107 40, 106 44 Q 102 46, 99 42 Z" fill="#1c0d06" />
      {/* Hat */}
      <path d="M 95 34 L 102 22 L 110 30 L 108 36 L 96 36 Z" fill="#080306" />
      <path d="M 93 36 L 111 36 L 111 39 L 93 39 Z" fill="#080306" />
      <path d="M 94 36 L 110 36 L 110 38 L 94 38 Z" fill="#2a1409" />
      <circle cx="102" cy="22" r="1.7" fill="#c9922a" />
      {/* Arm forward with halter rope */}
      <path d="M 112 50 L 140 52 L 146 56 L 140 58 L 112 54 Z" fill="#080306" />
      {/* Rope up to camel head */}
      <path d="M 146 56 Q 170 44, 194 26" stroke="#080306" strokeWidth="1.4" fill="none" />
    </motion.svg>
  );
}

function MountUAZ({ opacity }: { opacity: MotionValue<number> }) {
  return (
    <motion.svg
      style={{ opacity }}
      className="absolute inset-0 h-full w-full drop-shadow-[0_14px_22px_rgba(0,0,0,0.8)]"
      viewBox="0 0 220 120"
      preserveAspectRatio="xMidYMax meet"
    >
      <ellipse cx="105" cy="118" rx="80" ry="3" fill="rgba(0,0,0,0.65)" />
      <rect x="24" y="88" width="160" height="6" fill="#050206" />
      <path
        d="M 22 60
           L 22 88
           L 194 88
           L 194 60
           Q 194 56, 190 56
           L 172 56
           L 166 42
           Q 164 38, 158 38
           L 62 38
           Q 56 38, 54 42
           L 48 56
           L 26 56
           Q 22 56, 22 60 Z"
        fill="#050206"
      />
      <path d="M 58 42 L 92 42 L 96 56 L 60 56 Z" fill="#c9922a" opacity="0.6" />
      <path d="M 100 42 L 158 42 L 162 56 L 104 56 Z" fill="#c9922a" opacity="0.6" />
      <path
        d="M 58 42 L 92 42 L 96 56 L 60 56 Z M 100 42 L 158 42 L 162 56 L 104 56 Z"
        stroke="#050206"
        strokeWidth="1.6"
        fill="none"
      />
      <line x1="96" y1="42" x2="100" y2="56" stroke="#050206" strokeWidth="1.5" />
      <circle cx="82" cy="50" r="3.5" fill="#050206" />
      <path d="M 78 53 L 86 53 L 88 60 L 76 60 Z" fill="#050206" />
      <line x1="130" y1="42" x2="132" y2="88" stroke="#050206" strokeWidth="1.4" />
      <rect x="140" y="70" width="6" height="1.5" fill="#c9922a" opacity="0.7" />
      <g fill="#050206">
        <rect x="34" y="66" width="12" height="1.2" />
        <rect x="34" y="70" width="12" height="1.2" />
        <rect x="34" y="74" width="12" height="1.2" />
      </g>
      <rect x="54" y="32" width="108" height="4" fill="#050206" />
      <rect x="58" y="20" width="22" height="12" fill="#050206" />
      <rect x="84" y="14" width="30" height="18" fill="#050206" />
      <rect x="118" y="22" width="18" height="10" fill="#050206" />
      <rect x="140" y="26" width="18" height="6" fill="#050206" />
      <line x1="62" y1="14" x2="62" y2="34" stroke="#3a1a0c" strokeWidth="0.8" />
      <line x1="98" y1="10" x2="98" y2="34" stroke="#3a1a0c" strokeWidth="0.8" />
      <line x1="24" y1="42" x2="24" y2="86" stroke="#050206" strokeWidth="1.8" />
      <line x1="20" y1="48" x2="28" y2="48" stroke="#050206" strokeWidth="1.2" />
      <line x1="20" y1="56" x2="28" y2="56" stroke="#050206" strokeWidth="1.2" />
      <line x1="20" y1="64" x2="28" y2="64" stroke="#050206" strokeWidth="1.2" />
      <line x1="20" y1="72" x2="28" y2="72" stroke="#050206" strokeWidth="1.2" />
      <circle cx="14" cy="76" r="8" fill="#050206" />
      <circle cx="14" cy="76" r="4" fill="#1c0d06" />
      <circle cx="14" cy="76" r="1.5" fill="#3a1a0c" />
      <rect x="188" y="78" width="10" height="12" fill="#050206" />
      <path
        d="M 194 78 L 200 78 L 200 88 L 194 88 Z M 194 82 L 200 82"
        stroke="#050206"
        strokeWidth="1.5"
        fill="none"
      />
      <circle cx="188" cy="66" r="5" fill="#050206" />
      <circle cx="188" cy="66" r="3.5" fill="#f0d78a" />
      <circle cx="180" cy="82" r="1.5" fill="#c9922a" />
      <path d="M 194 66 L 218 60 L 218 80 L 194 76 Z" fill="rgba(255,220,140,0.35)" />
      {[52, 152].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="102" r="16" fill="#050206" />
          <circle cx={cx} cy="102" r="13" fill="none" stroke="#0d0603" strokeWidth="1" />
          <circle cx={cx} cy="102" r="9" fill="#1c0d06" />
          <circle cx={cx} cy="102" r="3" fill="#3a1a0c" />
          <circle cx={cx} cy="102" r="1" fill="#c9922a" />
          <g stroke="#050206" strokeWidth="1.5">
            <line x1={cx} y1="94" x2={cx} y2="110" />
            <line x1={cx - 8} y1="102" x2={cx + 8} y2="102" />
            <line x1={cx - 6} y1="96" x2={cx + 6} y2="108" />
            <line x1={cx + 6} y1="96" x2={cx - 6} y2="108" />
          </g>
        </g>
      ))}
      <path
        d="M 22 60 L 48 56 L 54 42 Q 56 38, 62 38 L 158 38 Q 164 38, 166 42 L 172 56 L 194 60"
        stroke="rgba(255,180,110,0.4)"
        strokeWidth="1.4"
        fill="none"
      />
      <path d="M 26 62 L 190 62" stroke="rgba(255,180,110,0.18)" strokeWidth="0.6" fill="none" />
    </motion.svg>
  );
}

function MountWalker({ opacity }: { opacity: MotionValue<number> }) {
  return (
    <motion.svg
      style={{ opacity }}
      className="absolute inset-0 h-full w-full drop-shadow-[0_12px_20px_rgba(0,0,0,0.75)]"
      viewBox="0 0 220 120"
      preserveAspectRatio="xMidYMax meet"
    >
      <ellipse cx="105" cy="118" rx="18" ry="1.6" fill="rgba(0,0,0,0.55)" />
      <motion.g
        animate={{ y: [0, -1.5, 0, -1, 0] }}
        transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M 92 42 L 84 44 L 82 76 L 94 78 L 96 44 Z" fill="#050206" />
        <path d="M 88 42 L 88 34 L 94 32" stroke="#3a1a0c" strokeWidth="1.4" fill="none" />
        <path d="M 84 50 L 92 52 L 91 62 L 83 60 Z" fill="#1c0d06" />
        <path d="M 92 42 L 96 44 L 94 78" stroke="rgba(255,180,110,0.3)" strokeWidth="0.8" fill="none" />
        <path d="M 88 38 L 108 38 L 116 92 L 82 92 Z" fill="#050206" />
        <path d="M 100 38 L 108 38 L 116 92 L 104 92 L 100 38 Z" fill="#1c0d06" />
        <path d="M 98 40 L 100 92" stroke="rgba(0,0,0,0.6)" strokeWidth="0.6" fill="none" />
        <path d="M 87 44 L 87 88" stroke="rgba(255,180,110,0.4)" strokeWidth="0.8" fill="none" />
        <path d="M 82 82 L 116 82" stroke="rgba(0,0,0,0.35)" strokeWidth="0.6" fill="none" />
        <path d="M 82 62 Q 98 66, 116 60 L 116 68 Q 98 72, 82 68 Z" fill="#c9922a" />
        <path d="M 82 64 Q 98 68, 116 62" stroke="#8b5e3c" strokeWidth="0.6" fill="none" />
        <path d="M 112 62 L 118 60 L 120 64 L 116 66 Z" fill="#c9922a" />
        <path d="M 118 62 L 122 66" stroke="#c9922a" strokeWidth="1" />
        <rect x="88" y="92" width="8" height="22" rx="1" fill="#050206" />
        <rect x="102" y="92" width="8" height="22" rx="1" fill="#050206" />
        <rect x="88" y="94" width="1" height="18" fill="rgba(255,180,110,0.3)" />
        <rect x="102" y="94" width="1" height="18" fill="rgba(255,180,110,0.3)" />
        <path d="M 84 114 L 100 114 L 100 118 L 84 118 Z" fill="#0d0603" />
        <path d="M 100 114 L 116 114 L 116 118 L 100 118 Z" fill="#0d0603" />
        <path d="M 108 42 L 120 84 L 126 84 L 116 42 Z" fill="#050206" />
        <path d="M 108 44 L 120 82" stroke="rgba(255,180,110,0.3)" strokeWidth="0.7" fill="none" />
        <circle cx="98" cy="30" r="8" fill="#050206" />
        <path d="M 100 30 Q 106 32, 105 38 Q 100 40, 96 36 Z" fill="#1c0d06" />
        <path d="M 96 34 L 102 38 L 100 38" stroke="#050206" strokeWidth="1" fill="none" />
        <path d="M 90 26 L 98 8 L 110 20 L 108 30 L 92 30 Z" fill="#050206" />
        <path d="M 88 30 L 112 30 L 112 33 L 88 33 Z" fill="#050206" />
        <path d="M 89 30 L 111 30 L 111 32 L 89 32 Z" fill="#2a1409" />
        <circle cx="98" cy="8" r="2" fill="#c9922a" />
        <line x1="122" y1="8" x2="128" y2="118" stroke="#050206" strokeWidth="2.6" />
        <line x1="123" y1="8" x2="127" y2="118" stroke="rgba(255,180,110,0.35)" strokeWidth="0.5" />
        <path d="M 126 68 L 138 70 L 136 80 L 124 78 Z" fill="#050206" />
        <path d="M 128 68 L 136 70" stroke="#c9922a" strokeWidth="0.8" />
        <path d="M 127 70 L 129 78" stroke="rgba(255,180,110,0.35)" strokeWidth="0.6" fill="none" />
      </motion.g>
    </motion.svg>
  );
}

function DustPlume() {
  return (
    <div className="absolute left-[-12%] bottom-[4%] size-[85%] pointer-events-none" aria-hidden>
      <motion.div
        className="absolute inset-0 rounded-full blur-2xl"
        style={{
          background:
            "radial-gradient(ellipse at 30% 65%, rgba(255,180,110,0.32), rgba(255,180,110,0) 55%)",
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.75, 0.5] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
      />
      {[
        { x: "10%", y: "40%", d: 3.8, s: 4 },
        { x: "22%", y: "60%", d: 4.6, s: 3 },
        { x: "6%", y: "70%", d: 3.2, s: 2 },
      ].map((pt, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="absolute rounded-full"
          style={{ left: pt.x, top: pt.y, width: pt.s, height: pt.s, background: "rgba(255,220,180,0.5)" }}
          animate={{ y: [0, -18, -30], opacity: [0, 0.6, 0], x: [0, -6, -12] }}
          transition={{ duration: pt.d, repeat: Infinity, ease: "easeOut", delay: i * 0.6 }}
        />
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   FOREGROUND — thin band of blurred grass in front for depth
   ──────────────────────────────────────────────────────────── */

function ForegroundDetail({ p }: { p: MotionValue<number> }) {
  const x = useTransform(p, [0, 1], ["0%", "-140%"]);
  return (
    <motion.svg
      className="absolute inset-x-0 bottom-0 h-[8%] w-[400%] pointer-events-none will-change-transform"
      style={{ x, filter: "blur(1.5px)", opacity: 0.75 }}
      viewBox="0 0 4000 60"
      preserveAspectRatio="none"
      aria-hidden
    >
      <g fill="#000">
        {Array.from({ length: 220 }).map((_, i) => {
          const cx = i * 18 + ((i * 11) % 12);
          const h = 5 + ((i * 17) % 12);
          return (
            <path
              key={i}
              d={`M ${cx} 60 L ${cx - 2} ${60 - h} L ${cx} ${60 - h - 3} L ${cx + 2} ${60 - h} Z`}
            />
          );
        })}
      </g>
    </motion.svg>
  );
}

/* ────────────────────────────────────────────────────────────
   ACT CHROME
   ──────────────────────────────────────────────────────────── */

const ACTS = [
  {
    numeral: "I",
    country: "The Steppe",
    title: "Dawn breaks over Khentii",
    body: "Grass to every horizon. The horse knows the way better than any map. Ride until the ger camp glows.",
  },
  {
    numeral: "II",
    country: "The Gobi",
    title: "Sun at the top of the sky",
    body: "Dunes hum in the heat. The camel picks the shade. We drink from the flask, then move on.",
  },
  {
    numeral: "III",
    country: "The Altai",
    title: "Overland into the West",
    body: "The road becomes a suggestion. The engine rattles. Distances stretch and shrink with the light.",
  },
  {
    numeral: "IV",
    country: "The Sanctuary",
    title: "Dusk, and a light on the hill",
    body: "The last stretch is on foot. A lamp burns in the monastery. The bell will find you before you find it.",
  },
] as const;

function ActChrome({ p }: { p: MotionValue<number> }) {
  const op0 = useTransform(p, [0.0, 0.05, 0.2, 0.24], [0, 1, 1, 0]);
  const op1 = useTransform(p, [0.24, 0.3, 0.44, 0.5], [0, 1, 1, 0]);
  const op2 = useTransform(p, [0.5, 0.56, 0.68, 0.74], [0, 1, 1, 0]);
  const op3 = useTransform(p, [0.74, 0.8, 1.0, 1.0], [0, 1, 1, 1]);
  const opacities = [op0, op1, op2, op3];

  const y0 = useTransform(p, [0.0, 0.05, 0.2, 0.24], [24, 0, 0, -18]);
  const y1 = useTransform(p, [0.24, 0.3, 0.44, 0.5], [24, 0, 0, -18]);
  const y2 = useTransform(p, [0.5, 0.56, 0.68, 0.74], [24, 0, 0, -18]);
  const y3 = useTransform(p, [0.74, 0.8, 1.0, 1.0], [24, 0, 0, 0]);
  const ys = [y0, y1, y2, y3];

  return (
    <>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[6%] left-4 md:top-auto md:bottom-6 md:right-8 md:left-auto">
          <div className="relative">
            {ACTS.map((a, i) => (
              <motion.span
                key={a.numeral}
                style={{ opacity: opacities[i] }}
                className="absolute right-0 bottom-0 font-heading text-accent/25 leading-none select-none"
                aria-hidden
              >
                <span className="block text-[clamp(3rem,12vw,16rem)] tracking-[0.05em]">
                  {a.numeral}
                </span>
              </motion.span>
            ))}
          </div>
        </div>
      </div>

      <div
        className="lg:hidden absolute inset-x-0 bottom-0 h-[38%] pointer-events-none"
        aria-hidden
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(10,4,2,0.65) 45%, rgba(10,4,2,0.85) 100%)",
        }}
      />
      <div className="lg:hidden absolute inset-x-0 bottom-0 px-5 pb-8 pt-4">
        <div className="relative min-h-[190px]">
          {ACTS.map((a, i) => (
            <motion.div
              key={a.numeral}
              style={{ opacity: opacities[i], y: ys[i] }}
              className="absolute inset-x-0 bottom-0"
            >
              <p className="font-accent italic text-accent text-[11px] tracking-[0.35em] uppercase mb-2">
                Chapter {a.numeral} · {a.country}
              </p>
              <h3 className="font-heading text-2xl uppercase tracking-[0.05em] text-foreground leading-[1.1] ember-text-glow">
                {a.title}
              </h3>
              <div className="ink-divider mt-4 max-w-[160px]" />
              <p className="mt-3 font-serif italic text-foreground/85 text-[14.5px] leading-[1.75]">
                {a.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Desktop text — mid-screen left, only on lg+ where there's room */}
      <div className="hidden lg:flex absolute inset-y-0 left-0 items-center pl-14 xl:pl-20 pointer-events-none">
        <div className="relative w-[min(440px,32vw)] min-h-[280px]">
          {ACTS.map((a, i) => (
            <motion.div
              key={a.numeral}
              style={{ opacity: opacities[i], y: ys[i] }}
              className="absolute left-0 top-0 w-full"
            >
              <p className="font-accent italic text-accent text-[11px] tracking-[0.42em] uppercase mb-3">
                Chapter {a.numeral} · {a.country}
              </p>
              <h3 className="font-heading text-2xl lg:text-4xl uppercase tracking-[0.06em] text-foreground leading-[1.1] ember-text-glow">
                {a.title}
              </h3>
              <div className="ink-divider mt-4 max-w-[180px]" />
              <p className="mt-3 font-serif italic text-foreground/85 text-[15px] lg:text-[16px] leading-[1.8] max-w-sm">
                {a.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="hidden lg:block absolute top-1/2 right-10 -translate-y-1/2 pointer-events-none">
        <div className="flex flex-col gap-6">
          {ACTS.map((a, i) => (
            <ActTick key={a.numeral} p={p} act={i} label={a.country} />
          ))}
        </div>
      </div>
    </>
  );
}

function ActTick({ p, act, label }: { p: MotionValue<number>; act: number; label: string }) {
  const bounds = ([
    [0.0, 0.24],
    [0.24, 0.5],
    [0.5, 0.74],
    [0.74, 1.0],
  ][act] as [number, number]);
  const on = useTransform(p, bounds, [0, 1]);
  const dot = useTransform(on, (v) => (v > 0.5 ? "#C9922A" : "rgba(201,146,42,0.28)"));
  const width = useTransform(on, [0, 1], ["1.5rem", "3rem"]);
  const textOp = useTransform(on, [0, 1], [0.35, 1]);
  return (
    <div className="flex items-center gap-3">
      <motion.span aria-hidden className="block h-px" style={{ width, backgroundColor: dot }} />
      <motion.span
        style={{ opacity: textOp }}
        className="font-accent italic text-[11px] tracking-[0.3em] uppercase text-foreground/85 whitespace-nowrap"
      >
        {label}
      </motion.span>
    </div>
  );
}

/* ─── Vignette + grain ─────────────────────────────────────── */

function Vignette() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          "radial-gradient(ellipse 90% 100% at 50% 55%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.6) 100%)",
      }}
    />
  );
}

function Grain() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-25"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
      }}
    />
  );
}

/* ─── Reduced motion fallback ─────────────────────────────── */

function ReducedFallback() {
  return (
    <section className="relative py-24 px-6 bg-background">
      <div className="max-w-4xl mx-auto text-center mb-14">
        <p className="font-accent italic text-accent text-[13px] tracking-[0.4em] uppercase">
          The Long Ride
        </p>
        <h2 className="mt-4 font-heading text-3xl sm:text-5xl uppercase tracking-[0.08em] text-foreground ember-text-glow">
          Four countries, one road
        </h2>
        <div className="ink-divider mt-8 max-w-md mx-auto" />
      </div>
      <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-8">
        {ACTS.map((a) => (
          <div key={a.numeral} className="border border-highlight/40 bg-surface/50 p-6 ember-glow">
            <p className="font-accent italic text-accent text-[12px] tracking-[0.35em] uppercase">
              Chapter {a.numeral} · {a.country}
            </p>
            <h3 className="mt-2 font-heading text-2xl uppercase tracking-[0.06em] text-foreground">
              {a.title}
            </h3>
            <p className="mt-3 font-serif italic text-foreground/85 text-[15px] leading-relaxed">
              {a.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
