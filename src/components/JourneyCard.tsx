"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { Journey } from "@/lib/journeys";
import { CATEGORY_SIGIL } from "@/lib/journeys";
import dynamic from "next/dynamic";
import { routeForJourney } from "@/lib/journey-routes";
import { formatPrice } from "@/lib/format";
import { EASE, DUR, STAGGER } from "@/lib/motion";

// Real geography from tile service — mounted only on hover.
const LeafletMapPlate = dynamic(() => import("./LeafletMapPlate"), {
  ssr: false,
  loading: () => null,
});

type Props = {
  journey: Journey;
  index?: number;
};

export default function JourneyCard({ journey, index = 0 }: Props) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  // hasHovered latches true on the first mouseEnter and stays true. The map
  // is mounted from that point onward and toggled with opacity — see the
  // hover flap note below on the map wrapper.
  const [hasHovered, setHasHovered] = useState(false);
  const isCustom = journey.category === "Custom";
  const route = routeForJourney(journey.slug);
  const mapLabel = `${journey.days} days · ${journey.distanceKm} km`;

  const ref = useRef<HTMLButtonElement>(null);
  // Normalized cursor pos within the card: 0..1
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  // Tilt — subtle, cinematic parchment angle (~3° max each axis).
  const rotateX = useTransform(my, [0, 1], [3, -3]);
  const rotateY = useTransform(mx, [0, 1], [-3, 3]);
  const sRotX = useSpring(rotateX, { stiffness: 120, damping: 18, mass: 0.6 });
  const sRotY = useSpring(rotateY, { stiffness: 120, damping: 18, mass: 0.6 });

  // Firelight position — percent strings used as CSS vars on hover
  const fireX = useTransform(mx, (v) => `${v * 100}%`);
  const fireY = useTransform(my, (v) => `${v * 100}%`);

  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };

  const handleLeave = () => {
    mx.set(0.5);
    my.set(0.5);
    setHovered(false);
  };

  return (
      <motion.button
        ref={ref}
        type="button"
        onClick={() => router.push(`/journeys/${journey.slug}`)}
        onMouseMove={handleMove}
        onMouseEnter={() => {
          setHovered(true);
          setHasHovered(true);
        }}
        onMouseLeave={handleLeave}
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: DUR.base, delay: index * STAGGER.tight, ease: EASE }}
        style={{
          rotateX: sRotX,
          rotateY: sRotY,
          transformPerspective: 1100,
          transformStyle: "preserve-3d",
          ["--mx" as string]: fireX,
          ["--my" as string]: fireY,
        }}
        className="group relative text-left w-full bg-surface/60 border border-highlight/40 hover:border-accent/70 transition-[border-color,box-shadow] duration-500 ember-glow overflow-hidden flex flex-col will-change-transform hover:shadow-[0_0_0_1px_rgba(201,146,42,0.45),0_0_40px_-6px_rgba(201,146,42,0.6),0_30px_70px_-22px_rgba(0,0,0,0.85)]"
      >
        {/* Cursor-tracked firelight wash — sits over everything, screen blend */}
        <span aria-hidden className="card-firelight" />

        {/* Ember-rim top sweep — ignites on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(201,146,42,0) 12%, rgba(201,146,42,0.9) 50%, rgba(201,146,42,0) 88%, transparent 100%)",
            backgroundSize: "200% 100%",
            animation: "ember-trace 3.5s linear infinite",
          }}
        />

        {/* Image plate — pushed slightly out of plane for parallax depth */}
        <div
          className="relative h-[260px] sm:h-[300px] lg:h-[340px] w-full overflow-hidden vignette"
          style={{ transform: "translateZ(28px)" }}
        >
          {/* Photo — fades back on hover so the parchment map can lead */}
          <img
            src={journey.image}
            alt={journey.title}
            className={[
              "absolute inset-0 w-full h-full object-cover grayscale-[15%] sepia-[28%] brightness-[0.82] transition-all duration-700",
              hovered ? "opacity-15 scale-[1.06]" : "opacity-100 scale-100",
            ].join(" ")}
          />

          {/* Real geography (OpenTopoMap tiles — terrain shading + contours,
              not a road map). Treated to read as an aged chart.

              Lazy-mount on FIRST hover, then keep mounted for the lifetime
              of the card and toggle visibility with opacity/pointer-events.
              Unmounting on every hover-out was tearing down the map + tiles
              + polyline animation, causing the "goes blank and shows"
              flicker on rapid hover flap. */}
          {hasHovered && (
            <div
              className={[
                "absolute inset-0 transition-opacity duration-300 ease-out",
                hovered ? "opacity-100" : "opacity-0 pointer-events-none",
              ].join(" ")}
            >
              <LeafletMapPlate route={route} label={mapLabel} title={journey.title} />
            </div>
          )}

          {/* Bottom fade — keeps the badge/tag rows readable in both states */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-surface to-transparent" />

          <div className="absolute top-3 left-3 flex items-center gap-2 bg-background/70 backdrop-blur-sm border border-accent/30 group-hover:border-accent/70 transition-colors duration-500 px-3 py-1.5">
            <span className="text-accent text-base leading-none transition-all duration-500 group-hover:[text-shadow:0_0_12px_rgba(201,146,42,0.85)]">
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

        {/* Body — title floats slightly forward */}
        <div className="p-6 flex flex-col flex-1" style={{ transform: "translateZ(14px)" }}>
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
            <span className="font-accent uppercase tracking-[0.25em] text-[11px] text-accent inline-flex items-center gap-1.5 group-hover:translate-x-1 transition-transform duration-300 group-hover:[text-shadow:0_0_10px_rgba(201,146,42,0.7)]">
              Read the road <span className="inline-block group-hover:translate-x-0.5 transition-transform duration-500">→</span>
            </span>
          </div>
        </div>
      </motion.button>
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
