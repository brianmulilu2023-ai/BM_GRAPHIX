import { useEffect, useRef, useState } from 'react';

function useCountUp(target, duration = 1800, start = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const pct = Math.min(elapsed / duration, 1);
      // ease-out
      const eased = 1 - Math.pow(1 - pct, 3);
      setCount(Math.floor(eased * target));
      if (pct < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);

  return count;
}

function StatItem({ number, suffix, label, icon: Icon, started }) {
  const parsed = parseInt(number.replace(/\D/g, ''), 10) || 0;
  const count = useCountUp(parsed, 1600, started);

  return (
    <div className="stat-item">
      <div className="stat-icon-wrap">
        <Icon className="stat-icon" />
      </div>
      <span className="stat-number">
        {count}{suffix}
      </span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

export default function AnimatedStats({ stats }) {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="animated-stats-grid">
      {stats.map((s, i) => {
        const raw = s.number;
        const suffix = raw.replace(/[0-9]/g, '');
        return (
          <StatItem
            key={i}
            number={raw}
            suffix={suffix}
            label={s.label}
            icon={s.icon}
            started={started}
          />
        );
      })}
    </div>
  );
}
