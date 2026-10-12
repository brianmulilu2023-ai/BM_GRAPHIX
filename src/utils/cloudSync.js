/**
 * Supabase Cloud Sync Utility
 * Handles cross-browser/cross-device synchronization via Supabase.
 *
 * - Media files   → Supabase Storage bucket "media" (public URLs)
 * - Media list    → Supabase table "media_items"
 * - Project list  → Supabase table "projects"
 *
 * Gracefully degrades to local-only if Supabase is not configured.
 */

import { getSupabaseClient, isSupabaseConfigured } from './supabase';

// ─── File Upload to Supabase Storage ────────────────────────────────────────

/**
 * Uploads a base64 dataUrl to Supabase Storage and returns the public URL.
 * Falls back to returning the dataUrl as-is if Supabase isn't available.
 */
export async function uploadFileToCloud(dataUrl, filename = 'media-file') {
  if (!dataUrl || typeof dataUrl !== 'string') return dataUrl;

  // Already a hosted URL — nothing to do
  if (
    dataUrl.startsWith('http') ||
    dataUrl.startsWith('/assets') ||
    dataUrl.startsWith('/videos') ||
    dataUrl.startsWith('/uploads')
  ) {
    return dataUrl;
  }

  if (!dataUrl.startsWith('data:')) return dataUrl;

  if (!isSupabaseConfigured()) {
    console.info('[CloudSync] Supabase not configured. Using local data URL.');
    return dataUrl;
  }

  try {
    const supabase = getSupabaseClient();

    // Convert base64 dataUrl to Blob
    const [header, base64] = dataUrl.split(',');
    const mimeMatch = header.match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: mime });

    // Derive extension from mime
    const extMap = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp',
      'video/mp4': 'mp4',
      'video/webm': 'webm',
      'video/quicktime': 'mov',
    };
    const ext = extMap[mime] || 'bin';
    const safeName = filename.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const path = `uploads/${Date.now()}-${safeName}.${ext}`;

    const { error } = await supabase.storage
      .from('media')
      .upload(path, blob, { contentType: mime, upsert: false });

    if (error) {
      console.warn('[CloudSync] Upload error:', error.message);
      return dataUrl; // fallback
    }

    const { data: publicData } = supabase.storage
      .from('media')
      .getPublicUrl(path);

    return publicData?.publicUrl || dataUrl;
  } catch (err) {
    console.warn('[CloudSync] Upload exception:', err?.message || err);
    return dataUrl;
  }
}

// ─── Projects Sync ───────────────────────────────────────────────────────────

const PROJECT_ROW_ID = 'bm_graphix_projects';

/**
 * Fetches projects from Supabase.
 * Returns null if unavailable so caller falls back to local storage.
 */
export async function fetchCloudProjects() {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('projects')
      .select('data')
      .eq('id', PROJECT_ROW_ID)
      .single();

    if (error || !data) return null;
    const parsed = Array.isArray(data.data) ? data.data : null;
    return parsed && parsed.length > 0 ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Saves projects to Supabase (upsert).
 */
export async function saveCloudProjects(projects) {
  if (!isSupabaseConfigured()) return false;
  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from('projects')
      .upsert({ id: PROJECT_ROW_ID, data: projects }, { onConflict: 'id' });

    if (error) {
      console.warn('[CloudSync] Save projects error:', error.message);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

// ─── Media Sync ──────────────────────────────────────────────────────────────

const MEDIA_ROW_ID = 'bm_graphix_media';

/**
 * Fetches custom media items from Supabase.
 */
export async function fetchCloudMedia() {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('media_items')
      .select('data')
      .eq('id', MEDIA_ROW_ID)
      .single();

    if (error || !data) return null;
    const parsed = Array.isArray(data.data) ? data.data : null;
    return parsed && parsed.length > 0 ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Saves custom media list to Supabase (upsert).
 */
export async function saveCloudMedia(mediaItems) {
  if (!isSupabaseConfigured()) return false;
  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from('media_items')
      .upsert({ id: MEDIA_ROW_ID, data: mediaItems }, { onConflict: 'id' });

    if (error) {
      console.warn('[CloudSync] Save media error:', error.message);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
