import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function GoldCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    // Only enable on desktop with mouse pointer
    const isTouch = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 1024;
    setIsMobile(isTouch);
    if (isTouch) return;

    document.body.classList.add('custom-cursor-active');

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleMouseOver = (e) => {
      const target = e.target;
      const isInteractive = target.closest('a, button, input, textarea, select, [role="button"], .interactive-cursor');
      setIsHovering(Boolean(isInteractive));
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isVisible]);

  if (isMobile || !isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Central Gold Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-[#F5D77A] rounded-full pointer-events-none z-[10000] shadow-[0_0_10px_#D4AF37]"
        animate={{
          x: mousePosition.x - 5,
          y: mousePosition.y - 5,
          scale: isHovering ? 0 : 1,
        }}
        transition={{ type: 'spring', damping: 40, stiffness: 600, mass: 0.1 }}
      />

      {/* Trailing Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] border border-[#D4AF37]/70"
        style={{
          boxShadow: isHovering ? '0 0 25px rgba(212, 175, 55, 0.4)' : 'none',
          backgroundColor: isHovering ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
        }}
        animate={{
          x: mousePosition.x - (isHovering ? 28 : 16),
          y: mousePosition.y - (isHovering ? 28 : 16),
          width: isHovering ? 56 : 32,
          height: isHovering ? 56 : 32,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 250, mass: 0.2 }}
      />
    </div>
  );
}
