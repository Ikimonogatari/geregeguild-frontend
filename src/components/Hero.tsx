"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-background">
      {/* Video — full bleed, sepia-washed */}
      <div className="absolute inset-0 z-0">
        <video
          key="hero-video"
          autoPlay
          loop
          muted
          playsInline
          className="object-cover w-full h-full"
          style={{
            filter: "sepia(25%) saturate(80%) brightness(0.78) contrast(1.05)",
          }}
        >
          <source src="/MONGOLIA.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Layered atmospheric overlays — the hero reads on ANY frame */}
      <div aria-hidden className="absolute inset-0 z-[1] pointer-events-none">
        {/* 1. Uniform dark veil */}
        <div className="absolute inset-0 bg-[#0D0A07]/72" />

        {/* 2. Heavy vignette — corners go almost black, locks center */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 55%, transparent 0%, transparent 30%, rgba(13,10,7,0.55) 70%, rgba(13,10,7,0.95) 100%)",
          }}
        />

        {/* 3. Centered ember spotlight — fire-pit behind the title */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(28% 36% at 50% 52%, rgba(201,146,42,0.22), rgba(201,146,42,0.06) 55%, transparent 78%)",
          }}
        />

        {/* 4. Bottom fade into the next section */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-background" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1 }}
          className="font-accent italic text-accent text-[13px] sm:text-[16px] tracking-[0.4em] uppercase mb-6"
        >
          A Fellowship of Mongolian Guides
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 28, letterSpacing: "0.06em" }}
          animate={{ opacity: 1, y: 0, letterSpacing: "0.12em" }}
          transition={{ duration: 1.6, ease: [0.2, 0.7, 0.2, 1] }}
          className="font-heading text-5xl sm:text-7xl md:text-8xl uppercase text-foreground ember-text-glow leading-[1.05] whitespace-nowrap"
        >
          GEREGE <span className="text-accent">GUILD</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="mt-10 text-foreground/90 text-[17px] sm:text-[20px] max-w-2xl mx-auto italic font-serif leading-relaxed"
        >
          Ancient roads. Master companions. Choose your guide as one chooses a
          travelling friend — and the country will open to you.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.75 }}
          className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/guides"
            className="px-10 py-5 border border-accent bg-accent/15 hover:bg-accent hover:text-background transition-all duration-500 font-accent text-[12px] tracking-[0.35em] uppercase text-foreground ember-glow"
          >
            Choose Your Guide
          </Link>
          <a
            href="#lay"
            className="px-10 py-5 border border-foreground/25 hover:border-accent transition-all duration-500 font-accent text-[12px] tracking-[0.35em] uppercase text-foreground/80 hover:text-foreground"
          >
            Read the Lore
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="font-accent italic text-accent text-[10px] tracking-[0.5em] uppercase">
          Onward
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-12 bg-gradient-to-b from-accent/70 to-transparent"
        />
      </motion.div>
    </section>
  );
}
