import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CharterWizard from "@/components/CharterWizard";
import { JOURNEYS, CATEGORY_SIGIL } from "@/lib/journeys";
import { fetchJourney } from "@/lib/api";
import { formatPriceRange } from "@/lib/format";

export function generateStaticParams() {
  // Build-time param list — local lib so `next build` doesn't depend on the API.
  return JOURNEYS.map((j) => ({ journey: j.slug }));
}

export default async function CharterPage({
  params,
}: {
  params: Promise<{ journey: string }>;
}) {
  const { journey: slug } = await params;
  const journey = await fetchJourney(slug);
  if (!journey) notFound();

  const isCustom = journey.category === "Custom";

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* ─── Chapter head — the shell before the wizard.
           A quiet illuminated heading with a small ledger of what
           has already been chosen (the road), so the wizard doesn't
           feel dropped in from nowhere. */}
      <section className="relative pt-36 pb-10 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <Link
            href={`/journeys/${journey.slug}`}
            className="font-accent italic text-muted hover:text-accent text-[12px] tracking-[0.25em] uppercase transition-colors"
          >
            ← {journey.title}
          </Link>
          <p className="mt-6 font-accent italic text-accent text-[13px] tracking-[0.4em] uppercase">
            <span aria-hidden className="mr-2">{CATEGORY_SIGIL[journey.category]}</span>
            Build your charter
          </p>
          <h1 className="mt-3 font-heading text-3xl sm:text-5xl uppercase tracking-[0.08em] text-foreground ember-text-glow leading-tight">
            From the road upward
          </h1>
          <p className="mt-5 text-foreground/85 text-[17px] max-w-xl mx-auto italic font-serif leading-relaxed">
            The road is chosen. Now we build the rest of the charter around it —
            the vehicle, then the guide, then the raven.
          </p>

          {/* Slim brass ledger — the road already in your pocket */}
          {!isCustom && (
            <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-y border-highlight/25 px-6 py-3">
              <ChapterFact label="Region" value={journey.region} />
              <ChapterDot />
              <ChapterFact label="Days" value={`${journey.days}`} />
              <ChapterDot />
              <ChapterFact label="Difficulty" value={journey.difficulty} />
              <ChapterDot />
              <ChapterFact
                label="From"
                value={formatPriceRange(journey.priceFrom, journey.priceTo)}
              />
            </div>
          )}
        </div>
        <div className="ink-divider mt-12 max-w-3xl mx-auto" />
      </section>

      <section className="px-6 pb-32">
        <CharterWizard journey={journey} />
      </section>

      <Footer />
    </main>
  );
}

function ChapterFact({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span className="font-accent uppercase tracking-[0.2em] text-[10px] text-muted">
        {label}
      </span>
      <span className="font-heading text-foreground text-[13px] tracking-[0.05em]">
        {value}
      </span>
    </span>
  );
}

function ChapterDot() {
  return (
    <span aria-hidden className="text-accent/50 text-[10px] leading-none">
      ✦
    </span>
  );
}
