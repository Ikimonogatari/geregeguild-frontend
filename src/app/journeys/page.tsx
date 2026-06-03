"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JourneyCard from "@/components/JourneyCard";
import ChooseByInterest from "@/components/ChooseByInterest";
import {
  JOURNEYS,
  JOURNEY_CATEGORIES,
  CATEGORY_SIGIL,
  type JourneyCategory,
} from "@/lib/journeys";

export default function JourneysPage() {
  const [category, setCategory] = useState<JourneyCategory | "All">("All");

  const visible = useMemo(() => {
    if (category === "All") return JOURNEYS;
    return JOURNEYS.filter((j) => j.category === category);
  }, [category]);

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* Hero strip */}
      <section className="relative pt-40 pb-14 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-accent italic text-accent text-[14px] tracking-[0.4em] uppercase mb-5"
          >
            The Roads of the Guild
          </motion.p>
          <motion.h1
            initial={{ scaleY: 0.05, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ duration: 1.1, ease: [0.2, 0.7, 0.2, 1] }}
            style={{ transformOrigin: "top center" }}
            className="font-heading text-4xl sm:text-5xl md:text-7xl uppercase tracking-[0.12em] text-foreground ember-text-glow"
          >
            Choose Your Journey
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-8 text-foreground/90 text-[17px] sm:text-[19px] max-w-2xl mx-auto italic font-serif leading-relaxed"
          >
            Every charter is built from the road upward. First choose the country
            you want to meet — then we match the route, the vehicle, the host and
            the guide around you.
          </motion.p>
        </div>
        <div className="ink-divider mt-14 max-w-3xl mx-auto" />
      </section>

      {/* Category filter */}
      <section className="px-6 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-2.5">
            {(["All", ...JOURNEY_CATEGORIES] as const).map((cat) => {
              const active = category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={[
                    "flex items-center gap-2 px-4 py-2.5 font-accent text-[12px] tracking-[0.16em] uppercase border transition-all duration-300",
                    active
                      ? "border-accent bg-accent/15 text-accent ember-glow"
                      : "border-highlight/40 text-muted hover:border-accent/70 hover:text-foreground",
                  ].join(" ")}
                >
                  {cat !== "All" && (
                    <span className="text-sm leading-none">{CATEGORY_SIGIL[cat]}</span>
                  )}
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Journey grid */}
      <section className="px-6 pb-28">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {visible.map((j, i) => (
              <JourneyCard key={j.slug} journey={j} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Choose by interest */}
      <ChooseByInterest />

      <Footer />
    </main>
  );
}
