"use client";

/* ────────────────────────────────────────────────────────────
   Customer-side tracking. The public site has no auth, so we
   remember submitted charters in localStorage so the user can
   open /charter/me and see them all, and so we know which
   email to query for customer notifications.

   Storage shape (key "gg_my_charters"):
     { email: string; entries: { id: string; journeyTitle: string; submittedAt: string }[] }
   ──────────────────────────────────────────────────────────── */

const KEY = "gg_my_charters";

export type Tracked = {
  email: string;
  entries: { id: string; journeyTitle: string; submittedAt: string }[];
};

export function readTracking(): Tracked {
  if (typeof window === "undefined") return { email: "", entries: [] };
  const raw = window.localStorage.getItem(KEY);
  if (!raw) return { email: "", entries: [] };
  try {
    return JSON.parse(raw) as Tracked;
  } catch {
    return { email: "", entries: [] };
  }
}

export function rememberCharter(id: string, journeyTitle: string, email: string) {
  if (typeof window === "undefined") return;
  const cur = readTracking();
  // Last submission wins for the email pointer (so the bell follows the most
  // recent identity the user has used).
  const next: Tracked = {
    email: email || cur.email,
    entries: [
      { id, journeyTitle, submittedAt: new Date().toISOString() },
      ...cur.entries.filter((e) => e.id !== id),
    ].slice(0, 50),
  };
  window.localStorage.setItem(KEY, JSON.stringify(next));
}

export function forgetCharter(id: string) {
  const cur = readTracking();
  const next: Tracked = { ...cur, entries: cur.entries.filter((e) => e.id !== id) };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  }
}
