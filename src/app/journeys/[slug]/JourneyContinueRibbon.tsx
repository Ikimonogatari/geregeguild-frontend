"use client";

import Link from "next/link";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { DUR, EASE } from "@/lib/motion";

/**
 * A slim, ember-bordered ribbon that appears once the reader has
 * scrolled past the hero. Not a SaaS floating bar — dark parchment,
 * a hairline of ember, and a single restrained CTA.
 */
export default function JourneyContinueRibbon({
  title,
  href,
}: {
  title: string;
  href: string;
}) {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show after ~70vh of scroll — safely past the hero on every viewport.
    const unsubscribe = scrollY.on("change", (y) => {
      const threshold = typeof window !== "undefined" ? window.innerHeight * 0.7 : 500;
      setVisible(y > threshold);
    });
    return () => unsubscribe();
  }, [scrollY]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: DUR.base, ease: EASE }}
          className="fixed top-[80px] left-0 right-0 z-40 pointer-events-none"
        >
          <div className="pointer-events-auto mx-auto max-w-4xl px-4">
            <div className="border-x border-b border-accent/35 bg-background/92 backdrop-blur-md flex items-center gap-4 px-5 py-3 ember-glow">
              <div className="min-w-0 flex-1">
                <p className="font-accent italic text-accent text-[10px] tracking-[0.3em] uppercase leading-none">
                  You are on
                </p>
                <p className="mt-1 font-heading text-foreground text-[13px] sm:text-[14px] uppercase tracking-[0.05em] truncate">
                  {title}
                </p>
              </div>
              <Link
                href={href}
                className="group/cta shrink-0 inline-flex items-center gap-2 px-5 py-2.5 border border-accent bg-accent/10 hover:bg-accent hover:text-background font-accent text-[10px] sm:text-[11px] tracking-[0.28em] uppercase text-foreground transition-all duration-500"
              >
                Continue planning
                <span className="inline-block transition-transform duration-500 group-hover/cta:translate-x-0.5">
                  →
                </span>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
