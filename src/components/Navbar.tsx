'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X, User as UserIcon } from 'lucide-react';
import { useAuth } from './Providers';
import { AuthModal } from './AuthModal';
import Link from 'next/link';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/#' },
    { name: 'Story', href: '/#about' },
    { name: 'Ride', href: '/#experience' },
    { name: 'Map', href: '/map' }, // NEW: Link to map
    { name: 'Pricing', href: '/#pricing' },
    { name: 'Reviews', href: '/#reviews' },
  ];

  return (
    <>
      <nav 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled ? "bg-brand-charcoal/95 backdrop-blur-md h-24 shadow-xl" : "bg-transparent h-36"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            <div className="shrink-0 py-2">
              <Link href="/" className="block">
                <img 
                  src="/geregeguild.png" 
                  alt="Gerege Guild Logo" 
                  className={cn(
                    "transition-all duration-500 w-auto object-contain",
                    isScrolled ? "h-20 md:h-24" : "h-28 md:h-32"
                  )} 
                />
              </Link>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8 lg:space-x-12">
              {navLinks.map((link, idx) => (
                <Link 
                  key={idx}
                  href={link.href}
                  className="text-white hover:text-brand-gold text-[11px] font-bold tracking-[0.2em] uppercase transition-colors relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-brand-gold transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}

              {user ? (
                <div className="flex items-center space-x-6">
                  <Link 
                    href="/profile"
                    className="flex items-center space-x-2 text-brand-gold hover:text-white transition-colors"
                  >
                    <UserIcon size={20} />
                    <span className="text-[11px] font-bold tracking-[0.1em] uppercase">{user.username}</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="text-white/60 hover:text-white text-[10px] font-bold tracking-[0.1em] uppercase transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-brand-gold hover:text-white text-[11px] font-bold tracking-[0.2em] uppercase transition-colors"
                >
                  Login / Join
                </button>
              )}

              <a 
                href="/#contact" 
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
              className="fixed inset-0 top-0 bg-brand-charcoal z-[60] flex flex-col items-center justify-center space-y-8 p-12"
            >
              <button 
                className="absolute top-8 right-8 text-white p-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X size={32} />
              </button>
              
              {navLinks.map((link, idx) => (
                <Link 
                  key={idx}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white text-3xl font-bold tracking-[0.2em] uppercase hover:text-brand-gold transition-colors"
                >
                  {link.name}
                </Link>
              ))}

              {user ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-brand-gold text-2xl font-bold tracking-[0.2em] uppercase mt-8"
                  >
                    Profile ({user.username})
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-white/60 text-xl font-bold tracking-[0.1em] uppercase"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setIsAuthModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-brand-gold text-2xl font-bold tracking-[0.2em] uppercase mt-8"
                >
                  Login / Join
                </button>
              )}

              <a 
                href="/#contact" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "bg-brand-gold text-brand-charcoal rounded-none w-full py-8 text-sm font-bold tracking-widest uppercase mt-8"
                )}
              >
                Inquire Now
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
}
