"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import JourneyCard from "@/components/JourneyCard";
import { JOURNEYS } from "@/lib/journeys";

export default function JourneysSection() {
  // Tease a spread across categories; the custom charter lives on the full page.
  const featured = JOURNEYS.filter((j) => j.category !== "Custom").slice(0, 6);

  return (
    <section id="journeys" className="relative py-28 md:py-36 px-6 overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-accent italic text-accent text-[14px] tracking-[0.35em] uppercase mb-5"
          >
            The Roads
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-heading text-4xl md:text-6xl uppercase tracking-[0.08em] text-foreground ember-text-glow leading-tight"
          >
            First choose the Mongolia<br className="hidden sm:block" /> you want to meet
          </motion.h2>
          <div className="ink-divider mt-10 mb-10 max-w-md mx-auto" />
          <p className="text-foreground/85 text-[18px] font-serif italic leading-relaxed">
            Every charter is built from the road upward. Choose a journey, and we
            match the route, the vehicle, the host and the guide around you.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((j, i) => (
            <JourneyCard key={j.slug} journey={j} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-16 text-center flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/journeys"
            className="px-12 py-5 border border-accent bg-accent/15 hover:bg-accent hover:text-background transition-all duration-500 font-accent text-[12px] tracking-[0.4em] uppercase text-foreground ember-glow"
          >
            Explore all routes
          </Link>
          <Link
            href="/journeys#interest"
            className="px-12 py-5 border border-highlight/50 hover:border-accent transition-all duration-500 font-accent text-[12px] tracking-[0.35em] uppercase text-muted hover:text-foreground"
          >
            Choose by interest
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
