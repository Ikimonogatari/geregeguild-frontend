"use client";

/* ────────────────────────────────────────────────────────────
   The Long Ride — editorial split-screen scroll with
   cinematic 3D scroll motion.

   Layout (desktop, md+):
     · LEFT column (40%, sticky)  — chapter navigator + active
       chapter text. Cross-fade between chapters includes a
       subtle rotateX tilt so the transition feels 3D, not flat.
     · RIGHT column (60%)         — four full-bleed photograph
       panels. Right column carries a CSS `perspective` so its
       children genuinely inhabit 3D space. Each panel is scroll-
       tied: enters leaning back (translateZ(-140px), rotateX(8)),
       settles flat and in-your-face at mid-scroll, exits leaning
       forward (translateZ(-140px), rotateX(-8)). The photo does
       its own slow Ken Burns; the caption parallaxes on a plane
       in front. A warm drop-shadow fades in around the settle
       point to sell depth. A handful of ember sparks drift up
       from the bottom edge as the panel is fully in view.

   Layout (mobile, < md): stacked, flat, no 3D transforms — the
   3D reads as jarring on small screens.

   Cinematic layering on top of the 3D scroll motion:
     · Rack-focus DoF — photo blurs on entry/exit, razor sharp
       at the hero moment.
     · Letterbox bars — thin black bars slide in from top/bottom
       at the hero window, lifting the panel to film aspect.
     · Ghosted Roman numeral — massive Cinzel watermark in the
       bottom-right, parallaxed slower than the rest.
     · Warm breathing vignette — radial lantern-light vignette
       pulses in around the panel's hero centre.
     · Cut-between-shots — a soft dark band bleeds top/bottom
       to hint a film cut between panels.

   Everything gated by `prefers-reduced-motion` collapses to a
   still, no-transform baseline. No three.js, no new deps.
   ──────────────────────────────────────────────────────────── */

import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { DUR, EASE } from "@/lib/motion";

/* ─── Content ─────────────────────────────────────────────── */

type Chapter = {
  numeral: string;
  title: string;
  location: string;
  meta: string; // small caption metadata under the image
  pullQuote: string;
  body: string;
  image: string;
  alt: string;
};

const CHAPTERS: Chapter[] = [
  {
    numeral: "I",
    title: "The Steppe",
    location: "Khentii",
    meta: "KHENTII · HORSE · 3 DAYS",
    pullQuote:
      "The land begins where the road ends. In the pale morning, only horses move.",
    body: "You wake before the wind. Fold the felt back, tie your loovuuz, and step out to a horizon that admits no walls. This is the country as the Guild first meets you.",
    image: "/1.jpg",
    alt: "Dawn on the Khentii steppe",
  },
  {
    numeral: "II",
    title: "The Crossing",
    location: "Gobi",
    meta: "GOBI · CAMEL · 6 DAYS",
    pullQuote:
      "By high sun, the world becomes stone and sky. The camels know the way.",
    body: "The dunes cannot be argued with. You learn a rhythm — dawn ride, midday shelter, evening ride — and the country hands you its silence in return.",
    image: "/4.jpg",
    alt: "Camel crossing in the Gobi",
  },
  {
    numeral: "III",
    title: "Into the Altai",
    location: "West Mongolia",
    meta: "WEST MONGOLIA · 4×4 · 8 DAYS",
    pullQuote: "Ridges, rivers, and the long silence of the west.",
    body: "The overland climb turns west. Every ford is a decision, every ridge a page. By the third day the world stops looking like a map and starts looking like memory.",
    image: "/7.jpg",
    alt: "Overland into the Altai",
  },
  {
    numeral: "IV",
    title: "The Arrival",
    location: "Amarbayasgalant",
    meta: "AMARBAYASGALANT · ON FOOT · 1 DAY",
    pullQuote:
      "Dusk, and a monastery on the ridge. The road ends where the flame begins.",
    body: "You leave the vehicle. The last hour is on foot, past the ovoo, up the switchbacks. The prayer flags catch the last of the sun. Then the doors open, and the country holds you.",
    image: "/9.jpg",
    alt: "Arrival at Amarbayasgalant monastery at dusk",
  },
];

/* ─── Ember spark cluster ──────────────────────────────────
   A few CSS-keyframe-animated spans that drift up from the
   bottom of the photo when the panel is fully in view. The
   parent container's opacity is a MotionValue tied to panel
   progress so the sparks only appear near the "settle" point.
   ──────────────────────────────────────────────────────────── */

