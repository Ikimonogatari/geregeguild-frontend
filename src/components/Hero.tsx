"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-brand-charcoal">
      <div className="absolute inset-0 z-0">
        <video
          key="hero-video"
          autoPlay
          loop
          muted
          playsInline
          className="object-cover w-full h-full opacity-50"
        >
          <source src="/MONGOLIA.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-brand-charcoal/30"></div>
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-heading font-bold text-white mb-6 tracking-tighter leading-[0.9]"
        >
          GEREGE <span className="text-brand-gold">GUILD</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="text-sm sm:text-lg md:text-xl text-white mb-12 tracking-[0.3em] sm:tracking-[0.5em] uppercase font-bold drop-shadow-lg"
        >
          Timeless Mongolian Journeys
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6 }}
        >
          <a
            href="#about"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "rounded-none px-10 py-6 sm:px-12 sm:py-7 text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase border-white/30 text-white hover:bg-brand-gold hover:text-brand-charcoal hover:border-brand-gold transition-all duration-500",
            )}
          >
            Start Journey
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-12 left-6 sm:left-12 items-center gap-4 origin-left -rotate-90 hidden sm:flex"
      >
        <span className="text-brand-gold text-[9px] tracking-[0.5em] uppercase font-bold">
          Discover
        </span>
        <div className="w-12 h-px bg-brand-gold/30"></div>
      </motion.div>
    </section>
  );
}
