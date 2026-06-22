import { GUIDES, LEVEL_ORDER, type Guide, type GuideLevel } from "./guides";

/* ────────────────────────────────────────────────────────────
   Journey categories
   The charter always begins from the road, never from the guide.
   ──────────────────────────────────────────────────────────── */

export type JourneyCategory =
  | "Horseback"
  | "Monastery & Temple"
  | "4x4 Off-road"
  | "Spiritual"
  | "Nomadic Family Stay"
  | "Gobi Desert"
  | "Northern Taiga"
  | "Historical & Cultural"
  | "Custom";

export const JOURNEY_CATEGORIES: JourneyCategory[] = [
  "Horseback",
  "Monastery & Temple",
  "4x4 Off-road",
  "Spiritual",
  "Nomadic Family Stay",
  "Gobi Desert",
  "Northern Taiga",
  "Historical & Cultural",
  "Custom",
];

export const CATEGORY_SIGIL: Record<JourneyCategory, string> = {
  Horseback: "♞",
  "Monastery & Temple": "卍",
  "4x4 Off-road": "⛭",
  Spiritual: "☽",
  "Nomadic Family Stay": "⌂",
  "Gobi Desert": "☼",
  "Northern Taiga": "❅",
  "Historical & Cultural": "𐎚",
  Custom: "✶",
};

/* ────────────────────────────────────────────────────────────
   Difficulty — shares the guild's rank ladder so a road can be
   matched to a guide whose rank meets or exceeds it.
   ──────────────────────────────────────────────────────────── */

export type Difficulty = GuideLevel; // Apprentice → Novice → Master → Guildmaster

export const DIFFICULTY_BLURB: Record<Difficulty, string> = {
  Apprentice: "Gentle ground. A soft first meeting with the country.",
  Novice: "Honest miles. Some long days, nothing that bites.",
  Master: "Real distance, real weather. The country asks something back.",
  Guildmaster: "An expedition. Cold, remote, and not to be taken lightly.",
};

/* ────────────────────────────────────────────────────────────
   Guide rank / medal system (game-rank inspired)
   The gerege is the old passport tablet; here it becomes the medal.
   ──────────────────────────────────────────────────────────── */

export type Medal = {
  name: string;
  tier: number;
  sigil: string;
  /** ring + fill colours for the badge */
  ring: string;
  fill: string;
  text: string;
  blurb: string;
};

export const GUIDE_MEDAL: Record<GuideLevel, Medal> = {
  Apprentice: {
    name: "Bronze Gerege",
    tier: 1,
    sigil: "I",
    ring: "#8B5E3C",
    fill: "#3a2614",
    text: "#e7c79a",
    blurb: "Assists and solo-leads the gentler roads.",
  },
  Novice: {
    name: "Silver Gerege",
    tier: 2,
    sigil: "II",
    ring: "#b9b3a6",
    fill: "#34302a",
    text: "#e9e6df",
    blurb: "Leads honest multi-day charters across known country.",
  },
  Master: {
    name: "Gold Gerege",
    tier: 3,
    sigil: "III",
    ring: "#C9922A",
    fill: "#3a2c10",
    text: "#f3d68a",
    blurb: "Leads advanced, multi-region routes through hard weather.",
  },
  Guildmaster: {
    name: "Legendary Gerege",
    tier: 4,
    sigil: "IV",
    ring: "#c0452b",
    fill: "#3a1108",
    text: "#f0c9a0",
    blurb: "The single highest tablet. The rarest, coldest expeditions only.",
  },
};

/** Ordered low → high, for ladder displays. */
export const MEDAL_LADDER: { level: GuideLevel; medal: Medal }[] = (
  ["Apprentice", "Novice", "Master", "Guildmaster"] as GuideLevel[]
).map((level) => ({ level, medal: GUIDE_MEDAL[level] }));

/* ────────────────────────────────────────────────────────────
   Accommodation, Diet, Mount — charter add-ons (Phase A).
   Pricing impact is deferred to Phase C (pricing engine); for
   now we surface the choice in the wizard + summary only.
   ──────────────────────────────────────────────────────────── */

