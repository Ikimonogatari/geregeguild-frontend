"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trackCharter, type CharterTrack } from "@/lib/api";
import { DUR, EASE, STAGGER } from "@/lib/motion";

/* ────────────────────────────────────────────────────────────
   Charter tracking — the warrant.
   After the raven flies, this is where a patron watches their
   road come together. Rendered as a passport-style warrant with
   a wax-medallion progress trail matching the wizard's language.
   ──────────────────────────────────────────────────────────── */

type Status = CharterTrack["status"];

const STAGE_ORDER: Exclude<Status, "cancelled">[] = [
  "pending",
  "contacted",
  "confirmed",
  "completed",
];

const STAGE_LABEL: Record<Exclude<Status, "cancelled">, string> = {
  pending: "Sent",
  contacted: "In conversation",
  confirmed: "Confirmed",
  completed: "Ridden",
};

const STATUS_BLURB: Record<Status, string> = {
  pending: "Your raven reached the Guild. The Guildmaster is reading your charter now.",
  contacted: "A guide is in conversation with you. Watch your inbox — they may ask a question or two before the road is fixed.",
  confirmed: "Your charter is confirmed. The road is yours. Welcome to the Guild.",
  cancelled: "This charter has been called back. The raven will not fly again on this reference.",
  completed: "This road has been ridden. Safe travels home — the fire is always here when you return.",
};

const NEXT_STEP_BLURB: Record<Status, string> = {
  pending:
    "Within a day or two you will hear from a guide by email — not a sales desk. They may ask about your dates, your pace, or your appetite for weather. Answer at your own speed.",
  contacted:
    "Keep an eye on your inbox. When you and your guide have settled on the shape of the road, they will confirm — and this page will change.",
  confirmed:
    "Deposit and travel details will follow by email. The written charter arrives before you owe anything. From here, the Guild handles the road.",
  cancelled:
    "If this was a mistake or you want to try again, send a fresh raven from the journeys page — no ledger, no penalty.",
  completed:
    "If a chronicle wants writing, we would love to read it. Send a raven any time — the door does not close.",
};

