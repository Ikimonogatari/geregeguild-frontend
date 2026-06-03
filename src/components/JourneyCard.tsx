"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Journey } from "@/lib/journeys";
import { CATEGORY_SIGIL } from "@/lib/journeys";
import { formatPrice } from "@/lib/format";
import JourneyQuickLook from "./JourneyQuickLook";

type Props = {
  journey: Journey;
  index?: number;
};

export default function JourneyCard({ journey, index = 0 }: Props) {
  const [open, setOpen] = useState(false);
  const isCustom = journey.category === "Custom";

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, delay: index * 0.07, ease: "easeOut" }}
        className="group relative text-left w-full bg-surface/60 border border-highlight/40 hover:border-accent/70 transition-all duration-500 ember-glow overflow-hidden flex flex-col"
      >
        {/* Image plate */}
        <div className="relative h-[208px] w-full overflow-hidden vignette">
          <img
            src={journey.image}
            alt={journey.title}
            className="w-full h-full object-cover grayscale-[15%] sepia-[28%] brightness-[0.82] transition-all duration-700 group-hover:brightness-[0.95] group-hover:scale-[1.04]"
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-surface to-transparent" />
          <div className="absolute top-3 left-3 flex items-center gap-2 bg-background/70 backdrop-blur-sm border border-accent/30 px-3 py-1.5">
            <span className="text-accent text-base leading-none">
              {CATEGORY_SIGIL[journey.category]}
            </span>
            <span className="font-accent uppercase tracking-[0.22em] text-[10px] text-foreground/90">
              {journey.category}
            </span>
          </div>
          <span className="absolute bottom-3 right-3 font-accent italic text-accent text-[12px] tracking-[0.2em] uppercase">
            {journey.region}
          </span>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col flex-1">
          <h3 className="font-heading uppercase tracking-[0.08em] text-[21px] leading-tight text-foreground group-hover:text-accent transition-colors duration-500 line-clamp-2 min-h-[2.5em] flex items-start">
            {journey.title}
          </h3>
          <p className="mt-3 text-foreground/80 text-[15px] leading-relaxed font-serif italic line-clamp-3 min-h-[4.9em]">
            {journey.hook}
          </p>

          <div className="ink-divider my-5" />

          {isCustom ? (
            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
              <Stat label="Region" value="Anywhere" />
              <Stat label="Season" value="Any" />
              <Stat label="Difficulty" value="Your call" />
              <Stat label="Vehicle" value="Matched" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
              <Stat label="Duration" value={`${journey.days} days`} />
              <Stat label="Distance" value={`${journey.distanceKm} km`} />
              <Stat label="Difficulty" value={journey.difficulty} />
              <Stat label="Best season" value={journey.season.split("·")[0].trim()} />
            </div>
          )}

          <div className="mt-auto pt-4 border-t border-highlight/30 flex items-center justify-between">
            <span className="font-accent uppercase tracking-[0.2em] text-[11px] text-muted">
              {isCustom ? "By design" : "From"}{" "}
              <span className="text-accent not-italic">
                {isCustom ? "" : formatPrice(journey.priceFrom)}
              </span>
            </span>
            <span className="font-accent uppercase tracking-[0.25em] text-[11px] text-accent group-hover:translate-x-1 transition-transform duration-300">
              Quick look →
            </span>
          </div>
        </div>
      </motion.button>

      <JourneyQuickLook journey={journey} open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="font-accent uppercase tracking-[0.2em] text-[9px] text-muted">
        {label}
      </span>
      <span className="font-serif text-foreground text-[14px] leading-tight mt-0.5">
        {value}
      </span>
    </div>
  );
}
