"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  DUR,
  STAGGER,
  VIEWPORT,
  revealVariants,
  staggerParent,
} from "@/lib/motion";

/* ────────────────────────────────────────────────────────────
   CharterRibbon — the final, quiet CTA. Sits just above the
   footer as the conversion thread's resolution. Editorial:
   a short italic sign-off, a single primary CTA, and a
   subordinated "browse the roads" secondary. No hard sell,
   no marketing bombast — this is the raven you leave on the
   sill after the last chapter.
   ──────────────────────────────────────────────────────────── */

export default function CharterRibbon() {
  return (
    <section
      aria-label="Begin a charter"
      className="relative bg-background border-t border-highlight/25"
    >
      {/* Warm ember pool — anchors the CTA without a card */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 40%, rgba(201,146,42,0.10), transparent 70%)",
        }}
      />

      <motion.div
        variants={staggerParent(STAGGER.base, STAGGER.base)}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        className="relative z-10 max-w-4xl mx-auto text-center px-6 py-24 md:py-32"
      >
        <motion.p
          variants={revealVariants("fade", DUR.base)}
          className="font-accent italic text-accent text-[13px] tracking-[0.5em] uppercase mb-8"
        >
          — Send a Raven —
        </motion.p>

        <motion.h2
          variants={revealVariants("blur", DUR.slow)}
          className="font-heading text-4xl md:text-6xl uppercase tracking-[0.08em] text-foreground ember-text-glow leading-[1.05]"
        >
          When you are ready,<br />
          <span className="text-accent">the road is ready.</span>
        </motion.h2>

        <motion.div
          variants={revealVariants("wipe", DUR.base)}
          className="ink-divider mx-auto mt-10 max-w-sm"
        />

        <motion.p
          variants={revealVariants("rise", DUR.base)}
          className="mt-10 font-serif italic text-foreground/85 text-[18px] sm:text-[19px] leading-[1.75] max-w-2xl mx-auto"
        >
          Every charter begins with a note. Tell us the country you want to
          meet — we will write back with the route, the machine, and the
          guide whose rank meets the road.
        </motion.p>

        <motion.div
          variants={revealVariants("rise", DUR.base)}
          className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center max-w-sm sm:max-w-none mx-auto"
        >
          <Link
            href="/journeys"
            className="group relative overflow-hidden px-10 py-5 border border-accent bg-accent/15 font-accent text-[12px] tracking-[0.35em] uppercase text-foreground ember-glow text-center transition-colors duration-500 hover:text-background"
          >
            <span
              aria-hidden
              className="absolute inset-0 z-0 origin-bottom scale-y-0 bg-accent transition-transform duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-y-100"
            />
            <span className="relative z-10">Begin a Charter</span>
          </Link>
          <Link
            href="/journeys"
            className="px-10 py-5 border border-foreground/25 hover:border-accent transition-all duration-500 font-accent text-[12px] tracking-[0.35em] uppercase text-foreground/80 hover:text-foreground text-center"
          >
            Browse the Roads
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
