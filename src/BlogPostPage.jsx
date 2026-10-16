import { useParams, Link } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import useSEO from './useSEO.js';
import posts from './blog-posts.json';

const CATEGORY_COLORS = {
  'Spend Intelligence': { bg: '#FEF0E6', color: '#C05818' },
  'AI & Technology':   { bg: '#EEF2F8', color: '#1B4980' },
  'Getting Started':   { bg: '#EBF5EE', color: '#1A6640' },
};

function formatDate(str) {
  return new Date(str).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Renders inline **bold** without pulling in a markdown dependency.
function inline(text) {
  return String(text).split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={j} style={{ color: 'var(--navy)', fontWeight: 700 }}>{part.slice(2, -2)}</strong>
      : part
  );
}

function renderBlock(block, i) {
  if (block.type === 'heading') return (
    <h2 key={i} style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-.02em', color: 'var(--navy)', marginTop: 40, marginBottom: 12, lineHeight: 1.3 }}>
      {block.text}
    </h2>
  );
  if (block.type === 'subheading') return (
    <h3 key={i} style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-.01em', color: 'var(--navy)', marginTop: 28, marginBottom: 10, lineHeight: 1.35 }}>
      {block.text}
    </h3>
  );
  if (block.type === 'image') {
    const fallback = block.src.replace(/\.webp$/, '.jpg');
    return (
      <figure key={i} style={{ margin: '34px 0' }}>
        <picture>
          <source srcSet={block.src} type="image/webp" />
          <img
            src={fallback}
            alt={block.alt}
            width={block.width || 1200}
            height={block.height || 675}
            loading={i < 2 ? 'eager' : 'lazy'}
            decoding="async"
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 10, border: '1px solid var(--gray-200)' }}
          />
        </picture>
        {block.caption && (
          <figcaption style={{ fontSize: 13, color: 'var(--gray-400)', marginTop: 10, lineHeight: 1.55, textAlign: 'center' }}>
            {block.caption}
          </figcaption>
        )}
      </figure>
    );
  }
  if (block.type === 'list') return (
    <ul key={i} style={{ margin: '0 0 22px', paddingLeft: 22 }}>
      {block.items.map((item, j) => (
        <li key={j} style={{ fontSize: 16, color: 'var(--gray-600)', lineHeight: 1.75, marginBottom: 9 }}>
          {inline(item)}
        </li>
      ))}
    </ul>
  );
  if (block.type === 'callout') return (
    <div key={i} style={{ background: 'var(--copper-bg)', borderLeft: '3px solid var(--copper)', padding: '16px 20px', borderRadius: '0 8px 8px 0', margin: '28px 0', fontSize: 15, fontWeight: 600, color: 'var(--navy)', lineHeight: 1.6 }}>
      {block.text}
    </div>
  );
  return (
    <p key={i} style={{ fontSize: 16, color: 'var(--gray-600)', lineHeight: 1.8, marginBottom: 20 }}>
      {inline(block.text)}
    </p>
  );
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = posts.find(p => p.slug === slug);

  useSEO({
    title: post ? `${post.title} | Dolphin AI Blog` : 'Post Not Found | Dolphin AI',
    description: post?.excerpt || '',
  });

  if (!post) return (
    <div className="site">
      <Navbar />
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: 32, color: 'var(--navy)' }}>Post Not Found</h1>
        <Link to="/blog" style={{ color: 'var(--copper)', fontWeight: 600 }}>← Back to Blog</Link>
      </div>
    </div>
  );

  const related = posts.filter(p => p.slug !== post.slug && p.category === post.category).slice(0, 2);

  return (
    <div className="site">
      <Navbar />

      {/* ── HERO ── */}
      <section style={{ background: 'var(--hero-grad)', borderBottom: '1px solid var(--gray-100)', padding: '56px 0 48px' }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--copper)', fontFamily: 'Inter, sans-serif', marginBottom: 24, textDecoration: 'none' }}>
            ← All Articles
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            <span style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase',
              padding: '4px 10px', borderRadius: 6,
              background: CATEGORY_COLORS[post.category]?.bg || '#f5f5f5',
              color: CATEGORY_COLORS[post.category]?.color || '#333',
            }}>{post.category}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-.03em', color: 'var(--navy)', marginBottom: 20, textWrap: 'balance' }}>
            {post.title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'var(--gray-400)' }}>
            <span>{post.author}</span>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--gray-200)' }} />
            <span>{formatDate(post.date)}</span>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--gray-200)' }} />
            <span>{post.readTime}</span>
          </div>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <div className="container" style={{ maxWidth: 760, padding: '56px 24px 80px' }}>
        <p style={{ fontSize: 18, fontWeight: 500, color: 'var(--navy)', lineHeight: 1.7, marginBottom: 32, borderBottom: '1px solid var(--gray-100)', paddingBottom: 32 }}>
          {post.excerpt}
        </p>
        {post.content.map((block, i) => renderBlock(block, i))}

        {/* ── CTA ── */}
        <div style={{ background: 'linear-gradient(135deg, #111 0%, #1E1E1E 50%, #C05818 85%, #E06820 100%)', borderRadius: 16, padding: '40px 40px', marginTop: 56, textAlign: 'center' }}>
          <h3 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 10 }}>See Dolphin AI In Action</h3>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 24, lineHeight: 1.6 }}>Book a 30-minute demo and see how we classify your spend data.</p>
          <Link to="/book-demo" className="btn btn-primary">Book a Demo</Link>
        </div>

        {/* ── RELATED ── */}
        {related.length > 0 && (
          <div style={{ marginTop: 64 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gray-400)', marginBottom: 20, fontFamily: 'Inter, sans-serif' }}>Related Articles</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              {related.map(r => (
                <Link key={r.slug} to={`/blog/${r.slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: '#fff', border: '1px solid var(--gray-100)', borderRadius: 10, padding: '20px', transition: 'box-shadow .2s' }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                  >
                    <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)', lineHeight: 1.35, marginBottom: 8 }}>{r.title}</p>
                    <p style={{ fontSize: 12, color: 'var(--copper)', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>{r.readTime} →</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
