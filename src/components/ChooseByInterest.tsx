"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import JourneyCard from "@/components/JourneyCard";
import { INTERESTS, journeysForInterest, type Interest } from "@/lib/journeys";
import {
  DUR,
  EASE,
  STAGGER,
  VIEWPORT,
  revealVariants,
  staggerParent,
} from "@/lib/motion";

type Props = {
  /** When true the section paints its own heading + intro (home page). */
  withHeading?: boolean;
};

export default function ChooseByInterest({ withHeading = true }: Props) {
  const [selected, setSelected] = useState<Interest | null>(null);
  const matches = selected ? journeysForInterest(selected) : [];

  return (
    <section id="interest" className="relative py-16 md:py-24 px-6 overflow-hidden bg-background">
      {/* Diffused warm light pools */}
      <div className="absolute inset-0 pointer-events-none opacity-60">
        <div className="absolute top-1/4 right-10 w-[26rem] h-[26rem] rounded-full bg-accent/[0.04] blur-3xl" />
        <div className="absolute bottom-1/4 left-10 w-[22rem] h-[22rem] rounded-full bg-highlight/[0.08] blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {withHeading && (
          <motion.div
            variants={staggerParent(STAGGER.base, STAGGER.base)}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            className="text-center mb-14 max-w-3xl mx-auto"
          >
            <motion.p
              variants={revealVariants("rise", DUR.base)}
              className="font-accent italic text-accent text-[14px] tracking-[0.35em] uppercase mb-5"
            >
              Choose by Interest
            </motion.p>
            <motion.h2
              variants={revealVariants("blur", DUR.slow)}
              className="font-heading text-4xl md:text-6xl uppercase tracking-[0.08em] text-foreground ember-text-glow"
            >
              Tell us what you came for
            </motion.h2>
            <motion.div
              variants={revealVariants("wipe", DUR.base)}
              className="ink-divider mt-10 mb-10 max-w-md mx-auto"
            />
            <motion.p
              variants={revealVariants("rise", DUR.base)}
              className="text-foreground/85 text-[18px] font-serif italic leading-relaxed"
            >
              Then we match the route, vehicle, host and guide around you. Pick an
              intent — the roads that answer it will appear.
            </motion.p>
          </motion.div>
        )}

        {/* Intent chips — cascade in as one beat. */}
        <motion.div
          variants={staggerParent(STAGGER.tight)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="flex flex-wrap justify-center gap-3"
        >
          {INTERESTS.map((interest) => {
            const active = selected?.id === interest.id;
            return (
              <motion.button
                key={interest.id}
                variants={revealVariants("rise", DUR.base)}
                type="button"
                onClick={() => setSelected(active ? null : interest)}
                className={[
                  "flex items-center gap-2.5 px-5 py-3 border font-accent text-[13px] tracking-[0.12em] transition-all duration-300",
                  active
                    ? "border-accent bg-accent/15 text-accent ember-glow"
                    : "border-highlight/40 text-foreground/80 hover:border-accent/70 hover:text-foreground",
                ].join(" ")}
              >
                <span className="text-base leading-none">{interest.sigil}</span>
                {interest.label}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Matched roads */}
        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: DUR.base, ease: EASE }}
              className="mt-14"
            >
              <p className="text-center font-accent italic text-muted text-[13px] tracking-[0.25em] uppercase mb-10">
                {matches.length} {matches.length === 1 ? "road" : "roads"} answer
                {matches.length === 1 ? "s" : ""} this
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {matches.map((j, i) => (
                  <JourneyCard key={j.slug} journey={j} index={i} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!selected && (
          <p className="mt-12 text-center font-accent italic text-muted/70 text-[14px] tracking-[0.2em]">
            — choose an intent to see the roads —
          </p>
        )}
      </div>
    </section>
  );
}