export default function CharterTrackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [data, setData] = useState<CharterTrack | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setInterval> | null = null;
    const load = async () => {
      const next = await trackCharter(id);
      if (!cancelled) setData(next);
    };
    load();
    // Poll every 60s so the status updates without a refresh.
    timer = setInterval(load, 60_000);
    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
    };
  }, [id]);

  /* ─── Loading — warm parchment skeleton, not a dead page ─── */
  if (data === undefined) {
    return (
      <main className="min-h-screen bg-background overflow-x-hidden">
        <Navbar />
        <section className="pt-36 pb-12 px-6 max-w-3xl mx-auto">
          <div className="h-3 w-32 skeleton-parchment mb-6" />
          <div className="h-4 w-40 skeleton-parchment mb-4" />
          <div className="h-10 w-3/4 skeleton-parchment mb-3" />
          <div className="h-5 w-1/2 skeleton-parchment" />
          <div className="ink-divider mt-10" />
        </section>
        <section className="px-6 pb-20 max-w-3xl mx-auto space-y-8">
          <div className="h-40 w-full skeleton-parchment" />
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="h-24 skeleton-parchment" />
            <div className="h-24 skeleton-parchment" />
            <div className="h-24 skeleton-parchment" />
            <div className="h-24 skeleton-parchment" />
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  /* ─── Not found — brand-voice, offer a way back ─── */
  if (data === null) {
    return (
      <main className="min-h-screen bg-background overflow-x-hidden">
        <Navbar />
        <section className="pt-40 pb-24 px-6 max-w-xl mx-auto text-center">
          <p className="font-accent italic text-accent text-[12px] tracking-[0.4em] uppercase">
            The raven did not return
          </p>
          <h1 className="mt-4 font-heading text-3xl sm:text-4xl uppercase tracking-[0.08em] text-foreground ember-text-glow">
            No charter under this seal
          </h1>
          <p className="mt-5 font-serif italic text-foreground/85 text-[17px] leading-relaxed">
            This reference doesn&rsquo;t match any charter the Guild is holding.
            Check the id, or return to the roads and send a fresh raven.
          </p>
          <div className="ink-divider my-10" />
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/charter/me"
              className="px-8 py-3 border border-accent bg-accent/10 hover:bg-accent hover:text-background font-accent text-[11px] tracking-[0.3em] uppercase transition-all duration-500 ember-glow"
            >
              My charters
            </Link>
            <Link
              href="/journeys"
              className="px-8 py-3 border border-highlight/50 hover:border-accent text-muted hover:text-foreground font-accent text-[11px] tracking-[0.3em] uppercase transition-all duration-500"
            >
              Browse roads
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  const isCancelled = data.status === "cancelled";
  const currentIndex = isCancelled ? -1 : STAGE_ORDER.indexOf(data.status as Exclude<Status, "cancelled">);
  const reference = data.id.slice(0, 8).toUpperCase();

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* ─── Header ─── */}
      <section className="pt-36 pb-8 px-6 max-w-3xl mx-auto">
        <Link
          href="/charter/me"
          className="font-accent italic text-muted hover:text-accent text-[12px] tracking-[0.25em] uppercase transition-colors"
        >
          ← My charters
        </Link>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DUR.base, ease: EASE }}
          className="mt-6 font-accent italic text-accent text-[13px] tracking-[0.4em] uppercase"
        >
          Your charter warrant
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: DUR.slow, ease: EASE, delay: 0.05 }}
          className="mt-3 font-heading text-3xl sm:text-5xl uppercase tracking-[0.08em] text-foreground ember-text-glow leading-tight"
        >
          {data.journey.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: DUR.base, ease: EASE, delay: 0.15 }}
          className="mt-3 font-serif italic text-muted text-[16px]"
        >
          {data.journey.region}
        </motion.p>
        <div className="ink-divider mt-10" />
      </section>

      {/* ─── Status timeline — wax medallions on an ink line ─── */}
      <section className="px-6 pb-12 max-w-3xl mx-auto">
        <StatusTrail
          currentIndex={currentIndex}
          isCancelled={isCancelled}
        />
      </section>

      {/* ─── Current status card ─── */}
      <section className="px-6 pb-12 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DUR.base, ease: EASE, delay: 0.1 }}
          className={[
            "relative border p-8",
            isCancelled
              ? "border-highlight/40 bg-surface/40"
              : "border-accent/40 bg-surface/50 ember-glow",
          ].join(" ")}
        >
          <p className="font-accent italic text-accent text-[12px] tracking-[0.3em] uppercase mb-3">
            {isCancelled ? "Called back" : "Where the charter stands"}
          </p>
          <h2 className="font-heading text-2xl sm:text-3xl uppercase tracking-[0.08em] text-foreground">
            {isCancelled ? "Cancelled" : STAGE_LABEL[data.status as Exclude<Status, "cancelled">]}
          </h2>
          <p className="mt-4 text-foreground/85 text-[16px] font-serif italic leading-relaxed">
            {STATUS_BLURB[data.status]}
          </p>
          {data.adminNotes && (
            <div className="mt-6 border-l-2 border-accent/50 pl-5 py-1">
              <p className="font-accent uppercase tracking-[0.22em] text-[10px] text-muted mb-2">
                A word from your guide
              </p>
              <p className="whitespace-pre-wrap text-[15px] font-serif italic text-foreground/85 leading-relaxed">
                {data.adminNotes}
              </p>
            </div>
          )}
          <p className="mt-6 font-accent italic text-muted text-[11px] tracking-[0.22em] uppercase">
            Last touched {new Date(data.updatedAt).toLocaleString()}
          </p>
        </motion.div>
      </section>

      {/* ─── Charter facts — warrant ledger ─── */}
      <section className="px-6 pb-12 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -60px 0px" }}
          transition={{ duration: DUR.base, ease: EASE }}
          className="relative border border-highlight/40 bg-surface/40 p-7 sm:p-9"
        >
          {/* Corner tacks — the passport feel */}
          <CornerTacks />

          <p className="font-accent italic text-accent text-[12px] tracking-[0.3em] uppercase mb-6">
            The ledger
          </p>

          <dl className="grid sm:grid-cols-2 gap-y-6 gap-x-8">
            <LedgerRow label="Patrons" value={`${data.travelers}`} sub={data.travelers === 1 ? "traveler" : "travelers"} />
            <LedgerRow
              label="Rough dates"
              value={data.contactDates || "To be set"}
              sub={data.contactDates ? undefined : "with your guide"}
            />
            <LedgerRow
              label="Guide"
              value={data.guide?.name ?? "Pending assignment"}
              sub={data.guide?.level ?? "The Guildmaster is choosing"}
              accent={!!data.guide}
            />
            <LedgerRow
              label="Estimate"
              value={new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: data.currency,
                maximumFractionDigits: 0,
              }).format(data.estimatedTotal)}
              sub="settled before you owe anything"
            />
          </dl>
        </motion.div>
      </section>

      {/* ─── What happens next ─── */}
      <section className="px-6 pb-14 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -60px 0px" }}
          transition={{ duration: DUR.base, ease: EASE, delay: STAGGER.tight }}
          className="relative border-l-2 border-accent/50 pl-6 py-2"
        >
          <p className="font-accent italic text-accent text-[12px] tracking-[0.3em] uppercase mb-3">
            What happens next
          </p>
          <p className="text-foreground/85 text-[16px] font-serif italic leading-relaxed">
            {NEXT_STEP_BLURB[data.status]}
          </p>
        </motion.div>
      </section>

      {/* ─── Reference seal — the wax stamp ─── */}
      <section className="px-6 pb-24 max-w-3xl mx-auto">
        <div className="ink-divider mb-10" />
        <div className="text-center">
          <p className="font-accent uppercase tracking-[0.28em] text-[10px] text-muted mb-2">
            Reference seal
          </p>
          <motion.p
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: DUR.base, ease: EASE }}
            className="inline-block font-heading text-accent text-[15px] tracking-[0.24em] px-6 py-3 border border-accent/40 ember-glow bg-surface/40"
          >
            {reference}
          </motion.p>
          <p className="mt-4 font-accent italic text-muted text-[11px] tracking-[0.06em] leading-relaxed max-w-sm mx-auto">
            Keep this seal if you need to reach the charter from another
            device. Bookmark this page and it will find its way back to you.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}

