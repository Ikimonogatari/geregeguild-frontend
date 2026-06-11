"use client";

import { motion } from "framer-motion";

const STANZAS = [
  "There is a country east of the maps, where the grass goes farther than the eye can decide.",
  "In its long summer, horses outnumber roads. In its long winter, silence outnumbers everything.",
  "A few quiet riders, in the year MMXIV, named themselves a guild — not to sell the country, but to keep it from being mistold.",
  "They do not lead tours. They lead patrons. One guide, one charter, one road at a time.",
];

export default function LayOfTheGuild() {
  return (
    <section
      id="lay"
      className="relative px-6 py-20 md:py-40 overflow-hidden bg-background"
    >
      {/* Slow ride video, deeply veiled */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="object-cover w-full h-full"
          style={{
            filter: "sepia(35%) saturate(70%) brightness(0.55) contrast(1.05)",
          }}
        >
          <source src="/ride.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Atmospheric overlays */}
      <div aria-hidden className="absolute inset-0 z-[1] pointer-events-none">
        {/* Heavy uniform dark veil */}
        <div className="absolute inset-0 bg-[#0D0A07]/82" />
        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(110% 80% at 50% 50%, transparent 10%, rgba(13,10,7,0.5) 65%, rgba(13,10,7,0.95) 100%)",
          }}
        />
        {/* Ember pool behind text */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(40% 50% at 50% 48%, rgba(201,146,42,0.10), transparent 70%)",
          }}
        />
        {/* Edges fade into adjacent sections */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-accent italic text-accent text-[13px] tracking-[0.4em] uppercase mb-6"
        >
          The Lay of the Guild
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="font-heading text-3xl sm:text-5xl uppercase tracking-[0.1em] text-foreground ember-text-glow mb-12"
        >
          A short prologue
        </motion.h2>

        <div className="ink-divider mb-12 max-w-md mx-auto" />

        <div className="space-y-8">
          {STANZAS.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: i * 0.18, ease: "easeOut" }}
              className="font-serif italic text-foreground/95 text-[20px] sm:text-[24px] leading-[1.7]"
            >
              {line}
            </motion.p>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-14 flex items-center justify-center gap-4 text-accent font-accent text-[16px] tracking-[0.6em]"
        >
          <span>—</span>
          <span>✦</span>
          <span>—</span>
        </motion.div>
      </div>
    </section>
  );
}
