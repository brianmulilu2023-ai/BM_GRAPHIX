import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';

/* ─────────────────────────────────────────────
   Typewriter hook
───────────────────────────────────────────── */
function useTypewriter(words, typeSpeed = 80, deleteSpeed = 45, pauseMs = 2400) {
  const [displayed, setDisplayed] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [phase, setPhase] = useState('typing');
  const t = useRef(null);

  useEffect(() => {
    const word = words[wordIdx];
    const tick = () => {
      if (phase === 'typing') {
        setDisplayed((prev) => {
          const next = word.slice(0, prev.length + 1);
          if (next === word) setPhase('pausing');
          return next;
        });
      } else if (phase === 'pausing') {
        t.current = setTimeout(() => setPhase('deleting'), pauseMs);
        return;
      } else {
        setDisplayed((prev) => {
          const next = prev.slice(0, prev.length - 1);
          if (next === '') { setWordIdx((i) => (i + 1) % words.length); setPhase('typing'); }
          return next;
        });
      }
    };
    const delay = phase === 'typing' ? typeSpeed : phase === 'deleting' ? deleteSpeed : 0;
    t.current = setTimeout(tick, delay);
    return () => clearTimeout(t.current);
  }, [displayed, phase, wordIdx, words, typeSpeed, deleteSpeed, pauseMs]);

  return displayed;
}

/* ─────────────────────────────────────────────
   Kibochi-style sliding image column
   alternating: odd columns slide UP, even slide DOWN
───────────────────────────────────────────── */
const ALL_BG_IMAGES = [
  '/assets/projects/zenia.jpeg',
  '/assets/projects/kasyoki.jpeg',
  '/assets/projects/cleo.jpeg',
  '/assets/projects/event-mb.jpeg',
  '/assets/projects/manipulation.jpeg',
  '/assets/projects/sharon.jpeg',
  '/assets/projects/joyce.jpeg',
  '/assets/projects/lydia.jpeg',
  '/assets/projects/cosmas.jpeg',
  '/assets/projects/paul.jpeg',
  '/assets/projects/music-live.jpeg',
  '/assets/projects/conference-summit.jpeg',
  '/assets/projects/youth-vibes.jpeg',
  '/assets/projects/worship-night.jpeg',
  '/assets/projects/event-gala.jpeg',
  '/assets/projects/creative-flyer.jpeg',
];

// Split images into N columns, repeating to fill
function getColumn(colIdx, total, perCol) {
  const imgs = [];
  for (let i = 0; i < perCol; i++) {
    imgs.push(ALL_BG_IMAGES[(colIdx * 3 + i) % ALL_BG_IMAGES.length]);
  }
  // Duplicate for seamless loop
  return [...imgs, ...imgs];
}