export type AccommodationStyle = "Group" | "Private";

export const ACCOMMODATION_OPTIONS: {
  id: AccommodationStyle;
  label: string;
  blurb: string;
  feeHint: string;
}[] = [
  {
    id: "Group",
    label: "Group ger / shared camp",
    blurb:
      "The Guild's default — felt tents and bedrolls, shared with the party. Closer to the road.",
    feeHint: "Included",
  },
  {
    id: "Private",
    label: "Private sleeping arrangements",
    blurb:
      "A separate ger or private room where the road allows. Quieter, but adds to the charter cost.",
    feeHint: "+ Additional fee",
  },
];

export type DietaryPreference = "Standard" | "Vegetarian" | "Vegan" | "Other";

export const DIETARY_OPTIONS: { id: DietaryPreference; label: string; sigil: string }[] = [
  { id: "Standard", label: "Standard (camp cooking)", sigil: "☉" },
  { id: "Vegetarian", label: "Vegetarian", sigil: "✿" },
  { id: "Vegan", label: "Vegan", sigil: "✤" },
  { id: "Other", label: "Other / specific requirements", sigil: "✦" },
];

export type MountId = "None" | "Horse" | "Yak";

export type MountOption = {
  id: MountId;
  label: string;
  sigil: string;
  blurb: string;
  /** journey categories where this mount is offered. None = always. */
  availableFor: JourneyCategory[] | "any";
  /** region keywords; mount is offered only if the journey's region
   *  mentions one of these. Empty array = no extra region filter. */
  regionKeywords: string[];
};

export const MOUNT_OPTIONS: MountOption[] = [
  {
    id: "None",
    label: "No mount — ride the route as set",
    sigil: "—",
    blurb: "Keep the charter as the road describes it.",
    availableFor: "any",
    regionKeywords: [],
  },
  {
    id: "Horse",
    label: "Horse",
    sigil: "♞",
    blurb:
      "Saddle horses are the country's first transport. Available on most roads outside the deep Gobi.",
    availableFor: [
      "Horseback",
      "Nomadic Family Stay",
      "Spiritual",
      "Historical & Cultural",
      "Custom",
    ],
    regionKeywords: [],
  },
  {
    id: "Yak",
    label: "Yak",
    sigil: "Ψ",
    blurb:
      "High-altitude pack animal. Available only where the herders keep them — primarily Arkhangai.",
    availableFor: "any",
    regionKeywords: ["arkhangai", "khangai", "khövsgöl"],
  },
];

/** Filter mount options to those available for the given journey. */
export function mountsForJourney(journey: Journey): MountOption[] {
  const region = journey.region.toLowerCase();
  return MOUNT_OPTIONS.filter((m) => {
    if (m.id === "None") return true;
    const categoryOk =
      m.availableFor === "any" || m.availableFor.includes(journey.category);
    if (!categoryOk) return false;
    if (m.regionKeywords.length === 0) return true;
    return m.regionKeywords.some((kw) => region.includes(kw));
  });
}

/* ────────────────────────────────────────────────────────────
   Vehicles — chosen after the road, never before.
   ──────────────────────────────────────────────────────────── */

export type VehicleId =
  | "suv"
  | "land-cruiser"
  | "van"
  | "horse-support"
  | "expedition-moto";

export type Vehicle = {
  id: VehicleId;
  name: string;
  sigil: string;
  terrain: string;
  passengers: string;
  comfort: "Standard" | "Comfort" | "Rugged" | "Spartan";
  /** relative price impact, for the charter estimate */
  priceImpact: "Included" | "+ Modest" | "+ Premium" | "+ Expedition";
  blurb: string;
  bestFor: JourneyCategory[];
};

