/**
 * Cross-Device API & Sync Utility
 * Enables Windows desktop and mobile devices to stay in sync.
 * Uploads media files to the server so mobile devices receive real URLs
 * instead of choking on huge base64 strings.
 */

export async function uploadMediaToServer(dataUrl, filename = 'media-file') {
  if (!dataUrl || typeof dataUrl !== 'string') return dataUrl;

  // If already a clean path (/assets/..., /uploads/..., or http), no need to upload
  if (
    dataUrl.startsWith('/assets') ||
    dataUrl.startsWith('/uploads') ||
    dataUrl.startsWith('http')
  ) {
    return dataUrl;
  }

  // Only attempt server upload for base64 data URLs
  if (!dataUrl.startsWith('data:')) {
    return dataUrl;
  }

  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename, dataUrl })
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.url) {
        return data.url;
      }
    }
  } catch (err) {
    // Server endpoint not active (e.g. static host without node backend)
    console.info('API upload not available; falling back to client storage:', err?.message || err);
  }

  // Fallback: return dataUrl as-is for local storage
  return dataUrl;
}

export async function fetchServerProjects() {
  try {
    const res = await fetch('/api/projects');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch {
    // ignore
  }
  return null;
}

export async function saveServerProjects(projects) {
  try {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projects)
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchServerMedia() {
  try {
    const res = await fetch('/api/media');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch {
    // ignore
  }
  return null;
}

export async function saveServerMedia(mediaItems) {
  try {
    const res = await fetch('/api/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mediaItems)
    });
    return res.ok;
  } catch {
    return false;
  }
}
