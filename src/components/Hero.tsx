"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { EASE, DUR } from "@/lib/motion";
import { JOURNEY_CATEGORIES, CATEGORY_SIGIL } from "@/lib/journeys";

// Hero tag picker — the user's first action. Nine journey categories
// with sigils, each links to /journeys?category=<name> so the tag click
// pre-filters the journeys catalogue in one step.
const HERO_TAGS = JOURNEY_CATEGORIES.map((cat) => ({
  name: cat,
  sigil: CATEGORY_SIGIL[cat],
  href: `/journeys?category=${encodeURIComponent(cat)}`,
}));

// Deterministic dust motes — static seeds so SSR/CSR match
const MOTES = [
  { left: "6%",  size: 2, dur: 22, delay: 0,    drift: -32 },
  { left: "11%", size: 3, dur: 28, delay: 6,    drift: 18  },
  { left: "17%", size: 2, dur: 19, delay: 2,    drift: 24  },
  { left: "22%", size: 4, dur: 34, delay: 12,   drift: -20 },
  { left: "28%", size: 2, dur: 25, delay: 9,    drift: 36  },
  { left: "34%", size: 3, dur: 30, delay: 4,    drift: -28 },
  { left: "40%", size: 2, dur: 21, delay: 14,   drift: 22  },
  { left: "47%", size: 3, dur: 33, delay: 7,    drift: -18 },
  { left: "53%", size: 2, dur: 26, delay: 1,    drift: 30  },
  { left: "60%", size: 4, dur: 36, delay: 11,   drift: -34 },
  { left: "66%", size: 2, dur: 23, delay: 3,    drift: 26  },
  { left: "72%", size: 3, dur: 29, delay: 8,    drift: -22 },
  { left: "78%", size: 2, dur: 20, delay: 13,   drift: 18  },
  { left: "84%", size: 3, dur: 31, delay: 5,    drift: -30 },
  { left: "89%", size: 2, dur: 27, delay: 10,   drift: 24  },
  { left: "94%", size: 4, dur: 35, delay: 15,   drift: -16 },
];

// Per-character title reveal — each glyph rises from the baseline and takes a
// single ember heat-bloom (drop-shadow, not text-shadow, so it never fights the
// ambient candle-flicker once the letter has settled).
const TITLE_WORDS = [
  { text: "GEREGE", accent: false },
  { text: "GUILD", accent: true },
];

