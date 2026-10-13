import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Heart,
  MessageCircle,
  Calendar,
  Layers,
  Send,
  User,
  Share2,
  Trash2,
  Check,
  ExternalLink,
  MessageSquare,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import ResponsiveVideoPlayer from './ResponsiveVideoPlayer';

export default function Lightbox() {
  const {
    lightboxProject,
    closeLightbox,
    nextLightboxProject,
    prevLightboxProject,
    projects,
    toggleLike,
    isProjectLiked,
    addComment,
    deleteComment,
    isAdminLoggedIn,
    showToast
  } = useProjects();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Touch swipe handling
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const images = lightboxProject?.images || (lightboxProject?.thumbnail ? [lightboxProject.thumbnail] : []);
  const liked = lightboxProject ? isProjectLiked(lightboxProject.id) : false;
  const videoUrl = lightboxProject?.videoUrl || null;
  const isVideo = Boolean(videoUrl);

  // Current position in projects catalog
  const currentProjectIndex = lightboxProject
    ? projects.findIndex((p) => p.id === lightboxProject.id)
    : -1;
  const projectNumber = currentProjectIndex !== -1 ? currentProjectIndex + 1 : 1;
  const totalProjects = projects.length;

  // Detect embed vs native video
  const isYouTube = videoUrl && (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be'));
  const isVimeo = videoUrl && videoUrl.includes('vimeo.com');
  const isEmbedUrl = isYouTube || isVimeo;

  // When video exists it occupies tab index 0; images are offset by 1
  const imageSlideIndex = isVideo ? activeImageIndex - 1 : activeImageIndex;
  const currentImage = images[Math.max(0, imageSlideIndex)] || lightboxProject?.thumbnail;

  const getEmbedUrl = (url) => {
    if (!url) return '';
    const ytMatch = url.match(/(?:v=|youtu\.be\/)([\w-]{11})/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`;
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
    return url;
  };

  // Reset zoom & slide whenever project changes
  useEffect(() => {
    setActiveImageIndex(0);
    setZoomLevel(1);
  }, [lightboxProject?.id]);

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxProject) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        if (totalSlides > 1) handleNextImage();
        else if (nextLightboxProject) nextLightboxProject();
      } else if (e.key === 'ArrowLeft') {
        if (totalSlides > 1) handlePrevImage();
        else if (prevLightboxProject) prevLightboxProject();
      } else if (e.key === '[' && prevLightboxProject) {
        prevLightboxProject();
      } else if (e.key === ']' && nextLightboxProject) {
        nextLightboxProject();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxProject, activeImageIndex, images.length]);

  if (!lightboxProject) return null;

  const totalSlides = (isVideo ? 1 : 0) + images.length;

  const handleNextImage = () => {
    if (totalSlides > 1) {
      setActiveImageIndex((prev) => (prev + 1) % totalSlides);
      setZoomLevel(1);
    }
  };

  const handlePrevImage = () => {
    if (totalSlides > 1) {
      setActiveImageIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
      setZoomLevel(1);
    }
  };

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.35, 2.5));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.35, 0.75));
  const handleResetZoom = () => setZoomLevel(1);

  // Swipe handling
  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        if (totalSlides > 1) handleNextImage();
        else if (nextLightboxProject) nextLightboxProject();
      } else {
        if (totalSlides > 1) handlePrevImage();
        else if (prevLightboxProject) prevLightboxProject();
      }
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim()) return;

    setIsSubmittingComment(true);
    try {
      await addComment(lightboxProject.id, {
        name: commentName,
        text: commentText
      });
      setCommentText('');
    } catch {
      // Handled in context
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleShare = () => {
    const shareUrl = window.location.origin + '/work?id=' + lightboxProject.id;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      showToast('Project link copied to clipboard!', 'gold');
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const whatsappInquiryUrl = `https://wa.me/254798405726?text=${encodeURIComponent(
    `Hi Brian Mulilu, I saw your project "${lightboxProject.title}" on the BM Graphix portfolio and I would like to inquire about a similar design.`
  )}`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-2 sm:p-4 md:p-6 overflow-hidden"
        onClick={closeLightbox}
      >
        {/* Main Lightbox Frame */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="relative w-full max-w-6xl h-[92vh] max-h-[860px] bg-[#0E0E0E] border border-[#D4AF37]/35 rounded-2xl md:rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.95),0_0_40px_rgba(212,175,55,0.14)] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ─── 1. TOP DOCKED HEADER BAR (Spans full width cleanly across top) ─── */}
          <header className="relative z-30 flex items-center justify-between px-3.5 sm:px-6 py-2.5 sm:py-3 bg-[#131313] border-b border-white/10 shrink-0">
            {/* Left: Category Tag & Project Navigator */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <span className="px-2.5 sm:px-3 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#F5D77A] border border-[#D4AF37]/30 text-[10px] sm:text-xs font-semibold uppercase tracking-wider shrink-0">
                {lightboxProject.categoryLabel || lightboxProject.category}
              </span>

              {totalProjects > 1 && (
                <div className="flex items-center gap-1.5 text-xs text-[#8A8A8A] font-mono shrink-0">
                  <span className="hidden sm:inline">Project</span>
                  <span className="text-[#F5F1E8] font-bold">{projectNumber}</span>
                  <span>/</span>
                  <span>{totalProjects}</span>
                </div>
              )}

              {/* Prev / Next Project Arrows */}
              {totalProjects > 1 && (
                <div className="flex items-center gap-1 ml-0.5 sm:ml-1">
                  <button
                    onClick={prevLightboxProject}
                    aria-label="Previous project in portfolio"
                    className="w-7 h-7 rounded-full bg-white/5 hover:bg-[#D4AF37]/20 border border-white/10 hover:border-[#D4AF37] text-white/80 hover:text-white flex items-center justify-center transition active:scale-90"
                    title="Previous Project (Shortcut: [ )"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextLightboxProject}
                    aria-label="Next project in portfolio"
                    className="w-7 h-7 rounded-full bg-white/5 hover:bg-[#D4AF37]/20 border border-white/10 hover:border-[#D4AF37] text-white/80 hover:text-white flex items-center justify-center transition active:scale-90"
                    title="Next Project (Shortcut: ] )"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Center: Clean Title (visible on md+) */}
            <div className="hidden md:block truncate max-w-sm lg:max-w-md px-2 text-center">
              <h3 className="font-display font-semibold text-xs sm:text-sm text-[#F5F1E8] truncate">
                {lightboxProject.title}
              </h3>
            </div>

            {/* Right: Inquire, Share & Close */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] text-xs font-semibold transition active:scale-95"
                title="Inquire via WhatsApp"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Inquire</span>
              </a>

              <button
                onClick={handleShare}
                className="p-1.5 sm:p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#F5F1E8] hover:text-[#F5D77A] border border-white/10 hover:border-[#D4AF37]/50 transition"
                title="Share Project URL"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>

              <button
                onClick={closeLightbox}
                className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-[#D4AF37] text-white hover:text-black border border-white/15 hover:border-[#D4AF37] transition active:scale-90"
                title="Close (ESC)"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </header>

          {/* ─── 2. MAIN BODY (Side-by-side on desktop | Smooth scroll on mobile) ──── */}
          <div className="relative flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden min-h-0 bg-[#0B0B0B]">
            {/* ─── 2A. LEFT: MEDIA SHOWCASE STAGE ───────────────────────────── */}
            <div
              className="relative w-full lg:w-[58%] xl:w-[60%] bg-gradient-to-b from-[#111111] via-[#090909] to-[#050505] flex flex-col items-center justify-center p-3 sm:p-6 select-none shrink-0 lg:shrink min-h-[300px] sm:min-h-[380px] max-h-[48vh] sm:max-h-[52vh] lg:max-h-none lg:h-full border-b lg:border-b-0 lg:border-r border-white/10 overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Soft Ambient Radial Glow Behind Media */}
              <div className="absolute inset-0 bg-radial-gradient from-[#D4AF37]/10 via-transparent to-transparent pointer-events-none opacity-60" />

              {/* Viewport for Video or Image */}
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden z-10">
                {isVideo && activeImageIndex === 0 ? (
                  <div className="w-full h-full max-h-[44vh] lg:max-h-[64vh] flex items-center justify-center">
                    {isEmbedUrl ? (
                      <div className="w-full max-h-full" style={{ aspectRatio: '16/9' }}>
                        <iframe
                          src={getEmbedUrl(videoUrl)}
                          title={lightboxProject.title}
                          allow="autoplay; fullscreen; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full rounded-xl shadow-2xl border border-white/10"
                        />
                      </div>
                    ) : (
                      <ResponsiveVideoPlayer
                        key={videoUrl}
                        src={videoUrl}
                        poster={lightboxProject.thumbnail || undefined}
                        controls
                        autoPlay
                        muted
                        playsInline
                        className="max-h-[44vh] lg:max-h-[64vh] w-auto max-w-full rounded-xl shadow-2xl border border-white/10 bg-black"
                      />
                    )}
                  </div>
                ) : (
                  <motion.div
                    className="max-w-full max-h-full flex items-center justify-center transition-transform duration-200 ease-out cursor-grab active:cursor-grabbing"
                    animate={{ scale: zoomLevel }}
                  >
                    <img
                      src={currentImage}
                      alt={lightboxProject.title}
                      className="max-h-[42vh] sm:max-h-[46vh] lg:max-h-[64vh] w-auto max-w-full object-contain rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.8)] border border-white/5 pointer-events-auto"
                    />
                  </motion.div>
                )}
              </div>

              {/* Floating Zoom Controls for Images */}
              {(!isVideo || activeImageIndex > 0) && (
                <div className="absolute top-3 left-3 z-20 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-xs text-[#F5F1E8] shadow-lg">
                  <button
                    onClick={handleZoomOut}
                    disabled={zoomLevel <= 0.75}
                    className="p-1 hover:text-[#F5D77A] disabled:opacity-30 transition"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono text-[10px] sm:text-[11px] px-1 text-[#8A8A8A]">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    onClick={handleZoomIn}
                    disabled={zoomLevel >= 2.5}
                    className="p-1 hover:text-[#F5D77A] disabled:opacity-30 transition"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-[1px] h-3 bg-white/20 mx-0.5" />
                  <button
                    onClick={handleResetZoom}
                    className="p-1 hover:text-[#F5D77A] transition"
                    title="Reset Zoom"
                  >
                    <Maximize2 className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Slide Navigation Arrows for multi-media */}
              {totalSlides > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    aria-label="Previous slide"
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/75 hover:bg-[#D4AF37]/30 border border-white/20 hover:border-[#D4AF37] text-white flex items-center justify-center backdrop-blur-md transition active:scale-95 shadow-xl"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    aria-label="Next slide"
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/75 hover:bg-[#D4AF37]/30 border border-white/20 hover:border-[#D4AF37] text-white flex items-center justify-center backdrop-blur-md transition active:scale-95 shadow-xl"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </>
              )}

              {/* Multi-image thumbnail carousel strip */}
              {(isVideo || images.length > 1) && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2 max-w-[90vw] sm:max-w-sm overflow-x-auto p-1 bg-black/85 backdrop-blur-md rounded-xl border border-white/15 scrollbar-none shadow-xl">
                  {isVideo && (
                    <button
                      onClick={() => { setActiveImageIndex(0); setZoomLevel(1); }}
                      className={`relative w-9 sm:w-10 h-9 sm:h-10 rounded-lg overflow-hidden border-2 transition flex items-center justify-center bg-black/80 shrink-0 ${
                        activeImageIndex === 0
                          ? 'border-[#D4AF37] shadow-[0_0_10px_#D4AF37]'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                      title="Play video"
                    >
                      <svg className="w-3.5 h-3.5 text-[#F5D77A] fill-[#F5D77A]" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </button>
                  )}
                  {images.map((img, idx) => {
                    const tabIndex = isVideo ? idx + 1 : idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setActiveImageIndex(tabIndex);
                          setZoomLevel(1);
                        }}
                        className={`relative w-9 sm:w-10 h-9 sm:h-10 rounded-lg overflow-hidden border-2 transition shrink-0 ${
                          activeImageIndex === tabIndex
                            ? 'border-[#D4AF37] shadow-[0_0_10px_#D4AF37]'
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ─── 2B. RIGHT: BALANCED PROJECT DETAILS & ENGAGEMENT ─────────── */}
            <div className="w-full lg:w-[42%] xl:w-[40%] bg-[#121212] flex flex-col min-h-0 lg:h-full lg:overflow-hidden">
              {/* Scrollable Container */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
                {/* Project Header Info */}
                <div>
                  <div className="flex items-center justify-between text-xs text-[#8A8A8A] mb-1.5 font-mono">
                    <span className="flex items-center gap-1 text-[#8A8A8A]">
                      <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{lightboxProject.year || '2024'}</span>
                    </span>
                    {lightboxProject.client && (
                      <span className="text-xs text-[#D4AF37] font-semibold">
                        Client: {lightboxProject.client}
                      </span>
                    )}
                  </div>

                  <h2 className="font-display font-bold text-xl sm:text-2xl text-[#F5F1E8] leading-tight">
                    {lightboxProject.title}
                  </h2>
                </div>

                {/* Description */}
                <div className="text-xs sm:text-sm text-[#9E9E9E] leading-relaxed border-t border-b border-white/5 py-3.5">
                  {lightboxProject.description || 'Custom visual campaign crafted by BM Graphix.'}
                </div>

                {/* Tools & Technologies */}
                {Array.isArray(lightboxProject.tools) && lightboxProject.tools.length > 0 && (
                  <div>
                    <h4 className="text-[10px] sm:text-[11px] uppercase tracking-widest text-[#8A8A8A] font-semibold mb-2 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Tools & Software</span>
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {lightboxProject.tools.map((tool, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-md bg-[#1B1B1B] border border-white/10 text-xs text-[#F5F1E8] font-mono"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons: Like & WhatsApp CTA */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <button
                    onClick={() => toggleLike(lightboxProject.id)}
                    className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 font-semibold text-xs sm:text-sm transition-all duration-300 ${
                      liked
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black shadow-md shadow-[#D4AF37]/25'
                        : 'bg-white/5 hover:bg-white/10 text-[#F5F1E8] border border-white/10 hover:border-[#D4AF37]/40'
                    }`}
                  >
                    <motion.div whileTap={{ scale: 1.5 }} transition={{ type: 'spring', stiffness: 500 }}>
                      <Heart className={`w-4 h-4 ${liked ? 'fill-black text-black' : 'text-[#D4AF37]'}`} />
                    </motion.div>
                    <span>{liked ? 'Liked' : 'Like'}</span>
                    <span className="font-mono text-xs opacity-80">({lightboxProject.likes || 0})</span>
                  </button>

                  <a
                    href={whatsappInquiryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 font-semibold text-xs sm:text-sm bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/40 transition active:scale-95"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Inquire</span>
                  </a>
                </div>

                {/* Comments Section */}
                <div className="space-y-3.5 pt-2 border-t border-white/5">
                  <h3 className="text-xs uppercase tracking-widest text-[#F5F1E8] font-bold flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Comments ({(lightboxProject.comments || []).length})</span>
                  </h3>

                  {/* Comment Form */}
                  <form onSubmit={handleCommentSubmit} className="space-y-2">
                    <input
                      type="text"
                      placeholder="Your Name / Studio"
                      value={commentName}
                      onChange={(e) => setCommentName(e.target.value)}
                      required
                      className="w-full px-3.5 py-2 rounded-lg bg-[#181818] border border-white/10 focus:border-[#D4AF37] focus:outline-none text-xs text-[#F5F1E8] placeholder-[#8A8A8A]"
                    />
                    <div className="relative">
                      <textarea
                        rows={2}
                        placeholder="Share your thoughts on this design..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        required
                        className="w-full px-3.5 py-2 rounded-lg bg-[#181818] border border-white/10 focus:border-[#D4AF37] focus:outline-none text-xs text-[#F5F1E8] placeholder-[#8A8A8A] resize-none pr-9"
                      />
                      <button
                        type="submit"
                        disabled={isSubmittingComment || !commentName.trim() || !commentText.trim()}
                        className="absolute right-2 bottom-2.5 p-1.5 rounded-md bg-[#D4AF37] text-black hover:bg-[#F5D77A] disabled:opacity-40 transition"
                        title="Post Comment"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </form>

                  {/* Comment List */}
                  <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
                    {(lightboxProject.comments || []).length === 0 ? (
                      <p className="text-xs text-[#8A8A8A] italic text-center py-2.5">
                        No comments yet. Be the first to share your review!
                      </p>
                    ) : (
                      (lightboxProject.comments || []).map((comm) => (
                        <div
                          key={comm.id}
                          className="p-2.5 rounded-xl bg-[#171717] border border-white/5 space-y-1 relative group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs text-[#F5D77A]">
                              {comm.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-[#8A8A8A]">
                                {comm.date || 'Recent'}
                              </span>
                              {isAdminLoggedIn && (
                                <button
                                  onClick={() => deleteComment(lightboxProject.id, comm.id)}
                                  className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition p-0.5"
                                  title="Delete Comment"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-[#E5E1D8] leading-relaxed">
                            {comm.text}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Consultation Banner */}
              <div className="p-3.5 bg-[#090909] border-t border-white/5 flex items-center justify-between text-xs shrink-0">
                <span className="text-[#8A8A8A] text-xs">Need a similar design?</span>
                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#D4AF37] hover:text-[#F5D77A] flex items-center gap-1 text-xs transition"
                >
                  <span>Consult with Brian</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
