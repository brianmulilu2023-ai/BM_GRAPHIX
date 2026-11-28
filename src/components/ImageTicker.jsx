import React, { useMemo } from 'react';
import { Sparkles, Eye, ArrowUpRight } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';

/*
 * ImageTicker — Endless Artwork Reel
 *
 * Fully customizable via Admin Console:
 * - Admin can upload custom artwork images specifically for the ticker
 * - Admin can toggle between Custom Uploads, Published Projects, or Both
 * - Admin can control Ticker Size (Small / Medium / Large) & Section Padding
 * - Admin can customize Speed, Direction, Title and Subtitle
 */

const VIDEO_RE = /\.(mp4|webm|mov|m4v|ogv)(\?.*)?$/i;

export default function ImageTicker({ navigate }) {
  const { projects = [], openLightbox, siteSettings } = useProjects();

  const tickerEnabled = siteSettings?.tickerEnabled !== false;
  const tickerSpeedSec = typeof siteSettings?.tickerSpeed === 'number' && siteSettings.tickerSpeed >= 15
    ? siteSettings.tickerSpeed
    : 55;
  const tickerDirection = siteSettings?.tickerDirection === 'right' ? 'reverse' : 'normal';
  const tickerTitle = siteSettings?.tickerTitle || 'The Endless Masterpiece Ticker';
  const tickerSubtitle = siteSettings?.tickerSubtitle ||
    'Hover to pause · Click any card to open the full project. Live feed of every published BM Graphix work.';

  const tickerSize = siteSettings?.tickerSize || 'small';
  const tickerPadding = siteSettings?.tickerPadding || 'small';
  const tickerSource = siteSettings?.tickerSource || 'both';
  const customImages = Array.isArray(siteSettings?.tickerCustomImages) ? siteSettings.tickerCustomImages : [];

  // Responsive Card Sizing
  const cardSizeClass = {
    small: 'w-28 sm:w-36 md:w-44',
    medium: 'w-36 sm:w-48 md:w-56',
    large: 'w-44 sm:w-56 md:w-64',
  }[tickerSize] || 'w-28 sm:w-36 md:w-44';

  // Section Padding
  const sectionPaddingClass = {
    small: 'py-5 sm:py-8',
    medium: 'py-9 sm:py-12',
    large: 'py-14 sm:py-18',
  }[tickerPadding] || 'py-5 sm:py-8';

  const headerMarginClass = {
    small: 'mb-3.5 sm:mb-5',
    medium: 'mb-5 sm:mb-7',
    large: 'mb-7 sm:mb-9',
  }[tickerPadding] || 'mb-3.5 sm:mb-5';

  const trackGapClass = tickerSize === 'small' ? 'gap-2.5 sm:gap-4 py-2' : 'gap-3.5 sm:gap-5 py-3';

  /**
   * Build the unique image list:
   *   - Custom images uploaded by admin
   *   - Project thumbnails from Work page
   *   - Deduplicated by exact path
   */
  const uniqueImages = useMemo(() => {
    const list = [];
    const seen = new Set();

    // 1. Custom uploaded ticker artworks
    if ((tickerSource === 'custom' || tickerSource === 'both') && customImages.length > 0) {
      for (const c of customImages) {
        const src = c.src || c.path;
        if (!src || seen.has(src)) continue;
        seen.add(src);
        list.push({
          path: src,
          title: c.title || 'Masterpiece Artwork',
          category: c.category || 'Artwork',
          project: projects.find((p) => p.thumbnail === src || p.id === c.projectId) || {
            id: c.id || 'tk-' + Math.random(),
            title: c.title || 'Masterpiece Artwork',
            thumbnail: src,
            category: c.category || 'Artwork',
            images: [src],
          },
        });
      }
    }

    // 2. Published project thumbnails
    if (tickerSource === 'projects' || tickerSource === 'both' || list.length === 0) {
      for (const p of projects) {
        const thumb = p.thumbnail;
        if (!thumb || VIDEO_RE.test(thumb) || seen.has(thumb)) continue;
        seen.add(thumb);
        list.push({
          path: thumb,
          title: p.title,
          category: p.categoryLabel || p.category || 'Artwork',
          project: p,
        });
      }
    }

    return list;
  }, [projects, customImages, tickerSource]);

  // Open lightbox on click
  const handleClick = (item) => {
    if (item.project) openLightbox(item.project);
    else if (navigate) navigate('/work');
  };

  if (!tickerEnabled || uniqueImages.length === 0) return null;

  /*
   * Repeat the array 4× so the total track is 4 set-widths long.
   * Animation moves -25% (= 1 set width), then resets seamlessly.
   */
  const REPEAT = 4;
  const MOVE_PCT = 100 / REPEAT; // 25 %
  const speed = `${tickerSpeedSec}s`;

  const allCards = Array.from({ length: REPEAT }, (_, ci) =>
    uniqueImages.map((img, ii) => ({ ...img, _id: `c${ci}-i${ii}`, _real: ci === 0 }))
  ).flat();

  return (
    <section
      className={`relative w-full ${sectionPaddingClass} overflow-hidden select-none`}
      aria-label="Endless Artwork Ticker"
    >
      {/* ── Header ── */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${headerMarginClass} text-center space-y-2 sm:space-y-2.5`}>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161616] border border-[#D4AF37]/30 text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37]">
          <Sparkles className="w-3 h-3" />
          <span>Live Portfolio Stream</span>
        </div>
        <h2 className="font-display font-extrabold text-xl sm:text-3xl md:text-4xl text-[#FFFFFF]">
          {tickerTitle.includes('Masterpiece Ticker') ? (
            <>
              The Endless <span className="gold-gradient-text">Masterpiece Ticker</span>
            </>
          ) : (
            <span className="gold-gradient-text">{tickerTitle}</span>
          )}
        </h2>
        <p className="text-[11px] sm:text-xs md:text-sm text-[#CCCCCC] max-w-xl mx-auto leading-relaxed">
          {tickerSubtitle}
        </p>
      </div>

      {/* ── Ticker ── */}
      <div className="image-ticker-container relative">
        <div className="ticker-fade-left pointer-events-none absolute left-0 inset-y-0 w-8 sm:w-24 z-20" />
        <div className="ticker-fade-right pointer-events-none absolute right-0 inset-y-0 w-8 sm:w-24 z-20" />

        {/* Animated flex track */}
        <div
          role="list"
          className={`image-ticker-track flex items-stretch ${trackGapClass}`}
          style={{
            width: 'max-content',
            willChange: 'transform',
            animationName: 'bm-ticker-scroll',
            animationDuration: speed,
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            animationDirection: tickerDirection,
          }}
        >
          {allCards.map((item) => (
            <div
              key={item._id}
              role={item._real ? 'listitem' : 'presentation'}
              aria-hidden={item._real ? undefined : 'true'}
              tabIndex={item._real ? 0 : -1}
              onClick={() => handleClick(item)}
              onKeyDown={(e) => e.key === 'Enter' && handleClick(item)}
              className={`${cardSizeClass} aspect-[3/4] flex-shrink-0 relative rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-neutral-950 transition-all duration-500 group cursor-pointer hover:border-[#D4AF37] hover:shadow-[0_12px_30px_rgba(212,175,55,0.25)]`}
            >
              {/* Artwork image */}
              <img
                src={item.path}
                alt={item._real ? item.title : ''}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Overlay — dark gradient with pure white contrast */}
              <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-3.5 bg-gradient-to-t from-black/95 via-black/65 to-transparent flex flex-col justify-end translate-y-1 sm:translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-widest text-[#D4AF37] block truncate">
                  {item.category}
                </span>
                <h3 className="font-display font-bold text-[11px] sm:text-xs md:text-sm text-[#FFFFFF] truncate leading-tight mt-0.5">
                  {item.title}
                </h3>
                <div className="flex items-center justify-between pt-1.5 sm:pt-2 mt-1.5 sm:mt-2 border-t border-white/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-[9px] sm:text-[10px] text-[#F5D77A] font-semibold flex items-center gap-1">
                    <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    View Artwork
                  </span>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#D4AF37] flex items-center justify-center text-black shadow">
                    <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exact keyframe — moves one set-width (25% of 4-copy track) */}
      <style>{`
        .image-ticker-container:hover .image-ticker-track {
          animation-play-state: paused !important;
        }
        @keyframes bm-ticker-scroll {
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(-${MOVE_PCT}%, 0, 0); }
        }
      `}</style>
    </section>
  );
}
