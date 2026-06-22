"use client";

import { motion } from "framer-motion";
import { projectWaypoint, type Waypoint } from "@/lib/journey-routes";
import {
  CITIES,
  GOBI_REGION,
  KHOVSGOL_LAKE_OUTLINE,
  LAKES,
  MONGOLIA_OUTLINE,
  NEIGHBOURS,
  PROJ,
  RANGES,
  RIVERS,
  polygonPath,
  polylinePath,
  project,
} from "@/lib/mongolia-geo";

/* ────────────────────────────────────────────────────────────
   MapPlate — a real, projected map of Mongolia.

   The border is the country's true outline (simplified to
   ~40 vertices). Lakes (Khövsgöl, Uvs, Khyargas, Khar Us,
   Buir), four real rivers (Selenge, Tuul, Onon, Kherlen),
   and three mountain ranges (Altai, Khangai, Khentii) are
   plotted at their actual lon/lat. Routes draw between
   real city/place coordinates.

   On `active` the map ink-draws onto the parchment, then the
   route strokes through its actual waypoints.
   ──────────────────────────────────────────────────────────── */

type Props = {
  active: boolean;
  route: Waypoint[];
  /** Right-hand corner label — typically "8 days · 240 km". */
  label?: string;
};

const W = 400;
const H = 200;

// One-time-computed real paths.
const COUNTRY_PATH = polygonPath(MONGOLIA_OUTLINE, W, H);
const GOBI_PATH = polygonPath(GOBI_REGION, W, H);
const KHOVSGOL_PATH = polygonPath(KHOVSGOL_LAKE_OUTLINE, W, H);

// Graticule (5° lat/lon grid lines that fall inside the map bounds).
const GRATICULE: { d: string }[] = (() => {
  const lines: { d: string }[] = [];
  // Vertical (meridians) at every 5° lon
  for (let lon = Math.ceil(PROJ.minLon / 5) * 5; lon <= PROJ.maxLon; lon += 5) {
    const [x1, y1] = project(lon, PROJ.minLat, W, H);
    const [x2, y2] = project(lon, PROJ.maxLat, W, H);
    lines.push({ d: `M ${x1.toFixed(1)} ${y1.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)}` });
  }
  // Horizontal (parallels) at every 5° lat
  for (let lat = Math.ceil(PROJ.minLat / 5) * 5; lat <= PROJ.maxLat; lat += 5) {
    const [x1, y1] = project(PROJ.minLon, lat, W, H);
    const [x2, y2] = project(PROJ.maxLon, lat, W, H);
    lines.push({ d: `M ${x1.toFixed(1)} ${y1.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)}` });
  }
  return lines;
})();

const PROJECTED_CITIES = CITIES.map((c) => {
  const [x, y] = project(c.lon, c.lat, W, H);
  return { ...c, x, y };
});
const PROJECTED_NEIGHBOURS = NEIGHBOURS.map((n) => {
  const [x, y] = project(n.lon, n.lat, W, H);
  return { ...n, x, y };
});
const PROJECTED_RIVERS = RIVERS.map((r) => ({
  name: r.name,
  d: polylinePath(r.points, W, H),
}));
const PROJECTED_LAKES = LAKES.map((l) => {
  const [cx, cy] = project(l.lon, l.lat, W, H);
  // ~111 km per degree latitude; degree lon shrinks by cos(lat)
  const degPerKmLat = 1 / 111;
  const degPerKmLon = 1 / (111 * Math.cos((l.lat * Math.PI) / 180));
  const dLatHalf = l.ryKm * degPerKmLat;
  const dLonHalf = l.rxKm * degPerKmLon;
  // Project the extent: dx in pixels = (dLon / lonSpan) * W
  const rx = (dLonHalf / (120 - 87)) * W;
  const ry = (dLatHalf / (52.3 - 41.4)) * H;
  return { name: l.name, cx, cy, rx, ry };
});
const PROJECTED_RANGES = RANGES.map((r) => {
  const [x, y] = project(r.lon, r.lat, W, H);
  return { name: r.name, x, y, peakCount: r.peakCount ?? 3, spread: r.spread ?? 1.2 };
});

