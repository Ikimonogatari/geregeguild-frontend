"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  trackCharter,
  type CharterTrack,
} from "@/lib/api";
import { readTracking, forgetCharter, type Tracked } from "@/lib/charter-tracking";

type Row = CharterTrack & { _local: { submittedAt: string } };

export default function MyChartersPage() {
  const router = useRouter();
  const [tracking, setTracking] = useState<Tracked>({ email: "", entries: [] });
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [lookupId, setLookupId] = useState("");
  const [lookupError, setLookupError] = useState("");

  // Read localStorage on mount + refresh when tab regains focus.
  useEffect(() => {
    function reread() {
      setTracking(readTracking());
    }
    reread();
    window.addEventListener("focus", reread);
    return () => window.removeEventListener("focus", reread);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const all = await Promise.all(
        tracking.entries.map(async (e) => {
          const t = await trackCharter(e.id);
          return t ? ({ ...t, _local: { submittedAt: e.submittedAt } } as Row) : null;
        }),
      );
      if (!cancelled) {
        setRows(all.filter((r): r is Row => r !== null));
        setLoading(false);
      }
    }
    load();
    const timer = setInterval(load, 60_000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [tracking]);

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      <section className="pt-36 pb-10 px-6 max-w-4xl mx-auto">
        <p className="font-accent italic text-accent text-[13px] tracking-[0.4em] uppercase">
          Your roads
        </p>
        <h1 className="mt-3 font-heading text-3xl sm:text-5xl uppercase tracking-[0.08em] text-foreground ember-text-glow leading-tight">
          My charters
        </h1>
        <p className="mt-4 font-serif italic text-muted text-[16px] max-w-xl">
          Every charter you have submitted on this device. We hold the reference here so you
          can come back and watch the status without an account.
        </p>
        <div className="ink-divider mt-8" />
      </section>

      {/* Lookup by id — for users who lost their device or used a fresh browser. */}
      <section className="px-6 pb-10 max-w-4xl mx-auto">
        <div className="border border-highlight/40 bg-surface/40 p-5">
          <p className="font-accent italic text-accent text-[12px] tracking-[0.3em] uppercase">
            Have a reference id?
          </p>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setLookupError("");
              const id = lookupId.trim();
              if (!id) return;
              const found = await trackCharter(id);
              if (!found) {
                setLookupError("No charter found for that reference.");
                return;
              }
              router.push(`/charter/track/${id}`);
            }}
            className="mt-3 flex flex-col sm:flex-row gap-3"
          >
            <input
              type="text"
              value={lookupId}
              onChange={(e) => setLookupId(e.target.value)}
              placeholder="00000000-0000-…"
              className="flex-1 bg-background border border-highlight/40 focus:border-accent/70 outline-none px-4 py-3 font-mono text-[14px] text-foreground transition-colors"
            />
            <button
              type="submit"
              className="px-8 py-3 border border-accent bg-accent/10 hover:bg-accent hover:text-background font-accent text-[11px] tracking-[0.3em] uppercase text-foreground transition-all duration-500 ember-glow"
            >
              Find charter
            </button>
          </form>
          {lookupError && (
            <p className="mt-3 text-destructive text-sm font-serif italic">{lookupError}</p>
          )}
        </div>
      </section>

      <section className="px-6 pb-24 max-w-4xl mx-auto">
        {loading && rows.length === 0 ? (
          <p className="text-center text-muted text-sm">Loading…</p>
        ) : rows.length === 0 ? (
          <div className="text-center max-w-md mx-auto py-10">
            <p className="text-foreground/85 font-serif italic text-[17px]">
              No charters yet on this device.
            </p>
            <Link
              href="/journeys"
              className="mt-6 inline-block px-8 py-3 border border-accent bg-accent/10 hover:bg-accent hover:text-background font-accent text-[12px] tracking-[0.3em] uppercase transition-all duration-500"
            >
              Browse roads
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-highlight/30 border border-highlight/40 bg-surface/40">
            {rows.map((c) => (
              <li
                key={c.id}
                className="flex items-center gap-4 p-5 hover:bg-surface/70 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/charter/track/${c.id}`}
                    className="block font-heading text-foreground text-[18px] uppercase tracking-[0.05em] hover:text-accent transition-colors"
                  >
                    {c.journey.title}
                  </Link>
                  <p className="mt-1 font-accent italic text-muted text-[11px] tracking-[0.2em] uppercase">
                    {c.status} · submitted {new Date(c._local.submittedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right text-foreground/80 font-mono text-sm">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: c.currency,
                    maximumFractionDigits: 0,
                  }).format(c.estimatedTotal)}
                </div>
                <button
                  onClick={() => {
                    if (confirm("Remove from this device's list?")) {
                      forgetCharter(c.id);
                      setTracking(readTracking());
                    }
                  }}
                  className="text-muted hover:text-destructive text-xs font-accent italic tracking-[0.2em] uppercase"
                >
                  Forget
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Footer />
    </main>
  );
}
