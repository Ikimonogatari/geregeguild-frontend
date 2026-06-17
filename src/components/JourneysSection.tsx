"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import JourneyCard from "@/components/JourneyCard";
import QuillDivider from "@/components/QuillDivider";
import { JOURNEYS } from "@/lib/journeys";
import {
  DUR,
  EASE,
  STAGGER,
  VIEWPORT,
  revealVariants,
  staggerParent,
} from "@/lib/motion";

export default function JourneysSection() {
  // Tease a spread across categories; the custom charter lives on the full page.
  const featured = JOURNEYS.filter((j) => j.category !== "Custom").slice(0, 6);

  return (
    <section id="journeys" className="relative py-16 md:py-24 px-6 overflow-hidden bg-background">
      {/* Slow ember wash, drifts the breath of the section */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none ember-breath"
        style={{
          background:
            "radial-gradient(60% 40% at 50% 10%, rgba(201,146,42,0.08), transparent 70%)",
        }}
      />
      <div className="relative max-w-7xl mx-auto">
        {/* Heading group reveals as one orchestrated beat. */}
        <motion.div
          variants={staggerParent(STAGGER.base, STAGGER.base)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
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
            <motion.span
              variants={revealVariants("wipe", DUR.base)}
              style={{ transformOrigin: "left" }}
              className="block w-10 h-px bg-accent/60"
            />
          </motion.p>
          <motion.h2
            variants={revealVariants("blur", DUR.slow)}
            className="font-heading text-4xl md:text-6xl uppercase tracking-[0.08em] text-foreground ember-text-glow leading-tight"
          >
            First choose the Mongolia<br className="hidden sm:block" /> you want to meet
          </motion.h2>
          <motion.div
            variants={revealVariants("fade", DUR.base)}
            className="flex justify-center mt-10 mb-10"
          >
            <QuillDivider width={360} />
          </motion.div>
          <motion.p
            variants={revealVariants("rise", DUR.base)}
            className="text-foreground/85 text-[18px] font-serif italic leading-relaxed"
          >
            Every charter is built from the road upward. Choose a journey, and we
            match the route, the vehicle, the host and the guide around you.
          </motion.p>
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
          transition={{ duration: DUR.slow, ease: EASE }}
          className="mt-16 text-center flex flex-col sm:flex-row gap-4 justify-center items-center"
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
