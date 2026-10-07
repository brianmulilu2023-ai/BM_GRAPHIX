import React from 'react';
import { ArrowUp, Heart, Lock, Mail, Phone, MessageCircle } from 'lucide-react';

export default function Footer({ navigate }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#080808] border-t border-white/5 pt-16 pb-12 text-[#8A8A8A] overflow-hidden">
      {/* Subtle top gold gradient divider line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2 space-y-5">
            <div className="flex items-center gap-3">
              <img
                src="/assets/BM_BLCK.png"
                alt="BM Graphix"
                className="h-10 w-auto object-contain drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]"
              />
              <span className="font-display font-bold text-lg text-[#F5F1E8] tracking-wider">
                BM GRAPHIX
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-md text-[#8A8A8A]">
              Designs that move people. Crafting bespoke visual identities, dynamic event posters, high-energy promotional campaigns, and broadcast motion graphics in Nairobi, Kenya.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://wa.me/254798405726"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#121212] border border-white/10 flex items-center justify-center text-[#8A8A8A] hover:text-[#25D366] hover:border-[#25D366]/50 transition duration-300"
                aria-label="WhatsApp BM Graphix"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="mailto:brianmulilu2023@gmail.com"
                className="w-10 h-10 rounded-full bg-[#121212] border border-white/10 flex items-center justify-center text-[#8A8A8A] hover:text-[#F5D77A] hover:border-[#D4AF37]/50 transition duration-300"
                aria-label="Email BM Graphix"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="tel:+254798405726"
                className="w-10 h-10 rounded-full bg-[#121212] border border-white/10 flex items-center justify-center text-[#8A8A8A] hover:text-[#F5D77A] hover:border-[#D4AF37]/50 transition duration-300"
                aria-label="Call Brian Mulilu"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation & Services */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#F5F1E8] mb-5">
              Explore
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <button
                  onClick={() => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#F5D77A] transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => { navigate('/work'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#F5D77A] transition-colors"
                >
                  Portfolio & Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={() => { navigate('/services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#F5D77A] transition-colors"
                >
                  Creative Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => { navigate('/about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#F5D77A] transition-colors"
                >
                  About Brian
                </button>
              </li>
              <li>
                <button
                  onClick={() => { navigate('/contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#F5D77A] transition-colors"
                >
                  Contact & Inquiries
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Contact */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#F5F1E8] mb-5">
              Direct Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <span className="block text-xs text-[#8A8A8A]/70 uppercase tracking-wider mb-1">Phone / WhatsApp</span>
                <a href="tel:+254798405726" className="text-[#F5F1E8] hover:text-[#F5D77A] transition font-medium">
                  +254 798 405 726
                </a>
              </li>
              <li>
                <span className="block text-xs text-[#8A8A8A]/70 uppercase tracking-wider mb-1">Email</span>
                <a href="mailto:brianmulilu2023@gmail.com" className="text-[#F5F1E8] hover:text-[#F5D77A] transition font-medium break-all">
                  brianmulilu2023@gmail.com
                </a>
              </li>
              <li>
                <span className="block text-xs text-[#8A8A8A]/70 uppercase tracking-wider mb-1">Location</span>
                <span className="text-[#F5F1E8]">Nairobi CBD, Kenya</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="flex items-center gap-1.5 text-[#8A8A8A]">
            <span>&copy; {new Date().getFullYear()} BM Graphix. All rights reserved.</span>
            <span className="inline-block mx-1">•</span>
            <span className="text-[#8A8A8A]">Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
            <span>in Nairobi</span>
          </p>

          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/admin/login')}
              className="text-[#8A8A8A]/40 hover:text-[#D4AF37] transition flex items-center gap-1"
              title="Admin Portal"
            >
              <Lock className="w-3 h-3" />
              <span>Admin</span>
            </button>

            <button
              onClick={scrollToTop}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#D4AF37]/20 hover:text-[#F5D77A] flex items-center justify-center transition border border-white/10"
              aria-label="Scroll back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
