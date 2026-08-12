"use client";

import { motion } from "framer-motion";
import {
  DUR,
  STAGGER,
  VIEWPORT,
  revealVariants,
  staggerParent,
} from "@/lib/motion";

type Props = {
  /** Chapter mark, e.g. "Chapter II" or "· Interlude ·". */
  eyebrow: string;
  /** The pull-quote itself — set in italic serif at editorial size. */
  quote: string;
  /** Optional attribution / footnote below the quote. */
  attribution?: string;
};

/* ────────────────────────────────────────────────────────────
   PullQuoteBreather — a quiet, short, editorial pause between
   loud beats. Not a section that sells anything: a single italic
   pull-quote, an eyebrow ordinal, an ink divider. Sits at ~55vh
   so it feels like a page turn between chapters, not another
   full section clamouring for attention.

   Deliberately dark, sparse, and centred. This is the "quiet
   moment" that lets the next cinematic beat feel earned.
   ──────────────────────────────────────────────────────────── */

export default function PullQuoteBreather({
  eyebrow,
  quote,
  attribution,
}: Props) {
  return (
    <section
      aria-label={eyebrow}
      className="relative bg-background py-24 md:py-32 px-6"
    >
      {/* A single faint ember pool anchors the quote — no more, no less. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(45% 40% at 50% 50%, rgba(201,146,42,0.06), transparent 70%)",
        }}
      />

      <motion.div
        variants={staggerParent(STAGGER.base, STAGGER.base)}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        className="relative z-10 max-w-3xl mx-auto text-center"
      >
        {/* Chapter mark — anticipatory ordinal */}
        <motion.div
          variants={revealVariants("fade", DUR.base)}
          className="flex items-center justify-center gap-5 mb-10"
        >
          <span className="h-px w-16 bg-accent/40" />
          <span className="font-accent italic text-accent/80 text-[11px] tracking-[0.55em] uppercase">
            {eyebrow}
          </span>
          <span className="h-px w-16 bg-accent/40" />
        </motion.div>

        {/* The pull-quote — the whole point of the breather */}
        <motion.blockquote
          variants={revealVariants("blur", DUR.slow)}
          className="font-serif italic text-foreground/90 text-[22px] sm:text-[28px] md:text-[32px] leading-[1.5]"
        >
          &ldquo;{quote}&rdquo;
        </motion.blockquote>

        {attribution && (
          <>
            <motion.div
              variants={revealVariants("wipe", DUR.base)}
              className="ink-divider mx-auto mt-10 max-w-[10rem]"
            />
            <motion.p
              variants={revealVariants("fade", DUR.base)}
              className="mt-6 font-accent italic text-muted text-[12px] tracking-[0.5em] uppercase"
            >
              {attribution}
            </motion.p>
          </>
        )}
      </motion.div>
    </section>
  );
}
