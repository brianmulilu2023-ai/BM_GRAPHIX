import React, { useState } from 'react';
import { ArrowUp, Heart, Mail, Phone, MessageCircle, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Footer({ navigate }) {
  const [secretClicks, setSecretClicks] = useState(0);
  const { isDark } = useTheme();

  const headingColor = 'var(--bm-heading, ' + (isDark ? '#FFFFFF' : '#250C00') + ')';
  const bodyColor = 'var(--bm-body, ' + (isDark ? '#FFFFFF' : '#250C00') + ')';
  const secondaryTextColor = 'var(--bm-secondary-text, ' + (isDark ? '#FECD00' : '#6B3E00') + ')';
  const accentColor = isDark ? 'var(--bm-primary, #E2AA00)' : 'var(--bm-secondary, #8C5800)';
  const borderColor = 'var(--bm-border, ' + (isDark ? '#6B3E00' : '#C38C00') + ')';
  const iconColor = 'var(--bm-icon, ' + (isDark ? '#E2AA00' : '#8C5800') + ')';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSecretDotClick = () => {
    setSecretClicks((prev) => {
      const next = prev + 1;
      if (next >= 3) {
        navigate('/admin');
        return 0;
      }
      return next;
    });
    // Reset clicks after 2.5s
    setTimeout(() => setSecretClicks(0), 2500);
  };

  return (
    <footer
      className="relative pt-16 pb-12 overflow-hidden transition-colors duration-300"
      style={{
        backgroundColor: isDark ? '#080808' : '#FFF9E8',
        borderTop: `1px solid ${borderColor}`,
        color: bodyColor,
      }}
    >
      {/* Subtle top gold gradient divider line */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px]"
        style={{
          background: `linear-gradient(to right, transparent, var(--bm-primary, #E2AA00), transparent)`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2 space-y-5">
            <div className="flex items-center gap-3.5">
              <div className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex-shrink-0">
                <img
                  src="/assets/logo/BM_OFFICIAL_LOGO.png"
                  alt="BM Graphix"
                  className="w-full h-full object-contain filter drop-shadow-[0_6px_22px_rgba(226,170,0,0.35)]"
                />
              </div>
              <div>
                <span
                  className="block font-display font-extrabold text-2xl sm:text-3xl tracking-wider leading-tight"
                  style={{ color: headingColor }}
                >
                  BM GRAPHIX
                </span>
                <span
                  className="block text-xs uppercase tracking-[0.25em] font-semibold mt-1"
                  style={{ color: accentColor }}
                >
                  Motion & Visual Art
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed max-w-md" style={{ color: bodyColor }}>
              Designs that move people. Crafting bespoke visual identities, dynamic event posters, high-energy promotional campaigns, and broadcast motion graphics in Nairobi, Kenya.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://wa.me/254798405726"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center transition duration-300"
                style={{
                  backgroundColor: isDark ? '#121212' : '#FFFFFF',
                  border: `1px solid ${borderColor}`,
                  color: iconColor,
                }}
                aria-label="WhatsApp BM Graphix"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="mailto:brianmulilu2023@gmail.com"
                className="w-10 h-10 rounded-full flex items-center justify-center transition duration-300"
                style={{
                  backgroundColor: isDark ? '#121212' : '#FFFFFF',
                  border: `1px solid ${borderColor}`,
                  color: iconColor,
                }}
                aria-label="Email BM Graphix"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="tel:+254798405726"
                className="w-10 h-10 rounded-full flex items-center justify-center transition duration-300"
                style={{
                  backgroundColor: isDark ? '#121212' : '#FFFFFF',
                  border: `1px solid ${borderColor}`,
                  color: iconColor,
                }}
                aria-label="Call Brian Mulilu"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation & Services */}
          <div>
            <h4
              className="text-xs uppercase tracking-[0.2em] font-semibold mb-5"
              style={{ color: headingColor }}
            >
              Explore
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { label: 'Home', path: '/' },
                { label: 'Portfolio & Gallery', path: '/work' },
                { label: 'Creative Services', path: '/services' },
                { label: 'About Brian', path: '/about' },
                { label: 'Contact & Inquiries', path: '/contact' },
              ].map((item) => (
                <li key={item.path}>
                  <button
                    onClick={() => { navigate(item.path); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="transition-colors"
                    style={{ color: bodyColor }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = accentColor; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = bodyColor; }}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Direct Contact */}
          <div>
            <h4
              className="text-xs uppercase tracking-[0.2em] font-semibold mb-5"
              style={{ color: headingColor }}
            >
              Direct Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <span className="block text-xs uppercase tracking-wider mb-1 font-medium" style={{ color: secondaryTextColor }}>
                  Phone / WhatsApp
                </span>
                <a
                  href="tel:+254798405726"
                  className="transition font-medium"
                  style={{ color: headingColor }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = accentColor; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = headingColor; }}
                >
                  +254 798 405 726
                </a>
              </li>
              <li>
                <span className="block text-xs uppercase tracking-wider mb-1 font-medium" style={{ color: secondaryTextColor }}>
                  Email
                </span>
                <a
                  href="mailto:brianmulilu2023@gmail.com"
                  className="transition font-medium break-all"
                  style={{ color: headingColor }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = accentColor; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = headingColor; }}
                >
                  brianmulilu2023@gmail.com
                </a>
              </li>
              <li>
                <span className="block text-xs uppercase tracking-wider mb-1 font-medium" style={{ color: secondaryTextColor }}>
                  Location
                </span>
                <span style={{ color: headingColor }}>Nairobi CBD, Kenya</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs"
          style={{ borderTop: `1px solid ${borderColor}` }}
        >
          <div className="flex items-center gap-4 flex-wrap justify-center md:justify-start">
            <div
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs transition group"
              style={{
                backgroundColor: isDark ? '#121212' : '#FFFFFF',
                border: `1px solid ${borderColor}`,
              }}
            >
              <span className="font-medium" style={{ color: bodyColor }}>
                &copy; {new Date().getFullYear()} BM Graphix. All rights reserved.
              </span>
            </div>

            <p className="flex items-center gap-1.5 text-xs" style={{ color: secondaryTextColor }}>
              <span
                onClick={handleSecretDotClick}
                className="inline-block mx-0.5 select-none cursor-default transition"
                style={{ color: accentColor }}
                title=""
              >
                •
              </span>
              <span>Crafted with</span>
              <Heart className="w-3.5 h-3.5" style={{ color: accentColor, fill: accentColor }} />
              <span>in Nairobi</span>
            </p>
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            <button
              onClick={scrollToTop}
              className="w-8 h-8 rounded-full flex items-center justify-center transition"
              style={{
                backgroundColor: isDark ? '#121212' : '#FFFFFF',
                border: `1px solid ${borderColor}`,
                color: iconColor,
              }}
              aria-label="Scroll back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
