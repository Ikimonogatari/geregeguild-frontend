"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GuideCard from "@/components/GuideCard";
import {
  GUIDES,
  LEVELS,
  SPECIALIZATIONS,
  LEVEL_ORDER,
  type GuideLevel,
  type Specialization,
} from "@/lib/guides";

export default function GuidesPage() {
  const [spec, setSpec] = useState<Specialization | "All">("All");
  const [minLevel, setMinLevel] = useState<GuideLevel | "Any">("Any");

  const visible = useMemo(() => {
    return GUIDES.filter((g) => {
      if (spec !== "All" && g.specialization !== spec) return false;
      if (minLevel !== "Any" && LEVEL_ORDER[g.level] < LEVEL_ORDER[minLevel])
        return false;
      return true;
    });
  }, [spec, minLevel]);

  const guildmaster = GUIDES.find((g) => g.level === "Guildmaster");

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* Hero strip with parchment unroll */}
      <section className="relative pt-40 pb-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-accent italic text-accent text-[14px] tracking-[0.4em] uppercase mb-5"
          >
            The Roster of the Guild
          </motion.p>

          {/* Unfurling parchment for the heading */}
          <motion.div
            initial={{ scaleY: 0.05, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ duration: 1.1, ease: [0.2, 0.7, 0.2, 1] }}
            style={{ transformOrigin: "top center" }}
            className="relative inline-block"
          >
            <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl uppercase tracking-[0.14em] text-foreground ember-text-glow">
              Choose Your Guide
            </h1>
          </motion.div>

          {/* Rune row */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0.4 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-7 flex items-center justify-center gap-3 text-accent/80 font-accent text-[15px] tracking-[0.6em]"
          >
            <span>☼</span>
            <span className="w-8 h-px bg-accent/40" />
            <span>≈</span>
            <span className="w-8 h-px bg-accent/40" />
            <span>▲</span>
            <span className="w-8 h-px bg-accent/40" />
            <span>✦</span>
            <span className="w-8 h-px bg-accent/40" />
            <span>✧</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="mt-8 text-foreground/90 text-[17px] sm:text-[19px] max-w-2xl mx-auto italic font-serif leading-relaxed"
          >
            Every guide carries a different country in their saddlebags. Read
            the cards. Turn them over. Pick the companion whose road sounds
            most like your own.
          </motion.p>
        </div>

        <div className="ink-divider mt-16 max-w-3xl mx-auto" />
      </section>

      {/* Filters */}
      <section className="px-6 pb-14">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 items-start md:items-end justify-between">
          <FilterRow
            label="Country"
            value={spec}
            options={["All", ...SPECIALIZATIONS] as const}
            onChange={(v) => setSpec(v as Specialization | "All")}
          />
          <FilterRow
            label="Minimum Rank"
            value={minLevel}
            options={["Any", ...LEVELS] as const}
            onChange={(v) => setMinLevel(v as GuideLevel | "Any")}
          />
          <p className="font-accent italic text-muted text-[12px] tracking-[0.25em] uppercase">
            {visible.length} {visible.length === 1 ? "card" : "cards"} on the
            table
          </p>
        </div>
      </section>

      {/* Deck */}
      <section className="px-6 pb-32">
        <div className="max-w-7xl mx-auto">
          {visible.length === 0 ? (
            <p className="text-center text-muted italic font-accent text-[16px] py-32">
              No guide of that order travels that country. Loosen your charter.
            </p>
          ) : (
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-20 pt-6">
              {visible.map((g, i) => (
                <GuideCard key={g.slug} guide={g} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Guildmaster note */}
      {guildmaster && (
        <section className="px-6 pb-32">
          <div className="max-w-3xl mx-auto text-center relative">
            <div className="border border-accent/30 bg-surface/60 px-8 py-12 ember-glow relative">
              {/* Wax-seal accent on top */}
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-[#7a2a18] border-[3px] border-[#3a1108] flex items-center justify-center font-heading text-foreground text-[12px] tracking-widest shadow-[0_3px_10px_rgba(0,0,0,0.6)] rotate-[-8deg]">
                GG
              </div>
              <p className="font-accent italic text-accent text-[13px] tracking-[0.3em] uppercase mb-4 mt-2">
                A note on the Guildmaster
              </p>
              <p className="text-foreground/90 italic leading-relaxed font-serif text-[18px]">
                The Guild names only one Guildmaster at a time. Charters under{" "}
                <Link
                  href={`/guides/${guildmaster.slug}`}
                  className="text-accent underline decoration-dotted underline-offset-4 hover:text-foreground"
                >
                  {guildmaster.name}
                </Link>{" "}
                are accepted by raven only — and rarely. The other guides above
                welcome you with both hands.
              </p>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}

type FilterRowProps = {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
};

function FilterRow({ label, value, options, onChange }: FilterRowProps) {
  return (
    <div className="flex flex-col gap-3">
      <span className="font-accent italic text-[12px] tracking-[0.3em] uppercase text-muted">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = value === opt;
          return (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              className={[
                "px-4 py-2 font-accent text-[12px] tracking-[0.2em] uppercase border transition-all duration-300",
                active
                  ? "border-accent bg-accent/15 text-accent ember-glow"
                  : "border-highlight/40 text-muted hover:border-accent/70 hover:text-foreground",
              ].join(" ")}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
