/**
 * Video Helper Utility
 * Solves mobile playback issues (iOS Safari / WebKit and Android) where
 * data:video/mp4;base64 URLs refuse to play in native <video> elements.
 * Converts base64 data URLs to seekable Blob Object URLs.
 */

const blobUrlCache = new Map();

/**
 * Convert a base64 Data URL to a native binary Blob
 */
export function dataUrlToBlob(dataUrl) {
  if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) {
    return null;
  }
  try {
    const parts = dataUrl.split(',');
    if (parts.length < 2) return null;

    const mimeMatch = parts[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'video/mp4';
    const binaryStr = atob(parts[1]);
    const len = binaryStr.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    return new Blob([bytes], { type: mime });
  } catch (e) {
    console.warn('dataUrlToBlob conversion failed:', e);
    return null;
  }
}

/**
 * Resolves any video URL into a mobile-compatible playback source.
 * Converts data:video/ base64 URLs into Blob URLs (which iOS Safari supports),
 * while passing regular HTTP/HTTPS and static asset paths (/videos/..., /uploads/...) as is.
 */
export function resolveSafeVideoUrl(url) {
  if (!url || typeof url !== 'string') return '';

  // If already a normal URL or Blob URL, use directly
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('/') ||
    url.startsWith('blob:')
  ) {
    return url;
  }

  // If it's a base64 data URL, convert to Blob Object URL for iOS/mobile compatibility
  if (url.startsWith('data:video/')) {
    if (blobUrlCache.has(url)) {
      return blobUrlCache.get(url);
    }
    const blob = dataUrlToBlob(url);
    if (blob) {
      try {
        const objectUrl = URL.createObjectURL(blob);
        blobUrlCache.set(url, objectUrl);
        return objectUrl;
      } catch (err) {
        console.warn('Failed to create Blob URL for video:', err);
      }
    }
  }

  return url;
}

/**
 * Check if the current browser environment is a mobile device (iOS/Android)
 */
export function isMobileDevice() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
