import React, { useMemo } from 'react';
import { Sparkles, Eye, ArrowUpRight } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';

/*
 * ImageTicker — Endless Artwork Reel
 *
 * SOURCE: Only the published project thumbnails from the Work page.
 *         No static gallery fallback. No mediaItems. No hardcoded paths.
 *
 * LOOP MATH:
 *   We render REPEAT copies of the unique image list side-by-side.
 *   CSS animates the whole track left by (100 / REPEAT)% — exactly one copy width.
 *   Because one copy is always wider than the viewport, the user never
 *   simultaneously sees two copies of the same image.
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

  /**
   * Build the unique image list:
   *   - Only published project thumbnails (the same images shown on the Work page)
   *   - Skip video files used as thumbnails
   *   - Deduplicate by EXACT path — if two projects share the same thumbnail file, show it once
   */
  const uniqueImages = useMemo(() => {
    const seen = new Set();
    const list = [];
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
    return list;
  }, [projects]);

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
      className="relative w-full py-12 sm:py-16 overflow-hidden select-none"
      aria-label="Endless Artwork Ticker"
    >
      {/* ── Header ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8 text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#161616] border border-[#D4AF37]/30 text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Live Portfolio Stream</span>
        </div>
        <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-[#F5F1E8]">
          {tickerTitle.includes('Masterpiece Ticker') ? (
            <>
              The Endless <span className="gold-gradient-text">Masterpiece Ticker</span>
            </>
          ) : (
            <span className="gold-gradient-text">{tickerTitle}</span>
          )}
        </h2>
        <p className="text-xs sm:text-sm text-[#8A8A8A] max-w-xl mx-auto">
          {tickerSubtitle}
        </p>
      </div>

      {/* ── Ticker ── */}
      <div className="image-ticker-container relative">
        <div className="ticker-fade-left  pointer-events-none absolute left-0  inset-y-0 w-12 sm:w-32 z-20" />
        <div className="ticker-fade-right pointer-events-none absolute right-0 inset-y-0 w-12 sm:w-32 z-20" />

        {/* Animated flex track */}
        <div
          role="list"
          className="image-ticker-track flex items-stretch gap-3.5 sm:gap-5 py-4"
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
              className="w-40 sm:w-56 md:w-64 aspect-[3/4] flex-shrink-0 relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 shadow-xl bg-neutral-950 transition-all duration-500 group cursor-pointer hover:border-[#D4AF37] hover:shadow-[0_15px_35px_rgba(212,175,55,0.25)]"
            >
              {/* Artwork image */}
              <img
                src={item.path}
                alt={item._real ? item.title : ''}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Overlay — shown cleanly on all cards */}
              <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex flex-col justify-end translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#D4AF37] block truncate">
                  {item.category}
                </span>
                <h3 className="font-display font-bold text-xs sm:text-sm text-[#F5F1E8] truncate leading-tight mt-0.5">
                  {item.title}
                </h3>
                <div className="flex items-center justify-between pt-2 mt-2 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-[10px] text-[#F5D77A] font-medium flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    View Project
                  </span>
                  <div className="w-5 h-5 rounded-full bg-[#D4AF37] flex items-center justify-center text-black shadow">
                    <ArrowUpRight className="w-3 h-3" />
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
