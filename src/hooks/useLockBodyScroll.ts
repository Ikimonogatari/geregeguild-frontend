"use client";

import { useEffect } from "react";
import { useLenis } from "lenis/react";

/* ────────────────────────────────────────────────────────────
   useLockBodyScroll — lock background page scroll while a
   modal / drawer / dialog is open.

   Plain `body { overflow: hidden }` is NOT enough on this
   site: Lenis intercepts wheel events and animates the scroll
   directly, bypassing CSS. So we ALSO stop the Lenis instance
   while locked. Touch-move on iOS is suppressed similarly.

   Pass `true` while the surface is open. Cleanup restores
   both Lenis and the body scroll on close or unmount.
   ──────────────────────────────────────────────────────────── */
export function useLockBodyScroll(active: boolean) {
  const lenis = useLenis();

  useEffect(() => {
    if (!active) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lenis?.stop();
    return () => {
      document.body.style.overflow = prevOverflow;
      lenis?.start();
    };
  }, [active, lenis]);
}
