"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  ChevronLeft,
  Church,
  Compass,
  Footprints,
  Home as HomeIcon,
  Leaf,
  Moon,
  Mountain,
  MountainSnow,
  ScrollText,
  Snowflake,
  Sparkles,
  Sprout,
  Sun,
  Sunrise,
  Tent,
  Truck,
  User,
  Users,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JourneyCard from "@/components/JourneyCard";
import {
  INTERESTS,
  type Interest,
  type Journey,
} from "@/lib/journeys";
import { fetchJourneys } from "@/lib/api";
import {
  PACE_OPTIONS,
  PARTY_OPTIONS,
  SEASON_OPTIONS,
  type IntentDraft,
  type JourneyMatch,
  type Pace,
  type Party,
  type Season,
  intentFromParams,
  rankJourneys,
} from "@/lib/intent";
import {
  DUR,
  EASE,
  STAGGER,
  VIEWPORT,
  revealVariants,
  staggerParent,
} from "@/lib/motion";

/* ────────────────────────────────────────────────────────────
   /discover — Intent Wizard
   Four-step tag picker that captures the patron's intent in
   enough dimensions to rank journeys honestly:
     1. Themes  (what calls you — multi-select)
     2. Pace    (gentle / honest / hard / expedition)
     3. Season  (summer / autumn / winter / spring)
     4. Party   (solo / pair / small / family / large)
   Then a Results page with Strong / Good / Other tiers.

   Each step occupies one viewport. Progress bar at the top.
   ?interest=ride preselects step 1's themes (hero chips →).
   ──────────────────────────────────────────────────────────── */

type Step = 0 | 1 | 2 | 3 | 4; // 0..3 = wizard, 4 = results
const STEP_LABELS = ["Theme", "Pace", "Season", "Party"] as const;

/* ─── Icon maps — proper Lucide icons in place of Unicode sigils so
   every option reads instantly at the displayed size. ───*/

const INTEREST_ICON: Record<string, LucideIcon> = {
  ride: Footprints,
  temples: Church,
  offroad: Truck,
  spiritual: Moon,
  photo: Camera,
  nomadic: Tent,
  history: ScrollText,
  expedition: MountainSnow,
};

const PACE_ICON: Record<string, LucideIcon> = {
  any: Sparkles,
  Apprentice: Sunrise,
  Novice: Compass,
  Master: Mountain,
  Guildmaster: Snowflake,
};

const SEASON_ICON: Record<string, LucideIcon> = {
  any: Sparkles,
  summer: Sun,
  autumn: Leaf,
  winter: Snowflake,
  spring: Sprout,
};

const PARTY_ICON: Record<string, LucideIcon> = {
  solo: User,
  pair: Users,
  small: Users,
  family: HomeIcon,
  large: UsersRound,
};

export default function DiscoverPage() {
  // Next 16 requires anything using useSearchParams() to sit inside a
  // Suspense boundary, otherwise the page can't be prerendered.
  return (
    <Suspense fallback={null}>
      <DiscoverPageInner />
    </Suspense>
  );
}

