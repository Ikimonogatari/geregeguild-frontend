/* ────────────────────────────────────────────────────────────
   Journey routes — real-world waypoints along each charter,
   stored as lon/lat. MapPlate projects them to the SVG viewBox
   using the same equirectangular projection as the country
   outline, so the route truly tracks Mongolian geography.
   ──────────────────────────────────────────────────────────── */

import { project } from "./mongolia-geo";

export type Waypoint = { name: string; lon: number; lat: number };

/** Anchor places we reuse across many routes — real lon/lat. */
const PLACES = {
  ulaanbaatar:    { name: "Ulaanbaatar",      lon: 106.92, lat: 47.92 },
  karakorum:      { name: "Karakorum",        lon: 102.85, lat: 47.18 },
  khövsgöl:       { name: "Khövsgöl",         lon: 100.16, lat: 50.45 },
  tsagaannuur:    { name: "Tsagaannuur",      lon:  99.36, lat: 51.35 },
  arkhangai:      { name: "Tsetserleg",       lon: 101.45, lat: 47.47 },
  khentii:        { name: "Binder",           lon: 110.62, lat: 48.62 },
  ononRiver:      { name: "Onon River",       lon: 112.20, lat: 48.95 },
  bayanÖlgii:     { name: "Ölgii",            lon:  89.97, lat: 48.97 },
  altai:          { name: "Khovd",            lon:  91.64, lat: 48.00 },
  khongor:        { name: "Khongoryn Els",    lon: 102.45, lat: 43.75 },
  yolyn:          { name: "Yolyn Am",         lon: 103.85, lat: 43.50 },
  övörkhangai:    { name: "Arvaikheer",       lon: 102.78, lat: 46.27 },
  ulaanbaatarN:   { name: "Tuul valley",      lon: 105.20, lat: 48.40 },
  frozenLake:     { name: "Frozen Khövsgöl",  lon: 100.50, lat: 51.00 },
};

/** Routes keyed by Journey.slug — lon/lat polylines.
 *  IMPORTANT: keys must match the slugs in src/lib/journeys.ts exactly. */
export const JOURNEY_ROUTES: Record<string, Waypoint[]> = {
  "khentii-horse-road": [
    PLACES.ulaanbaatar,
    PLACES.khentii,
    PLACES.ononRiver,
  ],
  "valley-of-monasteries": [
    PLACES.ulaanbaatar,
    PLACES.karakorum,
    PLACES.övörkhangai,
  ],
  "altai-offroad-traverse": [
    PLACES.ulaanbaatar,
    PLACES.altai,
    PLACES.bayanÖlgii,
  ],
  "shaman-blue-sky": [
    PLACES.ulaanbaatar,
    PLACES.khövsgöl,
  ],
  "ger-of-the-herders": [
    PLACES.ulaanbaatar,
    PLACES.arkhangai,
  ],
  "gobi-singing-sands": [
    PLACES.ulaanbaatar,
    PLACES.khongor,
    PLACES.yolyn,
  ],
  "taiga-of-the-reindeer": [
    PLACES.ulaanbaatar,
    PLACES.khövsgöl,
    PLACES.tsagaannuur,
  ],
  "imperial-road": [
    PLACES.ulaanbaatar,
    PLACES.karakorum,
    PLACES.övörkhangai,
  ],
};

/** Fallback — straight UB → central Mongolia. */
export const DEFAULT_ROUTE: Waypoint[] = [
  PLACES.ulaanbaatar,
  PLACES.arkhangai,
];

export function routeForJourney(slug: string): Waypoint[] {
  return JOURNEY_ROUTES[slug] ?? DEFAULT_ROUTE;
}

/** Project a waypoint to [x, y] in the given viewBox. */
export function projectWaypoint(
  wp: Waypoint,
  w: number,
  h: number,
): { x: number; y: number; name: string } {
  const [x, y] = project(wp.lon, wp.lat, w, h);
  return { x, y, name: wp.name };
}
