"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import { colorForIndex, listedJourneys } from "@/lib/journey-display";

// Leaflet is browser-only; lazy-load the overview map.
const JourneysOverviewMap = dynamic(
  () => import("@/components/JourneysOverviewMap"),
  { ssr: false, loading: () => null },
);

export default function MapPage() {
  const [highlightedSlugs, setHighlightedSlugs] = useState<string[]>([]);
  const journeys = listedJourneys();
  // Memoised so passing an array prop into the map doesn't change identity
  // on every render — important for Leaflet to avoid spurious work.
  const slugs = useMemo(() => highlightedSlugs, [highlightedSlugs]);

  /* Debounced highlight setter — fixes flicker. The Leaflet permanent
     tooltip sits OUTSIDE the marker's hit area, so as the cursor moves
     across it the marker briefly fires `mouseout` then `mouseover` →
     would otherwise toggle the highlight on/off. Delaying the CLEAR by
     80 ms gives the immediate "mouseover" time to cancel any pending
     clear, eliminating the flicker. Set-active is still immediate. */
  const clearTimer = useRef<number | null>(null);
  useEffect(() => () => {
    if (clearTimer.current) window.clearTimeout(clearTimer.current);
  }, []);
  const setHighlight = (next: string[]) => {
    if (next.length > 0) {
      if (clearTimer.current) {
        window.clearTimeout(clearTimer.current);
        clearTimer.current = null;
      }
      setHighlightedSlugs(next);
    } else {
      if (clearTimer.current) window.clearTimeout(clearTimer.current);
      clearTimer.current = window.setTimeout(() => {
        setHighlightedSlugs([]);
        clearTimer.current = null;
      }, 80);
    }
  };

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* Title strip */}
      <section className="pt-28 sm:pt-32 pb-8 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="font-accent italic text-accent text-[13px] tracking-[0.4em] uppercase mb-4">
            The Map
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl uppercase tracking-[0.08em] text-foreground ember-text-glow leading-[1.1]">
            All the roads of the Guild
          </h1>
          <p className="mt-6 max-w-xl mx-auto font-serif italic text-muted text-[15px] sm:text-[16px] leading-[1.85]">
            Each destination is one wax seal on the chart. Hover a place — or
            a charter in the roster — and the road to it inks itself in.
          </p>
        </div>
      </section>

      <section className="pb-16">
        <div className="grid lg:grid-cols-[400px_1fr] gap-0 border-y border-accent/50 ember-glow">
          {/* Roster */}
          <aside className="bg-surface/65 lg:border-r lg:border-accent/30 lg:max-h-[82vh] lg:overflow-y-auto">
            <div className="px-5 py-4 border-b border-accent/30 flex items-baseline justify-between sticky top-0 bg-surface/95 backdrop-blur-sm z-10">
              <p className="font-accent italic text-accent text-[12px] tracking-[0.4em] uppercase">
                The Roster
              </p>
              <p className="font-accent text-muted text-[11px] tracking-[0.2em] uppercase">
                {journeys.length} roads
              </p>
            </div>
            <ul className="divide-y divide-highlight/15">
              {journeys.map((j, i) => {
                const color = colorForIndex(i);
                const active = slugs.includes(j.slug);
                return (
                  <li key={j.slug}>
                    <Link
                      href={`/journeys/${j.slug}`}
                      onMouseEnter={() => setHighlight([j.slug])}
                      onMouseLeave={() => setHighlight([])}
                      onFocus={() => setHighlight([j.slug])}
                      onBlur={() => setHighlight([])}
                      className={[
                        "group relative flex gap-4 p-4 transition-all duration-500",
                        active
                          ? "bg-accent/[0.08]"
                          : "hover:bg-accent/[0.05]",
                      ].join(" ")}
                    >
                      <span
                        aria-hidden
                        className="absolute left-0 top-0 bottom-0 w-[3px] transition-all duration-500"
                        style={{
                          background: active ? color : "transparent",
                          boxShadow: active ? `0 0 14px ${color}` : "none",
                        }}
                      />
                      <div className="relative shrink-0 w-20 h-20 overflow-hidden border border-highlight/40 vignette">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={j.image}
                          alt=""
                          className={[
                            "w-full h-full object-cover transition-all duration-700",
                            active
                              ? "grayscale-[10%] sepia-[10%] brightness-100 scale-[1.06]"
                              : "grayscale-[25%] sepia-[35%] brightness-[0.78] group-hover:brightness-[0.9]",
                          ].join(" ")}
                        />
                        <span
                          aria-hidden
                          className="absolute top-1 left-1 w-2.5 h-2.5 rounded-full ring-1 ring-background/80"
                          style={{
                            background: color,
                            boxShadow: active
                              ? `0 0 8px ${color}`
                              : `0 0 4px ${color}aa`,
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className={[
                            "font-heading uppercase tracking-[0.08em] text-[14px] leading-tight transition-colors duration-500",
                            active
                              ? "text-accent"
                              : "text-foreground",
                          ].join(" ")}
                        >
                          {j.title}
                        </p>
                        <p className="font-accent italic text-accent/85 text-[11px] tracking-[0.16em] uppercase mt-1.5">
                          {j.region}
                        </p>
                        <p className="font-accent text-muted text-[10.5px] tracking-[0.14em] mt-1.5">
                          {j.days} DAYS · {j.distanceKm} KM · {j.difficulty.toUpperCase()}
                        </p>
                      </div>
                      <ChevronRight
                        size={16}
                        className={[
                          "self-center shrink-0 transition-all duration-500",
                          active
                            ? "text-accent translate-x-1"
                            : "text-muted/60 group-hover:text-accent/80 group-hover:translate-x-1",
                        ].join(" ")}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="px-5 py-5 border-t border-highlight/25">
              <Link
                href="/journeys"
                className="block text-center font-accent italic text-muted hover:text-accent text-[12px] tracking-[0.25em] uppercase transition-colors duration-300"
              >
                Or read the catalogue →
              </Link>
            </div>
          </aside>

          {/* Map */}
          <div className="relative vignette overflow-hidden h-[60vh] lg:h-[82vh] min-h-[480px]">
            <JourneysOverviewMap
              highlightedSlugs={slugs}
              onHover={setHighlight}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
