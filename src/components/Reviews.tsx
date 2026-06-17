"use client";

import { motion } from "framer-motion";
import {
  DUR,
  STAGGER,
  VIEWPORT,
  revealVariants,
  staggerParent,
} from "@/lib/motion";

const tales = [
  {
    name: "NJ Kessler",
    region: "Winter Charter — Khövsgöl",
    content:
      "An absolute masterclass in Mongolian travel. Despite fuel shortages on the road, our guide's herculean efforts ensured the winter expedition was a total success. Local knowledge, fluent English, quiet humour — exceptional.",
    image: "/5.jpg",
  },
  {
    name: "Fletcher Bradford",
    region: "Taiga Charter — North",
    content:
      "Staying with nomadic families and visiting the reindeer herders was life-changing. One of the most memorable things I have ever done. Our guide was more than a guide; by the end of the road he was a friend.",
    image: "/6.jpg",
  },
];

/* ────────────────────────────────────────────────────────────
   Chronicles — restructured as one editorial pull-quote
   (Tale I, oversized, with a massive translucent quotation mark)
   and one compact secondary entry (Tale II) below. Reads like
   the inside front leaf of a travel monograph, not a card grid.
   ──────────────────────────────────────────────────────────── */

export default function Reviews() {
  const [primary, secondary] = tales;

  return (
    <section
      id="tales"
      className="relative py-20 md:py-32 px-6 overflow-hidden bg-background"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Heading row */}
        <motion.div
          variants={staggerParent(STAGGER.base, STAGGER.base)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-10"
        >
          <div className="max-w-xl">
            <motion.p
              variants={revealVariants("rise", DUR.base)}
              className="font-accent italic text-accent text-[14px] tracking-[0.35em] uppercase mb-5"
            >
              Chronicles
            </motion.p>
            <motion.h2
              variants={revealVariants("blur", DUR.slow)}
              className="font-heading text-4xl md:text-6xl uppercase tracking-[0.08em] leading-[1.05] text-foreground ember-text-glow"
            >
              Tales from the <span className="text-accent">road</span>
            </motion.h2>
          </div>
          <motion.p
            variants={revealVariants("rise", DUR.base)}
            className="text-muted text-[16px] max-w-xs font-serif italic leading-[1.85]"
          >
            Honest words from patrons who have ridden with the Guild. Each
            chronicle was sent by raven, unedited.
          </motion.p>
        </motion.div>

        <motion.div
          variants={revealVariants("wipe", DUR.base)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="ink-divider mb-20"
        />

        {/* Tale I — massive pull quote with oversized translucent quotation mark */}
        <motion.article
          variants={staggerParent(STAGGER.base, STAGGER.base)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="relative grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-x-16 gap-y-10 items-start"
        >
          {/* Quote body */}
          <div className="relative">
            <span
              aria-hidden
              className="pointer-events-none select-none absolute -top-20 sm:-top-28 -left-3 sm:-left-6 font-heading text-accent/[0.10] leading-none text-[14rem] sm:text-[20rem]"
            >
              &ldquo;
            </span>
            <motion.blockquote
              variants={revealVariants("blur", DUR.slow)}
              className="relative font-serif italic text-foreground text-[24px] sm:text-[30px] md:text-[36px] leading-[1.45] tracking-[-0.005em]"
            >
              {primary.content}
            </motion.blockquote>

            <motion.div
              variants={revealVariants("rise", DUR.base)}
              className="mt-12 flex items-center gap-6"
            >
              <div className="vignette w-20 h-20 sm:w-24 sm:h-24 overflow-hidden border border-accent/40">
                <img
                  src={primary.image}
                  alt={primary.name}
                  className="w-full h-full object-cover grayscale-[20%] sepia-[30%]"
                />
              </div>
              <div>
                <p className="font-heading uppercase tracking-[0.12em] text-foreground text-[18px]">
                  {primary.name}
                </p>
                <p className="font-accent italic text-accent text-[12px] tracking-[0.25em] uppercase mt-1">
                  {primary.region}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Tale ordinal mark, vertical — right column on lg */}
          <motion.div
            variants={revealVariants("fade", DUR.slow)}
            className="hidden lg:flex flex-col items-center pt-4 gap-4 text-accent/60"
          >
            <span className="font-accent italic text-[11px] tracking-[0.5em] uppercase">
              Tale I
            </span>
            <span className="w-px h-32 bg-accent/30" />
          </motion.div>
        </motion.article>

        {/* Quiet divider between tales */}
        <motion.div
          variants={revealVariants("wipe", DUR.base)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="ink-divider my-24 max-w-md mx-auto"
        />

        {/* Tale II — compact secondary, set as a side-by-side entry */}
        <motion.article
          variants={staggerParent(STAGGER.base, STAGGER.base)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="relative grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 md:gap-12 items-start max-w-4xl ml-auto"
        >
          {/* Portrait + meta */}
          <div className="flex md:flex-col items-center md:items-start gap-5 md:gap-6">
            <div className="vignette w-24 h-24 md:w-32 md:h-32 overflow-hidden border border-accent/40 flex-shrink-0">
              <img
                src={secondary.image}
                alt={secondary.name}
                className="w-full h-full object-cover grayscale-[20%] sepia-[30%]"
              />
            </div>
            <div>
              <p className="font-accent italic text-accent/70 text-[11px] tracking-[0.5em] uppercase mb-3 hidden md:block">
                Tale II
              </p>
              <p className="font-heading uppercase tracking-[0.1em] text-foreground text-[17px]">
                {secondary.name}
              </p>
              <p className="font-accent italic text-accent text-[12px] tracking-[0.22em] uppercase mt-1">
                {secondary.region}
              </p>
            </div>
          </div>

          {/* Quote body */}
          <motion.blockquote
            variants={revealVariants("rise", DUR.base)}
            className="border-l-2 border-accent/30 pl-6 md:pl-8 font-serif italic text-foreground/90 text-[18px] md:text-[20px] leading-[1.85]"
          >
            &ldquo;{secondary.content}&rdquo;
          </motion.blockquote>
        </motion.article>
      </div>
    </section>
  );
}