function DiscoverPageInner() {
  const params = useSearchParams();

  const [intent, setIntent] = useState<IntentDraft>(() =>
    intentFromParams(params),
  );
  // If the URL preselects themes, jump straight to Pace (step 1).
  const [step, setStep] = useState<Step>(intent.themes.length > 0 ? 1 : 0);

  function patch(p: Partial<IntentDraft>) {
    setIntent((cur) => ({ ...cur, ...p }));
  }
  function toggleTheme(id: string) {
    setIntent((cur) => ({
      ...cur,
      themes: cur.themes.includes(id)
        ? cur.themes.filter((t) => t !== id)
        : [...cur.themes, id],
    }));
  }

  const canAdvance = step === 0 ? intent.themes.length > 0 : true;

  return (
    <main className="min-h-screen bg-background overflow-x-clip">
      <Navbar />

      {/* Top spacer for fixed nav */}
      <div className="h-28 sm:h-32" />

      {/* Progress bar — visible across all wizard steps */}
      {step < 4 && (
        <div className="max-w-3xl mx-auto px-6">
          <ProgressBar step={step} onJump={(i) => setStep(i as Step)} canJump={(i) => i === 0 || intent.themes.length > 0} />
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 0 && (
          <StepShell key="themes">
            <ThemesStep
              selected={intent.themes}
              onToggle={toggleTheme}
            />
          </StepShell>
        )}

        {step === 1 && (
          <StepShell key="pace">
            <PaceStep
              selected={intent.pace}
              onChoose={(pace) => patch({ pace })}
            />
          </StepShell>
        )}

        {step === 2 && (
          <StepShell key="season">
            <SeasonStep
              selected={intent.season}
              onChoose={(season) => patch({ season })}
            />
          </StepShell>
        )}

        {step === 3 && (
          <StepShell key="party">
            <PartyStep
              selected={intent.party}
              onChoose={(party) => patch({ party })}
            />
          </StepShell>
        )}

        {step === 4 && (
          <StepShell key="results">
            <ResultsStep
              intent={intent}
              onEdit={() => setStep(0)}
            />
          </StepShell>
        )}
      </AnimatePresence>

      {/* Wizard nav controls */}
      {step < 4 && (
        <div className="max-w-3xl mx-auto px-6 pb-32">
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setStep(((step - 1 + 4) % 5) as Step)}
              disabled={step === 0}
              className="px-6 sm:px-8 py-4 border border-highlight/50 hover:border-accent disabled:opacity-30 disabled:hover:border-highlight/50 transition-all duration-500 font-accent text-[12px] tracking-[0.3em] uppercase text-muted hover:text-foreground flex items-center gap-2"
            >
              <ChevronLeft size={14} /> Back
            </button>

            <button
              type="button"
              onClick={() => setStep(((step + 1) as Step))}
              disabled={!canAdvance}
              className="px-8 sm:px-12 py-4 border border-accent bg-accent/15 hover:bg-accent hover:text-background disabled:opacity-30 disabled:hover:bg-accent/15 disabled:hover:text-foreground transition-all duration-500 font-accent text-[12px] tracking-[0.35em] uppercase text-foreground ember-glow"
            >
              {step === 3 ? "See your roads →" : "Continue →"}
            </button>
          </div>
          {step === 0 && intent.themes.length === 0 && (
            <p className="mt-5 text-center font-accent italic text-muted text-[12px] tracking-[0.1em]">
              Choose at least one to continue.
            </p>
          )}
          {step > 0 && step < 4 && (
            <p className="mt-5 text-center font-accent italic text-muted text-[12px] tracking-[0.1em]">
              Leave as &ldquo;any&rdquo; if you have no preference.
            </p>
          )}
        </div>
      )}

      <Footer />
    </main>
  );
}

/* ────────────────────────── Shell + progress ────────────────────────── */

function StepShell({ children }: { children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: DUR.base, ease: EASE }}
      className="relative px-6 py-12 sm:py-16"
    >
      <div className="max-w-5xl mx-auto">{children}</div>
    </motion.section>
  );
}

