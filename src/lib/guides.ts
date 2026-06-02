export type GuideLevel = "Apprentice" | "Novice" | "Master" | "Guildmaster";

export type Specialization =
  | "Gobi"
  | "Lake"
  | "Extreme"
  | "Urban"
  | "Adventurous";

export const LEVEL_ORDER: Record<GuideLevel, number> = {
  Apprentice: 1,
  Novice: 2,
  Master: 3,
  Guildmaster: 4,
};

export const SPECIALIZATION_SIGIL: Record<Specialization, string> = {
  Gobi: "☼",
  Lake: "≈",
  Extreme: "▲",
  Urban: "✦",
  Adventurous: "✧",
};

export const SPECIALIZATION_BLURB: Record<Specialization, string> = {
  Gobi: "Singing dunes, camel paths, salt flats and the patient emptiness of the south.",
  Lake: "Khövsgöl's mirror waters, reindeer people of the taiga, pine and snow.",
  Extreme: "High passes, winter expeditions, the cold mountains that test a traveler.",
  Urban: "Ulaanbaatar after dark — markets, monasteries, smoke-lit tea houses.",
  Adventurous: "Many regions, many seasons. A grand tour for those who refuse to choose.",
};

export type Quest = {
  name: string;
  region: string;
  difficulty: GuideLevel;
  days: number;
  description: string;
};

export type Guide = {
  slug: string;
  name: string;
  title: string;
  level: GuideLevel;
  specialization: Specialization;
  homeRegion: string;
  yearsRiding: number;
  portrait: string;
  tagline: string;
  lore: string[];
  signatureHorse: string;
  talisman: string;
  seasonalWindow: string;
  languages: string[];
  openingScene: string;
  patronQuote: {
    text: string;
    by: string;
    charter: string;
  };
  quests: Quest[];
};

