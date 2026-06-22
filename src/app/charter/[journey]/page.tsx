import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CharterWizard from "@/components/CharterWizard";
import { JOURNEYS, CATEGORY_SIGIL } from "@/lib/journeys";
import { fetchJourney } from "@/lib/api";

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

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      <section className="relative pt-36 pb-12 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <Link
            href={`/journeys/${journey.slug}`}
            className="font-accent italic text-muted hover:text-accent text-[12px] tracking-[0.25em] uppercase transition-colors"
          >
            ← {journey.title}
          </Link>
          <p className="mt-6 font-accent italic text-accent text-[13px] tracking-[0.4em] uppercase">
            {CATEGORY_SIGIL[journey.category]} Build Your Charter
          </p>
          <h1 className="mt-3 font-heading text-3xl sm:text-5xl uppercase tracking-[0.08em] text-foreground ember-text-glow leading-tight">
            From the road upward
          </h1>
          <p className="mt-5 text-foreground/85 text-[17px] max-w-xl mx-auto italic font-serif leading-relaxed">
            The road is chosen. Now we build the rest of the charter around it —
            the vehicle, then the guide, then the raven.
          </p>
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