export default function MapPlate({ active, route, label }: Props) {
  // Project route waypoints to viewBox coords.
  const points = route.map((w) => projectWaypoint(w, W, H));
  const pathD = buildRoutePath(points);

  // Per-waypoint timeline: each ticks in along the path as it draws.
  const PATH_DURATION = 1.6;
  const PATH_START_DELAY = 0.55; // after compass + outline settle

  return (
    <svg
      aria-hidden
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Aged parchment substrate — burnt ochre base, multi-fleck noise */}
        <radialGradient id="paperBase" cx="50%" cy="50%" r="80%">
          <stop offset="0%" stopColor="#5a3818" />
          <stop offset="55%" stopColor="#3e2511" />
          <stop offset="100%" stopColor="#1c1108" />
        </radialGradient>
        <pattern id="paperGrain" width="40" height="40" patternUnits="userSpaceOnUse">
          {/* Speckles of pulp + ink dots */}
          <circle cx="3" cy="5" r="0.4" fill="rgba(201,146,42,0.18)" />
          <circle cx="12" cy="9" r="0.3" fill="rgba(232,191,116,0.12)" />
          <circle cx="22" cy="14" r="0.5" fill="rgba(80,40,15,0.45)" />
          <circle cx="31" cy="6" r="0.35" fill="rgba(201,146,42,0.12)" />
          <circle cx="7" cy="22" r="0.4" fill="rgba(80,40,15,0.4)" />
          <circle cx="17" cy="28" r="0.3" fill="rgba(232,191,116,0.1)" />
          <circle cx="28" cy="23" r="0.5" fill="rgba(80,40,15,0.5)" />
          <circle cx="35" cy="33" r="0.35" fill="rgba(201,146,42,0.15)" />
          <circle cx="4" cy="36" r="0.4" fill="rgba(80,40,15,0.4)" />
          <circle cx="18" cy="38" r="0.3" fill="rgba(232,191,116,0.1)" />
        </pattern>
        {/* Coffee-stain blotches — irregular dark patches */}
        <radialGradient id="stainA" cx="20%" cy="80%" r="25%">
          <stop offset="0%" stopColor="rgba(20,10,4,0.5)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="stainB" cx="85%" cy="20%" r="22%">
          <stop offset="0%" stopColor="rgba(20,10,4,0.42)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="stainC" cx="70%" cy="90%" r="18%">
          <stop offset="0%" stopColor="rgba(20,10,4,0.38)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        {/* Burnishing — warm candle glow rises from below */}
        <radialGradient id="candleGlow" cx="50%" cy="60%" r="55%">
          <stop offset="0%" stopColor="rgba(201,146,42,0.18)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="mapVignette" cx="50%" cy="50%" r="70%">
          <stop offset="55%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(13,10,7,0.9)" />
        </radialGradient>
        {/* Gobi hatching */}
        <pattern id="gobiHatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <line x1="0" y1="0" x2="0" y2="5" stroke="rgba(201,146,42,0.22)" strokeWidth="0.7" />
        </pattern>
        {/* Mountain ridge hatch (denser) */}
        <pattern id="ridgeHatch" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="3" stroke="rgba(232,191,116,0.55)" strokeWidth="0.5" />
        </pattern>
        {/* River ink — slight blur for calligraphic feel */}
        <filter id="inkBleed" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.25" />
        </filter>
        {/* Clip so terrain features only paint inside the country */}
        <clipPath id="countryClip">
          <path d={COUNTRY_PATH} />
        </clipPath>
      </defs>

      {/* Parchment substrate */}
      <rect width={W} height={H} fill="url(#mapPaper)" />

      {/* Faint lat/lon graticule — at every 5°. Real maps have them. */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        stroke="rgba(232,191,116,0.08)"
        strokeWidth={0.4}
        fill="none"
      >
        {GRATICULE.map((g, i) => (
          <path key={i} d={g.d} />
        ))}
      </motion.g>

      {/* Neighbouring countries — soft labels outside Mongolia's border */}
      {PROJECTED_NEIGHBOURS.map((n) => (
        <motion.text
          key={n.name}
          x={n.x}
          y={n.y}
          textAnchor="middle"
          fontSize={n.size ?? 10}
          letterSpacing="3"
          fill="rgba(168,144,112,0.55)"
          style={{ fontFamily: "var(--font-heading), serif", fontWeight: 500 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: active ? 1 : 0 }}
          transition={{ duration: 0.4, delay: active ? 0.15 : 0 }}
        >
          {n.name}
        </motion.text>
      ))}

      {/* Country fill — appears immediately on activation,
          gives the outline some weight even before the stroke draws */}
      <motion.path
        d={COUNTRY_PATH}
        fill="rgba(58,38,20,0.6)"
        stroke="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 0.35 }}
      />

      {/* Gobi hatched zone — clipped to inside the country */}
      <g clipPath="url(#countryClip)">
        <motion.path
          d={GOBI_PATH}
          fill="url(#gobiHatch)"
          initial={{ opacity: 0 }}
          animate={{ opacity: active ? 1 : 0 }}
          transition={{ duration: 0.4, delay: active ? 0.3 : 0 }}
        />
      </g>

      {/* Country outline — ink-draws on activation */}
      <motion.path
        d={COUNTRY_PATH}
        stroke="rgba(232,191,116,0.85)"
        strokeWidth={1.3}
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={active ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{
          pathLength: { duration: 0.85, ease: [0.2, 0.7, 0.2, 1] },
          opacity: { duration: 0.3 },
        }}
      />

      {/* Khövsgöl — its real elongated N-S polygon, not an ellipse */}
      <motion.path
        d={KHOVSGOL_PATH}
        fill="rgba(120,160,180,0.7)"
        stroke="rgba(232,191,116,0.6)"
        strokeWidth={0.7}
        initial={{ opacity: 0 }}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 0.45, delay: active ? 0.35 : 0 }}
      />

      {/* Smaller, rounder lakes — projected from their real centres */}
      {PROJECTED_LAKES.map((l, i) => (
        <motion.ellipse
          key={l.name}
          cx={l.cx}
          cy={l.cy}
          rx={Math.max(l.rx, 1.5)}
          ry={Math.max(l.ry, 1.5)}
          fill="rgba(120,160,180,0.6)"
          stroke="rgba(232,191,116,0.55)"
          strokeWidth={0.6}
          initial={{ opacity: 0, scale: 0 }}
          animate={active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ duration: 0.4, delay: active ? 0.38 + i * 0.04 : 0 }}
          style={{ transformOrigin: `${l.cx}px ${l.cy}px` }}
        />
      ))}

      {/* Capital + city dots — UB sits at its real coords (106.92°E, 47.92°N) */}
      {PROJECTED_CITIES.map((c) => (
        <motion.g
          key={c.name}
          initial={{ opacity: 0, scale: 0 }}
          animate={active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ duration: 0.4, delay: active ? 0.5 : 0 }}
          style={{ transformOrigin: `${c.x}px ${c.y}px` }}
        >
          {/* Capital marker — double-ring */}
          <circle cx={c.x} cy={c.y} r={3.2} fill="none" stroke="rgba(232,191,116,0.9)" strokeWidth={0.9} />
          <circle cx={c.x} cy={c.y} r={1.4} fill="rgba(232,191,116,0.95)" />
          <text
            x={c.x + 5}
            y={c.y - 4}
            fontSize={6}
            letterSpacing="0.6"
            fill="rgba(232,191,116,0.85)"
            style={{ fontFamily: "var(--font-heading), serif" }}
          >
            {c.name.toUpperCase()}
          </text>
        </motion.g>
      ))}

      {/* Real rivers — each ink-draws after the country settles */}
      {PROJECTED_RIVERS.map((r, i) => (
        <motion.path
          key={r.name}
          d={r.d}
          stroke="rgba(140,180,200,0.7)"
          strokeWidth={1}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={active ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{
            pathLength: { duration: 0.7, delay: active ? 0.4 + i * 0.05 : 0 },
            opacity: { duration: 0.25, delay: active ? 0.4 + i * 0.05 : 0 },
          }}
        />
      ))}

      {/* Mountain ranges — caret peaks at real lon/lat */}
      {active &&
        PROJECTED_RANGES.map((r) => (
          <MountainGlyphs
            key={r.name}
            x={r.x}
            y={r.y}
            count={r.peakCount}
            delay={0.45}
          />
        ))}

      {/* Region labels — italic, settle in below mountain glyphs */}
      {PROJECTED_RANGES.map((r) => (
        <RegionLabel key={r.name} x={r.x + 6} y={r.y + 10} active={active} delay={0.6}>
          {r.name}
        </RegionLabel>
      ))}
      <RegionLabel
        x={project(104, 43.6, W, H)[0]}
        y={project(104, 43.6, W, H)[1]}
        active={active}
        delay={0.7}
      >
        GOBI
      </RegionLabel>

      {/* Compass rose — settles in upper-right corner */}
      <CompassRose x={W - 28} y={28} active={active} />

      {/* ─── The route ─── */}

      <motion.path
        d={pathD}
        stroke="rgba(255, 215, 135, 0.95)"
        strokeWidth={2.4}
        strokeLinecap="round"
        fill="none"
        style={{ filter: "drop-shadow(0 0 6px rgba(201,146,42,0.9))" }}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={active ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{
          pathLength: {
            duration: PATH_DURATION,
            ease: [0.2, 0.7, 0.2, 1],
            delay: active ? PATH_START_DELAY : 0,
          },
          opacity: { duration: 0.25, delay: active ? PATH_START_DELAY : 0 },
        }}
      />

      {/* Waypoint dots + labels — tick in along the path one by one */}
      {points.map((p, i) => {
        const isStart = i === 0;
        const isEnd = i === points.length - 1;
        const dotDelay =
          PATH_START_DELAY + (i / Math.max(points.length - 1, 1)) * PATH_DURATION;
        return (
          <g key={i}>
            <motion.circle
              cx={p.x}
              cy={p.y}
              r={isEnd ? 4.4 : 3.2}
              fill={isEnd ? "rgba(255, 225, 160, 1)" : "rgba(255, 215, 135, 0.95)"}
              stroke="rgba(13,10,7,0.6)"
              strokeWidth={0.6}
              style={{
                filter: isEnd
                  ? "drop-shadow(0 0 10px rgba(201,146,42,1))"
                  : "drop-shadow(0 0 5px rgba(201,146,42,0.8))",
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={
                active
                  ? isEnd
                    ? { opacity: [0, 1, 0.9], scale: [0, 1.6, 1] }
                    : { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0 }
              }
              transition={{
                duration: isEnd ? 0.65 : 0.3,
                delay: active ? dotDelay : 0,
                ease: "easeOut",
              }}
            />
            <WaypointLabel
              x={p.x}
              y={p.y}
              align={p.x > W * 0.7 ? "right" : "left"}
              above={p.y > H * 0.7}
              active={active}
              delay={dotDelay + 0.15}
              accent={isStart || isEnd}
            >
              {p.name}
            </WaypointLabel>
          </g>
        );
      })}

      {/* Days · km label */}
      {label && (
        <motion.g
          initial={{ opacity: 0 }}
          animate={active ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.35, delay: active ? PATH_START_DELAY + PATH_DURATION : 0 }}
        >
          <rect
            x={18}
            y={H - 32}
            width={120}
            height={20}
            fill="rgba(13,10,7,0.7)"
            stroke="rgba(201,146,42,0.4)"
            strokeWidth={0.5}
          />
          <text
            x={78}
            y={H - 18}
            textAnchor="middle"
            fontSize={9}
            letterSpacing="2.4"
            fill="rgba(232,191,116,0.95)"
            style={{ fontFamily: "var(--font-accent), serif", fontStyle: "italic" }}
          >
            {label.toUpperCase()}
          </text>
        </motion.g>
      )}

      {/* Vignette */}
      <rect width={W} height={H} fill="url(#mapVignette)" pointerEvents="none" />
    </svg>
  );
}

