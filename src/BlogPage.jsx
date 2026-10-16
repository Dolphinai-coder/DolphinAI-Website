import { Link } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import useSEO from './useSEO.js';
import posts from './blog-posts.json';
import FeaturedVisual from './FeaturedVisual.jsx';

const CATEGORY_COLORS = {
  'Spend Intelligence': { bg: '#FEF0E6', color: '#C05818' },
  'AI & Technology':   { bg: '#EEF2F8', color: '#1B4980' },
  'Getting Started':   { bg: '#EBF5EE', color: '#1A6640' },
};

function formatDate(str) {
  return new Date(str).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function BlogPage() {
  useSEO({
    title: 'Blog — Spend Intelligence Insights | Dolphin AI',
    description: 'Expert insights on spend classification, supply chain analytics, supplier normalization, and AI-powered spend intelligence.',
  });

  const featured = posts.find(p => p.featured);
  const rest = posts.filter(p => !p.featured);

  return (
    <div className="site">
      <Navbar />

      {/* ── HEADER ── */}
      <section style={{ background: 'var(--hero-grad)', borderBottom: '1px solid var(--gray-100)', padding: '64px 0 56px' }}>
        <div className="container">
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--copper)', marginBottom: 14 }}>
            Insights &amp; Resources
          </p>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-.03em', color: 'var(--navy)', marginBottom: 16, maxWidth: 560 }}>
            Spend Intelligence<br />Insights
          </h1>
          <p style={{ fontSize: 17, color: 'var(--gray-600)', maxWidth: 480, lineHeight: 1.65 }}>
            Practical guides and expert thinking on supply chain analytics, spend classification, and data-driven sourcing.
          </p>
        </div>
      </section>

      <div className="container" style={{ padding: '60px 0 100px' }}>

        {/* ── FEATURED POST ── */}
        {featured && (
          <Link to={`/blog/${featured.slug}`} style={{ display: 'block', textDecoration: 'none', marginBottom: 56 }}>
            <article style={{
              display: 'grid',
              gridTemplateColumns: '1fr 420px',
              gap: 0,
              background: '#fff',
              border: '1px solid var(--gray-100)',
              borderRadius: 16,
              overflow: 'hidden',
              transition: 'box-shadow .2s',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 40px rgba(0,0,0,0.12)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'}
            >
              {/* text */}
              <div style={{ padding: '48px 48px 48px 48px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase',
                    padding: '4px 10px', borderRadius: 6,
                    background: CATEGORY_COLORS[featured.category]?.bg || '#f5f5f5',
                    color: CATEGORY_COLORS[featured.category]?.color || '#333',
                  }}>{featured.category}</span>
                  <span style={{ fontSize: 12, color: 'var(--gray-400)', fontFamily: 'Inter, sans-serif' }}>Featured</span>
                </div>
                <h2 style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.2, letterSpacing: '-.02em', color: 'var(--navy)', marginBottom: 16, textWrap: 'balance' }}>
                  {featured.title}
                </h2>
                <p style={{ fontSize: 15, color: 'var(--gray-600)', lineHeight: 1.7, marginBottom: 32 }}>
                  {featured.excerpt}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ fontSize: 13, color: 'var(--gray-400)', fontFamily: 'Inter, sans-serif' }}>{formatDate(featured.date)}</span>
                  <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--gray-200)' }} />
                  <span style={{ fontSize: 13, color: 'var(--gray-400)', fontFamily: 'Inter, sans-serif' }}>{featured.readTime}</span>
                </div>
              </div>

              {/* visual panel */}
              <FeaturedVisual />
            </article>
          </Link>
        )}

        {/* ── GRID ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {rest.map(post => (
            <Link key={post.slug} to={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
              <article style={{
                background: '#fff',
                border: '1px solid var(--gray-100)',
                borderRadius: 12,
                overflow: 'hidden',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'box-shadow .2s, transform .2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {/* colored top strip */}
                <div style={{ height: 4, background: `linear-gradient(90deg, ${CATEGORY_COLORS[post.category]?.color || '#E06820'}, ${CATEGORY_COLORS[post.category]?.bg || '#f5f5f5'})` }} />

                <div style={{ padding: '28px 28px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <span style={{
                    display: 'inline-block', fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase',
                    padding: '3px 8px', borderRadius: 4, marginBottom: 14,
                    background: CATEGORY_COLORS[post.category]?.bg || '#f5f5f5',
                    color: CATEGORY_COLORS[post.category]?.color || '#333',
                  }}>{post.category}</span>
                  <h3 style={{ fontSize: 18, fontWeight: 800, lineHeight: 1.25, letterSpacing: '-.015em', color: 'var(--navy)', marginBottom: 12, textWrap: 'balance' }}>
                    {post.title}
                  </h3>
                  <p style={{ fontSize: 13.5, color: 'var(--gray-600)', lineHeight: 1.65, flex: 1, marginBottom: 20 }}>
                    {post.excerpt}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--gray-100)' }}>
                    <span style={{ fontSize: 12, color: 'var(--gray-400)', fontFamily: 'Inter, sans-serif' }}>{formatDate(post.date)}</span>
                    <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 600, color: 'var(--copper)', fontFamily: 'Inter, sans-serif' }}>{post.readTime} →</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

      </div>

      {/* ── FOOTER CTA ── */}
      <section style={{ background: 'var(--gray-50)', borderTop: '1px solid var(--gray-100)', padding: '56px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--navy)', marginBottom: 12 }}>Ready to clean your spend data?</h2>
          <p style={{ color: 'var(--gray-600)', marginBottom: 28 }}>See how Dolphin AI classifies spend in days, not months.</p>
          <Link to="/book-demo" className="btn btn-primary">Book a Demo</Link>
        </div>
      </section>
    </div>
  );
}