export const GUIDES: Guide[] = [
  {
    slug: "vanya",
    name: "Vanya Bazarvaana",
    title: "First Among Riders · Founder of the Guild",
    level: "Guildmaster",
    specialization: "Adventurous",
    homeRegion: "Khentii",
    yearsRiding: 30,
    portrait: "/1.jpg",
    tagline:
      "He walks this country like a man reading a book he himself wrote — quietly, slowly, and never twice in the same direction.",
    lore: [
      "Vanya was born in a felt ger on the upper Onon, an hour's ride from where Temüjin — the boy who became Genghis Khan — is said to have been born. The river was his first teacher; the long grass, his second.",
      "He rode alone for fifteen years before founding the Guild. Embassies, scholars, monks, silent travelers; in time he stopped distinguishing among them. Each was simply a traveler who needed a road.",
      "He speaks little. He remembers each mountain pass by the colour of its stone, each river by the way it freezes, each ger by whose tea is poured first. The other guides — Oyuna, Tüvshin, Ganbold, Enkhjin, Sükhbaatar — were all named by him. The Guild names only one Guildmaster at a time, and he carries that name lightly, like an extra coat.",
    ],
    signatureHorse: "Tüümen — an ageless steel-grey gelding",
    talisman: "A bronze gerege — the passport tablet that names the Guild",
    seasonalWindow: "Open year-round; chooses by the patron, not the calendar",
    languages: ["Mongolian", "English", "Russian", "a little Kazakh"],
    openingScene:
      "Your first night with Vanya begins in a ger he has known for twenty years. The host's mother pours suutei tsai before you have unbuttoned your coat. Vanya says almost nothing. By the third bowl, you will have asked him three questions and he will have answered four.",
    patronQuote: {
      text: "I have travelled with maybe forty guides in twenty countries. Vanya is the only one who made the country feel like it was his to lend.",
      by: "M. Reinhardt",
      charter: "The Long Charter, 2019",
    },
    quests: [
      {
        name: "The Long Charter",
        region: "Khentii → Gobi → Khövsgöl",
        difficulty: "Guildmaster",
        days: 21,
        description:
          "A three-week traverse of the country's bones — steppe, desert, and the cold lake. By horse, jeep, and on foot. The single charter Vanya never refuses.",
      },
      {
        name: "Eight Lakes of the Khangai",
        region: "Khangai Mountains",
        difficulty: "Master",
        days: 10,
        description:
          "A circle through the high lakes. Volcanic stone, larch forest, and water older than any kingdom that ever wrote its name down.",
      },
      {
        name: "The Birthplace Ride",
        region: "Onon River, Khentii",
        difficulty: "Novice",
        days: 6,
        description:
          "A slow ride through the country where Vanya was born. Small fires, old songs, no schedule beyond the next hill.",
      },
    ],
  },
  {
    slug: "oyuna",
    name: "Oyuna Tserendolgor",
    title: "Mistress of the Singing Sand",
    level: "Master",
    specialization: "Gobi",
    homeRegion: "Ömnögovi",
    yearsRiding: 16,
    portrait: "/2.jpg",
    tagline:
      "She knows where the dunes hum at dusk, and which wells have not yet gone bitter.",
    lore: [
      "Oyuna grew up between camels and dust, the eldest daughter of a herder family that crossed the Khongor sands twice a year. She learned to read the desert before she learned to read script.",
      "She has led patrons across the singing dunes, through the ice canyon of Yolyn Am in midsummer, and along old caravan tracks the printed maps no longer name. She knows which wells still pour sweet, and which ones the goats refuse to drink from.",
      "In her saddle bag: dried curd, a small bone whistle her grandmother gave her, and three folded pages of poems she has not yet shown anyone alive.",
    ],
    signatureHorse: "A two-humped Bactrian called Nogoon — the green one",
    talisman: "A bone whistle that calls camels back at dusk",
    seasonalWindow: "April through October — the desert sleeps in winter",
    languages: ["Mongolian", "English", "some Mandarin"],
    openingScene:
      "Your first evening with Oyuna ends on the ridge of the Khongor dunes. She does not speak. The sand begins to hum — a low, dry harmony that you will hear in your chest before you hear it in your ears. She has waited for this sound with patrons sixty times. She still smiles each time.",
    patronQuote: {
      text: "She handed me a bowl of curd, pointed at a dune, and said: 'When the wind comes from there, the sand will sing.' Twenty minutes later, it did.",
      by: "J. Almeida",
      charter: "Khongor Dunes Crossing, 2022",
    },
    quests: [
      {
        name: "Khongor Dunes Crossing",
        region: "Southern Gobi",
        difficulty: "Master",
        days: 7,
        description:
          "Camel-led traverse of the singing dunes, with nights in nomadic camps and a climb at first light when the sand is still cold enough to walk.",
      },
      {
        name: "Three Camels Charter",
        region: "Gobi-Altai",
        difficulty: "Novice",
        days: 4,
        description:
          "A gentle introduction to the desert — Yolyn Am, the Flaming Cliffs at sunset, and a slow caravan to the wells.",
      },
    ],
  },
  {
    slug: "tuvshin",
    name: "Tüvshin Erdene",
    title: "Boatman of the Blue Pearl",
    level: "Master",
    specialization: "Lake",
    homeRegion: "Khövsgöl",
    yearsRiding: 19,
    portrait: "/3.jpg",
    tagline:
      "Spends winter on the ice, summer on the water. Sleeps best beneath pine.",
    lore: [
      "Tüvshin was raised among the Tsaatan reindeer people of the northern taiga before he was apprenticed to the Guild. He still keeps a felt tent there, north of Tsagaannuur, and visits whenever a charter brings him within a hundred kilometres.",
      "He guides patrons across Lake Khövsgöl by horse, foot and small boat, and into the shadowed taiga where reindeer still pull sleds across the snow. In summer his charters end with fish smoked over alder; in winter, with vodka and the absolute silence that only frozen water knows.",
      "He sings sometimes. Mostly when no one has asked him to.",
    ],
    signatureHorse: "A taiga-bred bay named Khairhan",
    talisman: "A reindeer-antler ladle, carved by his grandmother",
    seasonalWindow: "Year-round; winter ice from December to March is his favourite season",
    languages: ["Mongolian", "Tsaatan dialect", "English"],
    openingScene:
      "Your first evening with Tüvshin ends in a Tsaatan tent, on reindeer-hide cushions, drinking tea made with milk from the herd grazing twenty paces away. The herder's children watch you the way deer watch a wolf — politely, and without fear.",
    patronQuote: {
      text: "He took us out on the lake at dawn in a wooden boat that he had built himself. He pointed at one island and said: 'That one has a story.' That was the whole sentence. The story took the rest of the day.",
      by: "L. Tanaka",
      charter: "The Blue Pearl Circuit, 2023",
    },
    quests: [
      {
        name: "The Blue Pearl Circuit",
        region: "Lake Khövsgöl",
        difficulty: "Master",
        days: 9,
        description:
          "Around and across the lake — horseback along the eastern shore, boat to the western forests, taiga camp with reindeer herders.",
      },
      {
        name: "Tsaatan Charter",
        region: "Taiga north of Tsagaannuur",
        difficulty: "Novice",
        days: 5,
        description:
          "A respectful visit to the reindeer people; learn the wood-smoke and the silence.",
      },
      {
        name: "Frozen Lake Ride",
        region: "Lake Khövsgöl in winter",
        difficulty: "Master",
        days: 6,
        description:
          "Cross the lake on its ice. Ice-thick as a man is tall. Cold so clear it sounds like glass when you walk.",
      },
    ],
  },
  {
    slug: "ganbold",
    name: "Ganbold Sükh",
    title: "He Who Walks the Cold",
    level: "Master",
    specialization: "Extreme",
    homeRegion: "Bayan-Ölgii",
    yearsRiding: 14,
    portrait: "/4.jpg",
    tagline:
      "The Altai eagle-hunters call him cousin. The winter calls him by name.",
    lore: [
      "Ganbold guides the high western passes — Tavan Bogd, the glaciers, the Kazakh eagle-hunter winter festivals. He has summited Khüiten more times than he can be persuaded to count.",
      "He learned mountaineering from a Russian climber who got stuck in his uncle's ger for a week one January. By the time the storm broke, the Russian had taught him three knots and the boy had taught the Russian the names of every peak visible from the doorway. They have written to each other every year since.",
      "He will not take a patron who has not slept a single cold night. He turns away ten charters a year because of this. He sleeps fine.",
    ],
    signatureHorse: "A short, fierce mountain pony named Borog",
    talisman: "A silver-clasped wolf-tooth, given to him by his uncle",
    seasonalWindow: "Best September through March; high passes only open in late summer",
    languages: ["Mongolian", "Kazakh", "English", "some Russian"],
    openingScene:
      "Your first night with Ganbold ends in a felt tent set against snow so bright the moon has nothing to add. He hands you tea, then a bowl of mutton broth, then a fur. He says: 'Sleep first. The eagles wait until morning.' He is, you discover later, technically correct.",
    patronQuote: {
      text: "He told me to walk thirty paces away from the camp and turn around. I did. He had built a fire while I was looking at the stars. I did not see him strike a single match.",
      by: "P. Caron",
      charter: "Tavan Bogd Expedition, 2021",
    },
    quests: [
      {
        name: "Tavan Bogd Expedition",
        region: "Altai Mountains",
        difficulty: "Master",
        days: 12,
        description:
          "Trek to the foot of the Five Sacred Peaks, glacier walks, and a hard climb for those ready for the cold.",
      },
      {
        name: "Eagle Hunters' Winter",
        region: "Bayan-Ölgii",
        difficulty: "Novice",
        days: 6,
        description:
          "Ride with Kazakh hunters during the winter festival. Felt tents, fire, and golden eagles on the wrist.",
      },
    ],
  },
  {
    slug: "enkhjin",
    name: "Enkhjin Bat",
    title: "Lantern of the Capital",
    level: "Novice",
    specialization: "Urban",
    homeRegion: "Ulaanbaatar",
    yearsRiding: 6,
    portrait: "/5.jpg",
    tagline:
      "Knows every monastery, every back-alley dumpling stall, every poet still drinking after midnight.",
    lore: [
      "Enkhjin grew up in a panel-block apartment three streets behind Gandan monastery. She remembers the city when the cars were Russian and the music was banned, and the city now, when the cars are German and the music is everywhere.",
      "She guides patrons through Ulaanbaatar's older bones — the temples, the markets behind the State Department Store, the basements where contemporary throat-singers play to twenty drunk listeners on a Tuesday.",
      "She thinks of the city as a great unfinished book. She wants you to know she is not its author. She is reading it with you.",
    ],
    signatureHorse: "A 1991 Russian-built UAZ named Khar — the black one",
    talisman: "A folded city map from 1989, annotated by her grandfather",
    seasonalWindow: "Open year-round; winter UB has a clarity she prefers",
    languages: ["Mongolian", "English", "Russian", "Korean"],
    openingScene:
      "Your first night with Enkhjin ends at a basement music bar in the old district. The throat-singer is sober. The bartender is not. Enkhjin orders for you without asking, because the menu is in three languages and none of them are yours.",
    patronQuote: {
      text: "She walked us through the markets at six in the morning, when the meat was still steaming and the older women were arguing about cabbage prices. I have been to thirty cities. None of them have felt this present.",
      by: "A. Verghese",
      charter: "The City After Dark, 2024",
    },
    quests: [
      {
        name: "The City After Dark",
        region: "Ulaanbaatar",
        difficulty: "Apprentice",
        days: 3,
        description:
          "Three evenings through Ulaanbaatar — temple, market, tea house, music room.",
      },
      {
        name: "Capital and Steppe",
        region: "Ulaanbaatar → Terelj",
        difficulty: "Novice",
        days: 5,
        description:
          "Two days in the city, three in the nearby steppe — for travelers who want both faces of the country.",
      },
    ],
  },
  {
    slug: "sukhbaatar",
    name: "Sükhbaatar Dorj",
    title: "Apprentice of the Long Road",
    level: "Apprentice",
    specialization: "Adventurous",
    homeRegion: "Arkhangai",
    yearsRiding: 2,
    portrait: "/6.jpg",
    tagline:
      "Young, eager, fluent in three languages. Will ride further than asked, and ask no payment for the extra hour.",
    lore: [
      "Newest to the Guild. Apprenticed under Vanya himself, who selected him from a stack of letters one winter and has been quietly proud of him ever since.",
      "Sükhbaatar leads gentler routes for patrons new to the country — close to the city, never far from a warm ger. He pairs well with first-time travelers who want a friend, not a teacher.",
      "He carries a small notebook everywhere. He writes the names of every patron he guides, the name of their parents if they offer it, and the names of every horse they ride. He has filled two notebooks.",
    ],
    signatureHorse: "A young chestnut he is still finding a name for",
    talisman: "A small leather notebook, given to him by Vanya",
    seasonalWindow: "May through October — winter charters under a Master only",
    languages: ["Mongolian", "English", "French", "a little German"],
    openingScene:
      "Your first night with Sükhbaatar ends in a small family ger an hour from the city. He plays a wooden flute, badly. The herder's grandfather plays a horsehair fiddle, well. By the end, you can no longer tell which one of them is leading the song.",
    patronQuote: {
      text: "He is the youngest guide I have ever had. He is also the only one who, on the last evening, asked me what I thought he could have done better. I told him 'nothing.' He wrote it down.",
      by: "S. Park",
      charter: "Arkhangai Loop, 2025",
    },
    quests: [
      {
        name: "Terelj Charter",
        region: "Gorkhi-Terelj National Park",
        difficulty: "Apprentice",
        days: 4,
        description:
          "Granite cliffs, slow rivers, and an easy first taste of riding under Mongolian sky.",
      },
      {
        name: "Arkhangai Loop",
        region: "Arkhangai",
        difficulty: "Apprentice",
        days: 5,
        description:
          "Soft hills, hot springs, monasteries. The country gently introducing itself.",
      },
    ],
  },
];

export const LEVELS: GuideLevel[] = [
  "Apprentice",
  "Novice",
  "Master",
  "Guildmaster",
];

export const SPECIALIZATIONS: Specialization[] = [
  "Gobi",
  "Lake",
  "Extreme",
  "Urban",
  "Adventurous",
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
