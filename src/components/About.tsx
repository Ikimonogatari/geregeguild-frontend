'use client';

import { motion } from 'framer-motion';
import { Building2, Landmark, Cloud } from 'lucide-react';
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
  </svg>
);

const features = [
  {
    icon: <Building2 className="w-7 h-7 text-brand-gold" />,
    title: "City & Culture",
    description: "Explore Ulaanbaatar's vibrant life and ancient monasteries across the country."
  },
  {
    icon: <Landmark className="w-7 h-7 text-brand-gold" />,
    title: "Historic Landmarks",
    description: "Journey through historic sites that shaped the great Mongol Empire."
  },
  {
    icon: <Cloud className="w-7 h-7 text-brand-gold" />,
    title: "All Seasons",
    description: "Experience Mongolia's beauty in summer's bloom or winter's pristine white."
  }
];

export default function About() {
  return (
    <section id="about" className="py-24 md:py-32 bg-white text-brand-charcoal overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="order-2 lg:order-1"
          >
            <div className="relative overflow-hidden group border-l-4 border-brand-gold pl-4 shadow-xl">
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent z-10" />
              <img 
                src="/1.jpg" 
                alt="Lead Guide" 
                className="w-full h-[500px] md:h-[700px] object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 z-20 text-white">
                <p className="font-heading text-3xl md:text-4xl font-bold uppercase tracking-tighter">Vanya A.</p>
                <p className="text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase text-brand-gold mt-2">Lead Guide</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="order-1 lg:order-2"
          >
            <span className="text-brand-gold font-bold tracking-[0.4em] uppercase text-[9px] mb-4 block">Our Vision</span>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold mb-8 tracking-tighter leading-[0.9] text-brand-charcoal">
              Beyond the <span className="text-brand-gold">Steppe</span>
            </h2>
            <p className="text-lg md:text-xl text-neutral-800 mb-12 leading-relaxed font-medium">
              We create immersive journeys through Mongolia's diverse landscapes—from vibrant city hotspots and sacred monasteries to the raw beauty of the wilderness, spanning every season.
            </p>
            
            <div className="grid grid-cols-1 gap-8 md:gap-10 mb-12">
              {features.map((feature, idx) => (
                <div key={idx} className="flex gap-6 items-start">
                  <div className="shrink-0 mt-1">{feature.icon}</div>
                  <div>
                    <h3 className="font-heading text-xl md:text-2xl font-bold mb-2 tracking-tight text-brand-charcoal">{feature.title}</h3>
                    <p className="text-neutral-600 leading-relaxed text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <a 
              href="https://www.facebook.com/bazarvaana" 
              target="_blank" 
              rel="noopener noreferrer"
              className={cn(
                buttonVariants(),
                "bg-brand-charcoal text-white hover:bg-brand-gold hover:text-brand-charcoal rounded-none px-10 py-6 md:px-12 md:py-7 h-auto text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase transition-all duration-300 shadow-lg"
              )}
            >
              <FacebookIcon className="w-4 h-4 mr-3" />
              Connect with us
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
