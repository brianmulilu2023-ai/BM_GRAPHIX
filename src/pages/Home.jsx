import React, { useEffect, useRef } from 'react';
import {
  Layers,
  Palette,
  Film,
  Tv,
  CheckCircle,
  ArrowRight,
  ArrowUpRight
} from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import ProjectCard from '../components/ProjectCard';
import MarqueeStrip from '../components/MarqueeStrip';
import HeroSection from '../components/HeroSection';

/* ------------------------------------------------------------------
   Scroll-reveal hook (inline so we keep one file)
   ------------------------------------------------------------------ */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);
  return ref;
}

export default function Home({ navigate }) {
  const { projects } = useProjects();
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 6);
  const pageRef = useReveal();

  const services = [
    {
      icon: Palette,
      title: 'Poster & Flyer Design',
      tag: 'Print & Digital',
      desc: 'Iconic, cinematic event posters, concert tours, worship nights, and club flyers tailored for viral social reach and high-dpi print production.',
      features: ['Concert & Event Key Visuals', 'Social Media Carousel Packs', 'Ultra High-Res Print Ready', 'Custom Typographic Art']
    },
    {
      icon: Layers,
      title: 'Logo & Branding',
      tag: 'Brand Systems',
      desc: 'Distinctive visual identities, logo monograms, corporate style guides, packaging design, and stationery that command authority.',
      features: ['Monogram & Wordmark Design', 'Full Brand Guidelines', 'Business Stationery & Packaging', 'Scalable Vector Assets']
    },
    {
      icon: Tv,
      title: 'Motion Graphics',
      tag: 'Kinetic & 3D',
      desc: 'High-octane kinetic typography, 3D animated billboard loops, logo reveals, and broadcast graphic packages that capture eyeballs.',
      features: ['Kinetic Typography Trailers', '3D Billboard Loop Animations', 'Broadcast Lower Thirds & Stingers', 'Animated Logo Intros']
    },
    {
      icon: Film,
      title: 'Video Promo Animation',
      tag: 'Cinema & Commercial',
      desc: 'Dynamic video trailers, social media promo reels, music video title sequences, and event countdown teasers engineered to convert.',
      features: ['Commercial Teasers & Promos', 'Event Countdown Openers', 'Audio-Reactive Visualizers', 'Instagram & TikTok Vertical Reels']
    }
  ];



  const marqueeItems = [
    'Motion Graphics', 'Poster Design', 'Brand Identity', 'Video Production',
    'After Effects', 'Cinema 4D', 'Photoshop', 'Premiere Pro',
    'Broadcast Graphics', '3D Animation', 'Logo Design', 'Nairobi Kenya'
  ];

  const processSteps = [
    {
      num: '01',
      title: 'Discovery & Brief',
      desc: 'We start by understanding your vision, audience, and goals — building a creative brief that becomes the foundation of every design decision.'
    },
    {
      num: '02',
      title: 'Concept & Ideation',
      desc: 'Bold initial concepts and mood boards are developed and presented for your feedback. We explore multiple directions before locking in the strongest.'
    },
    {
      num: '03',
      title: 'Design & Motion',
      desc: 'Full execution: from static visuals to animated sequences, every pixel is crafted with precision. We obsess over detail so you don\'t have to.'
    },
    {
      num: '04',
      title: 'Refinement & Delivery',
      desc: 'Two rounds of revisions ensure your complete satisfaction. Final assets are delivered in all required formats — print, digital, broadcast, and social.'
    }
  ];

  return (
    <div ref={pageRef} className="relative z-10 pb-24">

      {/* 1. NEW HERO SECTION */}
      <HeroSection navigate={navigate} />

      {/* MARQUEE STRIP */}
      <div className="mt-0">
        <MarqueeStrip items={marqueeItems} speed={28} />
      </div>

      {/* 2. FEATURED WORK SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-28">
        <div className="reveal flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="section-tag">
              Selected Portfolio
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#F5F1E8]">
              Featured <span className="gold-gradient-text">Masterpieces</span>
            </h2>
          </div>
          <button
            onClick={() => navigate('/work')}
            className="mt-4 md:mt-0 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#F5D77A] hover:text-[#D4AF37] transition group"
          >
            <span>Explore All Projects ({projects.length})</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="poster-grid reveal reveal-delay-2">
          {featuredProjects.map((project, idx) => (
            <div key={project.id} className="h-full">
              <ProjectCard project={project} priority={idx < 2} />
            </div>
          ))}
        </div>

        <div className="text-center mt-12 reveal reveal-delay-3">
          <button
            onClick={() => navigate('/work')}
            className="px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-[#D4AF37] to-[#F5D77A] shadow-lg shadow-[#D4AF37]/20 hover:scale-105 transition"
          >
            View Full Portfolio Gallery &rarr;
          </button>
        </div>
      </section>

      {/* SECOND MARQUEE (reversed) */}
      <MarqueeStrip
        items={['Broadcast Design', 'Event Posters', 'Social Content', 'Album Artwork', 'Logo Systems', 'Church Visuals', 'Concert Promos', 'Royal Media', 'Kinetic Type']}
        direction="right"
        speed={22}
      />

      {/* 3. PROCESS TIMELINE */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 reveal">
          <span className="section-tag">The Creative Process</span>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-[#F5F1E8]">
            How I <span className="gold-gradient-text">Work</span>
          </h2>
          <p className="text-sm sm:text-base text-[#8A8A8A] mt-4 max-w-xl mx-auto">
            A disciplined four-step framework that turns your vision into a visual masterpiece — on time, every time.
          </p>
        </div>

        <div className="process-timeline">
          {processSteps.map((step, i) => (
            <div
              key={i}
              className={`process-step reveal reveal-delay-${i + 1}`}
            >
              <div className="process-dot">{step.num}</div>
              <div className="process-content">
                <div className="process-step-num">Step {step.num}</div>
                <div className="process-step-title">{step.title}</div>
                <div className="process-step-desc">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. PHILOSOPHY / IMPACT STATEMENT */}
      <div className="philosophy-section">
        <div className="max-w-3xl mx-auto reveal">
          <div className="philosophy-lead">DESIGN IS NEVER JUST DESIGN.</div>
          <div className="philosophy-points">
            {[
              'It commands attention.',
              'Builds trust.',
              'Moves people.',
              'Tells your story.',
              'Creates opportunity.',
            ].map((p, i) => (
              <div key={i} className="philosophy-point">{p}</div>
            ))}
          </div>
          <div className="philosophy-closing">Every pixel counts.</div>
        </div>
      </div>

      {/* 5. SERVICES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 reveal">
          <span className="section-tag">Capabilities & Craft</span>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-[#F5F1E8]">
            What I <span className="gold-gradient-text">Deliver</span>
          </h2>
          <p className="text-sm sm:text-base text-[#8A8A8A] mt-4">
            Combining rigorous typography, cinematic art direction, and seamless motion to elevate your brand above the noise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div
                key={idx}
                className={`reveal reveal-delay-${idx + 1} group relative p-8 rounded-3xl glass-card border border-white/5 hover:border-[#D4AF37]/50 transition-all duration-500 hover:shadow-[0_15px_40px_rgba(212,175,55,0.12)] flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-[#1C1C1C] border border-[#D4AF37]/30 flex items-center justify-center text-[#F5D77A] group-hover:bg-[#D4AF37] group-hover:text-black transition-colors duration-300 shadow-md">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-[11px] font-mono uppercase tracking-widest text-[#8A8A8A] px-3 py-1 rounded-full bg-white/5 border border-white/5">
                      {srv.tag}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-2xl text-[#F5F1E8] mb-3 group-hover:text-[#F5D77A] transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-sm text-[#8A8A8A] leading-relaxed mb-6">{srv.desc}</p>
                  <ul className="space-y-2.5 mb-8">
                    {srv.features.map((f, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2.5 text-xs text-[#E5E1D8]">
                        <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs text-[#8A8A8A]">Tailored Deliverables</span>
                  <button
                    onClick={() => navigate('/contact')}
                    className="text-xs font-semibold text-[#F5D77A] group-hover:text-[#D4AF37] flex items-center gap-1"
                  >
                    Inquire for Service &rarr;
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. SHORT ABOUT TEASER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl glass-card border border-[#D4AF37]/30 p-8 sm:p-12 lg:p-16 overflow-hidden reveal">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Image Col */}
            <div className="lg:col-span-5 relative reveal-left">
              <div className="relative mx-auto max-w-sm rounded-2xl overflow-hidden border-2 border-[#D4AF37]/50 shadow-[0_10px_40px_rgba(212,175,55,0.2)] aspect-[3/4]">
                <img
                  src="/assets/brian-mulilu.jpg"
                  alt="Brian Mulilu — Graphic Designer & Motion Artist"
                  className="w-full h-full object-cover object-[center_18%] filter brightness-100 contrast-105"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/60 to-transparent p-4 text-center">
                  <span className="text-xs font-bold tracking-widest text-[#F5D77A] uppercase">Brian Mulilu</span>
                  <p className="text-[10px] text-[#8A8A8A]">Founder & Creative Director, BM Graphix</p>
                </div>
              </div>
            </div>
            {/* Content Col */}
            <div className="lg:col-span-7 space-y-6 reveal-right">
              <span className="section-tag">About The Artist</span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#F5F1E8] leading-tight">
                Passion for precision. <br />
                <span className="gold-gradient-text">Obsession with motion.</span>
              </h2>
              <p className="text-sm sm:text-base text-[#8A8A8A] leading-relaxed">
                With over five years of dedicated experience spanning high-profile entertainment posters, brand visual systems, and broadcast motion graphics (including work with <strong className="text-[#F5F1E8]">Royal Media Services</strong>), I transform abstract ideas into striking visual spectacles.
              </p>
              <p className="text-sm text-[#8A8A8A] leading-relaxed">
                Whether you need a sold-out concert tour campaign or a dynamic 3D kinetic video ident, my mission is simple: design that commands respect and moves people.
              </p>
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => navigate('/about')}
                  className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-[#D4AF37] to-[#F5D77A] hover:scale-105 transition shadow-lg shadow-[#D4AF37]/20"
                >
                  Read Full Bio & Experience
                </button>
                <a
                  href="/assets/Brian_Mulilu_CV.pdf"
                  download
                  className="px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-[#F5F1E8] bg-white/5 hover:bg-white/10 border border-white/15 transition"
                >
                  Download CV / Resume
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#171717] via-[#1A1812] to-[#171717] border border-[#D4AF37]/40 p-8 sm:p-14 text-center shadow-[0_20px_50px_rgba(0,0,0,0.8)] reveal">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="section-tag mx-auto">Let's Create Magic Together</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-[#F5F1E8] leading-tight">
              Have a visionary project in mind?
            </h2>
            <p className="text-sm sm:text-base text-[#8A8A8A] leading-relaxed">
              Let's collaborate to craft visual identities and motion graphics that set your brand apart. Available for bookings and freelance commissions.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/contact')}
                className="w-full sm:w-auto px-8 py-4 rounded-full text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-[#D4AF37] via-[#F5D77A] to-[#B8860B] shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:scale-105 transition"
              >
                Start A Project
              </button>
              <a
                href="https://wa.me/254798405726"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-full text-xs font-semibold uppercase tracking-wider text-[#F5F1E8] bg-black/60 border border-[#25D366]/40 hover:border-[#25D366] transition flex items-center justify-center gap-2"
              >
                <span>WhatsApp: +254 798 405 726</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
