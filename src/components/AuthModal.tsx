'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useAuth } from './Providers';
import { Button } from './ui/button';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      const success = await login(username.trim(), password.trim());
      if (success) {
        onClose();
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-md p-8 bg-brand-charcoal text-white rounded-xl shadow-2xl border border-brand-gold/20"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <h2 className="text-3xl font-bricolage font-bold text-brand-gold mb-2">
              {isLogin ? 'Welcome Back' : 'Join the Guild'}
            </h2>
            <p className="text-white/70 mb-8 font-space-grotesk">
              {isLogin
                ? 'Enter your name to access your Gerege Passport.'
                : 'Sign up to explore the map and unlock exclusive lore.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 font-space-grotesk">
                    Your Traveler Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Marco Polo"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full flex h-10 rounded-md border px-3 py-2 text-sm bg-white/5 border-white/20 text-white placeholder:text-white/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 font-space-grotesk">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full flex h-10 rounded-md border px-3 py-2 text-sm bg-white/5 border-white/20 text-white placeholder:text-white/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-brand-gold text-brand-charcoal hover:bg-white font-bold tracking-wider uppercase rounded-none h-12"
              >
                {isLogin ? 'Login' : 'Sign Up'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm font-space-grotesk text-white/60">
              {isLogin ? "Don't have a passport? " : "Already have a passport? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-brand-gold hover:underline font-medium"
              >
                {isLogin ? 'Sign up' : 'Login'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
