import Navbar from './Navbar.jsx';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';


const VALUES = [
  {
    title: 'Data integrity first',
    text: 'We believe every organization decision should be grounded in clean, trusted data. We never cut corners on classification accuracy.',
  },
  {
    title: 'Built for practitioners',
    text: 'We build for the people who actually work with spend data — category managers, finance analysts, and organization leads — not just executives.',
  },
  {
    title: 'Transparent by design',
    text: 'Every classification comes with an explanation. No black boxes. Our clients always understand why a decision was made.',
  },
  {
    title: 'Client data stays client data',
    text: 'Your spend data is yours. We process it to deliver the service and nothing more. We never use client data to train models or share it with third parties.',
  },
];

export default function AboutPage() {
  return (
    <div className="site">
      <Navbar />

      <main>

        {/* Hero */}
        <section className="about-hero">
          <div className="container about-hero-inner">
            <span className="eyebrow">About us</span>
            <h1>We fix the data problem that holds organization back</h1>
            <p>
              Dolphin AI was built by organization practitioners who got tired of seeing multi-million dollar
              sourcing decisions made on unreliable, unclassified spend data. We built the platform
              we always wished existed.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="about-story container">
          <div className="about-story-grid">
            <div>
              <span className="eyebrow">Our story</span>
              <h2>The problem we kept seeing</h2>
              <div className="section-rule" style={{ margin: '1rem 0 1.25rem' }} />
              <p>
                In organization transformation after transformation, the same problem appeared at the start
                of every engagement: the spend data was a mess. Supplier names duplicated dozens of times,
                transactions mapped to the wrong categories, descriptions copied from outdated ERP fields.
              </p>
              <p style={{ marginTop: '1rem' }}>
                Teams were spending weeks manually cleaning Excel files before they could even start analysis.
                And after all that effort, the data still wasn't trustworthy enough for confident strategic decisions.
              </p>
              <p style={{ marginTop: '1rem' }}>
                Dolphin AI was founded to automate exactly that work — giving organization and finance teams
                clean, classified, normalized spend data from day one, so they can spend their time on strategy
                instead of spreadsheets.
              </p>
            </div>
            <div className="about-stat-stack">
              {[
                { value: '95%+', label: 'Classification accuracy' },
                { value: '80%',  label: 'Less time on data cleaning' },
                { value: '4×',   label: 'Faster category analysis' },
                { value: '360°', label: 'Supplier visibility' },
              ].map(s => (
                <div className="about-stat" key={s.label}>
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="about-values">
          <div className="container">
            <div className="section-head centered">
              <span className="eyebrow">What we stand for</span>
              <h2>Our values</h2>
              <div className="section-rule" />
            </div>
            <div className="about-values-grid">
              {VALUES.map(v => (
                <div className="about-value-card" key={v.title}>
                  <h3>{v.title}</h3>
                  <p>{v.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="about-team container">
          <div className="section-head centered">
            <span className="eyebrow">The team</span>
            <h2>Built by people who've lived the problem</h2>
            <div className="section-rule" />
          </div>
          <div className="about-team-banner">
            <p className="about-team-lead">
              The Dolphin AI team brings together <strong>over 20 years of combined experience</strong> across
              enterprise organization, AI engineering, and financial data systems.
            </p>
            <p className="about-team-sub">
              Our founders have worked directly inside the organization and finance functions of large organizations —
              building reports manually, wrestling with ERP exports, and spending weeks cleaning data before any
              analysis could begin. That lived frustration is exactly what Dolphin AI was built to solve.
            </p>
            <div className="about-team-stats">
              <div className="about-team-stat">
                <strong>20+</strong>
                <span>Years of combined experience</span>
              </div>
              <div className="about-team-stat">
                <strong>3</strong>
                <span>Industries: organization, AI, finance</span>
              </div>
              <div className="about-team-stat">
                <strong>$10B+</strong>
                <span>Spend data processed and analyzed</span>
              </div>
              <div className="about-team-stat">
                <strong>100%</strong>
                <span>Focused on organization intelligence</span>
              </div>
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="about-location container">
          <div className="about-location-card">
            <div>
              <h3>Headquartered in Irving, Texas</h3>
              <p>Dolphin AI LLC · 7301 N Highway 161, #148 · Irving, TX 75039</p>
              <p style={{ marginTop: '0.5rem' }}>
                Serving organization and finance teams globally, with a focus on North American
                and North American mid-market and enterprise organizations.
              </p>
            </div>
            <Link to="/book-demo" className="btn btn-primary">
              Talk to us <ArrowRight size={15} />
            </Link>
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
