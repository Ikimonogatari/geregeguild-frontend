'use client';

import { useAuth, useGame } from '@/components/Providers';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ScrollText, MapPin, Award, Users } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import PageTransition from '@/components/PageTransition';

export default function ProfilePage() {
  const { user } = useAuth();
  const { gameState, rank, pois, leaderboard } = useGame();
  const router = useRouter();

  useEffect(() => {
    // If we have no user and auth is fully loaded (in a real app), redirect.
    // For this mock, we just check if it's null on mount. Since it might take a tick, we can be lenient or strict.
    // Let's just show a fallback if not logged in.
  }, [user, router]);

  if (!user) {
    return (
      <main className="min-h-screen bg-brand-charcoal text-white pt-36 px-6">
        <Navbar />
        <div className="max-w-4xl mx-auto text-center mt-20">
          <h1 className="text-4xl font-bricolage text-brand-gold mb-6">Access Denied</h1>
          <p className="font-space-grotesk text-lg text-white/70">Please login to view your Gerege Passport.</p>
        </div>
      </main>
    );
  }

  const unlockedLoreData = pois.filter(poi => gameState.unlockedPOIs.includes(poi.id));

  return (
    <PageTransition>
      <main className="min-h-screen bg-brand-charcoal text-white pt-36 px-6 pb-20">
      <Navbar />
      
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center relative py-12 border-y border-brand-gold/20"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-brand-gold to-transparent" />
          <h1 className="text-5xl md:text-7xl font-bricolage font-bold text-white mb-4">
            <span className="text-brand-gold">{user.username}'s</span> Passport
          </h1>
          <p className="text-xl text-white/60 font-space-grotesk uppercase tracking-[0.2em]">
            Guild Rank: <span className="text-brand-gold font-bold">{rank}</span>
          </p>
          <div className="mt-6 inline-flex items-center space-x-2 bg-white/5 rounded-full px-6 py-2 border border-white/10">
            <Award className="text-brand-gold" size={20} />
            <span className="font-bold tracking-widest">{gameState.points} Points</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Stats Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 space-y-8"
          >
            <div className="bg-white/5 border border-white/10 p-8 rounded-xl">
              <h2 className="text-2xl font-bricolage text-brand-gold mb-6 flex items-center gap-3">
                <MapPin size={24} /> Journey Stats
              </h2>
              <div className="space-y-4 font-space-grotesk">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span className="text-white/60">Locations Visited</span>
                  <span className="text-2xl font-bold">{gameState.unlockedPOIs.length} <span className="text-sm text-white/40">/ {pois.length}</span></span>
                </div>
                <div className="pt-4">
                  <Link href="/map" className="text-brand-gold hover:text-white uppercase tracking-widest text-sm font-bold flex items-center gap-2 group transition-colors">
                    Continue Exploring 
                    <span className="group-hover:translate-x-2 transition-transform">→</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 rounded-xl">
              <h2 className="text-2xl font-bricolage text-brand-gold mb-6 flex items-center gap-3">
                <Users size={24} /> Guild Leaderboard
              </h2>
              <div className="space-y-4 font-space-grotesk">
                {leaderboard.length === 0 ? (
                   <p className="text-white/40 text-sm">Waiting for members...</p>
                ) : (
                  leaderboard.map((entry, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-white/10 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <span className="text-brand-gold font-bold w-4 text-sm">{i + 1}</span>
                        <div className="flex flex-col">
                          <span className={cn("font-bold text-sm", entry.username === user.username && "text-brand-gold")}>
                            {entry.username} {entry.username === user.username && "(You)"}
                          </span>
                          <span className="text-[10px] uppercase tracking-wider text-white/40">{entry.rank}</span>
                        </div>
                      </div>
                      <span className="font-bold text-white/80 text-sm">{entry.points}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>

          {/* Lore Collection */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 space-y-6"
          >
            <h2 className="text-3xl font-bricolage text-brand-gold mb-8 flex items-center gap-3">
              <ScrollText size={28} /> Unlocked Lore
            </h2>

            {unlockedLoreData.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-white/20 rounded-xl bg-white/5">
                <p className="text-white/50 font-space-grotesk text-lg">Your journal is empty.</p>
                <Link href="/map" className="inline-block mt-4 px-6 py-3 bg-brand-gold text-brand-charcoal font-bold tracking-widest uppercase text-sm hover:bg-white transition-colors">
                  Find Locations on Map
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {unlockedLoreData.map((poi, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + (idx * 0.1) }}
                    key={poi.id} 
                    className="flex flex-col md:flex-row bg-black/20 border border-brand-gold/20 rounded-xl hover:border-brand-gold/50 transition-colors overflow-hidden"
                  >
                    <div className="md:w-1/3 relative h-48 md:h-auto">
                      <img src={poi.imageUrl} alt={poi.name} className="w-full h-full object-cover" />
                      <div className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-widest bg-brand-charcoal text-brand-gold px-2 py-1 rounded shadow">
                        {poi.type}
                      </div>
                    </div>
                    <div className="p-8 md:w-2/3">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-2xl font-bold font-bricolage text-white">{poi.name}</h3>
                        <span className="text-brand-gold text-sm font-bold bg-brand-gold/10 px-3 py-1 rounded-full whitespace-nowrap ml-4">
                          +{poi.points} pts
                        </span>
                      </div>
                      <p className="text-white/80 font-space-grotesk leading-relaxed">
                        {poi.lore}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
          
        </div>
      </div>
      </main>
    </PageTransition>
  );
}
