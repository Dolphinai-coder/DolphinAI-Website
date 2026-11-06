import Navbar from './Navbar.jsx';
import useSEO from './useSEO.js';
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Calendar, Clock, Users } from 'lucide-react';

const API_URL       = import.meta.env.VITE_API_URL || 'https://dolphinai-api-c2a8ezgdctakh9g0.centralus-01.azurewebsites.net';
const COMPANY_SIZES = ['1–50', '51–200', '201–500', '501–2,000', '2,000–10,000', '10,000+'];
const SPEND_RANGES  = ['Under $5M', '$5M–$25M', '$25M–$100M', '$100M–$500M', 'Over $500M'];
const ROLES         = ['CPO / Head of Organization', 'Organization Manager', 'Finance / CFO', 'Data / Analytics', 'IT', 'Other'];

const PERSONAL_DOMAINS = new Set([
  'gmail.com','yahoo.com','hotmail.com','outlook.com','live.com','msn.com',
  'aol.com','icloud.com','me.com','mac.com','protonmail.com','proton.me',
  'ymail.com','mail.com','zoho.com','inbox.com','gmx.com','gmx.net',
  'fastmail.com','fastmail.fm','tutanota.com','hey.com','pm.me',
]);

function isPersonalEmail(email) {
  const domain = email.split('@')[1]?.toLowerCase();
  return domain ? PERSONAL_DOMAINS.has(domain) : false;
}

export default function BookDemoPage() {
  useSEO({ title: 'Book a Demo — See Dolphin AI in Action', description: 'Schedule a personalized demo of Dolphin AI spend intelligence. See how we classify spend, normalize suppliers, and surface savings in your supply chain data.' });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('return');

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', company: '',
    role: '', companySize: '', annualSpend: '', message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [emailError, setEmailError] = useState('');

  function set(field) {
    return e => {
      const value = e.target.value;
      setForm(f => ({ ...f, [field]: value }));
      if (field === 'email') {
        setEmailError(value && isPersonalEmail(value) ? 'Please use your work email address.' : '');
      }
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.company) {
      setError('Please fill in all required fields.'); return;
    }
    if (isPersonalEmail(form.email)) {
      setEmailError('Please use your work email address.'); return;
    }
    setError('');
    setLoading(true);
    try {
      const res  = await fetch(`${API_URL}/api/book-demo`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setLoading(false);
      } else {
        localStorage.setItem('demo_booked', 'true');
        if (returnTo) {
          navigate(returnTo);
        } else {
          setSubmitted(true);
        }
      }
    } catch {
      setError('Cannot reach the server. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      {/* Navbar */}
      <Navbar />

      <main className="demo-main">
        <div className="demo-layout container">

          {/* ── Left: info panel ── */}
          <div className="demo-info">
            <span className="eyebrow">Book a Demo</span>
            <h1 className="demo-title">See Dolphin AI in action</h1>
            <p className="demo-sub">
              We'll show you how Dolphin AI cleans, normalizes, and classifies your
              spend data — and estimate the savings potential for your specific data.
            </p>

            <div className="demo-perks">
              {[
                { icon: <Clock size={18} />,    text: 'Live walkthrough' },
                { icon: <Users size={18} />,    text: 'Tailored to your organization setup' },
                { icon: <Calendar size={18} />, text: 'Pick a time that works for you' },
                { icon: <CheckCircle2 size={18} />, text: 'No commitment required' },
              ].map(({ icon, text }) => (
                <div className="demo-perk" key={text}>
                  <span className="perk-icon">{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>

            <div className="demo-quote">
              <p>"Dolphin AI cut our data cleaning time by 80% and gave us confidence in our spend reports for the first time."</p>
              <span>— Head of Organization, $2B manufacturing group</span>
            </div>
          </div>

          {/* ── Right: form or success ── */}
          <div className="demo-form-wrap">
            {submitted ? (
              <div className="demo-success">
                <div className="success-icon"><CheckCircle2 size={40} /></div>
                <h2>Request received!</h2>
                <p>Thanks, <strong>{form.firstName}</strong>. We've sent a confirmation to <strong>{form.email}</strong>, and someone from our team will reach out to you shortly.</p>
                <p style={{ color: 'var(--gray-400)', fontSize: '13.5px' }}>
                  While you wait, explore how the classifier works.
                </p>
                <Link to="/demo-video" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                  Try the classifier <ArrowRight size={15} />
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="demo-form">
                <h2 className="form-heading">Tell us about yourself</h2>

                {/* Name row */}
                <div className="signup-row">
                  <div className="login-field">
                    <label>First name <span className="req">*</span></label>
                    <input type="text" value={form.firstName} onChange={set('firstName')} placeholder="Jane" autoFocus />
                  </div>
                  <div className="login-field">
                    <label>Last name <span className="req">*</span></label>
                    <input type="text" value={form.lastName} onChange={set('lastName')} placeholder="Smith" />
                  </div>
                </div>

                <div className="login-field">
                  <label>Work email <span className="req">*</span></label>
                  <input type="email" value={form.email} onChange={set('email')} placeholder="you@company.com"
                    onBlur={() => { if (form.email && isPersonalEmail(form.email)) setEmailError('Please use your work email address.'); }}
                    style={emailError ? { borderColor: '#dc2626' } : {}}
                  />
                  {emailError && <span style={{ color: '#dc2626', fontSize: '12.5px', marginTop: '4px', display: 'block' }}>{emailError}</span>}
                </div>

                <div className="login-field">
                  <label>Company <span className="req">*</span></label>
                  <input type="text" value={form.company} onChange={set('company')} placeholder="Acme Corp" />
                </div>

                <div className="signup-row">
                  <div className="login-field">
                    <label>Your role</label>
                    <select value={form.role} onChange={set('role')}>
                      <option value="">Select…</option>
                      {ROLES.map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="login-field">
                    <label>Number of employees</label>
                    <select value={form.companySize} onChange={set('companySize')}>
                      <option value="">Select…</option>
                      {COMPANY_SIZES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="login-field">
                  <label>Annual addressable spend</label>
                  <select value={form.annualSpend} onChange={set('annualSpend')}>
                    <option value="">Select…</option>
                    {SPEND_RANGES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>

                <div className="login-field">
                  <label>What are you trying to solve? <span className="optional">(optional)</span></label>
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={set('message')}
                    placeholder="e.g. We have messy supplier data across 3 ERP systems and can't trust our category reports…"
                  />
                </div>

                {error && <div className="login-error">{error}</div>}

                <button type="submit" className="btn btn-primary btn-full" disabled={loading || !!emailError}>
                  {loading ? 'Sending…' : <>Book my demo <ArrowRight size={16} /></>}
                </button>

                <p className="signup-terms" style={{ marginTop: '0.75rem' }}>
                  We'll never share your data. <Link to="/privacy">Privacy Policy</Link>.
                </p>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
