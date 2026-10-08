/**
 * Media Vault Service
 * Manages all media assets across the website (Images, Videos, Logos, Artwork, Documents)
 * and custom uploaded assets stored in local persistence.
 */

const CUSTOM_MEDIA_KEY = 'bm_custom_media_vault_v2';

// Master catalog of all existing website media assets
export const SYSTEM_MEDIA_ASSETS = [
  // --- Logos & Official Brand Assets ---
  {
    id: 'media-logo-official',
    title: 'BM Graphix Official Logo (Full Color)',
    category: 'logos',
    categoryLabel: 'Logos & Identity',
    type: 'image',
    format: 'PNG',
    path: '/assets/logo/BM_OFFICIAL_LOGO.png',
    dimensions: '1000 x 1000',
    description: 'The official master circular crest logo for BM Graphix with golden gradients and typography.',
    tags: ['logo', 'official', 'brand', 'crest', 'gold'],
    isSystem: true
  },
  {
    id: 'media-logo-gold-icon',
    title: 'BM Gold Crest Icon Emblem',
    category: 'logos',
    categoryLabel: 'Logos & Identity',
    type: 'image',
    format: 'PNG',
    path: '/assets/logo/BM_ICON_GOLD.png',
    dimensions: '800 x 800',
    description: 'Gold monochrome crest icon for watermarks and favicon emblems.',
    tags: ['logo', 'emblem', 'icon', 'gold'],
    isSystem: true
  },
  {
    id: 'media-logo-gold-full',
    title: 'BM Gold Brand Signature',
    category: 'logos',
    categoryLabel: 'Logos & Identity',
    type: 'image',
    format: 'PNG',
    path: '/assets/logo/BM_LOGO_GOLD.png',
    dimensions: '1200 x 400',
    description: 'Gold typography horizontal brand header logo.',
    tags: ['logo', 'gold', 'typography'],
    isSystem: true
  },
  {
    id: 'media-logo-legacy',
    title: 'BM Monochrome Black & White Crest',
    category: 'logos',
    categoryLabel: 'Logos & Identity',
    type: 'image',
    format: 'PNG',
    path: '/assets/BM_BLCK.png',
    dimensions: '800 x 800',
    description: 'High contrast monochrome brand emblem.',
    tags: ['logo', 'monochrome', 'black'],
    isSystem: true
  },

  // --- Motion Graphics & Promo Videos ---
  {
    id: 'media-video-plains-of-hope',
    title: 'Plains of Hope 4th Oct Campaign Teaser',
    category: 'videos',
    categoryLabel: 'Motion & Promo Videos',
    type: 'video',
    format: 'MP4',
    path: '/videos/PLAINS OF HOPE 4TH OCT 2026.mp4',
    dimensions: '1080p HD',
    description: 'Cinematic gospel & conference promotional motion teaser with kinetic typography and audio sync.',
    tags: ['video', 'motion graphics', 'promo', 'conference', 'plains of hope'],
    isSystem: true
  },
  {
    id: 'media-video-eccet-intro',
    title: 'ECCET Brand Launch Motion Graphics',
    category: 'videos',
    categoryLabel: 'Motion & Promo Videos',
    type: 'video',
    format: 'MP4',
    path: '/videos/ECCET INTRO.mp4',
    dimensions: '1080p HD',
    description: 'Dynamic 3D particle reveal intro animation with gold lighting effects.',
    tags: ['video', 'intro', 'brand reveal', '3D', 'gold'],
    isSystem: true
  },
  {
    id: 'media-video-english-service',
    title: 'English Service Broadcast Motion Loop',
    category: 'videos',
    categoryLabel: 'Motion & Promo Videos',
    type: 'video',
    format: 'MP4',
    path: '/videos/ENGLISH SERVICE.mp4',
    dimensions: '1080p HD',
    description: 'Broadcast-ready animated countdown and church service title sequence.',
    tags: ['video', 'broadcast', 'service', 'countdown', 'motion'],
    isSystem: true
  },
  {
    id: 'media-video-sep26-promo',
    title: 'BM Creative Studio Reel (Sept 26)',
    category: 'videos',
    categoryLabel: 'Motion & Promo Videos',
    type: 'video',
    format: 'MP4',
    path: '/videos/26th sep 2026 bm.mp4',
    dimensions: '1080p HD',
    description: 'Short dynamic promo reel showcasing graphic transitions and beat-synced visuals.',
    tags: ['video', 'reel', 'promo', 'motion graphics'],
    isSystem: true
  },

  // --- High-End Posters & Flyer Artwork ---
  {
    id: 'media-poster-cleo',
    title: 'Cleo High Fashion Poster Series',
    category: 'posters',
    categoryLabel: 'Posters & Artwork',
    type: 'image',
    format: 'JPEG',
    path: '/assets/projects/cleo.jpeg',
    dimensions: '4:5 Editorial Ratio',
    description: 'Editorial luxury portrait artwork with gold accents and high-fashion lighting.',
    tags: ['fashion', 'poster', 'editorial', 'cleo', 'luxury'],
    isSystem: true
  },
  {
    id: 'media-poster-conference',
    title: 'Nairobi Leadership Summit 2024 Keynote Poster',
    category: 'posters',
    categoryLabel: 'Posters & Artwork',
    type: 'image',
    format: 'JPEG',
    path: '/assets/projects/conference-summit.jpeg',
    dimensions: '4:5 Event Ratio',
    description: 'Corporate summit poster with modern typography and sleek speaker callouts.',
    tags: ['conference', 'summit', 'corporate', 'poster'],
    isSystem: true
  },
  {
    id: 'media-poster-event-mb',
    title: 'Midnight Beats Neon Gala Poster',
    category: 'posters',
    categoryLabel: 'Posters & Artwork',
    type: 'image',
    format: 'JPEG',
    path: '/assets/projects/event-mb.jpeg',
    dimensions: '4:5 Party Ratio',
    description: 'High energy neon concert poster design with vibrant gradients and atmospheric glow.',
    tags: ['event', 'party', 'concert', 'neon', 'poster'],
    isSystem: true
  },
  {
    id: 'media-poster-event-gala',
    title: 'Golden Aura Awards Night Flyer',
    category: 'posters',
    categoryLabel: 'Posters & Artwork',
    type: 'image',
    format: 'JPEG',
    path: '/assets/projects/event-gala.jpeg',
    dimensions: '4:5 Gala Ratio',
    description: 'Luxury VIP awards night flyer with 3D gold typography and spark particles.',
    tags: ['gala', 'awards', 'vip', 'gold', 'flyer'],
    isSystem: true
  },
  {
    id: 'media-poster-worship-night',
    title: 'Aura of Grace Worship Experience',
    category: 'posters',
    categoryLabel: 'Posters & Artwork',
    type: 'image',
    format: 'JPEG',
    path: '/assets/projects/worship-night.jpeg',
    dimensions: '4:5 Church Ratio',
    description: 'Spiritual gospel worship event poster with celestial lighting and sacred aesthetic.',
    tags: ['worship', 'church', 'gospel', 'event', 'poster'],
    isSystem: true
  },
  {
    id: 'media-poster-youth-vibes',
    title: 'Youth Ignition Fest 2024 Flyer',
    category: 'posters',
    categoryLabel: 'Posters & Artwork',
    type: 'image',
    format: 'JPEG',
    path: '/assets/projects/youth-vibes.jpeg',
    dimensions: '4:5 Festival Ratio',
    description: 'Bold street art inspired flyer with neon accents and modern grunge textures.',
    tags: ['youth', 'festival', 'urban', 'flyer'],
    isSystem: true
  },
  {
    id: 'media-poster-album-launch',
    title: 'Album Launch Key Art Artwork',
    category: 'posters',
    categoryLabel: 'Posters & Artwork',
    type: 'image',
    format: 'JPEG',
    path: '/assets/projects/album-launch.jpeg',
    dimensions: '4:5 Music Ratio',
    description: 'Music album launch promotional poster with artist showcase typography.',
    tags: ['music', 'album', 'launch', 'poster'],
    isSystem: true
  },
  {
    id: 'media-poster-church-service',
    title: 'Sunday Celebration Worship Flyer',
    category: 'posters',
    categoryLabel: 'Posters & Artwork',
    type: 'image',
    format: 'JPEG',
    path: '/assets/projects/church-service.jpeg',
    dimensions: '4:5 Service Ratio',
    description: 'Weekly Sunday service promo flyer with clean time, venue, and minister details.',
    tags: ['church', 'sunday', 'service', 'flyer'],
    isSystem: true
  },
  {
    id: 'media-poster-creative-flyer',
    title: 'Creative Masterclass Flyer',
    category: 'posters',
    categoryLabel: 'Posters & Artwork',
    type: 'image',
    format: 'JPEG',
    path: '/assets/projects/creative-flyer.jpeg',
    dimensions: '4:5 Workshop Ratio',
    description: 'Design workshop and masterclass promotional flyer.',
    tags: ['masterclass', 'workshop', 'creative', 'flyer'],
    isSystem: true
  },
  {
    id: 'media-poster-joyce',
    title: 'Celebration of Life Memorial Artwork (Joyce)',
    category: 'posters',
    categoryLabel: 'Posters & Artwork',
    type: 'image',
    format: 'JPEG',
    path: '/assets/projects/joyce.jpeg',
    dimensions: '4:5 Tribute Ratio',
    description: 'Elegant memorial and funeral program cover artwork with soft floral elements.',
    tags: ['memorial', 'tribute', 'program', 'poster'],
    isSystem: true
  },
  {
    id: 'media-poster-kasyoki',
    title: 'Kasyoki Memorial Tribute Flyer',
    category: 'posters',
    categoryLabel: 'Posters & Artwork',
    type: 'image',
    format: 'JPEG',
    path: '/assets/projects/kasyoki.jpeg',
    dimensions: '4:5 Tribute Ratio',
    description: 'Honorary memorial bulletin cover designed with dignity and solemn grace.',
    tags: ['memorial', 'tribute', 'poster'],
    isSystem: true
  },
  {
    id: 'media-poster-lydia',
    title: 'Lydia Memorial Celebration Design',
    category: 'posters',
    categoryLabel: 'Posters & Artwork',
    type: 'image',
    format: 'JPEG',
    path: '/assets/projects/lydia.jpeg',
    dimensions: '4:5 Tribute Ratio',
    description: 'Bespoke celebration of life artwork and program cover.',
    tags: ['memorial', 'tribute', 'poster'],
    isSystem: true
  },
  {
    id: 'media-poster-paul',
    title: 'Paul Tribute & Service Announcement',
    category: 'posters',
    categoryLabel: 'Posters & Artwork',
    type: 'image',
    format: 'JPEG',
    path: '/assets/projects/paul.jpeg',
    dimensions: '4:5 Tribute Ratio',
    description: 'Memorial service announcement with warm gold accents and royal dark tones.',
    tags: ['memorial', 'tribute', 'poster'],
    isSystem: true
  },
  {
    id: 'media-poster-sharon',
    title: 'Sharon Commemorative Memorial Poster',
    category: 'posters',
    categoryLabel: 'Posters & Artwork',
    type: 'image',
    format: 'JPEG',
    path: '/assets/projects/sharon.jpeg',
    dimensions: '4:5 Tribute Ratio',
    description: 'Commemorative service brochure artwork with refined gold calligraphy.',
    tags: ['memorial', 'tribute', 'poster'],
    isSystem: true
  },
  {
    id: 'media-poster-cosmas',
    title: 'Cosmas Memorial Service Artwork',
    category: 'posters',
    categoryLabel: 'Posters & Artwork',
    type: 'image',
    format: 'JPEG',
    path: '/assets/projects/cosmas.jpeg',
    dimensions: '4:5 Tribute Ratio',
    description: 'Solemn commemorative portrait design for celebration of life.',
    tags: ['memorial', 'tribute', 'poster'],
    isSystem: true
  },
  {
    id: 'media-poster-zenia',
    title: 'Zenia Brand Campaign & Billboard Art',
    category: 'posters',
    categoryLabel: 'Posters & Artwork',
    type: 'image',
    format: 'JPEG',
    path: '/assets/projects/zenia.jpeg',
    dimensions: 'Ultra-High Res Poster',
    description: 'Billboard and commercial campaign poster with punchy contrast and sharp branding.',
    tags: ['branding', 'campaign', 'commercial', 'billboard', 'poster'],
    isSystem: true
  },
  {
    id: 'media-poster-manipulation',
    title: 'Surreal Visual Concept Manipulation',
    category: 'posters',
    categoryLabel: 'Posters & Artwork',
    type: 'image',
    format: 'JPEG',
    path: '/assets/projects/manipulation.jpeg',
    dimensions: '4:5 Concept Ratio',
    description: 'High-end Photoshop photo composite and surreal visual design piece.',
    tags: ['manipulation', 'photoshop', 'composite', 'surreal', 'art'],
    isSystem: true
  },
  {
    id: 'media-poster-music-live',
    title: 'Live Acoustic Session Promo Artwork',
    category: 'posters',
    categoryLabel: 'Posters & Artwork',
    type: 'image',
    format: 'JPEG',
    path: '/assets/projects/music-live.jpeg',
    dimensions: '4:5 Concert Ratio',
    description: 'Acoustic lounge concert poster with moody lighting and warm gold glow.',
    tags: ['music', 'live', 'concert', 'acoustic', 'poster'],
    isSystem: true
  },

  // --- Portraits & Site Background Visuals ---
  {
    id: 'media-photo-brian-mulilu',
    title: 'Brian Mulilu — Designer Headshot Portrait',
    category: 'portraits',
    categoryLabel: 'Portraits & Site Visuals',
    type: 'image',
    format: 'JPEG',
    path: '/assets/brian-mulilu.jpg',
    dimensions: 'High-Res Portrait',
    description: 'Official profile photo of Brian Mulilu, founder and creative director of BM Graphix.',
    tags: ['portrait', 'brian', 'profile', 'headshot'],
    isSystem: true
  },
  {
    id: 'media-photo-designer-photo',
    title: 'Brian Mulilu — Creative Studio Photo',
    category: 'portraits',
    categoryLabel: 'Portraits & Site Visuals',
    type: 'image',
    format: 'JPEG',
    path: '/assets/designer-photo.jpg',
    dimensions: 'High-Res Portrait',
    description: 'Creative in-studio portrait for about section and press kits.',
    tags: ['portrait', 'studio', 'brian'],
    isSystem: true
  },
  {
    id: 'media-photo-nairobi-cbd',
    title: 'Nairobi CBD Skyline Panorama',
    category: 'portraits',
    categoryLabel: 'Portraits & Site Visuals',
    type: 'image',
    format: 'JPEG',
    path: '/assets/nairobi-cbd.jpg',
    dimensions: 'Wide Panorama',
    description: 'Night cityscape background photo representing BM Graphix base of operations in Nairobi.',
    tags: ['nairobi', 'cbd', 'city', 'background', 'skyline'],
    isSystem: true
  },
  {
    id: 'media-photo-lab',
    title: 'Creative Workstation & Workspace (Lab)',
    category: 'portraits',
    categoryLabel: 'Portraits & Site Visuals',
    type: 'image',
    format: 'JPEG',
    path: '/assets/lab.jpg',
    dimensions: 'Landscape 16:9',
    description: 'Studio creative setup photo used across service cards and process slides.',
    tags: ['studio', 'workspace', 'setup'],
    isSystem: true
  },
  {
    id: 'media-photo-lap',
    title: 'Creative Rendering Station (Laptop/Mac)',
    category: 'portraits',
    categoryLabel: 'Portraits & Site Visuals',
    type: 'image',
    format: 'JPEG',
    path: '/assets/lap.jpg',
    dimensions: 'Landscape 16:9',
    description: 'High-end design and color-grading workstation photo.',
    tags: ['workstation', 'hardware', 'laptop'],
    isSystem: true
  },
  {
    id: 'media-doc-cv',
    title: 'Brian Mulilu Curriculum Vitae (CV / Resume)',
    category: 'portraits',
    categoryLabel: 'Portraits & Site Visuals',
    type: 'document',
    format: 'PDF',
    path: '/assets/Brian_Mulilu_CV.pdf',
    dimensions: 'Document',
    description: 'Official downloadable CV for client discovery and corporate proposals.',
    tags: ['cv', 'resume', 'pdf', 'document'],
    isSystem: true
  }
];

