"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useLenis } from "lenis/react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Star, Minus, Plus } from "lucide-react";
import GuideRankBadge from "@/components/GuideRankBadge";
import type { Journey, MountOption, Vehicle } from "@/lib/journeys";
import {
  ACCOMMODATION_OPTIONS,
  DIETARY_OPTIONS,
  getVehicle,
  guidesForJourney,
  guideFitsCategory,
  guideMeetsRank,
  mountsForJourney,
  CATEGORY_SIGIL,
  GUIDE_MEDAL,
  type Medal,
} from "@/lib/journeys";
import { LEVEL_ORDER, type Guide, type GuideLevel } from "@/lib/guides";
import { formatPriceRange } from "@/lib/format";
import {
  type GuideRole,
  type JourneyDraft,
  checkDraft,
  clearDraft,
  emptyDraft,
  loadDraft,
  saveDraft,
} from "@/lib/draft";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { rememberCharter } from "@/lib/charter-tracking";
import { EASE, DUR, STAGGER } from "@/lib/motion";

type Props = { journey: Journey };

const STEPS = ["Vehicle", "Guide", "Comforts", "Summary"] as const;

export default function CharterWizard({ journey }: Props) {
  const vehicles = useMemo(
    () => journey.vehicleOptions.map(getVehicle).filter(Boolean) as Vehicle[],
    [journey]
  );
  const guides = useMemo(() => guidesForJourney(journey), [journey]);
  const mounts = useMemo(() => mountsForJourney(journey), [journey]);
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

  // Draft — single source of truth for every selection. Persisted in
  // localStorage; Phase B will swap this for a server-side draft model.
  // Lazy initialiser checks localStorage first, so we restore any saved
  // draft without a second render. SSR safely returns the empty draft
  // since loadDraft() returns null when window is undefined.
  const [draft, setDraft] = useState<JourneyDraft>(() => {
    const saved = loadDraft(journey.slug);
    if (saved) return saved;
    const fresh = emptyDraft(journey.slug);
    fresh.vehicleId = journey.requiredVehicle;
    return fresh;
  });
  // Auto-save every change. Cheap; localStorage write is sync.
  useEffect(() => {
    saveDraft(draft);
  }, [draft]);

  function patchDraft(patch: Partial<JourneyDraft>) {
    setDraft((d) => ({ ...d, ...patch }));
  }

  const [step, setStep] = useState(0);
  const [sent, setSent] = useState(false);
  const [sentId, setSentId] = useState<string | null>(null);

  // When the step changes, snap the wizard's top under the fixed navbar.
  // Without this the user sits at the bottom of the previous step (where
  // the Continue button is) and the new step's heading is off-screen,
  // making it feel like the page is "stuck" near the footer.
  //
  // The scroll is gated behind a "user has interacted" flag rather than
  // a didMount check, because `useLenis()` returns undefined on first
  // render and a defined instance later — if we keyed on `lenis` the
  // effect would fire on the page load once Lenis hydrated, yanking
  // the user down on arrival.
  const wizardRef = useRef<HTMLDivElement | null>(null);
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);
  const interactedRef = useRef(false);
  useEffect(() => {
    if (!interactedRef.current) return;
    const node = wizardRef.current;
    if (!node) return;
    const offset = -110;
    const l = lenisRef.current;
    if (l) {
      l.scrollTo(node, { offset, duration: 0.7 });
    } else {
      const top = node.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, [step, sent]);

  // View-details modals (vehicle / guide). Object kept after close so
  // exit animations still render it.
  const [modalVehicle, setModalVehicle] = useState<Vehicle | null>(null);
  const [vehicleOpen, setVehicleOpen] = useState(false);
  const [modalGuide, setModalGuide] = useState<Guide | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);

  const vehicle = vehicles.find((v) => v.id === draft.vehicleId) ?? null;
  const guide = guides.find((g) => g.slug === draft.guideSlug) ?? null;
  const completeness = useMemo(() => checkDraft(draft), [draft]);

  const openVehicle = (v: Vehicle) => {
    setModalVehicle(v);
    setVehicleOpen(true);
  };
  const openGuide = (g: Guide) => {
    setModalGuide(g);
    setGuideOpen(true);
  };

  function goToStep(i: number) {
    if (i < 0 || i >= STEPS.length) return;
    // Don't allow jumping past Guide without one chosen
    if (i >= 2 && !guide) return;
    interactedRef.current = true;
    setStep(i);
  }

  async function submit() {
    // Backend-backed submission. Falls back to mailto if the API is unreachable
    // so the user is never stranded mid-form.
    const payload = {
      journeySlug: journey.slug,
      vehicleId: draft.vehicleId ?? null,
      guideSlug: draft.guideSlug ?? null,
      guideRole: draft.guideRole,
      travelers: draft.travelers,
      accommodation: draft.accommodation,
      diet: draft.diet,
      dietNotes: draft.dietNotes,
      designatedCook: draft.designatedCook,
      mount: draft.mount,
      specialRequirements: draft.specialRequirements,
      contactName: draft.contact.name,
      contactEmail: draft.contact.email,
      contactPhone: "",
      contactDates: draft.contact.dates ?? "",
    };
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    try {
      const res = await fetch(`${base}/api/charters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Submit failed (${res.status})`);
      const created = (await res.json()) as { id: string };
      // Pin the charter to localStorage so the user can track it without an account.
      rememberCharter(created.id, journey.title, draft.contact.email);
      setSentId(created.id);
    } catch {
      // Network-level fallback: open the user's mail client so the inquiry
      // still reaches the team. Preserves the prior behaviour.
      if (typeof window !== "undefined") {
        const subject = `Charter — ${journey.title}`;
        const body =
          `Journey: ${journey.title} (${journey.region})\n` +
          `Travelers: ${draft.travelers}\n` +
          `Dates: ${draft.contact.dates || "—"}\n\n— ${draft.contact.name}`;
        window.location.href = `mailto:hello@geregeguild.mn?subject=${encodeURIComponent(
          subject,
        )}&body=${encodeURIComponent(body)}`;
      }
    }
    clearDraft(journey.slug);
    interactedRef.current = true;
    setSent(true);
  }

  return (
    <div ref={wizardRef} className="max-w-5xl mx-auto scroll-mt-28">
      {/* Progress — wax-medallion trail with ink connective line */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-3 mb-14 select-none">
        {STEPS.map((label, i) => {
          const done = i < step;
          const current = i === step;
          // Vehicle (0) and Guide (1) are always reachable. Beyond Guide,
          // we need a guide chosen — otherwise the rest of the charter
          // has nothing to attach to.
          const reachable = i <= 1 || !!guide;
          return (
            <div key={label} className="flex items-center gap-1.5 sm:gap-3">
              <button
                type="button"
                onClick={() => reachable && goToStep(i)}
                disabled={!reachable}
                aria-current={current ? "step" : undefined}
                className="flex items-center gap-3 disabled:cursor-not-allowed group/step"
              >
                <span className="relative inline-flex items-center justify-center shrink-0" style={{ width: 34, height: 34 }}>
                  {/* Outer illumination ring — only under the active medallion */}
                  {current && (
                    <motion.span
                      aria-hidden
                      layoutId="wizard-step-halo"
                      className="absolute inset-[-6px] rounded-full"
                      style={{
                        border: "1px solid rgba(201,146,42,0.35)",
                        boxShadow: "0 0 22px -4px rgba(201,146,42,0.55)",
                      }}
                      transition={{ duration: DUR.base, ease: EASE }}
                    />
                  )}
                  {/* Medallion */}
                  <span
                    className={[
                      "relative inline-flex items-center justify-center rounded-full font-heading transition-all duration-500",
                      current ? "ember-breath" : "",
                    ].join(" ")}
                    style={{
                      width: 32,
                      height: 32,
                      background: done
                        ? "radial-gradient(120% 120% at 50% 25%, #7a2a18 0%, #3a1108 100%)"
                        : current
                          ? "radial-gradient(120% 120% at 50% 25%, rgba(201,146,42,0.28) 0%, rgba(28,21,16,0.9) 100%)"
                          : "radial-gradient(120% 120% at 50% 25%, rgba(46,31,20,0.7) 0%, rgba(22,15,9,0.9) 100%)",
                      border: done
                        ? "1.5px solid #3a1108"
                        : current
                          ? "1.5px solid #C9922A"
                          : "1px solid rgba(139,94,60,0.35)",
                      color: done ? "#f0e2c2" : current ? "#F0E6D3" : "#7a6650",
                      fontSize: 12,
                      letterSpacing: "0.06em",
                      transform: done ? "rotate(-6deg)" : "rotate(0deg)",
                      boxShadow: done
                        ? "0 2px 6px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)"
                        : current
                          ? "inset 0 0 12px rgba(0,0,0,0.55), 0 0 14px -4px rgba(201,146,42,0.55)"
                          : "inset 0 0 10px rgba(0,0,0,0.6)",
                    }}
                  >
                    {done ? <Check size={14} strokeWidth={2.4} /> : i + 1}
                  </span>
                </span>
                <span
                  className={[
                    "font-accent uppercase tracking-[0.24em] text-[11px] hidden sm:inline transition-colors duration-500",
                    current
                      ? "text-foreground"
                      : done
                        ? "text-accent/85"
                        : reachable
                          ? "text-muted group-hover/step:text-foreground/80"
                          : "text-muted/60",
                  ].join(" ")}
                >
                  {label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <span
                  aria-hidden
                  className="relative w-6 sm:w-14 h-px overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(139,94,60,0.35) 0%, rgba(139,94,60,0.45) 50%, rgba(139,94,60,0.35) 100%)",
                  }}
                >
                  <motion.span
                    className="absolute inset-0 origin-left"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(201,146,42,0.9) 0%, rgba(201,146,42,0.5) 100%)",
                      filter: "drop-shadow(0 0 4px rgba(201,146,42,0.55))",
                    }}
                    initial={false}
                    animate={{ scaleX: done ? 1 : 0 }}
                    transition={{ duration: DUR.base, ease: EASE }}
                  />
                </span>
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
            initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
            transition={{ duration: DUR.base, ease: EASE }}
          >
            <StepHeading
              eyebrow="Step One"
              title="Choose the machine"
              sub="The road is set. Now choose how you cross it — press a machine to see it and pick."
            />
            <div className="grid md:grid-cols-2 gap-5">
              {vehicles.map((v) => {
                const selected = v.id === draft.vehicleId;
                const recommended = v.id === journey.requiredVehicle;
                return (
                  <motion.button
                    key={v.id}
                    type="button"
                    onClick={() => openVehicle(v)}
                    whileHover={{ y: -2 }}
                    animate={{ y: selected ? 1 : 0 }}
                    transition={{ duration: DUR.fast, ease: EASE }}
                    className={[
                      "relative text-left border p-6 transition-[background-color,border-color,box-shadow] duration-500 group/v overflow-hidden",
                      selected
                        ? "border-accent bg-accent/[0.08] ember-glow"
                        : "border-highlight/40 bg-surface/40 hover:border-accent/60",
                    ].join(" ")}
                  >
                    {/* Inset ember bloom when selected */}
                    {selected && (
                      <motion.span
                        aria-hidden
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: DUR.base, ease: EASE }}
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background:
                            "radial-gradient(120% 90% at 50% 0%, rgba(201,146,42,0.12), transparent 55%)",
                        }}
                      />
                    )}
                    {/* Wax seal — overhangs top-right when chosen */}
                    {selected && (
                      <motion.span
                        aria-hidden
                        initial={{ scale: 0.4, opacity: 0, rotate: -30 }}
                        animate={{ scale: 1, opacity: 1, rotate: -8 }}
                        transition={{ duration: DUR.fast, ease: EASE }}
                        className="absolute -top-2.5 -right-2.5 w-8 h-8 rounded-full bg-[#7a2a18] border-2 border-[#3a1108] flex items-center justify-center text-[#f0e2c2] shadow-[0_2px_8px_rgba(0,0,0,0.6)] z-20"
                      >
                        <Check size={14} strokeWidth={2.4} />
                      </motion.span>
                    )}
                    <div className="relative flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-accent text-2xl leading-none">{v.sigil}</span>
                        <h3 className="font-heading uppercase tracking-[0.06em] text-[18px] text-foreground">
                          {v.name}
                        </h3>
                      </div>
                      {selected ? (
                        <span className="flex items-center gap-1.5 font-accent uppercase tracking-[0.22em] text-[9px] text-accent">
                          Chosen
                        </span>
                      ) : (
                        recommended && (
                          <span className="font-accent uppercase tracking-[0.18em] text-[9px] text-accent border border-accent/40 px-2 py-1">
                            For this road
                          </span>
                        )
                      )}
                    </div>
                    <p className="relative text-foreground/80 text-[14px] font-serif leading-relaxed mb-4">
                      {v.blurb}
                    </p>
                    <div className="relative grid grid-cols-2 gap-y-2 gap-x-3 font-accent text-[10px] tracking-[0.12em] uppercase text-muted">
                      <span>Terrain · <span className="text-foreground/80 normal-case font-serif tracking-normal">{v.terrain.split(",")[0]}</span></span>
                      <span>Seats · <span className="text-foreground/80 normal-case font-serif tracking-normal">{v.passengers.split("+")[0]}</span></span>
                      <span>Comfort · <span className="text-foreground/80 normal-case font-serif tracking-normal">{v.comfort}</span></span>
                      <span>Price · <span className="text-accent normal-case font-serif tracking-normal">{v.priceImpact}</span></span>
                    </div>
                    <p className="relative mt-4 pt-3 border-t border-highlight/25 font-accent uppercase tracking-[0.22em] text-[10px] text-accent group-hover/v:translate-x-1 transition-transform duration-300">
                      {selected ? "View details" : "View & choose"} →
                    </p>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* STEP 2 — Guide */}
        {step === 1 && (
          <motion.div
            key="guide"
            initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
            transition={{ duration: DUR.base, ease: EASE }}
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
                    transition={{ duration: DUR.base, delay: ti * STAGGER.tight, ease: EASE }}
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
                          selected={g.slug === draft.guideSlug}
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

        {/* STEP 3 — Comforts (accommodation, diet, mount) */}
        {step === 2 && (
          <motion.div
            key="comforts"
            initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
            transition={{ duration: DUR.base, ease: EASE }}
          >
            <StepHeading
              eyebrow="Step Three"
              title="Comforts of the charter"
              sub="How you sleep, how you eat, and what you ride — set the small things that make the long road yours."
            />

            <ComfortsStep
              draft={draft}
              mounts={mounts}
              onPatch={patchDraft}
            />
          </motion.div>
        )}

        {/* STEP 4 — Summary (inline; replaces the old review modal) */}
        {step === 3 && (
          <motion.div
            key="summary"
            initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
            transition={{ duration: DUR.base, ease: EASE }}
          >
            <StepHeading
              eyebrow="Step Four"
              title="Your charter"
              sub="Read it back, set who you are, and send the raven. A guide — not a sales desk — writes the first reply."
            />

            <SummaryStep
              journey={journey}
              vehicle={vehicle}
              guide={guide}
              draft={draft}
              completeness={completeness}
              onPatch={patchDraft}
              onSubmit={submit}
              sent={sent}
              sentId={sentId}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav controls — hidden on the Summary step (its own submit) */}
      {step < 3 && !sent && (
        <div className="mt-14 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => goToStep(step - 1)}
            disabled={step === 0}
            className="group/back relative px-6 sm:px-8 py-4 border border-highlight/50 hover:border-accent disabled:opacity-30 disabled:hover:border-highlight/50 transition-all duration-500 font-accent text-[12px] tracking-[0.3em] uppercase text-muted hover:text-foreground"
          >
            <span className="inline-flex items-center gap-2">
              <span className="inline-block transition-transform duration-500 group-hover/back:-translate-x-1">←</span>
              <span className="relative">
                Back
                <span
                  aria-hidden
                  className="absolute left-0 -bottom-1 h-px w-full origin-right scale-x-0 group-hover/back:scale-x-100 group-hover/back:origin-left transition-transform duration-500"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent 0%, rgba(201,146,42,0.55) 40%, rgba(201,146,42,0.55) 60%, transparent 100%)",
                  }}
                />
              </span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => goToStep(step + 1)}
            disabled={(step === 0 && !vehicle) || (step >= 1 && !guide)}
            className="group/next px-8 sm:px-10 py-4 border border-accent bg-accent/15 hover:bg-accent hover:text-background disabled:opacity-40 disabled:hover:bg-accent/15 disabled:hover:text-foreground transition-all duration-500 font-accent text-[12px] tracking-[0.3em] uppercase text-foreground ember-glow"
          >
            <span className="inline-flex items-center gap-2.5">
              {step === 0
                ? "Choose your guide"
                : step === 1
                  ? "Comforts of the charter"
                  : "Review the charter"}
              <span className="inline-block transition-transform duration-500 group-hover/next:translate-x-1">→</span>
            </span>
          </button>
        </div>
      )}

      {/* Testimonial drift — a single chronicle threaded through the build,
          rotates by step so the user reads new voices as they progress. */}
      {!sent && step < 3 && <BuildTestimonial step={step} />}

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
                patchDraft({ vehicleId: modalVehicle.id });
                setVehicleOpen(false);
              }}
              className="mt-8 w-full px-10 py-4 border border-accent bg-accent/15 hover:bg-accent hover:text-background transition-all duration-500 font-accent text-[12px] tracking-[0.3em] uppercase text-foreground ember-glow"
            >
              {modalVehicle.id === draft.vehicleId ? "Keep this machine" : "Choose this machine"}
            </button>
          </div>
        )}
      </Modal>

      {/* ── Guide detail modal ── */}
      <Modal open={guideOpen} onClose={() => setGuideOpen(false)} maxW="max-w-xl">
        {modalGuide && (
          <GuideModalBody
            // key remounts the body for each guide so local state
            // (role toggle) reinitialises cleanly.
            key={modalGuide.slug}
            guide={modalGuide}
            eligible={guideMeetsRank(modalGuide, journey)}
            fits={guideFitsCategory(modalGuide, journey)}
            chosen={modalGuide.slug === draft.guideSlug}
            initialRole={
              modalGuide.slug === draft.guideSlug ? draft.guideRole : "Lead"
            }
            onChoose={(role) => {
              patchDraft({ guideSlug: modalGuide.slug, guideRole: role });
              setGuideOpen(false);
            }}
          />
        )}
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
  // Lock the background page scroll (incl. Lenis) while open.
  useLockBodyScroll(open);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
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
          data-lenis-prevent
        >
          <div className="absolute inset-0 bg-[#0D0A07]/90 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.96, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 14, scale: 0.97, filter: "blur(6px)" }}
            transition={{ duration: DUR.base, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            className={`relative z-10 w-full ${maxW} max-h-[90vh] overflow-y-auto bg-background border border-accent/30 ember-glow`}
            data-lenis-prevent
          >
            {/* Wax-seal close */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-3.5 right-3.5 z-20 w-9 h-9 rounded-full flex items-center justify-center text-[#f0e2c2] hover:text-white transition-all duration-300 hover:rotate-[6deg] hover:scale-[1.06]"
              style={{
                background:
                  "radial-gradient(120% 120% at 50% 22%, #7a2a18 0%, #3a1108 100%)",
                border: "2px solid #3a1108",
                boxShadow:
                  "0 2px 8px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.1)",
              }}
            >
              <X size={15} strokeWidth={2.4} />
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
  initialRole = "Lead",
  onChoose,
}: {
  guide: Guide;
  eligible: boolean;
  fits: boolean;
  chosen: boolean;
  initialRole?: GuideRole;
  onChoose: (role: GuideRole) => void;
}) {
  // The same guide can be chosen as either the Lead or as a Trainee
  // accompanying a more senior Lead. Trainee charters cost less and
  // give newer guides exposure on graded roads. (Pricing in Phase C.)
  // Parent passes a key={guide.slug} so this component remounts per
  // guide — useState reinitialises cleanly, no effect needed.
  const [role, setRole] = useState<GuideRole>(initialRole);
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
        <>
          {/* Lead vs Trainee — every guide can join in either role. */}
          <div className="mt-6">
            <p className="font-accent uppercase tracking-[0.2em] text-[10px] text-muted mb-2.5">
              Role on this charter
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(["Lead", "Trainee"] as const).map((r) => {
                const active = role === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={[
                      "px-4 py-3 border font-accent uppercase tracking-[0.16em] text-[11px] transition-all duration-300",
                      active
                        ? "border-accent bg-accent/15 text-accent ember-glow"
                        : "border-highlight/40 text-foreground/80 hover:border-accent/70 hover:text-foreground",
                    ].join(" ")}
                  >
                    {r === "Lead" ? "Lead guide" : "Trainee · accompanying"}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 font-accent italic text-muted text-[11px] leading-relaxed">
              Trainee guides ride with a senior lead — lighter on the
              charter, formative for the guide.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onChoose(role)}
            className="mt-6 w-full px-10 py-4 border border-accent bg-accent/15 hover:bg-accent hover:text-background transition-all duration-500 font-accent text-[12px] tracking-[0.3em] uppercase text-foreground ember-glow"
          >
            {chosen ? "Keep this guide" : "Choose this guide"}
          </button>
        </>
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
      transition={{ duration: DUR.fast, delay: index * 0.05, ease: EASE }}
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

/* ────────────────────────── ComfortsStep (Step 3) ──────────────────────────
   Accommodation style, dietary preference, optional mount. All three live
   on one screen because they're small choices that should not be three
   separate page-loads of friction. */

function ComfortsStep({
  draft,
  mounts,
  onPatch,
}: {
  draft: JourneyDraft;
  mounts: MountOption[];
  onPatch: (patch: Partial<JourneyDraft>) => void;
}) {
  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Accommodation */}
      <div>
        <p className="font-accent italic text-accent text-[12px] tracking-[0.3em] uppercase mb-4">
          Sleeping arrangements
        </p>
        <div className="space-y-3">
          {ACCOMMODATION_OPTIONS.map((opt) => {
            const active = draft.accommodation === opt.id;
            return (
              <motion.button
                key={opt.id}
                type="button"
                onClick={() => onPatch({ accommodation: opt.id })}
                whileHover={{ y: -1 }}
                animate={{ y: active ? 1 : 0 }}
                transition={{ duration: DUR.fast, ease: EASE }}
                className={[
                  "relative w-full text-left border p-5 transition-[background-color,border-color,box-shadow] duration-500 overflow-hidden",
                  active
                    ? "border-accent bg-accent/[0.08] ember-glow"
                    : "border-highlight/40 bg-surface/40 hover:border-accent/60",
                ].join(" ")}
              >
                {active && (
                  <motion.span
                    aria-hidden
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: DUR.base, ease: EASE }}
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(120% 90% at 0% 0%, rgba(201,146,42,0.12), transparent 55%)",
                    }}
                  />
                )}
                <div className="relative flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-heading uppercase tracking-[0.06em] text-[15px] text-foreground flex items-center gap-2">
                    {opt.label}
                    {active && (
                      <motion.span
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: DUR.fast, ease: EASE }}
                        className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-accent text-background"
                        aria-hidden
                      >
                        <Check size={10} strokeWidth={3} />
                      </motion.span>
                    )}
                  </h3>
                  <span
                    className={[
                      "shrink-0 font-accent uppercase tracking-[0.16em] text-[10px] px-2 py-1 border",
                      opt.id === "Private"
                        ? "border-accent/50 text-accent"
                        : "border-highlight/40 text-muted",
                    ].join(" ")}
                  >
                    {opt.feeHint}
                  </span>
                </div>
                <p className="relative text-foreground/75 text-[14px] font-serif italic leading-relaxed">
                  {opt.blurb}
                </p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Diet */}
      <div>
        <p className="font-accent italic text-accent text-[12px] tracking-[0.3em] uppercase mb-4">
          Diet at camp
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          {DIETARY_OPTIONS.map((opt) => {
            const active = draft.diet === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onPatch({ diet: opt.id })}
                className={[
                  "flex items-center gap-2.5 px-4 py-3 border font-accent text-[12px] tracking-[0.1em] transition-all duration-300",
                  active
                    ? "border-accent bg-accent/15 text-accent ember-glow"
                    : "border-highlight/40 text-foreground/80 hover:border-accent/70 hover:text-foreground",
                ].join(" ")}
              >
                <span className="text-base leading-none">{opt.sigil}</span>
                {opt.label.split("(")[0].trim()}
              </button>
            );
          })}
        </div>
        {draft.diet === "Other" && (
          <div className="mt-4">
            <label className="font-accent uppercase tracking-[0.2em] text-[10px] text-muted block mb-2">
              Tell us
            </label>
            <textarea
              rows={2}
              value={draft.dietNotes}
              onChange={(e) => onPatch({ dietNotes: e.target.value })}
              placeholder="e.g. gluten-free, halal, severe nut allergy"
              className="w-full bg-surface/40 border border-highlight/40 focus:border-accent/70 outline-none px-4 py-3 font-serif text-foreground text-[15px] leading-relaxed transition-colors resize-none placeholder:text-muted/50"
            />
          </div>
        )}
        <label className="mt-5 flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={draft.designatedCook}
            onChange={(e) => onPatch({ designatedCook: e.target.checked })}
            className="mt-1 w-4 h-4 accent-[#C9922A] cursor-pointer"
          />
          <span>
            <span className="block font-accent uppercase tracking-[0.16em] text-[12px] text-foreground group-hover:text-accent transition-colors">
              Request a designated cook
            </span>
            <span className="block font-accent italic text-muted text-[12px] leading-relaxed mt-1">
              A cook on the charter, matched to the diet above. May add to the fee.
            </span>
          </span>
        </label>

        {/* Mount */}
        <div className="mt-9">
          <p className="font-accent italic text-accent text-[12px] tracking-[0.3em] uppercase mb-4">
            Mount along the road
          </p>
          <div className="space-y-2.5">
            {mounts.map((m) => {
              const active = draft.mount === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onPatch({ mount: m.id })}
                  className={[
                    "w-full text-left flex items-start gap-3 px-4 py-3 border transition-all duration-300",
                    active
                      ? "border-accent bg-accent/[0.08] ember-glow"
                      : "border-highlight/40 bg-surface/40 hover:border-accent/60",
                  ].join(" ")}
                >
                  <span className="text-accent text-[18px] leading-none mt-0.5 w-5 text-center shrink-0">
                    {m.sigil}
                  </span>
                  <span>
                    <span className="block font-heading uppercase tracking-[0.06em] text-[13px] text-foreground">
                      {m.label}
                    </span>
                    <span className="block font-accent italic text-muted text-[12px] leading-relaxed mt-1">
                      {m.blurb}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
          {mounts.length === 1 && (
            <p className="mt-3 font-accent italic text-muted text-[11px] leading-relaxed">
              This country does not keep mounts for guests. Set as written.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────── SummaryStep (Step 4) ──────────────────────────
   The full charter at a glance + the contact details + send-raven CTA.
   This replaces the old review modal — inline, scrollable, no extra click. */

type DraftCompleteness = { ready: boolean; missing: string[] };

function SummaryStep({
  journey,
  vehicle,
  guide,
  draft,
  completeness,
  onPatch,
  onSubmit,
  sent,
  sentId,
}: {
  journey: Journey;
  vehicle: Vehicle | null;
  guide: Guide | null;
  draft: JourneyDraft;
  completeness: DraftCompleteness;
  onPatch: (patch: Partial<JourneyDraft>) => void;
  onSubmit: () => void;
  sent: boolean;
  sentId: string | null;
}) {
  if (sent) {
    return (
      <div className="text-center py-12 max-w-xl mx-auto">
        {/* Wax-seal stamp — press-down entrance */}
        <motion.div
          initial={{ scale: 1.9, opacity: 0, rotate: -22, y: -14 }}
          animate={{ scale: 1, opacity: 1, rotate: -8, y: 0 }}
          transition={{ duration: DUR.base, ease: EASE, delay: 0.05 }}
          className="mx-auto mb-8 relative"
          style={{ width: 108, height: 108 }}
        >
          {/* Outer halo */}
          <motion.span
            aria-hidden
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: [0.4, 1.35, 1], opacity: [0, 0.7, 0] }}
            transition={{ duration: 1.2, ease: EASE, delay: 0.35 }}
            className="absolute inset-0 rounded-full"
            style={{
              border: "1px solid rgba(201,146,42,0.6)",
              boxShadow: "0 0 24px rgba(201,146,42,0.4)",
            }}
          />
          <span
            className="relative w-full h-full rounded-full flex items-center justify-center font-heading text-[#f0e2c2] text-3xl"
            style={{
              background:
                "radial-gradient(120% 120% at 50% 20%, #a03720 0%, #7a2a18 45%, #3a1108 100%)",
              border: "3px solid #3a1108",
              boxShadow:
                "0 12px 32px rgba(0,0,0,0.6), inset 0 2px 0 rgba(255,255,255,0.12), inset 0 0 22px rgba(0,0,0,0.5)",
              letterSpacing: "0.08em",
            }}
          >
            ✦
          </span>
        </motion.div>
        <motion.h3
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DUR.base, ease: EASE, delay: 0.35 }}
          className="font-heading text-3xl uppercase tracking-[0.1em] text-foreground ember-text-glow candle-flicker"
        >
          The raven is away
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DUR.base, ease: EASE, delay: 0.45 }}
          className="mt-5 text-foreground/85 font-serif italic text-[18px] leading-relaxed"
        >
          Your charter request reached the Guild. A guide — not a sales desk —
          will write back. You can watch the road from your reference page,
          and the bell at the top will light when there is news.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DUR.base, ease: EASE, delay: 0.55 }}
          className="mt-10 flex flex-wrap justify-center gap-3"
        >
          <Link
            href={sentId ? `/charter/track/${sentId}` : "/charter/me"}
            className="group/track inline-flex items-center gap-2.5 px-10 py-4 border border-accent bg-accent/10 hover:bg-accent hover:text-background transition-all duration-500 font-accent text-[12px] tracking-[0.3em] uppercase text-foreground ember-glow"
          >
            Track my charter
            <span className="inline-block transition-transform duration-500 group-hover/track:translate-x-1">→</span>
          </Link>
          <Link
            href="/journeys"
            className="inline-block px-10 py-4 border border-highlight/50 hover:border-accent transition-all duration-500 font-accent text-[12px] tracking-[0.3em] uppercase text-muted hover:text-foreground"
          >
            Explore other roads
          </Link>
        </motion.div>
        {sentId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: DUR.slow, ease: EASE, delay: 0.7 }}
            className="mt-12 inline-block"
          >
            <p className="font-accent uppercase tracking-[0.28em] text-[10px] text-muted mb-2">
              Reference seal
            </p>
            <p className="font-heading text-accent text-[15px] tracking-[0.18em] px-5 py-2.5 border border-accent/40 ember-glow bg-surface/40">
              {sentId}
            </p>
            <p className="mt-3 font-accent italic text-muted text-[11px] tracking-[0.06em] leading-relaxed max-w-sm mx-auto">
              Keep this id if you need to reach the charter from another device.
            </p>
          </motion.div>
        )}
      </div>
    );
  }

  const accommodationLabel =
    draft.accommodation === "Private"
      ? "Private sleeping arrangements"
      : "Group ger / shared camp";
  const dietLabel =
    draft.diet === "Other"
      ? draft.dietNotes.trim() || "Other (notes pending)"
      : draft.diet;
  const mountLabel = draft.mount === "None" ? "—" : draft.mount;
  const guideLabel = guide
    ? `${guide.name}${draft.guideRole === "Trainee" ? " · Trainee" : ""}`
    : "—";
  const guideSub = guide ? `${guide.level} · ${guide.homeRegion}` : undefined;

  return (
    <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8">
      {/* Charter summary card */}
      <div className="border border-highlight/40 bg-surface/50 p-7 ember-glow self-start">
        <p className="font-accent italic text-accent text-[12px] tracking-[0.3em] uppercase mb-5">
          Your charter
        </p>
        <SummaryRow
          label="Journey"
          value={`${CATEGORY_SIGIL[journey.category]}  ${journey.title}`}
          sub={journey.region}
        />
        <SummaryRow
          label="Vehicle"
          value={vehicle?.name ?? "—"}
          sub={vehicle?.priceImpact}
        />
        <SummaryRow label="Guide" value={guideLabel} sub={guideSub} />
        <SummaryRow label="Travelers" value={`${draft.travelers}`} />
        <SummaryRow label="Sleeping" value={accommodationLabel} />
        <SummaryRow
          label="Diet"
          value={dietLabel}
          sub={draft.designatedCook ? "Designated cook requested" : undefined}
        />
        <SummaryRow label="Mount" value={mountLabel} />
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
          An indicative figure. Your written charter will carry the true
          price — by traveler, guide rank, and the choices above — settled
          before you owe anything.
        </p>
      </div>

      {/* Contact + send */}
      <div className="space-y-5">
        {/* Traveler counter */}
        <div>
          <label className="font-accent uppercase tracking-[0.2em] text-[11px] text-muted block mb-2">
            Travelers in your party
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                onPatch({ travelers: Math.max(1, draft.travelers - 1) })
              }
              disabled={draft.travelers <= 1}
              className="w-10 h-10 flex items-center justify-center border border-highlight/50 hover:border-accent hover:text-accent text-foreground transition-colors disabled:opacity-30 disabled:hover:border-highlight/50 disabled:hover:text-foreground"
              aria-label="Fewer travelers"
            >
              <Minus size={16} />
            </button>
            <span className="relative w-12 h-10 flex items-center justify-center">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={draft.travelers}
                  initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
                  transition={{ duration: DUR.fast, ease: EASE }}
                  className="absolute font-heading text-foreground text-[26px] tabular-nums ember-text-glow"
                >
                  {draft.travelers}
                </motion.span>
              </AnimatePresence>
            </span>
            <button
              type="button"
              onClick={() =>
                onPatch({ travelers: Math.min(24, draft.travelers + 1) })
              }
              className="w-10 h-10 flex items-center justify-center border border-highlight/50 hover:border-accent hover:text-accent text-foreground transition-colors"
              aria-label="More travelers"
            >
              <Plus size={16} />
            </button>
            <span className="ml-2 font-accent italic text-muted text-[12px]">
              {draft.travelers === 1 ? "patron" : "patrons"}
            </span>
          </div>
        </div>

        {/* Special requirements */}
        <div>
          <label className="font-accent uppercase tracking-[0.2em] text-[11px] text-muted block mb-2">
            Special requirements (optional)
          </label>
          <textarea
            rows={3}
            value={draft.specialRequirements}
            onChange={(e) => onPatch({ specialRequirements: e.target.value })}
            placeholder="e.g. faster pace, reach Gobi in 2 days, hotel instead of ger one night"
            className="w-full bg-surface/40 border border-highlight/40 focus:border-accent/70 outline-none px-4 py-3 font-serif text-foreground text-[15px] leading-relaxed transition-colors resize-none placeholder:text-muted/50"
          />
          <p className="mt-1.5 font-accent italic text-muted text-[11px] leading-relaxed">
            Unusual requests may incur a fee. Your written charter will price them honestly.
          </p>
        </div>

        <Field
          label="Your name"
          value={draft.contact.name}
          onChange={(v) => onPatch({ contact: { ...draft.contact, name: v } })}
        />
        <Field
          label="Email for the reply"
          type="email"
          value={draft.contact.email}
          onChange={(v) => onPatch({ contact: { ...draft.contact, email: v } })}
        />
        <Field
          label="Rough dates"
          value={draft.contact.dates}
          placeholder="e.g. late August"
          onChange={(v) => onPatch({ contact: { ...draft.contact, dates: v } })}
        />

        <button
          type="button"
          onClick={onSubmit}
          disabled={!completeness.ready}
          className={[
            "group/send w-full px-10 py-5 border border-accent bg-accent/15 hover:bg-accent hover:text-background disabled:opacity-40 disabled:hover:bg-accent/15 disabled:hover:text-foreground transition-all duration-500 font-accent text-[12px] tracking-[0.35em] uppercase text-foreground ember-glow",
            completeness.ready ? "wax-pulse" : "",
          ].join(" ")}
        >
          <span className="inline-flex items-center gap-3">
            Send the charter raven
            <span className="inline-block transition-transform duration-500 group-hover/send:translate-x-1">✦</span>
          </span>
        </button>
        {!completeness.ready && completeness.missing.length > 0 && (
          <p className="font-accent italic text-highlight text-[12px] tracking-[0.08em] leading-relaxed">
            Still needed — {completeness.missing.join(", ").toLowerCase()}.
          </p>
        )}
        <p className="font-accent italic text-muted text-[11px] leading-relaxed">
          Your draft is kept on this device. You can leave and return — the
          selections persist for the next visit.
        </p>
      </div>
    </div>
  );
}