function ImageColumn({ images, direction = 'up', speed = 40, delay = 0 }) {
  return (
    <div className="hero-img-column" style={{ animationDelay: `${delay}s` }}>
      <div
        className={`hero-img-track hero-img-track--${direction}`}
        style={{ '--col-speed': `${speed}s` }}
      >
        {images.map((src, i) => (
          <div key={i} className="hero-img-cell">
            <img src={src} alt="" loading="lazy" className="hero-img-cell-img" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Floating skill chip
───────────────────────────────────────────── */
function FloatingChip({ label, emoji, style, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
      transition={{
        opacity: { duration: 0.5, delay },
        scale: { duration: 0.5, delay },
        y: { duration: 3.5, delay: delay + 0.5, repeat: Infinity, ease: 'easeInOut' },
      }}
      className="hero-chip"
      style={style}
    >
      {emoji && <span>{emoji}</span>}
      {label}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Trust avatars
───────────────────────────────────────────── */
const TRUST_IMGS = [
  '/assets/projects/cleo.jpeg',
  '/assets/projects/kasyoki.jpeg',
  '/assets/projects/paul.jpeg',
  '/assets/projects/joyce.jpeg',
];

/* ─────────────────────────────────────────────
   Showcase card (right side) — Dynamic Admin Customizable
───────────────────────────────────────────── */
const DEFAULT_SHOWCASE = [
  { id: 'sc-1', src: '/assets/projects/zenia.jpeg',      label: 'Motion Identity' },
  { id: 'sc-2', src: '/assets/projects/kasyoki.jpeg',    label: 'Concert Key Art' },
  { id: 'sc-3', src: '/assets/projects/cleo.jpeg',       label: 'Fashion Campaign' },
  { id: 'sc-4', src: '/assets/projects/event-mb.jpeg',   label: 'Event Promo' },
  { id: 'sc-5', src: '/assets/projects/manipulation.jpeg', label: 'Digital Art' },
];

function ShowcaseCard() {
  const { siteSettings } = useProjects();
  const showcaseList = useMemo(() => {
    if (Array.isArray(siteSettings?.heroShowcaseItems) && siteSettings.heroShowcaseItems.length > 0) {
      return siteSettings.heroShowcaseItems;
    }
    return DEFAULT_SHOWCASE;
  }, [siteSettings?.heroShowcaseItems]);

  const rotationSpeed = typeof siteSettings?.heroShowcaseInterval === 'number' && siteSettings.heroShowcaseInterval >= 1500
    ? siteSettings.heroShowcaseInterval
    : 3200;

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (showcaseList.length <= 1) return;
    const t = setInterval(() => setCurrent((i) => (i + 1) % showcaseList.length), rotationSpeed);
    return () => clearInterval(t);
  }, [showcaseList.length, rotationSpeed]);

  const activeIndex = current % (showcaseList.length || 1);
  const activeSlide = showcaseList[activeIndex] || showcaseList[0];
  if (!activeSlide) return null;

  return (
    <div className="hero-showcase-card">
      <div className="hero-card-beam" />
      <div className="hero-card-image-wrap">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeSlide.id || activeSlide.src || activeIndex}
            src={activeSlide.src}
            alt={activeSlide.label || 'BM Graphix Masterpiece'}
            initial={{ opacity: 0, scale: 1.07 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.65, ease: 'easeInOut' }}
            className="hero-card-img"
          />
        </AnimatePresence>
        <div className="hero-card-overlay" />
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide.id || activeSlide.label || activeIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
            className="hero-card-label"
          >
            <span className="hero-card-label-dot" />
            {activeSlide.label}
          </motion.div>
        </AnimatePresence>
      </div>
      {showcaseList.length > 1 && (
        <div className="hero-card-dots">
          {showcaseList.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`hero-card-dot${i === activeIndex ? ' hero-card-dot--active' : ''}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN HERO COMPONENT
═══════════════════════════════════════════ */
const COLUMNS = [
  { dir: 'up',   speed: 38, delay: 0   },
  { dir: 'down', speed: 44, delay: 0.8 },
  { dir: 'up',   speed: 36, delay: 1.5 },
  { dir: 'down', speed: 42, delay: 0.3 },
  { dir: 'up',   speed: 40, delay: 1.1 },
  { dir: 'down', speed: 35, delay: 0.6 },
];

export default function HeroSection({ navigate }) {
  const rotatingWords = ['Motion Graphics', 'Brand Identity', 'Poster Art', 'Video Animation', 'Broadcast Design'];
  const typed = useTypewriter(rotatingWords);

  return (
    <section className="hero-section">

      {/* ══ NAIROBI CBD SKYLINE BACKDROP — HIGH CLARITY & VISIBILITY ══ */}
      <div className="hero-nairobi-backdrop" aria-hidden="true">
        <img
          src="/assets/nairobi-cbd.jpg"
          alt=""
          className="hero-nairobi-img"
        />
        <div className="hero-nairobi-overlay" />
      </div>

      {/* ══ KIBOCHI-STYLE SCROLLING IMAGE GRID BACKGROUND ══ */}
      <div className="hero-bg-grid-wrap" aria-hidden="true">
        {COLUMNS.map((col, i) => (
          <ImageColumn
            key={i}
            images={getColumn(i, COLUMNS.length, 5)}
            direction={col.dir}
            speed={col.speed}
            delay={col.delay}
          />
        ))}
        {/* Dark overlay — gradient from dark left to transparent right */}
        <div className="hero-bg-overlay" />
        {/* Extra gold ambient glow */}
        <div className="hero-bg-orb hero-bg-orb--gold" />
      </div>

      {/* ══ FOREGROUND CONTENT ══ */}
      <div className="hero-inner">

        {/* ── LEFT COLUMN ── */}
        <div className="hero-left">

          {/* Brand Crest & Availability badge */}
          <div className="flex items-center gap-3.5">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 shrink-0"
            >
              <img
                src="/assets/logo/BM_OFFICIAL_LOGO.png"
                alt="BM Graphix Official Logo"
                className="w-full h-full object-contain filter drop-shadow-[0_4px_16px_rgba(212,175,55,0.3)]"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="hero-avail-badge"
            >
              <span className="hero-avail-dot" />
              Available for Projects
            </motion.div>
          </div>



          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.15 }}
            className="hero-headline"
          >
            Visual Art That <br />
            <span className="gold-gradient-text">Moves People.</span>
          </motion.h1>

          {/* Typewriter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hero-typewriter-row"
          >
            <span className="hero-typewriter-prefix">Specialising in</span>
            <span className="hero-typewriter-text">
              {typed}
              <span className="hero-cursor">|</span>
            </span>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="hero-subtitle"
          >
            Senior graphic designer &amp; motion artist based in Nairobi, Kenya — crafting unforgettable visual identities, iconic poster art, and cinema-grade motion graphics for visionary brands across East Africa.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="hero-cta-row"
          >
            <button onClick={() => navigate('/work')} className="hero-btn-primary group">
              <span>View My Work</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button onClick={() => navigate('/contact')} className="hero-btn-secondary">
              <span>Hire Me</span>
              <ArrowUpRight className="w-4 h-4 text-[#D4AF37]" />
            </button>
          </motion.div>

          {/* Trust bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="hero-trust-bar"
          >
            <div className="hero-trust-avatars">
              {TRUST_IMGS.map((src, i) => (
                <img key={i} src={src} alt="client" className="hero-trust-avatar"
                  style={{ zIndex: TRUST_IMGS.length - i }} />
              ))}
            </div>
            <div className="hero-trust-text">
              <span className="hero-trust-count">40+ Brands</span>
              <span className="hero-trust-sub">trusted across East Africa</span>
            </div>
          </motion.div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
          className="hero-right"
        >
          <FloatingChip label="After Effects" emoji="✦" delay={0.7}
            style={{ top: '8%', left: '-10%' }} />
          <FloatingChip label="Motion Graphics" emoji="🎬" delay={0.9}
            style={{ top: '18%', right: '-8%' }} />
          <FloatingChip label="5yr+ XP" emoji="⚡" delay={1.1}
            style={{ bottom: '22%', left: '-12%' }} />
          <FloatingChip label="Cinema 4D" emoji="🎨" delay={1.3}
            style={{ bottom: '10%', right: '-6%' }} />
          <ShowcaseCard />
        </motion.div>
      </div>

      {/* ══ SCROLL CUE ══ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.6 }}
        className="hero-scroll-cue"
      >
        <div className="hero-scroll-line" />
        <span>Scroll to explore</span>
      </motion.div>
    </section>
  );
}
