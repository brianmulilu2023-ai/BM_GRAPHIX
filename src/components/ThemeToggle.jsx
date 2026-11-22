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
      className="relative flex items-center w-14 h-7 rounded-full border transition-all duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] select-none overflow-hidden"
      style={{
        background: isDark
          ? 'linear-gradient(135deg, #1A1A1A 0%, #262626 100%)'
          : 'linear-gradient(135deg, #E8D5B0 0%, #F5E8CC 100%)',
        borderColor: isDark ? 'rgba(212,175,55,0.35)' : 'rgba(212,175,55,0.5)',
        boxShadow: isDark
          ? '0 0 12px rgba(212,175,55,0.15), inset 0 1px 2px rgba(0,0,0,0.5)'
          : '0 0 12px rgba(212,175,55,0.25), inset 0 1px 2px rgba(0,0,0,0.08)',
      }}
    >
      {/* Track icons */}
      <span className="absolute left-1.5 opacity-70">
        <Moon className="w-3 h-3" style={{ color: isDark ? '#F5D77A' : '#9A8A75' }} />
      </span>
      <span className="absolute right-1.5 opacity-70">
        <Sun className="w-3 h-3" style={{ color: isDark ? '#4A4A4A' : '#D4AF37' }} />
      </span>

      {/* Sliding thumb */}
      <motion.div
        layout
        animate={{ x: isDark ? 0 : 28 }}
        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        className="relative z-10 w-5 h-5 rounded-full flex items-center justify-center shadow-lg ml-1"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, #D4AF37 0%, #F5D77A 100%)'
            : 'linear-gradient(135deg, #F5D77A 0%, #D4AF37 100%)',
          boxShadow: isDark
            ? '0 2px 8px rgba(212,175,55,0.5)'
            : '0 2px 8px rgba(212,175,55,0.4)',
        }}
      >
        {isDark
          ? <Moon className="w-2.5 h-2.5 text-black" />
          : <Sun className="w-2.5 h-2.5 text-black" />
        }
      </motion.div>
    </motion.button>
  );
}
