/* ────────────────────────────────────────────────────────────
   Intent — what the patron came for, in four dimensions.
   Drives the recommendations on /discover.

   A single interest tag ("I want to ride horses") is not enough
   to characterise a charter. Pace, season, and party size all
   matter — the same theme can mean a gentle summer week or a
   hard winter expedition. This module captures that intent and
   scores every Journey against it.
   ──────────────────────────────────────────────────────────── */

import type { Difficulty, Interest, Journey } from "./journeys";
import { INTERESTS } from "./journeys";
import { LEVEL_ORDER } from "./guides";

export type Pace = Difficulty | "any";
export type Season = "summer" | "autumn" | "winter" | "spring" | "any";
export type Party = "solo" | "pair" | "small" | "family" | "large";

export type IntentDraft = {
  themes: string[]; // Interest ids
  pace: Pace;
  season: Season;
  party: Party;
};

export const EMPTY_INTENT: IntentDraft = {
  themes: [],
  pace: "any",
  season: "any",
  party: "pair",
};

/* ─── Pace options ─── */

export const PACE_OPTIONS: {
  id: Pace;
  label: string;
  blurb: string;
  sigil: string;
}[] = [
  {
    id: "any",
    label: "Any pace",
    blurb: "Show me roads of all grades — let the country choose.",
    sigil: "✦",
  },
  {
    id: "Apprentice",
    label: "Gentle",
    blurb: "A soft first meeting. Short days, easy ground.",
    sigil: "I",
  },
  {
    id: "Novice",
    label: "Honest miles",
    blurb: "Real days on the road. Nothing that bites.",
    sigil: "II",
  },
  {
    id: "Master",
    label: "Hard",
    blurb: "Distance and weather. The country asks something back.",
    sigil: "III",
  },
  {
    id: "Guildmaster",
    label: "Expedition",
    blurb: "Cold, remote, and not to be taken lightly.",
    sigil: "IV",
  },
];

/* ─── Season options ─── */

export const SEASON_OPTIONS: {
  id: Season;
  label: string;
  blurb: string;
  sigil: string;
  months: number[];
}[] = [
  {
    id: "any",
    label: "Any season",
    blurb: "The country is four countries — show me what fits when.",
    sigil: "✦",
    months: [],
  },
  {
    id: "summer",
    label: "Summer green",
    blurb: "Long days, full rivers, the steppe at its softest.",
    sigil: "☉",
    months: [6, 7, 8],
  },
  {
    id: "autumn",
    label: "Autumn gold",
    blurb: "Larch turns. Cooler air, eagle festival, quieter roads.",
    sigil: "❂",
    months: [9, 10],
  },
  {
    id: "winter",
    label: "Winter blue",
    blurb: "Frozen Khövsgöl, blue silence, the hardest light.",
    sigil: "❅",
    months: [12, 1, 2, 3],
  },
  {
    id: "spring",
    label: "Spring melt",
    blurb: "New foals, returning herders, soft ground.",
    sigil: "✾",
    months: [4, 5],
  },
];

/* ─── Party options ─── */

export const PARTY_OPTIONS: {
  id: Party;
  label: string;
  blurb: string;
  sigil: string;
}[] = [
  { id: "solo", label: "Just me", blurb: "A single patron on the road.", sigil: "·" },
  { id: "pair", label: "A pair", blurb: "Two riders. Most charters fit naturally.", sigil: "··" },
  { id: "small", label: "A small group", blurb: "Three to five — friends, partners, a small expedition.", sigil: "···" },
  {
    id: "family",
    label: "A family with children",
    blurb: "Pace and lodging chosen with children in mind.",
    sigil: "⌂",
  },
  { id: "large", label: "A larger party", blurb: "Six or more. We size the camp and machines accordingly.", sigil: "✿" },
];

/* ────────────────────────────────────────────────────────────
   Season parsing — match user's chosen season against a journey's
   free-text `season` field (e.g. "June – September").
   ──────────────────────────────────────────────────────────── */

const MONTH_NAMES: Record<string, number> = {
  jan: 1, january: 1,
  feb: 2, february: 2,
  mar: 3, march: 3,
  apr: 4, april: 4,
  may: 5,
  jun: 6, june: 6,
  jul: 7, july: 7,
  aug: 8, august: 8,
  sep: 9, sept: 9, september: 9,
  oct: 10, october: 10,
  nov: 11, november: 11,
  dec: 12, december: 12,
};

/** Extract the set of months a journey covers from its `season` string. */
export function monthsOfJourney(journey: Journey): Set<number> {
  const months = new Set<number>();
  const text = journey.season.toLowerCase();

  // Catch "(eagle season)" etc — generic words first.
  if (text.includes("year") || text.includes("any")) {
    for (let m = 1; m <= 12; m++) months.add(m);
    return months;
  }

  // Pattern: "<month> – <month>" (or "to") meaning inclusive range.
  // Strip parentheses noise first.
  const cleaned = text.replace(/\([^)]*\)/g, " ");
  const rangeMatch = cleaned.match(
    /([a-z]+)\s*(?:[–-]|to|through|until|–)\s*([a-z]+)/i,
  );
  if (rangeMatch) {
    const a = MONTH_NAMES[rangeMatch[1]];
    const b = MONTH_NAMES[rangeMatch[2]];
    if (a && b) {
      // Walk a..b inclusive, wrapping past December if needed.
      let m = a;
      // Safety cap: 12 iterations.
      for (let i = 0; i < 12; i++) {
        months.add(m);
        if (m === b) break;
        m = (m % 12) + 1;
      }
      return months;
    }
  }

  // Fallback — pick out any month name mentioned.
  for (const key of Object.keys(MONTH_NAMES)) {
    if (new RegExp(`\\b${key}\\b`).test(cleaned)) months.add(MONTH_NAMES[key]);
  }
  return months;
}

