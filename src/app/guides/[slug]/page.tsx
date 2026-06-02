import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  GUIDES,
  getGuide,
  SPECIALIZATION_BLURB,
  SPECIALIZATION_SIGIL,
} from "@/lib/guides";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* Portrait + Identity */}
      <section className="relative pt-40 pb-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[420px_1fr] gap-12 items-start">
          <div className="relative">
            <div className="relative vignette border border-highlight/40 ember-glow">
              <img
                src={guide.portrait}
                alt={guide.name}
                className="w-full h-[520px] object-cover grayscale-[15%] sepia-[25%] brightness-[0.95]"
              />
            </div>
            {/* Wax seal on portrait corner */}
            <div className="absolute -bottom-5 -right-5 w-16 h-16 rounded-full bg-[#7a2a18] border-[3px] border-[#3a1108] flex items-center justify-center font-heading text-foreground text-[16px] tracking-widest shadow-[0_4px_14px_rgba(0,0,0,0.7)] rotate-[-12deg]">
              GG
            </div>
          </div>

          <div>
            <p className="font-accent italic text-accent text-[14px] tracking-[0.3em] uppercase">
              {guide.level}
            </p>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl uppercase tracking-[0.1em] text-foreground mt-3 ember-text-glow leading-[1.05]">
              {guide.name}
            </h1>
            <p className="font-accent italic text-muted text-[17px] sm:text-[18px] mt-3">
              {guide.title}
            </p>

            <div className="ink-divider my-8" />

            <dl className="grid grid-cols-2 gap-y-5 gap-x-8 font-accent text-[13px] tracking-[0.18em] uppercase">
              <Field
                label="Country"
                value={`${SPECIALIZATION_SIGIL[guide.specialization]}  ${guide.specialization}`}
              />
              <Field label="Home Region" value={guide.homeRegion} />
              <Field label="Years Riding" value={`${guide.yearsRiding}`} />
              <Field label="Rank" value={guide.level} />
            </dl>

            <p className="mt-10 text-foreground/95 text-[19px] leading-[1.85] italic font-serif">
              &ldquo;{guide.tagline}&rdquo;
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href={`mailto:hello@geregeguild.mn?subject=Charter%20with%20${encodeURIComponent(guide.name)}`}
                className="px-8 py-4 border border-accent bg-accent/10 hover:bg-accent hover:text-background transition-all duration-500 font-accent text-[12px] tracking-[0.3em] uppercase text-foreground ember-glow"
              >
                Send a Raven to {guide.name.split(" ")[0]}
              </a>
              <Link
                href="/guides"
                className="px-8 py-4 border border-highlight/50 hover:border-accent transition-all duration-500 font-accent text-[12px] tracking-[0.3em] uppercase text-muted hover:text-foreground"
              >
                ← Back to the Roster
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sigils strip — the small details of this guide */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="ink-divider mb-10" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-8 text-center">
            <Sigil label="Companion" sigil="♞" value={guide.signatureHorse} />
            <Sigil label="Talisman" sigil="✦" value={guide.talisman} />
            <Sigil label="Season" sigil="☉" value={guide.seasonalWindow} />
            <Sigil
              label="Tongues"
              sigil="ᚱ"
              value={guide.languages.join(" · ")}
            />
          </div>
          <div className="ink-divider mt-12" />
        </div>
      </section>

      {/* Opening scene */}
      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-accent italic text-accent text-[13px] tracking-[0.3em] uppercase mb-6">
            How the first night begins
          </p>
          <p className="text-foreground/95 text-[20px] leading-[1.95] font-serif italic">
            {guide.openingScene}
          </p>
        </div>
      </section>

      {/* Lore — multi-paragraph */}
      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto">
          <p className="font-accent italic text-accent text-[13px] tracking-[0.3em] uppercase mb-6 text-center">
            The Lore
          </p>
          <div className="space-y-6">
            {guide.lore.map((p, i) => (
              <p
                key={i}
                className="text-foreground/95 text-[19px] leading-[1.95] font-serif"
              >
                {i === 0 && (
                  <span
                    className="float-left mr-3 mt-2 text-accent text-[64px] leading-[0.85] font-heading"
                    style={{ fontFamily: "var(--font-cinzel), serif" }}
                  >
                    {p.charAt(0)}
                  </span>
                )}
                {i === 0 ? p.slice(1) : p}
              </p>
            ))}
          </div>
          <p className="mt-10 text-muted text-[15px] italic text-center font-accent tracking-[0.2em]">
            {SPECIALIZATION_BLURB[guide.specialization]}
          </p>
        </div>
      </section>

      {/* Patron quote — pull quote style */}
      <section className="px-6 pb-28">
        <div className="max-w-4xl mx-auto">
          <div className="ink-divider mb-12" />
          <figure className="text-center">
            <div className="font-heading text-accent text-6xl mb-4 leading-none">
              &ldquo;
            </div>
            <blockquote className="text-foreground/95 text-[22px] sm:text-[26px] leading-[1.5] font-serif italic max-w-3xl mx-auto">
              {guide.patronQuote.text}
            </blockquote>
            <figcaption className="mt-8 font-accent italic text-accent text-[13px] tracking-[0.3em] uppercase">
              — {guide.patronQuote.by}
            </figcaption>
            <p className="mt-2 font-accent italic text-muted text-[12px] tracking-[0.25em] uppercase">
              {guide.patronQuote.charter}
            </p>
          </figure>
          <div className="ink-divider mt-12" />
        </div>
      </section>

      {/* Quests */}
      <section className="px-6 pb-32">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="font-accent italic text-accent text-[13px] tracking-[0.3em] uppercase">
              Charters led by {guide.name.split(" ")[0]}
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl uppercase tracking-[0.1em] mt-3">
              The Quests
            </h2>
            <div className="ink-divider mt-8 max-w-md mx-auto" />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {guide.quests.map((q) => (
              <article
                key={q.name}
                className="border border-highlight/40 bg-surface/50 p-7 ember-glow hover:border-accent/70 transition-colors duration-500 group"
              >
                <div className="flex items-center justify-between font-accent text-[11px] tracking-[0.25em] uppercase text-muted mb-3">
                  <span>{q.difficulty}</span>
                  <span>{q.days} days</span>
                </div>
                <h3 className="font-heading text-2xl uppercase tracking-[0.08em] text-foreground group-hover:text-accent transition-colors duration-500">
                  {q.name}
                </h3>
                <p className="font-accent italic text-accent text-[13px] mt-1">
                  {q.region}
                </p>
                <div className="ink-divider my-5" />
                <p className="text-foreground/85 text-[16px] leading-relaxed font-serif">
                  {q.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted text-[11px]">{label}</dt>
      <dd className="text-foreground mt-1 text-[15px]">{value}</dd>
    </div>
  );
}

function Sigil({
  label,
  sigil,
  value,
}: {
  label: string;
  sigil: string;
  value: string;
}) {
  return (
    <div>
      <div className="text-accent text-3xl mb-3 leading-none">{sigil}</div>
      <p className="font-accent italic text-[11px] tracking-[0.3em] uppercase text-muted mb-2">
        {label}
      </p>
      <p className="font-serif italic text-foreground/90 text-[15px] leading-snug max-w-[200px] mx-auto">
        {value}
      </p>
    </div>
  );
}
