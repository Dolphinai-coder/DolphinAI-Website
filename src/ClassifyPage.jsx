import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, AlertCircle, Loader2, ChevronDown, RotateCcw, ArrowRight, Calendar } from 'lucide-react';

import { apiEndpoint } from './apiEndpoint.js';
const MAX_USES = 2;

const LEVEL_CONFIG = [
  { label: 'Level 1' },
  { label: 'Level 2' },
  { label: 'Level 3' },
  { label: 'Level 4' },
];

const EXAMPLES = ['Fastenal', 'UPS', 'FedEx', 'Willis Rubber', 'DHL Global Forwarding', 'Zetwerk Manufacturing'];

function getUsageKey(email) { return `classify_uses_${email.toLowerCase().trim()}`; }
function getUsageCount(email) { return parseInt(localStorage.getItem(getUsageKey(email)) || '0', 10); }
function incrementUsage(email) { localStorage.setItem(getUsageKey(email), getUsageCount(email) + 1); }

function Result({ result, onReset }) {
  const levels = result.levels || result.classification.split(' > ');
  return (
    <div className="cpr-wrap">
      <div className="cpr-card">
        <div className="cpr-toprow">
          <div className="cpr-badge-ok">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="8" fill="#dcfce7"/>
              <path d="M4.5 8l2.5 2.5L11.5 5.5" stroke="#16a34a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Category identified
          </div>
          <button className="cpr-reset" onClick={onReset}>
            <RotateCcw size={12} /> Classify another
          </button>
        </div>
        <div className="cpr-levels">
          {levels.map((lvl, i) => {
            const cfg = LEVEL_CONFIG[i] || LEVEL_CONFIG[3];
            return (
              <div key={i} className="cpr-level-row">
                <div className="cpr-level" style={{ '--c': cfg.color, '--bg': cfg.bg }}>
                  <span className="cpr-level-label">{cfg.label}</span>
                  <span className="cpr-level-value">{lvl}</span>
                </div>
                {i < levels.length - 1 && <div className="cpr-arrow"><ChevronDown size={13} /></div>}
              </div>
            );
          })}
        </div>
        <div className="cpr-breadcrumb">
          {levels.map((lvl, i) => (
            <span key={i} className="cpr-bc-item">
              {i > 0 && <span className="cpr-bc-sep">›</span>}
              {lvl}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function LimitReached({ email }) {
  return (
    <div className="cp-limit-card">
      <div className="cp-limit-icon"><Calendar size={28} /></div>
      <h3>You've used your {MAX_USES} free classifications</h3>
      <p>
        Want to classify your full spend dataset? Book a live demo and we'll show you
        how Dolphin AI handles thousands of suppliers and invoice lines automatically.
      </p>
      <Link to="/book-demo" className="btn btn-primary">
        Schedule a demo <ArrowRight size={15} />
      </Link>
      <p className="cp-limit-sub">or <Link to="/contact">contact us</Link> with any questions</p>
    </div>
  );
}

export default function ClassifyPage() {
  const [email,       setEmail]       = useState('');
  const [emailLocked, setEmailLocked] = useState(false);
  const [emailError,  setEmailError]  = useState('');
  const [supplier,    setSupplier]    = useState('');
  const [description, setDescription] = useState('');
  const [result,      setResult]      = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');
  const [limitHit,    setLimitHit]    = useState(false);
  const [usesLeft,    setUsesLeft]    = useState(MAX_USES);
  const resultRef = useRef(null);

  const FREE_DOMAINS = new Set([
    'gmail.com','yahoo.com','hotmail.com','outlook.com','live.com','msn.com',
    'icloud.com','me.com','mac.com','aol.com','protonmail.com','proton.me',
    'ymail.com','mail.com','inbox.com','zoho.com','gmx.com','gmx.net',
    'yandex.com','yandex.ru','tutanota.com','fastmail.com','hey.com',
  ]);

  function validateEmail(e) {
    if (!e || !e.includes('@') || !e.includes('.')) return false;
    const domain = e.split('@')[1]?.toLowerCase();
    if (!domain) return false;
    if (FREE_DOMAINS.has(domain)) return false;
    return true;
  }

  function handleEmailSubmit(e) {
    e.preventDefault();
    if (!validateEmail(email)) {
      const domain = email.split('@')[1]?.toLowerCase();
      const isFree = domain && FREE_DOMAINS.has(domain);
      setEmailError(isFree ? 'Please use your work email, not a personal address.' : 'Please enter a valid work email.');
      return;
    }
    setEmailError('');
    const count = getUsageCount(email);
    if (count >= MAX_USES) { setEmailLocked(true); setLimitHit(true); return; }
    setEmailLocked(true);
    setUsesLeft(MAX_USES - count);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!supplier.trim()) { setError('Please enter a supplier name.'); return; }
    const count = getUsageCount(email);
    if (count >= MAX_USES) { setLimitHit(true); return; }

    setError(''); setResult(null); setLoading(true);
    try {
      const res  = await fetch(apiEndpoint('/api/classify'), {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supplier: supplier.trim(), po_description: description.trim(), invoice_description: '' }),
      });
      const data = await res.json();
      if (data.error && !data.classification) { setError(data.error); }
      else {
        incrementUsage(email);
        const newCount = getUsageCount(email);
        setUsesLeft(MAX_USES - newCount);
        setResult(data);
        if (newCount >= MAX_USES) setLimitHit(true);
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      }
    } catch { setError('Could not reach the server.'); }
    finally   { setLoading(false); }
  }

  function handleReset() { setSupplier(''); setDescription(''); setResult(null); setError(''); }

  return (
    <div className="cp-page">

      {/* Navbar */}
      <header className="navbar">
        <div className="container nav-inner">
          <Link to="/" className="logo-link">
            <img src="/logowebsite.png" alt="Dolphin AI" className="logo-img" />
          </Link>
          <nav className="nav-links">
            <Link to="/#solution">Solution</Link>
            <Link to="/#workflow">Workflow</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/#contact">Contact</Link>
          </nav>
          <div className="nav-actions">
            <Link to="/book-demo" className="btn btn-primary">Book a Demo</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="cp-hero">
        <span className="eyebrow" style={{ marginBottom: '0.5rem' }}>Spend Classifier</span>
        <h1 className="cp-title">Classify any supplier or invoice line</h1>
        <p className="cp-sub">Enter a supplier name and get the exact spend category in seconds.</p>
      </section>

      {/* Tool — two columns */}
      <section className="cp-tool container">
        <div className="cp-cols">

          {/* LEFT — form */}
          <div className="cp-form-col">
            <div className="cp-tool-card">

              {/* Email gate */}
              {!emailLocked ? (
                <form onSubmit={handleEmailSubmit}>
                  <div className="cp-input-group">
                    <label className="cp-label" htmlFor="work-email">
                      Work email <span className="cp-req">*</span>
                    </label>
                    <input
                      id="work-email" type="email" className="cp-input cp-input-lg"
                      value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      autoFocus autoComplete="email"
                    />
                    <p className="cp-email-hint">Required to use the classifier. You get {MAX_USES} free classifications.</p>
                  </div>
                  {emailError && <div className="cp-error"><AlertCircle size={14} /> {emailError}</div>}
                  <button type="submit" className="btn btn-primary cp-btn">
                    <Sparkles size={15} /> Start classifying
                  </button>
                </form>
              ) : limitHit && !result ? (
                <LimitReached email={email} />
              ) : (
                <>
                  <div className="cp-email-badge">
                    <span>✓ {email}</span>
                    <span className="cp-uses-left">{Math.max(0, usesLeft)} classification{usesLeft !== 1 ? 's' : ''} remaining</span>
                  </div>
                  <div className="cp-input-group">
                    <label className="cp-label" htmlFor="supplier">Supplier name <span className="cp-req">*</span></label>
                    <input
                      id="supplier" type="text" className="cp-input cp-input-lg"
                      value={supplier} onChange={e => setSupplier(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSubmit(e)}
                      placeholder="e.g. Fastenal, UPS, Zetwerk…"
                      autoFocus autoComplete="off"
                    />
                  </div>
                  <div className="cp-input-group" style={{ marginTop: '1.25rem' }}>
                    <label className="cp-label" htmlFor="desc">
                      Description <span className="cp-opt">optional</span>
                    </label>
                    <textarea
                      id="desc" rows={3} className="cp-input"
                      value={description} onChange={e => setDescription(e.target.value)}
                      placeholder="e.g. Galvanized steel tubing, powder paint primers, A4 printer paper…"
                    />
                  </div>
                  {error && <div className="cp-error"><AlertCircle size={14} /> {error}</div>}
                  <button className="btn btn-primary cp-btn" onClick={handleSubmit} disabled={loading}>
                    {loading ? <><Loader2 size={16} className="spin" /> Classifying…</> : <><Sparkles size={15} /> Classify</>}
                  </button>
                  <div className="cp-examples">
                    <span className="cp-ex-label">Try:</span>
                    {EXAMPLES.map(s => (
                      <button key={s} className="cp-chip"
                        onClick={() => { setSupplier(s); setDescription(''); setResult(null); setError(''); }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* RIGHT — result */}
          <div className="cp-result-col" ref={resultRef}>
            {limitHit && result ? (
              <LimitReached email={email} />
            ) : !result && !loading ? (
              <div className="cp-placeholder">
                <div className="cp-ph-icon"><Sparkles size={22} /></div>
                <p className="cp-ph-title">Your result will appear here</p>
                <p className="cp-ph-sub">Try "Fastenal" or "Office Depot + printer paper"</p>
              </div>
            ) : loading ? (
              <div className="cp-placeholder">
                <Loader2 size={28} className="spin" style={{ color: 'var(--copper)', opacity: 0.7 }} />
                <p className="cp-ph-title" style={{ marginTop: '1rem' }}>Analysing…</p>
                <p className="cp-ph-sub">Matching against your spend taxonomy</p>
              </div>
            ) : (
              <Result result={result} onReset={handleReset} />
            )}
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-bottom">
          <p>Copyright © 2026 Dolphin AI</p>
          <div><a href="#">Privacy Policy</a><a href="#">Cookie Policy</a></div>
        </div>
      </footer>
    </div>
  );
}
