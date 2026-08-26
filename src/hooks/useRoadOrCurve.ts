"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type L from "leaflet";

/* ────────────────────────────────────────────────────────────
   useRoadOrCurve
   Try OSRM's public driving router first — returns the real
   driving polyline through the given waypoints. If routing
   fails or takes too long, fall back to a smooth Catmull-Rom
   curve so the line still bows naturally instead of going
   ruler-straight.

   Returns { drawn, ready } so the caller can hold the
   render until geometry is finalised (avoids a curve→road
   double-animation flash).

   Used by:
   - LeafletMapPlate (single-route map per journey card / detail)
   - JourneysOverviewMap (multi-route map on /map)
   ──────────────────────────────────────────────────────────── */
export function useRoadOrCurve(positions: L.LatLngTuple[]): {
  drawn: L.LatLngTuple[];
  ready: boolean;
} {
  const [road, setRoad] = useState<L.LatLngTuple[] | null>(null);
  // Initialise ready=true for the degenerate <2-waypoint case so we
  // never synchronously call setState inside the effect body.
  const [timedOut, setTimedOut] = useState(() => positions.length < 2);
  // Sync ref of the timeout flag so the fetch's .then closure can read
  // the CURRENT value at resolve time (state closures are frozen).
  const timedOutRef = useRef(false);
  const curve = useMemo(() => smoothCurve(positions), [positions]);

  useEffect(() => {
    if (positions.length < 2) return;
    const coords = positions
      .map(([lat, lon]) => `${lon.toFixed(5)},${lat.toFixed(5)}`)
      .join(";");
    const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;
    let cancelled = false;
    const timeout = window.setTimeout(() => {
      if (cancelled) return;
      timedOutRef.current = true;
      setTimedOut(true);
    }, 1200);
    fetch(url)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        // If the fallback timeout already fired, the polyline is already
        // mid-animation drawing the curve. Swapping to road here would
        // re-mount the polyline and re-play the draw — the flicker the
        // user sees. Commit to whatever won the race.
        if (timedOutRef.current) return;
        const geom = data?.routes?.[0]?.geometry?.coordinates;
        if (Array.isArray(geom) && geom.length > 1) {
          const path: L.LatLngTuple[] = geom.map(
            ([lon, lat]: [number, number]) => [lat, lon],
          );
          setRoad(path);
        }
      })
      .catch(() => {
        /* offline / blocked / rate-limited — curve fallback fires */
      });
    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
    // positions is stable for an instance — see callers.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const drawn = road ?? curve;
  const ready = road != null || timedOut;
  return { drawn, ready };
}

/* ─── Densely-sampled Catmull-Rom curve through waypoints.
   Output is a polyline of many small segments that visually reads as
   a smooth bowed curve — far better than straight chords. ─── */
export function smoothCurve(points: L.LatLngTuple[]): L.LatLngTuple[] {
  if (points.length < 2) return points;
  if (points.length === 2) {
    const [a, b] = points;
    const mid: L.LatLngTuple = [(a[0] + b[0]) / 2 + 0.4, (a[1] + b[1]) / 2];
    return sampleQuadratic(a, mid, b, 36);
  }
  const out: L.LatLngTuple[] = [];
  out.push(points[0]);
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = i === 0 ? points[0] : points[i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i + 2 < points.length ? points[i + 2] : p2;
    const samples = 24;
    for (let s = 1; s <= samples; s++) {
      const t = s / samples;
      out.push(catmullRomPoint(p0, p1, p2, p3, t));
    }
  }
  return out;
}

function catmullRomPoint(
  p0: L.LatLngTuple,
  p1: L.LatLngTuple,
  p2: L.LatLngTuple,
  p3: L.LatLngTuple,
  t: number,
): L.LatLngTuple {
  const t2 = t * t;
  const t3 = t2 * t;
  const lat =
    0.5 *
    (2 * p1[0] +
      (-p0[0] + p2[0]) * t +
      (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 +
      (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3);
  const lon =
    0.5 *
    (2 * p1[1] +
      (-p0[1] + p2[1]) * t +
      (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 +
      (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3);
  return [lat, lon];
}

function sampleQuadratic(
  a: L.LatLngTuple,
  c: L.LatLngTuple,
  b: L.LatLngTuple,
  samples: number,
): L.LatLngTuple[] {
  const out: L.LatLngTuple[] = [];
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const lat = (1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0];
    const lon = (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1];
    out.push([lat, lon]);
  }
  return out;
}
