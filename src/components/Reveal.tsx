"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { revealVariants, staggerParent, VIEWPORT, DUR } from "@/lib/motion";

type RevealKind = "rise" | "fade" | "scale" | "wipe" | "blur" | "iris" | "slideLeft";

type RevealProps = {
  as?: "div" | "section" | "li" | "span" | "p" | "h2" | "h3";
  kind?: RevealKind;
  delay?: number;
  duration?: number;
  /** Render as a stagger parent — direct <Reveal.Item> children animate in sequence. */
  stagger?: number;
  className?: string;
  children: React.ReactNode;
} & Omit<HTMLMotionProps<"div">, "variants" | "initial" | "whileInView" | "viewport">;

/**
 * The canonical scroll-into-view wrapper. One primitive, used everywhere, so
 * reveal timing/easing stay consistent across the whole site.
 *
 *   <Reveal kind="blur">…</Reveal>
 *   <Reveal stagger><Reveal.Item>…</Reveal.Item><Reveal.Item>…</Reveal.Item></Reveal>
 */
export default function Reveal({
  as = "div",
  kind = "rise",
  delay = 0,
  duration = DUR.base,
  stagger,
  className,
  children,
  ...rest
}: RevealProps) {
  const MotionTag = motion[as] as typeof motion.div;
  const variants = stagger
    ? staggerParent(stagger, delay)
    : revealVariants(kind, duration, delay);

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

type ItemProps = {
  as?: "div" | "li" | "span" | "p";
  kind?: RevealKind;
  duration?: number;
  className?: string;
  children: React.ReactNode;
} & Omit<HTMLMotionProps<"div">, "variants">;

/** A child of a staggered <Reveal>. Inherits the parent's sequence timing. */
function Item({ as = "div", kind = "rise", duration = DUR.base, className, children, ...rest }: ItemProps) {
  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag className={className} variants={revealVariants(kind, duration)} {...rest}>
      {children}
    </MotionTag>
  );
}

Reveal.Item = Item;
