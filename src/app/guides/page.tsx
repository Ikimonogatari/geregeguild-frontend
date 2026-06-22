"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GuideCard from "@/components/GuideCard";
import {
  LEVELS,
  SPECIALIZATIONS,
  LEVEL_ORDER,
  type Guide,
  type GuideLevel,
  type Specialization,
} from "@/lib/guides";
import { fetchGuides } from "@/lib/api";
import {
  DUR,
  EASE,
  STAGGER,
  VIEWPORT,
  revealVariants,
  staggerParent,
} from "@/lib/motion";

export default function GuidesPage() {
  const [spec, setSpec] = useState<Specialization | "All">("All");
  const [minLevel, setMinLevel] = useState<GuideLevel | "Any">("Any");
  const [guides, setGuides] = useState<Guide[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchGuides().then((data) => {
      if (!cancelled) setGuides(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Featured Guildmaster — shown at the top regardless of filters.
  const guildmaster = guides.find((g) => g.level === "Guildmaster");

  // Roster excludes the Guildmaster (they have their own spotlight).
  const roster = useMemo(
    () =>
      guides.filter((g) => g.level !== "Guildmaster").filter((g) => {
        if (spec !== "All" && g.specialization !== spec) return false;
        if (minLevel !== "Any" && LEVEL_ORDER[g.level] < LEVEL_ORDER[minLevel])
          return false;
        return true;
      }),
    [spec, minLevel, guides],
  );

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* ── Hero — slim, focused, no busy ornament row ───────────────── */}
      <section className="pt-36 sm:pt-40 pb-12 px-6">
        <motion.div
          variants={staggerParent(STAGGER.base, STAGGER.base)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.p
            variants={revealVariants("rise", DUR.base)}
            className="font-accent italic text-accent text-[13px] tracking-[0.4em] uppercase mb-5"
          >
            The Roster of the Guild
          </motion.p>
          <motion.h1
            variants={revealVariants("blur", DUR.slow)}
            className="font-heading text-4xl sm:text-5xl md:text-6xl uppercase tracking-[0.08em] text-foreground ember-text-glow leading-[1.05]"
          >
            Choose your <span className="text-accent">guide</span>
          </motion.h1>
          <motion.div
            variants={revealVariants("wipe", DUR.base)}
            className="ink-divider mt-9 max-w-sm mx-auto"
          />
          <motion.p
            variants={revealVariants("rise", DUR.base)}
            className="mt-8 font-serif italic text-muted text-[15px] sm:text-[16px] leading-[1.85] max-w-xl mx-auto"
          >
            Every guide carries a different country in their saddlebags.
            Read the cards. Turn them over. Pick the companion whose road
            sounds most like your own.
          </motion.p>
        </motion.div>
      </section>

      {/* ── Featured Guildmaster spotlight ──────────────────────────── */}
      {guildmaster && (
        <section className="px-6 pb-20">
          <div className="max-w-5xl mx-auto">
            <GuildmasterSpotlight guide={guildmaster} />
          </div>
        </section>
      )}

      {/* ── Sticky filter bar ───────────────────────────────────────── */}
      <section className="sticky top-[88px] z-30 bg-background/85 backdrop-blur-md border-y border-accent/25">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center gap-5 lg:gap-8">
          <FilterRow
            label="Country"
            value={spec}
            options={["All", ...SPECIALIZATIONS] as const}
            onChange={(v) => setSpec(v as Specialization | "All")}
          />
          <FilterRow
            label="Min Rank"
            value={minLevel}
            options={["Any", ...LEVELS.filter((l) => l !== "Guildmaster")] as const}
            onChange={(v) => setMinLevel(v as GuideLevel | "Any")}
          />
          <p className="ml-auto font-accent italic text-muted text-[11px] tracking-[0.25em] uppercase">
            {roster.length} {roster.length === 1 ? "card" : "cards"} on the table
          </p>
        </div>
      </section>

      {/* ── Roster grid ─────────────────────────────────────────────── */}
      <section className="px-6 pt-16 pb-32">
        <div className="max-w-7xl mx-auto">
          {roster.length === 0 ? (
            <OrnateEmpty />
          ) : (
            <motion.div
              key={roster.map((g) => g.slug).join(",")}
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.07 } },
              }}
              className="grid justify-items-center gap-y-16 gap-x-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            >
              {roster.map((g, i) => (
                <GuideCard key={g.slug} guide={g} index={i} />
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

/* ─── Featured Guildmaster — large horizontal portrait spotlight ─── */
function GuildmasterSpotlight({ guide }: { guide: Guide }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: DUR.slow, ease: EASE }}
      className="relative"
    >
      {/* The wax seal cap */}
      <span className="absolute -top-5 left-1/2 -translate-x-1/2 z-20 w-16 h-16 rounded-full bg-[#7a2a18] border-[3px] border-[#3a1108] flex items-center justify-center font-heading text-foreground text-[11px] tracking-[0.25em] shadow-[0_4px_14px_rgba(0,0,0,0.7)] rotate-[-8deg] wax-pulse">
        GG
      </span>

      <Link
        href={`/guides/${guide.slug}`}
        className="group relative block border border-accent/45 bg-surface/55 ember-glow overflow-hidden hover:border-accent transition-colors duration-700"
      >
        <div className="grid md:grid-cols-[280px_1fr] lg:grid-cols-[340px_1fr] gap-0">
          {/* Portrait */}
          <div className="relative aspect-[3/4] md:aspect-auto md:h-full overflow-hidden vignette border-b md:border-b-0 md:border-r border-accent/25">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={guide.portrait}
              alt={guide.name}
              className="absolute inset-0 w-full h-full object-cover grayscale-[15%] sepia-[28%] brightness-[0.85] transition-all duration-1000 group-hover:grayscale-0 group-hover:sepia-0 group-hover:brightness-100 group-hover:scale-[1.04]"
            />
            {/* Ember sweep on hover */}
            <span
              aria-hidden
              className="absolute inset-0 opacity-0 group-hover:opacity-60 transition-opacity duration-700 pointer-events-none mix-blend-screen"
              style={{
                background:
                  "linear-gradient(110deg, transparent 35%, rgba(255,220,140,0.5) 50%, transparent 65%)",
              }}
            />
            {/* Bottom gradient pad for legibility */}
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0D0A07]/85 to-transparent md:hidden" />
            {/* Rank pip — mobile only (right corner) */}
            <span className="absolute top-4 right-4 md:hidden font-accent italic text-accent text-[11px] tracking-[0.3em] uppercase border border-accent/55 bg-background/70 px-3 py-1.5 backdrop-blur-sm">
              IV · Guildmaster
            </span>
          </div>

          {/* Detail */}
          <div className="relative p-7 sm:p-9 md:p-10 flex flex-col">
            <p className="font-accent italic text-accent text-[12px] tracking-[0.35em] uppercase mb-3">
              The Guildmaster · IV
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl uppercase tracking-[0.08em] text-foreground ember-text-glow leading-[1.05]">
              {guide.name}
            </h2>
            <p className="mt-4 font-accent italic text-muted text-[13px] tracking-[0.2em] uppercase">
              {guide.homeRegion} · {guide.specialization} · {guide.yearsRiding} yrs · saddle
            </p>

            {/* Star rating */}
            <div className="flex items-center gap-1 mt-4">
              {Array.from({ length: 5 }).map((_, i) => {
                const filled = i < Math.round(guide.rating);
                return (
                  <Star
                    key={i}
                    size={14}
                    strokeWidth={1.5}
                    className={filled ? "text-accent" : "text-highlight/30"}
                    fill={filled ? "currentColor" : "none"}
                  />
                );
              })}
              <span className="ml-2 font-accent italic text-muted text-[12px] tracking-[0.15em]">
                {guide.rating.toFixed(1)} · {guide.quests.length} quests
              </span>
            </div>

            <div className="ink-divider my-6" />

            <p className="font-serif italic text-foreground/90 text-[16px] sm:text-[17px] leading-[1.85] mb-6">
              &ldquo;{guide.tagline}&rdquo;
            </p>

            <div className="mt-auto flex items-end justify-between gap-4">
              <p className="font-accent italic text-muted text-[11px] tracking-[0.2em] uppercase max-w-xs leading-relaxed">
                Charters under the Guildmaster are accepted by raven only — and rarely.
              </p>
              <span className="shrink-0 inline-flex items-center gap-2 font-accent uppercase tracking-[0.3em] text-[11px] text-accent group-hover:text-foreground group-hover:[text-shadow:0_0_12px_rgba(201,146,42,0.8)] transition-all duration-500">
                Read Inscription
                <span className="inline-block transition-transform duration-500 group-hover:translate-x-1">→</span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── Compact filter row used inside the sticky bar ─── */
type FilterRowProps = {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
};

function FilterRow({ label, value, options, onChange }: FilterRowProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-accent italic text-[10px] tracking-[0.3em] uppercase text-muted mr-1">
        {label}
      </span>
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={[
              "px-3.5 py-1.5 font-accent text-[10.5px] tracking-[0.18em] uppercase border transition-all duration-400 ease-[cubic-bezier(0.2,0.7,0.2,1)]",
              "hover:scale-[1.05] active:scale-[0.97]",
              active
                ? "border-accent bg-accent/15 text-accent ember-glow"
                : "border-highlight/40 text-muted hover:border-accent hover:text-foreground hover:bg-accent/[0.06] hover:ember-glow",
            ].join(" ")}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Ornate empty state ─── */
function OrnateEmpty() {
  return (
    <div className="text-center py-24 max-w-md mx-auto">
      <span className="block text-accent text-5xl mb-5">✦</span>
      <p className="font-heading uppercase tracking-[0.16em] text-foreground text-[16px] mb-3">
        No guide answers this charter
      </p>
      <p className="font-serif italic text-muted text-[15px] leading-[1.85]">
        No companion of that order travels that country. Loosen the filters
        above — or send a raven and the Guild will draft a custom road.
      </p>
    </div>
  );
}
