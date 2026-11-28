import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.08 }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative flex items-center w-14 h-7 rounded-full border transition-all duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--bm-primary)] select-none overflow-hidden"
      style={{
        background: isDark
          ? 'linear-gradient(135deg, #1A1A1A 0%, #262626 100%)'
          : 'linear-gradient(135deg, #FFF9E8 0%, #F5E8CC 100%)',
        borderColor: 'var(--bm-border, ' + (isDark ? '#6B3E00' : '#C38C00') + ')',
        boxShadow: isDark
          ? '0 0 12px rgba(226,170,0,0.18), inset 0 1px 2px rgba(0,0,0,0.5)'
          : '0 0 12px rgba(195,140,0,0.22), inset 0 1px 2px rgba(37,12,0,0.08)',
      }}
    >
      {/* Track icons */}
      <span className="absolute left-1.5 opacity-80">
        <Moon className="w-3 h-3" style={{ color: isDark ? 'var(--bm-accent, #FECD00)' : 'var(--bm-secondary-text, #6B3E00)' }} />
      </span>
      <span className="absolute right-1.5 opacity-80">
        <Sun className="w-3 h-3" style={{ color: isDark ? '#6B3E00' : 'var(--bm-secondary, #8C5800)' }} />
      </span>

      {/* Sliding thumb */}
      <motion.div
        layout
        animate={{ x: isDark ? 0 : 28 }}
        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        className="relative z-10 w-5 h-5 rounded-full flex items-center justify-center shadow-lg ml-1"
        style={{
          background: 'linear-gradient(135deg, var(--bm-primary, #E2AA00) 0%, var(--bm-accent, #FECD00) 100%)',
          boxShadow: '0 2px 8px rgba(226,170,0,0.45)',
        }}
      >
        {isDark
          ? <Moon className="w-2.5 h-2.5 text-[#250C00]" />
          : <Sun className="w-2.5 h-2.5 text-[#250C00]" />
        }
      </motion.div>
    </motion.button>
  );
}
