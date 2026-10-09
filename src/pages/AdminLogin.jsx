import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, Key, ShieldCheck, ArrowLeft, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';

export default function AdminLogin({ navigate }) {
  const { adminLogin, isAdminLoggedIn } = useProjects();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect directly to dashboard
  if (isAdminLoggedIn) {
    navigate('/admin/dashboard');
    return null;
  }

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    setTimeout(() => {
      const success = adminLogin(email, password);
      setIsSubmitting(false);
      if (success) {
        navigate('/admin/dashboard');
      } else {
        setError('Access denied. Invalid credentials.');
      }
    }, 400);
  };

  return (
    <div className="relative z-10 min-h-[85vh] flex items-center justify-center px-4 pt-28 pb-20">
      {/* Background subtle glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-[#D4AF37]/5 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md p-8 sm:p-10 rounded-3xl glass-card border border-[#D4AF37]/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden bg-[#101010]/95 backdrop-blur-2xl"
      >
        {/* Top Gold Accent Bar */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#D4AF37] via-[#F5D77A] to-[#B8860B]" />

        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto">
              <img
                src="/assets/logo/BM_OFFICIAL_LOGO.png"
                alt="BM Graphix"
                className="w-full h-full object-contain filter drop-shadow-[0_6px_22px_rgba(212,175,55,0.45)]"
              />
            </div>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#F5F1E8]">
            Restricted Access
          </h1>
          <p className="text-xs text-[#8A8A8A] mt-1.5">
            Authorized Personnel Only
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300 text-center leading-relaxed"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs uppercase tracking-wider text-[#A0A0A0] font-medium">
              Administrator ID / Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8A8A]">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#161616] border border-white/10 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none text-xs text-[#F5F1E8] transition placeholder:text-[#444]"
                placeholder="Enter admin ID"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs uppercase tracking-wider text-[#A0A0A0] font-medium">
              Passkey / Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8A8A]">
                <Key className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#161616] border border-white/10 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none text-xs text-[#F5F1E8] transition placeholder:text-[#444]"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8A8A8A] hover:text-[#F5F1E8]"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-3 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-[#D4AF37] via-[#F5D77A] to-[#B8860B] shadow-lg shadow-[#D4AF37]/20 hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Verifying credentials...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Authorize & Login</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-white/10 text-center">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-xs text-[#8A8A8A] hover:text-[#F5F1E8] flex items-center justify-center gap-1 mx-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Website</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
