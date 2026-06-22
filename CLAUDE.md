@AGENTS.md

---

# Gerege Guild — Frontend

The public website for **Gerege Guild**, a Mongolian guided-travel business run by a master guide. The brand is styled as a **Hobbit-movie adventure** (LOTR / An Unexpected Journey — Bag End warmth, Thorin's contract parchment, Erebor maps, candlelit runes). The site's job is to hook a first-time visitor instantly and lead them to inquire about a charter.

This file has two halves:
1. **Technical reference** — stack, architecture, data, theming, gotchas (read this to write code).
2. **Design spec & product brief** — the visual/copy source of truth (read this to make UI decisions).

> **Heads-up on drift:** the design brief below still describes a *guides-first* funnel, but the code has since pivoted to a *journey-first* charter flow. The brief is kept as the aesthetic source of truth; the **Architecture** and **Current product flow** sections describe what the code actually does today. When they disagree, the code + those sections win. See [Known inconsistencies](#known-inconsistencies--tech-debt).

---

# Tech Stack

| Area | Choice | Notes |
| --- | --- | --- |
| Framework | **Next.js 16.2.6** (App Router, RSC) | ⚠️ Major version with breaking changes — see `AGENTS.md`; read `node_modules/next/dist/docs/` before writing Next-specific code. |
| Language | **TypeScript 5**, `strict: true` | Path alias `@/*` → `src/*`. |
| React | **19.2.4** | Server Components by default; `"use client"` where interactivity is needed. |
| Styling | **Tailwind CSS v4** | **CSS-first config** — there is **no `tailwind.config.js`**. All theme tokens live in `src/app/globals.css` under `@theme inline`. PostCSS via `@tailwindcss/postcss`. |
| Components | **shadcn** (`style: base-nova`, `baseColor: neutral`, RSC) | Primitives in `src/components/ui/`. Built on **`@base-ui/react`**. Icon library: **lucide-react**. |
| Animation | **framer-motion 12** | House motion vocabulary centralised in `src/lib/motion.ts`. |
| Smooth scroll | **lenis** (`ReactLenis` in `Providers`) | Owns scrolling; do **not** add CSS `scroll-behavior: smooth` (it fights Lenis). |
| State | **zustand 5** | `src/lib/sceneStore.ts` (3D/scroll state). App auth/game state uses React Context in `Providers.tsx`. |
| 3D / WebGL | **three** + **@react-three/fiber** + **@react-three/drei** + **@react-three/postprocessing** | Hero background scene only; lazy-loaded and capability-gated. |
| Map | **leaflet** + **react-leaflet 5** | Client-only (`dynamic`, `ssr: false`). Used by the legacy check-in map. |
| Carousel | **embla-carousel-react** (+ autoplay) | Behind `components/ui/carousel.tsx`. |
| Toasts | **sonner** | `<Toaster />` mounted in root layout; `toast()` from anywhere. |
| Utilities | `clsx` + `tailwind-merge` via `cn()` in `src/lib/utils.ts` | `next-themes`, `tw-animate-css` also present. |

No test framework is configured.

---

# Commands

```bash
npm run dev      # Next dev server → http://localhost:3000
npm run build    # Production build
npm run start    # Serve the production build
npm run lint     # ESLint (eslint-config-next: core-web-vitals + typescript)
```

`package.json` `name` is still the scaffold default `"my-app"` (cosmetic).

---

# Environment

```bash
NEXT_PUBLIC_API_URL   # Backend base URL (the only env var)
```

- `.env.example` points at `http://localhost:3000`.
- `.env.local` currently points at the **Railway production backend**: `https://geregeguild-backend-production.up.railway.app`.
- This single var drives both the legacy game/auth integration (`Providers.tsx`) and the public share pages (`app/share/poi/...`).

---

# Architecture

```
src/
├── app/                          # App Router routes
│   ├── layout.tsx                # Root: fonts (next/font), globals.css, leaflet/lenis CSS, <Providers>, <Toaster>
│   ├── globals.css               # ★ Tailwind v4 @theme + ALL design tokens + custom utility/animation classes
│   ├── page.tsx                  # Homepage — composes the landing sections
│   ├── journeys/
│   │   ├── page.tsx              # Journey catalogue + category filter (client)
│   │   └── [slug]/page.tsx       # Journey detail
│   ├── charter/[journey]/page.tsx# Charter builder wizard (SSG via generateStaticParams over JOURNEYS)
│   ├── guides/
│   │   ├── page.tsx              # Guide roster ("deck of cards") + filters (client)
│   │   └── [slug]/page.tsx       # Guide lore detail
│   ├── map/page.tsx              # Legacy interactive POI map
│   ├── profile/page.tsx          # Legacy "Gerege Passport" — points, rank, unlocked lore
│   └── share/poi/[checkInId]/    # Public share card for a check-in
│       ├── page.tsx              # SSR-fetches /api/checkin/:id/public
│       └── opengraph-image.tsx   # Dynamic OG image (next/og ImageResponse)
├── components/
│   ├── ui/                       # shadcn primitives: button, card, carousel, sonner
│   ├── canvas/                   # Hero WebGL: HeroCanvas → HeroScene → EmberGerege
│   ├── Providers.tsx             # ★ Lenis + Auth context + Game context (backend integration)
│   ├── Navbar.tsx / Footer.tsx
│   ├── Hero.tsx                  # Landing hero (motion title, dust motes, mounts HeroCanvas)
│   ├── CharterWizard.tsx         # ★ Vehicle → Guide → inquiry, the core conversion flow (~940 lines)
│   ├── GuideCard.tsx / JourneyCard.tsx / GuideRankBadge.tsx
│   ├── *Section.tsx              # Homepage sections (Journeys, Guild, About, etc.)
│   ├── InteractiveMap.tsx → MapComponent.tsx   # Leaflet map (legacy game)
│   ├── AuthModal.tsx             # Login modal (legacy auth)
│   └── … atmosphere: EmberCursorTrail, CompassFollower, QuillDivider, Reveal, PageTransition, ScrollToTop
├── hooks/
│   └── useDeviceCapability.ts    # Client probe: WebGL? low-power? reduced-motion?
└── lib/
    ├── guides.ts                 # ★ Guide data model + 6 hardcoded GUIDES + helpers
    ├── journeys.ts               # ★ Journey/Vehicle/Interest/Medal models + 9 JOURNEYS + matching logic
    ├── motion.ts                 # Shared framer-motion easing/durations/reveal variants
    ├── sceneStore.ts             # zustand store for the 3D hero (quality, scroll, reduced-motion)
    ├── format.ts                 # Price formatting helpers
    └── utils.ts                  # cn()
```

`★` = the files you'll touch most / that hold the real logic.

## Rendering model
- Pages are **Server Components** unless they need state/effects. `journeys`, `guides`, `profile`, and most interactive components are `"use client"`.
- `charter/[journey]` is **statically generated** — `generateStaticParams()` iterates `JOURNEYS`.
- The map and the whole three.js graph are **lazy, client-only** (`next/dynamic`, `ssr: false`) to avoid SSR/WebGL issues and keep the initial bundle light.

---

# Current product flow (what the code does today)

The product is **journey-first** ("every charter is built from the road upward"):

1. **Homepage** (`page.tsx`) stacks: `Hero → LayOfTheGuild → About → JourneysSection → ChooseByInterest → GuildSection → QuestPreview → Reviews → Gallery → Footer`.
2. **`/journeys`** — catalogue of the 9 `JOURNEYS`, filterable by `JourneyCategory`, plus a "Choose by interest" surface that maps an `Interest` to matching categories.
3. **`/journeys/[slug]`** — full journey detail (overview, highlights, terrain, season, price range, gallery).
4. **`/charter/[journey]`** → **`CharterWizard`** — the conversion funnel, in 3 steps:
   - **Vehicle** — pick from the journey's `vehicleOptions` (`VEHICLES`), default = `requiredVehicle`.
   - **Guide** — guides are ranked/sorted by `guidesForJourney()` (fits category + meets rank); a guide who doesn't meet `recommendedRank` is shown but flagged.
   - **Charter** — a "Send a Raven" inquiry form (name/email/dates/party/notes). Submits to `POST /api/charters`; falls back to `mailto:` if the API is unreachable. A successful submit creates a broadcast admin notification.
5. **`/guides`** & **`/guides/[slug]`** — the roster as collectible cards + per-guide lore. Still present and linked, but secondary to journeys now.

All journey/guide content is now **served by the backend** (DB-backed, see `geregeguild-backend/CLAUDE.md`). The `src/lib/journeys.ts` and `src/lib/guides.ts` files remain as the type source AND as offline fallbacks — `src/lib/api.ts` transparently falls back to them if the API is unreachable. Prices come from the backend `Journey` rows and the `/api/pricing` settings (currency, tax, fee, deposit). The admin dashboard at :3001 owns content edits.

## Domain model (in `src/lib/`)
- **Rank ladder** (shared by guides *and* journey difficulty): `Apprentice → Novice → Master → Guildmaster` (`LEVEL_ORDER`). Only one Guildmaster exists (Vanya).
- **Guide** (`guides.ts`): slug, level, specialization (`Gobi|Lake|Extreme|Urban|Adventurous`), lore, `suitableCategories`, rating, quests, etc.
- **Journey** (`journeys.ts`): slug, `category` (9 incl. `Custom`), `difficulty` (= rank), `requiredVehicle`/`vehicleOptions`, `recommendedRank`, price range, rich point lists.
- **Vehicle**, **Interest**, **Medal** (`GUIDE_MEDAL`, the gerege-tablet badge per rank) also live in `journeys.ts`.
- Matching helpers: `guidesForJourney`, `guideMeetsRank`, `guideFitsCategory`, `journeysForInterest`, `journeysByCategory`.

---

# Theming & design system (in code)

**All tokens live in `src/app/globals.css`** (Tailwind v4 `@theme inline`). Use the semantic Tailwind classes, not raw hex.

| Token (Tailwind class) | Value | Role |
| --- | --- | --- |
| `bg-background` | `#1C1510` | Deep parchment (page bg) |
| `bg-surface` | `#2E1F14` | Aged leather (cards/panels) |
| `text-foreground` | `#F0E6D3` | Warm ivory (primary text) |
| `text-muted` | `#A89070` | Faded ink (secondary) |
| `text-accent` / `bg-accent` | `#C9922A` | Ember gold (the one accent) |
| `*-highlight` | `#8B5E3C` | Burnished copper |

- **Fonts** loaded via `next/font/google` in `layout.tsx`, exposed as CSS vars and Tailwind families: `font-heading`/`font-display` = **Cinzel**, `font-body`/`font-sans` = **Crimson Text**, `font-accent` = **IM Fell English**.
- **Legacy brand aliases** also exist for the old game UI: `brand-parchment`, `brand-ember`, `brand-copper`, `brand-leather`, `brand-charcoal`, `brand-ink`, `brand-gold`.
- **Custom utility classes** (defined in `globals.css`, reach for these instead of reinventing): `parchment-edge`, `ink-divider`, `ember-glow`, `ember-text-glow`, `vignette`, `card-firelight`, `quill-stroke`.
- **Atmospheric animations** (CSS keyframes + classes): `candle-flicker`, `ember-breath`, `mote` (rising dust), `wax-pulse`, `ink-draw`, `title-shimmer`. Global parchment-grain + ember-vignette overlays are painted via `body::before` / `body::after`.
- **Reduced motion** is respected: `@media (prefers-reduced-motion: reduce)` disables the ambient loops, and Lenis/3D both check the OS preference.
- **Shared motion language** for JS animations is in `src/lib/motion.ts` — `EASE`, `DUR`, `STAGGER`, `revealVariants()`, `staggerParent()`, `VIEWPORT`. Prefer these over magic numbers.

---

# Hero 3D & performance layer

The hero has an optional WebGL layer that **must never block or break the page**:
- `useDeviceCapability()` probes WebGL support, low-power (coarse pointer / small viewport / low memory / few cores), and reduced-motion **once on the client** (avoids SSR mismatch).
- `HeroCanvas` renders **nothing** until that probe resolves and only mounts `HeroScene` (the three.js graph) when WebGL is available. The 2D parchment/video hero always shows through underneath.
- `HeroScene` degrades quality automatically (`PerformanceMonitor`, `AdaptiveDpr`, lighter DPR on mobile) and **pauses its render loop once the hero scrolls out of view** (`frameloop` driven by `sceneStore.heroScroll`) — the biggest scroll-perf win.
- State shared via `sceneStore` (zustand): `quality`, `heroScroll`, `reducedMotion`.

When touching the hero, keep the no-WebGL and reduced-motion fallbacks intact.

---

# Backend integration & the legacy "Gerege Passport" game

Separate from the charter product, an **earlier gamified product** is still wired up and talks to the backend. `Providers.tsx` exposes two React contexts:

- **`useAuth()`** — `login(username, password)` → `POST {API_URL}/auth/login`; token + user persisted to `localStorage` under key **`gerege_auth`**. `AuthModal` drives it.
- **`useGame()`** — fetches and exposes POIs, leaderboard, feed, and the user's points/rank/unlocked lore.

Backend endpoints consumed (base = `NEXT_PUBLIC_API_URL`):
| Endpoint | Used by |
| --- | --- |
| `POST /auth/login` | login |
| `GET /api/profile` (Bearer) | profile points/rank/unlockedPOIs |
| `GET /api/pois` | map markers (mapped `{latitude,longitude}` → `coordinates`) |
| `GET /api/leaderboard`, `GET /api/feed` | social panels |
| `POST /api/checkin` (Bearer) | check in at a POI → points/karma/rank/lore |
| `GET /api/checkin/:id/public` | public share page + OG image |

Surfaces: `/map` (Leaflet, check-in), `/profile` (passport), `/share/poi/[checkInId]` (public share card + dynamic OG image).

> This game system predates the charter pivot. It is **not** part of the journey funnel and is **not styled with the parchment system** — it uses the old `brand-charcoal`/`brand-gold` look. Treat it as legacy: don't extend it without confirming it's still wanted, and don't let its patterns leak into the charter UI.

---

# Code conventions

- Import via the `@/` alias, never long relative chains.
- Compose classes with `cn()` (`src/lib/utils.ts`).
- Use semantic theme tokens (`bg-background`, `text-accent`, `font-heading`) — not raw hex, not arbitrary values, unless matching an existing local pattern.
- Reuse `src/lib/motion.ts` for framer-motion config.
- Keep new UI in the **parchment/Cinzel** system (see design spec) — the `brand-charcoal`/`bricolage` look is legacy.
- Server Component by default; add `"use client"` only when you need state/effects/browser APIs.
- Always handle loading / error / empty states for anything data-fetching (the map and social panels already model this).

---

# Known inconsistencies & tech debt

These are real and worth knowing before you edit:

1. **Brief vs. code drift** — the design brief describes a guides-first "Choose Your Guide" funnel; the live product is journey-first ("from the road upward"). The brief's *aesthetic* rules are still authoritative; its *flow* description is stale.
2. **Two design eras coexist** — new parchment/Cinzel charter UI vs. legacy `brand-charcoal`/`brand-gold` game UI (`/map`, `/profile`, `AuthModal`).
3. **Undefined font classes** — `profile/page.tsx`, `AuthModal.tsx`, and `InteractiveMap.tsx` use `font-bricolage` / `font-space-grotesk`, which are **not defined** in the current `@theme` — those screens fall back to default fonts.
4. ~~**Charter inquiry form is inert**~~ — RESOLVED: submits to `POST /api/charters`; mailto remains as a fallback.
5. ~~**Charter data is hardcoded**~~ — RESOLVED: journeys/guides served from the backend DB; `src/lib/{journeys,guides}.ts` are now the type + offline-fallback source.
6. **Map page bg** uses `bg-brand-charcoal` (an alias of `background`) — fine, but mixes vocabularies.
7. ~~**User notifications not surfaced in public UI**~~ — RESOLVED: `<CustomerBell />` appears in the navbar after a charter has been submitted on the device; polls `/api/notifications/customer?email=…`. `/charter/me` lists every charter submitted on this device; `/charter/track/:id` is the per-charter status page.

When fixing in these areas, flag the inconsistency rather than silently normalising unrelated code.

---
---

# Design Spec (aesthetic source of truth)

## Theme

**LOTR / The Hobbit movie aesthetic.** Think: opening title cards, Thorin's contract, Bilbo's map, Bag End interior lighting, candlelit parchment, ember-lit forge, ancient runes carved into stone.

## Color palette

| Role            | Color            | Hex                              |
| --------------- | ---------------- | -------------------------------- |
| Background      | Deep parchment   | `#1C1510`                        |
| Surface         | Aged leather     | `#2E1F14`                        |
| Primary text    | Warm ivory       | `#F0E6D3`                        |
| Secondary text  | Faded ink        | `#A89070`                        |
| Accent          | Ember gold       | `#C9922A`                        |
| Highlight       | Burnished copper | `#8B5E3C`                        |
| Fog overlay     | Dark veil        | `#0D0A07` at 70% opacity         |

No white backgrounds anywhere. No blue, purple, or modern gradients.

## Typography

All free on Google Fonts (loaded via `next/font` in `layout.tsx`).

- **Display / Headings — Cinzel.** All-caps for major headings. Wide letter-spacing (carved-stone feel). H1 64, H2 40, H3 28.
- **Body — Crimson Text.** Warm old-fashioned serif. 18px / line-height 1.8.
- **Accent / Labels — IM Fell English.** Small labels, level names, quest classifications. 14px.

## Textures & atmosphere

- Subtle parchment grain overlay across the entire site.
- Vignette on every full-screen image.
- Worn / torn edge borders on cards and quest panels.
- Ink-bleed effect on section dividers.
- **No sharp modern drop shadows** — use diffused warm glows (ember gold @ low opacity) instead.

## Imagery direction

- Wide Mongolian landscapes — empty, ancient, vast.
- Real horses, real gers, real terrain. No stock tourists.
- Golden hour / blue hour lighting.
- Slightly desaturated, warm-toned — never Instagram-filtered.

## Iconography

- Hand-drawn / ink-sketch icons. Never flat modern icons.
- Quest-type icons: horse, tent, mountain, fish, wolf, fire, raven.

## Layout principles

- Full-screen hero sections — landscape fills the viewport.
- Generous space between sections — let the world breathe.
- Guide / quest cards feel like **physical objects** (parchment, worn edges, slight rotation, frayed corners).
- Slight asymmetry — nothing perfectly centered. Asymmetry = ancient.
- Map images bleed to container edges.

## Forbidden (explicit reject list)

- White backgrounds
- Modern sans-serif fonts (Inter, Bricolage, Space Grotesk, etc.)
- Blue or purple anywhere
- Stock-photo smiling tourists
- Flat modern icons
- Material/Bootstrap card shadows
- SaaS-style tech-startup gradients
- Animations that feel like a SaaS product

## Copy tone

- Lore-tinged, second-person, slightly archaic. Examples:
  - CTA: "Choose Your Guide" / "Enter the Guild" / "Send a Raven"
  - Sections: "The Hall", "The Roster", "The Tales", "The Map"
  - Labels: "Quest", "Patron", "Companion", "Charter"
- Never marketing-speak ("unlock", "transform", "experience the magic of…").

---

# Product reference

## Guide levels (rank ladder, low → high)

- **Apprentice** — newest tier; assists on simpler routes.
- **Novice** — solo-leads on common routes.
- **Master** — leads advanced multi-region quests.
- **Guildmaster** — the singular top-tier guide; rare quests only. Only one Guildmaster exists.

## Specializations (each guide has one primary)

- **Gobi** — desert, dunes, camel, vast emptiness
- **Lake** — Khövsgöl and surrounding, water, forests, reindeer people
- **Extreme** — high-altitude, winter expeditions, survival
- **Urban** — Ulaanbaatar nightlife, culture, food, contemporary Mongolia
- **Adventurous** — mixed-terrain, multi-discipline grand tours

## Quest / journey difficulty

Quests and journeys carry a difficulty rated on the **same rank ladder** as guide levels. A chosen journey is matchable to a guide whose level meets or exceeds its `recommendedRank`. This is a soft, display-only matching surface for now — no booking engine.

---

# Out of scope (for the frontend brief)

- Mobile app (`geregeguild-mobile/`) — separate Expo project, not touched here.
- The backend (`geregeguild-backend/`) — separate repo; the frontend only *consumes* its endpoints (see backend integration above). Don't edit it from here unless asked.
- Booking / payment flow.
- Guide self-onboarding / client sign-up gating (guides are hand-curated; the legacy `AuthModal` exists but must not block the browsing funnel).
