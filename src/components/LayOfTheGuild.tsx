"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  DUR,
  EASE,
  STAGGER,
  VIEWPORT,
  revealVariants,
  staggerParent,
} from "@/lib/motion";

const STANZAS = [
  "There is a country east of the maps, where the grass goes farther than the eye can decide.",
  "In its long summer, horses outnumber roads. In its long winter, silence outnumbers everything.",
  "A few quiet riders, in the year MMXIV, named themselves a guild — not to sell the country, but to keep it from being mistold.",
  "They do not lead tours. They lead patrons. One guide, one charter, one road at a time.",
];

export default function LayOfTheGuild() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      id="lay"
      className="relative px-6 py-20 md:py-40 overflow-hidden bg-background"
    >
      {/* Slow ride video — Ken-Burns drift on top of the existing veiling.
          A very gentle 30s scale 1 → 1.06 reads as cinematic ambient motion
          without ever being noticed as an animation. */}
      <div className="absolute inset-0 z-0">
        <motion.video
          autoPlay
          loop
          muted
          playsInline
          className="object-cover w-full h-full"
          style={{
            filter: "sepia(35%) saturate(70%) brightness(0.55) contrast(1.05)",
          }}
          initial={{ scale: 1 }}
          animate={prefersReduced ? { scale: 1 } : { scale: 1.06 }}
          transition={{
            duration: 30,
            ease: "linear",
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <source src="/ride.mp4" type="video/mp4" />
        </motion.video>
      </div>

      {/* Atmospheric overlays */}
      <div aria-hidden className="absolute inset-0 z-[1] pointer-events-none">
        <div className="absolute inset-0 bg-[#0D0A07]/82" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(110% 80% at 50% 50%, transparent 10%, rgba(13,10,7,0.5) 65%, rgba(13,10,7,0.95) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(40% 50% at 50% 48%, rgba(201,146,42,0.10), transparent 70%)",
          }}
        />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* The whole prologue reveals as one orchestrated sequence. */}
      <motion.div
        variants={staggerParent(STAGGER.base, STAGGER.base)}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        className="max-w-4xl mx-auto relative z-10 text-center"
      >
        <motion.p
          variants={revealVariants("rise", DUR.base)}
          className="font-accent italic text-accent text-[13px] tracking-[0.4em] uppercase mb-6"
        >
          The Lay of the Guild
        </motion.p>

        <motion.h2
          variants={revealVariants("blur", DUR.slow)}
          className="font-heading text-3xl sm:text-5xl uppercase tracking-[0.1em] text-foreground ember-text-glow mb-12"
        >
          A short prologue
        </motion.h2>

        <motion.div
          variants={revealVariants("wipe", DUR.base)}
          className="ink-divider mb-12 max-w-md mx-auto"
        />

        <motion.div
          variants={staggerParent(STAGGER.loose)}
          className="space-y-8"
        >
          {STANZAS.map((line, i) => (
            <motion.p
              key={i}
              variants={revealVariants("rise", DUR.slow)}
              className="font-serif italic text-foreground/95 text-[20px] sm:text-[24px] leading-[1.7]"
              transition={{ duration: DUR.slow, ease: EASE }}
            >
              {line}
            </motion.p>
          ))}
        </motion.div>

        <motion.div
          variants={revealVariants("fade", DUR.slow)}
          className="mt-14 flex items-center justify-center gap-4 text-accent font-accent text-[16px] tracking-[0.6em]"
        >
          <span>—</span>
          <span>✦</span>
          <span>—</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
