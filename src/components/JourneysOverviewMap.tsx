"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import L from "leaflet";
import {
  CircleMarker,
  MapContainer,
  Polyline,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import { type Journey } from "@/lib/journeys";
import { routeForJourney, type Waypoint } from "@/lib/journey-routes";
import { colorForIndex, listedJourneys } from "@/lib/journey-display";
import { smoothCurve } from "@/hooks/useRoadOrCurve";
import "leaflet/dist/leaflet.css";

/* ────────────────────────────────────────────────────────────
   JourneysOverviewMap — the /map page.

   Default state: only DESTINATIONS painted as wax-seal dots —
   a constellation of places, not nine overlapping spaghetti
   lines. When the user hovers a destination (or a list row
   on the page), that road's polyline reveals along the actual
   driving route.

   Many journeys share a destination (Bayan-Ölgii has two
   routes, etc.). We group by location so each spot is ONE
   marker — hovering it reveals every road that ends there.
   ──────────────────────────────────────────────────────────── */

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

const MONGOLIA_BOUNDS: L.LatLngBoundsExpression = [
  [41.5, 87],
  [52.3, 120],
];

type RouteRender = {
  journey: Journey;
  waypoints: Waypoint[];
  positions: L.LatLngTuple[];
  color: string;
  index: number;
};

type DestinationGroup = {
  key: string;
  position: L.LatLngTuple;
  /** Final waypoint name — what to label the marker. */
  label: string;
  /** All routes whose final waypoint sits at this position. */
  routes: RouteRender[];
};

type Props = {
  /** Set of journey slugs whose polylines should render. */
  highlightedSlugs: string[];
  /** Callback when the map's own hover changes — sync the page state. */
  onHover?: (slugs: string[]) => void;
  /** Journeys to render; falls back to the local list if not provided. */
  journeys?: Journey[];
};

export default function JourneysOverviewMap({
  highlightedSlugs,
  onHover,
  journeys,
}: Props) {
  const router = useRouter();
  const highlighted = useMemo(() => new Set(highlightedSlugs), [highlightedSlugs]);

  const routes = useMemo<RouteRender[]>(() => {
    const list = journeys && journeys.length > 0 ? journeys : listedJourneys();
    return list.map((j, i) => {
      const wp = routeForJourney(j.slug);
      return {
        journey: j,
        waypoints: wp,
        positions: wp.map((w) => [w.lat, w.lon] as L.LatLngTuple),
        color: colorForIndex(i),
        index: i,
      };
    });
  }, [journeys]);

  // Compute the initial fit bounds ONCE per route set — memoised so it
  // doesn't get a fresh array on every render (which would re-trigger
  // FitToBounds's useEffect and zoom the user back out on hover).
  const fitBounds = useMemo<L.LatLngBoundsExpression>(
    () => initialFitBounds(routes),
    [routes],
  );

  // Group routes by destination location so two journeys ending in
  // Bayan-Ölgii (or any other shared spot) collapse to ONE marker.
  const destinationGroups = useMemo<DestinationGroup[]>(() => {
    const map = new Map<string, DestinationGroup>();
    for (const r of routes) {
      const end = r.positions[r.positions.length - 1];
      // Round to 1 decimal degree (~10km) so near-coincident points cluster.
      const key = `${end[0].toFixed(1)},${end[1].toFixed(1)}`;
      const endName = r.waypoints[r.waypoints.length - 1].name;
      if (!map.has(key)) {
        map.set(key, {
          key,
          position: end,
          label: endName,
          routes: [],
        });
      }
      map.get(key)!.routes.push(r);
    }
    return Array.from(map.values());
  }, [routes]);

  return (
    <div className="absolute inset-0 leaflet-plate">
      <MapContainer
        bounds={fitBounds}
        maxBounds={MONGOLIA_BOUNDS}
        maxBoundsViscosity={1.0}
        minZoom={4}
        maxZoom={9}
        zoomControl={false}
        attributionControl={false}
        scrollWheelZoom
        className="w-full h-full bg-[#1c1108]"
      >
        <TileLayer
          url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
          subdomains={["a", "b", "c"]}
          maxZoom={10}
        />
        {/* Fit ONCE on mount — passing a stable bounds reference so we don't
            re-zoom every render. */}
        <FitToBounds bounds={fitBounds} />

        {/* Polylines — render only for highlighted routes. Mounted /
            unmounted as highlight changes so each draw animates fresh.
            Polyline also keeps the highlight alive while cursor is over
            its hit-line (so moving from marker → road doesn't flicker). */}
        {routes.map((r) =>
          highlighted.has(r.journey.slug) ? (
            <RouteLine
              key={r.journey.slug}
              route={r}
              onOpen={() => router.push(`/journeys/${r.journey.slug}`)}
              onHover={(entering) =>
                onHover?.(entering ? [r.journey.slug] : [])
              }
            />
          ) : null,
        )}

        {/* Origin dot — single shared marker at Ulaanbaatar (all journeys
            start there); always visible. */}
        {routes[0] && (
          <CircleMarker
            center={routes[0].positions[0]}
            radius={4}
            pathOptions={{
              color: "#1c1510",
              weight: 1.2,
              fillColor: "#f0e2c2",
              fillOpacity: 0.95,
            }}
            interactive={false}
          >
            <Tooltip
              permanent
              direction="bottom"
              offset={[0, 6]}
              className="route-tooltip origin-tooltip"
            >
              {routes[0].waypoints[0].name.toUpperCase()}
            </Tooltip>
          </CircleMarker>
        )}

        {/* Destination markers — one per cluster, hover reveals all routes
            ending here. */}
        {destinationGroups.map((g) => (
          <DestinationMarker
            key={g.key}
            group={g}
            active={g.routes.some((r) => highlighted.has(r.journey.slug))}
            onHover={(entering) =>
              onHover?.(entering ? g.routes.map((r) => r.journey.slug) : [])
            }
            onOpen={() => {
              if (g.routes.length === 1) {
                router.push(`/journeys/${g.routes[0].journey.slug}`);
              }
            }}
          />
        ))}
      </MapContainer>

      {/* Treatment overlays */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none mix-blend-multiply"
        style={{
          background:
            "linear-gradient(135deg, rgba(120,75,28,0.22) 0%, rgba(80,45,18,0.28) 55%, rgba(40,22,10,0.38) 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30"
        style={{
          backgroundImage: `url("${PARCHMENT_NOISE_SVG}")`,
          backgroundSize: "220px 220px",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(85% 85% at 50% 50%, rgba(0,0,0,0) 55%, rgba(13,10,7,0.5) 90%, rgba(13,10,7,0.75) 100%)",
        }}
      />

      <style jsx>{`
        :global(.leaflet-plate .leaflet-container) {
          background: #1c1108 !important;
        }
        :global(.leaflet-plate .leaflet-tile-pane) {
          filter:
            saturate(0)
            contrast(1.55)
            brightness(0.62)
            sepia(0.85)
            hue-rotate(-15deg);
          opacity: 0.92;
        }
        :global(.leaflet-plate .leaflet-overlay-pane) {
          filter: drop-shadow(0 0 6px rgba(201, 146, 42, 0.7));
        }
        :global(.leaflet-plate .leaflet-marker-pane) {
          filter: drop-shadow(0 0 4px rgba(201, 146, 42, 0.7));
        }
        :global(.leaflet-plate .leaflet-tooltip-pane) {
          z-index: 520 !important;
        }
        :global(.leaflet-plate .route-tooltip) {
          background: rgba(13, 10, 7, 0.92) !important;
          color: rgba(255, 220, 150, 1) !important;
          border: 1px solid rgba(201, 146, 42, 0.75) !important;
          padding: 4px 10px !important;
          font-family: var(--font-heading), serif !important;
          font-size: 11px !important;
          font-weight: 500 !important;
          letter-spacing: 0.16em !important;
          text-transform: uppercase;
          box-shadow: 0 0 12px rgba(201, 146, 42, 0.45) !important;
          white-space: nowrap;
        }
        :global(.leaflet-plate .route-tooltip::before) {
          display: none !important;
        }
        :global(.leaflet-plate .origin-tooltip) {
          background: rgba(13, 10, 7, 0.85) !important;
          color: rgba(232, 191, 116, 0.85) !important;
          font-size: 9px !important;
          padding: 2px 8px !important;
          letter-spacing: 0.22em !important;
        }
      `}</style>
    </div>
  );
}

/* ─── Fit to bounds on mount ─── */
function FitToBounds({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds, { padding: [40, 40], animate: false });
    map.invalidateSize();
  }, [map, bounds]);
  return null;
}

/* ─── Compute tight initial fit: just the destinations + UB origin.
   Default to the full country box only if there are no destinations. ─── */
function initialFitBounds(routes: RouteRender[]): L.LatLngBoundsExpression {
  if (routes.length === 0) return MONGOLIA_BOUNDS;
  const lats: number[] = [];
  const lons: number[] = [];
  for (const r of routes) {
    const end = r.positions[r.positions.length - 1];
    lats.push(end[0]);
    lons.push(end[1]);
  }
  // Include Ulaanbaatar (the common origin) so it stays in the frame.
  lats.push(47.92);
  lons.push(106.92);
  return [
    [Math.min(...lats) - 0.7, Math.min(...lons) - 0.7],
    [Math.max(...lats) + 0.7, Math.max(...lons) + 0.7],
  ];
}

/* ─── One highlighted route's polyline (OSRM road geometry).

   Anti-flicker structure:
   - The VISIBLE inked road is `interactive: false` so it doesn't capture
     pointer events (events pass through to the marker behind it).
   - A WIDE invisible hit-line on top catches click + mouseover/mouseout,
     so cursor moving from the marker → onto the road keeps the highlight
     alive instead of triggering mouseout-on-marker → unmount → flicker. */
function RouteLine({
  route,
  onOpen,
  onHover,
}: {
  route: RouteRender;
  onOpen: () => void;
  onHover: (entering: boolean) => void;
}) {
  // Smooth waypoint curve — NOT OSRM. Mongolian back-country has spotty
  // OSM road data, so OSRM picks weird detours (via China etc) that
  // misrepresent the charter. A Catmull-Rom curve through the actual
  // waypoints reads as a hand-inked road and stays accurate to the
  // intended path.
  const drawn = useMemo(() => smoothCurve(route.positions), [route.positions]);
  return (
    <>
      {/* Visible inked road — non-interactive */}
      <Polyline
        positions={drawn}
        pathOptions={{
          color: route.color,
          weight: 4.2,
          opacity: 1,
          lineCap: "round",
          lineJoin: "round",
        }}
        interactive={false}
      />
      {/* Wide invisible hit-line for click + hover-keep */}
      <Polyline
        positions={drawn}
        pathOptions={{ color: route.color, weight: 20, opacity: 0 }}
        eventHandlers={{
          click: onOpen,
          mouseover: () => onHover(true),
          mouseout: () => onHover(false),
        }}
      >
        <Tooltip
          sticky
          direction="top"
          offset={[0, -8]}
          className="route-tooltip"
        >
          {route.journey.title}
        </Tooltip>
      </Polyline>
    </>
  );
}

/* ─── Destination marker — clustered by location ─── */
function DestinationMarker({
  group,
  active,
  onHover,
  onOpen,
}: {
  group: DestinationGroup;
  active: boolean;
  onHover: (entering: boolean) => void;
  onOpen: () => void;
}) {
  // Color: if multi-journey cluster, blend toward neutral gold. If single,
  // use that journey's hue.
  const color = group.routes.length === 1
    ? group.routes[0].color
    : "#ffd787";
  const label =
    group.routes.length > 1
      ? `${group.label.toUpperCase()} · ${group.routes.length} ROADS`
      : group.label.toUpperCase();

  return (
    <>
      {/* Larger invisible hit-target ring for friendlier hover/click */}
      <CircleMarker
        center={group.position}
        radius={14}
        pathOptions={{ color, weight: 0, fillColor: color, fillOpacity: 0 }}
        eventHandlers={{
          click: onOpen,
          mouseover: () => onHover(true),
          mouseout: () => onHover(false),
        }}
      />
      {/* Outer ring — grows + brightens when active */}
      <CircleMarker
        center={group.position}
        radius={active ? 8 : 6}
        pathOptions={{
          color: "#1c1510",
          weight: 1.4,
          fillColor: color,
          fillOpacity: 1,
        }}
        interactive={false}
      />
      {/* Inner pip for multi-road clusters — like a sealing-wax dot inside */}
      {group.routes.length > 1 && (
        <CircleMarker
          center={group.position}
          radius={2.2}
          pathOptions={{
            color: "transparent",
            fillColor: "#1c1510",
            fillOpacity: 1,
          }}
          interactive={false}
        />
      )}
      {/* Permanent label */}
      <CircleMarker
        center={group.position}
        radius={0.1}
        pathOptions={{ opacity: 0, fillOpacity: 0 }}
        interactive={false}
      >
        <Tooltip
          permanent
          direction="top"
          offset={[0, -9]}
          className="route-tooltip"
        >
          {label}
        </Tooltip>
      </CircleMarker>
    </>
  );
}
