import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';

export default function Navbar({ currentPath, navigate }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAdminLoggedIn } = useProjects();

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
            ? 'bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-[#D4AF37]/20 py-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
            : 'bg-transparent py-3.5 border-b border-white/5'
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
                  className="absolute -inset-1 rounded-full bg-[#D4AF37]/25 blur-md pointer-events-none"
                />

                {/* Rotating Luxury Golden Halo Ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full p-[1.5px] bg-gradient-to-tr from-[#D4AF37] via-[#F5D77A]/50 to-transparent"
                />

                {/* Inner Dark Glass Disc */}
                <div className="relative w-full h-full rounded-full bg-[#0E0E0E]/90 backdrop-blur-md p-1.5 flex items-center justify-center border border-[#D4AF37]/40 shadow-inner group-hover:border-[#F5D77A] transition-colors">
                  <img
                    src="/assets/logo/BM_OFFICIAL_LOGO.png"
                    alt="BM Graphix Logo"
                    className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)] group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              {/* Brand Typography */}
              <div className="flex flex-col justify-center">
                <span className="font-display font-extrabold text-base sm:text-lg md:text-xl tracking-wider bg-gradient-to-r from-[#F5D77A] via-[#E5C158] to-[#D4AF37] bg-clip-text text-transparent group-hover:brightness-125 transition-all duration-300 leading-none">
                  BM GRAPHIX
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  <motion.span
                    animate={{ scale: [1, 1.35, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    className="text-[8px] text-[#F5D77A]"
                  >
                    ✦
                  </motion.span>
                  <span className="text-[9px] sm:text-[10px] tracking-[0.26em] uppercase text-[#D4AF37] font-semibold leading-none">
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
                    className={`relative text-xs uppercase tracking-[0.2em] font-medium transition-colors duration-300 ${
                      isActive
                        ? 'text-[#F5D77A]'
                        : 'text-[#8A8A8A] hover:text-[#F5F1E8]'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="navIndicator"
                        className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-gradient-to-r from-[#D4AF37] to-[#F5D77A] rounded-full shadow-[0_0_8px_#D4AF37]"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Action: Admin link if logged in + Hire Me button */}
            <div className="hidden md:flex items-center gap-4">
              {isAdminLoggedIn && (
                <button
                  onClick={() => handleNavClick('/admin/dashboard')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[#D4AF37] border border-[#D4AF37]/40 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 transition"
                  title="Admin Dashboard"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#F5D77A]" />
                  <span>Admin</span>
                </button>
              )}

              <button
                onClick={() => handleNavClick('/contact')}
                className="relative group overflow-hidden px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-black bg-gradient-to-r from-[#D4AF37] via-[#F5D77A] to-[#B8860B] shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all duration-300 active:scale-95"
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
              {isAdminLoggedIn && (
                <button
                  onClick={() => handleNavClick('/admin/dashboard')}
                  className="p-2 text-[#D4AF37] rounded-lg"
                  aria-label="Admin Dashboard"
                >
                  <ShieldCheck className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-[#F5F1E8] hover:text-[#F5D77A] focus:outline-none"
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
            className="fixed top-[64px] sm:top-[70px] left-0 right-0 z-30 bg-[#0A0A0A]/98 backdrop-blur-2xl border-b border-[#D4AF37]/20 px-6 py-8 md:hidden"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => {
                const isActive = currentPath === link.path;
                return (
                  <button
                    key={link.path}
                    onClick={() => handleNavClick(link.path)}
                    className={`text-left text-lg font-display uppercase tracking-wider font-semibold py-1 transition-colors ${
                      isActive ? 'text-[#F5D77A]' : 'text-[#8A8A8A] hover:text-[#F5F1E8]'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}

              <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                <button
                  onClick={() => handleNavClick('/contact')}
                  className="w-full py-3 rounded-xl text-center text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-[#D4AF37] via-[#F5D77A] to-[#B8860B] shadow-lg shadow-[#D4AF37]/25"
                >
                  Hire Me Now
                </button>

                {isAdminLoggedIn ? (
                  <button
                    onClick={() => handleNavClick('/admin/dashboard')}
                    className="w-full py-2.5 rounded-xl text-xs font-medium text-[#D4AF37] border border-[#D4AF37]/30 text-center"
                  >
                    Admin Dashboard
                  </button>
                ) : (
                  <button
                    onClick={() => handleNavClick('/admin/login')}
                    className="w-full py-2 text-[11px] text-[#8A8A8A] hover:text-[#D4AF37] text-center"
                  >
                    Admin Portal
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
