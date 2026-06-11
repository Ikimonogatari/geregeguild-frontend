"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import Link from "next/link";
import {
  EASE,
  DUR,
  STAGGER,
  VIEWPORT,
  revealVariants,
  staggerParent,
} from "@/lib/motion";

const pillars = [
  {
    sigil: "♞",
    title: "By Horseback",
    description:
      "Most quests are still walked on horseback. The country reveals itself at a horse's pace, not a jeep's.",
  },
  {
    sigil: "✦",
    title: "Under a Ger",
    description:
      "Every charter sleeps at least one night under felt. No hotel chains, no buffets. Tea, fire, family.",
  },
  {
    sigil: "☉",
    title: "Through All Seasons",
    description:
      "Summer green, autumn gold, winter blue. Mongolia is not one country — it is four, one per season.",
  },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();

  // Subtle parallax on the pinned portrait — drifts within its frame as the
  // taller column scrolls past it. Disabled under reduced-motion.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReduced ? ["0%", "0%"] : ["-6%", "6%"],
  );

  return (
    <section
      ref={sectionRef}
      id="lore"
      className="relative py-16 md:py-24 px-6"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-16 lg:gap-24 lg:items-start">
          {/* Portrait — pinned on large screens so it stays in view while the
              longer column scrolls past it. */}
          <div className="order-2 lg:order-1 lg:sticky lg:top-24 lg:self-start">
            <motion.div
              variants={revealVariants("blur", DUR.cinematic)}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
            >
              <div className="relative vignette ember-glow border border-highlight/40 overflow-hidden">
                <motion.img
                  src="/1.jpg"
                  alt="A guide of the Guild"
                  style={{ y: imageY }}
                  className="w-full h-[500px] md:h-[640px] object-cover scale-[1.12] grayscale-[20%] sepia-[28%] brightness-[0.92]"
                />
                <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 z-20 text-foreground">
                  <p className="font-accent italic text-accent text-[12px] tracking-[0.35em] uppercase">
                    The Guildmaster
                  </p>
                  <p className="font-heading text-3xl md:text-4xl uppercase tracking-[0.08em] mt-2">
                    Vanya Bazarvaana
                  </p>
                  <p className="font-accent italic text-muted text-[13px] mt-1">
                    First Among Riders · Founder of the Guild
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Lore column — reveals in sequence as it enters. */}
          <motion.div
            variants={staggerParent(STAGGER.base, STAGGER.base)}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            className="order-1 lg:order-2"
          >
            <motion.p
              variants={revealVariants("rise", DUR.base)}
              className="font-accent italic text-accent text-[14px] tracking-[0.35em] uppercase mb-5"
            >
              The Hall
            </motion.p>
            <motion.h2
              variants={revealVariants("blur", DUR.slow)}
              className="font-heading text-4xl sm:text-5xl md:text-6xl uppercase tracking-[0.08em] leading-[1.1] text-foreground"
            >
              Every charter is built from the{" "}
              <span className="text-accent">road</span> upward.
            </motion.h2>

            <motion.div
              variants={revealVariants("wipe", DUR.base)}
              className="ink-divider my-10"
            />

            <motion.p
              variants={revealVariants("rise", DUR.base)}
              className="text-foreground/90 text-[19px] leading-[1.9] font-serif italic mb-6"
            >
              The Guild was founded by a few quiet riders who refused to call
              what they did <em>tourism</em>. We build whole journeys — a route
              designed around you, the right machine for its terrain, the hosts
              along the way, and a guide whose rank meets the road.
            </motion.p>
            <motion.p
              variants={revealVariants("rise", DUR.base)}
              className="text-muted text-[17px] leading-[1.85] font-serif mb-12"
            >
              First choose the Mongolia you want to meet. Then we match the
              route, vehicle, host and guide around you. A guide is not the
              product — the whole journey is.
            </motion.p>

            <motion.div
              variants={staggerParent(STAGGER.tight)}
              className="space-y-6 mb-12"
            >
              {pillars.map((p) => (
                <motion.div
                  key={p.title}
                  variants={revealVariants("rise", DUR.base)}
                  className="flex gap-5 items-start border-l-2 border-accent/40 pl-5"
                >
                  <span className="text-accent text-3xl leading-none mt-1">
                    {p.sigil}
                  </span>
                  <div>
                    <h3 className="font-heading uppercase tracking-[0.1em] text-[17px] text-foreground mb-1">
                      {p.title}
                    </h3>
                    <p className="text-muted text-[15px] leading-relaxed font-serif">
                      {p.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={revealVariants("rise", DUR.base)}>
              <Link
                href="/journeys"
                className="inline-block px-10 py-5 border border-accent bg-accent/10 hover:bg-accent hover:text-background transition-all duration-500 font-accent text-[12px] tracking-[0.35em] uppercase text-foreground ember-glow"
              >
                Choose Your Journey
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
