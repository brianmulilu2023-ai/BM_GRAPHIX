import React from 'react';
import { motion } from 'framer-motion';
import {
  Palette,
  Layers,
  Tv,
  Film,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Clock,
  ShieldCheck,
  Send
} from 'lucide-react';

export default function Services({ navigate }) {
  const serviceDetails = [
    {
      icon: Palette,
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
      icon: Layers,
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
      icon: Tv,
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
      icon: Film,
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
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Discovery & Brief',
      desc: 'We define your target audience, artistic direction, color moodboard, and specific deliverables.'
    },
    {
      step: '02',
      title: 'Creative Concepts',
      desc: 'I develop bold initial concepts and kinetic motion drafts for your critique and selection.'
    },
    {
      step: '03',
      title: 'Refinement',
      desc: 'Fine-tuning lighting, typographic precision, and render passes until the visual is flawless.'
    },
    {
      step: '04',
      title: 'Final Delivery',
      desc: 'Production-ready files in all required high-resolution print, web, and broadcast formats.'
    }
  ];

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-28 space-y-24 page-mount">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#161616] border border-[#D4AF37]/30 text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37] mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Professional Creative Solutions</span>
        </div>
        <h1 className="font-display font-extrabold text-4xl sm:text-6xl text-[#F5F1E8] mb-5">
          Services That <span className="gold-gradient-text">Elevate</span>
        </h1>
        <p className="text-sm sm:text-base text-[#8A8A8A] leading-relaxed">
          From viral event flyers to cinema-standard broadcast packages, every piece is meticulously engineered to stand out and deliver results.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {serviceDetails.map((service, idx) => {
          const Icon = service.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`relative rounded-3xl p-8 sm:p-10 glass-card border flex flex-col justify-between transition-all duration-300 mag-card shimmer-hover ${
                service.popular
                  ? 'border-[#D4AF37]/60 shadow-[0_10px_35px_rgba(212,175,55,0.15)] bg-gradient-to-b from-[#141414] to-[#0F0F0F]'
                  : 'border-white/10 hover:border-[#D4AF37]/40'
              }`}
            >
              {service.popular && (
                <div className="absolute top-5 right-6 px-3 py-1 rounded-full bg-[#D4AF37] text-black text-[10px] font-bold uppercase tracking-wider shadow-md">
                  Most Requested
                </div>
              )}

              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#1A1A1A] border border-[#D4AF37]/40 flex items-center justify-center text-[#F5D77A] mb-6 shadow-inner icon-glow-badge service-icon-ring">
                  <Icon className="w-7 h-7" />
                </div>

                <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] block mb-2">
                  {service.category}
                </span>

                <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#F5F1E8] mb-3">
                  {service.title}
                </h3>

                <p className="text-sm text-[#8A8A8A] leading-relaxed mb-6">
                  {service.desc}
                </p>

                <div className="space-y-3 mb-8">
                  <h4 className="text-xs uppercase tracking-wider text-[#F5F1E8] font-semibold">
                    What's Included:
                  </h4>
                  <ul className="space-y-2">
                    {service.deliverables.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start gap-2.5 text-xs text-[#E5E1D8]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-1.5 text-xs text-[#8A8A8A]">
                  <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Est. Turnaround: <strong className="text-[#F5F1E8]">{service.turnaround}</strong></span>
                </div>

                <button
                  onClick={() => navigate('/contact')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-[#D4AF37] to-[#F5D77A] hover:scale-105 transition"
                >
                  Book This Service &rarr;
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 4-Step Creative Workflow */}
      <div className="p-8 sm:p-12 rounded-3xl glass-card border border-white/10 space-y-10">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37] block mb-2">
            The Process
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-4xl text-[#F5F1E8]">
            How We Bring Ideas To Life
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {workflowSteps.map((ws, i) => (
            <div key={i} className="p-6 rounded-2xl bg-[#141414] border border-white/5 space-y-3 mag-card shimmer-hover">
              <span className="font-display font-extrabold text-3xl text-[#D4AF37]/50 block">
                {ws.step}
              </span>
              <h3 className="font-semibold text-base text-[#F5F1E8]">{ws.title}</h3>
              <p className="text-xs text-[#8A8A8A] leading-relaxed">{ws.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
