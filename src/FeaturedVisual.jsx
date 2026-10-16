import { useEffect, useRef, useState } from 'react';

/*
  Interactive panel for the featured blog card.

  Replaces the previous static emoji placeholder. Bars grow in on mount, the
  total counts up, the sparkline draws itself, and hovering a row isolates it.
  Decorative only — the card's heading carries the meaning for screen readers,
  so the whole thing is aria-hidden and contains no focusable elements (it sits
  inside a <Link>, and nesting interactive elements would break keyboard nav).
*/

const CATEGORIES = [
  { label: 'IT & Telecom',    value: 4.2, pct: 100 },
  { label: 'Logistics',       value: 3.4, pct: 81 },
  { label: 'Facilities',      value: 2.6, pct: 62 },
  { label: 'Prof. Services',  value: 1.8, pct: 43 },
  { label: 'MRO',             value: 1.2, pct: 29 },
];

const TREND = [34, 41, 38, 52, 47, 63, 58, 71, 66, 82, 78, 94];
const TOTAL = 13.2;

function useInView() {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    if (typeof IntersectionObserver === 'undefined') { setSeen(true); return; }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen]);
  return [ref, seen];
}

function useCountUp(target, run, ms = 900) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setN(target); return; }
    let raf, t0;
    const tick = t => {
      if (!t0) t0 = t;
      const p = Math.min((t - t0) / ms, 1);
      setN(target * (1 - Math.pow(1 - p, 3)));          // ease-out cubic
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    // Guarantee the final value lands even where rAF is throttled or never
    // fires (background tabs, headless capture, some embedded webviews).
    const settle = setTimeout(() => setN(target), ms + 120);
    return () => { cancelAnimationFrame(raf); clearTimeout(settle); };
  }, [target, run, ms]);
  return n;
}

export default function FeaturedVisual() {
  const [ref, inView] = useInView();
  const [hover, setHover] = useState(null);
  const total = useCountUp(TOTAL, inView);

  const W = 300, H = 48;
  const max = Math.max(...TREND);
  const pts = TREND.map((v, i) => [
    (W / (TREND.length - 1)) * i,
    H - (v / max) * (H - 6) - 3,
  ]);
  const line = pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const area = `0,${H} ${line} ${W},${H}`;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      onMouseLeave={() => setHover(null)}
      style={{
        background: 'linear-gradient(135deg, #111 0%, #1E1E1E 48%, #8E3F12 88%, #C05818 100%)',
        padding: '34px 32px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 18,
        minHeight: 340,
      }}
    >
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div>
          <div style={{
            fontSize: 9.5, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,.45)', marginBottom: 6,
          }}>Spend by category</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-.02em', lineHeight: 1 }}>
            ${total.toFixed(1)}M
          </div>
        </div>
        <div style={{
          fontSize: 9, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,.4)', border: '1px solid rgba(255,255,255,.18)',
          padding: '3px 8px', borderRadius: 5,
        }}>Sample</div>
      </div>

      {/* bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {CATEGORIES.map((c, i) => {
          const dim = hover !== null && hover !== i;
          return (
            <div
              key={c.label}
              onMouseEnter={() => setHover(i)}
              style={{
                display: 'grid', gridTemplateColumns: '84px 1fr 38px', alignItems: 'center', gap: 9,
                opacity: dim ? 0.38 : 1,
                transform: hover === i ? 'translateX(2px)' : 'none',
                transition: 'opacity .22s ease, transform .22s ease',
              }}
            >
              <span style={{
                fontSize: 10, color: hover === i ? '#fff' : 'rgba(255,255,255,.62)',
                textAlign: 'right', whiteSpace: 'nowrap', transition: 'color .22s ease',
              }}>{c.label}</span>

              <span style={{ height: 7, borderRadius: 4, background: 'rgba(255,255,255,.1)', overflow: 'hidden' }}>
                <span style={{
                  display: 'block', height: '100%', borderRadius: 4,
                  width: inView ? `${c.pct}%` : '0%',
                  background: hover === i
                    ? 'linear-gradient(90deg,#F0A060,#FFD2B0)'
                    : 'linear-gradient(90deg,#C05818,#E06820)',
                  transition: `width .8s cubic-bezier(.22,.8,.3,1) ${i * 90}ms, background .22s ease`,
                }} />
              </span>

              <span style={{
                fontSize: 10, fontWeight: 700,
                color: hover === i ? '#fff' : 'rgba(255,255,255,.5)',
                transition: 'color .22s ease',
              }}>${c.value.toFixed(1)}M</span>
            </div>
          );
        })}
      </div>

      {/* trend */}
      <div>
        <div style={{
          fontSize: 9.5, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,.35)', marginBottom: 7,
        }}>Monthly trend</div>
        <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: 'block' }}>
          <defs>
            <linearGradient id="fv-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E06820" stopOpacity=".42" />
              <stop offset="100%" stopColor="#E06820" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon
            points={area}
            fill="url(#fv-fill)"
            style={{ opacity: inView ? 1 : 0, transition: 'opacity .7s ease .5s' }}
          />
          <polyline
            points={line}
            fill="none"
            stroke="#F0A060"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            style={{
              strokeDasharray: 600,
              strokeDashoffset: inView ? 0 : 600,
              transition: 'stroke-dashoffset 1.1s cubic-bezier(.22,.8,.3,1) .35s',
            }}
          />
        </svg>
      </div>

      {/* cta */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 7,
        fontSize: 10.5, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,.8)',
      }}>
        Read article
        <svg width="16" height="8" viewBox="0 0 16 8" fill="none" style={{ overflow: 'visible' }}>
          <path d="M0 4h12M9 1l3.2 3L9 7" stroke="#E06820" strokeWidth="1.6"
                strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}