export const VEHICLES: Vehicle[] = [
  {
    id: "suv",
    name: "Standard SUV",
    sigil: "⛰",
    terrain: "Steppe tracks, graded roads, light gravel",
    passengers: "1–3 patrons + guide",
    comfort: "Comfort",
    priceImpact: "Included",
    blurb:
      "A warm, capable wagon for the gentler roads — soft hills, monastery loops, family stays close to the city.",
    bestFor: [
      "Horseback",
      "Monastery & Temple",
      "Nomadic Family Stay",
      "Historical & Cultural",
    ],
  },
  {
    id: "land-cruiser",
    name: "4x4 Land Cruiser",
    sigil: "⛭",
    terrain: "Dunes, river crossings, mountain passes, trackless steppe",
    passengers: "1–4 patrons + guide",
    comfort: "Rugged",
    priceImpact: "+ Modest",
    blurb:
      "The country's true workhorse. Where the road ends, this is where the charter keeps going.",
    bestFor: [
      "4x4 Off-road",
      "Gobi Desert",
      "Northern Taiga",
      "Historical & Cultural",
      "Spiritual",
    ],
  },
  {
    id: "van",
    name: "Furgon Van",
    sigil: "⌘",
    terrain: "Mixed roads, longer group transfers",
    passengers: "4–8 patrons + guide",
    comfort: "Standard",
    priceImpact: "+ Modest",
    blurb:
      "The old Russian furgon — homely, unbreakable, and big enough to carry a whole fellowship and its tents.",
    bestFor: ["Nomadic Family Stay", "Historical & Cultural", "Monastery & Temple"],
  },
  {
    id: "horse-support",
    name: "Horseback + Pack Support",
    sigil: "♞",
    terrain: "Trails, high pasture, forest, anywhere a horse will go",
    passengers: "Ridden — pack animals carry the camp",
    comfort: "Spartan",
    priceImpact: "+ Premium",
    blurb:
      "The oldest way to read this country. You ride; pack horses and a support vehicle shadow the route with the camp.",
    bestFor: ["Horseback", "Spiritual", "Northern Taiga", "Nomadic Family Stay"],
  },
  {
    id: "expedition-moto",
    name: "Expedition Motorcycle",
    sigil: "⚙",
    terrain: "Hard off-road, remote desert and mountain expedition lines",
    passengers: "Solo riders, small convoys + support 4x4",
    comfort: "Spartan",
    priceImpact: "+ Expedition",
    blurb:
      "For riders who want the country at full speed and full exposure. Always shadowed by a support Cruiser.",
    bestFor: ["4x4 Off-road", "Gobi Desert"],
  },
];

export function getVehicle(id: VehicleId): Vehicle | undefined {
  return VEHICLES.find((v) => v.id === id);
}

/* ────────────────────────────────────────────────────────────
   Travel intents — "Choose by interest"
   Each intent surfaces the roads that answer it.
   ──────────────────────────────────────────────────────────── */

export type Interest = {
  id: string;
  label: string;
  sigil: string;
  categories: JourneyCategory[];
};

export const INTERESTS: Interest[] = [
  { id: "ride", label: "I want to ride horses", sigil: "♞", categories: ["Horseback", "Nomadic Family Stay"] },
  { id: "temples", label: "I want to visit monasteries & temples", sigil: "卍", categories: ["Monastery & Temple", "Historical & Cultural"] },
  { id: "offroad", label: "I want an off-road 4x4 adventure", sigil: "⛭", categories: ["4x4 Off-road", "Gobi Desert"] },
  { id: "spiritual", label: "I want a spiritual / shamanic journey", sigil: "☽", categories: ["Spiritual", "Monastery & Temple"] },
  { id: "photo", label: "I want photography & landscapes", sigil: "◎", categories: ["Gobi Desert", "Northern Taiga", "Horseback"] },
  { id: "nomadic", label: "I want a nomadic family experience", sigil: "⌂", categories: ["Nomadic Family Stay", "Horseback"] },
  { id: "history", label: "I want history & culture", sigil: "𐎚", categories: ["Historical & Cultural", "Monastery & Temple"] },
  { id: "expedition", label: "I want a hard expedition", sigil: "▲", categories: ["Northern Taiga", "4x4 Off-road", "Gobi Desert"] },
];

