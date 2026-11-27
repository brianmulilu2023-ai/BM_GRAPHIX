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

  // Endless Masterpiece Ticker Controls
  tickerEnabled: true,
  tickerSpeed: 55, // seconds per full loop (20 = fast, 55 = balanced, 95 = slow)
  tickerDirection: 'left', // 'left' | 'right'
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
  activeBrandPreset: 'royal-gold',
  brandPrimaryColor: '#D4AF37',
  brandSecondaryColor: '#F5D77A',
  brandDarkColor: '#B8860B'
};

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
            : DEFAULT_SHOWCASE_ITEMS
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
