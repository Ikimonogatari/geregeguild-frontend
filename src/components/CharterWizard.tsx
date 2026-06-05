"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Star } from "lucide-react";
import GuideRankBadge from "@/components/GuideRankBadge";
import type { Journey, Vehicle } from "@/lib/journeys";
import {
  getVehicle,
  guidesForJourney,
  guideFitsCategory,
  guideMeetsRank,
  CATEGORY_SIGIL,
  GUIDE_MEDAL,
  type Medal,
} from "@/lib/journeys";
import { LEVEL_ORDER, type Guide, type GuideLevel } from "@/lib/guides";
import { formatPriceRange } from "@/lib/format";

type Props = { journey: Journey };

const STEPS = ["Vehicle", "Guide", "Charter"] as const;

export default function CharterWizard({ journey }: Props) {
  const vehicles = useMemo(
    () => journey.vehicleOptions.map(getVehicle).filter(Boolean) as Vehicle[],
    [journey]
  );
  const guides = useMemo(() => guidesForJourney(journey), [journey]);
  const tierGroups = useMemo(() => {
    const order: GuideLevel[] = ["Guildmaster", "Master", "Novice", "Apprentice"];
    return order
      .map((level) => ({
        level,
        medal: GUIDE_MEDAL[level],
        list: guides.filter((g) => g.level === level),
      }))
      .filter((t) => t.list.length > 0);
  }, [guides]);

  const [step, setStep] = useState(0); // 0 = vehicle, 1 = guide
  const [vehicleId, setVehicleId] = useState<string>(journey.requiredVehicle);
  const [guideSlug, setGuideSlug] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", dates: "", party: "", notes: "" });
  const [sent, setSent] = useState(false);

  // Modal state — the object is kept after close so exit animations still render it.
  const [modalVehicle, setModalVehicle] = useState<Vehicle | null>(null);
  const [vehicleOpen, setVehicleOpen] = useState(false);
  const [modalGuide, setModalGuide] = useState<Guide | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);

  const vehicle = vehicles.find((v) => v.id === vehicleId) ?? null;
  const guide = guides.find((g) => g.slug === guideSlug) ?? null;
  const currentStepIndex = reviewOpen ? 2 : step;

  const openVehicle = (v: Vehicle) => {
    setModalVehicle(v);
    setVehicleOpen(true);
  };
  const openGuide = (g: Guide) => {
    setModalGuide(g);
    setGuideOpen(true);
  };

  function goToStep(i: number) {
    if (i === 2) {
      if (guide) setReviewOpen(true);
      return;
    }
    setReviewOpen(false);
    setStep(i);
  }

  function submit() {
    // No backend yet — assemble a raven (mailto) and confirm in the modal.
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
          const done = i < currentStepIndex;
          const current = i === currentStepIndex;
          const reachable = i <= 1 || (i === 2 && !!guide);
          return (
            <div key={label} className="flex items-center gap-3 sm:gap-5">
              <button
                type="button"
                onClick={() => reachable && goToStep(i)}
                disabled={!reachable}
                className="flex items-center gap-2.5 disabled:cursor-not-allowed"
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
              sub="The road is set. Now choose how you cross it — press a machine to see it and pick."
            />
            <div className="grid md:grid-cols-2 gap-5">
              {vehicles.map((v) => {
                const selected = v.id === vehicleId;
                const recommended = v.id === journey.requiredVehicle;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => openVehicle(v)}
                    className={[
                      "text-left border p-6 transition-all duration-300 group/v",
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
                      {selected ? (
                        <span className="flex items-center gap-1.5 font-accent uppercase tracking-[0.18em] text-[9px] text-accent">
                          <Check size={13} /> Chosen
                        </span>
                      ) : (
                        recommended && (
                          <span className="font-accent uppercase tracking-[0.18em] text-[9px] text-accent border border-accent/40 px-2 py-1">
                            For this road
                          </span>
                        )
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
                    <p className="mt-4 pt-3 border-t border-highlight/25 font-accent uppercase tracking-[0.22em] text-[10px] text-accent group-hover/v:translate-x-1 transition-transform duration-300">
                      {selected ? "View details" : "View & choose"} →
                    </p>
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
              sub="A guide is not the product — but they are the heart of it. Press a portrait to read them and choose."
            />
            <p className="text-center font-accent italic text-muted text-[12px] tracking-[0.16em] uppercase -mt-7 mb-9">
              Brighter tiers can lead this road
              <span className="mx-2 text-accent">✦</span>
              marks guides matched to its country
            </p>
            <div className="space-y-4">
              {tierGroups.map(({ level, medal, list }, ti) => {
                const eligible =
                  LEVEL_ORDER[level] >= LEVEL_ORDER[journey.recommendedRank];
                return (
                  <motion.div
                    key={level}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: ti * 0.08, ease: "easeOut" }}
                    className="relative flex flex-col sm:flex-row gap-0 overflow-hidden border"
                    style={{
                      borderColor: eligible
                        ? `${medal.ring}44`
                        : "rgba(139,94,60,0.16)",
                      background: eligible
                        ? `linear-gradient(100deg, ${medal.fill}66 0%, rgba(46,31,20,0.32) 44%, rgba(28,21,16,0.18) 100%)`
                        : "rgba(46,31,20,0.16)",
                    }}
                  >
                    {/* Tier colour rail */}
                    <span
                      aria-hidden
                      className="absolute left-0 top-0 bottom-0 w-[3px]"
                      style={{
                        background: eligible ? medal.ring : "rgba(139,94,60,0.4)",
                        opacity: eligible ? 0.9 : 0.4,
                        boxShadow: eligible ? `0 0 12px ${medal.ring}` : "none",
                      }}
                    />
                    {/* Veil for below-rank tiers */}
                    {!eligible && (
                      <span
                        aria-hidden
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background:
                            "repeating-linear-gradient(135deg, transparent 0 9px, rgba(13,10,7,0.45) 9px 10px)",
                          opacity: 0.5,
                        }}
                      />
                    )}

                    {/* Tier crest */}
                    <div
                      className="relative z-10 flex sm:flex-col items-center justify-start sm:justify-center text-left sm:text-center sm:w-32 shrink-0 gap-4 sm:gap-2.5 px-5 py-4 sm:py-7 sm:border-r"
                      style={{ borderColor: "rgba(139,94,60,0.18)" }}
                    >
                      <span
                        className="relative inline-flex items-center justify-center shrink-0"
                        style={{ width: 52, height: 52 }}
                      >
                        <span
                          aria-hidden
                          className="absolute inset-0 rounded-full"
                          style={{
                            border: `1px solid ${eligible ? medal.ring : "#6b5640"}`,
                            opacity: 0.35,
                          }}
                        />
                        <span
                          className="inline-flex items-center justify-center rounded-full font-heading"
                          style={{
                            width: 44,
                            height: 44,
                            background: `radial-gradient(120% 120% at 50% 22%, ${medal.fill} 0%, #160d06 100%)`,
                            border: `2px solid ${eligible ? medal.ring : "#6b5640"}`,
                            boxShadow: eligible
                              ? `0 0 18px -3px ${medal.ring}, inset 0 1px 0 rgba(255,255,255,0.12), inset 0 0 10px rgba(0,0,0,0.7)`
                              : "inset 0 0 10px rgba(0,0,0,0.7)",
                            color: eligible ? medal.text : "#8a755a",
                            fontSize: 17,
                            letterSpacing: "0.04em",
                          }}
                        >
                          {medal.sigil}
                        </span>
                      </span>
                      <div>
                        <p
                          className="font-heading uppercase tracking-[0.16em] text-[15px] leading-none"
                          style={{ color: eligible ? medal.ring : "#8a755a" }}
                        >
                          {medal.name.split(" ")[0]}
                        </p>
                        <p className="font-accent italic text-muted text-[10px] tracking-[0.14em] uppercase mt-1.5">
                          {level}
                        </p>
                        <p
                          className="mt-2.5 font-accent uppercase tracking-[0.14em] text-[9px] leading-[1.5]"
                          style={{ color: eligible ? "#C9922A" : "#8B5E3C" }}
                        >
                          {eligible ? "Leads this road" : "Below rank"}
                        </p>
                      </div>
                    </div>

                    {/* Guide tiles */}
                    <div className="relative z-10 flex-1 flex flex-wrap gap-3.5 content-start px-5 py-5 sm:pl-6">
                      {list.map((g, gi) => (
                        <GuideTile
                          key={g.slug}
                          guide={g}
                          index={gi}
                          medal={medal}
                          selected={g.slug === guideSlug}
                          eligible={eligible}
                          fits={guideFitsCategory(g, journey)}
                          onOpen={() => openGuide(g)}
                        />
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav controls */}
      <div className="mt-14 flex items-center justify-between">
        <button
          type="button"
          onClick={() => step > 0 && setStep(step - 1)}
          disabled={step === 0}
          className="px-8 py-4 border border-highlight/50 hover:border-accent disabled:opacity-30 disabled:hover:border-highlight/50 transition-all duration-500 font-accent text-[12px] tracking-[0.3em] uppercase text-muted hover:text-foreground"
        >
          ← Back
        </button>
        {step === 0 ? (
          <button
            type="button"
            onClick={() => vehicle && setStep(1)}
            disabled={!vehicle}
            className="px-10 py-4 border border-accent bg-accent/15 hover:bg-accent hover:text-background disabled:opacity-40 disabled:hover:bg-accent/15 disabled:hover:text-foreground transition-all duration-500 font-accent text-[12px] tracking-[0.3em] uppercase text-foreground ember-glow"
          >
            Choose your guide →
          </button>
        ) : (
          <button
            type="button"
            onClick={() => guide && setReviewOpen(true)}
            disabled={!guide}
            className="px-10 py-4 border border-accent bg-accent/15 hover:bg-accent hover:text-background disabled:opacity-40 disabled:hover:bg-accent/15 disabled:hover:text-foreground transition-all duration-500 font-accent text-[12px] tracking-[0.3em] uppercase text-foreground ember-glow"
          >
            Review charter →
          </button>
        )}
      </div>

      {/* ── Vehicle detail modal ── */}
      <Modal open={vehicleOpen} onClose={() => setVehicleOpen(false)} maxW="max-w-lg">
        {modalVehicle && (
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-accent text-3xl leading-none">{modalVehicle.sigil}</span>
              {modalVehicle.id === journey.requiredVehicle && (
                <span className="font-accent uppercase tracking-[0.18em] text-[9px] text-accent border border-accent/40 px-2 py-1">
                  For this road
                </span>
              )}
            </div>
            <h2 className="font-heading text-3xl uppercase tracking-[0.05em] text-foreground ember-text-glow leading-tight">
              {modalVehicle.name}
            </h2>
            <p className="mt-4 text-foreground/85 text-[16px] font-serif italic leading-relaxed">
              {modalVehicle.blurb}
            </p>

            <div className="ink-divider my-6" />

            <dl className="grid grid-cols-2 gap-y-5 gap-x-6">
              <Spec label="Terrain" value={modalVehicle.terrain} />
              <Spec label="Capacity" value={modalVehicle.passengers} />
              <Spec label="Comfort" value={modalVehicle.comfort} />
              <Spec label="Price impact" value={modalVehicle.priceImpact} accent />
            </dl>

            <p className="mt-7 font-accent uppercase tracking-[0.2em] text-[10px] text-muted mb-3">
              Suits these roads
            </p>
            <div className="flex flex-wrap gap-2">
              {modalVehicle.bestFor.map((c) => (
                <span
                  key={c}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-highlight/40 font-accent text-[11px] tracking-[0.1em] text-foreground/85"
                >
                  <span className="text-accent text-sm leading-none">{CATEGORY_SIGIL[c]}</span>
                  {c}
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                setVehicleId(modalVehicle.id);
                setVehicleOpen(false);
              }}
              className="mt-8 w-full px-10 py-4 border border-accent bg-accent/15 hover:bg-accent hover:text-background transition-all duration-500 font-accent text-[12px] tracking-[0.3em] uppercase text-foreground ember-glow"
            >
              {modalVehicle.id === vehicleId ? "Keep this machine" : "Choose this machine"}
            </button>
          </div>
        )}
      </Modal>

      {/* ── Guide detail modal ── */}
      <Modal open={guideOpen} onClose={() => setGuideOpen(false)} maxW="max-w-xl">
        {modalGuide && (
          <GuideModalBody
            guide={modalGuide}
            eligible={guideMeetsRank(modalGuide, journey)}
            fits={guideFitsCategory(modalGuide, journey)}
            chosen={modalGuide.slug === guideSlug}
            onChoose={() => {
              setGuideSlug(modalGuide.slug);
              setGuideOpen(false);
            }}
          />
        )}
      </Modal>

      {/* ── Review charter modal (step 3) ── */}
      <Modal open={reviewOpen} onClose={() => setReviewOpen(false)} maxW="max-w-3xl">
        <div className="p-6 sm:p-9">
          <p className="font-accent italic text-accent text-[12px] tracking-[0.35em] uppercase mb-2 text-center">
            Step Three · Your charter
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl uppercase tracking-[0.06em] text-foreground ember-text-glow leading-tight text-center">
            The road, the machine, the guide
          </h2>
          <div className="ink-divider mt-7 mb-8 max-w-md mx-auto" />

          {sent ? (
            <div className="text-center py-4">
              <div className="text-accent text-5xl mb-4 leading-none">✦</div>
              <h3 className="font-heading text-2xl uppercase tracking-[0.1em] text-foreground">
                The raven is away
              </h3>
              <p className="mt-4 text-foreground/85 font-serif italic text-[17px] leading-relaxed max-w-md mx-auto">
                Your charter request is drafted to the Guild. A guide — not a
                sales desk — will write back, with a charted map and a written
                charter, before anything is owed.
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
                      rows={3}
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
        </div>
      </Modal>
    </div>
  );
}

/* ────────────────────────── Modal shell ────────────────────────── */

function Modal({
  open,
  onClose,
  children,
  maxW = "max-w-lg",
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxW?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-[#0D0A07]/90 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
            className={`relative z-10 w-full ${maxW} max-h-[90vh] overflow-y-auto bg-background border border-accent/30 ember-glow`}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 z-20 text-foreground/80 hover:text-accent bg-background/70 border border-highlight/40 p-2 transition-colors"
            >
              <X size={18} />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ────────────────────────── Guide modal body ────────────────────────── */

function GuideModalBody({
  guide,
  eligible,
  fits,
  chosen,
  onChoose,
}: {
  guide: Guide;
  eligible: boolean;
  fits: boolean;
  chosen: boolean;
  onChoose: () => void;
}) {
  return (
    <div className="p-6 sm:p-8">
      <div className="flex gap-5">
        <div className="relative shrink-0">
          <img
            src={guide.portrait}
            alt={guide.name}
            className="w-28 h-36 object-cover grayscale-[18%] sepia-[26%] brightness-[0.92] border border-highlight/40 vignette"
          />
        </div>
        <div className="min-w-0">
          <GuideRankBadge level={guide.level} size="md" withName />
          <h2 className="font-heading uppercase tracking-[0.05em] text-[22px] text-foreground leading-tight mt-3">
            {guide.name}
          </h2>
          <p className="font-accent italic text-muted text-[13px] mt-1 line-clamp-2">
            {guide.title}
          </p>
          <p className="font-accent uppercase tracking-[0.16em] text-[11px] text-accent mt-2">
            {guide.homeRegion} · {guide.specialization}
          </p>
          <div className="flex items-center gap-1 mt-2.5">
            {[0, 1, 2, 3, 4].map((i) => {
              const filled = i < Math.round(guide.rating);
              return (
                <Star
                  key={i}
                  size={14}
                  strokeWidth={1.5}
                  className={filled ? "text-accent" : "text-highlight/40"}
                  fill={filled ? "currentColor" : "none"}
                />
              );
            })}
            <span className="font-accent text-muted text-[12px] ml-1.5 tracking-[0.1em]">
              {guide.rating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      <div className="ink-divider my-6" />

      {fits && eligible && (
        <p className="mb-5 flex items-center gap-2 font-accent italic text-accent text-[13px] tracking-[0.1em]">
          <span style={{ textShadow: "0 0 8px rgba(201,146,42,0.9)" }}>✦</span>
          Matched to this road&apos;s country
        </p>
      )}

      <ChipRow label="Skills" items={guide.skills} />
      <ChipRow label="Leads" items={guide.experienceTypes} />
      <div className="mt-5">
        <p className="font-accent uppercase tracking-[0.2em] text-[10px] text-muted mb-2">Tongues</p>
        <p className="font-serif italic text-foreground/85 text-[15px]">
          {guide.languages.join(" · ")}
        </p>
      </div>

      {eligible ? (
        <button
          type="button"
          onClick={onChoose}
          className="mt-8 w-full px-10 py-4 border border-accent bg-accent/15 hover:bg-accent hover:text-background transition-all duration-500 font-accent text-[12px] tracking-[0.3em] uppercase text-foreground ember-glow"
        >
          {chosen ? "Keep this guide" : "Choose this guide"}
        </button>
      ) : (
        <div className="mt-8">
          <button
            type="button"
            disabled
            className="w-full px-10 py-4 border border-highlight/30 opacity-50 cursor-not-allowed font-accent text-[12px] tracking-[0.3em] uppercase text-muted"
          >
            Rank too low for this road
          </button>
          <p className="mt-3 text-center font-accent italic text-highlight text-[12px] tracking-[0.1em]">
            This road asks a higher gerege. Choose a brighter tier above.
          </p>
        </div>
      )}
    </div>
  );
}

function ChipRow({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="mb-5">
      <p className="font-accent uppercase tracking-[0.2em] text-[10px] text-muted mb-2.5">{label}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((it) => (
          <span
            key={it}
            className="px-3 py-1.5 border border-highlight/40 font-accent text-[11px] tracking-[0.08em] text-foreground/85"
          >
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────── Step heading + tiles + helpers ────────────────────────── */

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

function GuideTile({
  guide,
  index = 0,
  medal,
  selected,
  eligible,
  fits,
  onOpen,
}: {
  guide: Guide;
  index?: number;
  medal: Medal;
  selected: boolean;
  eligible: boolean;
  fits: boolean;
  onOpen: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      title={`${guide.name} · ${guide.level}`}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="group/tile relative block w-[100px] sm:w-[118px] cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
    >
      <div
        className="relative aspect-[3/4] overflow-hidden transition-all duration-300"
        style={{
          border: selected
            ? "1.5px solid #C9922A"
            : `1px solid ${eligible ? "rgba(139,94,60,0.5)" : "rgba(139,94,60,0.25)"}`,
          boxShadow: selected
            ? "0 0 0 1px rgba(201,146,42,0.45), 0 0 22px -6px rgba(201,146,42,0.75), 0 14px 30px -16px rgba(0,0,0,0.85)"
            : "inset 0 0 30px rgba(0,0,0,0.45)",
        }}
      >
        <img
          src={guide.portrait}
          alt={guide.name}
          className={[
            "w-full h-full object-cover transition-all duration-500",
            eligible
              ? "grayscale-[18%] sepia-[26%] brightness-[0.88] group-hover/tile:brightness-105 group-hover/tile:scale-[1.05]"
              : "grayscale brightness-[0.4] group-hover/tile:brightness-[0.5]",
          ].join(" ")}
        />

        {/* Inner vignette */}
        <span
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 0%, transparent 55%, rgba(13,10,7,0.55) 100%)",
          }}
        />

        {/* Rank pip */}
        <span
          className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full flex items-center justify-center font-heading text-[9px] z-10"
          style={{
            background: `radial-gradient(120% 120% at 50% 25%, ${medal.fill} 0%, #160d06 100%)`,
            border: `1px solid ${eligible ? medal.ring : "#6b5640"}`,
            color: eligible ? medal.text : "#8a755a",
            opacity: eligible ? 1 : 0.7,
          }}
        >
          {medal.sigil}
        </span>

        {/* Best-match mark (hidden once chosen) */}
        {fits && eligible && !selected && (
          <span
            className="absolute top-1.5 right-1.5 text-accent text-[12px] leading-none z-10"
            style={{ textShadow: "0 0 8px rgba(201,146,42,0.9)" }}
          >
            ✦
          </span>
        )}

        {/* Locked mark */}
        {!eligible && (
          <span className="absolute top-1.5 right-2 text-highlight text-[12px] leading-none z-10">
            ⌖
          </span>
        )}

        {/* Name plate */}
        <div
          className="absolute inset-x-0 bottom-0 pt-8 pb-2 px-2"
          style={{
            background:
              "linear-gradient(to top, rgba(13,10,7,0.96) 0%, rgba(13,10,7,0.6) 55%, transparent 100%)",
          }}
        >
          <p className="font-heading uppercase tracking-[0.06em] text-[10.5px] text-foreground text-center truncate leading-none">
            {guide.name.split(" ")[0]}
          </p>
          {selected && (
            <p className="font-accent italic text-accent text-[8.5px] tracking-[0.22em] uppercase text-center mt-1 leading-none">
              Chosen
            </p>
          )}
        </div>

        {/* Hover gold sweep */}
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 group-hover/tile:scale-x-100 transition-transform duration-500"
          style={{ background: "linear-gradient(90deg, transparent, #C9922A, transparent)" }}
        />
      </div>

      {/* Wax-seal — overhangs the frame, so it lives outside the clipped box */}
      {selected && (
        <span className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-[#7a2a18] border-2 border-[#3a1108] flex items-center justify-center text-[#f0e2c2] rotate-[-8deg] shadow-[0_2px_8px_rgba(0,0,0,0.6)] z-20">
          <Check size={13} />
        </span>
      )}
    </motion.button>
  );
}

function Spec({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <dt className="font-accent uppercase tracking-[0.2em] text-[10px] text-muted mb-1">{label}</dt>
      <dd
        className={[
          "font-serif text-[14px] leading-snug",
          accent ? "text-accent" : "text-foreground/90",
        ].join(" ")}
      >
        {value}
      </dd>
    </div>
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
