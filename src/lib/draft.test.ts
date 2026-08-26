import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  checkDraft,
  clearDraft,
  emptyDraft,
  listDrafts,
  loadDraft,
  saveDraft,
  type JourneyDraft,
} from "./draft";

/* ─────────────────────────────────────────────────────────────
   Charter draft workflow — the state the wizard persists as
   the user picks vehicle → guide → comforts → contact. Runs
   under jsdom so window.localStorage is available.
   ───────────────────────────────────────────────────────────── */

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  window.localStorage.clear();
});

describe("emptyDraft", () => {
  it("initialises with the journey slug and safe defaults", () => {
    const d = emptyDraft("khentii-horse-road");
    expect(d.journey).toBe("khentii-horse-road");
    expect(d.vehicleId).toBeNull();
    expect(d.guideSlug).toBeNull();
    expect(d.travelers).toBeGreaterThan(0);
    expect(d.status).toBe("Draft");
    expect(d.createdAt).toBe(d.updatedAt);
  });

  it("returns a fresh object each call (no shared state)", () => {
    const a = emptyDraft("a");
    const b = emptyDraft("b");
    expect(a).not.toBe(b);
    expect(a.contact).not.toBe(b.contact);
  });
});

describe("saveDraft / loadDraft round-trip", () => {
  it("persists and restores a draft under its journey slug", () => {
    const original = emptyDraft("altai-offroad-traverse");
    original.vehicleId = "land-cruiser";
    original.guideSlug = "vanya";
    saveDraft(original);
    const loaded = loadDraft("altai-offroad-traverse");
    expect(loaded).not.toBeNull();
    expect(loaded?.vehicleId).toBe("land-cruiser");
    expect(loaded?.guideSlug).toBe("vanya");
  });

  it("bumps updatedAt on every save", async () => {
    const d = emptyDraft("j");
    saveDraft(d);
    const first = loadDraft("j")?.updatedAt;
    // Wait one ms so Date.now() ticks forward on fast machines.
    await new Promise((r) => setTimeout(r, 2));
    saveDraft(d);
    const second = loadDraft("j")?.updatedAt;
    expect(second).toBeGreaterThan(first!);
  });

  it("returns null for an unknown journey", () => {
    expect(loadDraft("does-not-exist")).toBeNull();
  });

  it("keeps drafts for different journeys isolated", () => {
    const a = emptyDraft("a");
    a.travelers = 5;
    const b = emptyDraft("b");
    b.travelers = 2;
    saveDraft(a);
    saveDraft(b);
    expect(loadDraft("a")?.travelers).toBe(5);
    expect(loadDraft("b")?.travelers).toBe(2);
  });
});

describe("clearDraft", () => {
  it("removes only the named draft, leaves the rest", () => {
    saveDraft(emptyDraft("a"));
    saveDraft(emptyDraft("b"));
    clearDraft("a");
    expect(loadDraft("a")).toBeNull();
    expect(loadDraft("b")).not.toBeNull();
  });

  it("is a no-op for an unknown slug (no throw)", () => {
    expect(() => clearDraft("does-not-exist")).not.toThrow();
  });
});

describe("listDrafts", () => {
  it("returns all drafts sorted by most-recently-updated first", async () => {
    const a = emptyDraft("a");
    saveDraft(a);
    await new Promise((r) => setTimeout(r, 2));
    saveDraft(emptyDraft("b"));
    const list = listDrafts();
    expect(list.length).toBe(2);
    expect(list[0].journey).toBe("b");
    expect(list[1].journey).toBe("a");
  });

  it("returns an empty list when no drafts exist", () => {
    expect(listDrafts()).toEqual([]);
  });
});

describe("checkDraft — Summary CTA gate", () => {
  const withAll = (): JourneyDraft => {
    const d = emptyDraft("j");
    d.vehicleId = "land-cruiser";
    d.guideSlug = "vanya";
    d.contact = { name: "Test", email: "t@example.com", dates: "August" };
    return d;
  };

  it("reports ready when every required field is set", () => {
    const r = checkDraft(withAll());
    expect(r.ready).toBe(true);
    expect(r.missing).toEqual([]);
  });

  it("flags a missing vehicle", () => {
    const d = withAll();
    d.vehicleId = null;
    const r = checkDraft(d);
    expect(r.ready).toBe(false);
    expect(r.missing).toContain("Vehicle");
  });

  it("flags a missing guide", () => {
    const d = withAll();
    d.guideSlug = null;
    const r = checkDraft(d);
    expect(r.missing).toContain("Guide");
  });

  it("flags a missing name", () => {
    const d = withAll();
    d.contact.name = "";
    expect(checkDraft(d).missing).toContain("Your name");
  });

  it("flags a missing email", () => {
    const d = withAll();
    d.contact.email = "";
    expect(checkDraft(d).missing).toContain("Your email");
  });

  it("only requires dietary notes when diet === 'Other'", () => {
    const d = withAll();
    d.diet = "Other";
    d.dietNotes = "";
    expect(checkDraft(d).missing).toContain("Dietary notes");
    d.dietNotes = "no dairy";
    expect(checkDraft(d).missing).not.toContain("Dietary notes");
  });

  it("flags a zero-traveler draft", () => {
    const d = withAll();
    d.travelers = 0;
    expect(checkDraft(d).missing).toContain("Number of travelers");
  });
});
