import Navbar from './Navbar.jsx';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Server, Eye, FileCheck, Users, Check, Clock3 } from 'lucide-react';

const PILLARS = [
  {
    icon: <Lock size={22} />,
    title: 'Encryption in transit & at rest',
    body: 'All data is encrypted in transit using TLS 1.2+ and encrypted at rest using AES-256. This applies to every spend file, API call, and database record — without exception.',
  },
  {
    icon: <Server size={22} />,
    title: 'Enterprise cloud infrastructure',
    body: 'Dolphin AI is hosted on enterprise-grade cloud infrastructure with EU-region data residency, 99.9%+ availability SLA, and automatic backups. Infrastructure details are available upon request.',
  },
  {
    icon: <Eye size={22} />,
    title: 'Your data is never shared',
    body: 'Your spend data is never used to train AI models, benchmarked against other clients, or shared with any third party. Each client\'s data is fully isolated at the storage and processing level.',
  },
  {
    icon: <FileCheck size={22} />,
    title: 'GDPR compliant',
    body: 'We process personal and organizational data in accordance with GDPR. We sign Data Processing Agreements (DPAs) as standard for all enterprise clients and respond to data subject requests within 30 days.',
  },
  {
    icon: <Users size={22} />,
    title: 'Access controls',
    body: 'Role-based access control (RBAC) ensures users only see data relevant to their role. All authentication is logged and monitored. We support SSO integration for enterprise accounts.',
  },
  {
    icon: <ShieldCheck size={22} />,
    title: 'Data retention & deletion',
    body: 'Spend data uploaded for classification is retained for 90 days after project completion, then permanently deleted. You can request immediate deletion at any time. We confirm all deletions in writing.',
  },
];

/*
  Compliance status. "progress" renders as amber and must stay amber until an
  independent auditor has actually issued the report — SOC 2 is an attestation,
  not a certification, so there is nothing to claim before that date.
*/
const COMPLIANCE = [
  {
    name: 'SOC 2 Type II',
    state: 'progress',
    stateLabel: 'In preparation',
    body: 'We are implementing and documenting the controls a SOC 2 Type II examination requires — access management, change control, logging and monitoring, incident response, and vendor review. The examination is performed by an independent auditor and has not been completed, so there is no report to share yet. We will publish the date it is issued.',
  },
  {
    name: 'GDPR',
    state: 'live',
    stateLabel: 'In place',
    body: 'Personal and organizational data is processed in accordance with GDPR. We sign DPAs as standard for enterprise clients and answer data subject requests within 30 days.',
  },
  {
    name: 'NDA & DPA',
    state: 'live',
    stateLabel: 'Signed as standard',
    body: 'Mutual NDA before any data changes hands or any demo touches real spend data, and a standard Data Processing Agreement for every paid client, with addendums where your compliance team needs them.',
  },
  {
    name: 'Security review',
    state: 'live',
    stateLabel: 'Available on request',
    body: 'We complete standard vendor security questionnaires and provide a written security summary covering our architecture, data flows, subprocessors and controls — enough for your IT security team to assess us before the SOC 2 report exists.',
  },
];

const FAQS = [
  {
    q: 'What is your SOC 2 status?',
    a: 'Our SOC 2 Type II program is underway. The controls such an examination covers — access management, change control, logging and monitoring, incident response and vendor review — are being implemented and documented as part of it, and the examination itself is performed by an independent CPA firm over a defined observation period. If your procurement process needs documentation before that period closes, we share our control documentation, complete your vendor security questionnaire, and walk your security team through exactly where we are.',
  },
  {
    q: 'Do you sign NDAs?',
    a: 'Yes. We sign mutual NDAs as standard before any data is shared or any demo involving real spend data is conducted.',
  },
  {
    q: 'Do you sign Data Processing Agreements (DPAs)?',
    a: 'Yes. We provide a standard DPA for all paid clients. Enterprise clients can request addendums to cover specific compliance requirements.',
  },
  {
    q: 'Where is our data stored?',
    a: 'Data is stored in EU-region data centers with geographic redundancy. We can discuss specific region and data residency requirements for enterprise contracts.',
  },
  {
    q: 'Can we request a security review or questionnaire?',
    a: 'Yes. We complete standard vendor security questionnaires and can provide a security summary document for your organization or IT security team on request.',
  },
  {
    q: 'What happens to our data when we cancel?',
    a: 'You can export all your data at any time. On cancellation, your data is retained for 30 days for recovery purposes, then permanently deleted from all systems.',
  },
];

export default function SecurityPage() {
  return (
    <div className="site">
      <Navbar />

      <main>

        {/* Hero */}
        <section className="sec-hero">
          <div className="container sec-hero-inner">
            <span className="eyebrow">Security & Trust</span>
            <h1>Your spend data is safe with us</h1>
            <p>
              Enterprise organization data is sensitive. We built Dolphin AI with security as a
              first principle — not an afterthought.
            </p>
          </div>
        </section>

        {/* Pillars */}
        <section className="sec-pillars container">
          <div className="sec-pillars-grid">
            {PILLARS.map(p => (
              <div className="sec-pillar-card" key={p.title}>
                <div className="sec-pillar-icon">{p.icon}</div>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Compliance status */}
        <section className="sec-comp">
          <div className="container">
            <div className="section-head centered">
              <span className="eyebrow">Compliance</span>
              <h2>Where we stand today</h2>
              <div className="section-rule" />
              <p className="sec-comp-sub">
                No badges we have not earned. Here is the honest status of every
                framework a security team asks us about.
              </p>
            </div>

            <div className="sec-comp-grid">
              {COMPLIANCE.map(c => (
                <div className={`sec-comp-card is-${c.state}`} key={c.name}>
                  <div className="sec-comp-head">
                    <h3>{c.name}</h3>
                    <span className={`sec-comp-chip is-${c.state}`}>
                      {c.state === 'live' ? <Check size={13} /> : <Clock3 size={13} />}
                      {c.stateLabel}
                    </span>
                  </div>
                  <p>{c.body}</p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* Trust bar */}
        <section className="sec-trust">
          <div className="container sec-trust-inner">
            {[
              { label: 'TLS 1.2+',     sub: 'Encryption in transit' },
              { label: 'AES-256',      sub: 'Encryption at rest' },
              { label: 'EU Cloud',     sub: 'EU-region cloud storage' },
              { label: 'GDPR',         sub: 'Compliant by design' },
              { label: 'SOC 2',        sub: 'Type II in preparation' },
              { label: 'DPA',          sub: 'Signed as standard' },
              { label: '90 days',      sub: 'Max data retention' },
            ].map(t => (
              <div className="sec-trust-item" key={t.label}>
                <strong>{t.label}</strong>
                <span>{t.sub}</span>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="sec-faq container">
          <div className="section-head centered">
            <span className="eyebrow">Security FAQ</span>
            <h2>Common questions from security & IT teams</h2>
            <div className="section-rule" />
          </div>
          <div className="sec-faq-list">
            {FAQS.map(f => (
              <div className="sec-faq-item" key={f.q}>
                <h4>{f.q}</h4>
                <p>{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="sec-cta">
          <div className="container sec-cta-inner">
            <h2>Have specific security requirements?</h2>
            <p>We're happy to complete your vendor security questionnaire, provide documentation, or arrange a technical security review.</p>
            <Link to="/book-demo" className="btn btn-primary btn-lg">Talk to our team</Link>
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
