'use client';

import { motion } from 'framer-motion';

export default function Experience() {
  return (
    <section id="experience" className="relative h-[70vh] md:h-[80vh] w-full flex items-center justify-center overflow-hidden bg-brand-charcoal">
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="object-cover w-full h-full opacity-80 grayscale transition-all duration-1000"
        >
          <source src="/ride.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-linear-to-b from-brand-charcoal/80 via-transparent to-brand-charcoal/80 opacity-90" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-brand-gold font-bold tracking-[0.5em] uppercase text-[9px] mb-6 block"
        >
          The Journey
        </motion.span>
        
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-8 tracking-tighter leading-tight"
        >
          Authentic travel <br />
          <span className="text-brand-gold italic">experiences.</span>
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-white/90 text-base md:text-lg lg:text-xl font-medium max-w-2xl mx-auto leading-relaxed"
        >
          Our journeys are curated to reveal the authentic soul of Mongolia, connecting you with local traditions and breathtaking landscapes at a comfortable, meaningful pace.
        </motion.p>
      </div>

      {/* Decorative lines */}
      <div className="absolute top-0 left-0 w-full h-px bg-white/10" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-white/10" />
    </section>
  );
}
