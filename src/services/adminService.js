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
  youtube: 'https://youtube.com'
};

class AdminService {
  constructor() {
    this.init();
  }

  init() {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem(ADMIN_ACCOUNT_KEY)) {
      localStorage.setItem(ADMIN_ACCOUNT_KEY, JSON.stringify(DEFAULT_ADMIN));
    }
    if (!localStorage.getItem(SITE_SETTINGS_KEY)) {
      localStorage.setItem(SITE_SETTINGS_KEY, JSON.stringify(DEFAULT_SITE_SETTINGS));
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
      return data ? JSON.parse(data) : DEFAULT_SITE_SETTINGS;
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
