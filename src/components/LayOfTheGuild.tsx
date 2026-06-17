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

/* ────────────────────────────────────────────────────────────
   The Prologue — a cinematic, scroll-driven section. The ride
   video pins as a full-bleed underlay; the title and four
   stanzas each occupy their own viewport-height "panel" that
   scrolls over the pinned video, like the opening of a film.
   ──────────────────────────────────────────────────────────── */

export default function LayOfTheGuild() {
  const prefersReduced = useReducedMotion();

  return (
    <section id="lay" className="relative bg-background">
      {/* Outer wrapper carries the total scroll length (~6 screens).
          Inside it, the video pins for the entire scroll, and the text
          panels scroll over it one viewport-height beat at a time —
          h-screen per panel guarantees no two stanzas share the viewport. */}
      <div className="relative" style={{ height: "min(600vh, 5400px)" }}>
        {/* Pinned video + atmospheric overlays — sticks for the whole scroll */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <motion.video
            autoPlay
            loop
            muted
            playsInline
            className="object-cover w-full h-full"
            style={{
              filter:
                "sepia(35%) saturate(70%) brightness(0.55) contrast(1.05)",
            }}
            initial={{ scale: 1 }}
            animate={prefersReduced ? { scale: 1 } : { scale: 1.08 }}
            transition={{
              duration: 40,
              ease: "linear",
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <source src="/ride.mp4" type="video/mp4" />
          </motion.video>

          {/* Atmospheric overlays — same layered veiling as before */}
          <div aria-hidden className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-[#0D0A07]/82" />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(110% 80% at 50% 50%, transparent 10%, rgba(13,10,7,0.5) 65%, rgba(13,10,7,0.95) 100%)",
              }}
            />
            <div
              className="absolute inset-0 ember-breath"
              style={{
                background:
                  "radial-gradient(40% 50% at 50% 48%, rgba(201,146,42,0.10), transparent 70%)",
              }}
            />
            {/* Bleed into adjacent sections */}
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
          </div>
        </div>

        {/* Text panels — overlaid on the pinned video, each one a viewport beat. */}
        <div className="absolute inset-0 z-10">
          {/* Panel I — title beat */}
          <div className="h-screen flex items-center justify-center px-6">
            <motion.div
              variants={staggerParent(STAGGER.base, STAGGER.base)}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
              className="max-w-3xl mx-auto text-center"
            >
              <motion.p
                variants={revealVariants("rise", DUR.base)}
                className="font-accent italic text-accent text-[13px] tracking-[0.4em] uppercase mb-6"
              >
                The Lay of the Guild
              </motion.p>
              <motion.h2
                variants={revealVariants("blur", DUR.slow)}
                className="font-heading text-4xl sm:text-6xl md:text-7xl uppercase tracking-[0.1em] text-foreground ember-text-glow"
              >
                A short prologue
              </motion.h2>
              <motion.div
                variants={revealVariants("wipe", DUR.base)}
                className="ink-divider mx-auto mt-10 max-w-md"
              />
              <motion.p
                variants={revealVariants("rise", DUR.base)}
                className="mt-12 font-accent italic text-muted text-[12px] tracking-[0.5em] uppercase"
              >
                — scroll —
              </motion.p>
            </motion.div>
          </div>

          {/* Panels II–V — one stanza per viewport beat. h-screen so
              no two stanzas can ever share the viewport at once. */}
          {STANZAS.map((line, i) => (
            <div
              key={i}
              className="h-screen flex items-center justify-center px-6"
            >
              <motion.div
                variants={staggerParent(STAGGER.base)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "0px 0px -25% 0px" }}
                className="max-w-4xl mx-auto text-center"
              >
                {/* Tiny chapter ordinal — Roman numeral marks the beat */}
                <motion.p
                  variants={revealVariants("fade", DUR.base)}
                  className="font-accent italic text-accent/70 text-[11px] tracking-[0.6em] uppercase mb-8"
                >
                  · {toRoman(i + 1)} ·
                </motion.p>
                <motion.p
                  variants={revealVariants("blur", DUR.slow)}
                  transition={{ duration: DUR.slow, ease: EASE }}
                  className="font-serif italic text-foreground text-[22px] sm:text-[28px] md:text-[34px] leading-[1.55]"
                >
                  {line}
                </motion.p>
              </motion.div>
            </div>
          ))}

          {/* Final beat — closing ornament */}
          <div className="h-screen flex items-center justify-center px-6">
            <motion.div
              variants={staggerParent(STAGGER.base, STAGGER.base)}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
              className="flex flex-col items-center gap-8"
            >
              <motion.div
                variants={revealVariants("fade", DUR.slow)}
                className="flex items-center justify-center gap-5 text-accent font-accent text-[18px] tracking-[0.6em]"
              >
                <span>—</span>
                <span>✦</span>
                <span>—</span>
              </motion.div>
              <motion.p
                variants={revealVariants("rise", DUR.base)}
                className="font-accent italic text-muted text-[12px] tracking-[0.5em] uppercase"
              >
                Then begins the road.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Roman numerals 1–9 — enough for our four stanzas with headroom. */
function toRoman(n: number) {
  return ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"][n - 1] ?? String(n);
}