/** Does the journey run during the user's chosen season? */
function journeyCoversSeason(j: Journey, season: Season): boolean {
  if (season === "any") return true;
  const seasonDef = SEASON_OPTIONS.find((s) => s.id === season);
  if (!seasonDef || seasonDef.months.length === 0) return true;
  const journeyMonths = monthsOfJourney(j);
  return seasonDef.months.some((m) => journeyMonths.has(m));
}

/* ────────────────────────────────────────────────────────────
   Scoring — turn (Journey × IntentDraft) into a number + tier.
   The tiers ("strong"/"good"/"soft") drive the results UI.
   ──────────────────────────────────────────────────────────── */

export type MatchTier = "strong" | "good" | "soft";

export type JourneyMatch = {
  journey: Journey;
  score: number;
  tier: MatchTier;
  /** Short human reasons for the match, surfaced on the result card. */
  reasons: string[];
};

export function scoreJourney(j: Journey, intent: IntentDraft): JourneyMatch {
  let score = 0;
  const reasons: string[] = [];

  // ── Theme (primary signal) ─────────────────────────────────
  if (intent.themes.length > 0) {
    const selectedInterests = intent.themes
      .map((id) => INTERESTS.find((i) => i.id === id))
      .filter((x): x is Interest => !!x);
    const matched = selectedInterests.filter((i) =>
      i.categories.includes(j.category),
    );
    if (matched.length > 0) {
      score += 50 + (matched.length - 1) * 12;
      reasons.push(
        matched.length === 1
          ? `Answers your interest in ${shortLabel(matched[0])}`
          : `Answers ${matched.length} of your interests`,
      );
    } else {
      score -= 25;
    }
  }

  // ── Pace ───────────────────────────────────────────────────
  if (intent.pace !== "any") {
    const want = LEVEL_ORDER[intent.pace];
    const has = LEVEL_ORDER[j.difficulty];
    const diff = Math.abs(want - has);
    if (diff === 0) {
      score += 25;
      reasons.push(`Matches your chosen pace`);
    } else if (diff === 1) {
      score += 8;
    } else {
      score -= 8 * diff;
    }
  }

  // ── Season ─────────────────────────────────────────────────
  if (intent.season !== "any") {
    if (journeyCoversSeason(j, intent.season)) {
      score += 20;
      const seasonLabel = SEASON_OPTIONS.find((s) => s.id === intent.season)?.label;
      if (seasonLabel) reasons.push(`Runs in ${seasonLabel.toLowerCase()}`);
    } else {
      score -= 15;
    }
  }

  // ── Party ──────────────────────────────────────────────────
  const partySize: Record<Party, number> = {
    solo: 1,
    pair: 2,
    small: 4,
    family: 4,
    large: 8,
  };
  const needsCapacity = partySize[intent.party];
  if (needsCapacity >= 4) {
    // Journeys whose vehicle options include a van / land-cruiser / horse-support
    // accommodate larger parties well.
    const fitsLargerParty = j.vehicleOptions.some((v) =>
      ["van", "land-cruiser", "horse-support"].includes(v),
    );
    if (fitsLargerParty) score += 10;
    else score -= 5;
  }
  if (intent.party === "family" && j.difficulty === "Guildmaster") {
    score -= 30;
    reasons.push(`Note — Guildmaster pace is not for children`);
  }

  // Tier — calibrated against the score scale above.
  let tier: MatchTier = "soft";
  if (score >= 70) tier = "strong";
  else if (score >= 35) tier = "good";

  return { journey: j, score, tier, reasons };
}

/** Score every journey, sort by score desc, drop anything below floor. */
export function rankJourneys(
  journeys: Journey[],
  intent: IntentDraft,
  floor = 0,
): JourneyMatch[] {
  return journeys
    .map((j) => scoreJourney(j, intent))
    .filter((m) => m.score >= floor)
    .sort((a, b) => b.score - a.score);
}

/* ─── helpers ─── */

function shortLabel(interest: Interest): string {
  // Strip "I want [to|a|an]" prefix for in-prose use.
  return interest.label
    .replace(/^I want\s+(?:to\s+|an?\s+)?/i, "")
    .toLowerCase();
}

/* ─── URL serialisation — keep state shareable via querystring ─── */

export function intentToParams(intent: IntentDraft): URLSearchParams {
  const sp = new URLSearchParams();
  if (intent.themes.length) sp.set("interest", intent.themes.join(","));
  if (intent.pace !== "any") sp.set("pace", intent.pace);
  if (intent.season !== "any") sp.set("season", intent.season);
  if (intent.party !== "pair") sp.set("party", intent.party);
  return sp;
}

export function intentFromParams(
  params: URLSearchParams | null,
): IntentDraft {
  const fallback = { ...EMPTY_INTENT };
  if (!params) return fallback;
  const themesRaw = params.get("interest");
  if (themesRaw) {
    fallback.themes = themesRaw
      .split(",")
      .map((s) => s.trim())
      .filter((id) => INTERESTS.some((i) => i.id === id));
  }
  const pace = params.get("pace");
  if (pace && PACE_OPTIONS.some((p) => p.id === pace)) {
    fallback.pace = pace as Pace;
  }
  const season = params.get("season");
  if (season && SEASON_OPTIONS.some((s) => s.id === season)) {
    fallback.season = season as Season;
  }
  const party = params.get("party");
  if (party && PARTY_OPTIONS.some((p) => p.id === party)) {
    fallback.party = party as Party;
  }
  return fallback;
}
