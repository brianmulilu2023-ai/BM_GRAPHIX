/**
 * Client Inquiries & Quote Leads Service
 * Stores and manages contact form submissions and quote inquiries from the website.
 */

const INQUIRIES_KEY = 'bm_client_inquiries_v2';

export const INITIAL_INQUIRIES = [
  {
    id: 'inq-101',
    name: 'David Mwangi',
    email: 'david.mwangi@apexevents.co.ke',
    phone: '+254 712 345 678',
    service: 'posters',
    serviceLabel: 'Poster & Event Campaign',
    budget: 'kes_30k_70k',
    budgetLabel: 'KES 30,000 - 70,000',
    message: 'We are organizing an East Africa Tech Gala in Nairobi next month and need 4 high-impact promotional posters, social media carousels, and VIP invitation cards. We love your gold luxury aesthetic.',
    status: 'new', // 'new' | 'read' | 'replied'
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString() // 2 hours ago
  },
  {
    id: 'inq-102',
    name: 'Sarah Cherono',
    email: 'sarah@safariart.org',
    phone: '+254 722 987 654',
    service: 'motion',
    serviceLabel: 'Motion Graphics & Video Promo',
    budget: 'kes_70k_plus',
    budgetLabel: 'KES 70,000+',
    message: 'Looking for a 45-second 3D motion graphics teaser and social cutdowns for our upcoming wildlife art showcase. Need beat-synced kinetic typography and sound effects.',
    status: 'read',
    createdAt: new Date(Date.now() - 26 * 3600 * 1000).toISOString() // Yesterday
  },
  {
    id: 'inq-103',
    name: 'Pastor Michael Otieno',
    email: 'michael.o@gracechurch.or.ke',
    phone: '+254 733 112 233',
    service: 'branding',
    serviceLabel: 'Church & Conference Visual Identity',
    budget: 'kes_10k_30k',
    budgetLabel: 'KES 10,000 - 30,000',
    message: 'Hello Brian, we need a complete flyer package and LED screen backdrops for our 3-day annual revival conference. Can you deliver within 5 days?',
    status: 'replied',
    createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString() // 3 days ago
  }
];

class InquiryService {
  constructor() {
    this.init();
  }

  init() {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem(INQUIRIES_KEY)) {
      localStorage.setItem(INQUIRIES_KEY, JSON.stringify(INITIAL_INQUIRIES));
    }
  }

  getInquiries() {
    try {
      const data = localStorage.getItem(INQUIRIES_KEY);
      return data ? JSON.parse(data) : INITIAL_INQUIRIES;
    } catch {
      return INITIAL_INQUIRIES;
    }
  }

  addInquiry(formData) {
    const list = this.getInquiries();
    const newInquiry = {
      id: `inq-${Date.now()}`,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone ? formData.phone.trim() : 'Not provided',
      service: formData.service || 'posters',
      serviceLabel: this.getServiceLabel(formData.service),
      budget: formData.budget || 'kes_10k_30k',
      budgetLabel: this.getBudgetLabel(formData.budget),
      message: formData.message.trim(),
      status: 'new',
      createdAt: new Date().toISOString()
    };

    const updated = [newInquiry, ...list];
    localStorage.setItem(INQUIRIES_KEY, JSON.stringify(updated));
    return newInquiry;
  }

  markStatus(id, status) {
    const list = this.getInquiries();
    const updated = list.map(inq => (inq.id === id ? { ...inq, status } : inq));
    localStorage.setItem(INQUIRIES_KEY, JSON.stringify(updated));
    return updated;
  }

  deleteInquiry(id) {
    const list = this.getInquiries();
    const filtered = list.filter(inq => inq.id !== id);
    localStorage.setItem(INQUIRIES_KEY, JSON.stringify(filtered));
    return filtered;
  }

  getServiceLabel(srv) {
    switch (srv) {
      case 'posters': return 'Poster & Event Campaign';
      case 'branding': return 'Logos & Brand Identity';
      case 'motion': return 'Motion Graphics & Animation';
      case 'video': return 'Video Editing & Promo';
      default: return 'Custom Design Package';
    }
  }

  getBudgetLabel(b) {
    switch (b) {
      case 'kes_10k_30k': return 'KES 10,000 - 30,000';
      case 'kes_30k_70k': return 'KES 30,000 - 70,000';
      case 'kes_70k_plus': return 'KES 70,000+';
      default: return 'Custom Budget';
    }
  }
}

export const inquiryService = new InquiryService();
