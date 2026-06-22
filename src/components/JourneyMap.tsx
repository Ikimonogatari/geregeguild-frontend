"use client";

import dynamic from "next/dynamic";
import type { Journey } from "@/lib/journeys";
import { routeForJourney } from "@/lib/journey-routes";

/* ────────────────────────────────────────────────────────────
   JourneyMap — server-page-friendly wrapper for LeafletMapPlate.

   The detail page (`/journeys/[slug]`) is a Server Component, so
   it can't directly use `next/dynamic({ ssr: false })`. This thin
   client wrapper does the dynamic import here and exposes a
   simple `{ journey }` prop the server page can render.

   Unlike the card hover, here the map is always mounted (the
   patron is on the detail page to read the road).
   ──────────────────────────────────────────────────────────── */

const LeafletMapPlate = dynamic(() => import("./LeafletMapPlate"), {
  ssr: false,
  loading: () => null,
});

export default function JourneyMap({ journey }: { journey: Journey }) {
  const route = routeForJourney(journey.slug);
  const label = `${journey.days} days · ${journey.distanceKm} km`;
  return (
    <div className="absolute inset-0">
      <LeafletMapPlate route={route} label={label} title={journey.title} />
    </div>
  );
}