function ProgressBar({
  step,
  onJump,
  canJump,
}: {
  step: number;
  onJump: (i: number) => void;
  canJump: (i: number) => boolean;
}) {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 pt-2 pb-2">
      {STEP_LABELS.map((label, i) => {
        const done = i < step;
        const current = i === step;
        const reachable = canJump(i);
        return (
          <div key={label} className="flex items-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => reachable && onJump(i)}
              disabled={!reachable}
              className="flex items-center gap-2 disabled:cursor-not-allowed"
            >
              <span
                className={[
                  "w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full border font-accent text-[12px] transition-colors",
                  done
                    ? "border-accent bg-accent text-background"
                    : current
                      ? "border-accent text-accent ember-glow"
                      : "border-highlight/40 text-muted",
                ].join(" ")}
              >
                {i + 1}
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
            {i < STEP_LABELS.length - 1 && (
              <span className={`w-6 sm:w-12 h-px ${done ? "bg-accent" : "bg-highlight/40"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ────────────────────────── Step heading ────────────────────────── */

function StepHeading({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub: string;
}) {
  return (
    <motion.div
      variants={staggerParent(STAGGER.base, STAGGER.base)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      className="text-center mb-12 max-w-2xl mx-auto"
    >
      <motion.p
        variants={revealVariants("rise", DUR.base)}
        className="font-accent italic text-accent text-[12px] tracking-[0.4em] uppercase mb-5"
      >
        {eyebrow}
      </motion.p>
      <motion.h1
        variants={revealVariants("blur", DUR.slow)}
        className="font-heading text-3xl sm:text-4xl md:text-5xl uppercase tracking-[0.08em] text-foreground ember-text-glow leading-[1.05]"
      >
        {title}
      </motion.h1>
      <motion.div
        variants={revealVariants("wipe", DUR.base)}
        className="ink-divider mt-8 max-w-sm mx-auto"
      />
      <motion.p
        variants={revealVariants("rise", DUR.base)}
        className="mt-7 text-foreground/80 font-serif italic text-[16px] leading-[1.85]"
      >
        {sub}
      </motion.p>
    </motion.div>
  );
}

/* ────────────────────────── Step 1 — Themes ────────────────────────── */

function ThemesStep({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <>
      <StepHeading
        eyebrow="Step One · Theme"
        title="What calls you to Mongolia?"
        sub="Tap everything that calls. We'll weigh each one when we pick your roads — you can pick many."
      />
      <motion.div
        variants={staggerParent(STAGGER.tight)}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        {INTERESTS.map((interest) => {
          const active = selected.includes(interest.id);
          const Icon = INTEREST_ICON[interest.id] ?? Compass;
          return (
            <motion.button
              key={interest.id}
              variants={revealVariants("rise", DUR.base)}
              type="button"
              onClick={() => onToggle(interest.id)}
              className={[
                "text-left flex items-start gap-4 p-5 border transition-all duration-300",
                active
                  ? "border-accent bg-accent/[0.08] ember-glow"
                  : "border-highlight/40 bg-surface/40 hover:border-accent/60",
              ].join(" ")}
            >
              <span
                className={[
                  "w-11 h-11 shrink-0 flex items-center justify-center border transition-colors",
                  active ? "border-accent text-accent" : "border-highlight/40 text-accent/80",
                ].join(" ")}
              >
                <Icon size={22} strokeWidth={1.5} />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block font-heading uppercase tracking-[0.06em] text-[15px] text-foreground">
                  {tightenLabel(interest)}
                </span>
                <span className="block font-accent italic text-muted text-[12px] tracking-[0.1em] mt-1">
                  {interest.categories.join(" · ")}
                </span>
              </span>
              {active && (
                <span className="ml-auto font-accent uppercase tracking-[0.16em] text-[10px] text-accent self-start">
                  Chosen
                </span>
              )}
            </motion.button>
          );
        })}
      </motion.div>
      {selected.length > 0 && (
        <p className="mt-8 text-center font-accent italic text-accent text-[12px] tracking-[0.2em]">
          {selected.length} {selected.length === 1 ? "thread" : "threads"} chosen
        </p>
      )}
    </>
  );
}

/* ────────────────────────── Step 2 — Pace ────────────────────────── */

function PaceStep({
  selected,
  onChoose,
}: {
  selected: Pace;
  onChoose: (p: Pace) => void;
}) {
  return (
    <>
      <StepHeading
        eyebrow="Step Two · Pace"
        title="How hard a road?"
        sub="Pace is the same ladder as our guide ranks. Soft to severe."
      />
      <motion.div
        variants={staggerParent(STAGGER.tight)}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        {PACE_OPTIONS.map((p) => (
          <OptionCard
            key={p.id}
            active={selected === p.id}
            Icon={PACE_ICON[p.id] ?? Sparkles}
            label={p.label}
            blurb={p.blurb}
            onClick={() => onChoose(p.id)}
          />
        ))}
      </motion.div>
    </>
  );
}

/* ────────────────────────── Step 3 — Season ────────────────────────── */

function SeasonStep({
  selected,
  onChoose,
}: {
  selected: Season;
  onChoose: (s: Season) => void;
}) {
  return (
    <>
      <StepHeading
        eyebrow="Step Three · Season"
        title="When do you come?"
        sub="The country is four countries — summer, autumn, winter, spring — each a different journey."
      />
      <motion.div
        variants={staggerParent(STAGGER.tight)}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        {SEASON_OPTIONS.map((s) => (
          <OptionCard
            key={s.id}
            active={selected === s.id}
            Icon={SEASON_ICON[s.id] ?? Sparkles}
            label={s.label}
            blurb={s.blurb}
            onClick={() => onChoose(s.id)}
          />
        ))}
      </motion.div>
    </>
  );
}

/* ────────────────────────── Step 4 — Party ────────────────────────── */

function PartyStep({
  selected,
  onChoose,
}: {
  selected: Party;
  onChoose: (p: Party) => void;
}) {
  return (
    <>
      <StepHeading
        eyebrow="Step Four · Party"
        title="Who rides with you?"
        sub="The party shapes the camp, the machine, and sometimes the pace."
      />
      <motion.div
        variants={staggerParent(STAGGER.tight)}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        {PARTY_OPTIONS.map((p) => (
          <OptionCard
            key={p.id}
            active={selected === p.id}
            Icon={PARTY_ICON[p.id] ?? User}
            label={p.label}
            blurb={p.blurb}
            onClick={() => onChoose(p.id)}
          />
        ))}
      </motion.div>
    </>
  );
}

/* ────────────────────────── Shared option card ────────────────────────── */

function OptionCard({
  active,
  Icon,
  label,
  blurb,
  onClick,
}: {
  active: boolean;
  Icon: LucideIcon;
  label: string;
  blurb: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      variants={revealVariants("rise", DUR.base)}
      type="button"
      onClick={onClick}
      className={[
        "text-left flex items-start gap-4 p-5 border transition-all duration-300",
        active
          ? "border-accent bg-accent/[0.08] ember-glow"
          : "border-highlight/40 bg-surface/40 hover:border-accent/60",
      ].join(" ")}
    >
      {/* Icon plate — fixed-size square so labels align cleanly across cards */}
      <span
        className={[
          "w-11 h-11 shrink-0 flex items-center justify-center border transition-colors",
          active ? "border-accent text-accent" : "border-highlight/40 text-accent/80",
        ].join(" ")}
      >
        <Icon size={22} strokeWidth={1.5} />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block font-heading uppercase tracking-[0.06em] text-[15px] text-foreground">
          {label}
        </span>
        <span className="block font-accent italic text-muted text-[12px] leading-relaxed mt-1.5">
          {blurb}
        </span>
      </span>
      {active && (
        <span className="ml-auto font-accent uppercase tracking-[0.16em] text-[10px] text-accent self-start">
          Chosen
        </span>
      )}
    </motion.button>
  );
}

/* ────────────────────────── Results ────────────────────────── */

function ResultsStep({
  intent,
  onEdit,
}: {
  intent: IntentDraft;
  onEdit: () => void;
}) {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  useEffect(() => {
    let cancelled = false;
    fetchJourneys().then((data) => {
      if (!cancelled) setJourneys(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Rank every journey; bucket into tiers for the UI.
  const ranked = useMemo<JourneyMatch[]>(
    () => rankJourneys(journeys, intent, -20),
    [intent, journeys],
  );
  const strong = ranked.filter((m) => m.tier === "strong");
  const good = ranked.filter((m) => m.tier === "good");
  const soft = ranked.filter((m) => m.tier === "soft");

  const themeLabels = intent.themes
    .map((id) => INTERESTS.find((i) => i.id === id))
    .filter((x): x is Interest => !!x);
  const paceLabel = PACE_OPTIONS.find((p) => p.id === intent.pace)?.label;
  const seasonLabel = SEASON_OPTIONS.find((s) => s.id === intent.season)?.label;
  const partyLabel = PARTY_OPTIONS.find((p) => p.id === intent.party)?.label;

  return (
    <>
      <motion.div
        variants={staggerParent(STAGGER.base, STAGGER.base)}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        className="text-center mb-14 max-w-3xl mx-auto"
      >
        <motion.p
          variants={revealVariants("rise", DUR.base)}
          className="font-accent italic text-accent text-[12px] tracking-[0.4em] uppercase mb-5"
        >
          Your roads
        </motion.p>
        <motion.h1
          variants={revealVariants("blur", DUR.slow)}
          className="font-heading text-3xl sm:text-5xl md:text-6xl uppercase tracking-[0.08em] text-foreground ember-text-glow leading-[1.05]"
        >
          {strong.length + good.length > 0
            ? "Roads that answer your call"
            : "A custom charter might suit"}
        </motion.h1>
        <motion.div
          variants={revealVariants("wipe", DUR.base)}
          className="ink-divider mt-8 max-w-sm mx-auto"
        />

        {/* Intent recap — small tag row with edit affordance */}
        <motion.div
          variants={revealVariants("rise", DUR.base)}
          className="mt-9 flex flex-wrap items-center justify-center gap-2"
        >
          {themeLabels.map((t) => {
            const Icon = INTEREST_ICON[t.id] ?? Compass;
            return (
              <span
                key={t.id}
                className="inline-flex items-center gap-2 px-3 py-1.5 border border-accent/40 font-accent text-[11px] tracking-[0.1em] text-foreground/85"
              >
                <Icon size={13} strokeWidth={1.75} className="text-accent" />
                {tightenLabel(t)}
              </span>
            );
          })}
          {intent.pace !== "any" && (
            <Tag>{paceLabel}</Tag>
          )}
          {intent.season !== "any" && (
            <Tag>{seasonLabel}</Tag>
          )}
          <Tag>{partyLabel}</Tag>
          <button
            type="button"
            onClick={onEdit}
            className="ml-2 font-accent italic text-accent text-[11px] tracking-[0.18em] uppercase underline-offset-4 hover:underline"
          >
            edit
          </button>
        </motion.div>
      </motion.div>

      {/* Tiers */}
      <div className="space-y-20">
        {strong.length > 0 && (
          <ResultTier
            heading="Strong matches"
            sub="These answer most of what you asked for."
            matches={strong}
          />
        )}
        {good.length > 0 && (
          <ResultTier
            heading="Good matches"
            sub="A near fit — worth reading."
            matches={good}
          />
        )}
        {soft.length > 0 && strong.length + good.length < 3 && (
          <ResultTier
            heading="Other roads"
            sub="A softer fit, but the country may surprise you."
            matches={soft.slice(0, 3)}
          />
        )}
        {strong.length + good.length + soft.length === 0 && (
          <div className="text-center py-12 max-w-xl mx-auto">
            <p className="font-serif italic text-foreground/85 text-[18px] leading-relaxed">
              No standing road answers this exactly. Send a raven and we will draft
              a custom charter to your intent — the Guild builds the road to fit you.
            </p>
            <Link
              href="/charter/custom-charter"
              className="inline-block mt-8 px-12 py-4 border border-accent bg-accent/15 hover:bg-accent hover:text-background transition-all duration-500 font-accent text-[12px] tracking-[0.35em] uppercase text-foreground ember-glow"
            >
              Begin a custom charter
            </Link>
          </div>
        )}
      </div>

      <div className="mt-24 text-center">
        <Link
          href="/journeys"
          className="px-12 py-4 border border-highlight/50 hover:border-accent transition-all duration-500 font-accent text-[12px] tracking-[0.3em] uppercase text-muted hover:text-foreground inline-block"
        >
          Or browse every road
        </Link>
      </div>
    </>
  );
}

function ResultTier({
  heading,
  sub,
  matches,
}: {
  heading: string;
  sub: string;
  matches: JourneyMatch[];
}) {
  return (
    <section>
      <div className="mb-8 max-w-2xl">
        <p className="font-accent italic text-accent text-[12px] tracking-[0.3em] uppercase mb-2">
          {heading}
        </p>
        <p className="font-serif italic text-muted text-[15px] leading-relaxed">{sub}</p>
      </div>

      <motion.div
        variants={staggerParent(STAGGER.base)}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {matches.map((m, i) => (
          <div key={m.journey.slug} className="flex flex-col">
            <JourneyCard journey={m.journey} index={i} />
            {m.reasons.length > 0 && (
              <ul className="mt-3 space-y-1 pl-1">
                {m.reasons.slice(0, 2).map((r, ri) => (
                  <li
                    key={ri}
                    className="font-accent italic text-accent/85 text-[12px] tracking-[0.05em] flex items-start gap-2"
                  >
                    <span className="text-accent leading-none mt-0.5">✦</span>
                    {r}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </motion.div>
    </section>
  );
}

/* ─── helpers ─── */

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-highlight/40 font-accent text-[11px] tracking-[0.1em] text-foreground/85">
      {children}
    </span>
  );
}

function tightenLabel(interest: Interest): string {
  return interest.label.replace(/^I want\s+(?:to\s+|an?\s+)?/i, "");
}
