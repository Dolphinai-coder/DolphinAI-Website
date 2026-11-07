import Navbar from './Navbar.jsx';
import useSEO from './useSEO.js';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, Phone, MapPin, MessageSquare, BarChart3, Handshake } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://dolphinai-api-c2a8ezgdctakh9g0.centralus-01.azurewebsites.net';

const REASONS = [
  {
    icon: <BarChart3 size={22} />,
    title: 'Talk to Dolphin AI Team',
    desc: 'Get a personalized walkthrough of how Dolphin AI fits your organization stack.',
    cta: 'Book a Demo',
    href: '/book-demo',
  },
  {
    icon: <MessageSquare size={22} />,
    title: 'General Enquiries',
    desc: 'Questions about our platform, pricing, or data approach? We\'re happy to help.',
    cta: 'Send a message',
    href: '#contact-form',
  },
  {
    icon: <Handshake size={22} />,
    title: 'Connect Your Systems',
    desc: 'Want to connect Dolphin AI with your ERP, P2P platform, or data warehouse? Let\'s make it happen.',
    cta: 'Get in touch',
    href: '#contact-form',
  },
];

const SPEND_RANGES = [
  'Under $100M', '$100M – $500M', '$500M – $1B', '$1B – $5B', 'Over $5B',
];

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

export default function ContactPage() {
  useSEO({ title: 'Contact Us — Dolphin AI', description: 'Get in touch with the Dolphin AI team. Talk to a spend intelligence expert about your supply chain data challenges.' });
  const [form, setForm]         = useState({ name: '', company: '', email: '', spend: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState('');

  function handle(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (name === 'email') {
      if (value && isPersonalEmail(value)) {
        setEmailError('Please use your work email address.');
      } else {
        setEmailError('');
      }
    }
  }

  function handleEmailBlur() {
    if (form.email && isPersonalEmail(form.email)) {
      setEmailError('Please use your work email address.');
    }
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.email || isPersonalEmail(form.email)) {
      setEmailError('Please use your work email address.');
      return;
    }
    try {
      await fetch(`${API_URL}/api/contact`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } catch (_) {}
    setSubmitted(true);
  }

  const emailInvalid = !!form.email && isPersonalEmail(form.email);

  return (
    <div className="site">
      <Navbar />

      <main>

        {/* Hero */}
        <section className="contact-hero">
          <div className="container contact-hero-inner">
            <span className="eyebrow">Contact us</span>
            <h1>Let's talk spend intelligence</h1>
            <p>Whether you're evaluating Dolphin AI, already a customer, or just curious — we'd love to hear from you and help you get the most out of your spend data.</p>
          </div>
        </section>

        {/* Contact cards */}
        <section className="contact-cards-section container">
          <div className="contact-cards-grid">
            {REASONS.map(r => (
              <div className="contact-card" key={r.title}>
                <div className="contact-card-icon">{r.icon}</div>
                <h3>{r.title}</h3>
                <p>{r.desc}</p>
                <a href={r.href} className="contact-card-link">
                  {r.cta} <ArrowRight size={14} />
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Form + Info */}
        <section className="contact-body container" id="contact-form">
          <div className="contact-body-grid">

            {/* Form */}
            <div className="contact-form-wrap">
              <h2>Send us a message</h2>
              <p className="contact-form-sub">Fill in the form and a member of our team will be in touch shortly.</p>

              {submitted ? (
                <div className="contact-success">
                  <span className="contact-success-icon">✓</span>
                  <h3>Message received!</h3>
                  <p>We'll get back to you within one business day.</p>
                  <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                    Back to home
                  </Link>
                </div>
              ) : (
                <form className="contact-form" onSubmit={submit}>
                  <div className="cf-row">
                    <div className="cf-field">
                      <label>Full name *</label>
                      <input name="name" value={form.name} onChange={handle} required placeholder="Jane Smith" />
                    </div>
                    <div className="cf-field">
                      <label>Company *</label>
                      <input name="company" value={form.company} onChange={handle} required placeholder="Acme Corp" />
                    </div>
                  </div>
                  <div className="cf-field">
                    <label>Work email *</label>
                    <input
                      name="email" type="email" value={form.email}
                      onChange={handle} onBlur={handleEmailBlur}
                      required placeholder="jane@acme.com"
                      style={emailError ? { borderColor: '#dc2626' } : {}}
                    />
                    {emailError && (
                      <span style={{ color: '#dc2626', fontSize: '12.5px', marginTop: '4px', display: 'block' }}>
                        {emailError}
                      </span>
                    )}
                  </div>
                  <div className="cf-field">
                    <label>Annual spend under management</label>
                    <select name="spend" value={form.spend} onChange={handle}>
                      <option value="">Select a range</option>
                      {SPEND_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="cf-field">
                    <label>Message *</label>
                    <textarea name="message" value={form.message} onChange={handle} required rows={5} placeholder="Tell us about your organization data challenge..." />
                  </div>
                  <button type="submit" className="btn btn-primary btn-full" disabled={emailInvalid}>
                    Send message <ArrowRight size={15} />
                  </button>
                </form>
              )}
            </div>

            {/* Info sidebar */}
            <div className="contact-info">
              <div className="contact-info-card">
                <h3>Contact information</h3>
                <div className="contact-info-list">
                  <div className="contact-info-item">
                    <div className="contact-info-icon"><Phone size={16} /></div>
                    <div>
                      <strong>Phone</strong>
                      <a href="tel:+19728120398">+1 972 812 0398</a>
                    </div>
                  </div>
                  <div className="contact-info-item">
                    <div className="contact-info-icon"><Mail size={16} /></div>
                    <div>
                      <strong>Email</strong>
                      <a href="mailto:sales@dolphinaipro.com">sales@dolphinaipro.com</a>
                    </div>
                  </div>
                  <div className="contact-info-item">
                    <div className="contact-info-icon"><MapPin size={16} /></div>
                    <div>
                      <strong>Office</strong>
                      <span>7301 N Highway 161, #148<br />Irving, TX 75039</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="contact-info-card contact-demo-card">
                <h3>Prefer to see it first?</h3>
                <p>Book a live demo and see how Dolphin AI handles your real spend data.</p>
                <Link to="/book-demo" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Book a Demo <ArrowRight size={15} />
                </Link>
              </div>

              <div className="contact-info-card">
                <h3>What happens next?</h3>
                <div className="contact-sla-list">
                  <div className="contact-sla-item">
                    <span className="contact-sla-dot orange" />
                    <div><strong>We review your message</strong><span>Our team reads every enquiry carefully</span></div>
                  </div>
                  <div className="contact-sla-item">
                    <span className="contact-sla-dot orange" />
                    <div><strong>We reach out directly</strong><span>A member of the team contacts you personally</span></div>
                  </div>
                  <div className="contact-sla-item">
                    <span className="contact-sla-dot orange" />
                    <div><strong>We get you set up</strong><span>Tailored onboarding to your spend data</span></div>
                  </div>
                </div>
              </div>
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
    </div>
  );
}
