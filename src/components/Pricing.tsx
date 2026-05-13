'use client';

import { motion } from 'framer-motion';
import { Check, ShieldCheck, Zap, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Nomadic Spirit",
    price: "1,500",
    description: "A 7-day immersion into the heart of the Central Steppe.",
    features: [
      "Traditional Ger stays",
      "Horse riding expeditions",
      "Local nomadic family visits",
      "Full board (Mongolian cuisine)",
      "Airport transfers"
    ],
    highlight: false,
    icon: <Zap className="w-6 h-6" />
  },
  {
    name: "Gobi Odyssey",
    price: "2,800",
    description: "12 days exploring the mystical Flaming Cliffs and Khongor Sand Dunes.",
    features: [
      "Luxury desert camps",
      "Camel trekking",
      "Dinosaur fossil sites",
      "Star gazing sessions",
      "Private 4x4 transport",
      "English speaking lead guide"
    ],
    highlight: true,
    icon: <Star className="w-6 h-6 text-brand-gold" />
  },
  {
    name: "Eagle Hunter Quest",
    price: "4,200",
    description: "A premium 14-day journey to the Altai Mountains in Western Mongolia.",
    features: [
      "Eagle hunter festivals",
      "Mountain photography tours",
      "Internal flights included",
      "Premium gear & equipment",
      "Cultural workshop access",
      "24/7 concierge support"
    ],
    highlight: false,
    icon: <ShieldCheck className="w-6 h-6" />
  }
];

export default function Pricing() {
  const handlePayment = (planName: string) => {
    // This would typically redirect to Stripe Checkout or open a payment modal
    console.log(`Processing payment for ${planName}`);
    window.location.href = `https://buy.stripe.com/test_placeholder_${planName.toLowerCase().replace(/ /g, '_')}`;
  };

  return (
    <section id="pricing" className="py-20 md:py-32 bg-brand-charcoal text-white overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-gold rounded-full blur-[100px]" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-gold rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-brand-gold font-bold tracking-[0.4em] uppercase text-[10px] mb-4 block"
          >
            Pricing & Packages
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-heading font-bold mb-8 tracking-tighter leading-[0.9]"
          >
            Invest in <span className="text-brand-gold">Memories</span>.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-base md:text-lg max-w-2xl mx-auto font-medium"
          >
            Choose the journey that speaks to your soul. Each package is meticulously crafted to provide an authentic and premium Mongolian experience.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                "relative group flex flex-col p-8 md:p-10 border transition-all duration-500",
                plan.highlight 
                  ? "bg-white/5 border-brand-gold/50 shadow-[0_0_50px_rgba(212,175,55,0.1)]" 
                  : "bg-white/2 border-white/10 hover:border-white/30"
              )}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-gold text-brand-charcoal px-6 py-1 text-[10px] font-bold tracking-widest uppercase">
                  Most Popular
                </div>
              )}

              <div className="mb-10">
                <div className="mb-6">{plan.icon}</div>
                <h3 className="text-2xl md:text-3xl font-heading font-bold mb-2">{plan.name}</h3>
                <p className="text-white/40 text-xs md:text-sm h-12">{plan.description}</p>
              </div>

              <div className="mb-10">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl md:text-4xl font-bold font-heading text-brand-gold">$</span>
                  <span className="text-5xl md:text-6xl font-bold font-heading">{plan.price}</span>
                  <span className="text-white/40 text-xs md:text-sm ml-2">/ person</span>
                </div>
              </div>

              <div className="grow space-y-4 mb-12">
                {plan.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-brand-gold shrink-0" />
                    <span className="text-sm text-white/70">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => handlePayment(plan.name)}
                className={cn(
                  "w-full rounded-none py-8 font-bold tracking-[0.3em] uppercase transition-all duration-300",
                  plan.highlight
                    ? "bg-brand-gold text-brand-charcoal hover:bg-white"
                    : "bg-white/10 text-white hover:bg-brand-gold hover:text-brand-charcoal"
                )}
              >
                Secure Booking
              </Button>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 text-center p-12 border border-white/5 bg-white/1"
        >
          <p className="text-white/40 text-sm mb-6 uppercase tracking-[0.2em]">Need a custom itinerary?</p>
          <a 
            href="#contact" 
            className="text-brand-gold hover:text-white transition-colors font-bold tracking-[0.4em] uppercase text-xs"
          >
            Inquire for custom payment →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
