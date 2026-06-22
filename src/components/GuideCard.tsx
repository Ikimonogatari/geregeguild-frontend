"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { Star } from "lucide-react";
import type { Guide } from "@/lib/guides";
import { SPECIALIZATION_SIGIL } from "@/lib/guides";
import { GUIDE_MEDAL } from "@/lib/journeys";
import { EASE, DUR, STAGGER } from "@/lib/motion";

type Props = {
  guide: Guide;
  index?: number;
};

const LEVEL_NUMERAL: Record<Guide["level"], string> = {
  Apprentice: "I",
  Novice: "II",
  Master: "III",
  Guildmaster: "IV",
};

/* ────────────────────────────────────────────────────────────
   GuideCard — guild-registry / character-sheet style.

   Where JourneyCard is a landscape ad (full-bleed photo of a
   place), this is a ledger entry for a PERSON: round portrait
   crested with their rank medal, name + epithet, then a list
   of stat lines like a tabletop character sheet — house,
   country, saddle years, companion horse, talisman, tongues.
   ──────────────────────────────────────────────────────────── */

export default function GuideCard({ guide, index = 0 }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [hovered, setHovered] = useState(false);
  const medal = GUIDE_MEDAL[guide.level];

  // Slight cursor-tracked tilt (±2.5°) — restrained, ledger-page feel.
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useTransform(my, [0, 1], [2.5, -2.5]);
  const rotateY = useTransform(mx, [0, 1], [-2.5, 2.5]);
  const sRotX = useSpring(rotateX, { stiffness: 140, damping: 18, mass: 0.6 });
  const sRotY = useSpring(rotateY, { stiffness: 140, damping: 18, mass: 0.6 });

  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
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
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: DUR.slow,
        delay: index * STAGGER.tight,
        ease: EASE,
      }}
      className="w-full max-w-[340px]"
      style={{ perspective: 1100 }}
    >
      <Link
        ref={ref}
        href={`/guides/${guide.slug}`}
        onMouseEnter={() => setHovered(true)}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="group relative block w-full will-change-transform"
      >
        <motion.div
          style={{
            rotateX: sRotX,
            rotateY: sRotY,
            transformStyle: "preserve-3d",
          }}
          className="relative"
        >
          {/* Ember halo on hover */}
          <motion.div
            aria-hidden
            className="absolute -inset-4 pointer-events-none"
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            style={{
              background:
                "radial-gradient(60% 60% at 50% 50%, rgba(201,146,42,0.4), transparent 75%)",
              filter: "blur(22px)",
            }}
          />

          {/* The registry card */}
          <div
            className={[
              "relative bg-surface/65 border ember-glow overflow-hidden",
              "transition-all duration-500",
              hovered ? "border-accent/70 -translate-y-1.5" : "border-highlight/35",
            ].join(" ")}
          >
            {/* Heraldic header bar — rank stripe across the top */}
            <div
              className="relative px-5 py-2.5 flex items-center justify-between border-b"
              style={{
                background: `linear-gradient(100deg, ${medal.fill}55 0%, rgba(46,31,20,0.4) 60%, rgba(28,21,16,0.3) 100%)`,
                borderColor: `${medal.ring}55`,
              }}
            >
              <span
                className="font-heading uppercase tracking-[0.22em] text-[11px]"
                style={{ color: medal.ring }}
              >
                {LEVEL_NUMERAL[guide.level]} · {guide.level}
              </span>
              <span
                className="font-accent italic text-[10px] tracking-[0.3em] uppercase"
                style={{ color: medal.text }}
              >
                {medal.name}
              </span>
            </div>

            {/* Portrait area — round portrait crested with the rank medal */}
            <div className="relative flex flex-col items-center pt-7 pb-4 px-6">
              {/* Round portrait — double ring frame */}
              <div className="relative">
                <span
                  aria-hidden
                  className="absolute -inset-1.5 rounded-full pointer-events-none transition-all duration-500"
                  style={{
                    border: `1px solid ${medal.ring}`,
                    boxShadow: hovered
                      ? `0 0 22px -3px ${medal.ring}, inset 0 0 12px rgba(0,0,0,0.55)`
                      : `inset 0 0 12px rgba(0,0,0,0.6)`,
                  }}
                />
                <div className="relative w-32 h-32 rounded-full overflow-hidden border border-accent/35 vignette">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={guide.portrait}
                    alt={guide.name}
                    className={[
                      "absolute inset-0 w-full h-full object-cover transition-all duration-700",
                      hovered
                        ? "grayscale-0 sepia-0 brightness-100 scale-[1.08]"
                        : "grayscale-[18%] sepia-[28%] brightness-[0.85]",
                    ].join(" ")}
                  />
                  {/* Ember sweep on hover */}
                  <motion.div
                    aria-hidden
                    className="absolute inset-0 pointer-events-none rounded-full"
                    initial={false}
                    animate={{
                      opacity: hovered ? [0, 0.55, 0] : 0,
                      x: hovered ? ["-110%", "120%"] : "-110%",
                    }}
                    transition={{ duration: 1.3, ease: EASE }}
                    style={{
                      background:
                        "linear-gradient(105deg, transparent 35%, rgba(255,220,140,0.55) 50%, transparent 65%)",
                      mixBlendMode: "screen",
                    }}
                  />
                </div>

                {/* Rank medal — crested on the bottom of the portrait */}
                <div
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full flex items-center justify-center font-heading text-[12px] tracking-[0.04em] shadow-[0_3px_10px_rgba(0,0,0,0.7)]"
                  style={{
                    background: `radial-gradient(120% 120% at 50% 22%, ${medal.fill} 0%, #160d06 100%)`,
                    border: `2px solid ${medal.ring}`,
                    color: medal.text,
                  }}
                >
                  {medal.sigil}
                </div>
              </div>

              {/* Specialization sigil — small heraldic mark above name */}
              <span
                className="mt-7 font-heading text-accent text-[20px] leading-none transition-all duration-500"
                style={{
                  transform: hovered ? "scale(1.15) rotate(8deg)" : "scale(1) rotate(0deg)",
                  textShadow: hovered ? "0 0 12px rgba(201,146,42,0.7)" : "none",
                }}
                title={guide.specialization}
              >
                {SPECIALIZATION_SIGIL[guide.specialization]}
              </span>

              {/* Name */}
              <h3 className="mt-2 font-heading uppercase tracking-[0.1em] text-foreground text-[20px] sm:text-[22px] leading-[1.1] text-center">
                {guide.name}
              </h3>
              <p className="mt-1.5 font-accent italic text-muted text-[12px] tracking-[0.18em] uppercase text-center line-clamp-1">
                {guide.title}
              </p>

              {/* Star rating */}
              <div className="mt-3 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => {
                  const filled = i < Math.round(guide.rating);
                  return (
                    <Star
                      key={i}
                      size={12}
                      strokeWidth={1.5}
                      className={filled ? "text-accent" : "text-highlight/40"}
                      fill={filled ? "currentColor" : "none"}
                    />
                  );
                })}
                <span className="ml-1.5 font-accent italic text-muted text-[11px] tracking-[0.1em]">
                  {guide.rating.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Heraldic divider */}
            <div className="relative mx-6 flex items-center gap-3 mb-5">
              <span className="flex-1 h-px bg-highlight/30" />
              <span className="font-accent text-accent/80 text-[12px] tracking-[0.4em] uppercase">
                ◆
              </span>
              <span className="flex-1 h-px bg-highlight/30" />
            </div>

            {/* The ledger — character-sheet stat lines */}
            <dl className="px-7 pb-6 space-y-2.5">
              <Row label="Country" value={guide.specialization} />
              <Row label="House" value={guide.homeRegion} />
              <Row label="Saddle" value={`${guide.yearsRiding} years`} />
              <Row label="Companion" value={guide.signatureHorse} />
              <Row label="Talisman" value={guide.talisman} />
              <Row label="Tongues" value={guide.languages.join(" · ")} />
              <Row
                label="Charters"
                value={`${guide.quests.length} riden`}
                accent
              />
            </dl>

            {/* Foot — sealed CTA */}
            <div
              className="relative px-6 py-3.5 border-t flex items-center justify-between"
              style={{ borderColor: `${medal.ring}40` }}
            >
              <span className="font-accent italic text-muted text-[10.5px] tracking-[0.2em] uppercase">
                Guild member · sealed
              </span>
              <span
                className={[
                  "font-accent uppercase tracking-[0.25em] text-[11px] inline-flex items-center gap-1.5 transition-all duration-500",
                  hovered
                    ? "text-accent [text-shadow:0_0_10px_rgba(201,146,42,0.7)]"
                    : "text-foreground/80",
                ].join(" ")}
              >
                Inscription
                <span className="inline-block transition-transform duration-500 group-hover:translate-x-1">
                  →
                </span>
              </span>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

/* Character-sheet style label/value row — colon-aligned, monospace-feeling. */
function Row({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="grid grid-cols-[80px_8px_1fr] gap-2 items-baseline">
      <dt className="font-accent uppercase tracking-[0.22em] text-[9.5px] text-muted">
        {label}
      </dt>
      <dt className="text-accent/60 text-[10px]">:</dt>
      <dd
        className={[
          "font-serif italic text-[12.5px] leading-tight truncate",
          accent ? "text-accent" : "text-foreground/85",
        ].join(" ")}
        title={value}
      >
        {value}
      </dd>
    </div>
  );
}
