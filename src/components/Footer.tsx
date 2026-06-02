"use client";

import { motion } from "framer-motion";
import { toast } from "sonner";

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
      clipRule="evenodd"
    />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function Footer() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("The raven is on its way. We will write back soon.");
  };

  return (
    <footer
      id="contact"
      className="relative bg-background text-foreground pt-32 pb-16 border-t border-accent/20"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
            <p className="font-accent italic text-accent text-[14px] tracking-[0.35em] uppercase mb-5">
              Send a Raven
            </p>
            <h4 className="font-heading text-4xl md:text-6xl uppercase tracking-[0.08em] leading-[1.05] text-foreground ember-text-glow mb-8">
              Begin your <span className="text-accent">charter</span>.
            </h4>
            <p className="text-foreground/85 text-[18px] font-serif italic mb-10 max-w-md leading-relaxed">
              Write us where you would like to go, when you might come, and any
              guide whose card has spoken to you. We answer every raven.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
              <input
                type="email"
                placeholder="Your email"
                required
                className="w-full bg-surface/60 border border-highlight/40 rounded-none px-5 py-4 text-foreground placeholder:text-muted font-serif focus:outline-none focus:border-accent transition-colors"
              />
              <textarea
                placeholder="A few lines on the journey you have in mind"
                rows={3}
                className="w-full bg-surface/60 border border-highlight/40 rounded-none px-5 py-4 text-foreground placeholder:text-muted font-serif focus:outline-none focus:border-accent transition-colors resize-none"
              />
              <button
                type="submit"
                className="w-full px-10 py-5 border border-accent bg-accent/15 hover:bg-accent hover:text-background transition-all duration-500 font-accent text-[12px] tracking-[0.4em] uppercase text-foreground ember-glow"
              >
                Send the Raven
              </button>
            </form>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:items-end">
            <div>
              <h5 className="font-accent italic text-accent text-[13px] tracking-[0.4em] uppercase mb-6">
                Where to find us
              </h5>
              <div className="flex gap-6">
                <a
                  href="https://www.facebook.com/bazarvaana"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-accent transition-colors"
                  aria-label="Facebook"
                >
                  <FacebookIcon className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  className="text-foreground hover:text-accent transition-colors"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="w-6 h-6" />
                </a>
              </div>
            </div>

            <div className="space-y-7">
              <div>
                <p className="font-accent italic text-accent text-[12px] tracking-[0.4em] uppercase mb-2">
                  Hall
                </p>
                <p className="font-serif text-[17px] text-foreground">
                  Ulaanbaatar, Mongolia
                </p>
              </div>
              <div>
                <p className="font-accent italic text-accent text-[12px] tracking-[0.4em] uppercase mb-2">
                  Raven
                </p>
                <p className="font-serif text-[17px] text-foreground">
                  hello@geregeguild.mn
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="ink-divider mb-10" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-8 font-accent text-[11px] tracking-[0.35em] uppercase text-muted">
          <p>© {new Date().getFullYear()} Gerege Guild · All quests reserved.</p>
          <div className="flex gap-10">
            <a href="#" className="hover:text-accent transition-colors">
              Charter Terms
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
