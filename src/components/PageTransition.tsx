'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';
import { EASE, DUR } from '@/lib/motion';

export default function PageTransition({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: DUR.fast }}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      // Cinematic wipe — the frame irises down into view with a faint settle.
      initial={{ clipPath: 'inset(0 0 100% 0)', opacity: 0.4, scale: 0.985 }}
      animate={{ clipPath: 'inset(0 0 0% 0)', opacity: 1, scale: 1 }}
      transition={{ duration: DUR.slow, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
