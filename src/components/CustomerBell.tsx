"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import {
  fetchCustomerNotifications,
  fetchCustomerUnreadCount,
  markCustomerNotificationsRead,
  type CustomerNotification,
} from "@/lib/api";
import { readTracking } from "@/lib/charter-tracking";

/* The public site has no auth, so the bell is keyed off the email the
   user used on their most recent charter submission. If they haven't
   submitted anything on this device, the bell stays hidden. */
export default function CustomerBell() {
  const [email, setEmail] = useState<string>("");
  const [count, setCount] = useState(0);
  const [items, setItems] = useState<CustomerNotification[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // Resolve email from localStorage (and re-read on focus).
  useEffect(() => {
    function reread() {
      setEmail(readTracking().email);
    }
    reread();
    window.addEventListener("focus", reread);
    return () => window.removeEventListener("focus", reread);
  }, []);

  // Poll the unread count + items every 60s.
  useEffect(() => {
    if (!email) return;
    let cancelled = false;
    async function tick() {
      const [c, list] = await Promise.all([
        fetchCustomerUnreadCount(email),
        fetchCustomerNotifications(email),
      ]);
      if (!cancelled) {
        setCount(c);
        setItems(list);
      }
    }
    tick();
    const timer = setInterval(tick, 60_000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [email]);

  // Click-outside to close.
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  if (!email) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative size-9 grid place-items-center rounded-full border border-highlight/40 hover:border-accent transition-colors"
        aria-label="Notifications"
      >
        <Bell className="size-4 text-foreground/80" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 grid h-4 min-w-4 place-items-center rounded-full bg-accent text-background text-[10px] font-bold px-1">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 border border-highlight/40 bg-surface ember-glow z-50">
          <div className="flex items-center justify-between border-b border-highlight/40 px-3 py-2">
            <span className="font-accent italic text-accent text-[11px] tracking-[0.25em] uppercase">
              Updates · {email}
            </span>
            {count > 0 && (
              <button
                onClick={async () => {
                  await markCustomerNotificationsRead(email);
                  setCount(0);
                  setItems((prev) =>
                    prev.map((n) => ({ ...n, readAt: n.readAt ?? new Date().toISOString() })),
                  );
                }}
                className="text-[10px] uppercase tracking-[0.2em] text-muted hover:text-accent"
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {items.length === 0 ? (
              <div className="p-6 text-center text-muted text-sm font-serif italic">
                Nothing yet.
              </div>
            ) : (
              items.map((n) => {
                const link = n.link
                  ? n.link.startsWith("/")
                    ? n.link
                    : "/" + n.link
                  : null;
                const body = (
                  <div
                    className={
                      "border-b border-highlight/25 px-3 py-2.5 " +
                      (!n.readAt ? "bg-accent/[0.06]" : "")
                    }
                  >
                    <div className="font-heading text-foreground text-[14px] uppercase tracking-[0.04em]">
                      {n.title}
                    </div>
                    {n.body && (
                      <p className="mt-0.5 text-muted text-xs leading-relaxed line-clamp-3">
                        {n.body}
                      </p>
                    )}
                    <p className="mt-1 font-accent italic text-muted text-[10px] tracking-[0.2em] uppercase">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                );
                return link ? (
                  <Link href={link} key={n.id} onClick={() => setOpen(false)}>
                    {body}
                  </Link>
                ) : (
                  <div key={n.id}>{body}</div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
