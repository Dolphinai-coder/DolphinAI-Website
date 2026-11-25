import Navbar from './Navbar.jsx';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Server, Eye, Users, KeyRound, Check, Clock3 } from 'lucide-react';

const PILLARS = [
  {
    icon: <Lock size={22} />,
    title: 'Encryption in transit & at rest',
    body: 'All data is encrypted in transit using TLS 1.2+ and encrypted at rest using AES-256. This applies to every spend file, API call, and database record — without exception.',
  },
  {
    icon: <Server size={22} />,
    title: 'Hosted on Microsoft Azure',
    body: 'Our platform runs on Microsoft Azure, whose data centers hold SOC 2, ISO 27001 and other certifications. Infrastructure details, including the specific regions serving your account, are available on request.',
  },
  {
    icon: <Eye size={22} />,
    title: 'Your data and AI',
    body: 'Your data is used only to deliver the service to you. It is never used to train shared AI models, benchmarked against other clients, or sold to third parties.',
  },
  {
    icon: <Users size={22} />,
    title: 'Data separation',
    body: 'Each customer\'s data is logically isolated from every other customer\'s, at the storage and the processing level.',
  },
  {
    icon: <KeyRound size={22} />,
    title: 'Access control',
    body: 'Access to production systems requires multi-factor authentication and is limited to authorized staff on a least-privilege basis. Within the product, role-based access control means users only see data relevant to their role, and all authentication is logged. SSO is supported for enterprise accounts.',
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
    name: 'SOC 2',
    state: 'progress',
    stateLabel: 'First report expected Q2 2027',
    body: 'We are actively preparing for a SOC 2 audit covering the Security and Confidentiality Trust Services Criteria, and expect our first report in Q2 2027. The audit is performed by an independent firm, so until that report is issued we will share our control documentation and complete your vendor security questionnaire instead.',
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
    a: 'We are actively preparing for a SOC 2 audit covering the Security and Confidentiality Trust Services Criteria, and expect our first report in Q2 2027. The audit is carried out by an independent firm over a defined observation period, so the report follows that period rather than being something a vendor issues itself. If your procurement process needs documentation before then, we share our control documentation, complete your vendor security questionnaire, and walk your security team through exactly where we are.',
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
    a: 'Your data is stored on Microsoft Azure, currently in US regions. Azure data centers hold SOC 2, ISO 27001 and other certifications. We can confirm the specific region serving your account and discuss data residency requirements for enterprise contracts.',
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
            <h1>Security at Dolphin AI</h1>
            <p>
              Your spend data is confidential business information, and we protect it
              that way.
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
              { label: 'Azure',        sub: 'SOC 2 & ISO 27001 data centers' },
              { label: 'GDPR',         sub: 'Compliant by design' },
              { label: 'SOC 2',        sub: 'First report expected Q2 2027' },
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
            <h2>Questions, or a security report?</h2>
            <p>
              Contact <a href="mailto:security@dolphinaipro.com">security@dolphinaipro.com</a>.
              Security documentation is available to customers and prospects on request, and
              we are happy to complete your vendor security questionnaire or arrange a
              technical security review.
            </p>
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
