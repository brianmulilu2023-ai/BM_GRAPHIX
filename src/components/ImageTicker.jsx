import React, { useMemo } from 'react';
import { Sparkles, Eye, ArrowUpRight } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';

// Map binary/visual duplicate files to their canonical primary image
const CANONICAL_PATH_MAP = {
  // music-live and WhatsApp versions are 100% identical to conference-summit
  '/assets/projects/music-live.jpeg': '/assets/projects/conference-summit.jpeg',
  '/assets/projects/WhatsApp Image 2026-10-05 at 11.51.18.jpeg': '/assets/projects/conference-summit.jpeg',
  '/assets/projects/WhatsApp Image 2026-10-05 at 11.51.20.jpeg': '/assets/projects/conference-summit.jpeg',
  // Identical duplicate files with WhatsApp filenames
  '/assets/projects/WhatsApp Image 2026-10-05 at 11.51.21.jpeg': '/assets/projects/album-launch.jpeg',
  '/assets/projects/WhatsApp Image 2026-10-05 at 11.51.19.jpeg': '/assets/projects/church-service.jpeg',
  '/assets/projects/WhatsApp Image 2026-10-05 at 11.51.23.jpeg': '/assets/projects/creative-flyer.jpeg',
  '/assets/projects/WhatsApp Image 2026-10-05 at 11.51.16.jpeg': '/assets/projects/event-gala.jpeg',
  '/assets/projects/WhatsApp Image 2026-10-05 at 11.51.16.jpeg mb.jpeg': '/assets/projects/event-mb.jpeg',
  '/assets/projects/WhatsApp Image 2026-10-05 at 11.51.19.jpeg nku.jpeg': '/assets/projects/worship-night.jpeg',
  '/assets/projects/WhatsApp Image 2026-10-05 at 11.51.22.jpeg': '/assets/projects/youth-vibes.jpeg',
};

// Exclude UI assets, company logos, headshots, and workspace photos from the portfolio artwork ticker
const EXCLUDED_PATTERNS = [
  /BM_LOGO/i,
  /BM_OFFICIAL/i,
  /BM_ICON/i,
  /BM_BLCK/i,
  /\/assets\/logo\//i,
  /brian-mulilu/i,
  /designer-photo/i,
  /nairobi-cbd/i,
  /lab\.jpg/i,
  /lap\.jpg/i,
  /\.pdf$/i
];

// Clean canonical static gallery of all unique portfolio artwork pieces
const STATIC_GALLERY_IMAGES = [
  { path: '/assets/projects/zenia.jpeg', title: 'Zenia Sound Fest — 3D Motion Identity', category: 'Animations & Motion' },
  { path: '/assets/projects/cleo.jpeg', title: 'Cleo Couture — High Fashion Brand Campaign', category: 'Poster & Flyer Design' },
  { path: '/assets/projects/conference-summit.jpeg', title: 'Nairobi Leadership Summit Keynote Poster', category: 'Poster & Flyer Design' },
  { path: '/assets/projects/manipulation.jpeg', title: 'Celestial Echoes — Digital Photo Manipulation', category: 'Logos & Branding' },
  { path: '/assets/projects/paul.jpeg', title: 'Paul Live Concert & Tribute Poster', category: 'Poster & Flyer Design' },
  { path: '/assets/projects/youth-vibes.jpeg', title: 'Youth Ignition Fest 2024 Campaign', category: 'Poster & Flyer Design' },
  { path: '/assets/projects/sharon.jpeg', title: 'Sharon High Fashion Editorial', category: 'Poster & Flyer Design' },
  { path: '/assets/projects/event-mb.jpeg', title: 'Midnight Beats Neon Gala Poster', category: 'Poster & Flyer Design' },
  { path: '/assets/projects/event-gala.jpeg', title: 'Golden Aura Awards Night Flyer', category: 'Poster & Flyer Design' },
  { path: '/assets/projects/creative-flyer.jpeg', title: 'Creative Brand Masterclass Flyer', category: 'Poster & Flyer Design' },
  { path: '/assets/projects/worship-night.jpeg', title: 'Aura of Grace Worship Experience', category: 'Poster & Flyer Design' },
  { path: '/assets/projects/church-service.jpeg', title: 'Sunday Celebration Worship Flyer', category: 'Poster & Flyer Design' },
  { path: '/assets/projects/album-launch.jpeg', title: 'Album Launch Key Art Artwork', category: 'Poster & Flyer Design' },
  { path: '/assets/projects/cosmas.jpeg', title: 'Cosmas Live Tour Poster', category: 'Poster & Flyer Design' },
  { path: '/assets/projects/kasyoki.jpeg', title: 'Kasyoki Cultural Identity Series', category: 'Logos & Branding' },
  { path: '/assets/projects/lydia.jpeg', title: 'Lydia Portrait Visual Concept', category: 'Poster & Flyer Design' },
  { path: '/assets/projects/joyce.jpeg', title: 'Joyce Gospel Concert Artwork', category: 'Poster & Flyer Design' }
];

