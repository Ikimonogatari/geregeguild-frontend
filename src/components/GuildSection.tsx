'use client';

import { motion } from 'framer-motion';
import { Map, Scroll, Award, Users } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    title: "Interactive Map",
    desc: "Explore historic landmarks and hidden gems across the Mongolian plateau with our custom traveler's map.",
    icon: <Map className="text-brand-gold" size={32} />
  },
  {
    title: "Unlock Lore",
    desc: "Check in at locations to unlock deep historical context and legendary stories from our master storytellers.",
    icon: <Scroll className="text-brand-gold" size={32} />
  },
  {
    title: "Guild Ranks",
    desc: "Earn points for your discoveries and rise from a Novice to a legendary Guild Envoy.",
    icon: <Award className="text-brand-gold" size={32} />
  },
  {
    title: "Leaderboard",
    desc: "Connect with fellow travelers and see who has discovered the most secrets across the steppe.",
    icon: <Users className="text-brand-gold" size={32} />
  }
];

export default function GuildSection() {
  return (
    <section className="py-32 bg-brand-charcoal text-white overflow-hidden relative">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-1/4 left-10 w-96 h-96 border border-brand-gold rounded-full rotate-45" />
        <div className="absolute bottom-1/4 right-10 w-64 h-64 border border-brand-gold rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-brand-gold font-bold tracking-[0.5em] uppercase text-[10px] block mb-6"
          >
            Gamified Exploration
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bricolage font-bold tracking-tight mb-8"
          >
            Join the <span className="text-brand-gold">Gerege Guild</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white/60 max-w-2xl mx-auto font-space-grotesk text-lg leading-relaxed"
          >
            Turn your journey into a legendary saga. Our interactive guild platform tracks your progress, 
            unlocks ancient lore, and rewards your curiosity with exclusive ranks and digital artifacts.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-10 bg-white/5 border border-white/10 rounded-[2rem] hover:border-brand-gold/50 transition-all duration-700 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 blur-3xl -mr-16 -mt-16 group-hover:bg-brand-gold/10 transition-all" />
              
              <div className="mb-8 p-5 bg-brand-gold/10 rounded-2xl w-fit group-hover:bg-brand-gold transition-colors duration-500">
                <div className="group-hover:text-brand-charcoal transition-colors">
                  {f.icon}
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-4 font-bricolage text-white group-hover:text-brand-gold transition-colors">{f.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed font-space-grotesk group-hover:text-white/70 transition-colors">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-24 text-center"
        >
          <Link 
            href="/map" 
            className="inline-flex items-center gap-4 bg-brand-gold text-brand-charcoal px-14 py-6 font-bold uppercase tracking-[0.3em] text-xs hover:bg-white transition-all duration-500 rounded-full shadow-2xl shadow-brand-gold/20 hover:scale-105 active:scale-95"
          >
            Open Interactive Map
            <span className="text-lg">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
