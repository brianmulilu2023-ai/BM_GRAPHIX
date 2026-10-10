/**
 * Client-Side Media Processing & Compression Utility
 * Supports high-resolution images (JPG, JPEG, PNG, WEBP) and motion videos (MP4, WebM, MOV).
 * Extracts crisp preview frames from MP4 videos for poster thumbnails.
 * Preserves PNG transparency and compresses images to crisp web dimensions.
 */

export function compressImage(fileOrDataUrl, maxWidth = 1400, quality = 0.82) {
  return new Promise((resolve, reject) => {
    // If it's already a static asset path, uploads path, or http link, return as is
    if (
      typeof fileOrDataUrl === 'string' &&
      (fileOrDataUrl.startsWith('/assets') ||
        fileOrDataUrl.startsWith('/uploads') ||
        fileOrDataUrl.startsWith('http'))
    ) {
      return resolve(fileOrDataUrl);
    }

    // Safety guard: if a video file or video dataUrl was passed by accident, don't try Image()
    if (
      (fileOrDataUrl instanceof File || fileOrDataUrl instanceof Blob) &&
      (fileOrDataUrl.type.startsWith('video/') || /\.(mp4|webm|mov|m4v)$/i.test(fileOrDataUrl.name || ''))
    ) {
      return resolve('');
    }
    if (typeof fileOrDataUrl === 'string' && fileOrDataUrl.startsWith('data:video')) {
      return resolve('');
    }

    const isPng = (fileOrDataUrl instanceof Blob || fileOrDataUrl instanceof File)
      ? (fileOrDataUrl.type === 'image/png' || /\.png$/i.test(fileOrDataUrl.name || ''))
      : (typeof fileOrDataUrl === 'string' && fileOrDataUrl.startsWith('data:image/png'));

    const img = new Image();
    img.crossOrigin = 'anonymous';

    let objectUrlToRevoke = null;
    const cleanup = () => {
      if (objectUrlToRevoke) {
        try {
          URL.revokeObjectURL(objectUrlToRevoke);
        } catch {
          // ignore
        }
        objectUrlToRevoke = null;
      }
    };

    img.onload = () => {
      try {
        let width = img.width;
        let height = img.height;

        // Calculate proportional dimensions
        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          cleanup();
          return resolve(typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '');
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // For PNGs with transparency, export as PNG to avoid black backgrounds; for JPG/JPEG, export as JPEG
        const mimeType = isPng ? 'image/png' : 'image/jpeg';
        const compressedDataUrl = canvas.toDataURL(mimeType, isPng ? undefined : quality);
        cleanup();
        resolve(compressedDataUrl);
      } catch (err) {
        cleanup();
        console.warn('Image compression fallback:', err);
        resolve(typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '');
      }
    };

    img.onerror = () => {
      cleanup();
      resolve(typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '');
    };

    if (typeof fileOrDataUrl === 'string') {
      img.src = fileOrDataUrl;
    } else if (fileOrDataUrl instanceof Blob || fileOrDataUrl instanceof File) {
      try {
        objectUrlToRevoke = URL.createObjectURL(fileOrDataUrl);
        img.src = objectUrlToRevoke;
      } catch {
        const reader = new FileReader();
        reader.onload = (e) => {
          img.src = e.target.result;
        };
        reader.onerror = () => {
          cleanup();
          reject(new Error('Failed to read image file'));
        };
        reader.readAsDataURL(fileOrDataUrl);
      }
    } else {
      resolve('');
    }
  });
}

/**
 * Process and compress multiple image files concurrently with progress updates
 */
export async function compressMultipleImages(files, onProgress) {
  const fileList = Array.from(files);
  const results = [];
  const total = fileList.length;

  for (let i = 0; i < total; i++) {
    const file = fileList[i];
    try {
      const compressed = await compressImage(file, 1400, 0.82);
      if (compressed) {
        results.push(compressed);
      }
    } catch (err) {
      console.error('Error compressing file:', file.name, err);
    }
    if (onProgress) {
      onProgress(Math.round(((i + 1) / total) * 100));
    }
  }

  return results;
}

/**
 * Extract an optimized JPEG poster/thumbnail from an MP4, WebM, or MOV video file or Data URL.
 * Automatically seeks to 1.0 second (or 50% for short videos) and renders the frame to canvas.
 */
export function generateVideoThumbnail(fileOrUrl, seekTime = 1) {
  return new Promise((resolve) => {
    try {
      if (!fileOrUrl) return resolve(null);

      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;
      video.setAttribute('playsinline', 'true');
      video.setAttribute('webkit-playsinline', 'true');
      video.setAttribute('muted', 'true');

      let objectUrl = null;
      if (typeof fileOrUrl === 'string') {
        video.src = fileOrUrl;
      } else if (fileOrUrl instanceof Blob || fileOrUrl instanceof File) {
        objectUrl = URL.createObjectURL(fileOrUrl);
        video.src = objectUrl;
      } else {
        return resolve(null);
      }

      let isFinished = false;
      const finish = (result) => {
        if (isFinished) return;
        isFinished = true;
        if (objectUrl) {
          try {
            URL.revokeObjectURL(objectUrl);
          } catch {
            // ignore
          }
        }
        resolve(result);
      };

      video.onloadedmetadata = () => {
        try {
          const duration = video.duration || 1;
          const target = duration > 0.6 ? Math.min(seekTime, duration / 2) : 0.1;
          video.currentTime = target;
        } catch {
          finish(null);
        }
      };

      video.onseeked = () => {
        try {
          const canvas = document.createElement('canvas');
          const maxW = 1200;
          let w = video.videoWidth || 1280;
          let h = video.videoHeight || 720;
          if (w > maxW) {
            h = Math.round((h * maxW) / w);
            w = maxW;
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0, w, h);
            const thumbDataUrl = canvas.toDataURL('image/jpeg', 0.85);
            finish(thumbDataUrl);
            return;
          }
        } catch (e) {
          console.warn('Video frame capture error:', e);
        }
        finish(null);
      };

      video.onerror = () => finish(null);

      // Fallback timeout in case seeked doesn't fire within 4s
      setTimeout(() => finish(null), 4000);
    } catch (err) {
      console.warn('generateVideoThumbnail failure:', err);
      resolve(null);
    }
  });
}
