"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative h-svh min-h-[640px] w-full overflow-hidden bg-background">
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

      {/* Layered atmospheric overlays */}
      <div aria-hidden className="absolute inset-0 z-[1] pointer-events-none">
        <div className="absolute inset-0 bg-[#0D0A07]/72" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 45%, transparent 0%, transparent 30%, rgba(13,10,7,0.55) 70%, rgba(13,10,7,0.95) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(30% 38% at 50% 44%, rgba(201,146,42,0.22), rgba(201,146,42,0.06) 55%, transparent 78%)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-32 sm:h-40 bg-gradient-to-b from-transparent to-background" />
      </div>

      {/* Content — vertically centered in the area BELOW the navbar */}
      <div
        className="relative z-10 h-full w-full flex items-center justify-center px-5 sm:px-6"
        style={{ paddingTop: "112px", paddingBottom: "96px" }}
      >
        <div className="text-center w-full max-w-5xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="font-accent italic text-accent text-[11px] sm:text-[14px] md:text-[16px] tracking-[0.32em] sm:tracking-[0.4em] uppercase mb-5 sm:mb-6"
          >
            A Fellowship of Mongolian Guides
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 28, letterSpacing: "0.06em" }}
            animate={{ opacity: 1, y: 0, letterSpacing: "0.12em" }}
            transition={{ duration: 1.6, ease: [0.2, 0.7, 0.2, 1] }}
            className="font-heading uppercase text-foreground ember-text-glow leading-[1.02] sm:leading-[1.05] md:whitespace-nowrap text-[44px] xs:text-[52px] sm:text-6xl md:text-7xl lg:text-8xl"
          >
            <span className="block sm:inline">GEREGE</span>{" "}
            <span className="block sm:inline text-accent">GUILD</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="mt-8 sm:mt-10 text-foreground/90 text-[15px] sm:text-[17px] md:text-[20px] max-w-md sm:max-w-xl md:max-w-2xl mx-auto italic font-serif leading-relaxed"
          >
            First choose the Mongolia you want to meet. Then we build the full
            charter around it — the route, the machine, the rhythm, and the
            person who knows the way.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.75 }}
            className="mt-10 sm:mt-12 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center max-w-sm sm:max-w-none mx-auto"
          >
            <Link
              href="/journeys"
              className="px-8 sm:px-10 py-4 sm:py-5 border border-accent bg-accent/15 hover:bg-accent hover:text-background transition-all duration-500 font-accent text-[11px] sm:text-[12px] tracking-[0.3em] sm:tracking-[0.35em] uppercase text-foreground ember-glow text-center"
            >
              Choose Your Journey
            </Link>
            <Link
              href="/journeys#interest"
              className="px-8 sm:px-10 py-4 sm:py-5 border border-foreground/25 hover:border-accent transition-all duration-500 font-accent text-[11px] sm:text-[12px] tracking-[0.3em] sm:tracking-[0.35em] uppercase text-foreground/80 hover:text-foreground text-center"
            >
              Find Your Mongolia
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="font-accent italic text-accent text-[10px] tracking-[0.5em] uppercase">
          Onward
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-10 sm:h-12 bg-gradient-to-b from-accent/70 to-transparent"
        />
      </motion.div>
    </section>
  );
}
