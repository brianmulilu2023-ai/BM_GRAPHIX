import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Play, Layers, Eye, ArrowUpRight } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';

export default function ProjectCard({ project, priority = false }) {
  const { openLightbox, toggleLike, isProjectLiked } = useProjects();
  const liked = isProjectLiked(project.id);

  const handleLikeClick = (e) => {
    e.stopPropagation();
    toggleLike(project.id);
  };

  const hasMultipleImages = Array.isArray(project.images) && project.images.length > 1;
  const isVideo = Boolean(project.videoUrl) || project.category === 'motion' || project.category === 'videos';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
      whileHover={{ y: -6, scale: 1.02, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
      onClick={() => openLightbox(project)}
      className="group relative rounded-xl sm:rounded-2xl overflow-hidden bg-[#121212] border border-white/10 hover:border-[#D4AF37]/50 shadow-lg hover:shadow-[0_20px_45px_rgba(212,175,55,0.18)] transition-all duration-500 cursor-pointer h-full flex flex-col shimmer-hover"
      style={{ perspective: '1000px' }}
    >
      {/* Media Container with 3:4 Poster Aspect Ratio */}
      <div className="relative overflow-hidden bg-neutral-950 aspect-[3/4] w-full flex-1">
        <img
          src={project.thumbnail || (project.images && project.images[0]) || '/assets/BM_BLCK.png'}
          alt={project.title}
          loading={priority ? 'eager' : 'lazy'}
          className="w-full h-full object-cover transform duration-700 ease-out group-hover:scale-105 filter group-hover:brightness-105"
        />

        {/* Media Type Badges */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10 flex items-center gap-1 pointer-events-none">
          {isVideo && (
            <span className="flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-black/75 backdrop-blur-md text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase text-[#F5D77A] border border-[#D4AF37]/40 shadow-md">
              <Play className="w-2 sm:w-2.5 h-2 sm:h-2.5 fill-[#F5D77A]" />
              <span className="hidden sm:inline">Motion</span>
            </span>
          )}
          {hasMultipleImages && (
            <span className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-black/75 backdrop-blur-md text-[9px] sm:text-[10px] font-semibold text-[#F5F1E8] border border-white/10 shadow-md">
              <Layers className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-[#D4AF37]" />
              <span>{project.images.length}</span>
            </span>
          )}
        </div>

        {/* Card Like Button (Top Right) */}
        <button
          onClick={handleLikeClick}
          aria-label={`Like ${project.title}`}
          className={`absolute top-2 sm:top-3 right-2 sm:right-3 z-20 flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full backdrop-blur-md transition-all duration-300 ${
            liked
              ? 'bg-[#D4AF37]/20 border border-[#D4AF37] text-[#F5D77A]'
              : 'bg-black/60 border border-white/15 text-white/80 hover:text-white hover:border-[#D4AF37]/50'
          }`}
        >
          <motion.div whileTap={{ scale: 1.4 }} transition={{ type: 'spring', stiffness: 400 }}>
            <Heart className={`w-3 sm:w-3.5 h-3 sm:h-3.5 ${liked ? 'fill-[#D4AF37] text-[#D4AF37]' : ''}`} />
          </motion.div>
          <span className="text-[10px] sm:text-[11px] font-medium">{project.likes || 0}</span>
        </button>

        {/* Cinematic Gradient Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-5">
          <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <span className="inline-block text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4AF37] mb-0.5 sm:mb-1">
              {project.categoryLabel || project.category}
            </span>
            <h3 className="font-display font-bold text-xs sm:text-base md:text-lg text-[#F5F1E8] leading-tight drop-shadow-md line-clamp-1 sm:line-clamp-2">
              {project.title}
            </h3>
            <p className="text-[11px] sm:text-xs text-[#8A8A8A] line-clamp-1 sm:line-clamp-2 mt-1 hidden sm:block">
              {project.description}
            </p>

            <div className="flex items-center justify-between pt-2 sm:pt-3 mt-2 sm:mt-3 border-t border-white/10 text-xs">
              <span className="text-[10px] sm:text-[11px] text-[#F5D77A] font-medium flex items-center gap-1">
                <Eye className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                <span className="hidden sm:inline">Details & Zoom</span>
                <span className="sm:hidden">View</span>
              </span>
              <div className="w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center text-[#F5D77A] group-hover:bg-[#D4AF37] group-hover:text-black transition-colors duration-300">
                <ArrowUpRight className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
