import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Download,
  Calendar,
  Briefcase,
  Layers,
  Award,
  CheckCircle,
  ExternalLink,
  Laptop,
  Flame,
  ArrowRight
} from 'lucide-react';

export default function About({ navigate }) {
  const skills = [
    { name: 'Adobe Photoshop (Poster Art & Manipulation)', level: 98 },
    { name: 'Adobe Illustrator (Vector Branding & Logos)', level: 95 },
    { name: 'After Effects (2D/3D Motion Graphics)', level: 92 },
    { name: 'Premiere Pro (Commercial Video Editing)', level: 90 },
    { name: 'Brand Strategy & Typographic Hierarchy', level: 94 },
    { name: 'Cinema 4D / Blender (3D Stage Visuals)', level: 82 }
  ];

  const tools = [
    { name: 'Photoshop', category: 'Key Visuals & Photo Manipulation', icon: 'Ps' },
    { name: 'Illustrator', category: 'Logos, Typography & Vectors', icon: 'Ai' },
    { name: 'After Effects', category: 'Kinetic Motion & VFX', icon: 'Ae' },
    { name: 'Premiere Pro', category: 'Video Montages & Grading', icon: 'Pr' },
    { name: 'Cinema 4D', category: '3D Modeling & Billboards', icon: 'C4D' },
    { name: 'Blender', category: 'Surreal 3D Environments', icon: 'Bl' },
    { name: 'Lightroom', category: 'Color Grading & Lighting', icon: 'Lr' },
    { name: 'InDesign', category: 'Editorial & Lookbooks', icon: 'Id' }
  ];

  const timeline = [
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
  ];

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-28 space-y-24">
      {/* Header & Bio Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Designer Portrait */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-5 relative"
        >
          <div className="relative mx-auto max-w-md rounded-3xl overflow-hidden border-2 border-[#D4AF37]/50 shadow-[0_15px_50px_rgba(212,175,55,0.25)] bg-[#121212] aspect-[3/4]">
            <img
              src="/assets/brian-mulilu.jpg"
              alt="Brian Mulilu — Senior Graphic Designer & Motion Artist"
              className="w-full h-full object-cover object-[center_18%] filter contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-xl text-[#F5F1E8]">Brian Mulilu</h3>
                <p className="text-xs text-[#D4AF37] font-mono tracking-widest uppercase">
                  Motion Artist & Visual Designer
                </p>
              </div>
              <span className="w-3 h-3 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20 animate-pulse" title="Available for projects" />
            </div>
          </div>
        </motion.div>

        {/* Bio Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-7 space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#161616] border border-[#D4AF37]/30 text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Vision Behind The Craft</span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-[#F5F1E8] leading-tight">
            I craft designs that <span className="gold-gradient-text">move people</span> and build iconic legacies.
          </h1>

          <div className="space-y-4 text-sm sm:text-base text-[#8A8A8A] leading-relaxed">
            <p>
              I am Brian Mulilu, a passionate Nairobi-based graphic designer and motion artist. Under my banner <strong className="text-[#F5F1E8]">BM Graphix</strong>, I bridge the gap between static design precision and kinetic cinema.
            </p>
            <p>
              My work spans broadcast motion packages for media giants like <strong className="text-[#D4AF37]">Royal Media Services</strong>, sold-out concert tour key visuals, luxury brand identities, and high-impact digital photo manipulations.
            </p>
            <p>
              Every typography choice, lighting gradient, and keyframe is treated with surgical intentionality. I believe extraordinary brands don't whisper—they resonate with unmistakable confidence.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <a
              href="/assets/Brian_Mulilu_CV.pdf"
              download
              className="px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-[#D4AF37] via-[#F5D77A] to-[#B8860B] shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-105 transition flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download CV (PDF)</span>
            </a>

            <button
              onClick={() => navigate('/contact')}
              className="px-7 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider text-[#F5F1E8] bg-white/5 hover:bg-white/10 border border-white/15 transition flex items-center gap-2"
            >
              <span>Work With Brian</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Skills with Animated Progress Bars */}
      <div className="p-8 sm:p-12 rounded-3xl glass-card border border-white/10 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37] block mb-2">
              Mastery & Proficiency
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-4xl text-[#F5F1E8]">
              Skills & Expertise
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#8A8A8A] max-w-md">
            Polished over 5+ years of intense production across print, motion, and digital realms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skills.map((skill, idx) => (
            <div key={idx} className="space-y-2.5">
              <div className="flex items-center justify-between text-xs sm:text-sm font-medium">
                <span className="text-[#F5F1E8]">{skill.name}</span>
                <span className="font-mono text-[#F5D77A] font-bold">{skill.level}%</span>
              </div>
              <div className="h-2.5 w-full bg-[#1A1A1A] rounded-full overflow-hidden p-0.5 border border-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: 'easeOut', delay: idx * 0.1 }}
                  className="h-full rounded-full bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#F5D77A] shadow-[0_0_10px_#D4AF37]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tools & Software Ecosystem */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37] block mb-2">
            Creative Stack
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-4xl text-[#F5F1E8]">
            Software & Weapons of Choice
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {tools.map((t, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#141414] border border-white/5 hover:border-[#D4AF37]/50 hover:shadow-[0_10px_25px_rgba(212,175,55,0.1)] transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-black border border-[#D4AF37]/30 flex items-center justify-center font-display font-bold text-base text-[#F5D77A] mb-3 group-hover:scale-110 transition-transform">
                {t.icon}
              </div>
              <h3 className="font-semibold text-sm text-[#F5F1E8] group-hover:text-[#F5D77A] transition-colors">
                {t.name}
              </h3>
              <p className="text-[11px] text-[#8A8A8A] mt-1">{t.category}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Experience Timeline (including Royal Media Services) */}
      <div className="p-8 sm:p-12 rounded-3xl glass-card border border-white/10 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37] block mb-2">
              Career Journey
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-4xl text-[#F5F1E8]">
              Experience Timeline
            </h2>
          </div>
          <span className="text-xs text-[#8A8A8A]">Track record of commercial excellence</span>
        </div>

        <div className="relative pl-6 sm:pl-8 border-l-2 border-[#D4AF37]/30 space-y-12">
          {timeline.map((item, idx) => (
            <div key={idx} className="relative group">
              {/* Timeline marker */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-[#0A0A0A] border-2 border-[#D4AF37] flex items-center justify-center">
                {item.current && (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#F5D77A] animate-ping" />
                )}
              </div>

              <div className="p-6 rounded-2xl bg-[#141414] border border-white/5 hover:border-[#D4AF37]/40 transition duration-300">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono font-semibold text-[#D4AF37] px-2.5 py-1 rounded bg-[#D4AF37]/10">
                    {item.period}
                  </span>
                  <span className="text-xs text-[#8A8A8A]">{item.location}</span>
                </div>

                <h3 className="font-display font-bold text-lg sm:text-xl text-[#F5F1E8]">
                  {item.role}
                </h3>
                <h4 className="text-sm font-semibold text-[#F5D77A] mb-3">
                  {item.company}
                </h4>

                <p className="text-xs sm:text-sm text-[#8A8A8A] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
