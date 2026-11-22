import React, { useEffect, useState } from 'react';

export default function NairobiBackground() {
  const [offsetY, setOffsetY] = useState(0);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Track theme changes
    const checkTheme = () => setIsDark(!document.documentElement.classList.contains('light'));
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setOffsetY(window.scrollY * 0.15);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true"
      style={{ transition: 'background 0.5s ease' }}>

      {/* Parallax Nairobi Skyline Layer */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{
          backgroundImage: "url('/assets/nairobi-cbd.jpg')",
          transform: `translateY(-${offsetY}px)`,
          opacity: isDark ? 0.14 : 0.07,
          filter: isDark
            ? 'blur(3px) brightness(0.9) contrast(1.1)'
            : 'blur(4px) brightness(1.05) saturate(0.7)',
          transition: 'opacity 0.5s ease, filter 0.5s ease',
        }}
      />

      {/* Atmospheric Gold Radial Gradient Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(212, 175, 55, 0.15), transparent 70%), radial-gradient(ellipse 60% 40% at 100% 50%, rgba(184, 134, 11, 0.08), transparent 60%)'
            : 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(212, 175, 55, 0.08), transparent 70%), radial-gradient(ellipse 60% 40% at 100% 50%, rgba(184, 134, 11, 0.04), transparent 60%)',
          transition: 'background 0.5s ease',
        }}
      />

      {/* Base vignette — dark to bg color */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? 'linear-gradient(to bottom, rgba(10,10,10,0.70) 0%, rgba(10,10,10,0.90) 50%, #0A0A0A 100%)'
            : 'linear-gradient(to bottom, rgba(245,240,232,0.60) 0%, rgba(245,240,232,0.88) 50%, #F5F0E8 100%)',
          transition: 'background 0.5s ease',
        }}
      />

      {/* Subtle Film Grain Texture */}
      <div
        className="absolute inset-0 mix-blend-screen"
        style={{
          opacity: isDark ? 0.03 : 0.015,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
