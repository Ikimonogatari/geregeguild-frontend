"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const tenets = [
  {
    sigil: "I",
    title: "The Roster",
    desc: "Every guide is a person you can name. Read their card. Pick the one whose road sounds like yours.",
  },
  {
    sigil: "II",
    title: "The Ranks",
    desc: "Apprentice, Novice, Master, Guildmaster. The harder the country, the higher the rank you need beside you.",
  },
  {
    sigil: "III",
    title: "The Charter",
    desc: "No package, no checklist. A charter is a handshake — written in ink, sealed in tea, walked together.",
  },
  {
    sigil: "IV",
    title: "The Raven",
    desc: "Send word and we will write back. Every reply comes from a guide, not a sales desk.",
  },
];

export default function GuildSection() {
  return (
    <section className="relative py-32 px-6 overflow-hidden bg-background">
      {/* Diffused warm light pools — no sharp shadows */}
      <div className="absolute inset-0 pointer-events-none opacity-60">
        <div className="absolute top-1/4 left-10 w-[28rem] h-[28rem] rounded-full bg-accent/[0.04] blur-3xl" />
        <div className="absolute bottom-1/4 right-10 w-[24rem] h-[24rem] rounded-full bg-highlight/[0.08] blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-accent italic text-accent text-[14px] tracking-[0.35em] uppercase mb-5"
          >
            The Charter of the Guild
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-heading text-4xl md:text-6xl uppercase tracking-[0.1em] text-foreground ember-text-glow"
          >
            How a charter is made
          </motion.h2>
          <div className="ink-divider mt-10 mb-10 max-w-md mx-auto" />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-foreground/85 text-[18px] font-serif italic leading-relaxed"
          >
            Four steps. No middlemen. The same four steps as a hundred years ago,
            with the addition that you can begin them from a screen.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tenets.map((t, i) => (
            <motion.div
              key={t.sigil}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative p-9 bg-surface/60 border border-highlight/30 hover:border-accent/60 transition-all duration-700 group ember-glow"
            >
              <div className="mb-6 font-heading text-accent text-3xl tracking-[0.2em]">
                {t.sigil}
              </div>
              <h3 className="font-heading uppercase tracking-[0.1em] text-[20px] text-foreground mb-4">
                {t.title}
              </h3>
              <p className="text-muted text-[15px] leading-relaxed font-serif">
                {t.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-24 text-center flex flex-col sm:flex-row gap-5 justify-center items-center"
        >
          <Link
            href="/guides"
            className="px-12 py-5 border border-accent bg-accent/15 hover:bg-accent hover:text-background transition-all duration-500 font-accent text-[12px] tracking-[0.35em] uppercase text-foreground ember-glow"
          >
            Open the Roster
          </Link>
          <Link
            href="/map"
            className="px-12 py-5 border border-highlight/50 hover:border-accent transition-all duration-500 font-accent text-[12px] tracking-[0.35em] uppercase text-muted hover:text-foreground"
          >
            See the Map
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
