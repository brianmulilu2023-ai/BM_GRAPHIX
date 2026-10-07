import React, { useEffect, useState } from 'react';

export default function NairobiBackground() {
  const [offsetY, setOffsetY] = useState(0);

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
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Parallax Nairobi Skyline Layer */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-75 ease-out scale-105"
        style={{
          backgroundImage: "url('/assets/nairobi-cbd.jpg')",
          transform: `translateY(-${offsetY}px)`,
          opacity: 0.14,
          filter: 'blur(3px) brightness(0.9) contrast(1.1)',
        }}
      />

      {/* Atmospheric Gold Radial Gradient Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(212, 175, 55, 0.15), transparent 70%), radial-gradient(ellipse 60% 40% at 100% 50%, rgba(184, 134, 11, 0.08), transparent 60%)'
        }}
      />

      {/* Deep Near-Black Base Vignette */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/70 via-[#0A0A0A]/90 to-[#0A0A0A]"
      />

      {/* Subtle Film Grain Texture */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-screen"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
}
