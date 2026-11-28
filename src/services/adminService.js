/**
 * Admin Service
 * Handles admin authentication, customized credentials, profile details, and session management.
 */

const ADMIN_STORAGE_KEY = 'bm_admin_authenticated';
const ADMIN_ACCOUNT_KEY = 'bm_admin_account_v2';
const SITE_SETTINGS_KEY = 'bm_site_settings_v1';

export const DEFAULT_ADMIN = {
  email: 'admin@bmgraphix.com',
  name: 'Brian Mulilu',
  role: 'Creative Director & Lead Designer',
  phone: '+254 798 405 726',
  avatar: '/assets/brian-mulilu.jpg',
  passwordHash: 'admin123', // Demo authentication
  createdAt: '2024-01-01T00:00:00.000Z'
};

export const DEFAULT_SHOWCASE_ITEMS = [
  { id: 'sc-1', src: '/assets/projects/event-mb.jpeg', label: 'Event Promo' },
  { id: 'sc-2', src: '/assets/projects/zenia.jpeg', label: 'Motion Identity' },
  { id: 'sc-3', src: '/assets/projects/kasyoki.jpeg', label: 'Concert Key Art' },
  { id: 'sc-4', src: '/assets/projects/cleo.jpeg', label: 'Fashion Campaign' },
  { id: 'sc-5', src: '/assets/projects/manipulation.jpeg', label: 'Digital Art' },
];

export const DEFAULT_TICKER_IMAGES = [
  { id: 'tk-1', src: '/assets/projects/cleo.jpeg', title: 'Double Exposure Portrait', category: 'Creative Artwork' },
  { id: 'tk-2', src: '/assets/projects/event-mb.jpeg', title: 'Mbaka Orea Gospel Live', category: 'Broadcast & Event' },
  { id: 'tk-3', src: '/assets/projects/kasyoki.jpeg', title: 'Kasyoki Concert Promo', category: 'Music & Concert' },
  { id: 'tk-4', src: '/assets/projects/zenia.jpeg', title: 'Motion Brand Identity', category: 'Motion Art' },
  { id: 'tk-5', src: '/assets/projects/manipulation.jpeg', title: 'Conceptual Photo Manipulation', category: 'Digital Art' },
  { id: 'tk-6', src: '/assets/projects/event-gala.jpeg', title: 'Exclusive Gala Night', category: 'Event Branding' },
  { id: 'tk-7', src: '/assets/projects/creative-flyer.jpeg', title: 'Modern Creative Flyer', category: 'Poster Design' },
  { id: 'tk-8', src: '/assets/projects/worship-night.jpeg', title: 'Worship Experience', category: 'Key Visual' },
];

