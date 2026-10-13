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
  Info
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
  // Mobile view switcher: 'media' (focused artwork) or 'details' (info & comments)
  const [mobileTab, setMobileTab] = useState('media');

  // Touch swipe handling
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const images = lightboxProject?.images || (lightboxProject?.thumbnail ? [lightboxProject.thumbnail] : []);
  const liked = lightboxProject ? isProjectLiked(lightboxProject.id) : false;
  const videoUrl = lightboxProject?.videoUrl || null;
  const isVideo = Boolean(videoUrl);

  // Position in projects list
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

  // Reset image index, zoom and mobile tab whenever project changes
  useEffect(() => {
    setActiveImageIndex(0);
    setZoomLevel(1);
    setMobileTab('media');
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
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-2xl p-1.5 sm:p-4 md:p-6 overflow-hidden"
        onClick={closeLightbox}
      >
        {/* Main Lightbox Frame */}
        <motion.div
          initial={{ scale: 0.94, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.94, opacity: 0 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="relative w-full max-w-7xl h-[94vh] sm:h-[92vh] max-h-[960px] bg-[#0E0E0E] border border-[#D4AF37]/35 rounded-2xl md:rounded-3xl shadow-[0_0_70px_rgba(0,0,0,0.95),0_0_35px_rgba(212,175,55,0.18)] flex flex-col lg:flex-row overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ─── UNIVERSAL TOP BAR (Controls & Project Navigation) ──────────── */}
          <div className="relative z-30 flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3.5 bg-[#121212]/95 border-b border-white/10 backdrop-blur-md shrink-0">
            {/* Left: Category Tag & Project Navigator */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#D4AF37]/15 text-[#F5D77A] border border-[#D4AF37]/30 text-[10px] sm:text-xs font-semibold uppercase tracking-wider shrink-0">
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

              {/* Prev / Next Project Buttons */}
              {totalProjects > 1 && (
                <div className="flex items-center gap-1 ml-1">
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

            {/* Mobile Tab Pill Switcher (Visual vs Details) */}
            <div className="flex lg:hidden items-center p-0.5 rounded-full bg-black/60 border border-white/10">
              <button
                onClick={() => setMobileTab('media')}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition ${
                  mobileTab === 'media'
                    ? 'bg-[#D4AF37] text-black shadow-sm'
                    : 'text-[#8A8A8A] hover:text-white'
                }`}
              >
                Artwork
              </button>
              <button
                onClick={() => setMobileTab('details')}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition flex items-center gap-1 ${
                  mobileTab === 'details'
                    ? 'bg-[#D4AF37] text-black shadow-sm'
                    : 'text-[#8A8A8A] hover:text-white'
                }`}
              >
                <span>Details</span>
                {(lightboxProject.comments || []).length > 0 && (
                  <span className="text-[9px] px-1 rounded-full bg-white/20">
                    {(lightboxProject.comments || []).length}
                  </span>
                )}
              </button>
            </div>

            {/* Right: Share, WhatsApp CTA & Close */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] text-xs font-semibold transition"
                title="Inquire via WhatsApp"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Inquire</span>
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
          </div>

          {/* ─── MAIN CONTENT BODY (Desktop: Split, Mobile: Toggled) ───────── */}
          <div className="relative flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
            {/* ─── LEFT: MEDIA STAGE (Image or Video) ───────────────────────── */}
            <div
              className={`relative flex-1 bg-black/95 flex flex-col items-center justify-center overflow-hidden select-none ${
                mobileTab === 'details' ? 'hidden lg:flex' : 'flex'
              }`}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Viewport for Video or Image */}
              <div className="relative w-full h-full flex items-center justify-center p-3 sm:p-6 md:p-8 overflow-hidden">
                {isVideo && activeImageIndex === 0 ? (
                  <div className="w-full max-w-4xl max-h-full flex items-center justify-center">
                    {isEmbedUrl ? (
                      <div className="w-full" style={{ aspectRatio: '16/9' }}>
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
                        className="max-h-[65vh] sm:max-h-[75vh] w-auto max-w-full rounded-xl shadow-2xl border border-white/10 bg-black"
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
                      className="max-h-[62vh] sm:max-h-[75vh] md:max-h-[78vh] w-auto max-w-full object-contain rounded-lg shadow-2xl pointer-events-auto"
                    />
                  </motion.div>
                )}
              </div>

              {/* Zoom & Pan Bar for Images */}
              {(!isVideo || activeImageIndex > 0) && (
                <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-xs text-[#F5F1E8]">
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
                  <div className="w-[1px] h-3 bg-white/20 mx-1" />
                  <button
                    onClick={handleResetZoom}
                    className="p-1 hover:text-[#F5D77A] transition"
                    title="Reset Zoom"
                  >
                    <Maximize2 className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Left / Right Slide Arrows for Multi-image/video */}
              {totalSlides > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    aria-label="Previous slide"
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/70 hover:bg-[#D4AF37]/25 border border-white/20 hover:border-[#D4AF37] text-white flex items-center justify-center backdrop-blur-md transition active:scale-95 shadow-xl"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    aria-label="Next slide"
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/70 hover:bg-[#D4AF37]/25 border border-white/20 hover:border-[#D4AF37] text-white flex items-center justify-center backdrop-blur-md transition active:scale-95 shadow-xl"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </>
              )}

              {/* Bottom Carousel / Thumbnail Strip */}
              {(isVideo || images.length > 1) && (
                <div className="absolute bottom-3 left-3 sm:left-4 z-20 flex items-center gap-1.5 sm:gap-2 max-w-[85vw] sm:max-w-md overflow-x-auto p-1 bg-black/80 backdrop-blur-md rounded-xl border border-white/15 scrollbar-none shadow-lg">
                  {isVideo && (
                    <button
                      onClick={() => { setActiveImageIndex(0); setZoomLevel(1); }}
                      className={`relative w-10 sm:w-12 h-10 sm:h-12 rounded-lg overflow-hidden border-2 transition flex items-center justify-center bg-black/80 ${
                        activeImageIndex === 0
                          ? 'border-[#D4AF37] shadow-[0_0_10px_#D4AF37]'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                      title="Play video"
                    >
                      <svg className="w-4 sm:w-5 h-4 sm:h-5 text-[#F5D77A] fill-[#F5D77A]" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
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
                        className={`relative w-10 sm:w-12 h-10 sm:h-12 rounded-lg overflow-hidden border-2 transition ${
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

              {/* Mobile Quick Action Pill to Switch to Details */}
              <div className="lg:hidden absolute bottom-3 right-3 z-20">
                <button
                  onClick={() => setMobileTab('details')}
                  className="px-3.5 py-1.5 rounded-full bg-[#D4AF37] text-black font-bold text-xs shadow-lg shadow-[#D4AF37]/30 flex items-center gap-1.5 active:scale-95 transition"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>See Details &rarr;</span>
                </button>
              </div>
            </div>

            {/* ─── RIGHT: PROJECT DETAIL VIEW & INTERACTIVE COMMENTS ──────── */}
            <div
              className={`w-full lg:w-96 xl:w-[430px] bg-[#121212] border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col h-full overflow-hidden ${
                mobileTab === 'media' ? 'hidden lg:flex' : 'flex'
              }`}
            >
              {/* Scrollable details container */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
                {/* Year & Client Header */}
                <div className="flex items-center justify-between text-xs pb-1">
                  <span className="flex items-center gap-1.5 text-[#8A8A8A] font-mono">
                    <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{lightboxProject.year || '2024'}</span>
                  </span>
                  {lightboxProject.client && (
                    <span className="text-xs text-[#D4AF37] font-semibold">
                      Client: {lightboxProject.client}
                    </span>
                  )}
                </div>

                {/* Title */}
                <div>
                  <h2 className="font-display font-bold text-xl sm:text-2xl text-[#F5F1E8] leading-tight">
                    {lightboxProject.title}
                  </h2>
                </div>

                {/* Description */}
                <div className="text-xs sm:text-sm text-[#8A8A8A] leading-relaxed border-t border-b border-white/5 py-3.5">
                  {lightboxProject.description || 'Masterpiece created by BM Graphix.'}
                </div>

                {/* Tools & Technologies */}
                {Array.isArray(lightboxProject.tools) && lightboxProject.tools.length > 0 && (
                  <div>
                    <h4 className="text-[11px] uppercase tracking-widest text-[#8A8A8A] font-semibold mb-2 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Tools & Software</span>
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {lightboxProject.tools.map((tool, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded-md bg-[#1B1B1B] border border-white/10 text-[11px] sm:text-xs text-[#F5F1E8] font-mono"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Like Button & WhatsApp CTA */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {/* Like Button */}
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

                  {/* WhatsApp Direct Inquiry */}
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
                <div className="space-y-3.5 pt-3 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs uppercase tracking-widest text-[#F5F1E8] font-bold flex items-center gap-1.5">
                      <MessageCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Comments ({(lightboxProject.comments || []).length})</span>
                    </h3>
                  </div>

                  {/* Comment Submission Form */}
                  <form onSubmit={handleCommentSubmit} className="space-y-2">
                    <input
                      type="text"
                      placeholder="Your Name / Studio"
                      value={commentName}
                      onChange={(e) => setCommentName(e.target.value)}
                      required
                      className="w-full px-3 py-1.5 rounded-lg bg-[#181818] border border-white/10 focus:border-[#D4AF37] focus:outline-none text-xs text-[#F5F1E8] placeholder-[#8A8A8A]"
                    />
                    <div className="relative">
                      <textarea
                        rows={2}
                        placeholder="Share feedback or inquiry..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        required
                        className="w-full px-3 py-1.5 rounded-lg bg-[#181818] border border-white/10 focus:border-[#D4AF37] focus:outline-none text-xs text-[#F5F1E8] placeholder-[#8A8A8A] resize-none pr-9"
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
                  <div className="space-y-2.5 pt-1 max-h-56 overflow-y-auto pr-1">
                    {(lightboxProject.comments || []).length === 0 ? (
                      <p className="text-xs text-[#8A8A8A] italic text-center py-3">
                        No comments yet. Be the first to leave feedback!
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
                                  className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition p-1"
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

              {/* Bottom Quick Bar on Desktop */}
              <div className="p-3.5 bg-[#0A0A0A] border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-[#8A8A8A]">Interested in this style?</span>
                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#D4AF37] hover:text-[#F5D77A] flex items-center gap-1 transition"
                >
                  <span>Chat with Brian</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
