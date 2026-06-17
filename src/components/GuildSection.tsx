"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  DUR,
  STAGGER,
  VIEWPORT,
  revealVariants,
  staggerParent,
} from "@/lib/motion";

const tenets = [
  {
    sigil: "I",
    title: "The Road",
    desc: "First choose the Mongolia you want to meet — a journey, a region, an intent. The charter begins from the road, never from the guide.",
  },
  {
    sigil: "II",
    title: "The Machine",
    desc: "Then the vehicle matched to the terrain. Horse, Cruiser, furgon or expedition — the right way to cross the country you chose.",
  },
  {
    sigil: "III",
    title: "The Companion",
    desc: "Then the host and the guide, matched to the road. A guide whose rank meets the country — for a guide is not the product, the whole journey is.",
  },
  {
    sigil: "IV",
    title: "The Charter",
    desc: "We write back with a charted map and a written charter. Every reply comes from a guide, not a sales desk.",
  },
];

/* ────────────────────────────────────────────────────────────
   How a charter is made — restructured as a "stations" sequence.
   Each tenet is a chapter card backed by a massive translucent
   Roman numeral. Cards offset in a slight staircase pattern so
   the eye walks down them like ledger entries rather than
   scanning a row of equal tiles.
   ──────────────────────────────────────────────────────────── */

export default function GuildSection() {
  return (
    <section className="relative py-24 md:py-32 px-6 overflow-hidden bg-background">
      {/* Diffused warm light pools */}
      <div className="absolute inset-0 pointer-events-none opacity-60">
        <div className="absolute top-1/4 left-10 w-[28rem] h-[28rem] rounded-full bg-accent/[0.04] blur-3xl" />
        <div className="absolute bottom-1/4 right-10 w-[24rem] h-[24rem] rounded-full bg-highlight/[0.08] blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Asymmetric heading lockup — eyebrow + headline on the left,
            short intro on the right and offset downward. */}
        <motion.div
          variants={staggerParent(STAGGER.base, STAGGER.base)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-x-16 gap-y-10 mb-24"
        >
          <div>
            <motion.p
              variants={revealVariants("rise", DUR.base)}
              className="font-accent italic text-accent text-[14px] tracking-[0.35em] uppercase mb-5"
            >
              The Charter of the Guild
            </motion.p>
            <motion.h2
              variants={revealVariants("blur", DUR.slow)}
              className="font-heading text-4xl md:text-6xl uppercase tracking-[0.08em] text-foreground ember-text-glow leading-[1.05]"
            >
              How a charter <span className="text-accent">is made</span>
            </motion.h2>
            <motion.div
              variants={revealVariants("wipe", DUR.base)}
              className="ink-divider mt-10 max-w-sm"
            />
          </div>
          <motion.p
            variants={revealVariants("rise", DUR.base)}
            className="text-foreground/80 text-[17px] font-serif italic leading-[1.85] lg:pt-20"
          >
            Four steps. No middlemen. The same four steps as a hundred years
            ago, with the addition that you can begin them from a screen.
          </motion.p>
        </motion.div>

        {/* Stations — 2-up grid with each card staircased and a huge
            translucent numeral behind it. */}
        <motion.div
          variants={staggerParent(STAGGER.loose)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-20"
        >
          {tenets.map((t, i) => (
            <motion.article
              key={t.sigil}
              variants={revealVariants("rise", DUR.slow)}
              className={[
                "relative group",
                // Staircase: each card offsets slightly differently so the
                // four entries read as descending ledger marks, not a row.
                i === 1 ? "md:translate-y-12" : "",
                i === 2 ? "md:-translate-y-4" : "",
                i === 3 ? "md:translate-y-16" : "",
              ].join(" ")}
            >
              {/* Massive translucent Roman numeral — the chapter mark */}
              <span
                aria-hidden
                className="pointer-events-none select-none absolute -top-10 -left-2 sm:-left-6 font-heading text-accent/[0.07] leading-none text-[10rem] sm:text-[14rem]"
              >
                {t.sigil}
              </span>

              <div className="relative p-9 md:p-11 bg-surface/55 backdrop-blur-[2px] border border-highlight/30 group-hover:border-accent/60 transition-all duration-700 ember-glow">
                <div className="flex items-baseline gap-5 mb-6">
                  <span className="font-heading text-accent text-2xl tracking-[0.25em]">
                    {t.sigil}
                  </span>
                  <span className="h-px flex-1 bg-accent/30" />
                </div>
                <h3 className="font-heading uppercase tracking-[0.1em] text-[22px] text-foreground mb-5">
                  {t.title}
                </h3>
                <p className="text-muted text-[15px] leading-[1.85] font-serif">
                  {t.desc}
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          variants={revealVariants("rise", DUR.slow)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="mt-32 text-center flex flex-col sm:flex-row gap-5 justify-center items-center"
        >
          <Link
            href="/guides"
            className="px-12 py-5 border border-accent bg-accent/15 hover:bg-accent hover:text-background transition-all duration-500 font-accent text-[12px] tracking-[0.35em] uppercase text-foreground ember-glow"
          >
            Open the Roster
          </Link>
          <Link
            href="/map"
            className="px-12 py-5 border border-highlight/50 hover:border-accent transition-all duration-500 font-accent text-[12px] tracking-[0.35em] uppercase text-muted hover:text-foreground"
          >
            See the Map
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
