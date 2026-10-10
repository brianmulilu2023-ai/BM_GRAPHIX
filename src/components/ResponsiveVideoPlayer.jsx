import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, AlertCircle, RefreshCw } from 'lucide-react';
import { resolveSafeVideoUrl } from '../utils/videoHelper';

/**
 * ResponsiveVideoPlayer
 * Universal mobile-responsive video player that works across Windows desktop,
 * iPhone Safari, iPad, and Android Chrome.
 * Resolves base64 data URLs to Blob URLs so WebKit/iOS does not refuse playback.
 */
export default function ResponsiveVideoPlayer({
  src,
  poster,
  controls = true,
  autoPlay = false,
  muted = false,
  loop = false,
  className = '',
  playsInline = true,
  aspectRatio = 'auto',
  onEnded
}) {
  const videoRef = useRef(null);
  const [resolvedSrc, setResolvedSrc] = useState('');
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [isLoading, setIsLoading] = useState(true);

  // Safely resolve the video URL whenever src changes
  useEffect(() => {
    setHasError(false);
    setIsLoading(true);

    if (!src) {
      setResolvedSrc('');
      setIsLoading(false);
      return;
    }

    try {
      const safe = resolveSafeVideoUrl(src);
      setResolvedSrc(safe);
    } catch (err) {
      console.warn('Error resolving video source:', err);
      setResolvedSrc(src);
    }
  }, [src]);

  const handleLoadedData = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = (e) => {
    setIsLoading(false);
    setHasError(true);
    setErrorMessage('Media playback unavailable on this device or format not supported.');
    console.warn('Video playback error for source:', resolvedSrc, e);
  };

  const togglePlay = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch((err) => {
        console.warn('Play prevented by browser policy:', err);
      });
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const nextMuted = !videoRef.current.muted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleRetry = (e) => {
    e.stopPropagation();
    setHasError(false);
    setIsLoading(true);
    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl bg-black flex items-center justify-center ${className}`}
      style={{ aspectRatio }}
    >
      {/* Video Element */}
      {resolvedSrc && !hasError && (
        <video
          ref={videoRef}
          key={resolvedSrc}
          src={resolvedSrc}
          poster={poster || undefined}
          controls={controls}
          autoPlay={autoPlay}
          muted={autoPlay ? true : isMuted} // Autoplay on mobile strictly requires muted
          loop={loop}
          playsInline={playsInline}
          webkit-playsinline="true"
          x5-playsinline="true"
          preload="metadata"
          onLoadedData={handleLoadedData}
          onError={handleError}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={onEnded}
          className="w-full h-full max-h-[75vh] object-contain rounded-xl"
        />
      )}

      {/* Loading state indicator */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
          <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Graceful Error Fallback for Mobile */}
      {hasError && (
        <div className="p-6 text-center max-w-sm mx-auto flex flex-col items-center justify-center gap-3">
          <AlertCircle className="w-8 h-8 text-[#D4AF37]" />
          <p className="text-xs text-[#F5F1E8] font-medium leading-relaxed">
            {errorMessage}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRetry}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#D4AF37] text-black hover:brightness-110 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
            {resolvedSrc && (
              <a
                href={resolvedSrc}
                target="_blank"
                rel="noreferrer"
                download="video-asset.mp4"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-white hover:bg-white/20 transition"
              >
                <span>Download File</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