export const DEFAULT_SITE_SETTINGS = {
  brandName: 'BM Graphix',
  tagline: 'Designs That Move People',
  whatsappNumber: '254798405726',
  contactEmail: 'brianmulilu2023@gmail.com',
  location: 'Nairobi CBD, Kenya',
  availabilityStatus: 'available', // 'available' | 'busy' | 'limited'
  availabilityText: 'Available for commissions & full-time roles',
  heroHeadline: 'Visual Artist & Motion Designer',
  instagram: 'https://instagram.com',
  behance: 'https://behance.net',
  youtube: 'https://youtube.com',

  // Hero Right Section Rotating Showcase Cards (Customizable & Uploadable by Admin)
  heroShowcaseItems: DEFAULT_SHOWCASE_ITEMS,
  heroShowcaseInterval: 3200, // milliseconds per rotation

  // Active Atmosphere Editing Page: 'home' | 'work' | 'global'
  atmosphereActivePage: 'home',

  // Home / Landing Page Atmosphere Controls
  heroBgImage: '/assets/nairobi-cbd.jpg',
  heroBgVisibility: 55, // 0 to 100%
  heroDarkOverlay: 70, // 0 to 100%
  nairobiSkylineOpacity: 70, // 0 to 100% (crystal clear & prominent)
  goldGlowIntensity: 70, // 0 to 100%
  particlesVisibility: 55, // 0 to 100%

  // Endless Masterpiece Ticker Controls (Customizable & Uploadable by Admin)
  tickerEnabled: true,
  tickerSpeed: 55, // seconds per full loop (20 = fast, 55 = balanced, 95 = slow)
  tickerDirection: 'left', // 'left' | 'right'
  tickerSize: 'small', // 'small' | 'medium' | 'large'
  tickerPadding: 'small', // 'small' | 'medium' | 'large'
  tickerSource: 'both', // 'custom' | 'projects' | 'both'
  tickerCustomImages: DEFAULT_TICKER_IMAGES,
  tickerTitle: 'The Endless Masterpiece Ticker',
  tickerSubtitle: 'Hover to pause · Click any card to open the full project. Live feed of every published BM Graphix work.',

  // Work / Portfolio Page Atmosphere Controls (with 100% crystal clear capability)
  workBgImage: '/assets/nairobi-cbd.jpg',
  workNairobiSkylineOpacity: 55, // 0 to 100% (allows up to 100% crystal clear Nairobi peak)
  workNairobiClarity: 85, // 0 to 100% (100% = 0px blur, high micro-contrast & razor sharpness)
  workDarkOverlay: 70, // 0 to 100%
  workGoldGlow: 65, // 0 to 100%
  workParticles: 50, // 0 to 100%

  // Global Atmosphere / Other Pages
  globalBgImage: '/assets/nairobi-cbd.jpg',
  globalNairobiSkylineOpacity: 20, // 0 to 100%
  globalDarkOverlay: 80, // 0 to 100%
  globalGoldGlow: 60, // 0 to 100%
  globalParticles: 45, // 0 to 100%

  // Per-Branding Presets & Custom Palette
  activeBrandPreset: 'bm-official',
  brandPrimaryColor: '#E2AA00',
  brandSecondaryColor: '#FECD00',
  brandDarkColor: '#8C5800',

  // Centralized Light & Dark Mode Brand Theme (Editable in Admin -> Brand & Theme Settings)
  brandTheme: {
    light: {
      primary: '#E2AA00',
      secondary: '#8C5800',
      accent: '#C38C00',
      heading: '#250C00',
      body: '#250C00',
      shapeButton: '#E2AA00',
      secondaryText: '#6B3E00',
      buttonText: '#250C00',
      icon: '#8C5800',
      border: '#C38C00'
    },
    dark: {
      primary: '#E2AA00',
      secondary: '#C38C00',
      accent: '#FECD00',
      heading: '#FFFFFF',
      body: '#FFFFFF',
      shapeButton: '#E2AA00',
      secondaryText: '#FECD00',
      buttonText: '#250C00',
      icon: '#E2AA00',
      border: '#6B3E00'
    }
  },

  // Editable Pages Content (About, Services, Contact)
  aboutPage: {
    badge: 'The Vision Behind The Craft',
    title: 'I craft designs that move people and build iconic legacies.',
    paragraphs: [
      'I am Brian Mulilu, a passionate Nairobi-based graphic designer and motion artist. Under my banner BM Graphix, I bridge the gap between static design precision and kinetic cinema.',
      'My work spans broadcast motion packages for media giants like Royal Media Services, sold-out concert tour key visuals, luxury brand identities, and high-impact digital photo manipulations.',
      'Every typography choice, lighting gradient, and keyframe is treated with surgical intentionality. I believe extraordinary brands don’t whisper—they resonate with unmistakable confidence.'
    ],
    experienceYears: '5+ Years',
    clientsCount: '40+ Brands',
    projectsCompleted: '150+ Projects',
    skills: [
      { name: 'Adobe Photoshop (Poster Art & Manipulation)', level: 98 },
      { name: 'Adobe Illustrator (Vector Branding & Logos)', level: 95 },
      { name: 'After Effects (2D/3D Motion Graphics)', level: 92 },
      { name: 'Premiere Pro (Commercial Video Editing)', level: 90 },
      { name: 'Brand Strategy & Typographic Hierarchy', level: 94 },
      { name: 'Cinema 4D / Blender (3D Stage Visuals)', level: 82 }
    ],
    timeline: [
      {
        period: '2023 — Present',
        role: 'Senior Motion Graphic Designer & Broadcast Artist',
        company: 'Royal Media Services (RMS)',
        location: 'Nairobi, Kenya',
        description: 'Lead broadcast graphics designer for prime-time programming, news packages, dynamic lower thirds, promotional trailers, and high-impact animated television stingers viewed by millions across Kenya daily.',
        current: true
      },
      {
        period: '2021 — Present',
        role: 'Founder & Lead Creative Director',
        company: 'BM Graphix',
        location: 'Nairobi, Kenya',
        description: 'Founded independent design studio serving over 40+ brands, recording artists, and event organizers. Delivered 150+ bespoke concert key visuals, 3D billboard motion loops, and luxury brand identity rollouts.',
        current: true
      },
      {
        period: '2019 — 2021',
        role: 'Visual Designer & Print Specialist',
        company: 'Digital Wave Creative Studio',
        location: 'Nairobi, Kenya',
        description: 'Handled high-volume corporate branding, large-format billboard print layouts, packaging graphics, and commercial social media marketing assets.',
        current: false
      }
    ]
  },

  servicesPage: {
    badge: 'Professional Creative Solutions',
    title: 'Services That Elevate',
    subtitle: 'From viral event flyers to cinema-standard broadcast packages, every piece is meticulously engineered to stand out and deliver results.',
    servicesList: [
      {
        id: 'posters',
        iconName: 'Palette',
        title: 'Poster & Flyer Design',
        category: 'Print & Digital Key Art',
        desc: 'High-impact visual key visuals engineered for maximum conversions, concert attendance, and social engagement.',
        deliverables: [
          'Cinematic Concert & Festival Tour Posters',
          'Church, Gospel & Worship Night Artwork',
          'Social Media Multi-Format Ad Packs (Feed, Story, Reel Covers)',
          '300+ DPI Print-Ready CMYK Files & Vector Source',
          'Custom 3D & Typographic Title Treatment'
        ],
        turnaround: '24–72 hours',
        popular: true
      },
      {
        id: 'branding',
        iconName: 'Layers',
        title: 'Logo & Visual Identity',
        category: 'Comprehensive Branding Systems',
        desc: 'Distinctive, memorable emblems and comprehensive corporate design manuals that position brands at the pinnacle of their industry.',
        deliverables: [
          'Primary Logo, Monogram & Sub-mark Variations',
          'Color Palette, Typography Pairing & Hierarchy Guidelines',
          'Business Cards, Letterheads & Brand Stationery',
          'Social Media Brand Kit & Profile Avatars',
          'Full Brand Style Manual PDF + Vector SVG / AI / EPS Files'
        ],
        turnaround: '5–10 business days',
        popular: false
      },
      {
        id: 'motion',
        iconName: 'Tv',
        title: 'Motion Graphics & 3D Art',
        category: 'Kinetic Visuals',
        desc: 'Breathtaking 3D kinetic typography, LED billboard loops, and broadcast-ready package elements for live screens and TV.',
        deliverables: [
          'Kinetic Typography Lyric & Speech Videos',
          '3D Stage LED Screen Loop Visuals',
          'Broadcast News / TV Show Lower Thirds & Stingers',
          'Animated Logo Ident Reveals & Outros',
          'Ultra HD 4K Apple ProRes & H.264 Deliverables'
        ],
        turnaround: '3–7 business days',
        popular: true
      },
      {
        id: 'video',
        iconName: 'Film',
        title: 'Video Promo & Commercials',
        category: 'Commercial Video Animation',
        desc: 'Cinema-grade video trailers and promotional reels designed to captivate audiences and trigger immediate action.',
        deliverables: [
          'Event Countdown & Speaker Announcement Trailers',
          'Commercial Product Teasers & 3D Mockup Displays',
          'Vertical Short-Form Promos (TikTok & Instagram Reels)',
          'Sound Design & Audio-Reactive Visual Synths',
          'Multi-Aspect Ratio Deliverables (16:9, 9:16, 1:1, 4:5)'
        ],
        turnaround: '4–8 business days',
        popular: false
      }
    ]
  },

  contactPage: {
    badge: "Let's Build Something Iconic",
    title: 'Get in Touch',
    subtitle: 'Ready to launch a high-impact campaign, redesign your visual identity, or animate cinematic motion graphics? Reach out via phone, WhatsApp, or the brief form below.',
    whatsappNumber: '+254 798 405 726',
    whatsappMessage: 'Hi Brian! I visited your BM Graphix portfolio and would love to discuss a project.',
    callNumber: '+254 798 405 726',
    email: 'brianmulilu2023@gmail.com',
    location: 'Nairobi Central Business District (CBD), Kenya',
    workingHours: 'Monday — Saturday: 8:00 AM — 8:00 PM EAT',
    availabilityNote: 'Currently accepting new freelance projects and corporate contracts.'
  }
};

