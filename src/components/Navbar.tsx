'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Story', href: '#about' },
    { name: 'Ride', href: '#experience' },
    { name: 'Reviews', href: '#reviews' },
  ];

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled ? "bg-brand-charcoal/95 backdrop-blur-md h-20 shadow-xl" : "bg-transparent h-28"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          <div className="shrink-0 py-2">
            <a href="#" className="block">
              <img 
                src="/geregeguild.png" 
                alt="Gerege Guild Logo" 
                className={cn(
                  "transition-all duration-500 w-auto object-contain",
                  isScrolled ? "h-16 md:h-20" : "h-20 md:h-24"
                )} 
              />
            </a>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8 lg:space-x-12">
            {navLinks.map((link, idx) => (
              <a 
                key={idx}
                href={link.href}
                className="text-white hover:text-brand-gold text-[11px] font-bold tracking-[0.2em] uppercase transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-brand-gold transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
            <a 
              href="#contact" 
              className={cn(
                buttonVariants({ variant: "default" }),
                "bg-brand-gold text-brand-charcoal hover:bg-white rounded-none px-8 py-4 h-auto text-[10px] font-bold tracking-widest uppercase transition-colors duration-300 border-none"
              )}
            >
              Inquire
            </a>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-0 bg-brand-charcoal z-[60] flex flex-col items-center justify-center space-y-12 p-12"
          >
            <button 
              className="absolute top-8 right-8 text-white p-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={32} />
            </button>
            
            {navLinks.map((link, idx) => (
              <a 
                key={idx}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white text-3xl font-bold tracking-[0.2em] uppercase hover:text-brand-gold transition-colors"
              >
                {link.name}
              </a>
            ))}
            <a 
              href="#contact" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                buttonVariants({ variant: "default" }),
                "bg-brand-gold text-brand-charcoal rounded-none w-full py-8 text-sm font-bold tracking-widest uppercase"
              )}
            >
              Inquire Now
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