/* ────────────────────────── BuildTestimonial ──────────────────────────
   A single chronicle whispered into the build flow. Rotates by step
   so the user reads a new voice as they progress, without crowding the
   page. Quotes are recycled from the Reviews component — no new copy. */

const BUILD_CHRONICLES = [
  {
    line:
      "An absolute masterclass in Mongolian travel — local knowledge, fluent English, quiet humour, exceptional.",
    by: "NJ Kessler — Winter Charter, Khövsgöl",
  },
  {
    line:
      "Staying with nomadic families and visiting the reindeer herders was life-changing.",
    by: "Fletcher Bradford — Taiga Charter, North",
  },
  {
    line:
      "Our guide was more than a guide; by the end of the road he was a friend.",
    by: "Fletcher Bradford — Taiga Charter, North",
  },
];

function BuildTestimonial({ step }: { step: number }) {
  const chronicle = BUILD_CHRONICLES[step % BUILD_CHRONICLES.length];
  return (
    <motion.figure
      key={step}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DUR.base, delay: 0.2, ease: EASE }}
      className="mt-16 max-w-xl mx-auto border-l-2 border-accent/40 pl-6"
    >
      <blockquote className="font-serif italic text-foreground/85 text-[16px] leading-[1.7]">
        &ldquo;{chronicle.line}&rdquo;
      </blockquote>
      <figcaption className="mt-3 font-accent italic text-muted text-[11px] tracking-[0.2em] uppercase">
        — {chronicle.by}
      </figcaption>
    </motion.figure>
  );
}
