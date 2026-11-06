import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Layers3, Building2, TrendingUp, Lightbulb,
  Database, Link2, GitBranch, PieChart, ShieldCheck, ClipboardList, BookOpen, BarChart2,
} from 'lucide-react';
import SiteSearch from './SiteSearch.jsx';

export default function Navbar() {
  const [productOpen, setProductOpen] = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const closeTimer = useRef(null);
  const productRef = useRef(null);

  function close() { setProductOpen(false); }

  return (
    <>
      <header className="navbar">
        <div className="container nav-inner">
          <Link to="/" className="logo-link">
            <img src="/logowebsite.png" alt="Dolphin AI" className="logo-img" />
          </Link>

          <nav className="nav-links">
            {/* Product mega menu */}
            <div
              ref={productRef}
              className="nav-item product-item"
              onMouseEnter={() => { clearTimeout(closeTimer.current); setProductOpen(true); }}
              onMouseLeave={() => { closeTimer.current = setTimeout(() => setProductOpen(false), 180); }}
            >
              <button
                className={`nav-link product-toggle ${productOpen ? 'open' : ''}`}
                aria-haspopup="true"
                aria-expanded={productOpen}
                onClick={(e) => { e.stopPropagation(); setProductOpen(p => !p); }}
                onKeyDown={(e) => { if (e.key === 'Escape') close(); }}
              >
                <span>Product</span>
                <svg viewBox="0 0 20 20" width="12" height="12" aria-hidden="true">
                  <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" fill="currentColor" />
                </svg>
              </button>

              <div className={`mega-menu ${productOpen ? 'open' : ''}`} role="menu">
                <div className="mega-inner container">

                  <div className="mega-overview">
                    <div className="mega-brand-badge">
                      <img src="/logowebsite.png" alt="Dolphin AI" style={{ height: 32, objectFit: 'contain' }} />
                    </div>
                    <h4 className="mega-overview-title">Spend Intelligence Platform</h4>
                    <p className="mega-overview-copy">Clean, classify, and analyze your organization data from any source — in hours, not months.</p>
                    <Link to="/product" className="mega-overview-link" onClick={close}>Explore platform <ArrowRight size={13} /></Link>
                  </div>

                  <div className="mega-caps">
                    <p className="mega-section">Capabilities</p>
                    <div className="mega-caps-grid">
                      {[
                        { icon: <Layers3 size={16}/>,    title: 'Spend Classification',   desc: 'Map every transaction to your taxonomy', href: '/product#spend-classification' },
                        { icon: <Building2 size={16}/>,  title: 'Supplier Normalization', desc: 'One trusted view of every supplier',      href: '/product#supplier-normalization' },
                        { icon: <TrendingUp size={16}/>, title: 'Spend Intelligence',     desc: 'Trends, KPIs, and category visibility',   href: '/product#spend-intelligence' },
                        { icon: <Lightbulb size={16}/>,  title: 'Opportunity Detection',  desc: 'Savings, tail spend, off-contract',       href: '/product#opportunity-detection' },
                        { icon: <Database size={16}/>,   title: 'Data Enrichment',        desc: 'AI-assisted cleaning and enrichment',     href: '/product#data-enrichment' },
                        { icon: <Link2 size={16}/>,      title: 'Integrations',           desc: 'SAP, Oracle, Coupa, Excel and more',      href: '/product#integrations' },
                      ].map(item => (
                        <Link to={item.href} className="mega-cap-item" key={item.title} onClick={close}>
                          <div className="mega-cap-icon">{item.icon}</div>
                          <div className="mega-cap-text">
                            <strong>{item.title}</strong>
                            <span>{item.desc}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="mega-resources">
                    <Link to="/demo-video" className="mega-demo-cta" onClick={close}>
                      See Dolphin AI in action <ArrowRight size={13}/>
                    </Link>
                    <Link to="/dashboard" className="mega-resource-link" onClick={close}>
                      <PieChart size={14}/> Sample Dashboard
                    </Link>
                    <Link to="/reporting" className="mega-resource-link" onClick={close}>
                      <GitBranch size={14}/> Reporting
                    </Link>
                    <Link to="/scoping" className="mega-resource-link" onClick={close}>
                      <ClipboardList size={14}/> Project Scoping Tool
                    </Link>
                    <Link to="/onboarding" className="mega-resource-link" onClick={close}>
                      <BookOpen size={14}/> How It Works
                    </Link>
                    <Link to="/power-bi" className="mega-resource-link" onClick={close}>
                      <BarChart2 size={14}/> Live Dashboard
                    </Link>
                  </div>

                </div>
              </div>
            </div>

            <Link to="/">Home</Link>
            <Link to="/solution">Solution</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/contact">Contact</Link>
          </nav>

          <div className="nav-actions">
            <SiteSearch />
            <Link to="/book-demo" className="btn btn-primary">Book a Demo</Link>
            <Link to="/assessment" className="btn btn-soft-estimate">Get a free estimate <ArrowRight size={14} /></Link>
          </div>

          <button className="mobile-menu-btn" onClick={() => setMobileOpen(m => !m)} aria-label="Menu">
            <span className={`hamburger ${mobileOpen ? 'open' : ''}`} />
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className="mobile-nav" onClick={() => setMobileOpen(false)}>
          <Link to="/">Home</Link>
          <Link to="/product">Product</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/book-demo" className="btn btn-primary">Book a Demo</Link>
        </div>
      )}
    </>
  );
}