export default function ImageTicker({ navigate }) {
  const { projects = [], mediaItems = [], openLightbox } = useProjects();

  // Combine ALL artwork images into a strictly unique, deduplicated list
  const allImages = useMemo(() => {
    const list = [];
    const seenPaths = new Set();

    const isVideo = (url) => typeof url === 'string' && /\.(mp4|webm|mov|m4v)$/i.test(url);

    const isExcluded = (url, category) => {
      if (!url || typeof url !== 'string') return true;
      if (category === 'logos' || category === 'portraits') return true;
      return EXCLUDED_PATTERNS.some((pattern) => pattern.test(url));
    };

    const getCanonicalPath = (url) => {
      if (!url || typeof url !== 'string') return '';
      return CANONICAL_PATH_MAP[url] || url;
    };

    // Helper to register unique artwork
    const registerArtwork = (rawPath, title, category, project = null) => {
      if (!rawPath || isVideo(rawPath) || isExcluded(rawPath, category)) return;
      const canonicalPath = getCanonicalPath(rawPath);
      if (seenPaths.has(canonicalPath)) return;

      seenPaths.add(canonicalPath);
      list.push({
        path: canonicalPath,
        title: title || 'Portfolio Artwork',
        category: category || 'Artwork',
        project
      });
    };

    // 1. Collect from live projects (ensuring each visual artwork is unique)
    projects.forEach((p) => {
      if (p.thumbnail) {
        registerArtwork(p.thumbnail, p.title, p.categoryLabel || p.category, p);
      }
      if (Array.isArray(p.images)) {
        p.images.forEach((imgUrl) => {
          registerArtwork(imgUrl, p.title, p.categoryLabel || p.category, p);
        });
      }
    });

    // 2. Collect from Media Vault (artwork/posters only; skip logos & system assets)
    mediaItems.forEach((m) => {
      if (m.type === 'image' && m.path) {
        registerArtwork(m.path, m.title, m.categoryLabel || m.category, null);
      }
    });

    // 3. Fallback to guarantee complete static gallery
    STATIC_GALLERY_IMAGES.forEach((s) => {
      registerArtwork(s.path, s.title, s.category, null);
    });

    return list;
  }, [projects, mediaItems]);

  const handleItemClick = (item) => {
    if (item.project) {
      openLightbox(item.project);
    } else {
      const matched = projects.find(
        (p) =>
          p.thumbnail === item.path ||
          (p.images && p.images.includes(item.path)) ||
          CANONICAL_PATH_MAP[p.thumbnail] === item.path
      );
      if (matched) {
        openLightbox(matched);
      } else {
        openLightbox({
          id: `ticker-${item.path}`,
          title: item.title,
          category: item.category || 'Posters',
          categoryLabel: item.category || 'Posters',
          thumbnail: item.path,
          images: [item.path],
          description: `Visual artwork from the BM Graphix creative archive. Crafted with precision for high-impact visual storytelling.`,
          tools: ['Photoshop', 'Illustrator', 'Cinema 4D'],
          likes: 42,
          comments: []
        });
      }
    }
  };

  // The ticker renders TWO rows:
  // Row 1 (visible): allImages — the real cards users interact with
  // Row 2 (aria-hidden clone): exact copy that provides seamless loop continuity
  // Animation moves -50% (the width of one full row) then resets — users never see both rows at once
  const tickerSpeed = `${Math.max(50, allImages.length * 3)}s`;

  const TickerCard = ({ item, hidden = false }) => (
    <div
      onClick={hidden ? undefined : () => handleItemClick(item)}
      aria-hidden={hidden ? 'true' : undefined}
      className="w-48 sm:w-56 md:w-64 aspect-[3/4] flex-shrink-0 relative rounded-2xl sm:rounded-3xl overflow-hidden glass-card border border-white/10 hover:border-[#D4AF37] shadow-xl hover:shadow-[0_15px_35px_rgba(212,175,55,0.25)] transition-all duration-500 group cursor-pointer bg-neutral-950"
    >
      <img
        src={item.path}
        alt={hidden ? '' : item.title}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover transform duration-700 ease-out group-hover:scale-105 filter group-hover:brightness-105"
      />
      {!hidden && (
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
              <span>View Artwork</span>
            </span>
            <div className="w-5 h-5 rounded-full bg-[#D4AF37] flex items-center justify-center text-black shadow">
              <ArrowUpRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <section className="relative w-full py-16 overflow-hidden select-none" aria-label="Endless Artwork Ticker">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#161616] border border-[#D4AF37]/30 text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Continuous Visual Stream</span>
        </div>
        <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-[#F5F1E8]">
          The Endless <span className="gold-gradient-text">Masterpiece Ticker</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#8A8A8A] max-w-xl mx-auto">
          Hover to pause and explore any artwork in high resolution. A non-stop reel featuring every poster, campaign, and brand identity crafted at BM Graphix.
        </p>
      </div>

      {/* Endless Ticker Wrapper */}
      <div className="image-ticker-container relative">
        {/* Left & Right Smooth Edge Fade Masks */}
        <div className="ticker-fade-left pointer-events-none absolute left-0 inset-y-0 w-16 sm:w-36 z-20" />
        <div className="ticker-fade-right pointer-events-none absolute right-0 inset-y-0 w-16 sm:w-36 z-20" />

        {/*
          Single animated flex track.
          Structure: [REAL CARDS ... | CLONE CARDS (aria-hidden) ...]
          Width = 2 × one-set-width. Animation: 0 → -50% → instantly reset to 0.
          At any viewport width, only the real or clone set is visible — never both simultaneously.
        */}
        <div
          className="image-ticker-track flex items-stretch gap-4 sm:gap-5 py-4"
          style={{ '--ticker-speed': tickerSpeed }}
        >
          {/* Row 1: Real interactive cards */}
          {allImages.map((item) => (
            <TickerCard key={`real-${item.path}`} item={item} hidden={false} />
          ))}
          {/* Row 2: Invisible clone for seamless loop — no click handlers, no alt text */}
          {allImages.map((item) => (
            <TickerCard key={`clone-${item.path}`} item={item} hidden={true} />
          ))}
        </div>
      </div>
    </section>
  );
}