const charVariants = {
  hidden: { opacity: 0, y: "0.72em", scale: 0.9 },
  visible: (i: number) => {
    const delay = 0.35 + i * 0.05;
    return {
      opacity: 1,
      y: "0em",
      scale: 1,
      filter: [
        "drop-shadow(0 0 0px rgba(201,146,42,0))",
        "drop-shadow(0 0 18px rgba(255,201,110,0.9))",
        "drop-shadow(0 0 0px rgba(201,146,42,0))",
      ],
      transition: {
        duration: 1.1,
        delay,
        ease: EASE,
        filter: { duration: 1.2, delay, times: [0, 0.4, 1], ease: "easeOut" },
      },
    };
  },
};

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  // Scroll-linked parallax — different layers move at different rates as the user scrolls past
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const videoY      = useTransform(scrollYProgress, [0, 1], ["0%",  "22%"]);
  const videoScale  = useTransform(scrollYProgress, [0, 1], [1.04,  1.18]);
  const overlayOp   = useTransform(scrollYProgress, [0, 1], [1,     0.4]);
  const contentY    = useTransform(scrollYProgress, [0, 1], ["0%",  "-18%"]);
  const contentOp   = useTransform(scrollYProgress, [0, 0.8], [1,   0]);
  const motesY      = useTransform(scrollYProgress, [0, 1], ["0%",  "-40%"]);
  const cueOp       = useTransform(scrollYProgress, [0, 0.3], [1,   0]);

  // Cinematic letterbox bars retract once on load (instant if reduced-motion).
  const prefersReduced = useReducedMotion();
  const barFrom = prefersReduced ? "0vh" : "7vh";

  return (
    <section
      ref={heroRef}
      className="relative h-svh min-h-[640px] w-full overflow-hidden bg-background"
    >
      {/* Cinematic letterbox — thin bars top/bottom that retract after load */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-30 bg-background"
        initial={{ height: barFrom }}
        animate={{ height: "0vh" }}
        transition={{ duration: DUR.slow, delay: 0.3, ease: EASE }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-30 bg-background"
        initial={{ height: barFrom }}
        animate={{ height: "0vh" }}
        transition={{ duration: DUR.slow, delay: 0.3, ease: EASE }}
      />
      {/* Video — full bleed, sepia-washed, parallax drift + slow zoom on scroll */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: videoY, scale: videoScale }}
      >
        <video
          key="hero-video"
          autoPlay
          loop
          muted
          playsInline
          className="object-cover w-full h-full"
          style={{
            filter: "sepia(25%) saturate(80%) brightness(0.78) contrast(1.05)",
          }}
        >
          <source src="/MONGOLIA.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* Layered atmospheric overlays — fade as you scroll past */}
      <motion.div
        aria-hidden
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{ opacity: overlayOp }}
      >
        <div className="absolute inset-0 bg-[#0D0A07]/72" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 45%, transparent 0%, transparent 30%, rgba(13,10,7,0.55) 70%, rgba(13,10,7,0.95) 100%)",
          }}
        />
        {/* Inner ember spotlight — slow breath */}
        <div
          className="absolute inset-0 ember-breath"
          style={{
            background:
              "radial-gradient(30% 38% at 50% 44%, rgba(201,146,42,0.22), rgba(201,146,42,0.06) 55%, transparent 78%)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-32 sm:h-40 bg-gradient-to-b from-transparent to-background" />
      </motion.div>

      {/* Drifting ember dust motes — rise slowly from the foot of the hero, parallax up on scroll */}
      <motion.div
        aria-hidden
        className="absolute inset-0 z-[2] pointer-events-none overflow-hidden"
        style={{ y: motesY }}
      >
        {MOTES.map((m, i) => (
          <span
            key={i}
            className="mote"
            style={{
              left: m.left,
              bottom: "-8px",
              width: `${m.size}px`,
              height: `${m.size}px`,
              animationDuration: `${m.dur}s`,
              animationDelay: `${m.delay}s`,
              ["--drift" as string]: `${m.drift}px`,
            }}
          />
        ))}
      </motion.div>

      {/* Content — parallaxes up + fades as the user scrolls past */}
      <motion.div
        className="relative z-10 h-full w-full flex items-center justify-center px-5 sm:px-6"
        style={{ paddingTop: "112px", paddingBottom: "96px", y: contentY, opacity: contentOp }}
      >
        <div className="text-center w-full max-w-5xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="font-accent italic text-accent text-[11px] sm:text-[14px] md:text-[16px] tracking-[0.32em] sm:tracking-[0.4em] uppercase mb-5 sm:mb-6"
          >
            A Fellowship of Mongolian Guides
          </motion.p>

          {/* Title — each glyph rises from the baseline and takes one ember bloom on load */}
          <h1
            className="font-heading uppercase text-foreground ember-text-glow candle-flicker leading-[1.02] sm:leading-[1.05] md:whitespace-nowrap text-[44px] xs:text-[52px] sm:text-6xl md:text-7xl lg:text-8xl"
            aria-label="Gerege Guild"
          >
            {TITLE_WORDS.map((word, wi) => {
              const offset = wi === 0 ? 0 : TITLE_WORDS[0].text.length;
              return (
                <span
                  key={word.text}
                  className={`inline-block align-baseline ${wi === 0 ? "mr-3 sm:mr-[0.28em]" : ""} ${
                    word.accent ? "text-accent" : ""
                  }`}
                >
                  <span className="block sm:inline">
                    {word.text.split("").map((ch, ci) => (
                      <motion.span
                        key={ci}
                        className="inline-block"
                        custom={offset + ci}
                        variants={charVariants}
                        initial="hidden"
                        animate="visible"
                        style={{ transformOrigin: "50% 100%" }}
                      >
                        {ch}
                      </motion.span>
                    ))}
                  </span>
                </span>
              );
            })}
          </h1>

          {/* Ember rule under the title — draws in like a brand stroke */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.4, delay: 1.2, ease: EASE }}
            style={{ transformOrigin: "center" }}
            className="ink-divider mx-auto mt-7 sm:mt-9 max-w-[280px] sm:max-w-md"
          />

          {/* Prompt — small, one line. */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.8 }}
            className="mt-10 sm:mt-12 font-accent italic text-muted text-[10px] sm:text-[11px] tracking-[0.5em] uppercase"
          >
            Choose the road that calls you
          </motion.p>

          {/* Tag picker — pill-style categories with sigil + name. Each tag
              pre-filters the /journeys catalogue via the ?category param. */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.95, ease: EASE }}
            className="mt-6 sm:mt-7 flex flex-wrap gap-2 sm:gap-2.5 justify-center max-w-3xl mx-auto"
          >
            {HERO_TAGS.map((tag) => (
              <Link
                key={tag.name}
                href={tag.href}
                className="group inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 border border-foreground/25 hover:border-accent/80 hover:bg-accent/10 transition-colors duration-300 font-accent text-[11px] sm:text-[12px] tracking-[0.22em] uppercase text-foreground/85 hover:text-foreground backdrop-blur-sm bg-background/25"
              >
                <span className="text-accent text-[13px] sm:text-[14px] leading-none group-hover:[text-shadow:0_0_10px_rgba(201,146,42,0.85)] transition-[text-shadow] duration-300">
                  {tag.sigil}
                </span>
                <span>{tag.name}</span>
              </Link>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll cue — fades out fast on first scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        style={{ opacity: cueOp }}
        className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="font-accent italic text-accent text-[10px] tracking-[0.5em] uppercase">
          Onward
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-10 sm:h-12 bg-gradient-to-b from-accent/70 to-transparent"
        />
      </motion.div>
    </section>
  );
}