/* ─── Smooth route path through waypoints. Slight bow so the line
   feels hand-inked, not ruler-straight. ─── */
function buildRoutePath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  if (points.length === 2) {
    const [a, b] = points;
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2 - 14;
    return `M ${a.x} ${a.y} Q ${mx} ${my}, ${b.x} ${b.y}`;
  }
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length - 1; i++) {
    const cp = points[i];
    const next = points[i + 1];
    const mx = (cp.x + next.x) / 2;
    const my = (cp.y + next.y) / 2;
    d += ` Q ${cp.x} ${cp.y}, ${mx} ${my}`;
  }
  const last = points[points.length - 1];
  d += ` T ${last.x} ${last.y}`;
  return d;
}

/* ─── Mountain glyphs — row of caret peaks ─── */
function MountainGlyphs({
  x,
  y,
  count = 3,
  delay = 0,
}: {
  x: number;
  y: number;
  count?: number;
  delay?: number;
}) {
  return (
    <g>
      {Array.from({ length: count }).map((_, i) => {
        const px = x + (i - (count - 1) / 2) * 7;
        return (
          <motion.path
            key={i}
            d={`M ${px} ${y} l 3.2 -5.5 l 3.2 5.5 Z`}
            fill="rgba(201,146,42,0.55)"
            stroke="rgba(232,191,116,0.75)"
            strokeWidth={0.4}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: delay + i * 0.05, ease: "easeOut" }}
          />
        );
      })}
    </g>
  );
}