export const DEFAULT_BRAND_THEME = DEFAULT_SITE_SETTINGS.brandTheme;

class AdminService {
  constructor() {
    this.init();
  }

  init() {
    if (typeof window === 'undefined') return;
    try {
      if (!localStorage.getItem(ADMIN_ACCOUNT_KEY)) {
        localStorage.setItem(ADMIN_ACCOUNT_KEY, JSON.stringify(DEFAULT_ADMIN));
      }
      if (!localStorage.getItem(SITE_SETTINGS_KEY)) {
        localStorage.setItem(SITE_SETTINGS_KEY, JSON.stringify(DEFAULT_SITE_SETTINGS));
      }
    } catch {
      // localStorage restricted or disabled
    }
  }

  getAdminAccount() {
    try {
      const data = localStorage.getItem(ADMIN_ACCOUNT_KEY);
      return data ? JSON.parse(data) : DEFAULT_ADMIN;
    } catch {
      return DEFAULT_ADMIN;
    }
  }

  updateAdminAccount(updatedData) {
    const current = this.getAdminAccount();
    const updated = { ...current, ...updatedData, updatedAt: new Date().toISOString() };
    localStorage.setItem(ADMIN_ACCOUNT_KEY, JSON.stringify(updated));
    return updated;
  }

  updatePassword(newPassword) {
    if (!newPassword || newPassword.length < 4) {
      throw new Error('Password must be at least 4 characters long.');
    }
    const current = this.getAdminAccount();
    current.passwordHash = newPassword;
    current.updatedAt = new Date().toISOString();
    localStorage.setItem(ADMIN_ACCOUNT_KEY, JSON.stringify(current));
    return true;
  }