class MediaService {
  constructor() {
    this.init();
  }

  init() {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem(CUSTOM_MEDIA_KEY)) {
      localStorage.setItem(CUSTOM_MEDIA_KEY, JSON.stringify([]));
    }
  }

  getCustomMedia() {
    try {
      const data = localStorage.getItem(CUSTOM_MEDIA_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  getAllMedia() {
    const custom = this.getCustomMedia();
    return [...custom, ...SYSTEM_MEDIA_ASSETS];
  }

  addMediaItem(item) {
    const custom = this.getCustomMedia();
    const newMedia = {
      id: `custom-media-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: item.title || 'Uploaded Media Asset',
      category: item.category || 'posters',
      categoryLabel: item.categoryLabel || this.getCategoryLabel(item.category),
      type: item.type || (item.path.includes('.mp4') || item.path.includes('video') ? 'video' : 'image'),
      format: item.format || (item.path.startsWith('data:image/png') ? 'PNG' : item.path.startsWith('data:video') ? 'MP4' : 'JPEG'),
      path: item.path,
      dimensions: item.dimensions || 'Uploaded Custom',
      description: item.description || 'Uploaded via BM Graphix Media Vault',
      tags: Array.isArray(item.tags) ? item.tags : (item.tags ? item.tags.split(',').map(t => t.trim()) : ['custom', 'upload']),
      createdAt: new Date().toISOString(),
      isCustom: true
    };

    const updated = [newMedia, ...custom];
    localStorage.setItem(CUSTOM_MEDIA_KEY, JSON.stringify(updated));
    return newMedia;
  }

  deleteMediaItem(id) {
    const custom = this.getCustomMedia();
    const filtered = custom.filter(m => m.id !== id);
    localStorage.setItem(CUSTOM_MEDIA_KEY, JSON.stringify(filtered));
    return true;
  }

  getCategoryLabel(cat) {
    switch (cat) {
      case 'logos': return 'Logos & Identity';
      case 'videos': return 'Motion & Promo Videos';
      case 'posters': return 'Posters & Artwork';
      case 'portraits': return 'Portraits & Site Visuals';
      default: return 'Custom Assets';
    }
  }
}

export const mediaService = new MediaService();
