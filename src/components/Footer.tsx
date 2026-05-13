'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function Footer() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you for your interest! We'll get back to you shortly.");
  };

  return (
    <footer id="contact" className="bg-brand-charcoal text-white pt-40 pb-20 overflow-hidden relative border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 mb-40">
          <div>
            <h4 className="text-6xl md:text-8xl font-heading font-bold mb-12 tracking-tighter leading-[0.9] text-white">
              Start Your <span className="text-brand-gold">Odyssey</span>.
            </h4>
            <p className="text-white/80 text-xl font-medium mb-16 max-w-sm">
              Discover the soul of Mongolia—from vibrant cities to the silent wilderness, in every season.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
              <input 
                type="email" 
                placeholder="Email Address" 
                required
                className="w-full bg-white/10 border border-white/20 rounded-none px-6 py-4 text-sm font-bold tracking-widest uppercase focus:outline-none focus:border-brand-gold transition-colors text-white placeholder:text-white/50"
              />
              <Button 
                type="submit"
                className="w-full bg-brand-gold text-brand-charcoal hover:bg-white rounded-none py-8 font-bold tracking-[0.4em] uppercase transition-colors"
              >
                Send Inquiry
              </Button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:items-end">
            <div>
              <h5 className="text-brand-gold font-bold tracking-[0.4em] uppercase text-[10px] mb-8">Follow Us</h5>
              <div className="flex gap-8">
                <a href="https://www.facebook.com/bazarvaana" target="_blank" rel="noopener noreferrer" className="text-white hover:text-brand-gold transition-colors">
                  <FacebookIcon className="w-6 h-6" />
                </a>
                <a href="#" className="text-white hover:text-brand-gold transition-colors">
                  <InstagramIcon className="w-6 h-6" />
                </a>
              </div>
            </div>
            
            <div className="space-y-8">
              <div>
                <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-brand-gold mb-2">Email</p>
                <p className="text-lg font-bold text-white">adventure@geregeguild.mn</p>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-brand-gold mb-2">Base</p>
                <p className="text-lg font-bold text-white">Ulaanbaatar, Mongolia</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-20 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-12 text-[10px] font-bold tracking-[0.4em] uppercase text-white/60">
          <p>&copy; {new Date().getFullYear()} Gerege Guild. All rights reserved.</p>
          <div className="flex gap-12">
            <a href="#" className="hover:text-brand-gold transition-colors text-white/60">Privacy</a>
            <a href="#" className="hover:text-brand-gold transition-colors text-white/60">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