  getSiteSettings() {
    try {
      const data = localStorage.getItem(SITE_SETTINGS_KEY);
      if (!data) return DEFAULT_SITE_SETTINGS;
      const parsed = JSON.parse(data);
      return {
        ...DEFAULT_SITE_SETTINGS,
        ...parsed,
        heroShowcaseItems:
          Array.isArray(parsed?.heroShowcaseItems) && parsed.heroShowcaseItems.length > 0
            ? parsed.heroShowcaseItems
            : DEFAULT_SHOWCASE_ITEMS,
        brandTheme: {
          light: { ...DEFAULT_BRAND_THEME.light, ...(parsed?.brandTheme?.light || {}) },
          dark: { ...DEFAULT_BRAND_THEME.dark, ...(parsed?.brandTheme?.dark || {}) }
        },
        aboutPage: {
          ...DEFAULT_SITE_SETTINGS.aboutPage,
          ...(parsed?.aboutPage || {})
        },
        servicesPage: {
          ...DEFAULT_SITE_SETTINGS.servicesPage,
          ...(parsed?.servicesPage || {})
        },
        contactPage: {
          ...DEFAULT_SITE_SETTINGS.contactPage,
          ...(parsed?.contactPage || {})
        }
      };
    } catch {
      return DEFAULT_SITE_SETTINGS;
    }
  }

