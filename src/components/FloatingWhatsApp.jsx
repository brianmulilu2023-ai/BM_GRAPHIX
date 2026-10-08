import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Sparkles } from 'lucide-react';

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = '254798405726';
  const defaultMessage = 'Hello Brian! I love your portfolio at BM Graphix. I would like to discuss a project.';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start">
      {/* Mini popup card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="mb-3 w-72 rounded-2xl glass-card p-4 shadow-2xl border border-[#D4AF37]/30 text-left bg-[#121212]/95 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-[#D4AF37]/60">
                  <img
                    src="/assets/brian-mulilu.jpg"
                    alt="Brian Mulilu"
                    className="w-full h-full object-cover object-[center_18%]"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#F5F1E8]">Brian Mulilu</h4>
                  <p className="text-[11px] text-[#25D366] flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse"></span>
                    Available for projects
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#8A8A8A] hover:text-[#F5F1E8] p-1 rounded-lg hover:bg-white/5 transition"
                aria-label="Close WhatsApp chat card"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="my-3 text-xs text-[#8A8A8A] leading-relaxed">
              Hey there! Looking for high-impact poster art, branding, or cinematic motion graphics? Let's connect on WhatsApp!
            </p>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white text-xs font-semibold hover:brightness-110 transition shadow-lg shadow-[#25D366]/20"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              Start WhatsApp Chat
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main floating button */}
      <div className="relative group">
        {/* Glow ring */}
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#25D366] opacity-70 blur-md group-hover:opacity-100 transition duration-300 animate-pulse-slow pointer-events-none" />

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open WhatsApp conversation"
          className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#121212] border-2 border-[#D4AF37] text-white shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
        >
          <MessageCircle className="w-7 h-7 text-[#25D366] fill-[#25D366]" />

          {/* Golden notification badge */}
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#D4AF37] text-[9px] text-black font-bold items-center justify-center">
              1
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}