/* ─── Italic region label ─── */
function RegionLabel({
  x,
  y,
  active,
  delay,
  children,
}: {
  x: number;
  y: number;
  active: boolean;
  delay: number;
  children: string;
}) {
  return (
    <motion.text
      x={x}
      y={y}
      textAnchor="middle"
      fontSize={6}
      letterSpacing="1.4"
      fill="rgba(168,144,112,0.75)"
      style={{ fontFamily: "var(--font-accent), serif", fontStyle: "italic" }}
      initial={{ opacity: 0 }}
      animate={active ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.4, delay: active ? delay : 0 }}
    >
      {children.toUpperCase()}
    </motion.text>
  );
}

/* ─── Waypoint label ─── */
function WaypointLabel({
  x,
  y,
  align,
  above,
  active,
  delay,
  accent,
  children,
}: {
  x: number;
  y: number;
  align: "left" | "right";
  above: boolean;
  active: boolean;
  delay: number;
  accent: boolean;
  children: string;
}) {
  const dx = align === "right" ? -7 : 7;
  const anchor = align === "right" ? "end" : "start";
  const dy = above ? -8 : 12;
  return (
    <motion.text
      x={x + dx}
      y={y + dy}
      textAnchor={anchor}
      fontSize={7.5}
      letterSpacing="0.9"
      fill={accent ? "rgba(255, 220, 150, 1)" : "rgba(232,191,116,0.85)"}
      style={{
        fontFamily: "var(--font-heading), serif",
        fontWeight: 500,
      }}
      initial={{ opacity: 0, x: x + dx + (align === "left" ? -4 : 4) }}
      animate={
        active
          ? { opacity: 1, x: x + dx }
          : { opacity: 0, x: x + dx + (align === "left" ? -4 : 4) }
      }
      transition={{ duration: 0.35, delay: active ? delay : 0, ease: "easeOut" }}
    >
      {children.toUpperCase()}
    </motion.text>
  );
}

