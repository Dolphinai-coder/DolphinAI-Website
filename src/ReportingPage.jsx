import Navbar from './Navbar.jsx';
import useSEO from './useSEO.js';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3, Users, Tag, FileText, Lightbulb, Bell, BookOpen,
  ArrowRight, CheckCircle2, TrendingUp, ShieldCheck, Download, LayoutDashboard, Lock,
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://dolphinai-api-c2a8ezgdctakh9g0.centralus-01.azurewebsites.net';
const PERSONAL_DOMAINS = new Set(['gmail.com','yahoo.com','hotmail.com','outlook.com','live.com','msn.com','aol.com','icloud.com','me.com','mac.com','protonmail.com','proton.me','ymail.com','mail.com','zoho.com','gmx.com','fastmail.com','tutanota.com','hey.com','pm.me']);
function isPersonalEmail(email) { const d = email.split('@')[1]?.toLowerCase(); return d ? PERSONAL_DOMAINS.has(d) : false; }

const TABS = [
  {
    id: 'spend-overview',
    icon: <BarChart3 size={16} />,
    label: 'Spend Overview',
    headline: 'Total spend visibility across every dimension',
    desc: 'See your full spend footprint — by year, location, business unit, and data source — in one live dashboard. Trend lines, category breakdowns, and top-supplier rankings update in real time.',
    img: '/screenshots/dash-spend-overview.png',
    stats: [{ label: 'Transactions analysed', value: '100,000' }, { label: 'Total spend tracked', value: '$7.49B' }, { label: 'Classification rate', value: '75.9%' }],
  },
  {
    id: 'supplier-analysis',
    icon: <Users size={16} />,
    label: 'Supplier Analysis',
    headline: 'Know every supplier — their spend, risk, and performance',
    desc: 'Pareto analysis, year-over-year supplier spend, risk distribution, and performance scoring in one view. Identify concentration risk before it becomes a problem.',
    img: '/screenshots/dash-reports.png',
    stats: [{ label: 'Suppliers tracked', value: '39' }, { label: 'High-risk suppliers', value: '8' }, { label: 'Avg performance score', value: '75.9%' }],
  },
  {
    id: 'category-analysis',
    icon: <Tag size={16} />,
    label: 'Category Analysis',
    headline: 'Deep taxonomy insights down to Level 4',
    desc: 'Category trend charts, L1 and L2 breakdowns, YoY growth by category, and a full spend summary table. Filter by scope level to go as deep as your taxonomy allows.',
    img: '/screenshots/dash-supplier-analysis.png',
    stats: [{ label: 'L1 categories', value: '10' }, { label: 'Coverage rate', value: '82.4%' }, { label: 'Fastest growing', value: '+34.9%' }],
  },
  {
    id: 'contract-analysis',
    icon: <FileText size={16} />,
    label: 'Contract Analysis',
    headline: 'Stay ahead of renewals and compliance gaps',
    desc: 'Active contracts, expiry alerts, compliance trend vs. target, and renewal risk — all surfaced automatically. Never miss a critical renewal again.',
    img: '/screenshots/dash-category-analysis.png',
    stats: [{ label: 'Active contracts', value: '8,142' }, { label: 'Expiring in 90 days', value: '542' }, { label: 'Compliance rate', value: '89.7%' }],
  },
  {
    id: 'savings-opportunities',
    icon: <Lightbulb size={16} />,
    label: 'Savings Opportunities',
    headline: 'Savings opportunities ranked by value and confidence',
    desc: 'Every opportunity quantified in dollars, ranked by potential impact, and tracked through planning, in-progress, and implemented stages.',
    img: '/screenshots/dash-contract-analysis.png',
    stats: [{ label: 'Opportunities found', value: '243' }, { label: 'Potential savings', value: '$412.3M' }, { label: 'Implemented savings', value: '$96.8M' }],
  },
  {
    id: 'alerts-insights',
    icon: <Bell size={16} />,
    label: 'Alerts & Insights',
    headline: 'Proactive alerts before issues become crises',
    desc: 'Critical spend anomalies, contract risks, duplicate invoices, and supplier risks — all surfaced with severity levels, dollar impact, and AI-generated action recommendations.',
    img: '/screenshots/dash-savings.png',
    stats: [{ label: 'Critical alerts', value: '17' }, { label: 'Spend anomalies', value: '36' }, { label: 'AI insights open', value: '24' }],
  },
  {
    id: 'reports',
    icon: <BookOpen size={16} />,
    label: 'Reports',
    headline: 'Scheduled reports delivered automatically',
    desc: 'Create, schedule, and share organization reports — weekly, monthly, or on demand. Export to PDF, Excel, or CSV. Every report your team needs, automated.',
    img: '/screenshots/dash-alerts.png',
    stats: [{ label: 'Reports in library', value: '128' }, { label: 'Scheduled deliveries', value: '34' }, { label: 'Ran last 30 days', value: '96' }],
  },
];

