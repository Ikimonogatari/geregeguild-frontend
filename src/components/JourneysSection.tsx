"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import JourneyCard from "@/components/JourneyCard";
import QuillDivider from "@/components/QuillDivider";
import { JOURNEYS } from "@/lib/journeys";
import {
  DUR,
  STAGGER,
  VIEWPORT,
  revealVariants,
  staggerParent,
} from "@/lib/motion";

/* ────────────────────────────────────────────────────────────
   The Roads — restructured with an asymmetric editorial heading
   lockup. Eyebrow + headline anchor the left; the intro paragraph
   sits in the right column and offsets down. A huge translucent
   "VI" Roman numeral floats behind the heading as a chapter mark.
   ──────────────────────────────────────────────────────────── */

export default function JourneysSection() {
  const featured = JOURNEYS.filter((j) => j.category !== "Custom").slice(0, 6);

  return (
    <section
      id="journeys"
      className="relative py-20 md:py-32 px-6 overflow-hidden bg-background"
    >
      {/* Slow ember wash */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none ember-breath"
        style={{
          background:
            "radial-gradient(60% 40% at 50% 10%, rgba(201,146,42,0.08), transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto">
        {/* Editorial heading lockup */}
        <motion.div
          variants={staggerParent(STAGGER.base, STAGGER.base)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="relative grid grid-cols-1 lg:grid-cols-[1.45fr_1fr] gap-x-16 gap-y-10 mb-20"
        >
          {/* Massive translucent chapter mark — sits behind the headline */}
          <span
            aria-hidden
            className="pointer-events-none select-none absolute -top-12 sm:-top-20 right-0 lg:right-auto lg:left-[40%] font-heading text-accent/[0.06] leading-none text-[12rem] sm:text-[18rem]"
          >
            VI
          </span>

          <div className="relative">
            <motion.p
              variants={revealVariants("rise", DUR.base)}
              className="font-accent italic text-accent text-[14px] tracking-[0.35em] uppercase mb-5 inline-flex items-center gap-4"
            >
              <motion.span
                variants={revealVariants("wipe", DUR.base)}
                style={{ transformOrigin: "right" }}
                className="block w-10 h-px bg-accent/60"
              />
              <span>The Roads</span>
            </motion.p>
            <motion.h2
              variants={revealVariants("blur", DUR.slow)}
              className="font-heading text-4xl md:text-6xl lg:text-7xl uppercase tracking-[0.06em] text-foreground ember-text-glow leading-[0.98]"
            >
              First choose<br />
              the Mongolia<br />
              <span className="text-accent">you want to meet</span>
            </motion.h2>
            <motion.div
              variants={revealVariants("fade", DUR.base)}
              className="mt-10"
            >
              <QuillDivider width={300} />
            </motion.div>
          </div>

          <motion.div
            variants={revealVariants("rise", DUR.base)}
            className="lg:pt-32"
          >
            <p className="text-foreground/85 text-[18px] font-serif italic leading-[1.85]">
              Every charter is built from the road upward. Choose a journey,
              and we match the route, the vehicle, the host and the guide
              around you.
            </p>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((j, i) => (
            <JourneyCard key={j.slug} journey={j} index={i} />
          ))}
        </div>

        <motion.div
          variants={revealVariants("rise", DUR.slow)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="mt-20 text-center flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/journeys"
            className="px-12 py-5 border border-accent bg-accent/15 hover:bg-accent hover:text-background transition-all duration-500 font-accent text-[12px] tracking-[0.4em] uppercase text-foreground ember-glow"
          >
            Explore all routes
          </Link>
          <Link
            href="/journeys#interest"
            className="px-12 py-5 border border-highlight/50 hover:border-accent transition-all duration-500 font-accent text-[12px] tracking-[0.35em] uppercase text-muted hover:text-foreground"
          >
            Choose by interest
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
