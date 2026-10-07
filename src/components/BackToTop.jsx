import { useEffect, useState } from 'react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(pct);
      setVisible(scrollTop > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // SVG circle math
  const radius = 21;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <button
      onClick={handleClick}
      aria-label="Back to top"
      className={`back-to-top-btn${visible ? ' back-to-top-btn--visible' : ''}`}
    >
      <svg className="progress-ring" width="52" height="52" viewBox="0 0 52 52">
        {/* Background ring */}
        <circle
          stroke="rgba(212,175,55,0.15)"
          strokeWidth="3"
          fill="transparent"
          r={radius}
          cx="26"
          cy="26"
        />
        {/* Progress ring */}
        <circle
          stroke="#D4AF37"
          strokeWidth="3"
          fill="transparent"
          r={radius}
          cx="26"
          cy="26"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 26 26)"
          style={{ transition: 'stroke-dashoffset 0.1s linear' }}
        />
      </svg>
      <span className="back-to-top-arrow">↑</span>
    </button>
  );
}
