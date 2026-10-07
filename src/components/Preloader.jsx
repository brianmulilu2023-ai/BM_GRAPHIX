import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Only show once per session to avoid annoying user on page changes
    const hasLoaded = sessionStorage.getItem('bm_has_preloaded');
    if (hasLoaded) {
      setLoading(false);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setLoading(false);
            sessionStorage.setItem('bm_has_preloaded', 'true');
          }, 400);
          return 100;
        }
        return prev + Math.floor(Math.random() * 18) + 8;
      });
    }, 70);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#0A0A0A] text-[#F5F1E8]"
        >
          {/* Subtle Background Glow */}
          <div className="absolute w-72 h-72 rounded-full bg-[#D4AF37]/10 blur-3xl pointer-events-none" />

          {/* Logo Animation */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative mb-8 text-center"
          >
            <div className="relative inline-block">
              <img
                src="/assets/BM_BLCK.png"
                alt="BM Graphix"
                className="w-32 md:w-40 h-auto object-contain drop-shadow-[0_0_20px_rgba(212,175,55,0.4)]"
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F5D77A]/30 to-transparent pointer-events-none"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>

            <p className="mt-4 font-display font-medium text-xs tracking-[0.3em] uppercase text-[#F5D77A]/80">
              Designs That Move People
            </p>
          </motion.div>

          {/* Golden Progress Bar */}
          <div className="w-48 md:w-64 h-[2px] bg-neutral-900 rounded-full overflow-hidden relative">
            <motion.div
              className="h-full bg-gradient-to-r from-[#B8860B] via-[#F5D77A] to-[#D4AF37] shadow-[0_0_12px_#D4AF37]"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut', duration: 0.1 }}
            />
          </div>

          <div className="mt-3 text-[11px] font-mono text-[#8A8A8A] tracking-wider">
            {progress}%
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