export default function ReportingPage() {
  useSEO({ title: 'Spend Reporting & Analytics — Dolphin AI', description: 'Interactive spend analytics: overview, supplier analysis, category breakdowns, and savings opportunities — all from your cleaned and classified supply chain data.' });
  const [active, setActive]       = useState(0);
  const [animating, setAnimating] = useState(false);
  const [visible, setVisible]     = useState(false);
  const [lightbox, setLightbox]   = useState(null);
  const [demoBooked, setDemoBooked] = useState(() => localStorage.getItem('report_unlocked') === 'true');
  const [form, setForm]           = useState({ firstName: '', email: '', company: '' });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [emailError, setEmailError] = useState('');
  const sectionRef = useRef(null);

  /* scroll reveal only */
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  /* close lightbox on Escape */
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => { if (e.key === 'Escape') setLightbox(null); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [lightbox]);

  function handleTabClick(i) {
    if (i === active) return;
    setAnimating(true);
    setTimeout(() => { setActive(i); setAnimating(false); }, 200);
  }

  async function handleUnlock(e) {
    e.preventDefault();
    if (!form.firstName || !form.email || !form.company) { setFormError('Please fill in all fields.'); return; }
    if (isPersonalEmail(form.email)) { setEmailError('Please use your work email.'); return; }
    setFormError(''); setEmailError(''); setSubmitting(true);
    try {
      await fetch(`${API_URL}/api/book-demo`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName: form.firstName, lastName: '', email: form.email, company: form.company, role: '', companySize: '', annualSpend: '', message: 'Unlocked from reporting page' }),
      });
    } catch (_) { /* still unlock even if API fails */ }
    localStorage.setItem('report_unlocked', 'true');
    setDemoBooked(true);
    setSubmitting(false);
  }

  const tab = TABS[active];
  const isLocked = !demoBooked && active > 0;

  return (
    <div className="site">
      <Navbar />

      <main>
        {/* Hero */}
        <section className="rpt-hero">
          <div className="container rpt-hero-inner">
            <div className="rpt-live-badge"><span className="rpt-live-dot" />Live dashboards</div>
            <h1>Every organization insight, live and in one place</h1>
            <p>From spend trends to supplier risk, contract compliance to savings pipelines — Dolphin AI turns raw data into executive-ready dashboards that update automatically.</p>
            <div className="rpt-hero-pills">
              {['Real-time data', 'Zero manual preparation', 'Export to PDF & Excel', 'Scheduled delivery'].map(t => (
                <span className="rpt-pill" key={t}><CheckCircle2 size={12} />{t}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Showcase */}
        <section className="rpt-showcase" ref={sectionRef}>
          <div className="container">
            {/* Headline above grid */}
          <div className={`rpt-headline-row ${visible ? 'rpt-visible' : ''}`} style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)', transition: 'opacity 0.5s, transform 0.5s', marginBottom: 24 }}>
            <h2 className={`rpt-content-h2 ${animating ? 'rpt-fade-out' : 'rpt-fade-in'}`}>{tab.headline}</h2>
            <div className="rpt-stats2" style={{ position: 'relative' }}>
              {isLocked ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', padding: '8px 0' }}>
                  <Lock size={13} style={{ color: '#9ca3af' }}/>
                  <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 600 }}>Enter your details to see live stats</span>
                </div>
              ) : (
                tab.stats.map(s => (
                  <div className={`rpt-stat2 ${animating ? 'rpt-fade-out' : 'rpt-fade-in'}`} key={s.label}>
                    <strong>{s.value}</strong>
                    <span>{s.label}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className={`rpt-layout2 ${visible ? 'rpt-visible' : ''}`}>

              {/* LEFT: tab nav card */}
              <div className="rpt-tabs2">
                <p className="rpt-tabs-label">Dashboard views</p>
                <div className="rpt-tab-list">
                  {TABS.map((t, i) => {
                    const tabLocked = !demoBooked && i > 0;
                    return (
                      <button
                        key={t.id}
                        className={`rpt-tab2 ${i === active ? 'rpt-tab2-active' : ''}`}
                        onClick={() => handleTabClick(i)}
                        style={tabLocked && i !== active ? { opacity: 0.6 } : {}}
                      >
                        <span className="rpt-tab-icon" style={{ opacity: tabLocked ? 0.7 : 1 }}>{t.icon}</span>
                        <span style={{ flex: 1 }}>{t.label}</span>
                        {i === active && !tabLocked && <span className="rpt-tab-dot" />}
                        {tabLocked && <Lock size={12} style={{ color: i === active ? '#E06820' : '#9ca3af', flexShrink: 0 }}/>}
                      </button>
                    );
                  })}
                </div>
                <Link to="/book-demo" className="rpt-tabs-cta">
                  See it live <ArrowRight size={13} />
                </Link>
              </div>

              {/* RIGHT: screenshot only */}
              <div className="rpt-content2">

                {/* Browser chrome */}
                <div className="rpt-browser2">
                  <div className="rpt-browser-bar">
                    <span className="rpt-dot rpt-dot-red" />
                    <span className="rpt-dot rpt-dot-yellow" />
                    <span className="rpt-dot rpt-dot-green" />
                    <span className="rpt-browser-url">app.dolphinaipro.com / {tab.id}</span>
                    <span className="rpt-live-chip"><span className="rpt-live-dot-sm" />LIVE</span>
                  </div>
                  <div className="rpt-browser-screen2" style={{ position: 'relative' }}>
                    <img
                      key={tab.id}
                      src={tab.img}
                      alt={tab.label}
                      className={`rpt-screenshot2 ${animating ? 'rpt-img-out' : 'rpt-img-in'}`}
                      onClick={() => !isLocked && setLightbox(tab.img)}
                      style={{ cursor: isLocked ? 'default' : 'zoom-in', filter: isLocked ? 'blur(7px) brightness(0.6)' : 'none', transition: 'filter 0.3s', userSelect: 'none' }}
                    />
                    {!isLocked && (
                      <div className="rpt-zoom-hint" onClick={() => setLightbox(tab.img)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                        Click to enlarge
                      </div>
                    )}
                    {isLocked && (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, padding: '16px' }}>
                        <div style={{ background: '#fff', borderRadius: 20, padding: '28px 28px', maxWidth: 340, width: '90%', boxShadow: '0 8px 48px rgba(0,0,0,0.18)' }}>
                          <div style={{ textAlign: 'center', marginBottom: 20 }}>
                            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#C05818,#E06820)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                              <Lock size={20} color="#fff"/>
                            </div>
                            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1B2A4A', margin: 0 }}>Unlock {tab.label}</h3>
                          </div>
                          <form onSubmit={handleUnlock} noValidate>
                            <input
                              type="text" placeholder="First name" value={form.firstName}
                              onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                              style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box', marginBottom: 8 }}
                            />
                            <input
                              type="text" placeholder="Company" value={form.company}
                              onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                              style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box', marginBottom: 8 }}
                            />
                            <input
                              type="email" placeholder="Work email" value={form.email}
                              onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setEmailError(''); }}
                              onBlur={() => { if (form.email && isPersonalEmail(form.email)) setEmailError('Please use your work email.'); }}
                              style={{ width: '100%', padding: '9px 12px', border: `1.5px solid ${emailError ? '#ef4444' : '#e5e7eb'}`, borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box', marginBottom: 6 }}
                            />
                            {emailError && <p style={{ fontSize: 11, color: '#ef4444', margin: '0 0 6px' }}>{emailError}</p>}
                            {formError && <p style={{ fontSize: 11, color: '#ef4444', margin: '0 0 6px' }}>{formError}</p>}
                            <button type="submit" disabled={submitting} style={{ width: '100%', background: 'linear-gradient(135deg,#C05818,#E06820)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px', fontSize: 13, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, opacity: submitting ? 0.7 : 1 }}>
                              {submitting ? 'Unlocking…' : <> Get Access <ArrowRight size={14}/></>}
                            </button>
                          </form>
                          <button onClick={() => handleTabClick(0)} style={{ marginTop: 10, background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: '#9ca3af', textDecoration: 'underline', width: '100%' }}>
                            Back to Spend Overview
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Feature strip */}
        <section className="rpt-features">
          <div className="container rpt-features-grid">
            {[
              { icon: <TrendingUp size={20} />, title: 'Always up to date', desc: 'Data refreshes automatically from every connected source. No manual exports, no stale reports.' },
              { icon: <LayoutDashboard size={20} />, title: 'Role-based views', desc: 'Leadership, category managers, finance — each role gets the view they need without drowning in irrelevant data.' },
              { icon: <Download size={20} />, title: 'One-click export', desc: 'Every dashboard and table exports to PDF, Excel, or CSV in seconds. Board-ready in minutes.' },
              { icon: <ShieldCheck size={20} />, title: 'Enterprise security', desc: 'All data processed within your security boundary. Role-based access control, SOC 2 Type II in preparation.' },
            ].map(f => (
              <div className="rpt-feature-card" key={f.title}>
                <div className="rpt-feature-icon">{f.icon}</div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rpt-cta">
          <div className="container rpt-cta-inner">
            <h2>See these dashboards on your own data</h2>
            <p>In a live demo we'll connect to your data and show you real results — not a generic demo.</p>
            <div className="rpt-cta-btns">
              <Link to="/book-demo" className="btn btn-primary btn-lg">Book a Demo <ArrowRight size={15} /></Link>
              <Link to="/assessment" className="btn btn-primary btn-lg">Try the free ROI calculator <ArrowRight size={15} /></Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-bottom">
          <p>Copyright © 2026 Dolphin AI</p>
          <div>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </footer>

      {lightbox && (
        <div className="rpt-lightbox" onClick={() => setLightbox(null)}>
          <button className="rpt-lightbox-close" onClick={() => setLightbox(null)} aria-label="Close">✕</button>
          <img src={lightbox} alt="Full size screenshot" className="rpt-lightbox-img" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
