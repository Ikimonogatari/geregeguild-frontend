"use client";

/* ────────────────────────────────────────────────────────────
   The Bearer's Passport — the /profile page, refactored from
   the legacy SaaS-y "brand-charcoal" look into the parchment /
   Cinzel language used across the rest of the site.

   Game data is unchanged (useAuth / useGame). Only the frame
   around it has been rebuilt: wax-seal monogram, rank ladder,
   heraldic roster, illuminated lore cards.
   ──────────────────────────────────────────────────────────── */

import Link from "next/link";
import { motion } from "framer-motion";
import { Award, Compass, MapPin, ScrollText, Users } from "lucide-react";
import { useAuth, useGame } from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { cn } from "@/lib/utils";

/* Ladder used only for visual rendering. The user's actual rank
   is whatever string the backend hands back; unknown ranks fall
   through cleanly. */
const RANK_LADDER = ["Novice", "Ranger", "Master", "Guildmaster"] as const;

export default function ProfilePage() {
  const { user } = useAuth();
  const { gameState, rank, pois, leaderboard } = useGame();

  /* ── Not logged in ────────────────────────────────────── */
  if (!user) {
    return (
      <main className="min-h-screen bg-background overflow-x-hidden">
        <Navbar />
        <section className="pt-40 pb-24 px-6">
          <div className="max-w-lg mx-auto text-center">
            <p className="font-accent italic text-accent text-[13px] tracking-[0.4em] uppercase mb-5">
              The Gate is Sealed
            </p>
            <h1 className="font-heading text-4xl sm:text-5xl uppercase tracking-[0.08em] text-foreground ember-text-glow">
              Sign your name at the door
            </h1>
            <div className="ink-divider mt-8 max-w-sm mx-auto" />
            <p className="mt-8 font-serif italic text-foreground/85 text-[17px] leading-relaxed">
              The Bearer&rsquo;s Passport is only shown to the bearer.
              Present your name to the Guild to see the record of your rides.
            </p>
            <p className="mt-10 font-accent italic text-muted text-[12px] tracking-[0.3em] uppercase">
              Open the gate from the top-right corner
            </p>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  const unlockedLore = pois.filter((poi) => gameState.unlockedPOIs.includes(poi.id));
  const initials = user.username
    .split(/\s+/)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");
  const rankIndex = RANK_LADDER.indexOf(rank as typeof RANK_LADDER[number]);

  return (
    <PageTransition>
      <main className="min-h-screen bg-background overflow-x-hidden">
        <Navbar />

        {/* ── Hero — the sealed passport plate ─────────────── */}
        <section className="relative pt-36 pb-16 px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
            className="relative max-w-5xl mx-auto border border-accent/40 bg-surface/60 vignette ember-glow"
          >
            {/* Ornate corners */}
            <span aria-hidden className="absolute -top-px -left-px size-6 border-t-2 border-l-2 border-accent/70" />
            <span aria-hidden className="absolute -top-px -right-px size-6 border-t-2 border-r-2 border-accent/70" />
            <span aria-hidden className="absolute -bottom-px -left-px size-6 border-b-2 border-l-2 border-accent/70" />
            <span aria-hidden className="absolute -bottom-px -right-px size-6 border-b-2 border-r-2 border-accent/70" />

            <div className="grid md:grid-cols-[220px_1fr_auto] items-center gap-8 p-8 sm:p-10">
              {/* Monogrammed wax seal */}
              <div className="relative mx-auto md:mx-0">
                <div className="relative size-40 rounded-full bg-[#7a2a18] border-[6px] border-[#3a1108] shadow-[0_8px_28px_rgba(0,0,0,0.7)] rotate-[-6deg] grid place-items-center overflow-hidden wax-pulse">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 via-transparent to-black/40" />
                  <div className="text-center relative">
                    <div className="font-heading text-foreground text-4xl leading-none tracking-widest">
                      {initials || "GG"}
                    </div>
                    <div className="mt-1 font-accent italic text-foreground/80 text-[9px] tracking-[0.35em] uppercase">
                      Bearer
                    </div>
                  </div>
                </div>
                <span className="absolute -bottom-2 -right-2 size-9 rounded-full bg-accent/90 grid place-items-center font-heading text-background text-[14px] rotate-[8deg] shadow-md">
                  <Award className="size-4" />
                </span>
              </div>

              {/* Identity */}
              <div className="text-center md:text-left">
                <p className="font-accent italic text-accent text-[12px] tracking-[0.4em] uppercase">
                  The Bearer&rsquo;s Passport
                </p>
                <h1 className="mt-3 font-heading text-4xl sm:text-5xl md:text-6xl uppercase tracking-[0.06em] text-foreground ember-text-glow leading-[1.05]">
                  {user.username}
                </h1>
                <p className="mt-3 font-serif italic text-muted text-[17px]">
                  Guildmark of the Realm · rank of{" "}
                  <span className="text-accent font-heading tracking-wide">{rank}</span>
                </p>
                <div className="ink-divider mt-6 max-w-xs mx-auto md:mx-0" />
                <p className="mt-4 font-accent italic text-muted text-[11px] tracking-[0.25em] uppercase">
                  Issued by the Guild · sealed in wax
                </p>
              </div>

              {/* Karma tally */}
              <div className="text-center border-t md:border-t-0 md:border-l border-highlight/40 pt-6 md:pt-0 md:pl-8">
                <p className="font-accent italic text-accent text-[11px] tracking-[0.3em] uppercase">
                  Karma
                </p>
                <div className="mt-2 font-heading text-6xl sm:text-7xl text-foreground leading-none ember-text-glow">
                  {gameState.points}
                </div>
                <p className="mt-2 font-serif italic text-muted text-[13px]">
                  earned on the road
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── Main grid ────────────────────────────────────── */}
        <section className="px-6 pb-28">
          <div className="max-w-5xl mx-auto grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] gap-10">
            {/* ─ LEFT rail ─────────────────────────────────── */}
            <div className="space-y-8">
              {/* Rank ladder */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.7 }}
                className="border border-highlight/40 bg-surface/50 p-7 ember-glow"
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-accent"><Compass className="size-5" /></span>
                  <h2 className="font-heading uppercase tracking-[0.14em] text-foreground text-[15px]">
                    The Ladder
                  </h2>
                </div>
                <ul className="space-y-4">
                  {RANK_LADDER.map((r, i) => {
                    const isCurrent = i === rankIndex;
                    const climbed = rankIndex >= 0 && i <= rankIndex;
                    return (
                      <li key={r} className="flex items-center gap-4">
                        <span
                          className={cn(
                            "size-3 rounded-full border-2 shrink-0",
                            isCurrent
                              ? "bg-accent border-accent ember-glow"
                              : climbed
                                ? "bg-highlight/70 border-highlight"
                                : "bg-transparent border-highlight/40",
                          )}
                          aria-hidden
                        />
                        <div className="flex-1 min-w-0">
                          <div
                            className={cn(
                              "font-heading uppercase tracking-[0.12em] text-[14px]",
                              isCurrent
                                ? "text-accent"
                                : climbed
                                  ? "text-foreground"
                                  : "text-muted",
                            )}
                          >
                            {r}
                          </div>
                          {isCurrent && (
                            <div className="font-accent italic text-muted text-[10px] tracking-[0.3em] uppercase">
                              you stand here
                            </div>
                          )}
                        </div>
                        <span
                          className={cn(
                            "font-accent italic text-[10px] tracking-[0.25em]",
                            climbed ? "text-accent" : "text-muted/60",
                          )}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                {rankIndex < 0 && (
                  <p className="mt-4 font-serif italic text-muted text-[12px]">
                    Your current mark: <span className="text-accent">{rank}</span>
                  </p>
                )}
              </motion.div>

              {/* Journey progress */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.7, delay: 0.05 }}
                className="border border-highlight/40 bg-surface/50 p-7 ember-glow"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-accent"><MapPin className="size-5" /></span>
                  <h2 className="font-heading uppercase tracking-[0.14em] text-foreground text-[15px]">
                    The Road So Far
                  </h2>
                </div>
                <div className="flex items-end gap-2 mb-3">
                  <span className="font-heading text-4xl text-foreground leading-none">
                    {gameState.unlockedPOIs.length}
                  </span>
                  <span className="font-serif italic text-muted mb-1">
                    of {pois.length} places touched
                  </span>
                </div>
                {/* Bar */}
                <div className="relative h-1.5 bg-background/60 border border-highlight/30 overflow-hidden">
                  <motion.span
                    className="absolute inset-y-0 left-0 bg-accent"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${pois.length ? Math.min(100, (gameState.unlockedPOIs.length / pois.length) * 100) : 0}%`,
                    }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </div>
                <div className="ink-divider my-5" />
                <Link
                  href="/map"
                  className="inline-flex items-center gap-2 font-accent uppercase tracking-[0.25em] text-[11px] text-accent hover:text-foreground transition-colors group"
                >
                  Continue the ride
                  <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                </Link>
              </motion.div>
            </div>

            {/* ─ RIGHT column ──────────────────────────────── */}
            <div className="space-y-10">
              {/* Roster */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.7 }}
                className="border border-highlight/40 bg-surface/50 p-7 sm:p-8 ember-glow"
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-accent"><Users className="size-5" /></span>
                  <h2 className="font-heading uppercase tracking-[0.14em] text-foreground text-[15px]">
                    The Roster
                  </h2>
                </div>

                {leaderboard.length === 0 ? (
                  <p className="font-serif italic text-muted text-[15px] py-4">
                    The roll is being drawn. Check back at dawn.
                  </p>
                ) : (
                  <ul className="divide-y divide-highlight/25">
                    {leaderboard.map((entry, i) => {
                      const isYou = entry.username === user.username;
                      const seal = i <= 2;
                      return (
                        <li
                          key={i}
                          className={cn(
                            "flex items-center gap-4 py-4 first:pt-0 last:pb-0 transition-colors",
                            isYou && "-mx-4 px-4 rounded-sm bg-accent/[0.06]",
                          )}
                        >
                          {/* Seal / rank cypher */}
                          <div className="relative shrink-0">
                            {seal ? (
                              <div
                                className={cn(
                                  "size-10 rounded-full grid place-items-center rotate-[-8deg] shadow-md border-[3px]",
                                  i === 0
                                    ? "bg-[#7a2a18] border-[#3a1108]"
                                    : i === 1
                                      ? "bg-[#3d3226] border-[#1c1610]"
                                      : "bg-[#4a2612] border-[#2a1409]",
                                )}
                              >
                                <span className="font-heading text-foreground text-[13px]">
                                  {i + 1}
                                </span>
                              </div>
                            ) : (
                              <div className="size-10 grid place-items-center border border-highlight/40 text-muted">
                                <span className="font-accent italic text-[11px] tracking-[0.15em]">
                                  {String(i + 1).padStart(2, "0")}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div
                              className={cn(
                                "font-heading uppercase tracking-[0.08em] text-[15px] truncate",
                                isYou ? "text-accent" : "text-foreground",
                              )}
                            >
                              {entry.username}
                              {isYou && (
                                <span className="ml-2 font-accent italic text-[10px] tracking-[0.3em] uppercase text-accent/80">
                                  · you
                                </span>
                              )}
                            </div>
                            <div className="font-accent italic text-muted text-[11px] tracking-[0.25em] uppercase">
                              {entry.rank}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="font-heading text-foreground text-[16px] leading-none">
                              {entry.points}
                            </div>
                            <div className="font-accent italic text-muted text-[10px] tracking-[0.2em] uppercase mt-1">
                              karma
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </motion.div>

              {/* Lore */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.7, delay: 0.05 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-accent"><ScrollText className="size-5" /></span>
                  <h2 className="font-heading uppercase tracking-[0.14em] text-foreground text-[15px]">
                    Unlocked Lore
                  </h2>
                  <span className="ml-auto font-accent italic text-muted text-[11px] tracking-[0.3em] uppercase">
                    {unlockedLore.length} chapter{unlockedLore.length === 1 ? "" : "s"}
                  </span>
                </div>

                {unlockedLore.length === 0 ? (
                  <div className="relative border border-dashed border-highlight/40 bg-surface/30 py-14 px-6 text-center">
                    <span className="text-accent text-5xl leading-none">✦</span>
                    <p className="mt-4 font-heading uppercase tracking-[0.14em] text-foreground text-[15px]">
                      Your journal is blank
                    </p>
                    <p className="mt-2 font-serif italic text-muted text-[15px]">
                      Every place has a page. Ride out to earn it.
                    </p>
                    <Link
                      href="/map"
                      className="mt-6 inline-block px-8 py-3 border border-accent bg-accent/10 hover:bg-accent hover:text-background transition-all duration-500 font-accent uppercase tracking-[0.3em] text-[11px] text-foreground ember-glow"
                    >
                      Find the roads
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {unlockedLore.map((poi, idx) => (
                      <motion.article
                        key={poi.id}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.6, delay: 0.05 + idx * 0.06 }}
                        className="relative grid sm:grid-cols-[220px_1fr] border border-highlight/40 bg-surface/50 overflow-hidden ember-glow"
                      >
                        {/* Wax stamp */}
                        <span className="absolute -top-3 -right-3 z-20 size-12 rounded-full bg-[#7a2a18] border-[3px] border-[#3a1108] grid place-items-center font-heading text-foreground text-[11px] tracking-widest rotate-[9deg] shadow-md">
                          +{poi.points}
                        </span>

                        <div className="relative h-40 sm:h-full min-h-[160px] vignette overflow-hidden border-b sm:border-b-0 sm:border-r border-highlight/40">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={poi.imageUrl}
                            alt={poi.name}
                            className="absolute inset-0 w-full h-full object-cover grayscale-[15%] sepia-[25%] brightness-[0.9]"
                          />
                          <span className="absolute top-3 left-3 font-accent italic text-[10px] tracking-[0.3em] uppercase bg-background/75 backdrop-blur-sm text-accent px-2.5 py-1 border border-accent/40">
                            {poi.type}
                          </span>
                        </div>

                        <div className="p-6 sm:p-7">
                          <p className="font-accent italic text-accent text-[11px] tracking-[0.35em] uppercase mb-2">
                            Chapter {String(idx + 1).padStart(2, "0")}
                          </p>
                          <h3 className="font-heading text-2xl uppercase tracking-[0.06em] text-foreground">
                            {poi.name}
                          </h3>
                          <div className="ink-divider my-4 max-w-[160px]" />
                          <p className="font-serif italic text-foreground/85 text-[15px] leading-[1.85]">
                            {poi.lore}
                          </p>
                        </div>
                      </motion.article>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </PageTransition>
  );
}
