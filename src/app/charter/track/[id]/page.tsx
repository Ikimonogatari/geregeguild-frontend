"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trackCharter, type CharterTrack } from "@/lib/api";

const STATUS_BLURB: Record<CharterTrack["status"], string> = {
  pending: "We have your raven. The Guildmaster will reach out shortly.",
  contacted: "A guide is in conversation with you. Watch your inbox.",
  confirmed: "Your charter is confirmed. Welcome to the Guild.",
  cancelled: "This charter has been cancelled.",
  completed: "This road has been ridden. Safe travels home.",
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

  if (data === undefined) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-40 text-center text-muted text-sm">Loading…</div>
      </main>
    );
  }
  if (data === null) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-40 text-center text-muted text-sm">
          Charter not found.
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      <section className="pt-36 pb-12 px-6 max-w-3xl mx-auto">
        <Link
          href="/charter/me"
          className="font-accent italic text-muted hover:text-accent text-[12px] tracking-[0.25em] uppercase transition-colors"
        >
          ← My charters
        </Link>
        <p className="mt-6 font-accent italic text-accent text-[13px] tracking-[0.4em] uppercase">
          Your charter
        </p>
        <h1 className="mt-3 font-heading text-3xl sm:text-5xl uppercase tracking-[0.08em] text-foreground ember-text-glow leading-tight">
          {data.journey.title}
        </h1>
        <p className="mt-3 font-serif italic text-muted text-[16px]">{data.journey.region}</p>
        <div className="ink-divider mt-10" />
      </section>

      <section className="px-6 pb-20 max-w-3xl mx-auto space-y-10">
        <div className="border border-accent/40 bg-surface/50 p-8 ember-glow">
          <p className="font-accent italic text-accent text-[12px] tracking-[0.3em] uppercase mb-3">
            Status
          </p>
          <h2
            className="font-heading text-2xl sm:text-3xl uppercase tracking-[0.08em] text-foreground"
          >
            {data.status}
          </h2>
          <p className="mt-4 text-foreground/85 text-[16px] font-serif leading-relaxed">
            {STATUS_BLURB[data.status]}
          </p>
          {data.adminNotes && (
            <pre className="mt-4 whitespace-pre-wrap rounded-md border border-highlight/40 bg-background/40 p-3 text-[13px] font-serif italic text-foreground/85">
              {data.adminNotes}
            </pre>
          )}
          <p className="mt-6 font-accent italic text-muted text-[11px] tracking-[0.2em] uppercase">
            Updated {new Date(data.updatedAt).toLocaleString()}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <Box label="Travelers" value={`${data.travelers}`} />
          <Box label="Dates" value={data.contactDates || "—"} />
          <Box label="Guide" value={data.guide?.name ?? "Pending assignment"} sub={data.guide?.level} />
          <Box
            label="Estimated total"
            value={new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: data.currency,
              maximumFractionDigits: 0,
            }).format(data.estimatedTotal)}
          />
        </div>

        <p className="text-center font-accent italic text-muted text-[12px] tracking-[0.2em] uppercase">
          Bookmark this page · reference {data.id.slice(0, 8)}
        </p>
      </section>

      <Footer />
    </main>
  );
}

function Box({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="border border-highlight/40 bg-surface/40 p-5">
      <p className="font-accent uppercase tracking-[0.2em] text-[10px] text-muted">{label}</p>
      <p className="mt-1.5 font-heading text-foreground text-[18px]">{value}</p>
      {sub && <p className="mt-1 text-muted text-[12px] italic">{sub}</p>}
    </div>
  );
}
