/* ────────────────────────────────────────────────────────────
   API client — fetches journeys / guides from the backend.

   The lib files (src/lib/journeys.ts, src/lib/guides.ts) still
   exist as the canonical TYPE source. The backend serves the
   SAME data structures, so the types line up.

   If the API is unreachable (offline dev, blocked), all
   fetchers gracefully fall back to the local lib data so the
   UI never breaks. Phase B will move both sources into a
   shared DB.
   ──────────────────────────────────────────────────────────── */

import type { Guide } from "./guides";
import { GUIDES, getGuide as getGuideLocal } from "./guides";
import type { Journey, Vehicle } from "./journeys";
import {
  JOURNEYS,
  VEHICLES,
  getJourney as getJourneyLocal,
  getVehicle as getVehicleLocal,
} from "./journeys";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function safeFetch<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      // Server-side requests can be cached; client-side should always re-fetch.
      next: { revalidate: 60 },
    });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

/* ─── Journeys ─── */

export async function fetchJourneys(): Promise<Journey[]> {
  return safeFetch<Journey[]>("/api/journeys", JOURNEYS);
}

export async function fetchJourney(slug: string): Promise<Journey | undefined> {
  // 404 is normal here — treat any non-OK as "not found", fall back to local.
  try {
    const res = await fetch(`${BASE}/api/journeys/${slug}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) return (await res.json()) as Journey;
  } catch {
    /* fall through to local */
  }
  return getJourneyLocal(slug);
}

export async function fetchVehicles(): Promise<Vehicle[]> {
  return safeFetch<Vehicle[]>("/api/journeys/vehicles", VEHICLES);
}

export async function fetchVehicle(
  id: string,
): Promise<Vehicle | undefined> {
  try {
    const res = await fetch(`${BASE}/api/journeys/vehicles/${id}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) return (await res.json()) as Vehicle;
  } catch {
    /* fall through */
  }
  // `getVehicleLocal` expects the narrow VehicleId union — cast at the boundary.
  return getVehicleLocal(id as Parameters<typeof getVehicleLocal>[0]);
}

/* ─── Guides ─── */

export async function fetchGuides(): Promise<Guide[]> {
  return safeFetch<Guide[]>("/api/guides", GUIDES);
}

export async function fetchGuide(slug: string): Promise<Guide | undefined> {
  try {
    const res = await fetch(`${BASE}/api/guides/${slug}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) return (await res.json()) as Guide;
  } catch {
    /* fall through */
  }
  return getGuideLocal(slug);
}
