"use client";

import { motion } from "framer-motion";
import {
  DUR,
  STAGGER,
  VIEWPORT,
  revealVariants,
  staggerParent,
} from "@/lib/motion";

/* ────────────────────────────────────────────────────────────
   The Epigraph — a film-style chapter card that sits between
   the Hero and the Prologue. A sticky-pinned beat: dark
   parchment + ember breath, an oversized translucent MMXIV
   in Cinzel, and a single italic epigraph line recycled from
   the prologue. Nothing new invented — pure cinematic device.

   Pattern: outer wrapper ~140vh; inner div sticky-top-0 h-screen
   so the title card pins for the section's full scroll, then
   releases into the prologue with a gradient bleed at the foot.
   ──────────────────────────────────────────────────────────── */

export default function HeroEpigraph() {
  return (
    <section
      aria-label="Epigraph — MMXIV"
      className="relative bg-background"
    >
      <div className="relative" style={{ height: "min(140vh, 1300px)" }}>
        {/* Sticky title card — pins for the section's scroll */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
          {/* Backdrop — dark parchment with a slow ember breath at the centre */}
          <div aria-hidden className="absolute inset-0 bg-background">
            <div
              className="absolute inset-0 ember-breath"
              style={{
                background:
                  "radial-gradient(40% 36% at 50% 50%, rgba(201,146,42,0.10), transparent 70%)",
              }}
            />
            {/* Top bleed from hero, bottom bleed into prologue */}
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
          </div>

          {/* Content — reveals as the section enters; orchestrated beat */}
          <motion.div
            variants={staggerParent(STAGGER.base, STAGGER.base)}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            className="relative z-10 text-center px-6 max-w-3xl mx-auto"
          >
            {/* Top mark — thin rule with a tiny eyebrow ordinal */}
            <motion.div
              variants={revealVariants("fade", DUR.base)}
              className="flex items-center justify-center gap-5 mb-10"
            >
              <span className="h-px w-16 bg-accent/40" />
              <span className="font-accent italic text-accent/70 text-[11px] tracking-[0.6em] uppercase">
                · Chapter Zero ·
              </span>
              <span className="h-px w-16 bg-accent/40" />
            </motion.div>

            {/* The mark — massive translucent MMXIV in Cinzel.
                This is the cinematic gesture: nothing more than the year. */}
            <motion.h2
              variants={revealVariants("blur", DUR.cinematic)}
              // Fluid sizing: clamp so the 5 wide-tracked glyphs always fit
              // the viewport — 14rem on a desktop, but shrinks fluidly on
              // tablet/mobile down to 4rem so MMXIV never overflows horizontally.
              className="font-heading text-foreground/85 tracking-[0.24em] sm:tracking-[0.32em] leading-none ember-text-glow text-[clamp(4rem,16vw,14rem)]"
              aria-label="MMXIV"
            >
              <span className="bg-gradient-to-b from-foreground via-accent/80 to-highlight/60 bg-clip-text text-transparent">
                MMXIV
              </span>
            </motion.h2>

            {/* Ink divider */}
            <motion.div
              variants={revealVariants("wipe", DUR.base)}
              className="ink-divider mx-auto mt-10 max-w-sm"
            />

            {/* Epigraph — single italic line recycled from prologue stanza I.
                Reads as the film's opening line. */}
            <motion.p
              variants={revealVariants("rise", DUR.slow)}
              className="mt-12 font-serif italic text-foreground/90 text-[18px] sm:text-[22px] md:text-[24px] leading-[1.55] max-w-2xl mx-auto"
            >
              &ldquo;the country east of the maps&rdquo;
            </motion.p>

            {/* Foot mark */}
            <motion.p
              variants={revealVariants("fade", DUR.base)}
              className="mt-14 font-accent italic text-muted text-[11px] tracking-[0.55em] uppercase"
            >
              — Gerege Guild —
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
