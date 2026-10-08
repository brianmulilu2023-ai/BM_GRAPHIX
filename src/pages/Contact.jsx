import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useProjects } from '../context/ProjectContext';

export default function Contact() {
  const { showToast, addInquiry } = useProjects();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'posters',
    budget: 'kes_10k_30k',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Please provide your full name.';
    if (!formData.email.trim()) {
      newErrors.email = 'Please provide your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email address.';
    }
    if (!formData.message.trim()) newErrors.message = 'Please provide details about your project.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (addInquiry) {
        addInquiry(formData);
      }
    } catch (err) {
      console.error(err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      showToast('Message sent! Brian will contact you shortly.', 'gold');

      // Trigger golden confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#F5D77A', '#B8860B', '#FFFFFF']
        });
      } catch (err) {
        // Safe fallback
      }
    }, 800);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      service: 'posters',
      budget: 'kes_10k_30k',
      message: ''
    });
    setIsSubmitted(false);
  };

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-28 space-y-16">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#161616] border border-[#D4AF37]/30 text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37] mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Let's Build Something Iconic</span>
        </div>
        <h1 className="font-display font-extrabold text-4xl sm:text-6xl text-[#F5F1E8] mb-5">
          Get in <span className="gold-gradient-text">Touch</span>
        </h1>
        <p className="text-sm sm:text-base text-[#8A8A8A] leading-relaxed">
          Ready to launch a high-impact campaign, redesign your visual identity, or animate cinematic motion graphics? Reach out via phone, WhatsApp, or the brief form below.
        </p>
      </div>

      {/* Main Grid: Direct Channels + Interactive Contact Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* LEFT: Quick Contact Cards */}
        <div className="lg:col-span-5 space-y-6">
          {/* WhatsApp Direct Card */}
          <a
            href="https://wa.me/254798405726?text=Hi%20Brian!%20I%20visited%20your%20BM%20Graphix%20portfolio%20and%20would%20love%20to%20discuss%20a%20project."
            target="_blank"
            rel="noopener noreferrer"
            className="group block p-6 rounded-2xl glass-card border border-[#25D366]/30 hover:border-[#25D366] transition-all duration-300 shadow-lg hover:shadow-[0_10px_30px_rgba(37,211,102,0.15)]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 flex items-center justify-center text-[#25D366] group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-6 h-6 fill-[#25D366]" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#25D366] font-semibold">
                    Instant Messaging
                  </span>
                  <h3 className="font-display font-bold text-lg text-[#F5F1E8] group-hover:text-[#25D366] transition-colors">
                    Chat on WhatsApp
                  </h3>
                  <p className="text-xs text-[#8A8A8A] mt-0.5">+254 798 405 726</p>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-[#8A8A8A] group-hover:text-[#25D366] transition-colors" />
            </div>
          </a>

          {/* Click to Call Card */}
          <a
            href="tel:+254798405726"
            className="group block p-6 rounded-2xl glass-card border border-white/10 hover:border-[#D4AF37]/50 transition-all duration-300 shadow-lg hover:shadow-[0_10px_30px_rgba(212,175,55,0.15)]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#1C1C1C] border border-[#D4AF37]/30 flex items-center justify-center text-[#F5D77A] group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#D4AF37] font-semibold">
                    Voice Call
                  </span>
                  <h3 className="font-display font-bold text-lg text-[#F5F1E8] group-hover:text-[#F5D77A] transition-colors">
                    Click to Call
                  </h3>
                  <p className="text-xs text-[#8A8A8A] mt-0.5">+254 798 405 726</p>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-[#8A8A8A] group-hover:text-[#F5D77A] transition-colors" />
            </div>
          </a>

          {/* Email Direct Card */}
          <a
            href="mailto:brianmulilu2023@gmail.com?subject=Project%20Inquiry%20%E2%80%94%20BM%20Graphix"
            className="group block p-6 rounded-2xl glass-card border border-white/10 hover:border-[#D4AF37]/50 transition-all duration-300 shadow-lg hover:shadow-[0_10px_30px_rgba(212,175,55,0.15)]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#1C1C1C] border border-[#D4AF37]/30 flex items-center justify-center text-[#F5D77A] group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#D4AF37] font-semibold">
                    Direct Email
                  </span>
                  <h3 className="font-display font-bold text-lg text-[#F5F1E8] group-hover:text-[#F5D77A] transition-colors">
                    Send An Email
                  </h3>
                  <p className="text-xs text-[#8A8A8A] mt-0.5 break-all">brianmulilu2023@gmail.com</p>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-[#8A8A8A] group-hover:text-[#F5D77A] transition-colors" />
            </div>
          </a>

          {/* Location & Availability Note */}
          <div className="p-6 rounded-2xl bg-[#121212] border border-white/5 space-y-4">
            <div className="flex items-center gap-3 text-xs text-[#8A8A8A]">
              <MapPin className="w-4 h-4 text-[#D4AF37]" />
              <span>Nairobi Central Business District (CBD), Kenya</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#8A8A8A]">
              <Clock className="w-4 h-4 text-[#D4AF37]" />
              <span>Monday — Saturday: 8:00 AM — 8:00 PM EAT</span>
            </div>
            <div className="p-3 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[11px] text-[#F5D77A] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
              <span>Currently accepting new freelance projects and corporate contracts.</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Project Inquiry Form */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl glass-card border border-[#D4AF37]/30 p-8 sm:p-10 shadow-2xl relative overflow-hidden">
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="py-12 text-center space-y-6"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#F5D77A] flex items-center justify-center text-black mx-auto shadow-[0_0_30px_rgba(212,175,55,0.4)]">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#F5F1E8]">
                      Thank You, {formData.name}!
                    </h3>
                    <p className="text-sm text-[#8A8A8A] max-w-md mx-auto">
                      Your project brief has been received. Brian will review your requirements and reply to <strong className="text-[#F5D77A]">{formData.email}</strong> within 12–24 hours.
                    </p>
                  </div>
                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a
                      href={`https://wa.me/254798405726?text=${encodeURIComponent(
                        `Hi Brian, I just submitted an inquiry on your website under the name ${formData.name}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-[#D4AF37] to-[#F5D77A] shadow-md hover:scale-105 transition"
                    >
                      Follow Up On WhatsApp &rarr;
                    </a>
                    <button
                      onClick={handleReset}
                      className="px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-[#8A8A8A] hover:text-[#F5F1E8] bg-white/5 hover:bg-white/10 transition"
                    >
                      Send Another Inquiry
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form key="form" onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h3 className="font-display font-bold text-2xl text-[#F5F1E8] mb-1">
                      Project Brief Form
                    </h3>
                    <p className="text-xs text-[#8A8A8A]">
                      Tell me about your brand, timeline, and vision.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase tracking-wider font-medium text-[#F5F1E8]">
                        Your Name / Company *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Cleo Wanjiku"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl bg-[#161616] border ${
                          errors.name ? 'border-red-500' : 'border-white/10'
                        } focus:border-[#D4AF37] focus:outline-none text-xs sm:text-sm text-[#F5F1E8] placeholder-[#8A8A8A]`}
                      />
                      {errors.name && <p className="text-[11px] text-red-400">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase tracking-wider font-medium text-[#F5F1E8]">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. name@brand.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl bg-[#161616] border ${
                          errors.email ? 'border-red-500' : 'border-white/10'
                        } focus:border-[#D4AF37] focus:outline-none text-xs sm:text-sm text-[#F5F1E8] placeholder-[#8A8A8A]`}
                      />
                      {errors.email && <p className="text-[11px] text-red-400">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Service Required */}
                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase tracking-wider font-medium text-[#F5F1E8]">
                        Service Required
                      </label>
                      <select
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 focus:border-[#D4AF37] focus:outline-none text-xs sm:text-sm text-[#F5F1E8]"
                      >
                        <option value="posters">Poster & Flyer Design</option>
                        <option value="branding">Logo & Brand Identity</option>
                        <option value="motion">Motion Graphics & 3D Loops</option>
                        <option value="videos">Video Promo Animation</option>
                        <option value="multiple">Full Brand + Motion Package</option>
                      </select>
                    </div>

                    {/* Budget Range */}
                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase tracking-wider font-medium text-[#F5F1E8]">
                        Estimated Budget
                      </label>
                      <select
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 focus:border-[#D4AF37] focus:outline-none text-xs sm:text-sm text-[#F5F1E8]"
                      >
                        <option value="kes_10k_30k">KES 10,000 — 30,000 (~$100–$250)</option>
                        <option value="kes_30k_70k">KES 30,000 — 70,000 (~$250–$550)</option>
                        <option value="kes_70k_plus">KES 70,000+ (~$550+)</option>
                        <option value="corporate">Corporate / Retainer Contract</option>
                      </select>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="space-y-1.5">
                    <label className="block text-xs uppercase tracking-wider font-medium text-[#F5F1E8]">
                      Project Brief & Details *
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Describe your event, brand, timeline, preferred color direction, and any reference styles you love..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl bg-[#161616] border ${
                        errors.message ? 'border-red-500' : 'border-white/10'
                      } focus:border-[#D4AF37] focus:outline-none text-xs sm:text-sm text-[#F5F1E8] placeholder-[#8A8A8A]`}
                    />
                    {errors.message && <p className="text-[11px] text-red-400">{errors.message}</p>}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider text-black bg-gradient-to-r from-[#D4AF37] via-[#F5D77A] to-[#B8860B] shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_35px_rgba(212,175,55,0.5)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        Submitting Brief...
                      </span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Project Brief</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
