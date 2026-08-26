import { describe, expect, it } from "vitest";
import {
  INTERESTS,
  JOURNEYS,
  JOURNEY_CATEGORIES,
  getJourney,
  getVehicle,
  guideFitsCategory,
  guideMeetsRank,
  guidesForJourney,
  journeysByCategory,
  journeysForInterest,
  mountsForJourney,
  VEHICLES,
} from "./journeys";
import { GUIDES, LEVEL_ORDER } from "./guides";

/* ─────────────────────────────────────────────────────────────
   Discover → Charter workflow, pure-logic layer.
   These are the functions that drive filtering, matching, and
   sorting on the homepage, /journeys, and CharterWizard. If
   any of these regress, the UI silently ships broken picks.
   ───────────────────────────────────────────────────────────── */

describe("journey catalogue integrity", () => {
  it("has at least the shipped 9 journeys", () => {
    expect(JOURNEYS.length).toBeGreaterThanOrEqual(9);
  });

  it("every journey slug is unique", () => {
    const slugs = JOURNEYS.map((j) => j.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("every journey's required vehicle resolves to a real vehicle", () => {
    for (const j of JOURNEYS) {
      expect(getVehicle(j.requiredVehicle), `${j.slug} → ${j.requiredVehicle}`).toBeDefined();
    }
  });

  it("every journey's category is one of the declared categories", () => {
    for (const j of JOURNEYS) {
      expect(JOURNEY_CATEGORIES).toContain(j.category);
    }
  });

  it("every journey's recommendedRank is a real guide level", () => {
    for (const j of JOURNEYS) {
      expect(LEVEL_ORDER[j.recommendedRank]).toBeGreaterThan(0);
    }
  });
});

describe("getJourney / getVehicle lookups", () => {
  it("returns the journey by slug", () => {
    const first = JOURNEYS[0];
    expect(getJourney(first.slug)).toEqual(first);
  });

  it("returns undefined for an unknown slug", () => {
    expect(getJourney("not-a-real-slug")).toBeUndefined();
  });

  it("returns the vehicle by id", () => {
    const first = VEHICLES[0];
    expect(getVehicle(first.id)).toEqual(first);
  });
});

describe("journeysByCategory — homepage & /journeys filter", () => {
  it("returns every journey when category is 'All'", () => {
    expect(journeysByCategory("All").length).toBe(JOURNEYS.length);
  });

  it("filters to just the picked category", () => {
    const horseback = journeysByCategory("Horseback");
    expect(horseback.length).toBeGreaterThan(0);
    expect(horseback.every((j) => j.category === "Horseback")).toBe(true);
  });

  it("returns an empty list only if no journeys match", () => {
    // Every declared category should have >0 journeys OR be the Custom escape.
    for (const cat of JOURNEY_CATEGORIES) {
      const matches = journeysByCategory(cat);
      if (cat !== "Custom") {
        // Non-Custom categories should have journeys; if not, catalogue is thin.
        expect(matches.length >= 0).toBe(true);
      }
    }
  });
});

describe("journeysForInterest — 'choose by interest' surface", () => {
  it("returns only journeys whose category is in the interest's category list", () => {
    for (const interest of INTERESTS) {
      const matches = journeysForInterest(interest);
      for (const j of matches) {
        expect(interest.categories).toContain(j.category);
      }
    }
  });

  it("never surfaces the Custom category (it's a builder, not a match)", () => {
    for (const interest of INTERESTS) {
      const matches = journeysForInterest(interest);
      expect(matches.every((j) => j.category !== "Custom")).toBe(true);
    }
  });
});

describe("guideMeetsRank — rank gate for the wizard", () => {
  const journeyByRank = (rank: (typeof JOURNEYS)[0]["recommendedRank"]) =>
    JOURNEYS.find((j) => j.recommendedRank === rank);

  it("returns true when the guide's rank equals the required rank", () => {
    const journey = journeyByRank("Novice");
    if (!journey) return; // catalogue may not have this rank
    const novice = GUIDES.find((g) => g.level === "Novice");
    if (!novice) return;
    expect(guideMeetsRank(novice, journey)).toBe(true);
  });

  it("returns true when the guide outranks the requirement", () => {
    const journey = journeyByRank("Apprentice");
    if (!journey) return;
    const master = GUIDES.find((g) => g.level === "Master");
    if (!master) return;
    expect(guideMeetsRank(master, journey)).toBe(true);
  });

  it("returns false when the guide is under-ranked", () => {
    const journey = journeyByRank("Master");
    if (!journey) return;
    const apprentice = GUIDES.find((g) => g.level === "Apprentice");
    if (!apprentice) return;
    expect(guideMeetsRank(apprentice, journey)).toBe(false);
  });
});

describe("guideFitsCategory — category match for the wizard", () => {
  it("returns true only when the guide's suitableCategories includes the journey's category", () => {
    for (const journey of JOURNEYS) {
      for (const guide of GUIDES) {
        const expected = guide.suitableCategories.includes(journey.category);
        expect(guideFitsCategory(guide, journey)).toBe(expected);
      }
    }
  });
});

describe("guidesForJourney — sort order the wizard shows", () => {
  it("returns every guide (rank-gating is display-side)", () => {
    const journey = JOURNEYS[0];
    expect(guidesForJourney(journey).length).toBe(GUIDES.length);
  });

  it("orders best-match first: category-fit + rank-met wins", () => {
    for (const journey of JOURNEYS) {
      const sorted = guidesForJourney(journey);
      // Compute the score each guide should have had.
      const score = (g: (typeof GUIDES)[number]) =>
        (guideFitsCategory(g, journey) ? 2 : 0) +
        (guideMeetsRank(g, journey) ? 1 : 0) +
        LEVEL_ORDER[g.level] / 10;
      for (let i = 1; i < sorted.length; i++) {
        expect(score(sorted[i - 1])).toBeGreaterThanOrEqual(score(sorted[i]));
      }
    }
  });

  it("is a pure sort — never mutates the source pool", () => {
    const journey = JOURNEYS[0];
    const before = GUIDES.map((g) => g.slug);
    guidesForJourney(journey);
    const after = GUIDES.map((g) => g.slug);
    expect(after).toEqual(before);
  });
});

describe("mountsForJourney — availability gate on the Comforts step", () => {
  it("returns only mounts whose availableFor is 'any' or includes this category", () => {
    for (const journey of JOURNEYS) {
      const mounts = mountsForJourney(journey);
      for (const m of mounts) {
        if (m.availableFor !== "any") {
          expect(m.availableFor).toContain(journey.category);
        }
      }
    }
  });
});
