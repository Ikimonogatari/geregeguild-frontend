/* ────────────────────────────────────────────────────────────
   Journey draft — Phase A
   The shape of a charter the user is assembling.

   Persisted client-side only (localStorage). Phase B will move
   this server-side under a real user account; this module owns
   the schema so that migration stays a swap, not a rewrite.
   ──────────────────────────────────────────────────────────── */

import type {
  AccommodationStyle,
  DietaryPreference,
  MountId,
  VehicleId,
} from "./journeys";

export type GuideRole = "Lead" | "Trainee";

export type DraftStatus = "Draft" | "Pending" | "Confirmed";

export type JourneyDraft = {
  /** journey slug — the road. */
  journey: string;
  /** vehicle chosen for the road. */
  vehicleId: VehicleId | null;
  /** guide chosen + their role on this charter. */
  guideSlug: string | null;
  guideRole: GuideRole;
  /** how many patrons ride this charter. */
  travelers: number;
  /** shared group lodging vs private rooms / separate gers. */
  accommodation: AccommodationStyle;
  /** diet selection + optional designated cook flag. */
  diet: DietaryPreference;
  /** free-text notes if diet === "Other". */
  dietNotes: string;
  designatedCook: boolean;
  /** optional mount (horse/yak) where the country allows it. */
  mount: MountId;
  /** custom client requests (free-text). May incur fees. */
  specialRequirements: string;
  /** patron contact, kept for "Send a Raven" until real auth lands. */
  contact: {
    name: string;
    email: string;
    dates: string;
  };
  /** lifecycle. Phase A only writes "Draft" — Pending/Confirmed are
   *  reserved for when payments are wired. */
  status: DraftStatus;
  /** ms-since-epoch. We use this to drive Phase A's "started at"
   *  display + Phase B's 7-day server-side expiry. */
  createdAt: number;
  updatedAt: number;
};

/** A fresh, empty draft for a given journey. */
export function emptyDraft(journey: string): JourneyDraft {
  const now = Date.now();
  return {
    journey,
    vehicleId: null,
    guideSlug: null,
    guideRole: "Lead",
    travelers: 2,
    accommodation: "Group",
    diet: "Standard",
    dietNotes: "",
    designatedCook: false,
    mount: "None",
    specialRequirements: "",
    contact: { name: "", email: "", dates: "" },
    status: "Draft",
    createdAt: now,
    updatedAt: now,
  };
}

/* ─── localStorage persistence ─── */

const KEY = "gerege_draft_v1";

/** Read the active draft for the given journey slug, if any. */
export function loadDraft(journey: string): JourneyDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const all = JSON.parse(raw) as Record<string, JourneyDraft>;
    const found = all[journey];
    return found ?? null;
  } catch {
    return null;
  }
}

/** Save (upsert) a draft. */
export function saveDraft(draft: JourneyDraft): void {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(KEY);
    const all: Record<string, JourneyDraft> = raw ? JSON.parse(raw) : {};
    all[draft.journey] = { ...draft, updatedAt: Date.now() };
    window.localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* quota or private mode — silent fail; UX still works in-memory. */
  }
}

/** Drop a draft (e.g. after sending a raven). */
export function clearDraft(journey: string): void {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return;
    const all = JSON.parse(raw) as Record<string, JourneyDraft>;
    delete all[journey];
    window.localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* silent */
  }
}

/** All active drafts — Phase B will use this for the profile page. */
export function listDrafts(): JourneyDraft[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const all = JSON.parse(raw) as Record<string, JourneyDraft>;
    return Object.values(all).sort((a, b) => b.updatedAt - a.updatedAt);
  } catch {
    return [];
  }
}

/* ─── Draft completeness — drives the Summary CTA state ─── */

export type DraftCompleteness = {
  /** Every selection the wizard cares about has a value. */
  ready: boolean;
  /** Human-friendly list of what's still missing. */
  missing: string[];
};

export function checkDraft(d: JourneyDraft): DraftCompleteness {
  const missing: string[] = [];
  if (!d.vehicleId) missing.push("Vehicle");
  if (!d.guideSlug) missing.push("Guide");
  if (d.travelers < 1) missing.push("Number of travelers");
  if (d.diet === "Other" && !d.dietNotes.trim()) missing.push("Dietary notes");
  if (!d.contact.name.trim()) missing.push("Your name");
  if (!d.contact.email.trim()) missing.push("Your email");
  return { ready: missing.length === 0, missing };
}
