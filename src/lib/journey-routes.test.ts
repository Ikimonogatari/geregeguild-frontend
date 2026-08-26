import { describe, expect, it } from "vitest";
import { DEFAULT_ROUTE, JOURNEY_ROUTES, routeForJourney } from "./journey-routes";
import { JOURNEYS } from "./journeys";

/* ─────────────────────────────────────────────────────────────
   Route lookup — drives every journey card's hover map and the
   detail-page route polyline. If a slug loses its route the
   card silently falls back to a generic line.
   ───────────────────────────────────────────────────────────── */

describe("routeForJourney", () => {
  it("returns the mapped route for a known slug", () => {
    const r = routeForJourney("khentii-horse-road");
    expect(r).toBe(JOURNEY_ROUTES["khentii-horse-road"]);
    expect(r.length).toBeGreaterThanOrEqual(2);
  });

  it("falls back to DEFAULT_ROUTE for an unknown slug", () => {
    expect(routeForJourney("does-not-exist")).toBe(DEFAULT_ROUTE);
  });
});

describe("route coverage", () => {
  it("every non-Custom shipped journey has an explicit route (no silent fallback)", () => {
    for (const j of JOURNEYS) {
      if (j.category === "Custom") continue;
      expect(
        JOURNEY_ROUTES[j.slug],
        `${j.slug} (${j.category}) is missing a route`,
      ).toBeDefined();
    }
  });

  it("every waypoint has real lon/lat and a name", () => {
    for (const route of Object.values(JOURNEY_ROUTES)) {
      for (const wp of route) {
        expect(typeof wp.name).toBe("string");
        expect(wp.name.length).toBeGreaterThan(0);
        // Mongolia sits roughly within these bounds.
        expect(wp.lat).toBeGreaterThan(40);
        expect(wp.lat).toBeLessThan(54);
        expect(wp.lon).toBeGreaterThan(85);
        expect(wp.lon).toBeLessThan(120);
      }
    }
  });

  it("every route has at least 2 waypoints (a polyline needs both ends)", () => {
    for (const [slug, route] of Object.entries(JOURNEY_ROUTES)) {
      expect(route.length, `${slug}`).toBeGreaterThanOrEqual(2);
    }
  });
});