  updateSiteSettings(newSettings) {
    const current = this.getSiteSettings();
    const updated = { ...current, ...newSettings, updatedAt: new Date().toISOString() };
    localStorage.setItem(SITE_SETTINGS_KEY, JSON.stringify(updated));
    return updated;
  }

  mergeSiteSettings(cloudSettings) {
    if (!cloudSettings || typeof cloudSettings !== 'object') return this.getSiteSettings();
    const current = this.getSiteSettings();
    const merged = {
      ...current,
      ...cloudSettings,
      heroShowcaseItems:
        Array.isArray(cloudSettings.heroShowcaseItems) && cloudSettings.heroShowcaseItems.length > 0
          ? cloudSettings.heroShowcaseItems
          : current.heroShowcaseItems || DEFAULT_SHOWCASE_ITEMS,
      tickerCustomImages:
        Array.isArray(cloudSettings.tickerCustomImages) && cloudSettings.tickerCustomImages.length > 0
          ? cloudSettings.tickerCustomImages
          : current.tickerCustomImages || DEFAULT_TICKER_IMAGES,
      tickerSize: cloudSettings.tickerSize || current.tickerSize || 'small',
      tickerPadding: cloudSettings.tickerPadding || current.tickerPadding || 'small',
      tickerSource: cloudSettings.tickerSource || current.tickerSource || 'both',
      brandTheme: {
        light: { ...DEFAULT_BRAND_THEME.light, ...(current?.brandTheme?.light || {}), ...(cloudSettings?.brandTheme?.light || {}) },
        dark: { ...DEFAULT_BRAND_THEME.dark, ...(current?.brandTheme?.dark || {}), ...(cloudSettings?.brandTheme?.dark || {}) }
      },
      aboutPage: {
        ...DEFAULT_SITE_SETTINGS.aboutPage,
        ...(current?.aboutPage || {}),
        ...(cloudSettings?.aboutPage || {})
      },
      servicesPage: {
        ...DEFAULT_SITE_SETTINGS.servicesPage,
        ...(current?.servicesPage || {}),
        ...(cloudSettings?.servicesPage || {})
      },
      contactPage: {
        ...DEFAULT_SITE_SETTINGS.contactPage,
        ...(current?.contactPage || {}),
        ...(cloudSettings?.contactPage || {})
      },
      updatedAt: cloudSettings.updatedAt || new Date().toISOString()
    };
    try {
      localStorage.setItem(SITE_SETTINGS_KEY, JSON.stringify(merged));
    } catch {
      // ignore
    }
    return merged;
  }

  mergeAdminAccount(cloudProfile) {
    if (!cloudProfile || typeof cloudProfile !== 'object') return this.getAdminAccount();
    const current = this.getAdminAccount();
    const merged = {
      ...current,
      name: cloudProfile.name || current.name,
      role: cloudProfile.role || current.role,
      phone: cloudProfile.phone || current.phone,
      email: cloudProfile.email || current.email,
      avatar: cloudProfile.avatar || current.avatar,
      updatedAt: cloudProfile.updatedAt || new Date().toISOString()
    };
    try {
      localStorage.setItem(ADMIN_ACCOUNT_KEY, JSON.stringify(merged));
    } catch {
      // ignore
    }
    return merged;
  }

  isAuthenticated() {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(ADMIN_STORAGE_KEY) === 'true';
  }

  login(email, password) {
    const admin = this.getAdminAccount();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    // Check against configured admin account or default fallbacks
    const isValid =
      (cleanEmail === admin.email.toLowerCase() && cleanPass === admin.passwordHash) ||
      (cleanEmail === 'admin@bmgraphix.com' && cleanPass === 'admin123') ||
      (cleanEmail === 'brianmulilu2023@gmail.com' && cleanPass === 'admin123') ||
      (cleanEmail === 'admin' && cleanPass === 'admin123');

    if (isValid) {
      localStorage.setItem(ADMIN_STORAGE_KEY, 'true');
      return { success: true, admin };
    }

    return { success: false, error: 'Invalid email or password' };
  }

  logout() {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
  }
}

export const adminService = new AdminService();
