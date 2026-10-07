import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';

export default function Toast() {
  const { toast } = useProjects();

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 left-6 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-xl bg-[#141414]/95 backdrop-blur-xl border border-[#D4AF37]/50 shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_20px_rgba(212,175,55,0.2)] text-sm font-medium text-[#F5F1E8]"
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          ) : toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <Sparkles className="w-5 h-5 text-[#F5D77A] shrink-0" />
          )}
          <span>{toast.message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
