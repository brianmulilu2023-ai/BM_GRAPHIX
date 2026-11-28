import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ currentPath, navigate }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDark } = useTheme();

  const textPrimary    = 'var(--bm-nav-link, ' + (isDark ? '#FFFFFF' : '#250C00') + ')';
  const textSecondary  = 'var(--bm-nav-link, ' + (isDark ? '#FFFFFF' : '#250C00') + ')';
  const navActiveColor = 'var(--bm-nav-active, ' + (isDark ? '#E2AA00' : '#8C5800') + ')';
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Work', path: '/work' },
    { label: 'Services', path: '/services' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleNavClick = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'navbar-scrolled py-2.5'
            : 'navbar-top py-3.5 border-b border-black/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo - Sleek & Animated Luxury Lockup */}
            <motion.button
              onClick={() => handleNavClick('/')}
              className="flex items-center gap-3 group text-left focus:outline-none relative select-none"
              aria-label="BM Graphix Home"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Animated Emblem Container */}
              <div className="relative w-11 h-11 sm:w-12 sm:h-12 flex-shrink-0 flex items-center justify-center">
                {/* Breathing Ambient Gold Glow */}
                <motion.div
                  animate={{
                    opacity: [0.35, 0.75, 0.35],
                    scale: [0.95, 1.1, 0.95],
                  }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -inset-1 rounded-full blur-md pointer-events-none"
                  style={{ backgroundColor: 'var(--bm-primary, #E2AA00)', opacity: 0.25 }}
                />

                {/* Rotating Luxury Golden Halo Ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full p-[1.5px]"
                  style={{
                    background: 'linear-gradient(45deg, var(--bm-primary, #E2AA00), var(--bm-accent, #FECD00), transparent)',
                  }}
                />

                {/* Inner Dark Glass Disc */}
                <div
                  className="relative w-full h-full rounded-full backdrop-blur-md p-1.5 flex items-center justify-center transition-colors"
                  style={{
                    background: isDark ? 'rgba(14,14,14,0.90)' : 'rgba(255,249,232,0.96)',
                    border: '1px solid var(--bm-border, ' + (isDark ? '#6B3E00' : '#C38C00') + ')',
                  }}
                >
                  <img
                    src="/assets/logo/BM_OFFICIAL_LOGO.png"
                    alt="BM Graphix Logo"
                    className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)] group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              {/* Brand Typography */}
              <div className="flex flex-col justify-center">
                <span
                  className="font-display font-extrabold text-base sm:text-lg md:text-xl tracking-wider bg-clip-text text-transparent group-hover:brightness-110 transition-all duration-300 leading-none"
                  style={{
                    backgroundImage: isDark
                      ? 'linear-gradient(135deg, var(--bm-accent, #FECD00), var(--bm-primary, #E2AA00), var(--bm-secondary, #C38C00))'
                      : 'linear-gradient(135deg, var(--bm-secondary, #8C5800), var(--bm-accent, #C38C00), var(--bm-heading, #250C00))',
                  }}
                >
                  BM GRAPHIX
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  <motion.span
                    animate={{ scale: [1, 1.35, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    className="text-[8px]"
                    style={{ color: isDark ? 'var(--bm-accent, #FECD00)' : 'var(--bm-secondary, #8C5800)' }}
                  >
                    ✦
                  </motion.span>
                  <span
                    className="text-[9px] sm:text-[10px] tracking-[0.26em] uppercase font-bold leading-none"
                    style={{ color: isDark ? 'var(--bm-primary, #E2AA00)' : 'var(--bm-secondary, #8C5800)' }}
                  >
                    Motion & Visual Art
                  </span>
                </div>
              </div>
            </motion.button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = currentPath === link.path;
                return (
                  <button
                    key={link.path}
                    onClick={() => handleNavClick(link.path)}
                    className="relative text-xs uppercase tracking-[0.2em] font-bold transition-colors duration-300"
                    style={{ color: isActive ? navActiveColor : textSecondary }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = navActiveColor; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = textSecondary; }}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="navIndicator"
                        className="absolute -bottom-1.5 left-0 right-0 h-[2px] rounded-full"
                        style={{
                          background: 'linear-gradient(90deg, var(--bm-primary, #E2AA00), var(--bm-accent, #FECD00))',
                          boxShadow: '0 0 8px var(--bm-primary, #E2AA00)',
                        }}
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Action: Theme Toggle + Hire Me button */}
            <div className="hidden md:flex items-center gap-3">
              {/* Light/Dark Toggle */}
              <ThemeToggle />

              <button
                onClick={() => handleNavClick('/contact')}
                className="relative group overflow-hidden px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider shadow-[0_0_20px_rgba(226,170,0,0.28)] hover:shadow-[0_0_30px_rgba(226,170,0,0.48)] transition-all duration-300 active:scale-95"
                style={{
                  background: 'var(--bm-shape-btn, #E2AA00)',
                  color: 'var(--bm-btn-text, #250C00)',
                }}
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  Hire Me
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-3">
              {/* Theme toggle on mobile too */}
              <ThemeToggle />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 hover:text-[#F5D77A] focus:outline-none transition-colors"
                style={{ color: textPrimary }}
                aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-[64px] sm:top-[70px] left-0 right-0 z-30 mobile-menu-bg backdrop-blur-2xl border-b border-[#D4AF37]/20 px-6 py-8 md:hidden"          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => {
                const isActive = currentPath === link.path;
                return (
                  <button
                    key={link.path}
                    onClick={() => handleNavClick(link.path)}
                    className="text-left text-lg font-display uppercase tracking-wider font-semibold py-1 transition-colors"
                    style={{ color: isActive ? navActiveColor : textSecondary }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = navActiveColor; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = textSecondary; }}
                  >
                    {link.label}
                  </button>
                );
              })}

              <div className="pt-4 flex flex-col gap-3" style={{ borderTop: '1px solid var(--bm-border, ' + (isDark ? '#6B3E00' : '#C38C00') + ')' }}>
                <button
                  onClick={() => handleNavClick('/contact')}
                  className="w-full py-3 rounded-xl text-center text-xs font-bold uppercase tracking-wider shadow-lg"
                  style={{
                    background: 'var(--bm-shape-btn, #E2AA00)',
                    color: 'var(--bm-btn-text, #250C00)',
                  }}
                >
                  Hire Me Now
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
