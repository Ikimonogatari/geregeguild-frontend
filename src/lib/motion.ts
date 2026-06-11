import type { Transition, Variants } from "framer-motion";

/* ────────────────────────────────────────────────────────────
   House motion language — one shared vocabulary so every
   animation across the site feels cut from the same cloth.
   ──────────────────────────────────────────────────────────── */

/** The signature easing — a weighted, parchment-settling curve.
 *  Already used ad-hoc across the app; centralised here. */
export const EASE = [0.2, 0.7, 0.2, 1] as const;

/** A softer ease for ambient, looping motion. */
export const EASE_SOFT = [0.4, 0, 0.2, 1] as const;

/** Standard durations (seconds). Reach for these instead of magic numbers. */
export const DUR = {
  fast: 0.4,
  base: 0.7,
  slow: 1.1,
  cinematic: 1.6,
} as const;

/** Stagger steps for children revealing in sequence. */
export const STAGGER = {
  tight: 0.06,
  base: 0.1,
  loose: 0.16,
} as const;

export const springSoft: Transition = {
  type: "spring",
  stiffness: 120,
  damping: 20,
  mass: 0.6,
};

/* ─── Reveal variants — the canonical scroll-into-view motions ─── */

type RevealKind = "rise" | "fade" | "scale" | "wipe" | "blur" | "iris" | "slideLeft";

const HIDDEN: Record<RevealKind, Record<string, number | string>> = {
  rise: { opacity: 0, y: 34 },
  fade: { opacity: 0 },
  scale: { opacity: 0, scale: 0.94 },
  wipe: { opacity: 0, y: 18, clipPath: "inset(0 0 100% 0)" },
  blur: { opacity: 0, y: 18, filter: "blur(10px)" },
  // Iris-wipe — opens from the centre like a film iris.
  iris: { opacity: 0, clipPath: "inset(50% 0 50% 0)" },
  // Horizontal film slide from the left.
  slideLeft: { opacity: 0, x: -64 },
};

const SHOWN: Record<RevealKind, Record<string, number | string>> = {
  rise: { opacity: 1, y: 0 },
  fade: { opacity: 1 },
  scale: { opacity: 1, scale: 1 },
  wipe: { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" },
  blur: { opacity: 1, y: 0, filter: "blur(0px)" },
  iris: { opacity: 1, clipPath: "inset(0% 0 0% 0)" },
  slideLeft: { opacity: 1, x: 0 },
};

export function revealVariants(
  kind: RevealKind = "rise",
  duration: number = DUR.base,
  delay = 0,
): Variants {
  return {
    hidden: HIDDEN[kind],
    visible: {
      ...SHOWN[kind],
      transition: { duration, delay, ease: EASE },
    },
  };
}

/** A parent that staggers its children. Pair with `revealVariants` on each child. */
export function staggerParent(step: number = STAGGER.base, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: step, delayChildren },
    },
  };
}

/** Shared viewport config. The positive bottom margin pre-triggers reveals
 *  just before a section enters, so content is never sitting invisible (which
 *  reads as empty space) as you scroll toward it. */
export const VIEWPORT = { once: true, margin: "0px 0px 120px 0px" } as const;
