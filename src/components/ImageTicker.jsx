import React, { useMemo } from 'react';
import { Sparkles, Eye, ArrowUpRight } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';

const STATIC_GALLERY_IMAGES = [
  { path: '/assets/projects/zenia.jpeg', title: 'Zenia Sound Fest', category: 'Motion' },
  { path: '/assets/projects/cleo.jpeg', title: 'Cleo Haute Couture', category: 'Posters' },
  { path: '/assets/projects/conference-summit.jpeg', title: 'Conference Summit 2026', category: 'Posters' },
  { path: '/assets/projects/manipulation.jpeg', title: 'Celestial Echoes', category: 'Branding' },
  { path: '/assets/projects/paul.jpeg', title: 'Paul Live Concert', category: 'Posters' },
  { path: '/assets/projects/music-live.jpeg', title: 'Nairobi Music Live', category: 'Motion' },
  { path: '/assets/projects/youth-vibes.jpeg', title: 'Youth Vibes Festival', category: 'Posters' },
  { path: '/assets/projects/sharon.jpeg', title: 'Sharon Fashion Editorial', category: 'Posters' },
  { path: '/assets/projects/event-mb.jpeg', title: 'MB Exclusive Gala', category: 'Posters' },
  { path: '/assets/projects/event-gala.jpeg', title: 'Annual Corporate Gala', category: 'Posters' },
  { path: '/assets/projects/creative-flyer.jpeg', title: 'Creative Brand Flyer', category: 'Posters' },
  { path: '/assets/projects/worship-night.jpeg', title: 'Worship Night Experience', category: 'Posters' },
  { path: '/assets/projects/church-service.jpeg', title: 'Sunday Worship Service', category: 'Posters' },
  { path: '/assets/projects/album-launch.jpeg', title: 'Album Launch Artwork', category: 'Posters' },
  { path: '/assets/projects/cosmas.jpeg', title: 'Cosmas Live Tour', category: 'Posters' },
  { path: '/assets/projects/kasyoki.jpeg', title: 'Kasyoki Cultural Identity', category: 'Branding' },
  { path: '/assets/projects/lydia.jpeg', title: 'Lydia Portrait Visual', category: 'Posters' },
  { path: '/assets/projects/joyce.jpeg', title: 'Joyce Gospel Concert', category: 'Posters' },
  { path: '/assets/projects/WhatsApp Image 2026-10-05 at 11.51.16.jpeg', title: 'Nairobi Night Series', category: 'Posters' },
  { path: '/assets/projects/WhatsApp Image 2026-10-05 at 11.51.18.jpeg', title: 'Urban Creative Poster', category: 'Posters' },
  { path: '/assets/projects/WhatsApp Image 2026-10-05 at 11.51.20.jpeg', title: 'Vocal Showcase Tour', category: 'Posters' },
  { path: '/assets/projects/WhatsApp Image 2026-10-05 at 11.51.22.jpeg', title: 'Kingdom Sounds Live', category: 'Posters' }
];

export default function ImageTicker({ navigate }) {
  const { projects = [], mediaItems = [], openLightbox } = useProjects();

  // Combine ALL artwork images in the codebase into a unique list
  const allImages = useMemo(() => {
    const list = [];
    const seenPaths = new Set();

    const isVideo = (url) => typeof url === 'string' && /\.(mp4|webm|mov|m4v)$/i.test(url);

    // 1. Collect from live projects
    projects.forEach((p) => {
      if (p.thumbnail && !isVideo(p.thumbnail) && !seenPaths.has(p.thumbnail)) {
        seenPaths.add(p.thumbnail);
        list.push({
          path: p.thumbnail,
          title: p.title,
          category: p.categoryLabel || p.category,
          project: p
        });
      }
      if (Array.isArray(p.images)) {
        p.images.forEach((imgUrl) => {
          if (imgUrl && !isVideo(imgUrl) && !seenPaths.has(imgUrl)) {
            seenPaths.add(imgUrl);
            list.push({
              path: imgUrl,
              title: p.title,
              category: p.categoryLabel || p.category,
              project: p
            });
          }
        });
      }
    });

    // 2. Collect from Media Vault
    mediaItems.forEach((m) => {
      if (m.path && m.type !== 'video' && !isVideo(m.path) && !seenPaths.has(m.path)) {
        seenPaths.add(m.path);
        list.push({
          path: m.path,
          title: m.title || 'Studio Asset',
          category: m.category || 'Artwork',
          project: null
        });
      }
    });

    // 3. Fallback to guarantee complete static gallery
    STATIC_GALLERY_IMAGES.forEach((s) => {
      if (!seenPaths.has(s.path)) {
        seenPaths.add(s.path);
        list.push({
          path: s.path,
          title: s.title,
          category: s.category,
          project: null
        });
      }
    });

    return list;
  }, [projects, mediaItems]);

  const handleItemClick = (item) => {
    if (item.project) {
      openLightbox(item.project);
    } else {
      const matched = projects.find((p) => p.thumbnail === item.path || (p.images && p.images.includes(item.path)));
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
          likes: 38,
          comments: []
        });
      }
    }
  };

  // Duplicate for seamless 100% infinite continuous loop
  const tickerItems = [...allImages, ...allImages];

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

        {/* Continuous Animated Track */}
        <div
          className="image-ticker-track flex items-center gap-4 sm:gap-6 py-4"
          style={{ '--ticker-speed': `${Math.max(45, allImages.length * 2.2)}s` }}
        >
          {tickerItems.map((item, idx) => (
            <div
              key={`${item.path}-${idx}`}
              onClick={() => handleItemClick(item)}
              className="w-48 sm:w-60 md:w-68 aspect-[3/4] flex-shrink-0 relative rounded-2xl sm:rounded-3xl overflow-hidden glass-card border border-white/10 hover:border-[#D4AF37] shadow-xl hover:shadow-[0_15px_35px_rgba(212,175,55,0.25)] transition-all duration-500 group cursor-pointer bg-neutral-950"
            >
              {/* Artwork Image */}
              <img
                src={item.path}
                alt={item.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transform duration-700 ease-out group-hover:scale-105 filter group-hover:brightness-105"
              />

              {/* Cinematic Bottom Gradient Overlay */}
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
