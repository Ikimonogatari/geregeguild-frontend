"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Journey } from "@/lib/journeys";
import { CATEGORY_SIGIL, getVehicle } from "@/lib/journeys";
import { formatPriceRange } from "@/lib/format";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

type Props = {
  journey: Journey;
  open: boolean;
  onClose: () => void;
};

export default function JourneyQuickLook({ journey, open, onClose }: Props) {
  const [active, setActive] = useState(0);
  const isCustom = journey.category === "Custom";
  const vehicle = getVehicle(journey.requiredVehicle);

  // Lock the background page scroll (incl. Lenis) while the modal is open.
  useLockBodyScroll(open);

  // Reset to the first image on open + close on Escape.
  useEffect(() => {
    if (!open) return;
    setActive(0);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-[#0D0A07]/90 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background border border-accent/30 ember-glow"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 z-20 text-foreground/80 hover:text-accent bg-background/70 border border-highlight/40 p-2 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Gallery */}
            <div className="relative h-[260px] sm:h-[340px] w-full overflow-hidden vignette">
              <img
                src={journey.gallery[active]}
                alt={journey.title}
                className="w-full h-full object-cover grayscale-[12%] sepia-[24%] brightness-[0.85]"
              />
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background to-transparent" />

              {/* Prev / Next — large tap targets, ember-glow on hover */}
              {journey.gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setActive((i) =>
                        i === 0 ? journey.gallery.length - 1 : i - 1,
                      )
                    }
                    aria-label="Previous image"
                    className="absolute top-1/2 left-3 sm:left-4 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center bg-background/65 hover:bg-background/85 border border-accent/40 hover:border-accent text-foreground/90 hover:text-accent backdrop-blur-sm transition-all duration-300 ember-glow"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setActive((i) =>
                        i === journey.gallery.length - 1 ? 0 : i + 1,
                      )
                    }
                    aria-label="Next image"
                    className="absolute top-1/2 right-3 sm:right-4 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center bg-background/65 hover:bg-background/85 border border-accent/40 hover:border-accent text-foreground/90 hover:text-accent backdrop-blur-sm transition-all duration-300 ember-glow"
                  >
                    <ChevronRight size={22} />
                  </button>
                </>
              )}

              {/* Larger pagination — each bullet is a 36×16 tap target (text
                  is the visible 8×3px bar, surrounded by padding for touch). */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                {journey.gallery.map((src, i) => (
                  <button
                    key={src + i}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`Image ${i + 1}`}
                    className="group p-2 -m-1"
                  >
                    <span
                      className={`block h-1.5 transition-all duration-300 ${
                        i === active
                          ? "w-8 bg-accent"
                          : "w-4 bg-foreground/40 group-hover:bg-foreground/80"
                      }`}
                    />
                  </button>
                ))}
              </div>

              <div className="absolute top-4 left-4 flex items-center gap-2 bg-background/70 backdrop-blur-sm border border-accent/30 px-3 py-1.5">
                <span className="text-accent text-base leading-none">
                  {CATEGORY_SIGIL[journey.category]}
                </span>
                <span className="font-accent uppercase tracking-[0.22em] text-[10px] text-foreground/90">
                  {journey.category}
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 sm:p-9">
              <p className="font-accent italic text-accent text-[12px] tracking-[0.3em] uppercase">
                {journey.region}
              </p>
              <h2 className="font-heading text-3xl sm:text-4xl uppercase tracking-[0.06em] text-foreground mt-2 ember-text-glow leading-tight">
                {journey.title}
              </h2>
              <p className="mt-4 text-foreground/85 text-[17px] leading-relaxed font-serif italic">
                {journey.hook}
              </p>

              <div className="ink-divider my-7" />

              {!isCustom && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-7">
                  <Stat label="Distance" value={`${journey.distanceKm} km`} />
                  <Stat label="Days" value={`${journey.days}`} />
                  <Stat label="Difficulty" value={journey.difficulty} />
                  <Stat label="Vehicle" value={vehicle?.name ?? "Matched"} />
                </div>
              )}

              <p className="text-foreground/85 text-[16px] leading-[1.8] font-serif">
                {journey.overview[0]}
              </p>

              {journey.highlights.length > 0 && (
                <ul className="mt-6 space-y-2">
                  {journey.highlights.slice(0, 3).map((h) => (
                    <li key={h} className="flex gap-3 text-foreground/85 text-[15px] font-serif">
                      <span className="text-accent mt-0.5">✦</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Actions */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center">
                <Link
                  href={`/charter/${journey.slug}`}
                  className="px-8 py-4 border border-accent bg-accent/15 hover:bg-accent hover:text-background transition-all duration-500 font-accent text-[12px] tracking-[0.3em] uppercase text-foreground ember-glow text-center"
                >
                  Build this charter
                </Link>
                <Link
                  href={`/journeys/${journey.slug}`}
                  className="px-8 py-4 border border-highlight/50 hover:border-accent transition-all duration-500 font-accent text-[12px] tracking-[0.3em] uppercase text-muted hover:text-foreground text-center"
                >
                  Open full charter →
                </Link>
                <span className="sm:ml-auto font-accent italic text-muted text-[12px] tracking-[0.2em] uppercase">
                  {isCustom ? "By design" : `From ${formatPriceRange(journey.priceFrom, journey.priceTo)}`}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-l-2 border-accent/40 pl-3">
      <p className="font-accent uppercase tracking-[0.2em] text-[10px] text-muted">{label}</p>
      <p className="font-heading text-foreground text-[18px] mt-1 leading-none">{value}</p>
    </div>
  );
}
