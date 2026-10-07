import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, Key, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';

export default function AdminLogin({ navigate }) {
  const { adminLogin, isAdminLoggedIn } = useProjects();
  const [email, setEmail] = useState('admin@bmgraphix.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  // If already logged in, redirect directly to dashboard
  if (isAdminLoggedIn) {
    navigate('/admin/dashboard');
    return null;
  }

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    const success = adminLogin(email, password);
    if (success) {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid credentials. Try: admin@bmgraphix.com / admin123');
    }
  };

  const handleQuickDemo = () => {
    setEmail('admin@bmgraphix.com');
    setPassword('admin123');
    const success = adminLogin('admin@bmgraphix.com', 'admin123');
    if (success) {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="relative z-10 min-h-[85vh] flex items-center justify-center px-4 pt-24 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 sm:p-10 rounded-3xl glass-card border border-[#D4AF37]/40 shadow-2xl relative overflow-hidden bg-[#121212]/90 backdrop-blur-2xl"
      >
        {/* Top Gold Accent */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#D4AF37] via-[#F5D77A] to-[#B8860B]" />

        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-black border border-[#D4AF37]/50 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#D4AF37]/15">
            <Lock className="w-7 h-7 text-[#F5D77A]" />
          </div>
          <h1 className="font-display font-bold text-2xl text-[#F5F1E8]">Admin Authentication</h1>
          <p className="text-xs text-[#8A8A8A] mt-1">
            BM Graphix Content Management Portal
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-900/30 border border-red-500/40 text-xs text-red-300 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-medium">
              Admin Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8A8A]">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#181818] border border-white/10 focus:border-[#D4AF37] focus:outline-none text-xs text-[#F5F1E8]"
                placeholder="admin@bmgraphix.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-medium">
              Security Key / Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8A8A]">
                <Key className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#181818] border border-white/10 focus:border-[#D4AF37] focus:outline-none text-xs text-[#F5F1E8]"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-[#D4AF37] via-[#F5D77A] to-[#B8860B] shadow-lg shadow-[#D4AF37]/25 hover:brightness-110 active:scale-95 transition"
          >
            Access Dashboard &rarr;
          </button>
        </form>

        {/* Demo Quick Button */}
        <div className="mt-6 pt-6 border-t border-white/10 text-center space-y-3">
          <p className="text-[11px] text-[#8A8A8A]">
            Demo Credentials: <span className="text-[#F5D77A] font-mono">admin@bmgraphix.com / admin123</span>
          </p>
          <button
            onClick={handleQuickDemo}
            className="w-full py-2 px-3 rounded-lg text-xs font-medium text-[#F5D77A] bg-[#D4AF37]/10 border border-[#D4AF37]/30 hover:bg-[#D4AF37]/20 transition flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>One-Click Demo Sign In</span>
          </button>

          <button
            onClick={() => navigate('/')}
            className="text-xs text-[#8A8A8A] hover:text-[#F5F1E8] flex items-center justify-center gap-1 mx-auto pt-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Portfolio</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