/* ────────────────────────────────────────────────────────────
   Journeys — the heart of the offer.
   ──────────────────────────────────────────────────────────── */

export type Journey = {
  slug: string;
  title: string;
  category: JourneyCategory;
  /** short, emotional one-liner for the card */
  hook: string;
  region: string;
  image: string;
  gallery: string[];
  days: number;
  distanceKm: number;
  difficulty: Difficulty;
  terrain: string;
  season: string;
  /** the road's required machine */
  requiredVehicle: VehicleId;
  /** other machines that can run this road */
  vehicleOptions: VehicleId[];
  /** the lowest rank that may lead this road */
  recommendedRank: GuideLevel;
  activities: string[];
  highlights: string[];
  /** counts that make a road feel concrete */
  templeCount?: number;
  naturalPoints: string[];
  culturalPoints: string[];
  spiritualPoints: string[];
  overview: string[];
  included: string[];
  addOns: string[];
  /** price range placeholder, per patron, USD */
  priceFrom: number;
  priceTo: number;
};

export const JOURNEYS: Journey[] = [
  {
    slug: "khentii-horse-road",
    title: "The Khentii Horse Road",
    category: "Horseback",
    hook: "Ride the grass where Temüjin was a boy — at a horse's pace, the way the country was meant to be read.",
    region: "Khentii · Onon River",
    image: "/6.jpg",
    gallery: ["/6.jpg", "/1.jpg", "/7.jpg", "/9.jpg"],
    days: 8,
    distanceKm: 240,
    difficulty: "Novice",
    terrain: "Open steppe, river valleys, low forested hills",
    season: "June – September",
    requiredVehicle: "horse-support",
    vehicleOptions: ["horse-support", "suv"],
    recommendedRank: "Novice",
    activities: ["Long-distance riding", "River fording", "Camp under felt", "Evening fires & song"],
    highlights: [
      "The upper Onon, an hour from Temüjin's birthplace",
      "Eight days without a paved road",
      "Pack horses carry the whole camp",
    ],
    naturalPoints: ["Onon River valley", "Khentii larch forest", "Steppe horizon to horizon"],
    culturalPoints: ["Herder families along the river", "Old songs sung at the fire"],
    spiritualPoints: ["Ovoo cairns at every pass"],
    overview: [
      "This is the road the Guild was born on. Eight days on horseback through the Khentii — the country east of the maps, where the grass goes farther than the eye can decide.",
      "You ride; pack horses and a single support wagon shadow the route with the camp. Nights are felt tents and small fires. The only schedule is the next hill.",
    ],
    included: ["Saddle horses + pack animals", "Guide & camp crew", "All camp meals", "Felt-tent & bedroll camp", "Support vehicle shadow"],
    addOns: ["Extra rest day at the Onon", "Eagle-feather charm commission", "Photographer escort"],
    priceFrom: 1900,
    priceTo: 3200,
  },
  {
    slug: "valley-of-monasteries",
    title: "Valley of the Monasteries",
    category: "Monastery & Temple",
    hook: "Eight temples in eight days — from Gandan's smoke to the ruins the steppe is slowly taking back.",
    region: "Ulaanbaatar · Kharkhorin · Övörkhangai",
    image: "/5.jpg",
    gallery: ["/5.jpg", "/8.jpg", "/2.jpg", "/3.jpg"],
    days: 7,
    distanceKm: 760,
    difficulty: "Apprentice",
    terrain: "Graded roads, monastery valleys, the old capital plain",
    season: "May – October",
    requiredVehicle: "suv",
    vehicleOptions: ["suv", "van", "land-cruiser"],
    recommendedRank: "Apprentice",
    activities: ["Temple visits", "Monk-led chanting", "Erdene Zuu walls", "Museum & ruin walks"],
    highlights: [
      "Gandan monastery at morning prayer",
      "Erdene Zuu, raised from the stones of Karakorum",
      "Tövkhön, the meditation cave-temple in the hills",
    ],
    templeCount: 8,
    naturalPoints: ["Orkhon valley", "Khangai foothills"],
    culturalPoints: ["Karakorum, the old imperial capital", "Living monastic communities"],
    spiritualPoints: ["Dawn chanting at Gandan", "Tövkhön meditation cave", "Wishing ovoo above Erdene Zuu"],
    overview: [
      "A pilgrimage by road through the country's deepest temples — from the incense and pigeons of Gandan in the capital to the half-ruined walls the grass is quietly reclaiming.",
      "Gentle ground, but heavy with history. A road for those who want to meet Mongolia through its faith and its old imperial bones.",
    ],
    included: ["Private vehicle & driver-guide", "All monastery fees", "Ger-camp & guesthouse nights", "Daily breakfast & dinner"],
    addOns: ["Private audience with a senior monk", "Extra night at Tövkhön", "Calligraphy session in Kharkhorin"],
    priceFrom: 1400,
    priceTo: 2600,
  },
  {
    slug: "altai-offroad-traverse",
    title: "The Altai Off-road Traverse",
    category: "4x4 Off-road",
    hook: "No road, only the line the Cruiser draws — west to the five sacred peaks and the eagle hunters' country.",
    region: "Bayan-Ölgii · Altai Mountains",
    image: "/4.jpg",
    gallery: ["/4.jpg", "/7.jpg", "/9.jpg", "/1.jpg"],
    days: 11,
    distanceKm: 1450,
    difficulty: "Master",
    terrain: "Trackless mountain, river crossings, high passes, glacier foot",
    season: "September – March (eagle season) · summer for passes",
    requiredVehicle: "land-cruiser",
    vehicleOptions: ["land-cruiser", "expedition-moto"],
    recommendedRank: "Master",
    activities: ["Hard 4x4 driving", "River crossings", "Eagle-hunter camp", "Glacier-foot trek"],
    highlights: [
      "Tavan Bogd — the Five Sacred Peaks",
      "Winter festival of the Kazakh eagle hunters",
      "Eleven days, fourteen hundred kilometres, almost no asphalt",
    ],
    naturalPoints: ["Potanin glacier", "Tavan Bogd massif", "Altai high lakes"],
    culturalPoints: ["Kazakh eagle-hunter families", "Felt-tent winter camps"],
    spiritualPoints: ["Summit ovoo of the sacred peaks"],
    overview: [
      "The country's hardest drivable line — west to the Altai, where Mongolia runs out of roads and into glaciers. A Master-led expedition by 4x4, shadowed by a second vehicle for safety.",
      "You sleep in eagle hunters' tents, cross rivers without bridges, and stand at the foot of the five peaks the whole region holds sacred.",
    ],
    included: ["Expedition 4x4 + support vehicle", "Master guide & driver", "All expedition meals", "Eagle-hunter homestays", "Permits for the national park"],
    addOns: ["Falconry morning on the wrist", "Summit attempt with a mountain guide", "Extra acclimatisation day"],
    priceFrom: 3800,
    priceTo: 6400,
  },
  {
    slug: "shaman-blue-sky",
    title: "Under the Eternal Blue Sky",
    category: "Spiritual",
    hook: "A quiet road to the shamans and the sacred mountains — for travellers who came to listen, not to tick a box.",
    region: "Khövsgöl · Darkhad Valley",
    image: "/3.jpg",
    gallery: ["/3.jpg", "/9.jpg", "/6.jpg", "/8.jpg"],
    days: 9,
    distanceKm: 620,
    difficulty: "Novice",
    terrain: "Forest-steppe, lakeshore, sacred mountains",
    season: "June – September",
    requiredVehicle: "land-cruiser",
    vehicleOptions: ["land-cruiser", "horse-support"],
    recommendedRank: "Master",
    activities: ["Shaman fire ceremony", "Sacred-mountain walks", "Ovoo offerings", "Silence & open sky"],
    highlights: [
      "An evening fire ceremony with a Darkhad shaman",
      "Tengri — the worship of the eternal blue sky",
      "Mountains the locals will not let you climb, only honour",
    ],
    naturalPoints: ["Darkhad depression", "Sacred forest groves"],
    culturalPoints: ["Darkhad shamanic families", "Reindeer-people neighbours"],
    spiritualPoints: ["Fire ceremony", "Tengri sky-worship sites", "Mountain ovoo offerings"],
    overview: [
      "Mongolia's oldest faith is older than its monasteries — the worship of Tengri, the eternal blue sky, kept alive by the shamans of the far north.",
      "This is a slow, respectful road into the Darkhad valley. Nothing here is performed for tourists; you are a guest at the edge of something genuinely sacred.",
    ],
    included: ["4x4 & driver-guide", "Ceremony arrangements & offerings", "Homestays & ger camps", "All meals"],
    addOns: ["Private reading with a shaman", "Extra days with the reindeer herders", "Throat-singing evening"],
    priceFrom: 2200,
    priceTo: 3800,
  },
  {
    slug: "ger-of-the-herders",
    title: "At the Ger of the Herders",
    category: "Nomadic Family Stay",
    hook: "Not a visit — a stay. Move with a herding family through one turning of their season.",
    region: "Arkhangai · Central steppe",
    image: "/8.jpg",
    gallery: ["/8.jpg", "/6.jpg", "/5.jpg", "/2.jpg"],
    days: 6,
    distanceKm: 180,
    difficulty: "Apprentice",
    terrain: "Soft hills, river meadows, summer pasture",
    season: "May – September",
    requiredVehicle: "suv",
    vehicleOptions: ["suv", "van", "horse-support"],
    recommendedRank: "Apprentice",
    activities: ["Herding & milking", "Felt-making", "Horse breaking", "Cooking with the family"],
    highlights: [
      "Live inside the family's own ger, not a tourist camp",
      "Learn to milk, to herd, to make felt and curd",
      "An easy first taste of the country, with a friend not a teacher",
    ],
    naturalPoints: ["Arkhangai river meadows", "Hot springs nearby"],
    culturalPoints: ["A working herding household", "Felt and dairy craft", "Horsehair-fiddle evenings"],
    spiritualPoints: ["The household's hearth customs"],
    overview: [
      "The gentlest road we run, and one of the most loved. You join a single herding family and live their days — milking at dawn, herding at noon, felt and tea by evening.",
      "Close to the city, never far from a warm ger. Ideal for first-time travellers and families who want the country to introduce itself slowly.",
    ],
    included: ["Vehicle & driver-guide", "Full homestay with a herding family", "All home-cooked meals", "Hands-on herding days"],
    addOns: ["Hot-spring day", "Two extra steppe nights", "Children's riding lessons"],
    priceFrom: 980,
    priceTo: 1800,
  },
  {
    slug: "gobi-singing-sands",
    title: "The Gobi of the Singing Sands",
    category: "Gobi Desert",
    hook: "Climb the Khongor dunes at first light, when the sand is still cold enough to walk — and listen to it hum.",
    region: "Ömnögovi · Southern Gobi",
    image: "/2.jpg",
    gallery: ["/2.jpg", "/4.jpg", "/7.jpg", "/9.jpg"],
    days: 8,
    distanceKm: 1100,
    difficulty: "Novice",
    terrain: "Desert, dunes, gravel plain, ice canyon",
    season: "April – October",
    requiredVehicle: "land-cruiser",
    vehicleOptions: ["land-cruiser", "expedition-moto", "van"],
    recommendedRank: "Master",
    activities: ["Dune climbing", "Camel caravan", "Flaming Cliffs at sunset", "Ice canyon walk"],
    highlights: [
      "The Khongor singing dunes at dawn",
      "Yolyn Am — an ice canyon in the middle of a desert",
      "The Flaming Cliffs, where the first dinosaur eggs were found",
    ],
    naturalPoints: ["Khongor Els dunes", "Yolyn Am ice canyon", "Bayanzag Flaming Cliffs"],
    culturalPoints: ["Camel-herder families", "Caravan routes the maps forgot"],
    spiritualPoints: ["Desert ovoo at the well roads"],
    overview: [
      "The south: singing dunes, camel paths, salt flats and the patient emptiness that the Gobi keeps for those who cross it slowly.",
      "Camel-led across the great Khongor dunes, with a dawn climb when the sand still hums, and nights in the camps of herders who know which wells still pour sweet.",
    ],
    included: ["4x4 & driver-guide", "Camel caravan days", "Ger camps & herder stays", "All desert meals", "Park permits"],
    addOns: ["Hot-air dune sunrise", "Two-humped camel trek extension", "Palaeontology talk at Bayanzag"],
    priceFrom: 2100,
    priceTo: 3900,
  },
  {
    slug: "taiga-of-the-reindeer",
    title: "The Taiga of the Reindeer People",
    category: "Northern Taiga",
    hook: "Ride north past where the roads end, to the Tsaatan and the reindeer that pull sleds across the snow.",
    region: "Khövsgöl · Tsagaannuur Taiga",
    image: "/9.jpg",
    gallery: ["/9.jpg", "/3.jpg", "/6.jpg", "/4.jpg"],
    days: 10,
    distanceKm: 540,
    difficulty: "Master",
    terrain: "Boreal forest, bog, river, high taiga — horseback only at the end",
    season: "Late June – September · winter ice charters by arrangement",
    requiredVehicle: "horse-support",
    vehicleOptions: ["horse-support", "land-cruiser"],
    recommendedRank: "Master",
    activities: ["Horseback into the taiga", "Reindeer herding camp", "Lake Khövsgöl boat", "Wood-smoke & silence"],
    highlights: [
      "The Tsaatan reindeer people, north of Tsagaannuur",
      "A day's ride beyond the last road",
      "Lake Khövsgöl, the Blue Pearl, on the way home",
    ],
    naturalPoints: ["Lake Khövsgöl", "Taiga forest & bog", "High mountain pasture"],
    culturalPoints: ["Tsaatan reindeer herders", "Reindeer-hide tents (ortz)"],
    spiritualPoints: ["Taiga shamanic traditions", "Sacred groves of the herders"],
    overview: [
      "The far north, where Mongolia turns to Siberian taiga and a few hundred Tsaatan still live by the reindeer. The last stretch is on horseback — there is no other way in.",
      "A respectful, demanding road: forest, bog and river by day, reindeer-hide tents by night, and the absolute silence that only the deep taiga knows.",
    ],
    included: ["Horses + support vehicle to the trailhead", "Master guide & crew", "Tsaatan homestay arrangements", "All meals", "Khövsgöl boat day"],
    addOns: ["Extra nights with the herders", "Winter ice-crossing charter", "Documentary-photography support"],
    priceFrom: 2900,
    priceTo: 4800,
  },
  {
    slug: "imperial-road",
    title: "The Imperial Road",
    category: "Historical & Cultural",
    hook: "Follow the empire's spine from the capital to Karakorum — the city that once ruled from the Pacific to the Danube.",
    region: "Ulaanbaatar · Karakorum · Orkhon Valley",
    image: "/1.jpg",
    gallery: ["/1.jpg", "/5.jpg", "/8.jpg", "/7.jpg"],
    days: 7,
    distanceKm: 680,
    difficulty: "Apprentice",
    terrain: "Graded roads, the Orkhon valley, old capital plain",
    season: "May – October",
    requiredVehicle: "van",
    vehicleOptions: ["van", "suv", "land-cruiser"],
    recommendedRank: "Novice",
    activities: ["Museum & ruin walks", "Karakorum & Erdene Zuu", "Orkhon waterfall", "Deer-stone & old graves"],
    highlights: [
      "Karakorum, capital of the largest land empire in history",
      "The Orkhon valley, a UNESCO cradle of steppe civilisation",
      "Bronze-age deer stones and Turkic memorials",
    ],
    naturalPoints: ["Orkhon waterfall", "Orkhon valley"],
    culturalPoints: ["Karakorum ruins", "Erdene Zuu monastery", "Deer-stone fields", "National museum"],
    spiritualPoints: ["Erdene Zuu's living monastery", "Memorial ovoo of the old khans"],
    overview: [
      "A road through the country's own memory — from the museums of the capital to Karakorum, the modest plain from which the Mongol empire once ruled half the known world.",
      "Easy ground, but dense with history: imperial ruins, monastery walls, bronze-age standing stones, and the great Orkhon valley where steppe empires have risen for three thousand years.",
    ],
    included: ["Vehicle & historian-guide", "All site & museum fees", "Ger camps & guesthouses", "Daily breakfast & dinner"],
    addOns: ["Private archaeologist for a day", "Naadam-festival timing (July)", "Orkhon waterfall camp"],
    priceFrom: 1500,
    priceTo: 2700,
  },
  {
    slug: "custom-charter",
    title: "Your Own Charter",
    category: "Custom",
    hook: "None of these is quite your Mongolia? Then we draw a new road — from the first kilometre upward.",
    region: "Anywhere the country reaches",
    image: "/7.jpg",
    gallery: ["/7.jpg", "/1.jpg", "/3.jpg", "/4.jpg"],
    days: 0,
    distanceKm: 0,
    difficulty: "Novice",
    terrain: "Designed around you",
    season: "Any — chosen by the road, not the calendar",
    requiredVehicle: "land-cruiser",
    vehicleOptions: ["suv", "land-cruiser", "van", "horse-support", "expedition-moto"],
    recommendedRank: "Master",
    activities: ["Whatever the country can offer", "Built from your answers"],
    highlights: [
      "A road designed from scratch, not chosen from a shelf",
      "Any region, any season, any rhythm",
      "Vehicle, host and guide matched to the route we draw together",
    ],
    naturalPoints: ["Your choosing"],
    culturalPoints: ["Your choosing"],
    spiritualPoints: ["Your choosing"],
    overview: [
      "Every charter is built from the road upward — and sometimes the road does not exist yet. Tell us the Mongolia you came to meet, and we will draw it.",
      "Send a raven describing the kind of journey you want; we reply with a route, a vehicle, a host and a guide matched to it. The whole journey is the product — not a package off a shelf.",
    ],
    included: ["A route designed for you", "Vehicle matched to the road", "Host & guide matched to the experience", "A written charter before you pay"],
    addOns: ["Anything the country can honestly offer"],
    priceFrom: 0,
    priceTo: 0,
  },
];

