"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Guide } from "@/lib/guides";
import { SPECIALIZATION_SIGIL } from "@/lib/guides";
import { EASE, DUR, STAGGER } from "@/lib/motion";

type Props = {
  guide: Guide;
  index?: number;
};

const LEVEL_LABEL: Record<Guide["level"], string> = {
  Apprentice: "I · Apprentice",
  Novice: "II · Novice",
  Master: "III · Master",
  Guildmaster: "IV · Guildmaster",
};

const CARD_CLIP =
  "polygon(0 8px, 8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px))";

export default function GuideCard({ guide, index = 0 }: Props) {
  const tilt = (index % 5) - 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: tilt - 4 }}
      whileInView={{ opacity: 1, y: 0, rotate: tilt }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: DUR.slow, delay: index * STAGGER.base, ease: EASE }}
      className="w-[290px] sm:w-[310px] h-[490px] sm:h-[500px]"
    >
      <Link
        href={`/guides/${guide.slug}`}
        className="group relative block w-full h-full transition-transform duration-500 ease-out hover:-translate-y-3 hover:scale-[1.025]"
      >
        <div
          className="absolute inset-0 parchment-edge ember-glow p-5 flex flex-col"
          style={{ clipPath: CARD_CLIP }}
        >
          {/* Top bar */}
          <div className="relative z-10 flex items-center justify-between font-accent text-[12px] text-[#4a2f15] tracking-[0.18em] uppercase border-b border-[#8B5E3C]/40 pb-2 mb-3">
            <span>{LEVEL_LABEL[guide.level]}</span>
            <span
              title={guide.specialization}
              className="text-2xl leading-none text-[#7a4a18]"
            >
              {SPECIALIZATION_SIGIL[guide.specialization]}
            </span>
          </div>

          {/* Portrait */}
          <div className="relative z-10 h-[200px] w-full mb-4 overflow-hidden vignette border border-[#5a3a1a]/50">
            <img
              src={guide.portrait}
              alt={guide.name}
              className="w-full h-full object-cover grayscale-[20%] sepia-[35%] brightness-[0.9] transition-all duration-700 group-hover:grayscale-0 group-hover:sepia-0 group-hover:brightness-100"
            />
            <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-full bg-[#7a2a18] border-2 border-[#3a1108] flex items-center justify-center font-heading text-[#f0e2c2] text-[12px] tracking-wider shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
              GG
            </div>
          </div>

          {/* Name + title — always visible */}
          <div className="relative z-10 text-center mb-3">
            <h3
              className="uppercase tracking-[0.12em] text-[#2a1d0e] text-[17px] leading-tight"
              style={{ fontFamily: "var(--font-cinzel), serif" }}
            >
              {guide.name}
            </h3>
            <p className="font-accent italic text-[12px] text-[#6b4520] mt-1 line-clamp-1">
              {guide.title}
            </p>
          </div>

          {/* Bottom area — crossfade between default content and inscription */}
          <div className="relative z-10 flex-1 min-h-0">
            {/* Default content (tagline + footer) */}
            <div className="absolute inset-0 flex flex-col justify-between transition-opacity duration-300 ease-out group-hover:opacity-0 group-hover:duration-200">
              <div className="flex flex-col">
                <div className="font-accent text-[11px] tracking-[0.2em] uppercase text-[#6b4520] flex items-center justify-between mb-2">
                  <span>{guide.specialization}</span>
                  <span>{guide.homeRegion}</span>
                </div>
                <p className="text-[13px] leading-snug text-[#3d2a14] font-serif italic line-clamp-3">
                  &ldquo;{guide.tagline}&rdquo;
                </p>
              </div>
              <div className="pt-2 border-t border-[#8B5E3C]/40 flex items-center justify-between">
                <span className="font-accent text-[10px] tracking-[0.25em] uppercase text-[#6b4520]">
                  {guide.yearsRiding} yrs · saddle
                </span>
                <span className="font-accent text-[10px] tracking-[0.25em] uppercase text-[#7a4a18]">
                  Read inscription →
                </span>
              </div>
            </div>

            {/* Hover content (inscription) */}
            <div className="absolute inset-0 flex flex-col opacity-0 transition-opacity duration-400 ease-in group-hover:opacity-100 group-hover:delay-150 pointer-events-none">
              <p className="font-accent italic text-center text-[10px] tracking-[0.3em] uppercase text-[#6b4520] pb-2 border-b border-[#8B5E3C]/50 mb-2">
                The Inscription
              </p>
              <dl className="space-y-1.5 text-[#3d2a14] flex-1">
                <InscriptionRow label="Companion" value={guide.signatureHorse} />
                <InscriptionRow label="Talisman" value={guide.talisman} />
                <InscriptionRow label="Season" value={guide.seasonalWindow} />
                <InscriptionRow
                  label="Tongues"
                  value={guide.languages.join(" · ")}
                />
              </dl>
              <div className="text-center mt-1 pt-2 border-t border-[#8B5E3C]/40">
                <span className="font-accent text-[10px] tracking-[0.3em] uppercase text-[#7a2a18]">
                  Open Charter →
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function InscriptionRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[62px_1fr] gap-2">
      <dt className="font-accent text-[8px] tracking-[0.22em] uppercase text-[#6b4520] pt-0.5">
        {label}
      </dt>
      <dd className="font-serif italic leading-tight text-[10px] line-clamp-2">{value}</dd>
    </div>
  );
}