const SPARK_OFFSETS = [
  { leftPct: 18, delay: 0, dur: 3.4, drift: -14 },
  { leftPct: 34, delay: 0.6, dur: 3.9, drift: 10 },
  { leftPct: 52, delay: 1.2, dur: 3.2, drift: -6 },
  { leftPct: 71, delay: 0.3, dur: 3.7, drift: 14 },
  { leftPct: 86, delay: 1.6, dur: 3.5, drift: -10 },
] as const;

/* ─── Right-column panel ──────────────────────────────────── */

type PanelProps = {
  chapter: Chapter;
  index: number;
  registerPanel: (index: number, node: HTMLDivElement | null) => void;
  onProgress: (index: number, progress: number) => void;
  reduced: boolean;
};

function ChapterPanel({
  chapter,
  index,
  registerPanel,
  onProgress,
  reduced,
}: PanelProps) {
  const localRef = useRef<HTMLDivElement | null>(null);
  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      localRef.current = node;
      registerPanel(index, node);
    },
    [index, registerPanel],
  );

  // Per-panel scroll progress: 0 as it enters the bottom, 1 as it exits the top.
  const { scrollYProgress } = useScroll({
    target: localRef,
    offset: ["start end", "end start"],
  });

  // Report progress upward so the parent can pick the closest-to-centre panel.
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    onProgress(index, v);
  });

  /* ─── 3D scroll transform on the panel wrapper.
        Progress 0     → entering from below: pushed away, leaning back
        Progress 0.5   → settled: flat, in your face
        Progress 1     → exiting up: pushed away, leaning forward
        The rotateX curve crosses zero at 0.5, translateZ dips to 0.  */
  const translateZRaw = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [-140, 0, -140],
  );
  const rotateXRaw = useTransform(scrollYProgress, [0, 0.5, 1], [8, 0, -8]);
  // Warm drop-shadow: strongest at settle, fades to nothing at the edges.
  const shadowOpacityRaw = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65, 1],
    [0, 1, 1, 0],
  );

  /* ─── Ken Burns — dramatised. Wider scale range and a slow
        horizontal pan so it reads as a camera drift across the
        landscape, not just a zoom. */
  const scaleRaw = useTransform(scrollYProgress, [0, 1], [1.02, 1.3]);
  const yRaw = useTransform(scrollYProgress, [0, 1], ["-2%", "2%"]);
  const xRaw = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);

  /* ─── Caption parallax — moves slower than the photo so it
        reads as a plane sitting in front of the image. */
  const captionYRaw = useTransform(scrollYProgress, [0, 1], [20, -20]);

  /* ─── Ember sparks visible only near the settle point. */
  const sparkOpacityRaw = useTransform(
    scrollYProgress,
    [0.35, 0.5, 0.7],
    [0, 1, 0],
  );

  /* ─── Rack-focus DoF. Blurred on entry and exit, razor sharp
        at the hero moment. Reads as a photographer pulling focus
        to this frame. Applied via CSS `filter: blur(...)` on the
        image wrapper — cheap, GPU-composited, hinted with
        `will-change: filter`. */
  const blurPxRaw = useTransform(
    scrollYProgress,
    [0, 0.4, 0.6, 1],
    [6, 0, 0, 6],
  );
  const blurFilter = useTransform(blurPxRaw, (v) => `blur(${v.toFixed(2)}px)`);

  /* ─── Cinematic letterbox. Thin black bars slide down from the
        top and up from the bottom during the hero window
        (progress 0.4–0.6), pulling the frame to film aspect. */
  const letterboxHeightRaw = useTransform(
    scrollYProgress,
    [0.3, 0.45, 0.55, 0.7],
    ["0%", "7%", "7%", "0%"],
  );

  /* ─── Warm breathing vignette. Peaks at panel centre — reads
        as the shot being lit by lantern light. */
  const vignetteOpacityRaw = useTransform(
    scrollYProgress,
    [0.3, 0.5, 0.7],
    [0, 0.9, 0],
  );

  /* ─── Ghosted Roman numeral parallax. Moves slower than the
        photograph, drifting a touch as it passes through. */
  const numeralYRaw = useTransform(scrollYProgress, [0, 1], [40, -40]);

  // Reduced-motion: collapse every scroll transform to a static value.
  const staticZero = 0 as unknown as MotionValue<number>;
  const staticOne = 1 as unknown as MotionValue<number>;
  const staticScale = 1.05 as unknown as MotionValue<number>;
  const staticY = "0%" as unknown as MotionValue<string>;
  const staticCap = 0 as unknown as MotionValue<number>;
  const staticBlur = "blur(0px)" as unknown as MotionValue<string>;
  const staticLetterbox = "0%" as unknown as MotionValue<string>;
  const staticVignette = 0.35 as unknown as MotionValue<number>;

  const translateZ = reduced ? staticZero : translateZRaw;
  const rotateX = reduced ? staticZero : rotateXRaw;
  const shadowOpacity = reduced ? staticOne : shadowOpacityRaw;
  const scale = reduced ? staticScale : scaleRaw;
  const y = reduced ? staticY : yRaw;
  const x = reduced ? staticY : xRaw;
  const captionY = reduced ? staticCap : captionYRaw;
  const sparkOpacity = reduced ? staticZero : sparkOpacityRaw;
  const blur = reduced ? staticBlur : blurFilter;
  const letterboxHeight = reduced ? staticLetterbox : letterboxHeightRaw;
  const vignetteOpacity = reduced ? staticVignette : vignetteOpacityRaw;
  const numeralY = reduced ? staticZero : numeralYRaw;

  return (
    <div
      ref={setRef}
      className="relative h-[100vh] w-full scroll-mt-24 md:[transform-style:preserve-3d]"
      aria-label={`Chapter ${chapter.numeral}: ${chapter.title}`}
    >
      {/* Warm drop-shadow platter — sits under the panel, fades in at settle.
          Uses filter: drop-shadow so it hugs the actual painted content. */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none hidden md:block"
        style={{
          opacity: shadowOpacity,
          filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.5))",
        }}
      />

      {/* 3D-transformed panel wrapper. Perspective is inherited from the
          right column; here we set the transform + origin. On mobile the
          transform vars are ignored (no `md:` gating needed — the values
          just apply, but with no ancestor perspective the visual is a no-op;
          we still keep the desktop-only styles clean via inline conditionals). */}
      <motion.div
        className="absolute inset-0 overflow-hidden md:will-change-transform"
        style={{
          transformOrigin: "center center",
          transformStyle: "preserve-3d",
          translateZ,
          rotateX,
        }}
      >
        {/* Photograph — full-bleed, warm sepia treatment, Ken Burns.
            Two nested motion wrappers: the outer carries the rack-focus
            DoF blur (scroll-tied), the inner carries the Ken Burns
            transform. Splitting them keeps each transform cheap and
            lets `will-change: filter` sit on the blur layer only. */}
        <motion.div
          className="absolute inset-0 [will-change:filter]"
          style={{ filter: blur }}
        >
          <motion.div
            className="absolute inset-0 will-change-transform"
            style={{ scale, x, y }}
          >
            <Image
              src={chapter.image}
              alt={chapter.alt}
              fill
              priority={index === 0}
              sizes="(min-width: 768px) 60vw, 100vw"
              className="object-cover grayscale-[15%] sepia-[28%] brightness-[0.82]"
            />
          </motion.div>
        </motion.div>

        {/* Warm breathing vignette — pulses in around the panel's
            hero centre. Pure CSS radial gradient; opacity is the
            only scroll-tied prop. Reads as lantern light closing
            in on the frame. */}
        <motion.div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: vignetteOpacity,
            background:
              "radial-gradient(70% 60% at 50% 50%, transparent 40%, rgba(28,21,16,0.55) 100%)",
          }}
        />

        {/* Warm scrims: top a whisper, bottom for caption legibility. */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(28,21,16,0.35) 0%, rgba(28,21,16,0) 22%, rgba(28,21,16,0) 55%, rgba(28,21,16,0.78) 100%)",
          }}
        />

        {/* Subtle ember-warm side vignette so the photo fuses with the left column */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none hidden md:block"
          style={{
            background:
              "linear-gradient(90deg, rgba(28,21,16,0.55) 0%, rgba(28,21,16,0) 18%)",
          }}
        />

        {/* Cinematic letterbox bars — thin black slabs that slide in
            from top and bottom during the hero window. Height is
            scroll-tied via useTransform. Sits above the photo,
            beneath the caption. Pure CSS, cheap. */}
        <motion.div
          aria-hidden
          className="absolute inset-x-0 top-0 z-[5] bg-black pointer-events-none"
          style={{ height: letterboxHeight }}
        />
        <motion.div
          aria-hidden
          className="absolute inset-x-0 bottom-0 z-[5] bg-black pointer-events-none"
          style={{ height: letterboxHeight }}
        />

        {/* Cut-between-shots — a soft dark gradient bleeding from
            the top and bottom edges. Overlaps with neighbouring
            panels' bleed to hint a natural fade-to-black between
            shots. Static, no scroll binding needed. */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-[10vh] z-[6] pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(28,21,16,1) 0%, rgba(28,21,16,0) 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[10vh] z-[6] pointer-events-none"
          style={{
            background:
              "linear-gradient(0deg, rgba(28,21,16,1) 0%, rgba(28,21,16,0) 100%)",
          }}
        />

        {/* Ghosted Roman numeral — massive Cinzel watermark in the
            bottom-right corner, sitting behind the caption. Very
            faint (~8% foreground), scroll-parallaxed slower than
            everything else. Reads as a Kubrick chapter card. */}
        <motion.div
          aria-hidden
          className="absolute right-4 md:right-10 bottom-0 z-[7] pointer-events-none select-none"
          style={{ y: numeralY }}
        >
          <span
            className="font-heading uppercase leading-none text-foreground/[0.08] text-[180px] md:text-[400px]"
            style={{ letterSpacing: "0.02em" }}
          >
            {chapter.numeral}
          </span>
        </motion.div>

        {/* Ember sparks — cheap CSS-keyframed spans, visible only near settle */}
        {!reduced && (
          <motion.div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-40 pointer-events-none hidden md:block overflow-hidden"
            style={{ opacity: sparkOpacity }}
          >
            {SPARK_OFFSETS.map((spark, i) => (
              <span
                key={i}
                className="ember-spark"
                style={
                  {
                    left: `${spark.leftPct}%`,
                    animationDelay: `${spark.delay}s`,
                    animationDuration: `${spark.dur}s`,
                    ["--spark-drift" as string]: `${spark.drift}px`,
                  } as React.CSSProperties
                }
              />
            ))}
          </motion.div>
        )}

        {/* Caption block — parallaxed on its own translateY plane */}
        <motion.div
          className="absolute inset-x-0 bottom-0 z-10 px-6 pb-10 md:px-12 md:pb-14"
          style={{ y: captionY }}
        >
          <div className="max-w-xl">
            <div className="flex items-center gap-3">
              <span className="font-accent italic text-accent tracking-[0.28em] text-xs md:text-sm">
                Chapter {chapter.numeral}
              </span>
              <span
                aria-hidden
                className="h-px flex-1 bg-gradient-to-r from-accent/70 via-accent/30 to-transparent"
              />
            </div>
            <div className="mt-3 font-heading text-foreground uppercase tracking-[0.14em] text-lg md:text-xl">
              {chapter.location}
            </div>
            <div className="ink-divider mt-3 max-w-[140px]" />
            <div className="mt-3 font-accent italic text-muted tracking-[0.22em] text-[11px] md:text-xs">
              {chapter.meta}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Inline styles for the ember spark keyframes.
          Kept local so this component stays self-contained; the animation
          is cheap (opacity + transform), only 5 elements per panel. */}
      <style jsx>{`
        .ember-spark {
          position: absolute;
          bottom: 0;
          width: 3px;
          height: 3px;
          border-radius: 9999px;
          background: radial-gradient(
            circle at 50% 50%,
            rgba(255, 208, 130, 1) 0%,
            rgba(201, 146, 42, 0.9) 45%,
            rgba(201, 146, 42, 0) 100%
          );
          box-shadow: 0 0 8px rgba(201, 146, 42, 0.7);
          opacity: 0;
          animation-name: ember-spark-rise;
          animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          animation-iteration-count: infinite;
          will-change: transform, opacity;
        }
        @keyframes ember-spark-rise {
          0% {
            transform: translate3d(0, 0, 0) scale(0.7);
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          80% {
            opacity: 0.5;
          }
          100% {
            transform: translate3d(var(--spark-drift, 0px), -140px, 0)
              scale(1);
            opacity: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .ember-spark {
            animation: none;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

/* ─── Section ─────────────────────────────────────────────── */

export default function TheLongRide() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const panelNodes = useRef<Array<HTMLDivElement | null>>([]);
  const progressRef = useRef<number[]>(CHAPTERS.map(() => 0));
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion() ?? false;

  const registerPanel = useCallback(
    (index: number, node: HTMLDivElement | null) => {
      panelNodes.current[index] = node;
    },
    [],
  );

  // Overall section progress → progress bar in the sticky column.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const barScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Aggregate per-panel progress into "which chapter is most in view".
  // The panel whose progress is closest to 0.5 is treated as active.
  const handleProgress = useCallback((index: number, value: number) => {
    progressRef.current[index] = value;
    let bestIndex = 0;
    let bestDistance = Infinity;
    for (let i = 0; i < progressRef.current.length; i++) {
      const distance = Math.abs(progressRef.current[i] - 0.5);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = i;
      }
    }
    setActive((prev) => (prev === bestIndex ? prev : bestIndex));
  }, []);

  const scrollToChapter = useCallback((index: number) => {
    const el = panelNodes.current[index];
    if (!el) return;
    // Lenis interpolates smooth scroll — a plain scrollIntoView is fine.
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const activeChapter = CHAPTERS[active];

  // Cross-fade entry/exit for the active-chapter text. Subtle rotateX tilt
  // so the swap feels like a page turning through 3D space, not a flat cut.
  const textInitial = reduced
    ? { opacity: 0 }
    : { opacity: 0, y: 14, rotateX: 4 };
  const textAnimate = reduced
    ? { opacity: 1 }
    : { opacity: 1, y: 0, rotateX: 0 };
  const textExit = reduced
    ? { opacity: 0 }
    : { opacity: 0, y: -10, rotateX: -4 };

  return (
    <section
      ref={sectionRef}
      className="relative bg-background text-foreground"
      aria-label="The Long Ride — four chapters of the journey"
    >
      {/* ─── Section eyebrow (visible on mobile only; desktop shows it in the
              sticky column). Keeps the section identifiable on small screens. */}
      <div className="md:hidden px-6 pt-16 pb-6">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="h-px w-8 bg-gradient-to-r from-transparent to-accent/70"
          />
          <span className="font-accent italic text-accent tracking-[0.32em] text-xs">
            The Long Ride
          </span>
        </div>
      </div>

      {/* ─── Desktop split-screen ─────────────────────────── */}
      <div className="hidden md:grid md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        {/* LEFT — sticky navigator + active chapter text */}
        <aside className="relative">
          <div className="sticky top-0 h-screen flex flex-col justify-between px-10 lg:px-14 py-20">
            {/* Top: section eyebrow */}
            <div>
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="h-px w-10 bg-gradient-to-r from-transparent to-accent/70"
                />
                <span className="font-accent italic text-accent tracking-[0.32em] text-xs lg:text-sm">
                  The Long Ride
                </span>
              </div>
              <p className="mt-3 font-accent italic text-muted tracking-wider text-xs lg:text-sm max-w-xs">
                Four chapters. One country. A single continuous ride.
              </p>
            </div>

            {/* Middle: Roman-numeral ladder */}
            <nav aria-label="Chapters" className="flex flex-col gap-5 lg:gap-6">
              {CHAPTERS.map((chapter, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={chapter.numeral}
                    type="button"
                    onClick={() => scrollToChapter(i)}
                    aria-current={isActive ? "true" : undefined}
                    aria-label={`Chapter ${chapter.numeral}: ${chapter.title}`}
                    className="group flex items-center gap-4 text-left focus:outline-none"
                  >
                    <span
                      className={
                        "font-heading tracking-[0.2em] transition-all duration-500 " +
                        (isActive
                          ? "text-accent text-2xl lg:text-3xl ember-text-glow"
                          : "text-muted/60 text-lg lg:text-xl group-hover:text-muted")
                      }
                      style={{ minWidth: "2.5rem" }}
                    >
                      {chapter.numeral}
                    </span>
                    <span
                      aria-hidden
                      className={
                        "h-px origin-left transition-all duration-500 " +
                        (isActive
                          ? "w-16 lg:w-20 bg-accent"
                          : "w-6 bg-muted/40 group-hover:w-8 group-hover:bg-muted/70")
                      }
                    />
                    <span
                      className={
                        "font-accent italic tracking-[0.18em] text-xs lg:text-sm transition-colors duration-500 " +
                        (isActive
                          ? "text-foreground/90"
                          : "text-muted/70 group-hover:text-muted")
                      }
                    >
                      {chapter.location}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* Active chapter text — cross-faded with a subtle rotateX tilt.
                Its container carries perspective so the tilt actually reads. */}
            <div
              className="min-h-[220px] lg:min-h-[260px]"
              style={{ perspective: "1200px" }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeChapter.numeral}
                  initial={textInitial}
                  animate={textAnimate}
                  exit={textExit}
                  transition={{ duration: DUR.slow, ease: EASE }}
                  style={{ transformOrigin: "center top" }}
                >
                  <h2 className="font-heading uppercase tracking-[0.12em] text-3xl lg:text-4xl text-foreground leading-tight">
                    {activeChapter.title}
                  </h2>
                  <p className="mt-5 font-body italic text-muted text-lg lg:text-xl leading-relaxed border-l border-accent/50 pl-4">
                    &ldquo;{activeChapter.pullQuote}&rdquo;
                  </p>
                  <p className="mt-5 font-body text-foreground/85 text-sm lg:text-base leading-relaxed max-w-md">
                    {activeChapter.body}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom: progress bar */}
            <div className="pt-4">
              <div className="relative h-px w-full bg-muted/25 overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 origin-left bg-accent"
                  style={{ scaleX: barScale, width: "100%" }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between font-accent italic text-muted/70 tracking-[0.24em] text-[10px] lg:text-xs">
                <span>Departure</span>
                <span>Arrival</span>
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT — four stacked full-bleed photograph panels.
            Perspective + preserve-3d live here so each panel's translateZ /
            rotateX actually inhabit 3D space (not flat 2D fakes). */}
        <div
          className="relative"
          style={{
            perspective: "1600px",
            perspectiveOrigin: "50% 50%",
            transformStyle: "preserve-3d",
          }}
        >
          {CHAPTERS.map((chapter, i) => (
            <ChapterPanel
              key={chapter.numeral}
              chapter={chapter}
              index={i}
              registerPanel={registerPanel}
              onProgress={handleProgress}
              reduced={reduced}
            />
          ))}
        </div>
      </div>

      {/* ─── Mobile stack — flat, no 3D transforms ────────── */}
      <div className="md:hidden">
        {CHAPTERS.map((chapter) => (
          <article
            key={chapter.numeral}
            className="relative pb-20 scroll-mt-24"
          >
            {/* Chapter text above the photograph */}
            <div className="px-6 pt-6 pb-8">
              <div className="flex items-center gap-3">
                <span className="font-heading text-accent tracking-[0.24em] text-2xl ember-text-glow">
                  {chapter.numeral}
                </span>
                <span
                  aria-hidden
                  className="h-px flex-1 bg-gradient-to-r from-accent/60 to-transparent"
                />
                <span className="font-accent italic text-muted tracking-[0.2em] text-[11px]">
                  {chapter.location}
                </span>
              </div>
              <h2 className="mt-4 font-heading uppercase tracking-[0.1em] text-2xl text-foreground leading-tight">
                {chapter.title}
              </h2>
              <p className="mt-4 font-body italic text-muted text-base leading-relaxed border-l border-accent/40 pl-3">
                &ldquo;{chapter.pullQuote}&rdquo;
              </p>
              <p className="mt-4 font-body text-foreground/85 text-sm leading-relaxed">
                {chapter.body}
              </p>
            </div>

            {/* Photograph */}
            <div className="relative h-[80vh] w-full overflow-hidden">
              <Image
                src={chapter.image}
                alt={chapter.alt}
                fill
                sizes="100vw"
                className="object-cover grayscale-[15%] sepia-[28%] brightness-[0.82]"
              />
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(28,21,16,0.2) 0%, rgba(28,21,16,0) 30%, rgba(28,21,16,0) 60%, rgba(28,21,16,0.8) 100%)",
                }}
              />
              <div className="absolute inset-x-0 bottom-0 px-6 pb-6">
                <div className="ink-divider max-w-[120px]" />
                <div className="mt-2 font-accent italic text-muted tracking-[0.22em] text-[11px]">
                  {chapter.meta}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
