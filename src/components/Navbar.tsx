"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE, DUR } from "@/lib/motion";
import { Menu, X, User as UserIcon } from "lucide-react";
import { useAuth } from "./Providers";
import { AuthModal } from "./AuthModal";
import Link from "next/link";

export default function Navbar() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(!isHomePage);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!isHomePage) {
      setIsScrolled(true);
      return;
    }
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  const navLinks = [
    { name: "Hall", href: "/" },
    { name: "Journeys", href: "/journeys" },
    { name: "Guides", href: "/guides" },
    { name: "Map", href: "/map" },
    { name: "Lore", href: "/#lore" },
  ];

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-[height] duration-500",
          isScrolled ? "h-20" : "h-28"
        )}
      >
        {/* Letterhead background — slides down + fades in once past the hero */}
        <AnimatePresence>
          {isScrolled && (
            <motion.div
              key="nav-letterhead"
              aria-hidden
              initial={{ y: "-100%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{ duration: DUR.base, ease: EASE }}
              className="absolute inset-0 -z-10 bg-surface/90 backdrop-blur-md border-b border-accent/20 ember-glow"
            />
          )}
        </AnimatePresence>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            <div className="shrink-0 py-2">
              <Link href="/" className="block">
                <img
                  src="/geregeguild.png"
                  alt="Gerege Guild"
                  className={cn(
                    "candle-flicker transition-all duration-500 w-auto object-contain",
                    isScrolled ? "h-14 md:h-16" : "h-20 md:h-24"
                  )}
                />
              </Link>
            </div>

            {/* Desktop Nav — hamburger stays until lg so the full link row
                doesn't get cramped + clipped at tablet widths. */}
            <div className="hidden lg:flex items-center space-x-8 xl:space-x-12">
              {navLinks.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  className="font-accent text-foreground hover:text-accent text-[13px] tracking-[0.3em] uppercase transition-colors relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-2 left-0 w-0 h-px bg-accent transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}

              {user ? (
                <div className="flex items-center space-x-5">
                  <Link
                    href="/profile"
                    className="flex items-center space-x-2 text-accent hover:text-foreground transition-colors"
                  >
                    <UserIcon size={18} />
                    <span className="font-accent text-[12px] tracking-[0.2em] uppercase">
                      {user.username}
                    </span>
                  </Link>
                  <button
                    onClick={logout}
                    className="font-accent text-muted hover:text-foreground text-[11px] tracking-[0.2em] uppercase transition-colors"
                  >
                    Leave
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="font-accent text-accent hover:text-foreground text-[12px] tracking-[0.3em] uppercase transition-colors"
                >
                  Sign the Register
                </button>
              )}

              <Link
                href="/journeys"
                className="px-6 py-3 border border-accent bg-accent/10 hover:bg-accent hover:text-background font-accent text-[11px] tracking-[0.3em] uppercase text-foreground transition-all duration-500 ember-glow"
              >
                Choose Journey
              </Link>
            </div>

            {/* Mobile/Tablet Toggle */}
            <button
              className="lg:hidden text-foreground p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-background z-[60] flex flex-col items-center justify-center space-y-8 p-12"
          >
            <button
              className="absolute top-8 right-8 text-foreground p-2"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close"
            >
              <X size={32} />
            </button>

            {navLinks.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-heading text-foreground text-3xl tracking-[0.2em] uppercase hover:text-accent transition-colors"
              >
                {link.name}
              </Link>
            ))}

            {user ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-accent text-accent text-xl tracking-[0.2em] uppercase mt-8"
                >
                  Profile ({user.username})
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="font-accent text-muted text-lg tracking-[0.2em] uppercase"
                >
                  Leave
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="font-accent text-accent text-xl tracking-[0.2em] uppercase mt-8"
              >
                Sign the Register
              </button>
            )}

            <Link
              href="/journeys"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-10 py-5 border border-accent bg-accent/10 font-accent text-foreground text-sm tracking-[0.3em] uppercase mt-8"
            >
              Choose Journey
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}
