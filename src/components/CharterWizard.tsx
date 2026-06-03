"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import GuideRankBadge from "@/components/GuideRankBadge";
import type { Journey, Vehicle } from "@/lib/journeys";
import {
  getVehicle,
  guidesForJourney,
  guideMeetsRank,
  guideFitsCategory,
  CATEGORY_SIGIL,
} from "@/lib/journeys";
import type { Guide } from "@/lib/guides";
import { formatPriceRange } from "@/lib/format";

type Props = { journey: Journey };

const STEPS = ["Vehicle", "Guide", "Charter"] as const;

export default function CharterWizard({ journey }: Props) {
  const vehicles = useMemo(
    () => journey.vehicleOptions.map(getVehicle).filter(Boolean) as Vehicle[],
    [journey]
  );
  const guides = useMemo(() => guidesForJourney(journey), [journey]);

  const [step, setStep] = useState(0);
  const [vehicleId, setVehicleId] = useState<string>(journey.requiredVehicle);
  const [guideSlug, setGuideSlug] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", dates: "", party: "", notes: "" });
  const [sent, setSent] = useState(false);

  const vehicle = vehicles.find((v) => v.id === vehicleId) ?? null;
  const guide = guides.find((g) => g.slug === guideSlug) ?? null;

  const canNext = (step === 0 && !!vehicle) || (step === 1 && !!guide) || step === 2;

  function submit() {
    // No backend yet — assemble a raven (mailto) and confirm on-page.
    const subject = `Charter — ${journey.title}`;
    const body = [
      `Journey: ${journey.title} (${journey.region})`,
      `Vehicle: ${vehicle?.name ?? "—"}`,
      `Guide: ${guide ? `${guide.name} · ${guide.level}` : "—"}`,
      `Dates: ${form.dates || "—"}`,
      `Party: ${form.party || "—"}`,
      "",
      form.notes,
      "",
      `— ${form.name}`,
    ].join("\n");
    if (typeof window !== "undefined") {
      window.location.href = `mailto:hello@geregeguild.mn?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
    }
    setSent(true);
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-center gap-3 sm:gap-5 mb-14">
        {STEPS.map((label, i) => {
          const done = i < step;
          const current = i === step;
          return (
            <div key={label} className="flex items-center gap-3 sm:gap-5">
              <button
                type="button"
                onClick={() => i <= step && setStep(i)}
                disabled={i > step}
                className="flex items-center gap-2.5"
              >
                <span
                  className={[
                    "w-8 h-8 flex items-center justify-center rounded-full border font-accent text-[13px] transition-colors",
                    done
                      ? "border-accent bg-accent text-background"
                      : current
                        ? "border-accent text-accent ember-glow"
                        : "border-highlight/40 text-muted",
                  ].join(" ")}
                >
                  {done ? <Check size={15} /> : i + 1}
                </span>
                <span
                  className={[
                    "font-accent uppercase tracking-[0.2em] text-[11px] hidden sm:inline",
                    current ? "text-foreground" : "text-muted",
                  ].join(" ")}
                >
                  {label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <span className={`w-8 sm:w-14 h-px ${done ? "bg-accent" : "bg-highlight/40"}`} />
              )}
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1 — Vehicle */}
        {step === 0 && (
          <motion.div
            key="vehicle"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4 }}
          >
            <StepHeading
              eyebrow="Step One"
              title="Choose the machine"
              sub="The road is set. Now choose how you cross it."
            />
            <div className="grid md:grid-cols-2 gap-5">
              {vehicles.map((v) => {
                const selected = v.id === vehicleId;
                const recommended = v.id === journey.requiredVehicle;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVehicleId(v.id)}
                    className={[
                      "text-left border p-6 transition-all duration-300",
                      selected
                        ? "border-accent bg-accent/[0.08] ember-glow"
                        : "border-highlight/40 bg-surface/40 hover:border-accent/60",
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-accent text-2xl leading-none">{v.sigil}</span>
                        <h3 className="font-heading uppercase tracking-[0.06em] text-[18px] text-foreground">
                          {v.name}
                        </h3>
                      </div>
                      {recommended && (
                        <span className="font-accent uppercase tracking-[0.18em] text-[9px] text-accent border border-accent/40 px-2 py-1">
                          For this road
                        </span>
                      )}
                    </div>
                    <p className="text-foreground/80 text-[14px] font-serif leading-relaxed mb-4">
                      {v.blurb}
                    </p>
                    <div className="grid grid-cols-2 gap-y-2 gap-x-3 font-accent text-[10px] tracking-[0.12em] uppercase text-muted">
                      <span>Terrain · <span className="text-foreground/80 normal-case font-serif tracking-normal">{v.terrain.split(",")[0]}</span></span>
                      <span>Seats · <span className="text-foreground/80 normal-case font-serif tracking-normal">{v.passengers.split("+")[0]}</span></span>
                      <span>Comfort · <span className="text-foreground/80 normal-case font-serif tracking-normal">{v.comfort}</span></span>
                      <span>Price · <span className="text-accent normal-case font-serif tracking-normal">{v.priceImpact}</span></span>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* STEP 2 — Guide */}
        {step === 1 && (
          <motion.div
            key="guide"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4 }}
          >
            <StepHeading
              eyebrow="Step Two"
              title="Choose the person who knows the way"
              sub="A guide is not the product — but they are the heart of it. Their rank must meet this road."
            />
            <div className="grid sm:grid-cols-2 gap-5">
              {guides.map((g) => (
                <GuideChoice
                  key={g.slug}
                  guide={g}
                  selected={g.slug === guideSlug}
                  meetsRank={guideMeetsRank(g, journey)}
                  fits={guideFitsCategory(g, journey)}
                  onSelect={() => guideMeetsRank(g, journey) && setGuideSlug(g.slug)}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 3 — Charter / inquiry */}
        {step === 2 && (
          <motion.div
            key="charter"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4 }}
          >
            <StepHeading
              eyebrow="Step Three"
              title="Your charter"
              sub="The road, the machine, the rhythm, and the person who knows the way."
            />

            {sent ? (
              <div className="border border-accent/40 bg-surface/60 p-10 text-center ember-glow">
                <div className="text-accent text-5xl mb-4 leading-none">✦</div>
                <h3 className="font-heading text-2xl uppercase tracking-[0.1em] text-foreground">
                  The raven is away
                </h3>
                <p className="mt-4 text-foreground/85 font-serif italic text-[17px] leading-relaxed max-w-md mx-auto">
                  Your charter request is drafted to the Guild. A guide — not a
                  sales desk — will write back. We will reply with a charted map
                  and a written charter before anything is owed.
                </p>
                <Link
                  href="/journeys"
                  className="inline-block mt-8 px-10 py-4 border border-highlight/50 hover:border-accent transition-all duration-500 font-accent text-[12px] tracking-[0.3em] uppercase text-muted hover:text-foreground"
                >
                  Explore other roads
                </Link>
              </div>
            ) : (
              <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8">
                {/* Summary */}
                <div className="border border-highlight/40 bg-surface/50 p-7 ember-glow self-start">
                  <p className="font-accent italic text-accent text-[12px] tracking-[0.3em] uppercase mb-5">
                    Charter summary
                  </p>
                  <SummaryRow
                    label="Journey"
                    value={`${CATEGORY_SIGIL[journey.category]}  ${journey.title}`}
                    sub={journey.region}
                  />
                  <SummaryRow label="Vehicle" value={vehicle?.name ?? "—"} sub={vehicle?.priceImpact} />
                  <SummaryRow
                    label="Guide"
                    value={guide?.name ?? "—"}
                    sub={guide ? `${guide.level} · ${guide.homeRegion}` : undefined}
                  />
                  {journey.category !== "Custom" && (
                    <SummaryRow
                      label="The road"
                      value={`${journey.distanceKm} km · ${journey.days} days`}
                      sub={journey.difficulty}
                    />
                  )}
                  <div className="ink-divider my-5" />
                  <div className="flex items-center justify-between">
                    <span className="font-accent uppercase tracking-[0.2em] text-[11px] text-muted">
                      Estimate, per patron
                    </span>
                    <span className="font-heading text-accent text-[20px]">
                      {formatPriceRange(journey.priceFrom, journey.priceTo)}
                    </span>
                  </div>
                  <p className="mt-3 font-accent italic text-muted text-[12px] leading-relaxed">
                    A placeholder figure. Your written charter carries the true
                    price, settled before you owe anything.
                  </p>
                </div>

                {/* Raven form */}
                <div>
                  <p className="font-accent italic text-accent text-[12px] tracking-[0.3em] uppercase mb-5">
                    Send a raven
                  </p>
                  <div className="space-y-4">
                    <Field label="Your name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                    <Field label="Email for the reply" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Rough dates" value={form.dates} onChange={(v) => setForm({ ...form, dates: v })} placeholder="e.g. late August" />
                      <Field label="Party size" value={form.party} onChange={(v) => setForm({ ...form, party: v })} placeholder="e.g. 2 travellers" />
                    </div>
                    <div>
                      <label className="font-accent uppercase tracking-[0.2em] text-[11px] text-muted block mb-2">
                        Tell us the Mongolia you want to meet
                      </label>
                      <textarea
                        rows={4}
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        className="w-full bg-surface/40 border border-highlight/40 focus:border-accent/70 outline-none px-4 py-3 font-serif text-foreground text-[16px] leading-relaxed transition-colors resize-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={submit}
                      disabled={!form.name || !form.email}
                      className="w-full px-10 py-5 border border-accent bg-accent/15 hover:bg-accent hover:text-background disabled:opacity-40 disabled:hover:bg-accent/15 disabled:hover:text-foreground transition-all duration-500 font-accent text-[12px] tracking-[0.35em] uppercase text-foreground ember-glow"
                    >
                      Send the charter raven
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav controls */}
      {!sent && (
        <div className="mt-14 flex items-center justify-between">
          <button
            type="button"
            onClick={() => (step === 0 ? null : setStep(step - 1))}
            disabled={step === 0}
            className="px-8 py-4 border border-highlight/50 hover:border-accent disabled:opacity-30 disabled:hover:border-highlight/50 transition-all duration-500 font-accent text-[12px] tracking-[0.3em] uppercase text-muted hover:text-foreground"
          >
            ← Back
          </button>
          {step < 2 ? (
            <button
              type="button"
              onClick={() => canNext && setStep(step + 1)}
              disabled={!canNext}
              className="px-10 py-4 border border-accent bg-accent/15 hover:bg-accent hover:text-background disabled:opacity-40 disabled:hover:bg-accent/15 disabled:hover:text-foreground transition-all duration-500 font-accent text-[12px] tracking-[0.3em] uppercase text-foreground ember-glow"
            >
              {step === 0 ? "Choose your guide →" : "Review charter →"}
            </button>
          ) : (
            <span />
          )}
        </div>
      )}
    </div>
  );
}

function StepHeading({ eyebrow, title, sub }: { eyebrow: string; title: string; sub: string }) {
  return (
    <div className="text-center mb-12 max-w-2xl mx-auto">
      <p className="font-accent italic text-accent text-[12px] tracking-[0.35em] uppercase mb-4">
        {eyebrow}
      </p>
      <h2 className="font-heading text-3xl sm:text-4xl uppercase tracking-[0.06em] text-foreground ember-text-glow leading-tight">
        {title}
      </h2>
      <p className="mt-4 text-foreground/80 font-serif italic text-[16px] leading-relaxed">{sub}</p>
    </div>
  );
}

function GuideChoice({
  guide,
  selected,
  meetsRank,
  fits,
  onSelect,
}: {
  guide: Guide;
  selected: boolean;
  meetsRank: boolean;
  fits: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={!meetsRank}
      className={[
        "text-left border p-5 flex gap-4 transition-all duration-300",
        selected
          ? "border-accent bg-accent/[0.08] ember-glow"
          : meetsRank
            ? "border-highlight/40 bg-surface/40 hover:border-accent/60"
            : "border-highlight/20 bg-surface/20 opacity-55 cursor-not-allowed",
      ].join(" ")}
    >
      <img
        src={guide.portrait}
        alt={guide.name}
        className="w-20 h-24 object-cover grayscale-[20%] sepia-[30%] border border-highlight/40 shrink-0"
      />
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <GuideRankBadge level={guide.level} size="sm" />
          {fits && meetsRank && (
            <span className="font-accent uppercase tracking-[0.16em] text-[9px] text-accent border border-accent/40 px-1.5 py-0.5">
              Best match
            </span>
          )}
        </div>
        <h3 className="font-heading uppercase tracking-[0.05em] text-[16px] text-foreground leading-tight">
          {guide.name}
        </h3>
        <p className="font-accent italic text-muted text-[12px] mt-0.5 line-clamp-1">
          {guide.homeRegion} · {guide.specialization}
        </p>
        <p className="text-foreground/75 text-[13px] font-serif leading-snug mt-2 line-clamp-2">
          {guide.skills.slice(0, 3).join(" · ")}
        </p>
        {!meetsRank && (
          <p className="font-accent italic text-highlight text-[11px] tracking-[0.1em] mt-2">
            Rank too low for this road
          </p>
        )}
      </div>
    </button>
  );
}

function SummaryRow({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="flex justify-between gap-4 py-2.5 border-b border-highlight/20 last:border-0">
      <span className="font-accent uppercase tracking-[0.2em] text-[10px] text-muted pt-1 shrink-0">
        {label}
      </span>
      <span className="text-right">
        <span className="block font-serif text-foreground text-[15px] leading-tight">{value}</span>
        {sub && (
          <span className="block font-accent italic text-muted text-[12px] mt-0.5">{sub}</span>
        )}
      </span>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="font-accent uppercase tracking-[0.2em] text-[11px] text-muted block mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-surface/40 border border-highlight/40 focus:border-accent/70 outline-none px-4 py-3 font-serif text-foreground text-[16px] transition-colors placeholder:text-muted/50"
      />
    </div>
  );
}