/* ────────────────────────── StatusTrail ──────────────────────────
   Four wax medallions on an ink line. Past stages are stamped (deep
   wine, rotated), the current stage breathes ember, the untouched
   stages sit as dark charcoal. Cancellation shows the trail as a
   quiet, greyed record — no ember. */

function StatusTrail({
  currentIndex,
  isCancelled,
}: {
  currentIndex: number;
  isCancelled: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-0 sm:gap-2 select-none">
      {STAGE_ORDER.map((stage, i) => {
        const done = !isCancelled && i < currentIndex;
        const current = !isCancelled && i === currentIndex;
        return (
          <div key={stage} className="flex items-start flex-1 min-w-0">
            {/* Medallion + label */}
            <div className="flex flex-col items-center gap-3 shrink-0 w-16 sm:w-20">
              <span
                className="relative inline-flex items-center justify-center shrink-0"
                style={{ width: 40, height: 40 }}
              >
                {/* Illumination ring — only on the active medallion */}
                {current && (
                  <motion.span
                    aria-hidden
                    layoutId="track-halo"
                    className="absolute inset-[-6px] rounded-full"
                    style={{
                      border: "1px solid rgba(201,146,42,0.35)",
                      boxShadow: "0 0 22px -4px rgba(201,146,42,0.55)",
                    }}
                    transition={{ duration: DUR.base, ease: EASE }}
                  />
                )}
                <span
                  className={[
                    "relative inline-flex items-center justify-center rounded-full font-heading transition-all duration-500",
                    current ? "ember-breath" : "",
                  ].join(" ")}
                  style={{
                    width: 38,
                    height: 38,
                    background: isCancelled
                      ? "radial-gradient(120% 120% at 50% 25%, rgba(46,31,20,0.5) 0%, rgba(22,15,9,0.85) 100%)"
                      : done
                        ? "radial-gradient(120% 120% at 50% 25%, #7a2a18 0%, #3a1108 100%)"
                        : current
                          ? "radial-gradient(120% 120% at 50% 25%, rgba(201,146,42,0.28) 0%, rgba(28,21,16,0.9) 100%)"
                          : "radial-gradient(120% 120% at 50% 25%, rgba(46,31,20,0.7) 0%, rgba(22,15,9,0.9) 100%)",
                    border: isCancelled
                      ? "1px solid rgba(139,94,60,0.35)"
                      : done
                        ? "1.5px solid #3a1108"
                        : current
                          ? "1.5px solid #C9922A"
                          : "1px solid rgba(139,94,60,0.35)",
                    color: isCancelled
                      ? "#7a6650"
                      : done
                        ? "#f0e2c2"
                        : current
                          ? "#F0E6D3"
                          : "#7a6650",
                    fontSize: 13,
                    letterSpacing: "0.06em",
                    transform: done ? "rotate(-6deg)" : "rotate(0deg)",
                    boxShadow: done
                      ? "0 2px 6px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)"
                      : current
                        ? "inset 0 0 12px rgba(0,0,0,0.55), 0 0 14px -4px rgba(201,146,42,0.55)"
                        : "inset 0 0 10px rgba(0,0,0,0.6)",
                  }}
                >
                  {done ? <Check size={16} strokeWidth={2.4} /> : i + 1}
                </span>
              </span>
              <span
                className={[
                  "font-accent uppercase tracking-[0.18em] text-[10px] text-center leading-tight transition-colors duration-500",
                  isCancelled
                    ? "text-muted/60"
                    : current
                      ? "text-foreground"
                      : done
                        ? "text-accent/85"
                        : "text-muted",
                ].join(" ")}
              >
                {STAGE_LABEL[stage]}
              </span>
            </div>

            {/* Connective ink line */}
            {i < STAGE_ORDER.length - 1 && (
              <span
                aria-hidden
                className="relative flex-1 h-px mt-[19px] overflow-hidden"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(139,94,60,0.35) 0%, rgba(139,94,60,0.45) 50%, rgba(139,94,60,0.35) 100%)",
                  opacity: isCancelled ? 0.4 : 1,
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
                  animate={{ scaleX: !isCancelled && i < currentIndex ? 1 : 0 }}
                  transition={{ duration: DUR.base, ease: EASE }}
                />
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ────────────────────────── LedgerRow ────────────────────────── */

function LedgerRow({
  label,
  value,
  sub,
  accent = false,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div>
      <dt className="font-accent uppercase tracking-[0.22em] text-[10px] text-muted mb-1.5">
        {label}
      </dt>
      <dd
        className={[
          "font-heading text-[19px] leading-tight",
          accent ? "text-accent" : "text-foreground",
        ].join(" ")}
      >
        {value}
      </dd>
      {sub && (
        <p className="mt-1 font-accent italic text-muted text-[12px] tracking-[0.06em]">
          {sub}
        </p>
      )}
    </div>
  );
}

/* Small corner marks — evokes stamps on a warrant / passport corner */
function CornerTacks() {
  const common =
    "absolute w-3 h-3 border-accent/50";
  return (
    <>
      <span aria-hidden className={`${common} top-2 left-2 border-l border-t`} />
      <span aria-hidden className={`${common} top-2 right-2 border-r border-t`} />
      <span aria-hidden className={`${common} bottom-2 left-2 border-l border-b`} />
      <span aria-hidden className={`${common} bottom-2 right-2 border-r border-b`} />
    </>
  );
}
