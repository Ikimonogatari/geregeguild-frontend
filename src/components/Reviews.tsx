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

export default function Reviews() {
  return (
    <section
      id="tales"
      className="relative py-16 md:py-24 px-6 overflow-hidden bg-background"
    >
      <div className="max-w-7xl mx-auto relative z-10">
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
              Tales from the road
            </motion.h2>
          </div>
          <motion.p
            variants={revealVariants("rise", DUR.base)}
            className="text-muted text-[17px] max-w-sm font-serif italic leading-relaxed"
          >
            Honest words from patrons who have ridden with the Guild. Each chronicle was sent by raven, unedited.
          </motion.p>
        </motion.div>

        <motion.div
          variants={revealVariants("wipe", DUR.base)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="ink-divider mb-14"
        />

        {/* Tales — staggered as one beat. */}
        <motion.div
          variants={staggerParent(STAGGER.base)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="grid grid-cols-1 md:grid-cols-2 gap-10"
        >
          {tales.map((t) => (
            <motion.article
              key={t.name}
              variants={revealVariants("rise", DUR.slow)}
              className="bg-surface/50 border border-highlight/30 p-8 md:p-12 ember-glow"
            >
              <div className="flex items-center gap-6 mb-8">
                <div className="vignette w-24 h-24 md:w-28 md:h-28 overflow-hidden border border-accent/40">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-full h-full object-cover grayscale-[20%] sepia-[30%]"
                  />
                </div>
                <div>
                  <h3 className="font-heading uppercase tracking-[0.1em] text-foreground text-[20px]">
                    {t.name}
                  </h3>
                  <p className="font-accent italic text-accent text-[13px] tracking-[0.2em] uppercase mt-1">
                    {t.region}
                  </p>
                </div>
              </div>
              <p className="text-foreground/90 font-serif italic text-[18px] leading-[1.85]">
                &ldquo;{t.content}&rdquo;
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
