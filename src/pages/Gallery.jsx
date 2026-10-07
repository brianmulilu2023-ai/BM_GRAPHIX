import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Sparkles, Filter, SlidersHorizontal } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import { CATEGORIES } from '../data/projects';
import ProjectCard from '../components/ProjectCard';
import SkeletonCard from '../components/SkeletonCard';

export default function Gallery() {
  const {
    filteredProjects,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    loading
  } = useProjects();

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-28">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#161616] border border-[#D4AF37]/30 text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37] mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curated Works</span>
        </div>
        <h1 className="font-display font-extrabold text-4xl sm:text-6xl text-[#F5F1E8] mb-4">
          Portfolio & <span className="gold-gradient-text">Gallery</span>
        </h1>
        <p className="text-sm sm:text-base text-[#8A8A8A] leading-relaxed">
          Explore a showcase of posters, high-fashion campaigns, corporate brand identities, and kinetic broadcast animations crafted with precision.
        </p>
      </div>

      {/* Controls: Search Bar & Animated Category Filter Tabs */}
      <div className="mb-12 space-y-6">
        {/* Search Bar */}
        <div className="max-w-md mx-auto relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#8A8A8A]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search by title, tool, client or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-10 py-3 rounded-full bg-[#141414] border border-white/10 hover:border-[#D4AF37]/40 focus:border-[#D4AF37] focus:outline-none text-xs sm:text-sm text-[#F5F1E8] placeholder-[#8A8A8A] shadow-inner transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#8A8A8A] hover:text-[#F5F1E8]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter Tabs with Animated Framer Motion Pill */}
        <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
          {CATEGORIES.map((cat) => {
            const isActive = activeFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={`relative px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider transition-colors duration-300 ${
                  isActive
                    ? 'text-black'
                    : 'text-[#8A8A8A] hover:text-[#F5F1E8] bg-[#141414] border border-white/5 hover:border-white/15'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCategoryPill"
                    className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] via-[#F5D77A] to-[#B8860B] rounded-full shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-[#8A8A8A] px-2 max-w-7xl mx-auto pt-2">
          <span>
            Showing <strong className="text-[#F5F1E8]">{filteredProjects.length}</strong> {filteredProjects.length === 1 ? 'project' : 'projects'}
          </span>
          {(activeFilter !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setActiveFilter('all');
                setSearchQuery('');
              }}
              className="text-[#D4AF37] hover:underline flex items-center gap-1"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Gallery Content: 4 Columns on Laptop, 2 Columns on Phone */}
      {loading ? (
        <div className="poster-grid">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i}>
              <SkeletonCard />
            </div>
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="py-20 text-center rounded-3xl glass-card border border-white/5 p-8 max-w-md mx-auto">
          <SlidersHorizontal className="w-10 h-10 text-[#8A8A8A] mx-auto mb-4" />
          <h3 className="font-display text-xl text-[#F5F1E8] font-bold mb-2">No projects found</h3>
          <p className="text-xs text-[#8A8A8A] mb-6">
            We couldn't find any artwork matching "{searchQuery}" under this category.
          </p>
          <button
            onClick={() => {
              setActiveFilter('all');
              setSearchQuery('');
            }}
            className="px-6 py-2.5 rounded-full text-xs font-semibold text-black bg-[#D4AF37] hover:bg-[#F5D77A] transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="poster-grid">
          <AnimatePresence>
            {filteredProjects.map((project, idx) => (
              <div key={project.id} className="h-full">
                <ProjectCard project={project} priority={idx < 4} />
              </div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
