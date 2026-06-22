/* ────────────────────────────────────────────────────────────
   Mongolia geographic data — real border, lakes, rivers,
   ranges. Projected from lon/lat to SVG viewBox coordinates.

   Coverage: ~87°–120°E, ~41.5°–52.2°N.
   Outline is a simplified polyline derived from Mongolia's
   true national border (Natural-Earth-quality ~40 points),
   not a stylised blob. Lakes & rivers use their true
   real-world locations.
   ──────────────────────────────────────────────────────────── */

/** Bounding box the projection maps to the viewBox. */
export const PROJ = {
  minLon: 87,
  maxLon: 120,
  minLat: 41.4,
  maxLat: 52.3,
};

/** Equirectangular projection — fine at this latitude band & zoom. */
export function project(lon: number, lat: number, w: number, h: number): [number, number] {
  const x = ((lon - PROJ.minLon) / (PROJ.maxLon - PROJ.minLon)) * w;
  const y = ((PROJ.maxLat - lat) / (PROJ.maxLat - PROJ.minLat)) * h;
  return [x, y];
}

/** Build an SVG path string from a polygon of [lon, lat] points. */
export function polygonPath(points: [number, number][], w: number, h: number): string {
  if (points.length === 0) return "";
  const [sx, sy] = project(points[0][0], points[0][1], w, h);
  let d = `M ${sx.toFixed(1)} ${sy.toFixed(1)}`;
  for (let i = 1; i < points.length; i++) {
    const [x, y] = project(points[i][0], points[i][1], w, h);
    d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d + " Z";
}

/** Build an open polyline SVG path string from [lon, lat] points. */
export function polylinePath(points: [number, number][], w: number, h: number): string {
  if (points.length === 0) return "";
  const [sx, sy] = project(points[0][0], points[0][1], w, h);
  let d = `M ${sx.toFixed(1)} ${sy.toFixed(1)}`;
  for (let i = 1; i < points.length; i++) {
    const [x, y] = project(points[i][0], points[i][1], w, h);
    d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}

/* ────────────────────────────────────────────────────────────
   National border — clockwise from the NW corner (Tavan Bogd).
   Real geographic vertices, ~40 points. Recognisable as
   Mongolia at glance.
   ──────────────────────────────────────────────────────────── */

export const MONGOLIA_OUTLINE: [number, number][] = [
  // NW — Tavan Bogd (RU/CN/MN tripoint) heading east along Russian border
  [87.81, 49.18],
  [88.0, 49.42],
  [88.4, 49.62],
  [88.8, 49.55],
  [89.4, 49.83],
  [89.85, 50.02],
  [90.3, 50.18],
  [90.9, 50.35],
  [91.5, 50.7],
  [91.9, 50.5],
  [92.5, 50.76],
  [93.0, 50.5],
  [93.7, 50.3],
  [94.2, 50.55],
  [94.8, 50.4],
  [95.4, 50.6],
  [96.0, 50.95],
  [96.7, 51.18],
  [97.5, 51.45],
  [98.0, 51.65],
  // Sayan mountains — Mongolia's northernmost reach
  [98.5, 51.85],
  [99.0, 51.95],
  [99.5, 51.9],
  [100.05, 51.83],
  [100.5, 51.75],
  [101.0, 51.55],
  [101.8, 51.3],
  [102.5, 51.05],
  [103.5, 50.7],
  [104.5, 50.45],
  [105.5, 50.32],
  [106.5, 50.28],
  // Selenge crossing into Russia — northern step down
  [107.5, 49.8],
  [108.5, 49.4],
  [109.5, 49.43],
  [110.5, 49.4],
  [111.5, 49.55],
  [112.5, 49.62],
  [113.5, 49.8],
  [114.5, 49.65],
  [115.5, 49.83],
  [116.5, 49.88],
  [117.5, 49.83],
  [118.5, 49.7],
  // Eastern corner Dornod
  [119.5, 49.5],
  [119.9, 49.2],
  [119.7, 48.5],
  [119.55, 47.8],
  [119.4, 47.0],
  // Down along the Chinese border
  [118.5, 46.55],
  [117.5, 46.18],
  [116.5, 45.95],
  [115.0, 45.6],
  [114.0, 45.42],
  [113.0, 45.2],
  [112.5, 44.85],
  [112.0, 44.3],
  [111.5, 43.7],
  [111.0, 43.0],
  // Southern Gobi border — almost straight east-west
  [110.5, 42.65],
  [109.5, 42.5],
  [108.5, 42.4],
  [107.5, 42.3],
  [106.5, 41.95],
  [105.5, 41.6],
  [104.5, 41.55],
  [103.5, 41.7],
  [102.5, 41.95],
  [101.5, 42.1],
  [100.5, 42.3],
  [99.5, 42.5],
  [98.5, 42.45],
  [97.5, 42.0],
  [97.0, 41.85],
  [96.5, 42.25],
  [95.7, 42.45],
  [94.5, 42.55],
  [93.5, 42.7],
  // SW — climbing up the western boundary
  [93.0, 43.0],
  [92.5, 43.3],
  [92.0, 43.65],
  [91.5, 44.0],
  [91.0, 44.4],
  [90.5, 45.0],
  [90.0, 45.5],
  [89.5, 46.0],
  [89.0, 46.45],
  [88.8, 46.85],
  [88.5, 47.25],
  [88.2, 47.65],
  [88.05, 48.0],
  [87.95, 48.4],
  [87.85, 48.8],
  [87.81, 49.18], // close at Tavan Bogd
];

/** Neighbouring country labels — purely decorative, sit just outside
 *  Mongolia's border on the parchment to give the map real-world context. */
export const NEIGHBOURS: { name: string; lon: number; lat: number; size?: number }[] = [
  { name: "RUSSIA", lon: 103.5, lat: 53.3, size: 10 },
  { name: "CHINA", lon: 108.0, lat: 40.3, size: 10 },
];

/** Cities marked as proper map dots (not waypoints). */
export const CITIES: { name: string; lon: number; lat: number; capital?: boolean }[] = [
  { name: "Ulaanbaatar", lon: 106.92, lat: 47.92, capital: true },
];

/** Khövsgöl is a long N-S lake; render its real elongated shape rather than an ellipse. */
export const KHOVSGOL_LAKE_OUTLINE: [number, number][] = [
  [100.45, 51.65],
  [100.55, 51.55],
  [100.6, 51.35],
  [100.65, 51.15],
  [100.7, 50.95],
  [100.7, 50.75],
  [100.65, 50.6],
  [100.55, 50.5],
  [100.4, 50.5],
  [100.3, 50.65],
  [100.25, 50.85],
  [100.2, 51.05],
  [100.25, 51.25],
  [100.3, 51.45],
  [100.4, 51.6],
  [100.45, 51.65],
];

/* ────────────────────────────────────────────────────────────
   Major lakes (real centres + approx half-extents in km).
   ──────────────────────────────────────────────────────────── */

export type Lake = { name: string; lon: number; lat: number; rxKm: number; ryKm: number };

/** Smaller / rounder lakes — rendered as ellipses. Khövsgöl is too
 *  elongated for an ellipse to look right, so it gets its own polygon
 *  outline (see KHOVSGOL_LAKE_OUTLINE). */
export const LAKES: Lake[] = [
  { name: "Uvs Nuur", lon: 92.7, lat: 50.3, rxKm: 45, ryKm: 30 },
  { name: "Khyargas Nuur", lon: 93.4, lat: 49.15, rxKm: 38, ryKm: 18 },
  { name: "Khar Us Nuur", lon: 92.4, lat: 48.05, rxKm: 38, ryKm: 18 },
  { name: "Buir Nuur", lon: 117.6, lat: 47.83, rxKm: 22, ryKm: 14 },
];

/* ────────────────────────────────────────────────────────────
   Major rivers — real polylines, simplified to a few vertices.
   ──────────────────────────────────────────────────────────── */

export type River = { name: string; points: [number, number][] };

export const RIVERS: River[] = [
  // Selenge — central N, drains to Russia (Lake Baikal)
  {
    name: "Selenge",
    points: [
      [99.5, 49.4],
      [101.0, 49.7],
      [103.0, 50.3],
      [104.8, 50.4],
      [106.0, 50.5],
    ],
  },
  // Tuul — past Ulaanbaatar, joins Orkhon → Selenge
  {
    name: "Tuul",
    points: [
      [108.0, 47.5],
      [106.8, 47.95], // past UB
      [105.5, 48.4],
      [104.5, 48.9],
      [103.7, 49.4],
    ],
  },
  // Onon — eastern Khentii, exits to Russia (Amur basin)
  {
    name: "Onon",
    points: [
      [109.0, 48.2],
      [110.5, 48.7],
      [112.0, 49.0],
      [113.5, 49.4],
    ],
  },
  // Kherlen — Khentii to eastern steppes
  {
    name: "Kherlen",
    points: [
      [108.6, 48.6],
      [110.6, 47.9],
      [112.8, 47.5],
      [114.5, 47.6],
      [117.0, 47.9],
    ],
  },
];

/* ────────────────────────────────────────────────────────────
   Mountain ranges — label anchor + a few caret peaks each.
   ──────────────────────────────────────────────────────────── */

export type Range = { name: string; lon: number; lat: number; peakCount?: number; spread?: number };

export const RANGES: Range[] = [
  { name: "Altai", lon: 91.0, lat: 46.2, peakCount: 4, spread: 1.5 },
  { name: "Khangai", lon: 100.5, lat: 47.0, peakCount: 4, spread: 1.6 },
  { name: "Khentii", lon: 109.5, lat: 48.2, peakCount: 3, spread: 1.2 },
];

/* ────────────────────────────────────────────────────────────
   Gobi region — for the hatched zone.
   ──────────────────────────────────────────────────────────── */

export const GOBI_REGION: [number, number][] = [
  [97.0, 43.8],
  [101.0, 43.0],
  [105.0, 42.4],
  [110.0, 43.3],
  [113.0, 44.3],
  [110.0, 44.6],
  [104.0, 44.8],
  [99.0, 44.5],
  [97.0, 43.8],
];