/* ─── Compass rose ─── */
function CompassRose({
  x,
  y,
  active,
}: {
  x: number;
  y: number;
  active: boolean;
}) {
  return (
    <motion.g
      initial={{ opacity: 0, rotate: -45 }}
      animate={active ? { opacity: 1, rotate: 0 } : { opacity: 0, rotate: -45 }}
      transition={{
        rotate: { duration: 0.9, delay: active ? 0.2 : 0, ease: [0.2, 0.7, 0.2, 1] },
        opacity: { duration: 0.3, delay: active ? 0.2 : 0 },
      }}
      style={{ transformOrigin: `${x}px ${y}px` }}
    >
      <circle
        cx={x}
        cy={y}
        r={13}
        fill="rgba(13,10,7,0.7)"
        stroke="rgba(201,146,42,0.6)"
        strokeWidth={0.6}
      />
      <path
        d={`M ${x} ${y - 10} L ${x} ${y + 10} M ${x - 10} ${y} L ${x + 10} ${y}`}
        stroke="rgba(232,191,116,0.7)"
        strokeWidth={0.6}
      />
      <path
        d={`M ${x} ${y - 11} l 2 4 l -2 -1.5 l -2 1.5 Z`}
        fill="rgba(255, 220, 150, 1)"
        stroke="rgba(13,10,7,0.7)"
        strokeWidth={0.35}
      />
      <text
        x={x}
        y={y - 13}
        textAnchor="middle"
        fontSize={5}
        letterSpacing="1"
        fill="rgba(255, 220, 150, 1)"
        style={{ fontFamily: "var(--font-heading), serif", fontWeight: 600 }}
      >
        N
      </text>
    </motion.g>
  );
}
