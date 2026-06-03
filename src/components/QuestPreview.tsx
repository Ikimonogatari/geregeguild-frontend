"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import GuideCard from "@/components/GuideCard";
import { GUIDES } from "@/lib/guides";

export default function QuestPreview() {
  // Tease: Guildmaster + one Master + one Apprentice
  const featured = [
    GUIDES.find((g) => g.level === "Guildmaster"),
    GUIDES.find((g) => g.level === "Master"),
    GUIDES.find((g) => g.level === "Apprentice"),
  ].filter(Boolean) as typeof GUIDES;

  return (
    <section
      id="roster"
      className="relative py-28 md:py-36 px-6 overflow-hidden bg-background"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-accent italic text-accent text-[14px] tracking-[0.35em] uppercase mb-5"
          >
            The Companions
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-heading text-4xl md:text-6xl uppercase tracking-[0.1em] text-foreground ember-text-glow"
          >
            The person who knows the way
          </motion.h2>
          <div className="ink-divider mt-10 mb-10 max-w-md mx-auto" />
          <p className="text-foreground/85 text-[18px] font-serif italic leading-relaxed">
            A guide is the last piece of the charter, not the whole of it — but
            the heart of it. Each carries a country and a rank. Once you have a
            road, we match the companion whose rank meets it.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-x-12 gap-y-16 pt-6">
          {featured.map((g, i) => (
            <GuideCard key={g.slug} guide={g} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-24 text-center"
        >
          <Link
            href="/guides"
            className="inline-block px-14 py-5 border border-accent bg-accent/15 hover:bg-accent hover:text-background transition-all duration-500 font-accent text-[12px] tracking-[0.4em] uppercase text-foreground ember-glow"
          >
            See the full roster
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