export function getJourney(slug: string): Journey | undefined {
  return JOURNEYS.find((j) => j.slug === slug);
}

export function journeysByCategory(category: JourneyCategory | "All"): Journey[] {
  if (category === "All") return JOURNEYS;
  return JOURNEYS.filter((j) => j.category === category);
}

export function journeysForInterest(interest: Interest, pool: Journey[] = JOURNEYS): Journey[] {
  return pool.filter(
    (j) => interest.categories.includes(j.category) && j.category !== "Custom"
  );
}

export function guideMeetsRank(guide: Guide, journey: Journey): boolean {
  return LEVEL_ORDER[guide.level] >= LEVEL_ORDER[journey.recommendedRank];
}

export function guideFitsCategory(guide: Guide, journey: Journey): boolean {
  return guide.suitableCategories.includes(journey.category);
}

/** Every guide, sorted so the best-matched (fits the country AND holds the
 *  rank) lead, then those who hold the rank, then the rest. The wizard uses
 *  `guideMeetsRank` to mark guides who cannot yet lead this road. */
export function guidesForJourney(journey: Journey, pool: Guide[] = GUIDES): Guide[] {
  const score = (g: Guide) =>
    (guideFitsCategory(g, journey) ? 2 : 0) +
    (guideMeetsRank(g, journey) ? 1 : 0) +
    LEVEL_ORDER[g.level] / 10;
  return [...pool].sort((a, b) => score(b) - score(a));
}
