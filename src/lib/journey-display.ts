/* ────────────────────────────────────────────────────────────
   journey-display — palette + helpers that are SAFE for SSR.

   Anything that touches Leaflet (the JourneysOverviewMap
   component) has to be client-only. Splitting the small
   data helpers out into this module lets server components
   import { colorForIndex, listedJourneys } without
   accidentally pulling Leaflet (and `window`) into SSR.
   ──────────────────────────────────────────────────────────── */

import { JOURNEYS, type Journey } from "./journeys";

/* Distinct-but-on-brand colour per journey — warm only so the chart
   stays an antique sheet. 9 palette entries × 9 active journeys =
   every route gets a unique colour. */
const PALETTE: string[] = [
  "#ffd787", // bright ember
  "#e5733f", // sunset orange
  "#c0452b", // rust red
  "#d4a043", // saffron
  "#cd5a3a", // terracotta
  "#9a3a1f", // maroon
  "#f5b860", // honey
  "#8b6b1f", // aged brass
  "#b8551c", // burnt orange
];

export function colorForIndex(i: number): string {
  return PALETTE[i % PALETTE.length];
}

/** All charter journeys (Custom excluded) in display order. */
export function listedJourneys(): Journey[] {
  return JOURNEYS.filter((j) => j.category !== "Custom");
}
