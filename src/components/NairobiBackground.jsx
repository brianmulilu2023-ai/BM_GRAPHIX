import React, { useEffect, useState } from 'react';
import { useProjects } from '../context/ProjectContext';

export default function NairobiBackground({ currentPath = '/' }) {
  const [offsetY, setOffsetY] = useState(0);
  const [isDark, setIsDark] = useState(true);
  const { siteSettings } = useProjects();

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

  // Determine active page context
  const activePath = (currentPath || (typeof window !== 'undefined' ? window.location.pathname : '/'))
    .toLowerCase()
    .replace(/\/$/, '') || '/';
  const isWorkPage = activePath === '/work' || activePath === '/portfolio' || activePath === '/gallery';
  const isHomePage = activePath === '/';

  // Per-page visibility, clarity & glow configuration
  let skylineOpacityRatio = 0.14;
  let clarityPercentage = 35; // 0 to 100%
  let glowRatio = 0.70;
  let overlayDepthRatio = 0.85;

  if (isWorkPage) {
    skylineOpacityRatio = typeof siteSettings?.workNairobiSkylineOpacity === 'number'
      ? siteSettings.workNairobiSkylineOpacity / 100
      : 0.55;
    clarityPercentage = typeof siteSettings?.workNairobiClarity === 'number'
      ? siteSettings.workNairobiClarity
      : 85;
    glowRatio = typeof siteSettings?.workGoldGlow === 'number'
      ? siteSettings.workGoldGlow / 100
      : 0.65;
    overlayDepthRatio = typeof siteSettings?.workDarkOverlay === 'number'
      ? siteSettings.workDarkOverlay / 100
      : 0.70;
  } else if (isHomePage) {
    skylineOpacityRatio = typeof siteSettings?.nairobiSkylineOpacity === 'number'
      ? siteSettings.nairobiSkylineOpacity / 100
      : 0.14;
    clarityPercentage = 40;
    glowRatio = typeof siteSettings?.goldGlowIntensity === 'number'
      ? siteSettings.goldGlowIntensity / 100
      : 0.70;
    overlayDepthRatio = typeof siteSettings?.heroDarkOverlay === 'number'
      ? siteSettings.heroDarkOverlay / 100
      : 0.85;
  } else {
    skylineOpacityRatio = typeof siteSettings?.globalNairobiSkylineOpacity === 'number'
      ? siteSettings.globalNairobiSkylineOpacity / 100
      : 0.20;
    clarityPercentage = 50;
    glowRatio = typeof siteSettings?.globalGoldGlow === 'number'
      ? siteSettings.globalGoldGlow / 100
      : 0.60;
    overlayDepthRatio = typeof siteSettings?.globalDarkOverlay === 'number'
      ? siteSettings.globalDarkOverlay / 100
      : 0.80;
  }

  // Allow up to 100% full clarity and opacity on Work page or as dialed by admin
  const currentSkylineOpacity = isDark
    ? skylineOpacityRatio
    : Math.min(1.0, skylineOpacityRatio * (isWorkPage ? 0.95 : 0.6));

  // Clarity calculation: at 100% clarity, blur becomes 0px (100% crystal clear Nairobi peak!)
  const blurPx = Math.max(0, ((100 - clarityPercentage) / 100) * 4).toFixed(1);
  const contrastMultiplier = (1.0 + (clarityPercentage / 100) * 0.25).toFixed(2);
  const brightnessMultiplier = isDark
    ? (0.88 + (clarityPercentage / 100) * 0.22).toFixed(2)
    : (1.02 + (clarityPercentage / 100) * 0.12).toFixed(2);
  const filterStyle = `blur(${blurPx}px) brightness(${brightnessMultiplier}) contrast(${contrastMultiplier})`;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
      style={{ transition: 'background 0.5s ease' }}
    >
      {/* Parallax Nairobi Skyline Layer with dynamic opacity and 100% crystal clear capability */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{
          backgroundImage: "url('/assets/nairobi-cbd.jpg')",
          transform: `translateY(-${offsetY}px)`,
          opacity: currentSkylineOpacity,
          filter: filterStyle,
          transition: 'opacity 0.4s ease, filter 0.4s ease',
        }}
      />

      {/* Atmospheric Gold Radial Gradient Overlay with dynamic glow */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? `radial-gradient(ellipse 80% 50% at 50% -10%, rgba(212, 175, 55, ${0.15 * glowRatio}), transparent 70%), radial-gradient(ellipse 60% 40% at 100% 50%, rgba(184, 134, 11, ${0.08 * glowRatio}), transparent 60%)`
            : `radial-gradient(ellipse 80% 50% at 50% -10%, rgba(212, 175, 55, ${0.08 * glowRatio}), transparent 70%), radial-gradient(ellipse 60% 40% at 100% 50%, rgba(184, 134, 11, ${0.04 * glowRatio}), transparent 60%)`,
          transition: 'background 0.4s ease',
        }}
      />

      {/* Base vignette — page sensitive to let Nairobi Peak shine through on Work page */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? isWorkPage
              ? `linear-gradient(to bottom, rgba(10,10,10,${0.25 + (overlayDepthRatio * 0.55)}) 0%, rgba(10,10,10,${0.45 + (overlayDepthRatio * 0.45)}) 50%, #0A0A0A 100%)`
              : 'linear-gradient(to bottom, rgba(10,10,10,0.70) 0%, rgba(10,10,10,0.90) 50%, #0A0A0A 100%)'
            : isWorkPage
              ? `linear-gradient(to bottom, rgba(245,240,232,${0.25 + (overlayDepthRatio * 0.55)}) 0%, rgba(245,240,232,${0.45 + (overlayDepthRatio * 0.45)}) 50%, #F5F0E8 100%)`
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
