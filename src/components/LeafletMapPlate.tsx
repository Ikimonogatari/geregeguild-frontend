"use client";

import { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import L from "leaflet";
import { useRoadOrCurve } from "@/hooks/useRoadOrCurve";
import {
  CircleMarker,
  MapContainer,
  Polyline,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import type { Waypoint } from "@/lib/journey-routes";
import "leaflet/dist/leaflet.css";

/* ────────────────────────────────────────────────────────────
   LeafletMapPlate — real OSM-based map tiles, treated to look
   like an inked map drawn on parchment. Positron Light tiles
   give us only the road/border outlines (minimal colour to
   fight with); a stack of overlays then carries the warm
   Bag-End palette: parchment grain noise, ember vignette,
   gold ornate frame, wax-seal waypoint markers, inked route
   with drop-shadow glow.

   The route is a real Leaflet Polyline through real lat/lon;
   waypoints sit at their actual geographic coordinates.
   ──────────────────────────────────────────────────────────── */

type Props = {
  route: Waypoint[];
  /** Days/km stamp at the bottom-left, e.g. "8 DAYS · 240 KM". */
  label?: string;
  /** Journey title shown across the parchment ribbon at the top. */
  title?: string;
};

// Hard viewport clamp — the user can never pan or zoom out past
// Mongolia. Tight box including a little headroom for the route polyline.
const MONGOLIA_MAX_BOUNDS: L.LatLngBoundsExpression = [
  [40.5, 85],
  [53.5, 122],
];

// Parchment grain — matches the SVG noise used in body::before so the
// map's paper texture continues the page's paper texture.
const PARCHMENT_NOISE_SVG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'>
      <filter id='n'>
        <feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/>
        <feColorMatrix values='0 0 0 0 0.78  0 0 0 0 0.62  0 0 0 0 0.36  0 0 0 0.65 0'/>
      </filter>
      <rect width='100%' height='100%' filter='url(#n)'/>
    </svg>`,
  );

export default function LeafletMapPlate({ route, label, title }: Props) {
  const positions = useMemo<L.LatLngTuple[]>(
    () => route.map((w) => [w.lat, w.lon]),
    [route],
  );
  // Real road geometry (OSRM) when available, smooth curve fallback otherwise.
  const { drawn, ready } = useRoadOrCurve(positions);

  // Fit bounds to whatever geometry is on screen — when the road arrives,
  // we refit to its actual bounding box so the whole route is visible.
  const bounds = useMemo<L.LatLngBoundsExpression>(() => {
    const source = drawn.length >= 2 ? drawn : positions;
    const lats = source.map((p) => p[0]);
    const lons = source.map((p) => p[1]);
    const pad = 0.55; // tight — was 1.6, way too zoomed out
    return [
      [Math.min(...lats) - pad, Math.min(...lons) - pad],
      [Math.max(...lats) + pad, Math.max(...lons) + pad],
    ];
  }, [drawn, positions]);

  return (
    <div className="absolute inset-0 leaflet-plate">
      <MapContainer
        bounds={bounds}
        // Hard-clamp the viewport to Mongolia — even if drag were enabled
        // the user could never pan or zoom out past the country.
        maxBounds={MONGOLIA_MAX_BOUNDS}
        maxBoundsViscosity={1.0}
        minZoom={4}
        zoomControl={false}
        attributionControl={false}
        dragging={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        boxZoom={false}
        keyboard={false}
        touchZoom={false}
        className="w-full h-full bg-[#2a1d10]"
      >
        {/* OpenTopoMap — terrain shading, contour lines, mountain peaks.
            Inherently more chart-like than road-network tiles, which means
            our sepia treatment doesn't have to fight a modern road grid. */}
        <TileLayer
          url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
          subdomains={["a", "b", "c"]}
          maxZoom={10}
        />
        <FitOnRouteChange bounds={bounds} />
        {/* Only draw once geometry is finalised — prevents the curve→road
            flash when OSRM resolves mid-animation. */}
        {ready && <DrawAnimatedPolyline positions={drawn} />}
        {positions.map((p, i) => {
          const isEnd = i === positions.length - 1;
          const isStart = i === 0;
          return (
            <WaxSealMarker
              key={i}
              center={p}
              isEnd={isEnd}
              isStart={isStart}
              name={route[i].name}
            />
          );
        })}
      </MapContainer>

      {/* ── Treatment layers — applied above the tiles ── */}

      {/* 1. Warm parchment wash — lighter so the topographic relief shading
          and contour lines read through as faint engraved detail */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none mix-blend-multiply"
        style={{
          background:
            "linear-gradient(135deg, rgba(120,75,28,0.28) 0%, rgba(80,45,18,0.34) 55%, rgba(40,22,10,0.45) 100%)",
        }}
      />

      {/* 2. Parchment grain — heavier so the paper has real texture */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-75"
        style={{
          backgroundImage: `url("${PARCHMENT_NOISE_SVG}")`,
          backgroundSize: "180px 180px",
        }}
      />

      {/* 2b. Coffee-stain blotches — irregular dark patches like aged paper */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-60"
        style={{
          background:
            "radial-gradient(28% 22% at 18% 80%, rgba(40,22,10,0.55), transparent 65%)," +
            "radial-gradient(22% 18% at 88% 22%, rgba(40,22,10,0.5), transparent 70%)," +
            "radial-gradient(15% 12% at 70% 90%, rgba(40,22,10,0.45), transparent 70%)",
        }}
      />

      {/* 3. Ember vignette — burnishes the edges hard, focuses the centre */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(70% 70% at 50% 50%, rgba(0,0,0,0) 35%, rgba(13,10,7,0.6) 80%, rgba(13,10,7,0.95) 100%)",
        }}
      />

      {/* 3b. Subtle inner ember glow — a candle behind the paper */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none mix-blend-screen opacity-30"
        style={{
          background:
            "radial-gradient(35% 35% at 50% 50%, rgba(201,146,42,0.35), transparent 75%)",
        }}
      />

      {/* 4. Ornate scroll frame — double rule + curlicue corner brackets */}
      <div aria-hidden className="absolute inset-0 pointer-events-none border border-accent/55" />
      <div aria-hidden className="absolute inset-1.5 pointer-events-none border border-accent/25" />
      <CornerFlourishes />

      {/* 5. Title — fish-tail banner across the top of the parchment */}
      {title && <TitleBanner title={title} />}

      {/* 6. Days · km — wax-seal medallion in the bottom corner */}
      {label && <WaxSealMedallion label={label} />}

      {/* 8. Foot mark — a delicate signature line at the very bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.1 }}
        className="absolute left-1/2 -translate-x-1/2 bottom-1.5 z-[400] flex items-center gap-2 font-accent italic text-accent/55 text-[8px] tracking-[0.45em] uppercase pointer-events-none"
      >
        <span>✦</span>
        <span>Drawn by the Guild</span>
        <span>✦</span>
      </motion.div>

      {/* Plate-local CSS — push tiles toward aged ink-on-parchment WITHOUT
          touching the route/waypoint SVG (which lives in overlay-pane). The
          filter is scoped to tile-pane only so the ember route stays bright
          on top of the treated tiles. */}
      <style jsx>{`
        :global(.leaflet-plate .leaflet-container) {
          background: #1c1108 !important;
        }
        :global(.leaflet-plate .leaflet-tile-pane) {
          /* Aged-chart treatment for OpenTopoMap — turn its forest greens
             + blue water + relief shading into burnt umber + sepia ink.
             Contour lines come through as faint topographic strokes. */
          filter:
            saturate(0)
            contrast(1.55)
            brightness(0.62)
            sepia(0.85)
            hue-rotate(-15deg);
          opacity: 0.92;
        }
        :global(.leaflet-plate .leaflet-tile) {
          will-change: opacity;
        }
        /* Route + waypoint SVG — bright, glowing, untreated */
        :global(.leaflet-plate .leaflet-overlay-pane) {
          z-index: 500 !important;
          filter: drop-shadow(0 0 7px rgba(201, 146, 42, 0.95));
        }
        :global(.leaflet-plate .leaflet-marker-pane) {
          z-index: 510 !important;
          filter: drop-shadow(0 0 5px rgba(201, 146, 42, 0.8));
        }
        :global(.leaflet-plate .leaflet-tooltip-pane) {
          z-index: 520 !important;
        }
        /* Waypoint label — Cinzel small caps over the parchment, no default
           Leaflet white box / arrow. */
        :global(.leaflet-plate .waypoint-tooltip) {
          background: rgba(13, 10, 7, 0.78) !important;
          color: rgba(232, 191, 116, 0.95) !important;
          border: 1px solid rgba(201, 146, 42, 0.5) !important;
          padding: 2px 7px !important;
          font-family: var(--font-heading), serif !important;
          font-size: 9.5px !important;
          font-weight: 500 !important;
          letter-spacing: 0.12em !important;
          box-shadow: 0 0 8px rgba(201, 146, 42, 0.35) !important;
          white-space: nowrap;
        }
        :global(.leaflet-plate .waypoint-tooltip.is-end) {
          color: rgba(255, 225, 160, 1) !important;
          border-color: rgba(201, 146, 42, 0.85) !important;
          background: rgba(13, 10, 7, 0.92) !important;
        }
        :global(.leaflet-plate .waypoint-tooltip::before) {
          display: none !important;
        }
      `}</style>
    </div>
  );
}

/* ─── Refit bounds whenever the route changes ─── */
function FitOnRouteChange({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    // Tighter padding so the route fills the plate with minimal empty edge.
    map.fitBounds(bounds, { padding: [10, 10], animate: false });
    map.invalidateSize();
  }, [map, bounds]);
  return null;
}

/* ─── Inked polyline — DOM-driven stroke-dash draw, no React state. ─── */
function DrawAnimatedPolyline({ positions }: { positions: L.LatLngTuple[] }) {
  const ref = useRef<L.Polyline | null>(null);

  useEffect(() => {
    const poly = ref.current;
    if (!poly) return;
    const el = poly.getElement() as SVGPathElement | null;
    if (!el) return;
    const total = el.getTotalLength?.() ?? 1000;
    el.style.strokeDasharray = `${total}`;
    el.style.strokeDashoffset = `${total}`;
    const t0 = performance.now();
    const dur = 1600;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      el.style.strokeDashoffset = `${total * (1 - eased)}`;
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [positions]);

  return (
    <Polyline
      ref={ref}
      positions={positions}
      pathOptions={{
        color: "#ffd787",
        weight: 3.2,
        opacity: 1,
        lineCap: "round",
        lineJoin: "round",
      }}
    />
  );
}

/* ─── Wax-seal waypoint — outer dark ring, ember fill, glow at the end ─── */
function WaxSealMarker({
  center,
  isEnd,
  isStart,
  name,
}: {
  center: L.LatLngTuple;
  isEnd: boolean;
  isStart: boolean;
  name: string;
}) {
  return (
    <>
      {/* Outer dark ring — the seal's edge */}
      <CircleMarker
        center={center}
        radius={isEnd ? 8 : 6}
        pathOptions={{
          color: "#1c1510",
          weight: 1.4,
          fillColor: "#3a2614",
          fillOpacity: 1,
        }}
      />
      {/* Ember-fill core */}
      <CircleMarker
        center={center}
        radius={isEnd ? 5 : 3.5}
        pathOptions={{
          color: "#8B5E3C",
          weight: 0.8,
          fillColor: isEnd ? "#ffe1a0" : "#ffd787",
          fillOpacity: 1,
        }}
      >
        {/* Permanent waypoint label — the place name floats next to the seal */}
        <Tooltip
          permanent
          direction="top"
          offset={[0, -8]}
          className={[
            "waypoint-tooltip",
            isStart && "is-start",
            isEnd && "is-end",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {name.toUpperCase()}
        </Tooltip>
      </CircleMarker>
      {/* Bright pip at the very centre — destination only */}
      {isEnd && (
        <CircleMarker
          center={center}
          radius={1.6}
          pathOptions={{
            color: "transparent",
            fillColor: "#fff7df",
            fillOpacity: 1,
          }}
        />
      )}
    </>
  );
}

/* ──────────────────────────────────────────────────────────
   Decorative pieces — each rendered as inline SVG so they sit
   crisp at any size and stay free of raster artefacts.
   ────────────────────────────────────────────────────────── */

/* Curlicue scroll-corner ornaments — one per corner, mirrored. */
function CornerFlourishes() {
  return (
    <>
      {(
        [
          { className: "top-0 left-0", rotate: 0 },
          { className: "top-0 right-0", rotate: 90 },
          { className: "bottom-0 right-0", rotate: 180 },
          { className: "bottom-0 left-0", rotate: 270 },
        ] as const
      ).map((p, i) => (
        <svg
          key={i}
          aria-hidden
          viewBox="0 0 32 32"
          className={`absolute ${p.className} pointer-events-none w-7 h-7 z-[401]`}
          style={{ transform: `rotate(${p.rotate}deg)` }}
        >
          {/* Curlicue: an L-bracket with a small inward curl */}
          <path
            d="M 4 14 Q 4 4, 14 4 M 4 14 L 4 11 M 14 4 L 11 4 M 9 9 q 3 0, 3 3"
            fill="none"
            stroke="rgba(232,191,116,0.85)"
            strokeWidth={1}
            strokeLinecap="round"
          />
          {/* Tiny accent dot */}
          <circle cx={5} cy={5} r={1.2} fill="rgba(255,220,150,0.95)" />
        </svg>
      ))}
    </>
  );
}

/* Fish-tail banner — proper unfurled banner shape with notched ends */
function TitleBanner({ title }: { title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scaleX: 0.6 }}
      animate={{ opacity: 1, y: 0, scaleX: 1 }}
      transition={{ duration: 0.6, delay: 0.25, ease: [0.2, 0.7, 0.2, 1] }}
      className="absolute left-1/2 -translate-x-1/2 top-2 z-[402] max-w-[82%]"
      style={{ filter: "drop-shadow(0 2px 10px rgba(13,10,7,0.7))" }}
    >
      <div
        className="relative bg-background/90 border-y border-accent/60 ember-glow"
        style={{
          clipPath:
            "polygon(0% 50%, 4% 0%, 96% 0%, 100% 50%, 96% 100%, 4% 100%)",
          padding: "6px 28px",
        }}
      >
        <p className="font-heading uppercase tracking-[0.2em] text-foreground text-[11px] sm:text-[12px] text-center whitespace-nowrap overflow-hidden text-ellipsis">
          <span className="text-accent mr-2">✦</span>
          {title}
          <span className="text-accent ml-2">✦</span>
        </p>
      </div>
    </motion.div>
  );
}

/* Wax-seal medallion — octagonal stamp with inner ember + label */
function WaxSealMedallion({ label }: { label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 0.55, delay: 1.0, ease: [0.2, 0.7, 0.2, 1] }}
      className="absolute left-3 bottom-4 z-[402]"
      style={{ filter: "drop-shadow(0 3px 10px rgba(13,10,7,0.75))" }}
    >
      <div
        className="relative bg-background border-2 border-accent ember-glow px-5 py-2.5"
        style={{
          clipPath:
            "polygon(15% 0%, 85% 0%, 100% 30%, 100% 70%, 85% 100%, 15% 100%, 0% 70%, 0% 30%)",
        }}
      >
        <span className="block font-heading text-foreground text-[12px] sm:text-[13px] tracking-[0.22em] uppercase whitespace-nowrap">
          {label}
        </span>
      </div>
    </motion.div>
  );
}
