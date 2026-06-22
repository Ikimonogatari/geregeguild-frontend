import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GuideRankBadge from "@/components/GuideRankBadge";
import JourneyMap from "@/components/JourneyMap";
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

      {/* Hero plate */}
      <section className="relative h-[64vh] min-h-[440px] w-full overflow-hidden">
        <img
          src={journey.image}
          alt={journey.title}
          className="absolute inset-0 w-full h-full object-cover grayscale-[12%] sepia-[24%] brightness-[0.7]"
        />
        <div className="absolute inset-0 bg-[#0D0A07]/55" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-background" />
        <div className="relative z-10 h-full max-w-6xl mx-auto px-6 flex flex-col justify-end pb-14">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="text-accent text-xl leading-none">
              {CATEGORY_SIGIL[journey.category]}
            </span>
            <span className="font-accent uppercase tracking-[0.3em] text-[12px] text-foreground/90">
              {journey.category} · {journey.region}
            </span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl uppercase tracking-[0.06em] text-foreground ember-text-glow leading-[1.05] max-w-4xl">
            {journey.title}
          </h1>
          <p className="mt-5 text-foreground/90 text-[18px] sm:text-[20px] max-w-2xl italic font-serif leading-relaxed">
            {journey.hook}
          </p>
        </div>
      </section>

      {/* Stat ribbon */}
      {!isCustom && (
        <section className="px-6 -mt-2">
          <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-8 gap-x-6 border-y border-highlight/30 py-8">
            <Stat label="Distance" value={`${journey.distanceKm} km`} />
            <Stat label="Days" value={`${journey.days}`} />
            <Stat label="Difficulty" value={journey.difficulty} />
            <Stat label="Terrain" value={journey.terrain.split(",")[0]} />
            <Stat label="Best season" value={journey.season.split("·")[0].trim()} />
            <Stat
              label="From"
              value={formatPriceRange(journey.priceFrom, journey.priceTo)}
            />
          </div>
        </section>
      )}

      {/* Overview + map — map gets the wider column to breathe */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1.4fr] gap-12 items-start">
          <div>
            <p className="font-accent italic text-accent text-[13px] tracking-[0.3em] uppercase mb-5">
              The Road
            </p>
            <div className="space-y-5">
              {journey.overview.map((p, i) => (
                <p key={i} className="text-foreground/90 text-[18px] leading-[1.85] font-serif">
                  {p}
                </p>
              ))}
            </div>

            {/* Activities */}
            <div className="mt-10">
              <p className="font-accent italic text-accent text-[13px] tracking-[0.3em] uppercase mb-4">
                On this road
              </p>
              <div className="flex flex-wrap gap-2.5">
                {journey.activities.map((a) => (
                  <span
                    key={a}
                    className="px-4 py-2 border border-highlight/40 font-accent text-[12px] tracking-[0.12em] text-foreground/85"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Real route map — Leaflet tiles + OSRM driving polyline through
              the journey's actual lat/lon waypoints. Landscape plate so
              east-west routes (most of Mongolia) read naturally. */}
          <div className="relative lg:sticky lg:top-28">
            <div className="relative border border-highlight/40 ember-glow vignette overflow-hidden aspect-[4/3] min-h-[420px] lg:min-h-[560px]">
              <JourneyMap journey={journey} />
            </div>
            <p className="mt-4 font-accent italic text-muted text-[13px] tracking-[0.15em] text-center">
              A full charted map travels with your written charter.
            </p>
          </div>
        </div>
      </section>

      {/* Highlights — natural / cultural / spiritual */}
      <section className="px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="ink-divider mb-12" />
          <div className="grid md:grid-cols-3 gap-10">
            <PointColumn sigil="❂" title="Natural" points={journey.naturalPoints} />
            <PointColumn sigil="卍" title="Cultural" points={journey.culturalPoints} />
            <PointColumn sigil="☽" title="Spiritual" points={journey.spiritualPoints} />
          </div>
          {typeof journey.templeCount === "number" && (
            <p className="mt-12 text-center font-accent italic text-accent text-[15px] tracking-[0.25em] uppercase">
              {journey.templeCount} monasteries &amp; temples on this road
            </p>
          )}
          <div className="ink-divider mt-12" />
        </div>
      </section>

      {/* Difficulty + recommended rank */}
      <section className="px-6 pb-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="border border-highlight/40 bg-surface/50 p-8 ember-glow">
            <p className="font-accent italic text-accent text-[12px] tracking-[0.3em] uppercase mb-4">
              Difficulty
            </p>
            <h3 className="font-heading text-2xl uppercase tracking-[0.08em] text-foreground">
              {journey.difficulty}
            </h3>
            <p className="mt-3 text-foreground/85 text-[16px] font-serif leading-relaxed">
              {DIFFICULTY_BLURB[journey.difficulty]}
            </p>
          </div>
          <div className="border border-highlight/40 bg-surface/50 p-8 ember-glow">
            <p className="font-accent italic text-accent text-[12px] tracking-[0.3em] uppercase mb-4">
              Recommended guide rank
            </p>
            <div className="flex items-center gap-4">
              <GuideRankBadge level={journey.recommendedRank} size="lg" />
              <div>
                <h3 className="font-heading text-2xl uppercase tracking-[0.06em]" style={{ color: medal.ring }}>
                  {medal.name}
                </h3>
                <p className="font-accent italic text-muted text-[13px] tracking-[0.15em] uppercase">
                  {journey.recommendedRank} or above
                </p>
              </div>
            </div>
            <p className="mt-4 text-foreground/85 text-[15px] font-serif leading-relaxed">
              {medal.blurb}
            </p>
          </div>
        </div>
      </section>

      {/* Vehicles */}
      <section className="px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <p className="font-accent italic text-accent text-[13px] tracking-[0.3em] uppercase mb-3 text-center">
            The Machine
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl uppercase tracking-[0.08em] text-center text-foreground">
            How this road is travelled
          </h2>
          <div className="ink-divider mt-8 mb-12 max-w-md mx-auto" />
          <div className="grid md:grid-cols-2 gap-6">
            {requiredVehicle && (
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
            )}
            {otherVehicles.map(
              (v) =>
                v && (
                  <VehiclePanel
                    key={v.id}
                    name={v.name}
                    sigil={v.sigil}
                    terrain={v.terrain}
                    passengers={v.passengers}
                    comfort={v.comfort}
                    priceImpact={v.priceImpact}
                    blurb={v.blurb}
                  />
                )
            )}
          </div>
          <p className="mt-8 text-center font-accent italic text-muted text-[13px] tracking-[0.15em]">
            You choose the machine while building your charter.
          </p>
        </div>
      </section>

      {/* Included + add-ons */}
      <section className="px-6 pb-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
          <div>
            <p className="font-accent italic text-accent text-[13px] tracking-[0.3em] uppercase mb-5">
              Your charter includes
            </p>
            <ul className="space-y-3">
              {journey.included.map((item) => (
                <li key={item} className="flex gap-3 text-foreground/90 text-[16px] font-serif">
                  <span className="text-accent mt-0.5">✦</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-accent italic text-accent text-[13px] tracking-[0.3em] uppercase mb-5">
              Optional add-ons
            </p>
            <ul className="space-y-3">
              {journey.addOns.map((item) => (
                <li key={item} className="flex gap-3 text-muted text-[16px] font-serif">
                  <span className="text-highlight mt-0.5">+</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Suitable guides preview */}
      {guides.length > 0 && (
        <section className="px-6 pb-16">
          <div className="max-w-6xl mx-auto">
            <div className="ink-divider mb-12" />
            <p className="font-accent italic text-accent text-[13px] tracking-[0.3em] uppercase mb-3 text-center">
              The Person Who Knows the Way
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl uppercase tracking-[0.08em] text-center text-foreground">
              Guides who can lead this road
            </h2>
            <p className="mt-4 mb-12 text-center font-accent italic text-muted text-[14px] tracking-[0.15em] max-w-xl mx-auto">
              A guide is not the product. The whole journey is. You choose yours
              while building the charter.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {guides.map((g) => (
                <Link
                  key={g.slug}
                  href={`/guides/${g.slug}`}
                  className="flex items-center gap-4 border border-highlight/40 bg-surface/50 px-5 py-4 hover:border-accent/70 transition-colors duration-500 group"
                >
                  <img
                    src={g.portrait}
                    alt={g.name}
                    className="w-14 h-14 object-cover grayscale-[20%] sepia-[30%] border border-highlight/40"
                  />
                  <div>
                    <p className="font-heading uppercase tracking-[0.06em] text-foreground text-[16px] group-hover:text-accent transition-colors">
                      {g.name.split(" ")[0]}
                    </p>
                    <GuideRankBadge level={g.level} size="sm" withName />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="px-6 pb-32">
        <div className="max-w-3xl mx-auto text-center border border-accent/30 bg-surface/60 px-8 py-14 ember-glow">
          <p className="font-accent italic text-accent text-[13px] tracking-[0.3em] uppercase mb-4">
            From the road upward
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl uppercase tracking-[0.08em] text-foreground ember-text-glow">
            Build your charter
          </h2>
          <p className="mt-5 text-foreground/90 text-[18px] font-serif italic leading-relaxed">
            Your charter includes the road, the machine, the rhythm, and the
            person who knows the way. Choose your vehicle and guide next.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/charter/${journey.slug}`}
              className="px-12 py-5 border border-accent bg-accent/15 hover:bg-accent hover:text-background transition-all duration-500 font-accent text-[12px] tracking-[0.35em] uppercase text-foreground ember-glow"
            >
              Build this charter
            </Link>
            <Link
              href="/journeys"
              className="px-12 py-5 border border-highlight/50 hover:border-accent transition-all duration-500 font-accent text-[12px] tracking-[0.35em] uppercase text-muted hover:text-foreground"
            >
              ← Other roads
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="font-accent uppercase tracking-[0.2em] text-[10px] text-muted mb-1.5">
        {label}
      </p>
      <p className="font-heading text-foreground text-[18px] leading-none">{value}</p>
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
      <ul className="space-y-2.5">
        {points.map((p) => (
          <li key={p} className="text-foreground/80 text-[15px] font-serif leading-snug">
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
        "border p-7 transition-colors duration-500",
        primary
          ? "border-accent/60 bg-accent/[0.06] ember-glow"
          : "border-highlight/40 bg-surface/40",
      ].join(" ")}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-accent text-2xl leading-none">{sigil}</span>
          <h3 className="font-heading uppercase tracking-[0.06em] text-[19px] text-foreground">
            {name}
          </h3>
        </div>
        {primary && (
          <span className="font-accent uppercase tracking-[0.2em] text-[10px] text-accent border border-accent/40 px-2 py-1">
            Recommended
          </span>
        )}
      </div>
      <p className="text-foreground/80 text-[15px] font-serif leading-relaxed mb-5">
        {blurb}
      </p>
      <dl className="grid grid-cols-2 gap-y-3 gap-x-4 font-accent text-[11px] tracking-[0.12em] uppercase">
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
