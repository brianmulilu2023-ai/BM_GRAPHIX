import React, { useEffect, useRef, useState } from 'react';
import { useProjects } from '../context/ProjectContext';

/* Lightweight canvas-based floating gold dust particles */
export default function GoldParticles({ currentPath = '/' }) {
  const canvasRef = useRef(null);
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

  const activePath = (currentPath || (typeof window !== 'undefined' ? window.location.pathname : '/'))
    .toLowerCase()
    .replace(/\/$/, '') || '/';
  const isWorkPage = activePath === '/work' || activePath === '/portfolio' || activePath === '/gallery';

  const particlesVisibility = isWorkPage
    ? (typeof siteSettings?.workParticles === 'number' ? siteSettings.workParticles / 100 : 0.50)
    : (typeof siteSettings?.particlesVisibility === 'number' ? siteSettings.particlesVisibility / 100 : 0.55);

  const brandPrimary = siteSettings?.brandPrimaryColor || '#D4AF37';
  const brandLight = siteSettings?.brandSecondaryColor || '#F5D77A';
  const brandDark = siteSettings?.brandDarkColor || '#B8860B';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W = (canvas.width  = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    let raf;

    const baseCount = isDark ? 55 : 35;
    const COUNT = Math.max(5, Math.round(baseCount * (particlesVisibility / 0.55)));

    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.28,
      vy: -(Math.random() * 0.35 + 0.08),
      alpha: Math.random() * 0.5 + 0.1,
      fade: (Math.random() * 0.006 + 0.002) * (Math.random() < 0.5 ? 1 : -1),
    }));

    const DARK_COLORS  = [brandPrimary, brandLight, brandDark, '#FFD700', '#FFF8DC'];
    const LIGHT_COLORS = [brandPrimary, brandDark, brandLight, '#C89F2A', '#D4AF37'];
    const COLORS = isDark ? DARK_COLORS : LIGHT_COLORS;

    function draw() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += p.fade;
        if (p.alpha <= 0.05 || p.alpha >= 0.65) p.fade *= -1;
        if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
        if (p.x < -5) p.x = W + 5;
        if (p.x > W + 5) p.x = -5;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha * (particlesVisibility / 0.55));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = COLORS[i % COLORS.length];
        ctx.shadowBlur = isDark ? 8 : 4;
        ctx.shadowColor = brandPrimary;
        ctx.fill();
        ctx.restore();
      });
      raf = requestAnimationFrame(draw);
    }

    draw();

    const onResize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, [isDark, particlesVisibility, brandPrimary, brandLight, brandDark]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
        opacity: (isDark ? 0.55 : 0.3) * (particlesVisibility / 0.55),
        transition: 'opacity 0.4s ease',
      }}
      aria-hidden="true"
    />
  );
}
