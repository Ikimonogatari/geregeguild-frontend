import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GuideRankBadge from "@/components/GuideRankBadge";
import JourneyMap from "@/components/JourneyMap";
import Reveal from "@/components/Reveal";
import JourneyContinueRibbon from "./JourneyContinueRibbon";
import {
  JOURNEYS,
  guidesForJourney,
  guideMeetsRank,
  CATEGORY_SIGIL,
  DIFFICULTY_BLURB,
  GUIDE_MEDAL,
} from "@/lib/journeys";
import { fetchJourney, fetchVehicle, fetchGuides } from "@/lib/api";
import { formatPriceRange } from "@/lib/format";

export function generateStaticParams() {
  // Build-time param list: keep using the local lib so static generation
  // doesn't depend on the backend being reachable during `next build`.
  return JOURNEYS.map((j) => ({ slug: j.slug }));
}

export default async function JourneyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const journey = await fetchJourney(slug);
  if (!journey) notFound();

  const isCustom = journey.category === "Custom";
  const [requiredVehicle, otherVehiclesRaw, allGuides] = await Promise.all([
    fetchVehicle(journey.requiredVehicle),
    Promise.all(
      journey.vehicleOptions
        .filter((id) => id !== journey.requiredVehicle)
        .map((id) => fetchVehicle(id)),
    ),
    fetchGuides(),
  ]);
  const otherVehicles = otherVehiclesRaw.filter(Boolean);
  const guides = guidesForJourney(journey, allGuides).filter((g) =>
    guideMeetsRank(g, journey),
  );
  const medal = GUIDE_MEDAL[journey.recommendedRank];

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <JourneyContinueRibbon
        title={journey.title}
        href={`/charter/${journey.slug}`}
      />

      {/* ─── Hero plate — illuminated title on a warmed landscape ─── */}
      <section className="relative h-[68vh] min-h-[480px] w-full overflow-hidden">
        <img
          src={journey.image}
          alt={journey.title}
          className="absolute inset-0 w-full h-full object-cover grayscale-[14%] sepia-[26%] brightness-[0.66]"
        />
        {/* Warm veil + top ember + bottom fade to background */}
        <div className="absolute inset-0 bg-[#0D0A07]/60" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0D0A07]/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent to-background" />
        {/* Vignette wash — corners into darkness */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 50%, transparent 55%, rgba(13,10,7,0.75) 100%)",
          }}
        />

        <div className="relative z-10 h-full max-w-6xl mx-auto px-6 flex flex-col justify-end pb-16">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="text-accent text-xl leading-none">
              {CATEGORY_SIGIL[journey.category]}
            </span>
            <span className="font-accent uppercase tracking-[0.32em] text-[11px] text-foreground/90">
              {journey.category} · {journey.region}
            </span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl uppercase tracking-[0.06em] text-foreground ember-text-glow candle-flicker leading-[1.05] max-w-4xl">
            {journey.title}
          </h1>
          {/* An ink flourish beneath the title — the mark of the master */}
          <div
            aria-hidden
            className="mt-5 h-px w-40 origin-left"
            style={{
              background:
                "linear-gradient(90deg, rgba(201,146,42,0.9), rgba(201,146,42,0) 100%)",
              filter: "drop-shadow(0 0 6px rgba(201,146,42,0.55))",
            }}
          />
          <p className="mt-5 text-foreground/90 text-[18px] sm:text-[20px] max-w-2xl italic font-serif leading-relaxed">
            {journey.hook}
          </p>
        </div>
      </section>

      {/* ─── Stat ribbon ─── */}
      {!isCustom && (
        <section className="px-6 -mt-2">
          <Reveal
            kind="fade"
            className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-8 gap-x-6 border-y border-highlight/30 py-9"
          >
            <Stat label="Distance" value={`${journey.distanceKm} km`} />
            <Stat label="Days" value={`${journey.days}`} />
            <Stat label="Difficulty" value={journey.difficulty} />
            <Stat label="Terrain" value={journey.terrain.split(",")[0]} />
            <Stat label="Best season" value={journey.season.split("·")[0].trim()} />
            <Stat
              label="From"
              value={formatPriceRange(journey.priceFrom, journey.priceTo)}
            />
          </Reveal>
        </section>
      )}

      {/* ─── Overview + map ─── */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1.4fr] gap-12 items-start">
          <Reveal kind="rise">
            <SectionEyebrow>The Road</SectionEyebrow>
            <div className="space-y-5">
              {journey.overview.map((p, i) => (
                <p key={i} className="text-foreground/90 text-[18px] leading-[1.85] font-serif">
                  {p}
                </p>
              ))}
            </div>

            {/* Activities */}
            <div className="mt-10">
              <SectionEyebrow small>On this road</SectionEyebrow>
              <div className="flex flex-wrap gap-2.5">
                {journey.activities.map((a) => (
                  <span
                    key={a}
                    className="px-4 py-2 border border-highlight/40 font-accent text-[12px] tracking-[0.12em] text-foreground/85 hover:border-accent/70 hover:text-foreground transition-colors duration-500"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Real route map — Leaflet tiles + OSRM driving polyline through
              the journey's actual lat/lon waypoints. Landscape plate so
              east-west routes (most of Mongolia) read naturally. */}
          <Reveal kind="blur" delay={0.05}>
            <div className="relative lg:sticky lg:top-28">
              <div className="relative border border-highlight/40 ember-glow vignette overflow-hidden aspect-[4/3] min-h-[420px] lg:min-h-[560px]">
                <JourneyMap journey={journey} />
              </div>
              <p className="mt-4 font-accent italic text-muted text-[13px] tracking-[0.15em] text-center">
                A full charted map travels with your written charter.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Highlights — natural / cultural / spiritual ─── */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="ink-divider mb-14" />
          <Reveal stagger={0.12} className="grid md:grid-cols-3 gap-12">
            <Reveal.Item>
              <PointColumn sigil="❂" title="Natural" points={journey.naturalPoints} />
            </Reveal.Item>
            <Reveal.Item>
              <PointColumn sigil="卍" title="Cultural" points={journey.culturalPoints} />
            </Reveal.Item>
            <Reveal.Item>
              <PointColumn sigil="☽" title="Spiritual" points={journey.spiritualPoints} />
            </Reveal.Item>
          </Reveal>
          {typeof journey.templeCount === "number" && (
            <Reveal kind="fade" delay={0.15}>
              <p className="mt-14 text-center font-accent italic text-accent text-[15px] tracking-[0.25em] uppercase">
                {journey.templeCount} monasteries &amp; temples on this road
              </p>
            </Reveal>
          )}
          <div className="ink-divider mt-14" />
        </div>
      </section>

      {/* ─── Difficulty + recommended rank ─── */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          <Reveal kind="rise">
            <div className="border border-highlight/40 bg-surface/50 p-8 ember-glow h-full">
              <p className="font-accent italic text-accent text-[12px] tracking-[0.3em] uppercase mb-4">
                Difficulty
              </p>
              <h3 className="font-heading text-2xl uppercase tracking-[0.08em] text-foreground">
                {journey.difficulty}
              </h3>
              <p className="mt-3 text-foreground/85 text-[16px] font-serif italic leading-relaxed">
                {DIFFICULTY_BLURB[journey.difficulty]}
              </p>
            </div>
          </Reveal>
          <Reveal kind="rise" delay={0.05}>
            <div className="border border-highlight/40 bg-surface/50 p-8 ember-glow h-full">
              <p className="font-accent italic text-accent text-[12px] tracking-[0.3em] uppercase mb-4">
                Recommended guide rank
              </p>
              <div className="flex items-center gap-4">
                <GuideRankBadge level={journey.recommendedRank} size="lg" />
                <div>
                  <h3
                    className="font-heading text-2xl uppercase tracking-[0.06em]"
                    style={{ color: medal.ring }}
                  >
                    {medal.name}
                  </h3>
                  <p className="font-accent italic text-muted text-[13px] tracking-[0.15em] uppercase">
                    {journey.recommendedRank} or above
                  </p>
                </div>
              </div>
              <p className="mt-4 text-foreground/85 text-[15px] font-serif italic leading-relaxed">
                {medal.blurb}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Vehicles ─── */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <Reveal kind="fade">
            <p className="font-accent italic text-accent text-[13px] tracking-[0.3em] uppercase mb-3 text-center">
              The Machine
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl uppercase tracking-[0.08em] text-center text-foreground">
              How this road is travelled
            </h2>
            <div className="ink-divider mt-8 mb-14 max-w-md mx-auto" />
          </Reveal>
          <Reveal stagger={0.1} className="grid md:grid-cols-2 gap-6">
            {requiredVehicle && (
              <Reveal.Item>
                <VehiclePanel
                  name={requiredVehicle.name}
                  sigil={requiredVehicle.sigil}
                  terrain={requiredVehicle.terrain}
                  passengers={requiredVehicle.passengers}
                  comfort={requiredVehicle.comfort}
                  priceImpact={requiredVehicle.priceImpact}
                  blurb={requiredVehicle.blurb}
                  primary
                />
              </Reveal.Item>
            )}
            {otherVehicles.map(
              (v) =>
                v && (
                  <Reveal.Item key={v.id}>
                    <VehiclePanel
                      name={v.name}
                      sigil={v.sigil}
                      terrain={v.terrain}
                      passengers={v.passengers}
                      comfort={v.comfort}
                      priceImpact={v.priceImpact}
                      blurb={v.blurb}
                    />
                  </Reveal.Item>
                ),
            )}
          </Reveal>
          <p className="mt-9 text-center font-accent italic text-muted text-[13px] tracking-[0.15em]">
            You choose the machine while building your charter.
          </p>
        </div>
      </section>

      {/* ─── Included + add-ons ─── */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
          <Reveal kind="rise">
            <SectionEyebrow>Your charter includes</SectionEyebrow>
            <ul className="space-y-3">
              {journey.included.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-foreground/90 text-[16px] font-serif leading-relaxed"
                >
                  <span className="text-accent mt-0.5 shrink-0">✦</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal kind="rise" delay={0.05}>
            <SectionEyebrow>Optional add-ons</SectionEyebrow>
            <ul className="space-y-3">
              {journey.addOns.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-muted text-[16px] font-serif leading-relaxed"
                >
                  <span className="text-highlight mt-0.5 shrink-0">+</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ─── Suitable guides preview — medallion tokens ─── */}
      {guides.length > 0 && (
        <section className="px-6 pb-20">
          <div className="max-w-6xl mx-auto">
            <div className="ink-divider mb-14" />
            <Reveal kind="fade">
              <p className="font-accent italic text-accent text-[13px] tracking-[0.3em] uppercase mb-3 text-center">
                The Person Who Knows the Way
              </p>
              <h2 className="font-heading text-3xl sm:text-4xl uppercase tracking-[0.08em] text-center text-foreground">
                Guides who can lead this road
              </h2>
              <p className="mt-4 mb-14 text-center font-accent italic text-muted text-[14px] tracking-[0.15em] max-w-xl mx-auto leading-relaxed">
                A guide is not the product. The whole journey is. You choose yours
                while building the charter.
              </p>
            </Reveal>
            <Reveal stagger={0.08} className="flex flex-wrap justify-center gap-4">
              {guides.map((g) => {
                const gm = GUIDE_MEDAL[g.level];
                return (
                  <Reveal.Item key={g.slug}>
                    <Link
                      href={`/guides/${g.slug}`}
                      className="flex items-center gap-4 border border-highlight/40 bg-surface/50 px-5 py-4 hover:border-accent/70 hover:bg-surface/70 transition-colors duration-500 group"
                    >
                      <span
                        className="relative inline-flex items-center justify-center shrink-0"
                        style={{ width: 56, height: 56 }}
                      >
                        <span
                          aria-hidden
                          className="absolute inset-0 rounded-full"
                          style={{
                            border: `1px solid ${gm.ring}`,
                            opacity: 0.35,
                          }}
                        />
                        <img
                          src={g.portrait}
                          alt={g.name}
                          className="w-14 h-14 rounded-full object-cover grayscale-[20%] sepia-[30%]"
                          style={{
                            border: `1.5px solid ${gm.ring}`,
                            boxShadow: `0 0 12px -3px ${gm.ring}`,
                          }}
                        />
                      </span>
                      <div>
                        <p className="font-heading uppercase tracking-[0.06em] text-foreground text-[16px] group-hover:text-accent transition-colors">
                          {g.name.split(" ")[0]}
                        </p>
                        <GuideRankBadge level={g.level} size="sm" withName />
                      </div>
                    </Link>
                  </Reveal.Item>
                );
              })}
            </Reveal>
          </div>
        </section>
      )}

      {/* ─── CTA — the warrant signature block ─── */}
      <section className="px-6 pb-32">
        <Reveal kind="scale">
          <div className="relative max-w-3xl mx-auto text-center border border-accent/30 bg-surface/60 px-8 py-16 ember-glow">
            {/* Corner tacks */}
            <span aria-hidden className="absolute top-2 left-2 w-3 h-3 border-l border-t border-accent/50" />
            <span aria-hidden className="absolute top-2 right-2 w-3 h-3 border-r border-t border-accent/50" />
            <span aria-hidden className="absolute bottom-2 left-2 w-3 h-3 border-l border-b border-accent/50" />
            <span aria-hidden className="absolute bottom-2 right-2 w-3 h-3 border-r border-b border-accent/50" />

            <p className="font-accent italic text-accent text-[13px] tracking-[0.3em] uppercase mb-4">
              From the road upward
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl uppercase tracking-[0.08em] text-foreground ember-text-glow">
              Build your charter
            </h2>
            <div
              aria-hidden
              className="mx-auto mt-6 h-px w-24"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(201,146,42,0.85), transparent)",
              }}
            />
            <p className="mt-6 text-foreground/90 text-[18px] font-serif italic leading-relaxed max-w-xl mx-auto">
              Your charter includes the road, the machine, the rhythm, and the
              person who knows the way. Choose your vehicle and guide next.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/charter/${journey.slug}`}
                className="group/build inline-flex items-center justify-center gap-3 px-12 py-5 border border-accent bg-accent/15 hover:bg-accent hover:text-background transition-all duration-500 font-accent text-[12px] tracking-[0.35em] uppercase text-foreground ember-glow wax-pulse"
              >
                Build this charter
                <span className="inline-block transition-transform duration-500 group-hover/build:translate-x-1">
                  ✦
                </span>
              </Link>
              <Link
                href="/journeys"
                className="px-12 py-5 border border-highlight/50 hover:border-accent transition-all duration-500 font-accent text-[12px] tracking-[0.35em] uppercase text-muted hover:text-foreground"
              >
                ← Other roads
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}

/* ────────────────────── Small pieces ────────────────────── */

function SectionEyebrow({
  children,
  small = false,
}: {
  children: React.ReactNode;
  small?: boolean;
}) {
  return (
    <div className={small ? "mb-4" : "mb-5"}>
      <p
        className={[
          "font-accent italic text-accent tracking-[0.3em] uppercase",
          small ? "text-[12px]" : "text-[13px]",
        ].join(" ")}
      >
        {children}
      </p>
      <span
        aria-hidden
        className="mt-2 block h-px w-14"
        style={{
          background:
            "linear-gradient(90deg, rgba(201,146,42,0.75), rgba(201,146,42,0) 100%)",
        }}
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="font-accent uppercase tracking-[0.22em] text-[10px] text-muted mb-1.5">
        {label}
      </p>
      <p className="font-heading text-foreground text-[18px] leading-none">
        {value}
      </p>
    </div>
  );
}

function PointColumn({
  sigil,
  title,
  points,
}: {
  sigil: string;
  title: string;
  points: string[];
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <span className="text-accent text-2xl leading-none">{sigil}</span>
        <h3 className="font-heading uppercase tracking-[0.12em] text-[18px] text-foreground">
          {title}
        </h3>
      </div>
      <span
        aria-hidden
        className="mb-4 block h-px w-10"
        style={{
          background:
            "linear-gradient(90deg, rgba(201,146,42,0.7), rgba(201,146,42,0) 100%)",
        }}
      />
      <ul className="space-y-2.5">
        {points.map((p) => (
          <li
            key={p}
            className="text-foreground/80 text-[15px] font-serif leading-snug"
          >
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}

function VehiclePanel({
  name,
  sigil,
  terrain,
  passengers,
  comfort,
  priceImpact,
  blurb,
  primary = false,
}: {
  name: string;
  sigil: string;
  terrain: string;
  passengers: string;
  comfort: string;
  priceImpact: string;
  blurb: string;
  primary?: boolean;
}) {
  return (
    <div
      className={[
        "relative border p-7 transition-colors duration-500 group/veh h-full overflow-hidden",
        primary
          ? "border-accent/60 bg-accent/[0.06] ember-glow"
          : "border-highlight/40 bg-surface/40 hover:border-accent/60",
      ].join(" ")}
    >
      {/* Corner brass ornaments */}
      <span
        aria-hidden
        className={[
          "absolute top-2 left-2 w-3 h-3 border-l border-t",
          primary ? "border-accent/60" : "border-highlight/50",
        ].join(" ")}
      />
      <span
        aria-hidden
        className={[
          "absolute top-2 right-2 w-3 h-3 border-r border-t",
          primary ? "border-accent/60" : "border-highlight/50",
        ].join(" ")}
      />
      <span
        aria-hidden
        className={[
          "absolute bottom-2 left-2 w-3 h-3 border-l border-b",
          primary ? "border-accent/60" : "border-highlight/50",
        ].join(" ")}
      />
      <span
        aria-hidden
        className={[
          "absolute bottom-2 right-2 w-3 h-3 border-r border-b",
          primary ? "border-accent/60" : "border-highlight/50",
        ].join(" ")}
      />

      {primary && (
        <span
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 0%, rgba(201,146,42,0.10), transparent 55%)",
          }}
        />
      )}

      <div className="relative flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-accent text-2xl leading-none">{sigil}</span>
          <h3 className="font-heading uppercase tracking-[0.06em] text-[19px] text-foreground">
            {name}
          </h3>
        </div>
        {primary && (
          <span className="font-accent uppercase tracking-[0.2em] text-[10px] text-accent border border-accent/40 px-2 py-1">
            For this road
          </span>
        )}
      </div>
      <p className="relative text-foreground/80 text-[15px] font-serif italic leading-relaxed mb-6">
        {blurb}
      </p>
      <dl className="relative grid grid-cols-2 gap-y-3 gap-x-4 font-accent text-[11px] tracking-[0.12em] uppercase">
        <Spec label="Terrain" value={terrain} />
        <Spec label="Capacity" value={passengers} />
        <Spec label="Comfort" value={comfort} />
        <Spec label="Price impact" value={priceImpact} />
      </dl>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted text-[10px] mb-1">{label}</dt>
      <dd className="text-foreground/90 normal-case font-serif text-[13px] tracking-normal leading-snug">
        {value}
      </dd>
    </div>
  );
}
