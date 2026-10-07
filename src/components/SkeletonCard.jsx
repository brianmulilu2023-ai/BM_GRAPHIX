import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-[#141414] border border-white/5 animate-pulse mb-6">
      <div className="w-full h-80 bg-neutral-900/60 relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>
      <div className="p-5 space-y-3">
        <div className="h-3 w-20 bg-neutral-800 rounded" />
        <div className="h-5 w-48 bg-neutral-800 rounded" />
        <div className="h-3 w-full bg-neutral-800/60 rounded" />
        <div className="h-3 w-2/3 bg-neutral-800/60 rounded" />
      </div>
    </div>
  );
}
