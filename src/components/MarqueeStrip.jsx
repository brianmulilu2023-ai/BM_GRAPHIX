export default function MarqueeStrip({ items, direction = 'left', speed = 30 }) {
  const repeated = [...items, ...items, ...items];

  return (
    <div className="marquee-strip" aria-hidden="true">
      <div
        className={`marquee-track${direction === 'right' ? ' marquee-track--reverse' : ''}`}
        style={{ '--marquee-speed': `${speed}s` }}
      >
        {repeated.map((item, i) => (
          <span key={i} className="marquee-item">
            <span className="marquee-dot">✦</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
