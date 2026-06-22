"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
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
    rating: 5,
    content:
      "An absolute masterclass in Mongolian travel. Despite fuel shortages on the road, our guide's herculean efforts ensured the winter expedition was a total success. Local knowledge, fluent English, quiet humour — exceptional.",
    image: "/5.jpg",
  },
  {
    name: "Fletcher Bradford",
    region: "Taiga Charter — North",
    rating: 5,
    content:
      "Staying with nomadic families and visiting the reindeer herders was life-changing. One of the most memorable things I have ever done. Our guide was more than a guide; by the end of the road he was a friend.",
    image: "/6.jpg",
  },
];

/* ────────────────────────────────────────────────────────────
   Chronicles — two equal "framed letter" testimonials, side by
   side. Each card carries the patron's portrait, a star rating,
   the testimonial in italic serif, and a signed-off attribution.
   Clean, balanced, brand-appropriate.
   ──────────────────────────────────────────────────────────── */

export default function Reviews() {
  return (
    <section
      id="tales"
      className="relative py-20 md:py-28 px-6 overflow-hidden bg-background"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Heading */}
        <motion.div
          variants={staggerParent(STAGGER.base, STAGGER.base)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <motion.p
            variants={revealVariants("rise", DUR.base)}
            className="font-accent italic text-accent text-[14px] tracking-[0.35em] uppercase mb-5"
          >
            Chronicles
          </motion.p>
          <motion.h2
            variants={revealVariants("blur", DUR.slow)}
            className="font-heading text-4xl md:text-5xl uppercase tracking-[0.08em] leading-[1.1] text-foreground ember-text-glow"
          >
            Tales from the <span className="text-accent">road</span>
          </motion.h2>
          <motion.div
            variants={revealVariants("wipe", DUR.base)}
            className="ink-divider mt-9 max-w-xs mx-auto"
          />
          <motion.p
            variants={revealVariants("rise", DUR.base)}
            className="mt-7 text-muted text-[16px] font-serif italic leading-[1.85]"
          >
            Honest words from patrons who have ridden with the Guild. Each
            chronicle was sent by raven, unedited.
          </motion.p>
        </motion.div>

        {/* Two framed-letter cards */}
        <motion.div
          variants={staggerParent(STAGGER.base, STAGGER.base)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="grid grid-cols-1 md:grid-cols-2 gap-7"
        >
          {tales.map((t) => (
            <motion.article
              key={t.name}
              variants={revealVariants("rise", DUR.slow)}
              className="relative bg-surface/55 border border-highlight/35 ember-glow p-8 sm:p-10 flex flex-col group hover:border-accent/60 transition-colors duration-700"
            >
              {/* Inner double rule — adds the framed-letter feel */}
              <div
                aria-hidden
                className="absolute inset-3 border border-accent/15 pointer-events-none"
              />

              {/* Portrait + star rating */}
              <div className="relative flex items-center gap-5 mb-7">
                <div className="vignette w-16 h-16 sm:w-20 sm:h-20 overflow-hidden border border-accent/55 shrink-0 ember-glow">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-full h-full object-cover grayscale-[18%] sepia-[28%] brightness-[0.9]"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-heading uppercase tracking-[0.12em] text-foreground text-[16px] sm:text-[18px] leading-tight">
                    {t.name}
                  </p>
                  <p className="font-accent italic text-accent text-[11px] tracking-[0.2em] uppercase mt-1.5">
                    {t.region}
                  </p>
                  <div className="flex items-center gap-0.5 mt-2.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        strokeWidth={1.5}
                        className={i < t.rating ? "text-accent" : "text-highlight/40"}
                        fill={i < t.rating ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Ink divider between header and body */}
              <div className="ink-divider mb-7 opacity-70" />

              {/* The testimonial body */}
              <blockquote className="relative font-serif italic text-foreground/90 text-[17px] sm:text-[18px] leading-[1.85] flex-1">
                <span
                  aria-hidden
                  className="absolute -top-3 -left-1 font-heading text-accent/30 text-[3.5rem] leading-none select-none pointer-events-none"
                >
                  &ldquo;
                </span>
                <span className="relative">{t.content}</span>
              </blockquote>

              {/* Wax-seal style signature mark */}
              <div className="mt-8 flex items-center gap-3 pt-5 border-t border-highlight/25">
                <span className="font-accent text-accent text-base leading-none">
                  ✦
                </span>
                <span className="font-accent italic text-muted text-[11px] tracking-[0.3em] uppercase">
                  Sent by raven · unedited
                </span>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
