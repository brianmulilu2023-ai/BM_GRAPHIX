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
  Check
} from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import ResponsiveVideoPlayer from './ResponsiveVideoPlayer';

export default function Lightbox() {
  const {
    lightboxProject,
    closeLightbox,
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

  // Detect embed vs native video
  const isYouTube = videoUrl && (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be'));
  const isVimeo = videoUrl && videoUrl.includes('vimeo.com');
  const isEmbedUrl = isYouTube || isVimeo;

  // When video exists it occupies tab index 0; images are offset by 1
  const imageSlideIndex = isVideo ? activeImageIndex - 1 : activeImageIndex;
  const currentImage = images[Math.max(0, imageSlideIndex)] || lightboxProject?.thumbnail;

  const getEmbedUrl = (url) => {
    if (!url) return '';
    // YouTube
    const ytMatch = url.match(/(?:v=|youtu\.be\/)([\w-]{11})/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`;
    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
    return url;
  };

  // Reset image index and zoom whenever project changes
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
        handleNextImage();
      } else if (e.key === 'ArrowLeft') {
        handlePrevImage();
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
      if (diff > 0) handleNextImage();
      else handlePrevImage();
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
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-7xl h-[94vh] bg-[#0E0E0E] border border-[#D4AF37]/30 rounded-2xl md:rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.9),0_0_30px_rgba(212,175,55,0.15)] flex flex-col lg:flex-row overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Bar / Controls */}
          <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2.5 rounded-full bg-black/60 text-[#F5F1E8] hover:text-[#F5D77A] border border-white/10 hover:border-[#D4AF37]/50 backdrop-blur-md transition"
              title="Share Project"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={closeLightbox}
              className="p-2.5 rounded-full bg-black/60 text-[#F5F1E8] hover:text-[#D4AF37] border border-white/10 hover:border-[#D4AF37]/50 backdrop-blur-md transition active:scale-90"
              title="Close (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* LEFT: Media Stage (Image or Video) */}
          <div
            className="relative flex-1 bg-black/95 flex flex-col items-center justify-center overflow-hidden select-none"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Viewport for Video or Image */}
            <div className="relative w-full h-full flex items-center justify-center p-4 md:p-8 overflow-hidden">
              {isVideo && activeImageIndex === 0 ? (
                <div className="w-full max-w-4xl max-h-full flex items-center justify-center">
                  {isEmbedUrl ? (
                    // YouTube / Vimeo — render as responsive iframe
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
                    // Base64 / data URL / local MP4 — native video player
                    <ResponsiveVideoPlayer
                      key={videoUrl}
                      src={videoUrl}
                      poster={lightboxProject.thumbnail || undefined}
                      controls
                      autoPlay
                      muted
                      playsInline
                      className="max-h-[75vh] w-auto max-w-full rounded-xl shadow-2xl border border-white/10 bg-black"
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
                    className="max-h-[75vh] md:max-h-[80vh] w-auto max-w-full object-contain rounded-lg shadow-2xl pointer-events-auto"
                  />
                </motion.div>
              )}
            </div>

            {/* Floating Zoom & Pan Bar for Images */}
            {(!isVideo || activeImageIndex > 0) && (
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-xs text-[#F5F1E8]">
                <button
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 0.75}
                  className="p-1 hover:text-[#F5D77A] disabled:opacity-30 transition"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="font-mono text-[11px] px-2 text-[#8A8A8A]">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 2.5}
                  className="p-1 hover:text-[#F5D77A] disabled:opacity-30 transition"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <div className="w-[1px] h-3 bg-white/20 mx-1" />
                <button
                  onClick={handleResetZoom}
                  className="p-1 hover:text-[#F5D77A] transition"
                  title="Reset Zoom"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Left / Right Carousel Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  aria-label="Previous artwork"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-[#D4AF37]/20 border border-white/15 hover:border-[#D4AF37] text-white flex items-center justify-center backdrop-blur-md transition active:scale-95 shadow-xl"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNextImage}
                  aria-label="Next artwork"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-[#D4AF37]/20 border border-white/15 hover:border-[#D4AF37] text-white flex items-center justify-center backdrop-blur-md transition active:scale-95 shadow-xl"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Bottom thumbnail strip: video tab + image thumbnails (accessible on both mobile and desktop) */}
            {(isVideo || images.length > 1) && (
              <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 z-20 flex items-center gap-1.5 sm:gap-2 max-w-[85vw] sm:max-w-sm overflow-x-auto p-1 bg-black/75 backdrop-blur-md rounded-xl border border-white/15 scrollbar-none shadow-lg">
                {/* Video tab (index 0 when video exists) */}
                {isVideo && (
                  <button
                    onClick={() => { setActiveImageIndex(0); setZoomLevel(1); }}
                    className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 transition flex items-center justify-center bg-black/80 ${
                      activeImageIndex === 0
                        ? 'border-[#D4AF37] shadow-[0_0_10px_#D4AF37]'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                    title="Play video"
                  >
                    <svg className="w-5 h-5 text-[#F5D77A] fill-[#F5D77A]" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </button>
                )}
                {/* Image thumbnails (offset index by 1 when video exists) */}
                {images.map((img, idx) => {
                  const tabIndex = isVideo ? idx + 1 : idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveImageIndex(tabIndex);
                        setZoomLevel(1);
                      }}
                      className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 transition ${
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

          {/* RIGHT: Project Detail View & Interactive Comments */}
          <div className="w-full lg:w-96 xl:w-[420px] bg-[#121212] border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col h-full overflow-hidden">
            {/* Scrollable details */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Category & Date */}
              <div className="flex items-center justify-between text-xs">
                <span className="px-3 py-1 rounded-full bg-[#D4AF37]/15 text-[#F5D77A] border border-[#D4AF37]/30 font-medium uppercase tracking-wider text-[11px]">
                  {lightboxProject.categoryLabel || lightboxProject.category}
                </span>
                <span className="flex items-center gap-1.5 text-[#8A8A8A]">
                  <Calendar className="w-3.5 h-3.5" />
                  {lightboxProject.year || '2024'}
                </span>
              </div>

              {/* Title & Client */}
              <div>
                <h2 className="font-display font-bold text-2xl text-[#F5F1E8] leading-tight">
                  {lightboxProject.title}
                </h2>
                {lightboxProject.client && (
                  <p className="text-xs text-[#D4AF37] mt-1 font-medium">
                    Client: {lightboxProject.client}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="text-sm text-[#8A8A8A] leading-relaxed border-t border-b border-white/5 py-4">
                {lightboxProject.description}
              </div>

              {/* Tools Used */}
              {Array.isArray(lightboxProject.tools) && lightboxProject.tools.length > 0 && (
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-[#8A8A8A] font-semibold mb-2.5 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Tools & Technologies
                  </h4>
                  <div className="flex flex-wrap gap-2">
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

              {/* Like Button Action with Animated Heart */}
              <div className="pt-2">
                <button
                  onClick={() => toggleLike(lightboxProject.id)}
                  className={`w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2.5 font-semibold text-sm transition-all duration-300 ${
                    liked
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black shadow-lg shadow-[#D4AF37]/25'
                      : 'bg-white/5 hover:bg-white/10 text-[#F5F1E8] border border-white/10 hover:border-[#D4AF37]/40'
                  }`}
                >
                  <motion.div
                    whileTap={{ scale: 1.6 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        liked ? 'fill-black text-black' : 'text-[#D4AF37]'
                      }`}
                    />
                  </motion.div>
                  <span>{liked ? 'Liked Artwork' : 'Like Artwork'}</span>
                  <span className="font-mono text-xs opacity-80">
                    ({lightboxProject.likes || 0})
                  </span>
                </button>
              </div>

              {/* Comments Section */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs uppercase tracking-widest text-[#F5F1E8] font-bold flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Comments ({(lightboxProject.comments || []).length})
                  </h3>
                </div>

                {/* Comment Form */}
                <form onSubmit={handleCommentSubmit} className="space-y-2.5">
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
                      placeholder="Share your thoughts or inquiry..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      required
                      className="w-full px-3.5 py-2 rounded-lg bg-[#181818] border border-white/10 focus:border-[#D4AF37] focus:outline-none text-xs text-[#F5F1E8] placeholder-[#8A8A8A] resize-none pr-10"
                    />
                    <button
                      type="submit"
                      disabled={isSubmittingComment || !commentName.trim() || !commentText.trim()}
                      className="absolute right-2 bottom-3 p-1.5 rounded-md bg-[#D4AF37] text-black hover:bg-[#F5D77A] disabled:opacity-40 transition"
                      title="Post Comment"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>

                {/* Comment List */}
                <div className="space-y-3 pt-2">
                  {(lightboxProject.comments || []).length === 0 ? (
                    <p className="text-xs text-[#8A8A8A] italic text-center py-4">
                      No comments yet. Be the first to share your thoughts!
                    </p>
                  ) : (
                    (lightboxProject.comments || []).map((comm) => (
                      <div
                        key={comm.id}
                        className="p-3 rounded-xl bg-[#171717] border border-white/5 space-y-1 relative group"
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
                                title="Delete Comment (Admin)"
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

            {/* Bottom quick CTA */}
            <div className="p-4 bg-[#0A0A0A] border-t border-white/5 flex items-center justify-between text-xs">
              <span className="text-[#8A8A8A]">Like what you see?</span>
              <a
                href={`https://wa.me/254798405726?text=${encodeURIComponent(
                  `Hi Brian, I'm interested in a project similar to "${lightboxProject.title}" from BM Graphix.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-[#D4AF37] hover:text-[#F5D77A] flex items-center gap-1"
              >
                Inquire via WhatsApp &rarr;
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
