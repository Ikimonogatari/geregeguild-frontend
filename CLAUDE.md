@AGENTS.md

---

# Gerege Guild — Frontend Brief

This website is the public face of **Gerege Guild**, a Mongolian guided-travel business run by a master guide who wants the brand to feel like a **Hobbit-movie adventure** (LOTR/An Unexpected Journey aesthetic — Bag End warmth, Thorin's contract parchment, Erebor maps, Rivendell title cards). The site must hook a first-time visitor immediately.

## Workflow (the core product loop)

1. Visitor lands on the homepage → atmosphere + story hook → CTA **"Choose Your Guide"**.
2. `/guides` shows the roster as a **deck of collectible cards** (like trading-card-game cards).
3. Each guide card displays: portrait, name, **level**, **specialization**, signature region, and one-line tagline.
4. Clicking a card → `/guides/[slug]` detail page → guide's full lore, quests they lead, difficulty rating, "Send Raven" inquire CTA.
5. **No client/guide onboarding flow yet** — guides are hand-curated by us. No sign-up, no auth gating required for browsing. (Existing AuthModal stays but should not block the funnel.)

## Guide levels (hierarchy, low → high)

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

## Quest difficulty

Quests carry difficulty rated by the same hierarchy as guide levels. A visitor's chosen quest must be matchable to a guide whose level meets or exceeds it. This is a soft matching surface for now (display only — no booking engine yet).

---

# Design Spec (source of truth)

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

All free on Google Fonts.

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

# Out of scope for this build

- Mobile app (`geregeguild-mobile/`) — not touched.
- Backend (`geregeguild-backend/`) — not touched unless asked.
- Booking / payment flow.
- Guide self-onboarding.
- Auth-gated content.
