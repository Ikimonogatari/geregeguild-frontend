"use client";

import { motion } from "framer-motion";
import Link from "next/link";

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
  return (
    <section
      id="lore"
      className="relative py-28 md:py-36 px-6 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-16 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="order-2 lg:order-1"
          >
            <div className="relative vignette ember-glow border border-highlight/40">
              <img
                src="/1.jpg"
                alt="A guide of the Guild"
                className="w-full h-[500px] md:h-[680px] object-cover grayscale-[20%] sepia-[28%] brightness-[0.92]"
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

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="order-1 lg:order-2"
          >
            <p className="font-accent italic text-accent text-[14px] tracking-[0.35em] uppercase mb-5">
              The Hall
            </p>
            <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl uppercase tracking-[0.08em] leading-[1.1] text-foreground">
              Every charter is built from the{" "}
              <span className="text-accent">road</span> upward.
            </h2>

            <div className="ink-divider my-10" />

            <p className="text-foreground/90 text-[19px] leading-[1.9] font-serif italic mb-6">
              The Guild was founded by a few quiet riders who refused to call
              what they did <em>tourism</em>. We build whole journeys — a route
              designed around you, the right machine for its terrain, the hosts
              along the way, and a guide whose rank meets the road.
            </p>
            <p className="text-muted text-[17px] leading-[1.85] font-serif mb-12">
              First choose the Mongolia you want to meet. Then we match the
              route, vehicle, host and guide around you. A guide is not the
              product — the whole journey is.
            </p>

            <div className="space-y-6 mb-12">
              {pillars.map((p) => (
                <div
                  key={p.title}
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
                </div>
              ))}
            </div>

            <Link
              href="/journeys"
              className="inline-block px-10 py-5 border border-accent bg-accent/10 hover:bg-accent hover:text-background transition-all duration-500 font-accent text-[12px] tracking-[0.35em] uppercase text-foreground ember-glow"
            >
              Choose Your Journey
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
